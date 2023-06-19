import { atom, selector } from "recoil";
import { MAINNET, TESTNET } from "../lib/config";
import { chains } from "chain-registry";

type Chain = (typeof chains)[0];

export const chainState = atom<Chain>({
  key: "chainState",
  default: chains.find((c) => c.chain_id === TESTNET.JUNO),
});

export const chainConfigState = selector({
  key: "chainConfigState",
  get: async ({ get }) => {
    const chain = get(chainState);
    if (chain.chain_id === TESTNET.JUNO) {
      return {
        explorer: "https://testnet.mintscan.io/juno-testnet",
      };
    }
    if (chain.chain_id === MAINNET.JUNO) {
      return {
        explorer: "https://www.mintscan.io/juno",
      };
    }

    throw new Error("unknown chain_id " + chain.chain_id);
  },
});
