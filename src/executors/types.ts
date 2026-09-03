export interface ExecutorDefinition { pandoc: string; browser: string; }
export interface ExecutorResult { code: number | null; signal: NodeJS.Signals | null; stderr: string; timedOut: boolean; }
