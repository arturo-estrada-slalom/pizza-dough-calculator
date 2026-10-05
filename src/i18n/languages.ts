// Single source of truth for the application's supported locales
// (docs/stories/007-language-localization.md). English is the runtime
// fallback locale.
export const SUPPORTED_LANGUAGES = ["en-US", "es-MX"] as const;

export type SupportedLanguage = (typeof SUPPORTED_LANGUAGES)[number];

export const DEFAULT_LANGUAGE: SupportedLanguage = "en-US";

export function isSupportedLanguage(
  value: string | null | undefined,
): value is SupportedLanguage {
  return (SUPPORTED_LANGUAGES as readonly string[]).includes(value ?? "");
}
