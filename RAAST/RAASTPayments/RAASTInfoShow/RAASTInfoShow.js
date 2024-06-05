import React, {useState, useRef, useEffect} from 'react';
import {View, Text, KeyboardAvoidingView} from 'react-native';
import styles from './RAASTInfoShowStyle';
import Custom_btn from '../../../../Components/Custom_btn/Custom_btn';
import CustomText from '../../../../Components/CustomText/CustomText';
import {globalStyling, hp, wp} from '../../../../Constant';
import {Colors} from '../../../../Theme';
import GlobalHeader from '../../../../Components/GlobalHeader/GlobalHeader';
import SubHeader from '../../../../Components/GlobalHeader/SubHeader/SubHeader';
import {logs} from '../../../../Config/Config';
import color from 'color';
import {ScrollView} from 'react-native';
import {check_email, maskedAccount} from '../../../../Helpers/Helper';
import i18n from '../../../../Config/Language/LocalizeLanguageString';
import {
  changeGlobalTransferAlertState,
  closeGlobalTransferAlert,
  raastpyamentrequest,
  setAppAlert,
} from '../../../../Redux/Action/Action';
import CustomAlert from '../../../../Components/Custom_Alert/CustomAlert';
import {useSelector, useDispatch} from 'react-redux';
import moment from 'moment';
import CustomTextField from '../../../../Components/CustomTextField/CustomTextField';
import {Message} from '../../../../Constant/Messages';
import analytics from '@react-native-firebase/analytics';
export default function RAASTInfoShow(props) {
  const ref2 = useRef();
  const ref3 = useRef();
  const dispatch = useDispatch();
  const acc_info = useSelector(
    (state) => state.reducers.overViewData?.data?.accounts,
  );
  const overViewData = useSelector((state) => state.reducers.overViewData);
  const [proceedAlert, setProceedAlert] = useState(false);
  const [comment, setComment] = useState('');
  const [email, setEmail] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const info = props.route.params?.param;
  const screen = props.route.params?.screen;
  const infoAlias = props.route.params?.paramsAlias?.data;
  const loginResponse = useSelector((state) => state.reducers.loginResponse);
  const paramAlias = props?.route?.params?.paramsAlias;

  logs.log('on Title Fetch Screen altaf', info);
  logs.log('props.route.paramssss altaf', props.route.params);

  useEffect(() => {
    async function analyticsLog() {
      await analytics().logEvent('RaastInfoShowscreen');
    }
    analyticsLog();

    if (info?.email) {
      setEmail(info?.email);
    }
    if (info?.phone) {
      setPhoneNumber(info?.phone);
    }
  }, []);
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
  const headview_request_succes = () => {
    return (
      <View>
        <SubHeader
          navigation={props.navigation}
          title={'RAAST Payments'}
          description={
            screen == 'iban'
              ? 'Pay by IBAN'
              : screen == 'Qr'
              ? 'Pay by Qr'
              : 'Pay by RAAST ID'
          }
        />
      </View>
    );
  };
  const text_view = () => {
    return (
      <View
        style={{
          alignSelf: 'center',
          justifyContent: 'flex-start',
          // elevation: 6,
          borderRadius: 10,
          width: wp(90),
          backgroundColor: Colors.subContainer,
          marginTop: wp(6),
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
            IBAN
          </CustomText>
          <CustomText
            boldFont={true}
            style={{padding: wp(1), fontSize: wp(4.2)}}>
            {info?.source_iban
              ? info?.source_iban
              : props.route.params?.paramsAlias?.source_iban}
          </CustomText>
          <View style={{height: wp(2)}} />
          <CustomText style={{padding: wp(1), color: '#9ea3a6'}}>
            Purpose of Payment
          </CustomText>
          <CustomText
            boldFont={true}
            style={{padding: wp(1), fontSize: wp(4.5)}}>
            {info?.pay_pur
              ? info?.pay_pur
              : props.route.params?.paramsAlias?.pay_pur}
          </CustomText>
        </View>
        <View style={{height: wp(5)}} />
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
          <CustomText style={{padding: wp(1), color: '#9ea3a6'}}>
            Name
          </CustomText>
          <CustomText boldFont={true} style={{fontSize: wp(5), padding: wp(1)}}>
            {screen == 'iban' || screen == 'Qr'
              ? info?.acctitle
              : `${infoAlias?.name} ${infoAlias?.surname}`}
          </CustomText>
          {screen == 'iban' || screen == 'Qr' ? null : (
            <>
              <CustomText style={{padding: wp(1), color: '#9ea3a6'}}>
                Mobile Number
              </CustomText>
              <CustomText
                boldFont={true}
                style={{fontSize: wp(5), padding: wp(1)}}>
                {screen == 'iban' || screen == 'Qr'
                  ? info?.acctitle
                  : `${info?.idValue}`}
              </CustomText>
            </>
          )}
          {/* <View style={{height: wp(3)}} /> */}
          {/* <CustomText style={{padding: wp(1), color: '#9ea3a6'}}>
            IBAN
          </CustomText>
          <CustomText
            boldFont={true}
            style={{padding: wp(1), fontSize: wp(4.74)}}>
            {screen == 'iban' || screen == 'Qr'
              ? info?.receiveriban
              : infoAlias?.iban}
          </CustomText> */}
          {screen == 'iban' ? (
            <>
              <View style={{height: wp(3)}} />
              <CustomText style={{padding: wp(1), color: '#9ea3a6'}}>
                IBAN
              </CustomText>
              <CustomText
                boldFont={true}
                style={{padding: wp(1), fontSize: wp(4.5)}}
                numberOfLines={1}
                ellipsizeMode={'head'}>
                {/* {info?.receiveriban} */}
                {maskedAccount(
                  info?.receiveriban ? info?.receiveriban : info?.iban,
                )}
                {/* {props.route.params?.screenRoute === 'iban'
                  ? String(info?.receiveriban).substr(0, 4)
                  : String(info?.receiveriban).substr(0, 4)}
                XXXXXXXXXXXXXXXX
                {props.route.params?.screenRoute === 'iban'
                  ? String(info?.receiveriban).substr(20, 24)
                  : String(info?.receiveriban).substr(20, 24)} */}
              </CustomText>
            </>
          ) : null}
          {screen == 'iban' || screen == 'Qr' ? (
            <>
              <CustomText style={{padding: wp(1), color: '#9ea3a6'}}>
                Bank
              </CustomText>
              <CustomText
                boldFont={true}
                style={{padding: wp(1), fontSize: wp(4.45)}}>
                {info?.benef_bank
                  ? info?.benef_bank
                  : props.route.params?.paramsAlias?.benef_bank}
              </CustomText>
            </>
          ) : null}
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
            Rs.{' '}
            {info?.amount
              ? info?.amount?.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')
              : props.route.params?.paramsAlias?.amount
                  ?.toString()
                  .replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
          </CustomText>
        </View>
      </View>
    );
  };
  const phoneEmail = () => {
    return (
      <View>
        <View style={styles.marginVertical}>
          <CustomTextField
            accessibilityLabel="Enter Mobile Number"
            ref={ref3}
            placeholder={'Mobile Number (Optional)'}
            Textfield_label={''}
            text_input={phoneNumber}
            onChangeText={(value) => {
              setPhoneNumber(String(value).replace(/[^0-9]/g, ''));
            }}
            maxLength={11}
            width={'90%'}
            keyboardType={'number-pad'}
            backgroundColor={'white'}
            fontSize={wp(4.2)}
          />
        </View>
        <View style={styles.marginVertical}>
          <CustomTextField
            accessibilityLabel="Enter comments"
            ref={ref3}
            placeholder={'Comment'}
            Textfield_label={''}
            text_input={comment}
            onChangeText={(value) => {
              setComment(value);
            }}
            maxLength={50}
            width={'90%'}
            keyboardType="email-address"
            backgroundColor={'white'}
            fontSize={wp(4.2)}
          />
        </View>
        <View style={styles.marginVertical}>
          <CustomTextField
            accessibilityLabel="Enter Email"
            ref={ref2}
            placeholder={'Email (Optional)'}
            Textfield_label={''}
            text_input={email}
            onChangeText={(value) => {
              setEmail(value);
            }}
            onSubmitEditing={() => {
              ref3.current.focus();
            }}
            returnKeyType={'next'}
            width={'90%'}
            maxLength={50}
            keyboardType="email-address"
            backgroundColor={'white'}
            fontSize={wp(4.2)}
          />
        </View>
      </View>
    );
  };
  logs.log('paramAlias', paramAlias);
  logs.log('shortName', props?.route?.params?.shortName);

  const benefDirectPayment = () => {
    logs.log('987297123------->', props.route.params);
    logs.log('infoAlias?.servicer------->', infoAlias?.servicer);
    logs.log(
      'screen------->',
      screen == 'iban' ? info?.memberid : infoAlias?.servicer,
      'screen------->',
      screen,
    );

    screen == 'iban' ? info?.memberid : infoAlias?.servicer;

    let responseObjAlias = {
      amount: info?.amount ? info?.amount : paramAlias.amount,
      fee: '0',
      source_iban: info?.source_iban
        ? info?.source_iban
        : paramAlias.source_iban,
      idType: 'CNIC',
      idValue: acc_info?.cnic,
      isbenef: true,
      narration: 'Raast Payment by alias',
      otp: '',
      pay_pur_id: info?.pay_pur_id ? info?.pay_pur_id : paramAlias.pay_pur_id,
      rcvrEmailAddress: '',
      rcvrMobileNumber: '',
      pay_pur: info?.pay_pur
        ? info?.pay_pur
        : props.route.params?.paramsAlias?.pay_pur,
      receiverName: paramAlias.acctitle
        ? paramAlias.acctitle
        : screen == 'iban'
        ? infoAlias?.acctitle
        : `${infoAlias?.name} `,
      receiveriban: paramAlias.receiveriban
        ? paramAlias.receiveriban
        : screen == 'iban'
        ? info?.receiveriban
        : infoAlias?.iban,
      memberid: screen == 'iban' ? info?.memberid : infoAlias?.servicer,
      comments: comment,
      name: info?.name,
      transactionDate: moment(new Date()).format('YYYY-MM-DD'),
      transactionTime: moment(new Date()).format('hh:MM:SS'),
      paymentMethod: screen,
      receiverAlias: paramAlias.acctitle
        ? paramAlias.acctitle
        : screen == 'iban'
        ? infoAlias?.acctitle
        : `${infoAlias?.name} `,
      shortName: props.route.params?.paramsAlias?.data?.benefAlias
        ? props.route.params?.paramsAlias?.data?.benefAlias
        : null,
      senderName: loginResponse?.details?.accountTitle,
      paymentPurpose: paramAlias?.purposeOfPayment
        ? paramAlias?.purposeOfPayment
        : props.route.params?.param?.purposeOfPayment,
      memberid: paramAlias?.memberid
        ? paramAlias?.memberid
        : screen == 'iban'
        ? info?.memberid
        : infoAlias?.servicer,
    };
    logs.log('2873987213-->', responseObjAlias);
    dispatch(
      raastpyamentrequest(
        'ALIASbybenef',
        props.navigation,
        responseObjAlias,
        (response) => {
          dispatch(
            changeGlobalTransferAlertState(true, props.navigation, {
              benefAlias: props.route.params?.paramsAlias?.data?.benefAlias,
              paymentType: 'RAAST Payment',
              amount: props.route.params?.param?.amount
                ? props.route.params?.param?.amount
                : paramAlias.amount,
              purposeOfPayment: info?.pay_pur
                ? info?.pay_pur
                : props.route.params?.param?.purposeOfPayment
                ? props.route.params?.param?.purposeOfPayment
                : false,
              fromName: `${overViewData?.data?.accounts?.accountTitle}`,
              fromAccount: `${
                screen == 'iban'
                  ? overViewData?.data?.accounts?.iban
                  : overViewData?.data?.accounts?.account
              }`,
              toName: `${responseObjAlias?.receiverName}`,
              toAccount: `${
                screen == 'iban'
                  ? info?.receiveriban
                  : responseObjAlias?.receiveriban
              }`,
              rrn: response?.data?.data?.rrn
                ? response?.data?.data?.rrn
                : false,
              stanId: response?.data?.data?.stan
                ? response?.data?.data?.stan
                : false,
              currentDate: moment(new Date()).format('DD MMM, YYYY'),
              currentTime: moment(new Date()).format('hh:mm:ss a'),
              comments: responseObjAlias?.comments,
              onPressClose: () => {
                dispatch(closeGlobalTransferAlert(props.navigation));
              },
            }),
          );
        },
      ),
    );
  };
  return (
    <View
      style={{backgroundColor: Colors.backgroundColor, flex: 1}}
      accessibilityLabel="RAAST Information Screen">
      {/* {request_message()} */}
      {headview_request_succes()}
      <ScrollView contentContainerStyle={globalStyling.scrollContent}>
        <View style={{flex: 1}}>
          {text_view()}
          {phoneEmail()}
        </View>
        <CustomAlert
          overlay_state={proceedAlert}
          title={'Fund Transfer'}
          label={'Account Number'}
          alert_text={i18n['Do you want to proceed with the transaction.']}
          yesNoButtons={true}
          onPressYes={() => {
            setProceedAlert(false);
            // logs.log('params befor going to lahore', props.route.params?.screen);
            benefDirectPayment();
            // beneficiaryOtherPayment();
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
      <KeyboardAvoidingView
        keyboardVerticalOffset={hp(6)}
        behavior={'padding'}
        style={globalStyling.buttonContainer}>
        <Custom_btn
          btn_txt={'Pay Now'}
          onPress={() => {
            if (infoAlias?.benefId) {
              setProceedAlert(true);
              // benefDirectPayment()
            } else if (props.route.params?.param?.benefId) {
              setProceedAlert(true);
              // benefDirectPayment()
            } else {
              let newparam = props.route.params?.param;
              newparam.shortName = props.route.params?.shortName;
              newparam.benefMobile = phoneNumber;
              newparam.benefEmail = email;
              newparam.comments = comment;
              if (validate()) {
                props.navigation.navigate('RAASTPaymentMpin', {
                  from_screen: screen,
                  requestobj: info,
                  requestobjAlias: infoAlias,
                  ...newparam,
                });
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
