import { getTokens } from '../../utils/keychainUtils';
import { refreshTokens, shouldRefreshToken } from '../../utils/auth';
export const CMD = {
    ENTER_ROOM: async (triviaId, tokensCost, playerId) => {
        const { accessToken, expiresAt, isAnon, refreshToken } = await getTokens();
        let token = accessToken;
        if (shouldRefreshToken({ isAnon, expiresAt, refreshToken })) {
            const refreshedCredentials = await refreshTokens(refreshToken);
            token = refreshedCredentials.accessToken;
        }
        return JSON.stringify({
            cmd: 'Trivia_Join_Game',
            tokensCost,
            playerId,
            triviaId,
            token
        });
    },
    ADD_WATCHER: async (triviaId, playerId) => {
        const { accessToken, expiresAt, isAnon, refreshToken } = await getTokens();
        let token = accessToken;
        if (shouldRefreshToken({ isAnon, expiresAt, refreshToken })) {
            const refreshedCredentials = await refreshTokens(refreshToken);
            token = refreshedCredentials.accessToken;
        }
        return JSON.stringify({
            cmd: 'Add_Trivia_Viewer',
            playerId,
            triviaId,
            token
        });
    },
    SEND_MESSAGE: async ({ playerId, triviaId, username, profileImageURL, message }) => {
        const { accessToken, expiresAt, isAnon, refreshToken } = await getTokens();
        let token = accessToken;
        if (shouldRefreshToken({ isAnon, expiresAt, refreshToken })) {
            const refreshedCredentials = await refreshTokens(refreshToken);
            token = refreshedCredentials.accessToken;
        };
        return JSON.stringify({
            cmd: 'Trivia_Chat',
            token,
            playerId,
            triviaId,
            username,
            profileImageURL,
            message
        });
    },
    ANSWER_QUESTION: async ({ playerId, triviaId, question }) => {
        const { accessToken, expiresAt, isAnon, refreshToken } = await getTokens();
        let token = accessToken;
        if (shouldRefreshToken({ isAnon, expiresAt, refreshToken })) {
            const refreshedCredentials = await refreshTokens(refreshToken);
            token = refreshedCredentials.accessToken;
        };
        return JSON.stringify({
            cmd: 'Add_Trivia_Player_Session',
            token,
            playerId,
            triviaId,
            question
        });
    },
    GET_TRIVIA_SESSION: async ({ playerId, triviaId }) => {
        const { accessToken, expiresAt, isAnon, refreshToken } = await getTokens();
        let token = accessToken;
        if (shouldRefreshToken({ isAnon, expiresAt, refreshToken })) {
            const refreshedCredentials = await refreshTokens(refreshToken);
            token = refreshedCredentials.accessToken;
        };
        return JSON.stringify({
            cmd: 'Get_Trivia_Session',
            token,
            playerId,
            triviaId,
        });
    },
    CONCLUDE_TRIVIA_SESSION: async ({ playerId, triviaId, ticketAmount, questionNo, isWinner, isOptOut }) => {
        const { accessToken, expiresAt, isAnon, refreshToken } = await getTokens();
        let token = accessToken;
        if (shouldRefreshToken({ isAnon, expiresAt, refreshToken })) {
            const refreshedCredentials = await refreshTokens(refreshToken);
            token = refreshedCredentials.accessToken;
        };
        return JSON.stringify({
            cmd: 'Conclude_Trivia',
            token,
            playerId,
            triviaId,
            ticketAmount,
            questionNo,
            isWinner,
            isOptOut
        });
    },
    TRIVIA_CONNECTION_PING: () => JSON.stringify({cmd: 'Trivia_Connection_Ping'}),
};

export const RET = {
    GAME_START: 'Trivia_Start',
    GAME_JOINED: "Game_Joined",
    VIEWER: "Trivia_Viewer",
    TIRVIA_QUESTION: "Trivia_Question",
    TRIVIA_CHAT: "Trivia_Chat",
    ADD_TRIVIA_PLAYER_SESSION: "Add_Trivia_Player_Session",
    TRIVIA_ANSWERS_PERCENTAGE: "Trivia_Answers_Percentage",
    TRIVIA_END: 'Trivia_End',
    TRIVIA_CONCLUDE: "Trivia_Conclude"
};