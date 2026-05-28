import fs from 'fs-extra';
import path from 'path';
import YAML from 'yaml';
import { buildKmsId } from '../core/identity.js';
import type { FieldDefinition } from '../schema/resolverSchema.js';
import { shouldIgnorePath } from '../dataInference/shouldIgnorePath.js';

export type SchemaDefinition = {
  type: string;
  extends?: string;
  fields: Record<string, FieldDefinition>;
  directory: string; // where this schema lives
};

export type EntityInstance = {
  id: string;
  __type: string;
  __filePath: string;
  [key: string]: any;
};
// ------------ Note: this is raw ingestion, to be used later on by the other modules for graphQL types -------
export type ScanResult = {
  schemas: Map<string, SchemaDefinition>;
  instances: Map<string, EntityInstance[]>;
};

const SUPPORTED_DATA_EXTENSIONS = ['.json', '.yaml', '.yml', '.md'];

export async function scanDatasource(rootDir: string): Promise<ScanResult> {
  const schemas = new Map<string, SchemaDefinition>();
  const instances = new Map<string, EntityInstance[]>();

  async function walk(dir: string, parentType?: string) {
    const entries = await fs.readdir(dir);

    let currentType = parentType;

    // 1. Check for schema.yaml
    const schemaPath = path.join(dir, 'schema.yaml');
    if (await fs.pathExists(schemaPath)) {
      const raw = await fs.readFile(schemaPath, 'utf-8');
      const parsed = YAML.parse(raw);

      if (!parsed?.type) {
        throw new Error(`Missing "type" in schema: ${schemaPath}`);
      }

      const schema: SchemaDefinition = {
        type: parsed.type,
        extends: parsed.extends,
        fields: Object.fromEntries(
            Object.entries(parsed.fields || {}).map(([key, value]) => [
            key,
            parseField(value)
            ])
        ),
        directory: path.relative(rootDir, dir)
        };

      schemas.set(schema.type, schema);
      currentType = schema.type;
    }

    // 2. Process files in directory
    for (const entry of entries) {
      if (shouldIgnorePath(entry)) continue;
      
      const fullPath = path.join(dir, entry);
      const stat = await fs.stat(fullPath);

      if (stat.isDirectory()) {
        await walk(fullPath, currentType);
        continue;
      }

      const ext = path.extname(entry);

      // Skip schema.yaml
      if (entry === 'schema.yaml') continue;

      // Only process supported data files
      if (!SUPPORTED_DATA_EXTENSIONS.includes(ext)) continue;

      if (!currentType) {
        console.warn(`Skipping file without schema context: ${fullPath}`);
        continue;
      }

      const data = await parseDataFile(fullPath, ext);

      const instance: EntityInstance= {
        kmsId: buildKmsId({
            rootDir,
            filePath: fullPath
        }),
        __type: currentType,
        __filePath: fullPath,

        ...data
        };

      if (!instances.has(currentType)) {
        instances.set(currentType, []);
      }

      instances.get(currentType)!.push(instance);
    }
  }

  await walk(rootDir);

  return { schemas, instances };
}

async function parseDataFile(filePath: string, ext: string) {
  const raw = await fs.readFile(filePath, 'utf-8');
  console.log(`Scanning file: ${filePath}`)

  switch (ext) {
    case '.json':
        console.log(`Parsed: ${JSON.stringify(JSON.parse(raw),null,4)}`)
      return JSON.parse(raw);

    case '.yaml':
    case '.yml':
      return YAML.parse(raw);

    case '.md':
      // basic markdown handling (frontmatter later if needed)
      return { content: raw };

    default:
      return {};
  }
}

function parseField(value: any): FieldDefinition {
  if (typeof value === "string") {
    const isArray = value.endsWith("[]");

    return {
      type: isArray ? value.replace("[]", "") : value,
      array: isArray,
      key: "id"
    };
  }

  return {
    type: value.type,
    array: value.array,
    key: value.key ?? "id"
  };
}