import { describe, expect, it } from "vitest";
import { mkdtemp, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { configSchema } from "../../src/config/schema.js";
import { transformMarkdownToPdf } from "../../src/transforms/markdown-to-pdf.js";

describe("Markdown-to-PDF transformation", () => {
  it("refuses a profile that has no configured executor", async () => {
    const root = await mkdtemp(join(tmpdir(), "hyppo-test-"));
    const source = join(root, "document.md");
    await writeFile(source, "# Hello");
    const config = configSchema.parse({ workspace_roots: [root], profiles: { default: { executor: "missing" } }, executors: {} });
    const result = await transformMarkdownToPdf({ source_path: source, profile: "default" }, config);
    expect(result).toMatchObject({ status: "failed", error: { category: "CONFIGURATION", code: "EXECUTOR_NOT_CONFIGURED" } });
  });

  it("refuses a source outside the workspace", async () => {
    const root = await mkdtemp(join(tmpdir(), "hyppo-test-"));
    const outside = await mkdtemp(join(tmpdir(), "hyppo-test-"));
    const source = join(outside, "document.md");
    await writeFile(source, "# Secret");
    const config = configSchema.parse({ workspace_roots: [root], profiles: { default: { executor: "missing" } }, executors: {} });
    const result = await transformMarkdownToPdf({ source_path: source, profile: "default" }, config);
    expect(result).toMatchObject({ status: "refused", error: { code: "PATH_OUTSIDE_WORKSPACE" } });
  });
});
