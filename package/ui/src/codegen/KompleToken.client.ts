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
  Timestamp,
  Uint64,
  Collections,
  Metadata,
  InstantiateMsg,
  CollectionConfig,
  MetadataInfo,
  InstantiateMsg1,
  TokenInfo,
  ExecuteMsg,
  Binary,
  Locks,
  WhitelistConfig,
  QueryMsg,
  MigrateMsg,
  Addr,
  ResponseWrapperForConfig,
  Config,
  ResponseWrapperForLocks,
  ResponseWrapperForUint32,
  ResponseWrapperForArrayOfString,
  ResponseWrapperForSubModules,
  SubModules,
} from "./KompleToken.types";
export interface KompleTokenReadOnlyInterface {
  contractAddress: string;
  locks: () => Promise<ResponseWrapperForLocks>;
  tokenLocks: ({
    tokenId,
  }: {
    tokenId: string;
  }) => Promise<ResponseWrapperForLocks>;
  mintedTokensPerAddress: ({
    address,
  }: {
    address: string;
  }) => Promise<ResponseWrapperForUint32>;
  subModules: () => Promise<ResponseWrapperForSubModules>;
  config: () => Promise<ResponseWrapperForConfig>;
  moduleOperators: () => Promise<ResponseWrapperForArrayOfString>;
}
export class KompleTokenQueryClient implements KompleTokenReadOnlyInterface {
  client: CosmWasmClient;
  contractAddress: string;

  constructor(client: CosmWasmClient, contractAddress: string) {
    this.client = client;
    this.contractAddress = contractAddress;
    this.locks = this.locks.bind(this);
    this.tokenLocks = this.tokenLocks.bind(this);
    this.mintedTokensPerAddress = this.mintedTokensPerAddress.bind(this);
    this.subModules = this.subModules.bind(this);
    this.config = this.config.bind(this);
    this.moduleOperators = this.moduleOperators.bind(this);
  }

