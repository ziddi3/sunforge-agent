import http from "node:http";
import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const root = path.resolve(__dirname, "../..");

const penalties = { critical: 25, high: 14, medium: 7, low: 3, info: 0 };

const deployableRoles = new Set([
  "public-demo-shell",
  "public-hub-frontend",
  "business-container-app"
]);

const roleLayers = {
  "private-source-ledger": "private-library",
  "public-hub-frontend": "public-hub",
  "business-container-app": "container-apps",
  "artifact-vault": "artifact-vault",
  "surface-dashboard": "surface-dashboard",
  "world-shell": "world-shell",
  "public-demo-shell": "public-demo"
};

const roleKeywords = {
  "public-demo-shell": ["demo", "sanitized", "agent", "hackathon"],
  "private-source-ledger": ["architecture", "internal", "private", "source", "ledger"],
  "public-hub-frontend": ["frontend", "portal", "registry", "deployment"],
  "business-container-app": ["backend", "customer", "service", "dashboard"],
  "artifact-vault": ["artifact", "archive", "asset", "vault"],
  "surface-dashboard": ["surface", "dashboard", "navigation", "workspace"],
  "world-shell": ["world", "shell", "environment", "map"]
};

async function readJson(file) {
  return JSON.parse(await fs.readFile(path.join(root, file), "utf8"));
}

function text(value) {
  return Array.isArray(value) ? value.join(" ").toLowerCase() : String(value ?? "").toLowerCase();
}

function includesAny(haystack, needles) {
  const body = text(haystack);
  return needles.some((needle) => body.includes(String(needle).toLowerCase()));
}

function finding({ rule_id, type, severity, subject, message, evidence = [], recommendation }) {
  return { rule_id, type, severity, subject, message, evidence, recommendation };
}

function addIds(items, prefix) {
  return items.map((item, index) => ({
    id: `${prefix}-${String(index + 1).padStart(3, "0")}`,
    ...item
  }));
}

function groupDeployments(deployments) {
  const byRepo = new Map();
  for (const deployment of deployments) {
    const list = byRepo.get(deployment.repo_id) ?? [];
    list.push(deployment);
    byRepo.set(deployment.repo_id, list);
  }
  return byRepo;
}

function auditRoles(repositories, deploymentsByRepo) {
  const findings = [];
  const passed = [];

  for (const repo of repositories) {
    const expected = roleKeywords[repo.intended_role] ?? [];
    const responsibilities = repo.current_responsibilities ?? [];
    const deployments = deploymentsByRepo.get(repo.id) ?? [];

    if (expected.length && !includesAny(responsibilities, expected)) {
      findings.push(finding({
        rule_id: "rule-detect-repo-role-drift",
        type: "architecture",
        severity: "high",
        subject: repo.name,
        message: `${repo.name} does not match its intended role: ${repo.intended_role}.`,
        evidence: responsibilities,
        recommendation: `Move mismatched responsibilities out of ${repo.name}.`
      }));
    } else {
      passed.push(`${repo.name} matches expected role pattern: ${repo.intended_role}`);
    }

    if (deployableRoles.has(repo.intended_role) && deployments.length === 0) {
      findings.push(finding({
        rule_id: "rule-frontend-backend-split",
        type: "deployment",
        severity: "medium",
        subject: repo.name,
        message: `${repo.name} is deployable but has no deployment record.`,
        evidence: [`intended_role=${repo.intended_role}`],
        recommendation: `Add a deployment map entry for ${repo.name}.`
      }));
    }
  }

  return { findings, passed };
}

