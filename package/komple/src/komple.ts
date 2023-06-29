import { KompleClient } from "komplejs";
import { DirectSecp256k1HdWallet } from "@cosmjs/proto-signing";
import { SigningCosmWasmClient } from "@cosmjs/cosmwasm-stargate";
import { stringToPath } from "@cosmjs/crypto/build/slip10.js";
import { GasPrice } from "@cosmjs/stargate";
import { COLLECTION_TYPES } from "./collections";

const mnemonic = process.env.MNEMONIC as string;

const prefix = "juno";
const slip = "44'/118'";

let config = {
  rpcEndpoint: "https://juno-testnet-rpc.polkachu.com:443",
  gasPrice: GasPrice.fromString("0.0025ujunox"),
  hubAddress: "juno1xr4almhfh48dcltntfxcy9jccmqadptgtkqetrxp6395rcq3lw0spr5sxq",
  mintCodeId: 2655,
  feeCodeId: 2656,
  collectionCodeId: 2657,
  metadataCodeId: 2658,
  collectionFees: {
    [COLLECTION_TYPES.BASIC]: "200",
    [COLLECTION_TYPES.ANIMALS]: "500",
  },
};

if (process.env.MAINNET) {
  config = {
    rpcEndpoint: "https://juno-rpc.polkachu.com:443",
    gasPrice: GasPrice.fromString("0.075ujuno"),
    hubAddress:
      "juno1xa22fhs5qexg0eukkwe4rm7egr5c2k2mdhyk8gfrpxske893cezq3zpn2z",
    mintCodeId: 3234,
    feeCodeId: 3235,
    collectionCodeId: 3236,
    metadataCodeId: 3237,
    collectionFees: {
      [COLLECTION_TYPES.BASIC]: "2000000",
      [COLLECTION_TYPES.ANIMALS]: "5000000",
    },
  };
}

export const signer = await DirectSecp256k1HdWallet.fromMnemonic(mnemonic, {
  prefix: prefix,
  hdPaths: [stringToPath(`m/${slip}/0'/0/0`)],
});

export const client = await SigningCosmWasmClient.connectWithSigner(
  config.rpcEndpoint,
  signer,
  {
    gasPrice: config.gasPrice,
  }
);

//@ts-ignore
export const kompleClient = new KompleClient(client, signer);

export const mintCodeId = config.mintCodeId;
export const feeCodeId = config.feeCodeId;
export const collectionCodeId = config.collectionCodeId;
export const metadataCodeId = config.metadataCodeId;
export const collectionFees = config.collectionFees;
