import styled from "styled-components";

export const Flex = styled.div`
  display: flex;
  ${({ gap }) => gap && `gap: ${gap}`};
  ${({ align }) => align && `align-items: ${align}`};
  ${({ justify }) => justify && `justify-content: ${justify}`};
  ${({ direction }) => direction && `flex-direction: ${direction}`};
  ${({ width }) => width && `width: ${width}`};
  ${({ $maxWidth }) => $maxWidth && `max-width: ${$maxWidth}`};
  ${({ height }) => height && `height: ${height}`};
  ${({ padding }) => padding && `padding: ${padding}`};
  ${({ margin }) => margin && `margin: ${margin}`};
  ${({ radius }) => radius && `border-radius: ${radius}`};
  ${({ background }) => background && `background: ${background}`};
`;

export const Text = styled.span`
  ${({ width }) => width && `width: ${width}`};
  ${({ color }) => color && `color: ${color}`};
  ${({ fontSize }) => fontSize && `font-size: ${fontSize}`};
  ${({ fontWeight }) => fontWeight && `font-weight: ${fontWeight}`};
`;

export const Icon = styled.img`
  width: ${({ size }) => size || "24px"};
  height: ${({ size }) => size || "24px"};
  ${({ $white }) => $white && "filter: invert(1)"};
`;
