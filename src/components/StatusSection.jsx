import { Flex, Icon, Text } from "@chakra-ui/react";
import PropTypes from "prop-types";
import { BsClockHistory } from "react-icons/bs";
import { IoIosCheckmarkCircle } from "react-icons/io";
import { IoCloseCircle } from "react-icons/io5";
import { MdOutlineBed, MdWork } from "react-icons/md";

export const StatusSection = ({ status, faceDetected, isPaused }) => {
  const icon = {
    working: MdWork,
    resting: MdOutlineBed,
    idle: BsClockHistory,
  };
  const capitalizedStatus = status ? status.charAt(0).toUpperCase() + status.slice(1) : "";

  return (
    <Flex
      align="center"
      border="1px solid #eee"
      borderRadius={5}
      direction={{ sm: "column", md: "row" }}
      gap={{ sm: "8px", md: "16px", lg: "24px", xl: "32px" }}
      justify="space-between"
      p="24px"
      w="100%"
    >
      <Flex align="center" gap={4}>
        <Text fontWeight="bold">Current Status:</Text>
        <Text>
          {capitalizedStatus} {isPaused ? "(Paused)" : ""}
        </Text>
        <Icon alt="Status" as={icon[status] || BsClockHistory} boxSize="20px" />
      </Flex>
      <Flex align="center" gap={4}>
        <Text fontWeight="bold">Face Detected: </Text>
        <Text>{faceDetected ? "Yes" : "No"}</Text>
        <Icon
          alt="Face Detected"
          as={faceDetected ? IoIosCheckmarkCircle : IoCloseCircle}
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
