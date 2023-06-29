import { KompleClient } from "komplejs";
import { DirectSecp256k1HdWallet } from "@cosmjs/proto-signing";
import { SigningCosmWasmClient } from "@cosmjs/cosmwasm-stargate";
import { stringToPath } from "@cosmjs/crypto/build/slip10.js";
import { GasPrice } from "@cosmjs/stargate";
import { COLLECTION_TYPES } from "./collections";

const mnemonic = process.env.MNEMONIC as string;

const prefix = "juno";
const slip = "44'/118'";

export const config = {
  rpcEndpoint: "https://juno-testnet-rpc.polkachu.com:443",
  gasPrice: GasPrice.fromString("0.0025ujunox"),
  hubAddress: "juno1xr4almhfh48dcltntfxcy9jccmqadptgtkqetrxp6395rcq3lw0spr5sxq",
  mintCodeId: 2655,
  feeCodeId: 2656,
  collectionCodeId: 2657,
  metadataCodeId: 2658,
  collection_fees: {
    [COLLECTION_TYPES.BASIC]: "200",
    [COLLECTION_TYPES.ANIMALS]: "500",
  },
};

if (process.env.MAINNET) {
} else {
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
