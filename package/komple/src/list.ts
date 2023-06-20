import { getTokenModule, mint } from "./modules";

const collections = await mint.client.collections({ blacklist: false });

for (const collection of collections.data) {
  const token = await getTokenModule(collection.address);
  const submodules = await token.client.subModules();

  console.log(collection.collection_id, submodules);
}
