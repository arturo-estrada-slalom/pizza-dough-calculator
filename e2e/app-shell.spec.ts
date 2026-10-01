import { test, expect } from "@playwright/test";

// Verifies the full-page background renders the documented "Page background"
// token (#F5F0E8 → rgb(245, 240, 232)) from docs/COLOR_PALETTE.md.
test("renders the documented page background color", async ({ page }) => {
    await page.goto("/");

    const backgroundColor = await page.evaluate(
        () => getComputedStyle(document.body).backgroundColor,
    );

    expect(backgroundColor).toBe("rgb(245, 240, 232)");
});

// Verifies the title uses the "High emphasis" token (#2C1F14) and the
// subtitle uses the "Low emphasis" token (#7A6455) from
// docs/COLOR_PALETTE.md (AC-001-10).
test("renders the title and subtitle in the documented text-emphasis colors", async ({
    page,
}) => {
    await page.goto("/");

    const titleColor = await page
        .getByRole("heading", { name: "Pizza Dough Calculator" })
        .evaluate((el) => getComputedStyle(el).color);
    const subtitleColor = await page
        .getByText("Baker's percentages for home & professional use")
        .evaluate((el) => getComputedStyle(el).color);

    expect(titleColor).toBe("rgb(44, 31, 20)");
    expect(subtitleColor).toBe("rgb(122, 100, 85)");
});
