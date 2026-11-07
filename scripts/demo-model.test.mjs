import test from "node:test";
import assert from "node:assert/strict";
import { simulateScenario } from "../demo-model.js";

test("the explainer is deterministic and confines changes to the disruption window", () => {
  const before = simulateScenario({ delay: 0 });
  const after = simulateScenario({ delay: 600 });
  assert.deepEqual(after, simulateScenario({ delay: 600 }));
  after.samples.forEach((sample, index) => {
    if (sample.phase === "during")
      assert.equal(sample.value - before.samples[index].value, 600);
    else assert.equal(sample.value, before.samples[index].value);
  });
});
test("the bounded fallback limits the model without claiming successful dependency requests", () => {
  const baseline = simulateScenario({ delay: 0 });
  const fallback = simulateScenario({
    delay: 800,
    recovery: "fallback",
    mode: "outage",
  });
  fallback.samples.forEach((sample, index) =>
    assert.ok(sample.value - baseline.samples[index].value <= 100),
  );
  assert.match(fallback.explanation, /not a successful dependency request/);
});
test("invalid and out-of-range delay values cannot corrupt the graph", () => {
  assert.deepEqual(
    simulateScenario({ delay: -500 }).samples,
    simulateScenario({ delay: 0 }).samples,
  );
  assert.deepEqual(
    simulateScenario({ delay: 5000 }).samples,
    simulateScenario({ delay: 800 }).samples,
  );
  for (const delay of [NaN, undefined, "invalid", Infinity, -Infinity]) {
    const model = simulateScenario({ delay });
    assert.ok(model.samples.every((sample) => Number.isFinite(sample.value)));
    assert.doesNotMatch(model.path, /NaN|Infinity/);
  }
});
