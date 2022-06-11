import {
  ConstructorParamsStruct,
  FeeStruct,
  MarginFeeStruct,
  ResourceAskStruct,
  ResourceBidStruct,
  ResourceStruct,
  TradeOfferStruct,
} from "@types";
import { expect } from "chai";
import { BigNumber, Contract } from "ethers";
import { ethers, network } from "hardhat";

enum FeeType {
  "ASK",
  "BID",
  "MARGIN",
}
async function setup() {
  const [owner, seller1, seller2, buyer1, buyer2, treasury, escrow] =
    await ethers.getSigners();
  const contractParams: ConstructorParamsStruct = {
    askFees: [
      {
        id: 1,
        percentage: 100, // = 0.01%
        amount: ethers.utils.parseEther("0.01"),
        feeType: "ask",
        cumulative: true,
        noCombine: [],
      },
    ],
    bidFees: [
      {
        id: 1,
        percentage: 100,
        amount: ethers.utils.parseEther("0.01"),
        feeType: "bid",
        cumulative: true,
        noCombine: [],
      },
    ],
    tradeFee: {
      id: 1,
      percentage: 100,
      amount: ethers.utils.parseEther("0.01"),
      feeType: "bid",
      cumulative: true,
      noCombine: [],
    },
    marginFees: [
      { id: 1, percentOverMedian: 25, percentage: 5000 },
      { id: 2, percentOverMedian: 50, percentage: 30000 },
    ],
    numberOfPeriodsPerDay: 2,
    periodDurationInMinutes: 0,
    periodsStartHour: 10,
    periodsStartMinute: 0,
    treasuryWallet: treasury.address,
    escrowWallet: escrow.address,
    resources: [
      {
        id: 1,
        name: "Xenon",
        symbol: "Xe",
        measurementUnit: "m3",
      },
    ],
    sellers: [seller1.address],
    buyers: [buyer1.address],
  };
  const Controller = await ethers.getContractFactory("Controller");
  const controller = await Controller.deploy(contractParams, {
    gasLimit: 15000000,
  });
  await controller.deployed();
  return {
    controller,
    owner,
    seller1,
    seller2,
    buyer1,
    buyer2,
    treasury,
    escrow,
  };
}
async function submitAsk(
  contract: Contract,
  resourceId: number,
  minUnits: number,
  maxUnits: number,
  askPPU: BigNumber
) {
  const fees: FeeStruct[] = await contract.pickFees(true);
  expect(fees).to.have.lengthOf(1);

  const percentageFee = askPPU.mul(minUnits).mul(fees[0].percentage).div(10000);

  await contract.submitAsk(resourceId, minUnits, maxUnits, 950, askPPU, {
    value: percentageFee.add(fees[0].amount),
    gasLimit: 15000000,
  });
}

async function submitBid(
  contract: Contract,
  resourceId: number,
  minUnits: number,
  maxUnits: number,
  bidPPU: BigNumber
) {
  // Get fees that will be needed
  const fees: FeeStruct[] = await contract.pickFees(false);
  const percentageFee = bidPPU.mul(minUnits).mul(fees[0].percentage).div(10000);

  // Get margin for this bid amount
  const margin: MarginFeeStruct = await contract.pickMarginFee(0, bidPPU);

  const marginFee = margin.percentage
    ? bidPPU.mul(minUnits).mul(margin.percentage).div(10000)
    : bidPPU.mul(minUnits);

  // Submit the bid
  await contract.submitBid(resourceId, minUnits, maxUnits, 850, bidPPU, {
    value: percentageFee.add(fees[0].amount).add(marginFee),
    gasLimit: 15000000,
  });
}

