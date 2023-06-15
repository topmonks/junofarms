import { Fragment, useCallback } from "react";
import { v4 as uuid } from "uuid";
import * as gs from "../../components/game-assets";
import useJunoQueryClient from "../../hooks/use-juno-query-client";
import { useChain } from "@cosmos-kit/react";
import { useRecoilValue } from "recoil";
import { chainState } from "../../state/cosmos";
import {
  useJunofarmsGetFarmProfileQuery,
  useJunofarmsStartMutation,
} from "../../codegen/Junofarms.react-query";
import { Button } from "@chakra-ui/react";
import { useQueryClient as useReactQueryClient } from "@tanstack/react-query";
import useJunoSignClient from "../../hooks/use-juno-sign-client";
import useJunofarmsQueryClient from "../../hooks/use-juno-junofarms-query-client";
import useJunofarmsSignClient from "../../hooks/use-juno-junofarms-sign-client";

const CELL_SIZE = 48;
const GRID_SIZE = 9;
const CANVAS_W = CELL_SIZE * GRID_SIZE;
const CANVAS_H = CANVAS_W;

interface ClickEvent {
  type: "click";
  x: number;
  y: number;
}

interface HoverEvent {
  type: "hover";
  x: number;
  y: number;
}

interface LeaveEvent {
  type: "leave";
}

type Event = ClickEvent | HoverEvent | LeaveEvent;

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

function cellCoord(x: number, y: number): [number, number] {
  return [
    clip(0, GRID_SIZE - 1, Math.floor(y / CELL_SIZE)),
    clip(0, GRID_SIZE - 1, Math.floor(x / CELL_SIZE)),
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
          const coord = cellCoord(event.x, event.y);
          const cell = state.grid[coord[0]][coord[1]];

          const select = state.select;
          if (select == null) {
            if (cell.plant == null) {
              const items = slotOptions[cell.type];
              if (items != null) {
                state.select = {
                  coord,
                  items: partitionAll<any>(items, GRID_SIZE),
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
          const coord = cellCoord(event.x, event.y);
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
  y: number
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
  if (xOffset + bubbleWidth > CANVAS_W) {
    xOffset = xOffset - bubbleWidth;
  }
  if (yOffset + bubbleHeight > CANVAS_H) {
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

  ctx.clearRect(0, 0, CANVAS_W, CANVAS_H);
  for (let row = 0; row < GRID_SIZE; row++) {
    for (let col = 0; col < GRID_SIZE; col++) {
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
    ctx.fillRect(0, 0, CANVAS_W, CANVAS_H);
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
      hovered[0] * CELL_SIZE + CELL_SIZE / 2
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
}

function startGame({ canvas, inst }: StartGameProps) {
  const oldState = (window as any)._state;

  const state: GameState = oldState
    ? { ...oldState, inst, canvas }
    : {
        canvas,
        grid: new Array(GRID_SIZE)
          .fill(undefined)
          .map(() =>
            new Array(GRID_SIZE)
              .fill(undefined)
              .map(() => factories[SLOT_MEADOW]())
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

function Canvas() {
  const canvasRef = useCallback((canvas: HTMLCanvasElement) => {
    if (!canvas) {
      return;
    }

    const inst = uuid();
    canvas.dataset.inst = inst;
    startGame({ canvas, inst });
  }, []);

  return (
    <Fragment>
      <canvas
        width={`${CANVAS_W}px`}
        height={`${CANVAS_H}px`}
        tabIndex={1}
        style={{ border: "1px solid", display: "block", margin: "0 auto" }}
        ref={canvasRef}
      />
    </Fragment>
  );
}

export default function Game() {
  const junofarmsQueryClient = useJunofarmsQueryClient();
  const junofarmsSignClient = useJunofarmsSignClient();

  const chain = useRecoilValue(chainState);
  const { address } = useChain(chain.chain_name);
  const reactQueryClient = useReactQueryClient();

  const farmProfile = useJunofarmsGetFarmProfileQuery({
    client: junofarmsQueryClient,
    args: {
      address: address!,
    },
    options: {
      staleTime: 300000,
      suspense: true,
      enabled: Boolean(address),
    },
  });

  const startMutation = useJunofarmsStartMutation({
    onSuccess: () => {
      reactQueryClient.invalidateQueries([{ method: "get_farm_profile" }]);
    },
  });

  return (
    <Fragment>
      {farmProfile.data === null && (
        <Fragment>
          <Button
            onClick={() => {
              if (!junofarmsSignClient) {
                return;
              }
              startMutation.mutate({
                client: junofarmsSignClient,
                args: {},
              });
            }}
          >
            Build new farm
          </Button>
        </Fragment>
      )}
      <Canvas />
    </Fragment>
  );
}
