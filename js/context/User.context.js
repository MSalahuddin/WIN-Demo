/* istanbul ignore file */
import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import jwtDecode from 'jwt-decode';
import { Platform } from 'react-native';
import DeviceInfo, { getUniqueId } from 'react-native-device-info';
import AppInstallDate from 'react-native-app-install-date';
import Config from 'react-native-config';
import RNIap, { purchaseErrorListener, purchaseUpdatedListener } from 'react-native-iap';
import AsyncStorage from '@react-native-community/async-storage';
import { BranchEvent } from 'react-native-branch';
import { GetSocial } from 'getsocial-react-native-sdk';
import api from '../api';
import { getTokens, clearTokens, storeTokens, updateStoredTokens } from '../utils/keychainUtils';
import { removeDollarSign, getDateTime } from '../utils';
import { withPopup } from './Popup.context';
import { auth0 } from '../utils/auth';
import messaging from '@react-native-firebase/messaging';

import {
  API_CALL_CONSTANTS,
  ANALYTICS_EVENTS,
  ANALYTICS_PROPERTIES,
  CUSTOMER_IO_EVENTS,
  ERROR_STATUS_CODE,
  ANALYTICS_BRANCH_EVENTS,
  LOCAL_STORAGE_NAME,
  FREE_TOKEN_ENUMS,
  GET_SOCIAL_CONSTANT,
  API_RESPONSE_ENUMS,
  PRODUCTS_ID,
  FIRST_APP_RUN,
  BUNDLE_ID,
  ANALYTICS_APPSFLYER_EVENTS,
  ANALYTICS_APPSFLYER_PREDEFINED_EVENTS,
  ANALYTICS_APPSFLYER_EVENTS_PARAMETER,
  APPS_FLYER_PACK_TYPE,
  SYSTEM_KEYS
} from '../constants';

import { logEvent, setUserId, setUserProperties, logRevenueV2 } from '../amplitudeUtils';
import { setUserIdentity, logBranchCustomEvent, logBranchStandardEvent } from '../branchUtils';
import { AFsetUserIdentityEvent, AFLogCustomEvent, AFLogStandardEvent } from "../appFlyer.utils";
import { setBlueShiftCustomerEmailId, setBlueShiftCustomerInfo } from '../blushiftutils';

import { trackingPermission } from '../trackingUtils'

export const UserContext = React.createContext();

const deviceId = getUniqueId();


class UserProvider extends PureComponent {
  constructor(props) {
    super(props);
    this.notificationUpdateListener = null;
    this.purchaseUpdateSubscription = null;
    this.purchaseErrorSubscription = null;

    this.state = {
      isPiggyBankFull: false,
      isPersistedDataLoaded: false,
      isUserLoggedIn: false,
      isUserNameRequired: false,
      autoPromptPiggyBank: true,
      userName: null,
      firstName: null,
      lastName: null,
      profilePicture: null,
      tokenInfo: null,
      geoRestrictedStatusCode: null,
      // Profile data
      shippingInformation: {},
      isVip: false,
      tickets: 0,
      tokens: 0,
      newsFeedIds: [],
      newsFeedCount: 0,
      gamesWon: 0,
      tokenBonus: 0,
      ticketBonus: 0,
      freeToken: 0,
      email: '',
      playerId: '',
      isDigitalGameAdBlock: null,
      bonusScreenData: null,
      // currentAppliedPromoCode: null,
      shouldRefreshTokenPack: false,
      shouldRefreshGameRoom: false,
      isVipModalVisible: false,
      isIncentiviseValues: {
        incentiviseCheck: false,
        incentiveTokensQuantity: 0
      },
      vipPoints: 0,
      vipLevel: null,
      purchaseProcess: false,
      tokensAnimation: false,
      trackingPrompt: false,
      totalFreePlays: 0,
      freePlayGrandId: null,
      freePlayStatus: false,
      showPopupStatus: false,
      getFreePlay: null,
      country: null,
      countryId: null,
      dateOfBirth: null,
      machinesSocketBaseUrl: '',
      isQrOpen: false,
      liveArcade: null,
    };
  }




  async componentDidMount() {
    const { isPersistedDataLoaded } = this.state;
    // for testing anonymouse mode
    await this.clearKeyChainOnStaggingAndDevelop()
    await this.firstTimeAmplitudeEvents()
    try {
      const storedTokens = await getTokens();
      if (!storedTokens) {
        await this.createAnonymousUser();
      } else if (!storedTokens.isAnon) {
        if (!storedTokens.refreshToken) {
          // Temporary fix for 401 error state users got stuck in with no refresh token on device
          await clearTokens();
          await this.createAnonymousUser();
        } else {
          this.setIsUserLoggedIn(storedTokens);
          await this.fetchUserInfo();
        }
      } else {
        // user who has never logged in but already requested a token before
        this.setState({ tokenInfo: storedTokens, isPersistedDataLoaded: true });
        await this.fetchUserInfo();
      }
    } catch (error) {
      await this.createAnonymousUser();
    }

    if (isPersistedDataLoaded) {
      // remove splash screen
    }
    trackingPermission()
    this.listenForTransactions();
    this.notificationListener();


  }

  async componentDidUpdate(_, prevState) {
    const { tokenInfo, isPersistedDataLoaded, isUserLoggedIn } = this.state;
    // refetch data if token has changed
    if (tokenInfo !== prevState.tokenInfo && isUserLoggedIn) {
      await this.fetchProfileData();
    }
    if (isPersistedDataLoaded) {
      // remove splash screen
    }
  }

  setLiveArcade = async () => {
    try {
      const res = await api.getWWAppSettings(Platform.OS === 'android' ? SYSTEM_KEYS.LiveArcadeAndroid : SYSTEM_KEYS.LiveArcadeIOS)
      if (res.status === 200) {
        this.setState({ liveArcade: res.data })
        return res.data
      }
       return false
    } catch (err) {
      return false
      // failed silently
    }
  }
  /* istanbul ignore next */
  componentWillUnmount() {
    if (this.purchaseUpdateSubscription) {
      this.purchaseUpdateSubscription.remove();
      this.purchaseUpdateSubscription = null;
    }
    if (this.purchaseErrorSubscription) {
      this.purchaseErrorSubscription.remove();
      this.purchaseErrorSubscription = null;
    }
    if (this.notificationUpdateListener) {
      // this.notificationUpdateListener=null;
    }
  }

