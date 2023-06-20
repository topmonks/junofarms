import { kompleClient } from "./komple";

import addresses from "./addresses.json" assert { type: "json" };

export const hub = await kompleClient.hubModule(addresses.hub);
export const mint = await kompleClient.mintModule(addresses.mint);
export const fee = await kompleClient.feeModule(addresses.fee);
export const getTokenModule = (tokenAddr: string) =>
  kompleClient.tokenModule(tokenAddr);
