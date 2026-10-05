import { test, expect } from "@playwright/test";

// English/Spanish localization workflow regression coverage
// (docs/stories/007-language-localization.md AC-007-13).

const LANGUAGE_STORAGE_KEY = "pizza-dough-calculator.language";

test.describe("default English display", () => {
  test.use({ locale: "en-US" });

  test("displays English content by default when no stored preference exists", async ({
    page,
  }) => {
    await page.goto("/");

    await expect(
      page.getByRole("heading", { name: "Pizza Dough Calculator" }),
    ).toBeVisible();
    await expect(
      page.getByRole("heading", { name: "Pizza Settings" }),
    ).toBeVisible();
  });
});

test.describe("browser Spanish detection", () => {
  test.use({ locale: "es-MX" });

  test("displays Spanish content when the browser's preferred language is Spanish and no preference is stored", async ({
    page,
  }) => {
    await page.goto("/");

    await expect(
      page.getByRole("heading", { name: "Calculadora de Masa para Pizza" }),
    ).toBeVisible();
    await expect(
      page.getByRole("heading", { name: "Configuración de la Pizza" }),
    ).toBeVisible();
    // Representative translated content: an ingredient name in the table.
    await expect(page.getByText("Harina de Fuerza")).toBeVisible();
  });
});

test.describe("stored preference priority", () => {
  test.use({ locale: "es-MX" });

  test("uses a stored English preference even when the browser language is Spanish", async ({
    page,
    context,
  }) => {
    await context.addInitScript(
      ([key, value]) => window.localStorage.setItem(key, value),
      [LANGUAGE_STORAGE_KEY, "en-US"],
    );

    await page.goto("/");

    await expect(
      page.getByRole("heading", { name: "Pizza Dough Calculator" }),
    ).toBeVisible();
  });
});

test.describe("language switching and persistence", () => {
  test("switches displayed content immediately without a page reload and persists the selection", async ({
    page,
  }) => {
    await page.goto("/");

    await expect(
      page.getByRole("heading", { name: "Pizza Dough Calculator" }),
    ).toBeVisible();

    await page.getByRole("combobox").click();
    await page.getByRole("option", { name: "🇲🇽 Español" }).click();

    await expect(
      page.getByRole("heading", { name: "Calculadora de Masa para Pizza" }),
    ).toBeVisible();

    await page.reload();

    await expect(
      page.getByRole("heading", { name: "Calculadora de Masa para Pizza" }),
    ).toBeVisible();
  });
});

test.describe("calculated results are unaffected by language", () => {
  test("keeps the dough-ball weight unchanged when switching from English to Spanish", async ({
    page,
  }) => {
    await page.goto("/");

    // Default settings (14" diameter, 4 pizzas, Standard) yield 367.5g.
    await expect(page.getByText("367.5", { exact: true })).toBeVisible();

    await page.getByRole("combobox").click();
    await page.getByRole("option", { name: "🇲🇽 Español" }).click();

    await expect(
      page.getByRole("heading", { name: "Configuración de la Pizza" }),
    ).toBeVisible();
    await expect(page.getByText("367.5", { exact: true })).toBeVisible();
  });
});
