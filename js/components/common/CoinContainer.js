import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Animated, Image, View, StyleSheet, Easing } from 'react-native';
import { scale, getWindowHeight } from '../../platformUtils';

const animationEndY = Math.ceil(getWindowHeight() * 0.9)
const negativeEndY = animationEndY * -1

// using native styled component library crashing the app during animation

const styles = StyleSheet.create({
  coinContainer: {
    position: 'absolute',
    bottom: scale(30),
    backgroundColor: 'transparent',
  },
  coin: {
    width: scale(30),
    height: scale(30),
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'transparent',
  },
  coinImage: {
    width: scale(30),
    height: scale(30)
  }
})


export default class CoinContainer extends Component {
    constructor() {
      super()

      this.state = {
        position: new Animated.Value(0),
      }

      const { position } = this.state

  
      this.yAnimation = position.interpolate({
        inputRange: [negativeEndY, 0],
        outputRange: [animationEndY, 0],
      });
  
      this.scaleAnimation = this.yAnimation.interpolate({
        inputRange: [0, 15, 30],
        outputRange: [0, 1.4, 1],
        extrapolate: 'clamp',
      })
  
      this.opacityAnimation = this.yAnimation.interpolate({
        inputRange: [0, animationEndY],
        outputRange: [1, 0],
      });
  
      this.xAnimation = this.yAnimation.interpolate({
        inputRange: [0, animationEndY / 6, animationEndY / 3, animationEndY / 2, animationEndY],
        outputRange: [0, 25, 15, 0, 10],
      })
  
      this.rotateAnimation = this.yAnimation.interpolate({
        inputRange: [0, animationEndY / 6, animationEndY / 3, animationEndY / 2, animationEndY],
        outputRange: ['0deg', '-5deg', '0deg', '5deg', '0deg'],
      })
  
    }
    
  
    componentDidMount() {
      const { position } = this.state
      const { onComplete } = this.props

      Animated.timing(position, {
        duration: 2000,
        toValue: negativeEndY,
        easing: Easing.ease,
        useNativeDriver: true
      }).start(onComplete);
    };
  
    getCoinStyle() {
      const { position } = this.state

      return {
        transform: [
          { translateY: position },
          { scale: this.scaleAnimation },
          { translateX: this.xAnimation },
          { rotate: this.rotateAnimation },
        ],
        opacity: this.opacityAnimation,
      }
    }

    render() {
      const { style, imageSource } = this.props
      return (
        <Animated.View style={[styles.coinContainer, this.getCoinStyle(), style]}>
          <Coin imageSource={imageSource} />
        </Animated.View>
      );
    }
  
  };
  
  const Coin = props => {
    const { imageSource, style } = props
    return (
      <View {...props} style={[styles.coin, style]}>
        <Image source={imageSource} style={[styles.coinImage]} />
      </View>
    )
  };
 
  Coin.propTypes = {
    imageSource:  PropTypes.node.isRequired,
    style: PropTypes.node.isRequired,
  }

  CoinContainer.defaultProps = {
    onComplete:()=>{}
  }

  CoinContainer.propTypes={
    onComplete: PropTypes.func,
    imageSource: PropTypes.node.isRequired,
    style: PropTypes.node.isRequired

  }


  
 
 