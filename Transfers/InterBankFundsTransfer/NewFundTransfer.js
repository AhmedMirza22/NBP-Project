import React, {useEffect, useState, useRef, useLayoutEffect} from 'react';
import {
  View,
  ScrollView,
  Text,
  KeyboardAvoidingView,
  Dimensions,
  TouchableOpacity,
  PermissionsAndroid,
  Image,
  BackHandler,
  TouchableWithoutFeedback,
  Linking,
} from 'react-native';
import CustomText from '../../../Components/CustomText/CustomText';
import SubHeader from '../../../Components/GlobalHeader/SubHeader/SubHeader';
//import styles from './by_aliasstyle';
import TabNavigator from '../../../Components/TabNavigate/TabNavigate';
import CustomModal from '../../../Components/CustomModal/CustomModal';
import CustomTextField from '../../../Components/CustomTextField/CustomTextField';
import CustomTabButton from '../../../Components/CustomTabBar/CustomTabBar';
import {
  wp,
  globalStyling,
  validateonlyAlphaNumeric,
  hp,
} from '../../../Constant';
import analytics from '@react-native-firebase/analytics';
import CustomBtn from '../../../Components/Custom_btn/Custom_btn';
import I18n from '../../../Config/Language/LocalizeLanguageString';
import {useSelector, useDispatch} from 'react-redux';
import {Colors} from '../../../Theme';
import Entypo from 'react-native-vector-icons/Entypo';
import Contacts from 'react-native-contacts';
import {
  helpInforamtion,
  setLoader,
  setUserObject,
  serviceResponseCheck,
  catchError,
  updateSessionToken,
} from '../../../Redux/Action/Action';

import {RAAST_PURPOSE_OF_PAYMENT_LIST} from '../../purposeOfPayments';
// import CustomAlert from '../../../Components/Custom_Alert/CustomAlert';
import {setCurrentFlow, setAppAlert} from '../../../Redux/Action/Action';

import {logs} from '../../../Config/Config';
import {Platform} from 'react-native';
import {Keyboard} from 'react-native';
import InformationAlert from '../../../Components/InformationAlert/InformationAlert';
import InformationIcon from '../../../Components/InformationIcon/InformationIcon';
import CustomAlert from '../../../Components/Custom_Alert/CustomAlert';
import {getTokenCall, Service} from '../../../Config/Service';
import {useTheme} from '../../../Theme/ThemeManager';
import {isRtlState} from '../../../Config/Language/LanguagesArray';

