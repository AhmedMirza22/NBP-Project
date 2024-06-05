import React, {useState, useRef, useEffect} from 'react';
import {
  View,
  Platform,
  ScrollView,
  KeyboardAvoidingView,
  TouchableOpacity,
} from 'react-native';
import SubHeader from '../../../../Components/GlobalHeader/SubHeader/SubHeader';
import CustomTextField from '../../../../Components/CustomTextField/CustomTextField';
import CustomBtn from '../../../../Components/Custom_btn/Custom_btn';
import CustomAlert from '../../../../Components/Custom_Alert/CustomAlert';
import CustomText from '../../../../Components/CustomText/CustomText';
import styles from './../../../RTP Requests/RTPRequestStyling';
import {Colors} from '../../../../Theme';
import i18n from '../../../../Config/Language/LocalizeLanguageString';
import {
  currencyFormat,
  globalStyling,
  hp,
  validateOnlyNumberInput,
  wp,
} from '../../../../Constant';
import {useSelector, useDispatch} from 'react-redux';
import {postTokenCall, Service} from '../../../../Config/Service';
import moment from 'moment';
import {Keyboard} from 'react-native';
import {isRtlState} from '../../../../Config/Language/LanguagesArray';
import {logs} from '../../../../Config/Config';
import CustomModal from '../../../../Components/CustomModal/CustomModal';
import Octicons from 'react-native-vector-icons/Octicons';
import {
  setLoader,
  updateSessionToken,
  serviceResponseCheck,
  catchError,
  changeGlobalIconAlertState,
} from '../../../../Redux/Action/Action';
import SuccessModal from '../../../../Components/SuccessModal/SuccessModal';
import I18n from '../../../../Config/Language/LocalizeLanguageString';
import analytics from '@react-native-firebase/analytics';

