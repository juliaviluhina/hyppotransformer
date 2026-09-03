# Connect an agent

HyppoTransformer can be used by a local AI agent (Hermes, Claude Code, or
another MCP client) over stdio or through a host-reachable HTTP endpoint.

## stdio

Build the service first:

```bash
npm run build
```

Example MCP configuration:

```json
{
  "mcpServers": {
    "hyppotransformer": {
      "command": "node",
      "args": ["/absolute/path/to/hyppotransformer/dist/main.js"],
      "env": {
        "HYPPOTRANSFORMER_CONFIG": "/absolute/path/to/config.yml"
      }
    }
  }
}
```

## HTTP

Set `server.transport` to `http`, start the service, and use:

```text
http://127.0.0.1:7359/mcp
```

For Hermes running inside Docker while the service runs on the Mac host, the
host-reachable address is commonly:

```text
http://host.docker.internal:7359/mcp
```

Example Hermes-side configuration:

```yaml
mcp_servers:
  hyppotransformer:
    url: "http://host.docker.internal:7359/mcp"
    timeout: 180
    connect_timeout: 10
```

If a bearer token is configured, pass it through a local secret mechanism rather
than committing it:

```yaml
mcp_servers:
  hyppotransformer:
    url: "http://host.docker.internal:7359/mcp"
    headers:
      Authorization: "Bearer <local-token>"
```

## Verify the connection

The server should report:

```text
server name: hyppotransformer
```

The available tool should be:

```text
transform_markdown_to_pdf
```
