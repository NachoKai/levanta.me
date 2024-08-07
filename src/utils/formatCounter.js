export const formatCounter = time => {
  const hours = Math.floor(time / 3600);
  const minutes = Math.floor(time / 60);
  const seconds = time % 60;

  return `${hours}h ${minutes}m ${seconds}s`;
};
