import useJunoQueryClient from "./use-juno-query-client";
import { Cw721BaseQueryClient } from "../codegen/Cw721Base.client";

export default function useCw721QueryClient(collection: string) {
  const junoClient = useJunoQueryClient();

  return new Cw721BaseQueryClient(junoClient, collection);
}
