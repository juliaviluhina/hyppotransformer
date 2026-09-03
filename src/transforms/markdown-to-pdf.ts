import { randomUUID } from "node:crypto";
import { access } from "node:fs/promises";
import { resolve } from "node:path";
import type { TransformerConfig } from "../config/schema.js";
import { renderMarkdownToPdf } from "../executors/markdown-to-pdf.js";
import { verifyPdf } from "../verification/pdf.js";
import { TransformerError, errorResult } from "../safety/errors.js";
import { validateInput } from "../safety/limits.js";
import { withinWorkspace } from "../safety/paths.js";

export async function transformMarkdownToPdf(input: { source_path: string; profile: string; output_path?: string }, config: TransformerConfig) {
  const jobId = randomUUID();
  try {
    const source = await withinWorkspace(input.source_path, config.workspace_roots);
    await validateInput(source, config.limits.max_input_bytes);
    const profile = config.profiles[input.profile];
    if (!profile) throw new TransformerError("CONFIGURATION", "PROFILE_NOT_FOUND", `Profile '${input.profile}' is not configured.`);
    if (profile.stylesheet) await withinWorkspace(profile.stylesheet, config.workspace_roots);
    const output = resolve(input.output_path ?? `${source}.pdf`);
    await withinWorkspace(output, config.workspace_roots);
    if (profile.output_policy === "explicit-only" && !input.output_path) throw new TransformerError("POLICY_REFUSAL", "OUTPUT_PATH_REQUIRED", "This profile requires an explicit output path.");
    if (profile.output_policy !== "replace" && await access(output).then(() => true).catch(() => false)) throw new TransformerError("POLICY_REFUSAL", "OUTPUT_CONFLICT", "The output already exists and replacement is not permitted.");
    await renderMarkdownToPdf(source, output, input.profile, config);
    const artifact = await verifyPdf(output);
    return { status: "created", job_id: jobId, source_path: source, output_path: output, profile: input.profile, artifact, warnings: [] };
  } catch (error) {
    return errorResult(error, jobId);
  }
}
