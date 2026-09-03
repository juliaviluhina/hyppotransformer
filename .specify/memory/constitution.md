<!--
Sync Impact Report
- Version change: template → 1.0.0 (initial ratification)
- Modified principles: none; replaced the generated placeholder constitution with the
  HyppoTransformer governing principles
- Added sections: Technical and Operational Constraints; Development Workflow; Governance
- Removed sections: generated placeholder sections
- Deferred items: none
-->

# HyppoTransformer Constitution

HyppoTransformer is a local-first artifact transformation service in the Hyppo family. It exposes narrowly scoped transformations through the Model Context Protocol (MCP), while keeping workspace access, executors, rendering tools, and transformation profiles explicitly configurable.

## Core Principles

### I. Universal Mechanism, Configurable Profiles

HyppoTransformer MUST implement reusable transformation mechanisms rather than personal, repository-specific, or document-type-specific business logic. User, repository, CV, Obsidian, and workflow conventions MUST be expressed through configuration or caller-provided profiles, never through hard-coded assumptions in the service.

The implementation MUST NOT assume a particular username, repository name, directory layout, stylesheet, browser installation path, document purpose, or operating system. A profile MAY select trusted stylesheets, page settings, output rules, and verification expectations, but the transformation engine remains generic.

### II. Explicit Workspace Boundaries

Every filesystem operation MUST be constrained to one or more configured workspace roots. The service MUST resolve paths before use and reject traversal, symlink escapes where applicable, and paths outside the configured roots.

The service MUST NOT read credentials, SSH keys, unrelated personal files, or arbitrary host paths. Generated artifacts and temporary files MUST remain within approved locations unless an explicit, safe output policy says otherwise.

### III. No Arbitrary Command Execution

MCP callers MUST invoke named transformation operations, not arbitrary shell commands. HyppoTransformer MAY execute configured external programs such as Pandoc or a browser renderer, but only through fixed executor implementations selected by trusted configuration.

User-supplied arguments MUST be validated against an explicit schema. The service MUST NOT accept a shell command, shell fragment, executable path, or unrestricted argument list from an MCP request.

### IV. Small, Auditable MCP Surface

The public MCP tool surface MUST remain intentionally small. The first release exposes one transformation tool:

```text
transform_markdown_to_pdf
```

Additional tools such as `verify_artifact`, `extract_document_text`, or `render_document_preview` require a demonstrated use case, documented contract, tests, and a review of their security and complexity impact.

The same tool contract MUST work independently of transport. Streamable HTTP and stdio are transports, not separate implementations of business behavior.

### V. Deterministic and Idempotent Transformations

A transformation MUST produce predictable results from its declared inputs, profile, and executor configuration. Repeating a request MUST NOT corrupt source files, accumulate hidden state, or leave unmanaged temporary files.

Source documents MUST NOT be silently modified by a transformation. Output naming, overwrite behavior, temporary-file handling, and failure cleanup MUST be explicit and documented. Partial or failed outputs MUST be reported clearly.

### VI. Test-First Quality and Contract Fidelity

Every transformation and safety boundary MUST have automated tests before implementation is considered complete. Tests MUST cover valid inputs, invalid inputs, path escapes, missing executors, subprocess failures, timeouts, cleanup, overwrite behavior, and structured MCP responses.

MCP integration tests MUST exercise the real transport boundary. Unit tests SHOULD cover pure path, configuration, validation, and result-building logic without requiring the host rendering toolchain.

### VII. Observable Local Execution

Every operation MUST return structured, machine-readable results and actionable errors. Diagnostics MUST be separated from protocol output. Execution stages, selected profile, output path, warnings, and failure reasons MUST be inspectable without exposing secrets or unrelated file contents.

The service MAY log operational metadata, but MUST NOT log sensitive document contents by default. Error codes SHOULD be stable enough for clients and tests to distinguish validation, policy, executor, timeout, and output failures.

### VIII. Local-First and Human-Reviewable

HyppoTransformer is a local service. It MUST NOT upload source documents or generated artifacts to third-party services unless a separately designed and explicitly approved feature changes this constitution.

Transformation is preparation, not external publication. The service MUST NOT send email, submit applications, upload files to websites, or perform other outward actions. A human remains responsible for reviewing and approving artifacts for external use.

## Technical and Operational Constraints

- The primary implementation language is TypeScript running on Node.js 22 or later.
- The MCP implementation uses the official `@modelcontextprotocol/sdk`.
- Tool inputs are validated with Zod or an equivalent explicit schema layer.
- The initial transports are Streamable HTTP and stdio.
- HTTP MUST bind to a deliberately configured interface; loopback is the default for local use.
- If HTTP is reachable from a container or another local boundary, authentication and network exposure MUST be documented and tested.
- External executors MUST have bounded timeouts and controlled subprocess environments.
- Configuration MUST support workspace roots, profiles, stylesheet paths, executable locations, output policies, input limits, and timeouts.
- Personal configuration and credentials MUST NOT be committed to the repository.
- The project is licensed under Apache-2.0, consistent with the Hyppo family unless explicitly changed by a documented decision.

## Development Workflow

Development follows GitHub Spec Kit's Spec-Driven Development process:

```text
/speckit-constitution
/speckit-specify
/speckit-clarify
/speckit-plan
/speckit-checklist
/speckit-tasks
/speckit-analyze
/speckit-implement
/speckit-converge
```

For small, well-understood changes, the quality-gate steps MAY be omitted with the reason recorded in the feature plan. Any implementation plan MUST include a Constitution Check. A feature is not complete until its tests pass and `/speckit-converge` finds no unaddressed requirements or appends the remaining work as tasks.

Feature artifacts live under numbered directories in `specs/`. The repository MUST keep the specification, plan, tasks, contracts, and verification evidence aligned with the implementation.

## Governance

This constitution is the highest-level project guidance. When a specification, implementation plan, dependency, or convenience conflicts with it, the conflict MUST be resolved in favor of this document or handled as an explicit amendment before implementation.

Amendments require:

1. A written rationale and impact assessment.
2. A review of affected specifications, templates, tests, and documentation.
3. A semantic version update.
4. An entry in the amendment history.
5. Revalidation through the relevant Spec Kit quality gates.

Complexity is not free. New daemons, databases, remote services, unrestricted plugins, persistent hidden state, or broader filesystem access require explicit justification in the feature plan and review against Principles II, III, and VIII.

**Version**: 1.0.0 | **Ratified**: 2026-09-03 | **Last Amended**: 2026-09-03