function auditPrivacy(repositories) {
  const findings = [];
  const passed = [];

  for (const repo of repositories) {
    const responsibilities = repo.current_responsibilities ?? [];
    const privateStyle = includesAny(responsibilities, [
      "internal",
      "private",
      "ledger",
      "client",
      "source records",
      "protected"
    ]);

    if (repo.visibility === "public" && repo.intended_role !== "public-demo-shell") {
      findings.push(finding({
        rule_id: "rule-public-demo-sanitized",
        type: "privacy",
        severity: "critical",
        subject: repo.name,
        message: `${repo.name} is public but is not classified as a public demo shell.`,
        evidence: [`visibility=${repo.visibility}`, `intended_role=${repo.intended_role}`],
        recommendation: `Reclassify ${repo.name} or move protected material to a private repo.`
      }));
    }

    if (repo.visibility === "public" && privateStyle) {
      findings.push(finding({
        rule_id: "rule-public-demo-sanitized",
        type: "privacy",
        severity: "critical",
        subject: repo.name,
        message: `${repo.name} mixes public demo scope with private-style responsibilities.`,
        evidence: responsibilities,
        recommendation: `Replace private-style records in ${repo.name} with sanitized sample metadata.`
      }));
    }

    if (repo.intended_role === "private-source-ledger" && repo.visibility !== "private") {
      findings.push(finding({
        rule_id: "rule-private-ledger-stays-private",
        type: "privacy",
        severity: "critical",
        subject: repo.name,
        message: `${repo.name} is a private-ledger repo but is not marked private.`,
        evidence: [`visibility=${repo.visibility}`],
        recommendation: `Set ${repo.name} to private before adding protected records.`
      }));
    }

    if (repo.visibility === "private") {
      passed.push(`${repo.name} remains private as expected.`);
    }
  }

  return { findings, passed };
}

function auditDeployments(repositories, deployments) {
  const findings = [];
  const passed = [];
  const repos = new Map(repositories.map((repo) => [repo.id, repo]));

  for (const deployment of deployments) {
    const repo = repos.get(deployment.repo_id);

    if (!repo) {
      findings.push(finding({
        rule_id: "rule-frontend-backend-split",
        type: "deployment",
        severity: "high",
        subject: deployment.id,
        message: `${deployment.id} points to an unknown repository.`,
        evidence: [`repo_id=${deployment.repo_id}`],
        recommendation: `Link ${deployment.id} to a known repository record.`
      }));
      continue;
    }

    if (deployment.status === "planned") {
      findings.push(finding({
        rule_id: "rule-frontend-backend-split",
        type: "deployment",
        severity: "high",
        subject: deployment.id,
        message: `${deployment.id} is planned but not live.`,
        evidence: [`platform=${deployment.platform}`, `type=${deployment.type}`],
        recommendation: `Deploy ${repo.name} for ${deployment.type} review.`
      }));
    } else {
      passed.push(`${deployment.id} is mapped to ${repo.name} and marked ${deployment.status}.`);
    }

    if (deployment.type === "frontend" && !["Vercel", "Cloud Run"].includes(deployment.platform)) {
      findings.push(finding({
        rule_id: "rule-frontend-backend-split",
        type: "deployment",
        severity: "medium",
        subject: deployment.id,
        message: `${deployment.id} is a frontend on an unexpected platform.`,
        evidence: [`platform=${deployment.platform}`],
        recommendation: `Verify frontend hosting for ${deployment.id}.`
      }));
    }

    if (deployment.type === "backend" && !["Render", "Cloud Run"].includes(deployment.platform)) {
      findings.push(finding({
        rule_id: "rule-frontend-backend-split",
        type: "deployment",
        severity: "medium",
        subject: deployment.id,
        message: `${deployment.id} is a backend on an unexpected platform.`,
        evidence: [`platform=${deployment.platform}`],
        recommendation: `Verify backend hosting for ${deployment.id}.`
      }));
    }
  }

  return { findings, passed };
}

