import { useChain } from "@cosmos-kit/react";
import { useRecoilValue } from "recoil";
import { useMemo } from "react";
import { useQueries } from "@tanstack/react-query";
import { SEED_METADATA_TYPES } from "@topmonks/junofarms-komple/src/collections";

import { chainState } from "../state/cosmos";
import useCw721QueryClient from "./use-juno-cw721-query-client";
import { useCw721BaseTokensQuery } from "../codegen/Cw721Base.react-query";
import useKompleMetadataQueryClient from "./use-juno-komple-metadata-query-client";
import { kompleMetadataQueries } from "../codegen/KompleMetadata.react-query";

export type Seeds = {
  [key in SEED_METADATA_TYPES]: string[];
};

export default function useGetSeedNfts(
  tokenAddr: string,
  metadataAddr: string,
  address_to_check?: string
): Seeds {
  const chain = useRecoilValue(chainState);
  const { address: userAddress } = useChain(chain.chain_name);
  const address = address_to_check || userAddress;

  const cw721QueryClient = useCw721QueryClient(tokenAddr);
  const kompleMetadataQueryClient = useKompleMetadataQueryClient(metadataAddr);

  const baseTokens = useCw721BaseTokensQuery({
    client: cw721QueryClient,
    args: {
      owner: address!,
    },
    options: {
      staleTime: Infinity,
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

  return useMemo(() => {
    const result: Seeds = {
      [SEED_METADATA_TYPES.SUNFLOWER]: [],
      [SEED_METADATA_TYPES.WHEAT]: [],
    };

    if (!metadatas || !baseTokens.data) {
      return result;
    }

    for (const [ix, b] of baseTokens.data.tokens.entries()) {
      const type = metadatas[ix].data?.data.metadata.attributes.find(
        ({ trait_type }) => trait_type === "type"
      )?.value as SEED_METADATA_TYPES | undefined;

      if (!type) {
        continue;
      }

      result[type].push(b);
    }

    return result;
  }, [baseTokens.data, metadatas]);
}
