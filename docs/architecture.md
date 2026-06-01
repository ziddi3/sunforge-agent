# Architecture

SunForge Agent is a public demo shell for a project intelligence agent.

It is designed to audit complex builder ecosystems without exposing private production repositories.

## High-Level Flow

```text
Builder Dashboard
  -> Backend API
    -> Google Cloud Agent Builder
      -> Gemini reasoning
        -> MongoDB MCP tools
          -> MongoDB project memory
```

## Data Model

MongoDB collections planned for the demo:

- ecosystems
- repositories
- deployments
- documents
- assets
- audit_rules
- findings
- tasks
- audit_reports

## Core Concept

The agent treats a builder's workspace as a connected graph:

```text
repository -> deployment -> domain -> project layer -> task -> audit report
```

This allows it to detect mismatches such as:

- a public demo repo containing private-style responsibilities
- a frontend repo missing its deployment record
- a backend service with no linked domain
- a documentation repo carrying product code responsibilities
- a private source repo being mistaken for public demo material

## Public Demo Boundary

The public repo only contains:

- sanitized sample metadata
- demo workflows
- public architecture docs
- sample audit outputs
- lightweight frontend/backend shell code

Private repositories, protected implementation details, and internal ledgers remain outside the public submission.
