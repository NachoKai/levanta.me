import * as faceapi from "@vladmandic/face-api";
import { useEffect, useState } from "react";

import { OPTIONS } from "../consts";

export const useModels = () => {
  const [modelsLoaded, setModelsLoaded] = useState(false);

  useEffect(() => {
    const loadModels = async () => {
      try {
        await faceapi.nets.tinyFaceDetector.loadFromUri(OPTIONS.MODEL_URLS.TinyFaceLandmarkModel);
        setModelsLoaded(true);
      } catch (error) {
        console.error("Error loading models:", error);
      }
    };
    loadModels();
  }, []);

  return modelsLoaded;
};
