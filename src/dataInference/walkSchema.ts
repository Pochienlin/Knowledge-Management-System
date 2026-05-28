import type { ScanResult, SchemaDefinition, EntityInstance } from "../loader/scan.js";
import { inferSchemaFromRoot } from "./inferSchema.js";
import fs from "fs-extra";
import path from "path";
import YAML from "yaml";
import { parseFile } from "../parser/parseFile.js";
import { shouldIgnorePath } from "./shouldIgnorePath.js";
export async function inferScanDatasource(rootDir: string): Promise<ScanResult> {
  const schemas = new Map<string, SchemaDefinition>();
  const instances = new Map<string, EntityInstance[]>();

  await walk(rootDir, schemas, instances);

  return {
    schemas,
    instances
  };
}

async function walk(
  dir: string,
  schemas: Map<string, SchemaDefinition>,
  instances: Map<string, EntityInstance[]>
) {
  const entries = await fs.readdir(dir);

  let currentType: string | undefined = undefined;
  let hasSchema = false;

  // ----------------------------
  // 1. schema detection
  // ----------------------------
  const schemaPath = path.join(dir, "schema.yaml");

  if (await fs.pathExists(schemaPath)) {
    const raw = await fs.readFile(schemaPath, "utf-8");
    const parsed = YAML.parse(raw);

    hasSchema = true;
    currentType = parsed.type;

    schemas.set(parsed.type, {
      type: parsed.type,
      extends: parsed.extends,
      fields: parsed.fields,
      directory: dir
    });
  }

  // ----------------------------
  // 2. if no schema → infer 
  // ----------------------------
  if (!hasSchema) {
    const inferredList = await inferSchemaFromRoot(dir);

    for (const schema of inferredList) {
      schemas.set(schema.type, {
        type: schema.type,
        fields: schema.fields as any,
        directory: schema.directory
      });
    }
  }

  // ----------------------------
  // 3. process files
  // ----------------------------
  for (const entry of entries) {
    if (shouldIgnorePath(entry)) continue;

    const fullPath = path.join(dir, entry);
    const stat = await fs.stat(fullPath);

    if (stat.isDirectory()) {
      await walk(fullPath, schemas, instances);
      continue;
    }

    if (entry === "schema.yaml") continue;

    const ext = path.extname(entry);
    if (![".json", ".yaml", ".yml", ".md"].includes(ext)) continue;

    const data = await parseFile(fullPath, ext);

    const type = currentType ?? path.basename(dir);

    const instance: EntityInstance = {
      kmsId: `${type}/${path.parse(entry).name}`,
      __type: type,
      __filePath: fullPath,
      ...data
    };

    if (!instances.has(type)) {
      instances.set(type, []);
    }

    instances.get(type)!.push(instance);
  }
}