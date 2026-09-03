# Security

HyppoTransformer is a local file and process boundary. Its safety depends on
explicit configuration and a deliberately narrow MCP surface.

## Workspace policy

- Read only from configured workspace roots.
- Resolve paths before access.
- Reject traversal and symlink escapes outside approved roots.
- Keep temporary files and outputs inside approved locations.
- Do not use broad roots such as `/` or an entire home directory.

## Executor policy

- Invoke only trusted configured executors.
- Use non-shell subprocess execution.
- Do not accept arbitrary commands, executable paths, or unrestricted argument arrays from MCP requests.
- Apply input-size and execution-time limits.
- Clean up managed temporary files after success or failure.

## Data handling

- Source documents are not uploaded by this service.
- Source documents are not silently modified.
- Logs and errors must not contain document contents, credentials, tokens, or unrelated files by default.
- Configuration containing local paths or secrets stays outside version control.

## HTTP boundary

HTTP is intended for local use. Bind to loopback by default. If Docker needs to
reach the host service, use a controlled host-reachable address, require bearer
authentication, and do not expose the port through router forwarding.

## Human boundary

HyppoTransformer prepares local artifacts. It does not send email, submit forms,
upload documents to websites, publish artifacts, or perform other external actions.
A human reviews and approves anything intended for external use.
