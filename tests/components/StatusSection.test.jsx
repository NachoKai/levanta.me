import { ChakraProvider } from "@chakra-ui/react";
import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { StatusSection } from "../../src/components/StatusSection/StatusSection";

describe("StatusSection", () => {
  const mockStatus = "working";
  const mockFaceDetected = true;
  const mockIsPaused = false;

  it("renders the StatusSection component with the correct status", () => {
    render(
      <ChakraProvider>
        <StatusSection
          faceDetected={mockFaceDetected}
          isPaused={mockIsPaused}
          status={mockStatus}
        />
      </ChakraProvider>
    );

    const statusItem = screen.getByText(/Current Status/i);

    expect(statusItem).toBeInTheDocument();

    const statusValue = screen.getByText("Working");

    expect(statusValue).toBeInTheDocument();
  });

  it("renders the face detection status correctly", () => {
    render(
      <ChakraProvider>
        <StatusSection
          faceDetected={mockFaceDetected}
          isPaused={mockIsPaused}
          status={mockStatus}
        />
      </ChakraProvider>
    );

    const faceDetectionItem = screen.getByText(/Face Detected/i);

    expect(faceDetectionItem).toBeInTheDocument();

    const faceDetectionValue = screen.getByText("Yes");

    expect(faceDetectionValue).toBeInTheDocument();
  });

  it("renders paused status correctly", () => {
    render(
      <ChakraProvider>
        <StatusSection
          faceDetected={mockFaceDetected}
          isPaused={true}
          status={mockStatus}
        />
      </ChakraProvider>
    );

    const pausedStatusValue = screen.getByText("Working (Paused)");

    expect(pausedStatusValue).toBeInTheDocument();
  });
});
