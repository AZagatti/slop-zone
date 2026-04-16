import { describe, expect, it } from "vitest";
import { formatNumber } from "../format";

describe("formatNumber", () => {
  it("formats small numbers as-is", () => {
    expect(formatNumber(0)).toBe("0");
    expect(formatNumber(42)).toBe("42");
    expect(formatNumber(999)).toBe("999");
  });

  it("formats thousands with K", () => {
    expect(formatNumber(1000)).toBe("1.0K");
    expect(formatNumber(15_000)).toBe("15.0K");
  });

  it("formats millions with M", () => {
    expect(formatNumber(1_000_000)).toBe("1.0M");
    expect(formatNumber(42_500_000)).toBe("42.5M");
  });

  it("formats billions with B", () => {
    expect(formatNumber(1_000_000_000)).toBe("1.0B");
    expect(formatNumber(7_300_000_000)).toBe("7.3B");
  });

  it("formats trillions with T", () => {
    expect(formatNumber(1_000_000_000_000)).toBe("1.0T");
  });

  it("handles very large numbers with custom suffixes", () => {
    expect(formatNumber(1e15)).toContain("Qa");
    expect(formatNumber(1e18)).toContain("Qi");
  });
});
