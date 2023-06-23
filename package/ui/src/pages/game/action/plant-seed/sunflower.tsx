import { Button, Image, Tooltip } from "@chakra-ui/react";
import { Fragment } from "react";
import useTxSuccess from "../../../../hooks/use-tx-success";
import useKompleTokenSignClient from "../../../../hooks/use-juno-komple-token-sign-client";
import { useKompleTokenSendNftMutation } from "../../../../codegen/KompleToken.react-query";
import { toBase64, toUtf8 } from "@cosmjs/encoding";
import useGetSeeds from "../../../../hooks/use-get-seeds";
import { useRecoilValue } from "recoil";
import { kompleState } from "../../../../state/junofarms";

export default function PlantSunflower() {
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

  const seeds = useGetSeeds(
    komple.collections.basic.addr,
    komple.collections.basic.metadataAddr
  );

  return (
    <Fragment>
      <Tooltip label="Sunflower">
        <Button
          isLoading={sendNft.isLoading}
          onClick={() => {
            if (!kompleTokenSignClient) {
              return;
            }
            sendNft.mutate({
              client: kompleTokenSignClient,
              msg: {
                tokenId: "2",
                contract: import.meta.env.VITE_CONTRACT_ADDRESS,
                msg: toBase64(toUtf8(JSON.stringify({ seed: {} }))),
              },
            });
          }}
          colorScheme="whatsapp"
          variant="outline"
        >
          <Image
            height="22px"
            src="/sunflower-plant-button.png"
            alt="Plant Sunflower"
          />
        </Button>
      </Tooltip>
    </Fragment>
  );
}
