# HyppoTransformer

<img src="assets/hyppotransformer.png" alt="HyppoTransformer" width="200" align="right">

**Transform local artifacts safely, locally, and under configuration.**

HyppoTransformer is a local MCP service for controlled document and artifact
transformation. It is part of the Hyppo family alongside
[HyppoVisor](https://github.com/juliaviluhina/hyppovisor).

The first capability is `transform_markdown_to_pdf`. The service is universal:
paths, styles, executors, output conventions, and document profiles come from
trusted local configuration rather than source-code assumptions.

<br clear="right" />

## Why

- **Local-first** — documents are not uploaded.
- **Configuration-driven** — profiles adapt the service to different workspaces.
- **Source-preserving** — transformations do not silently modify inputs.
- **No arbitrary shell execution** — callers select named transformations.
- **Human-reviewable** — the service prepares artifacts; people approve external use.

## Start here

1. [Install and run](docs/install-and-run.md)
2. [Configure a workspace and profile](docs/configuration.md)
3. [Connect an MCP client](docs/connect-an-agent.md)
4. [Use the transformation tool](docs/tools.md)
5. [Read the security boundary](docs/security.md)

Project design is documented in [Design notes](docs/design-notes.md), development
in [Development](docs/development.md), and the mascot in
[Branding](assets/BRANDING.md).

## Hyppo family

```text
HyppoVisor       Controlled access to authenticated browser sessions.
HyppoTransformer  Controlled transformation and verification of local artifacts.
```

## License

[Apache-2.0](LICENSE) — keep `LICENSE` and `NOTICE` with any copy.
