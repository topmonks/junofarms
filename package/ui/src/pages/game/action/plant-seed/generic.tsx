import { Button, Image, Text, ThemeTypings, Tooltip } from "@chakra-ui/react";
import { Fragment, useRef } from "react";
import { useRecoilState, useRecoilValue } from "recoil";
import { toBase64, toUtf8 } from "@cosmjs/encoding";
import { useQueryClient as useReactQueryClient } from "@tanstack/react-query";

import * as gs from "../../../../components/game-assets";
import useTxSuccess from "../../../../hooks/use-tx-success";
import useKompleTokenSignClient from "../../../../hooks/use-juno-komple-token-sign-client";
import { useKompleTokenSendNftMutation } from "../../../../codegen/KompleToken.react-query";
import {
  gameState,
  kompleState,
  pushAnimation,
  removeAnimation,
} from "../../../../state/junofarms";

export default function PlantGeneric({
  selectedCoords,
  ownedTokenIds,
  opts,
}: {
  selectedCoords: [number, number];
  ownedTokenIds: string[];
  opts: {
    label: string;
    image: string;
    imageHeight?: string;
    colorScheme: ThemeTypings["colorSchemes"];
    successTitle?: string;
  };
}) {
  const komple = useRecoilValue(kompleState);
  const kompleTokenSignClient = useKompleTokenSignClient(
    komple.collections.basic.addr
  );
  const [, setGame] = useRecoilState(gameState);
  const forkAnimationId = useRef<string>();
  const reactQueryClient = useReactQueryClient();

  const txSuccess = useTxSuccess();

  const sendNft = useKompleTokenSendNftMutation({
    onMutate: () => {
      if (selectedCoords) {
        setGame((g) => {
          const { nextId, animations } = pushAnimation(
            {
              coord: selectedCoords,
              currentFrame: 0,
              delta: 0,
              image: gs.characterForkImg,
              props: gs.characterForkAnimation,
            },
            g.animations
          );

          forkAnimationId.current = nextId;

          return {
            ...g,
            animations: animations,
          };
        });
      }
    },

    onSuccess: (r) => {
      reactQueryClient.invalidateQueries([
        {
          method: "tokens",
          contract: "cw721Base",
          address: komple.collections.basic.addr,
        },
      ]);
      reactQueryClient.invalidateQueries([{ method: "get_farm_profile" }]);
      txSuccess(r, {
        title: opts.successTitle || `Succefully plant 1 seed of ${opts.label}`,
      });
    },

    onSettled: () => {
      setGame((g) => {
        if (forkAnimationId.current != null) {
          const { animations } = removeAnimation(
            forkAnimationId.current,
            g.animations
          );

          return {
            ...g,
            animations,
          };
        }

        return g;
      });
    },
  });

  return (
    <Fragment>
      <Tooltip label={opts.label}>
        <Button
          leftIcon={
            <Image
              height={opts.imageHeight || "22px"}
              src={opts.image}
              alt={`Plant ${opts.label}`}
            />
          }
          isDisabled={ownedTokenIds.length === 0}
          isLoading={sendNft.isLoading}
          onClick={() => {
            if (!kompleTokenSignClient) {
              return;
            }
            sendNft.mutate({
              client: kompleTokenSignClient,
              msg: {
                tokenId: ownedTokenIds[0],
                contract: import.meta.env.VITE_CONTRACT_ADDRESS,
                msg: toBase64(
                  toUtf8(
                    JSON.stringify({
                      seed: {
                        x: selectedCoords[0],
                        y: selectedCoords[1],
                      },
                    })
                  )
                ),
              },
            });
          }}
          colorScheme={opts.colorScheme}
          variant="outline"
        >
          <Text fontSize={"sm"}>{ownedTokenIds.length}x</Text>
        </Button>
      </Tooltip>
    </Fragment>
  );
}
