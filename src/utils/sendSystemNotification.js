export const sendSystemNotification = (title, body) => {
  if (!("Notification" in window)) {
    console.info("This browser does not support system notifications");
    return;
  }

  if (Notification.permission === "granted") {
    new Notification(title, { body });
  } else if (Notification.permission !== "denied") {
    Notification.requestPermission().then(permission => {
      if (permission === "granted") {
        new Notification(title, { body });
      }
    });
  }
};
