import { useEffect, useRef } from "react";
import { getFormattedDateTime } from "../utils/getFormattedDateTime";
import { sendSystemNotification } from "../utils/sendSystemNotification";
import { useStore } from "./useStore";

export const useSendNotifications = ({
  workTimeExceeded,
  restTimeExceeded,
  idleTimeExceeded,
  isWorking,
  isResting,
  isIdle,
  timerReminderInterval,
  waterReminderInterval,
}) => {
  const { telegramConfig, notificationSent, setNotificationSent } = useStore();
  const reminderIntervalRef = useRef(null);
  const waterReminderIntervalRef = useRef(null);

  useEffect(() => {
    const sendNotification = async message => {
      const { botToken, chatId } = telegramConfig;

      if (!botToken || !chatId) return;
      const url = `https://api.telegram.org/bot${botToken}/sendMessage`;

      try {
        const response = await fetch(url, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            chat_id: chatId,
            text: message,
          }),
        });

        if (!response.ok) {
          throw new Error("Failed to send notification");
        }
      } catch (err) {
        console.error("Error sending notification:", err);
      }
    };

    const sendReminderNotification = () => {
      if (!timerReminderInterval || timerReminderInterval <= 0) return;
      const dateTime = getFormattedDateTime();
      let message;

      if (workTimeExceeded && isWorking) {
        message = `Reminder: Your work time has exceeded. It's time to take a break! Current time: ${dateTime}`;
      } else if (restTimeExceeded && isResting) {
        message = `Reminder: Your rest time has exceeded. It's time to get back to work! Current time: ${dateTime}`;
      } else if (idleTimeExceeded && isIdle) {
        message = `Reminder: You've been idle for a while. Consider starting a work or rest session. Current time: ${dateTime}`;
      } else {
        return;
      }

      sendNotification(message);
      sendSystemNotification("Timer Reminder", message);
    };

    const sendWaterReminder = () => {
      const dateTime = getFormattedDateTime();
      const message = `Don't forget to drink water! 💧 Current time: ${dateTime}`;

      sendNotification(message);
      sendSystemNotification("Water Reminder", message);
    };

    if (!reminderIntervalRef.current && timerReminderInterval > 0) {
      reminderIntervalRef.current = setInterval(
        sendReminderNotification,
        timerReminderInterval * 60 * 1000
      );
    }

    if (!waterReminderIntervalRef.current && waterReminderInterval > 0) {
      waterReminderIntervalRef.current = setInterval(
        sendWaterReminder,
        waterReminderInterval * 60 * 1000
      );
    }

    const dateTime = getFormattedDateTime();

    if (workTimeExceeded && !notificationSent.workTime && isWorking) {
      const message = `Work time finished at ${dateTime}. Go for a break!`;

      sendNotification(message);
      sendSystemNotification("Work Time Finished", message);
      setNotificationSent({ ...notificationSent, workTime: true });
    }

    if (restTimeExceeded && !notificationSent.restTime && isResting) {
      const message = `Rest time finished at ${dateTime}. Get back to work!`;

      sendNotification(message);
      sendSystemNotification("Rest Time Finished", message);
      setNotificationSent({ ...notificationSent, restTime: true });
    }

    if (idleTimeExceeded && !notificationSent.idleTime && isIdle) {
      const message = `Idle time finished at ${dateTime}. Timers have been reset.`;

      sendNotification(message);
      sendSystemNotification("Idle Time Finished", message);
      setNotificationSent({ ...notificationSent, idleTime: true });
    }

    return () => {
      if (reminderIntervalRef.current) {
        clearInterval(reminderIntervalRef.current);
        reminderIntervalRef.current = null;
      }
      if (waterReminderIntervalRef.current) {
        clearInterval(waterReminderIntervalRef.current);
        waterReminderIntervalRef.current = null;
      }
    };
  }, [
    idleTimeExceeded,
    isIdle,
    isResting,
    isWorking,
    notificationSent,
    timerReminderInterval,
    waterReminderInterval,
    restTimeExceeded,
    setNotificationSent,
    telegramConfig,
    workTimeExceeded,
  ]);
};
