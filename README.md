# SunForge Agent v1.0.0

**SunForge** is the Methodz / Nexus ecosystem audit and intelligence layer.

It discovers repositories and deployments, inventories the ecosystem, classifies components, maps relationships, compares implementation against declared architecture (Nexus Canon + Ecosystem Registry), detects drift, orphaned services, duplicate implementations, missing documentation, deployment mismatches, and generates evidence-backed audit reports and prioritized recovery plans.

## Architectural Role

```
Nexus Canon        → defines meaning
Registry           → records declared / observed state
SunForge           → audits, correlates, detects drift, generates intelligence
Nexus              → routes
Containers         → operate
```

SunForge **recommends**. It does **not** redefine canonical architecture, merge repositories, or perform unrestricted execution.

## Modes

| Mode | Behavior |
|------|----------|
| `demo` (default) | Uses only sanitized sample data. Safe for public deployment. |
| `live` | Requires `GITHUB_TOKEN`. Discovers real repositories under the configured owner and attempts to load `methodz-ecosystem-registry`. Still **READ-ONLY**. |

## Quick Start (local)

```bash
cd app/backend
npm start
# http://localhost:8080/health
# http://localhost:8080/api/audit
```

Open `app/frontend/index.html` (or serve it). The frontend uses relative `/api/audit` (works on Vercel and behind a reverse proxy). For pure local file open you may set:

```js
window.__SUNFORGE_API__ = "http://localhost:8080";
```

## Vercel

This repository is Vercel-ready:

- `api/health.js` and `api/audit.js` — serverless handlers
- `app/frontend/` — static dashboard
- `vercel.json` — routes

Create a dedicated Vercel project linked to this repo. Domain decision remains pending (use the generated Vercel URL first).

### Environment variables (names only)

- `SUNFORGE_MODE` — `demo` | `live`
- `GITHUB_TOKEN` — optional, server-side only, least-privilege read
- `SUNFORGE_OWNER` — default `ziddi3`
- `CORS_ORIGIN` — optional
- `PORT` — local only

**Never** put tokens in frontend code or client bundles.

## Security

- Default behavior is **READ-ONLY**.
- No secrets in the repository.
- No shell execution surface.
- Live GitHub and registry access are optional and server-side only.
- See `docs/security.md`.

## Continuity

This is the production continuation of the original public-safe hackathon shell. Sample data and the original rules philosophy are preserved. The system now supports real discovery while remaining safe by default.

## License

MIT
