import { fireEvent, render, screen } from "@testing-library/react";
import { MdWorkOutline } from "react-icons/md";
import { describe, expect, it, vi } from "vitest";
import { FormInput } from "../../src/components/InputsSection/FormInput";

describe("FormInput", () => {
  const mockOnChange = vi.fn();

  it("renders correctly with provided props", () => {
    render(
      <FormInput
        icon={MdWorkOutline}
        id="WORK"
        label="Work time (minutes)"
        placeholder="Enter time"
        tooltip="How long you want to work"
        value="50"
        onChange={mockOnChange}
      />
    );

    expect(screen.getByText("Work time (minutes)")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Enter time")).toBeInTheDocument();
  });

  it("calls onChange when input value changes", () => {
    render(
      <FormInput
        icon={MdWorkOutline}
        id="WORK"
        label="Work time (minutes)"
        placeholder="Enter time"
        tooltip="How long you want to work"
        value="50"
        onChange={mockOnChange}
      />
    );

    fireEvent.change(screen.getByPlaceholderText("Enter time"), {
      target: { value: "60" },
    });

    expect(mockOnChange).toHaveBeenCalled();
    expect(mockOnChange).toHaveBeenCalledWith(expect.any(Object)); // Check if called with an event
  });
});
