/* istanbul ignore file */
import Config from 'react-native-config';
import { Platform } from 'react-native';

const { WW_API, ZENDESK_BASE_URL, PLAY_STORE_ID, APP_STORE_ID } = Config;
export const APP_URL_SCHEME = 'Win_demoapp://';

export const FIRST_APP_RUN = {
  FIRST_APP_RUN: 'FIRST_APP_RUN'
}

export const BUNDLE_ID = {
  BUNDLE_ID_DEVELOP: 'com.playtertainment.ww.dev',
  BUNDLE_ID_STAGING: 'com.playtertainment.ww.stg',
  BUNDLE_ID_RELEASE: 'com.playtertainment.ww'
}

export const AD_UNIT = {
  OFFERWALL: 'Offerwall',
  REWARDED_VIDEO: 'RewardedVideo'
}


export const CHANNELS = {
  more: 'nativeshare',
  facebook: 'facebook',
  email: 'email',
  twitter: 'twitter',
  sms: 'sms'
};

export const PRODUCTS_ID = {
  refillBasic: 'ww_beta_token_pack_refill_basic',
  refillStarter: 'ww_beta_token_pack_refill_starter'
}

export const SCREENS = {
  ACCOUNT_PROFILE: 'ACCOUNT_PROFILE',
  ACHIEVEMENTS: 'ACHIEVEMENTS',
  APP_WEB_VIEW: 'APP_WEB_VIEW',
  CREATE_ACCOUNT: 'CREATE_ACCOUNT',
  GAME_CARD_RELOAD: 'GAME_CARD_RELOAD',
  GAME_PLAY: 'GAME_PLAY',
  DIGITAL_GAME_PLAY: 'DIGITAL_GAME_PLAY',
  DIGITAL_GAME_ROOM: "DIGITAL_GAME_ROOM",
  GAME_ROOM: 'GAME_ROOM',
  LANDING_PAGE: 'LANDING_PAGE',
  LEADERBOARD: 'LEADERBOARD',
  PLAY_HISTORY: 'PLAY_HISTORY',
  PRIZE_VAULT: 'PRIZE_VAULT',
  SHIPPING: 'SHIPPING',
  SIGN_IN: 'SIGN_IN',
  WINNERS_CIRCLE: 'WINNERS_CIRCLE',
  NEWS_ROOM: 'NEWS_ROOM',
  CHANGE_USERNAME: 'CHANGE_USERNAME',
  MY_INFO: 'MY_INFO',
  CHANGE_MY_INFO: 'CHANGE_MY_INFO',
  EXPLORE_ARCADE: 'EXPLORE_ARCADE',
  SELECT_DIFFICULTY: 'SELECT_DIFFICULTY',
  CHALLENGE: 'CHALLENGE',
  CHALLENGE_GAME: 'CHALLENGE_GAME',
  LIVE_HOSTED: 'LIVE_HOSTED',
  TRIVIA_JOIN_SCREEN: 'TRIVIA_JOIN_SCREEN',
  MY_WALLET: 'MY_WALLET',
};

export const HEADER = {
  Request_Origin: 'request-origin'
}

export const AUTH0_CONNECTIONS = {
  // TODO: correct apple connection code when apple account is set up
  APPLE: 'apple',
  FACEBOOK: 'facebook',
  GOOGLE: 'google-oauth2'
};

export const WW_BANNER_API_LOCATIONS = {
  GAME_ROOM: 'gameroom',
  TOKEN_STORE: 'tokenstore',
  NEWS_ROOM: 'newsroom',
  WINNER_CIRCLE: 'winnercircle',
};

const POINTS = IS_AUTHENTICATE => {
  if (IS_AUTHENTICATE) {
    return `${WW_API}/me/points`;
  }
  return `${WW_API}/me/anonplayerpoints`;
};
const REDEEM_TICKETS = (PRIZE_ID, IS_AUTHENTICATE) => {
  if (IS_AUTHENTICATE) {
    return `${WW_API}/me/prizes/${PRIZE_ID}/redeem`;
  }
  return `${WW_API}/me/prizes/${PRIZE_ID}/anonredeem`;
};

const SWAP_TICKETS = (PLAYER_PRIZE_ID, SOURCE, IS_AUTHENTICATE) => {
  if (IS_AUTHENTICATE) {
    return `${WW_API}/me/playerprizes/${PLAYER_PRIZE_ID}/swap?source=${SOURCE}`;
  }
  return `${WW_API}/me/playerprizes/${PLAYER_PRIZE_ID}/anonswap?source=${SOURCE}`;
};

const IAP_TRANSACTION = IS_AUTHENTICATE => {
  if (Platform.OS === 'ios') {
    if (IS_AUTHENTICATE) {
      return `${WW_API}/IAPTransaction`;
    }
    return `${WW_API}/IAPTransaction/AnonIOSIAPTransaction`;
  }
  if (IS_AUTHENTICATE) {
    return `${WW_API}/IAPTransaction/AndroidIAP`;
  }
  return `${WW_API}/IAPTransaction/AnonAndroidIAPTransaction`;
};

