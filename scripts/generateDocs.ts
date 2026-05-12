import { execSync } from "node:child_process";

execSync("typedoc --options typedoc.json", { stdio: "inherit" });
