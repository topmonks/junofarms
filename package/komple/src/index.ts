/* eslint-disable @typescript-eslint/ban-ts-comment */
import {
  collectionCodeId,
  config,
  feeCodeId,
  kompleClient,
  metadataCodeId,
  mintCodeId,
} from "./komple";

import addresses from "./addresses.json" assert { type: "json" };
import { readFileSync, writeFileSync } from "fs";
import { fileURLToPath } from "url";
import { dirname, join, resolve } from "path";
import {
  COLLECTION_TYPES,
  collections,
  metadata_per_collection,
} from "./collections";
import { metadata } from "./collections";
import yaml from "js-yaml";

const sender = (await kompleClient.signer.getAccounts())[0].address;

const pulumi_config = yaml.load(
  readFileSync(resolve("../cloud/Pulumi.junofarms-prod.yaml"), "utf8")
) as { config: { "junofarms:contract": string } };

if (process.env.FORCE_DEPLOY || !addresses.hub) {
  const hubCreateAddr =
    "juno1w4vczv735kk9yzky9x53vfszesktgxqv53nahykrv7nlhmglf32qfl5rm6";

  const createHubMsgBody = {
    create_hub_module: {
      hub_info: {
        name: "Junofarms",
        description: "Farmville like web game, running on JUNO network",
        image: "no-image",
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

const junofarmsContract = pulumi_config.config["junofarms:contract"];
if (junofarmsContract) {
  const operators = await mintModule.queryClient.operators();

  if (!operators.data.includes(junofarmsContract)) {
    await mintModule.client.updateOperators({
      addrs: operators.data.concat([junofarmsContract]),
    });

    console.log("contract", junofarmsContract, "added as komple operator");
  }
} else {
  console.warn("missing config value junofarms:contract in pulumi config");
}

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

let collectionId = addresses.lastCollectionId || 0;
for (const collection_type of Object.values(COLLECTION_TYPES)) {
  let metadataModule;
  if (
    process.env.FORCE_DEPLOY ||
    !Object.keys(addresses[collection_type]).length
  ) {
    const createCollectionTx = await mintModule.client.createCollection({
      codeId: collectionCodeId,
      collectionConfig: {},
      collectionInfo: collections[collection_type],
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

    addresses[collection_type] = {
      tokenAddr: collectionAddr,
      metadataAddr: collectionMetadataAddr,
      collectionId: ++collectionId,
      //@ts-ignore
      metadata: {},
    };

    const _tokenModule = await kompleClient.tokenModule(collectionAddr);
    metadataModule = await kompleClient.metadataModule(collectionMetadataAddr);

    if (config.collection_fees[collection_type]) {
      const setFeeCollectionTx = await feeModule.client.setFee({
        data: Buffer.from(
          JSON.stringify({ value: config.collection_fees[collection_type] }),
          "binary"
        ).toString("base64"),
        feeName: "price:" + collectionId,
        feeType: "fixed",
        moduleName: "mint",
      });
      // @ts-ignore
      addresses[collection_type].mintFee =
        config.collection_fees[collection_type];
    }
  } else {
    metadataModule = await kompleClient.metadataModule(
      // @ts-ignore
      addresses[collection_type].metadataAddr
    );
  }

  // @ts-ignore
  let metadataId = addresses[collection_type].lastMetadataId || 0;
  for (const metadata_type of Object.values(
    metadata_per_collection[collection_type]
  )) {
    if (
      process.env.FORCE_DEPLOY ||
      //@ts-ignore
      !addresses[collection_type].metadata[metadata_type]
    ) {
      const _createMetadataId = await metadataModule.client.addMetadata(
        //@ts-ignore
        metadata[metadata_type]
      );

      // @ts-ignore
      addresses[collection_type].metadata[metadata_type] = {
        metadataId: ++metadataId,
      };

      console.log(`metadata type ${metadata_type}:`, metadataId);
    }
  }

  // @ts-ignore
  addresses[collection_type].lastMetadataId = metadataId;
}

addresses.lastCollectionId = collectionId;

writeFileSync(
  join(dirname(fileURLToPath(import.meta.url)), "./addresses.json"),
  JSON.stringify(addresses, null, 4)
);

// await mintModule.client.mint({
//   metadataId: addresses.plantsMetadataId,
//   collectionId: addresses.plantsCollectionId,
// });

// console.log(
//   await client.queryContractSmart(addresses.plantsCollection, {
//     all_nft_info: {
//       token_id: "1",
//     },
//   })
// );
