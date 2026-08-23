# Architecture

SunForge is the ecosystem audit/intelligence layer for Methodz / Nexus.

## Authority

```
Nexus Canon        → defines meaning
Registry           → records declared / observed ecosystem state
SunForge           → audits, correlates, detects drift, generates intelligence
Nexus              → routes
Containers         → operate
```

SunForge may recommend changes. It must not silently redefine canonical architecture.

## High-Level Flow (v0.3)

```
Dashboard (frontend)
  → Backend API (/api/audit, /health)
    → Observation (sample data or future live sources)
    → Analysis (rules engine)
    → Recommendation (tasks, readiness)
    → Action = none (READ-ONLY)
```

## Data Model (demo)

- ecosystems
- repositories
- deployments
- audit_rules
- findings
- tasks
- audit_reports (via run metadata)

## Core Concept

Treat the builder workspace as a connected graph:

```
repository → deployment → domain → project layer → task → audit report
```

Detect mismatches such as:

- public demo repo containing private-style responsibilities
- frontend repo missing deployment record
- backend service with no linked domain
- documentation / library repo carrying product code responsibilities
- private source repo mistaken for public demo material

## Public Demo Boundary

This repository contains:

- sanitized sample metadata
- demo workflows
- public architecture docs
- sample audit outputs
- lightweight frontend/backend shell code

Private repositories, protected implementation details, and internal ledgers remain outside the public surface.

## Continuity

This is archaeological recovery of the original hackathon shell, not a rewrite. The rules engine logic is preserved and versioned (0.2 → 0.3). Run metadata and explicit observation/analysis/recommendation separation were added so future builders can reproduce every audit.
