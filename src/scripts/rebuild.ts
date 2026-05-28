import path from "path";
import { fileURLToPath } from "url";

import { scanDatasource } from "../loader/scan.js";
import { resolveSchemas } from "../schema/resolverSchema.js";
import { generateTypeDefs } from "../graphql/typeDef.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function main() {
  const rootDir = path.join(__dirname, "../datasource");

  console.log("📦 Scanning...");
  const scanResult = await scanDatasource(rootDir);

  console.log("🧠 Resolving schemas...");
  const schemas = resolveSchemas(scanResult.schemas);

  console.log("⚙️ Generating typeDefs...");
  const typeDefs = generateTypeDefs(schemas);

  console.log("\n========== TYPEDEFS ==========\n");
  console.log(typeDefs);
  console.log("\n================================\n");
}

main().catch(console.error);