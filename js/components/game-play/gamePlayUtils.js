import { getTokens } from '../../utils/keychainUtils';
import { refreshTokens, shouldRefreshToken } from '../../utils/auth';

// Available commands for in-game play
export const CMD = {
  ENTER_ROOM: async (gameRoundId, currentPlayerProfileUrl) => {
    const { accessToken, expiresAt, isAnon, refreshToken } = await getTokens();
    let token = accessToken;
    if (shouldRefreshToken({ isAnon, expiresAt, refreshToken })) {
      const refreshedCredentials = await refreshTokens(refreshToken);
      token = refreshedCredentials.accessToken;
    }
    return JSON.stringify({
      cmd: 'enter_room',
      gameRoundId,
      currentPlayerProfileUrl,
      token
    });
  },
  START_GAME: gameSessionId => JSON.stringify({ cmd: 'start_game', gameSessionId }),
  OPERATE: (gameSessionId, type) => JSON.stringify({ cmd: 'operation', gameSessionId, type }),
  EXIT_ROOM: gameSessionId => JSON.stringify({ cmd: 'exit_room', gameSessionId }),
  GAME_RESULT: gameSessionId => JSON.stringify({ cmd: 'game_result', gameSessionId })
};

export const RET = {
  GAME_RESULT: 'game_result',
  INVALID: 'invalid',
  NEXT_PLAYER: 'next_player',
  ROOM_ENTERED: 'room_entered',
  GAME_START: 'game_start',
  STATUS_UPDATE: 'status_update'
};

export const OPERATION_TYPE = {
  FORWARD: 0,
  BACKWARD: 1,
  LEFT: 2,
  RIGHT: 3,
  GRAB: 4,
  STOP: 5
};

export const FLIP_OPERATION_TYPE = {
  FORWARD: 3,
  BACKWARD: 2,
  LEFT: 0,
  RIGHT: 1,
  GRAB: 4,
  STOP: 5
};