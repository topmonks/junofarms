import { atom } from "recoil";
import { TESTNET } from "../lib/config";
import { chains } from "chain-registry";

type Chain = (typeof chains)[0];

export const chainState = atom<Chain>({
  key: "chainState",
  default: chains.find((c) => c.chain_id === TESTNET.JUNO),
});
