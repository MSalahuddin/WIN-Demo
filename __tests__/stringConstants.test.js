import {
  accountProfileStrings,
  popUpStrings,
  gameCardReloadStrings,
  winnersCircleStrings,
  prizeVaultStrings
} from '../js/stringConstants';

describe('stringConstants', () => {
  it('should return create accountProfileStrings with supplied params', () => {
    expect(accountProfileStrings.freeTokensLevelUp(2)).toBe('Free 2 tokens on level up');
    expect(accountProfileStrings.pointsAwayFromLevel(1, 2)).toBe('Only 1 away from level 2');
    expect(accountProfileStrings.ticketConversionBonus(1)).toBe('Ticket conversion 1% bonus');
    expect(accountProfileStrings.tokenPurchaseBonus(1)).toBe('Token purchase 1% bonus');
  });

  it('should return create popUpStrings with supplied params', () => {
    expect(popUpStrings.swapForNumberTickets(1)).toBe('Swap for 1 tickets');
  });

  it('should return create gameCardReloadStrings with supplied params', () => {
    expect(gameCardReloadStrings.buyPrice('$2')).toBe('Buy $2');
    expect(gameCardReloadStrings.buyTokenUnit(1, '/qt')).toBe('Buy 1/qt');
    expect(gameCardReloadStrings.unitTokens('Quarterly')).toBe('Quarterly tokens');
    expect(gameCardReloadStrings.unitTokenTotal('Quarterly')).toBe('Quarterly token total:');
  });

  it('should return create winnersCircleStrings with supplied params', () => {
    expect(winnersCircleStrings.timesNumber(1)).toBe('x1');
    expect(winnersCircleStrings.redeemForTickets('test', 1)).toBe('Redeem test for 1 tickets?');
  });

  it('should return create prizeVaultStrings with supplied params', () => {
    expect(prizeVaultStrings.numberTickets(1)).toBe('1 tickets');
  });
});
