/**
 * Returns the milliseconds to wait before retry attempt `attempt` (0-indexed).
 */
export function exponentialBackoffWithJitter(
  attempt: number,
  base = 500,
  multiplier = 2,
  jitter = 0.25,
  cap = 60_000,
): number {
  const withoutJitter = Math.min(base * multiplier ** attempt, cap);
  const sign = Math.random() < 0.5 ? -1 : 1;
  const jitterAmount = Math.random() * jitter * withoutJitter * sign;
  const result = withoutJitter + jitterAmount;
  return Math.max(0, Math.round(result));
}
