// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// When running the script with `npx hardhat run <script>` you'll find the Hardhat
// Runtime Environment's members available in the global scope.
import { ConstructorParamsStruct } from "@types";
import { ethers } from "hardhat";
enum FeeType {
  'ASK',
  'BID',
  'MARGIN'
}
async function main() {

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

  console.log("Controller deployed to:", controller.address);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
