import { useRecoilValue } from "recoil";
import useGetSeeds from "../../../../hooks/use-get-seeds";
import { kompleState } from "../../../../state/junofarms";
import PlantGeneric from "./generic";

export default function PlantWheat({
  selectedCoords,
}: {
  selectedCoords: [number, number];
}) {
  const komple = useRecoilValue(kompleState);

  const seeds = useGetSeeds(
    komple.collections.basic.addr,
    komple.collections.basic.metadataAddr
  );

  const ids = seeds.wheat;

  return (
    <PlantGeneric
      selectedCoords={selectedCoords}
      ownedTokenIds={ids}
      opts={{
        colorScheme: "yellow",
        image: "/wheat-plant-button.png",
        label: "Wheat",
      }}
    />
  );
}
