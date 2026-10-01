import { describe, it, expect } from "vitest";
import { theme, pizzaIconBackground } from "./theme";

describe("theme", () => {
    it("uses the documented page background and card/paper colors", () => {
        expect(theme.palette.background.default).toBe("#F5F0E8");
        expect(theme.palette.background.paper).toBe("#FFFCF5");
    });

    it("uses the documented primary (terracotta) colors", () => {
        expect(theme.palette.primary.main).toBe("#B85C2A");
        expect(theme.palette.primary.dark).toBe("#9E4D22");
    });

    it("uses the documented text emphasis colors", () => {
        expect(theme.palette.text.primary).toBe("#2C1F14");
        expect(theme.palette.text.secondary).toBe("#7A6455");
    });

    it("uses the documented divider color", () => {
        expect(theme.palette.divider).toBe("rgba(74,55,40,0.10)");
    });

    it("uses a documented primary-tint overlay for the pizza icon background", () => {
        expect(pizzaIconBackground).toBe("rgba(184, 92, 42, 0.12)");
    });
});
