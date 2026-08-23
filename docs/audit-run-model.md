# Audit / Run Model

Every audit should make it possible to determine:

- when it ran
- what sources it inspected
- what repositories it inspected
- what provider data it inspected
- what rules were applied
- what findings were generated
- what evidence supported each finding
- what recommendations were produced
- whether anything was actually changed

## Separation

| Layer          | Purpose                                      | Default |
|----------------|----------------------------------------------|---------|
| OBSERVATION    | What was read (sample, GitHub, registry…)    | yes     |
| ANALYSIS       | Findings, drift, privacy, scoring            | yes     |
| RECOMMENDATION | Tasks, readiness, prioritized plan           | yes     |
| ACTION         | External mutation                            | **no**  |

## Run Metadata Shape

```json
{
  "run": {
    "id": "run-…",
    "started_at": "ISO-8601",
    "mode": "demo|live",
    "source": "sample|github|registry",
    "trigger": "manual|scheduled",
    "behavior": "READ-ONLY",
    "layers": {
      "observation": true,
      "analysis": true,
      "recommendation": true,
      "action": false
    }
  }
}
```

Prefer evidence of the form:

> Observed X in repository Y at commit Z.
> The canonical registry says Y should have role A.
> These differ → drift finding.
> Evidence: …
> Recommendation: …
