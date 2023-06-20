import { useRecoilValue } from "recoil";
import { useChain } from "@cosmos-kit/react";
import { kompleState } from "../state/junofarms";
import useJunoSignClient from "./use-juno-sign-client";
import { chainState } from "../state/cosmos";
import { KompleMintClient } from "../codegen/KompleMint.client";

export default function useKompleMintSignClient() {
  const { mint } = useRecoilValue(kompleState);
  const chain = useRecoilValue(chainState);
  const { address } = useChain(chain.chain_name);

  const junoSignClient = useJunoSignClient();

  if (!junoSignClient || !address) {
    return null;
  }

  return new KompleMintClient(junoSignClient, address, mint);
}
