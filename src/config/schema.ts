import { z } from "zod";

const positiveInt = z.number().int().positive();

export const profileSchema = z.object({
  executor: z.string().min(1),
  stylesheet: z.string().optional(),
  page_size: z.string().optional(),
  output_policy: z.enum(["beside-source", "explicit-only", "replace"]).default("beside-source"),
});

export const configSchema = z.object({
  workspace_roots: z.array(z.string().min(1)).min(1),
  profiles: z.record(profileSchema).default({}),
  executors: z.record(z.object({
    pandoc: z.string().min(1),
    browser: z.string().min(1),
  })).default({}),
  limits: z.object({
    max_input_bytes: positiveInt.default(1024 * 1024),
    timeout_ms: positiveInt.default(120_000),
  }).default({}),
  server: z.object({
    transport: z.enum(["stdio", "http"]).default("stdio"),
    host: z.string().default("127.0.0.1"),
    port: positiveInt.default(7359),
    auth_token_env: z.string().optional(),
  }).default({}),
});

export type TransformerConfig = z.infer<typeof configSchema>;
export type Profile = z.infer<typeof profileSchema>;
