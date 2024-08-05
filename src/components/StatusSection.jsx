import PropTypes from "prop-types";
import styled from "styled-components";
import { Flex, Text } from "./StyledComponents";

export const StatusSection = ({ isMobile, status, faceDetected, isPaused }) => {
  return (
    <Flex
      width="100%"
      justify="space-between"
      align="center"
      gap={isMobile ? "16px" : "32px"}
      direction={isMobile ? "column" : "row"}
    >
      <Flex gap="8px" align="center">
        <Text fontWeight="bold">Current Status:</Text>
        <Text>{isPaused ? "paused" : status}</Text>
      </Flex>
      <Flex gap="8px" align="center">
        <Text fontWeight="bold">Face Detected: </Text>
        <Text>{faceDetected ? "Yes" : "No"}</Text>
        <Circle color={faceDetected ? "#0f0" : "#f00"} />
      </Flex>
    </Flex>
  );
};

const Circle = styled.div`
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background-color: ${({ color }) => color};
`;

StatusSection.propTypes = {
  isMobile: PropTypes.bool,
  status: PropTypes.string,
  faceDetected: PropTypes.bool,
  isPaused: PropTypes.bool,
};
