import React from 'react';
import { render } from 'react-native-testing-library';

import CountdownTimer from '../../../js/components/common/CountdownTimer';

describe('Component CountdownTimer', () => {
  const onTimerEnd = jest.fn();
  const onFiveSecondsLeft = jest.fn();

  test('renders correctly with 6 seconds', () => {
    jest.useFakeTimers();
    const output = render(<CountdownTimer time={6} onTimerEnd={onTimerEnd} onFiveSecondsLeft={onFiveSecondsLeft} />);
    expect(output).toMatchSnapshot();

    expect(setInterval).toHaveBeenCalledTimes(1);
    expect(onFiveSecondsLeft).not.toBeCalled();
    jest.runAllTimers();
    expect(clearInterval).toBeCalled();
    expect(onFiveSecondsLeft).toBeCalled();
    expect(onTimerEnd).toBeCalled();
  });
});
