import { test, expect } from "@playwright/test";

// Verifies the Dough Ball card uses the documented "Dark surface" background
// (#2C1F14 → rgb(44, 31, 20)) and the dough-ball weight number uses the
// documented "Warm gold" color (#F5C896 → rgb(245, 200, 150)) from
// docs/COLOR_PALETTE.md (AC-003-12).
test("renders the Dough Ball card in the documented dark-surface and warm-gold colors", async ({
    page,
}) => {
    await page.goto("/");

    const card = page.getByRole("region", { name: "Dough Ball result" });
    const cardBackground = await card.evaluate(
        (el) => getComputedStyle(el).backgroundColor,
    );
    expect(cardBackground).toBe("rgb(44, 31, 20)");

    const weightValue = page.getByText("480", { exact: true });
    const weightColor = await weightValue.evaluate(
        (el) => getComputedStyle(el).color,
    );
    expect(weightColor).toBe("rgb(245, 200, 150)");
});

// Verifies the Recipe Summary and Ingredients sections use the documented
// "Card / Paper" background (#FFFCF5 → rgb(255, 252, 245)) from
// docs/COLOR_PALETTE.md (AC-003-13).
test("renders the Recipe Summary and Ingredients sections in the documented card/paper background color", async ({
    page,
}) => {
    await page.goto("/");

    const summaryCard = page.getByRole("region", { name: "Recipe Summary" });
    const summaryBackground = await summaryCard.evaluate(
        (el) => getComputedStyle(el).backgroundColor,
    );
    expect(summaryBackground).toBe("rgb(255, 252, 245)");

    const ingredientsHeading = page.getByRole("heading", {
        name: "Ingredients",
    });
    const ingredientsCard = ingredientsHeading.locator("xpath=..");
    const ingredientsBackground = await ingredientsCard.evaluate(
        (el) => getComputedStyle(el).backgroundColor,
    );
    expect(ingredientsBackground).toBe("rgb(255, 252, 245)");
});

// Verifies the Bread Flour base-ingredient row uses the documented
// "Primary tint" overlay (rgba(184, 92, 42, 0.12)) from
// docs/COLOR_PALETTE.md (AC-003-14).
test("renders the Bread Flour base-ingredient row in the documented primary-tint color", async ({
    page,
}) => {
    await page.goto("/");

    const row = page.getByRole("row", { name: /Bread Flour/i });
    const rowBackground = await row.evaluate(
        (el) => getComputedStyle(el).backgroundColor,
    );
    expect(rowBackground).toBe("rgba(184, 92, 42, 0.12)");
});