  getFirstAppRun = async () => {
    const firstRun = await AsyncStorage.getItem(LOCAL_STORAGE_NAME.FIRST_APP_RUN);
    return firstRun
  }

  saveFirstAppRun = async () => {
    await AsyncStorage.setItem(LOCAL_STORAGE_NAME.FIRST_APP_RUN, FIRST_APP_RUN.FIRST_APP_RUN);
  }

  clearKeyChainOnStaggingAndDevelop = async () => {
    const bundleId = DeviceInfo.getBundleId()
    const { BUNDLE_ID_DEVELOP, BUNDLE_ID_STAGING } = BUNDLE_ID
    if (bundleId === BUNDLE_ID_STAGING || bundleId === BUNDLE_ID_DEVELOP) {
      const isFirstRun = await this.getFirstAppRun()
      if (!isFirstRun) {
        await clearTokens()
        await this.saveFirstAppRun()
      }
    }
  }

  getBlueShiftUser = async () => {
    const email = await AsyncStorage.getItem(LOCAL_STORAGE_NAME.BLUESHIFT_CUSTOMER_CREATED);
    return email
  }

  saveBlueShiftUser = async (email) => {
    await AsyncStorage.setItem(LOCAL_STORAGE_NAME.BLUESHIFT_CUSTOMER_CREATED, email);
  }

  clearBlueShiftUser = async () => {
    await AsyncStorage.removeItem(LOCAL_STORAGE_NAME.BLUESHIFT_CUSTOMER_CREATED);
  }

  createCustomerBlueShift = async () => {
    const blueshiftUser = await this.getBlueShiftUser()
    const { isUserLoggedIn, email, playerId } = this.state
    if ((blueshiftUser === null) && isUserLoggedIn && email && playerId) {
    setBlueShiftCustomerInfo(playerId)
    setBlueShiftCustomerEmailId(email)
      await this.saveBlueShiftUser(email)
    }
  }

  getFirstTimeEvents = async () => {
    const firstTimeEvents = await AsyncStorage.getItem(LOCAL_STORAGE_NAME.FIRST_RUN_EVENTS);
    return firstTimeEvents
  }

  saveFirstTimeEvents = async () => {
    await AsyncStorage.setItem(LOCAL_STORAGE_NAME.FIRST_RUN_EVENTS, FIRST_APP_RUN.FIRST_APP_RUN);
  }


  firstTimeAmplitudeEvents = async () => {
    try {
      const dateFormat = 'yyyy/MM/dd hh:mm:ss'
      const firstTimeEvents = await this.getFirstTimeEvents()
      const appInstallDate = await AppInstallDate.getDateTime(dateFormat)
      const dateTime = await getDateTime()
      if (!firstTimeEvents) {
        setUserProperties({
          [ANALYTICS_PROPERTIES.FIRST_APP_INSTALL_DATE]: appInstallDate,
          [ANALYTICS_PROPERTIES.FIRST_APP_OPEN_DATE]: dateTime.toLocaleString()
        });
        await this.saveFirstTimeEvents()
      }
    }
    catch (e) {
      //
    }
  }

  restorePendingPurchases = async () => {
    try {
      const pendingPurchases = await RNIap.getAvailablePurchases()
      pendingPurchases.forEach(async (purchase) => {
        await RNIap.finishTransaction(purchase)
      })
    } catch (error) {
      // fail silently
    }
  }

  getSubscriptionPrice = async (productId) => {
    try {
      const products = await RNIap.getSubscriptions([productId])
      const currentProduct = products.find(data => data.productId === productId);
      const { price } = currentProduct
      return price
    }
    catch (e) {
      return null
    }
  };

  restorePendingPurchasesWithApi = async () => {
    try {
      const pendingPurchases = await RNIap.getAvailablePurchases()
      pendingPurchases.forEach(async (purchase) => {
        const res = await api.postIAPTransaction(purchase)
        if (res.status === 200 && res.data) {
          const packageData = res.data
          await RNIap.finishTransaction(purchase)
          if (packageData.iapTransaction) {
            await this.trackIAPPurchase(purchase, packageData);
          }
        }
      })
    } catch (error) {
      // fail silently
    }
  }


  getBonusScreenData = async () => {
    try {
      const res = await api.getBonusScreen();
      if (res.status === 200 && res.data) {
        this.setState({ bonusScreenData: res.data })

      }
    } catch (error) {
      // fail silently
    }
  }

  isRestorePurchases = async () => {
    try {
      const res = await api.getAppSetting()
      if (res.status === 200 && res.data) {
        const { clearIAPRestoreTranExistingTran, clearIAPRestoreTranExistingTranWithoutAPI } = res.data
        if (clearIAPRestoreTranExistingTranWithoutAPI) {
          await this.restorePendingPurchases()
        }
        else if (clearIAPRestoreTranExistingTran) {
          await this.restorePendingPurchasesWithApi()
        }
      }
    }
    catch (e) {
      // fail silenty
    }
  }


  fetchUserInfo = async () => {
    await this.fetchProfileData();
    await this.trackAppOpened();
  };

  trackAppOpened = async () => {
    const { playerId, isUserLoggedIn } = this.state;
    if (playerId) {
      setUserId(playerId);
      setUserProperties({
        [ANALYTICS_PROPERTIES.ANONYMOUS_STATUS]: !isUserLoggedIn,
        [ANALYTICS_PROPERTIES.PLAYER_ID]: playerId,
        [ANALYTICS_PROPERTIES.DEVICE_ID]: deviceId
      });
    }

    logEvent(ANALYTICS_EVENTS.APP_OPENED);
    try {
      await api.postCustomerIo(CUSTOMER_IO_EVENTS.APP_OPENED, deviceId);
      await api.getActivePlayer();
    } catch (error) {
      // fail silently
    }
  };

  getIAPTransactionPrice = async (productId, isSubscription = false) => {
    let iOSPackageData;
    if (isSubscription) {
      iOSPackageData = await RNIap.getSubscriptions([productId]);
    } else {
      iOSPackageData = await RNIap.getProducts([productId], false);
    }
    const currentPurchasedPackage = await iOSPackageData.find(data => data.productId === productId);
    const { price, currency } = currentPurchasedPackage
    return { price, currency };
  };

