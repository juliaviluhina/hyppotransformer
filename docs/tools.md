# Tools

The first release exposes one MCP tool:

| Tool | Purpose |
|---|---|
| `transform_markdown_to_pdf` | Transform one allowed Markdown document into a verified PDF using a trusted named profile. |

## `transform_markdown_to_pdf`

Example input:

```json
{
  "source_path": "/allowed/workspace/document.md",
  "profile": "default",
  "output_path": "/allowed/workspace/document.pdf"
}
```

`output_path` is optional when the selected profile permits a default output name.

Example success response:

```json
{
  "status": "created",
  "source_path": "/allowed/workspace/document.md",
  "output_path": "/allowed/workspace/document.pdf",
  "profile": "default",
  "artifact": {
    "format": "pdf",
    "size_bytes": 12345,
    "verified": true
  },
  "warnings": []
}
```

The transformation preserves the source document. Local Markdown images are resolved relative to the source document and embedded in the intermediate HTML, so images inside the allowed workspace can be rendered by the PDF browser.

Mermaid diagrams are currently preserved as Mermaid source/code rather than rendered diagrams. Mermaid support is a future renderer capability.

## Refusals and failures

The tool returns structured categories for:

- Invalid requests
- Workspace-policy refusals
- Configuration errors
- Executor failures
- Timeouts
- Output-verification failures

It does not expose source contents, secrets, authentication tokens, or unrelated
file contents in normal responses.

The public surface is intentionally small. Additional tools such as generic
artifact verification or text extraction require a separate design and review.
