import { Flex, Icon, Text } from "@chakra-ui/react";
import { MdOutlineCameraAlt } from "react-icons/md";

export const CameraUnavailable = () => (
  <Flex
    align="center"
    borderRadius={5}
    boxShadow="md"
    direction="column"
    gap={{ base: "8px", sm: "8px", md: "16px", lg: "24px", xl: "32px" }}
    h={{ base: "335px", sm: "325px", md: "325px", lg: "285px", xl: "345px" }}
    justify="space-between"
    maxW={{ base: "100%", sm: "100%", md: "588px", lg: "670px", xl: "890px" }}
    p="24px"
    position="absolute"
    top="24px"
    w="100%"
  >
    <Icon aria-label="Camera" as={MdOutlineCameraAlt} boxSize="20px" h="auto" />
    <Text fontSize="lg" fontWeight={600}>
      Camera Unavailable
    </Text>
    <Text fontWeight={400}>You must allow access to your camera</Text>
  </Flex>
);