  trackWebpay = async (purchasedPackName,initialAmount,prize) => {
    try{
      const { isVip } = this.state;
      await this.fetchProfileData(!isVip);
      logEvent(ANALYTICS_EVENTS.WEB_PURCHASED, {
        [ANALYTICS_PROPERTIES.TOKEN_PACK_NAME]: purchasedPackName,
        [ANALYTICS_PROPERTIES.TOKEN_VALUE]: initialAmount,
        [ANALYTICS_PROPERTIES.DOLLAR_VALUE]:prize
      });
    }catch(err){
    }

  }

  trackIAPPurchase = async (purchase, transactionData) => {

    const { productId, transactionId } = purchase;
    const { purchasedPackName, subscriptionPackType, iapTransaction, isPromoCodePurchase } = transactionData;
    const { initialAmount, subscriptionPackId, monthlyAmount } = iapTransaction;
    const {
      tokens,
      // currentAppliedPromoCode 
    } = this.state;
    // if subscriptionPackId is not 0 then it is a subscription purchase
    // else it's a token pack purchase
    if (subscriptionPackId !== 0) {
      const {price: localizedPrice, currency} = await this.getIAPTransactionPrice(productId, true);
      logEvent(ANALYTICS_EVENTS.SUBSCRIPTION_SIGNED_UP, {
        [ANALYTICS_PROPERTIES.SUBSCRIPTION_PACK_NAME]: purchasedPackName,
        [ANALYTICS_PROPERTIES.TOKEN_VALUE]: initialAmount,
        [ANALYTICS_PROPERTIES.DOLLAR_VALUE]: removeDollarSign(localizedPrice)
      });
      // Branch.io
      logBranchCustomEvent(ANALYTICS_BRANCH_EVENTS.PURCHASE_SUBSCRIPTION, {});
      AFLogCustomEvent(ANALYTICS_APPSFLYER_EVENTS.PURCHASE_SUBSCRIPTION, {});
      logBranchStandardEvent(BranchEvent.Purchase, {
        revenue: removeDollarSign(localizedPrice)
      });

      AFLogStandardEvent(ANALYTICS_APPSFLYER_PREDEFINED_EVENTS.PURCHASE, {
        [ANALYTICS_APPSFLYER_EVENTS_PARAMETER.PURCHASE.AF_REVENUE]: removeDollarSign(localizedPrice),
        [ANALYTICS_APPSFLYER_EVENTS_PARAMETER.PURCHASE.AF_CURRENCY]: currency,
        [ANALYTICS_APPSFLYER_EVENTS_PARAMETER.PURCHASE.AF_ORDER_ID]:transactionId,
        [ANALYTICS_APPSFLYER_EVENTS_PARAMETER.PURCHASE.PACK_TYPE]: APPS_FLYER_PACK_TYPE.SUBSCRIPTION_PACKS,
        [ANALYTICS_APPSFLYER_EVENTS_PARAMETER.PURCHASE.TOKEN_AMOUNT]: initialAmount,
        [ANALYTICS_APPSFLYER_EVENTS_PARAMETER.PURCHASE.PROMO_CODE]: "",
        [ANALYTICS_APPSFLYER_EVENTS_PARAMETER.PURCHASE.SALE_TOKEN_AMOUNT]: monthlyAmount,
        [ANALYTICS_APPSFLYER_EVENTS_PARAMETER.PURCHASE.PACK_NAME]: purchasedPackName,
        [ANALYTICS_APPSFLYER_EVENTS_PARAMETER.PURCHASE.FIRST_PURCHASE]: "",
      });
      setUserProperties({
        [ANALYTICS_PROPERTIES.SUBSCRIPTION_TYPE]: subscriptionPackType,
        [ANALYTICS_PROPERTIES.VIP_STATUS]: true,
        [ANALYTICS_PROPERTIES.PLAYER_TOKEN_AMOUNT]: tokens
      });
    } else {
      const {price: localizedPrice, currency} = await this.getIAPTransactionPrice(productId);
      if (isPromoCodePurchase) {
        logEvent(ANALYTICS_EVENTS.Promo_Code_Purchase, {
          [ANALYTICS_PROPERTIES.TOKEN_PACK_NAME]: purchasedPackName,
          [ANALYTICS_PROPERTIES.TOKEN_VALUE]: initialAmount,
          [ANALYTICS_PROPERTIES.DOLLAR_VALUE]: removeDollarSign(localizedPrice)
        });
        AFLogStandardEvent(ANALYTICS_APPSFLYER_PREDEFINED_EVENTS.PURCHASE, {
          [ANALYTICS_APPSFLYER_EVENTS_PARAMETER.PURCHASE.AF_REVENUE]: removeDollarSign(localizedPrice),
          [ANALYTICS_APPSFLYER_EVENTS_PARAMETER.PURCHASE.AF_CURRENCY]: currency,
          [ANALYTICS_APPSFLYER_EVENTS_PARAMETER.PURCHASE.AF_ORDER_ID]:transactionId,
          [ANALYTICS_APPSFLYER_EVENTS_PARAMETER.PURCHASE.PACK_TYPE]: APPS_FLYER_PACK_TYPE.SUBSCRIPTION_PACKS,
          [ANALYTICS_APPSFLYER_EVENTS_PARAMETER.PURCHASE.TOKEN_AMOUNT]: initialAmount,
          // [ANALYTICS_APPSFLYER_EVENTS_PARAMETER.PURCHASE.PROMO_CODE]: currentAppliedPromoCode,
          [ANALYTICS_APPSFLYER_EVENTS_PARAMETER.PURCHASE.PROMO_CODE]: null,
          [ANALYTICS_APPSFLYER_EVENTS_PARAMETER.PURCHASE.SALE_TOKEN_AMOUNT]: monthlyAmount,
          [ANALYTICS_APPSFLYER_EVENTS_PARAMETER.PURCHASE.PACK_NAME]: purchasedPackName,
          [ANALYTICS_APPSFLYER_EVENTS_PARAMETER.PURCHASE.FIRST_PURCHASE]: "",
        });
      }
      else {
        logEvent(ANALYTICS_EVENTS.TOKENS_PURCHASED, {
          [ANALYTICS_PROPERTIES.TOKEN_PACK_NAME]: purchasedPackName,
          [ANALYTICS_PROPERTIES.TOKEN_VALUE]: initialAmount,
          [ANALYTICS_PROPERTIES.DOLLAR_VALUE]: removeDollarSign(localizedPrice)
        });
      }
      // Branch.io
      logBranchCustomEvent(ANALYTICS_BRANCH_EVENTS.PURCHASE_TOKEN, {});
      AFLogCustomEvent(ANALYTICS_APPSFLYER_EVENTS.PURCHASE_TOKEN, {});
      logBranchStandardEvent(BranchEvent.Purchase, {
        revenue: removeDollarSign(localizedPrice)
      });
      AFLogStandardEvent(ANALYTICS_APPSFLYER_PREDEFINED_EVENTS.PURCHASE, {
        [ANALYTICS_APPSFLYER_EVENTS_PARAMETER.PURCHASE.AF_REVENUE]: removeDollarSign(localizedPrice),
        [ANALYTICS_APPSFLYER_EVENTS_PARAMETER.PURCHASE.AF_CURRENCY]: currency,
        [ANALYTICS_APPSFLYER_EVENTS_PARAMETER.PURCHASE.AF_ORDER_ID]:transactionId,
        [ANALYTICS_APPSFLYER_EVENTS_PARAMETER.PURCHASE.PACK_TYPE]: APPS_FLYER_PACK_TYPE.TOKEN_PACK,
        [ANALYTICS_APPSFLYER_EVENTS_PARAMETER.PURCHASE.TOKEN_AMOUNT]: initialAmount,
        [ANALYTICS_APPSFLYER_EVENTS_PARAMETER.PURCHASE.PROMO_CODE]: "",
        [ANALYTICS_APPSFLYER_EVENTS_PARAMETER.PURCHASE.SALE_TOKEN_AMOUNT]: monthlyAmount,
        [ANALYTICS_APPSFLYER_EVENTS_PARAMETER.PURCHASE.PACK_NAME]: purchasedPackName,
        [ANALYTICS_APPSFLYER_EVENTS_PARAMETER.PURCHASE.FIRST_PURCHASE]: "",
      });
      setUserProperties({
        [ANALYTICS_PROPERTIES.VIP_STATUS]: true,
        [ANALYTICS_PROPERTIES.PLAYER_TOKEN_AMOUNT]: tokens
      });
    }
  };

