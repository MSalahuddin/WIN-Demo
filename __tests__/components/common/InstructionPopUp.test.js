import React from 'react';
import { render, fireEvent } from 'react-native-testing-library';
import { mascotPartyHat, arrowInCircle } from '../../../assets/images';
import Text from '../../../js/components/common/Text';

import InstructionPopUp from '../../../js/components/common/InstructionPopUp';
import MockProvider from '../../MockProvider';

describe('Component InstructionPopUp', () => {
  const onPress = jest.fn();
  const secondaryButtonOnPress = jest.fn();
  const textButtonOnPress = jest.fn();

  test('renders InstructionPopUp with textButton correctly', () => {
    const output = render(
      <MockProvider>
        <InstructionPopUp
          mascot={mascotPartyHat}
          backdropText=""
          buttonText=""
          bannerLabel=""
          icon={arrowInCircle}
          isVisible
          secondaryButtonOnPress={secondaryButtonOnPress}
          onPress={onPress}
          textButtonLabel="text"
          textButtonOnPress={textButtonOnPress}
        />
      </MockProvider>
    );
    expect(output).toMatchSnapshot();
  });

  test('renders InstructionPopUp without secondary button correctly', () => {
    const output = render(
      <MockProvider>
        <InstructionPopUp
          mascot={mascotPartyHat}
          buttonText=""
          bannerLabel=""
          icon={arrowInCircle}
          isVisible
          onPress={onPress}
        />
      </MockProvider>
    );
    expect(output).toMatchSnapshot();
  });

  test('renders InstructionPopUp without textButton correctly', () => {
    const output = render(
      <MockProvider>
        <InstructionPopUp
          mascot={mascotPartyHat}
          backdropText=""
          buttonText=""
          bannerLabel=""
          icon={arrowInCircle}
          isVisible
          secondaryButtonOnPress={secondaryButtonOnPress}
          onPress={onPress}
        />
      </MockProvider>
    );
    expect(output).toMatchSnapshot();
  });

  test('renders InstructionPopUp with children correctly', () => {
    const output = render(
      <MockProvider>
        <InstructionPopUp
          mascot={mascotPartyHat}
          backdropText=""
          buttonText=""
          bannerLabel=""
          icon={arrowInCircle}
          isVisible
          secondaryButtonOnPress={secondaryButtonOnPress}
          onPress={onPress}
          textButtonLabel="text"
          textButtonOnPress={textButtonOnPress}
        >
          <Text>test</Text>
        </InstructionPopUp>
      </MockProvider>
    );
    expect(output).toMatchSnapshot();
  });

  test('calls onPress when main button is pressed', () => {
    const { getByTestId } = render(
      <MockProvider>
        <InstructionPopUp
          mascot={mascotPartyHat}
          backdropText=""
          buttonText=""
          bannerLabel=""
          icon={arrowInCircle}
          isVisible
          secondaryButtonOnPress={secondaryButtonOnPress}
          onPress={onPress}
        />
      </MockProvider>
    );
    fireEvent(getByTestId('popup-button'), 'press');
    expect(onPress).toHaveBeenCalled();
  });

  test('calls secondaryButtonOnPress when secondary button is pressed', () => {
    const { getByTestId } = render(
      <MockProvider>
        <InstructionPopUp
          mascot={mascotPartyHat}
          backdropText=""
          buttonText=""
          bannerLabel=""
          icon={arrowInCircle}
          isVisible
          secondaryButtonOnPress={secondaryButtonOnPress}
          onPress={onPress}
        />
      </MockProvider>
    );
    fireEvent(getByTestId('secondary-button'), 'press');
    expect(secondaryButtonOnPress).toHaveBeenCalled();
  });

  test('calls testButtonOnPress when text button is pressed', () => {
    const { getByTestId } = render(
      <MockProvider>
        <InstructionPopUp
          mascot={mascotPartyHat}
          backdropText=""
          buttonText=""
          bannerLabel=""
          icon={arrowInCircle}
          isVisible
          secondaryButtonOnPress={secondaryButtonOnPress}
          onPress={onPress}
          textButtonLabel="text"
          textButtonOnPress={textButtonOnPress}
        />
      </MockProvider>
    );
    fireEvent(getByTestId('text-button'), 'press');
    expect(textButtonOnPress).toHaveBeenCalled();
  });
});
