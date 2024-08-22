import { Flex, Icon, Text } from "@chakra-ui/react";
import PropTypes from "prop-types";

export const StatusItem = ({ label, value, icon, color, testId }) => (
  <Flex align="center" gap={2} w={{ sm: "100%", md: "50%" }}>
    <Text fontWeight="bold">{label}:</Text>
    <Text>{value}</Text>
    <Icon
      alt={label}
      as={icon}
      boxSize="20px"
      color={color}
      data-testid={testId}
      h="auto"
    />
  </Flex>
);

StatusItem.propTypes = {
  label: PropTypes.string.isRequired,
  value: PropTypes.string.isRequired,
  icon: PropTypes.elementType.isRequired,
  color: PropTypes.string,
  testId: PropTypes.string.isRequired,
};