  removeDealOfTheDayUIDAndDealOfTheDay = async () => {
    const keys = [LOCAL_STORAGE_NAME.DEAL_OF_THE_DAY_PUCRHASE_UID, LOCAL_STORAGE_NAME.DEAL_OF_THE_DAY];
    try {
      await AsyncStorage.multiRemove(keys);
    } catch (error) {
      // Fail silently
    }
  };

  logGetSocialEvent = async (isFirstTransaction) => {
    try {
      if (isFirstTransaction) {
        const dateTime = await getDateTime()
        setUserProperties({
          [ANALYTICS_PROPERTIES.FIRST_PURCHASE_DATE]: dateTime.toLocaleString(),
        });
        const { userId } = this.state
        const eventSent = await GetSocial.trackCustomEvent(GET_SOCIAL_CONSTANT.IN_APP_PURCHASED, { userId })
        if (eventSent === true) {
          //  console.warn('event send')
        }
        else {
          // console.warn('not event send')
        }
      }
    }
    catch (e) {
      //
    }
  }


  isDealOfTheTransaction = async () => {
    const UID = await AsyncStorage.getItem(LOCAL_STORAGE_NAME.DEAL_OF_THE_DAY_PUCRHASE_UID);
    let data = await AsyncStorage.getItem(LOCAL_STORAGE_NAME.DEAL_OF_THE_DAY);
    if (UID && data) {
      data = JSON.parse(data);
      return {
        available: true,
        value: UID,
        dealofDayIAPData: {
          dealOfDayResponseLogId: parseInt(UID, 10),
          tokenPackProductId: Platform.OS === 'android' ? data?.androidProductId : data?.iosProductId,
          dealOfDayId: data?.dealOfDayId,
          tokenPackId: Platform.OS === 'android' ? data?.tokenPackAndroid?.tokenPackId : data?.tokenPackIOS?.tokenPackId
        }
      };
    }
    return {
      available: false,
      value: UID
    };
  };

  getProductPrice = async (productId) => {
    try {
      const products = await RNIap.getProducts([productId])
      const currentProduct = products.find(data => data.productId === productId);
      const { price } = currentProduct
      return price
    }
    catch (e) {
      return null
    }
  };

  revenueV2 = async (revenueProperties) => {
    setTimeout(() => {
      logRevenueV2(revenueProperties)
    }, 5000)
  }

  amplitudeRevenue = async (receipt, transactionData) => {
    const { productId } = receipt;
    const { iapTransaction } = transactionData;
    const { subscriptionPackId } = iapTransaction;
    const receiptStringify = JSON.stringify(receipt)
    // subscriptionPackId !== then its subscription
    if (subscriptionPackId !== 0) {
      const {price: subscriptionPrice} = await this.getIAPTransactionPrice(productId, true);
      const price = parseInt(subscriptionPrice, 10)
      await this.revenueV2({ productId, price, receipt: receiptStringify })
    }
    else {
      const {price: tokenPackPrice} = await this.getIAPTransactionPrice(productId);
      const price = parseInt(tokenPackPrice, 10)
      await this.revenueV2({ productId, price, receipt: receiptStringify })
    }
  }



