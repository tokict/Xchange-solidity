import {
  ConstructorParamsStruct,
  FeeStruct,
  ResourceAskStruct,
  ResourceBidStruct,
  ResourceStruct,
} from "@types";
import { expect } from "chai";
import { BigNumber } from "ethers";
import { ethers } from "hardhat";

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
    marginFees: [
      {
        id: 1,
        percentage: 100,
      },
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

describe("Controller", async function () {
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

  it("Should allow seller to submit an ASK during interval, apply proper fees", async function () {
    const { controller, seller1 } = await setup();
    const connected = controller.connect(seller1);

    const fees: FeeStruct[] = await controller.pickFees(true);
    expect(fees).to.have.lengthOf(1);
    const units = 111;
    const askPPU = ethers.utils.parseEther("0.1");
    const percentageFee = askPPU.mul(units).mul(fees[0].percentage).div(10000);

    await connected.submitAsk(1, units, 950, askPPU, {
      value: percentageFee.add(fees[0].amount),
    });

    const asks: ResourceAskStruct[] = await connected.getAsks(0);

    expect(asks[0]).to.have.property("units", units);
    expect(asks[0]).to.have.property("purity", 950);
    expect(asks[0]).to.have.property("resourceId", 1);
    expect(asks[0]).to.have.property("asker", seller1.address.toString());
    expect(BigNumber.from(asks[0].askPPU)).to.be.equal(askPPU);
  });

  it("Should allow buyer to submit a BID during interval, apply proper fees", async function () {
    const { controller, buyer1 } = await setup();
    const connected = controller.connect(buyer1);
    const units = 90;
    const bidPPU = ethers.utils.parseEther("0.11");
    const fees: FeeStruct[] = await controller.pickFees(true);

    const percentageFee = bidPPU.mul(units).mul(fees[0].percentage).div(10000);
    await connected.submitBid(1, units, 850, bidPPU, {
      value: percentageFee.add(fees[0].amount),
    });

    const bids: ResourceBidStruct[] = await connected.getBids(0);

    expect(bids[0]).to.have.property("units", units);
    expect(bids[0]).to.have.property("purity", 850);
    expect(bids[0]).to.have.property("resourceId", 1);
    expect(bids[0]).to.have.property("bidder", buyer1.address.toString());
    expect(BigNumber.from(bids[0].bidPPU)).to.be.equal(bidPPU);
  });
});
