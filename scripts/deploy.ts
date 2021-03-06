// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// When running the script with `npx hardhat run <script>` you'll find the Hardhat
// Runtime Environment's members available in the global scope.
import { ConstructorParamsStruct } from "@types";
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
    tradeFee: {
      id: 1,
      percentage: 100,
      amount: ethers.utils.parseEther("0.01"),
      feeType: "bid",
      cumulative: true,
      noCombine: [],
    },
    marginFees: [
      { id: 1, percentOverMedian: 0, percentage: 0 },
      { id: 2, percentOverMedian: 25, percentage: 5000 },
      { id: 3, percentOverMedian: 50, percentage: 30000 },
    ],
    treasuryWallet: treasury.address,
    escrowWallet: escrow.address,
    resources: [
      {
        id: 0,
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

  console.log("Controller deployed to:", controller.address);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
