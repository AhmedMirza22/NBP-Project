import React, {useState, useRef, useEffect} from 'react';
import {
  View,
  ScrollView,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import CustomText from '../../../../Components/CustomText/CustomText';
import SubHeader from '../../../../Components/GlobalHeader/SubHeader/SubHeader';
import {currencyFormat, globalStyling, hp, wp} from '../../../../Constant';
import CustomTextField from '../../../../Components/CustomTextField/CustomTextField';
import CustomBtn from '../../../../Components/Custom_btn/Custom_btn';
import {Colors} from '../../../../Theme';
import i18n from '../../../../Config/Language/LocalizeLanguageString';
import {useSelector, useDispatch} from 'react-redux';
import {
  ibftPayOtp,
  setCurrentFlow,
  changeGlobalTransferAlertState,
  closeGlobalTransferAlert,
  setLoader,
  serviceResponseCheck,
  catchError,
  updateSessionToken,
  setAppAlert,
  setUserObject,
  raastPaybyIBANTitleFetch,
} from '../../../../Redux/Action/Action';
import analytics from '@react-native-firebase/analytics';

import moment from 'moment';
import CustomAlert from '../../../../Components/Custom_Alert/CustomAlert';
import {benefType, logs, tranType} from '../../../../Config/Config';
import {Service, postTokenCall} from '../../../../Service';
import {check_email, maskedAccount} from '../../../../Helpers/Helper';
import {Message} from '../../../../Constant/Messages';
import store from '../../../../Redux/Store/Store';
import {Keyboard} from 'react-native';
export default function InterBankFundTransferDetail(props) {
  const acc_info = useSelector(
    (state) => state.reducers.overViewData?.data?.accounts,
  );
  const ref1 = useRef();
  const ref2 = useRef();
  const ref3 = useRef();
  const [comments, setComments] = useState('');
  const [email, setEmail] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [proceedAlert, setProceedAlert] = useState(false);
  const overViewData = useSelector((state) => state.reducers.overViewData);

  const userObject = useSelector((state) => state?.reducers?.userObject);
  const ibftPaymentConstant = userObject?.ftPayment
    ? userObject?.ftPayment
    : {};
  const isCertainBeneficiaryFlow = ibftPaymentConstant?.isCertainBeneficiaryFlow
    ? true
    : false;
  const dispatch = useDispatch();
  useEffect(() => {
    return props.navigation.addListener('focus', () => {
      dispatch(setCurrentFlow('Interbank Fund Transfer'));
      async function analyticsLog() {
        await analytics().logEvent('IBFTFundTransferDetailScreen');
      }
      analyticsLog();
    });
  }, []);
  logs.log('18273812683716312--<', ibftPaymentConstant);

  const route = props?.route?.params?.data;

  useEffect(() => {
    emailPhoneAndCommentHandling();
  }, []);

  const emailPhoneAndCommentHandling = () => {
    setEmail(
      ibftPaymentConstant?.benefEmail ? ibftPaymentConstant?.benefEmail : email,
    );
    setPhoneNumber(
      ibftPaymentConstant?.benefMobile
        ? ibftPaymentConstant?.benefMobile
        : ibftPaymentConstant?.benefPhone
        ? ibftPaymentConstant?.benefPhone
        : phoneNumber,
    );
    setComments(
      ibftPaymentConstant?.comments ? ibftPaymentConstant?.comments : comments,
    );
  };

  const ibftBenefPayment = async () => {
    try {
      dispatch(setLoader(true));
      const response = await postTokenCall(Service.validate_Mpin_Otp, {
        accountNumber: ibftPaymentConstant?.toAccount
          ? ibftPaymentConstant?.toAccount.toUpperCase()
          : ibftPaymentConstant?.toAccount,
        isBenef: true,
        benefType: benefType.IBFT,
        imd: ibftPaymentConstant?.imd,
        tranType: tranType.IBFT,
      });

      dispatch(updateSessionToken(response));
      if (response?.data?.responseCode === '00') {
        try {
          const response2 = await postTokenCall(
            Service.ibftPayment,
            {
              amount: ibftPaymentConstant?.amount,
              benefID: isCertainBeneficiaryFlow
                ? ibftPaymentConstant?.benefId
                  ? ibftPaymentConstant?.benefId
                  : ibftPaymentConstant?.benefID
                : ibftPaymentConstant?.benefID
                ? ibftPaymentConstant?.benefID
                : ibftPaymentConstant?.benefId,
              comments: comments,
              email: ibftPaymentConstant?.email,
              fromAccount: ibftPaymentConstant?.fromAccount,
              fromAccountType: ibftPaymentConstant?.accountType,
              ibftType: '9999',
              imd: ibftPaymentConstant?.imd,
              isBenef: true,
              otp: '',
              rcvrEmailAddress: email,
              rcvrMobileNumber: phoneNumber,
              toAccount: ibftPaymentConstant?.toAccount
                ? ibftPaymentConstant?.toAccount.toUpperCase()
                : ibftPaymentConstant?.toAccount,
              token: ibftPaymentConstant?.token,
              validateOTP: true,
              purposeOfPayment: ibftPaymentConstant?.purposeOfPayment,
            },
            false,
            response?.headers?.['x-auth-next-token']
              ? response?.headers?.['x-auth-next-token']
              : response?.headers?.['x-auth-next-token'],
          );
          dispatch(updateSessionToken(response2));

          if (response2.data.responseCode === '00') {
            const dataObject = response2?.data?.data?.transactionDetails;
            dispatch(setLoader(false));
            dispatch(
              changeGlobalTransferAlertState(true, props.navigation, {
                benefAlias: `${
                  ibftPaymentConstant?.benefAlias
                    ? ibftPaymentConstant?.benefAlias
                    : ibftPaymentConstant?.shortName
                }`,
                paymentType: 'Inter Bank Fund Transfer',
                amount: `${ibftPaymentConstant?.amount}`,
                fromName: `${overViewData?.data?.accounts?.accountTitle}`,
                fromAccount: `${ibftPaymentConstant?.fromAccount}`,
                toName: `${ibftPaymentConstant?.title}`,
                rrn: response2?.data?.data?.rrn
                  ? response2?.data?.data?.rrn
                  : false,
                stanId: response2?.data?.data?.transactionDetails?.stan
                  ? response2?.data?.data?.transactionDetails?.stan
                  : false,
                purposeOfPayment: ibftPaymentConstant?.purposeOfPaymentString,
                toAccount: `${ibftPaymentConstant?.toAccount}`,
                currentDate: `${moment(dataObject?.date, 'MM:DD').format(
                  'DD MMM, YYYY',
                )}`,
                comments: `${ibftPaymentConstant?.comments}`,
                currentTime: `${dataObject?.time}`,
                onPressClose: () => {
                  dispatch(closeGlobalTransferAlert(props.navigation));
                },
              }),
            );
          } else {
            dispatch(serviceResponseCheck(response2, props.navigation, true));
          }
        } catch (error) {
          dispatch(setLoader(false));

          dispatch(catchError(error));
        }
      } else {
        dispatch(setLoader(false));

        dispatch(serviceResponseCheck(response, props.navigation));
      }
    } catch (error) {
      dispatch(setLoader(false));

      dispatch(catchError(error));
    }
  };
  const raastIbanPayment = async () => {
    try {
      dispatch(setLoader(true));
      const response = await postTokenCall(Service.raastPaymentRequest, {
        addBenef: false,
        amount: ibftPaymentConstant?.amount,
        benefiAlias: ibftPaymentConstant?.shortName,
        fee: '0',
        iban: ibftPaymentConstant?.iban,
        idType: 'CNIC',
        idValue: acc_info?.cnic,
        isBenef: ibftPaymentConstant?.isPayBenef,
        narration: ibftPaymentConstant?.narration,
        otp: '',
        paymentMethod: ibftPaymentConstant?.paymentMethod, //ADDED BY TUFAIL BHAi FOR PAYEMNTS
        paymentPurpose: ibftPaymentConstant?.purposeOfPayment,
        rcvrEmailAddress: '',
        rcvrMobileNumber: '',
        receiverAlias: ibftPaymentConstant?.benefAccount, //ADDED BY UMAR
        receiverName: ibftPaymentConstant?.toTitle,
        receiverParticipantCode: ibftPaymentConstant?.memberId,
        receiveriban: ibftPaymentConstant?.receiveriban,
        senderName: ibftPaymentConstant?.accountTitle,
        transactionDate: moment(new Date()).format('YYYY-MM-DD'),
        transactionTime: moment(new Date()).format('hh:MM:SS'),
      });

      dispatch(updateSessionToken(response));
      if (response?.data?.responseCode === '00') {
        logs.log('[payment fonr ]');
        dispatch(setLoader(false));
        dispatch(updateSessionToken(response));
        dispatch(
          changeGlobalTransferAlertState(true, props.navigation, {
            benefAlias: ibftPaymentConstant?.shortName,
            paymentType: 'RAAST',
            amount: `${ibftPaymentConstant?.amount}`,
            fromName: `${ibftPaymentConstant?.accountTitle}`,
            fromAccount: `${ibftPaymentConstant?.fromAccount}`,
            toName: `${ibftPaymentConstant?.title}`,
            rrn: response?.data?.data?.rrn ? response?.data?.data?.rrn : false,
            stanId: response?.data?.data?.transactionDetails?.stan
              ? response?.data?.data?.transactionDetails?.stan
              : false,
            purposeOfPayment: ibftPaymentConstant?.popText,
            toAccount: `${ibftPaymentConstant?.toAccount}`,
            currentDate: moment(new Date()).format('YYYY-MM-DD'),
            comments: `${ibftPaymentConstant?.comments}`,
            currentTime: moment(new Date()).format('hh:MM:SS'),
            onPressClose: () => {
              dispatch(closeGlobalTransferAlert(props.navigation));
            },
          }),
        );
      } else {
        dispatch(setLoader(false));

        dispatch(serviceResponseCheck(response, props.navigation));
      }
    } catch (error) {
      dispatch(setLoader(false));

      dispatch(catchError(error));
    }
  };

  const checkPhone = () => {
    if (phoneNumber.length === 0) {
      return true;
    } else if (phoneNumber.length === 11) {
      return true;
    } else {
      dispatch(setAppAlert(Message.invalidPhoneNumber));
      return false;
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

  return (
    <View style={[styles.container, {backgroundColor: Colors.backgroundColor}]}>
      <SubHeader
        navigation={props.navigation}
        title={'Transfer to IBAN/Account No'}
        description={'Transfer funds to other bank accounts'}
        headerFont={wp(5)}

        // transfers={true}
      />
      <ScrollView
        // style={{padding: wp(2), backgroundColor: '#f3f4f4'}}
        contentContainerStyle={globalStyling.scrollContent}
        showsVerticalScrollIndicator={false}>
        <View style={styles.container}>
          <View
            style={{
              alignSelf: 'center',
              justifyContent: 'flex-start',
              // elevation: 6,
              borderWidth: 1,
              // borderColor: '#cfd1d3',
              borderRadius: 8,
              width: wp(90),
              borderColor: Colors.textFieldBorderColor,
              backgroundColor: Colors.subContainer,
              marginTop: wp(1),
              // height: wp(135),
              padding: wp(2),
            }}>
            <View style={{padding: wp(1)}}>
              <CustomText
                style={{left: wp(1), fontSize: wp(4.5), color: '#9ea3a6'}}>
                From
              </CustomText>
            </View>
            <View
              style={{
                // height: wp(10),
                backgroundColor: Colors.childContainer,
                width: wp(80),
                alignSelf: 'center',
                borderRadius: wp(1.5),
                padding: wp(4),
              }}>
              <CustomText style={{padding: wp(1), color: '#9ea3a6'}}>
                Account Number
              </CustomText>
              <CustomText
                boldFont={true}
                style={{padding: wp(0.8), fontSize: wp(4.45)}}>
                {ibftPaymentConstant?.fromAccount
                  ? ibftPaymentConstant?.fromAccount
                  : ''}
              </CustomText>
            </View>
            <View style={{height: wp(1)}} />
            <View style={{padding: wp(1)}}>
              <CustomText
                style={{left: wp(1), fontSize: wp(4.5), color: '#9ea3a6'}}>
                To
              </CustomText>
            </View>
            <View
              style={{
                // height: wp(10),
                backgroundColor: Colors.childContainer,
                width: wp(80),
                alignSelf: 'center',
                borderRadius: wp(1.5),
                padding: wp(4),
              }}>
              {ibftPaymentConstant?.shortName ? (
                <>
                  <CustomText style={{padding: wp(1), color: '#9EA3A6'}}>
                    Short Name
                  </CustomText>
                  <CustomText
                    boldFont={true}
                    style={{padding: wp(0.8), fontSize: wp(4.5)}}>
                    {ibftPaymentConstant?.benefAlias
                      ? ibftPaymentConstant?.benefAlias
                      : ibftPaymentConstant?.shortName}
                  </CustomText>
                </>
              ) : null}
              <CustomText style={{padding: wp(1), color: '#9ea3a6'}}>
                Account Title
              </CustomText>
              <CustomText
                boldFont={true}
                style={{padding: wp(0.8), fontSize: wp(4.5)}}>
                {ibftPaymentConstant?.title
                  ? ibftPaymentConstant.title
                  : ibftPaymentConstant?.accountTitle}
              </CustomText>
              {/* <View style={{height: wp(2)}}/> */}
              <CustomText style={{padding: wp(1), color: '#9ea3a6'}}>
                Account Number
              </CustomText>
              <CustomText
                boldFont={true}
                style={{padding: wp(0.8), fontSize: wp(4.5)}}
                numberOfLines={1}
                ellipsizeMode={'head'}>
                {ibftPaymentConstant?.toAccount
                  ? maskedAccount(ibftPaymentConstant?.toAccount)
                  : ''}
              </CustomText>
              <CustomText style={{padding: wp(1), color: '#9ea3a6'}}>
                Date
              </CustomText>
              <CustomText
                boldFont={true}
                style={{padding: wp(0.8), fontSize: wp(4.45)}}>
                {moment().format('YYYY-MM-DD hh:mm:ss A')}
              </CustomText>
            </View>
            <View style={{height: wp(5)}} />
            <View
              style={{
                // height: wp(10),
                flexDirection: 'row',
                backgroundColor: Colors.childContainer,
                width: wp(80),
                alignSelf: 'center',
                borderRadius: wp(1.5),
                padding: wp(4),
                justifyContent: 'space-between',
              }}>
              <CustomText style={{alignSelf: 'center', color: '#9ea3a6'}}>
                Amount
              </CustomText>
              <CustomText boldFont={true} style={{fontSize: wp(5)}}>
                {currencyFormat(Number(ibftPaymentConstant?.amount))}
              </CustomText>
            </View>
          </View>
          <View style={{height: wp(2)}} />
          <CustomTextField
            accessibilityLabel="Enter Comments"
            ref={ref1}
            placeholder={'Comments (Optional)'}
            Textfield_label={''}
            onChangeText={(value) => {
              setComments(value);
            }}
            onSubmitEditing={() => {
              ref2.current.focus();
            }}
            returnKeyType={'next'}
            width={'93%'}
            maxLength={50}
            // keyboardType="phone-pad"
            backgroundColor={'white'}
            fontSize={wp(4.2)}
          />
          <View style={{height: wp(2)}} />
          <CustomTextField
            accessibilityLabel="Enter Phone Number"
            ref={ref2}
            placeholder={'Phone (Optional)'}
            Textfield_label={''}
            text_input={phoneNumber}
            onChangeText={(value) => {
              setPhoneNumber(String(value).replace(/[^0-9]/g, ''));
            }}
            onSubmitEditing={() => {
              ref3.current.focus();
            }}
            returnKeyType={Platform.OS === 'ios' ? 'done' : 'next'}
            width={'93%'}
            maxLength={11}
            keyboardType="phone-pad"
            backgroundColor={'white'}
            fontSize={wp(4.2)}
          />
          <View style={{height: wp(2)}} />
          <CustomTextField
            accessibilityLabel="Enter Email"
            ref={ref3}
            // text_input={ibftPaymentConstant.benefEmail}
            placeholder={'Email (Optional)'}
            Textfield_label={''}
            text_input={email}
            onChangeText={(value) => {
              setEmail(value);
            }}
            keyboardType={'email-address'}
            width={'93%'}
            backgroundColor={'white'}
            fontSize={wp(4.2)}
          />

          <View style={{height: wp(2)}} />

          <View style={{height: wp(2)}} />
        </View>

        <CustomAlert
          overlay_state={proceedAlert}
          title={'Inter Bank Fund Transfer'}
          label={'Account Number'}
          alert_text={i18n['Do you want to proceed with the transaction.']}
          yesNoButtons={true}
          onPressYes={() => {
            if (
              ibftPaymentConstant?.paymentMethod === 'iban' ||
              ibftPaymentConstant?.paymentMethod === 'paybyaccount'
            ) {
              setProceedAlert(false);
              raastIbanPayment();
            } else {
              setProceedAlert(false);
              ibftBenefPayment();
            }
          }}
          onPressNo={() => {
            setProceedAlert(false);
            setTimeout(() => {
              props.navigation.goBack();
            }, 300);
          }}
          onPressCancel={() => setProceedAlert(false)}
        />
      </ScrollView>
      {/* <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : null}
        keyboardVerticalOffset={40}
        style={globalStyling.buttonContainer}
        accessibilityLabel="IBFT Details"> */}
      <KeyboardAvoidingView
        keyboardVerticalOffset={hp(7)}
        behavior={'padding'}
        style={globalStyling.buttonContainer}>
        <CustomBtn
          btn_txt={'Continue'}
          accessibilityLabel="Tap to Proceed"
          onPress={() => {
            Keyboard.dismiss();
            //   setProceedAlert(true);
            let routeObject = {
              comments,
              phoneNumber,
              email,
              ...ibftPaymentConstant?.purposeOfPayment?.id,
              ...ibftPaymentConstant,
            };

            dispatch(
              setUserObject({
                ftPayment: {
                  ...store.getState().reducers.userObject.ftPayment,
                  comments,
                  phoneNumber,
                  email,
                },
              }),
            );
            if (
              !ibftPaymentConstant?.isDirectPayment ||
              isCertainBeneficiaryFlow
            ) {
              if (validate()) {
                route === 'AccountNumber'
                  ? dispatch(ibftPayOtp(props.navigation, routeObject))
                  : setProceedAlert(true);
              }
            } else {
              if (validate()) {
                dispatch(ibftPayOtp(props.navigation, routeObject));
              }
            }
          }}
          btn_width={wp(90)}
          backgroundColor={Colors.primary_green}
        />
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  text: {
    width: '90%',
    alignSelf: 'center',
    fontSize: wp(4),
    paddingHorizontal: wp(3),
    paddingVertical: wp(4),
    marginVertical: wp(3),
    backgroundColor: 'white',
  },
  whiteContainer: {
    backgroundColor: 'white',
    width: '90%',
    alignSelf: 'center',
  },
  rowContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  item: {
    fontSize: wp(4),
    marginVertical: wp(1),
    paddingHorizontal: wp(1),
    width: '50%',
  },
  marginVertical: {
    marginVertical: wp(1.5),
  },
});
