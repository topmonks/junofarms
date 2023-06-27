import { useRecoilState } from "recoil";
import { useEffect } from "react";

import { CELL_SIZE, gameState } from "../../state/junofarms";
import { ANIMAL_METADATA_TYPES } from "@topmonks/junofarms-komple/src/collections";
import * as gs from "../../components/game-assets";
import {
  Animal,
  AnimalPosition,
  AnimalPositionActivity,
  Animation,
  AnimationProps,
} from "../../types/types";

export default function useAnimals(address?: string) {
  useListAnimals(address);
  useMoveAnimals();
  useDisplayAnimals();
}

export function useListAnimals(address?: string) {
  const [, setGame] = useRecoilState(gameState);

  useEffect(() => {
    if (address !== "juno1zk4c4aamef42cgjexlmksypac8j5xw7n3s4wrd") {
      return;
    }
    setGame((g) => {
      const meadows = g.grid
        .map((r, x) =>
          r
            .map((p, y) => {
              if (p.type === "meadow") {
                return [x, y];
              } else {
                return null;
              }
            })
            .filter(Boolean)
        )
        .reduce((acc, r) => acc.concat(r), []);

      return {
        ...g,
        animals: [
          ...Array(7)
            .fill(0)
            .map((_i, ix) => ({
              id: "" + ix,
              type: ANIMAL_METADATA_TYPES.CHICK,
              change_timeout: Math.ceil(Math.random() * 10000) + 10000,
            })),
          ...Array(3)
            .fill(0)
            .map((_i, ix) => ({
              id: "" + (ix + 7),
              type: ANIMAL_METADATA_TYPES.PIGLET,
              change_timeout: Math.ceil(Math.random() * 10000) + 30000,
            })),
          ...Array(1)
            .fill(0)
            .map((_i, ix) => ({
              id: "" + (ix + 10),
              type: ANIMAL_METADATA_TYPES.CALF,
              change_timeout: Math.ceil(Math.random() * 10000) + 30000,
            })),
        ],
        animalPositions: [
          ...Array(11)
            .fill(0)
            .map((_i, ix) => ({
              id: "" + ix,
              activity: "idle" as AnimalPositionActivity,
              coord: meadows[Math.floor(Math.random() * meadows.length)] as [
                number,
                number
              ],
            })),
        ],
      };
    });
  }, [address, setGame]);
}

function moveAnimalCoord(n: number, max: number, min = 0) {
  const new_n = n + (Math.floor(Math.random() * 3) - 1);

  return Math.max(min, Math.min(max, new_n));
}

export function useMoveAnimals() {
  const [game, setGame] = useRecoilState(gameState);

  useEffect(() => {
    const ts = game.animals.map((a) => {
      return setInterval(() => {
        setGame((g) => {
          const a_pos = g.animalPositions.find((p) => p.id === a.id);

          if (!a_pos) {
            return g;
          }

          const [x, y] = a_pos.coord;
          let [new_x, new_y] = a_pos.coord;

          if (Math.random() < 0.5) {
            new_x = moveAnimalCoord(x, game.size - 1);
          } else {
            new_y = moveAnimalCoord(y, game.size - 1);
          }

          if (g.grid[new_x][new_y].type !== "meadow") {
            new_x = x;
            new_y = y;
          }

          let new_activity = a_pos.activity;

          if (new_x > x) {
            new_activity = "down";
          } else if (new_x < x) {
            new_activity = "up";
          } else if (new_y < y) {
            new_activity = "left";
          } else if (new_y > y) {
            new_activity = "right";
          } else {
            new_activity = Math.random() < 0.75 ? "idle" : "custom";
          }

          const animalPositions = g.animalPositions.map((a_pos) => {
            if (a_pos.id === a.id) {
              return {
                ...a_pos,
                activity: new_activity,
                coord: [new_x, new_y] as [number, number],
              };
            } else {
              return a_pos;
            }
          });

          return { ...g, animalPositions };
        });
      }, a.change_timeout);
    });

    return () => {
      ts.map((t) => clearInterval(t));
    };
  }, [game.size, game.animals, setGame]);
}

function getAnimalActivityPropsImage(
  type: Animal["type"],
  activity: AnimalPosition["activity"]
): { props: AnimationProps | undefined; image: HTMLImageElement | undefined } {
  let props;
  let image;
  if (type === ANIMAL_METADATA_TYPES.CHICK) {
    image = gs.chickWalkImg;
    if (activity === "left") {
      props = gs.chickLeftAnimation;
    } else if (activity === "right") {
      props = gs.chickRightAnimation;
    } else if (activity === "down") {
      props = gs.chickDownAnimation;
    } else if (activity === "up") {
      props = gs.chickUpAnimation;
    } else if (activity === "custom") {
      props = gs.chickPeckAnimation;
      image = gs.chickPeckImg;
    } else if (activity === "idle") {
      props = gs.chickIdleAnimation;
      image = gs.chickIdleImg;
    }
  } else if (type === ANIMAL_METADATA_TYPES.CALF) {
    image = gs.calfWalkImg;
    if (activity === "left") {
      props = gs.calfLeftAnimation;
    } else if (activity === "right") {
      props = gs.calfRightAnimation;
    } else if (activity === "down") {
      props = gs.calfDownAnimation;
    } else if (activity === "up") {
      props = gs.calfUpAnimation;
    } else if (activity === "custom") {
      props = gs.calfIdleAnimation;
      image = gs.calfIdleImg;
    } else if (activity === "idle") {
      props = gs.calfIdleAnimation;
      image = gs.calfIdleImg;
    }
  } else if (type === ANIMAL_METADATA_TYPES.PIGLET) {
    image = gs.pigletWalkImg;
    if (activity === "left") {
      props = gs.pigletLeftAnimation;
    } else if (activity === "right") {
      props = gs.pigletRightAnimation;
    } else if (activity === "down") {
      props = gs.pigletDownAnimation;
    } else if (activity === "up") {
      props = gs.pigletUpAnimation;
    } else if (activity === "custom") {
      props = gs.pigletWallowingAnimation;
      image = gs.pigletWallowingImg;
    } else if (activity === "idle") {
      props = gs.pigletIdleAnimation;
      image = gs.pigletIdleImg;
    }
  }

  return { props, image };
}

export function useDisplayAnimals() {
  const [game, setGame] = useRecoilState(gameState);

  useEffect(() => {
    setGame((g) => {
      const animations = g.animalPositions
        .map((p) => {
          const animal = g.animals?.find((a) => a.id === p.id);
          if (!animal) {
            return null;
          }

          const current_anim = g.animations?.find((a) => a.id === p.id);
          const { props, image } = getAnimalActivityPropsImage(
            animal.type,
            p.activity
          );

          if (
            current_anim?.coord[0] === p.coord[0] &&
            current_anim?.coord[1] === p.coord[1] &&
            current_anim?.props?.propId === props?.propId
          ) {
            return current_anim;
          }

          if (!image || !props) {
            return null;
          }

          return {
            id: p.id,
            coord: p.coord,
            currentFrame: props.offsetFrame || 0,
            delta: 0,
            image: image,
            props: {
              ...props,
              offsetheight: Math.floor(
                Math.random() * (CELL_SIZE - (props.dheight || props.height))
              ),
              offsetwidth: Math.floor(
                Math.random() * (CELL_SIZE - (props.dwidth || props.height))
              ),
            },
          };
        })
        .filter((a): a is Animation => a != null);

      return {
        ...g,
        animations: animations,
      };
    });
  }, [game.animalPositions, setGame]);
}
