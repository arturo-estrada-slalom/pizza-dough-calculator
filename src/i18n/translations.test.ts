import { describe, it, expect } from "vitest";
import { en_US } from "./locales/en-US";
import { es_MX } from "./locales/es-MX";

// Recursively collects dotted key paths from a (possibly nested)
// translation resource object, e.g. { a: { b: "x" } } -> ["a.b"].
function collectKeyPaths(
  resource: Record<string, unknown>,
  prefix = "",
): string[] {
  return Object.entries(resource).flatMap(([key, value]) => {
    const path = prefix ? `${prefix}.${key}` : key;
    if (value !== null && typeof value === "object") {
      return collectKeyPaths(value as Record<string, unknown>, path);
    }
    return [path];
  });
}

describe("translation resource key parity", () => {
  it("has an es-MX key for every en-US key", () => {
    const enKeys = collectKeyPaths(en_US);
    const esKeys = new Set(collectKeyPaths(es_MX));

    const missingFromSpanish = enKeys.filter((key) => !esKeys.has(key));

    expect(missingFromSpanish).toEqual([]);
  });

  it("has an en-US key for every es-MX key", () => {
    const esKeys = collectKeyPaths(es_MX);
    const enKeys = new Set(collectKeyPaths(en_US));

    const missingFromEnglish = esKeys.filter((key) => !enKeys.has(key));

    expect(missingFromEnglish).toEqual([]);
  });

  it("has a non-empty string value for every en-US key", () => {
    const enKeys = collectKeyPaths(en_US);

    for (const key of enKeys) {
      const value = key
        .split(".")
        .reduce<unknown>(
          (node, part) => (node as Record<string, unknown>)[part],
          en_US,
        );
      expect(typeof value).toBe("string");
      expect(value).not.toBe("");
    }
  });

  it("has a non-empty string value for every es-MX key", () => {
    const esKeys = collectKeyPaths(es_MX);

    for (const key of esKeys) {
      const value = key
        .split(".")
        .reduce<unknown>(
          (node, part) => (node as Record<string, unknown>)[part],
          es_MX,
        );
      expect(typeof value).toBe("string");
      expect(value).not.toBe("");
    }
  });
});
