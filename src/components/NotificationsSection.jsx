import { Flex, Text } from "@chakra-ui/react";
import PropTypes from "prop-types";

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
      backgroundColor={showNotifications ? "#eee" : "transparent"}
      border={showNotifications ? "1px solid #eee" : "none"}
      borderRadius={5}
      boxShadow="md"
      direction={{ base: "column", sm: "column", md: "row" }}
      display={showNotifications ? "flex" : "none"}
      gap={{ base: "4px", sm: "8px", md: "16px", lg: "24px", xl: "32px" }}
      justify="space-between"
      p="24px"
      w="100%"
    >
      {showWorkingNotification && (
        <Text fontWeight={600} p="8px 16px">
          Work time finished. Go for a break! 🛌
        </Text>
      )}
      {showIdleNotification && (
        <Text fontWeight={600} p="8px 16px">
          Idle time finished. Timers have been reset. ⏰
        </Text>
      )}
      {showRestingNotification && (
        <Text fontWeight={600} p="8px 16px">
          Rest time finished. Get back to work! 💼
        </Text>
      )}
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
