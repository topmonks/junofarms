import { Fragment, useMemo, useRef, useState } from "react";
import { Button } from "@chakra-ui/react";
import { useQueryClient as useReactQueryClient } from "@tanstack/react-query";
import { useRecoilState } from "recoil";
import useCanvasBridge from "../../../hooks/use-canvas-bridge";
import { useJunofarmsHarvestMutation } from "../../../codegen/Junofarms.react-query";
import useJunofarmsSignClient from "../../../hooks/use-juno-junofarms-sign-client";
import {
  gameState,
  pushAnimation,
  removeAnimation,
} from "../../../state/junofarms";
import * as gs from "../../../components/game-assets";
import useTxSuccess from "../../../hooks/use-tx-success";

export default function Harvest() {
  const [selectedCoords, setSelectedCoords] = useState<[number, number] | null>(
    null
  );
  const [game, setGame] = useRecoilState(gameState);

  useCanvasBridge("click", (opts: any) => {
    if (harvestMutation.isLoading) {
      return;
    }

    setSelectedCoords(opts.detail.coord);
  });

  const shovelAnimationId = useRef<number>();

  const reactQueryClient = useReactQueryClient();
  const junofarmsSignClient = useJunofarmsSignClient();

  const txSuccess = useTxSuccess();
  const harvestMutation = useJunofarmsHarvestMutation({
    onMutate: () => {
      if (selectedCoords) {
        setGame((g) => {
          const { nextId, animations } = pushAnimation(
            {
              coord: selectedCoords,
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
    onSuccess: (r) => {
      reactQueryClient.invalidateQueries([{ method: "get_farm_profile" }]);
      txSuccess(r, {
        title: "Successfully harvested",
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

  const isHarvestable = useMemo(() => {
    if (!selectedCoords) {
      return false;
    }

    const plant = game.grid[selectedCoords[0]][selectedCoords[1]].plant;

    return plant != null && plant.current_stage === plant.stages;
  }, [selectedCoords, game]);

  return (
    <Fragment>
      {selectedCoords && isHarvestable && (
        <Button
          width={"100%"}
          isLoading={harvestMutation.isLoading}
          loadingText={"Harvesting in progress"}
          onClick={() => {
            if (!junofarmsSignClient) {
              return;
            }

            harvestMutation.mutate({
              client: junofarmsSignClient,
              msg: {
                x: selectedCoords[0],
                y: selectedCoords[1],
              },
            });
          }}
        >
          Harvest
        </Button>
      )}
    </Fragment>
  );
}
