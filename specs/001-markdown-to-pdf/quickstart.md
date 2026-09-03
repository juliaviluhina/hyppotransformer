# Quickstart: Markdown to PDF Transformation

This guide validates the feature without requiring a real Mac browser for the core test suite.
The optional host-renderer smoke test validates the configured Pandoc/browser profile separately.

## Prerequisites

- Node.js 22 or later
- A checkout of `hyppotransformer`
- Dependencies installed with the repository package manager
- A temporary workspace used only for tests

For host rendering, additionally configure:

- Pandoc
- A supported local browser executable
- Any profile-specific stylesheet or renderer dependencies

## Core validation

From the repository root:

```bash
npm install
npm test
npm run build
```

Expected outcomes:

- Unit tests pass for workspace containment, profile validation, limits, error mapping, cleanup, and output verification.
- Integration tests pass for the MCP tool through Streamable HTTP and stdio.
- Fake-executor tests prove success, failure, timeout, output conflict, and cleanup behavior without invoking host tools.

## Manual MCP scenario

1. Create a temporary allowed workspace containing `document.md`.
2. Configure a profile that uses the deterministic test executor or the local Markdown-to-PDF executor.
3. Start the service through stdio or local HTTP.
4. Call `transform_markdown_to_pdf` with:

```json
{
  "source_path": "/allowed/workspace/document.md",
  "profile": "default"
}
```

5. Confirm the response has `status: created`, an output path inside the allowed workspace, and a
   non-zero verified artifact size.
6. Confirm the source Markdown is unchanged.
7. Repeat the same request and verify the configured output-conflict policy is applied.

## Safety scenarios

Verify that these requests are refused before executor launch:

- A source path outside all configured workspace roots.
- A traversal path containing `..` that resolves outside the workspace.
- A symlink resolving outside the workspace policy.
- An unknown profile.
- An oversized source file.
- A request attempting to provide a shell command or arbitrary executable.
- An output conflict when replacement is disabled.

Verify that a renderer failure or timeout:

- Returns a non-success status and stable error category.
- Does not modify the source.
- Removes managed temporary files where cleanup is possible.
- Does not expose document contents, environment secrets, or authentication tokens.

## Optional host-renderer smoke test

On a machine with the configured tools installed, create a profile using the local Pandoc and
browser executors and run the host smoke test. Verify:

- Markdown is converted to an intermediate representation as configured.
- The browser renderer creates a PDF.
- The PDF is non-empty and reported at the expected path.
- The temporary intermediate file is removed.
- A renderer failure produces a structured failure rather than a false success.

This smoke test is environment-dependent and is not a replacement for the deterministic unit
and integration suite.

## Hermes connection validation

When Hermes runs in Docker and HyppoTransformer runs on the Mac host, configure Hermes to use
the host-reachable MCP URL and the server's authentication settings. Confirm the connection with
a harmless transformation in an allowed test workspace before using a personal repository.

The Hermes client configuration is deployment-specific and belongs in local configuration, not
in the repository's source code or committed test fixtures.
