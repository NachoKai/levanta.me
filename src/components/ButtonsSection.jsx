import { Button, Flex, Icon } from "@chakra-ui/react";
import PropTypes from "prop-types";
import { MdOutlineBed, MdOutlinePause, MdPlayArrow, MdReplay, MdWork } from "react-icons/md";

export const ButtonsSection = ({
  isWorking,
  isResting,
  isIdle,
  isPaused,
  startWorking,
  startResting,
  togglePause,
  resetTimers,
}) => {
  return (
    <Flex
      align="center"
      border="1px solid #eee"
      borderRadius={5}
      boxShadow="md"
      direction={{ base: "column", sm: "column", md: "row" }}
      gap={{ base: "4px", sm: "8px", md: "16px", lg: "24px", xl: "32px" }}
      justify="space-between"
      p="24px"
      w="100%"
    >
      <Button
        isDisabled={isWorking}
        leftIcon={<Icon alt="Work" as={MdWork} boxSize="20px" />}
        w={{ base: "100%", sm: "100%", md: "300px" }}
        onClick={startWorking}
      >
        Work
      </Button>

      <Button
        isDisabled={isResting}
        leftIcon={<Icon alt="Rest" as={MdOutlineBed} boxSize="20px" />}
        w={{ base: "100%", sm: "100%", md: "300px" }}
        onClick={startResting}
      >
        Rest
      </Button>

      <Button
        isDisabled={isIdle}
        leftIcon={
          <Icon
            alt={isPaused ? "Play" : "Pause"}
            as={isPaused ? MdPlayArrow : MdOutlinePause}
            boxSize="20px"
          />
        }
        w={{ base: "100%", sm: "100%", md: "300px" }}
        onClick={togglePause}
      >
        {isPaused ? "Play" : "Pause"}
      </Button>

      <Button
        isDisabled={isIdle}
        leftIcon={<Icon alt="Reset" as={MdReplay} boxSize="20px" />}
        w={{ base: "100%", sm: "100%", md: "300px" }}
        onClick={resetTimers}
      >
        Reset
      </Button>
    </Flex>
  );
};

ButtonsSection.propTypes = {
  startWorking: PropTypes.func.isRequired,
  startResting: PropTypes.func.isRequired,
  togglePause: PropTypes.func.isRequired,
  resetTimers: PropTypes.func.isRequired,
  isWorking: PropTypes.bool.isRequired,
  isResting: PropTypes.bool.isRequired,
  isPaused: PropTypes.bool.isRequired,
  isIdle: PropTypes.bool.isRequired,
};
