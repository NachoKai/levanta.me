import {
  FormControl,
  FormLabel,
  Icon,
  Input,
  Text,
  Tooltip,
  useColorModeValue,
} from "@chakra-ui/react";
import PropTypes from "prop-types";

export const FormInput = ({
  icon,
  label,
  id,
  value,
  onChange,
  placeholder,
  type = "number",
  min,
  tooltip,
}) => (
  <FormControl align="center" gap={8} w="100%">
    <Tooltip label={tooltip} placement="top">
      <FormLabel align="center" display="flex" gap={2} htmlFor={id} justify="center">
        <Icon as={icon} boxSize="20px" h="auto" />
        <Text fontWeight="bold">{label}</Text>
      </FormLabel>
    </Tooltip>

    <Input
      bg={useColorModeValue("white", "gray.800")}
      colorScheme="blue"
      id={id}
      min={min}
      name={id}
      placeholder={placeholder}
      type={type}
      value={value}
      w="100%"
      onChange={onChange}
    />
  </FormControl>
);

FormInput.propTypes = {
  icon: PropTypes.elementType.isRequired,
  label: PropTypes.string.isRequired,
  id: PropTypes.string.isRequired,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  onChange: PropTypes.func.isRequired,
  placeholder: PropTypes.string,
  type: PropTypes.string,
  min: PropTypes.string,
  tooltip: PropTypes.string,
};
