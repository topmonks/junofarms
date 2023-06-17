import { Suspense, lazy, useMemo } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  createBrowserRouter,
  Navigate,
  RouterProvider,
} from "react-router-dom";
import { RecoilRoot } from "recoil";
import { ChainProvider } from "@cosmos-kit/react";
import { GasPrice } from "@cosmjs/stargate";
import { assets, chains } from "chain-registry";
import { wallets as keplrWallets } from "@cosmos-kit/keplr-extension";
import { wallets as leapWallets } from "@cosmos-kit/leap-extension";
import { wallets as cosmostationWallets } from "@cosmos-kit/cosmostation-extension";

import AppLayout from "./layout/app";
import Error from "./pages/error";
import { ENABLED_TESTNETS, MAINNET, TESTNET } from "./lib/config";
import { ChakraProvider, useToast } from "@chakra-ui/react";
import { theme } from "./lib/theme";
import Loading from "./components/loading";

const Game = lazy(() => import("./pages/game/index"));

const router = createBrowserRouter([
  {
    path: "/",
    element: <AppLayout />,
    errorElement: (
      <div style={{ width: "50%", margin: "50px auto" }}>
        <Error />
      </div>
    ),
    children: [
      { index: true, element: <Navigate to="/game" replace /> },
      {
        path: "game",
        children: [
          {
            index: true,
            element: (
              <Suspense fallback={<Loading />}>
                <Game />
              </Suspense>
            ),
          },
        ],
      },
    ],
  },
]);

function App() {
  const toast = useToast();

  const queryClient = useMemo(
    () =>
      new QueryClient({
        defaultOptions: {
          mutations: {
            onError: (e: any) => {
              toast({
                title: "TX Error",
                description: e.message,
                status: "error",
                duration: 9000,
                isClosable: true,
              });
            },
          },
        },
      }),
    [toast]
  );

  return (
    <RecoilRoot>
      <QueryClientProvider client={queryClient}>
        <ChakraProvider theme={theme}>
          <ChainProvider
            chains={chains.filter((c) =>
              ENABLED_TESTNETS.includes(c.chain_id as TESTNET)
            )}
            assetLists={assets}
            wallets={[...keplrWallets, ...leapWallets, ...cosmostationWallets]} // supported wallets
            endpointOptions={{
              endpoints: {},
              isLazy: true,
            }}
            signerOptions={{
              signingCosmwasm: (chain) => {
                if (chain.chain_id === TESTNET.JUNO) {
                  return {
                    gasPrice: GasPrice.fromString("0.075ujunox"),
                  };
                }

                if (chain.chain_id === MAINNET.JUNO) {
                  return {
                    gasPrice: GasPrice.fromString("0.075ujuno"),
                  };
                }

                return {};
              },
            }}
          >
            <RouterProvider router={router} />
          </ChainProvider>
        </ChakraProvider>
      </QueryClientProvider>
    </RecoilRoot>
  );
}

export default App;
