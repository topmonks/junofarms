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
  useDisclosure,
} from "@chakra-ui/react";
import { useChain } from "@cosmos-kit/react";
import { Fragment } from "react";
import { useRecoilValue } from "recoil";
import { chainState } from "../state/cosmos";
import Wheat from "./shop/wheat";
import Sunflower from "./shop/sunflower";

export default function Shop() {
  const { isOpen, onOpen, onClose } = useDisclosure();
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
      <Modal isOpen={isOpen} onClose={onClose} size={"xl"}>
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
