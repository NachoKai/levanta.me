import { Flex, useColorModeValue } from "@chakra-ui/react";
import PropTypes from "prop-types";
import {
  MdAccountCircle,
  MdCircle,
  MdOutlineBed,
  MdOutlineQueryBuilder,
  MdWorkOutline,
} from "react-icons/md";
import { StatusItem } from "./StatusItem";

export const StatusSection = ({ status, faceDetected, isPaused }) => {
  const statusIcons = {
    working: MdWorkOutline,
    resting: MdOutlineBed,
    idle: MdOutlineQueryBuilder,
  };
  const capitalizedStatus = status
    ? status.charAt(0).toUpperCase() + status.slice(1)
    : "";

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
      <StatusItem
        icon={statusIcons[status] || MdOutlineQueryBuilder}
        label="Current Status"
        testId="status-icon"
        value={`${capitalizedStatus} ${isPaused ? "(Paused)" : ""}`}
      />

      <StatusItem
        color={faceDetected ? "green.500" : "red.500"}
        icon={faceDetected ? MdAccountCircle : MdCircle}
        label="Face Detected"
        testId="face-icon"
        value={faceDetected ? "Yes" : "No"}
      />
    </Flex>
  );
};

StatusSection.propTypes = {
  status: PropTypes.string,
  faceDetected: PropTypes.bool,
  isPaused: PropTypes.bool,
};
