//SPDX-License-Identifier: WTFPL
pragma solidity ^0.8.9;

struct ConstructorParams {
    Fee[] askFees;
    Fee[] bidFees;
    Fee tradeFee;
    MarginFee[] marginFees;
    uint8 numberOfPeriodsPerDay;
    uint8 periodDurationInMinutes;
    uint8 periodsStartHour;
    uint8 periodsStartMinute;
    address payable treasuryWallet;
    address payable escrowWallet;
    Resource[] resources;
    address payable[] sellers;
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
    uint32 minUnits;
    uint32 maxUnits;
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
    uint32 minUnits;
    uint32 maxUnits;
    uint16 purity;
    uint256 bidPPU;
    uint16[] appliedFeeIds;
    uint16 marginFeeId;
}

// This is what we generate when we get payment. We should not have any ghost incoming payments in the system
struct IncomingTradePayment {
    uint256 transactionTime;
    address buyer;
    uint256 ethTransferred;
    uint256 tradeOfferId;
    uint16 appliedFee;
    uint256 feeAmount;
}

// This is what we generate when we release payment
struct OutgoingPayment {
    uint16 tradeOfferId;
    address user;
    uint256 transactionTime;
    uint256 ethTransferred;
    bool isSellerPayment;
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
    uint256 id;
    uint16 periodId;
    uint16 resourceId;
    uint32 units;
    address payable seller;
    address buyer;
    uint256 expiresAt;
    uint256 acceptedAt;
}
