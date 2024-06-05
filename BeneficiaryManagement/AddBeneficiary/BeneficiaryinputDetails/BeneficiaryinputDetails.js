import React, {useState, useRef} from 'react';
import {
  View,
  Text,
  Dimensions,
  Platform,
  KeyboardAvoidingView,
  ScrollView,
} from 'react-native';
import styles from './BeneficiaryinputDetails.style';
import GlobalHeader from '../../../../Components/GlobalHeader/GlobalHeader';
import SubHeader from '../../../../Components/GlobalHeader/SubHeader/SubHeader';
import CustomTextField from '../../../../Components/CustomTextField/CustomTextField';
import CustomBtn from '../../../../Components/Custom_btn/Custom_btn';
import {Colors} from '../../../../Theme';
import {useSelector, useDispatch} from 'react-redux';
import {
  add_benef,
  setCurrentFlow,
  setAppAlert,
  changeGlobalIconAlertState,
} from '../../../../Redux/Action/Action';
import analytics from '@react-native-firebase/analytics';
import {globalStyling, wp} from '../../../../Constant';
import {appInfo, logs} from '../../../../Config/Config';
import {check_email, maskedAccount} from '../../../../Helpers/Helper';
import {Message} from '../../../../Constant/Messages/index';
import CustomText from '../../../../Components/CustomText/CustomText';

const screenWidth = Dimensions.get('window').width;

const BeneficiaryinputDetails = (props) => {
  const ref1 = useRef();
  const ref2 = useRef();
  const ref3 = useRef();
  const dispatch = useDispatch();
  const [alias, set_alias] = useState('');
  const [phone, set_phone] = useState('');
  const [email, set_email] = useState('');
  const accountno = props.route.params?.data?.titleFetchAccount;

  const benefitype = props.route.params?.data?.benefiType;
  const transtype = props.route.params?.data?.transtype;
  const imd = props.route.params?.data?.imd;
  const companyName = props.route.params?.data?.companyName;
  const beneftitle = props.route.params?.data?.title
    ? props.route.params?.data?.title
    : props.route.params?.data?.customerName
    ? props.route.params?.data?.customerName
    : imd == 'ZONG0002' ||
      imd == 'MBLINK02' ||
      imd == 'UFONE002' ||
      (imd == 'TELNOR02' &&
        props.route.params?.responseData?.data?.customerName == '')
    ? 'POSTPAID'
    : '';
  const companyType =
    props.route.params?.data?.transtype === 'electricityBill'
      ? 'Electricity'
      : props.route.params?.data?.transtype === 'gasBill'
      ? 'Gas'
      : props.route.params?.data?.transtype === 'waterBill'
      ? 'Water'
      : props.route.params?.data?.transtype === 'ptclBill'
      ? 'PTCL Landline'
      : null;
  logs.log(imd);
  // console.log('yaffar', props.route.params?.responseData?.data?.customerName);
  React.useEffect(() => {
    props.navigation.addListener('focus', () => {
      dispatch(setCurrentFlow('Add Beneficiary'));
      async function analyticsLog() {
        await analytics().logEvent('BeneficiaryinputDetails');
      }
      analyticsLog();
    });
  }, []);

  const validation = () => {
    if (phone.length !== 0 && phone.length !== 11) {
      dispatch(setAppAlert(Message.invalidPhoneNumber));
    } else if (check_email(email) || email == '') {
      const requestobject = {
        accountNo: accountno,
        benefiAlias: alias,
        benefiEmail: email,
        benefiMobile: phone,
        benefiTitle: beneftitle,
        benefiType: benefitype,
        companyName: companyName,
        imd: imd,
        token: props.route.params?.responseData?.data?.token
          ? props.route.params?.responseData?.data?.token
          : props.route.params?.data?.data?.token,
        tranType: transtype,
        companyType: companyType ? companyType : null,
      };
      logs.log('sakjjdgashdas', JSON.stringify(requestobject));
      alias
        ? dispatch(add_benef(props.navigation, requestobject))
        : dispatch(
            changeGlobalIconAlertState(true, props.navigation, {
              message: 'Please provide a short name for your beneficiary',
              onPressOk: () => {
                changeGlobalIconAlertState(false);
              },
            }),
          );
    } else {
      dispatch(
        changeGlobalIconAlertState(true, props.navigation, {
          message: Message.invalidEmail,
          onPressOk: () => {
            changeGlobalIconAlertState(false);
          },
        }),
      );
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : null}
      keyboardVerticalOffset={40}
      style={[
        globalStyling.whiteContainer,
        {backgroundColor: Colors.backgroundColor},
      ]}
      accessibilityLabel="Beneficiary Input Screen">
      {/* <GlobalHeader navigation={props.navigation} /> */}
      <SubHeader
        title={'Add Beneficiary'}
        description={'Add Beneficiary in the list'}
        // addBeneficiary={true}
        navigation={props.navigation}
      />
      <ScrollView style={globalStyling.whiteContainer}>
        <View style={{height: wp(4)}} />
        <View
          style={{
            alignSelf: 'center',
            justifyContent: 'flex-start',
            // elevation: 6,
            borderWidth: 1,
            borderColor: '#cfd1d3',
            borderRadius: 8,
            width: wp(90),
            backgroundColor: Colors.backgroundColor,
            marginTop: wp(1),
            // height: wp(135),
            padding: wp(5),
          }}>
          <View
            style={{
              // height: wp(10),
              backgroundColor: Colors.tabNavigateBackground,
              width: wp(85),
              alignSelf: 'center',
              borderRadius: wp(1.5),
              padding: wp(4),
            }}>
            {/* <CustomText */}
            <CustomText style={{padding: wp(1), color: '#9ea3a6'}}>
              {props.route.params?.data?.type &&
              props.route.params?.data?.type === 'mobilePayment'
                ? 'Payment Type:'
                : 'Account Title:'}
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
                : 'Account Number/ IBAN:'}
            </CustomText>
            <CustomText
              boldFont={true}
              style={{padding: wp(0.8), fontSize: wp(4.45)}}>
              {props.route.params?.data?.type &&
              props.route.params?.data?.type === 'mobilePayment'
                ? accountno
                : maskedAccount(accountno)}
            </CustomText>
          </View>
          <View style={{height: wp(1)}} />
        </View>
        <View style={styles.gap} />

        <CustomTextField
          ref={ref1}
          placeholder={'Short Name '}
          text_input={alias}
          onChangeText={(value) => {
            set_alias(value);
            ('Card number :');
          }}
          onSubmitEditing={() => {
            ref2.current.focus();
          }}
          returnKeyType={'next'}
          maxLength={appInfo.shortNameLengths}
          width={'90%'}
        />
        <View style={styles.gap} />

        <CustomTextField
          ref={ref2}
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
        <View style={styles.gap} />

        <CustomTextField
          ref={ref3}
          placeholder={'Email (Optional)'}
          // Textfield_label={'Enter Debit/ATM Card Number'}
          onChangeText={(value) => {
            set_email(value);
            ('Card number :');
          }}
          keyboardType="email-address"
          width={'90%'}
        />
        <View style={styles.gap} />
        <CustomBtn
          btn_txt={'Continue'}
          accessibilityLabel={'Continue'}
          onPress={() => {
            logs.log(props.route.params);
            logs.log(props.route.params?.data?.data?.token);
            validation();
          }}
          btn_width={wp(90)}
          backgroundColor={Colors.primary_green}
        />
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default BeneficiaryinputDetails;
