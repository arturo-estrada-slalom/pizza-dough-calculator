import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import App from "./App";

describe("<App />", () => {
  it("renders the application header content", () => {
    render(<App />);

    expect(
      screen.getByRole("heading", { name: "Pizza Dough Calculator" }),
    ).toBeInTheDocument();
    expect(
      screen.getByText("Baker's percentages for home & professional use"),
    ).toBeInTheDocument();
  });

  it("renders the Pizza Settings panel", () => {
    render(<App />);

    expect(
      screen.getByRole("heading", { name: "Pizza Settings" }),
    ).toBeInTheDocument();
  });

  it("does not render out-of-scope Dough Ball, Recipe Summary, or Ingredients UI", () => {
    render(<App />);

    expect(screen.queryByText(/Dough Ball/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/Recipe Summary/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/Ingredients/i)).not.toBeInTheDocument();
  });
});
