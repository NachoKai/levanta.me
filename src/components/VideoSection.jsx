import PropTypes from "prop-types";
import styled from "styled-components";
import { Flex } from "./StyledComponents";

export const VideoSection = ({ videoRef, canvasRef }) => {
  return (
    <Flex width="100%" align="center" justify="center">
      <Video ref={videoRef} autoPlay muted />
      <Canvas ref={canvasRef} />
    </Flex>
  );
};

export const Video = styled.video`
  position: absolute;
  top: 0;
  width: 100%;
  max-width: 416px;
  height: auto;
  aspect-ratio: 1 / 1;
`;

export const Canvas = styled.canvas`
  position: absolute;
  top: 0;
  width: 100%;
  max-width: 416px;
  height: auto;
  aspect-ratio: 1 / 1;
`;

VideoSection.propTypes = {
  videoRef: PropTypes.object.isRequired,
  canvasRef: PropTypes.object.isRequired,
};
