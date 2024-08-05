import PropTypes from "prop-types";
import IdleIcon from "../assets/idle.svg";
import RestIcon from "../assets/rest.svg";
import WorkIcon from "../assets/work.svg";
import { formatCounter } from "../utils/formatCounter";
import { Flex, Icon, Text } from "./StyledComponents";

export const TimersSection = ({ isMobile, workTime, restTime, idleTime }) => {
  return (
    <Flex
      width="100%"
      gap={isMobile ? "16px" : "32px"}
      height="100%"
      justify="space-between"
      padding="8px 0"
      background="#eee"
      radius="5px"
      align="center"
      direction={isMobile ? "column" : "row"}
    >
      <Flex align="center" justify="center" gap="4px" width={isMobile ? "100%" : "30%"}>
        <Icon size="19px" src={WorkIcon} alt="Work" />
        <Text fontWeight="500" color="#222">
          Work Time: {formatCounter(workTime)}
        </Text>
      </Flex>
      <Flex align="center" justify="center" gap="4px" width={isMobile ? "100%" : "30%"}>
        <Icon size="22px" src={IdleIcon} alt="Idle" />
        <Text fontWeight="500" color="#222">
          Idle Time: {formatCounter(idleTime)}
        </Text>
      </Flex>
      <Flex align="center" justify="center" gap="4px" width={isMobile ? "100%" : "30%"}>
        <Icon size="24px" src={RestIcon} alt="Rest" />
        <Text fontWeight="500" color="#222">
          Rest Time: {formatCounter(restTime)}
        </Text>
      </Flex>
    </Flex>
  );
};

TimersSection.propTypes = {
  isMobile: PropTypes.bool.isRequired,
  workTime: PropTypes.number.isRequired,
  restTime: PropTypes.number.isRequired,
  idleTime: PropTypes.number.isRequired,
};