function auditLayerCoverage(ecosystem, repositories) {
  const findings = [];
  const passed = [];
  const covered = new Set(repositories.map((repo) => roleLayers[repo.intended_role]).filter(Boolean));

  for (const layer of ecosystem.system_layers ?? []) {
    if (!covered.has(layer)) {
      findings.push(finding({
        rule_id: "rule-detect-repo-role-drift",
        type: "architecture",
        severity: "medium",
        subject: layer,
        message: `No repository is mapped to the ${layer} layer.`,
        evidence: [`system_layer=${layer}`],
        recommendation: `Create or map a repository record for the ${layer} layer.`
      }));
    } else {
      passed.push(`${layer} has at least one mapped repository.`);
    }
  }

  return { findings, passed, covered_layers: [...covered] };
}

function score(findings) {
  const lost = findings.reduce((sum, item) => sum + (penalties[item.severity] ?? 5), 0);
  return Math.max(0, Math.min(100, 100 - lost));
}

function summarize(findings) {
  return findings.reduce((summary, item) => {
    summary[item.severity] = (summary[item.severity] ?? 0) + 1;
    return summary;
  }, {});
}

function componentMap(repositories, deploymentsByRepo) {
  return repositories.map((repo) => ({
    repo_id: repo.id,
    name: repo.name,
    visibility: repo.visibility,
    intended_role: repo.intended_role,
    system_layer: roleLayers[repo.intended_role] ?? "unmapped",
    deployments: (deploymentsByRepo.get(repo.id) ?? []).map((deployment) => ({
      id: deployment.id,
      platform: deployment.platform,
      type: deployment.type,
      status: deployment.status,
      public: deployment.public
    }))
  }));
}

async function buildAudit() {
  const ecosystem = await readJson("data/sample-ecosystem.json");
  const repositories = await readJson("data/sample-repos.json");
  const deployments = await readJson("data/sample-deployments.json");
  const rules = await readJson("data/sample-rules.json");

  const deploymentsByRepo = groupDeployments(deployments);
  const roleAudit = auditRoles(repositories, deploymentsByRepo);
  const privacyAudit = auditPrivacy(repositories);
  const deploymentAudit = auditDeployments(repositories, deployments);
  const layerAudit = auditLayerCoverage(ecosystem, repositories);

  const findings = addIds([
    ...roleAudit.findings,
    ...privacyAudit.findings,
    ...deploymentAudit.findings,
    ...layerAudit.findings
  ], "F");

  const tasks = addIds(findings.map((item) => ({
    source_finding: item.id,
    severity: item.severity,
    title: item.recommendation,
    status: "open"
  })), "T");

  const readiness = score(findings);

  return {
    engine: {
      name: "SunForge rules engine",
      version: "0.2.0",
      evaluated_rules: rules.map((rule) => ({
        id: rule.id,
        type: rule.type,
        severity: rule.severity
      }))
    },
    audit_status: readiness >= 85 ? "ready_for_review" : "needs_attention",
    ecosystem,
    counts: {
      repositories: repositories.length,
      deployments: deployments.length,
      rules: rules.length,
      public_repositories: repositories.filter((repo) => repo.visibility === "public").length,
      private_repositories: repositories.filter((repo) => repo.visibility === "private").length,
      findings: findings.length,
      tasks_created: tasks.length
    },
    component_map: componentMap(repositories, deploymentsByRepo),
    findings_summary: summarize(findings),
    findings,
    passed_checks: [
      ...roleAudit.passed,
      ...privacyAudit.passed,
      ...deploymentAudit.passed,
      ...layerAudit.passed
    ],
    privacy_flags: findings.filter((item) => item.type === "privacy").map((item) => item.message),
    tasks_created: tasks,
    readiness_score: readiness
  };
}

function sendJson(res, status, payload) {
  res.writeHead(status, {
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": "*"
  });
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
    const route = req.url?.split("?")[0];

    if (route === "/health") {
      sendJson(res, 200, { ok: true, service: "sunforge-agent-backend" });
      return;
    }

    if (route === "/api/audit") {
      sendJson(res, 200, await buildAudit());
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
