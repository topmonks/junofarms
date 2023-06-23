import { Button, Image } from "@chakra-ui/react";
import { Fragment } from "react";
import { useKompleMintMintMutation } from "../../codegen/KompleMint.react-query";
import useKompleMintSignClient from "../../hooks/use-juno-komple-mint-sign-client";
import useTxSuccess from "../../hooks/use-tx-success";
import { kompleState } from "../../state/junofarms";
import { useRecoilValue } from "recoil";

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
  const komple = useRecoilValue(kompleState);

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
              collectionId: komple.collections.basic.id,
              metadataId: komple.collections.basic.metadata.wheat.id,
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
