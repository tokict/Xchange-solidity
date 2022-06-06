//SPDX-License-Identifier: WTFPL
pragma solidity ^0.8.9;

import "../node_modules/hardhat/console.sol";
import "./Types.sol";
import "./Helpers.sol";

contract Controller is Helpers {
    // askFee is applied to every submitted ASK as tax
    Fee[] public askFees;
    // bidFee is applied to every submitted BID as tax
    Fee[] public bidFees;
    //margin fee required to make a bid
    MarginFee[] public marginFees;
    // PERIODS are time slots in which asks and bids can be submitted. After it expires, we make results public and open another round.
    // Yes, I know its all public anyway.

    //How many periods before trading starts
    uint8 public numberOfPeriodsPerDay;
    // How long should each period last
    uint8 public periodDurationInMinutes;

    // What hour of the day to start period
    uint8 public periodsStartHour;
    // What minute in that hour to start the period
    uint8 public periodsStartMinute;

    uint16 public lastPeriodId;

    // Treasury wallet is to keep collected fees and generally, profit.
    // We don't want to keep ANY funds in the contract in case of hack of my screwup
    address payable internal treasuryWallet;
    // We keep our clients money in a separate escrow wallet. To send money to sellers, we call a function on contract and the contract proxies it
    address payable internal escrowWallet;

    //Array or enabled resources to trade
    Resource[] internal resources;

    // Resource asks from sellers
    mapping(uint16 => ResourceAsk[]) public resourceAsks;

    // Resource bids from buyers
    mapping(uint16 => ResourceBid[]) internal resourceBids;

    // Incoming payments from buyers
    mapping(uint16 => IncomingTradePayment[]) internal incomingTradePayments;

    // Price calculations. The key is a composite made of {periodId}_{resourceId}
    mapping(bytes32 => uint256) public priceCalculations;

    // Outgoing payments to sellers
    OutgoingPayment[] internal outgoingPayments;

    // allowed sellers
    address[] internal sellers;

    // allowed buyers
    address[] internal buyers;

    // owner
    address private owner;

    constructor(ConstructorParams memory params) {
        console.log("Deploying Controller");
        require(params.bidFees.length > 0, "No bid fee provided");
        require(params.askFees.length > 0, "No ask fee provided");
        require(params.marginFees.length > 0, "No margin fee provided");
        numberOfPeriodsPerDay = params.numberOfPeriodsPerDay;
        periodDurationInMinutes = params.periodDurationInMinutes;
        periodsStartHour = params.periodsStartHour;
        periodsStartMinute = params.periodsStartMinute;
        treasuryWallet = params.treasuryWallet;
        escrowWallet = params.escrowWallet;
        lastPeriodId = 0;

        // Transfer from array to mapping
        for (uint256 i = 0; i < params.buyers.length; i++) {
            buyers.push(params.buyers[i]);
        }
        for (uint256 i = 0; i < params.sellers.length; i++) {
            sellers.push(params.sellers[i]);
        }

        for (uint256 i = 0; i < params.resources.length; i++) {
            resources.push(params.resources[i]);
        }

        for (uint256 i = 0; i < params.askFees.length; i++) {
            askFees.push(params.askFees[i]);
        }

        for (uint256 i = 0; i < params.bidFees.length; i++) {
            bidFees.push(params.bidFees[i]);
        }

        for (uint256 i = 0; i < params.marginFees.length; i++) {
            marginFees.push(params.marginFees[i]);
        }

        owner = msg.sender;
    }

    /**
     * @dev Throws if called by any account other than the owner.
     */
    modifier onlyOwner() {
        require(owner == msg.sender, "Ownable: caller is not the owner");
        _;
    }

    /**
     * @dev Throws if called by any account other than the seller.
     */
    modifier onlySeller() {
        require(owner == msg.sender, "Seller: caller is not a seller");
        _;
    }

    /**
     * @dev Throws if called by any account other than the buyer.
     */
    modifier onlyBuyer() {
        require(owner == msg.sender, "Buyer: caller is not a buyer");
        _;
    }

    /**
     * @dev Throws if called by any account other than the escrow.
     */
    modifier onlyEscrow() {
        require(owner == msg.sender, "Escrow: caller is not escrow");
        _;
    }

    function setOwner(address newOwner) external onlyOwner {
        owner = newOwner;
    }

    function getResources()
        external
        view
        onlyOwner
        returns (Resource[] memory)
    {
        return resources;
    }

    function setEscrow(address payable newEscrow) external onlyOwner {
        escrowWallet = newEscrow;
    }

    function setTreasury(address payable newTreasury) external onlyOwner {
        treasuryWallet = newTreasury;
    }

    function addBuyer(address buyer) external onlyOwner {
        // If the buyer is not there or is there but is disabled, enable or add it
        (bool found, uint256 index) = arrayFindAddressIndex(buyer, buyers);
        if (!found) {
            buyers.push(buyer);
        } else {
            revert("Buyer already allowed!");
        }
    }

    function removeBuyer(address buyer) external onlyOwner {
        (bool found, uint256 index) = arrayFindAddressIndex(buyer, buyers);
        if (found) {
            buyers[index] = buyers[buyers.length - 1];
            buyers.pop();
        } else {
            revert("Buyer disabled or absent");
        }
    }

    function getBuyers() external view onlyOwner returns (address[] memory) {
        return buyers;
    }

    function addSeller(address seller) external onlyOwner {
        // If the seller is not there or is there but is disabled, enable or add it
        (bool found, uint256 index) = arrayFindAddressIndex(seller, sellers);
        if (!found) {
            sellers.push(seller);
        } else {
            revert("Seller already allowed");
        }
    }

    function removeSeller(address seller) external onlyOwner {
        (bool found, uint256 index) = arrayFindAddressIndex(seller, sellers);
        if (found) {
            sellers[index] = sellers[sellers.length - 1];
            sellers.pop();
        } else {
            revert("Buyer already disabled or absent");
        }
    }

    function getSellers() external view onlyOwner returns (address[] memory) {
        return sellers;
    }

    /**
     *We default to 0 index fee as the default one
     */
    function pickFees(bool isAsk) public view returns (Fee[] memory) {
        Fee[] memory returnArr = new Fee[](1);

        returnArr[0] = isAsk ? askFees[0] : bidFees[0];
        return returnArr;
    }

    /**  The seller submits asks here.
     * Must be within period
     */
    function submitAsk(
        uint16 resourceId,
        uint16 units,
        uint16 purity,
        uint256 askPPU
    ) external payable {
        require(purity < 1000, "Invalid purity");
        require(units > 0, "Invalid units");
        require(askPPU > 0, "Invalid ask PPU");

        require(
            resourceId >= 0 && resourceId < resources.length,
            "Invalid resource"
        );
        ResourceAsk memory ask = ResourceAsk({
            id: 1,
            resourceId: resourceId,
            asker: msg.sender,
            units: units,
            purity: purity,
            askPPU: askPPU,
            appliedFeeIds: new uint16[](1)
        });
        Fee[] memory pickedFees = pickFees(true);

        for (uint16 index = 0; index < pickedFees.length; index++) {
            ask.appliedFeeIds[index] = pickedFees[index].id;
        }

        uint256 feeAmount = 0;
        for (uint8 i = 0; i < pickedFees.length; i++) {
            feeAmount = feeAmount + pickedFees[i].amount;

            feeAmount =
                feeAmount +
                calculatePercentage(
                    ask.askPPU * ask.units,
                    pickedFees[i].percentage
                );
        }

        require(msg.value >= feeAmount, "Not enough ETH sent for fees");
        if (feeAmount > 0) {
            sendToTreasury(feeAmount); // Breaks if failed
        }
        resourceAsks[0].push(ask);
    }

    function getAsks(uint16 periodId)
        public
        view
        returns (ResourceAsk[] memory)
    {
        ResourceAsk[] memory asks = resourceAsks[periodId];
        return asks;
    }

    /**
     *We default to 0 index fee as the default one
     */
    function pickMarginFee(uint16 resourceId, uint256 amount)
        public
        view
        returns (MarginFee memory)
    {
        MarginFee memory returnArr = marginFees[0];

        return returnArr;
    }

    /**  The buyer submits bids here.
     * Must be within period
     */
    function submitBid(
        uint16 resourceId,
        uint16 units,
        uint16 purity,
        uint256 bidPPU
    ) external payable {
        require(purity < 1000, "Invalid purity");
        require(units > 0, "Invalid units");
        require(bidPPU > 0, "Invalid ask PPU");
        require(
            resourceId >= 0 && resourceId < resources.length,
            "Invalid resource"
        );
        ResourceBid memory bid = ResourceBid({
            id: 1,
            resourceId: resourceId,
            bidder: msg.sender,
            units: units,
            purity: purity,
            bidPPU: bidPPU,
            appliedFeeIds: new uint16[](1),
            marginFeeId: 0
        });

        Fee[] memory pickedFees = pickFees(true);
        uint16[] memory appliedFees = new uint16[](1);
        for (uint16 index = 0; index < pickedFees.length; index++) {
            bid.appliedFeeIds[index] = pickedFees[index].id;
        }

        uint256 feeAmount = 0;
        MarginFee memory marginFee = pickMarginFee(bid.id, bid.bidPPU);
        bid.marginFeeId = marginFee.id;
        uint256 marginAmount = calculatePercentage(
            bid.bidPPU * bid.units,
            marginFee.percentage
        );
        for (uint8 i = 0; i < bid.appliedFeeIds.length; i++) {
            feeAmount = feeAmount + pickedFees[i].amount;
            feeAmount =
                feeAmount +
                calculatePercentage(
                    bid.bidPPU * bid.units,
                    pickedFees[i].percentage
                );
        }

        // We now have all fees calculated. Lets see if there is enough money and transfer it to treasury
        require(
            msg.value >= feeAmount + marginAmount,
            "Not enough ETH sent for fees"
        );

        if (feeAmount > 0) {
            sendToTreasury(feeAmount); // Breaks if failed
            sendToEscrow(marginAmount); // Breaks if failed
        }
        resourceBids[0].push(bid);
    }

    function getBids(uint16 periodId)
        public
        view
        returns (ResourceBid[] memory)
    {
        ResourceBid[] memory bids = resourceBids[periodId];
        return bids;
    }

    /** Calculate average price for all resources in period */
    function calculatePrice() public {
        // Array index corresponds to resource id
        uint256[] memory averageResourceAskPPU = new uint256[](
            resources.length
        );
        uint256[] memory averageResourceBidPPU = new uint256[](
            resources.length
        );
        uint16[] memory resourceNrAsks = new uint16[](resources.length);
        uint16[] memory resourceNrBids = new uint16[](resources.length);

        // Sum and count ASKS
        for (
            uint16 index = 0;
            index < resourceAsks[lastPeriodId].length;
            index++
        ) {
            uint16 id = resourceAsks[lastPeriodId][index].resourceId;

            averageResourceAskPPU[id] =
                averageResourceAskPPU[id] +
                resourceAsks[lastPeriodId][index].askPPU;
            resourceNrAsks[id] = resourceNrAsks[id] + 1;
        }

        // Sum and count BIDS
        for (
            uint16 index2 = 0;
            index2 < resourceBids[lastPeriodId].length;
            index2++
        ) {
            uint16 id = resourceBids[lastPeriodId][index2].resourceId;
            averageResourceBidPPU[id] =
                averageResourceBidPPU[id] +
                resourceBids[lastPeriodId][index2].bidPPU;
            resourceNrBids[id] = resourceNrBids[id] + 1;
        }

        //Calculate prices and save ASKS
        for (
            uint256 index3 = 0;
            index3 < averageResourceAskPPU.length;
            index3++
        ) {
            uint256 sum = averageResourceAskPPU[index3];
            uint16 nrOfAsks = resourceNrAsks[index3];

            averageResourceAskPPU[index3] = sum / nrOfAsks;
        }

        // Calculate prices and save BIDS
        for (
            uint16 index5 = 0;
            index5 < averageResourceBidPPU.length;
            index5++
        ) {
            uint256 sum = averageResourceBidPPU[index5];

            uint16 nrOfBids = resourceNrBids[index5];

            averageResourceBidPPU[index5] = sum / nrOfBids;
        }

        for (
            uint16 index6 = 0;
            index6 < averageResourceAskPPU.length;
            index6++
        ) {
            if (
                averageResourceAskPPU[index6] > 0 &&
                averageResourceBidPPU[index6] > 0
            ) {
                uint256 avgAskPPU = averageResourceAskPPU[index6];

                uint256 avgBidPPU = averageResourceBidPPU[index6];

                uint256 averagePrice = (avgAskPPU + avgBidPPU) / 2;

                if (averagePrice > 0) {
                    priceCalculations[
                        keccak256(abi.encodePacked(lastPeriodId, "_", index6))
                    ] = averagePrice;
                }
            }
        }
    }

    function sendToEscrow(uint256 amount) internal {
        escrowWallet.transfer(amount);
    }

    function sendToTreasury(uint256 amount) internal {
        treasuryWallet.transfer(amount);
    }

    function sendToSeller(
        address payable seller,
        IncomingTradePayment memory receivedPayment
    ) internal {
        seller.transfer(
            receivedPayment.ethTransferred - receivedPayment.feeAmount
        );
    }

    function returnToBuyer(
        address payable buyer,
        IncomingTradePayment memory receivedPayment
    ) internal {
        buyer.transfer(
            receivedPayment.ethTransferred - receivedPayment.feeAmount
        );
    }
}
