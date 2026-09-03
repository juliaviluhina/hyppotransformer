import { spawn } from "node:child_process";

export interface ProcessResult { code: number | null; signal: NodeJS.Signals | null; stdout: string; stderr: string; timedOut: boolean; }

export function runProcess(command: string, args: string[], timeoutMs: number, cwd?: string): Promise<ProcessResult> {
  return new Promise((resolve, reject) => {
    const child = spawn(command, args, { cwd, shell: false, stdio: ["ignore", "pipe", "pipe"] });
    let stdout = ""; let stderr = ""; let timedOut = false;
    const timer = setTimeout(() => { timedOut = true; child.kill("SIGTERM"); }, timeoutMs);
    child.stdout.setEncoding("utf8"); child.stderr.setEncoding("utf8");
    child.stdout.on("data", (chunk: string) => { stdout += chunk.slice(0, 8192); });
    child.stderr.on("data", (chunk: string) => { stderr += chunk.slice(0, 8192); });
    child.on("error", reject);
    child.on("close", (code, signal) => { clearTimeout(timer); resolve({ code, signal, stdout, stderr, timedOut }); });
  });
}
