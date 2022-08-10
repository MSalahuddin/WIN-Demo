/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-nested-ternary */
import React, { useContext, useState, useEffect } from 'react';
import styled from 'styled-components/native';
import PropTypes from 'prop-types';
import { Formik } from 'formik';
import { ScrollView, Platform } from 'react-native';
import { getLocales } from 'react-native-localize';
import api from '../../api';
import InputFormBox from './InputFormBox';
import ShippingFormBox from './ShippingFormBox';
import ShippingSubmitButton from './ShippingSubmitButton';
import BottomPicker from '../common/BottomPicker';
import DropdownButton from '../common/DropdownButton';
import ConditionalRenderer from '../common/ConditionalRenderer';
import Text, { SIZE, FONT_FAMILY } from '../common/Text';
import { PopupContext } from '../../context/Popup.context';
import { scaleHeight, getWindowWidth, scaleWidth } from '../../platformUtils';
import { shippingStrings } from '../../stringConstants';
import { UserContext } from '../../context/User.context';
import { shippingFormSchema } from '../../utils/validations';
import { color } from '../../styles';
import { 
  ANALYTICS_EVENTS, 
  ANALYTICS_PROPERTIES, 
  COUNTRIES_ISO, 
  ANALYTICS_APPSFLYER_EVENTS_PARAMETER,
  ANALYTICS_APPSFLYER_EVENTS } from '../../constants';
import { SOUNDS } from '../../soundUtils';
import { logEvent, setUserProperties, increaseUserProperty } from '../../amplitudeUtils';
import { BackgroundMusicContext } from '../../context/BackgroundMusic.context';
import Toggle from '../common/Toggle';
import { AFLogCustomEvent } from "../../appFlyer.utils";


const InputBoxWrapper = styled(InputFormBox)`
  margin-bottom: ${({ marginBottom }) => (marginBottom ? scaleHeight(marginBottom) : 0)};
  `;

const Row = styled.View`
  flex-direction: row;
  justify-content: space-between;
`;

const SplitRow = styled.View`
  width: 48%;
`;

const ShippingFormBoxWrapper = styled(ShippingFormBox)`
  margin-top: ${scaleHeight(16)};
`;

const PickerWrapper = styled.View`
  background-color: ${color.white};
  bottom: 0;
  flex-direction: column;
  height: ${scaleHeight(150)};
  justify-content: center;
  position: absolute;
  width: ${getWindowWidth()};
`;

const StateBoxContainer = styled.View`
  width: 100%; 
`;

const DropdownButtonWrapper = styled(DropdownButton)`
  border-color: ${({ borderColor }) => borderColor};
  background-color: ${color.white}
  border-radius: ${scaleHeight(5)};
  border-width: ${({ borderWidth }) => borderWidth};
  height: ${Platform.OS === 'android' ? scaleHeight(50) : scaleHeight(35)};
  margin-vertical: ${scaleHeight(4)};
  padding-left: ${scaleWidth(8)};
  padding-right: ${scaleWidth(5)};
  padding-bottom: ${scaleWidth(2)};
`;

// const KeyboardAvoidingViewWrapper = styled.KeyboardAvoidingView`
//   flex: 1;
//   margin-bottom: ${({ isPickerVisible }) => (isPickerVisible ? scaleWidth(150) : 0)};
// `;

const SaveDataContainer = styled.View`
flex-direction: row;
align-items: center;
margin-right: ${scaleHeight(48)};
`;

const TextWrapper = styled(Text)`
  margin-top: ${scaleHeight(-25)};
  margin-left: ${scaleHeight(35)};

`;

