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

const SLOT_EMPTY = "empty";
const SLOT_FIELD = "field";

interface EmptySlot {
  type: typeof SLOT_EMPTY;
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

type Slot = EmptySlot | FieldSlot;

function cellCoord(x: number, y: number): [number, number] {
  return [Math.floor(x / CELL_SIZE), Math.floor(y / CELL_SIZE)];
}

function update(state: GameState, delta: number) {
  let event = state.events.pop();
  while (event != null) {
    switch (event.type) {
      case "click":
        {
          const coord = cellCoord(event.x, event.y);
          console.log("==coord", coord);
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
      switch (grid[row][col].type) {
        case "empty":
          ctx.drawImage(gs.emptyImg, col * CELL_SIZE, row * CELL_SIZE);
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
  const state: GameState = {
    canvas,
    grid: new Array(GRID_SIZE).fill(
      new Array(GRID_SIZE).fill({ type: SLOT_EMPTY })
    ),
    prevTime: performance.now(),
    inst,
    events: [],
  };

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
