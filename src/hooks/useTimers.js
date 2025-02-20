import { useEffect } from "react";

import { useStore } from "./useStore";

export const useTimers = ({ isWorking, isResting, isIdle }) => {
  const {
    workTime,
    setWorkTime,
    restTime,
    setRestTime,
    idleTime,
    setIdleTime,
    isPaused,
    faceDetected,
    notificationTimes,
    resetTimers,
    useCamera,
  } = useStore();

  useEffect(() => {
    const interval =
      !isPaused && !isIdle
        ? setInterval(() => {
            if ((useCamera && faceDetected && isWorking) || (!useCamera && isWorking)) {
              setWorkTime(workTime + 1);
              setIdleTime(0);
            } else if (
              (useCamera && !faceDetected && isResting) ||
              (!useCamera && isResting)
            ) {
              setRestTime(restTime + 1);
              setIdleTime(0);
            } else {
              setIdleTime(idleTime + 1);
            }
          }, 950)
        : null;

    return () => clearInterval(interval);
  }, [
    faceDetected,
    idleTime,
    isIdle,
    isPaused,
    isResting,
    isWorking,
    restTime,
    setIdleTime,
    setRestTime,
    setWorkTime,
    workTime,
    useCamera,
  ]);

  useEffect(() => {
    if (idleTime >= notificationTimes.IDLE * 60) {
      resetTimers();
    }
  }, [idleTime, notificationTimes.IDLE, resetTimers]);
};