  validateIAPReceipt = async purchase => {
    const pureReceipt = { ...purchase }
    const { productId } = purchase
    const productPrice = await this.getProductPrice(productId)
    const isDealOfTheDay = await this.isDealOfTheTransaction();
    const {
      isUserLoggedIn,
      // currentAppliedPromoCode 
    } = this.state;
    const iaPurchase = purchase;
    // iaPurchase.promoCode = currentAppliedPromoCode;
    iaPurchase.isNotApplyBonus = isDealOfTheDay.available
    if (isDealOfTheDay.available) {
      iaPurchase.dealofDayIAPData = isDealOfTheDay.dealofDayIAPData;
    }
    const subscriptionPrice = await this.getSubscriptionPrice(productId);
    iaPurchase.price = subscriptionPrice != null ? subscriptionPrice : productPrice;
    // nullable
    iaPurchase.price = productPrice
    if (Platform.OS === 'android') {
      iaPurchase.dataAndroid = JSON.parse(iaPurchase.dataAndroid);
      iaPurchase.transactionReceipt = JSON.parse(iaPurchase.transactionReceipt);
    }
    this.setShouldRefreshTokenPack(false);
    if (iaPurchase?.transactionReceipt) {
      try {
        const res = await api.postIAPTransaction(iaPurchase, isUserLoggedIn)
        if (res.status === 200 && res.data) {
          if (res.data.clearDODStorage) {
            await this.removeDealOfTheDayUIDAndDealOfTheDay();
          }
          const { isVip, tokens } = this.state;
          const packageData = res.data;
          const { isFirstTransaction } = packageData
          this.logGetSocialEvent(isFirstTransaction)
          await this.fetchProfileData(!isVip);
          const tokenPrevious = tokens;
          if (Platform.OS === 'ios') {
            // await RNIap.finishTransactionIOS(iaPurchase.transactionId);
            await RNIap.finishTransaction(iaPurchase);
          } else if (Platform.OS === 'android') {
            if (iaPurchase.autoRenewingAndroid === true) {
              await RNIap.finishTransaction(iaPurchase, false, iaPurchase.purchaseToken);
            } else {
              await RNIap.consumePurchaseAndroid(iaPurchase.purchaseToken);
            }
          }
          /// log Revenue
          if (packageData.iapTransaction) {
            await this.amplitudeRevenue(pureReceipt, packageData)
            await this.trackIAPPurchase(iaPurchase, packageData);
          }

          // if token value increases then the user has been charged
          // eslint-disable-next-line react/destructuring-assignment
          // if (tokenPrevious < this.state.tokens && packageData.iapTransaction) {
          //   this.trackIAPPurchase(iaPurchase, packageData);
          // }
          // if (currentAppliedPromoCode) {
          //   this.setState({ 
          //     // currentAppliedPromoCode: null, 
          //     shouldRefreshTokenPack: true });
          // }
          // animated when user buy low token purchase prompt
          // eslint-disable-next-line no-shadow
          const { productId } = iaPurchase
          const { refillBasic, refillStarter } = PRODUCTS_ID


          this.setState({
            purchaseProcess: false,
            shouldRefreshGameRoom: true,
            shouldRefreshTokenPack: true
          });

          if (productId === refillBasic || productId === refillStarter) {
            this.setTokensAnimation(true)
          }

        }
      } catch (error) {
        const { popupContextValue } = this.props;
        const { displayRequestError } = popupContextValue;
        if (error.response) {
          const { data } = error.response;
          if (data?.isTransactionExisting && Platform.OS === "android") {
            if (iaPurchase.autoRenewingAndroid === true) {
              await RNIap.finishTransaction(iaPurchase, false, iaPurchase.purchaseToken);
            } else {
              await RNIap.consumePurchaseAndroid(iaPurchase.purchaseToken);
            }
          }
          else {
            displayRequestError(data.errorMessage);
          }
        } else {
          displayRequestError(error.message);
        }
      }
    }
  };

  listenForTransactions = () => {
    this.purchaseUpdateSubscription = purchaseUpdatedListener(purchase => {
      this.validateIAPReceipt(purchase);
    });

    this.purchaseErrorSubscription = purchaseErrorListener(error => {
      if (error.code === RNIap.IAPErrorCode.E_USER_CANCELLED) {
        return;
      }
      const { popupContextValue } = this.props;
      const { displayRequestError } = popupContextValue;
      displayRequestError(error.message);
    });
  };
  notificationListener = () => {
    this.notificationUpdateListener =  messaging().onMessage(async remoteMessage => {
      if(remoteMessage?.data?.isScanned || remoteMessage?.aps?.isScanned){
        await this.fetchProfileData();
        this.setState({isQrOpen:false})
      }
    });
  }
  createAnonymousUser = async () => {
    const clientId = Config.AUTH0_CLIENT_ID;
    const grantType = API_CALL_CONSTANTS.CLIENT_CREDENTIALS;
    try {
      const data = {
        device_id: deviceId,
        client_id: clientId,
        grant_type: grantType
      };

      const res = await api.postAnonymousUser(data);

      if (res.status === 200 && res.data) {
        const { userId } = res.data;
        setUserId(userId);
        setUserIdentity(userId);
        AFsetUserIdentityEvent(userId);
        setUserProperties({
          [ANALYTICS_PROPERTIES.ANONYMOUS_STATUS]: true,
          [ANALYTICS_PROPERTIES.PLAYER_ID]: userId,
          [ANALYTICS_PROPERTIES.DEVICE_ID]: deviceId
        });
        const postData = res.data;
        postData.isAnon = true;
        await storeTokens(postData);
        this.setState({ tokenInfo: postData });
        await this.fetchUserInfo();
        await this.checkFreePlay();
      }
    } catch (error) {
      const { popupContextValue } = this.props;
      const { displayRequestError } = popupContextValue;
      if (error.response) {
        const { status, data } = error.response;
        if (
          status === ERROR_STATUS_CODE.USER_LOCATION_RESTRICTED ||
          status === ERROR_STATUS_CODE.USER_LOCATION_UNDETERMINED
        ) {
          this.setState({ geoRestrictedStatusCode: status });
        } else {
          displayRequestError(data);
        }
      } else {
        displayRequestError(error.message);
      }
    }
    this.setState({ isPersistedDataLoaded: true });
  };

  setGeoRestrictedStatusCode = geoRestrictedStatusCode => {
    this.setState({ geoRestrictedStatusCode });
  };

  login = async (existingUserCallback, successCallback, isSignUp = false, failCallback = () => { }) => {
    const { AUTH0_SCOPE, AUTH0_DOMAIN, AUTH0_BASE_URL, AUTH0_FIELD_URL } = Config;
    const initialScreens = {
      login: 'login',
      signUp: 'signUp'
    };
    try {


      const credentials = await auth0.webAuth.authorize({
        scope: AUTH0_SCOPE,
        issuer: AUTH0_DOMAIN,
        audience: AUTH0_BASE_URL,
        initialScreen: isSignUp ? initialScreens.signUp : initialScreens.login,
        prompt: initialScreens.login
      });

      const userNameKey = `${AUTH0_FIELD_URL}username`;
      const playerIdKey = `${AUTH0_FIELD_URL}internal_id`;
      const decodedCredentials = this.decodeCredentials(credentials);
      // that user already has an account created
      // if userName exists in the token then we just
      // log the user in
      if (decodedCredentials && decodedCredentials[userNameKey]) {
        const playerId = decodedCredentials[playerIdKey];
        logEvent(ANALYTICS_EVENTS.LOGIN);
        setUserId(playerId);
        setUserIdentity(playerId);
        AFsetUserIdentityEvent(playerId);
        setUserProperties({
          [ANALYTICS_PROPERTIES.ANONYMOUS_STATUS]: false
        });
        const storedData = credentials;
        storedData.isAnon = false;
        await updateStoredTokens(storedData);
        existingUserCallback(credentials);
      } else {
        successCallback(credentials);
      }
    } catch (error) {
      failCallback(error);
    }
  };

