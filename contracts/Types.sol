//SPDX-License-Identifier: WTFPL
pragma solidity ^0.8.9;

/*
 * This is the basic resource
 */
struct Resource {
    uint256 id;
    string name;
    string symbol;
    string measurementUnit;
    uint256 feeId;
}

struct Period {
    uint256 id;
    uint256 from;
    bool closed;
    uint256 to;
}
/*
 * This is the resource for sale from one user
 * 1 to many
 */
struct ResourceAsk {
    uint256 id;
    uint256 resourceId;
    address asker;
    uint8 units;
    uint8 purity;
    uint256 askPPU;
}

/*
 * This is the resource bid from one user
 * 1 to many
 */
struct ResourceBid {
    uint256 id;
    address bidder;
    uint256 resourceId;
    uint8 units;
    uint256 bidPPU;
}

struct PeriodInputs {
    ResourceAsk[] asks;
    ResourceBid[] bids;
}

// We calculate the median price based on all period bids and asks
struct PriceCalculation {
    uint256 id;
    uint256 periodId;
    uint256 resourceId;
    uint256 PPU;
}

// After presenting median price, the buyer sends his approval for corrected price and makes an obligation to purchase initial bid quantity
struct BuyerAgreement {
    uint256 bidId;
    uint256 priceCalculationId;
    uint256 units;
    uint256 time;
}

// After presenting median price, the seller agrees to the price
struct SellerAgreement {
    uint256 askId;
    uint256 priceCalculationId;
    uint256 time;
}

// This is what we generate when we get payment. We should not have any ghost incoming payments in the system
struct IncomingTradePayment {
    uint256 id;
    uint256 transactionTime;
    address buyer;
    uint256 ethTransferred;
    uint256 agreementId;
    uint8[] appliedFees;
    uint256 feeAmount;
}

// This is what we generate when we get payment. We should not have any ghost incoming payments in the system
struct BidMarginPayment {
    uint256 id;
    uint256 transactionTime;
    address buyer;
    uint256 ethTransferred;
    uint256 bidId;
    bool active;
}

// This is what we generate when we release payment
struct OutgoingPayment {
    uint256 id;
    uint256 incomingPaymentId;
    address user;
    uint256 transactionTime;
    uint256 ethTransferred;
    uint8[] appliedFees;
    uint256 feeAmount;
    bool refund;
    bool isMargin;
}

enum FeeType {
    ASK,
    BID
}

// All fees including margin
struct Fee {
    uint256 id;
    uint256 percentage;
    uint256 amount;
    FeeType feeType;
    bool cumulative;
    string[] noCombine;
}

// All fees including margin
struct MarginFee {
    uint256 id;
    uint256 percentage;
}
