import { METADATA_TYPES } from "@topmonks/junofarms-komple/src/collections";

export interface ClickEvent {
  type: "click";
  x: number;
  y: number;
}

export interface HoverEvent {
  type: "hover";
  x: number;
  y: number;
}

export interface LeaveEvent {
  type: "leave";
}

export type Event = ClickEvent | HoverEvent | LeaveEvent;

export const SLOT_MEADOW = "meadow";
export const SLOT_FIELD = "field";

type SlotType = typeof SLOT_FIELD | typeof SLOT_MEADOW;

export const PLANT_SUNFLOWER = METADATA_TYPES.SUNFLOWER;

export type PLANT_TYPE = typeof PLANT_SUNFLOWER;

export interface Plant {
  type: PLANT_TYPE;
  current_stage: number;
  stages: number;
  images: HTMLImageElement[];
}

export interface Slot {
  type: SlotType;
  plant?: Plant | null;
  image: HTMLImageElement;
}

export const CATEGORY_PLANT = "plant";
export const CATEGORY_TERRAIN = "terrain";

export type SLOT_TYPE =
  | typeof SLOT_MEADOW
  | typeof SLOT_FIELD
  | typeof PLANT_SUNFLOWER;

export interface GameState {
  // canvas: HTMLCanvasElement | null;
  prevTime: number;
  size: number;
  grid: Slot[][];
  events: Event[];
  select?: {
    coord: [number, number];
    items: { type: SLOT_TYPE; image: HTMLImageElement }[][];
  };
  animations?: Animation[];
  hovered?: [number, number];
}

export interface Animation {
  id: number;
  coord: [number, number];
  props: AnimationProps;
  image: HTMLImageElement;
  currentFrame: number;
  repeat?: number;
  delta: number;
}

export interface AnimationProps {
  width: number;
  height: number;
  rows: number;
  cols: number;
  timeout: number;
}
