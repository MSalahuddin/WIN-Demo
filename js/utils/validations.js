/* eslint-disable func-names */
/* eslint-disable no-unused-vars */
import * as Yup from 'yup';
import AsyncStorage from '@react-native-community/async-storage';
import api from '../api';
import { LOCAL_STORAGE_NAME, COUNTRIES_ISO, VALIDATIONS_MESSAGES_SHIPPING_FORM, VALIDATIONS_MESSAGES_MY_INFO_FORM } from '../constants';

// Regex
const USPostalCodeRegex = /(^\d{5}$)|(^\d{5}-\d{4}$)/
const UKPostalCodeRegex = /[A-Z]{1,2}[0-9][0-9A-Z]?\s?[0-9][A-Z]{2}/i
const AUPostalCodeRegex = /^\d{4}$/
const CAPostalCodeRegex = /^[ABCEGHJKLMNPRSTVXY]\d[ABCEGHJKLMNPRSTVWXYZ]( )?\d[ABCEGHJKLMNPRSTVWXYZ]\d$/i
const USPhoneNumbers = /^(\d{3}\s?\d{3}\s?\d{4})$/
const UKPhoneNumbers = /^((44\d{11})|\d{11,15})$/
const Alphabets = /^[A-Za-z ]+$/



Yup.addMethod(Yup.string, 'usernameAlreadyExists', function (errorMessage) {
  return this.test('test-username-already-exists', errorMessage, function (value) {

    if (value === undefined || value.trim().length === 0 || value === null || value.length > 13) {
      return new Promise(function (resolve) {
        AsyncStorage.removeItem(LOCAL_STORAGE_NAME.USER_NAME_SUGGESTIONS).
          then(() => {
            return resolve(false)
          }).
          catch((error) => {
            return resolve(false)
          })
      })
    }

    const username = value.
      charAt(0).
      toUpperCase() +
      value.
        slice(1).
        toLocaleLowerCase()

    return new Promise(function (resolve) {
      api.getValidateUsername(username).
        then((res) => {
          if (res.status === 200) {
            return resolve(true)
          }
          if (res.status === 201) {
            const { userNameSuggestions } = res.data
            return JSON.stringify(userNameSuggestions)
          }
          return resolve(false)
        }).
        then((data) => {
          return AsyncStorage.setItem(LOCAL_STORAGE_NAME.USER_NAME_SUGGESTIONS, data)
        }).
        then(() => {
          return resolve(false)
        }).
        catch((error) => {
          return resolve(false)
        });

    })
  });

});


Yup.addMethod(Yup.string, 'isValidZipCode', function (errorMessage) {
  return this.test("test-is-Valid-zip-code", errorMessage, function (value) {

    const { parent, createError, path } = this
    const { country } = parent

    if (!value) {
      return true
    }
    if (country === COUNTRIES_ISO.UK) {
      return UKPostalCodeRegex.test(value) || createError({ path, message: errorMessage })
    } else if (country === COUNTRIES_ISO.CA) {
      return CAPostalCodeRegex.test(value) || createError({ path, message: errorMessage })
    } else if (country === COUNTRIES_ISO.AU) {
      return AUPostalCodeRegex.test(value) || createError({ path, message: errorMessage })
    }
    return USPostalCodeRegex.test(value) || createError({ path, message: errorMessage })

  })
});

Yup.addMethod(Yup.string, 'isValidPhoneNumber', function (errorMessage) {
  return this.test("test-is-Valid-Phone-Number", errorMessage, async function (value) {

    const { parent, createError, path } = this
    const { country } = parent

    if (value) {
      const clearedValue = await value.replace(/\s/g, '');
      if (country === COUNTRIES_ISO.UK) {
        return UKPhoneNumbers.test(clearedValue) || createError({ path, message: errorMessage })
      }
      return USPhoneNumbers.test(clearedValue) || createError({ path, message: errorMessage })
    }
    return false

  })
});


Yup.addMethod(Yup.string, 'isValidZipCodeShippingSchema', function (errorMessage) {
  return this.test("test-is-Valid-zip-code-shipping-schema", errorMessage, function (value) {

    const { parent, createError, path } = this
    const { country } = parent

    if (value) {
      if (country === COUNTRIES_ISO.UK) {
        return UKPostalCodeRegex.test(value) || createError({ path, message: errorMessage })
      } else if (country === COUNTRIES_ISO.CA) {
        return CAPostalCodeRegex.test(value) || createError({ path, message: errorMessage })
      } else if (country === COUNTRIES_ISO.AU) {
        return AUPostalCodeRegex.test(value) || createError({ path, message: errorMessage })
      }
      return USPostalCodeRegex.test(value) || createError({ path, message: errorMessage })
    }
    return false

  })
});

const {
  ZIP_CODE_VALIDATION_MESSAGE,
  CITY_VALIDATION_MESSAGE,
  USERNAME_REQUIRED
} = VALIDATIONS_MESSAGES_MY_INFO_FORM


// eslint-disable-next-line import/prefer-default-export
export const MyInfoFormSchema = Yup.object().shape({
  userName: Yup.string().trim().required(USERNAME_REQUIRED).usernameAlreadyExists(),
  firstName: Yup.string().trim().nullable().notRequired(),
  lastName: Yup.string().trim().nullable().notRequired(),
  dateOfBirth: Yup.string().trim().nullable().notRequired(),
  country: Yup.string().trim().nullable().notRequired(),
  email: Yup.string().trim().nullable().notRequired(),
  address1: Yup.string().trim().nullable().notRequired(),
  city: Yup.string().trim().nullable().notRequired().matches(Alphabets, CITY_VALIDATION_MESSAGE),
  zipCode: Yup.string().trim().nullable().notRequired().isValidZipCode(ZIP_CODE_VALIDATION_MESSAGE),
  state: Yup.string().trim().nullable().notRequired()
});

const {
  FIRST_NAME_REQUIRED,
  LAST_NAME_REQUIRED,
  CITY_REQUIRED,
  ADDRESS1_REQUIRED,
  EMAIL_REQUIRED,
  ZIP_CODE_REQUIRED,
  STATE_REQUIRED,
  PHONE_NUMBER_REQUIRED,
  PHONE_NUMBER_VALIDATION_MESSAGE,
  EMAIL_VALIDATION_MESSAGE,
  ZIP_CODE_VALIDATION_MESSAGE_SHIPPING_FORM,
  CITY_VALIDATION_MESSAGE_SHIPPING_FORM
} = VALIDATIONS_MESSAGES_SHIPPING_FORM

export const shippingFormSchema = Yup.object().shape({
  country: Yup.string().trim().nullable().notRequired(),
  address1: Yup.string().trim().required(ADDRESS1_REQUIRED),
  city: Yup.string().trim().required(CITY_REQUIRED).matches(Alphabets, CITY_VALIDATION_MESSAGE_SHIPPING_FORM),
  zipCode: Yup.string().required(ZIP_CODE_REQUIRED).isValidZipCodeShippingSchema(ZIP_CODE_VALIDATION_MESSAGE_SHIPPING_FORM),
  state: Yup.string().trim().required(STATE_REQUIRED),
  firstName: Yup.string().trim().required(FIRST_NAME_REQUIRED),
  lastName: Yup.string().trim().required(LAST_NAME_REQUIRED),
  email: Yup.string().email(EMAIL_VALIDATION_MESSAGE).nullable().required(EMAIL_REQUIRED),
  phoneNumber: Yup.string().trim().required(PHONE_NUMBER_REQUIRED).isValidPhoneNumber(PHONE_NUMBER_VALIDATION_MESSAGE)
});

