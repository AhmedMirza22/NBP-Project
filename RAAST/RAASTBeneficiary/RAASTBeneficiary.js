import React, {useState, useRef, useEffect} from 'react';
import {
  View,
  Dimensions,
  KeyboardAvoidingView,
  ScrollView,
  TouchableOpacity,
  Text,
  Keyboard,
  Platform,
  Image,
  PermissionsAndroid,
  TouchableWithoutFeedback,
  BackHandler,
  Linking,
} from 'react-native';
import I18n from '../../../Config/Language/LocalizeLanguageString';
import CustomText from '../../../Components/CustomText/CustomText';
import styles from './RAASTBeneStyle';
import Contacts from 'react-native-contacts';
import CustomTextField from '../../../Components/CustomTextField/CustomTextField';
import CustomBtn from '../../../Components/Custom_btn/Custom_btn';
import CustomAlert from '../../../Components/Custom_Alert/CustomAlert';
import CustomModal from '../../../Components/CustomModal/CustomModal';
import {Colors, Images} from '../../../Theme';
import {logs} from '../../../Config/Config';
import SubHeader from '../../../Components/GlobalHeader/SubHeader/SubHeader';
import TabNavigator from '../../../Components/TabNavigate/TabNavigate';
import {
  globalStyling,
  validateOnlyNumberInput,
  validateOnlyNumberInputstart03,
  validateonlyAlphaNumeric,
  wp,
} from '../../../Constant';
import {useFocusEffect} from '@react-navigation/native';

import {
  setCurrentFlow,
  setLoader,
  titleFetchRAASTBenefByIban,
  titleFetchRAASTBenef,
  changeGlobalIconAlertState,
  setUserObject,
  setAppAlert,
} from '../../../Redux/Action/Action';
import analytics from '@react-native-firebase/analytics';
import {useDispatch, useSelector} from 'react-redux';

import {Label} from '../../../Constant/Labels';
import CustomTabButton from '../../../Components/CustomTabBar/CustomTabBar';

const width = Dimensions.get('screen').width;

