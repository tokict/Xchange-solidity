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

    // bidFee is applied to every submitted BID as tax
    Fee public tradeFee;

    // PERIODS are time slots in which asks and bids can be submitted. After it expires, we make results public and open another round.
    // Yes, I know its all public anyway.

    //How many periods before trading starts
    uint8 public numberOfPeriodsPerDay;
    // How long should each period last
    uint8 public periodDurationInMinutes;

    // The current state of margins
    mapping(address => uint256) marginAmounts;

    // What hour of the day to start period
    uint8 public periodsStartHour;
    // What minute in that hour to start the period
    uint8 public periodsStartMinute;

    uint16 public lastPeriodId;

    // Treasury wallet is to keep collected fees and generally, profit.
    // We don't want to keep ANY funds in the contract in case of hack of my screwup
    address payable public treasuryWallet;
    // We keep our clients money in a separate escrow wallet. To send money to sellers, we call a function on contract and the contract proxies it
    address payable public escrowWallet;

    //Array or enabled resources to trade
    Resource[] internal resources;

    IncomingTradePayment[] internal incomingPayments;

    // Resource asks from sellers
    mapping(uint16 => ResourceAsk[]) internal resourceAsks;

    // Resource bids from buyers
    mapping(uint16 => ResourceBid[]) internal resourceBids;

    // Incoming payments from buyers
    mapping(uint16 => IncomingTradePayment[]) internal incomingTradePayments;

    // Trade offers from buyers
    mapping(bytes32 => TradeOffer[]) public tradeOffers;

    // Trade offers index for buyer
    mapping(address => bytes32[]) internal buyerOffersIndex;

    // Price calculations. The key is a composite made of {periodId}_{resourceId}
    mapping(bytes32 => uint256) public priceCalculations;

    // Outgoing payments
    OutgoingPayment[] internal outgoingPayments;

    // allowed sellers
    address[] internal sellers;

    // allowed buyers
    address[] internal buyers;

    // owner
    address private owner;

    constructor(ConstructorParams memory params) {
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

        tradeFee = params.tradeFee;

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
        bool found = false;
        for (uint256 index = 0; index < sellers.length; index++) {
            if (sellers[index] == msg.sender) {
                found = true;
            }
        }
        require(found, "Seller: caller is not a seller");
        _;
    }

    /**
     * @dev Throws if called by any account other than the buyer.
     */
    modifier onlyBuyer() {
        bool found = false;
        for (uint256 index = 0; index < buyers.length; index++) {
            if (buyers[index] == msg.sender) {
                found = true;
            }
        }
        require(found, "Buyer: caller is not a buyer");
        _;
    }

    /**
     * @dev Throws if called by any account other than the escrow.
     */
    modifier onlyEscrow() {
        require(escrowWallet == msg.sender, "Escrow: caller is not escrow");
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
        uint16 minUnits,
        uint16 maxUnits,
        uint16 purity,
        uint256 askPPU
    ) external payable {
        require(purity < 1000, "Invalid purity");
        require(minUnits > 0 && maxUnits > 0, "Invalid units");
        require(askPPU > 0, "Invalid ask PPU");

        require(
            resourceId >= 0 && resourceId < resources.length,
            "Invalid resource"
        );
        ResourceAsk memory ask = ResourceAsk({
            id: 1,
            resourceId: resourceId,
            asker: msg.sender,
            minUnits: minUnits,
            maxUnits: maxUnits,
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
                    ask.askPPU * ask.minUnits,
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
     * We default to 0 index fee as the default one
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
        uint16 minUnits,
        uint16 maxUnits,
        uint16 purity,
        uint256 bidPPU
    ) external payable {
        require(purity < 1000, "Invalid purity");
        require(minUnits > 0 && maxUnits > 0, "Invalid units");
        require(bidPPU > 0, "Invalid ask PPU");
        require(
            resourceId >= 0 && resourceId < resources.length,
            "Invalid resource"
        );
        ResourceBid memory bid = ResourceBid({
            id: 1,
            resourceId: resourceId,
            bidder: msg.sender,
            minUnits: minUnits,
            maxUnits: maxUnits,
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
        // Calculate margin and see if user has already enough on his address
        uint256 marginAmount = calculatePercentage(
            bid.bidPPU * bid.minUnits,
            marginFee.percentage
        );
        if (marginAmount > 0 && marginAmounts[msg.sender] > 0) {
            // If the user has more on account than margin for this bid, then he pays 0 margin
            if (marginAmounts[msg.sender] < marginAmount) {
                marginAmount = marginAmount - marginAmounts[msg.sender];
            }
        }

        for (uint8 i = 0; i < bid.appliedFeeIds.length; i++) {
            feeAmount = feeAmount + pickedFees[i].amount;
            feeAmount =
                feeAmount +
                calculatePercentage(
                    bid.bidPPU * bid.minUnits,
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
            marginAmounts[msg.sender] =
                marginAmounts[msg.sender] +
                marginAmount;
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

    function sendTradeOffer(
        uint16 resourceId,
        uint32 units,
        address payable seller
    ) external {
        bytes32 sellerKey = keccak256(
            abi.encodePacked(lastPeriodId, "_", seller)
        );

        TradeOffer memory offer = TradeOffer({
            id: tradeOffers[sellerKey].length,
            periodId: lastPeriodId,
            resourceId: resourceId,
            units: units,
            seller: seller,
            buyer: msg.sender,
            expiresAt: block.timestamp + 1 hours,
            acceptedAt: 0
        });
        // Register this offer for the seller
        tradeOffers[sellerKey].push(offer);

        // Register this offer for the user
        buyerOffersIndex[msg.sender].push(sellerKey);
    }

    function acceptTradeOffer(uint256 offerId) external {
        bytes32 sellerKey = keccak256(
            abi.encodePacked(lastPeriodId, "_", msg.sender)
        );

        for (
            uint256 index = 0;
            index < tradeOffers[sellerKey].length;
            index++
        ) {
            if (tradeOffers[sellerKey][index].id == offerId) {
                tradeOffers[sellerKey][index].acceptedAt = block.timestamp;
            }
        }
    }

    function getTradeOffersForSeller(address seller)
        public
        view
        returns (TradeOffer[] memory offers)
    {
        bytes32 sellerKey = keccak256(
            abi.encodePacked(lastPeriodId, "_", seller)
        );

        return tradeOffers[sellerKey];
    }

    function getTradeOffersForBuyer()
        public
        view
        returns (TradeOffer[] memory offers)
    {
        uint16 count = 0;
        for (
            uint256 index = 0;
            index < buyerOffersIndex[msg.sender].length;
            index++
        ) {
            for (
                uint256 index2 = 0;
                index2 <
                tradeOffers[buyerOffersIndex[msg.sender][index]].length;
                index2++
            ) {
                if (
                    tradeOffers[buyerOffersIndex[msg.sender][index]][index2]
                        .buyer == msg.sender
                ) {
                    count++;
                }
            }
        }

        TradeOffer[] memory buyerOffers = new TradeOffer[](count);
        uint256 j;
        for (
            uint256 index = 0;
            index < buyerOffersIndex[msg.sender].length;
            index++
        ) {
            for (
                uint256 index2 = 0;
                index2 <
                tradeOffers[buyerOffersIndex[msg.sender][index]].length;
                index2++
            ) {
                if (
                    tradeOffers[buyerOffersIndex[msg.sender][index]][index2]
                        .buyer == msg.sender
                ) {
                    buyerOffers[j] = tradeOffers[
                        buyerOffersIndex[msg.sender][index]
                    ][index2];

                    j++;
                }
            }
        }
        return buyerOffers;
    }

    function payOffer(
        address seller,
        uint16 periodId,
        uint256 offerId
    ) external payable {
        bytes32 sellerKey = keccak256(abi.encodePacked(periodId, "_", seller));

        for (
            uint256 index = 0;
            index < tradeOffers[sellerKey].length;
            index++
        ) {
            if (tradeOffers[sellerKey][index].id == offerId) {
                uint128 units = tradeOffers[sellerKey][index].units;
                uint256 PPU = priceCalculations[
                    keccak256(
                        abi.encodePacked(
                            tradeOffers[sellerKey][index].periodId,
                            "_",
                            tradeOffers[sellerKey][index].resourceId
                        )
                    )
                ];

                uint256 feeAmount = tradeFee.amount +
                    calculatePercentage(PPU * units, tradeFee.percentage);
                uint256 totalPrice = units * PPU + feeAmount;
                uint256 toPay = totalPrice - marginAmounts[msg.sender];
                require(msg.value >= toPay, "Not enough ETH transferred");
                sendToEscrow(toPay);
                marginAmounts[msg.sender] = 0; // Margin account should never have more than purchase and should end up empty after purchase
                incomingPayments.push(
                    IncomingTradePayment({
                        transactionTime: block.timestamp,
                        buyer: msg.sender,
                        ethTransferred: msg.value,
                        tradeOfferId: offerId,
                        appliedFee: tradeFee.id,
                        feeAmount: feeAmount
                    })
                );
            }
        }
    }

    function sendToEscrow(uint256 amount) internal {
        escrowWallet.transfer(amount);
    }

    function sendToTreasury(uint256 amount) public {
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

    function payOutPaidOffer(
        address seller,
        uint16 periodId,
        uint16 offerId
    ) external payable onlyEscrow {
        bytes32 sellerKey = keccak256(abi.encodePacked(periodId, "_", seller));

        for (
            uint256 index = 0;
            index < tradeOffers[sellerKey].length;
            index++
        ) {
            TradeOffer memory offer = tradeOffers[sellerKey][index];
            if (offer.id == offerId) {
                uint256 PPU = priceCalculations[
                    keccak256(
                        abi.encodePacked(offer.periodId, "_", offer.resourceId)
                    )
                ];

                // Buyer pays seller ask and our trade fee which we send to treasury
                uint256 feeAmount = tradeFee.amount +
                    calculatePercentage(PPU * offer.units, tradeFee.percentage);

                offer.seller.transfer(offer.units * PPU);

                outgoingPayments.push(
                    OutgoingPayment({
                        transactionTime: block.timestamp,
                        user: offer.seller,
                        ethTransferred: offer.units * PPU,
                        tradeOfferId: offerId,
                        isSellerPayment: true,
                        isRefund: false,
                        isMargin: false
                    })
                );

                require(
                    (offer.units * PPU) + feeAmount <= msg.value,
                    "Insufficient ETH for payment"
                );
                console.log((offer.units * PPU) + feeAmount);
                console.log(msg.value);
                sendToTreasury(feeAmount);
            }
        }
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
