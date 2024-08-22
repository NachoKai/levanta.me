import { Flex, Icon, Text, useColorModeValue } from "@chakra-ui/react";
import PropTypes from "prop-types";

export const StatusItem = ({ label, value, icon, color }) => (
  <Flex
    bg={useColorModeValue("gray.200", "gray.600")}
    border="1px solid"
    borderColor={useColorModeValue("gray.300", "gray.500")}
    borderRadius="16px"
    boxShadow="md"
    direction={{ base: "row", sm: "row", md: "column" }}
    gap={4}
    justify="center"
    p="24px"
    width={{ base: "100%", sm: "100%", md: "50%" }}
  >
    <Flex align="center" gap={2} w={{ base: "50%", sm: "50%", md: "100%" }}>
      <Text fontWeight={600} w="90%">
        {label}
      </Text>
    </Flex>

    <Flex align="center" gap={2} w={{ base: "50%", sm: "50%", md: "100%" }}>
      <Text
        fontSize={{ base: "md", sm: "md", md: "xl", lg: "xl", xl: "2xl" }}
        fontWeight={600}
        w={{ base: "50%", sm: "50%", md: "100%" }}
      >
        {value}
      </Text>
      <Icon alt={label} as={icon} boxSize="20px" color={color} h="auto" />
    </Flex>
  </Flex>
);

StatusItem.propTypes = {
  label: PropTypes.string,
  value: PropTypes.string,
  icon: PropTypes.elementType,
  color: PropTypes.string,
};
