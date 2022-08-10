import React from 'react';
import { render, fireEvent } from 'react-native-testing-library';

import DailyBonusCard from '../../../js/components/game-card-reload/DailyBonusCard';
import MockProvider from '../../MockProvider';

describe('Component dailyBonusCard', () => {
  const onPress = jest.fn();
  const infoPress = jest.fn();
  const data = { isShown: true };
  test('renders correctly', () => {
    const output = render(
      <MockProvider>
        <DailyBonusCard
          data={data}
          image=""
          Title=""
          isInfo={false}
          onPress={onPress}
          isDisabled={false}
          btnTxt=""
          hours={0}
          minutes={0}
          seconds={0}
        />
      </MockProvider>
    );
    expect(output).toMatchSnapshot();
  });
  test('renders correctly when info is false', () => {
    const output = render(
      <MockProvider>
        <DailyBonusCard
          data={data}
          image=""
          Title=""
          isInfo={false}
          onPress={onPress}
          isDisabled={false}
          btnTxt=""
          hours={0}
          minutes={0}
          seconds={0}
        />
      </MockProvider>
    );
    expect(output).toMatchSnapshot();
  });

  test('renders correctly when info is true', () => {
    const output = render(
      <MockProvider>
        <DailyBonusCard
          data={data}
          image=""
          Title=""
          isInfo
          onPress={onPress}
          isDisabled={false}
          btnTxt=""
          hours={0}
          minutes={0}
          seconds={0}
        />
      </MockProvider>
    );
    expect(output).toMatchSnapshot();
  });
  test('renders correctly when disable is false', () => {
    const output = render(
      <MockProvider>
        <DailyBonusCard
          data={data}
          image=""
          Title=""
          isInfo={false}
          onPress={onPress}
          isDisabled={false}
          btnTxt=""
          hours={0}
          minutes={0}
          seconds={0}
        />
      </MockProvider>
    );
    expect(output).toMatchSnapshot();
  });
  test('renders correctly when disable is true', () => {
    const output = render(
      <MockProvider>
        <DailyBonusCard
          data={data}
          image=""
          Title=""
          isInfo={false}
          onPress={onPress}
          isDisabled
          btnTxt=""
          hours={0}
          minutes={0}
          seconds={0}
        />
      </MockProvider>
    );
    expect(output).toMatchSnapshot();
  });

});
