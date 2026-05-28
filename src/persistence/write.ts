import fs from "fs-extra";
import path from "path";

// this is the only place to write a new file via Apollo. Standardized to JSON to make my life easier

export async function writeEntityFile(
  filePath: string,
  data: any
) {
  await fs.ensureDir(path.dirname(filePath));

  await fs.writeJson(
    filePath,
    data,
    {
      spaces: 2
    }
  );
}