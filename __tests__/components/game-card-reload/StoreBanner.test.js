import React from 'react';
import { render, fireEvent } from 'react-native-testing-library';

import StoreBanner from '../../../js/components/game-card-reload/StoreBanner';

describe('Component StoreBanner', () => {
  const leftAction = jest.fn();
  const rightAction = jest.fn();

  test('renders correctly', () => {
    const output = render(<StoreBanner label="Foo" width={100} textSize="LARGE" bannerType="BACKDROP" />);
    expect(output).toMatchSnapshot();
  });

  test('renders correctly with leftEnabled set to false', () => {
    const output = render(
      <StoreBanner leftEnabled={false} label="Foo" width={100} textSize="LARGE" bannerType="BACKDROP" />
    );
    expect(output).toMatchSnapshot();
  });

  test('renders correctly with rightEnabled set to false', () => {
    const output = render(
      <StoreBanner rightEnabled={false} label="Foo" width={100} textSize="LARGE" bannerType="BACKDROP" />
    );
    expect(output).toMatchSnapshot();
  });

  test('calls leftAction when left arrow is pressed', () => {
    const { getByTestId } = render(
      <StoreBanner label="Foo" width={100} textSize="LARGE" bannerType="BACKDROP" leftAction={leftAction} />
    );
    fireEvent(getByTestId('arrow-left'), 'press');
    expect(leftAction).toHaveBeenCalled();
  });

  test('calls rightAction when right arrow is pressed', () => {
    const { getByTestId } = render(
      <StoreBanner label="Foo" width={100} textSize="LARGE" bannerType="BACKDROP" rightAction={rightAction} />
    );
    fireEvent(getByTestId('arrow-right'), 'press');
    expect(rightAction).toHaveBeenCalled();
  });
});
