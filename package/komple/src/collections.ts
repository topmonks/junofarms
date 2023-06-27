import { Collections } from "komplejs/lib/cjs/types/ts-types/MintModule.types";

export enum COLLECTION_TYPES {
  BASIC = "basic",
  ANIMALS = "animals",
}

export enum SEED_METADATA_TYPES {
  WHEAT = "wheat",
  SUNFLOWER = "sunflower",
}

export enum ANIMAL_METADATA_TYPES {
  CHICK = "chick",
  PIGLET = "piglet",
  CALF = "calf",
}

export const metadata_per_collection = {
  [COLLECTION_TYPES.BASIC]: [
    SEED_METADATA_TYPES.WHEAT,
    SEED_METADATA_TYPES.SUNFLOWER,
  ],
  [COLLECTION_TYPES.ANIMALS]: [],
};

export const collections = {
  [COLLECTION_TYPES.BASIC]: {
    collection_type: "komple" as Collections,
    name: "Junofarms Plants",
    description: "plants",
    image: "plants",
  },
  [COLLECTION_TYPES.ANIMALS]: {
    collection_type: "komple" as Collections,
    name: "Junofarms Animals",
    description: "animals",
    image: "animals",
  },
};

export const metadata = {
  [SEED_METADATA_TYPES.WHEAT]: {
    attributes: [
      {
        trait_type: "type",
        value: "wheat",
      },
    ],
    metaInfo: {},
  },
  [SEED_METADATA_TYPES.SUNFLOWER]: {
    attributes: [
      {
        trait_type: "type",
        value: "sunflower",
      },
    ],
    metaInfo: {},
  },
};
