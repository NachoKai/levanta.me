import { useEffect, useLayoutEffect, useRef, useState } from "react";
import styled from "styled-components";

import "./App.css";
import IdleIcon from "./assets/idle.svg";
import PauseIcon from "./assets/pause.svg";
import PlayIcon from "./assets/play.svg";
import ResetIcon from "./assets/replay.svg";
import RestIcon from "./assets/rest.svg";
import WorkIcon from "./assets/work.svg";
import { TELEGRAM } from "./consts";
import { useFaceDetection } from "./hooks/useFaceDetection";
import { useIsMobile } from "./hooks/useIsMobile";
import { useModels } from "./hooks/useModels";
import { useTelegramNotification } from "./hooks/useTelegramNotification";
import { useTimers } from "./hooks/useTimers";
import { startVideo } from "./startVideo";
import { formatCounter } from "./utils/formatCounter";
import { getFormattedDateTime } from "./utils/getFormattedDateTime";
import { sendSystemNotification } from "./utils/sendSystemNotification";

const App = () => {
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
  const modelsLoaded = useModels();
  const faceDetected = useFaceDetection(videoRef, canvasRef, modelsLoaded);
  const { sendNotification, loading, error } = useTelegramNotification(
    TELEGRAM.BOT_TOKEN,
    TELEGRAM.CHAT_ID
  );
  const isWorking = status === "working";
  const isResting = status === "resting";
  const isIdle = status === "idle";
  const {
    workTime,
    restTime,
    idleTime,
    setWorkTime,
    setRestTime,
    setIdleTime,
    isPaused,
    togglePause,
  } = useTimers(isWorking, isResting, isIdle, setStatus, faceDetected, notificationTimes);
  const isMobile = useIsMobile();
  const workTimeExceeded = workTime >= notificationTimes.WORK * 60;
  const restTimeExceeded = restTime >= notificationTimes.REST * 60;
  const idleTimeExceeded = idleTime >= notificationTimes.IDLE * 60;

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

  const handleInputChange = e => {
    const { name, value } = e.target;
    const newValue = parseInt(value) || 0;
    setNotificationTimes(prev => ({ ...prev, [name]: newValue }));
    localStorage.setItem(`${name.toLowerCase()}Time`, newValue.toString());
  };

  useEffect(() => {
    if (modelsLoaded) {
      startVideo(videoRef);
    }
  }, [modelsLoaded]);

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

  useEffect(() => {
    if (loading || error) return;
    const dateTime = getFormattedDateTime();

    if (workTimeExceeded && !notificationSent.workTime && isWorking) {
      const message = `Work time finished at ${dateTime}. Go for a break! 🛌`;
      sendNotification(message);
      sendSystemNotification("Work Time Finished", message);
      setNotificationSent(prevState => ({
        ...prevState,
        workTime: true,
      }));
    }

    if (restTimeExceeded && !notificationSent.restTime && isResting) {
      const message = `Rest time finished at ${dateTime}. Get back to work! 💼`;
      sendNotification(message);
      sendSystemNotification("Rest Time Finished", message);
      setNotificationSent(prevState => ({
        ...prevState,
        restTime: true,
      }));
    }

    if (!(idleTimeExceeded && !notificationSent.idleTime && isIdle)) return;

    const message = `Idle time finished at ${dateTime}. Timers have been reset. ⏰`;
    sendNotification(message);
    sendSystemNotification("Idle Time Finished", message);
    setNotificationSent(prevState => ({
      ...prevState,
      idleTime: true,
    }));
  }, [
    error,
    idleTimeExceeded,
    isIdle,
    isResting,
    isWorking,
    loading,
    notificationSent.idleTime,
    notificationSent.restTime,
    notificationSent.workTime,
    restTimeExceeded,
    sendNotification,
    workTimeExceeded,
  ]);

  useEffect(() => {
    if (isIdle) {
      setNotificationSent({
        workTime: false,
        restTime: false,
        idleTime: false,
      });
    }
  }, [isIdle]);

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
          <Flex align="center" justify="center" gap="4px" width={isMobile ? "100%" : "30%"}>
            <Icon size="19px" src={WorkIcon} alt="Work" />
            <Text fontWeight="500" color="#222">
              Work Time: {formatCounter(workTime)}
            </Text>
          </Flex>
          <Flex align="center" justify="center" gap="4px" width={isMobile ? "100%" : "30%"}>
            <Icon size="22px" src={IdleIcon} alt="Idle" />
            <Text fontWeight="500" color="#222">
              Idle Time: {formatCounter(idleTime)}
            </Text>
          </Flex>
          <Flex align="center" justify="center" gap="4px" width={isMobile ? "100%" : "30%"}>
            <Icon size="24px" src={RestIcon} alt="Rest" />
            <Text fontWeight="500" color="#222">
              Rest Time: {formatCounter(restTime)}
            </Text>
          </Flex>
        </Flex>

        <Flex
          width="100%"
          gap={isMobile ? "16px" : "32px"}
          align="center"
          justify="space-between"
          direction={isMobile ? "column" : "row"}
        >
          <Button onClick={startWorking} disabled={isWorking} width={isMobile ? "100%" : "30%"}>
            Work
          </Button>
          <Button onClick={startResting} disabled={isResting} width={isMobile ? "100%" : "30%"}>
            Rest
          </Button>
          <Button width={isMobile ? "100%" : "20%"} onClick={togglePause} disabled={isIdle}>
            <Icon
              $white
              size="30px"
              src={isPaused ? PlayIcon : PauseIcon}
              alt={isPaused ? "Play" : "Pause"}
            />
          </Button>
          <Button onClick={resetTimers} disabled={isIdle} width={isMobile ? "100%" : "20%"}>
            <Icon $white size="30px" src={ResetIcon} alt="Reset" />
          </Button>
        </Flex>

        <Flex
          width="100%"
          justify="space-between"
          align="center"
          gap={isMobile ? "16px" : "32px"}
          direction={isMobile ? "column" : "row"}
        >
          <Flex gap="8px" align="center">
            <Text fontWeight="bold">Current Status:</Text>
            <Text>{isPaused ? "paused" : status}</Text>
          </Flex>
          <Flex gap="8px" align="center">
            <Text fontWeight="bold">Face Detected: </Text>
            <Text>{faceDetected ? "Yes" : "No"}</Text>
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
          {isWorking && workTimeExceeded && (
            <Notification>Work time finished. Go for a break! 🛌</Notification>
          )}
          {isIdle && idleTimeExceeded && (
            <Notification>Idle time finished. Timers have been reset. ⏰</Notification>
          )}
          {isResting && restTimeExceeded && (
            <Notification>Rest time finished. Get back to work! 💼</Notification>
          )}
        </Flex>

        <Flex width="100%" direction="column" gap="16px" align="center">
          <InputWrapper>
            <Label htmlFor="WORK">
              <Icon $white size="19px" src={WorkIcon} alt="Work" />
              <Text fontWeight="bold">Work time (minutes):</Text>
            </Label>
            <Input
              type="number"
              id="WORK"
              name="WORK"
              value={notificationTimes.WORK}
              onChange={handleInputChange}
              min="1"
            />
          </InputWrapper>
          <InputWrapper>
            <Label htmlFor="IDLE">
              <Icon $white size="22px" src={IdleIcon} alt="Idle" />
              <Text fontWeight="bold">Idle time (minutes):</Text>
            </Label>
            <Input
              type="number"
              id="IDLE"
              name="IDLE"
              value={notificationTimes.IDLE}
              onChange={handleInputChange}
              min="1"
            />
          </InputWrapper>
          <InputWrapper>
            <Label htmlFor="REST">
              <Icon $white size="22px" src={RestIcon} alt="Rest" />
              <Text fontWeight="bold">Rest time (minutes):</Text>
            </Label>
            <Input
              type="number"
              id="REST"
              name="REST"
              value={notificationTimes.REST}
              onChange={handleInputChange}
              min="1"
            />
          </InputWrapper>
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
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  font-size: 16px;
  font-weight: bold;
  color: white;
  background-color: #007bff;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  padding: 0;
  height: 42px;
  line-height: 42px;

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
  width: 100%;
`;

const Circle = styled.div`
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background-color: ${({ color }) => color};
`;

const InputWrapper = styled(Flex)`
  align-items: center;
  width: 100%;
  gap: 8px;
`;

const Label = styled.label`
  display: flex;
  align-items: center;
  gap: 8px;
  color: #eee;
  width: 50%;
`;

const Input = styled.input`
  width: 50%;
  padding: 8px;
  border: 1px solid #ccc;
  border-radius: 4px;
  font-size: 16px;
`;

const Icon = styled.img`
  width: ${({ size }) => size || "24px"};
  height: ${({ size }) => size || "24px"};
  ${({ $white }) => $white && "filter: invert(1)"};
`;

export default App;
