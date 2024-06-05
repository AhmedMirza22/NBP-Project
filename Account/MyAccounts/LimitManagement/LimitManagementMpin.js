import React, {useState, useEffect} from 'react';
import {
  View,
  StyleSheet,
  Keyboard,
  ScrollView,
  Image,
  BackHandler,
} from 'react-native';
import {
  globalStyling,
  hp,
  smoothCodeInputStyle,
  validateOnlyNumberInput,
  wp,
} from '../../../../Constant';
import SubHeader from '../../../../Components/GlobalHeader/SubHeader/SubHeader';
import {Colors, Images} from '../../../../Theme';
import {useTheme} from '../../../../Theme/ThemeManager';
import SmoothPinCodeInput from 'react-native-smooth-pincode-input';
import {useSelector, useDispatch} from 'react-redux';
import {
  catchError,
  changeGlobalTransferAlertState,
  closeGlobalTransferAlert,
  serviceResponseCheck,
  setAppAlert,
  setCurrentFlow,
  setLoader,
  updateSessionToken,
} from '../../../../Redux/Action/Action';
import analytics from '@react-native-firebase/analytics';
import CustomText from '../../../../Components/CustomText/CustomText';
import {benefType, logs} from '../../../../Config/Config';
import moment from 'moment';
import {Service, postTokenCall} from '../../../../Config/Service';
import SuccessModal from '../../../../Components/SuccessModal/SuccessModal';

export default function LimitManagementMpin(props) {
  const dispatch = useDispatch();
  const {activeTheme} = useTheme();
  const [mpin, setMpin] = useState('');
  const [successModal, setSuccessModal] = useState(false);

  const customerLimit = props?.route?.params?.customerLimit;
  logs.log('customerLimit----', customerLimit);
  useEffect(() => {
    if (mpin.length === 4) {
      Keyboard.dismiss();
      updateCustomerLimit(customerLimit, mpin);
    }
  }, [mpin]);
  useEffect(() => {
    props.navigation.addListener('focus', () => {
      async function analyticsLog() {
        await analytics().logEvent('LimitManagementMPIN');
      }
      analyticsLog();
    });
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

  const updateCustomerLimit = async (params, Mpin) => {
    try {
      dispatch(setLoader(true));
      const response = await postTokenCall(Service.updateCustomerLimit, {
        customerLimits: params,
        mpin: Mpin,
      });
      logs.logResponse(response);
      dispatch(updateSessionToken(response));
      if (response?.data?.responseCode === '00') {
        dispatch(setLoader(false));
        // setSuccessModal(true);
        dispatch(
          setAppAlert(
            'Limit has been updated successfully.',
            '',
            props?.navigation,
            () => {
              setTimeout(() => {
                props.navigation.navigate('Home');
              }, 500);
            },
          ),
        );
        logs.log('----==>', response?.data);
      } else {
        setMpin('');
        dispatch(serviceResponseCheck(response, props.navigation, true));
        // dispatch(setLoader(false));
        // setSuccessModal(true);
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
      accessibilityLabel="Limit Management MPIN Screen">
      <SubHeader
        title={'Limit Management'}
        description={'Manage your transfer limit'}
        // viewAccounts={true}
        navigation={props.navigation}
      />
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={{height: wp(6)}} />
        <View style={{width: wp(20), height: wp(20), alignSelf: 'center'}}>
          <Image
            style={{height: '100%', width: '100%'}}
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

        <CustomText style={styles.noteText}>
          Enter the 4 digit MPIN, do not share your MPIN with any one.
        </CustomText>
        {/* <CustomText style={styles.noteText}>
          {'4 ہندسوں کا MPIN درج کریں، اپنے MPIN کو کسی کے ساتھ شیئر نہ کریں۔'}
        </CustomText> */}
        <View style={{height: hp(4)}} />
        <View style={styles.codeFieldView}>
          <SmoothPinCodeInput
            accessibilityLabel="Please enter your MPIN"
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
            codeLength={4}
            style={styles.pinView}
            onTextChange={(value) => {
              setMpin(validateOnlyNumberInput(value));
            }}
            value={mpin}
          />
        </View>
        {/* <SuccessModal
          visible={successModal}
          // titleHead={'Success'}
          // titleHeadSize={40}
          // message={'Limit has been updated successfully.'}
          messageSize={1}
          secondMessage={'Limit has been updated successfully.'}
          onPress_yes={() => {
            setSuccessModal(false);
            setTimeout(() => {
              props.navigation.navigate('Home');
            }, 500);
          }}
        /> */}
        <SuccessModal
          visible={successModal}
          titleHead={'Success'}
          // message={"Success"}
          secondMessage={'Limit has been updated successfully.'}
          onPress_yes={() => {
            setSuccessModal(false);
            setTimeout(() => {
              props.navigation.navigate('Home');
            }, 500);
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
