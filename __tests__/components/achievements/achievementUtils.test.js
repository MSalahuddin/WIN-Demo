import { getInProgressText } from '../../../js/components/achievements/achievementUtils';
import { ACHIEVEMENT_ENUMS } from '../../../js/constants';
import { achievementsString } from '../../../js/stringConstants';

describe('achievementUtils', () => {
  test('achievementUtils/getInProgressText', () => {
    expect(getInProgressText({ achievementUnit: ACHIEVEMENT_ENUMS.DAY })).toBe('');
    expect(getInProgressText({ achievementUnit: ACHIEVEMENT_ENUMS.WIN, remainingNumber: 1 })).toBe(
      achievementsString.oneMoreWinNeeded
    );
    expect(getInProgressText({ achievementUnit: ACHIEVEMENT_ENUMS.WIN, remainingNumber: 100 })).toBe(
      achievementsString.winsNeeded(100)
    );
    expect(getInProgressText({ achievementUnit: ACHIEVEMENT_ENUMS.TICKET, remainingNumber: 1 })).toBe(
      achievementsString.oneMoreTicketNeeded
    );
    expect(getInProgressText({ achievementUnit: ACHIEVEMENT_ENUMS.TICKET, remainingNumber: 100 })).toBe(
      achievementsString.ticketsNeeded(100)
    );
    expect(getInProgressText({ achievementUnit: ACHIEVEMENT_ENUMS.DAILY_LOGIN })).toBe(achievementsString.comeBack);
    expect(getInProgressText({ achievementUnit: ACHIEVEMENT_ENUMS.DAILY_WIN })).toBe(achievementsString.playAgain);
  });
});
