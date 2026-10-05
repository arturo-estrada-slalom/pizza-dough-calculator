import { describe, it, expect, afterEach } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { LanguageSelector } from "./LanguageSelector";
import i18n from "../i18n/i18n";
import { LANGUAGE_STORAGE_KEY } from "../i18n/languageStorage";

describe("<LanguageSelector />", () => {
  afterEach(() => {
    window.localStorage.clear();
  });

  it("renders both language options identified by a flag emoji and each language's own native name", async () => {
    const user = userEvent.setup();
    render(<LanguageSelector />);

    await user.click(screen.getByRole("combobox"));

    expect(
      screen.getByRole("option", { name: "🇺🇸 English" }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("option", { name: "🇲🇽 Español" }),
    ).toBeInTheDocument();
  });

  it("changes the active i18n language and persists it when a different option is selected", async () => {
    const user = userEvent.setup();
    render(<LanguageSelector />);

    await user.click(screen.getByRole("combobox"));
    await user.click(screen.getByRole("option", { name: "🇲🇽 Español" }));

    expect(i18n.language).toBe("es-MX");
    expect(window.localStorage.getItem(LANGUAGE_STORAGE_KEY)).toBe("es-MX");
  });

  it("does not persist a new value when the already-active option is reselected", async () => {
    const user = userEvent.setup();
    render(<LanguageSelector />);

    await user.click(screen.getByRole("combobox"));
    await user.click(screen.getByRole("option", { name: "🇺🇸 English" }));

    expect(i18n.language).toBe("en-US");
    expect(window.localStorage.getItem(LANGUAGE_STORAGE_KEY)).toBeNull();
  });
});
