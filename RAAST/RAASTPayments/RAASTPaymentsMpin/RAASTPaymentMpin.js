import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  Keyboard,
  ScrollView,
  BackHandler,
  Image,
} from 'react-native';
import {
  globalStyling,
  smoothCodeInputStyle,
  validateOnlyNumberInput,
  wp,
} from '../../../../Constant';

import GlobalHeader from '../../../../Components/GlobalHeader/GlobalHeader';
import SubHeader from '../../../../Components/GlobalHeader/SubHeader/SubHeader';
import {Colors, Images} from '../../../../Theme';
import {useTheme} from '../../../../Theme/ThemeManager';
import SmoothPinCodeInput from 'react-native-smooth-pincode-input';
import {
  raastpyamentrequest,
  setLoader,
  updateSessionToken,
  serviceResponseCheck,
  catchError,
  changeGlobalTransferAlertState,
  closeGlobalTransferAlert,
} from '../../../../Redux/Action/Action';
import analytics from '@react-native-firebase/analytics';
import {postTokenCall, Service} from '../../../../Config/Service';
import {useSelector, useDispatch} from 'react-redux';
import moment from 'moment';
import {logs} from '../../../../Config/Config';
import CustomText from '../../../../Components/CustomText/CustomText';

export default function RAASTPaymentMpin(props) {
  logs.log(props);
  const dispatch = useDispatch();
  const {activeTheme} = useTheme();
  const [mpin, setMpin] = useState('');
  const responseObj = props.route.params?.requestobj;
  const responseObjAliass = props.route.params?.requestobjAlias;
  const screen_status = props.route.params?.from_screen;
  const overViewData = useSelector((state) => state.reducers.overViewData);
  const loginResponse = useSelector((state) => state.reducers.loginResponse);
  const propsReceived = props.route.params;

  const acc_info = useSelector(
    (state) => state.reducers.overViewData?.data?.accounts,
  );
  const userObject = useSelector(
    (state) => state?.reducers?.userObject?.ftPayment,
  );

  useEffect(() => {
    async function analyticsLog() {
      await analytics().logEvent('RAASTPaymentMpin');
    }
    analyticsLog();

    logs.log(
      'params RECEIVEING ON RAASAT PAYMENT MPIN SCREEN--- ',
      propsReceived,
    );
    logs.log(
      'params RECEIVEING ON RAASAT PAYMENT MPIN SCREEN---responseObj ',
      responseObj,
    );
    logs.log('propsReceived?.--- ', propsReceived);
    logs.log(
      'propsReceived?.purposeOfPayment--- ',
      propsReceived?.requestobj?.purposeOfPayment,
    );
    logs.log(
      'propsReceived?.paymentMethod--- ',
      propsReceived?.requestobj?.paymentMethod,
    );
    if (mpin.length === 4) {
      logs.log(
        'props.route.params?.from_screen',
        props.route.params?.from_screen,
      );
      Keyboard.dismiss();
      logs.log('mpin', mpin);
      logs.log('responseObj.otp', responseObj.otp);
      logs.log('responseObj.otp', responseObj);
      logs.log('userObject======', userObject?.purposeOfPayment?.text);

      responseObj.otp = mpin;

      responseObj.paymentMethod = props.route.params?.from_screen;
      // (responseObj.paymentPurpose =
      //   propsReceived?.requestobj?.purposeOfPayment),
      logs.log('fromScreen', props.route.params?.from_screen);

      let responseObjIBAN = {
        amount: responseObj?.amount,
        fee: responseObj?.fee,
        source_iban: responseObj?.source_iban,
        idType: responseObj?.idType,
        idValue: responseObj?.idValue,
        isbenef: responseObj?.isbenef,
        narration: 'NBPRAASTPAYMENTS',
        otp: responseObj?.otp,
        paymentMethod: 'iban',
        pay_pur_id: propsReceived?.pay_pur_id
          ? propsReceived?.pay_pur_id
          : responseObj?.purposeOfPayment
          ? responseObj?.purposeOfPayment
          : propsReceived?.requestobj?.purposeOfPayment,
        rcvrEmailAddress: '',
        rcvrMobileNumber: '',
        receiverAlias: responseObj?.acctitle,
        memberid: responseObj?.memberid,
        receiverName: responseObj?.acctitle,
        receiveriban: responseObj?.receiveriban,
        senderName: loginResponse?.details?.accountTitle,
        transactionDate: moment(new Date()).format('YYYY-MM-DD'),
        transactionTime: moment(new Date()).format('hh:MM:SS'),
      };
      if (
        props.route.params?.from_screen == 'iban' ||
        props.route.params?.from_screen == 'account'
      ) {
        (responseObj.rcvrEmailAddress =
          propsReceived?.requestobj?.rcvrEmailAddress),
          // (responseObj.paymentPurpose =
          //   propsReceived?.requestobj?.purposeOfPayment),
          (responseObj.paymentPurpose = responseObj.paymentPurpose);
        logs.log('responseObj.paymentPurpose', responseObj.paymentPurpose);
        responseObj.paymentPurpose = responseObj.paymentPurpose;

        (responseObj.senderName = propsReceived?.senderName),
          (responseObj.paymentMethod = 'iban'),
          (responseObj.rcvrMobileNumber = responseObj?.benefMobile
            ? responseObj?.benefMobile
            : ''),
          (responseObj.comments = responseObj?.comments),
          (responseObj.transactionDate = moment(new Date()).format(
            'YYYY-MM-DD',
          )),
          (responseObj.transactionTime = moment(new Date()).format('hh:MM:SS')),
          (responseObj.receiverAlias = responseObj.receiverName);
        logs.log(
          `RAAST payment calsssl by iban ${JSON.stringify(responseObj)}`,
        );
        // dispatch();
        responseObj.shortName = props.route.params?.shortName;
        responseObj.paymentPurpose = responseObj.paymentPurpose;

        logs.log('responseObjIBAN==================', responseObjIBAN);

        responseObj.senderName = loginResponse?.details?.accountTitle;
        dispatch(
          raastpyamentrequest(
            screen_status,
            props.navigation,
            responseObj,
            (response) => {
              dispatch(
                changeGlobalTransferAlertState(true, props.navigation, {
                  benefAlias: props.route.params?.shortname,
                  paymentType: 'RAAST Payment',
                  amount: responseObj?.amount,
                  purposeOfPayment:
                    propsReceived?.from_screen === 'account'
                      ? userObject?.purposeOfPayment?.text
                      : props.route.params?.data?.purposeOfPayment
                      ? props.route.params?.data?.purposeOfPayment
                      : responseObj?.pay_pur
                      ? responseObj?.pay_pur
                      : propsReceived?.requestobj?.purposeOfPayment,
                  fromName: `${overViewData?.data?.accounts?.accountTitle}`,
                  fromAccount: `${overViewData?.data?.accounts?.account}`,
                  toName:
                    propsReceived?.from_screen === 'account'
                      ? responseObj?.acctitle
                      : `${responseObj?.receiverName}`,
                  toAccount:
                    propsReceived?.from_screen === 'account'
                      ? `${responseObj?.receiveriban}`
                      : `${responseObj?.receiveriban}`,
                  rrn: response?.data?.data?.rrn
                    ? response?.data?.data?.rrn
                    : false,
                  stanId: response?.data?.data?.stan
                    ? response?.data?.data?.stan
                    : false,
                  currentDate: moment(new Date()).format('DD MMM, YYYY'),
                  currentTime: moment(new Date()).format('hh:mm:ss a'),
                  comments: responseObj?.comments,
                  onPressClose: () => {
                    dispatch(closeGlobalTransferAlert(props.navigation));
                  },
                }),
              );
            },
          ),
        );
      } else {
        logs.log(`**********responseObj${JSON.stringify(responseObj)}`);
        logs.log(
          `**********responseObjAliass${JSON.stringify(responseObjAliass)}`,
        );

        let responseObjAlias = {
          amount: responseObj.amount,
          fee: '0',
          source_iban: responseObj.source_iban,
          idType: 'CNIC',
          idValue: acc_info?.cnic,
          isbenef: false,
          narration: 'Raast Payment by alias',
          otp: mpin,
          pay_pur_id: propsReceived?.pay_pur_id,
          rcvrEmailAddress: responseObj?.benefEmail,
          rcvrMobileNumber: responseObj?.benefMobile,
          receiverName: `${responseObjAliass.name} ${responseObjAliass.surname}`,
          receiveriban: responseObjAliass.iban,
          memberid: responseObjAliass.servicer,
          name: responseObj.name,
          transactionDate: moment(new Date()).format('YYYY-MM-DD'),
          transactionTime: moment(new Date()).format('hh:MM:SS'),
          paymentMethod: props.route.params?.from_screen,
          receiverAlias: responseObj.idValue,
          shortName: responseObj?.shortname,
          comments: responseObj?.comments,
          senderName: loginResponse?.details?.accountTitle,
        };

        logs.log(
          `RAAST payment call by alias ${JSON.stringify(responseObjAlias)}`,
        );
        dispatch(
          raastpyamentrequest(
            screen_status,
            props.navigation,
            responseObjAlias,
            (response) => {
              logs.log(
                'Call Response-----',
                props.route.params?.shortname,
                'RAAST Payment',
                responseObj?.amount,
                'purposeOfPayment: ',
                responseObj?.purposeOfPayment
                  ? responseObj?.purposeOfPayment
                  : false,
                `${overViewData?.data?.accounts?.accountTitle}`,
                `${overViewData?.data?.accounts?.account}`,
                'toName:',
                `${responseObjAliass?.name}`,
                'toAccount: ',
                `${responseObj?.idValue}`,
                response?.data?.data?.rrn ? response?.data?.data?.rrn : false,
                response?.data?.data?.stan ? response?.data?.data?.stan : false,
                moment(new Date()).format('DD MMM, YYYY'),
                moment(new Date()).format('hh:mm:ss a'),
                responseObj?.comments,
              );
              dispatch(
                changeGlobalTransferAlertState(true, props.navigation, {
                  benefAlias: props.route.params?.shortname,
                  paymentType: 'RAAST Payment',
                  amount: responseObj?.amount,
                  purposeOfPayment:
                    propsReceived?.from_screen === 'account'
                      ? userObject?.purposeOfPayment?.text
                      : props.route.params?.data?.purposeOfPayment
                      ? props.route.params?.data?.purposeOfPayment
                      : responseObj?.pay_pur
                      ? responseObj?.pay_pur
                      : propsReceived?.requestobj?.purposeOfPayment,
                  fromName: `${overViewData?.data?.accounts?.accountTitle}`,
                  fromAccount: `${overViewData?.data?.accounts?.account}`,
                  toName: propsReceived?.requestobjAlias?.name,
                  toAccount: propsReceived?.requestobj?.idValue,
                  rrn: response?.data?.data?.rrn
                    ? response?.data?.data?.rrn
                    : false,
                  stanId: response?.data?.data?.stan
                    ? response?.data?.data?.stan
                    : false,
                  currentDate: moment(new Date()).format('DD MMM, YYYY'),
                  currentTime: moment(new Date()).format('hh:mm:ss a'),
                  comments: responseObj?.comments,
                  onPressClose: () => {
                    dispatch(closeGlobalTransferAlert(props.navigation));
                  },
                }),
              );
            },
          ),
        );
      }
    }
  }, [mpin]);
  useEffect(() => {
    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      () => {
        return true;
      },
    );

    return () => backHandler.remove();
  }, []);
  return (
    <View
      style={{flex: 1, backgroundColor: Colors.backgroundColor}}
      accessibilityLabel="RAAST Payment M PIN Screen">
      <SubHeader
        navigation={props.navigation}
        title={
          screen_status == 'iban'
            ? 'Pay by Raast'
            : screen_status == 'alias'
            ? 'Pay by Raast ID'
            : screen_status == 'Qr'
            ? 'Pay by Qr'
            : screen_status == 'account'
            ? 'Pay by Raast' //   :screen_status=='card_status'?'Debit Card Change Status'
            : //   :screen_status=="card_activation"?'Debit Card Activation'
              //   :screen_status=='card_chnage_pin'?'Debit Card Change Pin'
              null
        }
        description={'Raast Payments'}
        onPress={() => {
          props.navigation?.pop(3);
        }}
      />
      <View style={{height: wp(13)}} />
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={{width: wp(20), height: wp(6), alignSelf: 'center'}}>
          <Image
            // style={globalStyling.image}
            style={{height: wp(20), width: wp(20)}}
            // resizeMode="contain"
            // source={require('../../../../Assets/RAAST_Icons/mpin.png')}
            source={
              activeTheme.isDarkTheme
                ? Images.otpLogoDark
                : activeTheme.isPinkTheme
                ? Images.otpLogoPink
                : activeTheme.isIndigoTheme
                ? Images.otpLogoIndigo
                : activeTheme.isOrangeTheme
                ? Images.otpLogoOrange
                : Images.otpLogoDefault
            }
          />
        </View>
        <View style={{height: wp(13)}} />
        <CustomText style={styles.noteText}>
          Enter the 4 digit MPIN, do not share your MPIN with any one.
        </CustomText>
        <View style={{height: wp(6)}} />

        <View style={styles.codeFieldView}>
          <SmoothPinCodeInput
            animated={false}
            accessibilityLabel="Enter yout M PIN here"
            password
            mask="*"
            textStyle={{
              fontSize: smoothCodeInputStyle.fontSize,
              color: Colors.mainTextColors,
            }}
            autoFocus={true}
            cellStyleFocused={{
              borderColor: smoothCodeInputStyle.borderColorFocusedCell,
            }}
            cellStyle={{
              borderWidth: smoothCodeInputStyle.borderWidth,
              borderRadius: smoothCodeInputStyle.borderRadius,
              borderColor: Colors.textFieldBorderColor,
              backgroundColor: Colors.smoothCodePinInputBackground,
            }}
            keyboardType={'number-pad'}
            cellSpacing={smoothCodeInputStyle.cellSpacing}
            cellSize={smoothCodeInputStyle.cellSize}
            codeLength={4}
            style={styles.pinView}
            onTextChange={(value) => {
              setMpin(validateOnlyNumberInput(value));
            }}
            value={mpin}
            // placeholder={'O'}
          />
        </View>
        {/* <View style={{flexDirection:'row'}}> */}
        {/* <CustomText style={styles.noteText}>
          {'4 ہندسوں کا MPIN درج کریں، اپنے MPIN کو کسی کے ساتھ شیئر نہ کریں۔'}{' '}
        </CustomText> */}

        {/* </View> */}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  textStyle: {
    fontSize: wp(4.2),
    marginVertical: wp(5),
    textAlign: 'center',
  },
  codeFieldView: {
    alignSelf: 'center',
  },
  noteText: {
    fontSize: wp(4.2),
    width: '80%',
    alignSelf: 'center',
    marginTop: wp(5),
  },
});
