import { access, mkdtemp, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import { dirname, join, basename } from "node:path";
import { runProcess } from "./process.js";
import type { TransformerConfig } from "../config/schema.js";
import { TransformerError } from "../safety/errors.js";

export function buildPandocArgs(source: string, html: string, profile: { stylesheet?: string; page_size?: string }): string[] {
  const args = [source, "-o", html, "--standalone", `--resource-path=${dirname(source)}`, "--embed-resources"];
  if (profile.stylesheet) args.push("--css", profile.stylesheet);
  if (profile.page_size) args.push("--metadata", `papersize=${profile.page_size}`);
  return args;
}

export async function renderMarkdownToPdf(source: string, output: string, profile: string, config: TransformerConfig): Promise<void> {
  const selected = config.profiles[profile];
  if (!selected) throw new TransformerError("CONFIGURATION", "PROFILE_NOT_FOUND", `Profile '${profile}' is not configured.`);
  const executor = config.executors[selected.executor];
  if (!executor) throw new TransformerError("CONFIGURATION", "EXECUTOR_NOT_CONFIGURED", `Executor '${selected.executor}' is not configured.`);
  const dir = await mkdtemp(join(tmpdir(), "hyppotransformer-"));
  const html = join(dir, `${basename(source)}.html`);
  try {
    const pandocArgs = buildPandocArgs(source, html, selected);
    const pandoc = await runProcess(executor.pandoc, pandocArgs, config.limits.timeout_ms, dirname(source));
    if (pandoc.timedOut) throw new TransformerError("TIMEOUT", "EXECUTOR_TIMEOUT", "The Markdown renderer timed out.");
    if (pandoc.code !== 0) throw new TransformerError("EXECUTOR", "EXECUTOR_NONZERO_EXIT", "The Markdown renderer failed.");
    await access(html).catch(() => { throw new TransformerError("EXECUTOR", "INTERMEDIATE_NOT_CREATED", "The renderer did not create its intermediate document."); });
    const chrome = await runProcess(executor.browser, ["--headless=new", "--no-sandbox", "--disable-gpu", `--print-to-pdf=${output}`, `file://${html}`], config.limits.timeout_ms, dirname(source));
    if (chrome.timedOut) throw new TransformerError("TIMEOUT", "EXECUTOR_TIMEOUT", "The PDF renderer timed out.");
    if (chrome.code !== 0) throw new TransformerError("EXECUTOR", "EXECUTOR_NONZERO_EXIT", "The PDF renderer failed.");
  } finally {
    await rm(dir, { recursive: true, force: true });
  }
}
