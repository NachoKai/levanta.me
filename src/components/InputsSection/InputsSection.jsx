import { Flex, useColorModeValue } from "@chakra-ui/react";
import PropTypes from "prop-types";
import {
  MdAvTimer,
  MdNotifications,
  MdOutlineBed,
  MdOutlineQueryBuilder,
  MdOutlineWaterDrop,
  MdWorkOutline,
} from "react-icons/md";
import { ToggleColorMode } from "../ToggleColorMode";
import { FormInput } from "./FormInput";

export const InputsSection = ({
  notificationTimes,
  handleInputChange,
  telegramConfig,
  handleTelegramConfigChange,
  timerReminderInterval,
  handleTimerReminderIntervalChange,
  waterReminderInterval,
  handleWaterReminderIntervalChange,
}) => (
  <Flex
    align="center"
    bg={useColorModeValue("gray.100", "gray.700")}
    border="1px solid"
    borderColor={useColorModeValue("gray.200", "gray.600")}
    borderRadius="24px"
    boxShadow="md"
    direction="column"
    gap={{ base: "16px", sm: "16px", md: "16px", lg: "24px", xl: "32px" }}
    justify="space-between"
    p="24px"
    w="100%"
  >
    <Flex
      align="end"
      direction={{ base: "column", sm: "column", md: "row" }}
      gap={{ base: "16px", sm: "16px", md: "16px", lg: "24px", xl: "32px" }}
      w="100%"
    >
      <FormInput
        icon={MdWorkOutline}
        id="WORK"
        label="Work time (minutes)"
        min="1"
        placeholder="50"
        tooltip="How long you want to work"
        value={notificationTimes.WORK}
        onChange={handleInputChange}
      />

      <FormInput
        icon={MdOutlineQueryBuilder}
        id="IDLE"
        label="Idle time (minutes)"
        min="1"
        placeholder="50"
        tooltip="Bonus time"
        value={notificationTimes.IDLE}
        onChange={handleInputChange}
      />

      <FormInput
        icon={MdOutlineBed}
        id="REST"
        label="Rest time (minutes)"
        min="1"
        placeholder="10"
        tooltip="How long you want to rest"
        value={notificationTimes.REST}
        onChange={handleInputChange}
      />
    </Flex>

    <Flex
      align="end"
      direction={{ base: "column", sm: "column", md: "row" }}
      gap={{ base: "16px", sm: "16px", md: "16px", lg: "24px", xl: "32px" }}
      w="100%"
    >
      <FormInput
        icon={MdAvTimer}
        id="timerReminderInterval"
        label="Timer Reminder Interval (minutes)"
        min="0"
        placeholder="5"
        tooltip="Time it will take before a work/rest reminder is sent again if time is exceeded"
        value={timerReminderInterval}
        onChange={handleTimerReminderIntervalChange}
      />

      <FormInput
        icon={MdOutlineWaterDrop}
        id="waterReminderInterval"
        label="Water Reminder Interval (minutes)"
        min="0"
        placeholder="20"
        tooltip="Time it will take before a water reminder is sent"
        value={waterReminderInterval}
        onChange={handleWaterReminderIntervalChange}
      />
    </Flex>

    <Flex
      align="end"
      direction={{ base: "column", sm: "column", md: "row" }}
      gap={{ base: "16px", sm: "16px", md: "16px", lg: "24px", xl: "32px" }}
      w="100%"
    >
      <FormInput
        icon={MdNotifications}
        id="botToken"
        label="Telegram Bot Token"
        placeholder="Bot Token from @BotFather"
        tooltip="Bot Token from @BotFather"
        type="text"
        value={telegramConfig.botToken}
        onChange={handleTelegramConfigChange}
      />

      <FormInput
        icon={MdNotifications}
        id="chatId"
        label="Telegram Chat ID"
        placeholder="Chat ID from @BotFather"
        tooltip="Chat ID from @BotFather"
        type="text"
        value={telegramConfig.chatId}
        onChange={handleTelegramConfigChange}
      />

      <ToggleColorMode />
    </Flex>
  </Flex>
);

InputsSection.propTypes = {
  notificationTimes: PropTypes.object.isRequired,
  handleInputChange: PropTypes.func.isRequired,
  timerReminderInterval: PropTypes.number.isRequired,
  handleTimerReminderIntervalChange: PropTypes.func.isRequired,
  telegramConfig: PropTypes.shape({
    botToken: PropTypes.string.isRequired,
    chatId: PropTypes.string.isRequired,
  }).isRequired,
  handleTelegramConfigChange: PropTypes.func.isRequired,
  waterReminderInterval: PropTypes.number.isRequired,
  handleWaterReminderIntervalChange: PropTypes.func.isRequired,
};
