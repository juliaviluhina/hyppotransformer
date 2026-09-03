---

description: "Task list for the first HyppoTransformer Markdown-to-PDF feature"
---

# Tasks: Markdown to PDF Transformation

**Input**: Design documents from `/specs/001-markdown-to-pdf/`

**Prerequisites**: plan.md, spec.md, research.md, data-model.md, contracts/, quickstart.md

**Organization**: Tasks are grouped by user story. Tests are included because the constitution
requires test-first quality and the feature specification explicitly defines test coverage.

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Establish the standalone TypeScript service and its development quality gates.

- [ ] T001 Initialize the Node.js project metadata and scripts in `package.json` with Node >= 22, TypeScript, MCP SDK, Zod, Vitest, lint, format, build, and test commands.
- [ ] T002 [P] Create TypeScript compiler configuration in `tsconfig.json` for the standalone ESM service.
- [ ] T003 [P] Create Vitest configuration in `vitest.config.ts` for unit and integration test discovery.
- [ ] T004 [P] Create ESLint and Prettier configuration files `.eslintrc` and `.prettierrc` consistent with the repository's TypeScript conventions.
- [ ] T005 [P] Create repository-level development guidance in `AGENTS.md`, including the Spec Kit workflow, HyppoTransformer boundaries, and test commands.
- [ ] T006 [P] Create the Apache-2.0 `LICENSE` and `NOTICE` files consistent with the Hyppo family.
- [ ] T007 Create a safe local configuration example in `config.example.yml` without personal paths, credentials, or machine-specific executable locations.

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Implement the shared policy, configuration, error, executor, and MCP foundations required by every user story.

**CRITICAL**: No user story implementation can begin until this phase is complete.

- [ ] T008 [P] Define configuration types and validation schema in `src/config/schema.ts`, covering workspace roots, profiles, executors, output policy, limits, server settings, and authentication configuration.
- [ ] T009 [P] Implement trusted configuration loading and defaults in `src/config/load.ts`, including safe handling of missing or invalid configuration.
- [ ] T010 [P] Write path-containment and symlink-policy tests in `tests/unit/paths.test.ts` covering allowed roots, traversal, symlink escapes, and output containment.
- [ ] T011 Implement workspace path resolution and policy enforcement in `src/safety/paths.ts`.
- [ ] T012 [P] Write configuration and limit tests in `tests/unit/config.test.ts` and `tests/unit/limits.test.ts` for valid profiles, invalid profiles, missing executors, input limits, and timeouts.
- [ ] T013 [P] Implement input and execution limit validation in `src/safety/limits.ts`.
- [ ] T014 [P] Define stable error categories, codes, safe messages, and result serialization in `src/safety/errors.ts`.
- [ ] T015 [P] Define executor interfaces and bounded process result types in `src/executors/types.ts`.
- [ ] T016 Implement non-shell subprocess execution with controlled environment, timeout, cancellation handling, bounded diagnostics, and cleanup hooks in `src/executors/process.ts`.
- [ ] T017 [P] Write executor failure, timeout, and diagnostic-boundary tests in `tests/unit/process-executor.test.ts`.
- [ ] T018 [P] Define generic artifact metadata and verification result types in `src/verification/types.ts`.
- [ ] T019 Implement non-empty PDF output verification in `src/verification/pdf.ts`.
- [ ] T020 [P] Write artifact verification tests in `tests/unit/pdf.test.ts` for missing, empty, invalid, and valid output files.
- [ ] T021 [P] Create the transport-independent MCP server factory in `src/mcp/server.ts`.
- [ ] T022 [P] Implement stdio and Streamable HTTP startup, endpoint routing, authentication, and protocol-safe diagnostics in `src/mcp/transports.ts`.
- [ ] T023 [P] Write MCP transport handshake, unauthorized-request, and protocol-result tests in `tests/integration/mcp-http.test.ts` and `tests/integration/mcp-stdio.test.ts`.
- [ ] T024 Create the service lifecycle entry point in `src/main.ts`, loading configuration and selecting the configured transport without adding hidden background state.

**Checkpoint**: Configuration, safety policy, executor boundary, verification, and MCP transports are ready for story implementation.

---

## Phase 3: User Story 1 - Transform an Allowed Markdown Document (Priority: P1) 🎯 MVP

**Goal**: Transform one allowed Markdown source into a verified PDF while preserving the source.

**Independent Test**: Place a Markdown document in an allowed workspace, call the transformation with a valid profile, and verify a non-empty PDF is created while the source remains byte-for-byte unchanged.

### Tests for User Story 1

