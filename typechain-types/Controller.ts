/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */
import type {
  BaseContract,
  BigNumber,
  BigNumberish,
  BytesLike,
  CallOverrides,
  ContractTransaction,
  Overrides,
  PopulatedTransaction,
  Signer,
  utils,
} from "ethers";
import type { FunctionFragment, Result } from "@ethersproject/abi";
import type { Listener, Provider } from "@ethersproject/providers";
import type {
  TypedEventFilter,
  TypedEvent,
  TypedListener,
  OnEvent,
} from "./common";

export type FeeStruct = {
  id: BigNumberish;
  percentage: BigNumberish;
  amount: BigNumberish;
  feeType: string;
  cumulative: boolean;
  noCombine: string[];
};

export type FeeStructOutput = [
  BigNumber,
  number,
  number,
  string,
  boolean,
  string[]
] & {
  id: BigNumber;
  percentage: number;
  amount: number;
  feeType: string;
  cumulative: boolean;
  noCombine: string[];
};

export type ResourceStruct = {
  id: BigNumberish;
  name: string;
  symbol: string;
  measurementUnit: string;
};

export type ResourceStructOutput = [BigNumber, string, string, string] & {
  id: BigNumber;
  name: string;
  symbol: string;
  measurementUnit: string;
};

export type ConstructorParamsStruct = {
  askFee: FeeStruct;
  bidFee: FeeStruct;
  marginFee: FeeStruct;
  numberOfPeriodsPerDay: BigNumberish;
  periodDurationInMinutes: BigNumberish;
  periodsStartHour: BigNumberish;
  periodsStartMinute: BigNumberish;
  treasuryWallet: string;
  escrowWallet: string;
  resources: ResourceStruct[];
  sellers: string[];
  buyers: string[];
};

export type ConstructorParamsStructOutput = [
  FeeStructOutput,
  FeeStructOutput,
  FeeStructOutput,
  number,
  number,
  number,
  number,
  string,
  string,
  ResourceStructOutput[],
  string[],
  string[]
] & {
  askFee: FeeStructOutput;
  bidFee: FeeStructOutput;
  marginFee: FeeStructOutput;
  numberOfPeriodsPerDay: number;
  periodDurationInMinutes: number;
  periodsStartHour: number;
  periodsStartMinute: number;
  treasuryWallet: string;
  escrowWallet: string;
  resources: ResourceStructOutput[];
  sellers: string[];
  buyers: string[];
};

export interface ControllerInterface extends utils.Interface {
  functions: {
    "addBuyer(address)": FunctionFragment;
    "addSeller(address)": FunctionFragment;
    "askFee()": FunctionFragment;
    "bidFee()": FunctionFragment;
    "marginFee()": FunctionFragment;
    "numberOfPeriodsPerDay()": FunctionFragment;
    "periodDurationInMinutes()": FunctionFragment;
    "periodsStartHour()": FunctionFragment;
    "periodsStartMinute()": FunctionFragment;
    "removeBuyer(address)": FunctionFragment;
    "removeSeller(address)": FunctionFragment;
    "setEscrow(address)": FunctionFragment;
    "setOwner(address)": FunctionFragment;
    "setTreasury(address)": FunctionFragment;
    "test()": FunctionFragment;
  };

  getFunction(
    nameOrSignatureOrTopic:
      | "addBuyer"
      | "addSeller"
      | "askFee"
      | "bidFee"
      | "marginFee"
      | "numberOfPeriodsPerDay"
      | "periodDurationInMinutes"
      | "periodsStartHour"
      | "periodsStartMinute"
      | "removeBuyer"
      | "removeSeller"
      | "setEscrow"
      | "setOwner"
      | "setTreasury"
      | "test"
  ): FunctionFragment;