export const WW_API_ENDPOINTS = {
  UNLOCK_PIGGY_BANK: `${WW_API}/PiggyBank/UnlockPiggyBank`,
  CHECK_PIGGY_BANK: `${WW_API}/PiggyBank/CheckPiggyBank`,
  // CHECK_DEAL_OF_THE_DAY: `${WW_API}/DealOfDay/CheckDealOfDay`, // Old endpoint will always return Ok ("Not Found")
  CHECK_DEAL_OF_THE_DAY: `${WW_API}/DealOfDay/CheckDealOfDayNewBuild`,
  GRANT_FREE_TOKENS: `${WW_API}/TokenGrant/CheckTokenGrant`,
  AVAIL_FREE_TOKENS: tokenGrantId => `${WW_API}/TokenGrant/AvailTokenGrant?tokenGrantId=${tokenGrantId}`,

  FREE_PLAY_GET: `${WW_API}/me/GetFreePlays`,
  FREE_PLAY_GRANT: `${WW_API}/FreePlayGrant/CheckFreePlayGrant`,
  AVAIL_FREE_PLAY: freePlayGrantId => `${WW_API}/FreePlayGrant/AvailFreePlayGrant?freePlayGrantId=${freePlayGrantId}`,

  UPDATE_DAILY_REWARDS: `${WW_API}/PlayerDailyRewards/UpdateDailyRewards`,
  CLAIM_DAILY_REWARDS: `${WW_API}/PlayerDailyRewards/ClaimDailyRewards`,
  ACTIVE_PLAYER: `${WW_API}/me/achievements/ActivePlayer`,
  BONUS_SCREEN: `${WW_API}/Me/GetBonusScreenValues`,
  ADD_STACK_EM: `${WW_API}/StackEm/AddStackEmTokens`,
  CLAIM_DAILY_WEEKLY: isDailyWin => `${WW_API}/Me/ClaimDailyWeeklyBonus?isDailyWin=${isDailyWin}`,
  BANNER: location => `${WW_API}/banner/location/${location}`,
  get_WW_AppSettings: key => `${WW_API}/Me/GetSystemSettingsByKeyForMobile?key=${key}`,
  CUSTOMER_IO_TRACKING: (event, id) => `${WW_API}/customerio/${event}/${id}`,
  CUSTOMER_IO_NOTIFICATION_TRACKING: `${WW_API}/CustomerIo/PushNotificationOpened`,
  DEVICES: `${WW_API}/devices`,
  ADD_REFERRAL_TOKENS: tokens => `${WW_API}/me/AddReferralTokens?tokens=${tokens}`,
  GAME_ROOM: `${WW_API}/Machines`,
  MACHINE_DETAILS: (machineId, prizeId, challengeId) => {
    let url = `${WW_API}/Machines/${machineId}/${prizeId}`;
    if (challengeId) {
      url += `?challengeId=${challengeId}`;
    }
    return url;
  },
  GAME_ROUNDS: (machineId, prizeId, useFreePlay, challengeId) => {
    let url = `${WW_API}/GameRounds?machineId=${machineId}&prizeId=${prizeId}&useFreePlay=${useFreePlay}`;
    if (challengeId) {
      url += `&challengeId=${challengeId}`;
    }
    return url;
  },
  IAP_TRANSACTION,
  // IAP_TRANSACTION: `${WW_API}/IAPTransaction`,
  // IAP_TRANSACTION_ANDROID: `${WW_API}/IAPTransaction/AndroidIAP`,
  // IAP_TRANSACTION_ANONYMOUS: `${WW_API}/IAPTransaction/AnonIOSIAPTransaction`,
  // IAP_TRANSACTION_ANDROID_ANONYMOUS: `${WW_API}/IAPTransaction/AnonAndroidIAPTransaction`,
  LEADERBOARD_WEEKLY: `${WW_API}/leaderboard/weekly`,
  LEADERBOARD: filter => `${WW_API}/leaderboard/${filter}`,

  MACHINE_VIEWER: (machineId,prizeId) => `${WW_API}/machines/${machineId}/viewers?prizeId=${prizeId}`,
  ME_DETAILS: achievementFilter =>
    achievementFilter === 0 ? `${WW_API}/me/details` : `${WW_API}/me/details?achievementFilter=${achievementFilter}`,
  ME: `${WW_API}/me`,
  ME_WITH_INCENTIVIZE: isIncentivize => `${WW_API}/me?isIncentivize=${isIncentivize}`,
  // POINTS: `${WW_API}/me/points`,
  POINTS,
  PLAYER_HISTORY: (pageNumber, pageSize) => `${WW_API}/me/gamerounds?pageNumber=${pageNumber}&pageSize=${pageSize}`,
  PRIZE_VAULT: (pageNumber, pageSize, prizeVaultFilterType) =>
    prizeVaultFilterType === 0
      ? `${WW_API}/me/prizevault?pageNumber=${pageNumber}&pageSize=${pageSize}`
      : `${WW_API}/me/prizevault?pageNumber=${pageNumber}&pageSize=${pageSize}&prizeVaultFilterType=${prizeVaultFilterType}`,
  PROMO_CODE: `${WW_API}/promocodes/verify`,
  GET_COUPON_CODE_ENABLE_DISABLE: `${WW_API}/me/GetCouponCodeEnableDisable`,
  // REDEEM_TICKETS: PRIZE_ID => `${WW_API}/me/prizes/${PRIZE_ID}/redeem`,
  REDEEM_TICKETS,
  SUBSCRIPTION_PACKS: `${WW_API}/SubscriptionPack`,
  // SWAP_TICKETS: (PLAYER_PRIZE_ID, SOURCE) => `${WW_API}/me/playerprizes/${PLAYER_PRIZE_ID}/swap?source=${SOURCE}`,
  SWAP_TICKETS,
  SHIP_PRIZE: (PLAYER_PRIZE_ID, changeDefaultAddress) =>
    `${WW_API}/me/PlayerPrizes/${PLAYER_PRIZE_ID}/Ship?changeDefaultAddress=${changeDefaultAddress}`,
  TOKEN_PACKS: `${WW_API}/tokenpacks`,
  TOKEN: `${WW_API}/token`,
  VERIFY_GEO_RESTRICTION: PLAYER_PRIZE_ID => `${WW_API}/me/PlayerPrizes/${PLAYER_PRIZE_ID}/ship/VerifyGeoRestrictions`,
  VIDEO_SHARE_ACHIEVEMENT: `${WW_API}/me/achievements/SocialShare`,
  WINNERS_CIRCLE: `${WW_API}/prizes?isWinnerCircle=true`,
  WINNERS_CIRCLE_FILTERS: `${WW_API}/prizes/filters`,
  PURCHASE_PROMPT: `${WW_API}/me/UserRunningWithLowTokens`,
  DEAL_OF_THE_DAY_RESPONCE_LOG: `${WW_API}/DealOfDayResponseLog`,
  GET_INCENTIVISE_VALUES: `${WW_API}/Me/GetIncentiviseValues`,
  CHECK_PLAYER_NEWS_FEED: `${WW_API}/NewsFeed/CheckPlayerNewsFeed`,
  GET_PLAYER_NEWS_FEED: `${WW_API}/NewsFeed/GetPlayerNewsFeed`,
  POST_PLAYER_NEWS_FEED: `${WW_API}/NewsFeed/PostPlayerNewsFeed`,
  SYSTEM_SETTING: `${WW_API}/me/CheckClearIAPRestoreTranExistingTran`,
  // POST_BUILD_VERSION: (appVersion, os) => `${WW_API}/me/SaveAppBuildInfo?appVersion=${appVersion}&appOS=${os}`,
  CHECK_FORCE_UPDATE: (appVersion, os) =>
    `${WW_API}/me/CheckForForceUpdateAndSaveBuildInfo?appVersion=${appVersion}&appOS=${os}`,
  GET_GEORESTRICTIONS: `${WW_API}/GeographicRestrictions`,
  VERIFY_S2S_CALLBACK: `${WW_API}/AdvertisingVideo/VerifyAddAdvertisingTokens`,
  CLEAR_PREVIOUSLY_AWARDED_VIDEO: `${WW_API}/AdvertisingVideo/ClearPreviouslyAwardedVideos`,
  UPDATE_USERNAME: username => `${WW_API}/me/updateplayerusername?userName=${username}`,
  CATEGORIES: `${WW_API}/Categories/GetCategoryNames`,
  UPDATE_PLAYER_INFO: `${WW_API}/Me/UpdatePlayerInfo`,
  UPDATE_PLAYER_CATEGORIES: `${WW_API}/Players/UpdatePlayerCategories`,
  GET_COUNTRIES: `${WW_API}/Country/GetGeoRestrictedCountries`,
  GET_STATES: id => `${WW_API}/State/GetGeorestrictedStatesByCountryId/${id}`,
  UPDATE_PLAYER_PROFILE: `${WW_API}/Me​/UpdatePlayerInfo`,
  VALIDATE_USERNAME: username => `${WW_API}/Me/ValidatePlayerUsername?userName=${username}`,
  MACHINE_TYPES: `${WW_API}/MachineTypes`,
  MACHINE_dIFFICULTY: `${WW_API}/MachineDifficulty`,
  PLAYER_FAVORITE_PRIZE: `${WW_API}/FavouritePrizes/PlayerFavouritePrize`,
  GET_PLAYER_FAVORITE_PRIZE: playerId => `${WW_API}/FavouritePrizes/GetPlayerFavouritePrizes/${playerId}`,
  REPORT_ISSUE: (gameRoundId, isReported) =>
    `${WW_API}/GameRounds/UpdateGameRoundReport?gameRoundId=${gameRoundId}&isReported=${isReported}`,
  GET_RECENT_GAME_WIN_VIDEOS: (pageNumber, pageSize) =>
    `${WW_API}/GameRounds/GetRecentGameWinVideos?pageNumber=${pageNumber}&pageSize=${pageSize}`,
  UPDATE_LIKES_OF_GAME_VIDEO: (gameRoundId, isLike) =>
    `${WW_API}/GameRounds/UpdateLikesOfGameVideo?gameRoundId=${gameRoundId}&isLike=${isLike}`,
  GET_PAYMENT_GETWAYS: `${WW_API}/PaymentGateway`,
  PLAYER_CHALLENGES: challengeSection => `${WW_API}/Challenge/PlayerChallenges?challengeSection=${challengeSection}`,
  PLAYER_CHALLENGES_GAME: (challengeId, challengeTypeEnum) =>
    `${WW_API}/Challenge/PlayerChallengeGames/${challengeId}/${challengeTypeEnum}`,
  PLAYER_CHALLENGES_RANK: (challengeId, challengeTypeEnum) =>
    `${WW_API}/Challenge/PlayerChallengeRanking/?challengeId=${challengeId}&challengeTypeEnum=${challengeTypeEnum}`,
  GET_GAMEROOM_MACHINES: `${WW_API}/Machines/GetGameRoomMachines`,
  GET_GAMEROOM_MACHINES_PRIZES: (machineId, countryId) =>
    `${WW_API}/MachinePrize/${machineId}/${countryId}`,
  GET_MACHINES_SOCKET_BASE_URL: `${WW_API}/Machines/GetMachinesSocketBaseUrl`,
  GET_UPCOMING_TRIVIA: `${WW_API}/Trivia/GetUpComingTrivia`,
  GET_DIGITAL_GAME: (liveArcade, isWinnerCircle) => `${WW_API}/DigitalGame?includeLiveArcade=${liveArcade}&isWinnerCircle=${isWinnerCircle}`,
  GET_QR_CODE: `${WW_API}/PhysicalPlay/GetQRCodeForPhysicalPlay`,
  GET_QUICK_ADD_TOKENS: `${WW_API}/TokenPacks/GetQuickAddTokenPackDetails`,
  POST_TRANSFER_NFT: `${WW_API}/TransferNFT/TransferNFT`,
  GET_DIGITAL_GAME_GATEWAY: `${WW_API}/DigitalGameRound/GetDataJwt`,
  REMOVE_PLAYER: `${WW_API}/Players/RemovePlayer`,
  GET_TRIVIA_WINNERS: (triviaId) => `${WW_API}/Trivia/GetTriviaWinners/${triviaId}`,
  GET_TRIVIA_BY_ID: (triviaId) => `${WW_API}/Trivia/${triviaId}`,
};

