import { useRecoilValue } from "recoil";
import { JunofarmsQueryClient } from "../codegen/Junofarms.client";
import { contractState } from "../state/junofarms";
import useJunoQueryClient from "./use-juno-query-client";

export default function useJunofarmsQueryClient() {
  const contract = useRecoilValue(contractState);

  const junoClient = useJunoQueryClient();

  return new JunofarmsQueryClient(junoClient, contract);
}
