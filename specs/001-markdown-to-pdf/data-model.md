# Data Model: Markdown to PDF Transformation

## Configuration

Trusted local configuration loaded by the service at startup.

| Field | Description | Validation |
|---|---|---|
| `workspace_roots` | One or more filesystem roots allowed for source, referenced inputs, temporary files, and outputs | At least one absolute, existing or creatable root; normalized before use |
| `profiles` | Named transformation profiles | Profile names are unique and profile values reference only permitted configuration |
| `profiles.<name>.stylesheet` | Optional stylesheet or presentation input | Must resolve inside an allowed root unless explicitly permitted by the configuration policy |
| `profiles.<name>.page_size` | Optional document page-size setting | Profile-defined value; no universal assumption in the engine |
| `profiles.<name>.output_policy` | Output naming and conflict behavior | Explicit policy; never inferred from unsafe defaults |
| `profiles.<name>.executor` | Trusted executor identifier | Must refer to a configured executor implementation |
| `executors` | Trusted renderer definitions | Executable locations and fixed argument templates are configuration-owned |
| `limits.max_input_bytes` | Maximum source size | Positive bounded integer |
| `limits.timeout_ms` | Maximum transformation duration | Positive bounded integer |
| `server` | Transport, bind, and authentication settings | HTTP exposure and authentication are explicit |

## Transformation Request

A validated request received through MCP.

| Field | Description | Validation |
|---|---|---|
| `source_path` | Markdown source selected by the caller | Required; resolves within a configured workspace; must be a regular readable file |
| `profile` | Named transformation profile | Required; must exist in trusted configuration |
| `output_path` | Optional requested output location | If provided, resolves within a configured workspace and follows output policy |

The request MUST NOT contain a shell command, executable path, arbitrary argument array,
stylesheet outside trusted configuration, or an instruction to upload or publish the result.

## Transformation Job

Internal lifecycle record for one request. It is held only for the operation and is not a
persistent database entity.

States:

```text
validated → prepared → executing → verifying → completed
                              └──────→ failed
validated ───────────────────────────→ refused
prepared ────────────────────────────→ failed
executing ───────────────────────────→ timed_out
verifying ───────────────────────────→ failed
```

| Field | Description |
|---|---|
| `job_id` | Correlation identifier for diagnostics and result metadata |
| `source_path` | Canonical validated source path |
| `profile_name` | Selected profile name |
| `output_path` | Canonical planned output path |
| `temporary_paths` | Temporary files owned by the job and cleaned up at completion |
| `started_at` | Operation start timestamp |
| `finished_at` | Completion timestamp when available |
| `state` | Current lifecycle state |
| `executor_result` | Exit status and bounded diagnostic metadata, excluding source contents |

## Artifact

The generated output and basic verification metadata.

| Field | Description | Validation |
|---|---|---|
| `path` | Canonical output path | Within configured workspace and expected output location |
| `format` | Artifact format | `pdf` for this feature |
| `size_bytes` | Output size | Greater than zero on success |
| `created` | Whether the operation created the artifact | Boolean |
| `verified` | Whether basic output verification passed | Required for success |

## Execution Result

Structured response returned to the MCP caller.

Success includes:

```json
{
  "status": "created",
  "job_id": "...",
  "source_path": "...",
  "output_path": "...",
  "profile": "...",
  "artifact": {
    "format": "pdf",
    "size_bytes": 12345,
    "verified": true
  },
  "warnings": []
}
```

Failure includes a stable category and safe message:

```json
{
  "status": "refused",
  "error": {
    "category": "POLICY_REFUSAL",
    "code": "PATH_OUTSIDE_WORKSPACE",
    "message": "The requested path is outside the configured workspace."
  }
}
```

The result MUST NOT include source document text, authentication tokens, environment secrets,
full unrestricted subprocess environments, or unrelated file contents.
