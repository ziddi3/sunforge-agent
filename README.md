# SunForge Agent

**SunForge Agent** is a Gemini-powered project intelligence agent for builders who manage complex work across private repositories, deployed services, documents, assets, and release plans.

The public hackathon repo contains a safe demo shell with sanitized sample metadata. It does **not** expose private source code, private canon, client data, production secrets, or internal deployment credentials.

## Hackathon Track

**MongoDB MCP Track**

## Problem

Modern builders often work across many disconnected systems:

- private GitHub repositories
- public frontend deployments
- backend services
- custom domains and subdomains
- notes and architecture documents
- creative assets
- product tasks
- release checklists

Traditional project tools can track tickets and files, but they do not understand how a story document, a repository, a deployment, a domain, and a release task relate to each other.

## Solution

SunForge Agent audits a builder's project ecosystem as a connected operational graph.

It can:

- map repositories to deployments
- classify components by role
- detect repo-role drift
- separate private/internal material from public/demo material
- identify missing build tasks
- generate release readiness reports
- create next-step implementation plans
- store audit results in MongoDB through MCP-backed project memory

## Demo Mission

> Audit this project ecosystem and create the next build plan.

The agent reads sanitized sample metadata, identifies architectural drift, flags privacy boundaries, and returns an actionable build plan.

## Example Output

```json
{
  "audit_status": "needs_attention",
  "findings": [
    "methodz-library is carrying private source material and public prototype responsibilities",
    "method-hub exists but needs a container registry layer",
    "nexus-hub should be separated as a surface-world demo shell"
  ],
  "privacy_flags": [
    "private ledgers must not be published in demo repos",
    "production source code should remain in private repositories"
  ],
  "tasks_created": [
    "Create sanitized container registry sample data",
    "Add deployment map schema",
    "Generate public demo audit report"
  ]
}
```

## Planned Stack

- Google Cloud Agent Builder
- Gemini
- MongoDB MCP Server
- MongoDB Atlas
- Google Cloud Run
- Node.js backend
- Web dashboard frontend

## Repository Structure

```text
app/
  frontend/
  backend/
agent/
  instructions.md
  tools.md
  workflows.md
data/
  sample-ecosystem.json
  sample-repos.json
  sample-deployments.json
  sample-rules.json
docs/
  architecture.md
  demo-script.md
  devpost-submission.md
```

## Public Demo Boundary

This repository is intentionally boring, testable, and safe.

It showcases the agent that can manage a larger private ecosystem without exposing that ecosystem's protected code or private internal records.

## License

MIT
