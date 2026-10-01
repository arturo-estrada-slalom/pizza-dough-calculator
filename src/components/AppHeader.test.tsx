import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { AppHeader } from "./AppHeader";

describe("<AppHeader />", () => {
  it("displays the application title", () => {
    render(<AppHeader />);

    expect(
      screen.getByRole("heading", { name: "Pizza Dough Calculator" }),
    ).toBeInTheDocument();
  });

  it("displays the application subtitle", () => {
    render(<AppHeader />);

    expect(
      screen.getByText("Baker's percentages for home & professional use"),
    ).toBeInTheDocument();
  });

  it("displays a pizza icon/branding element adjacent to the title", () => {
    render(<AppHeader />);

    expect(screen.getByText("🍕")).toBeInTheDocument();
  });
});
