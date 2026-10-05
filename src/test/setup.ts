import { afterEach } from 'vitest'
import { cleanup } from '@testing-library/react'
import '@testing-library/jest-dom/vitest'
// Initializes i18next once for every test file (docs/stories/007-language-localization.md).
import i18n from '../i18n/i18n'
import { DEFAULT_LANGUAGE } from '../i18n/languages'

afterEach(() => {
  cleanup()
  // Reset the shared i18next instance so language changes made by one
  // test do not leak into the next (docs/TESTING.md).
  void i18n.changeLanguage(DEFAULT_LANGUAGE)
})
