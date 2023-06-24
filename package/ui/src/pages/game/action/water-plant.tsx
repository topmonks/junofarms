import { Fragment, useMemo, useRef, useState } from "react";
import { Button } from "@chakra-ui/react";
import { useQueryClient as useReactQueryClient } from "@tanstack/react-query";
import { useRecoilState } from "recoil";
import useCanvasBridge from "../../../hooks/use-canvas-bridge";
import { useJunofarmsWaterPlantMutation } from "../../../codegen/Junofarms.react-query";
import useJunofarmsSignClient from "../../../hooks/use-juno-junofarms-sign-client";
import {
  gameState,
  pushAnimation,
  removeAnimation,
} from "../../../state/junofarms";
import * as gs from "../../../components/game-assets";
import useTxSuccess from "../../../hooks/use-tx-success";

export default function WaterPlant() {
  const [selectedCoords, setSelectedCoords] = useState<[number, number] | null>(
    null
  );
  const [game, setGame] = useRecoilState(gameState);

  useCanvasBridge("click", (opts: any) => {
    if (waterPlantMutation.isLoading) {
      return;
    }

    setSelectedCoords(opts.detail.coord);
  });

  const waterAnimationId = useRef<number>();

  const reactQueryClient = useReactQueryClient();
  const junofarmsSignClient = useJunofarmsSignClient();

  const txSuccess = useTxSuccess();
  const waterPlantMutation = useJunofarmsWaterPlantMutation({
    onMutate: () => {
      if (selectedCoords) {
        setGame((g) => {
          const { nextId, animations } = pushAnimation(
            {
              coord: selectedCoords,
              currentFrame: 0,
              delta: 0,
              image: gs.characterWaterImg,
              props: gs.characterWaterAnimation,
            },
            g.animations
          );

          waterAnimationId.current = nextId;

          return {
            ...g,
            animations: animations,
          };
        });
      }
    },
    onSuccess: (r) => {
      reactQueryClient.invalidateQueries([{ method: "get_farm_profile" }]);
      txSuccess(r, {
        title: "Successfully watered plant",
      });

      if (selectedCoords) {
        setGame((g) => {
          const { animations } = pushAnimation(
            {
              coord: selectedCoords,
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
        if (waterAnimationId.current != null) {
          const { animations } = removeAnimation(
            waterAnimationId.current,
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

  const isWaterable = useMemo(() => {
    if (!selectedCoords) {
      return false;
    }

    const plant = game.grid[selectedCoords[0]][selectedCoords[1]].plant;

    return plant != null && plant.current_stage < plant.stages;
  }, [selectedCoords, game]);

  return (
    <Fragment>
      {selectedCoords && isWaterable && (
        <Button
          width={"100%"}
          isLoading={waterPlantMutation.isLoading}
          loadingText={"Watering plant in progress"}
          onClick={() => {
            if (!junofarmsSignClient) {
              return;
            }

            waterPlantMutation.mutate({
              client: junofarmsSignClient,
              msg: {
                x: selectedCoords[0],
                y: selectedCoords[1],
              },
            });
          }}
        >
          Water plant
        </Button>
      )}
    </Fragment>
  );
}
