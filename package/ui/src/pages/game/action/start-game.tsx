import { Fragment } from "react";
import { useChain } from "@cosmos-kit/react";
import { useRecoilState, useRecoilValue } from "recoil";
import { useQueryClient as useReactQueryClient } from "@tanstack/react-query";
import { Button } from "@chakra-ui/react";
import useJunofarmsQueryClient from "../../../hooks/use-juno-junofarms-query-client";
import {
  useJunofarmsGetFarmProfileQuery,
  useJunofarmsStartMutation,
} from "../../../codegen/Junofarms.react-query";
import * as gs from "../../../components/game-assets";
import { chainState } from "../../../state/cosmos";
import useJunofarmsSignClient from "../../../hooks/use-juno-junofarms-sign-client";
import { gameState, pushAnimation } from "../../../state/junofarms";

export default function StartGame() {
  const junofarmsQueryClient = useJunofarmsQueryClient();
  const junofarmsSignClient = useJunofarmsSignClient();
  const [, setGame] = useRecoilState(gameState);

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

  const reactQueryClient = useReactQueryClient();
  const startMutation = useJunofarmsStartMutation({
    onSuccess: () => {
      reactQueryClient.invalidateQueries([{ method: "get_farm_profile" }]);
      setGame((g) => {
        const { animations } = pushAnimation(
          {
            coord: [0, 0],
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
    },
  });

  return (
    <Fragment>
      {address && farmProfile.data === null && (
        <Button
          width={"100%"}
          isLoading={startMutation.isLoading}
          loadingText={"Building in progress"}
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
      )}
    </Fragment>
  );
}
