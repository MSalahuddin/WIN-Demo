import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components/native';
import { Platform } from 'react-native';
import Text, { SIZE } from './Text';
import { scale, scaleHeight } from '../../platformUtils';
import { color } from '../../styles';

const Container = styled.View`
  align-items: center;
  flex-direction: column;
  justify-content: center;
`;

const IconImage = styled.Image`
  height:${({ size }) => size};
  margin-right: ${scale(5)};
  width: ${({ size }) => size};
`;


const WatcherText = styled(Text)`
justify-content: center;
`;

const WatchDisplay = ({ children, icon, images, numberOfPeople,Size }) => {
  // const profileOne = images.length > 1 ? { uri: images[0] } : null;
  // const profileTwo = images.length > 2 ? { uri: images[1] } : null;

  const renderContent = () => {
    if (children) {
      return children;
    }

    return (
      <>
        {/* {images.length > 0 && (
          <ProfileContainer>
            <ProfileIconContainer>
              <ProfileIcon source={profileOne} resizeMode="contain" />
            </ProfileIconContainer>
            <ProfileIconContainer isOverlay>
              <ProfileIcon source={profileTwo} resizeMode="contain" />
            </ProfileIconContainer>
          </ProfileContainer>
        )} */}
        <WatcherText size={SIZE.XXSMALL}>{numberOfPeople}</WatcherText>
      </>
    );
  };

  return (
    <Container>
      <IconImage source={icon} size={Size} resizeMode="contain" />
      {renderContent()}
    </Container>
  );
};

WatchDisplay.propTypes = {
  children: PropTypes.node,
  icon: PropTypes.oneOfType([PropTypes.shape(), PropTypes.number]).isRequired,
  images: PropTypes.arrayOf(PropTypes.string),
  numberOfPeople: PropTypes.number
};

WatchDisplay.defaultProps = {
  children: null,
  images: [],
  numberOfPeople: 0
};

export default WatchDisplay;
