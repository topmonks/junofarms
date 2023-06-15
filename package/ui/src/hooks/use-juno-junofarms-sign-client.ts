import { useRecoilValue } from "recoil";
import { JunofarmsClient } from "../codegen/Junofarms.client";
import { contractState } from "../state/junofarms";
import useJunoSignClient from "./use-juno-sign-client";
import { useChain } from "@cosmos-kit/react";
import { chainState } from "../state/cosmos";

export default function useJunofarmsSignClient() {
  const contract = useRecoilValue(contractState);
  const chain = useRecoilValue(chainState);
  const { address } = useChain(chain.chain_name);

  const junoSignClient = useJunoSignClient();

  if (!junoSignClient || !address) {
    return null;
  }

  return new JunofarmsClient(junoSignClient, address, contract);
}
