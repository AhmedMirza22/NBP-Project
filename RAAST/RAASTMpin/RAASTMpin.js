import React, {useState, useEffect} from 'react';
import {
  View,
  StyleSheet,
  Keyboard,
  ScrollView,
  BackHandler,
  Image,
} from 'react-native';
import CustomText from '../../../Components/CustomText/CustomText';
import {
  smoothCodeInputStyle,
  validateOnlyNumberInput,
  wp,
} from '../../../Constant';
import SubHeader from '../../../Components/GlobalHeader/SubHeader/SubHeader';
import SmoothPinCodeInput from 'react-native-smooth-pincode-input';
import {
  alias_one_registration,
  alias_link,
  alias_unlink,
  alias_removal,
  changeGlobalIconAlertState,
  setKeyChainObject,
  emptyViewAccOverView,
  setLoader,
  serviceResponseCheck,
  catchError,
  updateSessionToken,
} from '../../../Redux/Action/Action';
import analytics from '@react-native-firebase/analytics';
import {useDispatch} from 'react-redux';
import {logs} from '../../../Config/Config';
import {Service, postTokenCall} from '../../../Service';
import {maskedAccount} from '../../../Helpers/Helper';
import {Colors, Images} from '../../../Theme';
import {useTheme} from '../../../Theme/ThemeManager';

