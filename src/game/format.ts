const SUFFIXES = ["", "K", "M", "B", "T", "Qa", "Qi", "Sx", "Sp", "Oc", "No", "Dc"];

export function formatNumber(n: number): string {
  if (n < 0) {
    return `-${formatNumber(-n)}`;
  }
  if (n < 1000) {
    return Math.floor(n).toString();
  }

  let tier = Math.floor(Math.log10(Math.abs(n)) / 3);
  if (tier >= SUFFIXES.length) {
    tier = SUFFIXES.length - 1;
  }

  const suffix = SUFFIXES[tier];
  const scale = 10 ** (tier * 3);
  const scaled = n / scale;

  return `${scaled.toFixed(1)}${suffix}`;
}
