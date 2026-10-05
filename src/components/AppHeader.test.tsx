import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { AppHeader } from "./AppHeader";
import { en_US } from "../i18n/locales/en-US";
import { es_MX } from "../i18n/locales/es-MX";

describe("<AppHeader />", () => {
  it("displays the application title", () => {
    render(<AppHeader />);

    expect(
      screen.getByRole("heading", { name: en_US.app.title }),
    ).toBeInTheDocument();
  });

  it("displays the application subtitle", () => {
    render(<AppHeader />);

    expect(screen.getByText(en_US.app.subtitle)).toBeInTheDocument();
  });

  it("displays a pizza icon/branding element adjacent to the title", () => {
    render(<AppHeader />);

    expect(screen.getByText("🍕")).toBeInTheDocument();
  });

  it("renders a language selector offering English and Español", async () => {
    const user = userEvent.setup();
    render(<AppHeader />);

    await user.click(screen.getByRole("combobox"));

    expect(
      screen.getByRole("option", { name: "🇺🇸 English" }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("option", { name: "🇲🇽 Español" }),
    ).toBeInTheDocument();
  });

  it("switches the displayed title and subtitle to Spanish without a page reload when Español is selected", async () => {
    const user = userEvent.setup();
    render(<AppHeader />);

    await user.click(screen.getByRole("combobox"));
    await user.click(screen.getByRole("option", { name: "🇲🇽 Español" }));

    expect(
      screen.getByRole("heading", { name: es_MX.app.title }),
    ).toBeInTheDocument();
    expect(screen.getByText(es_MX.app.subtitle)).toBeInTheDocument();
  });
});
