# Install & run

## Requirements

- Node.js 22 or later
- npm
- Local rendering tools required by the selected profile, such as Pandoc and a browser

## Install from source

```bash
npm install
npm run build
```

Run with the example configuration after creating a local copy:

```bash
cp config.example.yml config.yml
HYPPOTRANSFORMER_CONFIG="$PWD/config.yml" npm start
```

`config.yml` is machine-specific and should not be committed when it contains
local paths or secrets.

## Run modes

The service supports two local MCP transports:

- **stdio** — the MCP client owns the process and no listening port is opened.
- **HTTP** — a long-lived local service exposes `/mcp`; see
  [Connect an agent](connect-an-agent.md).

The default configuration uses stdio. The HTTP listener defaults to loopback
when enabled.

## Host tools

HyppoTransformer does not bundle Pandoc or a browser renderer. Install them on
the machine where the service runs and reference their absolute paths from
trusted configuration. The service reports missing tools as configuration or
executor failures rather than silently falling back.
