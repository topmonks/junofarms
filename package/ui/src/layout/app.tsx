import { Outlet } from "react-router-dom";
import { Fragment, Suspense, lazy } from "react";
import Loading from "../components/loading";
import { Box, Heading } from "@chakra-ui/react";

const WalletButton = lazy(() => import("../components/wallet-button"));

function Header() {
  return (
    <Fragment>
      <Heading as="h1" size="md" noOfLines={1}>
        JUNOFARMS
      </Heading>
      <Suspense fallback={<Loading />}>
        <WalletButton />
      </Suspense>
    </Fragment>
  );
}

export default function App() {
  return (
    <Fragment>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          p: { base: 1, md: 3 },
        }}
      >
        <Header />
      </Box>
      <Outlet />
    </Fragment>
  );
}
