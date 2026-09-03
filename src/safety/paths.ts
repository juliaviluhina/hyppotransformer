import { dirname, relative, resolve, basename, isAbsolute, join, sep } from "node:path";
import { realpath } from "node:fs/promises";
import { TransformerError } from "./errors.js";

async function canonicalPath(path: string): Promise<string> {
  try {
    return await realpath(path);
  } catch {
    const parent = dirname(path);
    if (parent === path) return resolve(path);
    return join(await canonicalPath(parent), basename(path));
  }
}

export async function withinWorkspace(path: string, roots: string[]): Promise<string> {
  const candidate = await canonicalPath(resolve(path));
  const allowedRoots = await Promise.all(roots.map((root) => canonicalPath(resolve(root))));
  const allowed = allowedRoots.some((rootPath) => {
    const rel = relative(rootPath, candidate);
    return rel === "" || (!rel.startsWith(`..${sep}`) && rel !== ".." && !isAbsolute(rel));
  });
  if (!allowed) throw new TransformerError("POLICY_REFUSAL", "PATH_OUTSIDE_WORKSPACE", "The requested path is outside the configured workspace.");
  return candidate;
}