const Registration = (props) => {
  const dispatch = useDispatch();
  const [overlay_state, setOverlayState] = useState(false);
  const [alerttext, set_alert_text] = useState('N/A');
  const [modal, change_modal_state] = useState(false);
  const [modal_type, change_modal_type] = useState('');
  const [tab_reason, change_reason] = useState({
    participantName: 'Select Beneficiary Bank',
  });
  const unsorted_reason = useSelector((state) => state.reducers.raastbank);
  const reason = unsorted_reason.sort((a, b) =>
    a.participantName.localeCompare(b.participantName),
  );
  const [accountNumber, set_account_no] = useState('');
  const refAccount = useRef();
  const [checkCard, changeCheckCard] = useState(true);
  const [tab_from_acc, change_from_acc] = useState({});
  const userObject = useSelector((state) => state?.reducers?.userObject);
  const accounts = useSelector((state) => state.reducers.viewAccountsData);
  const acc_info = useSelector(
    (state) => state.reducers.overViewData?.data?.accounts,
  );

  // const myAccounts = useSelector((state) => state.reducers.viewAccountsData);

  const registeration_object = {};
  let updatedPhoneNumber = props?.route?.params?.phoneNumber;

  var past = new Date();
  past.setDate(past.getDate() - 6570);
  past.toISOString().slice(0, 10);
  const requestobj = {};

  useEffect(() => {
    logs.log(acc_info);
    change_from_acc({
      iban: accounts[0]?.iban,
    });
  }, []);
  useFocusEffect(
    React.useCallback(() => {
      async function analyticsLog() {
        await analytics().logEvent('RAASTBeneFiciaryScreen');
      }
      analyticsLog();

      const onBackPress = () => {
        dispatch(setUserObject({aliasPhoneNumber: ''}));
      };

      BackHandler.addEventListener('hardwareBackPress', onBackPress);

      return () =>
        BackHandler.removeEventListener('hardwareBackPress', onBackPress);
    }, []),
  );

  // async function call() {
  async function call() {
    requestobj.amount = 0;
    requestobj.idType = 'MOBILE';
    requestobj.idValue = accountNumber;
    requestobj.source_iban = tab_from_acc?.iban;
    logs.log(requestobj);
    Keyboard.dismiss();
    logs.log('asdasdads', accountNumber, tab_from_acc?.participantName);
    logs.log('reqObject account:', accountNumber);
    dispatch(setUserObject({aliasPhoneNumber: ''}));
    checkCard
      ? dispatch(titleFetchRAASTBenef('alias', props.navigation, requestobj))
      : dispatch(
          titleFetchRAASTBenefByIban('iban', props.navigation, {
            amount: 0,
            idType: 'CNIC',
            idValue: acc_info.cnic,
            memberid: tab_reason.bic,
            receiveriban: accountNumber,
            source_iban: tab_from_acc?.iban,
            bankName: tab_reason?.participantName,
          }),
        );
  }
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
          isbenef: true,
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
  useEffect(() => {
    refAccount.current.focus();
    props.navigation.addListener('focus', () => {
      dispatch(setCurrentFlow('RAAST Beneficiary'));
      set_account_no(
        userObject.aliasPhoneNumber ? userObject.aliasPhoneNumber : '',
      );
    });
  }, [updatedPhoneNumber]);
  useEffect(() => {
    if (checkCard == false) {
      logs.log('my komi', accountNumber.substr(4, 4).toUpperCase());

      if (accountNumber.length >= 8) {
        logs.log('my love', accountNumber.substr(4, 4).toUpperCase());
        var foundBank = unsorted_reason.filter(
          (obj) => obj.prefix == accountNumber.substr(4, 4).toUpperCase(),
        );
        if (foundBank.length == 1) {
          change_reason(foundBank[0]);
        } else if (foundBank.length == 0) {
          logs.log('done1');
          change_reason({
            participantName: 'Beneficiary Bank',
          });
          Keyboard.dismiss();
          // if (accountNumber.substr(4, 4).toUpperCase() == 'NBPA') {
          //   // global.showToast.show('Please ', 1000);
          //   setTimeout(() => {
          //     dispatch(
          //       changeGlobalIconAlertState(true, props.navigation, {
          //         message:
          //           'Same Bank IBAN can not be added as Raast Beneficiary.',
          //         onPressOk: () => {
          //           changeGlobalIconAlertState(false);
          //         },
          //       }),
          //     );
          //   }, 500);
          // } else {
          global.showToast.show(I18n['IBAN incorrect'], 1000);
          // }
          // changeIBAN('');
          set_account_no('');
        }
      } else if (accountNumber.length < 8) {
        logs.log('done2');
        change_reason({
          participantName: 'Beneficiary Bank',
        });
      }
    }
  }, [accountNumber]);
  const onSelectIbanPress = () => {
    changeCheckCard(false);
  };
  const onSelectAccountPress = () => {
    changeCheckCard(true);
  };
  const tabBar = () => {
    return (
      <CustomTabButton
        RightText={'IBAN'}
        leftText={'Mobile Number'}
        LeftSelectPress={() => onSelectAccountPress(true)}
        RightSelectPress={() => onSelectIbanPress()}
      />
    );
  };

  return (
    <TouchableWithoutFeedback
      onPress={() => {
        Keyboard.dismiss();
      }}>
      <KeyboardAvoidingView
        behavior="padding"
        keyboardVerticalOffset={40}
        style={[
          globalStyling.whiteContainer,
          {backgroundColor: Colors.backgroundColor},
        ]}>
        {/* <GlobalHeader navigation={props.navigation} /> */}
        <SubHeader
          // utilityBillPayments={true}
          title={Label.subHeaderTitle.raastBenef}
          description={Label.subHeaderDescription.addRasstBenef}
          navigation={props.navigation}
          // register={true}
          onPress={() => {
            props.navigation.goBack();
            dispatch(setUserObject({aliasPhoneNumber: ''}));
          }}
        />
        <View style={styles.gap}></View>
        <TabNavigator
          tabHeading={'Transaction Type'}
          text={'RAAST '}
          border={true}
          navigation={props.navigation}
          width={'90%'}
          fontSize={wp(4.2)}
          textWidth={'100%'}
          arrowColor={Colors.whiteColor}
          arrowSize={wp(9)}
          multipleLines={2}
          onPress={() => {}}
        />
        <View style={styles.gap}></View>
        {tabBar()}
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
              ref={refAccount}
              textHeading={
                accountNumber == ''
                  ? null
                  : checkCard
                  ? 'Mobile Number'
                  : 'IBAN'
              }
              text_input={accountNumber}
              placeholder={checkCard ? 'Enter Mobile Number' : `Enter IBAN`}
              accessibilityLabel="Enter RAAST ID OF Beneficiary Here"
              // Textfield_label={'Enter Debit/ATM Card Number'}
              onChangeText={(value) => {
                if (checkCard) {
                  set_account_no(String(value).replace(/[^0-9]/g, ''));
                } else {
                  set_account_no(validateonlyAlphaNumeric(value));
                }
              }}
              keyboardType={checkCard ? 'numeric' : 'default'}
              onSubmitEditing={() => {}}
              returnKeyType={'next'}
              maxLength={24}
              width={checkCard ? wp(74) : wp(90)}
              fontSize={checkCard ? wp(4.5) : wp(3.5)}
            />
            <CustomText
              style={{
                fontSize: wp(2.5),
                width: wp(74),
                marginTop: wp(2),
              }}>
              {checkCard
                ? `Enter an 11 digit mobile number as 03XXXXXXXXX.`
                : `Enter a 24 character IBAN as PKXXUNILXXXXXXXXXXXXXXXX that is linked to Raast.`}
            </CustomText>
          </View>
          {/* <View style={{width: wp(3)}}></View> */}
          {checkCard ? (
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
                  backgroundColor: Colors.tabNavigateBackground,
                  justifyContent: 'center',
                  width: wp(13),
                  height: wp(13),
                  borderWidth: 1,
                  borderColor: Colors.borderColor,
                  borderRadius: wp(1),
                  alignSelf: 'center',
                  marginTop: 2,
                }}>
                <View style={{alignSelf: 'center'}}>
                  <Image
                    style={[{tintColor: Colors.tabNavigateLeftIcon}]}
                    // style={globalStyling.image}
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
                {`Contact\nList`}
                {`\n `}
              </CustomText>
            </View>
          ) : null}
        </View>

        {/* <View style={styles.row}>
        <CustomTextField
          ref={refAccount}
          placeholder={checkCard ? 'Mobile Number' : 'IBAN'}
          Textfield_label={''}
          // placeholderTextSize={wp(10)}
          fontSize={checkCard ? wp(4.5) : wp(4.1)}
          text_input={accountNumber}
          onChangeText={(value) => {
            if (checkCard) {
              value.indexOf(0) === 0
                ? set_account_no(validateOnlyNumberInput(value))
                : set_account_no('');
              if (value.length == 2) {
                value.indexOf(3) === 1
                  ? set_account_no(validateOnlyNumberInput(value))
                  : set_account_no('');
              } else if (value.length == 3) {
                set_account_no(validateOnlyNumberInput(value));
              }
            } else {
              set_account_no(validateonlyAlphaNumeric(value));
            }
          }}
          maxLength={checkCard ? 11 : 24}
          width={'90%'}
          keyboardType={checkCard ? 'number-pad' : 'default'}
          masked={checkCard ? '[00000000000000]' : ''}
        />
      </View> */}
        <View style={styles.gap} />
        <View
          style={{position: 'absolute', bottom: wp(10), alignSelf: 'center'}}>
          <CustomBtn
            btn_txt={'Continue'}
            onPress={() => {
              Keyboard.dismiss();
              call();
            }}
            btn_width={wp(90)}
            backgroundColor={Colors.primary_green}
          />
        </View>

        <CustomAlert
          overlay_state={overlay_state}
          iscancelbtn={true}
          onPressOkay={() => {
            setOverlayState(false);
          }}
          alert_text={alerttext}
        />

        <CustomModal
          visible={modal}
          headtext={modal_type == 'reason' ? 'Select Bank List' : ''}
          data={modal_type == 'reason' ? reason : null}
          onPress_item={(param) => {
            modal_type == 'reason' ? change_reason(param) : null;
            change_modal_state(false);
          }}
          raastbank={modal_type === 'reason' ? true : false}
          onCancel={() => change_modal_state(false)}
        />
      </KeyboardAvoidingView>
    </TouchableWithoutFeedback>
  );
};

export default Registration;
