import { isAuthenticated } from '../../js/utils/auth';

describe('auth', () => {
  it('should return false when date has expired', () => {
    expect(isAuthenticated('1546477887000')).toBe(false);
    expect(isAuthenticated(undefined)).toBe(false);
  });
});
