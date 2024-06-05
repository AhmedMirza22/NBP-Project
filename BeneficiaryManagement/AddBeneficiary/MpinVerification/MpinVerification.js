import React, {useState} from 'react';
import {View} from 'react-native';
import styles from './MpinverifyStyle';
import SmoothPinCodeInput from 'react-native-smooth-pincode-input';
import {useSelector, useDispatch} from 'react-redux';
import GlobalHeader from '../../../../Components/GlobalHeader/GlobalHeader';
import SubHeader from '../../../../Components/GlobalHeader/SubHeader/SubHeader';
import {wp, globalStyling} from '../../../../Constant/Contant';
import {Colors} from '../../../../Theme';
import {smoothCodeInputStyle} from '../../../../Constant';
import CustomText from '../../../../Components/CustomText/CustomText';
import analytics from '@react-native-firebase/analytics';

const MpinVerification = (props) => {
  const [pass, set_pass] = useState('');
  React.useEffect(() => {
    async function analyticsLog() {
      await analytics().logEvent('MpinVerification');
    }
    analyticsLog();
  }, []);

  return (
    <View
      style={globalStyling.whiteContainer}
      accessibilityLabel="M PIN Verification Screen">
      {/* <GlobalHeader navigation={props.navigation} hideBoth={true} /> */}
      <SubHeader
        title={'Add Beneficiary'}
        description={'Add Beneficiary in the list'}
        addBeneficiary={true}
        hideBackArrow={true}
      />
      <View style={styles.gap} />
      <CustomText style={styles.title}>Enter OTP</CustomText>
      <SmoothPinCodeInput
        password
        mask="*"
        cellStyleFocused={{
          borderColor: smoothCodeInputStyle.borderColorFocusedCell,
        }}
        textStyle={{
          fontSize: smoothCodeInputStyle.fontSize,
          color: Colors.mainTextColors,
        }}
        keyboardType="email-address"
        cellStyle={{
          borderWidth: smoothCodeInputStyle.borderWidth,
          borderRadius: smoothCodeInputStyle.borderRadius,
          borderColor: Colors.textFieldBorderColor,
          backgroundColor: Colors.smoothCodePinInputBackground,
        }}
        containerStyle={{alignSelf: 'center'}}
        cellSpacing={wp(2.5)}
        codeLength={6}
        value={pass}
        onTextChange={(pass) => {
          set_pass(pass);
        }}
        cellSize={wp(13)}
      />
    </View>
  );
};

export default MpinVerification;
