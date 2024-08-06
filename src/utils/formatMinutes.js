export const formatMinutes = timeInSeconds => {
  const minutes = Math.floor(timeInSeconds / 60);

  if (minutes === 0) return `${timeInSeconds} seconds`;
  if (minutes === 1) return `${minutes} minute`;
  if (minutes > 1) return `${minutes} minutes`;
  if (minutes > 59) return `${Math.floor(minutes / 60)} hour`;

  return `${minutes} minutes`;
};
