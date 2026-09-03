import { describe, expect, it } from "vitest";
import { mkdtemp, symlink, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { withinWorkspace } from "../../src/safety/paths.js";

const temp = () => mkdtemp(join(tmpdir(), "hyppo-test-"));

describe("workspace policy", () => {
  it("allows a path inside a configured root", async () => {
    const root = await temp();
    const file = join(root, "document.md");
    await writeFile(file, "# Hello");
    await expect(withinWorkspace(file, [root])).resolves.toBe(file);
  });

  it("rejects a path outside configured roots", async () => {
    const root = await temp();
    const outside = await temp();
    await expect(withinWorkspace(join(outside, "document.md"), [root])).rejects.toMatchObject({ code: "PATH_OUTSIDE_WORKSPACE" });
  });

  it("rejects a symlink that resolves outside the workspace", async () => {
    const root = await temp();
    const outside = await temp();
    const target = join(outside, "secret.md");
    const link = join(root, "link.md");
    await writeFile(target, "secret");
    await symlink(target, link);
    await expect(withinWorkspace(link, [root])).rejects.toMatchObject({ code: "PATH_OUTSIDE_WORKSPACE" });
  });
});
