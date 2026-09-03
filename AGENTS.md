# HyppoTransformer Development Guidance

Use the native Hermes Spec Kit workflow:

```text
/speckit-specify → /speckit-plan → /speckit-tasks → /speckit-implement → /speckit-converge
```

Keep transformation behavior universal. User, repository, stylesheet, browser, and output
conventions belong in trusted configuration or named profiles, never in source code.

Never add arbitrary shell execution, unrestricted filesystem access, document uploads, or
external actions. Run tests before implementation changes where practical and verify the real
MCP transport before declaring a feature complete.
