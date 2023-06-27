import {
  SEED_METADATA_TYPES,
  ANIMAL_METADATA_TYPES,
} from "@topmonks/junofarms-komple/src/collections";

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

export const PLANT_SUNFLOWER = SEED_METADATA_TYPES.SUNFLOWER;

export interface Plant {
  type: SEED_METADATA_TYPES;
  current_stage: number;
  stages: number;
  images: HTMLImageElement[];
  is_dead: boolean;
  can_water: boolean;
  can_harvest: boolean;
  created_at: number;
  growth_period: number;
}

export interface Slot {
  type: SlotType;
  plant?: Plant | null;
  image: HTMLImageElement;
  can_till: boolean;
}

export const CATEGORY_PLANT = "plant";
export const CATEGORY_TERRAIN = "terrain";

export type SLOT_TYPE = typeof SLOT_MEADOW | typeof SLOT_FIELD;

export interface GameState {
  prevTime: number;
  size: number;
  grid: Slot[][];
  events: Event[];
  select?: {
    coord: [number, number];
    items: { type: SLOT_TYPE; image: HTMLImageElement }[][];
  };
  animations?: Animation[];
  animals: Animal[];
  animalPositions: AnimalPosition[];
  hovered?: [number, number];
  help?: string;
  blocks: number;
}

export interface Animal {
  type:
    | ANIMAL_METADATA_TYPES.CHICK
    | ANIMAL_METADATA_TYPES.PIGLET
    | ANIMAL_METADATA_TYPES.CALF;
  id: string;
  change_timeout: number;
}

export type AnimalPositionActivity =
  | "left"
  | "right"
  | "up"
  | "down"
  | "idle"
  | "custom";

export interface AnimalPosition {
  id: string;
  activity: AnimalPositionActivity;
  coord: [number, number];
}

export interface Animation {
  id: string;
  coord: [number, number];
  props: AnimationProps;
  image: HTMLImageElement;
  currentFrame: number;
  repeat?: number;
  fadeIn?: number;
  delta: number;
}

export interface AnimationProps {
  propId?: string;
  width: number;
  height: number;
  rows: number;
  cols: number;
  timeout: number;
  dwidth?: number;
  dheight?: number;
  offsetwidth?: number;
  offsetheight?: number;
  offsetFrame?: number;
}
