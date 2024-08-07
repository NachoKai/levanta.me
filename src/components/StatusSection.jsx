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
  const icon = {
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
      gap={{ base: "4px", sm: "8px", md: "16px", lg: "24px", xl: "32px" }}
      justify="space-between"
      p="24px"
      w="100%"
    >
      <Flex align="center" gap={4}>
        <Text fontWeight="bold">Current Status:</Text>
        <Text>
          {capitalizedStatus} {isPaused ? "(Paused)" : ""}
        </Text>
        <Icon alt="Status" as={icon[status] || MdOutlineQueryBuilder} boxSize="20px" />
      </Flex>
      <Flex align="center" gap={4}>
        <Text fontWeight="bold">Face Detected: </Text>
        <Text>{faceDetected ? "Yes" : "No"}</Text>
        <Icon
          alt="Face Detected"
          as={faceDetected ? MdAccountCircle : MdCircle}
          boxSize="20px"
          color={faceDetected ? "green.500" : "red.500"}
        />
      </Flex>
    </Flex>
  );
};

StatusSection.propTypes = {
  status: PropTypes.string,
  faceDetected: PropTypes.bool,
  isPaused: PropTypes.bool,
};
