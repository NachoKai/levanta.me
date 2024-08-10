import { Flex, Icon, Text } from "@chakra-ui/react";
import PropTypes from "prop-types";

import { formatCounter } from "../../utils/formatCounter";

export const Timer = ({ icon, label, time, testId }) => (
  <Flex
    direction={{ base: "row", sm: "row", md: "column" }}
    gap={4}
    justify="center"
    width={{ base: "100%", sm: "100%", md: "30%" }}
  >
    <Flex align="center" gap={2} w={{ base: "50%", sm: "50%", md: "100%" }}>
      <Icon as={icon} boxSize="20px" data-testid={testId} h="auto" />
      <Text fontWeight={600} w="90%">
        {label}
      </Text>
    </Flex>
    <Text
      fontSize={{ base: "md", sm: "md", md: "xl", lg: "xl", xl: "2xl" }}
      fontWeight={600}
      w={{ base: "50%", sm: "50%", md: "100%" }}
    >
      {formatCounter(time)}
    </Text>
  </Flex>
);

Timer.propTypes = {
  icon: PropTypes.elementType.isRequired,
  label: PropTypes.string.isRequired,
  time: PropTypes.number.isRequired,
  testId: PropTypes.string.isRequired,
};
