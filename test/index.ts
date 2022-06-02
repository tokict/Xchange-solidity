import { ConstructorParamsStruct } from "@types";
import { expect } from "chai";
import { ethers } from "hardhat";
enum FeeType {
  'ASK',
  'BID',
  'MARGIN'
}


describe("Controller", function () {
  it("Should return the new greeting once it's changed", async function () {
    const [owner, seller, buyer1, buyer2, treasury, escrow] =
      await ethers.getSigners();

      const contractParams:ConstructorParamsStruct = {
        askFee: {
          id: 1,
          percentage: 10,
          amount: 0,
          feeType: 'ask',
          cumulative: true,
          noCombine: [],
        },
        bidFee: {
          id: 1,
          percentage: 10,
          amount: 0,
          feeType: 'bid',
          cumulative: true,
          noCombine: [],
        },
        marginFee: {
          id: 1,
          percentage: 10,
          amount: 0,
          feeType: 'margin',
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
            measurementUnit: "m3"
          },
        ],
        sellers: [seller.address],
        buyers: [buyer1.address, buyer2.address],
      };
      // We get the contract to deploy
      const Controller = await ethers.getContractFactory("Controller");
      const controller = await Controller.deploy(contractParams,{ gasLimit: 15000000 });
    
      await controller.deployed();
    

    expect(await controller.test()).to.equal("Xenon");

    // const setGreetingTx = await greeter.setGreeting("Hola, mundo!");
    //
    // // wait until the transaction is mined
    // await setGreetingTx.wait();
    //
    // expect(await greeter.greet()).to.equal("Hola, mundo!");
  });
});
