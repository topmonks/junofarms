import { Link, UseToastOptions, useToast } from "@chakra-ui/react";
import { useRecoilValue } from "recoil";
import { chainConfigState } from "../state/cosmos";
import { Fragment, useCallback } from "react";
import { ExecuteResult } from "@cosmjs/cosmwasm-stargate";
import { addressShort } from "../lib/token";

export default function useTxSuccess() {
  const toast = useToast();
  const chainConfig = useRecoilValue(chainConfigState);

  return useCallback(
    (r: ExecuteResult, opts: UseToastOptions) => {
      const url = chainConfig.explorer + "/txs/" + r.transactionHash;
      toast({
        title: "Successfull TX",
        description: (
          <Fragment>
            <Link href={url} target="_blank">
              Check the tx in the explorer {addressShort(r.transactionHash)}
            </Link>
          </Fragment>
        ),
        status: "success",
        duration: 9000,
        isClosable: true,
        ...opts,
      });
    },
    [toast, chainConfig]
  );
}
