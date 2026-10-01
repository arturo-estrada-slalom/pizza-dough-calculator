import { test, expect } from "@playwright/test";

// Verifies the Pizza Settings card uses the documented "Card / Paper"
// background token (#FFFCF5 → rgb(255, 252, 245)) from
// docs/COLOR_PALETTE.md (AC-002-18).
test("renders the Pizza Settings card in the documented card/paper background color", async ({
    page,
}) => {
    await page.goto("/");

    const heading = page.getByRole("heading", { name: "Pizza Settings" });
    const card = heading.locator("xpath=..");

    const backgroundColor = await card.evaluate(
        (el) => getComputedStyle(el).backgroundColor,
    );

    expect(backgroundColor).toBe("rgb(255, 252, 245)");
});

// Verifies the diameter slider and the selected "Standard" thickness option
// use the documented Primary (terracotta) token (#B85C2A →
// rgb(184, 92, 42)) from docs/COLOR_PALETTE.md (AC-002-17).
test("renders the diameter slider and selected thickness option in the documented primary color", async ({
    page,
}) => {
    await page.goto("/");

    const sliderThumb = page.locator(".MuiSlider-thumb");
    const thumbColor = await sliderThumb.evaluate(
        (el) => getComputedStyle(el).backgroundColor,
    );
    expect(thumbColor).toBe("rgb(184, 92, 42)");

    const standardOption = page.getByRole("button", { name: "Standard" });
    const selectedColor = await standardOption.evaluate(
        (el) => getComputedStyle(el).backgroundColor,
    );
    expect(selectedColor).toBe("rgb(184, 92, 42)");
});