const WINNER_WINNER_BASE = 'https://www.Win_demo.com';

export const REPORT_ISSUE_EMAIL_TO = 'support@Win_demo.com';

export const URLS = {
  EULA: `${WINNER_WINNER_BASE}/terms/#license`,
  HELP: `${ZENDESK_BASE_URL}/hc/en-us`,
  TERMS: `${WINNER_WINNER_BASE}/terms/`,
  PRIVACY: `${WINNER_WINNER_BASE}/privacy/`,
  PLAY_STORE: `market://details?id=${PLAY_STORE_ID}`,
  APP_STORE: `itms-apps://itunes.apple.com/us/app/apple-store/id${APP_STORE_ID}?mt=8`
};

export const NAVIGATORS = {
  LOGGED_IN: 'loggedIn',
  LOGGED_OUT: 'loggedOut',
  ONBOARDING: 'onboarding',
  NEW_REGISTER_LOGGED_IN: 'newRegisterLoggedIn'
};

export const PRIZE_STATUS = {
  ALL_PRIZES: 'All prizes',
  NEW: 'New',
  PACKING: 'Packing',
  SHIPPED: 'Shipped',
  SWAPPED: 'Swapped',
  CLAIMED: 'Claimed',
};
export const PRIZE_VAULT_ENUM = {
  ALL_PRIZES: 0,
  AVAILABLE: 1,
  SHIPPED: 2,
  SWAPPED: 3
};
export const PLAYER_ACHIEVEMENT_ENUM = {
  ALL: 0,
  COMPLETED: 1,
  INPROGRESS: 2
};
export const PRIZE_ACTION_TYPE = {
  SHIP: 'SHIP',
  SWAP: 'SWAP',
  CLAIM: 'CLAIM',
};

