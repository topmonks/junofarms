import { useRecoilValue } from "recoil";
import { chainState } from "../state/cosmos";
import { useChain } from "@cosmos-kit/react";

export default function useDefaultAsset() {
  const chain = useRecoilValue(chainState);
  const { assets } = useChain(chain.chain_name);

  if (!assets) {
    throw new Error("unknown asset");
  }

  return assets.assets[0];
}
