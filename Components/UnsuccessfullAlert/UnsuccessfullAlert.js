import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableWithoutFeedback,
  Image,
  Platform,
  Alert,
} from 'react-native';
import {sslcertificates} from '../../Config/Config';
import {useSelector, useDispatch} from 'react-redux';
import {CommonActions} from '@react-navigation/native';
import Modal from 'react-native-modal';
import {
  setElseResponseAlert,
  setLoader,
  setSslSuccessPinState,
  setAppAlert,
  versionCheck,
} from '../../Redux/Action/Action';
import ReactNativeBiometrics from 'react-native-biometrics';
import {globalStyling, wp} from '../../Constant';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Feather from 'react-native-vector-icons/Feather';
import CustomBtn from '../../Components/Custom_btn/Custom_btn';
import {checkNetworkConnectivity} from '../../Redux/Action/Action';
import {Config} from '../../Config/Config';
import {fetch} from 'react-native-ssl-pinning';
import {Message} from '../../Constant/Messages';
import {Colors, Images} from '../../Theme';
// import {fontFamily} from '../../Theme/Fonts';
import AntDesign from 'react-native-vector-icons/AntDesign';
import {fontFamily} from '../../Theme/Fonts';
import CustomText from '../CustomText/CustomText';
import {useTheme} from '../../Theme/ThemeManager';
export default function UnSuccessfullAlert(props) {
  const elseResponse = useSelector((state) => state.reducers.elseResponse);
  const currentFlow = useSelector((state) => state.reducers.currentFlow);
  const currentNavigation = useSelector(
    (state) => state.reducers.currentNavigation,
  );
  const isLoginState = useSelector((state) => state.reducers.isLoginState);
  const dispatch = useDispatch();
  const {activeTheme} = useTheme();
  const makeSslPinRequest = () => {
    dispatch(setLoader(true));
    fetch(`${Config.base_url.UAT_URL}${Config.method.webpages}/branch`, {
      method: 'GET',
      pkPinning: true,
      sslPinning: {
        // certs: [
        //   'sha256/+8woArQN4IWyZ4o5NvgKXXaadavuqXMghSk4c5d91LQ=',
        //   'sha256/l2yRLumd//mpm/WYi63mkNBZrNOpv+iqbuuqZHz2FZk=',
        //   'sha256/h6801m+z8v3zbgkRHpq6L29Esgfzhj89C1SyUCOQmqU=',
        // ],
        certs: sslcertificates,
        // certs: [
        //   'sha256/aR8gwjGp2IISfUuobEUJkIAfMag7b2J113pHiK9OkUc=',
        //   'sha256/5kJvNEMw0KjrCAu7eXY5HZdvyCS13BbA0VJG1RSP91w=',
        //   'sha256/r/mIkG3eEpVdm+u/ko/cwxzOMo1bk4TyHIlByibiA5E=',
        // ],
      },
    })
      .then((response) => {
        // dispatch(setLoader(false));
        dispatch(setSslSuccessPinState(true));
        dispatch(versionCheck());
        // dispatch(setAppAlert('success ssl pinning'));
      })
      .catch((error) => {
        dispatch(setSslSuccessPinState(false));
        dispatch(setLoader(false));
        setTimeout(() => {
          if (Platform.OS === 'android') {
            if (String(error).includes('certificate')) {
              if (!elseResponse.state) {
                dispatch(setElseResponseAlert());
                setTimeout(() => {
                  dispatch(setAppAlert('Certificate Pinning Failure.'));
                }, 500);
              }
            } else {
              if (!elseResponse.state) {
                dispatch(setElseResponseAlert());
                setTimeout(() => {
                  dispatch(setAppAlert(Message.networkErrorMessage));
                }, 500);
              }
            }
          } else {
            if (String(error).includes('certificate')) {
              if (!elseResponse.state) {
                Alert.alert('NBP Digital', 'Certificate Pinning Failure.', [
                  {
                    text: 'OK',
                    onPress: () => {
                      makeSslPinRequest();
                    },
                  },
                ]);
              }
            } else {
              if (!elseResponse.state) {
                dispatch(setAppAlert(Message.networkErrorMessage));
              }
            }
          }
        }, 500);
      });
  };

  const getAlert = () => {
    Alert.alert(
      currentFlow !== '' ? currentFlow : 'NBP Digital',
      `${String(elseResponse.alertText).replace('HelpLine', 'Helpline')} ${
        elseResponse?.alertCode ? `\n\nCode: ${elseResponse?.alertCode}` : ''
      }`,

      [
        {
          text: 'Ok',
          onPress: () => {
            if (elseResponse.onPress) {
              dispatch(setElseResponseAlert());
              setTimeout(() => {
                elseResponse.onPress();
              }, 500);
            } else if (
              elseResponse.alertText === 'Card Already Provisoned!' ||
              elseResponse.alertText === 'Card Enrolled Successfully.' ||
              elseResponse.alertText ===
                'Digital Debit Card PIN successfully created' ||
              elseResponse.alertText === 'MPIN added successfully' ||
              elseResponse.alertText === 'Transaction Completed Successfully' ||
              elseResponse.alertText === 'Card not active' ||
              elseResponse.alertText === 'No Beneficiary Found.' ||
              elseResponse.alertText === 'MPIN changed successfully' ||
              elseResponse.alertText === 'No record found' ||
              elseResponse.alertText === 'Issuer System Error' ||
              elseResponse.alertText === 'Card Status Error' ||
              elseResponse.alertText === 'MPIN Generated successfully' ||
              elseResponse.alertText ===
                'Unable to perform transaction as your card is currently suspended' ||
              elseResponse.alertText === 'MPIN changed successfully' ||
              elseResponse.alertText ===
                'Unable to generate QR as your card is currently suspended.' ||
              elseResponse.alertText ===
                `${
                  ReactNativeBiometrics.FaceID && Platform.OS === 'ios'
                    ? 'Face ID'
                    : 'Touch ID'
                } is now enabled.` ||
              elseResponse.alertText === 'Pin Updated Successfully.' ||
              elseResponse.alertText === 'Pin reset successfully'
            ) {
              dispatch(setElseResponseAlert());
              setTimeout(() => {
                currentNavigation.navigate('Home');
              }, 500);
            } else if (
              elseResponse.alertText ===
                `${
                  ReactNativeBiometrics.FaceID && Platform.OS === 'ios'
                    ? 'Face ID'
                    : 'Touch ID'
                } is now disabled.` &&
              isLoginState
            ) {
              // currentNavigation.navigate('Home');
              dispatch(setElseResponseAlert());

              currentNavigation.dispatch(
                CommonActions.reset({
                  index: 0,
                  routes: [{name: 'Home'}],
                }),
              );
            } else if (
              elseResponse.alertText ===
                `${
                  ReactNativeBiometrics.FaceID && Platform.OS === 'ios'
                    ? 'Face ID'
                    : 'Touch ID'
                } is now disabled.` &&
              !isLoginState
            ) {
              dispatch(setElseResponseAlert());

              currentNavigation.dispatch(
                CommonActions.reset({
                  index: 0,
                  routes: [{name: 'Login'}],
                }),
              );
            } else if (
              elseResponse.alertText ===
              'Dear Customer, please do not share your OTP with anyone. Your OTP has been sent to your email and mobile number. Please login with this OTP to create your own password.'
            ) {
              dispatch(setElseResponseAlert());
              setTimeout(() => {
                currentNavigation.dispatch(
                  CommonActions.reset({
                    index: 0,
                    routes: [{name: 'Login'}],
                  }),
                );
              }, 500);
            } else if (elseResponse.alertTitle === 'App Update') {
              // dispatch()
            } else {
              setTimeout(() => {
                dispatch(setElseResponseAlert());
              }, 500);
            }
          },
        },
      ],
    );
  };
  const getAlertAndroid = () => {
    return (
      <Modal
        animationIn="slideInRight"
        animationOut="slideOutRight"
        backdropOpacity={0.3}
        isVisible={elseResponse.state ? elseResponse.state : false}
        onBackdropPress={() => {}}>
        <>
          {/* <View style={styles.rowView}> */}

          {/* </View> */}
          <View
            style={[
              styles.mainView,
              {backgroundColor: activeTheme.alertBackGroundColor},
            ]}>
            <AntDesign
              name={'closecircle'}
              size={wp(5)}
              color={Colors.themeGrey}
              style={{marginRight: wp(2), alignSelf: 'flex-end'}}
              onPress={() => {
                // if (elseResponse?.alertTitle === 'App Update') {
                // } else {
                //   dispatch(setElseResponseAlert());
                // }
                getAndroidOnPress();
              }}
            />
            <Image
              source={Images.alertIcon}
              style={{alignSelf: 'center', width: wp(15), height: wp(15)}}
            />
            <CustomText
              style={{
                fontSize: wp(7),
                alignSelf: 'center',
                padding: wp(4),
                fontFamily: fontFamily['ArticulatCF-DemiBold'],
              }}>
              Alert
            </CustomText>
            {/* <MaterialCommunityIcons
      name={'alert-outline'}
      size={wp(13)}
      color={Colors.alet_icon}
    /> */}

            <CustomText
              style={[styles.alertText, globalStyling.textFontNormal]}>
              {String(elseResponse?.alertText).replace('HelpLine', 'Helpline')}
            </CustomText>
            {elseResponse?.alertCode ? (
              <CustomText
                style={[styles.alertCode, globalStyling.textFontNormal]}>
                {`Code:${elseResponse?.alertCode}`}
              </CustomText>
            ) : null}

            {/* <CustomBtn
      btn_txt={'Okay'}
      onPress={() => {
        if (
          elseResponse.alertText ===
          Message.networkErrorMessage
        ) {
          dispatch(checkNetworkConnectivity());
        }
        if (elseResponse?.alertTitle === 'App Update') {
          console.log('open provided link');
        } else {
          dispatch(setElseResponseAlert());
        }
      }}
      btn_width={wp(55)}
      backgroundColor={Colors.primary_green}
    /> */}
            <TouchableWithoutFeedback
              onPress={() => {
                getAndroidOnPress();
              }}>
              <View
                style={{
                  backgroundColor: Colors.primary_green,
                  height: wp(12),
                  width: wp(70),
                  alignSelf: 'center',
                  borderRadius: wp(1),
                  justifyContent: 'center',
                  alignItems: 'center',
                }}>
                <CustomText
                  style={[
                    {
                      color: Colors.whiteColor,
                    },
                    globalStyling.textFontBold,
                  ]}>
                  OK
                </CustomText>
              </View>
            </TouchableWithoutFeedback>
          </View>
        </>
      </Modal>
    );
  };
  const getAndroidOnPress = () => {
    let fingerprintLableForOS =
      Platform.OS == 'ios' ? 'Touch ID' : 'Fingerprint';
    if (elseResponse.alertText === Message.networkErrorMessage) {
      dispatch(setElseResponseAlert());

      setTimeout(() => {
        dispatch(checkNetworkConnectivity());
      }, 500);
    } else if (elseResponse.onPress) {
      if (
        elseResponse?.alertTitle === 'App Update' ||
        elseResponse.alertTitle === 'Security Alert' ||
        elseResponse.alertText ===
          `You are using the Older Version of NBP application ,Please update the application from ${
            Platform.OS === 'android' ? 'PlayStore' : 'AppStore'
          } to use this app.`
      ) {
        elseResponse.onPress();
        if (elseResponse.myVersion === elseResponse.latestVersion) {
          setTimeout(() => {
            dispatch(setElseResponseAlert());
          }, 500);
        }
      } else {
        dispatch(setElseResponseAlert());
        setTimeout(() => {
          elseResponse.onPress();
        }, 500);
      }
      // }
    } else if (
      elseResponse.alertText ===
      `Please note ${fingerprintLableForOS} has not been enabled for this device. To use this feature, please enable ${fingerprintLableForOS} in your device settings.`
    ) {
      setTimeout(() => {
        currentNavigation.goBack();
      }, 500);
    } else if (
      elseResponse.alertText === 'Card Already Provisoned!' ||
      elseResponse.alertText === 'Card Enrolled Successfully.' ||
      elseResponse.alertText ===
        'Digital Debit Card PIN successfully created' ||
      elseResponse.alertText === 'MPIN added successfully' ||
      elseResponse.alertText === 'Transaction Completed Successfully' ||
      elseResponse.alertText === 'Card not active' ||
      elseResponse.alertText === 'No Beneficiary Found.' ||
      elseResponse.alertText === 'MPIN changed successfully' ||
      elseResponse.alertText === 'No record found' ||
      elseResponse.alertText === 'Issuer System Error' ||
      elseResponse.alertText === 'Card Status Error' ||
      elseResponse.alertText ===
        'Unable to perform transaction as your card is currently suspended' ||
      elseResponse.alertText === 'MPIN Generated successfully' ||
      elseResponse.alertText === 'MPIN changed successfully' ||
      elseResponse.alertText ===
        'Unable to generate QR as your card is currently suspended.' ||
      elseResponse.alertText ===
        `${
          ReactNativeBiometrics.FaceID && Platform.OS === 'ios'
            ? 'Face ID'
            : 'Touch ID'
        } is now enabled.` ||
      elseResponse.alertText === 'Pin Updated Successfully.' ||
      elseResponse.alertText === 'Pin reset successfully'
    ) {
      dispatch(setElseResponseAlert());
      setTimeout(() => {
        currentNavigation.navigate('Home');
      }, 500);
    } else if (
      elseResponse.alertText ===
        `${
          ReactNativeBiometrics.FaceID && Platform.OS === 'ios'
            ? 'Face ID'
            : 'Touch ID'
        } is now disabled.` &&
      isLoginState
    ) {
      // currentNavigation.navigate('Home');
      dispatch(setElseResponseAlert());
      setTimeout(() => {
        currentNavigation.navigate('Home');
      }, 500);
    } else if (
      elseResponse.alertText ===
        `${
          ReactNativeBiometrics.FaceID && Platform.OS === 'ios'
            ? 'Face ID'
            : 'Touch ID'
        } is now disabled.` &&
      !isLoginState
    ) {
      dispatch(setElseResponseAlert());

      setTimeout(() => {
        currentNavigation.dispatch(
          CommonActions.reset({
            index: 0,
            routes: [{name: 'Login'}],
          }),
        );
      }, 500);
    } else if (
      elseResponse.alertText ===
      'Dear Customer, please do not share your OTP with anyone. Your OTP has been sent to your email and mobile number. Please login with this OTP to create your own password.'
    ) {
      dispatch(setElseResponseAlert());
      setTimeout(() => {
        currentNavigation.dispatch(
          CommonActions.reset({
            index: 0,
            routes: [{name: 'Login'}],
          }),
        );
      }, 500);
    } else if (elseResponse.alertText === 'Certificate Pinning Failure.') {
      dispatch(setElseResponseAlert());
      setTimeout(() => {
        makeSslPinRequest();
      }, 500);
    }
    // else if(elseResponse.alertText==='MPIN Generated Successfully.'){
    //   dispatch(setElseResponseAlert());
    //   props.navigation.dispatch(
    //     CommonActions.reset({
    //       index: 0,
    //       routes: [{name: 'Home'}],
    //     }),
    //   );
    // }
    if (
      elseResponse?.alertTitle === 'App Update' ||
      elseResponse.alertTitle === 'Security Alert' ||
      elseResponse.alertText ===
        `You are using the Older Version of NBP application ,Please update the application from ${
          Platform.OS === 'android' ? 'PlayStore' : 'AppStore'
        } to use this app.`
    ) {
      elseResponse.onPress();
      if (elseResponse.myVersion === elseResponse.latestVersion) {
        setTimeout(() => {
          dispatch(setElseResponseAlert());
        }, 500);
      }
    } else {
      dispatch(setElseResponseAlert());
    }
  };
  return elseResponse.state ? (
    Platform.OS == 'android' ||
    (Platform.OS === 'ios' &&
      (elseResponse?.alertTitle === 'App Update' ||
        elseResponse.alertTitle === 'Security Alert' ||
        elseResponse.alertText ===
          `You are using the Older Version of NBP application ,Please update the application from ${
            Platform.OS === 'android' ? 'PlayStore' : 'AppStore'
          } to use this app.`)) ? (
      getAlertAndroid()
    ) : (
      <View>{getAlert()}</View>
    )
  ) : (
    <View></View>
  );
}
const styles = StyleSheet.create({
  okayImage: {
    width: wp(50),
    height: wp(15),
    overflow: 'hidden',
    alignSelf: 'center',
  },
  mainView: {
    backgroundColor: 'white',
    paddingVertical: wp(2.5),
    paddingHorizontal: wp(3),
    justifyContent: 'center',
    borderRadius: wp(1),
    // borderBottomEndRadius: wp(1),
    // borderBottomLeftRadius: wp(1),
    // borderBottomRightRadius: wp(1),
  },
  rowView: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    alignSelf: 'center',
    backgroundColor: Colors.primary_green,
    borderTopLeftRadius: wp(1),
    borderTopRightRadius: wp(1),
    height: wp(10),
    // marginHorizontal: wp(2),
  },
  alertText: {
    fontSize: wp(4.2),
    textAlign: 'center',
    marginVertical: wp(5),
    width: '97%',
    alignSelf: 'center',
  },
  alertCode: {
    fontSize: wp(4),
    textAlign: 'center',
    width: '30%',
    marginVertical: wp(2),
    alignSelf: 'center',
    color: Colors.themeGreyColor,
  },
  titleText: {
    fontSize: wp(4.3),
    color: Colors.whiteColor,
    marginLeft: wp(2),
  },
  seperator: {
    width: '99%',
    alignSelf: 'center',
    borderWidth: wp(0.2),
    borderColor: 'grey',
  },
});
