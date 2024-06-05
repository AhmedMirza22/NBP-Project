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
import CustomText from '../../../../Components/CustomText/CustomText';
import styles from './by_aliasstyle';
import SubHeader from '../../../../Components/GlobalHeader/SubHeader/SubHeader';
import TabNavigator from '../../../../Components/TabNavigate/TabNavigate';
import CustomModal from '../../../../Components/CustomModal/CustomModal';
import CustomTextField from '../../../../Components/CustomTextField/CustomTextField';
import CustomTabButton from '../../../../Components/CustomTabBar/CustomTabBar';
import {
  wp,
  globalStyling,
  validateonlyAlphaNumeric,
  hp,
} from '../../../../Constant';
import analytics from '@react-native-firebase/analytics';
import CustomBtn from '../../../../Components/Custom_btn/Custom_btn';
import I18n from '../../../../Config/Language/LocalizeLanguageString';
import {useSelector, useDispatch} from 'react-redux';
import {Colors} from '../../../../Theme';
import Ionicons from 'react-native-vector-icons/AntDesign';
import Contacts from 'react-native-contacts';
import {
  helpInforamtion,
  setLoader,
  setUserObject,
  getdefaultaccounsbyalias,
} from '../../../../Redux/Action/Action';
import {
  RAAST_PURPOSE_OF_PAYMENT_LIST,
  FT_PURPOSE_OF_PAYMENT_LIST,
} from '../../../purposeOfPayments';
// import CustomAlert from '../../../Components/Custom_Alert/CustomAlert';
import {setCurrentFlow, setAppAlert} from '../../../../Redux/Action/Action';
import {logs} from '../../../../Config/Config';
import {Platform} from 'react-native';
import {Keyboard} from 'react-native';
import InformationAlert from '../../../../Components/InformationAlert/InformationAlert';
import InformationIcon from '../../../../Components/InformationIcon/InformationIcon';
import CustomAlert from '../../../../Components/Custom_Alert/CustomAlert';
import moment from 'moment';

