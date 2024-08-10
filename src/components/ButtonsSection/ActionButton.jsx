import { Button, Icon } from "@chakra-ui/react";
import PropTypes from "prop-types";

export const ActionButton = ({ icon, label, onClick, isDisabled }) => (
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
