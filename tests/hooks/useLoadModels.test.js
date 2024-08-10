import { renderHook } from "@testing-library/react";
import * as faceapi from "@vladmandic/face-api";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { useLoadModels } from "../../src/hooks/useLoadModels";
import { useStore } from "../../src/hooks/useStore";

vi.useFakeTimers();

vi.mock("@vladmandic/face-api", () => ({
  nets: {
    tinyFaceDetector: {
      loadFromUri: vi.fn(),
    },
  },
}));

vi.mock("../../src/hooks/useStore", () => ({
  useStore: vi.fn(),
}));

describe("useLoadModels", () => {
  let mockSetModelsLoaded;

  beforeEach(() => {
    mockSetModelsLoaded = vi.fn();

    useStore.mockImplementation(() => ({
      setModelsLoaded: mockSetModelsLoaded,
    }));

    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("should load models and set modelsLoaded to true on success", async () => {
    faceapi.nets.tinyFaceDetector.loadFromUri.mockResolvedValue();
    renderHook(() => useLoadModels());
    await vi.runAllTimersAsync();
    expect(faceapi.nets.tinyFaceDetector.loadFromUri).toHaveBeenCalledWith("/models");
    expect(mockSetModelsLoaded).toHaveBeenCalledWith(true);
  });

  it("should handle errors when loading models fails", async () => {
    const consoleErrorSpy = vi.spyOn(console, "error").mockImplementation(() => {});
    const mockError = new Error("Failed to load models");

    faceapi.nets.tinyFaceDetector.loadFromUri.mockRejectedValue(mockError);
    renderHook(() => useLoadModels());
    await vi.runAllTimersAsync();
    expect(faceapi.nets.tinyFaceDetector.loadFromUri).toHaveBeenCalledWith("/models");
    expect(mockSetModelsLoaded).not.toHaveBeenCalled();
    expect(consoleErrorSpy).toHaveBeenCalledWith("Error loading models:", mockError);
    consoleErrorSpy.mockRestore();
  });

  it("should only attempt to load models once", async () => {
    faceapi.nets.tinyFaceDetector.loadFromUri.mockResolvedValue();
    const { rerender } = renderHook(() => useLoadModels());

    await vi.runAllTimersAsync();
    rerender();
    await vi.runAllTimersAsync();
    expect(faceapi.nets.tinyFaceDetector.loadFromUri).toHaveBeenCalledTimes(1);
    expect(mockSetModelsLoaded).toHaveBeenCalledTimes(1);
  });
});
