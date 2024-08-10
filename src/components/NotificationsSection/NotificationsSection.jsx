import { Flex, useColorModeValue } from "@chakra-ui/react";
import PropTypes from "prop-types";
import { Notification } from "./Notification";

export const NotificationsSection = ({
  isWorking,
  workTimeExceeded,
  isIdle,
  idleTimeExceeded,
  isResting,
  restTimeExceeded,
}) => {
  const showWorkingNotification = isWorking && workTimeExceeded;
  const showIdleNotification = isIdle && idleTimeExceeded;
  const showRestingNotification = isResting && restTimeExceeded;
  const showNotifications =
    showWorkingNotification || showIdleNotification || showRestingNotification;

  return (
    <Flex
      align="center"
      bg={useColorModeValue("gray.100", "gray.700")}
      borderRadius={5}
      boxShadow="md"
      direction={{ base: "column", sm: "column", md: "row" }}
      display={showNotifications ? "flex" : "none"}
      gap={{ base: "8px", sm: "8px", md: "16px", lg: "24px", xl: "32px" }}
      justify="space-between"
      p="24px"
      w="100%"
    >
      <Notification body="Work time finished. Go for a break! 🛌" show={showWorkingNotification} />

      <Notification
        body="Idle time finished. Timers have been reset. ⏰"
        show={showIdleNotification}
      />

      <Notification
        body="Rest time finished. Get back to work! 💼"
        show={showRestingNotification}
      />
    </Flex>
  );
};

NotificationsSection.propTypes = {
  isWorking: PropTypes.bool.isRequired,
  workTimeExceeded: PropTypes.bool.isRequired,
  isIdle: PropTypes.bool.isRequired,
  idleTimeExceeded: PropTypes.bool.isRequired,
  isResting: PropTypes.bool.isRequired,
  restTimeExceeded: PropTypes.bool.isRequired,
};