- [ ] T025 [P] [US1] Write the MCP contract test for a successful `transform_markdown_to_pdf` call in `tests/integration/transform-markdown-to-pdf.test.ts` using a deterministic fake executor.
- [ ] T026 [P] [US1] Write source-preservation and output-policy tests in `tests/unit/markdown-to-pdf.test.ts`.
- [ ] T027 [P] [US1] Write failure-path tests for missing source, renderer failure, timeout, missing output, empty output, and cleanup in `tests/integration/transform-markdown-to-pdf.test.ts`.

### Implementation for User Story 1

- [ ] T028 [US1] Implement profile resolution and validated transformation request types in `src/transforms/markdown-to-pdf.ts`.
- [ ] T029 [US1] Implement the configured Markdown-to-PDF executor adapter in `src/executors/markdown-to-pdf.ts` without shell command strings or caller-supplied executable paths.
- [ ] T030 [US1] Register `transform_markdown_to_pdf` with validated input, workspace policy, executor invocation, cleanup, verification, and structured results in `src/mcp/tools.ts`.
- [ ] T031 [US1] Connect the transformation orchestration to the MCP server lifecycle in `src/main.ts` and `src/mcp/server.ts`.
- [ ] T032 [US1] Add safe result and error mapping for validation, policy, configuration, executor, timeout, and output-verification failures in `src/safety/errors.ts` and `src/mcp/tools.ts`.
- [ ] T033 [US1] Run the independent User Story 1 validation from `specs/001-markdown-to-pdf/quickstart.md` and document any environment-specific limitations in `docs/development.md`.

**Checkpoint**: The MVP transforms an allowed Markdown document into a verified PDF and safely reports failures.

---

## Phase 4: User Story 2 - Use a Configured Transformation Profile (Priority: P2)

**Goal**: Allow the same transformation mechanism to use named trusted profiles without personal or repository-specific code assumptions.

**Independent Test**: Configure two profiles with different trusted presentation settings, transform the same source with each, and verify that each result identifies and follows its selected profile.

### Tests for User Story 2

- [ ] T034 [P] [US2] Add profile-selection and profile-metadata contract tests in `tests/integration/transform-markdown-to-pdf.test.ts`.
- [ ] T035 [P] [US2] Add invalid-profile, missing-executor, invalid-stylesheet, and configuration-reload tests in `tests/unit/config.test.ts` and `tests/unit/markdown-to-pdf.test.ts`.

### Implementation for User Story 2

- [ ] T036 [P] [US2] Add profile schema validation and normalized profile loading in `src/config/schema.ts` and `src/config/load.ts`.
- [ ] T037 [US2] Apply profile-selected stylesheet, page settings, output naming, and executor configuration in `src/transforms/markdown-to-pdf.ts`.
- [ ] T038 [US2] Enforce profile-referenced path validation and trusted executor selection in `src/safety/paths.ts` and `src/transforms/markdown-to-pdf.ts`.
- [ ] T039 [US2] Return selected profile and effective non-secret transformation metadata in `src/mcp/tools.ts`.
- [ ] T040 [US2] Update `config.example.yml` and `docs/configuration.md` with generic profile examples and no personal paths.

**Checkpoint**: Multiple named profiles work independently without changing universal transformation code.

---

## Phase 5: User Story 3 - Receive Safe, Actionable Failure Results (Priority: P2)

**Goal**: Make invalid requests, unsafe paths, renderer failures, timeouts, and output conflicts predictable and safe.

**Independent Test**: Execute each refusal and failure scenario from the specification with a fake executor and verify stable categories, no unsafe reads or writes, and managed cleanup.

### Tests for User Story 3

- [ ] T041 [P] [US3] Add path-policy refusal tests for outside-root, traversal, and symlink-escape requests in `tests/unit/paths.test.ts` and `tests/integration/transform-markdown-to-pdf.test.ts`.
- [ ] T042 [P] [US3] Add output-conflict, source-immutability, and temporary-cleanup tests in `tests/unit/markdown-to-pdf.test.ts`.
- [ ] T043 [P] [US3] Add secret-redaction and safe-diagnostic tests in `tests/unit/errors.test.ts` and `tests/unit/process-executor.test.ts`.

### Implementation for User Story 3

- [ ] T044 [US3] Enforce input-size, timeout, and output-conflict policies before executor launch in `src/safety/limits.ts`, `src/safety/paths.ts`, and `src/transforms/markdown-to-pdf.ts`.
- [ ] T045 [US3] Complete failure-state mapping and cleanup behavior for renderer errors, timeout, interruption, and invalid output in `src/executors/process.ts` and `src/transforms/markdown-to-pdf.ts`.
- [ ] T046 [US3] Add bounded safe diagnostics and redaction checks to `src/safety/errors.ts` and `src/mcp/tools.ts`.
- [ ] T047 [US3] Document refusal and failure behavior in `docs/security.md` and `docs/tools.md`.

**Checkpoint**: Every specified unsafe or failed scenario returns an actionable safe result without false success.

---

## Phase 6: User Story 4 - Invoke Through Supported Local Transports (Priority: P3)

