export type ErrorCategory = "VALIDATION" | "POLICY_REFUSAL" | "CONFIGURATION" | "EXECUTOR" | "TIMEOUT" | "OUTPUT_VERIFICATION";

export class TransformerError extends Error {
  constructor(public readonly category: ErrorCategory, public readonly code: string, message: string) {
    super(message);
    this.name = "TransformerError";
  }
}

export function safeError(error: unknown): TransformerError {
  if (error instanceof TransformerError) return error;
  return new TransformerError("EXECUTOR", "INTERNAL_ERROR", error instanceof Error ? error.message : String(error));
}

export function errorResult(error: unknown, jobId?: string) {
  const e = safeError(error);
  return { status: e.category === "POLICY_REFUSAL" ? "refused" : e.category === "TIMEOUT" ? "timed_out" : "failed", ...(jobId ? { job_id: jobId } : {}), error: { category: e.category, code: e.code, message: e.message }, warnings: [] };
}
