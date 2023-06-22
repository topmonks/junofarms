import { Fragment, useMemo, useRef, useState } from "react";
import { Button } from "@chakra-ui/react";
import { useQueryClient as useReactQueryClient } from "@tanstack/react-query";
import { useRecoilState } from "recoil";
import useCanvasBridge from "../../../hooks/use-canvas-bridge";
import { useJunofarmsPlantSeedMutation } from "../../../codegen/Junofarms.react-query";
import useJunofarmsSignClient from "../../../hooks/use-juno-junofarms-sign-client";
import {
  gameState,
  pushAnimation,
  removeAnimation,
} from "../../../state/junofarms";
import * as gs from "../../../components/game-assets";
import { SLOT_FIELD } from "../../../types/types";
import useTxSuccess from "../../../hooks/use-tx-success";

export default function PlantSeed() {
  const [selectedCoords, setSelectedCoords] = useState<[number, number] | null>(
    null
  );
  const [game, setGame] = useRecoilState(gameState);

  useCanvasBridge("click", (opts: any) => {
    if (plantSeedMutation.isLoading) {
      return;
    }

    setSelectedCoords(opts.detail.coord);
  });

  const shovelAnimationId = useRef<number>();

  const reactQueryClient = useReactQueryClient();
  const junofarmsSignClient = useJunofarmsSignClient();

  const txSuccess = useTxSuccess();
  const plantSeedMutation = useJunofarmsPlantSeedMutation({
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
        title: "Successfully planted seed",
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

  const isPlantable = useMemo(() => {
    if (!selectedCoords) {
      return false;
    }

    const slot = game.grid[selectedCoords[0]][selectedCoords[1]];

    return slot.type === SLOT_FIELD && slot.plant == null;
  }, [selectedCoords, game]);

  return (
    <Fragment>
      {selectedCoords && isPlantable && (
        <Button
          width={"100%"}
          isLoading={plantSeedMutation.isLoading}
          loadingText={"Planting seed in progress"}
          onClick={() => {
            if (!junofarmsSignClient) {
              return;
            }

            plantSeedMutation.mutate({
              client: junofarmsSignClient,
              msg: {
                x: selectedCoords[0],
                y: selectedCoords[1],
              },
            });
          }}
        >
          Plant seed
        </Button>
      )}
    </Fragment>
  );
}
