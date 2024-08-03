export const OPTIONS = {
  withLandmarks: true,
  minConfidence: 1,
  MODEL_URLS: {
    Mobilenetv1Model:
      "https://raw.githubusercontent.com/ml5js/ml5-data-and-models/main/models/faceapi/ssd_mobilenetv1_model-weights_manifest.json",
    FaceExpressionModel:
      "https://raw.githubusercontent.com/justadudewhohacks/face-api.js/master/weights/face_expression_model-weights_manifest.json",
    TinyFaceLandmarkModel:
      "https://raw.githubusercontent.com/justadudewhohacks/face-api.js/master/weights/tiny_face_detector_model-weights_manifest.json",
    FaceLandmark68TinyNet:
      "https://raw.githubusercontent.com/justadudewhohacks/face-api.js/master/weights/face_landmark_68_model-weights_manifest.json",
    FaceRecognitionModel:
      "https://raw.githubusercontent.com/justadudewhohacks/face-api.js/master/weights/face_recognition_model-weights_manifest.json",
  },
};

export const NOTIFICATION_TIMES = {
  WORK: 10,
  REST: 10,
  STALE: 5,
};
