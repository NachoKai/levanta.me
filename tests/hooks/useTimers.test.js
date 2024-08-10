import { act, renderHook } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { useStore } from "../../src/hooks/useStore";
import { useTimers } from "../../src/hooks/useTimers";

vi.mock("../../src/hooks/useStore", () => ({
  useStore: vi.fn(),
}));

describe("useTimers", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("should increase workTime and reset idleTime when working and face detected", () => {
    const setWorkTime = vi.fn();
    const setIdleTime = vi.fn();

    useStore.mockReturnValue({
      workTime: 10,
      restTime: 0,
      idleTime: 5,
      isPaused: false,
      faceDetected: true,
      setWorkTime,
      setIdleTime,
      setRestTime: vi.fn(),
      notificationTimes: { IDLE: 10 },
      resetTimers: vi.fn(),
    });

    renderHook(() => useTimers({ isWorking: true, isResting: false, isIdle: false }));

    act(() => {
      vi.advanceTimersByTime(950);
    });

    expect(setWorkTime).toHaveBeenCalledWith(11);
    expect(setIdleTime).toHaveBeenCalledWith(0);
  });

  it("should increase restTime and reset idleTime when resting and face not detected", () => {
    const setRestTime = vi.fn();
    const setIdleTime = vi.fn();

    useStore.mockReturnValue({
      workTime: 0,
      restTime: 5,
      idleTime: 3,
      isPaused: false,
      faceDetected: false,
      setWorkTime: vi.fn(),
      setRestTime,
      setIdleTime,
      notificationTimes: { IDLE: 10 },
      resetTimers: vi.fn(),
    });

    renderHook(() => useTimers({ isWorking: false, isResting: true, isIdle: false }));

    act(() => {
      vi.advanceTimersByTime(950);
    });

    expect(setRestTime).toHaveBeenCalledWith(6);
    expect(setIdleTime).toHaveBeenCalledWith(0);
  });

  it("should reset timers when idleTime exceeds notification limit", () => {
    const resetTimers = vi.fn();

    useStore.mockReturnValue({
      workTime: 0,
      restTime: 0,
      idleTime: 10 * 60,
      isPaused: false,
      faceDetected: true,
      setWorkTime: vi.fn(),
      setRestTime: vi.fn(),
      setIdleTime: vi.fn(),
      notificationTimes: { IDLE: 10 },
      resetTimers,
    });

    renderHook(() => useTimers({ isWorking: false, isResting: false, isIdle: true }));

    act(() => {
      vi.advanceTimersByTime(950);
    });

    expect(resetTimers).toHaveBeenCalled();
  });

  it("should not increase any time when paused", () => {
    const setWorkTime = vi.fn();
    const setRestTime = vi.fn();
    const setIdleTime = vi.fn();

    useStore.mockReturnValue({
      workTime: 5,
      restTime: 5,
      idleTime: 5,
      isPaused: true,
      faceDetected: true,
      setWorkTime,
      setRestTime,
      setIdleTime,
      notificationTimes: { IDLE: 10 },
      resetTimers: vi.fn(),
    });

    renderHook(() => useTimers({ isWorking: true, isResting: false, isIdle: false }));

    act(() => {
      vi.advanceTimersByTime(950);
    });

    expect(setWorkTime).not.toHaveBeenCalled();
    expect(setRestTime).not.toHaveBeenCalled();
    expect(setIdleTime).not.toHaveBeenCalled();
  });
});
