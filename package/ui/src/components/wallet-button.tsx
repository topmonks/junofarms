import { useChain } from "@cosmos-kit/react";
import { useRecoilValue } from "recoil";
import { Button, ButtonProps } from "@chakra-ui/react";

import { chainState } from "../state/cosmos";
import { Fragment } from "react";
import { addressShort } from "../lib/token";

export default function WalletButton({
  ButtonProps,
}: {
  ButtonProps?: ButtonProps;
}) {
  const chain = useRecoilValue(chainState);
  const { address, connect, disconnect, wallet, isWalletConnected } = useChain(
    chain.chain_name
  );

  if (!isWalletConnected) {
    return (
      <Fragment>
        <Button onClick={connect} {...ButtonProps}>
          Connect wallet
        </Button>
      </Fragment>
    );
  }

  return (
    <Fragment>
      <Button disabled {...ButtonProps}>
        {wallet?.prettyName || "Metamask"} - {addressShort(address || "")}
      </Button>
      <Button onClick={disconnect}>Logout</Button>
    </Fragment>
  );
}
