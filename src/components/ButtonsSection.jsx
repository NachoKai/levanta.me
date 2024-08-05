import PropTypes from "prop-types";
import styled from "styled-components";
import PauseIcon from "../assets/pause.svg";
import PlayIcon from "../assets/play.svg";
import ResetIcon from "../assets/replay.svg";
import { Flex, Icon } from "./StyledComponents";

export const ButtonsSection = ({
  isMobile,
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
      width="100%"
      gap={isMobile ? "16px" : "32px"}
      align="center"
      justify="space-between"
      direction={isMobile ? "column" : "row"}
    >
      <Button onClick={startWorking} disabled={isWorking} width={isMobile ? "100%" : "30%"}>
        Work
      </Button>
      <Button onClick={startResting} disabled={isResting} width={isMobile ? "100%" : "30%"}>
        Rest
      </Button>
      <Button width={isMobile ? "100%" : "20%"} onClick={togglePause} disabled={isIdle}>
        <Icon
          $white
          size="30px"
          src={isPaused ? PlayIcon : PauseIcon}
          alt={isPaused ? "Play" : "Pause"}
        />
      </Button>
      <Button onClick={resetTimers} disabled={isIdle} width={isMobile ? "100%" : "20%"}>
        <Icon $white size="30px" src={ResetIcon} alt="Reset" />
      </Button>
    </Flex>
  );
};

const Button = styled.button`
  ${({ width }) => width && `width: ${width}`};
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  font-size: 16px;
  font-weight: bold;
  color: white;
  background-color: #007bff;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  padding: 0;
  height: 42px;
  line-height: 42px;

  &:disabled {
    background-color: #cccccc;
    pointer-events: none;
  }
`;

ButtonsSection.propTypes = {
  isMobile: PropTypes.bool.isRequired,
  startWorking: PropTypes.func.isRequired,
  startResting: PropTypes.func.isRequired,
  togglePause: PropTypes.func.isRequired,
  resetTimers: PropTypes.func.isRequired,
  isWorking: PropTypes.bool.isRequired,
  isResting: PropTypes.bool.isRequired,
  isPaused: PropTypes.bool.isRequired,
  isIdle: PropTypes.bool.isRequired,
};
