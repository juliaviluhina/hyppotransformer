import { describe, expect, it } from "vitest";
import { readFile, stat } from "node:fs/promises";
import { join } from "node:path";
import { configSchema } from "../../src/config/schema.js";
import { transformMarkdownToPdf } from "../../src/transforms/markdown-to-pdf.js";

const root = join(process.cwd(), "tests/fixtures");
const config = configSchema.parse({
  workspace_roots: [root],
  profiles: { fixture: { executor: "fixture", output_policy: "replace" } },
  executors: {
    fixture: {
      pandoc: join(root, "fake-pandoc.mjs"),
      browser: join(root, "fake-browser.mjs"),
    },
  },
  limits: { max_input_bytes: 1048576, timeout_ms: 5000 },
});

describe("transform_markdown_to_pdf integration", () => {
  it("creates and verifies a PDF without changing the source", async () => {
    const source = join(root, "document.md");
    const output = join(root, "integration-output.pdf");
    const before = await readFile(source);
    const result = await transformMarkdownToPdf(
      { source_path: source, profile: "fixture", output_path: output },
      config,
    );
    expect(result).toMatchObject({
      status: "created",
      profile: "fixture",
      artifact: { format: "pdf", verified: true },
    });
    expect((await stat(output)).size).toBeGreaterThan(0);
    expect(await readFile(source)).toEqual(before);
  });
});
