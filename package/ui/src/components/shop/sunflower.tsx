import { Button, Image } from "@chakra-ui/react";
import { Fragment } from "react";
import { useKompleMintMintMutation } from "../../codegen/KompleMint.react-query";
import useKompleMintSignClient from "../../hooks/use-juno-komple-mint-sign-client";
import useTxSuccess from "../../hooks/use-tx-success";
import addresses from "@topmonks/junofarms-komple/src/addresses.json";

export default function Sunflower() {
  const cw721SignClient = useKompleMintSignClient();
  const txSuccess = useTxSuccess();
  const mint = useKompleMintMintMutation({
    onSuccess: (r) => {
      txSuccess(r, {
        title: "Succefully bought 1 seed of Sunflower",
      });
    },
  });

  return (
    <Fragment>
      <Button
        leftIcon={
          <Image height="22px" src="/sunflower-button.gif" alt="Store icon" />
        }
        loadingText="Buying Sunflower Seeds"
        isLoading={mint.isLoading}
        onClick={() => {
          if (!cw721SignClient) {
            return;
          }

          mint.mutate({
            client: cw721SignClient,
            msg: {
              collectionId: addresses.basic.collectionId,
              metadataId: addresses.basic.metadata.sunflower.metadataId,
            },
          });
        }}
        colorScheme="whatsapp"
        variant="outline"
      >
        Sunflower
      </Button>
    </Fragment>
  );
}
