import * as faceapi from "@vladmandic/face-api";
import { useEffect, useRef, useState } from "react";
import styled from "styled-components";

import { OPTIONS } from "./consts";

const workNotificationTime = 10;
const restNotificationTime = 10;
const staleNotificationTime = 5;

const App = () => {
  const [status, setStatus] = useState("idle");
  const [workTime, setWorkTime] = useState(0);
  const [restTime, setRestTime] = useState(0);
  const [staleTime, setStaleTime] = useState(0);
  const [faceDetected, setFaceDetected] = useState(false);
  const [modelsLoaded, setModelsLoaded] = useState(false);
  const videoRef = useRef();
  const canvasRef = useRef();
  const workTimeExceeded = workTime >= workNotificationTime;
  const restTimeExceeded = restTime >= restNotificationTime;
  const staleTimeExceeded = staleTime >= staleNotificationTime;

  const startVideo = () => {
    navigator.mediaDevices
      .getUserMedia({ video: {} })
      .then(stream => {
        videoRef.current.srcObject = stream;
      })
      .catch(err => console.error(err));
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

  const resetTimers = () => {
    setStatus("idle");
    setWorkTime(0);
    setRestTime(0);
  };

  const formatTime = time => {
    const minutes = Math.floor(time / 60);
    const seconds = time % 60;
    return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
  };

  useEffect(() => {
    const loadModels = async () => {
      try {
        await Promise.all([
          faceapi.nets.ssdMobilenetv1.loadFromUri(OPTIONS.MODEL_URLS.Mobilenetv1Model),
          faceapi.nets.tinyFaceDetector.loadFromUri(OPTIONS.MODEL_URLS.TinyFaceLandmarkModel),
          faceapi.nets.faceLandmark68Net.loadFromUri(OPTIONS.MODEL_URLS.FaceLandmark68TinyNet),
          faceapi.nets.faceRecognitionNet.loadFromUri(OPTIONS.MODEL_URLS.FaceRecognitionModel),
          faceapi.nets.faceExpressionNet.loadFromUri(OPTIONS.MODEL_URLS.FaceExpressionModel),
        ]);
        setModelsLoaded(true);
        startVideo();
      } catch (error) {
        console.error("Error loading models:", error);
      }
    };
    loadModels();
  }, []);

  useEffect(() => {
    if (modelsLoaded && videoRef.current) {
      const interval = setInterval(async () => {
        const detections = await faceapi.detectSingleFace(
          videoRef.current,
          new faceapi.TinyFaceDetectorOptions({
            inputSize: 320,
            scoreThreshold: 0.5,
          })
        );

        setFaceDetected(!!detections);

        if (!canvasRef.current) return;
        const displaySize = { width: videoRef.current.width, height: videoRef.current.height };
        faceapi.matchDimensions(canvasRef.current, displaySize);
        canvasRef.current
          .getContext("2d")
          .clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
      }, 1000);

      return () => clearInterval(interval);
    }
  }, [modelsLoaded]);

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

    if (staleTime >= staleNotificationTime) {
      resetTimers();
    }

    return () => clearInterval(interval);
  }, [status, faceDetected, staleTime]);

  return (
    <Container>
      <VideoContainer>
        <Video ref={videoRef} autoPlay muted />
        <Canvas ref={canvasRef} />
      </VideoContainer>

      <TimerDisplay>
        <TimerItem>Work Time: {formatTime(workTime)}</TimerItem>
        <TimerItem>Stale Time: {formatTime(staleTime)}</TimerItem>
        <TimerItem>Rest Time: {formatTime(restTime)}</TimerItem>
      </TimerDisplay>

      <ButtonsContainer>
        <Button onClick={startWorking} disabled={status === "working"}>
          Start Working
        </Button>
        <Button onClick={startResting} disabled={status === "resting"}>
          Start Resting
        </Button>
        <Button onClick={resetTimers}>Reset All</Button>
      </ButtonsContainer>

      <StatusContainer>
        <StatusText>Current Status: {status}</StatusText>
        <StatusText>Face Detected: {faceDetected ? "Yes" : "No"}</StatusText>
      </StatusContainer>

      <NotificationsContainer>
        {workTimeExceeded && <Notification>Work Time Exceeded. Go for a break!</Notification>}
        {staleTimeExceeded && (
          <Notification>Stale Time Exceeded. Timers have been reset.</Notification>
        )}
        {restTimeExceeded && <Notification>Rest Time Exceeded. Get back to work!</Notification>}
      </NotificationsContainer>

      <InfoContainer>
        <Info>Work time configured: {workNotificationTime} seconds</Info>
        <Info>Stale time configured: {staleNotificationTime} seconds</Info>
        <Info>Rest time configured: {restNotificationTime} seconds</Info>
      </InfoContainer>
    </Container>
  );
};

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
  padding: 32px;
  font-family: Arial, sans-serif;
  gap: 32px;
`;

const VideoContainer = styled.div`
  position: relative;
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

const TimerDisplay = styled.div`
  display: flex;
  gap: 32px;
  justify-content: space-between;
  padding: 10px;
  background-color: #eee;
  border-radius: 5px;
`;

const TimerItem = styled.span`
  color: #222;
`;

const ButtonsContainer = styled.div`
  display: flex;
  justify-content: space-between;
  gap: 32px;
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
  }
`;

const StatusText = styled.span`
  text-align: center;
  font-weight: bold;
`;

const StatusContainer = styled.div`
  display: flex;
  text-align: center;
  justify-content: space-between;
  gap: 32px;
`;

const NotificationsContainer = styled.div`
  display: flex;
  padding: 10px;
  border-radius: 5px;
  gap: 8px;
`;

const Notification = styled.span`
  color: #eee;
  background-color: #444;
  border-radius: 5px;
  padding: 8px 16px;
  font-weight: bold;
`;

const InfoContainer = styled.div`
  display: flex;
  flex-direction: column;
  text-align: center;
  gap: 8px;
`;

const Info = styled.span``;

export default App;
