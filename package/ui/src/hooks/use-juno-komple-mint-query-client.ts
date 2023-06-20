import { useRecoilValue } from "recoil";
import { kompleState } from "../state/junofarms";
import useJunoQueryClient from "./use-juno-query-client";
import { KompleMintQueryClient } from "../codegen/KompleMint.client";

export default function useKompleMintQueryClient() {
  const { mint } = useRecoilValue(kompleState);

  const junoClient = useJunoQueryClient();

  return new KompleMintQueryClient(junoClient, mint);
}
