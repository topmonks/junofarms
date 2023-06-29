import { Button, Image, ThemeTypings } from "@chakra-ui/react";
import { Fragment } from "react";
import { useQueryClient as useReactQueryClient } from "@tanstack/react-query";
import { useKompleMintMintMutation } from "../../codegen/KompleMint.react-query";
import useKompleMintSignClient from "../../hooks/use-juno-komple-mint-sign-client";
import useTxSuccess from "../../hooks/use-tx-success";
import { KompleMintMintMutation } from "../../codegen/KompleMint.react-query";

export default function GenericShopButton({
  collectionAddr,
  collectionId,
  metadataId,
  opts,
}: {
  collectionAddr: string;
  collectionId: number;
  metadataId: number;
  opts: {
    label: string;
    image: string;
    imageHeight?: string;
    colorScheme: ThemeTypings["colorSchemes"];
    successTitle?: string;
    args?: KompleMintMintMutation["args"];
  };
}) {
  const cw721SignClient = useKompleMintSignClient();
  const txSuccess = useTxSuccess();
  const reactQueryClient = useReactQueryClient();
  const mint = useKompleMintMintMutation({
    onSuccess: (r) => {
      console.log("invalidate");
      reactQueryClient.invalidateQueries([
        {
          method: "tokens",
          contract: "cw721Base",
          address: collectionAddr,
        },
      ]);
      txSuccess(r, {
        title: opts.successTitle || `Succefully bought 1 ${opts.label}`,
      });
    },
  });

  return (
    <Fragment>
      <Button
        leftIcon={
          <Image
            height={opts.imageHeight}
            src={opts.image}
            alt={opts.label + " store icon"}
          />
        }
        loadingText={`Buying a ${opts.label}`}
        isLoading={mint.isLoading}
        onClick={() => {
          if (!cw721SignClient) {
            return;
          }

          mint.mutate({
            client: cw721SignClient,
            msg: {
              collectionId,
              metadataId,
            },
            args: opts.args,
          });
        }}
        colorScheme={opts.colorScheme}
        variant="outline"
      >
        {opts.label}
      </Button>
    </Fragment>
  );
}
