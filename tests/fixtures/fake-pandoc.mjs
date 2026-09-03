import { writeFileSync } from "node:fs";
import process from "node:process";

const args = process.argv.slice(2);
const outputIndex = args.indexOf("-o");
if (outputIndex === -1 || !args[outputIndex + 1]) {
  process.exit(2);
}

writeFileSync(args[outputIndex + 1], "<html><body>fixture</body></html>\n");
