import React from 'react';
import { render, fireEvent } from 'react-native-testing-library';

import CardPopUp from '../../../js/components/prize-vault/CardPopUp';
import MockProvider from '../../MockProvider';

describe('Component CardPopUp', () => {
  const onPress = jest.fn();
  const setVisible = jest.fn();
  const data = { prize: { imageUrl: '', name: '', ticketsValue: 0 } };
  const cardPopUpButtonsDisabled = false;
  const setCardPopUpButtonsDisabled = jest.fn();

  test('renders regular swap card pop up correctly', () => {
    const output = render(
      <MockProvider>
        <CardPopUp
          data={data}
          isVisible
          setVisible={setVisible}
          onPress={onPress}
          cardPopUpButtonsDisabled={cardPopUpButtonsDisabled}
          setCardPopUpButtonsDisabled={setCardPopUpButtonsDisabled}
        />
      </MockProvider>
    );
    expect(output).toMatchSnapshot();
  });

  test('renders ship card pop up correctly', () => {
    data.isForShipping = true;
    const output = render(
      <MockProvider>
        <CardPopUp
          data={data}
          isVisible
          setVisible={setVisible}
          onPress={onPress}
          cardPopUpButtonsDisabled={cardPopUpButtonsDisabled}
          setCardPopUpButtonsDisabled={setCardPopUpButtonsDisabled}
        />
      </MockProvider>
    );
    expect(output).toMatchSnapshot();
  });

  test('calls onPress function when card button is pressed', () => {
    const { getByTestId } = render(
      <MockProvider>
        <CardPopUp
          data={data}
          isVisible
          setVisible={setVisible}
          onPress={onPress}
          cardPopUpButtonsDisabled={cardPopUpButtonsDisabled}
          setCardPopUpButtonsDisabled={setCardPopUpButtonsDisabled}
        />
      </MockProvider>
    );
    fireEvent(getByTestId('card-button'), 'press');
    expect(onPress).toHaveBeenCalled();
  });

  test('calls setVisible function when cancel button is pressed', () => {
    const { getByTestId } = render(
      <MockProvider>
        <CardPopUp
          data={data}
          isVisible
          setVisible={setVisible}
          onPress={onPress}
          cardPopUpButtonsDisabled={cardPopUpButtonsDisabled}
          setCardPopUpButtonsDisabled={setCardPopUpButtonsDisabled}
        />
      </MockProvider>
    );
    fireEvent(getByTestId('cancel-text-button'), 'press');
    expect(setVisible).toHaveBeenCalled();
  });
});
