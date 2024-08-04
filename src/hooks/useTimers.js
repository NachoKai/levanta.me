import { useEffect, useState } from "react";

export const useTimers = (
  isWorking,
  isResting,
  isIdle,
  setStatus,
  faceDetected,
  notificationTimes
) => {
  const [workTime, setWorkTime] = useState(0);
  const [restTime, setRestTime] = useState(0);
  const [idleTime, setIdleTime] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    let interval = null;

    if (isIdle || isPaused) {
      clearInterval(interval);
    } else {
      interval = setInterval(() => {
        if (faceDetected) {
          if (isWorking) {
            setWorkTime(prevTime => prevTime + 1);
            setIdleTime(0);
          } else {
            setIdleTime(prevTime => prevTime + 1);
          }
        } else if (isResting) {
          setRestTime(prevTime => prevTime + 1);
          setIdleTime(0);
        } else {
          setIdleTime(prevTime => prevTime + 1);
        }
      }, 1000);
    }

    if (idleTime >= notificationTimes.IDLE) {
      setStatus("idle");
      setWorkTime(0);
      setRestTime(0);
    }

    return () => clearInterval(interval);
  }, [
    faceDetected,
    idleTime,
    isIdle,
    isPaused,
    isResting,
    isWorking,
    setStatus,
    notificationTimes.IDLE,
  ]);

  const togglePause = () => {
    setIsPaused(prev => !prev);
  };

  return {
    workTime,
    restTime,
    idleTime,
    setWorkTime,
    setRestTime,
    setIdleTime,
    isPaused,
    togglePause,
  };
};
