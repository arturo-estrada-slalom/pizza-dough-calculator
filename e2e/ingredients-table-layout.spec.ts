import { test, expect, type Page } from "@playwright/test";

// Regression coverage for the mobile Ingredients table layout defect
// (docs/stories/006-fix-mobile-ingredient-table-layout.md): calculated
// Weight values (and the Total Dough value) must stay on one line with
// their "g" unit, and the table must remain structurally intact, at the
// 320px minimum supported viewport width. jsdom cannot reproduce real text
// wrapping, so this must be verified in a real browser (docs/TESTING.md
// Section 17).

async function expectSingleLine(page: Page, text: string) {
    const element = page.getByText(text, { exact: true });
    await expect(element).toBeVisible();
    const lineCount = await element.evaluate((el) => el.getClientRects().length);
    expect(lineCount).toBe(1);
}

test("keeps ingredient weights and Total Dough on one line and the table structurally intact at the 320px minimum width", async ({
    page,
}) => {
    await page.setViewportSize({ width: 320, height: 900 });
    await page.goto("/");

    // 13" diameter, Thick thickness, 2 pizzas produce the canonical example
    // values from the story (446.83 g, 277.03 g, 14.75 g, 760.5 g Total
    // Dough).
    const diameterSlider = page.getByRole("slider", { name: "Diameter" });
    await diameterSlider.focus();
    await diameterSlider.press("ArrowLeft"); // 14" -> 13"

    await page.getByRole("button", { name: "Thick" }).click();

    await page
        .getByRole("button", { name: "Decrease number of pizzas" })
        .click();
    await page
        .getByRole("button", { name: "Decrease number of pizzas" })
        .click();

    await expectSingleLine(page, "446.83 g");
    await expectSingleLine(page, "277.03 g");
    await expectSingleLine(page, "14.75 g");
    await expectSingleLine(page, "760.5 g");

    // Three distinct columns remain, headers stay aligned with their data.
    const table = page.getByRole("table", { name: "Ingredients" });
    await expect(table.getByText("Ingredient", { exact: true })).toBeVisible();
    await expect(table.getByText("Weight", { exact: true })).toBeVisible();
    await expect(table.getByText("Baker's %", { exact: true })).toBeVisible();

    // The BASE chip remains associated with the Bread Flour row.
    const breadFlourRow = page.getByRole("row", { name: /Bread Flour/i });
    await expect(breadFlourRow).toContainText("BASE");

    // No page-level horizontal scrolling at the minimum supported width.
    const scrollWidth = await page.evaluate(
        () => document.documentElement.scrollWidth,
    );
    expect(scrollWidth).toBeLessThanOrEqual(320);
});

test("remains structurally intact at 320px for the maximum supported input combination (20in, Thick, 100 pizzas)", async ({
    page,
}) => {
    test.setTimeout(60000);
    await page.setViewportSize({ width: 320, height: 900 });
    await page.goto("/");

    const diameterSlider = page.getByRole("slider", { name: "Diameter" });
    await diameterSlider.focus();
    await diameterSlider.press("End"); // jumps to the 20" maximum

    await page.getByRole("button", { name: "Thick" }).click();

    const increment = page.getByRole("button", {
        name: "Increase number of pizzas",
    });
    for (let i = 0; i < 96; i++) {
        await increment.click();
    }

    // 20" diameter, Thick, 100 pizzas => 52878.97 g flour, 90000 g Total
    // Dough (docs/stories/006-fix-mobile-ingredient-table-layout.md AC-006-08).
    await expectSingleLine(page, "52878.97 g");
    await expectSingleLine(page, "90000 g");

    const scrollWidth = await page.evaluate(
        () => document.documentElement.scrollWidth,
    );
    expect(scrollWidth).toBeLessThanOrEqual(320);
});

test("does not regress the Ingredients table layout at desktop viewport widths", async ({
    page,
}) => {
    await page.setViewportSize({ width: 1280, height: 800 });
    await page.goto("/");

    // Default settings (14", standard, 4 pizzas) produce a 367.5 g dough
    // ball (docs/PROJECT.md), an 863.69 g flour weight, and a 1470 g Total
    // Dough.
    await expectSingleLine(page, "863.69 g");
    await expectSingleLine(page, "1470 g");
});
