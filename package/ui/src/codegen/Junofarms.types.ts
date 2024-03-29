/**
 * This file was automatically generated by @cosmwasm/ts-codegen@0.33.0.
 * DO NOT MODIFY IT BY HAND. Instead, modify the source JSONSchema file,
 * and run the @cosmwasm/ts-codegen generate command to regenerate this file.
 */

export interface InstantiateMsg {
  admin?: string | null;
  komple_mint_addr?: string | null;
}
export type ExecuteMsg =
  | {
      start: {};
    }
  | {
      setup_farm: {
        addr: Addr;
        farm: FarmProfile;
      };
    }
  | {
      stop: {};
    }
  | {
      till_ground: {
        x: number;
        y: number;
      };
    }
  | {
      water_plant: {
        x: number;
        y: number;
      };
    }
  | {
      harvest: {
        x: number;
        y: number;
      };
    }
  | {
      update_contract_information: {
        contract_information: ContractInformation;
      };
    }
  | {
      receive_nft: Cw721ReceiveMsg;
    };
export type Addr = string;
export type PlantType = "sunflower" | "wheat";
export type SlotType = "meadow" | "field";
export type Binary = string;
export interface FarmProfile {
  plots: Slot[][];
}
export interface Slot {
  created_at: number;
  plant?: Plant | null;
  type: SlotType;
}
export interface Plant {
  created_at: number;
  growth_period: number;
  komple?: KomplePlant | null;
  stages: number;
  type: PlantType;
  watered_at: number[];
}
export interface KomplePlant {
  collection_id: number;
  metadata_id: number;
}
export interface ContractInformation {
  admin: string;
  komple_mint_addr?: string | null;
}
export interface Cw721ReceiveMsg {
  msg: Binary;
  sender: string;
  token_id: string;
}
export type QueryMsg =
  | {
      contract_info: {};
    }
  | {
      get_farm_profile: {
        address: string;
      };
    }
  | {
      leaderboard: {};
    };
export interface FarmProfileDto {
  blocks: number;
  plots: SlotDto[][];
}
export interface SlotDto {
  can_till: boolean;
  created_at: number;
  plant?: PlantDto | null;
  type: SlotType;
}
export interface PlantDto {
  can_harvest: boolean;
  can_water: boolean;
  created_at: number;
  current_stage: number;
  growth_period: number;
  is_dead: boolean;
  komple?: KomplePlant | null;
  stages: number;
  type: PlantType;
  watered_at: number[];
}
export type ArrayOfTupleOfUint64AndString = [number, string][];
