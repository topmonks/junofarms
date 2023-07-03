import { Fragment, useEffect, useMemo } from "react";
import { v4 as uuid } from "uuid";
import * as gs from "../../components/game-assets";
import { Animation, GameState } from "../../types/types";
import { dispatchEvent } from "../../hooks/use-canvas-bridge";
import { CELL_SIZE } from "../../state/junofarms";
import { Box } from "@chakra-ui/react";

function clip(min: number, max: number, n: number): number {
  return Math.max(min, Math.min(max, n));
}

function cellCoord(x: number, y: number, grid_size: number): [number, number] {
  return [
    clip(0, grid_size - 1, Math.floor(y / CELL_SIZE)),
    clip(0, grid_size - 1, Math.floor(x / CELL_SIZE)),
  ];
}

function update(
  state: GameState,
  _canvas: HTMLCanvasElement,
  _canvasWidth: number,
  _canvasHeight: number,
  delta: number
) {
  let event = state.events.shift();
  while (event != null) {
    switch (event.type) {
      case "click":
        {
          const coord = cellCoord(event.x, event.y, state.size);

          const select = state.select;
          if (
            select &&
            select.coord[0] == coord[0] &&
            select.coord[1] == coord[1]
          ) {
            dispatchEvent("click", {
              coord: null,
            });

            delete state.select;
          } else {
            dispatchEvent("click", {
              coord: coord,
            });

            state.select = {
              coord,
              items: [],
            };
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

  const animations = state.animations;
  if (animations && animations.length > 0) {
    for (const animation of animations) {
      animation.delta += delta;
      animateSProps(animation);
    }
    state.animations = animations.filter(
      (a) => a.repeat == null || a.repeat > 0
    );
  }

  const hovered = state.hovered;
  if (hovered != null) {
    const plant = state.grid[hovered[0]][hovered[1]].plant;
    if (plant != null && !plant.is_dead && !plant.can_water) {
      const actionAt =
        plant.created_at + plant.current_stage * plant.growth_period;
      const cooldown = actionAt - state.blocks;

      state.help = `Next watering in ${cooldown} blocks.`;
    } else {
      delete state.help;
    }
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

function render(
  state: GameState,
  canvas: HTMLCanvasElement,
  canvasWidth: number,
  canvasHeight: number,
  _delta: number
) {
  const grid = state.grid;

  const ctx = canvas.getContext("2d")!;

  ctx.clearRect(0, 0, canvasWidth, canvasHeight);
  for (let row = 0; row < state.size; row++) {
    for (let col = 0; col < state.size; col++) {
      const cell = grid[row][col];
      ctx.drawImage(cell.image, col * CELL_SIZE, row * CELL_SIZE);
      const plant = cell.plant;
      if (plant != null) {
        const img = plant.is_dead
          ? plant.images[plant.stages]
          : plant.images[plant.current_stage - 1];
        for (let prow = 0; prow < 2; prow++) {
          for (let pcol = 0; pcol < 3; pcol++) {
            ctx.drawImage(
              img,
              col * CELL_SIZE + 16 * pcol,
              row * CELL_SIZE + 16 * prow
            );
          }

          if (plant.can_water) {
            ctx.drawImage(
              gs.wateringCanImg,
              col * CELL_SIZE + (CELL_SIZE / 2 - gs.wateringCanImg.width / 2),
              row * CELL_SIZE + (CELL_SIZE / 2 - gs.wateringCanImg.height / 2)
            );
          }
        }
      }
    }
  }

  const select = state.select;
  if (select != null) {
    ctx.drawImage(
      gs.gridSelectedImg,
      select.coord[1] * CELL_SIZE,
      select.coord[0] * CELL_SIZE,
      CELL_SIZE,
      CELL_SIZE
    );
  }

  const hovered = state.hovered;
  const help = state.help;
  if (hovered != null && help != null) {
    showTextBubble(
      ctx,
      help,
      hovered[1] * CELL_SIZE + CELL_SIZE / 2,
      hovered[0] * CELL_SIZE + CELL_SIZE / 2,
      canvasWidth,
      canvasHeight
    );
  }

  const animations = state.animations;
  if (animations && animations.length > 0) {
    for (const animation of animations) {
      const row = Math.floor(animation.currentFrame / animation.props.cols);
      const column = animation.currentFrame - row * animation.props.cols;
      const sx = column * animation.props.width;
      const sy = row * animation.props.height;
      ctx.drawImage(
        animation.image,
        sx,
        sy,
        animation.props.width,
        animation.props.height,
        (animation.props.offsetwidth || 0) + animation.coord[1] * CELL_SIZE,
        (animation.props.offsetheight || 0) + animation.coord[0] * CELL_SIZE,
        animation.props.dwidth || CELL_SIZE,
        animation.props.dheight || CELL_SIZE
      );
    }
  }
}

function animateSProps(animation: Animation) {
  if (animation.delta > animation.props.timeout) {
    animation.currentFrame++;
    animation.delta = 0;

    if (
      animation.currentFrame >
      animation.props.cols * animation.props.rows - 1
    ) {
      animation.currentFrame = animation.props.offsetFrame || 0;

      if (animation.repeat) {
        animation.repeat--;
      }
    }
  }
}

function loop(
  state: GameState,
  inst: string,
  canvas: HTMLCanvasElement,
  canvasWidth: number,
  canvasHeight: number,
  currentTime: number
) {
  if (canvas.dataset.inst !== inst) {
    return;
  }

  const delta = Math.abs(currentTime - state.prevTime);
  requestAnimationFrame((currentTime) =>
    loop(state, inst, canvas, canvasWidth, canvasHeight, currentTime)
  );
  update(state, canvas, canvasWidth, canvasHeight, delta);
  render(state, canvas, canvasWidth, canvasHeight, delta);
  state.prevTime = currentTime;
}

interface StartGameProps {
  state: GameState;
  inst: string;
  canvas: HTMLCanvasElement;
  canvasHeight: number;
  canvasWidth: number;
}

function startGame({
  state,
  inst,
  canvas,
  canvasHeight,
  canvasWidth,
}: StartGameProps) {
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

  requestAnimationFrame((currentTime) =>
    loop(state, inst, canvas, canvasWidth, canvasHeight, currentTime)
  );
}

export default function Canvas({
  game,
  forwardRef,
  disabled = false,
}: {
  game: GameState;
  forwardRef: React.MutableRefObject<HTMLCanvasElement | null>;
  disabled: boolean;
}) {
  const [h, w] = useMemo(
    () => [game.size * CELL_SIZE, game.size * CELL_SIZE],
    [game]
  );

  useEffect(() => {
    const canvas = forwardRef.current;
    if (!canvas) {
      return;
    }

    const inst = uuid();
    canvas.dataset.inst = inst;

    startGame({
      state: game,
      inst,
      canvas: canvas,
      canvasHeight: h,
      canvasWidth: w,
    });

    return () => {
      if (canvas) {
        canvas.dataset.inst = undefined;
      }
    };
  }, [game, forwardRef, h, w]);

  useEffect(() => {
    const canvas = forwardRef.current;
    if (!canvas) {
      return;
    }

    canvas
      .getContext("2d")
      ?.scale(window.devicePixelRatio, window.devicePixelRatio);

    return () => {
      canvas.getContext("2d")?.resetTransform();
    };
  }, [game, forwardRef]);

  return (
    <Fragment>
      <Box sx={{ ...(disabled && { opacity: 0.3, pointerEvents: "none" }) }}>
        <canvas
          width={w * window.devicePixelRatio}
          height={h * window.devicePixelRatio}
          tabIndex={1}
          style={{
            border: "1px solid",
            display: "block",
            margin: "0 auto",
            width: `${w}px`,
            height: `${h}px`,
          }}
          ref={forwardRef}
        />
      </Box>
    </Fragment>
  );
}
