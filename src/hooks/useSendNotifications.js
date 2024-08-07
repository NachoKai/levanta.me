import { useEffect } from "react";

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
}) => {
  const { telegramConfig, notificationSent, setNotificationSent } = useStore();

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

    if (!(idleTimeExceeded && !notificationSent.idleTime && isIdle)) return;
    const message = `Idle time finished at ${dateTime}. Timers have been reset.`;

    sendNotification(message);
    sendSystemNotification("Idle Time Finished", message);
    setNotificationSent({ ...notificationSent, idleTime: true });
  }, [
    idleTimeExceeded,
    isIdle,
    isResting,
    isWorking,
    notificationSent,
    restTimeExceeded,
    setNotificationSent,
    telegramConfig,
    workTimeExceeded,
  ]);
};
