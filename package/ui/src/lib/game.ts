import { GameState, Slot } from "../types/types";

export function canvasCoordToCartesian(
  x: number,
  y: number,
  height: number
): [number, number] {
  return [x, height - y - 1];
}

export function cartesianCoordToCanvas(
  x: number,
  y: number,
  height: number
): [number, number] {
  return [height - y - 1, x];
}

export function getTile(x: number, y: number, game: GameState): Slot {
  return game.grid[x][y];
}