export default function Debit_card_mpin(props) {
  const dispatch = useDispatch();
  const [mpin, setMpin] = useState('');
  const {activeTheme} = useTheme();
  const responseObj = props.route.params?.requestobj;
  const screen_status = props.route.params?.from_screen;
  const name = props.route.params?.name;
  const alias = props.route.params?.alias;
  logs.log('props.route.params on MPIN', props.route.params);
  useEffect(() => {
    async function analyticsLog() {
      await analytics().logEvent('RaastMpinScreen');
    }
    analyticsLog();

    if (mpin.length === 4) {
      Keyboard.dismiss();
      responseObj.otp = mpin;
      //   responseObj.cardType='1'

      if (props.route.params?.from_screen == 'Register') {
        raastOneStepRegistration(screen_status, responseObj, name, alias);
      } else if (props.route.params?.from_screen == 'Link') {
        aliasLink(screen_status, responseObj, name, alias);
      } else if (props.route.params?.from_screen == 'Unlink') {
        aliasUnLink(screen_status, responseObj, name, alias);
      } else if (props.route.params?.from_screen == 'Remove') {
        logs.log(responseObj);
        aliasRemoval(screen_status, responseObj, name, alias);
      }
    }
  }, [mpin]);
  useEffect(() => {}, []);
  useEffect(() => {
    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      () => {
        return true;
      },
    );

    return () => backHandler.remove();
  }, []);

  const raastOneStepRegistration = async (
    screen_status,
    params,
    name,
    alias,
  ) => {
    try {
      console.log('12y36128736587126387123-->', params);
      dispatch(setLoader(true));
      // `${Config.base_url.UAT_URL}${Config.method.raast}/${Config.method.registration}/${Config.endpoint.onestepregistation}`,
      const response = await postTokenCall(Service.oneStepRegistration, params);
      logs.logResponse(response);
      logs.logResponse(response?.data);
      dispatch(updateSessionToken(response));
      if (response?.data?.responseCode === '00') {
        setMpin('');
        dispatch(emptyViewAccOverView());

        dispatch(
          changeGlobalIconAlertState(true, props.navigation, {
            message: `Dear ${name}, Your RAAST ID ${alias} has been Registered and Linked successfully with IBAN
            ${maskedAccount(
              params?.iban,
            )}. For further assistance, please call NBP HelpLine
            021-111-627-627`,
            successAlert: true,
            onPressOk: () => {
              changeGlobalIconAlertState(false);
              setTimeout(() => {
                props.navigation.navigate('Home');
              }, 500);
            },
          }),
        );

        dispatch(setLoader(false));
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

  const aliasLink = async (screen_status, params, name, alias) => {
    try {
      // logs.log('65217365123kk-->', params);
      dispatch(setLoader(true));
      // `${Config.base_url.UAT_URL}${Config.method.raast}/${Config.method.registration}/${Config.endpoint.onestepregistation}`,
      const response = await postTokenCall(Service.aliasLink, params);
      logs.logResponse(response);
      logs.logResponse(response?.data);
      dispatch(updateSessionToken(response));
      if (response?.data?.responseCode === '00') {
        setMpin('');
        dispatch(emptyViewAccOverView());

        dispatch(
          changeGlobalIconAlertState(true, props.navigation, {
            message: `Dear ${name}, Your RAAST ID ${alias} has been Linked successfully with IBAN
            ${maskedAccount(
              params?.iban,
            )}. For further assistance, please call NBP HelpLine
            021-111-627-627`,
            successAlert: true,
            onPressOk: () => {
              changeGlobalIconAlertState(false);
              setTimeout(() => {
                props.navigation.navigate('Home');
              }, 500);
            },
          }),
        );

        dispatch(setLoader(false));
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

  const aliasUnLink = async (screen_status, params, name, alias) => {
    try {
      dispatch(setLoader(true));
      // `${Config.base_url.UAT_URL}${Config.method.raast}/${Config.method.registration}/${Config.endpoint.onestepregistation}`,
      const response = await postTokenCall(Service.aliasUnLink, params);
      logs.logResponse(response);
      logs.logResponse(response?.data);
      dispatch(updateSessionToken(response));
      if (response?.data?.responseCode === '00') {
        setMpin('');
        dispatch(emptyViewAccOverView());
        dispatch(
          changeGlobalIconAlertState(true, props.navigation, {
            message: `Dear ${name}, Your RAAST ID ${alias} has been Delinked successfully with IBAN
            ${maskedAccount(
              params?.iban,
            )}. For further assistance, please call NBP HelpLine
            021-111-627-627`,
            removeAlert: true,
            customTitle: 'Delinked',
            onPressOk: () => {
              changeGlobalIconAlertState(false);
              setTimeout(() => {
                props.navigation.navigate('Home');
              }, 500);
            },
          }),
        );

        dispatch(setLoader(false));
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

  const aliasRemoval = async (screen_status, params, name, alias) => {
    try {
      dispatch(setLoader(true));
      // `${Config.base_url.UAT_URL}${Config.method.raast}/${Config.method.registration}/${Config.endpoint.onestepregistation}`,
      const response = await postTokenCall(Service.aliasRemoval, params);
      logs.logResponse(response);
      logs.logResponse(response?.data);
      dispatch(updateSessionToken(response));
      if (response?.data?.responseCode === '00') {
        setMpin('');
        dispatch(emptyViewAccOverView());
        dispatch(
          changeGlobalIconAlertState(true, props.navigation, {
            message: `Dear ${name}, Your RAAST ID ${alias} has been Deleted successfully with IBAN
            ${maskedAccount(
              params?.iban,
            )}. For further assistance, please call NBP HelpLine
            021-111-627-627`,
            removeAlert: true,

            onPressOk: () => {
              changeGlobalIconAlertState(false);
              setTimeout(() => {
                props.navigation.navigate('Home');
              }, 500);
            },
          }),
        );
        dispatch(setLoader(false));
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
      style={{flex: 1, backgroundColor: Colors.backgroundColor}}
      accessibilityLabel="RAAST M PIN Screen">
      <SubHeader
        navigation={props.navigation}
        title={
          screen_status == 'Register'
            ? 'Register RAAST ID'
            : screen_status == 'Link'
            ? 'Link RAAST ID'
            : screen_status == 'Unlink'
            ? 'Unlink RAAST ID'
            : screen_status == 'Remove'
            ? 'Remove RAAST ID'
            : screen_status == 'Change_Status'
            ? 'Status Change RAAST ID'
            : //   :screen_status=='card_status'?'Debit Card Change Status'
              //   :screen_status=="card_activation"?'Debit Card Activation'
              //   :screen_status=='card_chnage_pin'?'Debit Card Change Pin'
              null
        }
        description={
          screen_status == 'Register'
            ? 'Register RAAST ID'
            : screen_status == 'Link'
            ? 'Link RAAST ID'
            : screen_status == 'Unlink'
            ? 'Unlink RAAST ID'
            : screen_status == 'Remove'
            ? 'Remove RAAST ID'
            : screen_status == 'Change_Status'
            ? 'Status Change RAAST ID'
            : null
        }
        onPress={() => {
          props.navigation?.pop(3);
        }}
      />
      <View style={{height: wp(13)}} />
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={{width: wp(20), height: wp(6), alignSelf: 'center'}}>
          <Image
            style={{height: wp(20), width: wp(20)}}
            // resizeMode="contain"
            // source={require('../../../Assets/RAAST_Icons/mpin.png')}
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
        {/* <View style={{flexDirection:'row'}}> */}
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
              setMpin(validateOnlyNumberInput(value));
            }}
            value={mpin}
            // placeholder={'O'}
          />
        </View>
        {/* props.onPressOk() */}
        {/* <CustomIconAlert
          modalState={modalState}
          message={alertMessage}
          successAlert={alertIcon}
          onPressOk={() => {
            setModalState(false);
            props.navigation.navigate('Dashboard');
          }}
        /> */}

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