const By_alias = (props) => {
  const [showImageAlert, changeImageAlertStatus] = useState(false);

  const phoneNumber = props?.route?.params?.phoneNumber;
  useEffect(() => {
    if (phoneNumber) {
      change_card_name(phoneNumber);
    }
  }, [phoneNumber]);
  props.navigation.addListener('focus', () => {
    dispatch(setCurrentFlow('Payments'));
    async function analyticsLog() {
      await analytics().logEvent('PaymentByRAASTIDByAliasScreen');
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
  const dispatch = useDispatch();
  const [tab_purpose, change_purpose] = useState({
    purpose: 'Select Purpose of Payment',
  });
  const [purposeOfPayment, changePurposeOfPayment] = useState(
    FT_PURPOSE_OF_PAYMENT_LIST[12],
  );
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
  const [isALIAS, setisALIAS] = useState(true);
  const [amount, setAmount] = useState('');
  const [param, changeParams] = useState({});
  const [benefAddition, changeBenefAddition] = useState(false);
  const [responseData, setResponseData] = useState({});
  const [responseData2, setResponseData2] = useState({});

  const product_type = RAAST_PURPOSE_OF_PAYMENT_LIST;
  const reason = [{reason: 'MOBILE'}];
  const requestobj = {};
  const onSelectIbanPress = () => {
    change_card_name('');
    setisALIAS(false);
  };
  const onSelectAccountPress = () => {
    change_card_name('');
    setisALIAS(true);
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
    }
  }, [tab_name_card]);

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
        RightText={'IBAN'}
        leftText={'Mobile Number'}
        LeftSelectPress={() => onSelectAccountPress()}
        RightSelectPress={() => onSelectIbanPress()}
      />
    );
  };
  const onHandleMultiAcc = () => {
    change_modal_state(true);
    change_modal_type('account');
  };
  function screenProcess(screen_status, params, response) {
    let res1 = response.data.data?.iban.slice(8, 12);
    let res2 = response.data.data?.iban.slice(14, 24);
    let result = `${res1}${res2}`;
    let body = {
      fromAccount: params?.account,
      toAccount: result,
      amount: params?.amount,
      title: `${response?.data?.data?.name.toUpperCase()} ${response?.data?.data?.surname.toUpperCase()}`,
      isDirectPayment: params.isbenef ? false : true,
      token: response?.data?.data?.token,
      purposeOfPayment: params?.pay_pur,
      purposeOfPaymentString: params?.pay_pur,
      date: moment(new Date()).format('YYYY-MM-DD hh:mm:ss A'),
    };

    logs.log('nbp  nhi hy ');

    logs.log('Body---', body);

    if (screen_status == 'aliasbybenef') {
      props.navigation.navigate('RAASTBenefShowInfo', {
        screen: 'alias',
        paramsAlias: response.data,
        param: params,
      });
    } else {
      props.navigation.navigate('RAASTInfoShow', {
        screen: 'alias',
        paramsAlias: response.data,
        param: params,
      });
    }
  }
  function validate() {
    //ASDASD
    // requestobj.memberid = "";
    // requestobj.receiveriban = tab_benef;
    //for next screen
    // requestobj.amount = tab_amount;
    requestobj.idType = isALIAS ? 'MOBILE' : 'CNIC';
    requestobj.idValue = isALIAS ? tab_name_card : acc_info.cnic;
    if (isALIAS == false) {
      logs.log('is iiban', tab_reason.bic);
      requestobj.memberid = tab_reason.bic;
      requestobj.receiveriban = tab_name_card.toUpperCase();
    }
    requestobj.account = tab_from_acc?.account;
    requestobj.name = tab_from_acc?.accountTitle;
    requestobj.source_iban = tab_from_acc?.iban;
    requestobj.benef_bank = tab_reason?.participantName;
    requestobj.amount = amount;

    requestobj.isbenef = false;
    logs.log('tab_name_card', tab_name_card.length);
    if (isALIAS) {
      if (requestobj?.idValue?.length == 0) {
        dispatch(setAppAlert('Please Enter the alias'));
      } else if (
        isALIAS ? tab_name_card.length < 11 : tab_name_card.length < 24
      ) {
        dispatch(
          setAppAlert(
            isALIAS
              ? I18n['Please Enter the correct Raast ID']
              : I18n['Please enter a valid IBAN with 24 characters.'],
          ),
        );
      } else if (amount === '') {
        dispatch(setAppAlert(I18n['Please Enter Amount']));
      } else {
        logs.log('First If--- Else Condition isAlias');
        logs.log(JSON.stringify(requestobj));
        dispatch(setUserObject({aliasPhoneNumber: ''}));
        logs.log('requestobj--', requestobj);

        dispatch(
          getdefaultaccounsbyalias(
            'alias',
            props.navigation,
            requestobj,
            (screen_status, params, response) => {
              logs.log(
                'jaksh872t7312r3123------->',
                response?.data?.data?.token,
              );
              params.pay_pur_id = tab_purpose?.pur_code;
              params.pay_pur = purposeOfPayment.purpose
                ? purposeOfPayment.purpose
                : purposeOfPayment.text;
              params.fromScreen = 'raastAlias';
              setResponseData2(response);
              changeParams(params);
              setResponseData({response: response?.data, parmas: params});
              logs.log(
                'response?.data?.data?.benefExists',
                response?.data?.data?.benefExists,
              );
              if (response?.data?.data?.benefExists == false) {
                changeBenefAddition(true);
              } else {
                logs.log(
                  '--=-==-=->',
                  response?.data,
                  response?.data?.data?.benefEmail,
                  response?.data?.data?.benefMobileNumber,
                  '198273912313123-----=>',
                );
                (params.email = response?.data?.data?.benefEmail),
                  (params.phone = response?.data?.data?.benefMobileNumber),
                  screenProcess(screen_status, params, response);
              }
            },
          ),
        );
        // props.navigation.navigate('byAlias_step2', {
        //   reqObj: requestobj,
        //   screen_status: isALIAS ? 'alias' : 'iban',
        // });
      }
    } else {
      if (isALIAS ? tab_name_card.length < 11 : tab_name_card.length < 24) {
        dispatch(
          setAppAlert(
            isALIAS
              ? I18n['Please Enter the correct Raast ID']
              : I18n['Please Enter the correct IBAN'],
          ),
        );
      } else if (amount === '') {
        dispatch(setAppAlert(I18n['Please Enter Amount']));
      } else {
        logs.log('Second Else--- Else Condition isAlias');

        logs.log(JSON.stringify(requestobj));
        // props.navigation.navigate('byAlias_step2', {
        //   reqObj: requestobj,
        //   screen_status: isALIAS ? 'alias' : 'iban',
        // });
        logs.log('requestobj--', requestobj);

        getdefaultaccounsbyalias(
          'alias',
          props.navigation,
          requestobj,
          (screen_status, params, response) => {
            logs.log('jaksh872t7312r3123------->', response?.data?.data?.token);
            params.pay_pur_id = tab_purpose?.pur_code;
            params.pay_pur = purposeOfPayment.purpose
              ? purposeOfPayment.purpose
              : purposeOfPayment.text;
            params.fromScreen = 'raastAlias';
            setResponseData2(response);
            changeParams(params);
            setResponseData({response: response?.data, parmas: params});
            if (response?.data?.data?.benefExists == false) {
              changeBenefAddition(true);
            } else {
              logs.log(
                '--=-==-=->',
                response?.data,
                response?.data?.data?.benefEmail,
                response?.data?.data?.benefMobileNumber,
                '198273912313123-----=>',
              );
              (params.email = response?.data?.data?.benefEmail),
                (params.phone = response?.data?.data?.benefMobileNumber),
                screenProcess(screen_status, params, response);
            }
          },
        );
      }
    }
  }
  const popComp = () => {
    logs.log('purposeOfPayment', purposeOfPayment);
    return (
      <TabNavigator
        textWidth={'100%'}
        tabHeading={'Purpose Of Payment'}
        accessibilityLabel={
          // Object.keys(purposeOfPayment).length === 0
          //   ? 'Tap here to select option'
          //   :
          purposeOfPayment.purpose
            ? purposeOfPayment.purpose
            : purposeOfPayment.text
        }
        border={true}
        text={
          // Object.keys(purposeOfPayment).length === 0
          //   ? 'Tap here to select option'
          //   :
          purposeOfPayment.purpose
            ? purposeOfPayment.purpose
            : purposeOfPayment.text
        }
        // color={'black'}
        // backgroundColor={'white'}
        hideOverlay={'transparent'}
        navigation={props.navigation}
        width={'90%'}
        fontSize={wp(4.2)}
        multipleLines={1}
        arrowSize={wp(9)}
        // arrowColor={'black'}
        onPress={() => {
          change_modal_type('purpose');
          setTimeout(() => {
            change_modal_state(true);
          }, 200);
        }}
      />
    );
  };
  const amountContainer = () => {
    return (
      <CustomTextField
        textHeading={
          amount ? (amount.length == 0 ? null : 'Enter Amount') : null
        }
        placeholder={'Amount'}
        accessibilityLabel="Enter Amount"
        Textfield_label={''}
        text_input={amount}
        onChangeText={(value) => {
          setAmount(String(value).replace(/[^0-9]/g, ''));
        }}
        // editable={}
        currencyInput={true}
        width={'90%'}
        keyboardType={'number-pad'}
      />
    );
  };

  return (
    <View
      style={[
        globalStyling.container,
        {backgroundColor: Colors.backgroundColor},
      ]}>
      <SubHeader
        navigation={props.navigation}
        title={'Transfer to Raast ID'}
        description={'Transfers fund to other bank account'}
        onPress={() => {
          dispatch(setUserObject({aliasPhoneNumber: ''}));
          props.navigation.goBack();
        }}
      />
      <ScrollView contentContainerStyle={globalStyling.scrollContent}>
        <View style={{height: wp(5)}}></View>

        <CustomText style={styles.text}>From</CustomText>
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
          border={true}
          onPress={() => {
            logs.log(accounts);
            accounts.length == 1
              ? logs.log(accounts.length)
              : onHandleMultiAcc();
          }}
        />

        <CustomText style={styles.text}>To</CustomText>
        {/* {tabBar()} */}
        {popComp()}

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
            <CustomTextField
              textHeading={
                tab_name_card ? (isALIAS ? 'Mobile Number' : 'IBAN') : null
              }
              text_input={tab_name_card}
              placeholder={isALIAS ? 'Enter Mobile Number' : 'Enter IBAN'}
              accessibilityLabel="Enter RAAST ID OF Beneficiary Here"
              onChangeText={(value) => {
                logs.log(value, value.substr(0, 2));
                if (isALIAS) {
                  change_card_name(String(value).replace(/[^0-9]/g, ''));
                } else {
                  change_card_name(validateonlyAlphaNumeric(value));
                }
              }}
              keyboardType={isALIAS ? 'numeric' : 'default'}
              onSubmitEditing={() => {}}
              returnKeyType={'next'}
              maxLength={11}
              width={isALIAS ? wp(74) : wp(90)}
              fontSize={wp(4.5)}
              isInfoBtn={isALIAS ? false : true}
              left_icon_name={'info'}
              onPressinfo={() => {
                changeImageAlertStatus(true);
              }}
            />
            <CustomText
              style={{
                fontSize: wp(2.5),
                width: wp(74),
                marginTop: wp(2),
              }}>
              {isALIAS
                ? `Enter an 11 digit mobile number as 03XXXXXXXXX`
                : `Enter a 24 character IBAN as PKXXABCDXXXXXXXXXXXXXXXX that is linked to Raast.`}
            </CustomText>
          </View>
          {isALIAS ? (
            <View
              style={{
                flexDirection: 'column',
                width: wp(14),
                // alignSelf: 'center',
                // backgroundColor: 'pink',
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
                    // style={globalStyling.image}
                    style={{tintColor: Colors.tabNavigateLeftIcon}}
                    resizeMode="stretch"
                    source={require('../../../../Assets/RAAST_Icons/ContactList.png')}
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
        {amountContainer()}

        <View style={styles.gap}></View>

        <View style={styles.gap}></View>

        <CustomAlert
          overlay_state={benefAddition}
          title={'Beneficiary Addition'}
          alert_text={'Do you want to Add as a Beneficiary?'}
          onPressCancel={() => {
            changeBenefAddition(false);
          }}
          yesNoButtons={true}
          onPressYes={() => {
            if (responseData2?.data?.data?.iban.includes('NBP')) {
              changeBenefAddition(false);

              let res1 = responseData2.data.data?.iban.slice(8, 12);
              let res2 = responseData2.data.data?.iban.slice(14, 24);
              let result = `${res1}${res2}`;

              props?.navigation.navigate('BenefAdditionTransfer', responseData);
            } else {
              props?.navigation.navigate('BenefAdditionTransfer', responseData);
              changeBenefAddition(false);
            }
          }}
          onPressNo={() => {
            if (
              props?.route?.params?.screen_status == 'iban' ||
              props?.route?.params?.screen_status == 'account'
            ) {
              changeBenefAddition(false);
              props?.navigation.navigate('RAASTInfoShow', {
                screen: 'iban',
                param: param,
                paramsAlias: responseData2,
              });
            } else {
              changeBenefAddition(false);
              screenProcess('alias', param, responseData2);
            }
          }}
        />
        <CustomModal
          visible={modal}
          headtext={
            modal_type == 'city'
              ? 'Select City'
              : modal_type == 'account'
              ? 'Select Account'
              : modal_type == 'purpose'
              ? 'Select Product Type'
              : modal_type == 'reason'
              ? 'Select reason Type'
              : ''
          }
          data={
            modal_type == 'city'
              ? city
              : modal_type == 'account'
              ? accounts
              : modal_type == 'purpose'
              ? product_type
              : modal_type == 'reason'
              ? reason
              : null
          }
          onPress_item={(param) => {
            logs.log(`option selected : ${param}`);
            modal_type == 'account'
              ? change_from_acc(param)
              : modal_type == 'purpose'
              ? changePurposeOfPayment(param)
              : modal_type == 'reason'
              ? change_reason(param)
              : null;
            change_modal_state(false);
          }}
          accounts={modal_type === 'account' ? true : false}
          reason={modal_type === 'reason' ? true : false}
          purpose={modal_type == 'purpose' ? true : false}
          onCancel={() => change_modal_state(false)}
        />
        <CustomAlert
          overlay_state={showImageAlert}
          nationalBankIBANPolicy={true}
          title={'How to find your IBAN?'}
          onPressCancel={() => changeImageAlertStatus(false)}
        />

        <InformationIcon
          onPress={() => {
            dispatch(
              helpInforamtion({
                title: 'RAAST',
                page: 'PayViaRaast',
                state: true,
              }),
            );
          }}
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

export default By_alias;
