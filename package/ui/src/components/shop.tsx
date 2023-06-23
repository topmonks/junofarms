import {
  Button,
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
import { shopOpenedState } from "../state/junofarms";

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

  return (
    <Fragment>
      {isWalletConnected && (
        <Tooltip label="Seed Store">
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
          <ModalHeader>Seed store</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Wrap spacing={5} justify="center">
              <WrapItem>
                <Wheat />
              </WrapItem>
              <WrapItem>
                <Sunflower />
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
