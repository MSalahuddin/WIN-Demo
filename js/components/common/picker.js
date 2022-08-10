import React from 'react';
import PropTypes from 'prop-types';
import RNPickerSelect from 'react-native-picker-select';
import styled from 'styled-components/native';
import { color } from '../../styles';
import {getWindowWidth, scale, scaleHeight, scaleWidth } from '../../platformUtils';
import { downArrow } from '../../../assets/images';


  const DownArrowImage = styled.Image`
  height: ${scale(16)};
  width: ${scale(16)};
  margin-top:${scaleHeight(8)};
  margin-right:${scaleWidth(10)};
  align-self:center;
`;
const filterWidth = (getWindowWidth() - 3 * scale(16)) / 2;
const StyledContainer = styled.View`
  flex: 1;
  border-radius: ${scaleHeight(5)};
  flex-direction: row;
  align-items: center;
  padding-bottom:2;
  height: ${scale(40)};
  justify-content: center;
`;

const Picker = ({ options, onValueChange,width}) => {
    return (
       
        <StyledContainer width={width}>
            <RNPickerSelect
            useNativeAndroidPickerStyle={false}
                style={{
                    placeholder: {
                        color: 'black',
                    },
                    inputAndroid:{
                        width: width || filterWidth,
                        alignItems: "center",
                        color: 'black',
                        borderRadius: scale(5),
                        borderColor: color.lightBlack,
                        backgroundColor:color.white, 
                        paddingHorizontal:scale(10),
                        fontSize:scale(12),
                        fontWeight:'bold'
                    }
                   
                }}
                Icon={()=> <DownArrowImage source={downArrow} resizeMode="contain" />}
                onValueChange={onValueChange}
                items={options}
                placeholder={{}}
            />
        </StyledContainer>
   
    );
}
Picker.defaultProps={
    width:null
}
Picker.propTypes = {
    options: PropTypes.arrayOf(PropTypes.shape({ label: PropTypes.string.isRequired, value: PropTypes.any.isRequired }))
        .isRequired,
    onValueChange: PropTypes.func.isRequired,
    width:PropTypes.number
};

export default Picker;
