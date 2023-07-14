import { Link, Outlet, useLocation, useMatch } from "react-router-dom";
import { Fragment, Suspense, lazy, useState } from "react";
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
  const { isOpen, onToggle, onClose } = useDisclosure();
  const [address, setAddress] = useState("");

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
            <Modal isOpen={isOpen} onClose={onClose}>
              <ModalOverlay />
              <ModalContent>
                <ModalHeader>Address</ModalHeader>
                <ModalCloseButton />
                <ModalBody>
                  <Input onChange={(e) => setAddress(e.target.value)} />
                </ModalBody>
                <ModalFooter>
                  {address.length > 0 && (
                    <Link to={`/game/${address}`}>Watch</Link>
                  )}
                </ModalFooter>
              </ModalContent>
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
