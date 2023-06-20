import { Fragment } from "react";
import {
  useJunofarmsGetFarmProfileQuery,
  useJunofarmsStopMutation,
} from "../../../codegen/Junofarms.react-query";
import { useQueryClient as useReactQueryClient } from "@tanstack/react-query";
import { Button } from "@chakra-ui/react";
import useJunofarmsSignClient from "../../../hooks/use-juno-junofarms-sign-client";
import { useRecoilValue } from "recoil";
import { useChain } from "@cosmos-kit/react";
import useJunofarmsQueryClient from "../../../hooks/use-juno-junofarms-query-client";
import { chainState } from "../../../state/cosmos";

export default function StopGame() {
  const reactQueryClient = useReactQueryClient();
  const junofarmsQueryClient = useJunofarmsQueryClient();
  const junofarmsSignClient = useJunofarmsSignClient();
  const stopMutation = useJunofarmsStopMutation({
    onSuccess: () => {
      reactQueryClient.invalidateQueries([{ method: "get_farm_profile" }]);
    },
  });

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

  return (
    <Fragment>
      {address && farmProfile.data !== null && (
        <Button
          isLoading={stopMutation.isLoading}
          loadingText={"Removing in progress"}
          onClick={() => {
            if (!junofarmsSignClient) {
              return;
            }
            stopMutation.mutate({
              client: junofarmsSignClient,
              args: {},
            });
          }}
        >
          Remove the farm
        </Button>
      )}
    </Fragment>
  );
}
