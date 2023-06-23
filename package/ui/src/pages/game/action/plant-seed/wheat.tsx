import { Button, Image, Tooltip } from "@chakra-ui/react";
import { Fragment } from "react";
import { useRecoilValue } from "recoil";
import useTxSuccess from "../../../../hooks/use-tx-success";
import useKompleTokenSignClient from "../../../../hooks/use-juno-komple-token-sign-client";
import { useKompleTokenSendNftMutation } from "../../../../codegen/KompleToken.react-query";
import useGetSeeds from "../../../../hooks/use-get-seeds";
import { kompleState } from "../../../../state/junofarms";
import { toBase64, toUtf8 } from "@cosmjs/encoding";

export default function PlantWheat() {
  const komple = useRecoilValue(kompleState);
  const kompleTokenSignClient = useKompleTokenSignClient(
    komple.collections.basic.addr
  );

  const txSuccess = useTxSuccess();
  const sendNft = useKompleTokenSendNftMutation({
    onSuccess: (r) => {
      txSuccess(r, {
        title: "Succefully plant 1 seed of Sunflower",
      });
    },
  });

  useGetSeeds(
    komple.collections.basic.addr,
    komple.collections.basic.metadataAddr
  );

  return (
    <Fragment>
      <Tooltip label="Wheat">
        <Button
          isLoading={sendNft.isLoading}
          onClick={() => {
            if (!kompleTokenSignClient) {
              return;
            }
            sendNft.mutate({
              client: kompleTokenSignClient,
              msg: {
                tokenId: "x",
                contract: import.meta.env.VITE_CONTRACT_ADDRESS,
                msg: toBase64(toUtf8(JSON.stringify({ seed: {} }))),
              },
            });
          }}
          colorScheme="yellow"
          variant="outline"
        >
          <Image
            height="22px"
            src="/wheat-plant-button.png"
            alt="Plant Wheat"
          />
        </Button>
      </Tooltip>
    </Fragment>
  );
}
