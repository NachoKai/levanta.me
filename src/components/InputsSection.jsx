import { Flex, FormControl, FormLabel, Icon, Input, Text } from "@chakra-ui/react";
import PropTypes from "prop-types";
import { BsClockHistory } from "react-icons/bs";
import { LiaTelegram } from "react-icons/lia";
import { MdOutlineBed, MdWorkOutline } from "react-icons/md";

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
      background="gray.100"
      border="1px solid gray.50"
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
          <FormLabel align="center" display="flex" gap={4} htmlFor="WORK">
            <Icon alt="Work" as={MdWorkOutline} boxSize="20px" />
            <Text fontWeight="bold">Work time (minutes):</Text>
          </FormLabel>
          <Input
            background="white"
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
          <FormLabel align="center" display="flex" gap={4} htmlFor="IDLE">
            <Icon alt="Idle" as={BsClockHistory} boxSize="20px" />
            <Text fontWeight="bold">Idle time (minutes):</Text>
          </FormLabel>
          <Input
            background="white"
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
          <FormLabel align="center" display="flex" gap={4} htmlFor="REST">
            <Icon alt="Rest" as={MdOutlineBed} boxSize="20px" />
            <Text fontWeight="bold">Rest time (minutes):</Text>
          </FormLabel>
          <Input
            background="white"
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
        align="center"
        direction={{ base: "column", sm: "column", md: "row" }}
        gap={{ base: "4px", sm: "16px", md: "16px", lg: "24px", xl: "32px" }}
        w="100%"
      >
        <FormControl align="center" gap={8} w="100%">
          <FormLabel align="center" display="flex" gap={4} htmlFor="BOT_TOKEN">
            <Icon alt="Telegram" as={LiaTelegram} boxSize="20px" />
            <Text fontWeight="bold">Telegram Bot Token:</Text>
          </FormLabel>
          <Input
            background="white"
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
          <FormLabel align="center" display="flex" gap={4} htmlFor="CHAT_ID">
            <Icon alt="Telegram" as={LiaTelegram} boxSize="20px" />
            <Text fontWeight="bold">Telegram Chat ID:</Text>
          </FormLabel>
          <Input
            background="white"
            id="CHAT_ID"
            name="CHAT_ID"
            placeholder="Chat ID from @BotFather"
            type="text"
            value={chatId}
            w="100%"
            onChange={handleChatIdChange}
          />
        </FormControl>
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
