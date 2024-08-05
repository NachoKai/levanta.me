import * as faceapi from "@vladmandic/face-api";
import { useCallback, useEffect, useRef, useState } from "react";
import styled from "styled-components";

import "./App.css";
import IdleIcon from "./assets/idle.svg";
import PauseIcon from "./assets/pause.svg";
import PlayIcon from "./assets/play.svg";
import ResetIcon from "./assets/replay.svg";
import RestIcon from "./assets/rest.svg";
import WorkIcon from "./assets/work.svg";
import { TELEGRAM } from "./consts";
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
      const url = `https://api.telegram.org/bot${TELEGRAM.BOT_TOKEN}/sendMessage`;

      try {
        const response = await fetch(url, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            chat_id: TELEGRAM.CHAT_ID,
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
  ]);

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
