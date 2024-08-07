import {
  Flex,
  FormControl,
  FormLabel,
  Icon,
  Input,
  Text,
  useColorModeValue,
} from "@chakra-ui/react";
import PropTypes from "prop-types";
import {
  MdNotifications,
  MdOutlineBed,
  MdOutlineQueryBuilder,
  MdWorkOutline,
} from "react-icons/md";

import { ToggleColorMode } from "./ToggleColorMode";

export const InputsSection = ({
  notificationTimes,
  handleInputChange,
  botToken,
  chatId,
  handleBotTokenChange,
  handleChatIdChange,
}) => {
  return (
    <Flex
      align="center"
      bg={useColorModeValue("gray.100", "gray.700")}
      borderRadius={5}
      boxShadow="md"
      direction="column"
      gap={{ base: "8px", sm: "16px", md: "16px", lg: "24px", xl: "32px" }}
      justify="space-between"
      p="24px"
      w="100%"
    >
      <Flex
        align="center"
        direction={{ base: "column", sm: "column", md: "row" }}
        gap={{ base: "8px", sm: "16px", md: "16px", lg: "24px", xl: "32px" }}
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
        gap={{ base: "4px", sm: "16px", md: "16px", lg: "24px", xl: "32px" }}
        w="100%"
      >
        <FormInput
          icon={MdNotifications}
          id="BOT_TOKEN"
          label="Telegram Bot Token:"
          placeholder="Bot Token from @BotFather"
          type="text"
          value={botToken}
          onChange={handleBotTokenChange}
        />
        <FormInput
          icon={MdNotifications}
          id="CHAT_ID"
          label="Telegram Chat ID:"
          placeholder="Chat ID from @BotFather"
          type="text"
          value={chatId}
          onChange={handleChatIdChange}
        />

        <ToggleColorMode />
      </Flex>
    </Flex>
  );
};

InputsSection.propTypes = {
  notificationTimes: PropTypes.object.isRequired,
  handleInputChange: PropTypes.func.isRequired,
  botToken: PropTypes.string.isRequired,
  chatId: PropTypes.string.isRequired,
  handleBotTokenChange: PropTypes.func.isRequired,
  handleChatIdChange: PropTypes.func.isRequired,
};

const FormInput = ({ icon, label, id, value, onChange, placeholder, type = "number", min }) => {
  return (
    <FormControl align="center" gap={8} w="100%">
      <FormLabel align="center" display="flex" gap={4} htmlFor={id} justify="center">
        <Icon as={icon} boxSize="20px" />
        <Text fontWeight="bold">{label}</Text>
      </FormLabel>
      <Input
        bg={useColorModeValue("white", "gray.800")}
        colorScheme="blue"
        id={id}
        min={min}
        name={id}
        placeholder={placeholder}
        type={type}
        value={value}
        w="100%"
        onChange={onChange}
      />
    </FormControl>
  );
};

FormInput.propTypes = {
  icon: PropTypes.elementType.isRequired,
  label: PropTypes.string.isRequired,
  id: PropTypes.string.isRequired,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  onChange: PropTypes.func.isRequired,
  placeholder: PropTypes.string,
  type: PropTypes.string,
  min: PropTypes.string,
};
