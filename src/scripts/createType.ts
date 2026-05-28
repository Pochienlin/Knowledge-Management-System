import fs from "fs-extra";
import path from "path";
import YAML from "yaml";
import { fileURLToPath } from "url";

type CreateTypeInput = {
  rootDir: string;
  type: string;
  fields: Record<
    string,
    {
      type: string;
      optional?: boolean;
      array?: boolean;
    }
  >;
};

function sanitizeTypeName(name: string) {
  return name.replace(/[^a-zA-Z0-9_]/g, "");
}

// -----------------------------
// Resolve project root safely
// -----------------------------
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// if script is in dist/scripts/, go up to project root
const PROJECT_ROOT = path.resolve(__dirname, "../..");

async function createType({
  rootDir,
  type,
  fields
}: CreateTypeInput) {
  const safeType = sanitizeTypeName(type);

  const dir = path.join(rootDir, safeType);
  const schemaPath = path.join(dir, "schema.yaml");

  await fs.ensureDir(dir);

  const schema = {
    type: safeType,
    fields
  };

  await fs.writeFile(schemaPath, YAML.stringify(schema), "utf-8");

  console.log(`✅ Created type: ${safeType}`);
  console.log(`📁 Path: ${dir}`);
  console.log(`📄 schema.yaml written`);
}

// -----------------------------
// Entry
// -----------------------------
async function main() {
  const rawInput = process.argv[2];

  if (!rawInput) {
    throw new Error(`Missing input JSON`);
  }

  const input = JSON.parse(rawInput);

  const rootDir = path.join(PROJECT_ROOT, "datasource");

  await createType({
    rootDir,
    type: input.type,
    fields: input.fields
  });
}

main().catch(console.error);