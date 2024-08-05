import PropTypes from "prop-types";
import styled from "styled-components";
import { Flex, Text } from "./StyledComponents";

export const NotificationsSection = ({
  isMobile,
  isWorking,
  workTimeExceeded,
  isIdle,
  idleTimeExceeded,
  isResting,
  restTimeExceeded,
}) => {
  return (
    <Flex
      width="100%"
      gap="8px"
      padding="8px 0"
      radius="5px"
      align="center"
      justify="center"
      direction={isMobile ? "column" : "row"}
    >
      {isWorking && workTimeExceeded && (
        <Notification>Work time finished. Go for a break! 🛌</Notification>
      )}
      {isIdle && idleTimeExceeded && (
        <Notification>Idle time finished. Timers have been reset. ⏰</Notification>
      )}
      {isResting && restTimeExceeded && (
        <Notification>Rest time finished. Get back to work! 💼</Notification>
      )}
    </Flex>
  );
};

const Notification = styled(Text)`
  color: #eee;
  background-color: #444;
  border-radius: 5px;
  padding: 8px 16px;
  font-weight: bold;
  text-align: center;
  width: 100%;
`;

NotificationsSection.propTypes = {
  isMobile: PropTypes.bool.isRequired,
  isWorking: PropTypes.bool.isRequired,
  workTimeExceeded: PropTypes.bool.isRequired,
  isIdle: PropTypes.bool.isRequired,
  idleTimeExceeded: PropTypes.bool.isRequired,
  isResting: PropTypes.bool.isRequired,
  restTimeExceeded: PropTypes.bool.isRequired,
};
