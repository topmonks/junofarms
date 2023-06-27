import { Fragment, useMemo, useRef, useState } from "react";
import { Button } from "@chakra-ui/react";
import { useQueryClient as useReactQueryClient } from "@tanstack/react-query";
import { useRecoilState } from "recoil";
import useCanvasBridge from "../../../hooks/use-canvas-bridge";
import { useJunofarmsTillGroundMutation } from "../../../codegen/Junofarms.react-query";
import useJunofarmsSignClient from "../../../hooks/use-juno-junofarms-sign-client";
import {
  gameState,
  pushAnimation,
  removeAnimation,
} from "../../../state/junofarms";
import * as gs from "../../../components/game-assets";
import { SLOT_MEADOW } from "../../../types/types";
import useTxSuccess from "../../../hooks/use-tx-success";

export default function TestAnimation() {
  const [selectedCoords, setSelectedCoords] = useState<[number, number] | null>(
    null
  );
  const [game, setGame] = useRecoilState(gameState);

  useCanvasBridge("click", (opts: any) => {
    setSelectedCoords(opts.detail.coord);
  });

  return (
    <Fragment>
      {selectedCoords && (
        <Button
          width={"100%"}
          loadingText={"Till in progress"}
          onClick={() => {
            if (selectedCoords) {
              setGame((g) => {
                const { animations } = pushAnimation(
                  {
                    coord: selectedCoords,
                    currentFrame: 0,
                    delta: 0,
                    repeat: 2,
                    image: gs.chickPeckImg,
                    props: {
                      ...gs.chickPeckAnimation,
                      offsetheight: Math.floor(Math.random() * 32),
                      offsetwidth: Math.floor(Math.random() * 32),
                    },
                  },
                  g.animations
                );

                return {
                  ...g,
                  animations: animations,
                };
              });
            }
          }}
        >
          Test animation
        </Button>
      )}
    </Fragment>
  );
}
