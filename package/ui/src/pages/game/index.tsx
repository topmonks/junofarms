import { Fragment, useEffect, useRef } from "react";
import { useChain } from "@cosmos-kit/react";
import { useRecoilState, useRecoilValue, useResetRecoilState } from "recoil";
import { Box, Button, Container, Flex, Heading } from "@chakra-ui/react";

import { chainState } from "../../state/cosmos";
import {
  useJunofarmsGetFarmProfileQuery,
  useJunofarmsStartMutation,
} from "../../codegen/Junofarms.react-query";
import { useQueryClient as useReactQueryClient } from "@tanstack/react-query";
import useJunofarmsQueryClient from "../../hooks/use-juno-junofarms-query-client";
import useJunofarmsSignClient from "../../hooks/use-juno-junofarms-sign-client";
import Till from "../../components/till";
import Canvas from "./canvas";
import { factories, gameState } from "../../state/junofarms";
import { SLOT_MEADOW } from "../../types/types";
import { SLOT_FIELD } from "../../types/types";
import WithWallet from "../../components/with-wallet";

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

    setGame((g) => {
      return {
        ...g,
        size: height,
        grid: farmProfile.data.plots
          .map((y) =>
            y.map((x) => {
              if (x.toString() === "Grass") {
                return factories[SLOT_MEADOW]();
              } else if (x.toString() === "Dirt") {
                return factories[SLOT_FIELD]();
              }

              throw new Error("unknown" + x.type);
            })
          )
          .reverse(),
      };
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
              <Till />
            </Box>
          </WithWallet>
        </Box>
        <Box flexGrow={1}>
          <Canvas forwardRef={canvasRef} game={game} />
        </Box>
        <Box flexBasis={"20%"}>
          <Heading as="h3" size="sm">
            Statistics
          </Heading>
        </Box>
      </Flex>

      <Container>
        <Box></Box>
        <Box sx={{ pt: 6 }}></Box>
      </Container>
    </Fragment>
  );
}
