import { useRecoilValue } from "recoil";
import useGetSeedNfts from "../../../../hooks/use-get-seed-nfts";
import { kompleState } from "../../../../state/junofarms";
import PlantGeneric from "./generic";

export default function PlantSunflower({
  selectedCoords,
}: {
  selectedCoords: [number, number];
}) {
  const komple = useRecoilValue(kompleState);

  const seeds = useGetSeedNfts(
    komple.collections.basic.addr,
    komple.collections.basic.metadataAddr
  );

  const ids = seeds.sunflower;

  return (
    <PlantGeneric
      selectedCoords={selectedCoords}
      ownedTokenIds={ids}
      opts={{
        colorScheme: "whatsapp",
        image: "/sunflower-plant-button.png",
        label: "Sunflower",
      }}
    />
  );
}
