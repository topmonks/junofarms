/**
 * This file was automatically generated by @cosmwasm/ts-codegen@0.30.0.
 * DO NOT MODIFY IT BY HAND. Instead, modify the source JSONSchema file,
 * and run the @cosmwasm/ts-codegen generate command to regenerate this file.
 */

import {
  UseQueryOptions,
  useQuery,
  useMutation,
  UseMutationOptions,
} from "@tanstack/react-query";
import { ExecuteResult } from "@cosmjs/cosmwasm-stargate";
import { StdFee, Coin } from "@cosmjs/amino";
import {
  Metadata,
  InstantiateMsg,
  ExecuteMsg,
  Trait,
  MetaInfo,
  QueryMsg,
  MigrateMsg,
  Addr,
  ResponseWrapperForConfig,
  Config,
  ResponseWrapperForMetadataResponse,
  MetadataResponse,
  ResponseWrapperForArrayOfMetadataResponse,
  ResponseWrapperForArrayOfString,
  ResponseWrapperForMetadata,
} from "./KompleMetadata.types";
import {
  KompleMetadataQueryClient,
  KompleMetadataClient,
} from "./KompleMetadata.client";
export const kompleMetadataQueryKeys = {
  contract: [
    {
      contract: "kompleMetadata",
    },
  ] as const,
  address: (contractAddress: string | undefined) =>
    [
      { ...kompleMetadataQueryKeys.contract[0], address: contractAddress },
    ] as const,
  config: (
    contractAddress: string | undefined,
    args?: Record<string, unknown>,
  ) =>
    [
      {
        ...kompleMetadataQueryKeys.address(contractAddress)[0],
        method: "config",
        args,
      },
    ] as const,
  rawMetadata: (
    contractAddress: string | undefined,
    args?: Record<string, unknown>,
  ) =>
    [
      {
        ...kompleMetadataQueryKeys.address(contractAddress)[0],
        method: "raw_metadata",
        args,
      },
    ] as const,
  metadata: (
    contractAddress: string | undefined,
    args?: Record<string, unknown>,
  ) =>
    [
      {
        ...kompleMetadataQueryKeys.address(contractAddress)[0],
        method: "metadata",
        args,
      },
    ] as const,
  rawMetadatas: (
    contractAddress: string | undefined,
    args?: Record<string, unknown>,
  ) =>
    [
      {
        ...kompleMetadataQueryKeys.address(contractAddress)[0],
        method: "raw_metadatas",
        args,
      },
    ] as const,
  metadatas: (
    contractAddress: string | undefined,
    args?: Record<string, unknown>,
  ) =>
    [
      {
        ...kompleMetadataQueryKeys.address(contractAddress)[0],
        method: "metadatas",
        args,
      },
    ] as const,
  operators: (
    contractAddress: string | undefined,
    args?: Record<string, unknown>,
  ) =>
    [
      {
        ...kompleMetadataQueryKeys.address(contractAddress)[0],
        method: "operators",
        args,
      },
    ] as const,
};
export const kompleMetadataQueries = {
  config: <TData = ResponseWrapperForConfig>({
    client,
    options,
  }: KompleMetadataConfigQuery<TData>): UseQueryOptions<
    ResponseWrapperForConfig,
    Error,
    TData
  > => ({
    queryKey: kompleMetadataQueryKeys.config(client?.contractAddress),
    queryFn: () =>
      client ? client.config() : Promise.reject(new Error("Invalid client")),
    ...options,
    enabled:
      !!client && (options?.enabled != undefined ? options.enabled : true),
  }),
  rawMetadata: <TData = ResponseWrapperForMetadata>({
    client,
    args,
    options,
  }: KompleMetadataRawMetadataQuery<TData>): UseQueryOptions<
    ResponseWrapperForMetadata,
    Error,
    TData
  > => ({
    queryKey: kompleMetadataQueryKeys.rawMetadata(
      client?.contractAddress,
      args,
    ),
    queryFn: () =>
      client
        ? client.rawMetadata({
            metadataId: args.metadataId,
          })
        : Promise.reject(new Error("Invalid client")),
    ...options,
    enabled:
      !!client && (options?.enabled != undefined ? options.enabled : true),
  }),
  metadata: <TData = ResponseWrapperForMetadataResponse>({
    client,
    args,
    options,
  }: KompleMetadataMetadataQuery<TData>): UseQueryOptions<
    ResponseWrapperForMetadataResponse,
    Error,
    TData
  > => ({
    queryKey: kompleMetadataQueryKeys.metadata(client?.contractAddress, args),
    queryFn: () =>
      client
        ? client.metadata({
            tokenId: args.tokenId,
          })
        : Promise.reject(new Error("Invalid client")),
    ...options,
    enabled:
      !!client && (options?.enabled != undefined ? options.enabled : true),
  }),
  rawMetadatas: <TData = ResponseWrapperForArrayOfMetadataResponse>({
    client,
    args,
    options,
  }: KompleMetadataRawMetadatasQuery<TData>): UseQueryOptions<
    ResponseWrapperForArrayOfMetadataResponse,
    Error,
    TData
  > => ({
    queryKey: kompleMetadataQueryKeys.rawMetadatas(
      client?.contractAddress,
      args,
    ),
    queryFn: () =>
      client
        ? client.rawMetadatas({
            limit: args.limit,
            startAfter: args.startAfter,
          })
        : Promise.reject(new Error("Invalid client")),
    ...options,
    enabled:
      !!client && (options?.enabled != undefined ? options.enabled : true),
  }),
  metadatas: <TData = ResponseWrapperForArrayOfMetadataResponse>({
    client,
    args,
    options,
  }: KompleMetadataMetadatasQuery<TData>): UseQueryOptions<
    ResponseWrapperForArrayOfMetadataResponse,
    Error,
    TData
  > => ({
    queryKey: kompleMetadataQueryKeys.metadatas(client?.contractAddress, args),
    queryFn: () =>
      client
        ? client.metadatas({
            limit: args.limit,
            startAfter: args.startAfter,
          })
        : Promise.reject(new Error("Invalid client")),
    ...options,
    enabled:
      !!client && (options?.enabled != undefined ? options.enabled : true),
  }),
  operators: <TData = ResponseWrapperForArrayOfString>({
    client,
    options,
  }: KompleMetadataOperatorsQuery<TData>): UseQueryOptions<
    ResponseWrapperForArrayOfString,
    Error,
    TData
  > => ({
    queryKey: kompleMetadataQueryKeys.operators(client?.contractAddress),
    queryFn: () =>
      client ? client.operators() : Promise.reject(new Error("Invalid client")),
    ...options,
    enabled:
      !!client && (options?.enabled != undefined ? options.enabled : true),
  }),
};
export interface KompleMetadataReactQuery<TResponse, TData = TResponse> {
  client: KompleMetadataQueryClient | undefined;
  options?: Omit<
    UseQueryOptions<TResponse, Error, TData>,
    "'queryKey' | 'queryFn' | 'initialData'"
  > & {
    initialData?: undefined;
  };
}
export type KompleMetadataOperatorsQuery<TData> = KompleMetadataReactQuery<
  ResponseWrapperForArrayOfString,
  TData
