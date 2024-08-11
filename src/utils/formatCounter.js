export const formatCounter = time => {
  if (typeof time !== "number" || time < 0) {
    throw new Error("Invalid time input. Expected a non-negative number.");
  }

  const SECONDS_IN_HOUR = 3600;
  const SECONDS_IN_MINUTE = 60;
  const hours = Math.floor(time / SECONDS_IN_HOUR);
  const minutes = Math.floor((time % SECONDS_IN_HOUR) / SECONDS_IN_MINUTE);
  const seconds = time % SECONDS_IN_MINUTE;

  return `${hours.toString().padStart(1, "0")}h ${minutes.toString().padStart(1, "0")}m ${seconds.toString().padStart(1, "0")}s`;
};
