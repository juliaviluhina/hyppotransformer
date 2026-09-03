# Implementation Plan: Markdown to PDF Transformation

**Branch**: `001-markdown-to-pdf` | **Date**: 2026-09-03 | **Spec**: [spec.md](./spec.md)

**Input**: Feature specification from `/specs/001-markdown-to-pdf/spec.md`

## Summary

Build the first HyppoTransformer vertical slice: a universal local MCP operation named
`transform_markdown_to_pdf`. The operation validates a source document and named profile,
resolves all paths against configured workspace roots, invokes trusted configured renderers,
cleans up temporary files, verifies a non-empty PDF, and returns a structured result. The
service will be a standalone Node.js process with Streamable HTTP and stdio transports. User,
repository, CV, stylesheet, browser-path, and output conventions remain configuration-driven.

## Technical Context

**Language/Version**: TypeScript, Node.js >= 22

**Primary Dependencies**: `@modelcontextprotocol/sdk`, Zod, Node standard-library subprocess and filesystem APIs; Pandoc and a configured browser are host executors rather than bundled dependencies

**Storage**: Configuration file and generated local artifacts; no database and no hidden persistent service state

**Testing**: Vitest unit tests; transport integration tests; deterministic fake-executor tests; optional host-tool smoke test for the configured Pandoc/browser profile

**Target Platform**: Local macOS host initially, with Linux/Windows development compatibility where configured executors exist; Hermes Docker connects to the host over local HTTP

**Project Type**: Standalone local service / MCP server

**Performance Goals**: Return validation and policy refusals before executor launch; complete ordinary transformations within the configured timeout; do not impose a fixed universal rendering-time promise because profiles and documents vary

**Constraints**: Workspace allowlisting, no arbitrary command execution, no source mutation, bounded input and execution limits, no external uploads, no secret disclosure, deterministic cleanup, transport-independent semantics

**Scale/Scope**: One service process, one public transformation tool, one initial Markdown-to-PDF pipeline, named profiles, and a small set of trusted executors

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

| Principle | Assessment |
|---|---|
| **I — Universal Mechanism, Configurable Profiles** | PASS. The tool selects named profiles; user, repository, stylesheet, browser, and output conventions are configuration values rather than code assumptions. |
| **II — Explicit Workspace Boundaries** | PASS. Every path is resolved against configured workspace roots before reads, writes, temporary-file creation, or executor launch. |
| **III — No Arbitrary Command Execution** | PASS. Requests select trusted executors and profiles; no shell command, executable path, or unrestricted argument list is accepted from MCP input. |
| **IV — Small, Auditable MCP Surface** | PASS. The first release exposes only `transform_markdown_to_pdf`; future tools require separate justification. |
| **V — Deterministic and Idempotent Transformations** | PASS. Source files are read-only, output policy is explicit, temporary files are owned and cleaned up, and conflict behavior is defined before writing. |
| **VI — Test-First Quality and Contract Fidelity** | PASS. Unit tests cover pure policy and result logic; integration tests cover real MCP transport and executor boundaries. |
| **VII — Observable Local Execution** | PASS. Results use stable categories and structured metadata; diagnostics are separated from protocol output and sensitive contents are excluded. |
| **VIII — Local-First and Human-Reviewable** | PASS. No upload, publication, email, application submission, or other external action is included. |

**Gate result**: PASS. No constitution violations or complexity exceptions are required.

## Project Structure

### Documentation (this feature)

```text
specs/001-markdown-to-pdf/
├── plan.md
├── research.md
├── data-model.md
├── quickstart.md
├── contracts/
│   └── transform-markdown-to-pdf.md
└── tasks.md                 # created by /speckit-tasks, not by this plan
```

### Source Code (repository root)

```text
src/
├── config/
│   ├── schema.ts             # configuration schema and defaults
│   └── load.ts               # trusted configuration loading
├── executors/
│   ├── types.ts              # executor interface and process result types
│   ├── process.ts             # bounded, non-shell subprocess execution
│   └── markdown-to-pdf.ts     # Pandoc/browser pipeline adapter
├── mcp/
│   ├── server.ts              # transport-independent MCP server factory
│   ├── transports.ts          # stdio and Streamable HTTP startup
│   └── tools.ts               # transform_markdown_to_pdf registration
├── safety/
│   ├── paths.ts               # workspace containment and symlink policy
│   ├── limits.ts              # input and execution limits
│   └── errors.ts              # stable error categories and serialization
├── transforms/
│   └── markdown-to-pdf.ts     # profile resolution and transformation orchestration
├── verification/
│   └── pdf.ts                 # non-empty output and basic artifact checks
└── main.ts                    # configuration, transport, and lifecycle entry point

tests/
├── unit/
│   ├── config.test.ts
│   ├── paths.test.ts
│   ├── limits.test.ts
│   ├── errors.test.ts
│   ├── markdown-to-pdf.test.ts
│   └── pdf.test.ts
├── integration/
│   ├── mcp-http.test.ts
│   ├── mcp-stdio.test.ts
│   └── transform-with-fake-executor.test.ts
└── smoke/
    └── host-renderer.test.ts  # optional; requires configured host tools
```

**Structure Decision**: Use a single standalone TypeScript service with clear modules for
configuration, safety, executors, transformation orchestration, verification, MCP tools, and
transports. Keep the first pipeline-specific adapter separate from generic process and policy
code so future transformations can reuse the service without introducing CV-specific logic.

## Phase 0: Research Summary

Research decisions are recorded in [research.md](./research.md). The design uses the proven
HyppoVisor MCP transport pattern while removing the Electron/browser-session layer. The initial
operation remains one generic Markdown-to-PDF transformation backed by trusted configurable
profiles and executors.

## Phase 1: Design Summary

- [data-model.md](./data-model.md) defines the configuration, request, artifact, and result entities.
- [contracts/transform-markdown-to-pdf.md](./contracts/transform-markdown-to-pdf.md) defines the MCP tool contract and stable error categories.
- [quickstart.md](./quickstart.md) defines deterministic validation with a fake executor and optional host-renderer verification.

## Post-Design Constitution Re-check

| Principle | Post-design result |
|---|---|
| Configurable universal mechanism | PASS — the planned modules contain no personal repository or CV assumptions. |
| Workspace boundaries | PASS — path policy is a prerequisite to executor invocation and output creation. |
| No arbitrary commands | PASS — executor selection is configuration-owned and requests cannot supply executable commands. |
| Small MCP surface | PASS — one tool is planned; verification remains internal initially. |
| Determinism and idempotence | PASS — source is immutable, conflict policy is explicit, and cleanup is part of every execution path. |
| Test-first quality | PASS — policy, transport, fake executor, and optional host smoke layers are specified. |
| Observability | PASS — stable structured results and stderr-separated diagnostics are part of the contract. |
| Local-first reviewability | PASS — no external side effects are planned. |

**Final gate result**: PASS. No complexity tracking exceptions.

## Complexity Tracking

No Constitution violations — table intentionally empty.
