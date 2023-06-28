import { Button, Image, Text } from "@chakra-ui/react";
import { Fragment } from "react";
import { useRecoilValue } from "recoil";
import { useQueryClient as useReactQueryClient } from "@tanstack/react-query";
import { useKompleMintMintMutation } from "../../codegen/KompleMint.react-query";
import useKompleMintSignClient from "../../hooks/use-juno-komple-mint-sign-client";
import useTxSuccess from "../../hooks/use-tx-success";
import { kompleState } from "../../state/junofarms";

export default function Chick() {
  const cw721SignClient = useKompleMintSignClient();
  const txSuccess = useTxSuccess();
  const reactQueryClient = useReactQueryClient();
  const komple = useRecoilValue(kompleState);
  const mint = useKompleMintMintMutation({
    onSuccess: (r) => {
      console.log("invalidate");
      reactQueryClient.invalidateQueries([
        {
          method: "tokens",
          contract: "cw721Base",
          address: komple.collections.animals.addr,
        },
      ]);
      txSuccess(r, {
        title: "Succefully bought 1 chick",
      });
    },
  });

  return (
    <Fragment>
      <Button
        leftIcon={
          <Image height="16px" src="/chick-button.gif" alt="Store icon" />
        }
        loadingText="Buying a chick"
        isLoading={mint.isLoading}
        onClick={() => {
          if (!cw721SignClient) {
            return;
          }

          mint.mutate({
            client: cw721SignClient,
            msg: {
              collectionId: komple.collections.animals.id,
              metadataId: komple.collections.animals.metadata.chick.id,
            },
          });
        }}
        colorScheme="yellow"
        variant="outline"
      >
        Chick
      </Button>
    </Fragment>
  );
}
