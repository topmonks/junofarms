import {
  Badge,
  Button,
  Divider,
  IconButton,
  Image,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Tooltip,
  Wrap,
  WrapItem,
} from "@chakra-ui/react";
import { useChain } from "@cosmos-kit/react";
import { Fragment } from "react";
import { useRecoilState, useRecoilValue } from "recoil";
import { chainState } from "../state/cosmos";
import Wheat from "./shop/wheat";
import Sunflower from "./shop/sunflower";
import { kompleState, shopOpenedState } from "../state/junofarms";
import Calf from "./shop/calf";
import Chick from "./shop/chick";
import Piglet from "./shop/piglet";
import useDefaultAsset from "../hooks/use-default-asset";
import { toUserToken } from "../lib/token";

export default function Shop() {
  const [shopOpened, setShopOpened] = useRecoilState(shopOpenedState);
  function onOpen() {
    setShopOpened(true);
  }
  function onClose() {
    setShopOpened(false);
  }

  const chain = useRecoilValue(chainState);
  const { isWalletConnected } = useChain(chain.chain_name);
  const defaultAsset = useDefaultAsset();
  const komple = useRecoilValue(kompleState);

  return (
    <Fragment>
      {isWalletConnected && (
        <Tooltip label="Store">
          <IconButton
            variant="outline"
            colorScheme="teal"
            aria-label="Send email"
            sx={{ p: 2 }}
            onClick={onOpen}
            icon={<Image height="32px" src="/shop-icon.png" alt="Store icon" />}
          />
        </Tooltip>
      )}
      <Modal isOpen={shopOpened} onClose={onClose} size={"xl"}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Farm store</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Badge colorScheme="green" variant={"subtle"}>
              Seeds ({toUserToken(komple.collections.basic.fee).toString()}{" "}
              {defaultAsset.symbol})
            </Badge>
            <Wrap spacing={5} justify="center">
              <WrapItem>
                <Wheat />
              </WrapItem>
              <WrapItem>
                <Sunflower />
              </WrapItem>
            </Wrap>
            <Divider sx={{ my: 5 }} />
            <Badge colorScheme="pink" variant={"subtle"}>
              Animals ({toUserToken(komple.collections.animals.fee).toString()}{" "}
              {defaultAsset.symbol})
            </Badge>
            <Wrap spacing={5} justify="center">
              <WrapItem>
                <Chick />
              </WrapItem>
              <WrapItem>
                <Piglet />
              </WrapItem>
              <WrapItem>
                <Calf />
              </WrapItem>
            </Wrap>
          </ModalBody>

          <ModalFooter>
            <Button variant="ghost" onClick={onClose}>
              Leave
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Fragment>
  );
}
