import { test, expect, type Page, type Locator } from "@playwright/test";

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

// Containment check per docs/TESTING.md Section 17: an element's bounding
// rect must stay within its containing element's bounds. Used to confirm a
// column's header/data isn't clipped outside the visible, unscrolled table
// container (the specific gap in E2E coverage identified by QA).
async function expectContainedWithin(child: Locator, container: Locator) {
    const [childBox, containerBox] = await Promise.all([
        child.boundingBox(),
        container.boundingBox(),
    ]);
    expect(childBox).not.toBeNull();
    expect(containerBox).not.toBeNull();
    const epsilon = 1;
    expect(childBox!.x).toBeGreaterThanOrEqual(containerBox!.x - epsilon);
    expect(childBox!.y).toBeGreaterThanOrEqual(containerBox!.y - epsilon);
    expect(childBox!.x + childBox!.width).toBeLessThanOrEqual(
        containerBox!.x + containerBox!.width + epsilon,
    );
    expect(childBox!.y + childBox!.height).toBeLessThanOrEqual(
        containerBox!.y + containerBox!.height + epsilon,
    );
}

test("fits the Ingredients table within its card at the 320px minimum width with default settings, with no column clipped", async ({
    page,
}) => {
    await page.setViewportSize({ width: 320, height: 900 });
    await page.goto("/");

    // Default settings (14", standard, 4 pizzas) must not require the
    // contained-scroll fallback at all: the table should fit its card
    // without any horizontal overflow.
    const tableContainer = page
        .getByRole("table", { name: "Ingredients" })
        .locator("xpath=..");
    const overflow = await tableContainer.evaluate(
        (el) => el.scrollWidth - el.clientWidth,
    );
    expect(overflow).toBe(0);

    // No header or data cell is clipped outside the (unscrolled) container.
    const table = page.getByRole("table", { name: "Ingredients" });
    for (const name of ["Ingredient", "Weight", "Baker's %"]) {
        await expectContainedWithin(
            table.getByText(name, { exact: true }),
            tableContainer,
        );
    }
    await expectContainedWithin(table.getByText("100%", { exact: true }), tableContainer);

    // No page-level horizontal scrolling.
    const scrollWidth = await page.evaluate(
        () => document.documentElement.scrollWidth,
    );
    expect(scrollWidth).toBeLessThanOrEqual(320);
});

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

    // Three distinct columns remain, headers stay aligned with their data,
    // and none of them is clipped outside the (unscrolled) table container.
    const table = page.getByRole("table", { name: "Ingredients" });
    const tableContainer = table.locator("xpath=..");
    for (const name of ["Ingredient", "Weight", "Baker's %"]) {
        const header = table.getByText(name, { exact: true });
        await expect(header).toBeVisible();
        await expectContainedWithin(header, tableContainer);
    }

    // The canonical scenario also fits without needing the contained-scroll
    // fallback.
    const overflow = await tableContainer.evaluate(
        (el) => el.scrollWidth - el.clientWidth,
    );
    expect(overflow).toBe(0);

    // The BASE chip remains associated with the Bread Flour row.
    const breadFlourRow = page.getByRole("row", { name: /Bread Flour/i });
    await expect(breadFlourRow).toContainText("BASE");

    // No page-level horizontal scrolling at the minimum supported width.
    const scrollWidth = await page.evaluate(
        () => document.documentElement.scrollWidth,
    );
    expect(scrollWidth).toBeLessThanOrEqual(320);
});

test("remains structurally intact and reachable at 320px for the maximum supported input combination (20in, Thick, 100 pizzas)", async ({
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

    // The maximum-length scenario may rely on the contained-scroll fallback
    // (see docs/stories/006-fix-mobile-ingredient-table-layout.md), but every
    // column must remain reachable without permanent clipping: scrolling the
    // table container fully right must fully reveal the last column.
    const table = page.getByRole("table", { name: "Ingredients" });
    const tableContainer = table.locator("xpath=..");
    await tableContainer.evaluate((el) => {
        el.scrollLeft = el.scrollWidth;
    });
    await expectContainedWithin(
        table.getByText("Baker's %", { exact: true }),
        tableContainer,
    );

    // No page-level horizontal scrolling, regardless of the table's own
    // internal (contained) scroll position.
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
