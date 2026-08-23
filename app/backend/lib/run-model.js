/**
 * Audit / Run model
 * Separates OBSERVATION / ANALYSIS / RECOMMENDATION / ACTION
 * Every audit is reproducible with metadata.
 */

export function createRunMetadata({ mode = "demo", source = "sample", trigger = "manual" } = {}) {
  const now = new Date();
  return {
    run: {
      id: `run-${now.toISOString().replace(/[:.]/g, "-")}`,
      started_at: now.toISOString(),
      mode,
      source,
      trigger,
      behavior: "READ-ONLY",
      layers: {
        observation: true,
        analysis: true,
        recommendation: true,
        action: false
      }
    }
  };
}
