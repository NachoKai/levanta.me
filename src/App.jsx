import { useEffect, useLayoutEffect, useRef, useState } from "react";
import styled from "styled-components";

import { NOTIFICATION_TIMES, TELEGRAM } from "./consts";
import { useFaceDetection } from "./hooks/useFaceDetection";
import { useIsMobile } from "./hooks/useIsMobile";
import { useModels } from "./hooks/useModels";
import { useTelegramNotification } from "./hooks/useTelegramNotification";
import { useTimers } from "./hooks/useTimers";
import { startVideo } from "./startVideo";
import { formatCounter } from "./utils/formatCounter";
import { formatMinutes } from "./utils/formatMinutes";
import { getFormattedDateTime } from "./utils/getFormattedDateTime";

const App = () => {
  const [status, setStatus] = useState("idle");
  const [notificationSent, setNotificationSent] = useState({
    workTime: false,
    restTime: false,
    idleTime: false,
  });
  const videoRef = useRef();
  const canvasRef = useRef();
  const modelsLoaded = useModels();
  const faceDetected = useFaceDetection(videoRef, canvasRef, modelsLoaded);
  const { sendNotification, loading, error } = useTelegramNotification(
    TELEGRAM.BOT_TOKEN,
    TELEGRAM.CHAT_ID
  );
  const {
    workTime,
    restTime,
    idleTime,
    setWorkTime,
    setRestTime,
    setIdleTime,
    isPaused,
    togglePause,
  } = useTimers(status, setStatus, faceDetected);

  const isMobile = useIsMobile();
  const workTimeExceeded = workTime >= NOTIFICATION_TIMES.WORK;
  const restTimeExceeded = restTime >= NOTIFICATION_TIMES.REST;
  const idleTimeExceeded = idleTime >= NOTIFICATION_TIMES.IDLE;

  const resetTimers = () => {
    setStatus("idle");
    setWorkTime(0);
    setRestTime(0);
    setIdleTime(0);
  };

  const startWorking = () => {
    setStatus("working");
    setRestTime(0);
    setIdleTime(0);
  };

  const startResting = () => {
    setStatus("resting");
    setWorkTime(0);
    setIdleTime(0);
  };

  useEffect(() => {
    if (modelsLoaded) {
      startVideo(videoRef);
    }
  }, [modelsLoaded]);

  useLayoutEffect(() => {
    let title = "Levanta.me";

    if (status === "idle") {
      title = "Levanta.me";
    } else if (status === "working") {
      title = workTimeExceeded
        ? `⏰ Time to Rest! - ${formatCounter(workTime)}`
        : `💼 Working - ${formatCounter(workTime)}`;
    } else if (status === "resting") {
      title = restTimeExceeded
        ? `⏰ Time to Work! - ${formatCounter(restTime)}`
        : `🛌 Resting - ${formatCounter(restTime)}`;
    } else if (idleTimeExceeded) {
      title = `⏰ Idle Time - ${formatCounter(idleTime)}`;
    }

    document.title = title;
  }, [restTime, restTimeExceeded, idleTime, idleTimeExceeded, status, workTime, workTimeExceeded]);

  useEffect(() => {
    if (loading || error) return;
    const dateTime = getFormattedDateTime();

    if (workTimeExceeded && !notificationSent.workTime) {
      sendNotification(`Work time finished at ${dateTime}. Go for a break! 🛌`);
      setNotificationSent(prevState => ({
        ...prevState,
        workTime: true,
      }));
    }
    if (restTimeExceeded && !notificationSent.restTime) {
      sendNotification(`Rest time finished at ${dateTime}. Get back to work! 💼`);
      setNotificationSent(prevState => ({
        ...prevState,
        restTime: true,
      }));
    }
    if (idleTimeExceeded && !notificationSent.idleTime) {
      sendNotification(`Idle time finished at ${dateTime}. Timers have been reset. ⏰`);
      setNotificationSent(prevState => ({
        ...prevState,
        idleTime: true,
      }));
    }
  }, [
    workTimeExceeded,
    restTimeExceeded,
    idleTimeExceeded,
    sendNotification,
    loading,
    error,
    notificationSent,
  ]);

  useEffect(() => {
    if (status === "idle") {
      setNotificationSent({
        workTime: false,
        restTime: false,
        idleTime: false,
      });
    }
  }, [status]);

  return (
    <Flex direction="column" padding={isMobile ? "16px" : "32px"} gap="32px" align="center">
      <Flex width="100%" align="center" justify="center">
        <Video ref={videoRef} autoPlay muted />
        <Canvas ref={canvasRef} />
      </Flex>

      <Body
        direction="column"
        gap="32px"
        justify="end"
        width="100%"
        align="center"
        $maxWidth={isMobile ? "100%" : "620px"}
      >
        <Flex
          width="100%"
          gap={isMobile ? "16px" : "32px"}
          height="100%"
          justify="space-between"
          padding="8px 0"
          background="#eee"
          radius="5px"
          align="center"
          direction={isMobile ? "column" : "row"}
        >
          <Text width={isMobile ? "100%" : "30%"} color="#222">
            💼 Work Time: {formatCounter(workTime)}
          </Text>
          <Text width={isMobile ? "100%" : "30%"} color="#222">
            ⏰ Idle Time: {formatCounter(idleTime)}
          </Text>
          <Text width={isMobile ? "100%" : "30%"} color="#222">
            🛌 Rest Time: {formatCounter(restTime)}
          </Text>
        </Flex>

        <Flex
          width="100%"
          gap={isMobile ? "16px" : "32px"}
          align="center"
          justify="space-between"
          direction={isMobile ? "column" : "row"}
        >
          <Button
            onClick={startWorking}
            disabled={status === "working"}
            width={isMobile ? "100%" : "30%"}
          >
            Work
          </Button>
          <Button
            onClick={startResting}
            disabled={status === "resting"}
            width={isMobile ? "100%" : "30%"}
          >
            Rest
          </Button>
          <Button
            onClick={resetTimers}
            disabled={status === "idle"}
            width={isMobile ? "100%" : "30%"}
          >
            Reset
          </Button>
          <Button
            width={isMobile ? "100%" : "103px"}
            onClick={togglePause}
            disabled={status === "idle"}
          >
            {isPaused ? "Resume" : "Pause"}
          </Button>
        </Flex>

        <Flex
          width="100%"
          justify="space-between"
          align="center"
          gap={isMobile ? "16px" : "32px"}
          direction={isMobile ? "column" : "row"}
        >
          <Text fontWeight="bold">Current Status: {isPaused ? "paused" : status}</Text>
          <Flex gap="8px" align="center">
            <Text fontWeight="bold">Face Detected: {faceDetected ? "Yes" : "No"}</Text>
            <Circle color={faceDetected ? "#0f0" : "#f00"} />
          </Flex>
        </Flex>

        <Flex
          width="100%"
          gap="8px"
          padding="8px 0"
          radius="5px"
          align="center"
          justify="center"
          direction={isMobile ? "column" : "row"}
        >
          {workTimeExceeded && <Notification>Work time finished. Go for a break! 🛌</Notification>}
          {idleTimeExceeded && (
            <Notification>Idle time finished. Timers have been reset. ⏰</Notification>
          )}
          {restTimeExceeded && (
            <Notification>Rest time finished. Get back to work! 💼</Notification>
          )}
        </Flex>

        <Flex width="100%" direction="column" gap="8px" align="center">
          <Text color="#eee">
            💼 Work time configured: {formatMinutes(NOTIFICATION_TIMES.WORK)}
          </Text>
          <Text color="#eee">
            ⏰ Idle time configured: {formatMinutes(NOTIFICATION_TIMES.IDLE)}
          </Text>
          <Text color="#eee">
            🛌 Rest time configured: {formatMinutes(NOTIFICATION_TIMES.REST)}
          </Text>
        </Flex>
      </Body>
    </Flex>
  );
};

