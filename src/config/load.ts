import { readFile } from "node:fs/promises";
import { configSchema, type TransformerConfig } from "./schema.js";
import { parse } from "yaml";

export async function loadConfig(path = process.env.HYPPOTRANSFORMER_CONFIG): Promise<TransformerConfig> {
  if (!path) {
    return configSchema.parse({
      workspace_roots: [process.cwd()],
      profiles: { default: { executor: "markdown-to-pdf" } },
      executors: {},
    });
  }
  const raw = parse(await readFile(path, "utf8"));
  return configSchema.parse(raw);
}
