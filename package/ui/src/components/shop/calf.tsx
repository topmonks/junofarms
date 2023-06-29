import { Fragment } from "react";
import { useRecoilValue } from "recoil";
import { kompleState } from "../../state/junofarms";
import GenericShopButton from "./generic";
import useDefaultAsset from "../../hooks/use-default-asset";

export default function Calf() {
  const komple = useRecoilValue(kompleState);
  const defaultAsset = useDefaultAsset();

  return (
    <Fragment>
      <GenericShopButton
        collectionAddr={komple.collections.animals.addr}
        collectionId={komple.collections.animals.id}
        metadataId={komple.collections.animals.metadata.calf.id}
        opts={{
          colorScheme: "brown",
          image: "/calf-button.gif",
          imageHeight: "32px",
          label: "Calf",
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
