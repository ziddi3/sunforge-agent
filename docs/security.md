# Security Notes

## Principles

- Never commit secrets.
- Never print secrets into logs.
- Never expose GitHub or Vercel credentials to the browser.
- Never put provider credentials into frontend code.
- Default behavior is READ-ONLY.
- No unrestricted shell / dynamic code execution surface.
- No storage of secrets inside SunForge.

## Inspection Results (continuity recovery)

- Original backend: pure Node, no external deps, no secrets in code.
- Frontend: previously hardcoded `http://localhost:8080` — fixed to relative / configurable base.
- Sample data: sanitized, no credentials or personal information.
- CORS: currently permissive for demo; tighten with `CORS_ORIGIN` in production.
- No authentication on public demo endpoints (by design for the public shell). Live mode that touches private registry or GitHub must be gated behind server-side token and future auth.

## Required Before Live Mode

- Server-side only handling of any GITHUB_TOKEN or registry credentials.
- Least-privilege scopes (repo read, no write).
- Explicit opt-in for any future ACTION layer.
- Logging that redacts tokens.

## Known Residual Risks

- Public endpoints are unauthenticated (demo surface).
- CORS default is open; configure for production domain.
- Live GitHub discovery and registry ingestion are not yet wired; when added they must remain server-side.