  encodeFunctionData(functionFragment: "addBuyer", values: [string]): string;
  encodeFunctionData(functionFragment: "addSeller", values: [string]): string;
  encodeFunctionData(functionFragment: "askFee", values?: undefined): string;
  encodeFunctionData(functionFragment: "bidFee", values?: undefined): string;
  encodeFunctionData(functionFragment: "marginFee", values?: undefined): string;
  encodeFunctionData(
    functionFragment: "numberOfPeriodsPerDay",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "periodDurationInMinutes",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "periodsStartHour",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "periodsStartMinute",
    values?: undefined
  ): string;
  encodeFunctionData(functionFragment: "removeBuyer", values: [string]): string;
  encodeFunctionData(
    functionFragment: "removeSeller",
    values: [string]
  ): string;
  encodeFunctionData(functionFragment: "setEscrow", values: [string]): string;
  encodeFunctionData(functionFragment: "setOwner", values: [string]): string;
  encodeFunctionData(functionFragment: "setTreasury", values: [string]): string;
  encodeFunctionData(functionFragment: "test", values?: undefined): string;

  decodeFunctionResult(functionFragment: "addBuyer", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "addSeller", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "askFee", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "bidFee", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "marginFee", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "numberOfPeriodsPerDay",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "periodDurationInMinutes",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "periodsStartHour",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "periodsStartMinute",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "removeBuyer",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "removeSeller",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "setEscrow", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "setOwner", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "setTreasury",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "test", data: BytesLike): Result;

  events: {};
}

export interface Controller extends BaseContract {
  connect(signerOrProvider: Signer | Provider | string): this;
  attach(addressOrName: string): this;
  deployed(): Promise<this>;

  interface: ControllerInterface;

  queryFilter<TEvent extends TypedEvent>(
    event: TypedEventFilter<TEvent>,
    fromBlockOrBlockhash?: string | number | undefined,
    toBlock?: string | number | undefined
  ): Promise<Array<TEvent>>;

  listeners<TEvent extends TypedEvent>(
    eventFilter?: TypedEventFilter<TEvent>
  ): Array<TypedListener<TEvent>>;
  listeners(eventName?: string): Array<Listener>;
  removeAllListeners<TEvent extends TypedEvent>(
    eventFilter: TypedEventFilter<TEvent>
  ): this;
  removeAllListeners(eventName?: string): this;
  off: OnEvent<this>;
  on: OnEvent<this>;
  once: OnEvent<this>;
  removeListener: OnEvent<this>;

