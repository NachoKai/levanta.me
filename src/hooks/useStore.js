import { create } from "zustand";
import { immer } from "zustand/middleware/immer";

const initialState = {
  workTime: 0,
  restTime: 0,
  idleTime: 0,
  isPaused: false,
  modelsLoaded: false,
  faceDetected: false,
  telegramConfig: {
    botToken: localStorage.getItem("botToken") ?? "",
    chatId: localStorage.getItem("chatId") ?? "",
  },
  status: "idle",
  notificationSent: {
    workTime: false,
    restTime: false,
    idleTime: false,
  },
  notificationTimes: {
    WORK: parseInt(localStorage.getItem("workTime") ?? "50"),
    REST: parseInt(localStorage.getItem("restTime") ?? "10"),
    IDLE: parseInt(localStorage.getItem("idleTime") ?? "5"),
  },
};

export const useStore = create(
  immer(set => ({
    ...initialState,

    togglePause: () =>
      set(state => {
        state.isPaused = !state.isPaused;
      }),

    resetTimers: () =>
      set(state => {
        state.status = "idle";
        state.workTime = 0;
        state.restTime = 0;
        state.idleTime = 0;
        state.isPaused = false;
        state.notificationSent = { workTime: false, restTime: false, idleTime: false };
      }),

    startWorking: () =>
      set(state => {
        state.status = "working";
        state.restTime = 0;
        state.idleTime = 0;
      }),

    startResting: () =>
      set(state => {
        state.status = "resting";
        state.workTime = 0;
        state.idleTime = 0;
      }),

    handleInputChange: e =>
      set(state => {
        const value = e.target.value ? parseInt(e.target.value) : 0;

        state.notificationTimes[e.target.name] = value;
        localStorage.setItem(`${e.target.name.toLowerCase()}Time`, e.target.value);
      }),

    handleTelegramConfigChange: e =>
      set(state => {
        state.telegramConfig[e.target.name] = e.target.value;
        localStorage.setItem(e.target.name, e.target.value);
      }),

    setModelsLoaded: modelsLoaded =>
      set(state => {
        state.modelsLoaded = modelsLoaded;
      }),
    setFaceDetected: faceDetected =>
      set(state => {
        state.faceDetected = faceDetected;
      }),
    setTelegramConfig: telegramConfig =>
      set(state => {
        state.telegramConfig = telegramConfig;
      }),
    setStatus: status =>
      set(state => {
        state.status = status;
      }),
    setNotificationSent: notificationSent =>
      set(state => {
        state.notificationSent = notificationSent;
      }),
    setWorkTime: workTime =>
      set(state => {
        state.workTime = workTime;
      }),
    setRestTime: restTime =>
      set(state => {
        state.restTime = restTime;
      }),
    setIdleTime: idleTime =>
      set(state => {
        state.idleTime = idleTime;
      }),
    setNotificationTimes: notificationTimes =>
      set(state => {
        state.notificationTimes = notificationTimes;
      }),
  }))
);
