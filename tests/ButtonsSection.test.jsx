import "@testing-library/jest-dom";
import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { ButtonsSection } from "../src/components/ButtonsSection/ButtonsSection";

describe("ButtonsSection", () => {
  const mockStartWorking = vi.fn();
  const mockStartResting = vi.fn();
  const mockTogglePause = vi.fn();
  const mockResetTimers = vi.fn();

  const renderComponent = props => {
    return render(
      <ButtonsSection
        resetTimers={mockResetTimers}
        startResting={mockStartResting}
        startWorking={mockStartWorking}
        togglePause={mockTogglePause}
        {...props}
      />
    );
  };

  it("renders all buttons correctly", () => {
    renderComponent({
      isWorking: false,
      isResting: false,
      isIdle: false,
      isPaused: false,
    });

    expect(screen.getByText("Work")).toBeInTheDocument();
    expect(screen.getByText("Rest")).toBeInTheDocument();
    expect(screen.getByText("Pause")).toBeInTheDocument();
    expect(screen.getByText("Reset")).toBeInTheDocument();
  });

  it("disables buttons based on props", () => {
    renderComponent({
      isWorking: true,
      isResting: true,
      isIdle: true,
      isPaused: true,
    });

    expect(screen.getByText("Work")).toBeDisabled();
    expect(screen.getByText("Rest")).toBeDisabled();
    expect(screen.getByText("Reset")).toBeDisabled();
  });

  it("calls the correct function on button click", () => {
    renderComponent({
      isWorking: false,
      isResting: false,
      isIdle: false,
      isPaused: false,
    });

    fireEvent.click(screen.getByText("Work"));
    fireEvent.click(screen.getByText("Rest"));
    fireEvent.click(screen.getByText("Pause"));
    fireEvent.click(screen.getByText("Reset"));

    expect(mockStartWorking).toHaveBeenCalledTimes(1);
    expect(mockStartResting).toHaveBeenCalledTimes(1);
    expect(mockTogglePause).toHaveBeenCalledTimes(1);
    expect(mockResetTimers).toHaveBeenCalledTimes(1);
  });

  it('renders "Play" instead of "Pause" when isPaused is true', () => {
    renderComponent({
      isWorking: false,
      isResting: false,
      isIdle: false,
      isPaused: true,
    });

    expect(screen.getByText("Play")).toBeInTheDocument();
    expect(screen.queryByText("Pause")).not.toBeInTheDocument();
  });
});