**Goal**: Provide equivalent transformation semantics through Streamable HTTP and stdio.

**Independent Test**: Run the same valid and invalid requests through both transports and compare policy outcomes and result schemas.

### Tests for User Story 4

- [ ] T048 [P] [US4] Add equivalent success and failure contract cases for HTTP and stdio in `tests/integration/mcp-http.test.ts` and `tests/integration/mcp-stdio.test.ts`.
- [ ] T049 [P] [US4] Add HTTP authentication and pre-access rejection tests in `tests/integration/mcp-http.test.ts`.
- [ ] T050 [P] [US4] Add protocol-safe stdout/stderr diagnostics tests in `tests/integration/mcp-stdio.test.ts`.

### Implementation for User Story 4

- [ ] T051 [US4] Complete transport-neutral tool registration and shared result handling in `src/mcp/server.ts` and `src/mcp/tools.ts`.
- [ ] T052 [US4] Complete HTTP authentication, bind configuration, and stdio lifecycle behavior in `src/mcp/transports.ts`.
- [ ] T053 [US4] Add Hermes Docker-to-Mac connection guidance with configurable host, port, and token values in `docs/connect-hermes.md`.

**Checkpoint**: HTTP and stdio expose one consistent, authenticated, policy-equivalent transformation capability.

---

## Phase 7: Polish & Cross-Cutting Concerns

**Purpose**: Finish documentation, packaging, quality checks, and convergence validation.

- [ ] T054 [P] Add the Hyppo family visual identity guidance and the simple circle-to-triangle transformation mascot brief in `assets/BRANDING.md`.
- [ ] T055 [P] Add a HyppoTransformer README with purpose, safety boundary, architecture, configuration, MCP connection, and quickstart links in `README.md`.
- [ ] T056 [P] Add local-only configuration and generated-artifact exclusions to `.gitignore`.
- [ ] T057 [P] Add CI checks for typecheck, lint, unit tests, integration tests, and diff hygiene in `.github/workflows/ci.yml`.
- [ ] T058 Run the complete test, build, lint, and quickstart validation commands and record results in `docs/development.md`.
- [ ] T059 Run `/speckit-converge` against the specification, plan, and tasks; resolve or append any remaining tasks in `specs/001-markdown-to-pdf/tasks.md`.

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies; establishes the project skeleton.
- **Foundational (Phase 2)**: Depends on Setup and blocks all user stories.
- **User Story 1 (Phase 3)**: Depends on Foundational; this is the MVP.
- **User Story 2 (Phase 4)**: Depends on Foundational and the profile hooks from US1; remains independently testable.
- **User Story 3 (Phase 5)**: Depends on Foundational and the transformation boundary from US1; hardens all failure paths.
- **User Story 4 (Phase 6)**: Depends on the transport foundation and registered tool from US1; validates both transports.
- **Polish (Phase 7)**: Depends on the desired user stories being complete.

### User Story Dependencies

- **US1 (P1)**: Foundational only; no dependency on later stories.
- **US2 (P2)**: Foundational plus the US1 transformation seam; adds profile behavior without changing the universal boundary.
- **US3 (P2)**: Foundational plus the US1 transformation seam; hardens shared safety behavior.
- **US4 (P3)**: Foundational plus the US1 MCP tool; validates transport equivalence.

### Parallel Opportunities

- Setup tasks T002–T007 can run in parallel after T001.
- Foundational pure policy, configuration, error, executor-type, verification-type, and MCP scaffolding tasks can run in parallel where they touch different files.
- US1 tests T025–T027 can be written in parallel before implementation tasks T028–T032.
- US2 profile tests T034–T035 can run in parallel with US3 safety tests T041–T043 after the US1 seam is available.
- US4 transport tests T048–T050 can run in parallel.
- Documentation and CI tasks T054–T057 can run in parallel during Polish.

## Implementation Strategy

### MVP First

1. Complete Setup and Foundational phases.
2. Write and fail the US1 tests.
3. Implement the single Markdown-to-PDF transformation path.
4. Run the independent quickstart validation.
5. Stop for review before adding additional profiles or tools.

### Incremental Delivery

1. Setup + Foundational: secure service skeleton.
2. US1: one usable universal transformation tool.
3. US2: configurable named profiles.
4. US3: complete failure and safety hardening.
5. US4: equivalent HTTP and stdio operation.
6. Polish: documentation, mascot brief, CI, and Spec Kit convergence.

### Notes

- Every task follows the required `- [ ] T### [P?] [US#] description with file path` format.
- `[P]` marks tasks that can be performed in parallel without incomplete-file dependencies.
- User story tasks include a story label for traceability.
- No task introduces Julia-specific paths or behavior into universal service code.
- `tasks.md` is the implementation roadmap; code is not created by `/speckit-tasks`.
