import { Fragment, useEffect, useRef } from "react";
import { useChain } from "@cosmos-kit/react";
import { v4 as uuid } from "uuid";
import { useRecoilState, useRecoilValue, useResetRecoilState } from "recoil";
import { Button } from "@chakra-ui/react";

import { chainState } from "../../state/cosmos";
import {
  useJunofarmsGetFarmProfileQuery,
  useJunofarmsStartMutation,
} from "../../codegen/Junofarms.react-query";
import { useQueryClient as useReactQueryClient } from "@tanstack/react-query";
import useJunofarmsQueryClient from "../../hooks/use-juno-junofarms-query-client";
import useJunofarmsSignClient from "../../hooks/use-juno-junofarms-sign-client";
import Menu from "../../components/menu";
import Canvas from "./canvas";
import { factories, gameState } from "../../state/junofarms";
import { SLOT_MEADOW } from "../../types/types";

export default function Game() {
  const junofarmsQueryClient = useJunofarmsQueryClient();
  const junofarmsSignClient = useJunofarmsSignClient();

  const chain = useRecoilValue(chainState);
  const { address } = useChain(chain.chain_name);
  const reactQueryClient = useReactQueryClient();

  const farmProfile = useJunofarmsGetFarmProfileQuery({
    client: junofarmsQueryClient,
    args: {
      address: address!,
    },
    options: {
      staleTime: 300000,
      suspense: true,
      enabled: Boolean(address),
    },
  });

  const startMutation = useJunofarmsStartMutation({
    onSuccess: () => {
      reactQueryClient.invalidateQueries([{ method: "get_farm_profile" }]);
    },
  });

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [game, setGame] = useRecoilState(gameState);
  const resetGame = useResetRecoilState(gameState);

  useEffect(() => {
    if (farmProfile.data == null) {
      resetGame();
      return;
    }

    const height = farmProfile.data.plots.length;
    const width = farmProfile.data.plots[0].length;

    setGame({
      size: height,
      grid: new Array(height)
        .fill(undefined)
        .map(() =>
          new Array(width).fill(undefined).map(() => factories[SLOT_MEADOW]())
        ),
      prevTime: performance.now(),
      inst: uuid(),
      events: [],
    });
  }, [farmProfile.data, setGame, resetGame]);

  return (
    <Fragment>
      {farmProfile.data === null && (
        <Fragment>
          <Button
            onClick={() => {
              if (!junofarmsSignClient) {
                return;
              }
              startMutation.mutate({
                client: junofarmsSignClient,
                args: {},
              });
            }}
          >
            Build a new farm
          </Button>
        </Fragment>
      )}
      <Canvas forwardRef={canvasRef} game={game} />
      <Menu />
    </Fragment>
  );
}
