import { realpath } from "node:fs/promises";
import { resolve, relative, isAbsolute } from "node:path";
import { TransformerError } from "./errors.js";

export async function withinWorkspace(path: string, roots: string[]): Promise<string> {
  const candidate = resolve(path);
  const canonical = await realpath(candidate).catch(() => candidate);
  const allowed = roots.some((root) => {
    const rootPath = resolve(root);
    const rel = relative(rootPath, canonical);
    return rel === "" || (!rel.startsWith(".." + "/") && rel !== ".." && !isAbsolute(rel));
  });
  if (!allowed) throw new TransformerError("POLICY_REFUSAL", "PATH_OUTSIDE_WORKSPACE", "The requested path is outside the configured workspace.");
  return canonical;
}
