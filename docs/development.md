# Development

## Workflow

HyppoTransformer uses GitHub Spec Kit with the native Hermes integration:

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

Feature artifacts live under `specs/`. The first feature is
[`001-markdown-to-pdf`](../specs/001-markdown-to-pdf/).

## Quality commands

```bash
npm run typecheck
npm run lint
npm test
npm run build
```

Unit tests use deterministic fixture executors and do not require Pandoc or a
graphical browser. A host-renderer smoke test can be run separately on a machine
with the configured tools installed.

## Development principles

- Keep universal behavior in source code and personal/repository behavior in configuration.
- Add tests before or alongside behavior changes.
- Preserve the MCP contract and stable error categories.
- Run `git diff --check` before committing.
- Do not commit local configuration, credentials, generated artifacts, or dependency directories.
