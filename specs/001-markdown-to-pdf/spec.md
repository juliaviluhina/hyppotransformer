# Feature Specification: Markdown to PDF Transformation

**Feature Branch**: `001-markdown-to-pdf`

**Created**: 2026-09-03

**Status**: Draft

**Input**: User description: "Create the first HyppoTransformer vertical slice: a universal transform_markdown_to_pdf MCP tool that runs locally, uses configured executors and profiles, enforces workspace boundaries, and supports Hermes HTTP and stdio support. Do not implement code yet."

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Transform an allowed Markdown document (Priority: P1)

A user asks an authorized local assistant to transform a Markdown document into a PDF. The document is inside a configured workspace, and the service creates the requested artifact without changing the source document.

**Why this priority**: This is the core value of HyppoTransformer and the smallest useful end-to-end capability.

**Independent Test**: Provide a valid Markdown document in an allowed workspace, request a PDF transformation, and verify that a usable PDF is created while the Markdown source remains unchanged.

**Acceptance Scenarios**:

1. **Given** a valid Markdown document inside an allowed workspace and a valid transformation profile, **When** the user requests a PDF transformation, **Then** the service creates a PDF at the permitted output location and returns its location and completion status.
2. **Given** a valid Markdown document, **When** the transformation completes, **Then** the source document is byte-for-byte unchanged.
3. **Given** a request with no explicit output location, **When** the profile defines an output naming rule, **Then** the service uses that rule and reports the resulting location.

---

### User Story 2 - Use a configured transformation profile (Priority: P2)

A user selects a named profile that describes document presentation and output expectations without embedding personal repository conventions in the transformation service.

**Why this priority**: Profiles allow the same universal service to support CVs, reports, notes, and other documents without hard-coded user-specific behavior.

**Independent Test**: Define two valid profiles with different presentation settings, transform the same source using each profile, and verify that each result follows its selected profile.

**Acceptance Scenarios**:

1. **Given** a named profile that exists in trusted configuration, **When** the user requests a transformation with that profile, **Then** the service applies that profile and identifies it in the result metadata.
2. **Given** a profile name that does not exist, **When** the user requests a transformation, **Then** the service refuses the request before creating an output artifact and reports a clear configuration error.
3. **Given** a profile referring to an unavailable trusted rendering dependency, **When** the user requests a transformation, **Then** the service reports the unavailable dependency without modifying the source document.

---

### User Story 3 - Receive safe, actionable failure results (Priority: P2)

A user receives a clear result when a transformation cannot be completed, including whether an output was created and what corrective action is appropriate.

**Why this priority**: Local document transformations involve files and external rendering programs; silent or ambiguous failure would make the service unsafe to use in automated workflows.

**Independent Test**: Submit invalid paths, disallowed paths, oversized input, and simulated rendering failures, then verify that each request is refused or fails with a stable category and no unsafe side effect.

**Acceptance Scenarios**:

1. **Given** a source path outside all configured workspace roots, **When** the user requests a transformation, **Then** the service refuses the request and does not read or write the path.
2. **Given** a source path that attempts to escape an allowed workspace, **When** the user requests a transformation, **Then** the service refuses the request before invoking a renderer.
3. **Given** a renderer failure or timeout, **When** the transformation ends, **Then** the service reports the failure category, cleans up managed temporary files, and does not report success.
4. **Given** an output path that conflicts with an existing file and the selected policy does not permit replacement, **When** the user requests a transformation, **Then** the service refuses the request without changing the existing file.
5. **Given** an invalid request, **When** the service responds, **Then** it does not disclose credentials, secrets, or unrelated file contents.

---

### User Story 4 - Invoke the same capability through supported local transports (Priority: P3)

A local assistant can use the transformation capability through either of the supported local connection modes without changing the transformation’s behavior or safety rules.

**Why this priority**: Hermes may connect through HTTP from Docker, while local tooling may use a process connection. Both should expose one consistent contract.

**Independent Test**: Invoke the same valid and invalid transformation cases through each supported local transport and compare the results and policy behavior.

**Acceptance Scenarios**:

1. **Given** a correctly configured local HTTP connection, **When** an authorized assistant requests a transformation, **Then** the service returns the same transformation result as the process connection.
2. **Given** a correctly configured process connection, **When** an authorized assistant requests a transformation, **Then** the service applies the same workspace and executor policies.
3. **Given** an unauthorized HTTP request, **When** it reaches the service, **Then** the request is rejected before document access or transformation begins.

### Edge Cases

