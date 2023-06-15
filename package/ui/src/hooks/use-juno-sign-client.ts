import { useChain } from "@cosmos-kit/react";
import { useRecoilValue } from "recoil";
import { suspend } from "suspend-react";

import { chainState } from "../state/cosmos";

export default function useJunoSignClient() {
  const chain = useRecoilValue(chainState);
  const { address, getSigningCosmWasmClient, wallet } = useChain(
    chain.chain_name
  );

  return suspend(async () => {
    if (!wallet) {
      return null;
    }

    const signClient = await getSigningCosmWasmClient();

    return signClient;
  }, ["signingClient", address]);
}
