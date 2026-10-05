import { DEFAULT_LANGUAGE, isSupportedLanguage } from "./languages";
import type { SupportedLanguage } from "./languages";

// Chosen localStorage key and stored-value representation (documented for
// QA per docs/stories/007-language-localization.md "Language Resolution"):
// the raw stored value is one of the supported locale codes themselves
// (e.g. "en-US" or "es-MX"), with no additional wrapping/serialization.
export const LANGUAGE_STORAGE_KEY = "pizza-dough-calculator.language";

// localStorage can be unavailable or throw (private browsing, storage
// disabled); treat that the same as "no stored preference" rather than
// failing the application (docs/stories/007-language-localization.md
// "Edge Cases").
function readStoredLanguage(): SupportedLanguage | null {
  try {
    const stored = window.localStorage.getItem(LANGUAGE_STORAGE_KEY);
    return isSupportedLanguage(stored) ? stored : null;
  } catch {
    return null;
  }
}

export function persistLanguage(language: SupportedLanguage): void {
  try {
    window.localStorage.setItem(LANGUAGE_STORAGE_KEY, language);
  } catch {
    // Ignore storage failures; the selection still applies for the
    // current session via the in-memory i18next instance.
  }
}

function detectBrowserLanguage(): SupportedLanguage {
  const browserLanguages =
    typeof navigator !== "undefined"
      ? (navigator.languages ?? [navigator.language])
      : [];

  const hasSpanishPreference = browserLanguages.some((language) =>
    language?.toLowerCase().startsWith("es"),
  );

  return hasSpanishPreference ? "es-MX" : DEFAULT_LANGUAGE;
}

// Language resolution priority order (docs/stories/007-language-localization.md
// "Language Resolution"): stored preference, then browser language, then the
// English default.
export function resolveInitialLanguage(): SupportedLanguage {
  return readStoredLanguage() ?? detectBrowserLanguage();
}
