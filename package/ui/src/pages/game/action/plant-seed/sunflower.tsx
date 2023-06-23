import { Button, Image, Tooltip } from "@chakra-ui/react";
import { Fragment } from "react";
import useTxSuccess from "../../../../hooks/use-tx-success";
import addresses from "@topmonks/junofarms-komple/src/addresses.json";
import useKompleTokenSignClient from "../../../../hooks/use-juno-komple-token-sign-client";
import { useKompleTokenSendNftMutation } from "../../../../codegen/KompleToken.react-query";
import { toBase64, toUtf8 } from "@cosmjs/encoding";

export default function PlantSunflower() {
  const kompleTokenSignClient = useKompleTokenSignClient(
    addresses.basic.tokenAddr
  );

  const txSuccess = useTxSuccess();
  const mint = useKompleTokenSendNftMutation({
    onSuccess: (r) => {
      txSuccess(r, {
        title: "Succefully plant 1 seed of Sunflower",
      });
    },
  });

  return (
    <Fragment>
      <Tooltip label="Sunflower">
        <Button
          isLoading={mint.isLoading}
          onClick={() => {
            if (!kompleTokenSignClient) {
              return;
            }
            mint.mutate({
              client: kompleTokenSignClient,
              msg: {
                tokenId: "x",
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
