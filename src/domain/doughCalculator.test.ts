import { describe, it, expect } from "vitest";
import {
    calculateDoughBallWeight,
    calculateTotalDoughWeight,
} from "./doughCalculator";

describe("calculateDoughBallWeight", () => {
    it("returns 480g for the 16-inch reference pizza", () => {
        expect(calculateDoughBallWeight(16)).toBe(480);
    });

    it("returns 367.5g for a 14-inch pizza", () => {
        expect(calculateDoughBallWeight(14)).toBeCloseTo(367.5, 2);
    });

    it("returns the documented scaling-table values across the supported diameter range", () => {
        expect(calculateDoughBallWeight(10)).toBeCloseTo(187.5, 2);
        expect(calculateDoughBallWeight(12)).toBeCloseTo(270.0, 2);
        expect(calculateDoughBallWeight(14)).toBeCloseTo(367.5, 2);
        expect(calculateDoughBallWeight(16)).toBeCloseTo(480.0, 2);
        expect(calculateDoughBallWeight(18)).toBeCloseTo(607.5, 2);
        expect(calculateDoughBallWeight(20)).toBeCloseTo(750.0, 2);
    });

    it("produces the minimum and maximum diameter boundary values", () => {
        expect(calculateDoughBallWeight(10)).toBeCloseTo(187.5, 2);
        expect(calculateDoughBallWeight(20)).toBeCloseTo(750, 2);
    });
});

describe("calculateTotalDoughWeight", () => {
    it("returns 1920g for four 16-inch Standard pizzas", () => {
        const doughBallWeight = calculateDoughBallWeight(16);

        const totalDough = calculateTotalDoughWeight(doughBallWeight, 4);

        expect(totalDough).toBe(1920);
    });

    it("returns 2880g for the canonical six 16-inch pizzas case", () => {
        const doughBallWeight = calculateDoughBallWeight(16);

        const totalDough = calculateTotalDoughWeight(doughBallWeight, 6);

        expect(totalDough).toBe(2880);
    });

    it("scales correctly at the minimum pizza-count boundary of 1", () => {
        const doughBallWeight = calculateDoughBallWeight(16);

        expect(calculateTotalDoughWeight(doughBallWeight, 1)).toBe(480);
    });

    it("scales correctly at the maximum pizza-count boundary of 100", () => {
        const doughBallWeight = calculateDoughBallWeight(16);

        expect(calculateTotalDoughWeight(doughBallWeight, 100)).toBe(48000);
    });

    it("does not change the dough-ball weight when pizza count changes", () => {
        const doughBallWeight = calculateDoughBallWeight(16);

        calculateTotalDoughWeight(doughBallWeight, 1);
        calculateTotalDoughWeight(doughBallWeight, 10);

        expect(doughBallWeight).toBe(480);
    });
});
