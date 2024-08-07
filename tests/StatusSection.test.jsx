import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { StatusSection } from "../src/components/StatusSection";

describe("StatusSection", () => {
  const defaultProps = {
    status: "working",
    faceDetected: true,
    isPaused: false,
  };

  const renderComponent = (props = {}) => {
    return render(<StatusSection {...defaultProps} {...props} />);
  };

  it('renders the correct status with "working" status', () => {
    renderComponent();

    expect(screen.getByText(/Current Status:/)).toBeInTheDocument();
    expect(screen.getByText(/Working/)).toBeInTheDocument();
  });

  it('renders the correct status with "resting" status', () => {
    renderComponent({ status: "resting" });

    expect(screen.getByText(/Current Status:/)).toBeInTheDocument();
    expect(screen.getByText(/Resting/)).toBeInTheDocument();
  });

  it('renders the correct status with "idle" status', () => {
    renderComponent({ status: "idle" });

    expect(screen.getByText(/Current Status:/)).toBeInTheDocument();
    expect(screen.getByText(/Idle/)).toBeInTheDocument();
  });

  it('renders the correct status with "paused" state', () => {
    renderComponent({ isPaused: true });

    expect(screen.getByText(/Current Status:/)).toBeInTheDocument();
    expect(screen.getByText(/Working \(Paused\)/)).toBeInTheDocument();
  });

  it('renders "Face Detected" as Yes when faceDetected is true', () => {
    renderComponent();

    expect(screen.getByText(/Face Detected:/)).toBeInTheDocument();
    expect(screen.getByText(/Yes/)).toBeInTheDocument();
  });

  it('renders "Face Detected" as No when faceDetected is false', () => {
    renderComponent({ faceDetected: false });

    expect(screen.getByText(/Face Detected:/)).toBeInTheDocument();
    expect(screen.getByText(/No/)).toBeInTheDocument();
  });
});
