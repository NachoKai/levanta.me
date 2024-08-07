import { Flex, Icon, Text, useColorModeValue } from "@chakra-ui/react";
import PropTypes from "prop-types";
import { MdOutlineBed, MdOutlineQueryBuilder, MdWorkOutline } from "react-icons/md";

import { formatCounter } from "../utils/formatCounter";

export const TimersSection = ({ workTime, restTime, idleTime }) => {
  return (
    <Flex
      align="center"
      bg={useColorModeValue("gray.100", "gray.700")}
      borderRadius={5}
      boxShadow="md"
      direction={{ base: "column", sm: "column", md: "row" }}
      gap={{ base: "4px", sm: "8px", md: "16px", lg: "24px", xl: "32px" }}
      justify="space-between"
      p="24px"
      w="100%"
    >
      <Flex
        align="center"
        gap={4}
        justify="center"
        width={{ base: "100%:", sm: "100%", md: "30%" }}
      >
        <Icon alt="Work" as={MdWorkOutline} boxSize="20px" />
        <Text fontWeight={600}>Work Time: {formatCounter(workTime)}</Text>
      </Flex>
      <Flex
        align="center"
        gap={4}
        justify="center"
        width={{ base: "100%:", sm: "100%", md: "30%" }}
      >
        <Icon alt="Idle" as={MdOutlineQueryBuilder} boxSize="20px" />
        <Text fontWeight={600}>Idle Time: {formatCounter(idleTime)}</Text>
      </Flex>
      <Flex
        align="center"
        gap={4}
        justify="center"
        width={{ base: "100%:", sm: "100%", md: "30%" }}
      >
        <Icon alt="Rest" as={MdOutlineBed} boxSize="20px" />
        <Text fontWeight={600}>Rest Time: {formatCounter(restTime)}</Text>
      </Flex>
    </Flex>
  );
};

TimersSection.propTypes = {
  workTime: PropTypes.number.isRequired,
  restTime: PropTypes.number.isRequired,
  idleTime: PropTypes.number.isRequired,
};
