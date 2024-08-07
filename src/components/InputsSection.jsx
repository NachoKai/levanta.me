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
        <FormControl align="center" gap={8} w="100%">
          <FormLabel align="center" display="flex" gap={4} htmlFor="WORK" justify="center">
            <Icon alt="Work" as={MdWorkOutline} boxSize="20px" />
            <Text fontWeight="bold">Work time (minutes):</Text>
          </FormLabel>
          <Input
            bg={useColorModeValue("white", "gray.800")}
            colorScheme="blue"
            id="WORK"
            min="1"
            name="WORK"
            placeholder="50"
            type="number"
            value={notificationTimes.WORK}
            w="100%"
            onChange={handleInputChange}
          />
        </FormControl>

        <FormControl align="center" gap={8} w="100%">
          <FormLabel align="center" display="flex" gap={4} htmlFor="IDLE" justify="center">
            <Icon alt="Idle" as={MdOutlineQueryBuilder} boxSize="20px" />
            <Text fontWeight="bold">Idle time (minutes):</Text>
          </FormLabel>
          <Input
            bg={useColorModeValue("white", "gray.800")}
            colorScheme="blue"
            id="IDLE"
            min="1"
            name="IDLE"
            placeholder="50"
            type="number"
            value={notificationTimes.IDLE}
            w="100%"
            onChange={handleInputChange}
          />
        </FormControl>

        <FormControl align="center" gap={8} w="100%">
          <FormLabel align="center" display="flex" gap={4} htmlFor="REST" justify="center">
            <Icon alt="Rest" as={MdOutlineBed} boxSize="20px" />
            <Text fontWeight="bold">Rest time (minutes):</Text>
          </FormLabel>
          <Input
            bg={useColorModeValue("white", "gray.800")}
            colorScheme="blue"
            id="REST"
            min="1"
            name="REST"
            placeholder="10"
            type="number"
            value={notificationTimes.REST}
            w="100%"
            onChange={handleInputChange}
          />
        </FormControl>
      </Flex>

      <Flex
        align="end"
        direction={{ base: "column", sm: "column", md: "row" }}
        gap={{ base: "4px", sm: "16px", md: "16px", lg: "24px", xl: "32px" }}
        w="100%"
      >
        <FormControl align="center" gap={8} w="100%">
          <FormLabel align="center" display="flex" gap={4} htmlFor="BOT_TOKEN" justify="center">
            <Icon alt="Telegram" as={MdNotifications} boxSize="20px" />
            <Text fontWeight="bold">Telegram Bot Token:</Text>
          </FormLabel>
          <Input
            bg={useColorModeValue("white", "gray.800")}
            colorScheme="blue"
            id="BOT_TOKEN"
            name="BOT_TOKEN"
            placeholder="Bot Token from @BotFather"
            type="text"
            value={botToken}
            w="100%"
            onChange={handleBotTokenChange}
          />
        </FormControl>

        <FormControl align="center" gap={8} w="100%">
          <FormLabel align="center" display="flex" gap={4} htmlFor="CHAT_ID" justify="center">
            <Icon alt="Telegram" as={MdNotifications} boxSize="20px" />
            <Text fontWeight="bold">Telegram Chat ID:</Text>
          </FormLabel>
          <Input
            bg={useColorModeValue("white", "gray.800")}
            colorScheme="blue"
            id="CHAT_ID"
            name="CHAT_ID"
            placeholder="Chat ID from @BotFather"
            type="text"
            value={chatId}
            w="100%"
            onChange={handleChatIdChange}
          />
        </FormControl>

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
