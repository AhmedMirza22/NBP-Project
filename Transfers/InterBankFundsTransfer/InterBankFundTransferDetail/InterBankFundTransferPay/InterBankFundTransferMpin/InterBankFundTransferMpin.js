import React, {useState, useEffect} from 'react';
import {
  View,
  ScrollView,
  Keyboard,
  StyleSheet,
  BackHandler,
  Image,
} from 'react-native';
import {
  globalStyling,
  smoothCodeInputStyle,
  validateOnlyNumberInput,
  wp,
} from '../../../../../../Constant';
import SubHeader from '../../../../../../Components/GlobalHeader/SubHeader/SubHeader';
import {Colors, Images} from '../../../../../../Theme';
import SmoothPinCodeInput from 'react-native-smooth-pincode-input';
import {useTheme} from '../../../../../../Theme/ThemeManager';
import {
  setCurrentFlow,
  changeGlobalTransferAlertState,
  closeGlobalTransferAlert,
  serviceResponseCheck,
  catchError,
  setLoader,
  updateSessionToken,
  raastpyamentrequest,
} from '../../../../../../Redux/Action/Action';
import analytics from '@react-native-firebase/analytics';

import {useSelector, useDispatch} from 'react-redux';
import CustomText from '../../../../../../Components/CustomText/CustomText';
import {logs} from '../../../../../../Config/Config';
import {Service, postTokenCall} from '../../../../../../Service';
import moment from 'moment';
export default function InterBankFundTransferMpin(props) {
  const dispatch = useDispatch();
  const {activeTheme} = useTheme();
  const [mpin, setMpin] = useState('');
  const overViewData = useSelector((state) => state.reducers.overViewData);
  const userObject = useSelector((state) => state?.reducers?.userObject);
  const ibftPaymentConstant = userObject?.ftPayment;
  const acc_info = useSelector(
    (state) => state.reducers.overViewData?.data?.accounts,
  );
  useEffect(() => {
    if (mpin.length === 4) {
      Keyboard.dismiss();
      logs.log(
        'bftPaymentConstant?.paymentMethod',
        ibftPaymentConstant?.paymentType,
      );
      if (
        ibftPaymentConstant?.paymentType == 'raastpaybyIBAN' ||
        ibftPaymentConstant?.paymentType == 'raastTitleFetch2'
      ) {
        logs.log('129873198279812731', ibftPaymentConstant);
        raastIbanPayment();
      } else {
        ibftPayment();
      }
    }
  }, [mpin]);
  useEffect(() => {
    props.navigation.addListener(
      'focus',
      () => {
        async function analyticsLog() {
          await analytics().logEvent('IBFTTransferMPIN');
        }
        analyticsLog();

        dispatch(setCurrentFlow('Interbank Fund Transfer'));
        logs.log(
          'ibftPaymentConstant in the ibft =======>',
          ibftPaymentConstant,
          Object.keys(ibftPaymentConstant).length,
        );
      },
      [],
    );
  }, []);
  useEffect(() => {
    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      () => {
        return true;
      },
    );

    return () => backHandler.remove();
  }, []);

  const ibftPayment = async () => {
    logs.log(
      'ibftPaymentConstant?.purposeOfPayment=====',
      ibftPaymentConstant?.purposeOfPayment?.id,
    );
    try {
      dispatch(setLoader(true));
      const response = await postTokenCall(
        Service.ibftPayment,
        ibftPaymentConstant?.shortName
          ? {
              bankName: props?.route?.params?.data?.bank
                ? props?.route?.params?.data?.bank
                : ibftPaymentConstant?.bankName,
              addBenef: true,
              amount: ibftPaymentConstant?.amount,
              benef: true,
              benefID: '',
              benefiAlias: ibftPaymentConstant?.shortName,
              comments: ibftPaymentConstant?.comments
                ? ibftPaymentConstant?.comments
                : '',
              email: ibftPaymentConstant?.email
                ? ibftPaymentConstant?.email
                : '',
              fromAccount: ibftPaymentConstant?.fromAccount,
              fromAccountType: 'Savings-Account',
              ibftType: '9999',
              imd: ibftPaymentConstant?.imd,
              isBenef: false,
              otp: mpin,
              purposeOfPayment:
                ibftPaymentConstant?.purposeOfPayment === ''
                  ? '9999'
                  : ibftPaymentConstant?.purposeOfPayment?.id
                  ? ibftPaymentConstant?.purposeOfPayment?.id
                  : ibftPaymentConstant?.purposeOfPayment,
              rcvrEmailAddress: ibftPaymentConstant?.email,
              rcvrMobileNumber: ibftPaymentConstant?.phoneNumber,
              toAccount: ibftPaymentConstant?.toAccount
                ? ibftPaymentConstant?.toAccount.toUpperCase()
                : ibftPaymentConstant?.toAccount,
              token: ibftPaymentConstant?.token,
              validateOTP: true,
            }
          : {
              bankName: props?.route?.params?.data?.bank
                ? props?.route?.params?.data?.bank
                : ibftPaymentConstant?.bankName,
              amount: ibftPaymentConstant?.amount,
              benefID: '',
              comments: ibftPaymentConstant?.comments
                ? ibftPaymentConstant?.comments
                : '',
              email: ibftPaymentConstant?.email
                ? ibftPaymentConstant?.email
                : '',
              fromAccount: ibftPaymentConstant?.fromAccount,
              fromAccountType: 'Savings-Account',
              ibftType: '9999',
              imd: ibftPaymentConstant?.imd,
              isBenef: false,
              otp: mpin,
              purposeOfPayment:
                ibftPaymentConstant?.purposeOfPayment === ''
                  ? '9999'
                  : ibftPaymentConstant?.purposeOfPayment?.id
                  ? ibftPaymentConstant?.purposeOfPayment?.id
                  : ibftPaymentConstant?.purposeOfPayment,
              rcvrEmailAddress: ibftPaymentConstant?.email
                ? ibftPaymentConstant?.email
                : '',
              rcvrMobileNumber: ibftPaymentConstant?.phoneNumber
                ? ibftPaymentConstant?.phoneNumber
                : '',
              toAccount: ibftPaymentConstant?.toAccount
                ? ibftPaymentConstant?.toAccount.toUpperCase()
                : ibftPaymentConstant?.toAccount,
              token: ibftPaymentConstant?.token,
              validateOTP: true,
            },
      );
      logs.log('response---------------', response);
      logs.logResponse(response);
      dispatch(setLoader(false));

      if (response?.data?.responseCode === '00') {
        const dataObject = response?.data?.data?.transactionDetails;
        dispatch(updateSessionToken(response));

        dispatch(setLoader(false));
        dispatch(
          changeGlobalTransferAlertState(true, props.navigation, {
            benefAlias: ibftPaymentConstant?.shortName
              ? `${ibftPaymentConstant?.shortName}`
              : null,
            paymentType: 'Inter Bank Fund Transfer',
            amount: `${ibftPaymentConstant?.amount}`,
            fromName: `${overViewData?.data?.accounts?.accountTitle}`,
            fromAccount: `${overViewData?.data?.accounts?.account}`,
            rrn: response?.data?.data?.rrn ? response?.data?.data?.rrn : false,
            stanId: response?.data?.data?.transactionDetails?.stan
              ? response?.data?.data?.transactionDetails?.stan
              : false,
            purposeOfPayment: ibftPaymentConstant?.purposeOfPaymentString,
            toName: `${ibftPaymentConstant?.title}`,
            toAccount: `${ibftPaymentConstant?.toAccount}`,
            currentDate: `${moment(dataObject?.date, 'MM:DD').format(
              'DD MMM, YYYY',
            )}`,
            currentTime: `${dataObject?.time}`,
            comments: ibftPaymentConstant?.comments,
            onPressClose: () => {
              dispatch(closeGlobalTransferAlert(props.navigation));
            },
          }),
        );
      } else if (response?.data?.responseCode === '02') {
        setMpin('');
        dispatch(serviceResponseCheck(response, props.navigation));
      } else {
        setMpin('');

        dispatch(serviceResponseCheck(response, props.navigation, true));
      }
    } catch (error) {
      setMpin('');

      dispatch(catchError(error));
    }
  };
  const raastIbanPayment = async () => {
    try {
      dispatch(setLoader(true));
      const response = await postTokenCall(
        Service.raastPaymentRequest,
        ibftPaymentConstant?.shortName
          ? {
              accountNo:
                ibftPaymentConstant?.paymentType == 'raastTitleFetch2'
                  ? ibftPaymentConstant?.accountNo
                  : null,
              addBenef: true,
              benefiAlias: ibftPaymentConstant?.shortName,
              amount: ibftPaymentConstant?.amount,
              fee: ibftPaymentConstant?.fee,
              iban: ibftPaymentConstant?.iban,
              idType: 'CNIC',
              idValue: acc_info?.cnic,
              isBenef: false,
              narration: ibftPaymentConstant?.narration,
              otp: mpin,
              paymentPurpose: ibftPaymentConstant?.purposeOfPayment,
              rcvrEmailAddress: '',
              rcvrMobileNumber: '',
              receiverName: ibftPaymentConstant?.title,
              receiveriban: ibftPaymentConstant?.receiveriban,
              receiverParticipantCode: ibftPaymentConstant?.memberId,
              // receiveriban: params.receiveriban,
              senderName: ibftPaymentConstant?.accountTitle,
              transactionDate: moment(new Date()).format('YYYY-MM-DD'),
              transactionTime: moment(new Date()).format('hh:MM:SS'),
              //ADDED BY TUFAIL BHAi  FOR PAYEMNTS
              paymentMethod: ibftPaymentConstant?.paymentMethod,
              //ADDED BY UMAR
              receiverAlias: ibftPaymentConstant?.toAccount,
            }
          : {
              amount: ibftPaymentConstant?.amount,
              fee: ibftPaymentConstant?.fee,
              iban: ibftPaymentConstant?.iban,
              idType: 'CNIC',
              idValue: acc_info?.cnic,
              isBenef: false,
              narration: ibftPaymentConstant?.narration,
              otp: mpin,
              paymentMethod: ibftPaymentConstant?.paymentMethod,
              paymentPurpose: ibftPaymentConstant?.purposeOfPayment,
              rcvrEmailAddress: '',
              rcvrMobileNumber: '',
              receiverAlias: ibftPaymentConstant?.toAccount,
              receiverName: ibftPaymentConstant?.toTitle,
              receiverParticipantCode: ibftPaymentConstant?.memberId,
              receiveriban: ibftPaymentConstant?.receiveriban,
              senderName: ibftPaymentConstant?.accountTitle,
              accountNo: ibftPaymentConstant?.toAccount,
              transactionDate: moment(new Date()).format('YYYY-MM-DD'),
              transactionTime: moment(new Date()).format('hh:MM:SS'),
            },
      );
      logs.log('response---------------', response?.data);
      logs.logResponse(response);
      dispatch(updateSessionToken(response));
      dispatch(setLoader(false));

      if (response?.data?.responseCode === '00') {
        const dataObject = response?.data?.data?.transactionDetails;

        dispatch(setLoader(false));
        dispatch(
          changeGlobalTransferAlertState(true, props.navigation, {
            benefAlias: ibftPaymentConstant?.shortName
              ? `${ibftPaymentConstant?.shortName}`
              : null,
            paymentType: 'RAAST',
            amount: `${ibftPaymentConstant?.amount}`,
            fromName: `${overViewData?.data?.accounts?.accountTitle}`,
            fromAccount: `${overViewData?.data?.accounts?.account}`,
            rrn: response?.data?.data?.rrn ? response?.data?.data?.rrn : false,
            stanId: response?.data?.data?.transactionDetails?.stan
              ? response?.data?.data?.transactionDetails?.stan
              : false,
            purposeOfPayment: ibftPaymentConstant?.purposeOfPaymentString,
            toName: `${ibftPaymentConstant?.title}`,
            toAccount: `${ibftPaymentConstant?.toAccount}`,
            currentDate: moment(new Date()).format('YYYY-MM-DD'),
            currentTime: moment(new Date()).format('hh:MM:SS'),
            comments: ibftPaymentConstant?.comments,
            onPressClose: () => {
              dispatch(closeGlobalTransferAlert(props.navigation));
            },
          }),
        );
      } else if (response?.data?.responseCode === '02') {
        setMpin('');
        dispatch(serviceResponseCheck(response, props.navigation));
      } else {
        setMpin('');

        dispatch(serviceResponseCheck(response, props.navigation, true));
      }
    } catch (error) {
      setMpin('');

      dispatch(catchError(error));
    }
  };

  return (
    <View
      style={[
        globalStyling.container,
        {backgroundColor: Colors.backgroundColor},
      ]}
      accessibilityLabel="IBFT M PIN Screen">
      <SubHeader
        navigation={props.navigation}
        title={'Transfer to IBAN/Account No'}
        description={'Transfer funds to other bank accounts'}
        navigateHome={true}
        onPress={() => {
          props.navigation?.pop(3);
        }}
        headerFont={wp(5)}
      />
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={{height: wp(6)}}></View>
        <View style={{width: wp(20), height: wp(20), alignSelf: 'center'}}>
          <Image
            style={{height: '100%', width: '100%'}}
            // resizeMode="contain"
            // source={require('../../../../../../Assets/RAAST_Icons/mpin.png')}
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
        <CustomText style={styles.textStyle}>Please enter your MPIN</CustomText>
        <View style={styles.codeFieldView}>
          <SmoothPinCodeInput
            accessibilityLabel="Enter your M PIN"
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
            cellSpacing={smoothCodeInputStyle.cellSpacing}
            cellSize={smoothCodeInputStyle.cellSize}
            codeLength={4}
            style={styles.pinView}
            onTextChange={(value) => {
              setMpin(validateOnlyNumberInput(value));
            }}
            keyboardType={'number-pad'}
            value={mpin}
          />
        </View>
        <CustomText style={styles.noteText}>
          Enter the 4 digit MPIN, do not share your MPIN with any one.
        </CustomText>
        {/* <CustomText style={styles.noteText}>
          {'4 ہندسوں کا MPIN درج کریں، اپنے MPIN کو کسی کے ساتھ شیئر نہ کریں۔'}
        </CustomText> */}
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
    textAlign: 'center',
    // color: Colors.blackColor,
  },
});
