import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { StatusSection } from "../src/components/StatusSection/StatusSection";

describe("StatusSection component", () => {
  it("renders the correct status", () => {
    render(<StatusSection faceDetected={true} isPaused={false} status="working" />);
    const statusElement = screen.getByText(/Current Status:/);

    expect(statusElement).toBeInTheDocument();
    const statusValue = screen.getByText("Working");

    expect(statusValue).toBeInTheDocument();
    const statusIcon = screen.getByTestId("status-icon");

    expect(statusIcon).toHaveAttribute("alt", "Current Status");
  });

  it("renders the correct face detection status", () => {
    render(<StatusSection faceDetected={true} isPaused={false} status="working" />);
    const faceDetectedElement = screen.getByText(/Face Detected:/);

    expect(faceDetectedElement).toBeInTheDocument();
    const faceDetectedValue = screen.getByText("Yes");

    expect(faceDetectedValue).toBeInTheDocument();
    const faceIcon = screen.getByTestId("face-icon");

    expect(faceIcon).toHaveAttribute("alt", "Face Detected");
  });

  it("renders the status as paused", () => {
    render(<StatusSection faceDetected={true} isPaused={true} status="working" />);
    const statusValue = screen.getByText("Working (Paused)");

    expect(statusValue).toBeInTheDocument();
  });

  it("renders no face detected", () => {
    render(<StatusSection faceDetected={false} isPaused={false} status="resting" />);
    const faceDetectedValue = screen.getByText("No");

    expect(faceDetectedValue).toBeInTheDocument();
    const faceIcon = screen.getByTestId("face-icon");

    expect(faceIcon).toHaveAttribute("alt", "Face Detected");
  });

  it("renders with default icon when status is not recognized", () => {
    render(<StatusSection faceDetected={true} isPaused={false} status="unknown" />);
    const statusIcon = screen.getByTestId("status-icon");

    expect(statusIcon).toHaveAttribute("alt", "Current Status");
  });
});