  functions: {
    addBuyer(
      buyer: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    addSeller(
      seller: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    askFee(
      overrides?: CallOverrides
    ): Promise<
      [BigNumber, number, number, string, boolean] & {
        id: BigNumber;
        percentage: number;
        amount: number;
        feeType: string;
        cumulative: boolean;
      }
    >;

    bidFee(
      overrides?: CallOverrides
    ): Promise<
      [BigNumber, number, number, string, boolean] & {
        id: BigNumber;
        percentage: number;
        amount: number;
        feeType: string;
        cumulative: boolean;
      }
    >;

    marginFee(
      overrides?: CallOverrides
    ): Promise<
      [BigNumber, number, number, string, boolean] & {
        id: BigNumber;
        percentage: number;
        amount: number;
        feeType: string;
        cumulative: boolean;
      }
    >;

    numberOfPeriodsPerDay(overrides?: CallOverrides): Promise<[number]>;

    periodDurationInMinutes(overrides?: CallOverrides): Promise<[number]>;

    periodsStartHour(overrides?: CallOverrides): Promise<[number]>;

    periodsStartMinute(overrides?: CallOverrides): Promise<[number]>;

    removeBuyer(
      buyer: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    removeSeller(
      seller: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    setEscrow(
      newEscrow: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    setOwner(
      newOwner: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    setTreasury(
      newTreasury: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    test(overrides?: CallOverrides): Promise<[string]>;
  };

  addBuyer(
    buyer: string,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  addSeller(
    seller: string,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  askFee(
    overrides?: CallOverrides
  ): Promise<
    [BigNumber, number, number, string, boolean] & {
      id: BigNumber;
      percentage: number;
      amount: number;
      feeType: string;
      cumulative: boolean;
    }
  >;

  bidFee(
    overrides?: CallOverrides
  ): Promise<
    [BigNumber, number, number, string, boolean] & {
      id: BigNumber;
      percentage: number;
      amount: number;
      feeType: string;
      cumulative: boolean;
    }
  >;

  marginFee(
    overrides?: CallOverrides
  ): Promise<
    [BigNumber, number, number, string, boolean] & {
      id: BigNumber;
      percentage: number;
      amount: number;
      feeType: string;
      cumulative: boolean;
    }
  >;

  numberOfPeriodsPerDay(overrides?: CallOverrides): Promise<number>;

  periodDurationInMinutes(overrides?: CallOverrides): Promise<number>;

  periodsStartHour(overrides?: CallOverrides): Promise<number>;

  periodsStartMinute(overrides?: CallOverrides): Promise<number>;

  removeBuyer(
    buyer: string,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  removeSeller(
    seller: string,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  setEscrow(
    newEscrow: string,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  setOwner(
    newOwner: string,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  setTreasury(
    newTreasury: string,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  test(overrides?: CallOverrides): Promise<string>;

  callStatic: {
    addBuyer(buyer: string, overrides?: CallOverrides): Promise<void>;

    addSeller(seller: string, overrides?: CallOverrides): Promise<void>;

    askFee(
      overrides?: CallOverrides
    ): Promise<
      [BigNumber, number, number, string, boolean] & {
        id: BigNumber;
        percentage: number;
        amount: number;
        feeType: string;
        cumulative: boolean;
      }
    >;

    bidFee(
      overrides?: CallOverrides
    ): Promise<
      [BigNumber, number, number, string, boolean] & {
        id: BigNumber;
        percentage: number;
        amount: number;
        feeType: string;
        cumulative: boolean;
      }
    >;

    marginFee(
      overrides?: CallOverrides
    ): Promise<
      [BigNumber, number, number, string, boolean] & {
        id: BigNumber;
        percentage: number;
        amount: number;
        feeType: string;
        cumulative: boolean;
      }
    >;

    numberOfPeriodsPerDay(overrides?: CallOverrides): Promise<number>;

    periodDurationInMinutes(overrides?: CallOverrides): Promise<number>;

    periodsStartHour(overrides?: CallOverrides): Promise<number>;

    periodsStartMinute(overrides?: CallOverrides): Promise<number>;

    removeBuyer(buyer: string, overrides?: CallOverrides): Promise<void>;

    removeSeller(seller: string, overrides?: CallOverrides): Promise<void>;

    setEscrow(newEscrow: string, overrides?: CallOverrides): Promise<void>;

    setOwner(newOwner: string, overrides?: CallOverrides): Promise<void>;

    setTreasury(newTreasury: string, overrides?: CallOverrides): Promise<void>;

    test(overrides?: CallOverrides): Promise<string>;
  };

  filters: {};

  estimateGas: {
    addBuyer(
      buyer: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    addSeller(
      seller: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    askFee(overrides?: CallOverrides): Promise<BigNumber>;

    bidFee(overrides?: CallOverrides): Promise<BigNumber>;

    marginFee(overrides?: CallOverrides): Promise<BigNumber>;

    numberOfPeriodsPerDay(overrides?: CallOverrides): Promise<BigNumber>;

    periodDurationInMinutes(overrides?: CallOverrides): Promise<BigNumber>;

    periodsStartHour(overrides?: CallOverrides): Promise<BigNumber>;

    periodsStartMinute(overrides?: CallOverrides): Promise<BigNumber>;

    removeBuyer(
      buyer: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    removeSeller(
      seller: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    setEscrow(
      newEscrow: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    setOwner(
      newOwner: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    setTreasury(
      newTreasury: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    test(overrides?: CallOverrides): Promise<BigNumber>;
  };

  populateTransaction: {
    addBuyer(
      buyer: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    addSeller(
      seller: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    askFee(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    bidFee(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    marginFee(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    numberOfPeriodsPerDay(
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    periodDurationInMinutes(
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    periodsStartHour(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    periodsStartMinute(
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    removeBuyer(
      buyer: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    removeSeller(
      seller: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    setEscrow(
      newEscrow: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    setOwner(
      newOwner: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    setTreasury(
      newTreasury: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    test(overrides?: CallOverrides): Promise<PopulatedTransaction>;
  };
}
