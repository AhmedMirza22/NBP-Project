//import liraries
import React, {useState, useRef, useEffect} from 'react';
import {Linking, ScrollView} from 'react-native';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  PermissionsAndroid,
  StyleSheet,
  Platform,
  KeyboardAvoidingView,
} from 'react-native';
import CustomText from '../../../Components/CustomText/CustomText';
import CustomTextField from '../../../Components/CustomTextField/CustomTextField';
import SubHeader from '../../../Components/GlobalHeader/SubHeader/SubHeader';
import {logs} from '../../../Config/Config';
import CustomBtn from '../../../Components/Custom_btn/Custom_btn';
import {
  globalStyling,
  hp,
  validateOnlyAlphaNumericSpace,
  validateonlyAlphaNumeric,
  wp,
} from '../../../Constant';
import analytics from '@react-native-firebase/analytics';

import {check_email, maskedAccount} from '../../../Helpers/Helper';
import {Colors} from '../../../Theme';
import {useSelector, useDispatch} from 'react-redux';
import {
  setAppAlert,
  setCurrentFlow,
  setUserObject,
} from '../../../Redux/Action/Action';
import {Message} from '../../../Constant/Messages';
import moment from 'moment';
import store from '../../../Redux/Store/Store';
import {setLoader} from '../../../Redux/Action/Action';
import Contacts from 'react-native-contacts';
import {isRtlState} from '../../../Config/Language/LanguagesArray';
import {useFocusEffect} from '@react-navigation/native';
// create a component
const BenefAddition = (props) => {
  useEffect(() => {
    async function analyticsLog() {
      await analytics().logEvent('BenefAdditionScreen');
    }
    analyticsLog();
  }, []);

  const ref1 = useRef();
  const ref2 = useRef();
  const ref3 = useRef();
  const dispatch = useDispatch();
  const [alias, set_alias] = useState('');
  const [phone, set_phone] = useState('');
  const [email, set_email] = useState('');

  logs.log('Inside benef Screen ==========>', props?.route?.params?.parmas);
  logs.log('Inside benef Screen >>>>>>>>>>>', props?.route?.params);

  let routedObj =
    props?.route?.params?.parmas?.fromScreen == 'raastAlias' ||
    props?.route?.params?.parmas?.fromScreen == 'raastIBAN'
      ? props?.route?.params
      : props?.route?.params?.data;
  logs.debug('====>', routedObj?.parmas?.receiveriban);
  const userObject = useSelector((state) => state?.reducers?.userObject);
  const phoneNumber = props?.route?.params?.phoneNumber;
  useEffect(() => {
    if (phoneNumber) {
      set_phone(phoneNumber);
    }
  }, [phoneNumber]);
  logs.log('object from redux=====>', userObject?.ftPayment);
  const checkPhone = () => {
    if (phone.length === 0) {
      return true;
    } else if (phone.length === 11) {
      return true;
    } else {
      dispatch(setAppAlert(Message.invalidPhoneNumber));
      return false;
    }
  };
  const GettingContacts = () => {
    dispatch(setLoader(true));
    Contacts.getAll()
      .then((contacts) => {
        let contactArr = contacts;
        let arrayContact = [];
        contacts.find((obj, index) => {
          let temp = obj?.phoneNumbers[0]?.number;
          if (temp) {
            if (temp.length >= 11) {
              let spaceLessNumber = temp.replace(/\s+/g, '');
              logs.log(`spaceLessNumber=======>${spaceLessNumber.length}`);
              if (
                spaceLessNumber.includes('+92') &&
                spaceLessNumber.length == 13
              ) {
                let elevenDigitNumber = `0${spaceLessNumber
                  .toString()
                  .substr(3, 12)}`;
                if (elevenDigitNumber.length == 11) {
                  logs.log(`before push with +92 ${elevenDigitNumber}`);
                  arrayContact.push({
                    id: index.toString(),
                    displayName:
                      Platform.OS === 'ios'
                        ? `${obj.givenName + ' ' + obj.familyName}`
                        : obj?.displayName,
                    number: elevenDigitNumber.toString(),
                  });
                }
                // }
              } else if (
                spaceLessNumber.length == 11 &&
                spaceLessNumber[0] == '0' &&
                spaceLessNumber[1] == '3'
              ) {
                logs.log(`before push just correct number ${spaceLessNumber}`);
                arrayContact.push({
                  id: index.toString(),
                  displayName:
                    Platform.OS === 'ios'
                      ? `${obj.givenName + ' ' + obj.familyName}`
                      : obj?.displayName,
                  number: spaceLessNumber.toString(),
                });
              }
            }
          }
        });
        logs.log(`${JSON.stringify(arrayContact)}`);
        dispatch(setLoader(false));
        console.log('props?.route?.params,987897', props?.route?.params);
        props.navigation.navigate('ContactList', {
          contact: arrayContact,
          AddingContact: true,
          params: props?.route?.params,
        });
      })
      .catch((error) => {
        dispatch(setCurrentFlow(''));
        dispatch(setLoader(false));
        setTimeout(() => {
          dispatch(
            setAppAlert(
              'NBP digital uses your contacts for showing  contact list on screen to choose number from your contacts for better experience.',
              'Permission',
              props.navigation,
              () => {
                Linking.openSettings();
              },
            ),
          );
        }, 500);
      });
  };

  const PermissionContact = async () => {
    logs.log('toki');
    if (Platform.OS == 'android') {
      try {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.READ_CONTACTS,
          {
            title: 'NBP DIGITAL App Contact Permission',
            message: 'NBP DIGITAL App needs access to your Contacts',
            buttonNeutral: 'Ask Me Later',
            buttonNegative: 'Cancel',
            buttonPositive: 'OK',
          },
        );
        if (granted === PermissionsAndroid.RESULTS.GRANTED) {
          GettingContacts();
        } else {
          logs.log(`not granted`);
        }
      } catch (error) {
        logs.log(error);
      }
    } else {
      GettingContacts();
    }
  };

  const checkmail = () => {
    if (check_email(email) || email == '') {
      return true;
    } else {
      dispatch(setAppAlert(Message.invalidEmail));
      return false;
    }
  };

  const validate = () => {
    logs.log('asdasdjasd');
    if (checkPhone()) {
      if (checkmail()) {
        return true;
      } else {
        return false;
      }
    } else {
      return false;
    }
  };

  const CompanyName = () => {
    return (
      <View>
        <CustomText style={{padding: wp(1), color: '#9ea3a6'}}>
          {routedObj?.subScreen
            ? routedObj?.subScreen === 'CreditCard'
              ? 'Card Holder'
              : 'Company Name'
            : 'Company Name'}
        </CustomText>

        <CustomText
          boldFont={true}
          style={{
            padding: wp(0.8),
            fontSize: wp(4.45),
            textAlign: isRtlState() ? 'left' : 'right',
          }}>
          {routedObj?.companyName}
        </CustomText>
      </View>
    );
  };
  const BillerName = () => {
    return (
      <View>
        <CustomText style={{padding: wp(1), color: '#9ea3a6'}}>
          {'Company Name'}
        </CustomText>

        <CustomText
          boldFont={true}
          style={{
            padding: wp(0.8),
            fontSize: wp(4.45),
            textAlign: isRtlState() ? 'left' : 'right',
          }}>
          {routedObj?.biller}
        </CustomText>
      </View>
    );
  };
  const RaastAlias = () => {
    return (
      <View>
        <CustomText style={{padding: wp(1), color: '#9ea3a6'}}>
          {'Name'}
        </CustomText>

        <CustomText
          boldFont={true}
          style={{padding: wp(0.8), fontSize: wp(4.45)}}>
          {props?.route?.params?.response?.data?.name}
        </CustomText>
      </View>
    );
  };
  const accountTitle = () => {
    return (
      <View>
        <CustomText style={{padding: wp(1), color: '#9ea3a6'}}>
          {props.route.params?.data?.type &&
          props.route.params?.data?.type === 'mobilePayment'
            ? 'Payment Type:'
            : 'Account Title'}
        </CustomText>

        <CustomText
          boldFont={true}
          style={{padding: wp(0.8), fontSize: wp(4.45)}}>
          {routedObj?.title
            ? routedObj?.title
            : props?.route?.params?.data?.parmas?.accountTitle}
        </CustomText>
      </View>
    );
  };

  const ConsumerNumber = () => {
    return (
      <View>
        <CustomText style={{padding: wp(1), color: '#9ea3a6'}}>
          {routedObj?.subScreen
            ? routedObj?.subScreen === 'CreditCard'
              ? 'Credit Card Number'
              : 'Consumer Number'
            : 'Consumer Number'}
        </CustomText>
        <CustomText
          boldFont={true}
          style={{
            padding: wp(0.8),
            fontSize: wp(4.45),
            textAlign: isRtlState() ? 'left' : 'right',
          }}>
          {routedObj?.consumerNumber}
        </CustomText>
      </View>
    );
  };
  const AliasNumber = () => {
    return (
      <View>
        <CustomText style={{padding: wp(1), color: '#9ea3a6'}}>
          {'Mobile Number'}
        </CustomText>
        <CustomText
          boldFont={true}
          style={{padding: wp(0.8), fontSize: wp(4.45)}}>
          {props?.route?.params?.parmas?.idValue}
        </CustomText>
      </View>
    );
  };
  const IBANNumber = () => {
    return (
      <View>
        <CustomText style={{padding: wp(1), color: '#9ea3a6'}}>
          {'IBAN'}
        </CustomText>
        <CustomText
          boldFont={true}
          style={{padding: wp(0.8), fontSize: wp(4.45)}}>
          {routedObj?.parmas?.receiveriban}
        </CustomText>
      </View>
    );
  };
  const RaastIBAN = () => {
    return (
      <View>
        <CustomText style={{padding: wp(1), color: '#9ea3a6'}}>
          {'Name'}
        </CustomText>

        <CustomText
          boldFont={true}
          style={{padding: wp(0.8), fontSize: wp(4.45)}}>
          {routedObj?.parmas?.acctitle}
        </CustomText>
      </View>
    );
  };
  const titleFetch = () => {
    return (
      <View>
        <CustomText style={{padding: wp(1), color: '#9ea3a6'}}>
          {props.route.params?.data?.type &&
          props.route.params?.data?.type === 'mobilePayment'
            ? 'Beneficiary Mobile Number:'
            : 'Account Number/ IBAN'}
        </CustomText>
        <CustomText
          boldFont={true}
          style={{padding: wp(0.8), fontSize: wp(4.45)}}>
          {maskedAccount(routedObj?.titleFetchAccount)}
        </CustomText>
      </View>
    );
  };
  return (
    <View
      style={[
        globalStyling.container,
        {backgroundColor: Colors.backgroundColor},
      ]}>
      <SubHeader
        title={'Add Beneficiary'}
        description={'Add Beneficiary in the list'}
        navigation={props.navigation}
      />
      <ScrollView contentContainerStyle={globalStyling.scrollContent}>
        <View style={{height: wp(4)}} />
        <View
          style={[
            styles.whiteContainer,
            {backgroundColor: Colors.subContainer},
          ]}>
          <View
            style={[
              styles.greyContainer,
              {backgroundColor: Colors.childContainer},
            ]}>
            {routedObj?.fromScreen === 'mobBill' ||
            routedObj?.fromScreen === 'otherBill'
              ? CompanyName()
              : routedObj?.fromScreen === 'utilBill'
              ? BillerName()
              : props?.route?.params?.parmas?.fromScreen === 'raastAlias'
              ? RaastAlias()
              : props?.route?.params?.parmas?.fromScreen === 'raastIBAN'
              ? RaastIBAN()
              : accountTitle()}
            {routedObj?.fromScreen === 'mobBill' ||
            routedObj?.fromScreen === 'otherBill' ||
            routedObj?.fromScreen === 'utilBill'
              ? ConsumerNumber()
              : props?.route?.params?.parmas?.fromScreen === 'raastAlias'
              ? AliasNumber()
              : props?.route?.params?.parmas?.fromScreen === 'raastIBAN'
              ? IBANNumber()
              : titleFetch()}
          </View>
        </View>
        <View style={styles.gap} />
        <CustomTextField
          ref={ref1}
          placeholder={'Short Name'}
          text_input={alias}
          onChangeText={(value) => {
            set_alias(validateOnlyAlphaNumericSpace(value));
          }}
          onSubmitEditing={() => {}}
          returnKeyType={'next'}
          maxLength={20}
          width={'90%'}
        />
        <View style={styles.gap} />
        <View
          style={{
            flexDirection: isRtlState() ? 'row' : 'row-reverse',
            alignSelf: 'center',
            justifyContent: 'space-between',
            width: wp(90),
            height: wp(20),
          }}>
          <CustomTextField
            ref={ref2}
            placeholder={'Phone (Optional) '}
            onSubmitEditing={() => {
              ref3.current.focus();
            }}
            returnKeyType={Platform.OS === 'ios' ? 'done' : 'next'}
            text_input={phone}
            onChangeText={(value) => {
              set_phone(String(value).replace(/[^0-9]/g, ''));
            }}
            maxLength={11}
            width={wp(75)}
            keyboardType="number-pad"
          />
          <View>
            <TouchableOpacity
              onPress={PermissionContact}
              style={{
                backgroundColor: Colors.textfieldBackgroundColor,
                justifyContent: 'center',
                width: wp(13),
                height: wp(13),
                borderWidth: 1,
                borderColor: Colors.borderColor,
                borderRadius: wp(1),
                alignSelf: 'center',
                marginLeft: wp(2),
                marginTop: wp(3.5),
              }}>
              <View style={{alignSelf: 'center'}}>
                <Image
                  // style={globalStyling.image}
                  style={{tintColor: Colors.textFieldCursor}}
                  resizeMode="stretch"
                  source={require('../../../Assets/RAAST_Icons/ContactList.png')}
                />
              </View>
            </TouchableOpacity>
            <CustomText
              style={{
                fontSize: wp(2.5),
                width: wp(74),
                marginTop: wp(1),
                textAlign: 'center',
                width: wp(14),
                marginLeft: wp(2),
              }}>
              {`Contact\nList`}
            </CustomText>
          </View>
        </View>
        <View style={styles.gap} />
        <View style={styles.gap} />
        <CustomTextField
          ref={ref3}
          placeholder={'Email (Optional)'}
          // Textfield_label={'Enter Debit/ATM Card Number'}
          onChangeText={(value) => {
            set_email(value);
          }}
          keyboardType="email-address"
          width={'90%'}
        />
        <View style={styles.gap} />
      </ScrollView>
      <KeyboardAvoidingView
        keyboardVerticalOffset={hp(7)}
        behavior={'padding'}
        style={globalStyling.buttonContainer}>
        <CustomBtn
          btn_txt={'Continue'}
          accessibilityLabel={'Continue'}
          onPress={() => {
            if (alias.length === 0 || alias.length < 3) {
              dispatch(setAppAlert(Message.validShortName));
            } else {
              if (validate()) {
                routedObj.shortname = alias;
                routedObj.phone = phone;
                routedObj.email = email;

                logs.debug(
                  '================>',
                  props?.route?.params?.fromScreen,
                );
                if (String(props?.route?.params?.fromScreen) == 'Ibft') {
                  dispatch(
                    setUserObject({
                      ftPayment: {
                        ...store.getState().reducers.userObject.ftPayment,
                        shortName: alias,
                        benefPhone: phone,
                        benefEmail: email,
                      },
                    }),
                  );
                  props?.navigation.navigate('InterBankFundTransferDetail', {
                    data: routedObj,
                  });
                } else if (String(props?.route?.params?.fromScreen) == 'ft') {
                  dispatch(
                    setUserObject({
                      ftPayment: {
                        ...store.getState().reducers.userObject.ftPayment,
                        shortName: alias,
                        benefPhone: phone,
                        benefEmail: email,
                      },
                    }),
                  );
                  props?.navigation.navigate('FundTransferResponse', {
                    data: routedObj,
                  });
                } else if (
                  String(props?.route?.params?.data?.fromScreen) == 'mobBill'
                ) {
                  routedObj.benefEmail = email;
                  routedObj.benefMobile = phone;
                  props?.navigation.navigate('MobileBillPaymentDetail', {
                    data: routedObj,
                  });
                } else if (
                  String(props?.route?.params?.data?.fromScreen) == 'otherBill'
                ) {
                  dispatch(
                    setUserObject({
                      otherPayment: {
                        ...store.getState().reducers.userObject.otherPayment,
                        shortName: alias,
                        benefPhone: phone,
                        benefMobile: phone,
                        benefEmail: email,
                      },
                    }),
                  );
                  props?.navigation.navigate('OtherPaymentBill', {
                    data: routedObj,
                  });
                } else if (
                  String(props?.route?.params?.data?.fromScreen) == 'utilBill'
                ) {
                  routedObj.benefEmail = email;
                  routedObj.benefMobile = phone;
                  //
                  logs.log('adajsdgajhsdghbn Confirm Detials', routedObj);
                  props?.navigation.navigate('ConfirmDetails', {
                    data: routedObj,
                  });
                } else if (
                  String(props?.route?.params?.parmas?.fromScreen) ===
                  'raastAlias'
                ) {
                  let parmas = props?.route?.params?.parmas;
                  parmas.shortname = alias;
                  parmas.phone = phone;
                  parmas.email = email;
                  let res1 = props?.route?.params?.response.data?.iban.slice(
                    8,
                    12,
                  );
                  let res2 = props?.route?.params?.response.data?.iban.slice(
                    14,
                    24,
                  );
                  let result = `${res1}${res2}`;
                  let body = {
                    fromAccount: parmas.account,
                    toAccount: result,
                    amount: parmas?.amount,
                    title: `${props?.route?.params?.response.data?.name.toUpperCase()} ${props?.route?.params?.response.data?.surname.toUpperCase()}`,
                    isDirectPayment: parmas.isbenef ? false : true,
                    token: props?.route?.params?.response.data?.token,
                    purposeOfPayment: parmas?.pay_pur_id,
                    purposeOfPaymentString: parmas?.pay_pur,
                    date: moment(new Date()).format('YYYY-MM-DD hh:mm:ss A'),
                  };
                  logs.log('Inside BenefAddition raastAlias check', body);
                  logs.log(
                    'Inside BenefAddition raastAlias check------',
                    props?.route?.params?.response,
                  );

                  if (
                    props?.route?.params?.response.data?.iban.includes('NBP')
                  ) {
                    logs.log('nbp hy ');
                    body.benefID = parmas.benefID;
                    body.isRaast = true;
                    body.benefAlias = parmas?.benefAlias;
                    dispatch(
                      setUserObject({
                        ftPayment: {
                          ...store.getState().reducers.userObject.ftPayment,
                          shortName: alias,
                          benefPhone: phone,
                          benefEmail: email,
                        },
                      }),
                    );
                    props.navigation.navigate('FundTransferResponse');
                  } else {
                    logs.log(
                      'nbp  nhi hy ',
                      parmas,
                      'props?.route?.params?.response',
                      props?.route?.params?.response,
                    );
                    props.navigation.navigate('RAASTInfoShow', {
                      screen: 'alias',
                      paramsAlias: props?.route?.params?.response,
                      param: parmas,
                    });
                  }
                } else if (
                  String(props?.route?.params?.parmas?.fromScreen) ===
                  'raastIBAN'
                ) {
                  let parmas = props?.route?.params?.parmas;
                  parmas.shortname = alias;
                  parmas.phone = phone;
                  parmas.email = email;
                  logs.log('Before going to RAAST IABN', routedObj?.shortname);
                  props?.navigation.navigate('RAASTInfoShow', {
                    shortName: routedObj?.shortname,
                    screen: 'iban',
                    param: props?.route?.params?.parmas,
                    paramsAlias: props?.route?.params?.response,
                  });
                } else {
                }
              }
            }
          }}
          btn_width={wp(90)}
          backgroundColor={Colors.primary_green}
        />
      </KeyboardAvoidingView>
    </View>
  );
};

// define your styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    // justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.backgroundColor,
  },
  gap: {
    height: wp(3),
  },
  whiteContainer: {
    alignSelf: 'center',
    justifyContent: 'flex-start',
    borderWidth: 1,
    borderColor: '#cfd1d3',
    borderRadius: 8,
    width: wp(90),
    backgroundColor: 'white',
    marginTop: wp(1),
    paddingVertical: wp(2.5),
  },
  greyContainer: {
    // height: wp(10),
    backgroundColor: Colors.greyInfoShow,
    width: wp(85),
    alignSelf: 'center',
    borderRadius: wp(1.5),
    padding: wp(4),
  },
});

//make this component available to the app
export default BenefAddition;
