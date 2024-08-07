import { Flex } from "@chakra-ui/react";
import * as faceapi from "@vladmandic/face-api";
import { useEffect, useLayoutEffect, useRef } from "react";

import { ButtonsSection } from "./components/ButtonsSection";
import { InputsSection } from "./components/InputsSection";
import { NotificationsSection } from "./components/NotificationsSection";
import { StatusSection } from "./components/StatusSection";
import { TimersSection } from "./components/TimersSection";
import { VideoSection } from "./components/VideoSection";
import { useStore } from "./hooks/useStore";
import { formatCounter } from "./utils/formatCounter";
import { getFormattedDateTime } from "./utils/getFormattedDateTime";
import { sendSystemNotification } from "./utils/sendSystemNotification";

const App = () => {
  const {
    workTime,
    setWorkTime,
    restTime,
    setRestTime,
    idleTime,
    setIdleTime,
    isPaused,
    modelsLoaded,
    setModelsLoaded,
    faceDetected,
    setFaceDetected,
    telegramConfig,
    status,
    notificationSent,
    setNotificationSent,
    notificationTimes,
    resetTimers,
    startResting,
    startWorking,
    togglePause,
    handleInputChange,
    handleTelegramConfigChange,
  } = useStore();
  const videoRef = useRef();
  const canvasRef = useRef();
  const isWorking = status === "working";
  const isResting = status === "resting";
  const isIdle = status === "idle";
  const workTimeExceeded = notificationTimes.WORK ? workTime >= notificationTimes.WORK * 60 : false;
  const restTimeExceeded = notificationTimes.REST ? restTime >= notificationTimes.REST * 60 : false;
  const idleTimeExceeded = notificationTimes.IDLE ? idleTime >= notificationTimes.IDLE * 60 : false;

  useEffect(() => {
    const loadModels = async () => {
      try {
        await faceapi.nets.tinyFaceDetector.loadFromUri("/models");
        setModelsLoaded(true);
      } catch (error) {
        console.error("Error loading models:", error);
      }
    };

    loadModels();
  }, [setModelsLoaded]);

  useEffect(() => {
    if (!modelsLoaded) return;

    navigator.mediaDevices
      .getUserMedia({ video: {} })
      .then(stream => {
        videoRef.current.srcObject = stream;
      })
      .catch(err => console.error(err));

    const interval = setInterval(async () => {
      const video = videoRef.current;
      const canvas = canvasRef.current;

      if (!canvas || !video) return;

      const detection = await faceapi.detectSingleFace(
        video,
        new faceapi.TinyFaceDetectorOptions({
          inputSize: 160,
          scoreThreshold: 0.3,
        })
      );

      setFaceDetected(!!detection);

      if (!detection) return;
      const displaySize = {
        width: video.clientWidth,
        height: video.clientHeight,
      };
      const dimensions = faceapi.matchDimensions(canvas, displaySize, true);
      const resizedDetection = faceapi.resizeResults(detection, dimensions);

      faceapi.draw.drawDetections(canvas, resizedDetection);
    }, 1500);

    return () => clearInterval(interval);
  }, [modelsLoaded, setFaceDetected]);

  useEffect(() => {
    const interval =
      !isPaused && !isIdle
        ? setInterval(() => {
            if (faceDetected && isWorking) {
              setWorkTime(workTime + 1);
              setIdleTime(0);
            } else if (!faceDetected && isResting) {
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
  ]);

  useEffect(() => {
    if (idleTime >= notificationTimes.IDLE * 60) {
      resetTimers();
    }
  }, [idleTime, notificationTimes.IDLE, resetTimers]);

  useEffect(() => {
    const sendNotification = async message => {
      const { botToken, chatId } = telegramConfig;

      if (!botToken || !chatId) return;
      const url = `https://api.telegram.org/bot${botToken}/sendMessage`;

      try {
        const response = await fetch(url, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            chat_id: chatId,
            text: message,
          }),
        });

        if (!response.ok) {
          throw new Error("Failed to send notification");
        }
      } catch (err) {
        console.error("Error sending notification:", err);
      }
    };
    const dateTime = getFormattedDateTime();

    if (workTimeExceeded && !notificationSent.workTime && isWorking) {
      const message = `Work time finished at ${dateTime}. Go for a break!`;

      sendNotification(message);
      sendSystemNotification("Work Time Finished", message);
      setNotificationSent({ ...notificationSent, workTime: true });
    }

    if (restTimeExceeded && !notificationSent.restTime && isResting) {
      const message = `Rest time finished at ${dateTime}. Get back to work!`;

      sendNotification(message);
      sendSystemNotification("Rest Time Finished", message);
      setNotificationSent({ ...notificationSent, restTime: true });
    }

    if (!(idleTimeExceeded && !notificationSent.idleTime && isIdle)) return;
    const message = `Idle time finished at ${dateTime}. Timers have been reset.`;

    sendNotification(message);
    sendSystemNotification("Idle Time Finished", message);
    setNotificationSent({ ...notificationSent, idleTime: true });
  }, [
    idleTimeExceeded,
    isIdle,
    isResting,
    isWorking,
    notificationSent,
    restTimeExceeded,
    setNotificationSent,
    telegramConfig,
    workTimeExceeded,
  ]);

  useLayoutEffect(() => {
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

  return (
    <Flex align="center" direction="column" h="100%" w="100%">
      <VideoSection canvasRef={canvasRef} videoRef={videoRef} />

      <Flex
        align="center"
        borderRadius={5}
        direction="column"
        gap={{ base: "8px", sm: "16px", md: "24px", lg: "24px", xl: "32px" }}
        maxW={{ base: "100%", sm: "100%", md: "620px", lg: "720px", xl: "960px" }}
        p={{ base: "4px", sm: "8px", md: "16px", lg: "24px", xl: "32px" }}
        position="relative"
        top={{ base: "360px", sm: "360px", md: "350px", lg: "400px", xl: "360px" }}
        w="100%"
      >
        <TimersSection idleTime={idleTime} restTime={restTime} workTime={workTime} />

        <ButtonsSection
          isIdle={isIdle}
          isPaused={isPaused}
          isResting={isResting}
          isWorking={isWorking}
          resetTimers={resetTimers}
          startResting={startResting}
          startWorking={startWorking}
          togglePause={togglePause}
        />

        <NotificationsSection
          idleTimeExceeded={idleTimeExceeded}
          isIdle={isIdle}
          isResting={isResting}
          isWorking={isWorking}
          restTimeExceeded={restTimeExceeded}
          workTimeExceeded={workTimeExceeded}
        />

        <StatusSection faceDetected={faceDetected} isPaused={isPaused} status={status} />

        <InputsSection
          handleInputChange={handleInputChange}
          handleTelegramConfigChange={handleTelegramConfigChange}
          notificationTimes={notificationTimes}
          telegramConfig={telegramConfig}
        />
      </Flex>
    </Flex>
  );
};

export default App;
