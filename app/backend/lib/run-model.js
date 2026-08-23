/**
 * SunForge Run Model
 * Explicit separation of OBSERVATION | ANALYSIS | RECOMMENDATION | ACTION
 * Every audit is reproducible.
 */

export function createRunMetadata({
  mode = "demo",
  sources = [],
  trigger = "manual",
  behavior = "READ-ONLY"
} = {}) {
  const now = new Date();
  const id = `run-${now.toISOString().replace(/[:.]/g, "-")}`;
  return {
    run: {
      id,
      started_at: now.toISOString(),
      completed_at: null,
      mode,
      sources,
      trigger,
      behavior,
      layers: {
        observation: true,
        analysis: true,
        recommendation: true,
        action: false
      },
      engine: {
        name: "SunForge rules engine",
        version: "1.0.0"
      }
    }
  };
}

export function finalizeRun(meta, extra = {}) {
  return {
    ...meta,
    run: {
      ...meta.run,
      completed_at: new Date().toISOString(),
      ...extra
    }
  };
}