export const API_CALL_CONSTANTS = {
  CLIENT_CREDENTIALS: 'client_credentials',
  GAME_ROUND: 'gameround',
  PRICE_VAULT: 'prizevault'
};

export const STATES = {
  ALABAMA: 'AL',
  ALASKA: 'AK',
  ARIZONA: 'AZ',
  ARKANSAS: 'AR',
  CALIFORNIA: 'CA',
  COLORADO: 'CO',
  CONNECTICUT: 'CT',
  DELAWARE: 'DE',
  FLORIDA: 'FL',
  GEORGIA: 'GA',
  GUAM: 'GU',
  HAWAII: 'HI',
  IDAHO: 'ID',
  ILLINOIS: 'IL',
  INDIANA: 'IN',
  IOWA: 'IA',
  KANSAS: 'KS',
  KENTUCKY: 'KY',
  LOUISIANA: 'LA',
  MAINE: 'ME',
  MARYLAND: 'MD',
  MASSACHUSETTS: 'MA',
  MICHIGAN: 'MI',
  MINNESOTA: 'MN',
  MISSISSIPPI: 'MS',
  MISSOURI: 'MO',
  MONTANA: 'MT',
  NEBRASKA: 'NE',
  NEVADA: 'NV',
  NEW_HAMPSHIRE: 'NH',
  NEW_JERSEY: 'NJ',
  NEW_MEXICO: 'NM',
  NEW_YORK: 'NY',
  NORTH_CAROLINA: 'NC',
  NORTH_DAKOTA: 'ND',
  OHIO: 'OH',
  OKLAHOMA: 'OK',
  OREGON: 'OR',
  PENNSYLVANIA: 'PA',
  PUERTO_RICO: 'PR',
  RHODE_ISLAND: 'RI',
  SOUTH_CAROLINA: 'SC',
  SOUTH_DAKOTA: 'SD',
  TENNESSEE: 'TN',
  TEXAS: 'TX',
  UTAH: 'UT',
  VERMONT: 'VT',
  VIRGINIA: 'VA',
  WASHINGTON: 'WA',
  WEST_VIRGINIA: 'WV',
  WISCONSIN: 'WI',
  WYOMING: 'WY'
};

