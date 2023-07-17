import { Link, Outlet, useLocation } from "react-router-dom";
import {
  Fragment,
  MouseEvent,
  MouseEventHandler,
  Suspense,
  lazy,
  useCallback,
  useRef,
  useState,
} from "react";
import Loading from "../components/loading";
import {
  Box,
  Button,
  Container,
  Heading,
  IconButton,
  Input,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  useDisclosure,
} from "@chakra-ui/react";
import Shop from "../components/shop";
import { HamburgerIcon } from "@chakra-ui/icons";

const WalletButton = lazy(() => import("../components/wallet-button"));

function Navigation() {
  const location = useLocation();
  const path = location.pathname;
  const { isOpen, onToggle: _onToggle, onClose } = useDisclosure();
  const onToggle = useCallback(
    (e: MouseEvent<HTMLButtonElement>) => {
      e.preventDefault();
      _onToggle();
    },
    [_onToggle]
  );
  const [address, setAddress] = useState("");
  const addressRef = useRef(null);

  return (
    <>
      <Menu>
        <MenuButton
          as={IconButton}
          aria-label="Options"
          icon={<HamburgerIcon />}
          variant="outline"
        ></MenuButton>
        <MenuList>
          <MenuItem
            as={Link}
            to="/game/leaderboard"
            disabled={path === "/game/leaderboard"}
          >
            Leaderboard
          </MenuItem>
          <MenuItem as={Link} to="/game" disabled={path === "/game"}>
            Game
          </MenuItem>
          <MenuItem as={Link} onClick={onToggle}>
            Watch game
            <Modal
              initialFocusRef={addressRef}
              isOpen={isOpen}
              onClose={onClose}
            >
              <form action={`/game/${address}`}>
                <ModalOverlay />
                <ModalContent>
                  <ModalHeader>Address</ModalHeader>
                  <ModalCloseButton />
                  <ModalBody>
                    <Input
                      ref={addressRef}
                      defaultValue={address}
                      onChange={(e) => setAddress(e.target.value)}
                    />
                  </ModalBody>
                  <ModalFooter>
                    {address.length > 0 && <Button type="submit">Watch</Button>}
                  </ModalFooter>
                </ModalContent>
              </form>
            </Modal>
          </MenuItem>
        </MenuList>
      </Menu>
    </>
  );
}

function Header() {
  return (
    <Fragment>
      <Navigation />
      <Box gap={2} display={"flex"} alignItems={"center"}>
        <Heading as="h1" size="md" noOfLines={1}>
          JUNOFARMS
        </Heading>
      </Box>
      <Box gap={2} display={"flex"}>
        <Suspense fallback={<Fragment />}>
          <Shop />
        </Suspense>
        <Suspense fallback={<Loading />}>
          <WalletButton />
        </Suspense>
      </Box>
    </Fragment>
  );
}

export default function App() {
  return (
    <Fragment>
      <Container maxW="container.lg">
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            p: { base: 1, md: 3 },
            mb: 5,
          }}
        >
          <Header />
        </Box>
        <Outlet />
      </Container>
    </Fragment>
  );
}
