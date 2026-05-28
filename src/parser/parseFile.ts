import fs from "fs-extra";
import YAML from "yaml";

export async function parseFile(filePath: string, ext: string) {
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
// Markdown + frontmatter
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