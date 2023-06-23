import { useRecoilValue } from "recoil";
import { useChain } from "@cosmos-kit/react";
import useJunoSignClient from "./use-juno-sign-client";
import { chainState } from "../state/cosmos";
import { KompleTokenClient } from "../codegen/KompleToken.client";

export default function useKompleTokenSignClient(tokenAddr: string) {
  const chain = useRecoilValue(chainState);
  const { address } = useChain(chain.chain_name);

  const junoSignClient = useJunoSignClient();

  if (!junoSignClient || !address) {
    return null;
  }

  return new KompleTokenClient(junoSignClient, address, tokenAddr);
}
