# MCP Contract: `transform_markdown_to_pdf`

## Purpose

Transform one Markdown source document into a PDF artifact using a trusted local profile. The
operation is mechanical and local. It does not judge, rewrite, publish, upload, send, or submit
the document.

## Input Schema

```json
{
  "source_path": "string, required",
  "profile": "string, required",
  "output_path": "string, optional"
}
```

### Input rules

- `source_path` MUST be a regular Markdown file inside a configured workspace root.
- `profile` MUST name a profile in trusted local configuration.
- `output_path`, when present, MUST resolve inside an allowed workspace and satisfy the profile's output policy.
- Paths MUST be resolved before access and MUST reject traversal and disallowed symlink escapes.
- The request MUST NOT provide a command, executable path, shell fragment, or unrestricted executor arguments.
- The source MUST remain unchanged.

## Success Response

```json
{
  "status": "created",
  "job_id": "job-identifier",
  "source_path": "/allowed/workspace/document.md",
  "output_path": "/allowed/workspace/document.pdf",
  "profile": "profile-name",
  "artifact": {
    "format": "pdf",
    "size_bytes": 12345,
    "verified": true
  },
  "warnings": []
}
```

`status: created` is permitted only when a non-empty PDF exists at the reported path and basic
artifact verification has passed.

## Failure Response

```json
{
  "status": "failed|refused|timed_out",
  "error": {
    "category": "VALIDATION|POLICY_REFUSAL|CONFIGURATION|EXECUTOR|TIMEOUT|OUTPUT_VERIFICATION",
    "code": "STABLE_MACHINE_READABLE_CODE",
    "message": "Safe actionable message"
  },
  "job_id": "job-identifier when available",
  "warnings": []
}
```

Failure responses MUST NOT claim that an artifact was created unless the artifact passed output
verification. They MUST NOT include source contents, secrets, authentication tokens, or unrelated
file contents.

## Stable Error Categories

| Category | Example codes |
|---|---|
| `VALIDATION` | `INVALID_REQUEST`, `SOURCE_NOT_FOUND`, `SOURCE_NOT_FILE`, `INPUT_TOO_LARGE` |
| `POLICY_REFUSAL` | `PATH_OUTSIDE_WORKSPACE`, `SYMLINK_ESCAPE`, `OUTPUT_CONFLICT`, `UNSUPPORTED_SOURCE` |
| `CONFIGURATION` | `PROFILE_NOT_FOUND`, `EXECUTOR_NOT_CONFIGURED`, `INVALID_CONFIGURATION` |
| `EXECUTOR` | `EXECUTOR_NOT_FOUND`, `EXECUTOR_NONZERO_EXIT`, `EXECUTOR_START_FAILED` |
| `TIMEOUT` | `EXECUTOR_TIMEOUT`, `CLEANUP_TIMEOUT` |
| `OUTPUT_VERIFICATION` | `OUTPUT_NOT_CREATED`, `OUTPUT_EMPTY`, `OUTPUT_INVALID` |

## Transport Requirements

The same input validation, policy, transformation behavior, result schema, and error categories
MUST apply over Streamable HTTP and stdio. Transport authentication is applied before document
access for HTTP requests. Process diagnostics MUST remain separate from stdio protocol output.

## Side Effects

Allowed:

- Read the requested source and trusted profile inputs.
- Create or replace an output only when the configured output policy permits it.
- Create and remove managed temporary files.
- Invoke configured local transformation executors.
- Emit bounded operational diagnostics.

Forbidden:

- Modify the source document.
- Read outside configured workspace policy.
- Execute arbitrary caller-supplied commands.
- Upload or publish documents.
- Send messages, submit forms, or perform any external action.
