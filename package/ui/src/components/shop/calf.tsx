import { Button, Image } from "@chakra-ui/react";
import { Fragment } from "react";
import { useRecoilValue } from "recoil";
import { useQueryClient as useReactQueryClient } from "@tanstack/react-query";
import { useKompleMintMintMutation } from "../../codegen/KompleMint.react-query";
import useKompleMintSignClient from "../../hooks/use-juno-komple-mint-sign-client";
import useTxSuccess from "../../hooks/use-tx-success";
import { kompleState } from "../../state/junofarms";

export default function Calf() {
  const cw721SignClient = useKompleMintSignClient();
  const txSuccess = useTxSuccess();
  const reactQueryClient = useReactQueryClient();
  const komple = useRecoilValue(kompleState);
  const mint = useKompleMintMintMutation({
    onSuccess: (r) => {
      reactQueryClient.invalidateQueries([
        {
          method: "tokens",
          contract: "cw721Base",
          address: komple.collections.animals.addr,
        },
      ]);
      txSuccess(r, {
        title: "Succefully bought 1 calf",
      });
    },
  });

  return (
    <Fragment>
      <Button
        leftIcon={
          <Image height="32px" src="/calf-button.gif" alt="Store icon" />
        }
        loadingText="Buying a calf"
        isLoading={mint.isLoading}
        onClick={() => {
          if (!cw721SignClient) {
            return;
          }

          mint.mutate({
            client: cw721SignClient,
            msg: {
              collectionId: komple.collections.animals.id,
              metadataId: komple.collections.animals.metadata.calf.id,
            },
          });
        }}
        colorScheme="brown"
        variant="outline"
      >
        Calf
      </Button>
    </Fragment>
  );
}
