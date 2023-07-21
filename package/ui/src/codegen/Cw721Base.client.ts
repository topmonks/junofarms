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
  InstantiateMsg,
  ExecuteMsg,
  Binary,
  Expiration,
  Timestamp,
  Uint64,
  Action,
  Empty,
  QueryMsg,
  AllNftInfoResponseForEmpty,
  OwnerOfResponse,
  Approval,
  NftInfoResponseForEmpty,
  OperatorsResponse,
  TokensResponse,
  ApprovalResponse,
  ApprovalsResponse,
  ContractInfoResponse,
  Null,
  MinterResponse,
  NumTokensResponse,
  OperatorResponse,
  OwnershipForString,
} from "./Cw721Base.types";
export interface Cw721BaseReadOnlyInterface {
  contractAddress: string;
  ownerOf: ({
    includeExpired,
    tokenId,
  }: {
    includeExpired?: boolean;
    tokenId: string;
  }) => Promise<OwnerOfResponse>;
  approval: ({
    includeExpired,
    spender,
    tokenId,
  }: {
    includeExpired?: boolean;
    spender: string;
    tokenId: string;
  }) => Promise<ApprovalResponse>;
  approvals: ({
    includeExpired,
    tokenId,
  }: {
    includeExpired?: boolean;
    tokenId: string;
  }) => Promise<ApprovalsResponse>;
  operator: ({
    includeExpired,
    operator,
    owner,
  }: {
    includeExpired?: boolean;
    operator: string;
    owner: string;
  }) => Promise<OperatorResponse>;
  allOperators: ({
    includeExpired,
    limit,
    owner,
    startAfter,
  }: {
    includeExpired?: boolean;
    limit?: number;
    owner: string;
    startAfter?: string;
  }) => Promise<OperatorsResponse>;
  numTokens: () => Promise<NumTokensResponse>;
  contractInfo: () => Promise<ContractInfoResponse>;
  nftInfo: ({
    tokenId,
  }: {
    tokenId: string;
  }) => Promise<NftInfoResponseForEmpty>;
  allNftInfo: ({
    includeExpired,
    tokenId,
  }: {
    includeExpired?: boolean;
    tokenId: string;
  }) => Promise<AllNftInfoResponseForEmpty>;
  tokens: ({
    limit,
    owner,
    startAfter,
  }: {
    limit?: number;
    owner: string;
    startAfter?: string;
  }) => Promise<TokensResponse>;
  allTokens: ({
    limit,
    startAfter,
  }: {
    limit?: number;
    startAfter?: string;
  }) => Promise<TokensResponse>;
  minter: () => Promise<MinterResponse>;
  extension: ({ msg }: { msg: Empty }) => Promise<Null>;
  ownership: () => Promise<OwnershipForString>;
}
export class Cw721BaseQueryClient implements Cw721BaseReadOnlyInterface {
  client: CosmWasmClient;
  contractAddress: string;

  constructor(client: CosmWasmClient, contractAddress: string) {
    this.client = client;
    this.contractAddress = contractAddress;
    this.ownerOf = this.ownerOf.bind(this);
    this.approval = this.approval.bind(this);
    this.approvals = this.approvals.bind(this);
    this.operator = this.operator.bind(this);
    this.allOperators = this.allOperators.bind(this);
    this.numTokens = this.numTokens.bind(this);
    this.contractInfo = this.contractInfo.bind(this);
    this.nftInfo = this.nftInfo.bind(this);
    this.allNftInfo = this.allNftInfo.bind(this);
    this.tokens = this.tokens.bind(this);
    this.allTokens = this.allTokens.bind(this);
    this.minter = this.minter.bind(this);
    this.extension = this.extension.bind(this);
    this.ownership = this.ownership.bind(this);
  }

