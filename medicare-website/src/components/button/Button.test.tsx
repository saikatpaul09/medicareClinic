import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { Button } from "./Button";
import userEvent from "@testing-library/user-event";

describe("Button", () => {
  it("renders correctly", () => {
    render(<Button>Click Me</Button>);
    expect(screen.getByRole("button")).toBeInTheDocument();
  });

  it("handles click events", async () => {
    const onClick = vi.fn();
    render(<Button onClick={onClick}>Click Me</Button>);
    await userEvent.click(screen.getByRole("button"));
    expect(onClick).toHaveBeenCalled();
  });
});

describe("Button with different variants and colors", () => {
  it("renders with outlined variant", () => {
    render(<Button variant="outlined">Outlined Button</Button>);
    expect(screen.getByRole("button")).toHaveClass("MuiButton-outlined");
  });
});

describe("Button with different colors", () => {
  it("renders with primary color", () => {
    render(<Button color="primary">Primary Button</Button>);
    expect(screen.getByRole("button")).toHaveClass("MuiButton-colorPrimary");
  });
});
