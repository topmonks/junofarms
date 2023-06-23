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
        name: "komple-token",
        dir: "../../../komple-framework/contracts/modules/token/schema",
      },
      {
        name: "komple-metadata",
        dir: "../../../komple-framework/contracts/modules/metadata/schema",
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
