import i18next from "i18next";
import { initReactI18next } from "react-i18next";
import { en_US } from "./locales/en-US";
import { es_MX } from "./locales/es-MX";
import { DEFAULT_LANGUAGE } from "./languages";
import { resolveInitialLanguage } from "./languageStorage";

// Resolved once at module load: localStorage preference, then browser
// language, then the English default (docs/stories/007-language-localization.md
// "Language Resolution"). The language selector persists subsequent
// explicit changes (see src/components/LanguageSelector.tsx).
void i18next.use(initReactI18next).init({
  resources: {
    "en-US": { translation: en_US },
    "es-MX": { translation: es_MX },
  },
  lng: resolveInitialLanguage(),
  fallbackLng: DEFAULT_LANGUAGE,
  interpolation: {
    // React already escapes rendered values.
    escapeValue: false,
  },
});

export default i18next;
