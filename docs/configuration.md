# Configuration

Configuration is YAML and is selected by the local AI agent (Hermes, Claude Code,
or another MCP client) or by a direct service launch with:

```bash
HYPPOTRANSFORMER_CONFIG=/absolute/path/to/config.yml npm start
```

## Install rendering tools in advance

HyppoTransformer does not bundle the programs that perform document rendering.
Install them on the machine where HyppoTransformer runs — currently the Mac host,
not inside the AI agent's container.

### Pandoc

With Homebrew:

```bash
brew install pandoc
which pandoc
```

Use the path printed by `which pandoc` in the executor configuration. A common
Apple Silicon path is:

```text
/opt/homebrew/bin/pandoc
```

### Google Chrome

Install Google Chrome for macOS if it is not already installed. The executable is
inside the application bundle. A user-local installation may look like:

```text
/Users/<user>/Applications/Google Chrome.app/Contents/MacOS/Google Chrome
```

The path is installation-specific. Use the actual executable path, not the `.app`
directory.

## Minimal configuration

```yaml
workspace_roots:
  - /absolute/path/to/allowed/workspace

profiles:
  default:
    executor: markdown-to-pdf
    output_policy: beside-source

executors:
  markdown-to-pdf:
    pandoc: /absolute/path/to/pandoc
    browser: /absolute/path/to/chrome

limits:
  max_input_bytes: 1048576
  timeout_ms: 120000

server:
  transport: stdio
```

## Values to adjust

Before starting the service, change these values in the minimal configuration:

1. **`workspace_roots`** — replace the example with the narrowest directory or
   directories the service may read and write. For the shared project workspace,
   this could be:

   ```text
   /Users/<user>/hermes-docker/hermes-data/home/projects
   ```

2. **`executors.markdown-to-pdf.pandoc`** — replace the placeholder with the
   output of `which pandoc`.

3. **`executors.markdown-to-pdf.browser`** — replace the placeholder with the
   actual Google Chrome executable path, for example:

   ```text
   /Users/<user>/Applications/Google Chrome.app/Contents/MacOS/Google Chrome
   ```

4. **`profiles.<name>.executor`** — keep `markdown-to-pdf` only if the matching
   executor exists under `executors`.

5. **`profiles.<name>.output_policy`** — choose deliberately: `beside-source`
   refuses an existing output, `explicit-only` requires an output path in every
   request, and `replace` permits replacement inside the workspace.

6. **`limits`** — adjust input-size and timeout limits only when needed. Keep
   both values bounded.

7. **`server.transport`** — use `stdio` when the AI agent launches the service
   directly. Use `http` when the AI agent connects to a long-lived Mac-side
   service across a container boundary.

8. **HTTP `host`, `port`, and `auth_token_env`** — use a dedicated port and a
   token supplied through an environment variable when crossing the Docker
   boundary. Do not commit the token to YAML.

After editing, start with:

```bash
HYPPOTRANSFORMER_CONFIG="$PWD/config.yml" npm start
```

## Workspace roots

All source, profile-referenced inputs, temporary files, and outputs must resolve
inside a configured workspace root. Do not use `/`, a home directory, or a broad
shared directory as a convenience root.

## Profiles

A profile selects trusted transformation behavior. It may define:

- Executor identifier
- Stylesheet path
- Page-size or presentation values
- Output policy

Profiles are the correct place for repository- or document-specific conventions.
The service source must remain universal.

## Output policies

- `beside-source` — use the source path with the output suffix when no output path is supplied; do not replace an existing output.
- `explicit-only` — require an explicit output path.
- `replace` — permit replacement of an existing output within the workspace.

## HTTP settings

```yaml
server:
  transport: http
  host: 127.0.0.1
  port: 7359
  auth_token_env: HYPPOTRANSFORMER_TOKEN
```

Keep HTTP on loopback unless a container boundary requires another reachable
interface. In that case, use authentication and review the network exposure.
