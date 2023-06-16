import { Fragment, useRef, useState } from "react";
import useCanvasBridge from "../hooks/use-canvas-bridge";
import { Button } from "@chakra-ui/react";
import { useQueryClient as useReactQueryClient } from "@tanstack/react-query";
import { useJunofarmsTillGroundMutation } from "../codegen/Junofarms.react-query";
import useJunofarmsSignClient from "../hooks/use-juno-junofarms-sign-client";
import { gameState, pushAnimation, removeAnimation } from "../state/junofarms";
import { useRecoilState } from "recoil";
import { cartesianCoordToCanvas } from "../lib/game";
import * as gs from "../components/game-assets";

export default function Till() {
  const [selectedCoords, setSelectedCoords] = useState<[number, number] | null>(
    null
  );
  const [, setGame] = useRecoilState(gameState);

  useCanvasBridge("click", (opts: any) => {
    console.log(opts.detail.coord);
    setSelectedCoords(opts.detail.coord);
  });

  const shovelAnimationId = useRef<number>();

  const reactQueryClient = useReactQueryClient();
  const junofarmsSignClient = useJunofarmsSignClient();
  const tillGroundMutation = useJunofarmsTillGroundMutation({
    onMutate: () => {
      if (selectedCoords) {
        setGame((g) => {
          const { nextId, animations } = pushAnimation(
            {
              coord: cartesianCoordToCanvas(...selectedCoords, g.size),
              currentFrame: 0,
              delta: 0,
              image: gs.characterShovelImg,
              props: gs.characterShovelAnimation,
            },
            g.animations
          );

          shovelAnimationId.current = nextId;

          return {
            ...g,
            animations: animations,
          };
        });
      }
    },
    onSuccess: () => {
      reactQueryClient.invalidateQueries([{ method: "get_farm_profile" }]);

      if (selectedCoords) {
        setGame((g) => {
          const { animations } = pushAnimation(
            {
              coord: cartesianCoordToCanvas(...selectedCoords, g.size),
              currentFrame: 0,
              delta: 0,
              repeat: 2,
              image: gs.characterIdleImg,
              props: gs.characterIdleAnimation,
            },
            g.animations
          );

          return {
            ...g,
            animations: animations,
          };
        });
      }
    },
    onSettled: () => {
      setGame((g) => {
        if (shovelAnimationId.current != null) {
          const { animations } = removeAnimation(
            shovelAnimationId.current,
            g.animations
          );

          return {
            ...g,
            animations,
          };
        }

        return g;
      });
    },
  });

  return (
    <Fragment>
      {selectedCoords && (
        <Button
          onClick={() => {
            if (!junofarmsSignClient) {
              return;
            }

            tillGroundMutation.mutate({
              client: junofarmsSignClient,
              msg: {
                x: selectedCoords[0],
                y: selectedCoords[1],
              },
            });
          }}
        >
          Till
        </Button>
      )}
    </Fragment>
  );
}
