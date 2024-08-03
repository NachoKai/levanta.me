import { useEffect, useState } from "react";

import { NOTIFICATION_TIMES } from "../consts";

export const useTimers = (status, setStatus, faceDetected) => {
  const [workTime, setWorkTime] = useState(0);
  const [restTime, setRestTime] = useState(0);
  const [staleTime, setStaleTime] = useState(0);

  useEffect(() => {
    let interval = null;

    if (status === "idle") {
      clearInterval(interval);
    } else {
      interval = setInterval(() => {
        if (faceDetected) {
          if (status === "working") {
            setWorkTime(prevTime => prevTime + 1);
            setStaleTime(0);
          } else {
            setStaleTime(prevTime => prevTime + 1);
          }
        } else if (status === "resting") {
          setRestTime(prevTime => prevTime + 1);
          setStaleTime(0);
        } else {
          setStaleTime(prevTime => prevTime + 1);
        }
      }, 1000);
    }

    if (staleTime >= NOTIFICATION_TIMES.STALE) {
      setStatus("idle");
      setWorkTime(0);
      setRestTime(0);
    }

    return () => clearInterval(interval);
  }, [status, faceDetected, staleTime, setStatus]);

  return { workTime, restTime, staleTime, setWorkTime, setRestTime, setStaleTime };
};
