import path from "path";

export function shouldIgnorePath(entry: string) {
  const base = path.basename(entry);

  // ignore dotfiles / dotfolders
  if (base.startsWith(".")) return true;

  // optional future ignores
  const ignored = new Set([
    "node_modules",
    "dist",
    "build"
  ]);

  if (ignored.has(base)) return true;

  return false;
}