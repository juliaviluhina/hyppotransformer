import { stat } from "node:fs/promises";
import { TransformerError } from "./errors.js";

export async function validateInput(path: string, maxBytes: number): Promise<void> {
  const info = await stat(path).catch(() => { throw new TransformerError("VALIDATION", "SOURCE_NOT_FOUND", "The source document does not exist."); });
  if (!info.isFile()) throw new TransformerError("VALIDATION", "SOURCE_NOT_FILE", "The source path is not a regular file.");
  if (info.size > maxBytes) throw new TransformerError("VALIDATION", "INPUT_TOO_LARGE", "The source document exceeds the configured input limit.");
}
