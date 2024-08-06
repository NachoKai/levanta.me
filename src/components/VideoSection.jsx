import { AspectRatio, Flex } from "@chakra-ui/react";
import PropTypes from "prop-types";

export const VideoSection = ({ videoRef, canvasRef }) => {
  return (
    <Flex align="center" borderRadius={5} justify="center" w="100%">
      <AspectRatio
        h="auto"
        maxW={{ base: 320, sm: 320, md: 416, lg: 512, xl: 608 }}
        position="absolute"
        ratio={{ base: 1, sm: 1, md: 4 / 3, lg: 4 / 3, xl: 16 / 9 }}
        top="0"
        w="100%"
      >
        <video ref={videoRef} autoPlay muted />
      </AspectRatio>
      <AspectRatio
        h="auto"
        maxW={{ base: 320, sm: 320, md: 416, lg: 512, xl: 608 }}
        position="absolute"
        ratio={{ base: 1, sm: 1, md: 4 / 3, lg: 4 / 3, xl: 16 / 9 }}
        top="0"
        w="100%"
      >
        <canvas ref={canvasRef} />
      </AspectRatio>
    </Flex>
  );
};

VideoSection.propTypes = {
  videoRef: PropTypes.object.isRequired,
  canvasRef: PropTypes.object.isRequired,
};
