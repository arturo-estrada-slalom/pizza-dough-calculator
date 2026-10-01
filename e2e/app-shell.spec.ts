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
