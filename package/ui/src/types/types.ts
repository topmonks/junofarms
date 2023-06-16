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

export interface MeadowSlot {
  type: typeof SLOT_MEADOW;
  plant?: Plant;
  image: HTMLImageElement;
}

export const PLANT_SUNFLOWER = "sunflower";

export type PLANT_TYPE = typeof PLANT_SUNFLOWER;

export interface Plant {
  type: PLANT_TYPE;
  currentStage: number;
  stages: number;
  images: HTMLImageElement[];
}

export interface FieldSlot {
  type: typeof SLOT_FIELD;
  plant?: Plant;
  image: HTMLImageElement;
}

export type Slot = MeadowSlot | FieldSlot;

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
  inst: string;
  events: Event[];
  select?: {
    coord: [number, number];
    items: { type: SLOT_TYPE; image: HTMLImageElement }[][];
  };
  animations?: Animation[];
  hovered?: [number, number];
}

export interface Animation {
  coord: [number, number];
  props: AnimationProps;
  image: HTMLImageElement;
  currentFrame: number;
  delta: number;
}

export interface AnimationProps {
  width: number;
  height: number;
  rows: number;
  cols: number;
  timeout: number;
}
