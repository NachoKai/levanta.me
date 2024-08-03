import { useEffect, useRef, useState } from "react";
import styled from "styled-components";

import { NOTIFICATION_TIMES } from "./consts";
import { useFaceDetection } from "./hooks/useFaceDetection";
import { useModels } from "./hooks/useModels";
import { useTimers } from "./hooks/useTimers";
import { formatTime } from "./utils/formatTIme";
import { startVideo } from "./startVideo";

const App = () => {
  const [status, setStatus] = useState("idle");
  const videoRef = useRef();
  const canvasRef = useRef();
  const modelsLoaded = useModels();
  const faceDetected = useFaceDetection(videoRef, canvasRef, modelsLoaded);

  const resetTimers = () => {
    setStatus("idle");
    setWorkTime(0);
    setRestTime(0);
  };

  const { workTime, restTime, staleTime, setWorkTime, setRestTime, setStaleTime } = useTimers(
    status,
    faceDetected,
    resetTimers
  );

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

  useEffect(() => {
    if (modelsLoaded) {
      startVideo(videoRef);
    }
  }, [modelsLoaded]);

  return (
    <Flex
      direction="column"
      gap="32px"
      align="center"
      justify="center"
      width="100%"
      height="100%"
      padding="32px"
    >
      <Flex>
        <Video ref={videoRef} autoPlay muted />
        <Canvas ref={canvasRef} />
      </Flex>

      <Flex gap="32px" justify="space-between" padding="8px" background="#eee" radius="5px">
        <Text color="#222">Work Time: {formatTime(workTime)}</Text>
        <Text color="#222">Stale Time: {formatTime(staleTime)}</Text>
        <Text color="#222">Rest Time: {formatTime(restTime)}</Text>
      </Flex>

      <Flex gap="32px" align="space-between" justify="space-between">
        <Button onClick={startWorking} disabled={status === "working"}>
          Start Working
        </Button>
        <Button onClick={startResting} disabled={status === "resting"}>
          Start Resting
        </Button>
        <Button onClick={resetTimers} disabled={status === "idle"}>
          Reset All
        </Button>
      </Flex>

      <Flex justify="space-between" align="space-between" gap="32px">
        <Text fontWeight="bold">Current Status: {status}</Text>
        <Flex gap="8px" align="center">
          <Text fontWeight="bold">Face Detected: {faceDetected ? "Yes" : "No"}</Text>
          <Circle color={faceDetected ? "#0f0" : "#f00"} />
        </Flex>
      </Flex>

      <Flex gap="8px" padding="8px" radius="5px">
        {workTime >= NOTIFICATION_TIMES.WORK && (
          <Notification>Work Time Exceeded. Go for a break!</Notification>
        )}
        {staleTime >= NOTIFICATION_TIMES.STALE && (
          <Notification>Stale Time Exceeded. Timers have been reset.</Notification>
        )}
        {restTime >= NOTIFICATION_TIMES.REST && (
          <Notification>Rest Time Exceeded. Get back to work!</Notification>
        )}
      </Flex>

      <Flex direction="column" gap="8px">
        <Text color="#eee">Work time configured: {NOTIFICATION_TIMES.WORK} seconds</Text>
        <Text color="#eee">Stale time configured: {NOTIFICATION_TIMES.STALE} seconds</Text>
        <Text color="#eee">Rest time configured: {NOTIFICATION_TIMES.REST} seconds</Text>
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
  width: 450px;
  height: auto;
`;

const Canvas = styled.canvas`
  position: absolute;
  top: 0;
  left: 0;
`;

const Button = styled.button`
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
