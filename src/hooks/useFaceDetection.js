import * as faceapi from "@vladmandic/face-api";
import { useEffect, useState } from "react";

export const useFaceDetection = (videoRef, canvasRef, modelsLoaded) => {
  const [faceDetected, setFaceDetected] = useState(false);

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
  }, [modelsLoaded, videoRef, canvasRef]);

  return faceDetected;
};
