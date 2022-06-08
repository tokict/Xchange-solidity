//SPDX-License-Identifier: WTFPL
pragma solidity ^0.8.9;

struct ConstructorParams {
    Fee[] askFees;
    Fee[] bidFees;
    MarginFee[] marginFees;
    uint8 numberOfPeriodsPerDay;
    uint8 periodDurationInMinutes;
    uint8 periodsStartHour;
    uint8 periodsStartMinute;
    address payable treasuryWallet;
    address payable escrowWallet;
    Resource[] resources;
    address[] sellers;
    address[] buyers;
}
/*
 * This is the basic resource
 */
struct Resource {
    uint16 id;
    string name;
    string symbol;
    string measurementUnit;
}

struct Period {
    uint16 id;
    uint16 from;
    bool closed;
    uint16 to;
}
/*
 * This is the resource for sale from one user
 * 1 to many
 */
struct ResourceAsk {
    uint16 id;
    uint16 resourceId;
    address asker;
    uint16 minUnits;
    uint16 maxUnits;
    uint16 purity;
    uint256 askPPU;
    uint16[] appliedFeeIds;
}

/*
 * This is the resource bid from one user
 * 1 to many
 */
struct ResourceBid {
    uint16 id;
    address bidder;
    uint16 resourceId;
    uint16 minUnits;
    uint16 maxUnits;
    uint16 purity;
    uint256 bidPPU;
    uint16[] appliedFeeIds;
    uint16 marginFeeId;
}

// After presenting median price, the buyer sends his approval for corrected price and makes an obligation to purchase initial bid quantity
struct BuyerAgreement {
    uint16 bidId;
    bytes32 priceCalculationId;
    uint16 minUnits;
    uint16 maxUnits;
    uint256 time;
}

// After presenting median price, the seller agrees to the price
struct SellerAgreement {
    uint16 askId;
    bytes32 priceCalculationId;
    uint16 minUnits;
    uint16 maxUnits;
    uint256 time;
}

// This is what we generate when we get payment. We should not have any ghost incoming payments in the system
struct IncomingTradePayment {
    uint16 id;
    uint256 transactionTime;
    address buyer;
    uint256 ethTransferred;
    uint256 agreementId;
    uint8[] appliedFees;
    uint256 feeAmount;
    bool useMargin;
}

// This is what we generate when we release payment
struct OutgoingPayment {
    uint16 id;
    uint16 incomingPaymentId;
    address user;
    uint256 transactionTime;
    uint256 ethTransferred;
    uint8[] appliedFees;
    bool isRefund;
    bool isMargin;
}

// All fees including margin
struct Fee {
    uint16 id;
    uint16 percentage;
    uint256 amount;
    string feeType;
    bool cumulative;
    string[] noCombine;
}

// All fees including margin
struct MarginFee {
    uint16 id;
    uint8 percentage;
}

// Trade offer is a time limited matching on price and quantity between a buyer and seller;

struct TradeOffer {
    uint16 intervalId;
    uint16 resourceId;
    uint16 units;
    uint256 PPU;
    uint256 expiresAt;
}