export const OPEN_PROMO_LOCATIONS = {
  GAME_ROOM_HEADER: 'Game Room - Header',
  GAME_ROOM_LIST: 'Game Room - In List',
  TOKEN_STORE_HEADER: 'Token Store - Header',
  NEW_ROOM_HEADER: 'News Room - Header'
};

export const ANALYTICS_EVENTS = {
  ACHIEVEMENT_COMPLETED: 'Achievement Completed',
  APP_OPENED: 'App Opened',
  APP_CLOSED: 'App Closed',
  ACCOUNT_CREATED: 'Account Created',
  ENTERED_MACHINE_QUEUE: 'Entered Machine Queue',
  GAME_LOST: 'Game Lost',
  GAME_PLAYED: 'Game Played',
  GAME_WON: 'Game Won',
  KEEP_PRIZE: 'Keep Prize',
  LEFT_MACHINE_QUEUE: 'Left Machine Queue',
  LOGIN: 'Login',
  OPENED_PROMO: 'Opened Promo',
  REDEMPTION_REQUEST: 'Redemption Request',
  SHARED_GAME_PLAY: 'Shared Game Play',
  SHIPPING_REQUEST: 'Shipping Request',
  SKIPPED_TO_SEE_GAMES: 'Skipped to See Games',
  SUBSCRIPTION_SIGNED_UP: 'Subscription Signed Up',
  SWAP_FOR_TICKETS_IN_PRIZE_VAULT: 'Swap for Tickets in Prize Vault',
  SWAP_TICKETS_AFTER_WIN: 'Swap for Tickets after Win',
  TOKENS_PURCHASED: 'Tokens Purchased',
  WEB_PURCHASED: 'Token Purchased Web',
  WATCHED_GAME_PLAY: 'Watched Game Play',
  VISITED_WINNER_CIRCLE: "Visited Winner's Circle",
  Token_Store_Visit: 'Token Store Visit ',
  Coupon_Code_Applied: 'Coupon Code Applied',
  Promo_Code_Purchase: 'Promo Code Purchase',
  WATCHED_VIDEO_AD: 'Watched Video Ad',
  FIRST_APP_OPEN: 'First App Open',
  FIRST_APP_INSTALL: 'First App Install',
  FIRST_PURCHASE: 'First Purchase',
  GAME_ROUND: 'Game Round',
  IRONSOURCE_REVENUE: 'Ironsource Revenue',
  DIGITAL_GAME: "Digital Game"
};

