import { useChain } from "@cosmos-kit/react";
import { useRecoilValue } from "recoil";
import { suspend } from "suspend-react";

import { chainState } from "../state/cosmos";

export default function useJunoQueryClient() {
  const chain = useRecoilValue(chainState);
  const { getCosmWasmClient } = useChain(chain.chain_name);

  return suspend(async () => {
    const client = await getCosmWasmClient();

    return client;
  }, ["queryClient", chain.chain_name]);
}
