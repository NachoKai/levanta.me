import { Flex, useColorModeValue } from "@chakra-ui/react";
import PropTypes from "prop-types";
import {
  MdOutlineBed,
  MdOutlineQueryBuilder,
  MdWorkOutline,
} from "react-icons/md";
import { Timer } from "./Timer";

export const TimersSection = ({ workTime, restTime, idleTime }) => {
  return (
    <Flex
      align="center"
      bg={useColorModeValue("gray.100", "gray.700")}
      border="1px solid"
      borderColor={useColorModeValue("gray.200", "gray.600")}
      borderRadius="24px"
      boxShadow="md"
      direction={{ base: "column", sm: "column", md: "row" }}
      gap={{ base: "8px", sm: "8px", md: "16px", lg: "24px", xl: "32px" }}
      justify="space-between"
      p="24px"
      w="100%"
    >
      <Timer
        icon={MdWorkOutline}
        label="Work Time"
        testId="work-icon"
        time={workTime}
      />

      <Timer
        icon={MdOutlineQueryBuilder}
        label="Idle Time"
        testId="idle-icon"
        time={idleTime}
      />

      <Timer
        icon={MdOutlineBed}
        label="Rest Time"
        testId="rest-icon"
        time={restTime}
      />
    </Flex>
  );
};

TimersSection.propTypes = {
  workTime: PropTypes.number.isRequired,
  restTime: PropTypes.number.isRequired,
  idleTime: PropTypes.number.isRequired,
};
