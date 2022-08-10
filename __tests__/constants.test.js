import Config from 'react-native-config';

import { WW_API_ENDPOINTS } from '../js/constants';

describe('constants', () => {
  it('should return swap tickets endpoint with supplied params', () => {
    expect(WW_API_ENDPOINTS.SWAP_TICKETS('playerPrizeId', 'source')).toBe(
      `${Config.WW_API}/me/playerprizes/playerPrizeId/swap?source=source`
    );
  });

  it('should return redeem tickets endpoint with supplied params', () => {
    expect(WW_API_ENDPOINTS.REDEEM_TICKETS('prizeId')).toBe(`${Config.WW_API}/me/prizes/prizeId/redeem`);
  });
});
