# SunForge Agent

**SunForge** is the Methodz / Nexus ecosystem audit and intelligence layer.

It discovers repositories and deployments, inventories the ecosystem, classifies components, maps relationships, compares implementation against declared architecture (Nexus Canon + Ecosystem Registry), detects drift, orphaned services, duplicate/divergent implementations, missing documentation, deployment/domain mismatches, and generates evidence-backed audit reports and prioritized recovery/build plans.

## Architectural Role

```
Nexus Canon        → defines meaning
Registry           → records declared / observed state
SunForge           → audits, correlates, detects drift, generates intelligence
Nexus              → routes
Containers         → operate
```

SunForge **recommends**. It does **not** silently redefine canonical architecture, merge repositories, or act as an unrestricted execution agent.

## Current Status (Production Continuity Build)

This repository began as a public-safe hackathon demo shell (Gemini + MongoDB MCP track). It has been recovered and hardened into the operational starting point for Methodz ecosystem auditing.

- Rules engine (v0.2 → production path) preserved and extended
- Sample data retained for public demo and regression tests
- Backend remains pure Node (no external runtime deps for core audit)
- Frontend made production-ready (no hardcoded localhost)
- Health endpoint, audit/run model, security boundaries documented
- Vercel deployment target prepared

## Repository Structure

```text
agent/
  instructions.md
  tools.md
  workflows.md
app/
  frontend/          # static dashboard
  backend/           # Node HTTP server (local) + Vercel-compatible entry
data/                # sample ecosystem (public demo boundary)
docs/
  architecture.md
  demo-script.md
  deployment.md
  security.md
  audit-run-model.md
tests/
```

## Local Development

```bash
cd app/backend
npm start
# Backend: http://localhost:8080
# Health:  http://localhost:8080/health
# Audit:   http://localhost:8080/api/audit
```

Open `app/frontend/index.html` or serve it. The frontend resolves the API via relative path or `window.__SUNFORGE_API__`.

## Production

Deploy as its own Vercel project. See `docs/deployment.md`.

Required environment variables (names only):

- `PORT` (optional)
- `GITHUB_TOKEN` (optional, server-side only — for live discovery)
- `SUNFORGE_MODE` (`demo` | `live`)

Never put tokens in frontend code.

## Security

- Default behavior is **read-only**.
- No secrets in repository.
- No shell/code execution exposed to the agent surface.
- CORS and request surface are intentionally narrow.
- See `docs/security.md`.

## Continuity Rules

This is archaeological recovery, not a greenfield rewrite. Old artifacts are preserved. Drift between documentation and implementation is recorded and resolved against the Registry / Canon authority chain.

## License

MIT
