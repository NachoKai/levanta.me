import * as faceapi from "@vladmandic/face-api";
import { useEffect, useState } from "react";

export const useFaceDetection = (videoRef, canvasRef, modelsLoaded) => {
  const [faceDetected, setFaceDetected] = useState(false);

  useEffect(() => {
    const interval = setInterval(async () => {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      if (!canvas || !video || !modelsLoaded) return;

      const { detectSingleFace, matchDimensions, draw, resizeResults } = faceapi;

      const detectFace = async () => {
        const detection = await detectSingleFace(
          video,
          new faceapi.TinyFaceDetectorOptions({
            inputSize: 160,
            scoreThreshold: 0.3,
          })
        );

        setFaceDetected(!!detection);

        if (detection) {
          const displaySize = { width: video.clientWidth, height: video.clientHeight };
          const dimensions = matchDimensions(canvas, displaySize, true);
          const resizedDetection = resizeResults(detection, dimensions);
          draw.drawDetections(canvas, resizedDetection);
        }
      };

      detectFace();
    }, 1000);

    return () => clearInterval(interval);
  }, [canvasRef, modelsLoaded, videoRef]);

  return faceDetected;
};
