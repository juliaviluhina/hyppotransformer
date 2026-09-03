import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { StreamableHTTPServerTransport } from "@modelcontextprotocol/sdk/server/streamableHttp.js";
import { createServer } from "node:http";
import { webcrypto } from "node:crypto";
import type { TransformerConfig } from "../config/schema.js";
import { registerTools } from "./tools.js";

// Some supported Node runtimes do not expose Web Crypto as a global by default,
// while the MCP Streamable HTTP transport expects `crypto` to exist globally.
if (!globalThis.crypto) Object.defineProperty(globalThis, "crypto", { value: webcrypto });

export function createMcpServer(config: TransformerConfig): McpServer {
  const server = new McpServer({ name: "hyppotransformer", version: "0.1.0" });
  registerTools(server, config);
  return server;
}

export async function startStdio(config: TransformerConfig): Promise<void> {
  const server = createMcpServer(config);
  await server.connect(new StdioServerTransport());
  console.error("[hyppotransformer] MCP server connected on stdio");
}

export async function startHttp(config: TransformerConfig): Promise<void> {
  const token = config.server.auth_token_env ? process.env[config.server.auth_token_env] : undefined;
  const http = createServer(async (req, res) => {
    if (new URL(req.url ?? "/", "http://localhost").pathname !== "/mcp") { res.writeHead(404).end(); return; }
    if (token && req.headers.authorization !== `Bearer ${token}`) { res.writeHead(401).end("unauthorized"); return; }
    const server = createMcpServer(config);
    const transport = new StreamableHTTPServerTransport({ sessionIdGenerator: undefined });
    res.on("close", () => { void transport.close().catch(() => undefined); void server.close().catch(() => undefined); });
    await server.connect(transport);
    await transport.handleRequest(req, res);
  });
  await new Promise<void>((resolve, reject) => { http.once("error", reject); http.listen(config.server.port, config.server.host, resolve); });
  console.error(`[hyppotransformer] MCP HTTP server on http://${config.server.host}:${config.server.port}/mcp`);
}
