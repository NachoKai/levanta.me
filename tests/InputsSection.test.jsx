import "@testing-library/jest-dom";
import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { InputsSection } from "../src/components/InputsSection/InputsSection";

describe("InputsSection", () => {
  const mockHandleInputChange = vi.fn();
  const mockHandleTelegramConfigChange = vi.fn();

  const defaultProps = {
    notificationTimes: {
      WORK: 50,
      IDLE: 50,
      REST: 10,
    },
    handleInputChange: mockHandleInputChange,
    telegramConfig: {
      botToken: "",
      chatId: "",
    },
    handleTelegramConfigChange: mockHandleTelegramConfigChange,
  };

  const renderComponent = (props = {}) => {
    return render(<InputsSection {...defaultProps} {...props} />);
  };

  it("renders all input fields with correct labels and values", () => {
    renderComponent();

    expect(screen.getByLabelText("Work time (minutes):")).toHaveValue(50);
    expect(screen.getByLabelText("Idle time (minutes):")).toHaveValue(50);
    expect(screen.getByLabelText("Rest time (minutes):")).toHaveValue(10);
    expect(screen.getByLabelText("Telegram Bot Token:")).toHaveValue("");
    expect(screen.getByLabelText("Telegram Chat ID:")).toHaveValue("");
  });

  it("calls handleInputChange when work time input value changes", () => {
    renderComponent();

    fireEvent.change(screen.getByLabelText("Work time (minutes):"), {
      target: { value: "60" },
    });

    expect(mockHandleInputChange).toHaveBeenCalled();
  });

  it("calls handleTelegramConfigChange when Telegram Bot Token input value changes", () => {
    renderComponent();

    fireEvent.change(screen.getByLabelText("Telegram Bot Token:"), {
      target: { value: "new-token" },
    });

    expect(mockHandleTelegramConfigChange).toHaveBeenCalled();
  });

  it("calls handleTelegramConfigChange when Telegram Chat ID input value changes", () => {
    renderComponent();

    fireEvent.change(screen.getByLabelText("Telegram Chat ID:"), {
      target: { value: "new-chat-id" },
    });

    expect(mockHandleTelegramConfigChange).toHaveBeenCalled();
  });
});
