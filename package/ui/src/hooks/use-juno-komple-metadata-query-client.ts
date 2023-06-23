import useJunoQueryClient from "./use-juno-query-client";
import { KompleMetadataQueryClient } from "../codegen/KompleMetadata.client";

export default function useKompleMetadataQueryClient(metadataAddr: string) {
  const junoClient = useJunoQueryClient();

  return new KompleMetadataQueryClient(junoClient, metadataAddr);
}
