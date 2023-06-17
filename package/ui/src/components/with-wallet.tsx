import { useRecoilValue } from "recoil";
import { chainState } from "../state/cosmos";
import { useChain } from "@cosmos-kit/react";
import { Fragment, Suspense } from "react";
import WalletButton from "./wallet-button";
import { ButtonProps } from "@chakra-ui/react";
import Loading from "./loading";

export default function WithWallet({
  children,
  WalletButtonProps,
}: {
  children?: React.ReactNode;
  WalletButtonProps?: ButtonProps;
}) {
  const chain = useRecoilValue(chainState);
  const { isWalletConnected } = useChain(chain.chain_name);

  if (!isWalletConnected) {
    return (
      <Suspense fallback={<Loading />}>
        <WalletButton ButtonProps={WalletButtonProps} />
      </Suspense>
    );
  } else {
    return <Fragment>{children}</Fragment>;
  }
}
