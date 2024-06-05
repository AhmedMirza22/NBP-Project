import React, {useState, useRef, useEffect} from 'react';
import {
  View,
  Image,
  Text,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Keyboard,
} from 'react-native';
import {wp, globalStyling, hp} from '../../Constant';
import I18n from '../../Config/Language/LocalizeLanguageString';
import GlobalHeader from '../../Components/GlobalHeader/GlobalHeader';
import CustomTextField from '../../Components/CustomTextField/CustomTextField';
import CustomBtn from '../../Components/Custom_btn/Custom_btn';
import CustomAlert from '../../Components/Custom_Alert/CustomAlert';
import styles from './TouchIDStyling';
import {CheckBox} from 'react-native-elements';
import {Colors, Images} from '../../Theme';
import {useDispatch, useSelector} from 'react-redux';
import {
  setAskForFingerPrintState,
  storeFingerPrint2,
  setCurrentFlow,
  setCurrentNavigation,
} from '../../Redux/Action/Action';
import analytics from '@react-native-firebase/analytics';

import FontAwesome from 'react-native-vector-icons/FontAwesome';
import {geoLocation} from '../../Config/Service';
import SplashScreen from 'react-native-splash-screen';
import ReactNativeBiometrics from 'react-native-biometrics';
import {logs} from '../../Config/Config';
import CustomText from '../../Components/CustomText/CustomText';
import SubHeader from '../../Components/GlobalHeader/SubHeader/SubHeader';
import {isRtlState} from '../../Config/Language/LanguagesArray';

