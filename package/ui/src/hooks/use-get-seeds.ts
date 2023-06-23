import { useChain } from "@cosmos-kit/react";
import { useRecoilValue } from "recoil";
import { chainState } from "../state/cosmos";
import useCw721QueryClient from "./use-juno-cw721-query-client";
import { useCw721BaseTokensQuery } from "../codegen/Cw721Base.react-query";
import { useQueries } from "@tanstack/react-query";
import useKompleMetadataQueryClient from "./use-juno-komple-metadata-query-client";
import { kompleMetadataQueries } from "../codegen/KompleMetadata.react-query";
import { useMemo } from "react";

export default function useGetSeeds(tokenAddr: string, metadataAddr: string) {
  const chain = useRecoilValue(chainState);
  const { address } = useChain(chain.chain_name);

  const cw721QueryClient = useCw721QueryClient(tokenAddr);
  const kompleMetadataQueryClient = useKompleMetadataQueryClient(metadataAddr);

  const baseTokens = useCw721BaseTokensQuery({
    client: cw721QueryClient,
    args: {
      owner: address!,
    },
    options: {
      staleTime: 300000,
      suspense: true,
      enabled: Boolean(address),
      keepPreviousData: true,
    },
  });

  const metadatas = useQueries({
    queries:
      baseTokens.data?.tokens.map((t) =>
        kompleMetadataQueries.metadata({
          client: kompleMetadataQueryClient,
          args: {
            tokenId: parseInt(t),
          },
          options: {
            staleTime: Infinity,
            suspense: true,
            enabled: Boolean(address),
          },
        })
      ) || [],
  });

  useMemo(() => {
    if (!metadatas || !baseTokens.data) {
      return {};
    }

    const result: { [key: string]: string[] } = {};
    for (const [ix, b] of baseTokens.data.tokens.entries()) {
      const type = metadatas[ix].data?.data.metadata.attributes.find(
        ({ trait_type }) => trait_type === "type"
      )?.value;

      if (!type) {
        continue;
      }

      result[type] = result[type] ?? [];

      result[type].push(b);
    }

    console.log(result);
  }, [baseTokens.data, metadatas]);
}
