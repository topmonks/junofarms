import { Fragment, useCallback } from "react";
import * as gs from "../../components/game-assets";

const CELL_SIZE = 48;
const GRID_SIZE = 9;
const CANVAS_W = CELL_SIZE * GRID_SIZE;
const CANVAS_H = CANVAS_W;

interface ClickEvent {
  type: "click";
  x: number;
  y: number;
}

type Event = ClickEvent;

interface GameState {
  canvas: HTMLCanvasElement;
  prevTime: number;
  grid: Slot[][];
  inst: string;
  events: Event[];
}

const SLOT_MEADOW = "meadow";
const SLOT_FIELD = "field";

interface MeadowSlot {
  type: typeof SLOT_MEADOW;
}

interface Plant {
  type: string;
  currentStage: number;
  stages: number;
}

interface FieldSlot {
  type: typeof SLOT_FIELD;
  plant?: Plant;
}

type Slot = MeadowSlot | FieldSlot;

function cellCoord(x: number, y: number): [number, number] {
  return [Math.floor(y / CELL_SIZE), Math.floor(x / CELL_SIZE)];
}

function update(state: GameState, delta: number) {
  let event = state.events.pop();
  while (event != null) {
    switch (event.type) {
      case "click":
        {
          const coord = cellCoord(event.x, event.y);

          const cell = state.grid[coord[0]][coord[1]];
          switch (cell.type) {
            case SLOT_MEADOW:
              state.grid[coord[0]][coord[1]] = { type: SLOT_FIELD };
              break;
            case SLOT_FIELD:
              if (cell.plant == null) {
                cell.plant = {
                  type: "sunflower",
                  currentStage: 1,
                  stages: gs.sunflowerImg.length,
                };
              } else if (cell.plant.currentStage < cell.plant.stages) {
                cell.plant.currentStage++;
              }
              break;
          }
        }
        break;
    }
    event = state.events.pop();
  }
}

function render(state: GameState, delta: number) {
  const canvas = state.canvas;
  const grid = state.grid;

  const ctx = canvas.getContext("2d")!;

  ctx.clearRect(0, 0, CANVAS_W, CANVAS_H);
  for (let row = 0; row < GRID_SIZE; row++) {
    for (let col = 0; col < GRID_SIZE; col++) {
      const cell = grid[row][col];
      switch (cell.type) {
        case SLOT_MEADOW:
          ctx.drawImage(gs.meadowImg, col * CELL_SIZE, row * CELL_SIZE);
          break;
        case SLOT_FIELD:
          ctx.drawImage(gs.fieldImg, col * CELL_SIZE, row * CELL_SIZE);
          switch (cell.plant?.type) {
            case "sunflower":
              {
                const img = gs.sunflowerImg[cell.plant.currentStage - 1];
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
              break;
          }
          break;
      }
    }
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
          .map(() => new Array(GRID_SIZE).fill({ type: SLOT_MEADOW })),
        prevTime: performance.now(),
        inst,
        events: [],
      };

  (window as any)._state = state;

  canvas.onclick = function (e) {
    state.events.push({ type: "click", x: e.offsetX, y: e.offsetY });
  };

  requestAnimationFrame((currentTime) => loop(state, currentTime));
}

export default function Game() {
  const canvasRef = useCallback((canvas: HTMLCanvasElement) => {
    if (!canvas) {
      return;
    }

    const inst = crypto.randomUUID();
    canvas.dataset.inst = inst;
    startGame({ canvas, inst });
  }, []);

  return (
    <Fragment>
      <h1>Junofarms</h1>
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