export default function TouchID(props) {
  const ref1 = useRef();
  const ref2 = useRef();
  const fcmToken = useSelector((state) => state.reducers.fcmToken);
  const [isSelected, setSelection] = useState(false);
  const [name, setname] = useState('');
  const [password, setpassword] = useState('');
  const [isbioactivate, change_isbioactivate] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [currentLatitude, setCurrentLatitude] = useState('');
  const [currentLongitude, setCurrentLongitude] = useState('');
  const askForFingerPrintState = useSelector(
    (state) => state.reducers.askForFingerPrintState,
  );
  const dispatch = useDispatch();
  useEffect(() => {
    props.route.params?.data === 'termsAccepted' ? setSelection(true) : null;
    props.navigation.addListener('focus', () => {
      async function analyticsLog() {
        await analytics().logEvent('TouchID');
      }
      analyticsLog();

      geoLocation((location) => {
        logs.debug(
          'location.latitude--->>>',
          location.latitude,
          'location.longitude',
          location.longitude,
        );
        setCurrentLatitude(location.latitude);
        setCurrentLongitude(location.longitude);
      });
      dispatch(setCurrentNavigation(props.navigation));
      dispatch(
        setCurrentFlow(
          isbioactivate == 'touch' || Platform.OS == 'android'
            ? 'Touch ID'
            : 'Face ID',
        ),
      );
    });
  }, []);

  useEffect(() => {
    ReactNativeBiometrics.isSensorAvailable().then((resultObject) => {
      const {available, biometryType} = resultObject;
      if (available && biometryType === ReactNativeBiometrics.TouchID) {
        logs.log('touch supported ');
        change_isbioactivate('touch');
      } else if (available && biometryType === ReactNativeBiometrics.FaceID) {
        logs.log('face');
        change_isbioactivate('face');
      } else if (
        available &&
        biometryType === ReactNativeBiometrics.Biometrics
      ) {
        logs.log('Biometrics is supported');
        change_isbioactivate('touch');
      } else {
        logs.log('touchid Biometrics not supported');
      }
    });
  }, []);

  const checkValidation = () => {
    if (password === '' || name === '') {
      global.showToast.show(
        I18n['Please enter valid Username and Password'],
        1000,
      );
    } else if (!isSelected && props.route.params?.data !== 'termsAccepted') {
      global.showToast.show(
        I18n['Please accept the terms and conditions'],
        1000,
      );
    } else {
      // dispatch(
      //   storeFingerPrint(name, password, fcmToken, props.navigation, () =>
      //     dispatch(
      //       storeFingerPrint(name, password, fcmToken, props.navigation),
      //     ),
      //   ),
      // );
      // by ameer hamza
      dispatch(
        storeFingerPrint2(
          name,
          password,
          fcmToken,
          currentLatitude,
          currentLongitude,
          props.navigation,
        ),
      );
    }
  };

  return (
    <View
      style={[
        globalStyling.container,
        {backgroundColor: Colors.backgroundColor},
      ]}>
      <SubHeader
        title={
          isRtlState() == false
            ? `ٹچ آئی ڈی ${
                isbioactivate == 'touch' || Platform.OS == 'android'
                  ? 'کے ساتھ لاگ ان'
                  : 'چہرے کی شناخت'
              }`
            : `Login with ${
                isbioactivate == 'touch' || Platform.OS == 'android'
                  ? 'Touch ID'
                  : 'Face ID'
              }`
        }
        // register={true}
        description={
          isRtlState() == false
            ? `ٹچ آئی ڈی ${
                isbioactivate == 'touch' || Platform.OS == 'android'
                  ? 'مینج کریں'
                  : 'چہرے کی شناخت'
              }`
            : `Manage ${
                isbioactivate == 'touch' || Platform.OS == 'android'
                  ? 'Touch ID'
                  : 'Face ID'
              }`
        }
        hideHomeButton={true}
        navigation={props.navigation}
      />
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={globalStyling.scrollContent}>
        <View style={styles.gap}></View>
        {isbioactivate == 'touch' || Platform.OS == 'android' ? (
          <Image
            source={Images.touchIdNew}
            resizeMode="contain"
            style={{height: wp(20), width: wp(20), alignSelf: 'center'}}
          />
        ) : (
          <Image
            source={Images.faceIdNew}
            resizeMode="contain"
            style={{height: wp(20), width: wp(20), alignSelf: 'center'}}
          />
        )}
        <View style={styles.littleGap}></View>
        <CustomText
          boldFont={true}
          style={{alignSelf: 'center', fontSize: wp(5.7)}}>
          {isRtlState() == false
            ? `${
                isbioactivate == 'touch' || Platform.OS == 'android'
                  ? 'ٹچ آئی ڈی'
                  : 'چہرے کی شناخت'
              }`
            : `${
                isbioactivate == 'touch' || Platform.OS == 'android'
                  ? 'Touch ID'
                  : 'Face ID'
              }`}
        </CustomText>
        <View style={styles.littleGap}></View>

        <CustomText style={styles.label}>
          {isRtlState() == false
            ? ` ٹچ آئی ڈی ${
                isbioactivate == 'touch' || Platform.OS == 'android'
                  ? ' انیبل کرنے کے لیے '
                  : 'چہرے کی شناخت'
              } براہ کرم موبائل\nبینکنگ میں لاگ ان کریں۔`
            : ` To enable ${
                isbioactivate == 'touch' || Platform.OS == 'android'
                  ? 'Touch ID'
                  : 'Face ID'
              } please login to mobile\nbanking`}
        </CustomText>
        <CustomTextField
          width={wp(90)}
          accessibilityLabel="Enter your Username"
          ref={ref1}
          placeholder={'Enter Username'}
          Textfield_label={'Enter Username'}
          returnKeyType="next"
          // icon_name={'user'}
          onChangeText={(value) => {
            setname(value);
          }}
          onSubmitEditing={() => {
            ref2.current.focus();
          }}
          // showUnderline={true}
          maxLength={25}
          // hideBorder={true}
          text_input={name}
        />
        <View style={styles.gap} />
        <CustomTextField
          accessibilityLabel="Enter your Password"
          ref={ref2}
          ispass={showPass ? false : true}
          onPressIn={() => setShowPass(true)}
          onPressOut={() => setShowPass(false)}
          showPassword={true}
          width={wp(90)}
          placeholder={'Enter Password'}
          // showUnderline={true}
          Textfield_label={'Enter Your Password'}
          onChangeText={(value) => {
            setpassword(value);
          }}
          // icon_name={'lock'}
          // hideBorder={true}
        />
        <View style={styles.gap} />
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'flex-start',
            width: '92%',
            paddingLeft: wp(2.3),
            // alignSelf: 'center',
            // paddingTop: wp(10),
          }}>
          <CheckBox
            accessibilityRole="checkbox"
            checked={
              props.route.params?.data === ' termsAccepted' ? true : isSelected
            }
            // title={'I accept the Terms and Conditions'}
            title={isRtlState() == false ? ' قبول کرتا ہوں۔' : 'I accept the'}
            containerStyle={{
              borderColor: 'transparent',
              backgroundColor: 'transparent',

              padding: 0,
              margin: 0,
            }}
            textStyle={[
              {fontSize: wp(4), fontWeight: '500'},
              globalStyling.textFontNormal,
            ]}
            onPress={() => {
              setSelection(!isSelected);
            }}
            checkedIcon={
              <FontAwesome
                name={'check-square'}
                size={wp(5)}
                color={Colors.primary_green}
              />
            }
            uncheckedIcon={
              <FontAwesome name={'square'} size={wp(5)} color={Colors.grey} />
            }
            checkedColor={Colors.primary_green}
            size={wp(8)}
          />
          <CustomText
            style={{
              marginLeft: wp(-3.5),
              fontWeight: '500',
              fontSize: wp(4),
              color: Colors.primary_green,
            }}
            onPress={() => {
              props.navigation.navigate('TouchTermsAndConditions', {
                data: 'fromAuth',
              });
            }}>
            {isRtlState() ? 'terms and conditions' : 'میں ضوابط اور شرائط'}
          </CustomText>
        </View>

        <CustomAlert
          overlay_state={askForFingerPrintState}
          alert_text={'Place your finger on scanner'}
          fingerPrintScanner={true}
          onPressCancel={() => {
            dispatch(setAskForFingerPrintState(false, props.navigation));
          }}
        />
      </ScrollView>
      <KeyboardAvoidingView
        keyboardVerticalOffset={hp(7)}
        behavior={'padding'}
        style={globalStyling.buttonContainer}>
        <CustomBtn
          btn_txt={'Sign In'}
          accessibilityLabel={'LOGIN'}
          backgroundColor={Colors.primary_green}
          btn_width={wp(90)}
          onPress={() => {
            Keyboard.dismiss();
            checkValidation();
          }}
        />
      </KeyboardAvoidingView>
    </View>
  );
}
