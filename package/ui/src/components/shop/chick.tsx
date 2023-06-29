import { Fragment } from "react";
import { useRecoilValue } from "recoil";
import { kompleState } from "../../state/junofarms";
import GenericShopButton from "./generic";
import useDefaultAsset from "../../hooks/use-default-asset";

export default function Chick() {
  const komple = useRecoilValue(kompleState);
  const defaultAsset = useDefaultAsset();

  return (
    <Fragment>
      <GenericShopButton
        collectionAddr={komple.collections.animals.addr}
        collectionId={komple.collections.animals.id}
        metadataId={komple.collections.animals.metadata.chick.id}
        opts={{
          colorScheme: "yellow",
          image: "/chick-button.gif",
          imageHeight: "16px",
          label: "Chick",
          args: {
            funds: [
              {
                amount: komple.collections.animals.fee,
                denom: defaultAsset.base,
              },
            ],
          },
        }}
      />
    </Fragment>
  );
}
