import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import {
  LANGUAGE_STORAGE_KEY,
  persistLanguage,
  resolveInitialLanguage,
} from "./languageStorage";

function setBrowserLanguages(languages: string[]) {
  vi.stubGlobal("navigator", {
    ...navigator,
    language: languages[0] ?? "",
    languages,
  });
}

describe("resolveInitialLanguage", () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  afterEach(() => {
    window.localStorage.clear();
    vi.unstubAllGlobals();
  });

  it("uses a valid stored language regardless of browser language", () => {
    window.localStorage.setItem(LANGUAGE_STORAGE_KEY, "es-MX");
    setBrowserLanguages(["en-US"]);

    expect(resolveInitialLanguage()).toBe("es-MX");
  });

  it("falls back to browser-language detection when no preference is stored", () => {
    setBrowserLanguages(["es-MX"]);

    expect(resolveInitialLanguage()).toBe("es-MX");
  });

  it("resolves Spanish variants other than es-MX (es-ES, es-AR, bare es) to es-MX", () => {
    for (const locale of ["es-ES", "es-AR", "es"]) {
      setBrowserLanguages([locale]);
      expect(resolveInitialLanguage()).toBe("es-MX");
    }
  });

  it("defaults to en-US for a non-Spanish, non-English browser language", () => {
    setBrowserLanguages(["fr-FR"]);

    expect(resolveInitialLanguage()).toBe("en-US");
  });

  it("does not fail and falls back to browser detection when localStorage contains an invalid value", () => {
    window.localStorage.setItem(LANGUAGE_STORAGE_KEY, "de-DE");
    setBrowserLanguages(["es-MX"]);

    expect(resolveInitialLanguage()).toBe("es-MX");
  });

  it("treats a localStorage read failure the same as no stored preference", () => {
    const getItemSpy = vi
      .spyOn(window.localStorage.__proto__, "getItem")
      .mockImplementation(() => {
        throw new Error("storage unavailable");
      });
    setBrowserLanguages(["es-MX"]);

    expect(() => resolveInitialLanguage()).not.toThrow();
    expect(resolveInitialLanguage()).toBe("es-MX");

    getItemSpy.mockRestore();
  });
});

describe("persistLanguage", () => {
  afterEach(() => {
    window.localStorage.clear();
  });

  it("stores the supported locale code under the documented storage key", () => {
    persistLanguage("es-MX");

    expect(window.localStorage.getItem(LANGUAGE_STORAGE_KEY)).toBe("es-MX");
  });

  it("does not throw when localStorage write fails", () => {
    const setItemSpy = vi
      .spyOn(window.localStorage.__proto__, "setItem")
      .mockImplementation(() => {
        throw new Error("storage unavailable");
      });

    expect(() => persistLanguage("en-US")).not.toThrow();

    setItemSpy.mockRestore();
  });
});
