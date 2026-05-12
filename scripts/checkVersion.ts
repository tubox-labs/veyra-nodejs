import { readFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const here = dirname(fileURLToPath(import.meta.url));
const root = join(here, "..");

const [pkgRaw, versionTs] = await Promise.all([
  readFile(join(root, "package.json"), "utf8"),
  readFile(join(root, "src/version.ts"), "utf8"),
]);

const pkg = JSON.parse(pkgRaw) as { version?: string };
const versionMatch = versionTs.match(/VERSION\s*=\s*"([^"]+)"/);

if (!pkg.version || !versionMatch?.[1]) {
  throw new Error("Unable to determine package or source version.");
}

if (pkg.version !== versionMatch[1]) {
  throw new Error(
    `Version mismatch: package.json=${pkg.version} src/version.ts=${versionMatch[1]}`,
  );
}

console.log(`Version check passed: ${pkg.version}`);
