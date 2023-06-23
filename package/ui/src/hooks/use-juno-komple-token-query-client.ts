import useJunoQueryClient from "./use-juno-query-client";
import { KompleTokenQueryClient } from "../codegen/KompleToken.client";

export default function useKompleTokenQueryClient(tokenAddr: string) {
  const junoClient = useJunoQueryClient();

  return new KompleTokenQueryClient(junoClient, tokenAddr);
}
