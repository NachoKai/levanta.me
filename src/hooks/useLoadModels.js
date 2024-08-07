import * as faceapi from "@vladmandic/face-api";
import { useEffect } from "react";
import { useStore } from "./useStore";

export const useLoadModels = () => {
  const { setModelsLoaded } = useStore();

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
  }, [setModelsLoaded]);
};
