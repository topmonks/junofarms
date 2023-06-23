import { Button, Image, Tooltip } from "@chakra-ui/react";
import { Fragment } from "react";
import { useKompleMintMintMutation } from "../../../../codegen/KompleMint.react-query";
import useKompleMintSignClient from "../../../../hooks/use-juno-komple-mint-sign-client";
import useTxSuccess from "../../../../hooks/use-tx-success";
import addresses from "@topmonks/junofarms-komple/src/addresses.json";

export default function PlantWheat() {
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
      <Tooltip label="Wheat">
        <Button
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
