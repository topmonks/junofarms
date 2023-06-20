import { KompleClient } from "komplejs";
import { DirectSecp256k1HdWallet } from "@cosmjs/proto-signing";
import { SigningCosmWasmClient } from "@cosmjs/cosmwasm-stargate";
import { stringToPath } from "@cosmjs/crypto/build/slip10.js";
import { GasPrice } from "@cosmjs/stargate";

const mnemonic = process.env.MNEMONIC as string;

const prefix = "juno";
const slip = "44'/118'";

const signer = await DirectSecp256k1HdWallet.fromMnemonic(mnemonic, {
  prefix: prefix,
  hdPaths: [stringToPath(`m/${slip}/0'/0/0`)],
});

const rpcEndpoint = "https://juno-testnet-rpc.polkachu.com:443";

const client = await SigningCosmWasmClient.connectWithSigner(
  rpcEndpoint,
  signer,
  {
    gasPrice: GasPrice.fromString("0.0025ujunox"),
  }
);

//@ts-ignore
export const kompleClient = new KompleClient(client, signer);

export const mintCodeId = 61;
export const feeCodeId = 55;
export const collectionCodeId = 64;
export const metadataCodeId = 60;
