import React from 'react';
import { render, fireEvent } from 'react-native-testing-library';

import BonusCard from '../../../js/components/game-card-reload/BonusCard';
import MockProvider from '../../MockProvider';

describe('Component dailyBonusCard', () => {
    const onPress = jest.fn();
    const infoPress = jest.fn();
    const data = { isShown: true };
    test('renders correctly', () => {
        const output = render(
            <MockProvider>
                <BonusCard
                    data={data}
                    image=''
                    Title=''
                    Detailedtext=''
                    isInfo
                    infoPress={infoPress}
                    onPress={onPress}
                    isDisabled={false}
                    btnTxt=''
                />
            </MockProvider>
        );
        expect(output).toMatchSnapshot();
    });
    test('renders correctly when info is false', () => {
        const output = render(
            <MockProvider>
                <BonusCard
                    data={data}
                    image=''
                    Title=''
                    Detailedtext=''
                    isInfo={false}
                    infoPress={infoPress}
                    onPress={onPress}
                    isDisabled={false}
                    btnTxt=''
                />
            </MockProvider>
        );
        expect(output).toMatchSnapshot();
    });

    test('renders correctly when info is true', () => {
        const output = render(
            <MockProvider>
                <BonusCard
                    data={data}
                    image=''
                    Title=''
                    Detailedtext=''
                    isInfo
                    infoPress={infoPress}
                    onPress={onPress}
                    isDisabled={false}
                    btnTxt=''
                />
            </MockProvider>
        );
        expect(output).toMatchSnapshot();
    });
    test('renders correctly when disable is false', () => {
        const output = render(
            <MockProvider>
                <BonusCard
                    data={data}
                    image=''
                    Title=''
                    Detailedtext=''
                    isInfo={false}
                    infoPress={infoPress}
                    onPress={onPress}
                    isDisabled={false}
                    btnTxt=''
                />
            </MockProvider>
        );
        expect(output).toMatchSnapshot();
    });
    test('renders correctly when disable is true', () => {
        const output = render(
            <MockProvider>
                <BonusCard
                    data={data}
                    image=''
                    Title=''
                    Detailedtext=''
                    isInfo
                    infoPress={infoPress}
                    onPress={onPress}
                    isDisabled
                    btnTxt=''
                />
            </MockProvider>
        );
        expect(output).toMatchSnapshot();
    });
    test('render when stack progress ', () => {
        const output = render(
            <MockProvider>
                <BonusCard
                    data={data}
                    image=''
                    Title=''
                    Detailedtext=''
                    isInfo
                    infoPress={infoPress}
                    onPress={onPress}
                    isDisabled={false}
                    isProgressBar
                    ProgressStarPoint={0}
                    ProgressEndPoint={4}
                    btnTxt=''
                />
            </MockProvider>
        );
        expect(output).toMatchSnapshot();
    });



    test('calls onPress when stack progress ', () => {
        const { getByTestId } = render(
            <MockProvider>
                <BonusCard
                    data={data}
                    image=''
                    Title=''
                    Detailedtext=''
                    isInfo={false}
                    onPress={onPress}
                    isProgressBar
                    ProgressStarPoint={0}
                    ProgressEndPoint={4}
                    isDisabled={false}
                    btnTxt=''
                />
            </MockProvider>
        );
        fireEvent(getByTestId('claim-bonus-button'), 'press');
        expect(onPress).toHaveBeenCalled();


    });

    test('calls onPressInfo', () => {
        const { getByTestId } = render(
            <MockProvider>
                <BonusCard
                    data={data}
                    image=''
                    Title=''
                    Detailedtext=''
                    isInfo
                    onPress={onPress}
                    infoPress={infoPress}
                    isDisabled={false}
                    btnTxt=''
                />
            </MockProvider>
        );

        fireEvent(getByTestId('info-bonus-card'), 'press');
        expect(infoPress).toHaveBeenCalled();

    });


    test('calls onPressInfo when disable is true', () => {
        const { getByTestId } = render(
            <MockProvider>
                <BonusCard
                    data={data}
                    image=''
                    Title=''
                    Detailedtext=''
                    isInfo
                    onPress={onPress}
                    infoPress={infoPress}
                    isDisabled
                    btnTxt=''
                />
            </MockProvider>
        );

        fireEvent(getByTestId('info-bonus-card'), 'press');
        expect(infoPress).toHaveBeenCalled();

    });


    test('calls onPress and infoPress when stack progress ', () => {
        const { getByTestId } = render(
            <MockProvider>
                <BonusCard
                    data={data}
                    image=''
                    Title=''
                    Detailedtext=''
                    isInfo
                    onPress={onPress}
                    infoPress={infoPress}
                    isProgressBar
                    ProgressStarPoint={0}
                    ProgressEndPoint={4}
                    isDisabled={false}
                    btnTxt=''
                />
            </MockProvider>
        );
        fireEvent(getByTestId('claim-bonus-button'), 'press');
        expect(onPress).toHaveBeenCalled();

        fireEvent(getByTestId('info-bonus-card'), 'press');
        expect(infoPress).toHaveBeenCalled();

    });
    test('calls onPress and infoPress when no stack progress ', () => {
        const { getByTestId } = render(
            <MockProvider>
                <BonusCard
                    data={data}
                    image=''
                    Title=''
                    Detailedtext=''
                    isInfo
                    onPress={onPress}
                    infoPress={infoPress}
                    isDisabled={false}
                    btnTxt=''
                />
            </MockProvider>
        );
        fireEvent(getByTestId('claim-bonus-button'), 'press');
        expect(onPress).toHaveBeenCalled();

        fireEvent(getByTestId('info-bonus-card'), 'press');
        expect(infoPress).toHaveBeenCalled();

    });
});
