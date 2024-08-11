export const sendSystemNotification = async (title, body) => {
  if (!("Notification" in window)) {
    console.warn("This browser does not support system notifications");

    return false;
  }

  if (Notification.permission === "granted") {
    new Notification(title, { body });

    return true;
  }

  if (Notification.permission === "denied") {
    console.warn("Notification permission was denied");

    return false;
  }

  try {
    const permission = await Notification.requestPermission();

    if (permission === "granted") {
      new Notification(title, { body });

      return true;
    }
  } catch (error) {
    console.error("Error requesting notification permission:", error);
  }

  return false;
};
