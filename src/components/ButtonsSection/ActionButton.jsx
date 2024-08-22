import { Button, Icon } from "@chakra-ui/react";
import PropTypes from "prop-types";

export const ActionButton = ({
  icon,
  label,
  onClick,
  isDisabled,
  variant = "solid",
}) => (
  <Button
    colorScheme="blue"
    isDisabled={isDisabled}
    leftIcon={<Icon as={icon} boxSize="20px" h="auto" />}
    variant={variant}
    w={{ base: "100%", sm: "100%", md: "300px" }}
    onClick={onClick}
  >
    {label}
  </Button>
);

ActionButton.propTypes = {
  icon: PropTypes.elementType,
  label: PropTypes.string,
  onClick: PropTypes.func,
  isDisabled: PropTypes.bool,
  variant: PropTypes.string,
};
