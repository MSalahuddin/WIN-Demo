import React from 'react';
import renderer from 'react-test-renderer';

import BackgroundMusicProvider from '../../js/context/BackgroundMusic.context';

describe('Component BackgroundMusicContext', () => {
  test('shows default value', () => {
    const instance = renderer.create(<BackgroundMusicProvider />).getInstance();
    expect(instance.state.isMusicEnabled).toEqual(false);
    expect(instance.state.isSoundEffectEnabled).toEqual(false);
  });

  test('should update isMusicEnabled when setIsMusicEnabled is called', () => {
    const instance = renderer.create(<BackgroundMusicProvider />).getInstance();
    instance.setIsMusicEnabled(false);
    expect(instance.state.isMusicEnabled).toEqual(false);
  });

  test('should update isSoundEffectEnabled when setIsSoundEffectEnabled is called', () => {
    const instance = renderer.create(<BackgroundMusicProvider />).getInstance();
    instance.setIsSoundEffectEnabled(false);
    expect(instance.state.isSoundEffectEnabled).toEqual(false);
  });
});
