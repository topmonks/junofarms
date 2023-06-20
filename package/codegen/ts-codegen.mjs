import codegen from "@cosmwasm/ts-codegen";

codegen
  .default({
    contracts: [
      {
        name: "junofarms",
        dir: "../../../juno-hackathon-farm-example/schema",
      },
      {
        name: "komple-mint",
        dir: "../../../komple-framework/contracts/modules/mint/schema",
      },
      {
        name: "cw721-base",
        dir: "../../../cw-nfts/contracts/cw721-base/schema",
      },
    ],
    outPath: "../ui/src/codegen/",

    // options are completely optional ;)
    options: {
      bundle: {
        bundleFile: "index.ts",
        scope: "contracts",
      },
      types: {
        enabled: true,
      },
      client: {
        enabled: true,
      },
      reactQuery: {
        enabled: true,
        optionalClient: true,
        version: "v4",
        mutations: true,
        queryKeys: true,
        queryFactory: true,
      },
      recoil: {
        enabled: false,
      },
      messageComposer: {
        enabled: false,
      },
      msgBuilder: {
        enabled: false,
      },
    },
  })
  .then(() => {
    console.log("✨ all done!");
  });
