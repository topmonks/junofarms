import { Fragment, useCallback } from "react";
import { v4 as uuid } from "uuid";
import * as gs from "../../components/game-assets";
import { Event } from "../../types/types";
import { dispatchEvent } from "../../hooks/use-canvas-bridge";
import { canvasCoordToCartesian } from "../../lib/game";

const CELL_SIZE = 48;
export const GRID_SIZE = 9;

const SLOT_MEADOW = "meadow";
const SLOT_FIELD = "field";

interface MeadowSlot {
  type: typeof SLOT_MEADOW;
  plant?: Plant;
  image: HTMLImageElement;
}

const PLANT_SUNFLOWER = "sunflower";

type PLANT_TYPE = typeof PLANT_SUNFLOWER;

interface Plant {
  type: PLANT_TYPE;
  currentStage: number;
  stages: number;
  images: HTMLImageElement[];
}

interface FieldSlot {
  type: typeof SLOT_FIELD;
  plant?: Plant;
  image: HTMLImageElement;
}

type Slot = MeadowSlot | FieldSlot;

const CATEGORY_PLANT = "plant";
const CATEGORY_TERRAIN = "terrain";

const categories = {
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

interface GameState {
  canvas: HTMLCanvasElement;
  prevTime: number;
  size: number;
  canvasWidth: number;
  canvasHeight: number;
  grid: Slot[][];
  inst: string;
  events: Event[];
  select?: {
    coord: [number, number];
    items: { type: keyof typeof categories; image: HTMLImageElement }[][];
  };
  hovered?: [number, number];
}

const factories = {
  [SLOT_MEADOW]: () => Object.assign({}, categories[SLOT_MEADOW]),
  [SLOT_FIELD]: () => Object.assign({}, categories[SLOT_FIELD]),
  [PLANT_SUNFLOWER]: () => Object.assign({}, categories[PLANT_SUNFLOWER]),
};

const slotOptions = {
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

function clip(min: number, max: number, n: number): number {
  return Math.max(min, Math.min(max, n));
}

function cellCoord(x: number, y: number, grid_size: number): [number, number] {
  return [
    clip(0, grid_size - 1, Math.floor(y / CELL_SIZE)),
    clip(0, grid_size - 1, Math.floor(x / CELL_SIZE)),
  ];
}

function partitionAll<T>(array: readonly T[], n: number): any {
  const result = [];
  for (let i = 0; i < array.length; i += n) {
    result.push(array.slice(i, i + n));
  }

  return result;
}

function update(state: GameState, delta: number) {
  let event = state.events.shift();
  while (event != null) {
    switch (event.type) {
      case "click":
        {
          const coord = cellCoord(event.x, event.y, state.size);
          const cell = state.grid[coord[0]][coord[1]];

          const select = state.select;
          if (select == null) {
            dispatchEvent("click", {
              coord: canvasCoordToCartesian(coord[1], coord[0], state.size),
            });

            if (cell.plant == null) {
              const items = slotOptions[cell.type];
              if (items != null) {
                state.select = {
                  coord,
                  items: partitionAll<any>(items, state.size),
                };
              }
            } else {
              if (cell.plant.currentStage < cell.plant.stages) {
                cell.plant.currentStage++;
              }
            }
          } else {
            const selected = select.items[coord[0]]?.[coord[1]];
            if (selected == null) {
              dispatchEvent("click", { coord: null });
              delete state.select;
            } else {
              const selectedCoord = select.coord;
              switch (categories[selected.type].category) {
                case "terrain":
                  state.grid[selectedCoord[0]][selectedCoord[1]] = factories[
                    selected.type
                  ]() as Slot;
                  delete state.select;
                  break;
                case "plant":
                  state.grid[selectedCoord[0]][selectedCoord[1]].plant =
                    factories[PLANT_SUNFLOWER]();
                  delete state.select;
                  break;
              }
            }
          }
        }
        break;
      case "hover":
        {
          const coord = cellCoord(event.x, event.y, state.size);
          state.hovered = coord;
        }
        break;
      case "leave":
        delete state.hovered;
        break;
    }

    event = state.events.shift();
  }
}

function showTextBubble(
  ctx: CanvasRenderingContext2D,
  text: string,
  x: number,
  y: number,
  canvasWidth: number,
  canvasHeight: number
) {
  ctx.fillStyle = "rgb(0, 0, 0)";
  ctx.font = "16px sans-serif";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";

  const measurement = ctx.measureText(text);

  const baseBubbleWidth = gs.bubbleLeftImg.width + gs.bubbleRightImg.width;
  const textWidth = measurement.width;
  const requiredExtraSpace = Math.max(0, textWidth - baseBubbleWidth);
  const middleTimes =
    Math.ceil(requiredExtraSpace / gs.bubbleMiddleImg.width) + 1;

  let xOffset = x;
  let yOffset = y;
  const bubbleWidth = baseBubbleWidth + middleTimes * gs.bubbleMiddleImg.width;
  const bubbleHeight = gs.bubbleLeftImg.height;
  if (xOffset + bubbleWidth > canvasWidth) {
    xOffset = xOffset - bubbleWidth;
  }
  if (yOffset + bubbleHeight > canvasHeight) {
    yOffset = yOffset - bubbleHeight;
  }

  let width = 0;
  ctx.drawImage(gs.bubbleLeftImg, xOffset + width, yOffset);
  width += gs.bubbleLeftImg.width;
  for (let i = 0; i < middleTimes; i++) {
    ctx.drawImage(gs.bubbleMiddleImg, xOffset + width, yOffset);
    width += gs.bubbleMiddleImg.width;
  }
  ctx.drawImage(gs.bubbleRightImg, xOffset + width, yOffset);
  width += gs.bubbleRightImg.width;

  ctx.fillText(
    text,
    xOffset + width / 2,
    yOffset + gs.bubbleLeftImg.height / 2
  );
}

function render(state: GameState, delta: number) {
  const canvas = state.canvas;
  const grid = state.grid;

  const ctx = canvas.getContext("2d")!;

  ctx.clearRect(0, 0, state.canvasWidth, state.canvasHeight);
  for (let row = 0; row < state.size; row++) {
    for (let col = 0; col < state.size; col++) {
      const cell = grid[row][col];
      ctx.drawImage(cell.image, col * CELL_SIZE, row * CELL_SIZE);
      const plant = cell.plant;
      if (plant != null) {
        const img = plant.images[plant.currentStage - 1];
        for (let prow = 0; prow < 2; prow++) {
          for (let pcol = 0; pcol < 3; pcol++) {
            ctx.drawImage(
              img,
              col * CELL_SIZE + 16 * pcol,
              row * CELL_SIZE + 16 * prow
            );
          }
        }
      }
    }
  }

  const select = state.select;
  if (select != null) {
    ctx.fillStyle = "rgba(0, 0, 0, 0.6)";
    ctx.fillRect(0, 0, state.canvasWidth, state.canvasHeight);
    for (let row = 0; row < select.items.length; row++) {
      for (let col = 0; col < select.items[0].length; col++) {
        ctx.drawImage(gs.modalImg, col * CELL_SIZE, row * CELL_SIZE);
        ctx.drawImage(
          select.items[row][col].image,
          col * CELL_SIZE,
          row * CELL_SIZE
        );
      }
    }
  }

  const hovered = state.hovered;
  if (hovered != null) {
    showTextBubble(
      ctx,
      "Testing cell bubble.",
      hovered[1] * CELL_SIZE + CELL_SIZE / 2,
      hovered[0] * CELL_SIZE + CELL_SIZE / 2,
      state.canvasWidth,
      state.canvasHeight
    );
  }
}

function loop(state: GameState, currentTime: number) {
  if (state.canvas.dataset.inst !== state.inst) {
    return;
  }

  const delta = currentTime - state.prevTime;
  requestAnimationFrame((currentTime) => loop(state, currentTime));
  update(state, delta);
  render(state, delta);
}

interface StartGameProps {
  canvas: HTMLCanvasElement;
  inst: string;
  size?: number;
}

function startGame({ canvas, inst, size = GRID_SIZE }: StartGameProps) {
  const oldState = (window as any)._state;

  const state: GameState = oldState
    ? { ...oldState, inst, canvas }
    : {
        canvas,
        size,
        canvasHeight: size * CELL_SIZE,
        canvasWidth: size * CELL_SIZE,
        grid: new Array(size)
          .fill(undefined)
          .map(() =>
            new Array(size).fill(undefined).map(() => factories[SLOT_MEADOW]())
          ),
        prevTime: performance.now(),
        inst,
        events: [],
      };

  (window as any)._state = state;

  canvas.onselectstart = function (e) {
    e.preventDefault(); // prevent selecting text on page around canvas
  };
  canvas.onclick = function (e) {
    state.events.push({ type: "click", x: e.offsetX, y: e.offsetY });
  };
  canvas.onmousemove = function (e) {
    state.events.push({ type: "hover", x: e.offsetX, y: e.offsetY });
  };
  canvas.onmouseleave = function () {
    state.events.push({ type: "leave" });
  };

  requestAnimationFrame((currentTime) => loop(state, currentTime));
}

type GameOptions = {
  size: number;
};

export default function Canvas({ options }: { options: GameOptions }) {
  const canvasRef = useCallback(
    (canvas: HTMLCanvasElement) => {
      if (!canvas) {
        return;
      }

      if (canvas.dataset.inst == null) {
        canvas
          .getContext("2d")
          ?.scale(window.devicePixelRatio, window.devicePixelRatio);
      }

      const inst = uuid();
      canvas.dataset.inst = inst;

      startGame({ canvas, inst, size: options?.size });
    },
    [options]
  );

  return (
    <Fragment>
      <canvas
        width={options.size * CELL_SIZE * window.devicePixelRatio}
        height={options.size * CELL_SIZE * window.devicePixelRatio}
        tabIndex={1}
        style={{
          border: "1px solid",
          display: "block",
          margin: "0 auto",
          width: `${options.size * CELL_SIZE}px`,
          height: `${options.size * CELL_SIZE}px`,
        }}
        ref={canvasRef}
      />
    </Fragment>
  );
}
