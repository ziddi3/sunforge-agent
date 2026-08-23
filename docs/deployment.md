# Deployment

## Target

- GitHub: ziddi3/sunforge-agent (sovereign repository)
- Vercel: dedicated SunForge project (do not piggyback on unrelated Methodz apps)

## Domain

Production domain is **pending**. Deploy first to the Vercel-generated URL and document any custom domain decision separately. Do not invent or reassign a production domain here.

## Local

```bash
cd app/backend
npm start
# http://localhost:8080/health
# http://localhost:8080/api/audit
```

Serve `app/frontend` with any static server, or open the HTML file after setting `window.__SUNFORGE_API__ = "http://localhost:8080"` if needed.

## Vercel

Recommended minimal configuration:

1. Create a new Vercel project linked to `ziddi3/sunforge-agent`.
2. Framework preset: Other (or Node).
3. Root directory: repository root.
4. Build command: (none required for pure static + Node server approach) or adapt to serverless.
5. Output / public: serve `app/frontend` as static assets.
6. For the API, either:
   - Use a long-running Node process if the plan allows, or
   - Convert `/api/audit` and `/health` to Vercel serverless functions under `/api` (minimal adaptation of the existing engine).

Environment variables (names only):

- `PORT`
- `SUNFORGE_MODE` (`demo` recommended for public surface)
- `CORS_ORIGIN` (optional, default `*`)
- `GITHUB_TOKEN` (optional, server-side only, never expose to browser)

## Health

`GET /health` or `GET /api/health` must return 200 with `{ ok: true, service: "sunforge-agent-backend", ... }`.

## Failure Behavior

Missing configuration or missing sample data must fail visibly with a clear JSON error. Do not silently invent ecosystem state.
