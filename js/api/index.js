/* eslint-disable max-len */
/* istanbul ignore file */
// import { Platform } from 'react-native';
import client from './client';
import { WW_API_ENDPOINTS } from '../constants';


  const playerChallengeRank = (challengeId, challengeTypeEnum) => client.get(WW_API_ENDPOINTS.PLAYER_CHALLENGES_RANK(challengeId, challengeTypeEnum));
const getMachines = (params) => client.get(WW_API_ENDPOINTS.GET_GAMEROOM_MACHINES,{ params: { ...params, includeInactive : false } });
const getMachinesPrizes = (machineId, countryId) => 
  client.get(WW_API_ENDPOINTS.GET_GAMEROOM_MACHINES_PRIZES(machineId, countryId));
const getMachinesSocketBaseUrl = () => client.get(WW_API_ENDPOINTS.GET_MACHINES_SOCKET_BASE_URL);
const getUpcomingTrivia = () => client.get(WW_API_ENDPOINTS.GET_UPCOMING_TRIVIA);
const getDigitalGame = (liveArcade = false,isWinnerCircle = false) => client.get(WW_API_ENDPOINTS.GET_DIGITAL_GAME(liveArcade,isWinnerCircle));
const getQRCode = () => client.get(WW_API_ENDPOINTS.GET_QR_CODE);
const getQuickAddTokens = () => client.get(WW_API_ENDPOINTS.GET_QUICK_ADD_TOKENS);
const postTransferNFT = (data) => client.post(WW_API_ENDPOINTS.POST_TRANSFER_NFT, data);
const getDigitalGameGateway = () => client.get(WW_API_ENDPOINTS.GET_DIGITAL_GAME_GATEWAY);
const putRemovePlayer = () => client.put(WW_API_ENDPOINTS.REMOVE_PLAYER);
const getTriviaWinners = (triviaId) => client.get(WW_API_ENDPOINTS.GET_TRIVIA_WINNERS(triviaId));
const getTriviaById = (triviaId) => client.get(WW_API_ENDPOINTS.GET_TRIVIA_BY_ID(triviaId));







const api = {
  playerChallengeRank,
  getMachines,
  getMachinesPrizes,
  getMachinesSocketBaseUrl,
  getDigitalGame,
  getQRCode,
  getQuickAddTokens,
  postTransferNFT,
  getDigitalGameGateway,
  putRemovePlayer,
  getUpcomingTrivia,
  getTriviaWinners,
  getTriviaById
};

export default api;
