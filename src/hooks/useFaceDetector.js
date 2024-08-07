import * as faceapi from "@vladmandic/face-api";
import { useEffect } from "react";

import { useStore } from "./useStore";

export const useFaceDetector = ({ videoRef, canvasRef }) => {
  const { modelsLoaded, setFaceDetected } = useStore();

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
      const displaySize = {
        width: video.clientWidth,
        height: video.clientHeight,
      };
      const dimensions = faceapi.matchDimensions(canvas, displaySize, true);
      const resizedDetection = faceapi.resizeResults(detection, dimensions);

      faceapi.draw.drawDetections(canvas, resizedDetection);
    }, 1000);

    return () => clearInterval(interval);
  }, [canvasRef, modelsLoaded, setFaceDetected, videoRef]);
};
