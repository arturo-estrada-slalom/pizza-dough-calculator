import { describe, it, expect } from "vitest";
import {
  calculateDoughBallWeight,
  calculateTotalDoughWeight,
} from "./doughCalculator";

describe("calculateDoughBallWeight", () => {
  it("returns 480g for the 16-inch reference pizza at Standard thickness", () => {
    expect(calculateDoughBallWeight(16, "standard")).toBe(480);
  });

  it("returns 367.5g for a 14-inch pizza at Standard thickness", () => {
    expect(calculateDoughBallWeight(14, "standard")).toBeCloseTo(367.5, 2);
  });

  it("returns the documented scaling-table values across the supported diameter range at Standard thickness", () => {
    expect(calculateDoughBallWeight(10, "standard")).toBeCloseTo(187.5, 2);
    expect(calculateDoughBallWeight(12, "standard")).toBeCloseTo(270.0, 2);
    expect(calculateDoughBallWeight(14, "standard")).toBeCloseTo(367.5, 2);
    expect(calculateDoughBallWeight(16, "standard")).toBeCloseTo(480.0, 2);
    expect(calculateDoughBallWeight(18, "standard")).toBeCloseTo(607.5, 2);
    expect(calculateDoughBallWeight(20, "standard")).toBeCloseTo(750.0, 2);
  });

  it("produces the minimum and maximum diameter boundary values at Standard thickness", () => {
    expect(calculateDoughBallWeight(10, "standard")).toBeCloseTo(187.5, 2);
    expect(calculateDoughBallWeight(20, "standard")).toBeCloseTo(750, 2);
  });

  it("applies the Thin factor (0.80) to the 16-inch Standard dough-ball weight", () => {
    expect(calculateDoughBallWeight(16, "thin")).toBeCloseTo(384, 2);
  });

  it("applies the Standard factor (1.00) to the 16-inch Standard dough-ball weight, matching Story 004 behavior", () => {
    expect(calculateDoughBallWeight(16, "standard")).toBe(480);
  });

  it("applies the Thick factor (1.20) to the 16-inch Standard dough-ball weight", () => {
    expect(calculateDoughBallWeight(16, "thick")).toBeCloseTo(576, 2);
  });

  it("composes the minimum diameter (10in) with Thin into a proportionally scaled result", () => {
    // Standard at 10in is 187.5g; Thin applies 0.80 on top of that scaling.
    expect(calculateDoughBallWeight(10, "thin")).toBeCloseTo(150, 2);
  });

  it("composes the maximum diameter (20in) with Thick into a proportionally scaled result", () => {
    // Standard at 20in is 750g; Thick applies 1.20 on top of that scaling.
    expect(calculateDoughBallWeight(20, "thick")).toBeCloseTo(900, 2);
  });
});

describe("calculateTotalDoughWeight", () => {
  it("returns 1920g for four 16-inch Standard pizzas", () => {
    const doughBallWeight = calculateDoughBallWeight(16, "standard");

    const totalDough = calculateTotalDoughWeight(doughBallWeight, 4);

    expect(totalDough).toBe(1920);
  });

  it("returns 2880g for the canonical six 16-inch pizzas case", () => {
    const doughBallWeight = calculateDoughBallWeight(16, "standard");

    const totalDough = calculateTotalDoughWeight(doughBallWeight, 6);

    expect(totalDough).toBe(2880);
  });

  it("returns 1536g, 1920g, and 2304g for four 16-inch Thin, Standard, and Thick pizzas respectively", () => {
    expect(
      calculateTotalDoughWeight(calculateDoughBallWeight(16, "thin"), 4),
    ).toBeCloseTo(1536, 2);
    expect(
      calculateTotalDoughWeight(calculateDoughBallWeight(16, "standard"), 4),
    ).toBe(1920);
    expect(
      calculateTotalDoughWeight(calculateDoughBallWeight(16, "thick"), 4),
    ).toBeCloseTo(2304, 2);
  });

  it("scales correctly at the minimum pizza-count boundary of 1", () => {
    const doughBallWeight = calculateDoughBallWeight(16, "standard");

    expect(calculateTotalDoughWeight(doughBallWeight, 1)).toBe(480);
  });

  it("scales correctly at the maximum pizza-count boundary of 100", () => {
    const doughBallWeight = calculateDoughBallWeight(16, "standard");

    expect(calculateTotalDoughWeight(doughBallWeight, 100)).toBe(48000);
  });

  it("computes a deterministic total for the maximum pizza count (100) combined with Thick", () => {
    const doughBallWeight = calculateDoughBallWeight(16, "thick");

    expect(calculateTotalDoughWeight(doughBallWeight, 100)).toBeCloseTo(
      57600,
      2,
    );
  });

  it("does not change the dough-ball weight when pizza count changes", () => {
    const doughBallWeight = calculateDoughBallWeight(16, "standard");

    calculateTotalDoughWeight(doughBallWeight, 1);
    calculateTotalDoughWeight(doughBallWeight, 10);

    expect(doughBallWeight).toBe(480);
  });
});
