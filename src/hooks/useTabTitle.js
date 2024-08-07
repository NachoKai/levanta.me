import { useEffect } from "react";

import { formatCounter } from "../utils/formatCounter";
import { useStore } from "./useStore";

export const useTabTitle = ({
  isIdle,
  isWorking,
  isResting,
  workTimeExceeded,
  restTimeExceeded,
  idleTimeExceeded,
}) => {
  const { workTime, restTime, idleTime } = useStore();

  useEffect(() => {
    let title = "Levanta.me";

    if (isIdle) {
      title = "Levanta.me";
    } else if (isWorking) {
      title = workTimeExceeded
        ? `⏰ Time to Rest! - ${formatCounter(workTime)}`
        : `💼 Working - ${formatCounter(workTime)}`;
    } else if (isResting) {
      title = restTimeExceeded
        ? `⏰ Time to Work! - ${formatCounter(restTime)}`
        : `🛌 Resting - ${formatCounter(restTime)}`;
    } else if (idleTimeExceeded) {
      title = `⏰ Idle Time - ${formatCounter(idleTime)}`;
    }

    document.title = title;
  }, [
    idleTime,
    idleTimeExceeded,
    isIdle,
    isResting,
    isWorking,
    restTime,
    restTimeExceeded,
    workTime,
    workTimeExceeded,
  ]);
};
