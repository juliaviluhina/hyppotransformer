import { describe, expect, it } from "vitest";
import { join } from "node:path";
import { buildPandocArgs, toLocalFileUrl } from "../../src/executors/markdown-to-pdf.js";

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
  it("converts local paths to file URLs", () => {
    expect(toLocalFileUrl("/workspace/docs/read me.html")).toBe("file:///workspace/docs/read%20me.html");
    expect(toLocalFileUrl("C:\\workspace\\docs\\read me.html")).toMatch(/^file:\/\//);
  });
});
