import { useRecoilValue } from "recoil";
import { useChain } from "@cosmos-kit/react";
import { kompleState } from "../state/junofarms";
import useJunoSignClient from "./use-juno-sign-client";
import { chainState } from "../state/cosmos";
import { Cw721BaseClient } from "../codegen/Cw721Base.client";

export default function useCw721SignClient() {
  const { plantCollection } = useRecoilValue(kompleState);
  const chain = useRecoilValue(chainState);
  const { address } = useChain(chain.chain_name);

  const junoSignClient = useJunoSignClient();

  if (!junoSignClient || !address) {
    return null;
  }

  return new Cw721BaseClient(junoSignClient, address, plantCollection);
}
