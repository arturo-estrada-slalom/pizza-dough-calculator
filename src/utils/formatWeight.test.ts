import { describe, it, expect } from "vitest";
import { formatWeight } from "./formatWeight";

describe("formatWeight", () => {
    it("renders whole-gram values without decimals", () => {
        expect(formatWeight(480)).toBe("480");
        expect(formatWeight(2880)).toBe("2880");
    });

    it("renders non-integer values with their significant decimals", () => {
        expect(formatWeight(367.5)).toBe("367.5");
        expect(formatWeight(1692.13)).toBe("1692.13");
    });

    it("drops an insignificant trailing zero after rounding to 2 decimals", () => {
        expect(formatWeight(42.303)).toBe("42.3");
    });

    it("rounds to 2 decimal places", () => {
        expect(formatWeight(6.7685)).toBe("6.77");
    });
});
