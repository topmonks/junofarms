import { atom, selector } from "recoil";
import * as gs from "../components/game-assets";
import { chainState } from "./cosmos";
import { TESTNET } from "../lib/config";
import {
  Animation,
  CATEGORY_PLANT,
  CATEGORY_TERRAIN,
  GameState,
  Plant,
  SLOT_FIELD,
  SLOT_MEADOW,
  Slot,
} from "../types/types";
import addresses from "@topmonks/junofarms-komple/src/addresses.json";
import { METADATA_TYPES } from "@topmonks/junofarms-komple/src/collections";

export const contractState = selector<string>({
  key: "contractsState",
  get: async ({ get }) => {
    const chain = get(chainState);
    if (chain.chain_id === TESTNET.JUNO) {
      return import.meta.env.VITE_CONTRACT_ADDRESS;
    }

    throw new Error("unknown chain_id " + chain.chain_id);
  },
});

export const kompleState = selector({
  key: "kompleState",
  get: async ({ get }) => {
    const chain = get(chainState);
    if (chain.chain_id === TESTNET.JUNO) {
      return {
        mint: addresses.mint,
        collections: {
          basic: {
            addr: addresses.basic.tokenAddr,
            id: addresses.basic.collectionId,
            metadataAddr: addresses.basic.metadataAddr,
            metadata: {
              wheat: {
                id: addresses.basic.metadata.wheat.metadataId,
              },
              sunflower: {
                id: addresses.basic.metadata.sunflower.metadataId,
              },
            },
          },
        },
      };
    }

    throw new Error("unknown chain_id " + chain.chain_id);
  },
});

export const DEFAULT_GRID_SIZE = 9;
export const CELL_SIZE = 48;

export const categories = {
  [SLOT_MEADOW]: {
    type: SLOT_MEADOW,
    category: CATEGORY_TERRAIN,
    image: gs.meadowImg,
  },
  [SLOT_FIELD]: {
    type: SLOT_FIELD,
    category: CATEGORY_TERRAIN,
    image: gs.fieldImg,
  },
  [METADATA_TYPES.SUNFLOWER]: {
    type: METADATA_TYPES.SUNFLOWER,
    category: CATEGORY_PLANT,
    images: gs.sunflowerImg,
    current_stage: 1,
    stages: gs.sunflowerImg.length,
  },
  [METADATA_TYPES.WHEAT]: {
    type: METADATA_TYPES.WHEAT,
    category: CATEGORY_PLANT,
    images: gs.wheatImg,
    current_stage: 1,
    stages: gs.wheatImg.length,
  },
} as const;

type FactorySlot = Partial<
  Omit<Slot, "plant"> & { plant?: Partial<Plant> | null }
>;

export const factories = {
  [SLOT_MEADOW]: (overrides?: FactorySlot) =>
    Object.assign({}, categories[SLOT_MEADOW], overrides) as Slot,
  [SLOT_FIELD]: (overrides?: FactorySlot) => {
    const slot = Object.assign({}, categories[SLOT_FIELD], overrides) as Slot;
    if (slot.plant != null) {
      const type = slot.plant.type;
      slot.plant = factories[type](slot.plant);
    }

    return slot;
  },
  [METADATA_TYPES.SUNFLOWER]: (overrides?: Partial<Plant> | null) =>
    Object.assign({}, categories[METADATA_TYPES.SUNFLOWER], overrides) as Plant,
  [METADATA_TYPES.WHEAT]: (overrides?: Partial<Plant> | null) =>
    Object.assign({}, categories[METADATA_TYPES.WHEAT], overrides) as Plant,
};

export const slotOptions = {
  [SLOT_MEADOW]: [{ type: SLOT_FIELD, image: categories[SLOT_FIELD].image }],
  [SLOT_FIELD]: [
    {
      type: METADATA_TYPES.SUNFLOWER,
      image:
        categories[METADATA_TYPES.SUNFLOWER].images[
          categories[METADATA_TYPES.SUNFLOWER].stages - 2
        ],
    },
    {
      type: METADATA_TYPES.WHEAT,
      image:
        categories[METADATA_TYPES.WHEAT].images[
          categories[METADATA_TYPES.WHEAT].stages - 2
        ],
    },
  ],
} as const;

export const gameState = atom<GameState>({
  key: "gameState",
  dangerouslyAllowMutability: true,
  default: {
    size: DEFAULT_GRID_SIZE,
    grid: new Array(DEFAULT_GRID_SIZE)
      .fill(undefined)
      .map(() =>
        new Array(DEFAULT_GRID_SIZE)
          .fill(undefined)
          .map(() => factories[SLOT_MEADOW]())
      ),
    prevTime: performance.now(),
    animations: [],
    events: [],
  },
});

export function pushAnimation(
  animation: Omit<Animation, "id">,
  animations?: Animation[]
) {
  const currentAnimations = animations || [];
  const lastAnimation = currentAnimations[currentAnimations.length - 1];

  const lastId = lastAnimation ? lastAnimation.id : null;
  const nextId = lastId === null ? 0 : lastId + 1;

  return {
    animations: [...(animations || []), { ...animation, id: nextId }],
    nextId,
  };
}

export function removeAnimation(
  animationId: Animation["id"],
  animations?: Animation[]
) {
  const currentAnimations = animations || [];

  return { animations: currentAnimations.filter((a) => a.id !== animationId) };
}

export const shopOpenedState = atom({
  key: "shopOpenedState",
  default: false,
});
