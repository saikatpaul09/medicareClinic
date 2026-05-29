import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { TextField } from "./TextField";
import userEvent from "@testing-library/user-event";

describe("TextField", () => {
  it("renders correctly", () => {
    render(<TextField label="Test Label" />);
    expect(screen.getByLabelText("Test Label")).toBeInTheDocument();
  });
});

describe("TextField with different variants", () => {
  it("renders with outlined variant", () => {
    render(<TextField label="Outlined Field" variant="outlined" />);
    expect(screen.getByLabelText("Outlined Field")).toHaveClass(
      "MuiOutlinedInput-input",
    );
  });
});

describe("TextField with value and onChange props", () => {
  it("updates value on change", async () => {
    const handleChange = vi.fn();
    render(<TextField label="Test Field" value="" onChange={handleChange} />);
    const input = screen.getByLabelText("Test Field");
    await userEvent.type(input, "New Value");
    expect(handleChange).toHaveBeenCalledTimes(9);
  });
});
