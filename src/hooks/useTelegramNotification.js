import { useState } from "react";
import axios from "axios";

export const useTelegramNotification = (botToken, chatId) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const sendNotification = async message => {
    setLoading(true);
    setError(null);

    const url = `https://api.telegram.org/bot${botToken}/sendMessage`;

    try {
      const response = await axios.post(url, {
        chat_id: chatId,
        text: message,
      });

      if (response.data.ok) {
        console.info("Notification sent successfully");
      } else {
        throw new Error("Failed to send notification");
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return { sendNotification, loading, error };
};