export const ANALYTICS_PROPERTIES = {
  ACHIEVEMENT_NAME: 'Achievement Name',
  APPLE_SEARCH_ADS: 'Apple Search Ads',
  ANONYMOUS_STATUS: 'Anonymous Status',
  DEVICE_ID: 'Device ID',
  DOLLAR_VALUE: '$DollarValue',
  FIRST_NAME: 'First Name',
  GAME_ROUND_ID: 'GameRound ID',
  GAME_TOKEN_COST: 'Game Token Cost',
  LAST_NAME: 'Last Name',
  LAST_USED_PLAYER_STATE: 'Last Used Player State',
  LAST_USED_SHIPPING_ADDRESS: 'Last Used Shipping Address',
  LAST_USED_PLAYER_CITY: 'Last Used Player City',
  LAST_USED_PLAYER_COUNTRY: 'Last Used Player Country',
  MACHINE_ID: 'Machine ID',
  USER_NAME: 'User Name',
  PLAYER_EMAIL: 'Player Email',
  PLAYER_ID: 'Player ID',
  PLAYER_LOSE_COUNT: 'Player Lose Count',
  PLAYER_PLAY_COUNT: 'Player Play Count',
  PLAYER_TOKEN_AMOUNT: 'Player Token Amount',
  PLAYER_TICKET_AMOUNT: 'Player Ticket Amount',
  PLAYER_WINS_COUNT: 'Player Wins Count',
  PLAYER_WON_PRIZES_COUNT: 'Player Won Prizes Count',
  POINTS_COUNT: 'Points Count',
  PRIZE_ID: 'Prize Id',
  PRIZE_NAME: 'Prize Name',
  PRIZE_VALUE: 'Prize Value',
  PROMO_ID: 'Promo ID',
  PROMO_LOCATION: 'Promo Location',
  REDEEMED_PRIZES: 'Redeemed Prizes',
  SHIPPING_ADDRESS: 'Shipping Address',
  SHIPPED_PRIZES: 'Shipped Prizes',
  SUBSCRIPTION_PACK_NAME: 'Subscription Pack Name',
  SUBSCRIPTION_TYPE: 'Subscription Type',
  TICKET_COST: 'Ticket Cost',
  TICKETS_DISPENSED: 'Tickets Dispensed',
  TOKEN_PACK_NAME: 'Token Pack Name',
  TOKEN_VALUE: 'Token Value',
  VIP_STATUS: 'VIP Status',
  FIRST_APP_INSTALL_DATE: 'First App Install Date',
  FIRST_APP_OPEN_DATE: 'First App Open Date',
  FIRST_PURCHASE_DATE: 'First Purchase Date',
  REVENUE: 'Revenue',
  AD_SOURCE: 'Ad Source',
  AD_FORMAT: 'Ad Format',
  AD_UNIT_NAME: 'Ad Unit Name',
  GAME_NAME: "Name",
  LEVEL_PASS: "Level Passed",
  LEVEL: "Level",
  TICKET_REWARD: "Reward"
};

export const ANALYTICS_BRANCH_EVENTS = {
  ACCOUNT_CREATED: 'ACCOUNT_CREATED',
  PURCHASE_TOKEN: 'PURCHASE_TOKEN',
  PURCHASE_SUBSCRIPTION: 'PURCHASE_SUBSCRIPTION'
};

export const ANALYTICS_APPSFLYER_EVENTS = {
  ACCOUNT_CREATED: 'ACCOUNT_CREATED',
  PURCHASE_TOKEN: 'PURCHASE_TOKEN',
  PURCHASE_SUBSCRIPTION: 'PURCHASE_SUBSCRIPTION',
  GAME_PLAYED: "game_played",
  GAME_WON: "game_won",
  POST_WIN_SWAP: "post_win_swap",
  PRIZE_VAULT_SWAP: "prize_vault_swap",
  SHIPPING_REQUEST: "shipping_request",
  LEVEL_ACHIVED: "af_level_achieved",
  INVITE: "af_invite",
  SHARE: "af_share",
  AD_VIEW: "af_ad_view",
  OFFERWALL_VIEW: "af_offerwall_view",
  DIGITAL_GAME: 'af_digital_game'
};

export const APPS_FLYER_PACK_TYPE = {
  TOKEN_PACK: 'Token_Pack',
  SUBSCRIPTION_PACKS: 'Subscription'
};

export const ANALYTICS_APPSFLYER_PREDEFINED_EVENTS = {
  PURCHASE: 'af_purchase',
  COMPLETE_REGISTRATION: 'af_complete_registration',
  LOGIN: 'af_login'
};