const ShippingForm = ({
  setIsShippingSuccessful,
  setIsNotSupportedStatePopUpAvailable,
  playerPrizeId, prize, pickerVisible
}) => {
  const [disabled, setDisabled] = useState(false)
  const {
    setShippingInformation,
    shippingInformation,
    country,
    countryId
  } = useContext(UserContext);
  const { playSoundEffect } = useContext(BackgroundMusicContext);
  const [isPickerVisible, setPickerVisible] = useState(false);
  const [stateOptions, setStateOptions] = useState(null);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [isDropdownTouched, setIsDropdownTouched] = useState(false);
  const [isSaveMoodEnabled, setIsSaveMoodEnabled] = useState(false);
  const [isZipCodePrepopulatd, setIsZipCodePrepopulated] = useState(false);
  const { displayRequestError } = useContext(PopupContext);
  const [fieldsNeedValidate, setFieldsNeedValidate] = useState([
    'address1',
    'city',
    'email',
    'firstName',
    'lastName',
    'phoneNumber',
    'state',
    'zipCode'
  ]);

  const isPostalCode = country === COUNTRIES_ISO.UK || country === COUNTRIES_ISO.CA || country === COUNTRIES_ISO.AU;
  const zipCodePlaceholder = country === COUNTRIES_ISO.UK ? shippingStrings.zipCodePlaceholderUK : country === COUNTRIES_ISO.CA ? shippingStrings.zipCodePlaceholderCA : country === COUNTRIES_ISO.AU ? shippingStrings.zipCodePlaceholderAU : shippingStrings.zipCodePlaceholder

  const verifyExistingShippingInformation = () => {
    let validateFields = fieldsNeedValidate;
    Object.keys(shippingInformation).map(field => {
      // address2 is not required
      if (field !== 'address2' && shippingInformation[field] !== null) {
        validateFields = validateFields.filter(item => {
          return item !== field;
        });
      }
      // set state dropdown index
      if (field === 'state' && shippingInformation[field] !== null && stateOptions !== null) {
        const stateIndex = stateOptions.findIndex(stateOption => shippingInformation.state === stateOption.value);
        setSelectedIndex(stateIndex > 0 ? stateIndex : 0);
        setIsZipCodePrepopulated(true);
      }
      return null;
    });
    setFieldsNeedValidate(validateFields);

  };

  const formattedData = (data) => {
    // const formattedData = []
    // // eslint-disable-next-line array-callback-return
    // arr.map(val => {
    //   // eslint-disable-next-line no-unused-expressions
    //   val.stateFullName !== null && val.state !== null 
    //     && formattedData.push({
    //       label: val.stateFullName,
    //       value: val.state, 
    //       stateId: val.stateId,
    //       supported: val.allowed
    //     })
    // })
    const formattedStateData = data.map(x => ({ label: x.name, value: x.iso, stateId: x.stateId }));
    setStateOptions(formattedStateData)
  }

  const getStates = async () => {
    try {
      const res = await api.getStates(countryId);
      if (res.status === 200 && res.data) {
        formattedData(res.data)
      }
    } catch (error) {
      displayRequestError(error.message);
    }
  };

  useEffect(() => {
    getStates();
  }, []);

  useEffect(() => {
    verifyExistingShippingInformation();
  }, [stateOptions]);


  const trackShippingRequest = values => {
    const { prizeId, name, value, categoryName } = prize;
    const { address1, address2, city, state, zipCode } = values;
    const address = `${address1} ${address2}`;
    const shippingAddress = `${address} ${city} ${state} ${zipCode}`;
    const locales = getLocales();
    let countryCode = null;
    if (locales && locales.length > 0) {
      const firstLocale = locales[0];
      countryCode = firstLocale.countryCode;
    }
    logEvent(ANALYTICS_EVENTS.SHIPPING_REQUEST, {
      [ANALYTICS_PROPERTIES.PRIZE_ID]: prizeId,
      [ANALYTICS_PROPERTIES.PRIZE_NAME]: name,
      [ANALYTICS_PROPERTIES.SHIPPING_ADDRESS]: shippingAddress,
      [ANALYTICS_PROPERTIES.PRIZE_VALUE]: value,
    });
    setUserProperties({
      [ANALYTICS_PROPERTIES.LAST_USED_SHIPPING_ADDRESS]: address,
      [ANALYTICS_PROPERTIES.LAST_USED_PLAYER_CITY]: city,
      [ANALYTICS_PROPERTIES.LAST_USED_PLAYER_STATE]: state,
      [ANALYTICS_PROPERTIES.LAST_USED_PLAYER_COUNTRY]: countryCode
    });
    AFLogCustomEvent(ANALYTICS_APPSFLYER_EVENTS.SHIPPING_REQUEST, {
      [ANALYTICS_APPSFLYER_EVENTS_PARAMETER.SHIPPING.PRIZE_ID]: prizeId,
      [ANALYTICS_APPSFLYER_EVENTS_PARAMETER.SHIPPING.PRIZE_NAME]: name,
      [ANALYTICS_APPSFLYER_EVENTS_PARAMETER.SHIPPING.PRIZE_VALUE]: value,
      [ANALYTICS_APPSFLYER_EVENTS_PARAMETER.SHIPPING.PRIZE_CATEGORY]: categoryName,
    });
    increaseUserProperty(ANALYTICS_PROPERTIES.SHIPPED_PRIZES);
  };
  const shipPrize = async values => {
    try {
      const { stateId } = stateOptions[selectedIndex]
      const body = { ...values, countryId, country, stateId }
      // const res = await api.postShipPrize(playerPrizeId, body);
      const res = await api.postShipPrize(playerPrizeId, body, isSaveMoodEnabled)
      if (res.status === 200) {
        trackShippingRequest(values);
        playSoundEffect(SOUNDS.POSITIVE_POPUP);
        setIsShippingSuccessful(true);
        setShippingInformation(values);
        setDisabled(false)
      }
    } catch (error) {
      playSoundEffect(SOUNDS.NEGATIVE_POPUP);
      if (error.response) {
        setIsNotSupportedStatePopUpAvailable(true);
      } else {
        displayRequestError(error.message);
      }
      setDisabled(false)
    }
  };

  const verifyGeoRestriction = async values => {
    let message = null;
    try {
      const res = await api.postVerifyGeoRestriction(playerPrizeId, values);
      if (res.status === 200) {
        // message = res.data;
      }
    } catch (error) {
      if (error.response) {
        message = error.response.data;
      }
      message = error.message;
    }
    return message;
  };

  const onSubmit = async (values, { resetForm }) => {
    setDisabled(true)
    if (!isSaveMoodEnabled) {
      // await resetForm({ values: '' })
    }
    if (stateOptions === null) {
      displayRequestError('States are not available');
    } else {
      const verifyGeoRestrictionMessage = await verifyGeoRestriction(values);
      if (verifyGeoRestrictionMessage) {
        displayRequestError(verifyGeoRestrictionMessage, () => setTimeout(() => shipPrize(values), 1000));
      } else {
        setTimeout(() => shipPrize(values), 1000)
      }
    }
  };

  const handlePickerSelection = index => {
    setSelectedIndex(index);
    setPickerVisible(false);
    pickerVisible(false)
  };

  return (
    <Formik
      initialValues={{
        address1: shippingInformation.address1 ? shippingInformation.address1 : '' ,
        address2: shippingInformation.address2 ? shippingInformation.address2 : '',
        city: shippingInformation.city ? shippingInformation.city : '',
        zipCode: shippingInformation.zipCode ? shippingInformation.zipCode : '',
        state: shippingInformation.state ? shippingInformation.state : '',
        firstName: shippingInformation.firstName ? shippingInformation.firstName : '',
        lastName: shippingInformation.lastName ? shippingInformation.lastName : '',
        email: shippingInformation.email ?  shippingInformation.email : '',
        phoneNumber: shippingInformation.phoneNumber ? shippingInformation.phoneNumber : '',
        country : country ? country : ''
      }}
      onSubmit={onSubmit}
      validateOnChange
      validateOnBlur
      validationSchema={shippingFormSchema}
      enableReinitialize
    >
      {({ handleChange, handleBlur, handleSubmit, errors, values, touched, setFieldValue }) => (
        <>
          {/* <KeyboardAvoidingViewWrapper behavior="position" enabled isPickerVisible={isPickerVisible}> */}
          <ScrollView>
            <ShippingFormBox title={shippingStrings.shippingAddress}>
              <InputBoxWrapper
                title={shippingStrings.streetAddress}
                onChangeText={handleChange('address1')}
                onBlur={handleBlur('address1')}
                value={values.address1}
                error={errors.address1}
                placeholder={shippingStrings.streetAddressPlaceholder}
                marginBottom={16}
              />
              <InputBoxWrapper
                title={shippingStrings.streetAddress2}
                onChangeText={handleChange('address2')}
                onBlur={handleBlur('address2')}
                value={values.address2}
                isRequired={false}
                placeholder={shippingStrings.streetAddress2Placeholder}
                marginBottom={16}
              />

              <InputBoxWrapper
                title={shippingStrings.city}
                onChangeText={handleChange('city')}
                onBlur={handleBlur('city')}
                value={values.city}
                error={errors.city}
                placeholder={shippingStrings.cityPlaceholder}
                marginBottom={16}
              />

              <Row>
                <SplitRow>
                  <InputBoxWrapper
                    title={isPostalCode ? shippingStrings.postalCode : shippingStrings.zipCode}
                    onChangeText={handleChange('zipCode')}
                    onBlur={handleBlur('zipCode')}
                    onEndEditing={() => {
                      setFieldValue('zipCode', values?.zipCode?.toUpperCase())
                    }}
                    value={values.zipCode}
                    error={errors.zipCode}
                    placeholder={zipCodePlaceholder}
                    marginBottom={16}
                    keyboardType={country === COUNTRIES_ISO.CA ? "default" : "numeric"}
                  />
                </SplitRow>
                <SplitRow>
                  {stateOptions &&
                    <StateBoxContainer>
                      <Text fontFamily={FONT_FAMILY.REGULAR}
                        size={SIZE.XSMALL}
                        color={color.white}
                      >
                        {COUNTRIES_ISO.UK === country ? shippingStrings.countries : shippingStrings.state}
                      </Text>

                      <DropdownButtonWrapper
                        borderColor={!isDropdownTouched ? color.silverWhite : color.greenValid}
                        borderWidth={!isDropdownTouched ? 1 : 2}
                        fontColor={
                          !isDropdownTouched && !isZipCodePrepopulatd ? color.grayPlaceholder : color.lightBlack
                        }
                        fontFamily={
                          !isDropdownTouched && !isZipCodePrepopulatd ? FONT_FAMILY.REGULAR : FONT_FAMILY.SEMI_BOLD
                        }
                        label={
                          !isDropdownTouched && !isZipCodePrepopulatd ? COUNTRIES_ISO.UK === country ?
                            shippingStrings.countriesPlaceholder : shippingStrings.statePlaceholder
                            : (stateOptions[selectedIndex].label && stateOptions[selectedIndex].label?.length < 13) ? stateOptions[selectedIndex].label : `${stateOptions[selectedIndex].label?.split('')?.slice(0,13)?.join('')}...`
                        }
                        onPress={() => {
                          setPickerVisible(true);
                          pickerVisible(true)

                        }}
                      />
                    </StateBoxContainer>
                  }
                </SplitRow>
              </Row>
              <SaveDataContainer>
                <TextWrapper color={color.white} size={SIZE.XSMALL}>
                  {shippingStrings.saveAddress}
                </TextWrapper>
                <Toggle
                  onToggle={() => setIsSaveMoodEnabled(!isSaveMoodEnabled)}
                  enabled={isSaveMoodEnabled}
                />
              </SaveDataContainer>
            </ShippingFormBox>
            <ShippingFormBoxWrapper title={shippingStrings.contactInformation}>
              <Row>
                <SplitRow>
                  <InputBoxWrapper
                    title={shippingStrings.firstName}
                    onChangeText={handleChange('firstName')}
                    onBlur={handleBlur('firstName')}
                    value={values.firstName}
                    error={errors.firstName}
                    placeholder={shippingStrings.firstNamePlaceholder}
                    marginBottom={16}
                  />
                </SplitRow>
                <SplitRow>
                  <InputBoxWrapper
                    title={shippingStrings.lastName}
                    onChangeText={handleChange('lastName')}
                    onBlur={handleBlur('lastName')}
                    value={values.lastName}
                    error={errors.lastName}
                    placeholder={shippingStrings.lastNamePlaceholder}
                    marginBottom={16}
                  />
                </SplitRow>
              </Row>
              <InputBoxWrapper
                title={shippingStrings.email}
                onChangeText={handleChange('email')}
                onBlur={handleBlur('email')}
                value={values.email}
                error={errors.email}
                placeholder={shippingStrings.emailPlaceholder}
                marginBottom={16}
                keyboardType="email-address"
              />
              <InputBoxWrapper
                title={shippingStrings.phone}
                onChangeText={handleChange('phoneNumber')}
                onBlur={handleBlur('phoneNumber')}
                value={values.phoneNumber}
                error={errors.phoneNumber}
                placeholder={country == COUNTRIES_ISO.UK ? shippingStrings.phoneUKPlaceholder : shippingStrings.phonePlaceholder}
                marginBottom={16}
                keyboardType="phone-pad"
              />
            </ShippingFormBoxWrapper>
            <ShippingSubmitButton
              disabledButton={disabled}
              fieldsNeedValidate={fieldsNeedValidate}
              onPress={handleSubmit}
              error={errors}
              touched={touched}
            />
          </ScrollView>
          {/* </KeyboardAvoidingViewWrapper> */}
          {stateOptions &&
            <ConditionalRenderer enabled={isPickerVisible} >
              <PickerWrapper>
                <BottomPicker
                  options={stateOptions}
                  selectedValue={stateOptions[selectedIndex].value}
                  onValueChange={(value, index) => {
                    // if (!stateOptions[index].supported) {
                    //   playSoundEffect(SOUNDS.NEGATIVE_POPUP);
                    //   setIsNotSupportedStatePopUpAvailable(true);
                    // } else {
                    setFieldValue('state', value);
                    setIsDropdownTouched(true);
                    handlePickerSelection(index);
                    // }
                  }}
                />
              </PickerWrapper>
            </ConditionalRenderer>}
        </>
      )}
    </Formik>
  );
};

ShippingForm.propTypes = {
  playerPrizeId: PropTypes.number.isRequired,
  setIsNotSupportedStatePopUpAvailable: PropTypes.func.isRequired,
  setIsShippingSuccessful: PropTypes.func.isRequired,
  prize: PropTypes.shape({
    name: PropTypes.string.isRequired,
    prizeId: PropTypes.number.isRequired,
    value: PropTypes.number.isRequired
  }).isRequired,
  pickerVisible: PropTypes.func.isRequired
};

export default ShippingForm;
