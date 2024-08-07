import { Flex, Icon, Text, useColorModeValue } from "@chakra-ui/react";
import PropTypes from "prop-types";
import { MdOutlineBed, MdOutlineQueryBuilder, MdWorkOutline } from "react-icons/md";

import { formatCounter } from "../utils/formatCounter";

export const TimersSection = ({ workTime, restTime, idleTime }) => {
  const bgColor = useColorModeValue("gray.100", "gray.700");

  return (
    <Flex
      align="center"
      bg={bgColor}
      borderRadius={5}
      boxShadow="md"
      direction={{ base: "column", sm: "column", md: "row" }}
      gap={{ base: "4px", sm: "8px", md: "16px", lg: "24px", xl: "32px" }}
      justify="space-between"
      p="24px"
      w="100%"
    >
      <TimerItem icon={MdWorkOutline} label="Work Time" time={workTime} />
      <TimerItem icon={MdOutlineQueryBuilder} label="Idle Time" time={idleTime} />
      <TimerItem icon={MdOutlineBed} label="Rest Time" time={restTime} />
    </Flex>
  );
};

TimersSection.propTypes = {
  workTime: PropTypes.number.isRequired,
  restTime: PropTypes.number.isRequired,
  idleTime: PropTypes.number.isRequired,
};

const TimerItem = ({ icon, label, time }) => (
  <Flex
    direction={{ base: "row", sm: "row", md: "column" }}
    gap={4}
    justify="center"
    width={{ base: "100%", sm: "100%", md: "30%" }}
  >
    <Flex align="center" gap={2} w={{ base: "50%", sm: "50%", md: "100%" }}>
      <Icon as={icon} boxSize="20px" />
      <Text fontWeight={600} w="90%">
        {label}
      </Text>
    </Flex>
    <Text
      fontSize={{ base: "md", sm: "md", md: "xl", lg: "xl", xl: "2xl" }}
      fontWeight={600}
      w={{ base: "50%", sm: "50%", md: "100%" }}
    >
      {formatCounter(time)}
    </Text>
  </Flex>
);

TimerItem.propTypes = {
  icon: PropTypes.elementType.isRequired,
  label: PropTypes.string.isRequired,
  time: PropTypes.number.isRequired,
};
