export const OPTIONS = {
  withLandmarks: false,
  minConfidence: import.meta.env.VITE_MIN_CONFIDENCE || 0.5, // Set the minimum confidence for a face to be considered a match.
  MODEL_URLS: {
    Mobilenetv1Model:
      "https://raw.githubusercontent.com/ml5js/ml5-data-and-models/main/models/faceapi/ssd_mobilenetv1_model-weights_manifest.json",
    FaceExpressionModel:
      "https://raw.githubusercontent.com/justadudewhohacks/face-api.js/master/weights/face_expression_model-weights_manifest.json",
    TinyFaceLandmarkModel:
      "https://raw.githubusercontent.com/justadudewhohacks/face-api.js/master/weights/tiny_face_detector_model-weights_manifest.json",
    FaceRecognitionModel:
      "https://raw.githubusercontent.com/justadudewhohacks/face-api.js/master/weights/face_recognition_model-weights_manifest.json",
  },
};

export const NOTIFICATION_TIMES = {
  WORK: import.meta.env.VITE_WORK_TIME || 50 * 60, // 50 minutes
  IDLE: import.meta.env.VITE_STALE_TIME || 10 * 60, // 10 minutes
  REST: import.meta.env.VITE_REST_TIME || 5 * 60, // 5 minutes
};

export const TELEGRAM = {
  BOT_TOKEN: import.meta.env.VITE_BOT_TOKEN || "", // Get your bot token from @BotFather
  CHAT_ID: import.meta.env.VITE_CHAT_ID || "", // Get your chat id from @BotFather
};
