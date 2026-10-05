import { describe, it, expect } from "vitest";
import i18next from "i18next";
import { initReactI18next } from "react-i18next";

// Verifies the resilience mechanism itself (AC-007-07) using an isolated
// i18next instance with a deliberately incomplete es-MX resource, mirroring
// the same `fallbackLng` configuration used by src/i18n/i18n.ts. The
// application's actual resources are expected to have full key parity
// (see translations.test.ts) — this test only proves the fallback behaves
// correctly if a translation is ever unexpectedly missing.
describe("English runtime fallback", () => {
  it("renders the English translation when the active locale's resource is missing a key", async () => {
    const instance = i18next.createInstance();
    await instance.use(initReactI18next).init({
      resources: {
        "en-US": { translation: { greeting: "Hello" } },
        "es-MX": { translation: {} },
      },
      lng: "es-MX",
      fallbackLng: "en-US",
      interpolation: { escapeValue: false },
    });

    expect(instance.t("greeting")).toBe("Hello");
  });
});
