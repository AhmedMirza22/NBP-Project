import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  Keyboard,
  ScrollView,
  Image,
} from 'react-native';
import {
  globalStyling,
  smoothCodeInputStyle,
  validateOnlyNumberInput,
  wp,
} from '../../../Constant';
import SubHeader from '../../../Components/GlobalHeader/SubHeader/SubHeader';
import SmoothPinCodeInput from 'react-native-smooth-pincode-input';
import {Label} from '../../../Constant/Labels';
import {
  setLoader,
  serviceResponseCheck,
  catchError,
  updateSessionToken,
  changeGlobalIconAlertState,
} from '../../../Redux/Action/Action';
import {useDispatch} from 'react-redux';
import {logs} from '../../../Config/Config';
import {postTokenCall, Service} from '../../../Config/Service';
import CustomText from '../../../Components/CustomText/CustomText';
import {CommonActions} from '@react-navigation/native';
import {Colors, Images} from '../../../Theme';
import {useTheme} from '../../../Theme/ThemeManager';

export default function RAASTBenefMPIN(props) {
  const dispatch = useDispatch();
  const [mpin, setMpin] = useState('');
  logs.log('MPIN RAAST', props.route.params?.data?.token);
  const responseObj = props.route.params?.requestobj;
  const {activeTheme} = useTheme();

  const call = async () => {
    try {
      dispatch(setLoader(true));
      const response = await postTokenCall(Service.raastBenefAdd, {
        token: props.route.params?.data?.token,
        otp: mpin,
      });
      if (response.status === 200 && response.data.responseCode === '00') {
        logs.log('Bene add success');
        //   success
        //   props.navigation.navigate('SuccessScreen', {
        //     data: {navigation: props.navigation},
        //   });
        dispatch(updateSessionToken(response));
        // dispatch(setAppAlert('Beneficiary Added Succesfully'));
        setTimeout(() => {
          dispatch(
            changeGlobalIconAlertState(true, props.navigation, {
              message: 'Beneficiary Added Succesfully',
              successAlert: true,
              onPressOk: () => {
                changeGlobalIconAlertState(false);
                setTimeout(() => {
                  props.navigation.navigate('Home');
                }, 500);
              },
            }),
          );
        }, 500);

        dispatch(setLoader(false));
      } else {
        dispatch(serviceResponseCheck(response));
        props.navigation.dispatch(
          CommonActions.reset({
            index: 0,
            routes: [{name: 'BeneficiaryManagement'}],
          }),
        );
      }
    } catch (error) {
      dispatch(catchError(error));
      props.navigation.dispatch(
        CommonActions.reset({
          index: 0,
          routes: [{name: 'BeneficiaryManagement'}],
        }),
      );
    }
  };
  useEffect(() => {
    if (mpin.length === 4) {
      Keyboard.dismiss();
      call();
    }
  }, [mpin]);
  React.useEffect(() => {}, []);
  return (
    <View
      style={[
        globalStyling.container,
        {backgroundColor: Colors.backgroundColor},
      ]}>
      {/* <GlobalHeader navigation={props.navigation} /> */}
      <SubHeader
        navigation={props.navigation}
        title={Label.subHeaderTitle.raastBenef}
        description={Label.subHeaderDescription.addRasstBenef}
        // utilityBillPayments={true}
        onPress={() => {
          props.navigation?.pop(3);
        }}
      />
      <View style={{height: wp(13)}} />

      <View style={{width: wp(20), height: wp(6), alignSelf: 'center'}}>
        <Image
          style={{height: wp(20), width: wp(20)}}
          // resizeMode="contain"
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
          // source={require('../../../Assets/RAAST_Icons/mpin.png')}
        />
      </View>
      <View style={{height: wp(13)}} />

      <ScrollView showsVerticalScrollIndicator={false}>
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
            cellSize={smoothCodeInputStyle.cellSize}
            cellSpacing={smoothCodeInputStyle.cellSpacing}
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
        {/* <View style={{flexDirection:'row'}}> */}
        {/* <CustomText style={styles.noteText}>
          {'4 ہندسوں کا MPIN درج کریں، اپنے MPIN کو کسی کے ساتھ شیئر نہ کریں۔'}
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
