import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { TimersSection } from "../../src/components/TimersSection/TimersSection";

describe("TimersSection", () => {
  const defaultProps = {
    workTime: 1500,
    restTime: 300,
    idleTime: 600,
  };

  it("renders the correct labels and formatted times", () => {
    render(<TimersSection {...defaultProps} />);

    expect(screen.getByText(/Work Time/i)).toBeInTheDocument();
    expect(screen.getByText(/Idle Time/i)).toBeInTheDocument();
    expect(screen.getByText(/Rest Time/i)).toBeInTheDocument();

    expect(screen.getByText("0h 25m 0s")).toBeInTheDocument(); // 1500 seconds = 0h 25m 0s
    expect(screen.getByText("0h 10m 0s")).toBeInTheDocument(); // 600 seconds = 0h 10m 0s
    expect(screen.getByText("0h 5m 0s")).toBeInTheDocument(); // 300 seconds = 0h 5m 0s
  });

  it("renders the correct icons for each timer", () => {
    render(<TimersSection {...defaultProps} />);

    expect(screen.getByTestId("work-icon")).toBeInTheDocument();
    expect(screen.getByTestId("idle-icon")).toBeInTheDocument();
    expect(screen.getByTestId("rest-icon")).toBeInTheDocument();
  });
});
