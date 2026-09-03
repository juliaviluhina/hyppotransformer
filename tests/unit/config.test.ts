import { describe, expect, it } from "vitest";
import { configSchema } from "../../src/config/schema.js";

describe("configuration", () => {
  it("applies safe defaults", () => {
    const config = configSchema.parse({ workspace_roots: ["/workspace"] });
    expect(config.limits.max_input_bytes).toBe(1024 * 1024);
    expect(config.server.transport).toBe("stdio");
  });

  it("requires at least one workspace root", () => {
    expect(() => configSchema.parse({ workspace_roots: [] })).toThrow();
  });
});
