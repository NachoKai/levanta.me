import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { InputsSection } from "../../src/components/InputsSection/InputsSection";

describe("InputsSection", () => {
  const mockHandleInputChange = vi.fn();
  const mockHandleTelegramConfigChange = vi.fn();
  const mockHandleTimerReminderIntervalChange = vi.fn();
  const mockHandleWaterReminderIntervalChange = vi.fn();

  const notificationTimes = {
    WORK: 50,
    IDLE: 10,
    REST: 5,
  };

  const telegramConfig = {
    botToken: "token123",
    chatId: "chat123",
  };

  it("renders all FormInput components correctly", () => {
    render(
      <InputsSection
        handleInputChange={mockHandleInputChange}
        handleTelegramConfigChange={mockHandleTelegramConfigChange}
        handleTimerReminderIntervalChange={mockHandleTimerReminderIntervalChange}
        handleWaterReminderIntervalChange={mockHandleWaterReminderIntervalChange}
        notificationTimes={notificationTimes}
        telegramConfig={telegramConfig}
        timerReminderInterval={5}
        waterReminderInterval={20}
      />
    );

    expect(screen.getByLabelText("Work time (minutes)")).toBeInTheDocument();
    expect(screen.getByLabelText("Idle time (minutes)")).toBeInTheDocument();
    expect(screen.getByLabelText("Rest time (minutes)")).toBeInTheDocument();
    expect(
      screen.getByLabelText("Timer Reminder Interval (minutes)")
    ).toBeInTheDocument();
    expect(
      screen.getByLabelText("Water Reminder Interval (minutes)")
    ).toBeInTheDocument();
    expect(screen.getByLabelText("Telegram Bot Token")).toBeInTheDocument();
    expect(screen.getByLabelText("Telegram Chat ID")).toBeInTheDocument();
  });

  it("calls handleInputChange when any input value changes", () => {
    render(
      <InputsSection
        handleInputChange={mockHandleInputChange}
        handleTelegramConfigChange={mockHandleTelegramConfigChange}
        handleTimerReminderIntervalChange={mockHandleTimerReminderIntervalChange}
        handleWaterReminderIntervalChange={mockHandleWaterReminderIntervalChange}
        notificationTimes={notificationTimes}
        telegramConfig={telegramConfig}
        timerReminderInterval={5}
        waterReminderInterval={20}
      />
    );

    fireEvent.change(screen.getByLabelText("Work time (minutes)"), {
      target: { value: "60" },
    });

    expect(mockHandleInputChange).toHaveBeenCalled();
    expect(mockHandleInputChange).toHaveBeenCalledWith(expect.any(Object));
  });

  it("calls handleTelegramConfigChange when Telegram config input changes", () => {
    render(
      <InputsSection
        handleInputChange={mockHandleInputChange}
        handleTelegramConfigChange={mockHandleTelegramConfigChange}
        handleTimerReminderIntervalChange={mockHandleTimerReminderIntervalChange}
        handleWaterReminderIntervalChange={mockHandleWaterReminderIntervalChange}
        notificationTimes={notificationTimes}
        telegramConfig={telegramConfig}
        timerReminderInterval={5}
        waterReminderInterval={20}
      />
    );

    fireEvent.change(screen.getByLabelText("Telegram Bot Token"), {
      target: { value: "newToken" },
    });

    expect(mockHandleTelegramConfigChange).toHaveBeenCalled();
    expect(mockHandleTelegramConfigChange).toHaveBeenCalledWith(expect.any(Object));
  });

  it("calls handleTimerReminderIntervalChange when timer reminder interval changes", () => {
    render(
      <InputsSection
        handleInputChange={mockHandleInputChange}
        handleTelegramConfigChange={mockHandleTelegramConfigChange}
        handleTimerReminderIntervalChange={mockHandleTimerReminderIntervalChange}
        handleWaterReminderIntervalChange={mockHandleWaterReminderIntervalChange}
        notificationTimes={notificationTimes}
        telegramConfig={telegramConfig}
        timerReminderInterval={5}
        waterReminderInterval={20}
      />
    );

    fireEvent.change(screen.getByLabelText("Timer Reminder Interval (minutes)"), {
      target: { value: "10" },
    });

    expect(mockHandleTimerReminderIntervalChange).toHaveBeenCalled();
    expect(mockHandleTimerReminderIntervalChange).toHaveBeenCalledWith(
      expect.any(Object)
    );
  });

  it("calls handleWaterReminderIntervalChange when water reminder interval changes", () => {
    render(
      <InputsSection
        handleInputChange={mockHandleInputChange}
        handleTelegramConfigChange={mockHandleTelegramConfigChange}
        handleTimerReminderIntervalChange={mockHandleTimerReminderIntervalChange}
        handleWaterReminderIntervalChange={mockHandleWaterReminderIntervalChange}
        notificationTimes={notificationTimes}
        telegramConfig={telegramConfig}
        timerReminderInterval={5}
        waterReminderInterval={20}
      />
    );

    fireEvent.change(screen.getByLabelText("Water Reminder Interval (minutes)"), {
      target: { value: "30" },
    });

    expect(mockHandleWaterReminderIntervalChange).toHaveBeenCalled();
    expect(mockHandleWaterReminderIntervalChange).toHaveBeenCalledWith(
      expect.any(Object)
    );
  });
});
