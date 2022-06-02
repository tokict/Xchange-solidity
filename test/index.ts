import {
  ConstructorParamsStruct,
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
    askFee: {
      id: 1,
      percentage: 10,
      amount: 0,
      feeType: "ask",
      cumulative: true,
      noCombine: [],
    },
    bidFee: {
      id: 1,
      percentage: 10,
      amount: 0,
      feeType: "bid",
      cumulative: true,
      noCombine: [],
    },
    marginFee: {
      id: 1,
      percentage: 10,
      amount: 0,
      feeType: "margin",
      cumulative: true,
      noCombine: [],
    },
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

  it("Should allow seller to submit an ASK during interval, apply proper fees", async function () {
    const { controller, seller1 } = await setup();
    const connected = controller.connect(seller1);

    await connected.submitAsk(1, 100, 950, ethers.utils.parseEther("0.1"));

    const asks: ResourceAskStruct[] = await connected.getAsks();

    expect(asks[0]).to.have.property("units", 100);
    expect(asks[0]).to.have.property("purity", 950);
    expect(asks[0]).to.have.property("resourceId", 1);
    expect(asks[0]).to.have.property("asker", seller1.address.toString());
    expect(BigNumber.from(asks[0].askPPU)).to.be.equal(
      ethers.utils.parseEther("0.1")
    );
  });

  it("Should allow buyer to submit a BID during interval, apply proper fees", async function () {
    const { controller, buyer1 } = await setup();
    const connected = controller.connect(buyer1);

    await connected.submitBid(1, 90, 850, ethers.utils.parseEther("0.11"));

    const bids: ResourceBidStruct[] = await connected.getBids();

    expect(bids[0]).to.have.property("units", 90);
    expect(bids[0]).to.have.property("purity", 850);
    expect(bids[0]).to.have.property("resourceId", 1);
    expect(bids[0]).to.have.property("bidder", buyer1.address.toString());
    expect(BigNumber.from(bids[0].bidPPU)).to.be.equal(
      ethers.utils.parseEther("0.11")
    );
  });
  // it("Should allow buyer to submit a BID during interval, apply proper fees and margin", async function () {
  //   const { controller, buyer2, seller2 } = await setup();
  // });

  // it("Should start trading session and calculate average price", async function () {
  //   const { controller, buyer2, seller2 } = await setup();
  // });
});