  ownerOf = async ({
    includeExpired,
    tokenId,
  }: {
    includeExpired?: boolean;
    tokenId: string;
  }): Promise<OwnerOfResponse> => {
    return this.client.queryContractSmart(this.contractAddress, {
      owner_of: {
        include_expired: includeExpired,
        token_id: tokenId,
      },
    });
  };
  approval = async ({
    includeExpired,
    spender,
    tokenId,
  }: {
    includeExpired?: boolean;
    spender: string;
    tokenId: string;
  }): Promise<ApprovalResponse> => {
    return this.client.queryContractSmart(this.contractAddress, {
      approval: {
        include_expired: includeExpired,
        spender,
        token_id: tokenId,
      },
    });
  };
  approvals = async ({
    includeExpired,
    tokenId,
  }: {
    includeExpired?: boolean;
    tokenId: string;
  }): Promise<ApprovalsResponse> => {
    return this.client.queryContractSmart(this.contractAddress, {
      approvals: {
        include_expired: includeExpired,
        token_id: tokenId,
      },
    });
  };
  operator = async ({
    includeExpired,
    operator,
    owner,
  }: {
    includeExpired?: boolean;
    operator: string;
    owner: string;
  }): Promise<OperatorResponse> => {
    return this.client.queryContractSmart(this.contractAddress, {
      operator: {
        include_expired: includeExpired,
        operator,
        owner,
      },
    });
  };
  allOperators = async ({
    includeExpired,
    limit,
    owner,
    startAfter,
  }: {
    includeExpired?: boolean;
    limit?: number;
    owner: string;
    startAfter?: string;
  }): Promise<OperatorsResponse> => {
    return this.client.queryContractSmart(this.contractAddress, {
      all_operators: {
        include_expired: includeExpired,
        limit,
        owner,
        start_after: startAfter,
      },
    });
  };
  numTokens = async (): Promise<NumTokensResponse> => {
    return this.client.queryContractSmart(this.contractAddress, {
      num_tokens: {},
    });
  };
  contractInfo = async (): Promise<ContractInfoResponse> => {
    return this.client.queryContractSmart(this.contractAddress, {
      contract_info: {},
    });
  };
  nftInfo = async ({
    tokenId,
  }: {
    tokenId: string;
  }): Promise<NftInfoResponseForEmpty> => {
    return this.client.queryContractSmart(this.contractAddress, {
      nft_info: {
        token_id: tokenId,
      },
    });
  };
  allNftInfo = async ({
    includeExpired,
    tokenId,
  }: {
    includeExpired?: boolean;
    tokenId: string;
  }): Promise<AllNftInfoResponseForEmpty> => {
    return this.client.queryContractSmart(this.contractAddress, {
      all_nft_info: {
        include_expired: includeExpired,
        token_id: tokenId,
      },
    });
  };
  tokens = async ({
    limit,
    owner,
    startAfter,
  }: {
    limit?: number;
    owner: string;
    startAfter?: string;
  }): Promise<TokensResponse> => {
    return this.client.queryContractSmart(this.contractAddress, {
      tokens: {
        limit,
        owner,
        start_after: startAfter,
      },
    });
  };
  allTokens = async ({
    limit,
    startAfter,
  }: {
    limit?: number;
    startAfter?: string;
  }): Promise<TokensResponse> => {
    return this.client.queryContractSmart(this.contractAddress, {
      all_tokens: {
        limit,
        start_after: startAfter,
      },
    });
  };
  minter = async (): Promise<MinterResponse> => {
    return this.client.queryContractSmart(this.contractAddress, {
      minter: {},
    });
  };
  extension = async ({ msg }: { msg: Empty }): Promise<Null> => {
    return this.client.queryContractSmart(this.contractAddress, {
      extension: {
        msg,
      },
    });
  };
  ownership = async (): Promise<OwnershipForString> => {
    return this.client.queryContractSmart(this.contractAddress, {
      ownership: {},
    });
  };
}
export interface Cw721BaseInterface extends Cw721BaseReadOnlyInterface {
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
    _funds?: Coin[],
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
    _funds?: Coin[],
  ) => Promise<ExecuteResult>;
  approve: (
    {
      expires,
      spender,
      tokenId,
    }: {
      expires?: Expiration;
      spender: string;
      tokenId: string;
    },
    fee?: number | StdFee | "auto",
    memo?: string,
    _funds?: Coin[],
  ) => Promise<ExecuteResult>;
  revoke: (
    {
      spender,
      tokenId,
    }: {
      spender: string;
      tokenId: string;
    },
    fee?: number | StdFee | "auto",
    memo?: string,
    _funds?: Coin[],
  ) => Promise<ExecuteResult>;
  approveAll: (
    {
      expires,
      operator,
    }: {
      expires?: Expiration;
      operator: string;
    },
    fee?: number | StdFee | "auto",
    memo?: string,
    _funds?: Coin[],
  ) => Promise<ExecuteResult>;
  revokeAll: (
    {
      operator,
    }: {
      operator: string;
    },
    fee?: number | StdFee | "auto",
    memo?: string,
    _funds?: Coin[],
  ) => Promise<ExecuteResult>;
  mint: (
    {
      extension,
      owner,
      tokenId,
      tokenUri,
    }: {
      extension: Empty;
      owner: string;
      tokenId: string;
      tokenUri?: string;
    },
    fee?: number | StdFee | "auto",
    memo?: string,
    _funds?: Coin[],
  ) => Promise<ExecuteResult>;
  burn: (
    {
      tokenId,
    }: {
      tokenId: string;
    },
    fee?: number | StdFee | "auto",
    memo?: string,
    _funds?: Coin[],
  ) => Promise<ExecuteResult>;
  extension: (
    {
      msg,
    }: {
      msg: Empty;
    },
    fee?: number | StdFee | "auto",
    memo?: string,
    _funds?: Coin[],
  ) => Promise<Null>;
  updateOwnership: (
    action: Action,
    fee?: number | StdFee | "auto",
    memo?: string,
    _funds?: Coin[],
  ) => Promise<ExecuteResult>;
}
export class Cw721BaseClient
  extends Cw721BaseQueryClient
  implements Cw721BaseInterface
{
  client: SigningCosmWasmClient;
  sender: string;
  contractAddress: string;

  constructor(
    client: SigningCosmWasmClient,
    sender: string,
    contractAddress: string,
  ) {
    super(client, contractAddress);
    this.client = client;
    this.sender = sender;
    this.contractAddress = contractAddress;
    this.transferNft = this.transferNft.bind(this);
    this.sendNft = this.sendNft.bind(this);
    this.approve = this.approve.bind(this);
    this.revoke = this.revoke.bind(this);
    this.approveAll = this.approveAll.bind(this);
    this.revokeAll = this.revokeAll.bind(this);
    this.mint = this.mint.bind(this);
    this.burn = this.burn.bind(this);
    this.extension = this.extension.bind(this);
    this.updateOwnership = this.updateOwnership.bind(this);
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
    _funds?: Coin[],
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
      _funds,
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
    _funds?: Coin[],
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
      _funds,
    );
  };
  approve = async (
    {
      expires,
      spender,
      tokenId,
    }: {
      expires?: Expiration;
      spender: string;
      tokenId: string;
    },
    fee: number | StdFee | "auto" = "auto",
    memo?: string,
    _funds?: Coin[],
  ): Promise<ExecuteResult> => {
    return await this.client.execute(
      this.sender,
      this.contractAddress,
      {
        approve: {
          expires,
          spender,
          token_id: tokenId,
        },
      },
      fee,
      memo,
      _funds,
    );
  };
  revoke = async (
    {
      spender,
      tokenId,
    }: {
      spender: string;
      tokenId: string;
    },
    fee: number | StdFee | "auto" = "auto",
    memo?: string,
    _funds?: Coin[],
  ): Promise<ExecuteResult> => {
    return await this.client.execute(
      this.sender,
      this.contractAddress,
      {
        revoke: {
          spender,
          token_id: tokenId,
        },
      },
      fee,
      memo,
      _funds,
    );
  };
  approveAll = async (
    {
      expires,
      operator,
    }: {
      expires?: Expiration;
      operator: string;
    },
    fee: number | StdFee | "auto" = "auto",
    memo?: string,
    _funds?: Coin[],
  ): Promise<ExecuteResult> => {
    return await this.client.execute(
      this.sender,
      this.contractAddress,
      {
        approve_all: {
          expires,
          operator,
        },
      },
      fee,
      memo,
      _funds,
    );
  };
  revokeAll = async (
    {
      operator,
    }: {
      operator: string;
    },
    fee: number | StdFee | "auto" = "auto",
    memo?: string,
    _funds?: Coin[],
  ): Promise<ExecuteResult> => {
    return await this.client.execute(
      this.sender,
      this.contractAddress,
      {
        revoke_all: {
          operator,
        },
      },
      fee,
      memo,
      _funds,
    );
  };
  mint = async (
    {
      extension,
      owner,
      tokenId,
      tokenUri,
    }: {
      extension: Empty;
      owner: string;
      tokenId: string;
      tokenUri?: string;
    },
    fee: number | StdFee | "auto" = "auto",
    memo?: string,
    _funds?: Coin[],
  ): Promise<ExecuteResult> => {
    return await this.client.execute(
      this.sender,
      this.contractAddress,
      {
        mint: {
          extension,
          owner,
          token_id: tokenId,
          token_uri: tokenUri,
        },
      },
      fee,
      memo,
      _funds,
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
    _funds?: Coin[],
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
      _funds,
    );
  };
  extension = async (
    {
      msg,
    }: {
      msg: Empty;
    },
    fee: number | StdFee | "auto" = "auto",
    memo?: string,
    _funds?: Coin[],
  ): Promise<Null> => {
    await this.client.execute(
      this.sender,
      this.contractAddress,
      {
        extension: {
          msg,
        },
      },
      fee,
      memo,
      _funds,
    );

    return null;
  };
  updateOwnership = async (
    action: Action,
    fee: number | StdFee | "auto" = "auto",
    memo?: string,
    _funds?: Coin[],
  ): Promise<ExecuteResult> => {
    return await this.client.execute(
      this.sender,
      this.contractAddress,
      {
        update_ownership: action,
      },
      fee,
      memo,
      _funds,
    );
  };
}
