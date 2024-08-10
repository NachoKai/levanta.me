import { renderHook } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { useStore } from "../../src/hooks/useStore";
import { useTabTitle } from "../../src/hooks/useTabTitle";
import { formatCounter } from "../../src/utils/formatCounter";

vi.mock("../../src/utils/formatCounter");

vi.mock("../../src/hooks/useStore", () => ({
  useStore: vi.fn(),
}));

describe("useTabTitle", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    document.title = "";
  });

  it('should set the title to "Levanta.me" when idle', () => {
    useStore.mockReturnValue({
      workTime: 0,
      restTime: 0,
      idleTime: 0,
    });

    renderHook(() => useTabTitle({ isIdle: true, isWorking: false, isResting: false }));

    expect(document.title).toBe("Levanta.me");
  });

  it('should set the title to "💼 Working" with formatted workTime', () => {
    useStore.mockReturnValue({
      workTime: 1000,
      restTime: 0,
      idleTime: 0,
    });
    formatCounter.mockReturnValue("16:40");

    renderHook(() =>
      useTabTitle({
        isIdle: false,
        isWorking: true,
        isResting: false,
        workTimeExceeded: false,
      })
    );

    expect(document.title).toBe("💼 Working - 16:40");
  });

  it('should set the title to "⏰ Time to Rest!" when workTime is exceeded', () => {
    useStore.mockReturnValue({
      workTime: 1000,
      restTime: 0,
      idleTime: 0,
    });
    formatCounter.mockReturnValue("16:40");

    renderHook(() =>
      useTabTitle({
        isIdle: false,
        isWorking: true,
        isResting: false,
        workTimeExceeded: true,
      })
    );

    expect(document.title).toBe("⏰ Time to Rest! - 16:40");
  });

  it('should set the title to "🛌 Resting" with formatted restTime', () => {
    useStore.mockReturnValue({
      workTime: 0,
      restTime: 800,
      idleTime: 0,
    });
    formatCounter.mockReturnValue("13:20");

    renderHook(() =>
      useTabTitle({
        isIdle: false,
        isWorking: false,
        isResting: true,
        restTimeExceeded: false,
      })
    );

    expect(document.title).toBe("🛌 Resting - 13:20");
  });

  it('should set the title to "⏰ Time to Work!" when restTime is exceeded', () => {
    useStore.mockReturnValue({
      workTime: 0,
      restTime: 800,
      idleTime: 0,
    });
    formatCounter.mockReturnValue("13:20");

    renderHook(() =>
      useTabTitle({
        isIdle: false,
        isWorking: false,
        isResting: true,
        restTimeExceeded: true,
      })
    );

    expect(document.title).toBe("⏰ Time to Work! - 13:20");
  });

  it('should set the title to "⏰ Idle Time" when idleTime is exceeded', () => {
    useStore.mockReturnValue({
      workTime: 0,
      restTime: 0,
      idleTime: 600,
    });
    formatCounter.mockReturnValue("10:00");

    renderHook(() =>
      useTabTitle({
        isIdle: false,
        isWorking: false,
        isResting: false,
        idleTimeExceeded: true,
      })
    );

    expect(document.title).toBe("⏰ Idle Time - 10:00");
  });
});
