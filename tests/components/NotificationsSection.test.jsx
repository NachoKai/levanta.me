import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { NotificationsSection } from "../../src/components/NotificationsSection/NotificationsSection";

describe("NotificationsSection", () => {
  const defaultProps = {
    isWorking: false,
    workTimeExceeded: false,
    isIdle: false,
    idleTimeExceeded: false,
    isResting: false,
    restTimeExceeded: false,
  };

  const renderComponent = (props = {}) => {
    return render(<NotificationsSection {...defaultProps} {...props} />);
  };

  it("does not render anything when no notifications should be shown", () => {
    renderComponent();

    expect(screen.queryByText(/Work time finished/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/Idle time finished/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/Rest time finished/i)).not.toBeInTheDocument();
  });

  it("renders work notification when work time is exceeded", () => {
    renderComponent({ isWorking: true, workTimeExceeded: true });

    expect(screen.getByText(/Work time finished. Go for a break/i)).toBeInTheDocument();
  });

  it("renders idle notification when idle time is exceeded", () => {
    renderComponent({ isIdle: true, idleTimeExceeded: true });

    expect(
      screen.getByText(/Idle time finished. Timers have been reset/i)
    ).toBeInTheDocument();
  });

  it("renders rest notification when rest time is exceeded", () => {
    renderComponent({ isResting: true, restTimeExceeded: true });

    expect(screen.getByText(/Rest time finished. Get back to work/i)).toBeInTheDocument();
  });

  it("renders multiple notifications if conditions are met", () => {
    renderComponent({
      isWorking: true,
      workTimeExceeded: true,
      isIdle: true,
      idleTimeExceeded: true,
      isResting: true,
      restTimeExceeded: true,
    });

    expect(screen.getByText(/Work time finished. Go for a break/i)).toBeInTheDocument();
    expect(
      screen.getByText(/Idle time finished. Timers have been reset/i)
    ).toBeInTheDocument();
    expect(screen.getByText(/Rest time finished. Get back to work/i)).toBeInTheDocument();
  });
});
