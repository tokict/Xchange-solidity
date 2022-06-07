/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */
import { Signer, utils, Contract, ContractFactory, Overrides } from "ethers";
import type { Provider, TransactionRequest } from "@ethersproject/providers";
import type { Helpers, HelpersInterface } from "../Helpers";

const _abi = [
  {
    inputs: [
      {
        internalType: "uint256",
        name: "theNumber",
        type: "uint256",
      },
      {
        internalType: "uint16",
        name: "percentage",
        type: "uint16",
      },
    ],
    name: "calculatePercentage",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "pure",
    type: "function",
  },
];

const _bytecode =
  "0x608060405234801561001057600080fd5b50610185806100206000396000f3fe608060405234801561001057600080fd5b506004361061002b5760003560e01c8063bd0ae23114610030575b600080fd5b61004361003e366004610079565b610055565b60405190815260200160405180910390f35b600061271061006861ffff8416856100b0565b6100729190610114565b9392505050565b6000806040838503121561008c57600080fd5b82359150602083013561ffff811681146100a557600080fd5b809150509250929050565b6000817fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff048311821515161561010f577f4e487b7100000000000000000000000000000000000000000000000000000000600052601160045260246000fd5b500290565b60008261014a577f4e487b7100000000000000000000000000000000000000000000000000000000600052601260045260246000fd5b50049056fea2646970667358221220461065cec79215824684318c104aceeb167649d7cf2450fe791643fc02c497c864736f6c63430008090033";

type HelpersConstructorParams =
  | [signer?: Signer]
  | ConstructorParameters<typeof ContractFactory>;

const isSuperArgs = (
  xs: HelpersConstructorParams
): xs is ConstructorParameters<typeof ContractFactory> => xs.length > 1;

export class Helpers__factory extends ContractFactory {
  constructor(...args: HelpersConstructorParams) {
    if (isSuperArgs(args)) {
      super(...args);
    } else {
      super(_abi, _bytecode, args[0]);
    }
  }

  override deploy(
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<Helpers> {
    return super.deploy(overrides || {}) as Promise<Helpers>;
  }
  override getDeployTransaction(
    overrides?: Overrides & { from?: string | Promise<string> }
  ): TransactionRequest {
    return super.getDeployTransaction(overrides || {});
  }
  override attach(address: string): Helpers {
    return super.attach(address) as Helpers;
  }
  override connect(signer: Signer): Helpers__factory {
    return super.connect(signer) as Helpers__factory;
  }

  static readonly bytecode = _bytecode;
  static readonly abi = _abi;
  static createInterface(): HelpersInterface {
    return new utils.Interface(_abi) as HelpersInterface;
  }
  static connect(
    address: string,
    signerOrProvider: Signer | Provider
  ): Helpers {
    return new Contract(address, _abi, signerOrProvider) as Helpers;
  }
}
