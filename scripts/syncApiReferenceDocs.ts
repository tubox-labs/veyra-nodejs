import { copyFile, mkdir } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const here = dirname(fileURLToPath(import.meta.url));
const root = join(here, "..");

await mkdir(join(root, "docs", "api-reference"), { recursive: true });
await copyFile(
  join(root, "docs", "sdk-api-reference.md"),
  join(root, "docs", "api-reference", "sdk-reference.md"),
);
