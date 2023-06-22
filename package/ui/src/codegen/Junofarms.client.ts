/**
 * This file was automatically generated by @cosmwasm/ts-codegen@0.30.0.
 * DO NOT MODIFY IT BY HAND. Instead, modify the source JSONSchema file,
 * and run the @cosmwasm/ts-codegen generate command to regenerate this file.
 */

import {
  CosmWasmClient,
  SigningCosmWasmClient,
  ExecuteResult,
} from "@cosmjs/cosmwasm-stargate";
import { Coin, StdFee } from "@cosmjs/amino";
import {
  Addr,
  InstantiateMsg,
  ExecuteMsg,
  Binary,
  Cw721ReceiveMsg,
  QueryMsg,
  ContractInformationResponse,
  PlantType,
  SlotType,
  FarmProfile,
  Slot,
  Plant,
} from "./Junofarms.types";
export interface JunofarmsReadOnlyInterface {
  contractAddress: string;
  contractInfo: () => Promise<ContractInformationResponse>;
  getFarmProfile: ({ address }: { address: string }) => Promise<FarmProfile>;
}
export class JunofarmsQueryClient implements JunofarmsReadOnlyInterface {
  client: CosmWasmClient;
  contractAddress: string;

  constructor(client: CosmWasmClient, contractAddress: string) {
    this.client = client;
    this.contractAddress = contractAddress;
    this.contractInfo = this.contractInfo.bind(this);
    this.getFarmProfile = this.getFarmProfile.bind(this);
  }

  contractInfo = async (): Promise<ContractInformationResponse> => {
    return this.client.queryContractSmart(this.contractAddress, {
      contract_info: {},
    });
  };
  getFarmProfile = async ({
    address,
  }: {
    address: string;
  }): Promise<FarmProfile> => {
    return this.client.queryContractSmart(this.contractAddress, {
      get_farm_profile: {
        address,
      },
    });
  };
}
export interface JunofarmsInterface extends JunofarmsReadOnlyInterface {
  contractAddress: string;
  sender: string;
  start: (
    fee?: number | StdFee | "auto",
    memo?: string,
    _funds?: Coin[]
  ) => Promise<ExecuteResult>;
  stop: (
    fee?: number | StdFee | "auto",
    memo?: string,
    _funds?: Coin[]
  ) => Promise<ExecuteResult>;
  tillGround: (
    {
      x,
      y,
    }: {
      x: number;
      y: number;
    },
    fee?: number | StdFee | "auto",
    memo?: string,
    _funds?: Coin[]
  ) => Promise<ExecuteResult>;
  plantSeed: (
    {
      x,
      y,
    }: {
      x: number;
      y: number;
    },
    fee?: number | StdFee | "auto",
    memo?: string,
    _funds?: Coin[]
  ) => Promise<ExecuteResult>;
  waterPlant: (
    {
      x,
      y,
    }: {
      x: number;
      y: number;
    },
    fee?: number | StdFee | "auto",
    memo?: string,
    _funds?: Coin[]
  ) => Promise<ExecuteResult>;
  receive: (
    {
      msg,
      sender,
      tokenId,
    }: {
      msg: Binary;
      sender: string;
      tokenId: string;
    },
    fee?: number | StdFee | "auto",
    memo?: string,
    _funds?: Coin[]
  ) => Promise<ExecuteResult>;
}
export class JunofarmsClient
  extends JunofarmsQueryClient
  implements JunofarmsInterface
{
  client: SigningCosmWasmClient;
  sender: string;
  contractAddress: string;

  constructor(
    client: SigningCosmWasmClient,
    sender: string,
    contractAddress: string
  ) {
    super(client, contractAddress);
    this.client = client;
    this.sender = sender;
    this.contractAddress = contractAddress;
    this.start = this.start.bind(this);
    this.stop = this.stop.bind(this);
    this.tillGround = this.tillGround.bind(this);
    this.plantSeed = this.plantSeed.bind(this);
    this.waterPlant = this.waterPlant.bind(this);
    this.receive = this.receive.bind(this);
  }

  start = async (
    fee: number | StdFee | "auto" = "auto",
    memo?: string,
    _funds?: Coin[]
  ): Promise<ExecuteResult> => {
    return await this.client.execute(
      this.sender,
      this.contractAddress,
      {
        start: {},
      },
      fee,
      memo,
      _funds
    );
  };
  stop = async (
    fee: number | StdFee | "auto" = "auto",
    memo?: string,
    _funds?: Coin[]
  ): Promise<ExecuteResult> => {
    return await this.client.execute(
      this.sender,
      this.contractAddress,
      {
        stop: {},
      },
      fee,
      memo,
      _funds
    );
  };
  tillGround = async (
    {
      x,
      y,
    }: {
      x: number;
      y: number;
    },
    fee: number | StdFee | "auto" = "auto",
    memo?: string,
    _funds?: Coin[]
  ): Promise<ExecuteResult> => {
    return await this.client.execute(
      this.sender,
      this.contractAddress,
      {
        till_ground: {
          x,
          y,
        },
      },
      fee,
      memo,
      _funds
    );
  };
  plantSeed = async (
    {
      x,
      y,
    }: {
      x: number;
      y: number;
    },
    fee: number | StdFee | "auto" = "auto",
    memo?: string,
    _funds?: Coin[]
  ): Promise<ExecuteResult> => {
    return await this.client.execute(
      this.sender,
      this.contractAddress,
      {
        plant_seed: {
          x,
          y,
        },
      },
      fee,
      memo,
      _funds
    );
  };
  waterPlant = async (
    {
      x,
      y,
    }: {
      x: number;
      y: number;
    },
    fee: number | StdFee | "auto" = "auto",
    memo?: string,
    _funds?: Coin[]
  ): Promise<ExecuteResult> => {
    return await this.client.execute(
      this.sender,
      this.contractAddress,
      {
        water_plant: {
          x,
          y,
        },
      },
      fee,
      memo,
      _funds
    );
  };
  receive = async (
    {
      msg,
      sender,
      tokenId,
    }: {
      msg: Binary;
      sender: string;
      tokenId: string;
    },
    fee: number | StdFee | "auto" = "auto",
    memo?: string,
    _funds?: Coin[]
  ): Promise<ExecuteResult> => {
    return await this.client.execute(
      this.sender,
      this.contractAddress,
      {
        receive: {
          msg,
          sender,
          token_id: tokenId,
        },
      },
      fee,
      memo,
      _funds
    );
  };
}