>;
export function useKompleMetadataOperatorsQuery<
  TData = ResponseWrapperForArrayOfString,
>({ client, options }: KompleMetadataOperatorsQuery<TData>) {
  return useQuery<ResponseWrapperForArrayOfString, Error, TData>(
    kompleMetadataQueryKeys.operators(client?.contractAddress),
    () =>
      client ? client.operators() : Promise.reject(new Error("Invalid client")),
    {
      ...options,
      enabled:
        !!client && (options?.enabled != undefined ? options.enabled : true),
    },
  );
}
export interface KompleMetadataMetadatasQuery<TData>
  extends KompleMetadataReactQuery<
    ResponseWrapperForArrayOfMetadataResponse,
    TData
  > {
  args: {
    limit?: number;
    startAfter?: number;
  };
}
export function useKompleMetadataMetadatasQuery<
  TData = ResponseWrapperForArrayOfMetadataResponse,
>({ client, args, options }: KompleMetadataMetadatasQuery<TData>) {
  return useQuery<ResponseWrapperForArrayOfMetadataResponse, Error, TData>(
    kompleMetadataQueryKeys.metadatas(client?.contractAddress, args),
    () =>
      client
        ? client.metadatas({
            limit: args.limit,
            startAfter: args.startAfter,
          })
        : Promise.reject(new Error("Invalid client")),
    {
      ...options,
      enabled:
        !!client && (options?.enabled != undefined ? options.enabled : true),
    },
  );
}
export interface KompleMetadataRawMetadatasQuery<TData>
  extends KompleMetadataReactQuery<
    ResponseWrapperForArrayOfMetadataResponse,
    TData
  > {
  args: {
    limit?: number;
    startAfter?: number;
  };
}
export function useKompleMetadataRawMetadatasQuery<
  TData = ResponseWrapperForArrayOfMetadataResponse,
