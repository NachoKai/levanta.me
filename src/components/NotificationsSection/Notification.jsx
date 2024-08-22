import { Text } from "@chakra-ui/react";
import PropTypes from "prop-types";

export const Notification = ({ show, body }) => {
  if (!show) return null;

  return (
    <Text
      fontSize={{ base: "md", sm: "md", md: "xl", lg: "xl", xl: "2xl" }}
      fontWeight={600}
    >
      {body}
    </Text>
  );
};

Notification.propTypes = {
  show: PropTypes.bool,
  body: PropTypes.string,
};
