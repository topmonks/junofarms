import { Fragment, useState } from "react";
import useCanvasBridge from "../hooks/use-canvas-bridge";
import { Button } from "@chakra-ui/react";
import { useQueryClient as useReactQueryClient } from "@tanstack/react-query";
import { useJunofarmsTillGroundMutation } from "../codegen/Junofarms.react-query";
import useJunofarmsSignClient from "../hooks/use-juno-junofarms-sign-client";

export default function Menu() {
  const [selectedCoords, setSelectedCoords] = useState<[number, number] | null>(
    null
  );
  useCanvasBridge("click", (opts: any) => {
    console.log(opts.detail.coord);
    setSelectedCoords(opts.detail.coord);
  });

  const reactQueryClient = useReactQueryClient();
  const junofarmsSignClient = useJunofarmsSignClient();
  const tillGroundMutation = useJunofarmsTillGroundMutation({
    onSuccess: () => {
      reactQueryClient.invalidateQueries([{ method: "get_farm_profile" }]);
    },
  });

  return (
    <Fragment>
      {selectedCoords && (
        <Button
          onClick={() => {
            if (!junofarmsSignClient) {
              return;
            }

            tillGroundMutation.mutate({
              client: junofarmsSignClient,
              msg: {
                x: selectedCoords[0],
                y: selectedCoords[1],
              },
            });
          }}
        >
          Till
        </Button>
      )}
    </Fragment>
  );
}
