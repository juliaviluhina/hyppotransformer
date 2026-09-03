import { writeFileSync } from "node:fs";
import process from "node:process";

const outputArgument = process.argv.slice(2).find((arg) => arg.startsWith("--print-to-pdf="));
if (!outputArgument) {
  process.exit(2);
}

writeFileSync(outputArgument.slice("--print-to-pdf=".length), "%PDF-1.7\nfixture\n");
