import * as faceapi from "@vladmandic/face-api";
import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import styled from "styled-components";
import "./App.css";
import { ButtonsSection } from "./components/ButtonsSection";
import { InputsSection } from "./components/InputsSection";
import { NotificationsSection } from "./components/NotificationsSection";
import { StatusSection } from "./components/StatusSection";
import { Flex } from "./components/StyledComponents";
import { TimersSection } from "./components/TimersSection";
import { VideoSection } from "./components/VideoSection";
import { useIsMobile } from "./hooks/useIsMobile";
import { formatCounter } from "./utils/formatCounter";
import { getFormattedDateTime } from "./utils/getFormattedDateTime";
import { sendSystemNotification } from "./utils/sendSystemNotification";

const App = () => {
  const [workTime, setWorkTime] = useState(0);
  const [restTime, setRestTime] = useState(0);
  const [idleTime, setIdleTime] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [modelsLoaded, setModelsLoaded] = useState(false);
  const [faceDetected, setFaceDetected] = useState(false);
  const [botToken, setBotToken] = useState(localStorage.getItem("botToken") || "");
  const [chatId, setChatId] = useState(localStorage.getItem("chatId") || "");
  const [status, setStatus] = useState("idle");
  const [notificationSent, setNotificationSent] = useState({
    workTime: false,
    restTime: false,
    idleTime: false,
  });
  const [notificationTimes, setNotificationTimes] = useState({
    WORK: parseInt(localStorage.getItem("workTime")) || 50,
    REST: parseInt(localStorage.getItem("restTime")) || 10,
    IDLE: parseInt(localStorage.getItem("idleTime")) || 5,
  });
  const videoRef = useRef();
  const canvasRef = useRef();
  const isWorking = status === "working";
  const isResting = status === "resting";
  const isIdle = status === "idle";
  const isMobile = useIsMobile();
  const workTimeExceeded = workTime >= notificationTimes.WORK * 60;
  const restTimeExceeded = restTime >= notificationTimes.REST * 60;
  const idleTimeExceeded = idleTime >= notificationTimes.IDLE * 60;

  const togglePause = useCallback(() => {
    setIsPaused(prev => !prev);
  }, []);

  const resetTimers = useCallback(() => {
    setStatus("idle");
    setWorkTime(0);
    setRestTime(0);
    setIdleTime(0);
    setIsPaused(false);
    setNotificationSent({
      workTime: false,
      restTime: false,
      idleTime: false,
    });
  }, []);

  const startWorking = useCallback(() => {
    setStatus("working");
    setRestTime(0);
    setIdleTime(0);
  }, []);

  const startResting = useCallback(() => {
    setStatus("resting");
    setWorkTime(0);
    setIdleTime(0);
  }, []);

  const handleInputChange = useCallback(e => {
    const { name, value } = e.target;
    const newValue = parseInt(value) || 0;
    setNotificationTimes(prev => ({ ...prev, [name]: newValue }));
    localStorage.setItem(`${name.toLowerCase()}Time`, newValue.toString());
  }, []);

  const handleBotTokenChange = useCallback(e => {
    setBotToken(e.target.value);
    localStorage.setItem("botToken", e.target.value);
  }, []);

  const handleChatIdChange = useCallback(e => {
    setChatId(e.target.value);
    localStorage.setItem("chatId", e.target.value);
  }, []);

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
  }, []);

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
      const displaySize = { width: video.clientWidth, height: video.clientHeight };
      const dimensions = faceapi.matchDimensions(canvas, displaySize, true);
      const resizedDetection = faceapi.resizeResults(detection, dimensions);
      faceapi.draw.drawDetections(canvas, resizedDetection);
    }, 500);

    return () => clearInterval(interval);
  }, [modelsLoaded]);

  useEffect(() => {
    const interval =
      !isPaused && !isIdle
        ? setInterval(() => {
            if (faceDetected && isWorking) {
              setWorkTime(prevTime => prevTime + 1);
              setIdleTime(0);
            } else if (isResting) {
              setRestTime(prevTime => prevTime + 1);
              setIdleTime(0);
            } else {
              setIdleTime(prevTime => prevTime + 1);
            }
          }, 1000)
        : null;

    return () => clearInterval(interval);
  }, [faceDetected, isIdle, isPaused, isResting, isWorking]);

  useEffect(() => {
    if (idleTime >= notificationTimes.IDLE * 60) {
      resetTimers();
    }
  }, [idleTime, notificationTimes.IDLE, resetTimers]);

  useEffect(() => {
    const sendNotification = async message => {
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
      setNotificationSent(prev => ({ ...prev, workTime: true }));
    }

    if (restTimeExceeded && !notificationSent.restTime && isResting) {
      const message = `Rest time finished at ${dateTime}. Get back to work!`;
      sendNotification(message);
      sendSystemNotification("Rest Time Finished", message);
      setNotificationSent(prev => ({ ...prev, restTime: true }));
    }

    if (!(idleTimeExceeded && !notificationSent.idleTime && isIdle)) return;
    const message = `Idle time finished at ${dateTime}. Timers have been reset.`;
    sendNotification(message);
    sendSystemNotification("Idle Time Finished", message);
    setNotificationSent(prev => ({ ...prev, idleTime: true }));
  }, [
    workTime,
    restTime,
    idleTime,
    notificationTimes,
    notificationSent,
    isWorking,
    isResting,
    isIdle,
    workTimeExceeded,
    restTimeExceeded,
    idleTimeExceeded,
    botToken,
    chatId,
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
    <Flex direction="column" padding={isMobile ? "16px" : "32px"} gap="32px" align="center">
      <VideoSection videoRef={videoRef} canvasRef={canvasRef} />

      <Body
        direction="column"
        gap="32px"
        justify="end"
        width="100%"
        align="center"
        $maxWidth={isMobile ? "100%" : "620px"}
      >
        <TimersSection
          isMobile={isMobile}
          workTime={workTime}
          restTime={restTime}
          idleTime={idleTime}
        />

        <ButtonsSection
          isMobile={isMobile}
          isWorking={isWorking}
          isResting={isResting}
          isIdle={isIdle}
          isPaused={isPaused}
          startWorking={startWorking}
          startResting={startResting}
          togglePause={togglePause}
          resetTimers={resetTimers}
        />

        <StatusSection
          isMobile={isMobile}
          status={status}
          faceDetected={faceDetected}
          isPaused={isPaused}
        />

        <NotificationsSection
          isMobile={isMobile}
          isWorking={isWorking}
          workTimeExceeded={workTimeExceeded}
          isIdle={isIdle}
          idleTimeExceeded={idleTimeExceeded}
          isResting={isResting}
          restTimeExceeded={restTimeExceeded}
        />

        <InputsSection
          notificationTimes={notificationTimes}
          handleInputChange={handleInputChange}
          botToken={botToken}
          chatId={chatId}
          handleBotTokenChange={handleBotTokenChange}
          handleChatIdChange={handleChatIdChange}
        />
      </Body>
    </Flex>
  );
};

export default App;

const Body = styled(Flex)`
  position: relative;
  top: 385px;
`;
