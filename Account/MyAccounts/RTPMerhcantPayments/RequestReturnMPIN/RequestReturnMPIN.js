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

import CustomText from '../../../../../Components/CustomText/CustomText';
import {
  globalStyling,
  smoothCodeInputStyle,
  wp,
  currencyFormat,
} from '../../../../../Constant';
import SubHeader from '../../../../../Components/GlobalHeader/SubHeader/SubHeader';
import {Colors} from '../../../../../Theme';
import SmoothPinCodeInput from 'react-native-smooth-pincode-input';
import analytics from '@react-native-firebase/analytics';
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
} from '../../../../../Redux/Action/Action';
import {useSelector, useDispatch} from 'react-redux';
import {logs} from '../../../../../Config/Config';
import {postTokenCall, Service} from '../../../../../Config/Service';
import SuccessModal from '../../../../../Components/SuccessModal/SuccessModal';

import moment from 'moment';

export default function RequestReturnMPIN(props) {
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

  const callData = props?.route?.params?.data;

  useEffect(() => {
    if (mpin.length === 4) {
      Keyboard.dismiss();

      returnRequest();
      if (!loader) {
        setMpin('');
      }
    }
  }, [mpin]);
  useEffect(() => {
    props.navigation.addListener(
      'focus',
      () => {
        // dispatch(setCurrentFlow('Utility Bill Payment'));
        logs.log('Props Received callData-----------', callData);
        async function analyticsLog() {
          await analytics().logEvent('RequestReturnMpinScreen');
        }
        analyticsLog();
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

  const returnRequest = async () => {
    const apiObject = {
      originalRrn: callData?.originalRrn,
      originalStan: callData?.originalStan,
      originalAmount: callData?.originalAmount,
      requestedAmount: callData?.requestedAmount,
      schemeId: callData?.schemeId,
      mpin: mpin,
    };
    try {
      dispatch(setLoader(true));
      const response = await postTokenCall(Service.requestForReturn, apiObject);
      logs.logResponse(response);
      if (response?.data?.responseCode === '00') {
        dispatch(updateSessionToken(response));
        logs.log('Response===============', response?.data?.data);
        // props.navigation.navigate('PaymentResponse', {
        //   data: response.data.data,
        // });
        const dataObject = response?.data?.data?.transactionDetails;
        const dateString = String(`${dataObject?.date} ${dataObject?.time}`);
        dispatch(setLoader(false));
        setSuccessModalState(true);
        console.log('--=-=-0=-0', callData);
        // dispatch(
        //   changeGlobalIconAlertState(true, props.navigation, {
        //     message: 'RTP Request Rejected',
        //     removeAlert: true,
        //     onPressOk: () => {
        //       changeGlobalIconAlertState(false);
        //     },
        //   }),
        // );
        logs.log('Api Integrated Successfully.....', response?.data);
      } else {
        // setMpin('');
        logs.log('requestAcceptance Api Integration failed...');
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
        navigateHome={true}
      />
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={{height: wp(6)}} />
        <View style={{width: wp(20), height: wp(6), alignSelf: 'center'}}>
          <Image
            style={{height: wp(20), width: wp(20)}}
            // resizeMode="contain"
            source={require('../../../../../Assets/RAAST_Icons/mpin.png')}
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
        {/* {currencyFormat(Number(callData.originalAmount))} */}
        <SuccessModal
          visible={successModalState}
          message={'Success'}
          secondMessage={`Your request PKR ${currencyFormat(
            Number(callData?.requestedAmount),
          )} has been sent successfully to merchant ${callData?.merchantName}`}
          onPress_yes={() => {
            // setSuccessModalState(false);
            console.log('--=-=-0=-0', callData);
            props.navigation.navigate('Home');
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
