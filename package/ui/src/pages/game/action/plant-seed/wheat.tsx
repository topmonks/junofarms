import { Button, Image, Text, Tooltip } from "@chakra-ui/react";
import { Fragment } from "react";
import { useRecoilValue } from "recoil";
import { toBase64, toUtf8 } from "@cosmjs/encoding";
import { useQueryClient as useReactQueryClient } from "@tanstack/react-query";

import useTxSuccess from "../../../../hooks/use-tx-success";
import useKompleTokenSignClient from "../../../../hooks/use-juno-komple-token-sign-client";
import { useKompleTokenSendNftMutation } from "../../../../codegen/KompleToken.react-query";
import useGetSeeds from "../../../../hooks/use-get-seeds";
import { kompleState } from "../../../../state/junofarms";

export default function PlantWheat() {
  const komple = useRecoilValue(kompleState);
  const kompleTokenSignClient = useKompleTokenSignClient(
    komple.collections.basic.addr
  );
  const reactQueryClient = useReactQueryClient();

  const txSuccess = useTxSuccess();
  const sendNft = useKompleTokenSendNftMutation({
    onSuccess: (r) => {
      reactQueryClient.invalidateQueries([
        {
          method: "tokens",
          contract: "cw721Base",
          address: komple.collections.basic.addr,
        },
      ]);
      txSuccess(r, {
        title: "Succefully plant 1 seed of Sunflower",
      });
    },
  });

  const seeds = useGetSeeds(
    komple.collections.basic.addr,
    komple.collections.basic.metadataAddr
  );

  const ids = seeds.wheat;

  return (
    <Fragment>
      <Tooltip label="Wheat">
        <Button
          leftIcon={
            <Image
              height="22px"
              src="/wheat-plant-button.png"
              alt="Plant Wheat"
            />
          }
          isLoading={sendNft.isLoading}
          onClick={() => {
            if (!kompleTokenSignClient) {
              return;
            }
            sendNft.mutate({
              client: kompleTokenSignClient,
              msg: {
                tokenId: ids[0],
                contract: import.meta.env.VITE_CONTRACT_ADDRESS,
                msg: toBase64(toUtf8(JSON.stringify({ seed: {} }))),
              },
            });
          }}
          colorScheme="yellow"
          variant="outline"
        >
          <Text fontSize={"sm"}>{ids.length}x</Text>
        </Button>
      </Tooltip>
    </Fragment>
  );
}
