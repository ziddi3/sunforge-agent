import http from "node:http";
import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const root = path.resolve(__dirname, "../..");

async function readJson(relativePath) {
  const raw = await fs.readFile(path.join(root, relativePath), "utf8");
  return JSON.parse(raw);
}

async function buildAudit() {
  const ecosystem = await readJson("data/sample-ecosystem.json");
  const repositories = await readJson("data/sample-repos.json");
  const deployments = await readJson("data/sample-deployments.json");
  const rules = await readJson("data/sample-rules.json");

  const publicRepos = repositories.filter((repo) => repo.visibility === "public");
  const privateRepos = repositories.filter((repo) => repo.visibility === "private");
  const plannedDeployments = deployments.filter((deployment) => deployment.status === "planned");
  const highRiskRepos = repositories.filter((repo) => repo.risk_level.includes("high"));

  const findings = [
    `${repositories.length} repositories modeled in sanitized metadata`,
    `${deployments.length} deployment records mapped`,
    `${privateRepos.length} repositories remain private-source or protected-workspace records`,
    `${publicRepos.length} public demo repository is available for judging`,
    `${plannedDeployments.length} demo deployment still needs completion`,
    `${highRiskRepos.length} private repository would be high risk if made public`
  ];

  const tasks = [
    "Connect MongoDB MCP server to persist audit reports",
    "Deploy demo backend to Cloud Run",
    "Deploy demo frontend to Vercel or Cloud Run",
    "Add dashboard view for findings and task creation",
    "Add authorized GitHub metadata import after demo shell is stable"
  ];

  return {
    audit_status: plannedDeployments.length > 0 ? "needs_attention" : "ready_for_review",
    ecosystem,
    counts: {
      repositories: repositories.length,
      deployments: deployments.length,
      rules: rules.length,
      public_repositories: publicRepos.length,
      private_repositories: privateRepos.length
    },
    findings,
    privacy_flags: [
      "Public demo repo must use sanitized metadata only",
      "Private source repositories remain private",
      "Internal architecture ledgers stay outside public demo scope"
    ],
    tasks_created: tasks,
    readiness_score: 68
  };
}

function sendJson(res, statusCode, payload) {
  res.writeHead(statusCode, { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" });
  res.end(JSON.stringify(payload, null, 2));
}

const server = http.createServer(async (req, res) => {
  if (req.method === "OPTIONS") {
    res.writeHead(204, {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET,POST,OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type"
    });
    res.end();
    return;
  }

  try {
    if (req.url === "/health") {
      sendJson(res, 200, { ok: true, service: "sunforge-agent-backend" });
      return;
    }

    if (req.url === "/api/audit") {
      const audit = await buildAudit();
      sendJson(res, 200, audit);
      return;
    }

    sendJson(res, 404, { error: "Not found" });
  } catch (error) {
    sendJson(res, 500, { error: "Audit failed", detail: error.message });
  }
});

const port = process.env.PORT || 8080;
server.listen(port, () => {
  console.log(`SunForge Agent backend listening on port ${port}`);
});
