import React from 'react';
import styled from 'styled-components/native';
import PropTypes from 'prop-types';

import QueueItem from './QueueItem';
import { scale, scaleHeight } from '../../platformUtils';
import { color } from '../../styles';
import { eye, hourGlass } from '../../../assets/images';

const BarContainer = styled.View`
  align-items: center;
  background-color: ${color.whiteTransparent};
  border-radius: ${scaleHeight(20)};
  flex-direction: row;
  height: ${scaleHeight(40)};
  justify-content: space-around;
  margin-top: ${scale(24)};
  min-width: ${scale(100)};
  padding-horizontal: ${scale(5)};
`;

const QueueBar = ({ watchingQueue, gameQueue }) => {
  return (
    <BarContainer>
      <QueueItem icon={eye} title={watchingQueue} />
      <QueueItem icon={hourGlass} title={gameQueue} />
    </BarContainer>
  );
};

QueueBar.propTypes = {
  watchingQueue: PropTypes.number.isRequired,
  gameQueue: PropTypes.number.isRequired
};

export default QueueBar;
