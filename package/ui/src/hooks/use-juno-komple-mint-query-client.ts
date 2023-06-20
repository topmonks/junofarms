import { useRecoilValue } from "recoil";
import { kompleState } from "../state/junofarms";
import useJunoQueryClient from "./use-juno-query-client";
import { Cw721BaseQueryClient } from "../codegen/Cw721Base.client";

export default function useCw721QueryClient() {
  const { mint } = useRecoilValue(kompleState);

  const junoClient = useJunoQueryClient();

  return new Cw721BaseQueryClient(junoClient, mint);
}
