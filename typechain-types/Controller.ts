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
  PayableOverrides,
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
  number,
  number,
  BigNumber,
  string,
  boolean,
  string[]
] & {
  id: number;
  percentage: number;
  amount: BigNumber;
  feeType: string;
  cumulative: boolean;
  noCombine: string[];
};

export type MarginFeeStruct = { id: BigNumberish; percentage: BigNumberish };

export type MarginFeeStructOutput = [number, number] & {
  id: number;
  percentage: number;
};

export type ResourceStruct = {
  id: BigNumberish;
  name: string;
  symbol: string;
  measurementUnit: string;
};

export type ResourceStructOutput = [number, string, string, string] & {
  id: number;
  name: string;
  symbol: string;
  measurementUnit: string;
};

export type ConstructorParamsStruct = {
  askFees: FeeStruct[];
  bidFees: FeeStruct[];
  marginFees: MarginFeeStruct[];
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
  FeeStructOutput[],
  FeeStructOutput[],
  MarginFeeStructOutput[],
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
  askFees: FeeStructOutput[];
  bidFees: FeeStructOutput[];
  marginFees: MarginFeeStructOutput[];
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

export type ResourceAskStruct = {
  id: BigNumberish;
  resourceId: BigNumberish;
  asker: string;
  units: BigNumberish;
  purity: BigNumberish;
  askPPU: BigNumberish;
  appliedFeeIds: BigNumberish[];
};

export type ResourceAskStructOutput = [
  number,
  number,
  string,
  number,
  number,
  BigNumber,
  number[]
] & {
  id: number;
  resourceId: number;
  asker: string;
  units: number;
  purity: number;
  askPPU: BigNumber;
  appliedFeeIds: number[];
};

export type ResourceBidStruct = {
  id: BigNumberish;
  bidder: string;
  resourceId: BigNumberish;
  units: BigNumberish;
  purity: BigNumberish;
  bidPPU: BigNumberish;
  appliedFeeIds: BigNumberish[];
  marginFeeId: BigNumberish;
};

export type ResourceBidStructOutput = [
  number,
  string,
  number,
  number,
  number,
  BigNumber,
  number[],
  number
] & {
  id: number;
  bidder: string;
  resourceId: number;
  units: number;
  purity: number;
  bidPPU: BigNumber;
  appliedFeeIds: number[];
  marginFeeId: number;
};

export interface ControllerInterface extends utils.Interface {
  functions: {
    "addBuyer(address)": FunctionFragment;
    "addSeller(address)": FunctionFragment;
    "askFees(uint256)": FunctionFragment;
    "bidFees(uint256)": FunctionFragment;
    "calculatePercentage(uint256,uint16)": FunctionFragment;
    "calculatePrice()": FunctionFragment;
    "getAsks(uint16)": FunctionFragment;
    "getBids(uint16)": FunctionFragment;
    "getBuyers()": FunctionFragment;
    "getResources()": FunctionFragment;
    "getSellers()": FunctionFragment;
    "lastPeriodId()": FunctionFragment;
    "marginFees(uint256)": FunctionFragment;
    "numberOfPeriodsPerDay()": FunctionFragment;
    "periodDurationInMinutes()": FunctionFragment;
    "periodsStartHour()": FunctionFragment;
    "periodsStartMinute()": FunctionFragment;
    "pickFees(bool)": FunctionFragment;
    "pickMarginFee(uint16,uint256)": FunctionFragment;
    "priceCalculations(bytes32)": FunctionFragment;
    "removeBuyer(address)": FunctionFragment;
    "removeSeller(address)": FunctionFragment;
    "resourceAsks(uint16,uint256)": FunctionFragment;
    "setEscrow(address)": FunctionFragment;
    "setOwner(address)": FunctionFragment;
    "setTreasury(address)": FunctionFragment;
    "submitAsk(uint16,uint16,uint16,uint256)": FunctionFragment;
    "submitBid(uint16,uint16,uint16,uint256)": FunctionFragment;
  };

  getFunction(
    nameOrSignatureOrTopic:
      | "addBuyer"
      | "addSeller"
      | "askFees"
      | "bidFees"
      | "calculatePercentage"
      | "calculatePrice"
      | "getAsks"
      | "getBids"
      | "getBuyers"
      | "getResources"
      | "getSellers"
      | "lastPeriodId"
      | "marginFees"
      | "numberOfPeriodsPerDay"
      | "periodDurationInMinutes"
      | "periodsStartHour"
      | "periodsStartMinute"
      | "pickFees"
      | "pickMarginFee"
      | "priceCalculations"
      | "removeBuyer"
      | "removeSeller"
      | "resourceAsks"
      | "setEscrow"
      | "setOwner"
      | "setTreasury"
      | "submitAsk"
      | "submitBid"
  ): FunctionFragment;

  encodeFunctionData(functionFragment: "addBuyer", values: [string]): string;
  encodeFunctionData(functionFragment: "addSeller", values: [string]): string;
  encodeFunctionData(
    functionFragment: "askFees",
    values: [BigNumberish]
  ): string;
  encodeFunctionData(
    functionFragment: "bidFees",
    values: [BigNumberish]
  ): string;
  encodeFunctionData(
    functionFragment: "calculatePercentage",
    values: [BigNumberish, BigNumberish]
  ): string;
  encodeFunctionData(
    functionFragment: "calculatePrice",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "getAsks",
    values: [BigNumberish]
  ): string;
  encodeFunctionData(
    functionFragment: "getBids",
    values: [BigNumberish]
  ): string;
  encodeFunctionData(functionFragment: "getBuyers", values?: undefined): string;
  encodeFunctionData(
    functionFragment: "getResources",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "getSellers",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "lastPeriodId",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "marginFees",
    values: [BigNumberish]
  ): string;
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
  encodeFunctionData(functionFragment: "pickFees", values: [boolean]): string;
  encodeFunctionData(
    functionFragment: "pickMarginFee",
    values: [BigNumberish, BigNumberish]
  ): string;
  encodeFunctionData(
    functionFragment: "priceCalculations",
    values: [BytesLike]
  ): string;
  encodeFunctionData(functionFragment: "removeBuyer", values: [string]): string;
  encodeFunctionData(
    functionFragment: "removeSeller",
    values: [string]
  ): string;
  encodeFunctionData(
    functionFragment: "resourceAsks",
    values: [BigNumberish, BigNumberish]
  ): string;
  encodeFunctionData(functionFragment: "setEscrow", values: [string]): string;
  encodeFunctionData(functionFragment: "setOwner", values: [string]): string;
  encodeFunctionData(functionFragment: "setTreasury", values: [string]): string;
  encodeFunctionData(
    functionFragment: "submitAsk",
    values: [BigNumberish, BigNumberish, BigNumberish, BigNumberish]
  ): string;
  encodeFunctionData(
    functionFragment: "submitBid",
    values: [BigNumberish, BigNumberish, BigNumberish, BigNumberish]
  ): string;

  decodeFunctionResult(functionFragment: "addBuyer", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "addSeller", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "askFees", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "bidFees", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "calculatePercentage",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "calculatePrice",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "getAsks", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "getBids", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "getBuyers", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "getResources",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "getSellers", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "lastPeriodId",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "marginFees", data: BytesLike): Result;
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
  decodeFunctionResult(functionFragment: "pickFees", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "pickMarginFee",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "priceCalculations",
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
  decodeFunctionResult(
    functionFragment: "resourceAsks",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "setEscrow", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "setOwner", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "setTreasury",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "submitAsk", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "submitBid", data: BytesLike): Result;

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

    askFees(
      arg0: BigNumberish,
      overrides?: CallOverrides
    ): Promise<
      [number, number, BigNumber, string, boolean] & {
        id: number;
        percentage: number;
        amount: BigNumber;
        feeType: string;
        cumulative: boolean;
      }
    >;

    bidFees(
      arg0: BigNumberish,
      overrides?: CallOverrides
    ): Promise<
      [number, number, BigNumber, string, boolean] & {
        id: number;
        percentage: number;
        amount: BigNumber;
        feeType: string;
        cumulative: boolean;
      }
    >;

    calculatePercentage(
      theNumber: BigNumberish,
      percentage: BigNumberish,
      overrides?: CallOverrides
    ): Promise<[BigNumber]>;

    calculatePrice(
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    getAsks(
      periodId: BigNumberish,
      overrides?: CallOverrides
    ): Promise<[ResourceAskStructOutput[]]>;

    getBids(
      periodId: BigNumberish,
      overrides?: CallOverrides
    ): Promise<[ResourceBidStructOutput[]]>;

    getBuyers(overrides?: CallOverrides): Promise<[string[]]>;

    getResources(overrides?: CallOverrides): Promise<[ResourceStructOutput[]]>;

    getSellers(overrides?: CallOverrides): Promise<[string[]]>;

    lastPeriodId(overrides?: CallOverrides): Promise<[number]>;

    marginFees(
      arg0: BigNumberish,
      overrides?: CallOverrides
    ): Promise<[number, number] & { id: number; percentage: number }>;

    numberOfPeriodsPerDay(overrides?: CallOverrides): Promise<[number]>;

    periodDurationInMinutes(overrides?: CallOverrides): Promise<[number]>;

    periodsStartHour(overrides?: CallOverrides): Promise<[number]>;

    periodsStartMinute(overrides?: CallOverrides): Promise<[number]>;

    pickFees(
      isAsk: boolean,
      overrides?: CallOverrides
    ): Promise<[FeeStructOutput[]]>;

    pickMarginFee(
      resourceId: BigNumberish,
      amount: BigNumberish,
      overrides?: CallOverrides
    ): Promise<[MarginFeeStructOutput]>;

    priceCalculations(
      arg0: BytesLike,
      overrides?: CallOverrides
    ): Promise<[BigNumber]>;

    removeBuyer(
      buyer: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    removeSeller(
      seller: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    resourceAsks(
      arg0: BigNumberish,
      arg1: BigNumberish,
      overrides?: CallOverrides
    ): Promise<
      [number, number, string, number, number, BigNumber] & {
        id: number;
        resourceId: number;
        asker: string;
        units: number;
        purity: number;
        askPPU: BigNumber;
      }
    >;

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

    submitAsk(
      resourceId: BigNumberish,
      units: BigNumberish,
      purity: BigNumberish,
      askPPU: BigNumberish,
      overrides?: PayableOverrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    submitBid(
      resourceId: BigNumberish,
      units: BigNumberish,
      purity: BigNumberish,
      bidPPU: BigNumberish,
      overrides?: PayableOverrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;
  };

  addBuyer(
    buyer: string,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  addSeller(
    seller: string,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  askFees(
    arg0: BigNumberish,
    overrides?: CallOverrides
  ): Promise<
    [number, number, BigNumber, string, boolean] & {
      id: number;
      percentage: number;
      amount: BigNumber;
      feeType: string;
      cumulative: boolean;
    }
  >;

  bidFees(
    arg0: BigNumberish,
    overrides?: CallOverrides
  ): Promise<
    [number, number, BigNumber, string, boolean] & {
      id: number;
      percentage: number;
      amount: BigNumber;
      feeType: string;
      cumulative: boolean;
    }
  >;

  calculatePercentage(
    theNumber: BigNumberish,
    percentage: BigNumberish,
    overrides?: CallOverrides
  ): Promise<BigNumber>;

  calculatePrice(
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  getAsks(
    periodId: BigNumberish,
    overrides?: CallOverrides
  ): Promise<ResourceAskStructOutput[]>;

  getBids(
    periodId: BigNumberish,
    overrides?: CallOverrides
  ): Promise<ResourceBidStructOutput[]>;

  getBuyers(overrides?: CallOverrides): Promise<string[]>;

  getResources(overrides?: CallOverrides): Promise<ResourceStructOutput[]>;

  getSellers(overrides?: CallOverrides): Promise<string[]>;

  lastPeriodId(overrides?: CallOverrides): Promise<number>;

  marginFees(
    arg0: BigNumberish,
    overrides?: CallOverrides
  ): Promise<[number, number] & { id: number; percentage: number }>;

  numberOfPeriodsPerDay(overrides?: CallOverrides): Promise<number>;

  periodDurationInMinutes(overrides?: CallOverrides): Promise<number>;

  periodsStartHour(overrides?: CallOverrides): Promise<number>;

  periodsStartMinute(overrides?: CallOverrides): Promise<number>;

  pickFees(
    isAsk: boolean,
    overrides?: CallOverrides
  ): Promise<FeeStructOutput[]>;

  pickMarginFee(
    resourceId: BigNumberish,
    amount: BigNumberish,
    overrides?: CallOverrides
  ): Promise<MarginFeeStructOutput>;

  priceCalculations(
    arg0: BytesLike,
    overrides?: CallOverrides
  ): Promise<BigNumber>;

  removeBuyer(
    buyer: string,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  removeSeller(
    seller: string,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  resourceAsks(
    arg0: BigNumberish,
    arg1: BigNumberish,
    overrides?: CallOverrides
  ): Promise<
    [number, number, string, number, number, BigNumber] & {
      id: number;
      resourceId: number;
      asker: string;
      units: number;
      purity: number;
      askPPU: BigNumber;
    }
  >;

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

  submitAsk(
    resourceId: BigNumberish,
    units: BigNumberish,
    purity: BigNumberish,
    askPPU: BigNumberish,
    overrides?: PayableOverrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  submitBid(
    resourceId: BigNumberish,
    units: BigNumberish,
    purity: BigNumberish,
    bidPPU: BigNumberish,
    overrides?: PayableOverrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  callStatic: {
    addBuyer(buyer: string, overrides?: CallOverrides): Promise<void>;

    addSeller(seller: string, overrides?: CallOverrides): Promise<void>;

    askFees(
      arg0: BigNumberish,
      overrides?: CallOverrides
    ): Promise<
      [number, number, BigNumber, string, boolean] & {
        id: number;
        percentage: number;
        amount: BigNumber;
        feeType: string;
        cumulative: boolean;
      }
    >;

    bidFees(
      arg0: BigNumberish,
      overrides?: CallOverrides
    ): Promise<
      [number, number, BigNumber, string, boolean] & {
        id: number;
        percentage: number;
        amount: BigNumber;
        feeType: string;
        cumulative: boolean;
      }
    >;

    calculatePercentage(
      theNumber: BigNumberish,
      percentage: BigNumberish,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    calculatePrice(overrides?: CallOverrides): Promise<void>;

    getAsks(
      periodId: BigNumberish,
      overrides?: CallOverrides
    ): Promise<ResourceAskStructOutput[]>;

    getBids(
      periodId: BigNumberish,
      overrides?: CallOverrides
    ): Promise<ResourceBidStructOutput[]>;

    getBuyers(overrides?: CallOverrides): Promise<string[]>;

    getResources(overrides?: CallOverrides): Promise<ResourceStructOutput[]>;

    getSellers(overrides?: CallOverrides): Promise<string[]>;

    lastPeriodId(overrides?: CallOverrides): Promise<number>;

    marginFees(
      arg0: BigNumberish,
      overrides?: CallOverrides
    ): Promise<[number, number] & { id: number; percentage: number }>;

    numberOfPeriodsPerDay(overrides?: CallOverrides): Promise<number>;

    periodDurationInMinutes(overrides?: CallOverrides): Promise<number>;

    periodsStartHour(overrides?: CallOverrides): Promise<number>;

    periodsStartMinute(overrides?: CallOverrides): Promise<number>;

    pickFees(
      isAsk: boolean,
      overrides?: CallOverrides
    ): Promise<FeeStructOutput[]>;

    pickMarginFee(
      resourceId: BigNumberish,
      amount: BigNumberish,
      overrides?: CallOverrides
    ): Promise<MarginFeeStructOutput>;

    priceCalculations(
      arg0: BytesLike,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    removeBuyer(buyer: string, overrides?: CallOverrides): Promise<void>;

    removeSeller(seller: string, overrides?: CallOverrides): Promise<void>;

    resourceAsks(
      arg0: BigNumberish,
      arg1: BigNumberish,
      overrides?: CallOverrides
    ): Promise<
      [number, number, string, number, number, BigNumber] & {
        id: number;
        resourceId: number;
        asker: string;
        units: number;
        purity: number;
        askPPU: BigNumber;
      }
    >;

    setEscrow(newEscrow: string, overrides?: CallOverrides): Promise<void>;

    setOwner(newOwner: string, overrides?: CallOverrides): Promise<void>;

    setTreasury(newTreasury: string, overrides?: CallOverrides): Promise<void>;

    submitAsk(
      resourceId: BigNumberish,
      units: BigNumberish,
      purity: BigNumberish,
      askPPU: BigNumberish,
      overrides?: CallOverrides
    ): Promise<void>;

    submitBid(
      resourceId: BigNumberish,
      units: BigNumberish,
      purity: BigNumberish,
      bidPPU: BigNumberish,
      overrides?: CallOverrides
    ): Promise<void>;
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

    askFees(arg0: BigNumberish, overrides?: CallOverrides): Promise<BigNumber>;

    bidFees(arg0: BigNumberish, overrides?: CallOverrides): Promise<BigNumber>;

    calculatePercentage(
      theNumber: BigNumberish,
      percentage: BigNumberish,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    calculatePrice(
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    getAsks(
      periodId: BigNumberish,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    getBids(
      periodId: BigNumberish,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    getBuyers(overrides?: CallOverrides): Promise<BigNumber>;

    getResources(overrides?: CallOverrides): Promise<BigNumber>;

    getSellers(overrides?: CallOverrides): Promise<BigNumber>;

    lastPeriodId(overrides?: CallOverrides): Promise<BigNumber>;

    marginFees(
      arg0: BigNumberish,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    numberOfPeriodsPerDay(overrides?: CallOverrides): Promise<BigNumber>;

    periodDurationInMinutes(overrides?: CallOverrides): Promise<BigNumber>;

    periodsStartHour(overrides?: CallOverrides): Promise<BigNumber>;

    periodsStartMinute(overrides?: CallOverrides): Promise<BigNumber>;

    pickFees(isAsk: boolean, overrides?: CallOverrides): Promise<BigNumber>;

    pickMarginFee(
      resourceId: BigNumberish,
      amount: BigNumberish,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    priceCalculations(
      arg0: BytesLike,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    removeBuyer(
      buyer: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    removeSeller(
      seller: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    resourceAsks(
      arg0: BigNumberish,
      arg1: BigNumberish,
      overrides?: CallOverrides
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

    submitAsk(
      resourceId: BigNumberish,
      units: BigNumberish,
      purity: BigNumberish,
      askPPU: BigNumberish,
      overrides?: PayableOverrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    submitBid(
      resourceId: BigNumberish,
      units: BigNumberish,
      purity: BigNumberish,
      bidPPU: BigNumberish,
      overrides?: PayableOverrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;
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

    askFees(
      arg0: BigNumberish,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    bidFees(
      arg0: BigNumberish,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    calculatePercentage(
      theNumber: BigNumberish,
      percentage: BigNumberish,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    calculatePrice(
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    getAsks(
      periodId: BigNumberish,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    getBids(
      periodId: BigNumberish,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    getBuyers(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    getResources(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    getSellers(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    lastPeriodId(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    marginFees(
      arg0: BigNumberish,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

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

    pickFees(
      isAsk: boolean,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    pickMarginFee(
      resourceId: BigNumberish,
      amount: BigNumberish,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    priceCalculations(
      arg0: BytesLike,
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

    resourceAsks(
      arg0: BigNumberish,
      arg1: BigNumberish,
      overrides?: CallOverrides
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

    submitAsk(
      resourceId: BigNumberish,
      units: BigNumberish,
      purity: BigNumberish,
      askPPU: BigNumberish,
      overrides?: PayableOverrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    submitBid(
      resourceId: BigNumberish,
      units: BigNumberish,
      purity: BigNumberish,
      bidPPU: BigNumberish,
      overrides?: PayableOverrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;
  };
}
