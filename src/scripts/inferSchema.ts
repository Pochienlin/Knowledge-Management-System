import path from "path";
import { fileURLToPath } from "url";
import { inferScanDatasource } from "../dataInference/walkSchema.js";
import { writeSchema } from "../dataInference/writeSchema.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function main() {
  const rootDir = path.join(__dirname, "../datasource");

  console.log("🔍 Inferring schemas...");

  const result = await inferScanDatasource(rootDir);

  for (const schema of result.schemas.values()) {
    console.log("📌 Suggested schema:", schema.type);
    await writeSchema(schema);
  }

  console.log("✅ Done.");
}

main().catch(console.error);