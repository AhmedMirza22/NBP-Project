import React, {useState, useRef} from 'react';
import {
  View,
  Text,
  Dimensions,
  Platform,
  KeyboardAvoidingView,
  ScrollView,
} from 'react-native';
import styles from './EditBeneficiaryStyle';
import GlobalHeader from '../../../Components/GlobalHeader/GlobalHeader';
import SubHeader from '../../../Components/GlobalHeader/SubHeader/SubHeader';
import CustomTextField from '../../../Components/CustomTextField/CustomTextField';
import CustomBtn from '../../../Components/Custom_btn/Custom_btn';
import {Colors} from '../../../Theme';
import {useSelector, useDispatch} from 'react-redux';
import {
  add_benef,
  setCurrentFlow,
  setAppAlert,
  changeGlobalIconAlertState,
  update_benef,
} from '../../../Redux/Action/Action';
import {
  globalStyling,
  validateOnlyAlphaNumericSpace,
  validateonlyAlphaNumeric,
  wp,
} from '../../../Constant';
import {appInfo, logs} from '../../../Config/Config';
import {check_email, maskedAccount} from '../../../Helpers/Helper';
import {Message} from '../../../Constant/Messages/index';
import CustomText from '../../../Components/CustomText/CustomText';
import analytics from '@react-native-firebase/analytics';
const screenWidth = Dimensions.get('window').width;

const EditBeneficiary = (props) => {
  const ref1 = useRef();
  const ref2 = useRef();
  const ref3 = useRef();
  const dispatch = useDispatch();
  const [alias, set_alias] = useState('');
  const [phone, set_phone] = useState('');
  const [email, set_email] = useState('');
  logs.log('asdasd', props.route.params);
  const accountno = props.route.params?.benefAccount;

  const benefitype = props.route.params?.data?.benefiType;
  const transtype = props.route.params?.data?.transtype;
  const imd = props.route.params?.data?.imd;
  const companyName = props.route.params?.data?.companyName;
  const beneftitle = props.route.params?.benefTitle;

  logs.log(imd);
  // console.log('yaffar', props.route.params?.responseData?.data?.customerName);
  React.useEffect(() => {
    props.navigation.addListener('focus', () => {
      async function analyticsLog() {
        await analytics().logEvent('EditBeneficiaryScreen');
      }
      analyticsLog();
      dispatch(setCurrentFlow('Edit Beneficiary'));
    });
    set_alias(props.route.params?.benefAlias);
    set_phone(props.route.params?.benefMobile);
    set_email(props.route.params?.benefEmail);
  }, []);

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : null}
      keyboardVerticalOffset={40}
      style={[
        globalStyling.whiteContainer,
        {backgroundColor: Colors.backgroundColor},
      ]}
      accessibilityLabel="Beneficiary Input Screen">
      <SubHeader
        title={'Edit Beneficiary'}
        description={'Edit Beneficiary in the list'}
        navigation={props.navigation}
      />
      <ScrollView style={globalStyling.whiteContainer}>
        <View style={{height: wp(4)}} />
        <View
          style={{
            alignSelf: 'center',
            justifyContent: 'flex-start',
            borderWidth: 1,
            borderColor: Colors.textFieldBorderColor,
            borderRadius: 8,
            width: wp(90),
            backgroundColor: Colors.subContainer,
            marginTop: wp(1),
            padding: wp(5),
          }}>
          <View
            style={{
              backgroundColor: Colors.childContainer,
              width: wp(85),
              alignSelf: 'center',
              borderRadius: wp(1.5),
              padding: wp(4),
            }}>
            <CustomText style={{padding: wp(1), color: '#9ea3a6'}}>
              {'Account Title'}
            </CustomText>
            <CustomText
              boldFont={true}
              style={{padding: wp(0.8), fontSize: wp(4.45)}}>
              {beneftitle}
            </CustomText>
            <CustomText style={{padding: wp(1), color: '#9ea3a6'}}>
              {props.route.params?.data?.type &&
              props.route.params?.data?.type === 'mobilePayment'
                ? 'Beneficiary Mobile Number:'
                : 'Account Number/ IBAN'}
            </CustomText>
            <CustomText
              boldFont={true}
              style={{padding: wp(0.8), fontSize: wp(4.45)}}>
              {accountno}
            </CustomText>
          </View>
          <View style={{height: wp(1)}} />
        </View>

        <View style={styles.gap}></View>

        <CustomTextField
          textHeading={alias.length == 0 ? null : 'Short Name'}
          ref={ref1}
          placeholder={'Short Name '}
          // Textfield_label={'Enter Debit/ATM Card Number'}
          text_input={alias}
          onChangeText={(value) => {
            set_alias(validateOnlyAlphaNumericSpace(value));
            ('Card number :');
          }}
          onSubmitEditing={() => {
            ref2.current.focus();
          }}
          returnKeyType={'next'}
          maxLength={appInfo.shortNameLengths}
          width={'90%'}
        />
        <View style={styles.gap}></View>

        <CustomTextField
          ref={ref2}
          textHeading={phone.length == 0 ? null : 'Phone (Optional)'}
          placeholder={'Phone (Optional) '}
          onSubmitEditing={() => {
            ref3.current.focus();
          }}
          returnKeyType={Platform.OS === 'ios' ? 'done' : 'next'}
          text_input={phone}
          onChangeText={(value) => {
            set_phone(String(value).replace(/[^0-9]/g, ''));
          }}
          maxLength={11}
          width={'90%'}
          keyboardType="number-pad"
        />
        <View style={styles.gap}></View>

        <CustomTextField
          ref={ref3}
          textHeading={email.length == 0 ? null : 'Email (Optional)'}
          placeholder={'Email (Optional)'}
          // Textfield_label={'Enter Debit/ATM Card Number'}
          onChangeText={(value) => {
            set_email(value);
            // ('Card number :');
          }}
          keyboardType="email-address"
          width={'90%'}
        />
        <View style={styles.gap}></View>
        <CustomBtn
          btn_txt={'Update'}
          accessibilityLabel={'Continue'}
          onPress={() => {
            if (check_email(email) || email == '') {
              if (phone.length === 0 || phone.length === 11) {
                dispatch(
                  update_benef(
                    props.navigation,
                    props.route.params.benefID,
                    alias,
                    email,
                    phone,
                  ),
                );
              } else {
                dispatch(setAppAlert(Message.invalidPhoneNumber));
              }
            } else {
              dispatch(setAppAlert(Message.invalidEmail));
            }
            // if(alias.length==0){
            //   global.showToast.show('Please Enter a Short Name.', 1000);
            // }
            // else if (email.length>)
            // else{
            // }
          }}
          btn_width={wp(90)}
          backgroundColor={Colors.primary_green}
        />
      </ScrollView>
    </KeyboardAvoidingView>
  );
};
export default EditBeneficiary;
