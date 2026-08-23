/**
 * SunForge Agent Backend v1.0.0
 * Local long-running server. For Vercel use /api/* handlers.
 * Default: READ-ONLY.
 */

import http from "node:http";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { createAuditRun } from "./lib/audit-engine.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, "../..");
const PORT = Number(process.env.PORT) || 8080;
const MODE = process.env.SUNFORGE_MODE || "demo";

function sendJson(res, status, payload) {
  res.writeHead(status, {
    "Content-Type": "application/json; charset=utf-8",
    "Access-Control-Allow-Origin": process.env.CORS_ORIGIN || "*",
    "Cache-Control": "no-store"
  });
  res.end(JSON.stringify(payload, null, 2));
}

const server = http.createServer(async (req, res) => {
  if (req.method === "OPTIONS") {
    res.writeHead(204, {
      "Access-Control-Allow-Origin": process.env.CORS_ORIGIN || "*",
      "Access-Control-Allow-Methods": "GET,POST,OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type, Authorization"
    });
    res.end();
    return;
  }

  const url = new URL(req.url || "/", `http://${req.headers.host || "localhost"}`);
  const route = url.pathname;

  try {
    if (route === "/health" || route === "/api/health") {
      sendJson(res, 200, {
        ok: true,
        service: "sunforge-agent",
        version: "1.0.0",
        mode: MODE,
        time: new Date().toISOString(),
        behavior: "READ-ONLY"
      });
      return;
    }

    if (route === "/api/audit" && (req.method === "GET" || req.method === "POST")) {
      const report = await createAuditRun({
        root,
        mode: MODE,
        trigger: req.method === "POST" ? "manual" : "get"
      });
      sendJson(res, 200, report);
      return;
    }

    sendJson(res, 404, { ok: false, error: "Not found" });
  } catch (error) {
    console.error("[sunforge]", error.message);
    sendJson(res, 500, {
      ok: false,
      error: "Audit failed",
      detail: error.message,
      service: "sunforge-agent"
    });
  }
});

server.listen(PORT, () => {
  console.log(`SunForge v1.0.0 listening on :${PORT} (mode=${MODE}, READ-ONLY)`);
});

export { server };
