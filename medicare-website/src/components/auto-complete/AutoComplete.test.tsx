import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { AutocompleteSearchBar } from "./AutoComplete";
import userEvent from "@testing-library/user-event";

describe("AutoComplete", () => {
  it("renders the auto complete component", () => {
    render(
      <AutocompleteSearchBar
        list={[{ id: 1, name: "John Doe", designation: "Doctor" }]}
        onChange={vi.fn()}
      />,
    );
    const inputElement = screen.getByPlaceholderText("Search for a doctor ...");
    expect(inputElement).toBeInTheDocument();
  });
  it("calls the onChange function when user types in the input field", async () => {
    const onChangeMock = vi.fn();
    render(
      <AutocompleteSearchBar
        list={[{ id: 1, name: "John Doe", designation: "Doctor" }]}
        onChange={onChangeMock}
      />,
    );
    const inputElement = screen.getByPlaceholderText("Search for a doctor ...");
    await userEvent.type(inputElement, "John");
    expect(onChangeMock).toHaveBeenCalledWith("John");
  });
  it("filters the list based on user input", async () => {
    render(
      <AutocompleteSearchBar
        list={[{ id: 1, name: "John Doe", designation: "Doctor" }]}
        onChange={vi.fn()}
      />,
    );
    const inputElement = screen.getByPlaceholderText("Search for a doctor ...");
    await userEvent.type(inputElement, "John");
    const optionElement = screen.getByText("John Doe");
    expect(optionElement).toBeInTheDocument();
  });
  it("does not show options that do not match user input", async () => {
    render(
      <AutocompleteSearchBar
        list={[{ id: 1, name: "John Doe", designation: "Doctor" }]}
        onChange={vi.fn()}
      />,
    );
    const inputElement = screen.getByPlaceholderText("Search for a doctor ...");
    await userEvent.type(inputElement, "Jane");
    const optionElement = screen.queryByText("John Doe");
    expect(optionElement).not.toBeInTheDocument();
  });
});