describe("Controller", async function () {
  beforeEach(async function () {
    await network.provider.send("hardhat_reset");
  });
  it("Should correctly deploy a contract", async function () {
    // We get the contract to deploy

    const { controller } = await setup();

    // Check if it deployed ok by inspecting if resources are populated
    const resources: ResourceStruct[] = await controller.getResources();
    expect(resources.some((i) => i.name === "Xenon")).to.be.true;
  });

  it("Should add and remove sellers and buyers", async function () {
    const { controller, buyer2, seller2 } = await setup();

    // Test adding of buyer
    await controller.addBuyer(buyer2.address);
    const buyers: string[] = await controller.getBuyers();

    expect(buyers).to.have.lengthOf(2);

    // Remove buyer
    await controller.removeBuyer(buyer2.address);
    const buyersRemoved: string[] = await controller.getBuyers();

    expect(buyersRemoved).to.have.lengthOf(1);

    // Test adding of seller
    await controller.addSeller(seller2.address);
    const sellers: string[] = await controller.getSellers();

    expect(sellers).to.have.lengthOf(2);

    // Remove seller
    await controller.removeSeller(seller2.address);
    const sellersRemoved: string[] = await controller.getSellers();

    expect(sellersRemoved).to.have.lengthOf(1);
  });

  // it("Should set up intervals properly", async function () {
  //   const { controller, buyer2, seller2 } = await setup();
  // });

  it("ASK - Should allow seller to submit an ASK during interval, apply proper fees", async function () {
    const { controller, seller1, treasury } = await setup();
    const connected = controller.connect(seller1);
    const minUnits = 111;
    const maxUnits = 150;
    const askPPU = ethers.utils.parseEther("0.1");
    await submitAsk(connected, 0, minUnits, maxUnits, askPPU);

    const asks: ResourceAskStruct[] = await connected.getAsks(0);
    // Check if the ask was saved
    expect(asks[0]).to.have.property("minUnits", minUnits);
    expect(asks[0]).to.have.property("maxUnits", maxUnits);
    expect(asks[0]).to.have.property("purity", 950);
    expect(asks[0]).to.have.property("resourceId", 0);
    expect(asks[0]).to.have.property("asker", seller1.address.toString());
    expect(BigNumber.from(asks[0].askPPU)).to.be.equal(askPPU);

    // Check if we got fees
    expect(await connected.provider.getBalance(treasury.address)).to.be.equal(
      BigNumber.from("10000121000000000000000")
    );
  });

  it("BID1 - Should allow buyer to submit a BID during interval, apply proper fees", async function () {
    const { controller, buyer1, treasury, escrow } = await setup();
    const connected = controller.connect(buyer1);
    const minUnits = 90;
    const maxUnits = 100;
    const bidPPU = ethers.utils.parseEther("0.11");

    await submitBid(connected, 0, minUnits, maxUnits, bidPPU);

    // Get period bids
    const bids: ResourceBidStruct[] = await connected.getBids(0);

    // Check if the bid was saved
    expect(bids[0]).to.have.property("minUnits", minUnits);
    expect(bids[0]).to.have.property("maxUnits", maxUnits);
    expect(bids[0]).to.have.property("purity", 850);
    expect(bids[0]).to.have.property("resourceId", 0);
    expect(bids[0]).to.have.property("bidder", buyer1.address.toString());
    expect(BigNumber.from(bids[0].bidPPU)).to.be.equal(bidPPU);

    // Check if treasury got the fees

    expect(await connected.provider.getBalance(treasury.address)).to.be.equal(
      BigNumber.from("10000109000000000000000")
    );
  });

  it("BID2 - Should calculate average price correctly, take agreements and accept pay", async function () {
    const { controller, buyer1, buyer2, seller1, seller2, treasury, escrow } =
      await setup();
    const ask1PPU = ethers.utils.parseEther("0.11");
    const ask2PPU = ethers.utils.parseEther("0.15");
    const bid1PPU = ethers.utils.parseEther("0.09");
    const bid2PPU = ethers.utils.parseEther("0.08");

    const seller1Con = controller.connect(seller1);
    await submitAsk(seller1Con, 0, 100, 150, ask1PPU);
    const seller2Con = controller.connect(seller2);
    await submitAsk(seller2Con, 0, 100, 150, ask2PPU);
    const buyer1Con = controller.connect(buyer1);
    await submitBid(buyer1Con, 0, 90, 120, bid1PPU);
    const buyer2Con = controller.connect(buyer2);
    await submitBid(buyer2Con, 0, 90, 120, bid2PPU);
    const escrowCon = controller.connect(escrow);

    const bids: ResourceBidStruct[] = await seller1Con.getBids(0);
    expect(bids).to.have.lengthOf(2);
    const asks: ResourceAskStruct[] = await seller1Con.getAsks(0);
    expect(asks).to.have.lengthOf(2);

    //Trigger price calculation
    await seller1Con.calculatePrice(0, false, {
      gasLimit: 30000000,
    });
    //const bidFee = await connected.pickMarginFee(0, bidPPU);
    const price = await seller1Con.priceCalculations(
      ethers.utils.keccak256(
        ethers.utils.solidityPack(["uint16", "string", "uint16"], [0, "_", 0])
      )
    );

    expect(price).to.be.equal(BigNumber.from("107500000000000000"));

    // Send offer
    await buyer1Con.sendTradeOffer(0, 100, seller1.address);
    // Check if offer is registered
    const offers: TradeOfferStruct[] = await seller1Con.getTradeOffersForSeller(
      seller1.address
    );
    expect(offers).to.have.lengthOf(1);
    // Accept offer

    await expect(seller1Con.acceptTradeOffer(offers[0].id)).not.to.be.reverted;

    // Check state
    const offers2: TradeOfferStruct[] =
      await seller1Con.getTradeOffersForSeller(seller1.address);

    expect(offers2[0].acceptedAt).not.to.equal(BigNumber.from("0"));

    // Get accepted offer for buyer and pay it

    const buyerOffers: TradeOfferStruct[] =
      await buyer1Con.getTradeOffersForBuyer();
    expect(buyerOffers).to.have.lengthOf(1);

    const fee: FeeStruct = await controller.tradeFee();
    const percentageFee = price
      .mul(buyerOffers[0].units)
      .mul(fee.percentage)
      .div(10000);

    const totalToTransfer = price
      .mul(buyerOffers[0].units)
      .add(fee.amount)
      .add(percentageFee);
    await controller.payOffer(
      buyerOffers[0].seller,
      buyerOffers[0].periodId,
      buyerOffers[0].id,
      {
        value: totalToTransfer,
      }
    );

    expect(await buyer1Con.provider.getBalance(escrow.address)).to.be.equal(
      BigNumber.from("10010867500000000000000")
    );

    await escrowCon.payOutPaidOffer(
      buyerOffers[0].seller,
      buyerOffers[0].periodId,
      buyerOffers[0].id,
      {
        value: totalToTransfer,
        gasLimit: 300000,
      }
    );
    expect(await escrowCon.provider.getBalance(treasury.address)).to.be.equal(
      BigNumber.from("10000570500000000000000")
    );
    expect(await escrowCon.provider.getBalance(seller1.address)).to.be.equal(
      BigNumber.from("10010629481703589094900")
    );
  });
});
