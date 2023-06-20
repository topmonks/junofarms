import {
  collectionCodeId,
  feeCodeId,
  kompleClient,
  metadataCodeId,
  mintCodeId,
  client,
} from "./komple";

import addresses from "./addresses.json" assert { type: "json" };
import { writeFileSync } from "fs";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

const sender = (await kompleClient.signer.getAccounts())[0].address;

if (process.env.FORCE_DEPLOY || !addresses.hub) {
  const hubCreateAddr =
    "juno1w4vczv735kk9yzky9x53vfszesktgxqv53nahykrv7nlhmglf32qfl5rm6";

  const createHubMsgBody = {
    create_hub_module: {
      hub_info: {
        name: "Junofarms",
        description: "Farmville like web game, running on JUNO network",
        image: "foof",
        external_link: "https://junofarms.topmonks.com",
      },
    },
  };

  const createHubTx = await kompleClient.client.execute(
    sender,
    hubCreateAddr,
    createHubMsgBody,
    "auto"
  );

  const hubAddr = createHubTx.events
    .find(({ type }) => type === "wasm-hub_instantiate")
    ?.attributes.find(({ key }) => key === "_contract_address")?.value;

  if (!hubAddr) {
    throw new Error("hub not initialized");
  } else {
    console.log("hub initialized addr:", hubAddr);
  }

  addresses.hub = hubAddr;
}

const hubModule = await kompleClient.hubModule(addresses.hub);

if (process.env.FORCE_DEPLOY || !addresses.mint) {
  const registerMintTx = await hubModule.client.registerModule({
    codeId: mintCodeId,
    module: "mint",
  });

  const mintModuleAddr = registerMintTx.events
    .find(({ type }) => type === "wasm-mint_instantiate")
    ?.attributes.find(({ key }) => key === "_contract_address")?.value;

  if (!mintModuleAddr) {
    throw new Error("mint module not initialized");
  } else {
    console.log("mint module initialized addr:", mintModuleAddr);
  }

  addresses.mint = mintModuleAddr;
}

const mintModule = await kompleClient.mintModule(addresses.mint);

if (process.env.FORCE_DEPLOY || !addresses.fee) {
  const registerMintTx = await hubModule.client.registerModule({
    codeId: feeCodeId,
    module: "fee",
  });

  const feeModuleAddr = registerMintTx.events
    .find(({ type }) => type === "wasm-fee_instantiate")
    ?.attributes.find(({ key }) => key === "_contract_address")?.value;

  if (!feeModuleAddr) {
    throw new Error("fee module not initialized");
  } else {
    console.log("fee module initialized addr:", feeModuleAddr);
  }

  addresses.fee = feeModuleAddr;
}

const feeModule = await kompleClient.feeModule(addresses.fee);

if (
  process.env.FORCE_DEPLOY ||
  !addresses.plantsCollection ||
  !addresses.plantsMetadata
) {
  const createCollectionTx = await mintModule.client.createCollection({
    codeId: collectionCodeId,
    collectionConfig: {},
    collectionInfo: {
      collection_type: "komple",
      name: "Junofarms Plants",
      description: "plants",
      image: "plants",
    },
    fundInfo: {
      is_native: true,
      denom: "ujunox",
    },
    linkedCollections: [],
    metadataInfo: {
      code_id: metadataCodeId,
      instantiate_msg: {
        metadata_type: "shared",
      },
    },
    tokenInfo: {
      symbol: "FARM",
      minter: "",
    },
  });

  const collectionAddr = createCollectionTx.events
    .find(({ type }) => type === "wasm-token_instantiate")
    ?.attributes.find(({ key }) => key === "_contract_address")?.value;

  if (!collectionAddr) {
    throw new Error("collection not initialized");
  } else {
    console.log("collection initialized addr:", collectionAddr);
  }

  const collectionMetadataAddr = createCollectionTx.events
    .find(({ type }) => type === "wasm-metadata_instantiate")
    ?.attributes.find(({ key }) => key === "_contract_address")?.value;

  if (!collectionMetadataAddr) {
    throw new Error("collection metadata not initialized");
  } else {
    console.log(
      "collection metadata initialized addr:",
      collectionMetadataAddr
    );
  }

  addresses.plantsCollection = collectionAddr;
  addresses.plantsMetadata = collectionMetadataAddr;
  addresses.plantsCollectionId = 1;
}

const tokenModule = await kompleClient.tokenModule(addresses.plantsCollection);
const metadataModule = await kompleClient.metadataModule(
  addresses.plantsMetadata
);

if (process.env.FORCE_DEPLOY || !addresses.plantsMetadataId) {
  const createMetadataId = await metadataModule.client.addMetadata({
    attributes: [
      {
        trait_type: "name",
        value: "wheat",
      },
    ],
    metaInfo: {},
  });

  addresses.plantsMetadataId = 1;
}

writeFileSync(
  join(dirname(fileURLToPath(import.meta.url)), "./addresses.json"),
  JSON.stringify(addresses, null, 4)
);

// await mintModule.client.mint({
//   metadataId: addresses.plantsMetadataId,
//   collectionId: addresses.plantsCollectionId,
// });

console.log(
  await client.queryContractSmart(addresses.plantsCollection, {
    all_nft_info: {
      token_id: "1",
    },
  })
);
