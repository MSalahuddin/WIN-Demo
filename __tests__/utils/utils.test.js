import { Alert, Linking } from 'react-native';
import sinon from 'sinon';
import {
  formatTimeString,
  parseDatetime,
  convertNumberToStringWithComma,
  displayError,
  capitalize,
  openUrl,
  getRouteNameForPath,
  insertPromoCard,
  removeDollarSign,
  changeDataFormatForPicker,
  getMinMaxTicketsCost,
  getDisplayDate,
  getDisplayTime,
  getDisplayTimeSince,
  formatTokensLabel,
  formatTicketsLabel,
  getPercentage,
  SplitTime
} from '../../js/utils';
import { PATHS, SCREENS } from '../../js/constants';

describe('Utils', () => {
  test('Utils/formatTimeString', () => {
    expect(formatTimeString(1)).toBe('00:01');
    expect(formatTimeString(60)).toBe('01:00');
    expect(formatTimeString(61)).toBe('01:01');
    expect(formatTimeString()).toBe(null);
    expect(formatTimeString(null)).toBe(null);
    expect(formatTimeString('foo')).toBe(null);
    expect(formatTimeString(0)).toBe('00:00');
  });

  test('Utils/parseDatetime', () => {
    expect(parseDatetime('2012-01-26T13:51:50.417-07:00')).toEqual({date: "Jan 27, 2012", time: "01:51 AM"});
  });
  test('Utils/parseLastUpdate', () => {
    expect(SplitTime('86.11:52:04.2731777')).toEqual("88d");
  });

  test('Utils/convertNumberToStringWithComma', () => {
    expect(convertNumberToStringWithComma(null)).toEqual('0');
    expect(convertNumberToStringWithComma(0)).toEqual('0');
    expect(convertNumberToStringWithComma(1000)).toEqual('1,000');
    expect(convertNumberToStringWithComma(10000)).toEqual('10,000');
  });

  test('Utils/displayError', () => {
    displayError('');
    expect(Alert.alert).toHaveBeenCalled();
  });

  test('capitalize', () => {
    expect(capitalize()).toBeUndefined();
    expect(capitalize('')).toBe('');
    expect(capitalize('test')).toBe('Test');
    expect(capitalize('test test')).toBe('Test Test');
    expect(capitalize('TEST TEST')).toBe('Test Test');
  });

  test('openUrl opens url in browser', () => {
    const openURLSpy = sinon.spy(Linking, 'openURL');
    openUrl('');
    expect(openURLSpy.withArgs('').calledOnce).toBe(true);
  });

  test('Utils/getRouteNameForPath', () => {
    expect(getRouteNameForPath(PATHS.GAME_ROOM)).toBe(SCREENS.GAME_ROOM);
    expect(getRouteNameForPath(PATHS.PRIZE_VAULT)).toBe(SCREENS.PRIZE_VAULT);
    expect(getRouteNameForPath(PATHS.TOKEN_STORE)).toBe(SCREENS.GAME_CARD_RELOAD);
    expect(getRouteNameForPath(PATHS.WINNERS_CIRCLE)).toBe(SCREENS.WINNERS_CIRCLE);
    expect(getRouteNameForPath('')).toBe(SCREENS.GAME_ROOM);
    expect(getRouteNameForPath(null)).toBe(SCREENS.GAME_ROOM);
  });

  test('Utils/insertPromoCard', () => {
    const promoCardData1 = { title: 'a', subtitle: 'b', imageUrl: '', isActive: true };
    const machineData1 = [{ prize: {} }, { prize: {} }, { prize: {} }, { prize: {} }, { prize: {} }, { prize: {} }];
    const newMachineData1 = [
      { prize: {} },
      { prize: {} },
      { prize: {} },
      { prize: {} },
      { prize: {} },
      { title: 'a', subtitle: 'b', imageUrl: '', isActive: true, isPromoCard: true },
      { prize: {} }
    ];
    expect(insertPromoCard(promoCardData1, machineData1)).toStrictEqual(newMachineData1);

    const promoCardData2 = { title: 'a', subtitle: 'b', imageUrl: '', isActive: false };
    const machineData2 = [{ prize: {} }, { prize: {} }, { prize: {} }, { prize: {} }, { prize: {} }, { prize: {} }];
    expect(insertPromoCard(promoCardData2, machineData2)).toStrictEqual(machineData2);
    const promoCardData3 = { title: 'a', subtitle: 'b', imageUrl: '', isActive: true };
    const machineData3 = [
      { prize: {} },
      { prize: {} },
      { prize: {} },
      { prize: {} },
      { prize: {} },
      { prize: {} },
      { prize: {} },
      { prize: {} },
      { prize: {} },
      { prize: {} },
      { prize: {} },
      { prize: {} }
    ];
    const newMachineData3 = [
      { prize: {} },
      { prize: {} },
      { prize: {} },
      { prize: {} },
      { prize: {} },
      { title: 'a', subtitle: 'b', imageUrl: '', isActive: true, isPromoCard: true },
      { prize: {} },
      { prize: {} },
      { prize: {} },
      { prize: {} },
      { prize: {} },
      { title: 'a', subtitle: 'b', imageUrl: '', isActive: true, isPromoCard: true },
      { prize: {} },
      { prize: {} }
    ];

    expect(insertPromoCard(promoCardData3, machineData3)).toStrictEqual(newMachineData3);
  });

  test('Utils/removeDollarSign', () => {
    expect(removeDollarSign(null)).toBe(null);
    expect(removeDollarSign(3.99)).toBe(3.99);
    expect(removeDollarSign('$3.99')).toBe(3.99);
    expect(removeDollarSign('3.99')).toBe(3.99);
  });

  test('Utils/changeDataFormatForPicker', () => {
    expect(changeDataFormatForPicker(['all', 'Plushes'], 'Category')).toStrictEqual([
      { label: 'Categories', value: 'All' },
      { label: 'Plushes', value: 'Plushes' }
    ]);

    expect(changeDataFormatForPicker(['all', '0 - 5000'], 'Cost')).toStrictEqual([
      { label: 'All Tickets', value: 'All' },
      { label: '0 - 5,000', value: '0 - 5000' }
    ]);

    expect(changeDataFormatForPicker('', '')).toBe(null);
  });

  test('Utils/getMinMaxTicketsCost', () => {
    expect(getMinMaxTicketsCost('0 - 5000')).toStrictEqual({
      minTicketsCost: '0',
      maxTicketsCost: '5000'
    });
    expect(getMinMaxTicketsCost('5000+')).toStrictEqual({
      minTicketsCost: '5000'
    });
    expect(getMinMaxTicketsCost('')).toBe(null);
  });

  test('getDisplayDate', () => {
    expect(getDisplayDate('2019-11-29T23:55:12.123493')).toEqual('Nov. 30, 2019');
    expect(getDisplayDate('2019-05-29T11:55:12.123493')).toEqual('May 29, 2019');
  });

  test('getDisplayTime', () => {
    expect(getDisplayTime('2019-11-29T23:55:12.123493')).toEqual('11:55 PM');
    expect(getDisplayTime('2019-05-29T11:55:12.123493')).toEqual('11:55 AM');
  });

  test('getDisplayTimeSince', () => {
    // Mock current time
    const dateNowMock = jest.spyOn(Date, 'now').mockImplementation(() => new Date(1588105067000));
    expect(getDisplayTimeSince('2020-04-28T00:00:00+00:00')).toEqual('20h');
    expect(getDisplayTimeSince('2020-04-28T02:00:00+00:00')).toEqual('18h');
    expect(getDisplayTimeSince('2020-04-28T20:00:00+00:00')).toEqual('17m');
    expect(getDisplayTimeSince('2020-04-28T19:30:00+00:00')).toEqual('47m');
    expect(getDisplayTimeSince('2020-04-27T00:00:00+00:00')).toEqual('1d');
    expect(getDisplayTimeSince('2020-04-28T20:17:00+00:00')).toEqual('0m');
    dateNowMock.mockRestore();
  });

  test('Utils/formatTicketsLabel', () => {
    expect(formatTicketsLabel(0)).toStrictEqual('0');
    expect(formatTicketsLabel(1)).toStrictEqual('1');
    expect(formatTicketsLabel(12345)).toStrictEqual('12,345');
    expect(formatTicketsLabel(999900)).toStrictEqual('999.9K');
    expect(formatTicketsLabel(115500)).toStrictEqual('115.5K');
    expect(formatTicketsLabel('')).toStrictEqual('0');
  });

  test('Utils/formatTokensLabel', () => {
    expect(formatTokensLabel(0)).toStrictEqual('0');
    expect(formatTokensLabel(1)).toStrictEqual('1');
    expect(formatTokensLabel(1111)).toStrictEqual('1,111');
    expect(formatTokensLabel(12345)).toStrictEqual('12.3K');
    expect(formatTokensLabel(123456)).toStrictEqual('123K');
    expect(formatTokensLabel(null)).toStrictEqual('0');
  });

  test('Utils/getPercentage', () => {
    expect(getPercentage(0, 0)).toStrictEqual(null);
    expect(getPercentage(0, 10)).toStrictEqual(0);
    expect(getPercentage(5, 10)).toStrictEqual(50);
  });
});
