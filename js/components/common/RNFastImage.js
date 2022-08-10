import React, { memo } from 'react';
import FastImage from 'react-native-fast-image';

const RNFastImage = ({ imageUrl, style, resizeMode }) => {

    const getResizeMode = (resizeMode) => {
        switch (resizeMode) {
            case FastImage.resizeMode.cover:
                return FastImage.resizeMode.cover;
            case FastImage.resizeMode.contain:
                return FastImage.resizeMode.contain;
            case FastImage.resizeMode.stretch:
                return FastImage.resizeMode.stretch;
            case FastImage.resizeMode.center:
                return FastImage.resizeMode.center;
            default:
                return FastImage.resizeMode.cover;
        }
    }

    return (
        <FastImage
            style={{ ...style }}
            source={{ uri: imageUrl, priority: FastImage.priority.high }}
            resizeMode={getResizeMode(resizeMode)}
        />
    )
}

export default memo(RNFastImage);