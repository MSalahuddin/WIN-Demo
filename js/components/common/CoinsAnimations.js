import React, { Component } from 'react'
import {View, StyleSheet } from 'react-native'
import PropTypes from 'prop-types';
import CoinContainer from './CoinContainer'
import { scale, getWindowWidth } from '../../platformUtils';
import { color } from '../../styles';


let coinCount = 0

let coinAnimationInterval;

const styles = StyleSheet.create({
  mainContainer: {
    backgroundColor: color.blue,
    height: scale(50),
    width: getWindowWidth(),
    position: 'absolute',
    bottom: scale(-50),
    zIndex: 0
  }
})


function getRandomNumber(min, max) { return Math.random() * (max - min) + min }

// using native styled component library crashing the app during animation

class FloatingCoins extends Component {


  constructor(props) {
    super(props)
    this.state = {
      coins: [],
    }
  }

  

  componentDidMount() {
    coinAnimationInterval = setInterval(() => {
      this.addCoin()
    }, 100);
  }

  addCoin = async () => {
    const { counts, onCompleted } = this.props
    const { coins } = this.state

    if (coinCount < counts) {
      this.setState({
        coins: [
          ...coins,
          {
            id: coinCount,
            left: getRandomNumber(20, 150),
          }
        ]
      }, () => {
        coinCount+=1
      })
    } else {
      clearInterval(coinAnimationInterval)
      coinCount = 0
      await onCompleted()

    }
  }

  removeCoin = id => {
    this.setState((state)=>({
      coins: state.coins.filter(coin => {
        return coin.id !== id
      })
    }))
  }

  render() {
    const {coins} = this.state
    const {imageSource} = this.props ;
    return (
      <View style={styles.mainContainer}>
        {coins.map((coin) => {
          return (
            <CoinContainer
              key={coin.id}
              style={{ left: coin.left }}
              onComplete={() => this.removeCoin(coin.id)}
              imageSource={imageSource}
            />
          )
        })}
      </View>
    );
  }
};

FloatingCoins.defaultProps = {
  counts: 0,
};

FloatingCoins.propTypes = {
  counts: PropTypes.number,
  onCompleted: PropTypes.func.isRequired,
  imageSource: PropTypes.string.isRequired,
};

export default FloatingCoins;