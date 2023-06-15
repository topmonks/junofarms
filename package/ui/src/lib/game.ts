export function canvasCoordToCartesian(x: number, y: number, height: number) {
  return [x, height - y - 1];
}
