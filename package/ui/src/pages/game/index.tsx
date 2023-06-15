import { Fragment } from "react";
import { useChain } from "@cosmos-kit/react";
import { useRecoilValue } from "recoil";
import { chainState } from "../../state/cosmos";
import {
  useJunofarmsGetFarmProfileQuery,
  useJunofarmsStartMutation,
} from "../../codegen/Junofarms.react-query";
import { Button } from "@chakra-ui/react";
import { useQueryClient as useReactQueryClient } from "@tanstack/react-query";
import useJunofarmsQueryClient from "../../hooks/use-juno-junofarms-query-client";
import useJunofarmsSignClient from "../../hooks/use-juno-junofarms-sign-client";
import Menu from "../../components/menu";
import Canvas, { GRID_SIZE } from "./canvas";

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
      <Canvas options={{ size: farmProfile.data?.plots.length || GRID_SIZE }} />
      <Menu />
    </Fragment>
  );
}
