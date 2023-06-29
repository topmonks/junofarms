import { Button, Image } from "@chakra-ui/react";
import { Fragment } from "react";
import { useRecoilValue } from "recoil";
import { useQueryClient as useReactQueryClient } from "@tanstack/react-query";
import { useKompleMintMintMutation } from "../../codegen/KompleMint.react-query";
import useKompleMintSignClient from "../../hooks/use-juno-komple-mint-sign-client";
import useTxSuccess from "../../hooks/use-tx-success";
import { kompleState } from "../../state/junofarms";
import useDefaultAsset from "../../hooks/use-default-asset";

export default function Wheat() {
  const cw721SignClient = useKompleMintSignClient();
  const defaultAsset = useDefaultAsset();
  const txSuccess = useTxSuccess();
  const reactQueryClient = useReactQueryClient();
  const komple = useRecoilValue(kompleState);
  const mint = useKompleMintMintMutation({
    onSuccess: (r) => {
      reactQueryClient.invalidateQueries([
        {
          method: "tokens",
          contract: "cw721Base",
          address: komple.collections.basic.addr,
        },
      ]);
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
              collectionId: komple.collections.basic.id,
              metadataId: komple.collections.basic.metadata.wheat.id,
            },
            args: {
              funds: [
                {
                  amount: komple.collections.basic.fee,
                  denom: defaultAsset.base,
                },
              ],
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
