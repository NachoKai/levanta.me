import { AspectRatio, Flex } from "@chakra-ui/react";
import PropTypes from "prop-types";
import { CameraUnavailable } from "./CameraUnavailable";

export const VideoSection = ({ videoRef, canvasRef }) => {
  const isCameraAvailable = videoRef && canvasRef;

  return (
    <Flex justify="center" w="100%">
      {isCameraAvailable ? (
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
        <CameraUnavailable />
      )}
    </Flex>
  );
};

VideoSection.propTypes = {
  videoRef: PropTypes.object,
  canvasRef: PropTypes.object,
};
