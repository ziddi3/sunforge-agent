# Three-Minute Demo Script

## Opening

SunForge Agent helps builders manage complex project ecosystems across repositories, deployments, domains, documents, and release tasks.

The public demo uses sanitized metadata. The real source repositories remain private.

## Demo Prompt

```text
Audit this project ecosystem and create the next build plan.
```

## Demo Steps

1. The dashboard loads sanitized ecosystem data.
2. The agent retrieves repository metadata.
3. The agent retrieves deployment records.
4. The agent applies audit rules.
5. The agent detects architecture drift.
6. The agent flags public/private boundaries.
7. The agent creates next-step tasks.
8. The agent generates a readiness report.

## Example Findings

```text
Finding 1:
A private library-style repository is carrying architecture and source-ledger responsibilities. It should remain private.

Finding 2:
The public demo repo is correctly limited to sanitized metadata and demo code.

Finding 3:
A public hub frontend needs a formal container registry to avoid hardcoded service links.
```

## Closing

SunForge Agent moves beyond chat by reading project records, applying rules, detecting drift, and creating an implementation plan that a builder can act on immediately.
