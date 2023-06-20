import { Outlet } from "react-router-dom";
import { Fragment, Suspense, lazy } from "react";
import Loading from "../components/loading";
import { Box, Container, Heading } from "@chakra-ui/react";
import Shop from "../components/shop";

const WalletButton = lazy(() => import("../components/wallet-button"));

function Header() {
  return (
    <Fragment>
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
