# SunForge Agent Workflows

## Workflow: Ecosystem Audit

Input:

- ecosystem ID
- audit scope
- privacy mode

Steps:

1. Retrieve ecosystem record.
2. Retrieve linked repositories, deployments, documents, and rules.
3. Classify each component by role.
4. Compare actual placement against expected architecture.
5. Detect repo-role drift.
6. Detect missing deployment links or orphaned services.
7. Apply privacy rules.
8. Create structured tasks.
9. Generate audit report.

Output:

- audit status
- architecture map
- findings
- privacy flags
- recommended tasks
- readiness score

## Workflow: Privacy Boundary Check

Input:

- repository metadata
- file/document classification
- public/private rules

Steps:

1. Identify whether a repository is public-demo, private-source, private-ledger, deployment-shell, or container-app.
2. Check whether listed assets match the repository role.
3. Flag sensitive items that should not be public.
4. Recommend sanitized replacements for public demos.

## Workflow: Next Build Plan

Input:

- current audit report
- target project milestone

Steps:

1. Read the most recent audit findings.
2. Group findings by severity and system layer.
3. Create a short task list.
4. Mark which tasks are safe for public demo work.
5. Mark which tasks belong in private repositories.
6. Return a concrete implementation plan.
