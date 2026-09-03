import { describe, expect, it } from "vitest";
import { mkdtemp, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { verifyPdf } from "../../src/verification/pdf.js";

describe("PDF verification", () => {
  it("accepts a non-empty output", async () => {
    const dir = await mkdtemp(join(tmpdir(), "hyppo-test-"));
    const path = join(dir, "out.pdf");
    await writeFile(path, "%PDF-1.7\ncontent");
    await expect(verifyPdf(path)).resolves.toMatchObject({ format: "pdf", verified: true });
  });

  it("rejects a non-PDF output", async () => {
    const dir = await mkdtemp(join(tmpdir(), "hyppo-test-"));
    const path = join(dir, "out.pdf");
    await writeFile(path, "not a pdf");
    await expect(verifyPdf(path)).rejects.toMatchObject({ code: "OUTPUT_INVALID" });
  });
});
