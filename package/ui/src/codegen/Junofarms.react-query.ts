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
import { JunofarmsQueryClient, JunofarmsClient } from "./Junofarms.client";
export const junofarmsQueryKeys = {
  contract: [
    {
      contract: "junofarms",
    },
  ] as const,
  address: (contractAddress: string | undefined) =>
    [{ ...junofarmsQueryKeys.contract[0], address: contractAddress }] as const,
  contractInfo: (
    contractAddress: string | undefined,
    args?: Record<string, unknown>
  ) =>
    [
      {
        ...junofarmsQueryKeys.address(contractAddress)[0],
        method: "contract_info",
        args,
      },
    ] as const,
  getFarmProfile: (
    contractAddress: string | undefined,
    args?: Record<string, unknown>
  ) =>
    [
      {
        ...junofarmsQueryKeys.address(contractAddress)[0],
        method: "get_farm_profile",
        args,
      },
    ] as const,
};
export const junofarmsQueries = {
  contractInfo: <TData = ContractInformationResponse>({
    client,
    options,
  }: JunofarmsContractInfoQuery<TData>): UseQueryOptions<
    ContractInformationResponse,
    Error,
    TData
  > => ({
    queryKey: junofarmsQueryKeys.contractInfo(client?.contractAddress),
    queryFn: () =>
      client
        ? client.contractInfo()
        : Promise.reject(new Error("Invalid client")),
    ...options,
    enabled:
      !!client && (options?.enabled != undefined ? options.enabled : true),
  }),
  getFarmProfile: <TData = FarmProfile>({
    client,
    args,
    options,
  }: JunofarmsGetFarmProfileQuery<TData>): UseQueryOptions<
    FarmProfile,
    Error,
    TData
  > => ({
    queryKey: junofarmsQueryKeys.getFarmProfile(client?.contractAddress, args),
    queryFn: () =>
      client
        ? client.getFarmProfile({
            address: args.address,
          })
        : Promise.reject(new Error("Invalid client")),
    ...options,
    enabled:
      !!client && (options?.enabled != undefined ? options.enabled : true),
  }),
};
export interface JunofarmsReactQuery<TResponse, TData = TResponse> {
  client: JunofarmsQueryClient | undefined;
  options?: Omit<
    UseQueryOptions<TResponse, Error, TData>,
    "'queryKey' | 'queryFn' | 'initialData'"
  > & {
    initialData?: undefined;
  };
}
export interface JunofarmsGetFarmProfileQuery<TData>
  extends JunofarmsReactQuery<FarmProfile, TData> {
  args: {
    address: string;
  };
}
export function useJunofarmsGetFarmProfileQuery<TData = FarmProfile>({
  client,
  args,
  options,
}: JunofarmsGetFarmProfileQuery<TData>) {
  return useQuery<FarmProfile, Error, TData>(
    junofarmsQueryKeys.getFarmProfile(client?.contractAddress, args),
    () =>
      client
        ? client.getFarmProfile({
            address: args.address,
          })
        : Promise.reject(new Error("Invalid client")),
    {
      ...options,
      enabled:
        !!client && (options?.enabled != undefined ? options.enabled : true),
    }
  );
}
export type JunofarmsContractInfoQuery<TData> = JunofarmsReactQuery<
  ContractInformationResponse,
  TData
>;
export function useJunofarmsContractInfoQuery<
  TData = ContractInformationResponse
