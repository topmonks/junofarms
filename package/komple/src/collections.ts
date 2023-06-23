import { Collections } from "komplejs/lib/cjs/types/ts-types/MintModule.types";

export enum COLLECTION_TYPES {
  BASIC = "basic",
}

export enum METADATA_TYPES {
  WHEAT = "wheat",
  SUNFLOWER = "sunflower",
}

export const metadata_per_collection = {
  [COLLECTION_TYPES.BASIC]: [METADATA_TYPES.WHEAT, METADATA_TYPES.SUNFLOWER],
};

export const collections = {
  [COLLECTION_TYPES.BASIC]: {
    collection_type: "komple" as Collections,
    name: "Junofarms Plants",
    description: "plants",
    image: "plants",
  },
};

export const metadata = {
  [METADATA_TYPES.WHEAT]: {
    attributes: [
      {
        trait_type: "type",
        value: "wheat",
      },
    ],
    metaInfo: {},
  },
  [METADATA_TYPES.SUNFLOWER]: {
    attributes: [
      {
        trait_type: "type",
        value: "sunflower",
      },
    ],
    metaInfo: {},
  },
};
