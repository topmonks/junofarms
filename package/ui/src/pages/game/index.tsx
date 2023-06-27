import { Fragment, useEffect, useMemo, useRef } from "react";
import { useChain } from "@cosmos-kit/react";
import { useRecoilState, useRecoilValue, useResetRecoilState } from "recoil";
import { Box, Divider, Flex, Heading } from "@chakra-ui/react";

import { chainState } from "../../state/cosmos";
import { useJunofarmsGetFarmProfileQuery } from "../../codegen/Junofarms.react-query";
import useJunofarmsQueryClient from "../../hooks/use-juno-junofarms-query-client";
import Till from "./action/till";
import Canvas from "./canvas";
import { factories, gameState } from "../../state/junofarms";
import WithWallet from "../../components/with-wallet";
import StartGame from "./action/start-game";
import StopGame from "./action/stop-game";
import WaterPlant from "./action/water-plant";
import Harvest from "./action/harvest";
import PlantSeedNft from "./action/plant-seed-nft";

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
      staleTime: 10000,
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
            const type = x.type;
            const factory = factories[type];
            if (factory == null) {
              throw new Error("Unknown grid item: " + type);
            }

            // FIX as any
            return factory(x as any);
          })
        ),
        select: undefined,
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
          <Divider sx={{ mb: 3 }} />
          <WithWallet WalletButtonProps={{ width: "100%" }}>
            <Box sx={{ display: "flex", gap: 2, flexDirection: "column" }}>
              <StartGame />
              <Till />
              <PlantSeedNft />
              <WaterPlant />
              <Harvest />
              <Box sx={{ mt: 5 }}>
                <StopGame />
              </Box>
            </Box>
          </WithWallet>
        </Box>
        <Box flexGrow={1}>
          <Canvas disabled={hasNoFarm} forwardRef={canvasRef} game={game} />
        </Box>
        <Box flexBasis={"20%"}>
          <Heading as="h3" size="sm" pb={2}>
            Statistics
          </Heading>
          <Divider sx={{ mb: 3 }} />
        </Box>
      </Flex>
    </Fragment>
  );
}
