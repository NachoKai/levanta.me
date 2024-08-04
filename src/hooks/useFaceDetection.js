import * as faceapi from "@vladmandic/face-api";
import { useEffect, useState } from "react";

export const useFaceDetection = (videoRef, canvasRef, modelsLoaded) => {
  const video = videoRef?.current;
  const canvas = canvasRef?.current;
  const [faceDetected, setFaceDetected] = useState(false);

  useEffect(() => {
    if (!canvas || !video || !modelsLoaded) return;
    const { detectSingleFace, matchDimensions, draw, resizeResults } = faceapi;
    let animationFrameId;

    const detectFace = async () => {
      const detection = await detectSingleFace(
        video,
        new faceapi.TinyFaceDetectorOptions({
          inputSize: 416,
          scoreThreshold: 0.5,
        })
      );

      setFaceDetected(!!detection);

      if (detection) {
        const dimensions = matchDimensions(canvas, video, true);
        const resizedDetection = resizeResults(detection, dimensions);
        draw.drawDetections(canvas, resizedDetection);
      }

      animationFrameId = requestAnimationFrame(detectFace);
    };

    animationFrameId = requestAnimationFrame(detectFace);

    return () => cancelAnimationFrame(animationFrameId);
  }, [modelsLoaded, canvas, video]);

  return faceDetected;
};
