import { act, renderHook } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { useSendNotifications } from "../../src/hooks/useSendNotifications";
import { useStore } from "../../src/hooks/useStore";
import { sendSystemNotification } from "../../src/utils/sendSystemNotification";

vi.mock("../../src/utils/getFormattedDateTime", () => ({
  getFormattedDateTime: vi.fn(() => "2023-08-09 12:00:00"),
}));

vi.mock("../../src/utils/sendSystemNotification", () => ({
  sendSystemNotification: vi.fn(),
}));

vi.mock("../../src/hooks/useStore", () => ({
  useStore: vi.fn(),
}));

describe("useSendNotifications", () => {
  const mockSetNotificationSent = vi.fn();
  const mockFetch = vi.fn();

  beforeEach(() => {
    window.fetch = mockFetch;

    vi.mocked(useStore).mockReturnValue({
      telegramConfig: { botToken: "mock-token", chatId: "mock-chat-id" },
      notificationSent: { workTime: false, restTime: false, idleTime: false },
      setNotificationSent: mockSetNotificationSent,
    });
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it("should send work time notification when conditions are met", async () => {
    mockFetch.mockResolvedValueOnce({ ok: true });

    const { rerender } = renderHook(({ props }) => useSendNotifications(props), {
      initialProps: {
        props: {
          workTimeExceeded: true,
          restTimeExceeded: false,
          idleTimeExceeded: false,
          isWorking: true,
          isResting: false,
          isIdle: false,
        },
      },
    });

    await act(async () => {
      rerender({
        props: {
          workTimeExceeded: true,
          restTimeExceeded: false,
          idleTimeExceeded: false,
          isWorking: true,
          isResting: false,
          isIdle: false,
        },
      });
    });

    expect(mockFetch).toHaveBeenCalledWith(
      "https://api.telegram.org/botmock-token/sendMessage",
      expect.objectContaining({
        method: "POST",
        body: JSON.stringify({
          chat_id: "mock-chat-id",
          text: "Work time finished at 2023-08-09 12:00:00. Go for a break!",
        }),
      })
    );

    expect(sendSystemNotification).toHaveBeenCalledWith(
      "Work Time Finished",
      "Work time finished at 2023-08-09 12:00:00. Go for a break!"
    );

    expect(mockSetNotificationSent).toHaveBeenCalledWith({
      workTime: true,
      restTime: false,
      idleTime: false,
    });
  });

  it("should handle errors when sending notifications", async () => {
    const consoleErrorSpy = vi.spyOn(console, "error").mockImplementation(() => {});

    mockFetch.mockRejectedValueOnce(new Error("Network error"));

    const { rerender } = renderHook(({ props }) => useSendNotifications(props), {
      initialProps: {
        props: {
          workTimeExceeded: true,
          restTimeExceeded: false,
          idleTimeExceeded: false,
          isWorking: true,
          isResting: false,
          isIdle: false,
        },
      },
    });

    await act(async () => {
      rerender({
        props: {
          workTimeExceeded: true,
          restTimeExceeded: false,
          idleTimeExceeded: false,
          isWorking: true,
          isResting: false,
          isIdle: false,
        },
      });
    });

    expect(consoleErrorSpy).toHaveBeenCalledWith(
      "Error sending notification:",
      expect.any(Error)
    );

    consoleErrorSpy.mockRestore();
  });
});