const NewFundTransfer = (props) => {
  const {activeTheme} = useTheme();

  const [showImageAlert, changeImageAlertStatus] = useState(false);

  const memberid = tab_reason?.bic;

  const phoneNumber = props?.route?.params?.phoneNumber;
  useEffect(() => {
    if (phoneNumber) {
      change_card_name(phoneNumber);
    }
  }, [phoneNumber]);
  props.navigation.addListener('focus', () => {
    dispatch(setCurrentFlow('Payments'));
    async function analyticsLog() {
      await analytics().logEvent('NewFundTransferScreen');
    }
    analyticsLog();
  });
  useEffect(() => {
    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      () => {
        dispatch(setUserObject({aliasPhoneNumber: ''}));
        props.navigation.goBack();
        // dispatch(resendOtp(token, props.navigation));/
        return true;
      },
    );

    return () => backHandler.remove();
  }, []);
  let updatedPhoneNumber = props?.route?.params?.phoneNumber;
  let bank = props?.route?.params?.data?.bankName;
  logs.log(bank, 'bank i gya');
  const unsorted_reason = useSelector((state) => state.reducers.raastbank);

  useEffect(() => {
    props.navigation.addListener('focus', () => {
      dispatch(setCurrentFlow('Payment By RAAST ID'));
    });
  }, []);
  useEffect(() => {
    props.navigation.addListener('focus', () => {
      logs.log(`tab car n------ame is ${tab_name_card}`);
      logs.log(`userobject.aliadname is ${userObject.aliasPhoneNumber}`);
      change_purpose(product_type[1]);

      change_from_acc({
        account: accounts[0]?.account,
        iban: accounts[0]?.iban,
        accountType: accounts[0]?.accountType,
        currency: accounts[0]?.currency,
        accountTitle: accounts[0]?.accountTitle,
      });
    });
  }, [updatedPhoneNumber]);
  const [tab_name_card, change_card_name] = useState('');
  const [accountNumber, setAccountNumber] = useState('');

  const dispatch = useDispatch();
  const [tab_purpose, change_purpose] = useState({
    purpose: 'Select Purpose of Payment',
  });
  // const [tab_amount, change_amount] = useState('');
  const [tab_reason, change_reason] = useState({reason: 'MOBILE'});
  const [modal, change_modal_state] = useState(false);
  const [modal_type, change_modal_type] = useState('');
  const city = useSelector((state) => state?.reducers?.viewcitycode);
  const acc_info = useSelector(
    (state) => state.reducers.overViewData?.data?.accounts,
  );
  const userObject = useSelector((state) => state?.reducers?.userObject);
  const accounts = userObject?.pkAccounts;
  const [tab_from_acc, change_from_acc] = useState({
    // account: accounts[0]?.account,
    // iban: accounts[0]?.iban,
    // accountType: accounts[0]?.accountType,
    // currency: accounts[0]?.currency,
    // accountTitle: accounts[0]?.accountTitle,
  });
  const [isALIAS, setisALIAS] = useState(false);
  const [isRaastColor, setisALIASRaastColor] = useState(true);
  const [is1LinkColor, setisALIAS1LinkColor] = useState(false);
  const [accountModal, setAccountModal] = useState(false);
  const data = [
    {
      id: 0,
      text: 'Meezan Bank',
    },
    {
      id: 1,
      text: 'Mashriq Bank',
    },
    {
      id: 2,
      text: 'Faisal Bank',
    },
    {
      id: 3,
      text: 'Nation Bank of Pakistan',
    },
  ];
  const [selectBankType, setSelectBankType] = useState(null);

  const [tabSwitch, setTabSwitch] = useState(false);

  const [bankList, setBankList] = useState([]);

  const product_type = RAAST_PURPOSE_OF_PAYMENT_LIST;
  const reason = [{reason: 'MOBILE'}];
  const requestobj = {};
  const onSelectIbanPress = () => {
    change_card_name('');
    setAccountNumber('');
    setSelectedOption('RaastID');
    logs.log('State Setteled to RaastID of selected Option');
    setTabSwitch(false);
    setisALIAS(true);
  };
  const onSelectAccountPress = () => {
    change_card_name('');
    setAccountNumber('');
    setSelectedOption('IBAN');
    setTabSwitch(true);
    setisALIAS(false);
  };
  useEffect(() => {
    if (isALIAS == false) {
      logs.log('my komi', tab_name_card.substr(4, 4).toUpperCase());

      if (tab_name_card.length >= 8) {
        logs.log('my love', tab_name_card.substr(4, 4).toUpperCase());
        var foundBank = unsorted_reason.filter(
          (obj) => obj.prefix == tab_name_card.substr(4, 4).toUpperCase(),
        );
        if (foundBank.length == 1) {
          change_reason(foundBank[0]);
        } else if (foundBank.length == 0) {
          if (tab_name_card.substr(4, 4).toUpperCase() == 'NBPA') {
            logs.log('done1');
            change_reason({
              participantName: 'Beneficiary Bank',
            });
            Keyboard.dismiss();
            global.showToast.show(I18n['For NBP Transaction used FT'], 1000);
            // changeIBAN('');
            change_card_name('');
          } else {
            logs.log('done1');
            change_reason({
              participantName: 'Beneficiary Bank',
            });
            Keyboard.dismiss();
            global.showToast.show(I18n['IBAN incorrect'], 1000);
            // changeIBAN('');
            change_card_name('');
          }
        }
      } else if (tab_name_card.length < 8) {
        logs.log('done2');
        change_reason({
          participantName: 'Beneficiary Bank',
        });
      }
    } else if (isALIAS == false && selectedOption === 'Account Number') {
      logs.log('Account Number');
    }
  }, [tab_name_card]);

  const getBanksList = async () => {
    try {
      dispatch(setLoader(true));
      const response = await getTokenCall(Service.getbanklistfortf2);
      const responseData = response;
      if (response?.data?.responseCode === '00') {
        dispatch(setLoader(false));
        dispatch(updateSessionToken(response));
        change_modal_state(true);

        logs.log('getbanklistfortf2 Response------>', responseData?.data?.data);
        setBankList(responseData?.data?.data);
      } else {
        dispatch(serviceResponseCheck(response, props.navigation));
      }
    } catch (error) {
      logs.log('errors', error);
      dispatch(catchError(error));
    }
  };

  // use
  //Contact From list
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
        props.navigation.navigate('ContactList', {
          contact: arrayContact,
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
  const tabBar = () => {
    return (
      <CustomTabButton
        RightText={'Raast ID'}
        leftText={'IBAN/Account Number'}
        LeftSelectPress={() => onSelectAccountPress()}
        RightSelectPress={() => onSelectIbanPress()}
        RightfontSize={wp(3.5)}
        LeftfontSize={wp(3.5)}
      />
    );
  };
  const RadioButton = ({options, selectedOption, onSelect}) => {
    return (
      <View style={{flexDirection: 'row'}}>
        {options.map((option) => (
          <TouchableOpacity
            key={option}
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              marginRight: 20,
            }}
            onPress={() => onSelect(option)}>
            <View
              style={{
                height: 24,
                width: 24,
                borderRadius: 12,
                borderWidth: 2,
                borderColor:
                  option === selectedOption
                    ? Colors.primary_green
                    : Colors.grey,
                alignItems: 'center',
                justifyContent: 'center',
              }}>
              {option === selectedOption && (
                <View
                  style={{
                    height: 15,
                    width: 15,
                    borderRadius: 7.5,
                    backgroundColor: Colors.primary_green,
                  }}
                />
              )}
            </View>
            <CustomText
              style={{marginLeft: 15, fontWeight: 'bold', fontSize: wp(4)}}>
              {option}
            </CustomText>
          </TouchableOpacity>
        ))}
      </View>
    );
  };

  const [selectedOption, setSelectedOption] = useState(
    isRtlState() === true ? 'IBAN' : 'آئی بین',
  );

  const handleSelect = (option) => {
    logs.log('HandleSelect----', option);
    setSelectedOption(option);
  };
  const Button = () => {
    return isALIAS ? null : (
      <View style={{padding: wp(5), left: wp(2)}}>
        <RadioButton
          options={[
            isRtlState() === true ? 'IBAN' : 'آئی بین',
            isRtlState() === true ? 'Account Number' : 'اکاؤنٹ نمبر',
          ]}
          selectedOption={selectedOption}
          onSelect={handleSelect}
        />
      </View>
    );
  };

  const selectBank = () => {
    // Conditionally render TabNavigator based on the value of selectedOption
    logs.log('Select Bank Type', selectBankType);
    if (!isALIAS && selectedOption === 'Account Number') {
      return (
        <TabNavigator
          border={true}
          accessibilityLabel={'Bank'}
          text={
            selectBankType === null
              ? 'Select bank'
              : selectBankType?.participantName
          }
          tabHeading={'Bank'}
          navigation={props.navigation}
          width={'90%'}
          fontSize={wp(4.2)}
          textWidth={'100%'}
          arrowSize={wp(9)}
          multipleLines={2}
          onPress={(item) => {
            bankList.length === 0 ? getBanksList() : change_modal_state(true);
            logs.log('BankList State Length', bankList.length);
            logs.log('selectBankType State Length', selectBankType);
            logs.log('item--------', item);
          }}
        />
      );
    } else {
      return null;
    }
  };

  const onHandleMultiAcc = () => {
    setAccountModal(true);
  };
  function validate() {
    requestobj.idType = isALIAS ? 'MOBILE' : 'CNIC';
    requestobj.idValue = isALIAS ? tab_name_card : acc_info.cnic;
    if (isALIAS == false) {
      logs.log('is iiban', tab_reason?.bic);
      requestobj.memberid = tab_reason?.bic;
      requestobj.receiveriban =
        selectedOption === 'Account Number'
          ? accountNumber
          : tab_name_card.toUpperCase();
    }
    requestobj.account = tab_from_acc?.account;
    requestobj.name = tab_from_acc?.accountTitle;
    requestobj.source_iban = tab_from_acc?.iban;
    requestobj.benef_bank = tab_reason?.participantName;

    requestobj.isbenef = false;
    logs.log('tab_name_card', tab_name_card.length);
    if (isALIAS) {
      logs.log('Inside Alias');
      if (requestobj?.idValue?.length == 0) {
        dispatch(setAppAlert('Please Enter the alias'));
        logs.log('Inside Alias if if');
      } else if (
        isALIAS ? tab_name_card.length < 11 : tab_name_card.length < 24
      ) {
        logs.log('Inside Alias if else');

        dispatch(
          setAppAlert(
            isALIAS
              ? I18n['Please Enter the correct Raast ID']
              : I18n['Please enter a valid IBAN with 24 characters.'],
          ),
        );
      } else {
        logs.log('Inside Alias else', selectedOption);

        logs.log(JSON.stringify(requestobj));
        dispatch(setUserObject({aliasPhoneNumber: ''}));
        // PopInterBankFundTransfer;
        if (isALIAS && selectedOption === 'RaastID') {
          // logs.log('djsagdjasgdgasjgdjh');
          props.navigation.navigate('byAlias_step2', {
            reqObj: requestobj,
            screen_status: 'Raast',
          });
        } else {
          isALIAS
            ? props.navigation.navigate('PopInterBankFundTransfer', {
                reqObj: requestobj,
                screen_status: 'Raast',
              })
            : props.navigation.navigate('PopInterBankFundTransfer', {
                reqObj: requestobj,
                screen_status: selectedOption,
              });
          // props.navigation.navigate('byAlias_step2', {
          //   reqObj: requestobj,
          //   screen_status: isALIAS ? 'alias' : 'iban',
          // });
        }
      }
    } else if (selectedOption === 'Raast') {
      logs.log('Inside Raast Option======= Else If');
    } else {
      logs.log('isAlIAS=========', isALIAS);
      logs.log('Inside Raast Option======= Else ');

      if (accountNumber === '' && selectedOption !== 'Account Number') {
        logs.log('Inside Raast Option======= Else If');

        logs.log('in If Condition');

        if (isALIAS ? tab_name_card.length < 11 : tab_name_card.length < 24) {
          logs.log('Inside Raast Option======= Else If IF');

          dispatch(
            setAppAlert(
              isALIAS
                ? I18n['Please Enter the correct Raast ID']
                : I18n['Please Enter the correct IBAN'],
            ),
          );
          logs.log(
            'accountNumber',
            accountNumber,
            'selectedOption',
            selectedOption,
          );
        } else {
          logs.log('Inside Raast Option======= Else If else');

          // props.navigation.navigate('PopInterBankFundTransfer', {
          //   reqObj: requestobj,
          //   screen_status: selectedOption,
          // });
          props.navigation.navigate('byAlias_step2', {
            reqObj: requestobj,
            screen_status: 'iban',
          });
        }
      } else if (
        accountNumber.length === 0 &&
        selectedOption === 'Account Number'
      ) {
        logs.log('Inside Raast Option======= ElseIf IF');
        dispatch(setAppAlert(I18n['Please Enter the correct Account']));
        logs.log('in Else If Condition Account Number Empty');
      } else if (accountNumber.length < 8) {
        dispatch(setAppAlert(I18n['Please Enter the correct Account']));
        logs.log('in Else If Condition Account Number Length is small');
      } else {
        logs.log('in Else Condition');

        requestobj.memberid = selectBankType?.bic;
        // requestobj.imd = selectBankType?.bic;
        requestobj.imd = '627873';
        requestobj.bankName = selectBankType?.participantName;

        // logs.log(JSON.stringify(requestobj));
        // props.navigation.navigate('byAlias_step2', {
        //   reqObj: requestobj,
        //   screen_status: isALIAS ? 'alias' : 'iban',
        // });
        logs.log('Navigation to PopInterBankFundTransfer Screen============');
        logs.log('requestobj============', requestobj);
        logs.log('selectBankType============', selectBankType);

        // props.navigation.navigate('PopInterBankFundTransfer', {
        //   reqObj: requestobj,
        //   screen_status: selectedOption,
        // });
        props.navigation.navigate('byAlias_step2', {
          reqObj: requestobj,
          screen_status: 'account',
        });
      }
    }
  }

  return (
    <View
      style={[
        globalStyling.container,
        {backgroundColor: Colors.backgroundColor},
      ]}>
      <SubHeader
        navigation={props.navigation}
        title={'Funds Transfer'}
        description={'Pay by Raast ID/IBAN/Account Number'}
        onPress={() => {
          dispatch(setUserObject({aliasPhoneNumber: ''}));
          props.navigation.goBack();
        }}
      />
      <ScrollView contentContainerStyle={globalStyling.scrollContent}>
        <View style={{height: wp(5)}}></View>

        <CustomText style={{marginLeft: wp(3)}}>From</CustomText>
        <TabNavigator
          tabHeading={'Account Number'}
          text={tab_from_acc?.account}
          accessibilityLabel={
            tab_from_acc?.iban ? tab_from_acc?.iban : tab_from_acc?.account
          }
          navigation={props.navigation}
          width={'90%'}
          fontSize={wp(4.2)}
          textWidth={'100%'}
          arrowColor={accounts?.length == 1 ? 'white' : 'black'}
          arrowSize={wp(9)}
          multipleLines={2}
          // backgroundColor={'white'}
          // color={'black'}
          border={true}
          onPress={() => {
            logs.log(accounts?.length);
            accounts.length == 1
              ? logs.log('accounts.length-------------', accounts.length)
              : onHandleMultiAcc();
          }}
        />

        <CustomText style={{marginLeft: wp(3)}}>To</CustomText>
        {tabBar()}
        {Button()}
        {selectBank()}

        <View
          style={{
            flexDirection: 'row',
            alignSelf: 'center',
            justifyContent: 'space-between',
            width: wp(90),
          }}>
          <View
            style={{
              flexDirection: 'column',
            }}>
            {selectedOption === 'Account Number' ? (
              <CustomTextField
                textHeading={'Account Number'}
                text_input={accountNumber}
                placeholder={'Enter Account Number'}
                accessibilityLabel="Enter RAAST ID OF Beneficiary Here"
                onChangeText={(value) => {
                  logs.log(value, value.substr(0, 2));
                  setAccountNumber(String(value).replace(/[^0-9]/g, ''));
                }}
                keyboardType={'numeric'}
                onSubmitEditing={() => {}}
                returnKeyType={'next'}
                maxLength={24}
                width={wp(90)}
                fontSize={wp(4.5)}
                // isInfoBtn={isALIAS ? false : true}
                left_icon_name={'info'}
                onPressinfo={() => {
                  changeImageAlertStatus(true);
                }}
              />
            ) : (
              <CustomTextField
                textHeading={
                  tab_name_card
                    ? isALIAS
                      ? 'Mobile Number'
                      : 'IBAN/Account Number'
                    : null
                }
                text_input={tab_name_card}
                placeholder={isALIAS ? 'Enter Mobile Number' : 'Enter IBAN'}
                accessibilityLabel="Enter RAAST ID OF Beneficiary Here"
                onChangeText={(value) => {
                  logs.log(value, value.substr(0, 2));
                  if (isALIAS) {
                    change_card_name(String(value).replace(/[^0-9]/g, ''));
                  } else if (selectedOption === 'Account Number') {
                    change_card_name(String(value).replace(/[^0-9]/g, ''));
                  } else {
                    change_card_name(validateonlyAlphaNumeric(value));
                  }
                }}
                keyboardType={isALIAS ? 'numeric' : 'default'}
                onSubmitEditing={() => {}}
                returnKeyType={'next'}
                maxLength={isALIAS ? 11 : 24}
                width={isALIAS ? wp(74) : wp(90)}
                fontSize={wp(4.5)}
                isInfoBtn={isALIAS ? false : true}
                left_icon_name={'info'}
                onPressinfo={() => {
                  changeImageAlertStatus(true);
                }}
              />
            )}
            <CustomText
              style={{
                fontSize: wp(2.5),
                width: wp(74),
                marginTop: wp(2),
              }}>
              {selectedOption === 'Account Number'
                ? `Please enter your Account Nummber`
                : isALIAS
                ? `Enter an 11 digit mobile number as 03XXXXXXXXX`
                : `Enter a 24 character IBAN as PKXXABCDXXXXXXXXXXXXXXXX that is linked to Raast.`}
            </CustomText>
          </View>
          {isALIAS ? (
            <View
              style={{
                flexDirection: 'column',
                width: wp(14),
              }}>
              <TouchableOpacity
                onPress={PermissionContact}
                style={{
                  backgroundColor: Colors.textfieldBackgroundColor,
                  justifyContent: 'center',
                  width: wp(13),
                  height: wp(13),
                  borderWidth: 1,
                  borderColor: Colors.textFieldBorderColor,
                  borderRadius: wp(1),
                  alignSelf: 'center',
                  marginTop: 2,
                }}>
                <View style={{alignSelf: 'center'}}>
                  <Image
                    style={{tintColor: Colors.tabNavigateLeftIcon}}
                    resizeMode="stretch"
                    source={require('../../../Assets/RAAST_Icons/ContactList.png')}
                  />
                </View>
              </TouchableOpacity>
              <CustomText
                style={{
                  fontSize: wp(2.5),
                  width: wp(74),
                  marginTop: wp(2),
                  textAlign: 'center',
                  width: wp(14),
                }}>
                {`Contact\nList\n`}
              </CustomText>
            </View>
          ) : null}
        </View>
        {!isALIAS ? (
          <CustomText style={{marginLeft: wp(3), marginVertical: wp(1)}}>
            Transaction Type
          </CustomText>
        ) : null}

        {!isALIAS ? (
          <View style={{flexDirection: 'row'}}>
            <TouchableOpacity
              style={{
                backgroundColor: isRaastColor
                  ? 'rgba(227,245,238,0.9)'
                  : Colors.tabBarColor,
                justifyContent: 'center',
                width: wp(30),
                height: wp(10),
                borderRadius: wp(5),
                marginTop: 2,
                margin: wp(5),
              }}
              onPress={() => {
                setisALIASRaastColor(true);
                setisALIAS1LinkColor(false);
                handleSelect('IBAN');
              }}>
              <View
                style={{flexDirection: 'row', justifyContent: 'space-evenly'}}>
                {isRaastColor ? (
                  <Entypo
                    name={'check'}
                    size={wp(5)}
                    color={isRaastColor ? Colors.primary_green : 'grey'}
                    style={{alignSelf: 'center'}}
                  />
                ) : null}

                <CustomText
                  style={{
                    fontSize: wp(4),
                    alignSelf: 'center',
                    color: isRaastColor ? Colors.primary_green : 'grey',
                  }}>
                  Raast
                </CustomText>
              </View>
            </TouchableOpacity>

            <TouchableOpacity
              style={{
                backgroundColor: !is1LinkColor
                  ? Colors.tabBarColor
                  : 'rgba(227,245,238,0.9)',
                justifyContent: 'center',
                width: wp(45),
                height: wp(10),
                borderRadius: wp(5),
                marginTop: 2,
              }}
              onPress={() => {
                // setisALIASRaastColor(false);
                // setisALIAS1LinkColor(true);
                // handleSelect('Account Number');
                // bankList.length === 0
                //   ? getBanksList()
                //   : change_modal_state(true);
                // logs.log('BankList State Length', bankList.length);
                props.navigation.navigate('SelectBanks');
              }}>
              <View
                style={{flexDirection: 'row', justifyContent: 'space-evenly'}}>
                {!is1LinkColor ? null : (
                  <Entypo
                    name={'check'}
                    size={wp(5)}
                    color={!is1LinkColor ? 'grey' : Colors.primary_green}
                    style={{alignSelf: 'center'}}
                  />
                )}
                <CustomText
                  style={{
                    fontSize: wp(4),
                    alignSelf: 'center',
                    color: !is1LinkColor ? 'grey' : Colors.primary_green,
                  }}>
                  Change to 1LINK
                </CustomText>
              </View>
            </TouchableOpacity>
          </View>
        ) : null}
        <View style={styles.gap}></View>

        <View style={styles.gap}></View>
        <CustomModal
          visible={accountModal}
          headtext={'Select Account'}
          data={accounts}
          onPress_item={(param) => {
            logs.log(`option selected : ${param?.participantName}`);
            // modal_type == 'account'
            //   ? change_from_acc(param)
            //   : modal_type == 'purpose'
            //   ? change_purpose(param)
            //   : modal_type == 'reason'
            //   ? change_reason(param)
            //   : null;
            // change_modal_state(false);
            // setSelectBankType(param);
            setAccountModal(false);
            change_from_acc(param);
          }}
          accounts={true}
          // reason={modal_type === 'reason' ? true : false}
          // purpose={modal_type == 'purpose' ? true : false}
          onCancel={() => change_modal_state(false)}
        />
        <CustomModal
          visible={modal}
          headtext={'Select Bank'}
          data={bankList}
          onPress_item={(param) => {
            logs.log(`option selected : ${param?.participantName}`);
            // modal_type == 'account'
            //   ? change_from_acc(param)
            //   : modal_type == 'purpose'
            //   ? change_purpose(param)
            //   : modal_type == 'reason'
            //   ? change_reason(param)
            //   : null;
            change_modal_state(false);
            setSelectBankType(param);
          }}
          // accounts={modal_type === 'account' ? true : false}
          // reason={modal_type === 'reason' ? true : false}
          // purpose={modal_type == 'purpose' ? true : false}
          raastbank={true}
          onCancel={() => change_modal_state(false)}
        />
        <CustomAlert
          overlay_state={showImageAlert}
          nationalBankIBANPolicy={true}
          title={'How to find your IBAN?'}
          onPressCancel={() => changeImageAlertStatus(false)}
        />
      </ScrollView>
      <KeyboardAvoidingView
        keyboardVerticalOffset={hp(7)}
        behavior={'padding'}
        style={globalStyling.buttonContainer}>
        <CustomBtn
          btn_txt={'Continue'}
          accessibilityLabel={'Continue'}
          onPress={() => {
            validate();
          }}
          btn_width={wp(90)}
          backgroundColor={Colors.primary_green}
        />
      </KeyboardAvoidingView>
    </View>
  );
};

export default NewFundTransfer;
