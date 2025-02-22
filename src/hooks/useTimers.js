import { useEffect, useRef } from "react";

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

  const startTimeRef = useRef(null);

  useEffect(() => {
    if (!isPaused && !isIdle) {
      startTimeRef.current = new Date();
    }

    const interval =
      !isPaused && !isIdle
        ? setInterval(() => {
            const currentTime = new Date();
            const elapsedTime = Math.floor(currentTime - startTimeRef.current) / 1000;

            if ((useCamera && faceDetected && isWorking) || (!useCamera && isWorking)) {
              setWorkTime(workTime + elapsedTime);
              setIdleTime(0);
            } else if (
              (useCamera && !faceDetected && isResting) ||
              (!useCamera && isResting)
            ) {
              setRestTime(restTime + elapsedTime);
              setIdleTime(0);
            } else {
              setIdleTime(idleTime + elapsedTime);
            }

            startTimeRef.current = currentTime;
          }, 100)
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
