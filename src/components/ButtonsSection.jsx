import { Button, Flex, Icon, useColorModeValue } from "@chakra-ui/react";
import PropTypes from "prop-types";
import { MdKingBed, MdOutlinePause, MdPlayArrow, MdReplay, MdWork } from "react-icons/md";

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
  const bgColor = useColorModeValue("gray.100", "gray.700");

  return (
    <Flex
      align="center"
      bg={bgColor}
      borderRadius={5}
      boxShadow="md"
      direction={{ base: "column", sm: "column", md: "row" }}
      gap={{ base: "4px", sm: "8px", md: "16px", lg: "24px", xl: "32px" }}
      justify="space-between"
      p="24px"
      w="100%"
    >
      <ActionButton icon={MdWork} isDisabled={isWorking} label="Work" onClick={startWorking} />
      <ActionButton icon={MdKingBed} isDisabled={isResting} label="Rest" onClick={startResting} />
      <ActionButton
        icon={isPaused ? MdPlayArrow : MdOutlinePause}
        isDisabled={isIdle}
        label={isPaused ? "Play" : "Pause"}
        onClick={togglePause}
      />
      <ActionButton icon={MdReplay} isDisabled={isIdle} label="Reset" onClick={resetTimers} />
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

const ActionButton = ({ icon, label, onClick, isDisabled }) => (
  <Button
    colorScheme="blue"
    isDisabled={isDisabled}
    leftIcon={<Icon as={icon} boxSize="20px" h="auto" />}
    w={{ base: "100%", sm: "100%", md: "300px" }}
    onClick={onClick}
  >
    {label}
  </Button>
);

ActionButton.propTypes = {
  icon: PropTypes.elementType.isRequired,
  label: PropTypes.string.isRequired,
  onClick: PropTypes.func.isRequired,
  isDisabled: PropTypes.bool,
};
