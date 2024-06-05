import React, {useState, useRef} from 'react';
import {
  View,
  Text,
  Dimensions,
  KeyboardAvoidingView,
  ScrollView,
  Platform,
} from 'react-native';
import CustomText from '../../../../Components/CustomText/CustomText';
import GlobalHeader from '../../../../Components/GlobalHeader/GlobalHeader';
import SubHeader from '../../../../Components/GlobalHeader/SubHeader/SubHeader';
import CustomTextField from '../../../../Components/CustomTextField/CustomTextField';
import Feather from 'react-native-vector-icons/Feather';
import CustomBtn from '../../../../Components/Custom_btn/Custom_btn';
import {Colors} from '../../../../Theme';
import CustomAlert from '../../../../Components/Custom_Alert/CustomAlert';
import {wp} from '../../../../Constant';
import styles from './AddAccountStyling';
import {useSelector, useDispatch} from 'react-redux';
import {
  setCurrentFlow,
  addAccount,
  addAccountTitleFetch,
  setAppAlert,
} from '../../../../Redux/Action/Action';
import analytics from '@react-native-firebase/analytics';
import {isRtlState} from '../../../../Config/Language/LanguagesArray';
const screenWidth = Dimensions.get('window').width;

export default function AddAccount(props) {
  const ref1 = useRef();
  const ref2 = useRef();
  const token = useSelector((state) => state.reducers.token);
  const dispatch = useDispatch();
  const [showImageAlert, changeImageAlertStatus] = React.useState(false);
  const [showResponseStatus, changeshowResponseStatus] = React.useState(false);
  const [cnic, setCnic] = useState('');
  const [accountNumber, setAccountNumber] = useState('');
  const overViewData = useSelector((state) => state.reducers.overViewData);

  React.useEffect(() => {
    props.navigation.addListener('focus', () => {
      dispatch(setCurrentFlow('Add Account'));
      async function analyticsLog() {
        await analytics().logEvent('AddAccountScreen');
      }
      analyticsLog();
    });
  }, []);

  const checkValidation = () => {
    if (cnic.length !== 13) {
      dispatch(setAppAlert('Invalid CNIC. Please enter correct CNIC'));
    } else if (accountNumber.length < 14) {
      dispatch(
        setAppAlert(
          'Invalid Account Number. Please enter correct account number',
        ),
      );
    } else if (overViewData?.data?.accounts?.account == accountNumber) {
      dispatch(setAppAlert('Default account cannot be added'));
    } else {
      dispatch(
        addAccount(
          token,
          props.navigation,
          '1.00',
          '1',
          cnic,
          '',
          '979898',
          accountNumber,
          '',
          accountNumber,
        ),
      );
    }
  };
  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : null}
      keyboardVerticalOffset={40}
      style={[styles.container, {backgroundColor: Colors.backgroundColor}]}
      accessibilityLabel="Add Account Screen">
      {/* <GlobalHeader navigation={props.navigation} /> */}
      <SubHeader
        navigation={props.navigation}
        title={'Add Account'}
        description={'Link your other accounts'}
      />
      <View style={{height: wp(6)}} />
      <CustomTextField
        ref={ref1}
        textHeading={cnic ? 'Enter CNIC' : null}
        placeholder={cnic ? null : 'Enter CNIC'}
        Textfield_label={''}
        text_input={cnic}
        onChangeText={(value) => {
          setCnic(String(value).replace(/[^0-9]/g, ''));
        }}
        onSubmitEditing={() => {
          ref2.current.focus();
        }}
        returnKeyType={Platform.OS === 'ios' ? 'done' : 'next'}
        width={'90%'}
        keyboardType="number-pad"
        maxLength={13}
      />
      <View style={{height: wp(4)}} />

      <View
        style={{
          flexDirection: isRtlState() ? 'row' : 'row-reverse',
          alignSelf: 'center',
          width: '90%',
          justifyContent: 'center',
          margin: wp(2),
        }}>
        <CustomTextField
          ref={ref2}
          placeholder={accountNumber ? null : 'Enter Account Number'}
          textHeading={accountNumber ? 'Enter Account Number' : null}
          Textfield_label={''}
          text_input={accountNumber}
          onChangeText={(value) => {
            setAccountNumber(String(value).replace(/[^0-9]/g, ''));
          }}
          width={'83%'}
          keyboardType="number-pad"
          maxLength={14}
        />
        <View style={{width: wp(3)}}></View>
        <View
          style={{
            borderWidth: 0.5,
            // backgroundColor,
            borderColor: Colors.textFieldBorderColor,
            // alignItems: 'center',
            alignSelf: 'center',
            justifyContent: 'center',
            width: wp(12),
            height: wp(13),
            borderRadius: wp(1),
            backgroundColor: Colors.textfieldBackgroundColor,
          }}>
          <Feather
            name={'info'}
            size={wp(6)}
            color={Colors.tabNavigateRightIcon}
            onPress={() => changeImageAlertStatus(true)}
            style={{alignSelf: 'center'}}
          />
        </View>
      </View>
      {/* <View style={styles.row}> */}

      <CustomText style={styles.infoText}>
        Please enter 14 digits account number BBBBAAAAAAAAAA where BBBB= Branch
        Code & AAAAAAAAAA=Account number
      </CustomText>
      <View style={{position: 'absolute', bottom: wp(10), alignSelf: 'center'}}>
        <CustomBtn
          accessibilityLabel="Continue"
          accessibilityRole="button"
          btn_txt={'Continue'}
          onPress={() => {
            checkValidation();
          }}
          btn_width={wp(90)}
          backgroundColor={Colors.primary_green}
        />
      </View>
      <CustomAlert
        accessibilityLabel="National Bank Account Number Policy"
        accessibilityRole="alert"
        overlay_state={showImageAlert}
        nationalBankAccountNumberPolicy={true}
        title={'National Bank Account Number Policy'}
        onPressCancel={() => changeImageAlertStatus(false)}
        noTitle={true}
      />
      <CustomAlert
        accessibilityLabel="CNIC Mismatch"
        accessibilityRole="alert"
        overlay_state={showResponseStatus}
        title={'Add Account'}
        alert_text={'CNIC mismatch.'}
        onPressCancel={() => changeshowResponseStatus(false)}
        onPressOkay={() => changeshowResponseStatus(false)}
      />
    </KeyboardAvoidingView>
  );
}
