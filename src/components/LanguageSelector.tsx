import type { SelectChangeEvent } from "@mui/material/Select";
import { useTranslation } from "react-i18next";
import { isSupportedLanguage } from "../i18n/languages";
import type { SupportedLanguage } from "../i18n/languages";
import { persistLanguage } from "../i18n/languageStorage";
import { LanguageSelect, LanguageMenuItem } from "./LanguageSelector.styled";

// The selector's own option labels intentionally always display each
// language's native name regardless of the active locale and are exempt
// from translation (docs/stories/007-language-localization.md "Language
// Selector").
const LANGUAGE_OPTIONS: { code: SupportedLanguage; label: string }[] = [
  { code: "en-US", label: "🇺🇸 English" },
  { code: "es-MX", label: "🇲🇽 Español" },
];

export function LanguageSelector() {
  const { t, i18n } = useTranslation();
  const activeLanguage: SupportedLanguage = isSupportedLanguage(i18n.language)
    ? i18n.language
    : "en-US";

  const handleChange = (event: SelectChangeEvent<unknown>) => {
    const next = event.target.value;
    if (typeof next !== "string" || !isSupportedLanguage(next)) {
      return;
    }
    if (next === activeLanguage) {
      return;
    }
    void i18n.changeLanguage(next);
    persistLanguage(next);
  };

  return (
    <LanguageSelect
      value={activeLanguage}
      onChange={handleChange}
      size="small"
      inputProps={{ "aria-label": t("languageSelector.ariaLabel") }}
    >
      {LANGUAGE_OPTIONS.map((option) => (
        <LanguageMenuItem key={option.code} value={option.code}>
          {option.label}
        </LanguageMenuItem>
      ))}
    </LanguageSelect>
  );
}
