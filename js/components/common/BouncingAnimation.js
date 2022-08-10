import React, { useRef } from 'react';
import { View, Platform, Animated, Easing } from "react-native";
import Modal from 'react-native-modal';
import styled from 'styled-components/native';
import PropTypes from 'prop-types';
import * as Animatable from 'react-native-animatable';
import Text, { FONT_FAMILY, SIZE } from './Text';
import { scaleHeight, getWindowWidth, getWindowHeight, scaleWidth, scale, heightRatio } from '../../platformUtils';
import { color, fontFamily } from '../../styles';
import { bouncingAnimation } from "../../stringConstants";

const WIDTH = getWindowWidth();
const HEIGHT = getWindowHeight();

const InnerModalContainer = styled.View`
  align-items: center;
`;
const TextWrapper = styled(Text)`
  margin-top: ${scaleHeight(7)};
`;

const BouncingAnimation = ({ value }) => {
    const viewOneRef = useRef(null);
    const viewTwoRef = useRef(null);
    const glowingText = useRef(new Animated.Value(0)).current
    const secondAnimation = async () => {
        viewOneRef.current.fadeOutUpBig();
        viewTwoRef.current.zoomOut(100000);
    };

    Animated.loop(
        Animated.sequence([
            Animated.timing(glowingText, {
                toValue: 100,
                duration: 500,
                easing: Easing.ease,
                useNativeDriver: false
            }),
        ]), {}
    ).start()

    const shadowOffset = glowingText.interpolate({
        inputRange: [-60, 0],
        outputRange: [20, 0]
    })
    const shadowColor = glowingText.interpolate({
        inputRange: [0, 100],
        outputRange: ['rgba(6, 166, 196, 0.9)', 'rgba(7, 214, 247,1)'],
    })

    const shadowText = {
        fontSize: 22,
        shadowRadius: 10,
        shadowColor: color.black,
        fontFamily: fontFamily.calibreBold,
        textShadowColor: shadowColor,
        textShadowOffset: { width: 10, height: 10 },
        textShadowRadius: 10,
        shadowOffset: {
            width: 0,
            height: shadowOffset
        },
        elevation: 16,
        color: color.white,
        marginBottom: Platform.OS === 'android' ? 0 : 10,
        marginTop: Platform.OS === 'android' ? 5 : 20
    };
    const animatedText = {
        fontSize: 72
    };
    return (
        <View style={{ flex: 1, height: HEIGHT, width: WIDTH, position: 'absolute', zIndex: 1, justifyContent: "center", alignItems: "center" }}>
            <Animatable.View
                ref={viewOneRef}
                delay={300}
                duration={1500}
                animation={'bounceIn'}
                easing="linear"
                useNativeDriver
                onAnimationEnd={secondAnimation}
            >
                <Animatable.View
                    ref={viewTwoRef}
                    // delay={300}
                    // duration={1500}
                    easing="linear"
                    useNativeDriver
                >
                    <InnerModalContainer>
                        <TextWrapper color={color.white} fontFamily={FONT_FAMILY.BOLD} size={SIZE.XLARGE}>
                            {bouncingAnimation.youWon}
                        </TextWrapper>
                        <Animated.Text style={[shadowText, animatedText]}>{value}</Animated.Text>
                        <TextWrapper color={color.white} fontFamily={FONT_FAMILY.BOLD} size={SIZE.XLARGE}>
                            {bouncingAnimation.ticket}
                        </TextWrapper>
                    </InnerModalContainer>
                </Animatable.View>
            </Animatable.View>
        </View>
    );
};
BouncingAnimation.defaultProps = {
    value: null,
};
BouncingAnimation.propTypes = {
    value: PropTypes.number
};
export default BouncingAnimation;