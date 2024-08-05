import PropTypes from "prop-types";
import styled from "styled-components";
import IdleIcon from "../assets/idle.svg";
import RestIcon from "../assets/rest.svg";
import WorkIcon from "../assets/work.svg";
import { Flex, Icon, Text } from "./StyledComponents";

export const InputsSection = ({ notificationTimes, handleInputChange }) => {
  return (
    <Flex width="100%" direction="column" gap="16px" align="center">
      <InputWrapper>
        <Label htmlFor="WORK">
          <Icon $white size="19px" src={WorkIcon} alt="Work" />
          <Text fontWeight="bold">Work time (minutes):</Text>
        </Label>
        <Input
          type="number"
          id="WORK"
          name="WORK"
          value={notificationTimes.WORK}
          onChange={handleInputChange}
          min="1"
        />
      </InputWrapper>
      <InputWrapper>
        <Label htmlFor="IDLE">
          <Icon $white size="22px" src={IdleIcon} alt="Idle" />
          <Text fontWeight="bold">Idle time (minutes):</Text>
        </Label>
        <Input
          type="number"
          id="IDLE"
          name="IDLE"
          value={notificationTimes.IDLE}
          onChange={handleInputChange}
          min="1"
        />
      </InputWrapper>
      <InputWrapper>
        <Label htmlFor="REST">
          <Icon $white size="22px" src={RestIcon} alt="Rest" />
          <Text fontWeight="bold">Rest time (minutes):</Text>
        </Label>
        <Input
          type="number"
          id="REST"
          name="REST"
          value={notificationTimes.REST}
          onChange={handleInputChange}
          min="1"
        />
      </InputWrapper>
    </Flex>
  );
};

const InputWrapper = styled(Flex)`
  align-items: center;
  width: 100%;
  gap: 8px;
`;

const Label = styled.label`
  display: flex;
  align-items: center;
  gap: 8px;
  color: #eee;
  width: 50%;
`;

const Input = styled.input`
  width: 50%;
  padding: 8px;
  border: 1px solid #ccc;
  border-radius: 4px;
  font-size: 16px;
`;

InputsSection.propTypes = {
  notificationTimes: PropTypes.object.isRequired,
  handleInputChange: PropTypes.func.isRequired,
};
