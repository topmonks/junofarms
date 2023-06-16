import { atom, selector } from "recoil";
import { v4 as uuid } from "uuid";

import * as gs from "../components/game-assets";
import { chainState } from "./cosmos";
import { TESTNET } from "../lib/config";
import {
  CATEGORY_PLANT,
  CATEGORY_TERRAIN,
  GameState,
  PLANT_SUNFLOWER,
  SLOT_FIELD,
  SLOT_MEADOW,
} from "../types/types";

export const contractState = selector<string>({
  key: "contractsState",
  get: async ({ get }) => {
    const chain = get(chainState);
    if (chain.chain_id === TESTNET.JUNO) {
      return "juno1hxareght6n8zh2epqwt8spfnn270q7ef8qj6p0p6vk8dcw4zsrsqj6p8ph";
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
  [PLANT_SUNFLOWER]: {
    type: PLANT_SUNFLOWER,
    category: CATEGORY_PLANT,
    images: gs.sunflowerImg,
    currentStage: 1,
    stages: gs.sunflowerImg.length,
  },
} as const;

export const factories = {
  [SLOT_MEADOW]: () => Object.assign({}, categories[SLOT_MEADOW]),
  [SLOT_FIELD]: () => Object.assign({}, categories[SLOT_FIELD]),
  [PLANT_SUNFLOWER]: () => Object.assign({}, categories[PLANT_SUNFLOWER]),
};

export const slotOptions = {
  [SLOT_MEADOW]: [{ type: SLOT_FIELD, image: categories[SLOT_FIELD].image }],
  [SLOT_FIELD]: [
    {
      type: PLANT_SUNFLOWER,
      image:
        categories[PLANT_SUNFLOWER].images[
          categories[PLANT_SUNFLOWER].stages - 2
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
    inst: uuid(),
    events: [],
  },
});
