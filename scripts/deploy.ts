// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// When running the script with `npx hardhat run <script>` you'll find the Hardhat
// Runtime Environment's members available in the global scope.
import { ConstructorParamsStruct, FeeStruct } from "@types";
import { ethers } from "hardhat";
enum FeeType {
  "ASK",
  "BID",
  "MARGIN",
}
async function main() {
  const [owner, seller1, buyer1, buyer2, treasury, escrow] =
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
      { id: 1, percentOverMedian: 0, percentage: 0 },
      { id: 2, percentOverMedian: 25, percentage: 5000 },
      { id: 3, percentOverMedian: 50, percentage: 30000 },
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
  // We get the contract to deploy
  const Controller = await ethers.getContractFactory("Controller");
  const controller = await Controller.deploy(contractParams, {
    gasLimit: 15000000,
  });

  await controller.deployed();
  const connected = controller.connect(seller1);

  const fees: FeeStruct[] = await controller.pickFees(true);

  const units = 111;
  const price = ethers.utils.parseEther("0.1");
  const percentageFee = price.mul(units).mul(fees[0].percentage).div(10000);

  console.log(percentageFee.add(fees[0].amount));

  await connected.submitAsk(1, units, 950, price, {
    value: percentageFee.add(fees[0].amount),
    gasLimit: 15000000,
  });
  console.log("Controller deployed to:", controller.address);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
