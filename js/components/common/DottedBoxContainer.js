import React from 'react';
import styled from 'styled-components/native';
import PropTypes from 'prop-types';
import { color } from '../../styles';
import { scale, scaleHeight } from '../../platformUtils';

const OuterBox = styled.View`
  border-radius: ${scale(8)};
`;

const Dot = styled.View`
  border-radius: ${scale(2)};
  height: ${scale(4)};
  width: ${scale(4)};
  ${({ dotColor }) => dotColor && `background-color: ${dotColor}`};
`;

const HorizontalBorderContainer = styled.View`
  align-items: center;
  flex-direction: row;
  justify-content: space-around;
  position: absolute;
  height: ${({ bdWidth }) => bdWidth};
  width: ${({ width }) => width || '100%'};
  padding-horizontal: ${scaleHeight(2)};
  ${({ isTop, bdWidth }) => isTop && `top: ${-bdWidth}`}
  ${({ isBottom, bdWidth }) => isBottom && `bottom: ${-bdWidth}`};
`;

const SideBorderContainer = styled.View`
  align-items: center;
  height: 100%;
  justify-content: space-around;
  position: absolute;
  width: ${({ bdWidth }) => bdWidth};
  padding-vertical: ${scaleHeight(2)};
  ${({ isLeft, bdWidth }) => isLeft && `left: ${-bdWidth}`}
  ${({ isRight, bdWidth }) => isRight && `right: ${-bdWidth}`}
`;

const FourCorner = styled.View`
  align-items: center;
  position: absolute;
  justify-content: center;
  height: ${({ size }) => scaleHeight(size)};
  width: ${({ size }) => scaleHeight(size)};
`;

const DottedBoxContainer = ({
  children,
  borderColor,
  borderWidth,
  dotColor,
  numberDotsHorizontal,
  numberDotsVertical,
  innerWidth
}) => {
  const renderDots = numberOfDots => {
    return [...Array(numberOfDots)].map((val, index) => <Dot dotColor={dotColor} key={`${index}`} />);
  };

  // corner dots are closer to the inner board
  const cornerPosition = -borderWidth + 2;

  return (
    <OuterBox borderColor={borderColor} borderWidth={borderWidth} backgroundColor={borderColor}>
      <HorizontalBorderContainer isTop bdWidth={borderWidth} width={innerWidth}>
        {renderDots(numberDotsHorizontal)}
      </HorizontalBorderContainer>
      <HorizontalBorderContainer isBottom bdWidth={borderWidth} width={innerWidth}>
        {renderDots(numberDotsHorizontal)}
      </HorizontalBorderContainer>
      <SideBorderContainer isLeft bdWidth={borderWidth}>
        {renderDots(numberDotsVertical)}
      </SideBorderContainer>
      <SideBorderContainer isRight bdWidth={borderWidth}>
        {renderDots(numberDotsVertical)}
      </SideBorderContainer>
      <FourCorner size={borderWidth} top={cornerPosition} left={cornerPosition}>
        <Dot dotColor={dotColor} />
      </FourCorner>
      <FourCorner size={borderWidth} top={cornerPosition} right={cornerPosition}>
        <Dot dotColor={dotColor} />
      </FourCorner>
      <FourCorner size={borderWidth} bottom={cornerPosition} left={cornerPosition}>
        <Dot dotColor={dotColor} />
      </FourCorner>
      <FourCorner size={borderWidth} bottom={cornerPosition} right={cornerPosition}>
        <Dot dotColor={dotColor} />
      </FourCorner>
      {children}
    </OuterBox>
  );
};

DottedBoxContainer.propTypes = {
  children: PropTypes.node.isRequired,
  borderColor: PropTypes.string,
  borderWidth: PropTypes.number,
  dotColor: PropTypes.string,
  numberDotsHorizontal: PropTypes.number,
  numberDotsVertical: PropTypes.number,
  innerWidth: PropTypes.number
};

DottedBoxContainer.defaultProps = {
  borderWidth: 8,
  borderColor: color.lightGrey,
  dotColor: color.darkerWhite,
  numberDotsHorizontal: 26,
  numberDotsVertical: 4,
  innerWidth: null
};

export default DottedBoxContainer;
