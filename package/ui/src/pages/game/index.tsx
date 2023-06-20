import { Fragment, useEffect, useMemo, useRef } from "react";
import { useChain } from "@cosmos-kit/react";
import { useRecoilState, useRecoilValue, useResetRecoilState } from "recoil";
import { Box, Flex, Heading } from "@chakra-ui/react";

import { chainState } from "../../state/cosmos";
import { useJunofarmsGetFarmProfileQuery } from "../../codegen/Junofarms.react-query";
import useJunofarmsQueryClient from "../../hooks/use-juno-junofarms-query-client";
import Till from "./action/till";
import Canvas from "./canvas";
import { factories, gameState } from "../../state/junofarms";
import { SLOT_MEADOW } from "../../types/types";
import { SLOT_FIELD } from "../../types/types";
import WithWallet from "../../components/with-wallet";
import StartGame from "./action/start-game";
import StopGame from "./action/stop-game";

export default function Game() {
  const junofarmsQueryClient = useJunofarmsQueryClient();

  const chain = useRecoilValue(chainState);
  const { address } = useChain(chain.chain_name);

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
  const hasNoFarm = useMemo(
    () => Boolean(address) && farmProfile.data === null,
    [address, farmProfile.data]
  );

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [game, setGame] = useRecoilState(gameState);
  const resetGame = useResetRecoilState(gameState);

  useEffect(() => {
    if (farmProfile.data == null) {
      resetGame();
      return;
    }

    setGame((g) => {
      return {
        ...g,
        size: farmProfile.data.plots.length,
        grid: farmProfile.data.plots.map((row) =>
          row.map((x) => {
            if (x.toString() === "Grass") {
              return factories[SLOT_MEADOW]();
            } else if (x.toString() === "Dirt") {
              return factories[SLOT_FIELD]();
            }

            throw new Error("unknown" + x.type);
          })
        ),
      };
    });
  }, [farmProfile.data, setGame, resetGame]);

  return (
    <Fragment>
      <Flex
        gap={{ base: 4, md: 4 }}
        w="100%"
        direction={{ base: "column", md: "row" }}
      >
        <Box flexBasis={"20%"} textAlign={"center"}>
          <Heading as="h3" size="sm" pb={2}>
            Available Actions
          </Heading>
          <WithWallet>
            <Box>
              <StartGame />
              <StopGame />
              <Till />
            </Box>
          </WithWallet>
        </Box>
        <Box flexGrow={1}>
          <Canvas disabled={hasNoFarm} forwardRef={canvasRef} game={game} />
        </Box>
        <Box flexBasis={"20%"}>
          <Heading as="h3" size="sm">
            Statistics
          </Heading>
        </Box>
      </Flex>
    </Fragment>
  );
}
