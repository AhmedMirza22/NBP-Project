import React, {useState, useEffect} from 'react';
import {
  View,
  StyleSheet,
  Keyboard,
  ScrollView,
  BackHandler,
  Image,
} from 'react-native';
import {CommonActions} from '@react-navigation/native';

import CustomText from '../../../Components/CustomText/CustomText';
import {globalStyling, smoothCodeInputStyle, wp} from '../../../Constant';
import SubHeader from '../../../Components/GlobalHeader/SubHeader/SubHeader';
import {Colors} from '../../../Theme';
import SmoothPinCodeInput from 'react-native-smooth-pincode-input';
import {
  catchError,
  changeGlobalTransferAlertState,
  closeGlobalTransferAlert,
  serviceResponseCheck,
  setCurrentFlow,
  setLoader,
  updateSessionToken,
  setAppAlert,
  successModalClose,
  changeGlobalIconAlertState,
} from '../../../Redux/Action/Action';
import analytics from '@react-native-firebase/analytics';
import {useSelector, useDispatch} from 'react-redux';
import {logs} from '../../../Config/Config';
import {postTokenCall, Service} from '../../../Config/Service';
import SuccessModal from '../../../Components/SuccessModal/SuccessModal';

import moment from 'moment';

export default function RTPMPIN(props) {
  logs.log(
    'hagdhgasuygdsghshjgs in utulity MPIN=======>',
    props?.route?.params,
  );
  const dispatch = useDispatch();
  const [mpin, setMpin] = useState('');
  const [successModalState, setSuccessModalState] = useState(false);

  const overViewData = useSelector((state) => state.reducers.overViewData);
  const loader = useSelector((state) => state.reducers.loader);

  const apiData = props?.route?.params?.data?.paymentCallData;
  const fee = parseFloat('1');
  const amount = parseFloat(`${apiData?.amount}`);
  const formattedFee = fee.toFixed(2);
  const formattedAmount = amount.toFixed(2);

  const callData = props?.route?.params?.payNowdata
    ? props?.route?.params?.payNowdata
    : props?.route?.params?.payLaterdata;

  const callType = props?.route?.params?.payNowdata ? 'now' : 'later';

  useEffect(() => {
    if (mpin.length === 4) {
      Keyboard.dismiss();

      callType === 'now' ? rtpPayNow() : rtpPayLater();
      if (!loader) {
        setMpin('');
        990001384;
      }
    }
  }, [mpin]);
  useEffect(() => {
    props.navigation.addListener(
      'focus',
      () => {
        async function analyticsLog() {
          await analytics().logEvent('RTPMPINScreen');
        }
        analyticsLog();

        // dispatch(setCurrentFlow('Utility Bill Payment'));
        logs.log('Props Received callData-----------', callData);
      },
      [],
    );
  });
  useEffect(() => {
    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      () => {
        return true;
      },
    );

    return () => backHandler.remove();
  }, []);

  const rtpPayNow = async () => {
    try {
      dispatch(setLoader(true));
      const response = await postTokenCall(Service.requestToPayNow, {
        mpin: mpin,
        ...callData,
      });
      logs.logResponse(response);
      if (response?.data?.responseCode === '00') {
        dispatch(updateSessionToken(response));
        const receiptResponse = response?.data;
        // logs.log('Response===============', response?.data?.data);
        // props.navigation.navigate('PaymentResponse', {
        // logs.log('Response===============Response', response);
        logs.log(
          'receiptResponse===============receiptResponse',
          receiptResponse,
        );
        logs.log('amount===============amount', response?.amount);

        //   data: response.data.data,
        // });
        const dataObject = response?.data?.data?.transactionDetails;
        const dateString = String(`${dataObject?.date} ${dataObject?.time}`);
        dispatch(setLoader(false));
        // setSuccessModalState(true);
        dispatch(
          changeGlobalTransferAlertState(true, props.navigation, {
            paymentType: 'Request To Pay',
            amount: `${callData?.amount}`,
            fromName: `${callData.senderAccountTitle}`,
            fromAccount: `${callData?.senderIban}`,
            toName: `${callData?.merchantAccountTitle}`,
            toAccount: `${callData?.merchantIban}`,
            rrn: response?.data?.data?.rnn ? response?.data?.data?.rnn : false,
            tran_Id: response?.data?.data?.rnn
              ? response?.data?.data?.rnn
              : false,
            stanId: response?.data?.data?.stan,
            // currentDate: `${moment(dataObject?.date, 'MM:DD').format(
            //   'DD MMM, YYYY',
            // )}`,
            // currentTime: `${dataObject?.time}`,
            onPressClose: () => {
              dispatch(closeGlobalTransferAlert(props.navigation));
            },
          }),
        );
        logs.log('Api Integrated Successfully.....', response?.data);
      } else if (response?.data?.responseCode === '02') {
        logs.log('inside the mopnin incorrect');
        setMpin('');
        dispatch(setLoader(false));
        dispatch(serviceResponseCheck(response, props.navigation));
      } else {
        setMpin('');
        logs.log('onIncorrect MPIN');
        logs.log('Else MPIN');
        dispatch(setLoader(false));
        dispatch(serviceResponseCheck(response, props.navigation));

        // setSuccessModalState(true);
        // dispatch(serviceResponseCheck(response, props.navigation, true));
        // props?.navigation.dispatch(
        //   CommonActions.reset({
        //     index: 0,
        //     routes: [{name: 'Home'}],
        //   }),
        // );
      }
    } catch (error) {
      dispatch(catchError(error));
    }
  };
  const rtpPayLater = async () => {
    try {
      dispatch(setLoader(true));
      const response = await postTokenCall(Service.requestToPayLater, {
        mpin: mpin,
        ...callData,
      });
      logs.logResponse(response);
      if (response?.data?.responseCode === '00') {
        dispatch(updateSessionToken(response));
        logs.log('Response===============', response?.data?.data);
        logs.log('Response===============Response', response);
        const receiptResponse = response?.data;
        // props.navigation.navigate('PaymentResponse', {
        //   data: response.data.data,
        // });
        const dataObject = response?.data?.data?.transactionDetails;
        const dateString = String(`${dataObject?.date} ${dataObject?.time}`);
        dispatch(setLoader(false));
        // setSuccessModalState(true);
        dispatch(
          changeGlobalTransferAlertState(true, props.navigation, {
            paymentType: 'Request To Pay',
            amount: `${callData?.amount}`,
            fromName: `${callData.senderAccountTitle}`,
            fromAccount: `${callData?.senderIban}`,
            toName: `${callData?.merchantAccountTitle}`,
            toAccount: `${callData?.merchantIban}`,
            rrn: response?.data?.data?.rnn ? response?.data?.data?.rnn : false,
            tran_Id: response?.data?.data?.rnn
              ? response?.data?.data?.rnn
              : false,
            stanId: response?.data?.data?.stan,
            // currentDate: `${moment(dataObject?.date, 'MM:DD').format(
            //   'DD MMM, YYYY',
            // )}`,
            // currentTime: `${dataObject?.time}`,
            onPressClose: () => {
              dispatch(closeGlobalTransferAlert(props.navigation));
            },
          }),
        );
        logs.log('Api Integrated Successfully.....', response?.data);
      } else if (response?.data?.responseCode === '02') {
        logs.log('inside the mopnin incorrect');
        setMpin('');
        dispatch(setLoader(false));
        dispatch(serviceResponseCheck(response, props.navigation));
      } else {
        setMpin('');
        logs.log('onIncorrect MPIN');
        // dispatch(
        //   changeGlobalIconAlertState(false, props.navigation, {
        //     removeAlert: false,
        //     successAlert: true,
        //   }),
        // );
        // setSuccessModalState(true);
        dispatch(setLoader(false));
        dispatch(serviceResponseCheck(response, props.navigation, true));
        // props?.navigation.dispatch(
        //   CommonActions.reset({
        //     index: 0,
        //     routes: [{name: 'Home'}],
        //   }),
        // );
      }
    } catch (error) {
      dispatch(catchError(error));
    }
  };

  return (
    <View
      style={[
        globalStyling.container,
        {backgroundColor: Colors.backgroundColor},
      ]}
      accessibilityLabel="Utility M Pin">
      <SubHeader
        navigation={props.navigation}
        title={'Request to Pay'}
        description={'Make Payments in just few steps'}
        // navigateHome={true}
        onPress={() => {
          props?.navigation?.navigate('Home');
        }}
      />
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={{height: wp(6)}} />
        <View style={{width: wp(20), height: wp(6), alignSelf: 'center'}}>
          <Image
            style={{height: wp(20), width: wp(20)}}
            // resizeMode="contain"
            source={require('../../../Assets/RAAST_Icons/mpin.png')}
          />
        </View>
        <View style={{height: wp(13)}} />
        <CustomText style={styles.noteText}>
          Enter the 4 digit MPIN, do not share your MPIN with any one.
        </CustomText>
        {/* <CustomText style={styles.noteText}>
          {'4 ہندسوں کا MPIN درج کریں، اپنے MPIN کو کسی کے ساتھ شیئر نہ کریں۔'}{' '}
        </CustomText> */}
        <View style={{height: wp(10)}} />
        <View style={styles.codeFieldView}>
          <SmoothPinCodeInput
            accessibilityLabel="Enter your M PIN here"
            animated={false}
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
            cellSize={smoothCodeInputStyle.cellSize}
            cellSpacing={smoothCodeInputStyle.cellSpacing}
            codeLength={4}
            style={styles.pinView}
            onTextChange={(value) => {
              setMpin(value);
            }}
            value={mpin}
            // placeholder={'O'}
          />
        </View>
        <View style={{height: wp(6)}} />
        <SuccessModal
          visible={successModalState}
          message={'Payment Successfull'}
          secondMessage={'Payment Successfull'}
          onPress_yes={() => {
            setSuccessModalState(false);
          }}
        />
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
