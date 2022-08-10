import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components/native';

import { scale } from '../../platformUtils';
import { color } from '../../styles';
import { prize } from '../../../assets/images';

const Container = styled.TouchableOpacity`
  align-items: center;
  background-color: ${color.white};
  border-color: ${color.white};
  border-width: ${1};
  border-radius: ${scale(20)};
  height: ${scale(40)};
  justify-content: center;
  width: ${scale(40)};
`;

const Prize = styled.Image`
  height: ${scale(24)};
  width: ${scale(24)};
`;

const PrizeContainer = styled.TouchableOpacity`
  position: absolute;
  right: ${scale(-12)};
  top: ${scale(6)};
  z-index: 2;
`;

const ProfileImage = styled.Image`
  overflow: hidden;
`;

const ProfileImageView = styled.View`
  height: ${scale(40)};
  width: ${scale(40)};
  border-radius: ${scale(20)};
  background-color: ${color.darkGrey};
`;

const ProfileIcon = ({ profileImageUri, isPrizeAvailable, onPress }) => {
  return (
    <Container activeOpacity={1} onPress={onPress} testID="profile-button">
      {isPrizeAvailable && (
        <PrizeContainer activeOpacity={1} onPress={onPress}>
          <Prize source={prize} />
        </PrizeContainer>
      )}
      <ProfileImageView>
        {profileImageUri && <ProfileImage source={{ uri: profileImageUri }} resizeMode="contain" />}
      </ProfileImageView>
    </Container>
  );
};

ProfileIcon.propTypes = {
  isPrizeAvailable: PropTypes.bool,
  onPress: PropTypes.func,
  // TODO: add default Image when available
  profileImageUri: PropTypes.string
};

ProfileIcon.defaultProps = {
  isPrizeAvailable: false,
  onPress: () => {},
  profileImageUri: ''
};

export default ProfileIcon;
