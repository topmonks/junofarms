import { Fragment, Suspense, useMemo, useState } from "react";
import {
  Box,
  Button,
  Link,
  Popover,
  PopoverArrow,
  PopoverBody,
  PopoverCloseButton,
  PopoverContent,
  PopoverFooter,
  PopoverHeader,
  PopoverTrigger,
  Portal,
  Spinner,
  Text,
} from "@chakra-ui/react";
import { ChevronRightIcon } from "@chakra-ui/icons";
import { useRecoilState, useRecoilValue } from "recoil";
import useCanvasBridge from "../../../hooks/use-canvas-bridge";

import { gameState, shopOpenedState } from "../../../state/junofarms";
import { SLOT_FIELD } from "../../../types/types";
import PlantSunflower from "./plant-seed/sunflower";
import PlantWheat from "./plant-seed/wheat";

export default function PlantSeedNft() {
  const [selectedCoords, setSelectedCoords] = useState<[number, number] | null>(
    null
  );
  useCanvasBridge("click", (opts: any) => {
    setSelectedCoords(opts.detail.coord);
  });

  const game = useRecoilValue(gameState);

  const isPlantable = useMemo(() => {
    if (!selectedCoords) {
      return false;
    }

    const slot = game.grid[selectedCoords[0]][selectedCoords[1]];

    return slot.type === SLOT_FIELD && slot.plant == null;
  }, [selectedCoords, game]);

  const [, setShopOpened] = useRecoilState(shopOpenedState);

  return (
    <Fragment>
      {selectedCoords && isPlantable && (
        <Popover closeOnBlur={false}>
          <PopoverTrigger>
            <Button>Plant seed</Button>
          </PopoverTrigger>
          <Portal>
            <PopoverContent>
              <PopoverArrow />
              <PopoverHeader>Select seed</PopoverHeader>
              <PopoverCloseButton />
              <PopoverBody>
                <Suspense fallback={<Spinner size="xs" />}>
                  <Box sx={{ display: "flex", gap: 2 }}>
                    <PlantWheat selectedCoords={selectedCoords} />
                    <PlantSunflower selectedCoords={selectedCoords} />
                  </Box>
                </Suspense>
              </PopoverBody>
              <PopoverFooter>
                <Text fontSize={"xs"}>
                  <Link onClick={() => setShopOpened(true)}>
                    Visit store <ChevronRightIcon />
                  </Link>
                </Text>
              </PopoverFooter>
            </PopoverContent>
          </Portal>
        </Popover>
      )}
    </Fragment>
  );
}
