import fs from "fs-extra";
import path from "path";
import YAML from "yaml";

export async function writeSchema(schema: any) {
  const filePath = path.join(schema.directory, "schema.yaml");

  const yaml = YAML.stringify({
    type: schema.type,
    fields: schema.fields
  });

  await fs.writeFile(filePath, yaml, "utf-8");
}