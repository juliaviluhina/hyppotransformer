import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import type { TransformerConfig } from "../config/schema.js";
import { transformMarkdownToPdf } from "../transforms/markdown-to-pdf.js";

const inputSchema = {
  source_path: z.string().min(1),
  profile: z.string().min(1),
  output_path: z.string().min(1).optional(),
};

function result(payload: unknown, isError = false) {
  return { content: [{ type: "text" as const, text: JSON.stringify(payload, null, 2) }], ...(isError ? { isError: true } : {}) };
}

export function registerTools(server: McpServer, config: TransformerConfig): void {
  server.tool("transform_markdown_to_pdf", "Transform an allowed Markdown document into a PDF using a trusted local profile.", inputSchema, async (input) => {
    const payload = await transformMarkdownToPdf(input, config);
    return result(payload, payload.status !== "created");
  });
}
