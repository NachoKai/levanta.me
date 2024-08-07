import { Flex, Icon, Text, useColorModeValue } from "@chakra-ui/react";
import PropTypes from "prop-types";
import {
  MdAccountCircle,
  MdCircle,
  MdOutlineBed,
  MdOutlineQueryBuilder,
  MdWorkOutline,
} from "react-icons/md";

export const StatusSection = ({ status, faceDetected, isPaused }) => {
  const statusIcons = {
    working: MdWorkOutline,
    resting: MdOutlineBed,
    idle: MdOutlineQueryBuilder,
  };
  const capitalizedStatus = status ? status.charAt(0).toUpperCase() + status.slice(1) : "";

  return (
    <Flex
      align="center"
      bg={useColorModeValue("gray.100", "gray.700")}
      borderRadius={5}
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
        value={`${capitalizedStatus} ${isPaused ? "(Paused)" : ""}`.trim()}
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

const StatusItem = ({ label, value, icon, color, testId }) => (
  <Flex align="center" gap={2} w={{ sm: "100%", md: "50%" }}>
    <Text fontWeight="bold">{label}:</Text>
    <Text>{value}</Text>
    <Icon alt={label} as={icon} boxSize="20px" color={color} data-testid={testId} h="auto" />
  </Flex>
);

StatusItem.propTypes = {
  label: PropTypes.string.isRequired,
  value: PropTypes.string.isRequired,
  icon: PropTypes.elementType.isRequired,
  color: PropTypes.string,
  testId: PropTypes.string.isRequired,
};
