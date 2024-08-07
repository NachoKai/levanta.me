import { AspectRatio, Flex, Icon, Text } from "@chakra-ui/react";
import PropTypes from "prop-types";
import { MdOutlineCameraAlt } from "react-icons/md";

export const VideoSection = ({ videoRef, canvasRef }) => {
  return (
    <Flex justify="center" w="100%">
      {videoRef && canvasRef ? (
        <>
          <AspectRatio
            h="auto"
            maxW={{ base: 320, sm: 320, md: 416, lg: 512, xl: 608 }}
            position="absolute"
            ratio={{ base: 1, sm: 1, md: 4 / 3, lg: 4 / 3, xl: 16 / 9 }}
            top="24px"
            w="100%"
          >
            <video ref={videoRef} autoPlay muted />
          </AspectRatio>
          <AspectRatio
            h="auto"
            maxW={{ base: 320, sm: 320, md: 416, lg: 512, xl: 608 }}
            position="absolute"
            ratio={{ base: 1, sm: 1, md: 4 / 3, lg: 4 / 3, xl: 16 / 9 }}
            top="24px"
            w="100%"
          >
            <canvas ref={canvasRef} />
          </AspectRatio>
        </>
      ) : (
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
          <Icon alt="Camera" as={MdOutlineCameraAlt} boxSize="20px" h="auto" />
          <Text fontWeight={600} size="lg">
            Camera Unavailable
          </Text>
          <Text fontWeight={400}>You must allow access to your camera</Text>
        </Flex>
      )}
    </Flex>
  );
};

VideoSection.propTypes = {
  videoRef: PropTypes.object.isRequired,
  canvasRef: PropTypes.object.isRequired,
};
