import * as faceapi from "@vladmandic/face-api";
import { useEffect, useState } from "react";

import { OPTIONS } from "../consts";

export const useModels = () => {
  const [modelsLoaded, setModelsLoaded] = useState(false);

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
      } catch (error) {
        console.error("Error loading models:", error);
      }
    };
    loadModels();
  }, []);

  return modelsLoaded;
};
