import { Flex } from "@chakra-ui/react";
import { useRef } from "react";
import { ButtonsSection } from "./components/ButtonsSection/ButtonsSection";
import { InputsSection } from "./components/InputsSection/InputsSection";
import { NotificationsSection } from "./components/NotificationsSection/NotificationsSection";
import { StatusSection } from "./components/StatusSection/StatusSection";
import { TimersSection } from "./components/TimersSection/TimersSection";
import { VideoSection } from "./components/VideoSection/VideoSection";
import { useFaceDetector } from "./hooks/useFaceDetector";
import { useLoadModels } from "./hooks/useLoadModels";
import { useSendNotifications } from "./hooks/useSendNotifications";
import { useStore } from "./hooks/useStore";
import { useTabTitle } from "./hooks/useTabTitle";
import { useTimers } from "./hooks/useTimers";

const App = () => {
  const {
    workTime,
    restTime,
    idleTime,
    isPaused,
    faceDetected,
    telegramConfig,
    status,
    notificationTimes,
    resetTimers,
    startResting,
    startWorking,
    togglePause,
    handleInputChange,
    handleTelegramConfigChange,
    timerReminderInterval,
    handleTimerReminderIntervalChange,
    waterReminderInterval,
    handleWaterReminderIntervalChange,
    useCamera,
    setUseCamera,
  } = useStore();
  const videoRef = useRef();
  const canvasRef = useRef();
  const isWorking = status === "working";
  const isResting = status === "resting";
  const isIdle = status === "idle";
  const workTimeExceeded = notificationTimes.WORK
    ? workTime >= notificationTimes.WORK * 60
    : false;
  const restTimeExceeded = notificationTimes.REST
    ? restTime >= notificationTimes.REST * 60
    : false;
  const idleTimeExceeded = notificationTimes.IDLE
    ? idleTime >= notificationTimes.IDLE * 60
    : false;

  useLoadModels();

  useFaceDetector({ videoRef, canvasRef });

  useTimers({ isWorking, isResting, isIdle });

  useSendNotifications({
    workTimeExceeded,
    restTimeExceeded,
    idleTimeExceeded,
    isWorking,
    isResting,
    isIdle,
    timerReminderInterval,
    waterReminderInterval,
  });

  useTabTitle({
    isIdle,
    isWorking,
    isResting,
    workTimeExceeded,
    restTimeExceeded,
    idleTimeExceeded,
  });

  return (
    <Flex align="center" direction="column" h="100%" w="100%">
      {useCamera && <VideoSection canvasRef={canvasRef} videoRef={videoRef} />}

      <Flex
        align="center"
        borderRadius={5}
        direction="column"
        gap={{ base: "8px", sm: "16px", md: "24px", lg: "24px", xl: "32px" }}
        maxW={{
          base: "100%",
          sm: "100%",
          md: "620px",
          lg: "720px",
          xl: "960px",
        }}
        p={{ base: "4px", sm: "8px", md: "16px", lg: "24px", xl: "32px" }}
        position="relative"
        top={{
          base: `${useCamera ? 360 : 0}px`,
          sm: `${useCamera ? 360 : 0}px`,
          md: `${useCamera ? 350 : 0}px`,
          lg: `${useCamera ? 400 : 0}px`,
          xl: `${useCamera ? 360 : 0}px`,
        }}
        w="100%"
      >
        <ButtonsSection
          isIdle={isIdle}
          isPaused={isPaused}
          isResting={isResting}
          isWorking={isWorking}
          resetTimers={resetTimers}
          startResting={startResting}
          startWorking={startWorking}
          togglePause={togglePause}
        />

        <TimersSection
          idleTime={idleTime}
          restTime={restTime}
          useCamera={useCamera}
          workTime={workTime}
        />

        <NotificationsSection
          idleTimeExceeded={idleTimeExceeded}
          isIdle={isIdle}
          isResting={isResting}
          isWorking={isWorking}
          restTimeExceeded={restTimeExceeded}
          workTimeExceeded={workTimeExceeded}
        />

        <StatusSection
          faceDetected={faceDetected}
          isPaused={isPaused}
          status={status}
          useCamera={useCamera}
        />

        <InputsSection
          handleInputChange={handleInputChange}
          handleTelegramConfigChange={handleTelegramConfigChange}
          handleTimerReminderIntervalChange={handleTimerReminderIntervalChange}
          handleWaterReminderIntervalChange={handleWaterReminderIntervalChange}
          notificationTimes={notificationTimes}
          setUseCamera={setUseCamera}
          telegramConfig={telegramConfig}
          timerReminderInterval={timerReminderInterval}
          useCamera={useCamera}
          waterReminderInterval={waterReminderInterval}
        />
      </Flex>
    </Flex>
  );
};

export default App;