export const ANALYTICS_APPSFLYER_EVENTS_PARAMETER = {
  AF_REGISTRATION_METHOD: 'af_complete_registration',
  PLATFORM: 'platform',
  CHANNEL: 'channel',
  PURCHASE: {
    AF_REVENUE: 'af_revenue',
    AF_CURRENCY: 'af_currency',
    AF_ORDER_ID: 'af_order_id',
    PACK_TYPE: 'pack_type',
    TOKEN_AMOUNT: 'token_amount',
    PROMO_CODE: 'promo_code',
    SALE_TOKEN_AMOUNT: 'sale_token_amount',
    PACK_NAME: 'pack_name',
    FIRST_PURCHASE: 'first_purchase'
  },
  GAME: {
    GAME_ROUND_ID: 'game_round_id',
    TOKEN_COST: 'token_cost',
    PRIZE_ID: 'prize_id',
    PRIZE_NAME: 'prize_name',
    MACHINE_ID: 'machine_id',
    MACHINE_LOCATION: 'machine_location',
    IS_VIP: 'is_vip',
    MACHINE_TYPE: 'machine_type',
    PRIZE_CATEGORY: 'prize_category',
    TICKETS_DISPENSED: 'tickets_dispensed'
  },
  MACHINE_LOCATION: {
    SIDE: 'Side',
    TOP: 'Top'
  },
  SHIPPING: {
    PRIZE_ID: 'prize_id',
    PRIZE_NAME: 'prize_name',
    PRIZE_VALUE: 'prize_value',
    PRIZE_CATEGORY: 'prize_category'
  },
  DIGITAL_GAME:{
    GAME_NAME: "Name",
    LEVEL_PASS: "Level Passed",
    LEVEL: "Level",
    TICKET_REWARD: "Reward"
  },
  ACHIVEMENT_LEVEL: {
    AF_LEVEL: 'af_level'
  },
  SHARE: {
    PLATFORM: 'platform',
    MACHINE_ID: 'machine_id',
    MACHINE_LOCATION: 'machine_location',
    MACHINE_TYPE: 'machine_type',
    GAME_ROUND_ID: 'game_round_id'
  }
};
export const BLUSHIFT_EVENT = {
  BANNER_CLICK: 'Banner Click',
  BANNER_HYPERLINK_CLICK: 'Banner Hyperlink Click',
  NEWS_CLICK: 'News Click',
  SHARED_CLICK: 'ShareClick',
  APP_CLOSED: 'AppClosed'
};
export const BLUESHIFT_ANALYTICS_PROPERTIES = {
  TIME: 'data_Time',
  BANNER_ID: 'data_BannerID',
  BANNER_TITLE: 'data_BannerTitle',
  BANNER_HYPERLINK: 'data_BannerHyperlink',
  NEWS_FEED_ID: 'data_NewsFeedID',
  NEWS_FEED_TITLE: 'data_NewsFeedTitle',
  SHARE_TYPE:'data_ShareType'
};
export const SHARE_TYPE_STRING={
  GameRound:'GameRound',
  Prize:'Prize',
  ReferAFriend:'Refer A Friend'
}
export const SOUND_CATEGORY = {
  AMBIENT: 'Ambient',
  PLAY_AND_RECORD: 'PlayAndRecord',
  PLAY_BACK: 'Playback'
};

export const PLAYER_STATUS = {
  WATCHING: 'WATCHING',
  IN_QUEUE: 'IN_QUEUE',
  NEXT_PLAYER: 'NEXT_PLAYER',
  PLAYING: 'PLAYING',
  GAME_ENDED: 'GAME_ENDED'
};

export const STREAMING_MESSAGE_TYPE = {
  EVENT: 'event',
  RESPONSE: 'response'
};

export const LOCAL_STORAGE_NAME = {
  ACHIEVEMENTS: 'ACHIEVEMENTS',
  ONBOARDING: 'ONBOARDING',
  TOURGUIDE: 'TOURGUIDE',
  STEP_ONE: 'TOURGUIDE_STEP_ONE',
  TOURGUIDE_STEP_TWO: 'TOURGUIDE_STEP_TWO',
  SOUND_PREFERENCES: 'SOUND PREFERENCES',
  SESSION_COUNT: 'SESSION COUNT',
  NOTIFICAtION_PROMPT_STATUS: 'NOTIFICAtION PROMPT STATUS',
  NOTIFICAtION_SHOW_BEFORE: 'NOTIFICAtION SHOW BEFORE',
  DAILY_BONUS: 'DAILY BONUS',
  FREE_TOKEN_GIFT: 'FREE TOKEN GIFT',
  PIGGY_BANK_STATUS: 'PIGGY BANK STATUS',
  DEAL_OF_THE_DAY: 'DEAL OF THE DAY',
  DEAL_OF_THE_DAY_PUCRHASE_UID: 'DEAL_OF_THE_DAY_PUCRHASE_UID',
  REFERRER_DATA: 'REFERRER_DATA',
  PURCHASE_PROMPT: 'PURCHASE_PROMPT',
  BLUESHIFT_CUSTOMER_CREATED: 'BLUESHIFT_CUSTOMER_CREATED',
  FIRST_APP_RUN: 'FIRST_APP_RUN',
  FIRST_RUN_EVENTS: 'FIRST_RUN_EVENTS',
  SAVE_BUTTON_MODE: 'SAVE_BUTTON',
  SAVE_DATA: 'SAVE_DATA',
  USER_NAME_SUGGESTIONS: 'USER_NAME_SUGGESTIONS',
  PIGGY_BANK_FULL_DAILY_TIME: 'DAILY_PIGGY_BANK',
  APP_OPEN_AD: "APP_OPEN_AD",
  TRIVIA_WATCHER: "TRIVIA_WATCHER",
  TRIVIA_PLAYER: "TRIVIA_PLAYER",
  TRIVIA_ELIMINATED: "TRIVIA_ELIMINATED"
};

export const GET_SOCIAL_CONSTANT = {
  USER: 'user',
  USER_INSTALL_REFERRER: 'user_install_referrer',
  USER_TOKENS: 'user_tokens',
  USER_INSTALL_TOKENS: 'user_install_tokens',
  IN_APP_PURCHASED: 'IN_APP_PURCHASED',
  USER_ID: 'USER_ID',
  TYPE: 'TYPE',
  DATA: 'DATA'
};

