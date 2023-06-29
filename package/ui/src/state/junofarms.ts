import { atom, selector } from "recoil";
import * as gs from "../components/game-assets";
import { chainState } from "./cosmos";
import { MAINNET, TESTNET } from "../lib/config";
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
import addressesJunoTestnet from "@topmonks/junofarms-komple/src/addresses-juno-testnet.json";
import addressesJunoMainnet from "@topmonks/junofarms-komple/src/addresses-juno-mainnet.json";
import { SEED_METADATA_TYPES } from "@topmonks/junofarms-komple/src/collections";

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
        mint: addressesJunoTestnet.mint,
        collections: {
          basic: {
            addr: addressesJunoTestnet.basic.tokenAddr,
            id: addressesJunoTestnet.basic.collectionId,
            metadataAddr: addressesJunoTestnet.basic.metadataAddr,
            metadata: {
              wheat: {
                id: addressesJunoTestnet.basic.metadata.wheat.metadataId,
              },
              sunflower: {
                id: addressesJunoTestnet.basic.metadata.sunflower.metadataId,
              },
            },
            fee: addressesJunoTestnet.basic.mintFee,
          },
          animals: {
            addr: addressesJunoTestnet.animals.tokenAddr,
            id: addressesJunoTestnet.animals.collectionId,
            metadataAddr: addressesJunoTestnet.animals.metadataAddr,
            metadata: {
              calf: {
                id: addressesJunoTestnet.animals.metadata.calf.metadataId,
              },
              chick: {
                id: addressesJunoTestnet.animals.metadata.chick.metadataId,
              },
              piglet: {
                id: addressesJunoTestnet.animals.metadata.piglet.metadataId,
              },
            },
            fee: addressesJunoTestnet.animals.mintFee,
          },
        },
      };
    } else if (chain.chain_id === MAINNET.JUNO) {
      return {
        mint: addressesJunoMainnet.mint,
        collections: {
          basic: {
            addr: addressesJunoMainnet.basic.tokenAddr,
            id: addressesJunoMainnet.basic.collectionId,
            metadataAddr: addressesJunoMainnet.basic.metadataAddr,
            metadata: {
              wheat: {
                id: addressesJunoMainnet.basic.metadata.wheat.metadataId,
              },
              sunflower: {
                id: addressesJunoMainnet.basic.metadata.sunflower.metadataId,
              },
            },
            fee: addressesJunoMainnet.basic.mintFee,
          },
          animals: {
            addr: addressesJunoMainnet.animals.tokenAddr,
            id: addressesJunoMainnet.animals.collectionId,
            metadataAddr: addressesJunoMainnet.animals.metadataAddr,
            metadata: {
              calf: {
                id: addressesJunoMainnet.animals.metadata.calf.metadataId,
              },
              chick: {
                id: addressesJunoMainnet.animals.metadata.chick.metadataId,
              },
              piglet: {
                id: addressesJunoMainnet.animals.metadata.piglet.metadataId,
              },
            },
            fee: addressesJunoMainnet.animals.mintFee,
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
  [SEED_METADATA_TYPES.SUNFLOWER]: {
    type: SEED_METADATA_TYPES.SUNFLOWER,
    category: CATEGORY_PLANT,
    images: gs.sunflowerImg,
    current_stage: 1,
    stages: gs.sunflowerImg.length,
  },
  [SEED_METADATA_TYPES.WHEAT]: {
    type: SEED_METADATA_TYPES.WHEAT,
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
  [SEED_METADATA_TYPES.SUNFLOWER]: (overrides?: Partial<Plant> | null) =>
    Object.assign(
      {},
      categories[SEED_METADATA_TYPES.SUNFLOWER],
      overrides
    ) as Plant,
  [SEED_METADATA_TYPES.WHEAT]: (overrides?: Partial<Plant> | null) =>
    Object.assign(
      {},
      categories[SEED_METADATA_TYPES.WHEAT],
      overrides
    ) as Plant,
};

export const slotOptions = {
  [SLOT_MEADOW]: [{ type: SLOT_FIELD, image: categories[SLOT_FIELD].image }],
  [SLOT_FIELD]: [
    {
      type: SEED_METADATA_TYPES.SUNFLOWER,
      image:
        categories[SEED_METADATA_TYPES.SUNFLOWER].images[
          categories[SEED_METADATA_TYPES.SUNFLOWER].stages - 2
        ],
    },
    {
      type: SEED_METADATA_TYPES.WHEAT,
      image:
        categories[SEED_METADATA_TYPES.WHEAT].images[
          categories[SEED_METADATA_TYPES.WHEAT].stages - 2
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
    animals: [],
    animalPositions: [],
    events: [],
    blocks: 0,
  },
});

export function pushAnimation(
  animation: Omit<Animation, "id">,
  animations?: Animation[]
) {
  const currentAnimations = animations || [];
  const lastId = currentAnimations.reduce(
    (max, a) => Math.max(parseInt(a.id), max),
    0
  );

  const nextId = lastId + 1;
  const nextIdString = nextId.toString();

  return {
    animations: [...(animations || []), { ...animation, id: nextIdString }],
    nextId: nextIdString,
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
