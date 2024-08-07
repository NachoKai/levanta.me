import { Button, Icon, useColorMode } from "@chakra-ui/react";
import { MdOutlineTungsten, MdTungsten } from "react-icons/md";

export const ToggleColorMode = () => {
  const { colorMode, toggleColorMode } = useColorMode();

  return (
    <Button colorScheme="blue" variant="ghost" onClick={toggleColorMode}>
      <Icon
        alt="Status"
        as={colorMode === "dark" ? MdTungsten : MdOutlineTungsten}
        boxSize="20px"
      />
    </Button>
  );
};