const Flex = styled.div`
  display: flex;
  ${({ gap }) => gap && `gap: ${gap}`};
  ${({ align }) => align && `align-items: ${align}`};
  ${({ justify }) => justify && `justify-content: ${justify}`};
  ${({ direction }) => direction && `flex-direction: ${direction}`};
  ${({ width }) => width && `width: ${width}`};
  ${({ $maxWidth }) => $maxWidth && `max-width: ${$maxWidth}`};
  ${({ height }) => height && `height: ${height}`};
  ${({ padding }) => padding && `padding: ${padding}`};
  ${({ margin }) => margin && `margin: ${margin}`};
  ${({ radius }) => radius && `border-radius: ${radius}`};
  ${({ background }) => background && `background: ${background}`};
`;

const Body = styled(Flex)`
  position: relative;
  top: 385px;
`;

const Text = styled.span`
  ${({ width }) => width && `width: ${width}`};
  ${({ color }) => color && `color: ${color}`};
  ${({ fontSize }) => fontSize && `font-size: ${fontSize}`};
  ${({ fontWeight }) => fontWeight && `font-weight: ${fontWeight}`};
`;

const Video = styled.video`
  position: absolute;
  top: 0;
  width: 100%;
  max-width: 416px;
  height: auto;
  aspect-ratio: 1 / 1;
`;

const Canvas = styled.canvas`
  position: absolute;
  top: 0;
  width: 100%;
  max-width: 416px;
  height: auto;
  aspect-ratio: 1 / 1;
`;

const Button = styled.button`
  ${({ width }) => width && `width: ${width}`};
  padding: 10px 20px;
  font-size: 16px;
  font-weight: bold;
  color: white;
  background-color: #007bff;
  border: none;
  border-radius: 5px;
  cursor: pointer;

  &:disabled {
    background-color: #cccccc;
    pointer-events: none;
  }
`;

const Notification = styled(Text)`
  color: #eee;
  background-color: #444;
  border-radius: 5px;
  padding: 8px 16px;
  font-weight: bold;
  text-align: center;
`;

const Circle = styled.div`
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background-color: ${({ color }) => color};
`;

export default App;