>({ client, args, options }: KompleMetadataRawMetadatasQuery<TData>) {
  return useQuery<ResponseWrapperForArrayOfMetadataResponse, Error, TData>(
    kompleMetadataQueryKeys.rawMetadatas(client?.contractAddress, args),
    () =>
      client
        ? client.rawMetadatas({
            limit: args.limit,
            startAfter: args.startAfter,
          })
        : Promise.reject(new Error("Invalid client")),
    {
      ...options,
      enabled:
        !!client && (options?.enabled != undefined ? options.enabled : true),
    },
  );
}
export interface KompleMetadataMetadataQuery<TData>
  extends KompleMetadataReactQuery<ResponseWrapperForMetadataResponse, TData> {
  args: {
    tokenId: number;
  };
}
export function useKompleMetadataMetadataQuery<
  TData = ResponseWrapperForMetadataResponse,
>({ client, args, options }: KompleMetadataMetadataQuery<TData>) {
  return useQuery<ResponseWrapperForMetadataResponse, Error, TData>(
    kompleMetadataQueryKeys.metadata(client?.contractAddress, args),
    () =>
      client
        ? client.metadata({
            tokenId: args.tokenId,
          })
        : Promise.reject(new Error("Invalid client")),
    {
      ...options,
      enabled:
        !!client && (options?.enabled != undefined ? options.enabled : true),
    },
  );
}
export interface KompleMetadataRawMetadataQuery<TData>
  extends KompleMetadataReactQuery<ResponseWrapperForMetadata, TData> {
  args: {
    metadataId: number;
  };
}
export function useKompleMetadataRawMetadataQuery<
  TData = ResponseWrapperForMetadata,
>({ client, args, options }: KompleMetadataRawMetadataQuery<TData>) {
  return useQuery<ResponseWrapperForMetadata, Error, TData>(
    kompleMetadataQueryKeys.rawMetadata(client?.contractAddress, args),
    () =>
      client
        ? client.rawMetadata({
            metadataId: args.metadataId,
          })
        : Promise.reject(new Error("Invalid client")),
    {
      ...options,
      enabled:
        !!client && (options?.enabled != undefined ? options.enabled : true),
    },
  );
}
export type KompleMetadataConfigQuery<TData> = KompleMetadataReactQuery<
  ResponseWrapperForConfig,
  TData
