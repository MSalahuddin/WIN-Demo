import React from 'react';
import styled from 'styled-components/native';
import PropTypes from 'prop-types';
import Text, { SIZE } from './Text'
import { color } from '../../styles';
import { common } from '../../stringConstants';
import FooterLoader from './FooterLoader'



const TextContentContainer = styled.TouchableOpacity`
align-items: center;
flex-direction: row;
justify-content: center;
margin-top: 20;
`;


const LazyLoadButton = ({onPress,loading}) => {
   if(loading){
    return <FooterLoader/>
   } 
    return (
        <TextContentContainer onPress={onPress}>
            <Text color={color.white} size={SIZE.SMALL}>
                {common.loadMore}
             </Text>
        </TextContentContainer>
    )
}

LazyLoadButton.propTypes = {
    onPress: PropTypes.func.isRequired,
    loading: PropTypes.bool.isRequired
  };

export default LazyLoadButton