export const CUSTOMER_IO_EVENTS = {
  APP_OPENED: 'appopened',
  PRIZE_KEPT: 'prizekept'
};

export const PATHS = {
  GAME_ROOM: 'game-room',
  DIGITAL_GAME_ROOM: 'digital-game-room',
  PRIZE_VAULT: 'prize-vault',
  TOKEN_STORE: 'token-store',
  WINNERS_CIRCLE: 'winners-circle',
  NEWS_ROOM: 'news-room',
  LEADERBORAD: 'leaderborad',
  EXPLORE_ARCADE: "explore-arcade",
  SELECT_DIFFICULTY: "select-difficulty",
  CHALLENGE: "challenge",
  WALLET :"wallet",
  ACCOUNT_PROFILE:'account-profile'
};

export const ERROR_STATUS_CODE = {
  USER_LOCATION_RESTRICTED: 451,
  USER_LOCATION_UNDETERMINED: 551
};

export const NETWORK_ERROR = 'Network Error';

export const DOD_EXPIRED = 'Deal of day has expired.';

export const GAME_PLAY_EVENT_TIME_OUT = {
  ROOM_ENTERED: 10000,
  GAME_START: 10000,
  START_PLAYING_TO_GAME_RESULT: 40000,
  GRAB_TO_GAME_RESULT: 20000,
  UFO_START_PLAYING_TO_GAME_RESULT: 60000,
  UFO_GRAB_TO_GAME_RESULT: 40000,
  UFO_DURATION_BUFFER: 5
};

export const WC_FILTER_OPTION_TYPE = {
  COST: 'Cost',
  CATEGORY: 'Category',
  SEARCH: "Search",
};

export const ACHIEVEMENT_ENUMS = {
  DAY: 1,
  WIN: 2,
  TICKET: 3,
  DAILY_LOGIN: 4,
  DAILY_WIN: 5
};

export const FREE_TOKEN_ENUMS = {
  success: 'success'
};

export const APP_STATE = {
  ACTIVE: 'active',
  BACKGROUND: 'background',
  INACTIVE: 'inactive'
};

export const API_RESPONSE_ENUMS = {
  NOT_FOUND: 'Not Found'
};

export const MACHINE_TYPES = {
  CLAW: 1,
  UFO: 2,
  CUTTER: 3,
  UFO_TWO: 4,
  DUNK_TANK: 5,
  KEYMASTER: 7,
  CLAW_TWO: 8
};

export const COUNTRIES_ISO = {
  UK: 'GB',
  CA: 'CA',
  AU: 'AU'
};

export const VALIDATIONS_MESSAGES_SHIPPING_FORM = {
  FIRST_NAME_REQUIRED: 'First name is required',
  LAST_NAME_REQUIRED: 'Last name is required',
  EMAIL_REQUIRED: 'Email is required',
  ZIP_CODE_REQUIRED: 'Zip / Postal Code is required',
  PHONE_NUMBER_REQUIRED: 'PhoneNumber is required',
  ADDRESS1_REQUIRED: 'Address is required',
  CITY_REQUIRED: 'City is required',
  STATE_REQUIRED: 'State is required',
  EMAIL_VALIDATION_MESSAGE: 'Email is not valid',
  PHONE_NUMBER_VALIDATION_MESSAGE: 'PhoneNumber is not valid',
  CITY_VALIDATION_MESSAGE_SHIPPING_FORM: 'City should contain alphabets only',
  ZIP_CODE_VALIDATION_MESSAGE_SHIPPING_FORM: 'Zip / Postal Code is not valid'
};

export const VALIDATIONS_MESSAGES_MY_INFO_FORM = {
  USERNAME_REQUIRED: 'UserName is required',
  CITY_VALIDATION_MESSAGE: 'City should contain alphabets only',
  ZIP_CODE_VALIDATION_MESSAGE: 'Zip / Postal Code is not valid',
  EMAIL_VALIDATION_MESSAGE: 'Email is not valid'
};

export const NFT_POPUP_TYPE = {
  CLAIM: 'CLAIM',
  CONFIRM: 'CONFIRM',
};

export const PRIZE_TYPE_CODE = {
  ACTUAL: '001',
  NFT: "002",
}

export const GAME_TYPES = {
  LIVE_ARCADE: "Live Arcade",
  LIVE_HOSTED: "Live Trivia",
}

export const DELETE_ACCOUNT_POPUP_TYPE = {
  I_UNDERSTAND: 'I_UNDERSTAND',
  CONFIRM: 'CONFIRM',
};
export const SYSTEM_KEYS = {
  LiveArcadeAndroid:'LiveArcadeAndroid',
  LiveArcadeIOS:'LiveArcadeIOS'
}
export const DELETE_ACCOUNT_CONFIRMATION_TEXT = 'DELETE';