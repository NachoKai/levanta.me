export const formatMinutes = timeInSeconds => {
  const minutes = Math.floor(timeInSeconds / 60);
  return `${minutes} minutes`;
};
