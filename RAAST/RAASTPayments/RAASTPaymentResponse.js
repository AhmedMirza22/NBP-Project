import React, {useState, useRef, useEffect} from 'react';
import {
  View,
  Text,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import SubHeader from '../../../Components/GlobalHeader/SubHeader/SubHeader';
import {currencyFormat, globalStyling, wp} from '../../../Constant';
import CustomTextField from '../../../Components/CustomTextField/CustomTextField';
import CustomBtn from '../../../Components/Custom_btn/Custom_btn';
import {Colors} from '../../../Theme';
import styles from './RAASTPaymentsStyle';
import {useSelector, useDispatch} from 'react-redux';
import i18n from '../../../Config/Language/LocalizeLanguageString';
import {
  sendFund,
  fundTransfer,
  catchError,
  serviceResponseCheck,
  setLoader,
  updateSessionToken,
  changeGlobalTransferAlertState,
  closeGlobalTransferAlert,
} from '../../../Redux/Action/Action';
import analytics from '@react-native-firebase/analytics';
import CustomAlert from '../../../Components/Custom_Alert/CustomAlert';
import {benefType, logs, tranType} from '../../../Config/Config';
import {Service, postTokenCall} from '../../../Service';
import moment from 'moment';
import {setCurrentFlow, setAppAlert} from '../../../Redux/Action/Action';
import {Message} from '../../../Constant/Messages';
import {check_email} from '../../../Helpers/Helper';
export default function RAASTPaymentResponse(props) {
  const ref1 = useRef();
  const ref2 = useRef();
  const ref3 = useRef();
  const dispatch = useDispatch();
  const fundTransferData = useSelector(
    (state) => state.reducers.fundTransferData,
  );
  const [comments, setComments] = useState('');
  const [email, setEmail] = useState(props.route.params?.data?.benefEmail);
  const [phoneNumber, setPhoneNumber] = useState('');
  const [proceedAlert, setProceedAlert] = useState(false);
  const overViewData = useSelector((state) => state.reducers.overViewData);
  useEffect(() => {
    setEmail(
      props.route.params?.data?.benefEmail
        ? props.route.params?.data?.benefEmail
        : '',
    );
    setPhoneNumber(
      props.route.params?.data?.benefMobile
        ? props.route.params?.data?.benefMobile
        : '',
    );
    props.navigation.addListener('focus', () => {
      dispatch(setCurrentFlow('Fund Transfer'));
      async function analyticsLog() {
        await analytics().logEvent('RaastPaymentResponseScreen');
      }
      analyticsLog();
    });
  }, []);
  const sendFunds = async () => {
    try {
      dispatch(setLoader(true));
      const response = await postTokenCall(Service.validate_Mpin_Otp, {
        accountNumber: props.route.params?.data.benefAccount
          ? props.route.params?.data.benefAccount
          : props.route.params?.data.toAccount,
        benefType: benefType.FundTransfer,
        imd: props.route.params?.data.imd
          ? props.route.params?.data.imd
          : '979898',
        isBenef: props.route.params?.data.isDirectPayment ? false : true,
        tranType: tranType.FundTransfer,
      });
      dispatch(updateSessionToken(response));
      logs.logResponse(response);
      if (response?.data?.responseCode === '00') {
        try {
          const response2 = await postTokenCall(
            Service.fundTransferPayment,
            {
              amount: props.route.params?.data.amount,
              benef: true,
              benefID: props.route.params?.data.benefID,
              comments: comments,
              fromAccount: props.route.params?.data.fromAccount,
              imd: props.route.params?.data.imd
                ? props.route.params?.data.imd
                : '979898',
              isOwnAccountTransfer: '0',
              otp: '',
              purposeOfPayment: props.route.params?.data.purposeOfPayment,
              rcvrEmailAddress: email,
              rcvrMobileNumber: phoneNumber,
              toAccount: props.route.params?.data.benefAccount
                ? props.route.params?.data.benefAccount
                : props.route.params?.data.toAccount,
              token: props.route.params?.data.token,
              validateOTP: true,
            },
            false,
            response?.headers?.['x-auth-next-token']
              ? response?.headers?.['x-auth-next-token']
              : response?.headers?.['x-auth-next-token'],
          );
          dispatch(updateSessionToken(response2));

          if (response2.data.responseCode === '00') {
            // props.navigation.navigate('ResponseDisplay', response2.data);
            // dispatch(setLoader(false));

            dispatch(setLoader(false));
            dispatch(
              changeGlobalTransferAlertState(true, props.navigation, {
                paymentType: 'Funds Transfer',
                amount: `${props.route.params?.data.amount}`,
                purposeOfPayment: props.route.params?.param?.purposeOfPayment
                  ? props.route.params?.param?.purposeOfPayment
                  : false,
                fromName: `${overViewData?.data?.accounts?.accountTitle}`,
                fromAccount: `${overViewData?.data?.accounts?.account}`,
                // toName: `${props.route.params?.data?.displayfromName}`,
                toAccount: `${
                  props.route.params?.data.benefAccount
                    ? props.route.params?.data.benefAccount
                    : props.route.params?.data.toAccount
                }`,
                rrn: response2?.data?.data?.rrn
                  ? response2?.data?.data?.rrn
                  : false,
                stanId: response2?.data?.data?.transactionDetails?.stan
                  ? response2?.data?.data?.transactionDetails?.stan
                  : false,
                currentDate: moment(new Date()).format('DD MMM, YYYY'),
                currentTime: moment(new Date()).format('hh:mm:ss a'),
                onPressClose: () => {
                  dispatch(closeGlobalTransferAlert(props.navigation));
                },
              }),
            );
          } else {
            dispatch(serviceResponseCheck(response2, props.navigation));
          }
        } catch (error) {
          dispatch(catchError(error));
        }
      } else {
        dispatch(serviceResponseCheck(response, props.navigation));
      }
    } catch (error) {
      dispatch(catchError(error));
    }
  };
  const checkPhone = () => {
    logs.log('asdajhgads=a-=d-asd>');

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

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : null}
      keyboardVerticalOffset={40}
      style={globalStyling.container}
      accessibilityLabel="Funds Transfer Response">
      <SubHeader
        navigation={props.navigation}
        title={'Fund Transfer'}
        description={'Transfer Funds to Any NBP account'}
      />
      <ScrollView showsVerticalScrollIndicator={false}>
        <Text style={styles.textforRAASt}>Please Confirm Details Below:</Text>
        <View style={styles.whiteContainer}>
          <View style={styles.rowContainer}>
            <Text style={styles.item}>From Account:</Text>
            <Text style={[styles.item, {textAlign: 'right'}]}>
              {props.route.params?.data.fromAccount}
            </Text>
          </View>
          <View style={styles.rowContainer}>
            <Text style={styles.item}>To Account:</Text>
            <Text style={[styles.item, {textAlign: 'right'}]}>
              {props.route.params?.data.toAccount}
            </Text>
          </View>
          <View style={styles.rowContainer}>
            <Text style={styles.item}>Account Title:</Text>
            <Text style={[styles.item, {textAlign: 'right'}]}>
              {fundTransferData?.title
                ? fundTransferData?.title
                : props.route.params?.data.title}
            </Text>
          </View>
          <View style={styles.rowContainer}>
            <Text style={styles.item}>Amount:</Text>
            <Text style={[styles.item, {textAlign: 'right'}]}>
              {currencyFormat(Number(props.route.params?.data.amount))}
            </Text>
          </View>
          <View style={styles.rowContainer}>
            <Text style={styles.item}>Date:</Text>
            <Text style={[styles.item, {textAlign: 'right'}]}>
              {props.route.params?.data.date}
            </Text>
          </View>
        </View>

        <View style={styles.marginVertical}>
          <CustomTextField
            accessibilityLabel="Enter Comments here"
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
            width={'90%'}
            maxLength={50}
            // keyboardType="phone-pad"
            backgroundColor={Colors.whiteColor}
            fontSize={wp(4.2)}
          />
        </View>
        <View style={styles.marginVertical}>
          <CustomTextField
            accessibilityLabel={phoneNumber}
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
            width={'90%'}
            maxLength={11}
            keyboardType="phone-pad"
            backgroundColor={Colors.whiteColor}
            fontSize={wp(4.2)}
          />
        </View>
        <View style={styles.marginVertical}>
          <CustomTextField
            accessibilityLabel={email}
            ref={ref3}
            // text_input={props.route.params?.data.benefEmail}
            placeholder={'Email (Optional)'}
            Textfield_label={''}
            text_input={email}
            onChangeText={(value) => {
              setEmail(value);
            }}
            keyboardType="email-address"
            width={'90%'}
            backgroundColor={Colors.whiteColor}
            fontSize={wp(4.2)}
          />
        </View>
        <View style={styles.marginVertical}>
          <CustomBtn
            btn_txt={'Submit'}
            accessibilityLabel="Tap to Proceed"
            onPress={() => {
              logs.log(
                'props.route.params?.data.isDirectPayment',
                props.route.params?.data,
              );
              if (props.route.params?.data.isDirectPayment) {
                if (validate()) {
                  setProceedAlert(true);
                }
              }
            }}
            btn_width={wp(50)}
            backgroundColor={Colors.primary_green}
          />
        </View>
        <CustomAlert
          overlay_state={proceedAlert}
          title={'Fund Transfer'}
          label={'Account Number'}
          alert_text={i18n['Do you want to proceed with the transaction.']}
          yesNoButtons={true}
          onPressYes={() => {
            setProceedAlert(false);
            setTimeout(() => {
              sendFunds();
              // dispatch(
              //   sendFund(
              //     token,
              //     props.navigation,
              //     props.route.params?.data.token,
              //     props.route.params?.data.benefAccount
              //       ? props.route.params?.data.benefAccount
              //       : props.route.params?.data.toAccount,
              //     props.route.params?.data.imd
              //       ? props.route.params?.data.imd
              //       : '979898',
              //     props.route.params?.data.amount,
              //     props.route.params?.data.benefID,
              //     props.route.params?.data.fromAccount,
              //     props.route.params?.data.purposeOfPayment,
              //     props.route.params?.data.benefEmail
              //       ? props.route.params?.data.benefEmail
              //       : '',
              //     props.route.params?.data.benefMobile
              //       ? props.route.params?.data.benefMobile
              //       : '',
              //     comments,
              //     props.route.params?.data.isDirectPayment,
              //     email,
              //     phoneNumber,
              //     () => {
              //       logs.log('onSuccess');
              //     },
              //   ),
              // );
            }, 500);
          }}
          onPressNo={() => {
            setProceedAlert(false);
            setTimeout(() => {
              props.navigation.navigate('Home');
            }, 500);
          }}
          onPressCancel={() => setProceedAlert(false)}
        />
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
