export const formatMinutes = timeInSeconds => {
  if (typeof timeInSeconds !== "number" || timeInSeconds < 0) {
    throw new Error("Invalid time input. Expected a non-negative number.");
  }

  const minutes = Math.floor(timeInSeconds / 60);
  const hours = Math.floor(minutes / 60);

  if (hours > 0) return `${hours} hour${hours > 1 ? "s" : ""}`;
  if (minutes > 0) return `${minutes} minute${minutes > 1 ? "s" : ""}`;

  return `${timeInSeconds} second${timeInSeconds === 1 ? "" : "s"}`;
};
