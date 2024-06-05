import React, {useState, useRef} from 'react';
import {
  View,
  Text,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import GlobalHeader from '../../../Components/GlobalHeader/GlobalHeader';
import SubHeader from '../../../Components/GlobalHeader/SubHeader/SubHeader';
import CustomTextField from '../../../Components/CustomTextField/CustomTextField';
import CustomBtn from '../../../Components/Custom_btn/Custom_btn';
import CustomText from '../../../Components/CustomText/CustomText';
import CustomAlert from '../../../Components/Custom_Alert/CustomAlert';
import styles from './RAASTBeneStyle';
import {Colors} from '../../../Theme';
import {Label} from '../../../Constant/Labels';
import {
  currencyFormat,
  globalStyling,
  hp,
  validateOnlyNumberInput,
  validateonlyAlphaNumeric,
  wp,
} from '../../../Constant';

import analytics from '@react-native-firebase/analytics';
import {useSelector, useDispatch} from 'react-redux';
import {
  payUtilityBill,
  utilityDirectOtp,
  setAppAlert,
  updateRAASTBenef,
  changeGlobalIconAlertState,
  add_benef,
} from '../../../Redux/Action/Action';
import {logs} from '../../../Config/Config';
import {Message} from '../../../Constant/Messages/index';
import {check_email, maskedAccount} from '../../../Helpers/Helper';
export default function RAASTConfirmDetils(props) {
  const ref1 = useRef();
  const ref2 = useRef();
  const ref3 = useRef();
  // const [showAlertState, changeAlertState] = useState(false);
  const token = useSelector((state) => state.reducers.token);
  // const billObject = useSelector((state) => state.reducers.billObject);
  logs.log('screen status', props?.route?.params?.screen);
  const [comment, setComment] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [email, setEmail] = useState('');
  const [responseObj, setResponseObj] = useState({});
  const [alias, set_alias] = useState('');
  const [phone, set_phone] = useState('');
  const dispatch = useDispatch();
  const unsorted_reason = useSelector((state) => state.reducers.raastbank);
  React.useEffect(() => {
    async function analyticsLog() {
      await analytics().logEvent('RaastConfirmDetailsScreen');
    }
    analyticsLog();
  }, []);

  React.useEffect(() => {
    props.navigation.addListener('focus', () => {
      logs.log('ON CONFIRM DETAILS SCREEN', props.route.params);
      setResponseObj({
        iban:
          props.route.params?.screenRoute === 'iban'
            ? props?.route?.params?.data?.fullIBAN
            : props.route.params?.data?.iban,
        imd: props.route.params?.data?.imd,
        title: props.route.params?.data?.title,
        token: props.route.params?.data?.token,
        bankName: props.route.params?.data?.bankName,
      });
    });
  });

  const checkValidation = () => {
    if (comment.length < 3) {
      // dispatch(setAppAlert('Please Enter Username'));
      dispatch(
        changeGlobalIconAlertState(true, props.navigation, {
          message: 'Please provide a short name for your beneficiary',
          onPressOk: () => {
            changeGlobalIconAlertState(false);
          },
        }),
      );
    } else {
      if (check_email(email) || email == '') {
        let ibanForFilter = props.route.params?.data?.iban;
        let bankNameForAlias = '';
        if (ibanForFilter.substr(4, 4).toUpperCase() == 'NBPA') {
          const requestobject = {
            accountNo: ibanForFilter,
            benefiAlias: comment,
            benefiEmail: email,
            benefiMobile: phone,
            benefiTitle: responseObj?.title,
            benefiType: '1',
            companyName: 'NBP',
            imd: '979898',
            token: responseObj?.token,
          };
          logs.log('sdsdsdsdsd', JSON.stringify(requestobject));
          dispatch(add_benef(props.navigation, requestobject));
          // bankNameForAlias = 'National Bank of Pakistan';
        } else {
          var foundBank = unsorted_reason.filter(
            (obj) => obj.prefix == ibanForFilter.substr(4, 4).toUpperCase(),
          );
          bankNameForAlias = foundBank[0]?.participantName;
          let requestObj = {};
          requestObj.accountNo =
            props?.route?.params?.screen == 'alias'
              ? props.route.params.accountNumber
              : responseObj?.iban;

          requestObj.benefiAlias = comment;
          requestObj.benefiEmail = email;
          requestObj.benefiMobile = phoneNumber;
          requestObj.benefiTitle = responseObj?.title;
          requestObj.benefiType =
            props.route.params?.screenRoute === 'iban' ? '17' : '16';
          requestObj.companyName =
            props.route.params?.screenRoute === 'iban'
              ? responseObj?.bankName
              : bankNameForAlias;
          requestObj.imd = responseObj?.imd;
          requestObj.token = responseObj?.token;
          requestObj.tranType = 'RAAST';
          logs.log(requestObj);
          dispatch(updateRAASTBenef(props.navigation, requestObj));
        }
      } else {
        dispatch(
          changeGlobalIconAlertState(true, props.navigation, {
            message: 'Please Enter correct Email',
            onPressOk: () => {
              changeGlobalIconAlertState(false);
            },
          }),
        );
        // dispatch(setAppAlert('Please Enter correct Email'));
      }
    }
  };

  return (
    <View
      style={[
        globalStyling.container,
        {backgroundColor: Colors.backgroundColor},
      ]}>
      {/* <GlobalHeader navigation={props.navigation} /> */}
      <SubHeader
        navigation={props.navigation}
        // utilityBillPayments={true}
        title={Label.subHeaderTitle.raastBenef}
        description={Label.subHeaderDescription.addRasstBenef}
      />
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={globalStyling.scrollContent}>
        <View style={{height: wp(4)}} />
        <View
          style={{
            alignSelf: 'center',
            justifyContent: 'flex-start',
            // elevation: 6,
            borderWidth: 1,
            borderColor: Colors.themeGrey,
            borderRadius: 8,
            width: wp(90),
            backgroundColor: Colors.subContainer,
            marginTop: wp(1),
            // height: wp(135),
            padding: wp(5),
          }}>
          <View
            style={{
              // height: wp(10),
              backgroundColor: Colors.childContainer,
              width: wp(85),
              alignSelf: 'center',
              borderRadius: wp(1.5),
              padding: wp(4),
            }}>
            <CustomText style={{padding: wp(1), color: '#9ea3a6'}}>
              Account Title
            </CustomText>
            <CustomText
              boldFont={true}
              style={{padding: wp(0.8), fontSize: wp(4.45)}}>
              {props.route.params?.data?.title}
            </CustomText>
            <CustomText style={{padding: wp(1), color: '#9ea3a6'}}>
              IBAN
            </CustomText>
            <CustomText
              boldFont={true}
              style={{padding: wp(0.8), fontSize: wp(4.45)}}
              numberOfLines={1}
              ellipsizeMode="head">
              {props.route.params?.screenRoute === 'iban'
                ? maskedAccount(props?.route?.params?.data?.fullIBAN)
                : maskedAccount(props.route.params?.data?.iban)}
            </CustomText>
          </View>
          <View style={{height: wp(1)}} />
        </View>
        <View style={{height: wp(4)}} />

        <View style={styles.marginVertical}>
          <CustomTextField
            ref={ref1}
            text_input={comment}
            placeholder={'Short Name'}
            Textfield_label={''}
            onChangeText={(value) => {
              setComment(validateonlyAlphaNumeric(value));
            }}
            onSubmitEditing={() => {
              ref2.current.focus();
            }}
            returnKeyType={'next'}
            width={'90%'}
            maxLength={20}
            backgroundColor={Colors.whiteColor}
          />
        </View>
        <View style={styles.marginVertical}>
          <CustomTextField
            ref={ref2}
            placeholder={'Phone (Optional)'}
            Textfield_label={''}
            text_input={phoneNumber}
            keyboardType={'numeric'}
            onChangeText={(value) => {
              setPhoneNumber(
                validateOnlyNumberInput(String(value).replace(/[^0-9]/g, '')),
              );
            }}
            onSubmitEditing={() => {
              ref3.current.focus();
            }}
            returnKeyType={Platform.OS === 'ios' ? 'done' : 'next'}
            width={'90%'}
            maxLength={11}
            backgroundColor={Colors.whiteColor}
          />
        </View>
        <View style={styles.marginVertical}>
          <CustomTextField
            ref={ref3}
            text_input={email}
            placeholder={'Email (Optional)'}
            Textfield_label={''}
            maxLength={50}
            onChangeText={(value) => {
              setEmail(value);
            }}
            width={'90%'}
            keyboardType={'email-address'}
            backgroundColor={Colors.whiteColor}
          />
        </View>
      </ScrollView>
      <KeyboardAvoidingView
        keyboardVerticalOffset={hp(7)}
        behavior={'padding'}
        style={globalStyling.buttonContainer}>
        <CustomBtn
          btn_txt={'Continue'}
          onPress={() => {
            checkValidation();
          }}
          btn_width={wp(90)}
          backgroundColor={Colors.primary_green}
        />
      </KeyboardAvoidingView>
      {/* <CustomAlert
          overlay_state={showAlertState}
          yesNoButtons={true}
          title={'Bill Payment'}
          alert_text={'Do you want to proceed with the Transaction.'}
          onPressYes={() => {
            changeAlertState(false);

            dispatch(
              payUtilityBill(
                token,
                props.navigation,
                billObject.token,
                props.route.params?.data?.ucid,
                billObject.amountPayable,
                comment,
                props.route.params?.data?.biller,
                props.route.params?.data?.consumerNumber,
                billObject.customerName,
                props.route.params?.data?.fromAccount,
                email,
                phoneNumber,
                props.route.params?.data?.benefID,
              ),
            );
          }}
          onPressNo={() => {
            changeAlertState(false);
            setTimeout(() => {
              props.navigation.navigate('Home');
            }, 500);
          }}
        /> */}
    </View>
  );
}
