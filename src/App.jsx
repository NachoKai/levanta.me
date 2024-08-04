import { useEffect, useLayoutEffect, useRef, useState } from "react";
import styled from "styled-components";

import { NOTIFICATION_TIMES, TELEGRAM } from "./consts";
import { useFaceDetection } from "./hooks/useFaceDetection";
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
    staleTime: false,
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
    staleTime,
    setWorkTime,
    setRestTime,
    setStaleTime,
    isPaused,
    togglePause,
  } = useTimers(status, setStatus, faceDetected);

  const workTimeExceeded = workTime >= NOTIFICATION_TIMES.WORK;
  const restTimeExceeded = restTime >= NOTIFICATION_TIMES.REST;
  const staleTimeExceeded = staleTime >= NOTIFICATION_TIMES.STALE;

  const resetTimers = () => {
    setStatus("idle");
    setWorkTime(0);
    setRestTime(0);
    setStaleTime(0);
  };

  const startWorking = () => {
    setStatus("working");
    setRestTime(0);
    setStaleTime(0);
  };

  const startResting = () => {
    setStatus("resting");
    setWorkTime(0);
    setStaleTime(0);
  };

  // const testNotification = () => {
  //   sendNotification("Test!");
  // };

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
    } else if (staleTimeExceeded) {
      title = `⏰ Stale Time - ${formatCounter(staleTime)}`;
    }

    document.title = title;
  }, [
    restTime,
    restTimeExceeded,
    staleTime,
    staleTimeExceeded,
    status,
    workTime,
    workTimeExceeded,
  ]);

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
    if (staleTimeExceeded && !notificationSent.staleTime) {
      sendNotification(`Stale time finished at ${dateTime}. Timers have been reset. ⏰`);
      setNotificationSent(prevState => ({
        ...prevState,
        staleTime: true,
      }));
    }
  }, [
    workTimeExceeded,
    restTimeExceeded,
    staleTimeExceeded,
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
        staleTime: false,
      });
    }
  }, [status]);

  return (
    <Flex
      direction="column"
      padding="0 32px"
      gap="32px"
      height="100vh"
      justify="end"
      align="center"
    >
      <Flex width="416px">
        <Video ref={videoRef} autoPlay muted />
        <Canvas ref={canvasRef} />
      </Flex>

      <Flex direction="column" padding="32px" gap="32px" justify="end" align="center">
        <Flex
          width="100%"
          gap="32px"
          justify="space-between"
          padding="8px"
          background="#eee"
          radius="5px"
        >
          <Text color="#222">💼 Work Time: {formatCounter(workTime)}</Text>
          <Text color="#222">⏰ Stale Time: {formatCounter(staleTime)}</Text>
          <Text color="#222">🛌 Rest Time: {formatCounter(restTime)}</Text>
        </Flex>

        <Flex width="100%" gap="32px" align="space-between" justify="space-between">
          <Button onClick={startWorking} disabled={status === "working"}>
            Start Working
          </Button>
          <Button onClick={startResting} disabled={status === "resting"}>
            Start Resting
          </Button>
          <Button onClick={resetTimers} disabled={status === "idle"}>
            Reset All
          </Button>
          <Button width="103px" onClick={togglePause} disabled={status === "idle"}>
            {isPaused ? "Resume" : "Pause"}
          </Button>
          {/* <Button onClick={testNotification}>Test Notification</Button> */}
        </Flex>

        <Flex width="100%" justify="space-between" align="space-between" gap="32px">
          <Text fontWeight="bold">Current Status: {isPaused ? "Paused" : status}</Text>
          <Flex gap="8px" align="center">
            <Text fontWeight="bold">Face Detected: {faceDetected ? "Yes" : "No"}</Text>
            <Circle color={faceDetected ? "#0f0" : "#f00"} />
          </Flex>
        </Flex>

        <Flex width="100%" direction="column" gap="8px">
          <Text color="#eee">
            💼 Work time configured: {formatMinutes(NOTIFICATION_TIMES.WORK)}
          </Text>
          <Text color="#eee">
            ⏰ Stale time configured: {formatMinutes(NOTIFICATION_TIMES.STALE)}
          </Text>
          <Text color="#eee">
            🛌 Rest time configured: {formatMinutes(NOTIFICATION_TIMES.REST)}
          </Text>
        </Flex>

        <Flex
          width="100%"
          gap="8px"
          padding="8px"
          radius="5px"
          height="56px"
          align="center"
          justify="center"
        >
          {workTimeExceeded && <Notification>Work time finished. Go for a break! 🛌</Notification>}
          {staleTimeExceeded && (
            <Notification>Stale time finished. Timers have been reset. ⏰</Notification>
          )}
          {restTimeExceeded && (
            <Notification>Rest time finished. Get back to work! 💼</Notification>
          )}
        </Flex>
      </Flex>
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
  ${({ height }) => height && `height: ${height}`};
  ${({ padding }) => padding && `padding: ${padding}`};
  ${({ margin }) => margin && `margin: ${margin}`};
  ${({ radius }) => radius && `border-radius: ${radius}`};
  ${({ background }) => background && `background: ${background}`};
`;

const Text = styled.span`
  ${({ color }) => color && `color: ${color}`};
  ${({ fontSize }) => fontSize && `font-size: ${fontSize}`};
  ${({ fontWeight }) => fontWeight && `font-weight: ${fontWeight}`};
`;

const Video = styled.video`
  position: absolute;
  top: 0;
  width: 416px;
  height: auto;
`;

const Canvas = styled.canvas`
  position: absolute;
  top: 0;
  width: 416px;
  height: auto;
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
`;

const Circle = styled.div`
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background-color: ${({ color }) => color};
`;

export default App;
