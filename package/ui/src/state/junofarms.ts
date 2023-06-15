import { selector } from "recoil";
import { chainState } from "./cosmos";
import { TESTNET } from "../lib/config";

export const contractState = selector<string>({
  key: "contractsState",
  get: async ({ get }) => {
    const chain = get(chainState);
    if (chain.chain_id === TESTNET.JUNO) {
      return "juno1hxareght6n8zh2epqwt8spfnn270q7ef8qj6p0p6vk8dcw4zsrsqj6p8ph";
    }

    throw new Error("unknown chain_id " + chain.chain_id);
  },
});