- The source Markdown file does not exist, is unreadable, or is empty.
- The source path is a directory rather than a file.
- The source or stylesheet is a symlink that resolves outside an allowed workspace.
- The source file exceeds the configured input-size limit.
- The configured profile or executable path is missing, invalid, or no longer available.
- The renderer exits successfully but does not create a valid output file.
- The renderer creates an incomplete or zero-byte output.
- The requested output already exists and the profile forbids replacement.
- A temporary file remains after an interrupted process.
- The service receives concurrent requests that target the same output path.
- A transformation takes longer than the configured timeout.
- A request contains shell metacharacters or unsupported arguments in fields that are expected to be data values.
- The service is stopped during a transformation.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: The service MUST provide one named operation that transforms an allowed Markdown source document into a PDF artifact.
- **FR-002**: The service MUST accept a source document and a named transformation profile as validated input.
- **FR-003**: The service MUST preserve the source document and MUST NOT silently modify it.
- **FR-004**: The service MUST restrict source, configuration-referenced inputs, temporary files, and outputs to configured workspace policies.
- **FR-005**: The service MUST reject paths that resolve outside configured workspace roots, including traversal and disallowed symlink escapes.
- **FR-006**: The service MUST resolve rendering behavior through trusted configuration and MUST NOT accept an arbitrary shell command or unrestricted executable invocation from a request.
- **FR-007**: The service MUST enforce configured input-size and execution-time limits.
- **FR-008**: The service MUST define and enforce an explicit output-conflict policy before writing an artifact.
- **FR-009**: The service MUST clean up temporary files that it created after success, failure, timeout, or cancellation where cleanup is possible.
- **FR-010**: The service MUST verify that a reported successful transformation produced a non-empty PDF artifact at the expected location.
- **FR-011**: The service MUST return a structured result containing status, source identity, output identity when available, selected profile, and actionable warnings or errors.
- **FR-012**: The service MUST distinguish at least validation, policy refusal, configuration, executor, timeout, and output-verification failures in its result.
- **FR-013**: The service MUST avoid including source contents, credentials, authentication tokens, or unrelated file contents in normal logs and error responses.
- **FR-014**: The service MUST expose the same operation semantics and safety rules through each supported local transport.
- **FR-015**: The HTTP transport MUST support authentication and MUST reject unauthorized requests before document access.
- **FR-016**: The service MUST keep transformation behavior independent of any particular user, repository, document purpose, operating-system username, or personal directory layout.
- **FR-017**: The service MUST NOT upload documents, publish artifacts, send messages, submit forms, or perform other external actions as part of this feature.
- **FR-018**: The service MUST provide diagnostics through a channel that cannot corrupt the process-based protocol.
- **FR-019**: Repeating the same transformation with unchanged inputs and configuration MUST be safe and MUST NOT accumulate hidden state or unmanaged temporary files.
- **FR-020**: The service MUST document the configuration needed to connect a local assistant, including the workspace, profile, renderer, limits, and transport settings.

### Key Entities

- **Source Document**: A Markdown file selected for transformation; identified by its validated path and input metadata.
- **Transformation Profile**: A named, trusted set of presentation, output, executor, and verification settings.
- **Artifact**: The generated PDF file and its reported metadata, including path, size, and completion status.
- **Workspace Policy**: The configured rules defining allowed roots, path resolution, file limits, and output locations.
- **Execution Result**: A structured success, warning, or failure response describing what happened without exposing sensitive content.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: A valid document in an allowed workspace produces a usable PDF artifact in at least 95% of attempts when all configured rendering dependencies are available.
- **SC-002**: A normal transformation returns a clear success or failure result within the configured execution timeout, with no unmanaged temporary files remaining after completion.
- **SC-003**: 100% of tested path-traversal, out-of-workspace, unauthorized-transport, and arbitrary-command requests are rejected before document transformation begins.
- **SC-004**: 100% of successful responses correspond to an existing, non-empty PDF artifact at the reported output location.
- **SC-005**: The source Markdown remains unchanged in 100% of successful and failed transformation tests.
- **SC-006**: A user can configure a new workspace and presentation profile without changing the transformation service source code.
- **SC-007**: The same valid and invalid request cases produce equivalent policy outcomes through HTTP and process-based local connections.
- **SC-008**: A reviewer can identify the selected profile, output path, warnings, and failure category from a single structured result without reading service internals.

## Assumptions

- Users have already installed and configured the trusted document-rendering dependencies required by their selected profiles.
- The first supported source format is Markdown and the first generated artifact format is PDF.
- The first release operates on local files and does not upload documents to external services.
- A named profile is selected from trusted local configuration rather than created with arbitrary executable instructions in a request.
- The default output policy writes beside the source document or to another location explicitly allowed by workspace configuration.
- The first release supports one transformation request at a time per service process unless a later specification establishes safe concurrency behavior.
- Visual quality expectations such as page count, page size, typography, and stylesheet selection belong to profiles, not universal transformation logic.
- Hermes and other local assistants are responsible for deciding what documents to transform and how to interpret the resulting artifact.
- Human users review artifacts before using them outside the local workspace.
