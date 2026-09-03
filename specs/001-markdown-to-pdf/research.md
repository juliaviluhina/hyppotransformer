# Research: Markdown to PDF Transformation

## Decision 1: Use a standalone local Node service with the official MCP SDK

- **Decision**: Implement HyppoTransformer as a standalone local Node.js service. Use the official Model Context Protocol SDK and support Streamable HTTP plus stdio transports.
- **Rationale**: HyppoVisor already proves the MCP transport pattern in TypeScript, while HyppoTransformer has no need for Electron, embedded browser tabs, or a renderer process. A standalone process is easier to run on the Mac and easier to connect from Hermes in Docker.
- **Alternatives considered**:
  - Electron application: rejected because document transformation does not need a browser UI or embedded sessions.
  - REST-only service: rejected because the target clients already use MCP and need tool discovery and structured tool calls.
  - HTTP-only service: rejected because stdio is useful for direct local clients and tests.

## Decision 2: Keep the first public surface to one transformation tool

- **Decision**: Expose `transform_markdown_to_pdf` first. Keep artifact verification internal to the success decision; defer a separate `verify_artifact` tool until a demonstrated use case exists.
- **Rationale**: A small public surface is easier to secure, test, document, and keep consistent across transports. It also prevents premature expansion into a generic command runner.
- **Alternatives considered**:
  - Expose rendering, verification, text extraction, and preview tools immediately: rejected as unnecessary scope for the first vertical slice.
  - Expose a generic `transform_document` tool immediately: rejected because the first contract can be precise without losing future extensibility.

## Decision 3: Use named trusted profiles and configured executors

- **Decision**: Requests select a named profile. Profiles and executor definitions come from trusted local configuration. Requests may select a profile and provide data paths, but may not provide arbitrary commands, executable paths, shell fragments, or unrestricted subprocess arguments.
- **Rationale**: This keeps Julia-specific paths, styles, browser locations, and document conventions out of universal code while preserving a controlled execution boundary.
- **Alternatives considered**:
  - Hard-code the current Markdown-to-PDF command: rejected because it would encode one user's machine and workflow.
  - Accept arbitrary command input from MCP: rejected because it would turn the service into an indirect shell executor.
  - Embed every profile in source code: rejected because profiles are configuration and should be changeable without rebuilding the service.

## Decision 4: Resolve and enforce workspace policy before execution

- **Decision**: Resolve every source, profile-referenced input, temporary, and output path against configured workspace roots before starting an executor. Reject traversal and symlink escapes according to the workspace policy.
- **Rationale**: The MCP endpoint is a local file-operation boundary. Policy must be checked before any document read or subprocess launch.
- **Alternatives considered**:
  - Trust callers to send safe paths: rejected because MCP callers and prompts are not a filesystem security boundary.
  - Allow any absolute path: rejected because the service must not expose unrelated personal files.

## Decision 5: Use controlled subprocess execution with staged cleanup

- **Decision**: Invoke configured executors without a shell, with bounded timeouts, a controlled environment, captured diagnostics, and a cleanup path for temporary files. Only report success after verifying a non-empty PDF exists.
- **Rationale**: Pandoc and a browser renderer are external local dependencies. Their failures need to be represented as safe structured results rather than leaking protocol output or leaving stale artifacts.
- **Alternatives considered**:
  - Shelling out through a single command string: rejected because quoting and injection risks are unnecessary.
  - Keep all temporary files for debugging: rejected because it creates hidden state and may retain sensitive document data.
  - Treat process exit code zero as sufficient: rejected because a renderer can exit successfully without producing the expected artifact.

## Decision 6: Keep document semantics outside the transformer

- **Decision**: HyppoTransformer performs mechanical transformation and basic artifact checks. Hermes, Claude, or another caller chooses content, profile, and whether the result is suitable for use.
- **Rationale**: This preserves the boundary between universal transformation and user/workflow-specific judgment.
- **Alternatives considered**:
  - Add CV validation, page-fitting decisions, or content rewriting: rejected because those are caller responsibilities and would make the service domain-specific.

## Decision 7: Test pure policy separately from real transport and executors

- **Decision**: Use unit tests for path policy, profile validation, result mapping, and cleanup decisions; integration tests for the real MCP transport and a deterministic fake executor; add an optional host-tool smoke test for Pandoc/browser rendering.
- **Rationale**: Most safety and contract behavior can be tested without Mac GUI dependencies. The real transport still needs wire-level coverage, and the actual renderer needs a separate environment-dependent check.
- **Alternatives considered**:
  - Test only with the real Chrome/Pandoc toolchain: rejected because it would be slow and unavailable in many CI environments.
  - Test only pure functions: rejected because MCP framing, authentication, and subprocess boundaries also need proof.
