import { describe, expect, it } from "vitest";
import { join } from "node:path";
import { buildPandocArgs } from "../../src/executors/markdown-to-pdf.js";

describe("Markdown renderer resource handling", () => {
  it("resolves and embeds resources relative to the source document", () => {
    const source = "/workspace/docs/readme.md";
    const html = "/tmp/hyppotransformer/readme.html";
    const args = buildPandocArgs(source, html, {});
    expect(args).toEqual(expect.arrayContaining([
      source,
      "-o",
      html,
      "--standalone",
      `--resource-path=${join("/workspace/docs")}`,
      "--embed-resources",
    ]));
  });
});
