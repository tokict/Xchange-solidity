//SPDX-License-Identifier: WTFPL
pragma solidity ^0.8.9;

import "../node_modules/hardhat/console.sol";
import "./Types.sol";

contract Controller {
    // askFee is applied to every submitted ASK as tax
    Fee public askFee;
    // bidFee is applied to every submitted BID as tax
    Fee public bidFee;
    //margin fee required to make a bid
    Fee public marginFee;
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

    // Treasury wallet is to keep collected fees and generally, profit.
    // We don't want to keep ANY funds in the contract in case of hack of my screwup
    address private treasuryWallet;
    // We keep our clients money in a separate escrow wallet. To send money to sellers, we call a function on contract and the contract proxies it
    address private escrowWallet;

    //Array or enabled resources to trade
    Resource[1] internal resources;

    // allowed sellers
    mapping(address => bool) internal sellers;

    // allowed buyers
    mapping(address => bool) internal buyers;

    // owner
    address private owner;

    constructor(ConstructorParams memory params) {
        console.log("Deploying Controller");
        askFee = params.askFee;
        bidFee = params.bidFee;
        marginFee = params.marginFee;
        numberOfPeriodsPerDay = params.numberOfPeriodsPerDay;
        periodDurationInMinutes = params.periodDurationInMinutes;
        periodsStartHour = params.periodsStartHour;
        periodsStartMinute = params.periodsStartMinute;
        treasuryWallet = params.treasuryWallet;
        escrowWallet = params.escrowWallet;

        // Transfer from array to mapping
        for (uint256 i = 0; i < params.buyers.length; i++) {
            buyers[params.buyers[i]] = true;
        }
        for (uint256 i = 0; i < params.sellers.length; i++) {
            sellers[params.sellers[i]] = true;
        }

        for (uint256 i = 0; i < params.resources.length; i++) {
            resources[i] = params.resources[i];
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

    function test() external view onlyOwner returns (string memory) {
        return resources[0].name;
    }

    function setEscrow(address newEscrow) external onlyOwner {
        escrowWallet = newEscrow;
    }

    function setTreasury(address newTreasury) external onlyOwner {
        treasuryWallet = newTreasury;
    }

    function addBuyer(address buyer) external onlyOwner {
        // If the buyer is not there or is there but is disabled, enable or add it
        if (!buyers[buyer] || buyers[buyer] == false) {
            buyers[buyer] = true;
        } else {
            revert("Buyer already allowed");
        }
    }

    function removeBuyer(address buyer) external onlyOwner {
        if (buyers[buyer] && buyers[buyer] == true) {
            buyers[buyer] = false;
        } else {
            revert("Buyer already disabled or absent");
        }
    }

    function addSeller(address seller) external onlyOwner {
        // If the buyer is not there or is there but is disabled, enable or add it
        if (!sellers[seller] || sellers[seller] == false) {
            sellers[seller] = true;
        } else {
            revert("Seller already allowed");
        }
    }

    function removeSeller(address seller) external onlyOwner {
        if (sellers[seller] && sellers[seller] == true) {
            sellers[seller] = false;
        } else {
            revert("Buyer already disabled or absent");
        }
    }

    function sendToEscrow(uint256 amount) private {
        (bool sent, bytes memory data) = escrowWallet.call{value: amount}("");
        require(sent, "Failed to send ether");
    }

    function sendToTreasury(uint256 amount) private {
        (bool sent, bytes memory data) = treasuryWallet.call{value: amount}("");
        require(sent, "Failed to send ether");
    }

    function sendToSeller(
        address seller,
        IncomingTradePayment memory receivedPayment
    ) private {
        (bool sent, bytes memory data) = seller.call{
            value: receivedPayment.ethTransferred - receivedPayment.feeAmount
        }("");
        require(sent, "Failed to send ether");
    }

    function returnToBuyer(
        address buyer,
        IncomingTradePayment memory receivedPayment
    ) private {
        (bool sent, bytes memory data) = buyer.call{
            value: receivedPayment.ethTransferred - receivedPayment.feeAmount
        }("");
        require(sent, "Failed to send ether");
    }
}