  locks = async (): Promise<ResponseWrapperForLocks> => {
    return this.client.queryContractSmart(this.contractAddress, {
      locks: {},
    });
  };
  tokenLocks = async ({
    tokenId,
  }: {
    tokenId: string;
  }): Promise<ResponseWrapperForLocks> => {
    return this.client.queryContractSmart(this.contractAddress, {
      token_locks: {
        token_id: tokenId,
      },
    });
  };
  mintedTokensPerAddress = async ({
    address,
  }: {
    address: string;
  }): Promise<ResponseWrapperForUint32> => {
    return this.client.queryContractSmart(this.contractAddress, {
      minted_tokens_per_address: {
        address,
      },
    });
  };
  subModules = async (): Promise<ResponseWrapperForSubModules> => {
    return this.client.queryContractSmart(this.contractAddress, {
      sub_modules: {},
    });
  };
  config = async (): Promise<ResponseWrapperForConfig> => {
    return this.client.queryContractSmart(this.contractAddress, {
      config: {},
    });
  };
  moduleOperators = async (): Promise<ResponseWrapperForArrayOfString> => {
    return this.client.queryContractSmart(this.contractAddress, {
      module_operators: {},
    });
  };
}
export interface KompleTokenInterface extends KompleTokenReadOnlyInterface {
  contractAddress: string;
  sender: string;
  transferNft: (
    {
      recipient,
      tokenId,
    }: {
      recipient: string;
      tokenId: string;
    },
    fee?: number | StdFee | "auto",
    memo?: string,
    _funds?: Coin[]
  ) => Promise<ExecuteResult>;
  sendNft: (
    {
      contract,
      msg,
      tokenId,
    }: {
      contract: string;
      msg: Binary;
      tokenId: string;
    },
    fee?: number | StdFee | "auto",
    memo?: string,
    _funds?: Coin[]
  ) => Promise<ExecuteResult>;
  mint: (
    {
      metadataId,
      owner,
    }: {
      metadataId?: number;
      owner: string;
    },
    fee?: number | StdFee | "auto",
    memo?: string,
    _funds?: Coin[]
  ) => Promise<ExecuteResult>;
  burn: (
    {
      tokenId,
    }: {
      tokenId: string;
    },
    fee?: number | StdFee | "auto",
    memo?: string,
    _funds?: Coin[]
  ) => Promise<ExecuteResult>;
  updateModuleOperators: (
    {
      addrs,
    }: {
      addrs: string[];
    },
    fee?: number | StdFee | "auto",
    memo?: string,
    _funds?: Coin[]
  ) => Promise<ExecuteResult>;
  adminTransferNft: (
    {
      recipient,
      tokenId,
    }: {
      recipient: string;
      tokenId: string;
    },
    fee?: number | StdFee | "auto",
    memo?: string,
    _funds?: Coin[]
  ) => Promise<ExecuteResult>;
  updateLocks: (
    {
      locks,
    }: {
      locks: Locks;
    },
    fee?: number | StdFee | "auto",
    memo?: string,
    _funds?: Coin[]
  ) => Promise<ExecuteResult>;
  updateTokenLocks: (
    {
      locks,
      tokenId,
    }: {
      locks: Locks;
      tokenId: string;
    },
    fee?: number | StdFee | "auto",
    memo?: string,
    _funds?: Coin[]
  ) => Promise<ExecuteResult>;
  updateCollectionConfig: (
    {
      collectionConfig,
    }: {
      collectionConfig: CollectionConfig;
    },
    fee?: number | StdFee | "auto",
    memo?: string,
    _funds?: Coin[]
  ) => Promise<ExecuteResult>;
  initWhitelistContract: (
    {
      codeId,
      instantiateMsg,
    }: {
      codeId: number;
      instantiateMsg: InstantiateMsg;
    },
    fee?: number | StdFee | "auto",
    memo?: string,
    _funds?: Coin[]
  ) => Promise<ExecuteResult>;
}
export class KompleTokenClient
  extends KompleTokenQueryClient
  implements KompleTokenInterface
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
    this.transferNft = this.transferNft.bind(this);
    this.sendNft = this.sendNft.bind(this);
    this.mint = this.mint.bind(this);
    this.burn = this.burn.bind(this);
    this.updateModuleOperators = this.updateModuleOperators.bind(this);
    this.adminTransferNft = this.adminTransferNft.bind(this);
    this.updateLocks = this.updateLocks.bind(this);
    this.updateTokenLocks = this.updateTokenLocks.bind(this);
    this.updateCollectionConfig = this.updateCollectionConfig.bind(this);
    this.initWhitelistContract = this.initWhitelistContract.bind(this);
  }

  transferNft = async (
    {
      recipient,
      tokenId,
    }: {
      recipient: string;
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
        transfer_nft: {
          recipient,
          token_id: tokenId,
        },
      },
      fee,
      memo,
      _funds
    );
  };
  sendNft = async (
    {
      contract,
      msg,
      tokenId,
    }: {
      contract: string;
      msg: Binary;
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
        send_nft: {
          contract,
          msg,
          token_id: tokenId,
        },
      },
      fee,
      memo,
      _funds
    );
  };
  mint = async (
    {
      metadataId,
      owner,
    }: {
      metadataId?: number;
      owner: string;
    },
    fee: number | StdFee | "auto" = "auto",
    memo?: string,
    _funds?: Coin[]
  ): Promise<ExecuteResult> => {
    return await this.client.execute(
      this.sender,
      this.contractAddress,
      {
        mint: {
          metadata_id: metadataId,
          owner,
        },
      },
      fee,
      memo,
      _funds
    );
  };
  burn = async (
    {
      tokenId,
    }: {
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
        burn: {
          token_id: tokenId,
        },
      },
      fee,
      memo,
      _funds
    );
  };
  updateModuleOperators = async (
    {
      addrs,
    }: {
      addrs: string[];
    },
    fee: number | StdFee | "auto" = "auto",
    memo?: string,
    _funds?: Coin[]
  ): Promise<ExecuteResult> => {
    return await this.client.execute(
      this.sender,
      this.contractAddress,
      {
        update_module_operators: {
          addrs,
        },
      },
      fee,
      memo,
      _funds
    );
  };
  adminTransferNft = async (
    {
      recipient,
      tokenId,
    }: {
      recipient: string;
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
        admin_transfer_nft: {
          recipient,
          token_id: tokenId,
        },
      },
      fee,
      memo,
      _funds
    );
  };
  updateLocks = async (
    {
      locks,
    }: {
      locks: Locks;
    },
    fee: number | StdFee | "auto" = "auto",
    memo?: string,
    _funds?: Coin[]
  ): Promise<ExecuteResult> => {
    return await this.client.execute(
      this.sender,
      this.contractAddress,
      {
        update_locks: {
          locks,
        },
      },
      fee,
      memo,
      _funds
    );
  };
  updateTokenLocks = async (
    {
      locks,
      tokenId,
    }: {
      locks: Locks;
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
        update_token_locks: {
          locks,
          token_id: tokenId,
        },
      },
      fee,
      memo,
      _funds
    );
  };
  updateCollectionConfig = async (
    {
      collectionConfig,
    }: {
      collectionConfig: CollectionConfig;
    },
    fee: number | StdFee | "auto" = "auto",
    memo?: string,
    _funds?: Coin[]
  ): Promise<ExecuteResult> => {
    return await this.client.execute(
      this.sender,
      this.contractAddress,
      {
        update_collection_config: {
          collection_config: collectionConfig,
        },
      },
      fee,
      memo,
      _funds
    );
  };
  initWhitelistContract = async (
    {
      codeId,
      instantiateMsg,
    }: {
      codeId: number;
      instantiateMsg: InstantiateMsg;
    },
    fee: number | StdFee | "auto" = "auto",
    memo?: string,
    _funds?: Coin[]
  ): Promise<ExecuteResult> => {
    return await this.client.execute(
      this.sender,
      this.contractAddress,
      {
        init_whitelist_contract: {
          code_id: codeId,
          instantiate_msg: instantiateMsg,
        },
      },
      fee,
      memo,
      _funds
    );
  };
}
