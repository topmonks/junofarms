import { Button, Image } from "@chakra-ui/react";
import { Fragment } from "react";
import { useKompleMintMintMutation } from "../../codegen/KompleMint.react-query";
import useKompleMintSignClient from "../../hooks/use-juno-komple-mint-sign-client";
import useTxSuccess from "../../hooks/use-tx-success";
import addresses from "@topmonks/junofarms-komple/src/addresses.json";

export default function Wheat() {
  const cw721SignClient = useKompleMintSignClient();
  const txSuccess = useTxSuccess();
  const mint = useKompleMintMintMutation({
    onSuccess: (r) => {
      txSuccess(r, {
        title: "Succefully bought 1 seed of Wheat",
      });
    },
  });

  return (
    <Fragment>
      <Button
        leftIcon={
          <Image height="20px" src="/wheat-button.gif" alt="Store icon" />
        }
        loadingText="Buying Wheat Seeds"
        isLoading={mint.isLoading}
        onClick={() => {
          if (!cw721SignClient) {
            return;
          }

          mint.mutate({
            client: cw721SignClient,
            msg: {
              collectionId: addresses.basic.collectionId,
              metadataId: addresses.basic.metadata.wheat.metadataId,
            },
          });
        }}
        colorScheme="yellow"
        variant="outline"
      >
        Wheat
      </Button>
    </Fragment>
  );
}
