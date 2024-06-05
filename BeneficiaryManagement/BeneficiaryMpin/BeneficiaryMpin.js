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
  smoothCodeInputStyle,
  validateOnlyNumberInput,
  wp,
} from '../../../Constant';
import SubHeader from '../../../Components/GlobalHeader/SubHeader/SubHeader';
import SmoothPinCodeInput from 'react-native-smooth-pincode-input';
import {setCurrentFlow, validate_add_benef} from '../../../Redux/Action/Action';
import {useDispatch} from 'react-redux';
import CustomText from '../../../Components/CustomText/CustomText';
import {Colors, Images} from '../../../Theme';
import {useTheme} from '../../../Theme/ThemeManager';
import analytics from '@react-native-firebase/analytics';

export default function BeneficiaryMpin(props) {
  const dispatch = useDispatch();
  const {activeTheme} = useTheme();
  const [mpin, setMpin] = useState('');
  useEffect(() => {
    if (mpin.length === 4) {
      const requestobject = {
        token: props.route.params.response.data.token,
        otp: mpin,
      };
      Keyboard.dismiss();

      dispatch(validate_add_benef(props.navigation, requestobject));
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
  useEffect(() => {
    props.navigation.addListener('focus', () => {
      dispatch(setCurrentFlow('Beneficiary MPIN'));
      async function analyticsLog() {
        await analytics().logEvent('BeneficiaryMpin');
      }
      analyticsLog();
    });
  }, []);
  return (
    <View
      style={[
        globalStyling.container,
        {backgroundColor: Colors.backgroundColor},
      ]}
      accessibilityLabel="Beneficiary M PIN Screen">
      {/* <GlobalHeader navigation={props.navigation} /> */}
      <SubHeader
        navigation={props.navigation}
        title={'Add Beneficiary'}
        description={'Add Beneficiary in the list'}
        // addBeneficiary={true}
        onPress={() => {
          props.navigation?.pop(3);
        }}
      />
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={{height: wp(13)}} />

        <View style={{width: wp(20), height: wp(6), alignSelf: 'center'}}>
          <Image
            // style={globalStyling.image}
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
        <CustomText style={styles.textStyle}>Please enter your MPIN</CustomText>
        <View style={styles.codeFieldView}>
          <SmoothPinCodeInput
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
    // color: Colors.noteRed,
    textAlign: 'center',
  },
});