>;
export function useKompleMetadataConfigQuery<TData = ResponseWrapperForConfig>({
  client,
  options,
}: KompleMetadataConfigQuery<TData>) {
  return useQuery<ResponseWrapperForConfig, Error, TData>(
    kompleMetadataQueryKeys.config(client?.contractAddress),
    () =>
      client ? client.config() : Promise.reject(new Error("Invalid client")),
    {
      ...options,
      enabled:
        !!client && (options?.enabled != undefined ? options.enabled : true),
    },
  );
}
export interface KompleMetadataUpdateOperatorsMutation {
  client: KompleMetadataClient;
  msg: {
    addrs: string[];
  };
  args?: {
    fee?: number | StdFee | "auto";
    memo?: string;
    funds?: Coin[];
  };
}
export function useKompleMetadataUpdateOperatorsMutation(
  options?: Omit<
    UseMutationOptions<
      ExecuteResult,
      Error,
      KompleMetadataUpdateOperatorsMutation
    >,
    "mutationFn"
  >,
) {
  return useMutation<
    ExecuteResult,
    Error,
    KompleMetadataUpdateOperatorsMutation
  >(
    ({ client, msg, args: { fee, memo, funds } = {} }) =>
      client.updateOperators(msg, fee, memo, funds),
    options,
  );
}
export interface KompleMetadataRemoveAttributeMutation {
  client: KompleMetadataClient;
  msg: {
    id: number;
    rawMetadata: boolean;
    traitType: string;
  };
  args?: {
    fee?: number | StdFee | "auto";
    memo?: string;
    funds?: Coin[];
  };
}
export function useKompleMetadataRemoveAttributeMutation(
  options?: Omit<
    UseMutationOptions<
      ExecuteResult,
      Error,
      KompleMetadataRemoveAttributeMutation
    >,
    "mutationFn"
  >,
) {
  return useMutation<
    ExecuteResult,
    Error,
    KompleMetadataRemoveAttributeMutation
  >(
    ({ client, msg, args: { fee, memo, funds } = {} }) =>
      client.removeAttribute(msg, fee, memo, funds),
    options,
  );
}
export interface KompleMetadataUpdateAttributeMutation {
  client: KompleMetadataClient;
  msg: {
    attribute: Trait;
    id: number;
    rawMetadata: boolean;
  };
  args?: {
    fee?: number | StdFee | "auto";
    memo?: string;
    funds?: Coin[];
  };
}
export function useKompleMetadataUpdateAttributeMutation(
  options?: Omit<
    UseMutationOptions<
      ExecuteResult,
      Error,
      KompleMetadataUpdateAttributeMutation
    >,
    "mutationFn"
  >,
) {
  return useMutation<
    ExecuteResult,
    Error,
    KompleMetadataUpdateAttributeMutation
  >(
    ({ client, msg, args: { fee, memo, funds } = {} }) =>
      client.updateAttribute(msg, fee, memo, funds),
    options,
  );
}
export interface KompleMetadataAddAttributeMutation {
  client: KompleMetadataClient;
  msg: {
    attribute: Trait;
    id: number;
    rawMetadata: boolean;
  };
  args?: {
    fee?: number | StdFee | "auto";
    memo?: string;
    funds?: Coin[];
  };
}
export function useKompleMetadataAddAttributeMutation(
  options?: Omit<
    UseMutationOptions<
      ExecuteResult,
      Error,
      KompleMetadataAddAttributeMutation
    >,
    "mutationFn"
  >,
) {
  return useMutation<ExecuteResult, Error, KompleMetadataAddAttributeMutation>(
    ({ client, msg, args: { fee, memo, funds } = {} }) =>
      client.addAttribute(msg, fee, memo, funds),
    options,
  );
}
export interface KompleMetadataUpdateMetaInfoMutation {
  client: KompleMetadataClient;
  msg: {
    id: number;
    metaInfo: MetaInfo;
    rawMetadata: boolean;
  };
  args?: {
    fee?: number | StdFee | "auto";
    memo?: string;
    funds?: Coin[];
  };
}
export function useKompleMetadataUpdateMetaInfoMutation(
  options?: Omit<
    UseMutationOptions<
      ExecuteResult,
      Error,
      KompleMetadataUpdateMetaInfoMutation
    >,
    "mutationFn"
  >,
) {
  return useMutation<
    ExecuteResult,
    Error,
    KompleMetadataUpdateMetaInfoMutation
  >(
    ({ client, msg, args: { fee, memo, funds } = {} }) =>
      client.updateMetaInfo(msg, fee, memo, funds),
    options,
  );
}
export interface KompleMetadataUnlinkMetadataMutation {
  client: KompleMetadataClient;
  msg: {
    tokenId: number;
  };
  args?: {
    fee?: number | StdFee | "auto";
    memo?: string;
    funds?: Coin[];
  };
}
export function useKompleMetadataUnlinkMetadataMutation(
  options?: Omit<
    UseMutationOptions<
      ExecuteResult,
      Error,
      KompleMetadataUnlinkMetadataMutation
    >,
    "mutationFn"
  >,
) {
  return useMutation<
    ExecuteResult,
    Error,
    KompleMetadataUnlinkMetadataMutation
  >(
    ({ client, msg, args: { fee, memo, funds } = {} }) =>
      client.unlinkMetadata(msg, fee, memo, funds),
    options,
  );
}
export interface KompleMetadataLinkMetadataMutation {
  client: KompleMetadataClient;
  msg: {
    metadataId?: number;
    tokenId: number;
  };
  args?: {
    fee?: number | StdFee | "auto";
    memo?: string;
    funds?: Coin[];
  };
}
export function useKompleMetadataLinkMetadataMutation(
  options?: Omit<
    UseMutationOptions<
      ExecuteResult,
      Error,
      KompleMetadataLinkMetadataMutation
    >,
    "mutationFn"
  >,
) {
  return useMutation<ExecuteResult, Error, KompleMetadataLinkMetadataMutation>(
    ({ client, msg, args: { fee, memo, funds } = {} }) =>
      client.linkMetadata(msg, fee, memo, funds),
    options,
  );
}
export interface KompleMetadataAddMetadataMutation {
  client: KompleMetadataClient;
  msg: {
    attributes: Trait[];
    metaInfo: MetaInfo;
  };
  args?: {
    fee?: number | StdFee | "auto";
    memo?: string;
    funds?: Coin[];
  };
}
export function useKompleMetadataAddMetadataMutation(
  options?: Omit<
    UseMutationOptions<ExecuteResult, Error, KompleMetadataAddMetadataMutation>,
    "mutationFn"
  >,
) {
  return useMutation<ExecuteResult, Error, KompleMetadataAddMetadataMutation>(
    ({ client, msg, args: { fee, memo, funds } = {} }) =>
      client.addMetadata(msg, fee, memo, funds),
    options,
  );
}