  logout = async () => {
    try {
      // await auth0.webAuth.clearSession();
      await clearTokens();
      await this.clearBlueShiftUser();
      this.setState({
        isUserLoggedIn: false,
        profilePicture: null,
        firstName: '',
        lastName: '',
        tokenInfo: null,
        isPersistedDataLoaded: true,
        isUserNameRequired: false,
        isVip: false,
        tickets: 0,
        tokens: 0,
        gamesWon: 0,
        tokenBonus: 0,
        ticketBonus: 0,
        freeToken: 0,
        playerId: '',
        isVipModalVisible: false,
        isIncentiviseValues: {},
        vipPoints: 0,
        vipLevel: null
      });
      await this.createAnonymousUser();
    } catch (error) {
      // Fail silently
    }
  };

  removeAccountDetails = async () => {
    try {
      // await auth0.webAuth.clearSession();
      await clearTokens();
      await this.clearBlueShiftUser();
      await this.saveFirstAppRun();
      this.setState({
        isUserLoggedIn: false,
        profilePicture: null,
        firstName: '',
        lastName: '',
        tokenInfo: null,
        isPersistedDataLoaded: true,
        isUserNameRequired: false,
        isVip: false,
        tickets: 0,
        tokens: 0,
        gamesWon: 0,
        tokenBonus: 0,
        ticketBonus: 0,
        freeToken: 0,
        playerId: '',
        isVipModalVisible: false,
        isIncentiviseValues: {},
        vipPoints: 0,
        vipLevel: null
      });
      await this.createAnonymousUser();
    } catch (error) {
      // Fail silently
    }
  };

  decodeCredentials = credentials => credentials && credentials.idToken && jwtDecode(credentials.idToken);

  setIsUserNameRequired = isUserNameRequired => {
    this.setState({ isUserNameRequired });
  };

  setIsUserLoggedIn = async credentials => {
    const decodedCredentials = this.decodeCredentials(credentials);
    if (decodedCredentials) {
      const userName = decodedCredentials[`${Config.AUTH0_FIELD_URL}username`];
      // eslint-disable-next-line camelcase
      const { picture, family_name, given_name } = decodedCredentials;
      AFLogCustomEvent(ANALYTICS_APPSFLYER_PREDEFINED_EVENTS.LOGIN, {});
      this.setState({
        profilePicture: picture,
        firstName: given_name,
        lastName: family_name,
        isPersistedDataLoaded: true,
        tokenInfo: credentials,
        isUserLoggedIn: true,
        userName
      });
    }
  };

  saveDailyBonusToDevice = async payload => {
    if (payload.dailyReward) {
      // eslint-disable-next-line no-param-reassign
      payload.dailyReward.claimableTokens = payload.claimableTokens
      await AsyncStorage.setItem(LOCAL_STORAGE_NAME.DAILY_BONUS, JSON.stringify(payload));
    } else {
      // item if its unclaimable
      const retreivedailyBonus = await AsyncStorage.getItem(LOCAL_STORAGE_NAME.DAILY_BONUS);
      if (retreivedailyBonus !== null) {
        await AsyncStorage.removeItem(LOCAL_STORAGE_NAME.DAILY_BONUS);
      }
    }
  };

  saveNewAchievementsToDevice = async achievements => {
    let achievementsToStore = [];
    let existingAchievement = await AsyncStorage.getItem(LOCAL_STORAGE_NAME.ACHIEVEMENTS);
    existingAchievement = JSON.parse(existingAchievement);

    if (existingAchievement && existingAchievement.length > 0) {
      achievementsToStore = existingAchievement.concat(achievements);
    } else {
      achievementsToStore = achievements;
    }
    if (achievementsToStore.length > 0)
      await AsyncStorage.setItem(LOCAL_STORAGE_NAME.ACHIEVEMENTS, JSON.stringify(achievementsToStore));
  };

  trackAchievements = (newAchievements, vipPoints) => {
    const totalNumberOfPointsEarned = newAchievements.reduce((accumulator, achievement) => {
      const { achievementDetails } = achievement;
      const achievementPoints = achievementDetails?.rewardPoints || 0;
      return accumulator + achievementPoints;
    }, 0);

    let pointsToTrack = vipPoints - totalNumberOfPointsEarned;

    newAchievements.map(achievement => {
      const { achievementDetails } = achievement;
      const pointsEarned = achievementDetails?.rewardPoints || 0;
      pointsToTrack += pointsEarned;
      logEvent(ANALYTICS_EVENTS.ACHIEVEMENT_COMPLETED, {
        [ANALYTICS_PROPERTIES.ACHIEVEMENT_NAME]: achievement.achievementName
      });
      AFLogCustomEvent(ANALYTICS_APPSFLYER_EVENTS.LEVEL_ACHIVED, {
        [ANALYTICS_APPSFLYER_EVENTS_PARAMETER.ACHIVEMENT_LEVEL.AF_LEVEL]: achievement.achievementName
      });
      setUserProperties({
        [ANALYTICS_PROPERTIES.POINTS_COUNT]: pointsToTrack
      });
      return null;
    });
  };


  fetchDealOfTheDay = async () => {
    try {
      const response = await api.getCheckDealOfTheDay();
      if (response.status === 200 && response.data) {
        if (response.data === API_RESPONSE_ENUMS.NOT_FOUND) {
          this.removeDealOfTheDayUIDAndDealOfTheDay();
        }
        else {
          this.saveDealOfTheDayDevice(response.data);
        }
      }

    } catch (error) {

      // fail silently
    }
  };


  removePurchasePrompt = async () => {
    await AsyncStorage.removeItem(LOCAL_STORAGE_NAME.PURCHASE_PROMPT);
  }

