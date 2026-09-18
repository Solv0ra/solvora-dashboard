// Format a raw token amount (decimal string) into a human-readable figure using its
// decimals, with thousands separators and up to 6 fractional digits.

export function formatAmount(amount: string, decimals: number): string {
  const raw = BigInt(amount);
  const negative = raw < 0n;
  const abs = negative ? -raw : raw;
  const factor = 10n ** BigInt(decimals);
  const whole = abs / factor;
  const frac = (abs % factor).toString().padStart(decimals, "0").slice(0, 6).replace(/0+$/, "");

  const sign = negative ? "-" : "";
  const wholeStr = whole.toLocaleString("en-US");
  return frac ? `${sign}${wholeStr}.${frac}` : `${sign}${wholeStr}`;
}

// Format a unix timestamp (seconds) as a human-readable date.
export function formatDate(timestamp: number): string {
  if (!timestamp) return "—";
  return new Date(timestamp * 1000).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}