export default function RequestReturnConfirm(props) {
  const [showAlertState, changeAlertState] = useState(false);
  const [currentModal, changeCurrentModal] = useState('');
  const [successModalState, setSuccessModalState] = useState(false);
  const [confirm, setConfirm] = useState(false);
  const [amount, setAmount] = useState('');

  const confirmData = props?.route?.params?.data;

  const dispatch = useDispatch();
  let apiObject = {
    originalRrn: confirmData?.originalRrn,
    originalStan: confirmData?.originalStan,
    originalAmount: confirmData?.originalAmount,
    requestedAmount: amount,
    schemeId: confirmData?.schemeId,
    mpin: confirmData?.mpin,
    merchantName: confirmData?.merchantAccountTitle,
  };
  // const totalSeconds =
  useEffect(() => {
    props.navigation.addListener('focus', () => {
      async function analyticsLog() {
        await analytics().logEvent('RequestReturnConfirmScreen');
      }
      analyticsLog();
    });
    logs.log('Amount from Prop', confirmData?.date);
    logs.log('Date from Prop', confirmData?.date);

    logs.log('apiObject from Prop', apiObject);
  }, []);

  const validation = () => {
    logs.log(
      'Amount',
      parseInt(apiObject?.requestedAmount),
      'originalAmount',
      parseInt(apiObject?.originalAmount),
    );
    if (amount === '') {
      global.showToast.show(I18n['Amount should not be empty'], 1000);
    } else if (parseInt(amount) === 0) {
      global.showToast.show(
        I18n['Entered amount should be greater than 0'],
        1000,
      );
    } else if (
      parseInt(apiObject?.requestedAmount) > parseInt(apiObject?.originalAmount)
    ) {
      global.showToast.show(
        I18n['Entered amount should not be greater than transaction amount'],
        1000,
      );
    } else {
      // apiObject?.returnAmount=
      confirm
        ? props.navigation.navigate('RequestReturnMPIN', {
            data: apiObject,
          })
        : null;
    }
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
        currencyInput={true}
        width={'90%'}
        keyboardType={'number-pad'}
      />
    );
  };

  return (
    <View style={[styles.container, {backgroundColor: Colors.backgroundColor}]}>
      <SubHeader
        navigation={props.navigation}
        title={'Request to Pay'}
        description={'RTP Requests & Return Payment'}
        navigateHome={true}
      />
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={globalStyling.scrollContent}>
        <View
          style={[styles.container, {backgroundColor: Colors.backgroundColor}]}>
          <View
            style={{
              alignSelf: 'center',
              justifyContent: 'flex-start',
              borderRadius: 10,
              width: wp(90),
              backgroundColor: Colors.subContainer,
              marginTop: wp(6),
              padding: wp(2),
              borderWidth: 1,
              borderColor: Colors.textFieldBorderColor,
            }}>
            <View style={{height: wp(4)}} />
            <View style={{padding: wp(1)}}>
              <CustomText
                style={{left: wp(2), fontSize: wp(4.5), color: '#9ea3a6'}}
                boldFont={true}>
                Transaction Details
              </CustomText>
            </View>
            <View
              style={{
                backgroundColor: Colors.dashboardIconBack,
                width: wp(80),
                alignSelf: 'center',
                borderRadius: wp(1.5),
                padding: wp(4),
              }}>
              <CustomText
                style={{
                  padding: wp(1),
                  color: '#9ea3a6',
                  textAlign: isRtlState() ? 'left' : 'right',
                }}>
                From Account
              </CustomText>
              <CustomText
                boldFont={true}
                style={{
                  fontSize: wp(5),
                  padding: wp(1),
                  textAlign: isRtlState() ? 'left' : 'right',
                }}>
                {confirmData?.fromAccount}
              </CustomText>
              <CustomText
                style={{
                  padding: wp(1),
                  color: '#9ea3a6',
                  textAlign: isRtlState() ? 'left' : 'right',
                }}>
                Merchant Name
              </CustomText>
              <CustomText
                boldFont={true}
                style={{
                  fontSize: wp(5),
                  padding: wp(1),
                  textAlign: isRtlState() ? 'left' : 'right',
                }}>
                {confirmData?.merchantAccountTitle}
              </CustomText>
              <View style={{height: wp(1)}} />
              <CustomText
                style={{
                  padding: wp(1),
                  color: '#9ea3a6',
                  textAlign: isRtlState() ? 'left' : 'right',
                }}>
                Merchant Account
              </CustomText>
              <CustomText
                boldFont={true}
                style={{
                  padding: wp(1),
                  fontSize: wp(4.45),
                  textAlign: isRtlState() ? 'left' : 'right',
                }}>
                {confirmData?.toAccount}
                {/* Merchant Account */}
              </CustomText>
              <View style={{height: wp(1)}} />
              <CustomText
                style={{
                  padding: wp(1),
                  color: '#9ea3a6',
                  textAlign: isRtlState() ? 'left' : 'right',
                }}>
                {confirm ? 'Transaction Date & Time' : 'Date'}
              </CustomText>
              <CustomText
                boldFont={true}
                style={{
                  padding: wp(1),
                  fontSize: wp(4.45),
                  textAlign: isRtlState() ? 'left' : 'right',
                }}>
                {moment(confirmData?.date, 'YYYYMMDDHHmmss').format(
                  'DD MMM YYYY hh:mm A',
                )}

                {/* {moment(confirmData?.date).format('DD-MMM-YYYY')} */}
                {/* {confirmData?.date} */}
              </CustomText>

              <CustomText
                style={{
                  color: '#9ea3a6',
                  textAlign: isRtlState() ? 'left' : 'right',
                }}>
                Amount
              </CustomText>
              <CustomText
                boldFont={true}
                style={{
                  fontSize: wp(5),
                  textAlign: isRtlState() ? 'left' : 'right',
                }}>
                {currencyFormat(Number(confirmData.originalAmount))}
              </CustomText>
              <CustomText
                style={{
                  color: '#9EA3A6',
                  textAlign: isRtlState() ? 'left' : 'right',
                }}>
                Requested Amount
              </CustomText>
              <CustomText
                boldFont={true}
                style={{
                  fontSize: wp(5),
                  textAlign: isRtlState() ? 'left' : 'right',
                }}>
                {currencyFormat(Number(confirmData.requestedAmount))}
              </CustomText>

              {/* )} */}
            </View>
          </View>
          <View style={{height: wp(3)}} />

          {confirm ? amountContainer() : null}
          <View style={{height: wp(3)}} />
          {confirm ? (
            <View
              style={{
                width: '90%',
                height: hp(7),
                backgroundColor: Colors.subContainer,
                alignSelf: 'center',
                justifyContent: 'center',
                paddingHorizontal: wp(2),
                borderRadius: wp(1),
              }}>
              <CustomText
                style={{
                  fontSize: wp(3.45),
                }}>
                * Please enter amount equal or less than total amount
              </CustomText>
            </View>
          ) : null}
        </View>

        {/* <CustomAlert
          overlay_state={showAlertState}
          yesNoButtons={true}
          title={'Request To Pay'}
          alert_text={i18n['Do you want to proceed with the transaction.']}
          onPressYes={() => {
            changeAlertState(false);
            setRtpPayNow(() => ({
              ...RTP_DATA,
              customerEmail: email,
              customerMobile: phoneNumber,
            }));
            setTimeout(() => {
              currentModal === 'payNow'
                ? props.navigation.navigate('RTPMPIN', {payNowdata: rtpPayNow})
                : props.navigation.navigate('RTPMPIN', {
                    payLaterdata: rtpPayNow,
                  });
            }, 500);
          }}
          onPressCancel={() => {
            changeAlertState(false);
          }}
          onPressNo={() => {
            changeAlertState(false);
          }}
        /> */}

        {/* <SuccessModal
          visible={successModalState}
          message={'Request Acceptance Successfull'}
          // secondMessage={'Request Acceptance Successfull'}
          onPress_yes={() => {
            setSuccessModalState(false);
            props.navigation.navigate('Home');
          }}
        /> */}
      </ScrollView>
      <KeyboardAvoidingView
        keyboardVerticalOffset={hp(7)}
        behavior={'padding'}
        style={[globalStyling.buttonContainer]}>
        <View style={{marginTop: wp(3)}}>
          <CustomBtn
            btn_txt={confirm ? 'Confirm' : 'Request for Return'}
            accessibilityLabel="Tap to Proceed"
            onPress={() => {
              Keyboard.dismiss();
              setConfirm(true);

              confirm ? validation() : null;
            }}
            btn_width={wp(90)}
            backgroundColor={Colors.primary_green}
          />
        </View>
      </KeyboardAvoidingView>
    </View>
  );
}