>({ client, options }: JunofarmsContractInfoQuery<TData>) {
  return useQuery<ContractInformationResponse, Error, TData>(
    junofarmsQueryKeys.contractInfo(client?.contractAddress),
    () =>
      client
        ? client.contractInfo()
        : Promise.reject(new Error("Invalid client")),
    {
      ...options,
      enabled:
        !!client && (options?.enabled != undefined ? options.enabled : true),
    }
  );
}
export interface JunofarmsReceiveNftMutation {
  client: JunofarmsClient;
  msg: {
    msg: Binary;
    sender: string;
    tokenId: string;
  };
  args?: {
    fee?: number | StdFee | "auto";
    memo?: string;
    funds?: Coin[];
  };
}
export function useJunofarmsReceiveNftMutation(
  options?: Omit<
    UseMutationOptions<ExecuteResult, Error, JunofarmsReceiveNftMutation>,
    "mutationFn"
  >
) {
  return useMutation<ExecuteResult, Error, JunofarmsReceiveNftMutation>(
    ({ client, msg, args: { fee, memo, funds } = {} }) =>
      client.receiveNft(msg, fee, memo, funds),
    options
  );
}
export interface JunofarmsHarvestMutation {
  client: JunofarmsClient;
  msg: {
    x: number;
    y: number;
  };
  args?: {
    fee?: number | StdFee | "auto";
    memo?: string;
    funds?: Coin[];
  };
}
export function useJunofarmsHarvestMutation(
  options?: Omit<
    UseMutationOptions<ExecuteResult, Error, JunofarmsHarvestMutation>,
    "mutationFn"
  >
) {
  return useMutation<ExecuteResult, Error, JunofarmsHarvestMutation>(
    ({ client, msg, args: { fee, memo, funds } = {} }) =>
      client.harvest(msg, fee, memo, funds),
    options
  );
}
export interface JunofarmsWaterPlantMutation {
  client: JunofarmsClient;
  msg: {
    x: number;
    y: number;
  };
  args?: {
    fee?: number | StdFee | "auto";
    memo?: string;
    funds?: Coin[];
  };
}
export function useJunofarmsWaterPlantMutation(
  options?: Omit<
    UseMutationOptions<ExecuteResult, Error, JunofarmsWaterPlantMutation>,
    "mutationFn"
  >
) {
  return useMutation<ExecuteResult, Error, JunofarmsWaterPlantMutation>(
    ({ client, msg, args: { fee, memo, funds } = {} }) =>
      client.waterPlant(msg, fee, memo, funds),
    options
  );
}
export interface JunofarmsPlantSeedMutation {
  client: JunofarmsClient;
  msg: {
    x: number;
    y: number;
  };
  args?: {
    fee?: number | StdFee | "auto";
    memo?: string;
    funds?: Coin[];
  };
}
export function useJunofarmsPlantSeedMutation(
  options?: Omit<
    UseMutationOptions<ExecuteResult, Error, JunofarmsPlantSeedMutation>,
    "mutationFn"
  >
) {
  return useMutation<ExecuteResult, Error, JunofarmsPlantSeedMutation>(
    ({ client, msg, args: { fee, memo, funds } = {} }) =>
      client.plantSeed(msg, fee, memo, funds),
    options
  );
}
export interface JunofarmsTillGroundMutation {
  client: JunofarmsClient;
  msg: {
    x: number;
    y: number;
  };
  args?: {
    fee?: number | StdFee | "auto";
    memo?: string;
    funds?: Coin[];
  };
}
export function useJunofarmsTillGroundMutation(
  options?: Omit<
    UseMutationOptions<ExecuteResult, Error, JunofarmsTillGroundMutation>,
    "mutationFn"
  >
) {
  return useMutation<ExecuteResult, Error, JunofarmsTillGroundMutation>(
    ({ client, msg, args: { fee, memo, funds } = {} }) =>
      client.tillGround(msg, fee, memo, funds),
    options
  );
}
export interface JunofarmsStopMutation {
  client: JunofarmsClient;
  args?: {
    fee?: number | StdFee | "auto";
    memo?: string;
    funds?: Coin[];
  };
}
export function useJunofarmsStopMutation(
  options?: Omit<
    UseMutationOptions<ExecuteResult, Error, JunofarmsStopMutation>,
    "mutationFn"
  >
) {
  return useMutation<ExecuteResult, Error, JunofarmsStopMutation>(
    ({ client, args: { fee, memo, funds } = {} }) =>
      client.stop(fee, memo, funds),
    options
  );
}
export interface JunofarmsStartMutation {
  client: JunofarmsClient;
  args?: {
    fee?: number | StdFee | "auto";
    memo?: string;
    funds?: Coin[];
  };
}
export function useJunofarmsStartMutation(
  options?: Omit<
    UseMutationOptions<ExecuteResult, Error, JunofarmsStartMutation>,
    "mutationFn"
  >
) {
  return useMutation<ExecuteResult, Error, JunofarmsStartMutation>(
    ({ client, args: { fee, memo, funds } = {} }) =>
      client.start(fee, memo, funds),
    options
  );
}
