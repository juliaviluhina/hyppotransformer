import { loadConfig } from "./config/load.js";
import { startHttp, startStdio } from "./mcp/transports.js";

const config = await loadConfig();
if (config.server.transport === "http") await startHttp(config);
else await startStdio(config);