  savePurchasePrompt = async payload => {
    if (payload.showPopup) {
      await AsyncStorage.setItem(LOCAL_STORAGE_NAME.PURCHASE_PROMPT, JSON.stringify(payload))
    }
    else {
      this.removePurchasePrompt()
    }
  };


  fetchPurchasePrompt = async () => {
    try {
      const response = await api.getPurchasePrompt();
      if (response.status === 200 && response.data) {
        await this.savePurchasePrompt(response.data)
      }
    }
    catch (error) {
      // fail silently
    }
  };

  saveDealOfTheDayDevice = async payload => {
    if (payload) {
      await AsyncStorage.setItem(LOCAL_STORAGE_NAME.DEAL_OF_THE_DAY, JSON.stringify(payload));
    }
  };

  fetchNewsFeed = async () => {

    try {
      const result = await api.CheckPlayerNewsFeed();

      if (result.status === 200 && result.data) {

        const { newsFeedCount, newsFeedIds } = result.data;
        this.setState({ newsFeedCount, newsFeedIds });
      }
    } catch (error) {
      const { popupContextValue } = this.props;
      const { displayRequestError } = popupContextValue;
      displayRequestError(error.message);
    }
  }

  PostNewsFeed = async () => {
    const { newsFeedIds } = this.state;
    if (newsFeedIds.length) {
      try {
        const result = await api.PostPlayerNewsFeed(newsFeedIds);
        if (result.status === 200 && result.data) {
          await this.fetchNewsFeed();
        }
      } catch (error) {
        const { popupContextValue } = this.props;
        const { displayRequestError } = popupContextValue;
        displayRequestError(error.message);
      }
    }
  }

  fetchPoints = async () => {
    const { isUserLoggedIn } = this.state;

    // if (!isUserLoggedIn) {
    //   return;
    // }

    try {
      const result = await api.getPlayerPoints(isUserLoggedIn);
      if (result.status === 200 && result.data) {
        const { tickets, tokens, newAchievements, vipLevel, vipPoints } = result.data;
        if (newAchievements.length > 0) {
          this.trackAchievements(newAchievements, vipPoints);
          await this.saveNewAchievementsToDevice(newAchievements);
        }
        this.setState({ tickets, tokens, vipLevel, vipPoints });
      }
    } catch (error) {
      const { popupContextValue } = this.props;
      const { displayRequestError } = popupContextValue;
      displayRequestError(error.message);
    }
  };

  saveFreeTokensToDevice = async payload => {

    if (payload && payload.showPopup && payload.errorMessage.toLowerCase() === FREE_TOKEN_ENUMS.success) {
      await AsyncStorage.setItem(LOCAL_STORAGE_NAME.FREE_TOKEN_GIFT, JSON.stringify(payload));
    }

  };

  fetchFreeTokens = async () => {
    try {
      const response = await api.getFreeTokens();
      if (response.status === 200 && response.data) {
        await this.saveFreeTokensToDevice(response.data);
      }
    }
    catch (error) {
      await AsyncStorage.removeItem(LOCAL_STORAGE_NAME.FREE_TOKEN_GIFT);
      // fail silently
    }

  }

  savePiggyBankStatusToDevice = async payload => {

    if (payload) {
      await AsyncStorage.setItem(LOCAL_STORAGE_NAME.PIGGY_BANK_STATUS, JSON.stringify(payload));
    }

  };

  unlockPiggyBankStatusToDevice = async () => {
    await AsyncStorage.removeItem(LOCAL_STORAGE_NAME.PIGGY_BANK_STATUS);
  };


  fetchPiggyBankStatus = async () => {
    try {
      const response = await api.getPiggyBankStatus();
      if (response.status === 200 && response.data) {
        const { isPiggyBankFull } = response.data
        this.setState({ isPiggyBankFull })

        await this.savePiggyBankStatusToDevice(response.data);
      }
      else {
        await this.unlockPiggyBankStatusToDevice()
      }
    }
    catch (error) {
      // fail silently
    }

  }

  FreePlayPopUpScreen = async () => {
    try {
      const res = await api.checkGetFreePlays();
      this.setState({
        getFreePlay: res.data
      })
    }
    catch (error) {
      // fail silently
    }
  }

  checkFreePlay = async () => {
    try {
      const response = await api.getFreePlays();
      if (response.status === 200 && response.data) {
        const { freePlays, freePlayGrantId, showPopup, status } = response.data
        this.setState({
          FreePlayStatus: status,
          totalFreePlays: freePlays,
          freePlaysGrandId: freePlayGrantId,
          isFreePlayAvail: showPopup
        })
        if (freePlays > 0) {
          this.setFreePlayBannerNotificationVisible(showPopup)
          this.setFreePlayHeaderNotificationVisible(showPopup)
        }
      }
    }
    catch (error) {
      this.setState({
        freePlaysGrandId: null,
        isFreePlayAvail: false,
        totalFreePlays: 0,
        freePlayGrandId: null,
        freePlayStatus: false,

      })
      this.setFreePlayBannerNotificationVisible(false)
      this.setFreePlayHeaderNotificationVisible(false)
      // fail silently
    }

  }

  handleAwaitFreePlay = () => {
    this.setState({
      isFreePlayAvail: false
    })
  }

  setFreePlayBannerNotificationVisible = isFreePlayBannerNotificationVisible => {
    this.setState({
      isFreePlayBannerNotificationVisible
    });
  };

  setFreePlayHeaderNotificationVisible = isFreePlayHeaderIconNotificationVisible => {
    this.setState({
      isFreePlayHeaderIconNotificationVisible
    });
  };

  AutoPrompPiggyBankClose = async () => {
    this.setState({ autoPromptPiggyBank: false })
  }

  fetchDailyBonus = async () => {
    try {
      const response = await api.postUpdateDailyRewards({});
      if (response.status === 200 && response.data) {
        await this.saveDailyBonusToDevice(response.data);
      }
    }
    catch (error) {
      // fail silently
    }
  }

  // eslint-disable-next-line consistent-return
  fetchIncentiviseValues = async () => {
    try {
      const response = await api.getIncentiviseValues();
      if (response.status === 200 && response.data) {
        return response.data;
      }
    } catch (error) {
      // fail silently
    }
  };

