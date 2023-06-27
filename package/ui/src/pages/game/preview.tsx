import { Fragment, useEffect, useMemo, useRef } from "react";
import { useRecoilState, useRecoilValue, useResetRecoilState } from "recoil";
import {
  Box,
  Button,
  Divider,
  Flex,
  Heading,
  useToast,
} from "@chakra-ui/react";
import { useNavigate, useParams } from "react-router-dom";

import { useJunofarmsGetFarmProfileQuery } from "../../codegen/Junofarms.react-query";
import useJunofarmsQueryClient from "../../hooks/use-juno-junofarms-query-client";
import Canvas from "./canvas";
import { factories, gameState } from "../../state/junofarms";
import WithWallet from "../../components/with-wallet";
import { chainState } from "../../state/cosmos";
import { useChain } from "@cosmos-kit/react";
import useAnimals from "../../hooks/animals/use-animals";

export default function Preview() {
  const junofarmsQueryClient = useJunofarmsQueryClient();

  const chain = useRecoilValue(chainState);
  const { address: visitorAddress } = useChain(chain.chain_name);

  const visitorFarmProfile = useJunofarmsGetFarmProfileQuery({
    client: junofarmsQueryClient,
    args: {
      address: visitorAddress!,
    },
    options: {
      staleTime: 300000,
      suspense: true,
      enabled: Boolean(visitorAddress),
    },
  });

  const { address } = useParams();
  useAnimals(address);

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
  const theAddressHasNoFarm = useMemo(
    () => Boolean(address) && farmProfile.data === null,
    [address, farmProfile.data]
  );

  const toast = useToast();
  const navigate = useNavigate();
  useEffect(() => {
    if (theAddressHasNoFarm) {
      toast({
        title: "The address " + address + " farm not found",
        status: "error",
      });
      navigate("/game");
    }
  }, [theAddressHasNoFarm, toast, address, navigate]);

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [game, setGame] = useRecoilState(gameState);
  const resetGame = useResetRecoilState(gameState);

  useEffect(() => {
    if (farmProfile.data == null) {
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
  }, [farmProfile.data, setGame]);

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
              <Button
                width={"100%"}
                onClick={() => {
                  navigate("/game");
                  resetGame();
                }}
                variant="outline"
              >
                {visitorFarmProfile.data
                  ? "Return to your farm"
                  : "Want your own farm?"}
              </Button>
            </Box>
          </WithWallet>
        </Box>
        <Box flexGrow={1}>
          <Canvas
            disabled={theAddressHasNoFarm}
            forwardRef={canvasRef}
            game={game}
          />
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
