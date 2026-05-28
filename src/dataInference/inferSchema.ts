// This file here is to infer the schema of the data within datasource folder. For each folder, we first see if there's a schema.yaml. If there is, we use it to infer the schema. If not, we look at the data files and infer the schema from them. The inferred schema will be used to validate the data files and also to generate the TypeScript types for the data.
    // Note: We grab all fields we see in the folder so long as it is json, md or yaml. If any instance is missing the field, we will just mark it as optional.

import fs from "fs-extra";
import path from "path";
import YAML from "yaml";
import { shouldIgnorePath } from "./shouldIgnorePath.js";

type PrimitiveType = "string" | "number" | "boolean" | null;

type FieldStats = {
  name: string;
  typeCounts: Map<PrimitiveType, number>;
  occurrences: number;
  optional: boolean;
};

type InferredSchema = {
  type: string;
  fields: Record<
    string,
    {
      type: string;
      array?: boolean;
      optional?: boolean;
    }
  >;
  directory: string;
};

const SUPPORTED_EXTENSIONS = [".json", ".yaml", ".yml", ".md"];

export async function inferSchemaFromRoot(rootDir: string) {
  const results: InferredSchema[] = [];

  await walk(rootDir, results);

  return results;
}

// -----------------------------
// Recursive folder traversal
// -----------------------------
async function walk(dir: string, results: InferredSchema[]) {
  const entries = await fs.readdir(dir);

  const fieldMap = new Map<string, FieldStats>();
  let hasDataFiles = false;

  for (const entry of entries) {
    if (shouldIgnorePath(entry)) continue;
    const fullPath = path.join(dir, entry);
    const stat = await fs.stat(fullPath);

    if (stat.isDirectory()) {
      await walk(fullPath, results);
      continue;
    }

    const ext = path.extname(entry);
    if (!SUPPORTED_EXTENSIONS.includes(ext)) continue;

    hasDataFiles = true;

    const doc = await parseFile(fullPath, ext);

    for (const [key, value] of Object.entries(doc)) {
      updateFieldStats(fieldMap, key, value);
    }
  }

  if (!hasDataFiles) return;

  const schema = buildSchemaFromStats(dir, fieldMap);

  results.push(schema);
}

// -----------------------------
// File parsing
// -----------------------------
async function parseFile(filePath: string, ext: string): Promise<Record<string, any>> {
  const raw = await fs.readFile(filePath, "utf-8");

  switch (ext) {
    case ".json":
      return JSON.parse(raw);

    case ".yaml":
    case ".yml":
      return YAML.parse(raw);

    case ".md":
      return parseMarkdown(raw, filePath);

    default:
      return {};
  }
}

// -----------------------------
// Markdown frontmatter parsing
// -----------------------------
function parseMarkdown(raw: string, filePath: string) {
  const match = raw.match(/^---\n([\s\S]*?)\n---/);

  let frontmatter: Record<string, any> = {};

  if (match && match[1]) {
    frontmatter = YAML.parse(match[1]) ?? {};
  }

  return {
    ...frontmatter,
    location: filePath,
    content: raw.replace(/^---[\s\S]*?---\n/, "")
  };
}

// -----------------------------
// Field tracking logic
// -----------------------------
function updateFieldStats(
  map: Map<string, FieldStats>,
  key: string,
  value: any
) {
  if (!map.has(key)) {
    map.set(key, {
      name: key,
      typeCounts: new Map(),
      occurrences: 0,
      optional: false
    });
  }

  const stat = map.get(key)!;

  stat.occurrences++;

  const type = inferPrimitiveType(value);
  if (type) {
    stat.typeCounts.set(type, (stat.typeCounts.get(type) ?? 0) + 1);
  }
  stat.typeCounts.set(type, (stat.typeCounts.get(type) ?? 0) + 1);
}

// -----------------------------
// Type inference
// -----------------------------
function inferPrimitiveType(value: any): PrimitiveType {
  if (value === null || value === undefined) return null;
  if (Array.isArray(value)) return "string"; // MVP simplification
  if (typeof value === "number") return "number";
  if (typeof value === "boolean") return "boolean";
  if (typeof value === "string") return "string";
  return "string"; // default to string for complex types
}

// -----------------------------
// Build schema from stats
// -----------------------------
function buildSchemaFromStats(
  dir: string,
  map: Map<string, FieldStats>
): InferredSchema {
  const fields: InferredSchema["fields"] = {};

  const entries = Array.from(map.values());

  const totalDocs = Math.max(...entries.map((e) => e.occurrences));

  for (const field of entries) {
    const presenceRatio = field.occurrences / totalDocs;

    const primaryType =
        [...field.typeCounts.entries()].sort((a, b) => b[1] - a[1])[0]?.[0]
        ?? "string";
        
    fields[field.name] = {
      type: primaryType,
      optional: presenceRatio < 1
    };
  }

  return {
    type: path.basename(dir),
    directory: dir,
    fields
  };
}