  patchProfilePicture = async profileImageUrl => {
    try {
      const postData = {
        profileImageUrl
      };
      await api.postProfileInfo(postData);
    } catch (error) {
      // fail silently
    }
  };

  fetchProfileData = async (isBecomingVip = false) => {
    const { tokenInfo } = this.state;

    if (!tokenInfo) {
      return;
    }

    try {
      const result = await api.getProfileInfo();
      if (result.status === 200 && result.data) {
        const {
          address1,
          address2,
          city,
          email,
          firstName,
          isVip,
          lastName,
          phoneNumber,
          playerId,
          profileImageUrl,
          state,
          tickets,
          tokens,
          zipCode,
          vipLevel,
          vipPoints,
          gamesWon,
          country,
          dateOfBirth,
          countryId,
          userName,
          isDigitalGameAdBlock
        } = result.data;
        const shippingInformation = {
          address1,
          address2,
          city,
          email,
          firstName,
          lastName,
          phoneNumber,
          state,
          zipCode,
        };
        this.setState({
          tickets,
          tokens,
          gamesWon,
          isVip,
          email,
          playerId,
          shippingInformation,
          vipLevel,
          vipPoints,
          country,
          dateOfBirth,
          countryId,
          userName,
          isDigitalGameAdBlock
        });

        const { profilePicture } = this.state;
        if (profilePicture && !profileImageUrl) {
          this.patchProfilePicture(profilePicture);
        }
        if (isBecomingVip) {
          this.setIsVipModalVisible(true);
        }
        await this.createCustomerBlueShift()
      }
    } catch (error) {
      const { popupContextValue } = this.props;
      const { displayRequestError } = popupContextValue;
      displayRequestError(error.message);
    }
  };

  setShippingInformation = values => {
    this.setState({
      shippingInformation: values
    });
  };

  setIsVipModalVisible = isVipModalVisible => {
    this.setState({ isVipModalVisible });
  };

  setIsIncentiviseValues = isIncentiviseValues => {
    this.setState({ isIncentiviseValues });
  };

  setUserName = userName => {
    this.setState({ isUserLoggedIn: true, userName });
  };

  // setCurrentAppliedPromoCode = promoCode => {
  //   this.setState({ currentAppliedPromoCode: promoCode });
  // };

  setShouldRefreshTokenPack = shouldRefreshTokenPack => {
    this.setState({ shouldRefreshTokenPack });
  };

  setShouldRefreshGameRoom = shouldRefreshGameRoom => {
    this.setState({ shouldRefreshGameRoom });
  };

  setTokensAnimation = tokensAnimation => {
    this.setState({ tokensAnimation });
  };

  setTrackingPrompt = trackingPrompt => {
    this.setState({ trackingPrompt });
  }

  setIsQrOpen = async (bool) =>{
    this.setState({isQrOpen:bool})
  }
  fetchMachinesSocketBaseUrl = async () => {
    try {
      const result = await api.getMachinesSocketBaseUrl();
      if (result.data.success && result.data.data) {
        this.setState({ machinesSocketBaseUrl: result.data.data })
      }
    } catch (error) {
      const { popupContextValue } = this.props;
      const { displayRequestError } = popupContextValue;
      displayRequestError(error.message)
    }
  }

  render() {
    const { children } = this.props;
    const { isPersistedDataLoaded } = this.state;
    return (
      <UserContext.Provider
        value={{
          ...this.state,
          setIsUserLoggedIn: this.setIsUserLoggedIn,
          setUserName: this.setUserName,
          logout: this.logout,
          login: this.login,
          setShippingInformation: this.setShippingInformation,
          setIsShippingSaveMoodEnabled: this.setIsShippingSaveMoodEnabled,
          fetchPoints: this.fetchPoints,
          fetchProfileData: this.fetchProfileData,
          fetchDailyBonus: this.fetchDailyBonus,
          fetchDealOfTheDay: this.fetchDealOfTheDay,
          fetchPurchasePrompt: this.fetchPurchasePrompt,
          fetchFreeTokens: this.fetchFreeTokens,
          fetchPiggyBankStatus: this.fetchPiggyBankStatus,
          setIsVipModalVisible: this.setIsVipModalVisible,
          setGeoRestrictedStatusCode: this.setGeoRestrictedStatusCode,
          setIsUserNameRequired: this.setIsUserNameRequired,
          // setCurrentAppliedPromoCode: this.setCurrentAppliedPromoCode,
          setShouldRefreshTokenPack: this.setShouldRefreshTokenPack,
          validateIAPReceipt: this.validateIAPReceipt,
          fetchIncentiviseValues: this.fetchIncentiviseValues,
          setIsIncentiviseValues: this.setIsIncentiviseValues,
          setShouldRefreshGameRoom: this.setShouldRefreshGameRoom,
          setTokensAnimation: this.setTokensAnimation,
          fetchNewsFeed: this.fetchNewsFeed,
          PostNewsFeed: this.PostNewsFeed,
          isRestorePurchases: this.isRestorePurchases,
          AutoPrompPiggyBankClose: this.AutoPrompPiggyBankClose,
          getBonusScreenData: this.getBonusScreenData,
          setTrackingPrompt: this.setTrackingPrompt,
          checkFreePlay: this.checkFreePlay,
          FreePlayPopUpScreen: this.FreePlayPopUpScreen,
          setFreePlayBannerNotificationVisible: this.setFreePlayBannerNotificationVisible,
          setFreePlayHeaderNotificationVisible: this.setFreePlayHeaderNotificationVisible,
          handleAwaitFreePlay: this.handleAwaitFreePlay,
          trackWebpay: this.trackWebpay,
          fetchMachinesSocketBaseUrl: this.fetchMachinesSocketBaseUrl,
          setIsQrOpen:this.setIsQrOpen,
          removeAccountDetails: this.removeAccountDetails,
          setLiveArcade: this.setLiveArcade,
        }}
      >
        {isPersistedDataLoaded ? children : null}
      </UserContext.Provider>
    );
  }
}

UserProvider.propTypes = {
  children: PropTypes.node,
  popupContextValue: PropTypes.shape({
    displayRequestError: PropTypes.func.isRequired
  }).isRequired
};

UserProvider.defaultProps = {
  children: null
};

export const withUser = Wrapped => props => (
  <UserContext.Consumer>{value => <Wrapped {...props} contextValue={value} />}</UserContext.Consumer>
);

export default withPopup(UserProvider);
