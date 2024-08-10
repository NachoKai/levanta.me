import { Flex, useColorModeValue } from "@chakra-ui/react";
import PropTypes from "prop-types";
import {
  MdNotifications,
  MdOutlineBed,
  MdOutlineQueryBuilder,
  MdWorkOutline,
} from "react-icons/md";
import { ToggleColorMode } from "../ToggleColorMode";
import { FormInput } from "./FormInput";

export const InputsSection = ({
  notificationTimes,
  handleInputChange,
  telegramConfig,
  handleTelegramConfigChange,
}) => (
  <Flex
    align="center"
    bg={useColorModeValue("gray.100", "gray.700")}
    borderRadius={5}
    boxShadow="md"
    direction="column"
    gap={{ base: "16px", sm: "16px", md: "16px", lg: "24px", xl: "32px" }}
    justify="space-between"
    p="24px"
    w="100%"
  >
    <Flex
      align="center"
      direction={{ base: "column", sm: "column", md: "row" }}
      gap={{ base: "16px", sm: "16px", md: "16px", lg: "24px", xl: "32px" }}
      w="100%"
    >
      <FormInput
        icon={MdWorkOutline}
        id="WORK"
        label="Work time (minutes):"
        min="1"
        placeholder="50"
        value={notificationTimes.WORK}
        onChange={handleInputChange}
      />

      <FormInput
        icon={MdOutlineQueryBuilder}
        id="IDLE"
        label="Idle time (minutes):"
        min="1"
        placeholder="50"
        value={notificationTimes.IDLE}
        onChange={handleInputChange}
      />

      <FormInput
        icon={MdOutlineBed}
        id="REST"
        label="Rest time (minutes):"
        min="1"
        placeholder="10"
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
        icon={MdNotifications}
        id="botToken"
        label="Telegram Bot Token:"
        placeholder="Bot Token from @BotFather"
        type="text"
        value={telegramConfig.botToken}
        onChange={handleTelegramConfigChange}
      />

      <FormInput
        icon={MdNotifications}
        id="chatId"
        label="Telegram Chat ID:"
        placeholder="Chat ID from @BotFather"
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
  telegramConfig: PropTypes.shape({
    botToken: PropTypes.string.isRequired,
    chatId: PropTypes.string.isRequired,
  }).isRequired,
  handleTelegramConfigChange: PropTypes.func.isRequired,
};
