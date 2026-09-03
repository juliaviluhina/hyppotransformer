import { access, readFile, stat } from "node:fs/promises";
import { TransformerError } from "../safety/errors.js";

export interface Artifact { format: "pdf"; size_bytes: number; verified: boolean; }

export async function verifyPdf(path: string): Promise<Artifact> {
  await access(path).catch(() => { throw new TransformerError("OUTPUT_VERIFICATION", "OUTPUT_NOT_CREATED", "The PDF output was not created."); });
  const info = await stat(path);
  if (!info.isFile() || info.size === 0) throw new TransformerError("OUTPUT_VERIFICATION", "OUTPUT_EMPTY", "The PDF output is empty or not a regular file.");
  const signature = await readFile(path, { encoding: "utf8", flag: "r" }).then((text) => text.slice(0, 5)).catch(() => "");
  if (signature !== "%PDF-") throw new TransformerError("OUTPUT_VERIFICATION", "OUTPUT_INVALID", "The output does not have a valid PDF signature.");
  return { format: "pdf", size_bytes: info.size, verified: true };
}
