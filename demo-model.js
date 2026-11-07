// Synthetic, deterministic data for the public explainer. No service is called.
export function simulateScenario({
  delay = 300,
  mode = "latency",
  recovery = "wait",
} = {}) {
  const amount = Math.max(0, Math.min(800, Number(delay) || 0));
  const unavailable = mode === "outage";
  const fallback = recovery === "fallback";
  const samples = Array.from({ length: 30 }, (_, index) => {
    const baseline = 80 + [0, 8, -4, 5, -2][index % 5];
    const disrupted = index >= 10 && index <= 19;
    const value = disrupted
      ? baseline +
        (fallback ? Math.min(amount, 100) : unavailable ? 800 : amount)
      : baseline;
    return {
      value,
      phase: index < 10 ? "before" : index <= 19 ? "during" : "after",
    };
  });
  const path = samples
    .map(
      ({ value }, index) =>
        `${index ? "L" : "M"}${(40 + (index * 580) / 29).toFixed(1)} ${(210 - (Math.min(value, 900) / 900) * 160).toFixed(1)}`,
    )
    .join(" ");
  const headline = unavailable
    ? fallback
      ? "A fallback keeps a bounded response."
      : "An unavailable dependency changes the story."
    : fallback
      ? "The model limits the added delay."
      : amount
        ? "A slowdown, then a return."
        : "No added delay in this scenario.";
  const explanation = unavailable
    ? fallback
      ? "In this illustration, a fallback returns an alternative response while the dependency is unavailable. The line represents a modeled response, not a successful dependency request."
      : "The disruption window uses a fixed synthetic timeout of 800 ms above the generated baseline. A timeout is not a successful response."
    : fallback
      ? `The fallback caps the modeled addition at ${Math.min(amount, 100)} ms. That is an illustrative assumption, not a measured performance guarantee.`
      : `The illustration adds ${amount} ms during the disruption window, then returns to the generated baseline.`;
  const question = fallback
    ? "Would the fallback tell a person what is missing, and when they should try again?"
    : unavailable
      ? "Would the application fail clearly, recover cleanly, and avoid leaving the person uncertain?"
      : "Would a person using the application understand the delay and know what to do next?";
  return { samples, path, headline, explanation, question };
}
