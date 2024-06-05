import React, {useState, useRef} from 'react';
import {View, Text, KeyboardAvoidingView} from 'react-native';
import styles from './RAASTBeneStyle';
import Custom_btn from '../../../Components/Custom_btn/Custom_btn';
import {globalStyling, wp} from '../../../Constant';
import {Colors} from '../../../Theme';
import GlobalHeader from '../../../Components/GlobalHeader/GlobalHeader';
import SubHeader from '../../../Components/GlobalHeader/SubHeader/SubHeader';
import {logs} from '../../../Config/Config';
import {useSelector, useDispatch} from 'react-redux';
import moment from 'moment';
import i18n from '../../../Config/Language/LocalizeLanguageString';
import {
  raastpyamentrequest,
  changeGlobalTransferAlertState,
  closeGlobalTransferAlert,
} from '../../../Redux/Action/Action';
import analytics from '@react-native-firebase/analytics';

import CustomAlert from '../../../Components/Custom_Alert/CustomAlert';
import CustomText from '../../../Components/CustomText/CustomText';
import {maskedAccount} from '../../../Helpers/Helper';
import CustomTextField from '../../../Components/CustomTextField/CustomTextField';
import {ScrollView} from 'react-native-gesture-handler';
import {useEffect} from 'react';
import {useTheme} from '../../../Theme/ThemeManager';
export default function RAASTBenefShowInfo(props) {
  const ref2 = useRef();
  const {activeTheme} = useTheme();
  const ref3 = useRef();
  const dispatch = useDispatch();
  const [showAlert, changeAlertState] = useState(false);
  const [email, setEmail] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const info = props.route.params?.param;
  const screen = props.route.params?.screen;
  const infoAlias = props.route.params?.paramsAlias?.data;
  const responseObj = props.route.params?.requestobj;
  const responseObjAliass = props.route.params?.requestobjAlias;
  const screen_status = props.route.params?.from_screen;
  const overViewData = useSelector((state) => state.reducers.overViewData);
  const acc_info = useSelector(
    (state) => state.reducers.overViewData?.data?.accounts,
  );
  const userObject = useSelector((state) => state?.reducers?.userObject);

  logs.log('props.route.params-----', props?.route?.params);
  // logs.log(
  //   `============s==${JSON.stringify(props?.route?.params?.param?.idValue)}`,
  // );
  // logs.log(`==============${screen}`);

  useEffect(() => {
    if (props.route.params?.paramsAlias?.data?.benefEmail) {
      setEmail(props.route.params?.paramsAlias?.data?.benefEmail);
    }
    if (props.route.params?.paramsAlias?.data?.benefMobileNumber) {
      setPhoneNumber(props.route.params?.paramsAlias?.data?.benefMobileNumber);
    }
    async function analyticsLog() {
      await analytics().logEvent('RaastBenefShowinfoScreen');
    }
    analyticsLog();
  }, []);
  const headview_request_succes = () => {
    return (
      <View>
        {/* <GlobalHeader navigation={props.navigation} /> */}
        <SubHeader
          navigation={props.navigation}
          title={'RAAST Payments'}
          description={screen == 'iban' ? 'Pay by IBAN' : 'Pay by RAAST ID'}
          // cardmanagment={true}
        />
      </View>
    );
  };
  const text_view = () => {
    return (
      <View
        style={{
          alignSelf: 'center',
          justifyContent: 'flex-start',
          // elevation: 6,
          borderWidth: 1,
          borderColor: Colors.textFieldBorderColor,
          borderRadius: 8,
          width: wp(90),
          backgroundColor: Colors.subContainer,
          marginTop: wp(1),
          // height: wp(135),
          padding: wp(2),
        }}>
        <View
          style={{
            // height: wp(10),
            backgroundColor: Colors.childContainer,
            width: wp(80),
            alignSelf: 'center',
            borderRadius: wp(1.5),
            padding: wp(4),
          }}>
          <CustomText style={{padding: wp(1), color: '#9ea3a6'}}>
            Beneficiary Name
          </CustomText>
          <CustomText
            boldFont={true}
            style={{padding: wp(0.8), fontSize: wp(4.45)}}>
            {screen == 'iban'
              ? info?.acctitle
              : `${infoAlias?.name} ${infoAlias?.surname}`}
          </CustomText>
          {info?.benefAlias ? (
            <>
              <CustomText style={{padding: wp(1), color: '#9ea3a6'}}>
                Short Name
              </CustomText>
              <CustomText
                boldFont={true}
                style={{padding: wp(0.8), fontSize: wp(4.5)}}>
                {info?.benefAlias}
              </CustomText>
            </>
          ) : null}

          <CustomText style={{padding: wp(1), color: '#9ea3a6'}}>
            Beneficiary IBAN
          </CustomText>
          <CustomText
            boldFont={true}
            style={{padding: wp(0.8), fontSize: wp(4.4)}}
            numberOfLines={1}
            ellipsizeMode="head">
            {screen == 'iban'
              ? maskedAccount(info?.receiveriban)
              : maskedAccount(infoAlias?.iban)}
          </CustomText>
          <CustomText style={{padding: wp(1), color: '#9ea3a6'}}>
            Source IBAN
          </CustomText>
          <CustomText
            boldFont={true}
            style={{padding: wp(0.8), fontSize: wp(4.4)}}>
            {info?.source_iban}
          </CustomText>
          <CustomText style={{padding: wp(1), color: '#9ea3a6'}}>
            Purpose of Payment
          </CustomText>
          <Text
            style={{
              padding: wp(0.8),
              fontSize: wp(4.45),
              fontWeight: 'bold',
              color: '#9ea3a6',
            }}>
            {info?.pay_pur}
          </Text>
          <CustomText style={{padding: wp(1), color: '#9ea3a6'}}>
            Payment Fee
          </CustomText>
          <CustomText
            boldFont={true}
            style={{padding: wp(0.8), fontSize: wp(4.45)}}>
            {`NO FEE`}
          </CustomText>
        </View>
        <View style={{height: wp(4)}}></View>
        <View
          style={{
            flexDirection: 'row',
            backgroundColor: Colors.childContainer,
            width: wp(80),
            alignSelf: 'center',
            borderRadius: wp(1.5),
            padding: wp(4),
            justifyContent: 'space-between',
          }}>
          <CustomText
            boldFont={true}
            style={{padding: wp(1), color: '#9ea3a6', fontSize: wp(4)}}>
            Amount
          </CustomText>
          <CustomText
            boldFont={true}
            style={{padding: wp(0.8), fontSize: wp(4.45)}}>
            Rs.{info?.amount}
          </CustomText>
        </View>
      </View>
    );
  };
  const phoneEmail = () => {
    return (
      <View>
        <View style={styles.marginVertical}>
          <CustomTextField
            accessibilityLabel="Enter Email"
            ref={ref2}
            placeholder={'Email (Optional)'}
            Textfield_label={''}
            text_input={email}
            onChangeText={(value) => {
              setEmail(value);
            }}
            onSubmitEditing={() => {
              ref3.current.focus();
            }}
            returnKeyType={'next'}
            width={'90%'}
            maxLength={50}
            keyboardType="email-address"
            backgroundColor={'white'}
            fontSize={wp(4.2)}
          />
        </View>
        <View style={styles.marginVertical}>
          <CustomTextField
            accessibilityLabel="Enter Mobile Number"
            ref={ref3}
            placeholder={'Mobile Number (Optional)'}
            Textfield_label={''}
            text_input={phoneNumber}
            onChangeText={(value) => {
              setPhoneNumber(String(value).replace(/[^0-9]/g, ''));
            }}
            maxLength={11}
            width={'90%'}
            keyboardType={'number-pad'}
            backgroundColor={'white'}
            fontSize={wp(4.2)}
          />
        </View>
      </View>
    );
  };
  const call = () => {
    // responseObj.otp = '';
    // logs.log('props from benf show', props.route.params?.param);
    // logs.log('info', info);
    // logs.log('screen', screen);
    // logs.log('infoAlias', infoAlias);
    // logs.log('responseObj', responseObj);
    // logs.log('responseObjAliass', responseObjAliass);
    // logs.log('screen_status', screen_status);
    // logs.log('acc_info', acc_info);

    const prevObj = props.route.params?.param;
    if (screen == 'iban') {
      let responseObjIBAN = {
        amount: prevObj?.amount,
        fee: '0',
        source_iban: prevObj.source_iban,
        idType: 'CNIC',
        idValue: acc_info.cnic,
        isbenef: true,
        narration: 'Raast Payment by IBAN',
        otp: '',
        pay_pur_id: prevObj.pay_pur_id,
        rcvrEmailAddress: phoneNumber,
        rcvrMobileNumber: email,
        receiverName: `${prevObj.receiverName}`,
        receiveriban: prevObj.receiveriban,
        memberid: prevObj.memberid,
        name: prevObj.name,
        transactionDate: moment(new Date()).format('YYYY-MM-DD'),
        transactionTime: moment(new Date()).format('hh:MM:SS'),
        paymentMethod: screen,
        receiverAlias: prevObj.receiveriban,
        senderName: props?.route?.params?.param?.name,
      };

      logs.log(`RAAST payment call by iban ${JSON.stringify(responseObjIBAN)}`);
      dispatch(
        raastpyamentrequest(
          'IBANbybenef',
          props.navigation,
          responseObjIBAN,
          (response) => {
            dispatch(
              changeGlobalTransferAlertState(true, props.navigation, {
                benefAlias: info?.benefAlias,
                paymentType: 'RAAST Payment',
                purposeOfPayment: info?.pay_pur,
                amount: props.route.params?.param?.amount,
                fromName: `${overViewData?.data?.accounts?.accountTitle}`,
                fromAccount: `${overViewData?.data?.accounts?.iban}`,
                toName: `${props.route.params?.param?.acctitle}`,
                toAccount: `${props.route.params?.param?.receiveriban}`,
                rrn: response?.data?.data?.rrn
                  ? response?.data?.data?.rrn
                  : false,
                stanId: response?.data?.data?.stan
                  ? response?.data?.data?.stan
                  : false,
                currentDate: moment(new Date()).format('DD MMM, YYYY'),
                currentTime: moment(new Date()).format('hh:mm:ss a'),
                onPressClose: () => {
                  dispatch(closeGlobalTransferAlert(props.navigation));
                },
              }),
            );
          },
        ),
      );
    } else {
      logs.log(`**********${JSON.stringify(info?.amount)}`);
      logs.log(`**********${JSON.stringify(responseObjAliass)}`);

      let responseObjAlias = {
        amount: info?.amount,
        fee: '0',
        source_iban: info.source_iban,
        idType: 'CNIC',
        idValue: acc_info.cnic,
        isbenef: true,
        narration: 'Raast Payment by alias',
        otp: '',
        pay_pur_id: info.pay_pur_id,
        pay_pur: info?.pay_pur,
        rcvrEmailAddress: email,
        rcvrMobileNumber: phoneNumber,
        receiverName: `${infoAlias.name} ${infoAlias.surname}`,
        receiveriban: infoAlias.iban,
        memberid: infoAlias.servicer,
        name: info.name,
        transactionDate: moment(new Date()).format('YYYY-MM-DD'),
        transactionTime: moment(new Date()).format('hh:MM:SS'),
        paymentMethod: screen,
        receiverAlias: prevObj.idValue,
        senderName: props?.route?.params?.param?.name,
      };

      logs.log(
        `RAAST payment call by alias from beenf${JSON.stringify(
          responseObjAlias,
        )}`,
      );
      dispatch(
        raastpyamentrequest(
          'ALIASbybenef',
          props.navigation,
          responseObjAlias,
          (response) => {
            dispatch(
              changeGlobalTransferAlertState(true, props.navigation, {
                paymentType: 'RAAST Payment',
                benefAlias: info?.benefAlias,
                amount: props.route.params?.param?.amount,
                purposeOfPayment: info?.pay_pur,
                fromName: `${overViewData?.data?.accounts?.accountTitle}`,
                fromAccount: `${overViewData?.data?.accounts?.account}`,
                toName: `${infoAlias?.name}`,
                toAccount: `${responseObjAlias?.receiverAlias}`,
                rrn: response?.data?.data?.rrn
                  ? response?.data?.data?.rrn
                  : false,
                stanId: response?.data?.data?.stan
                  ? response?.data?.data?.stan
                  : false,
                currentDate: moment(new Date()).format('DD MMM, YYYY'),
                currentTime: moment(new Date()).format('hh:mm:ss a'),
                onPressClose: () => {
                  dispatch(closeGlobalTransferAlert(props.navigation));
                },
              }),
            );
          },
        ),
      );
    }
  };
  return (
    <View
      style={{backgroundColor: Colors.backgroundColor, flex: 1}}
      accessibilityLabel="RAAST Information Screen">
      {/* {request_message()} */}
      {headview_request_succes()}
      <ScrollView contentContainerStyle={globalStyling.scrollContent}>
        <View style={{flex: 1}}>
          {text_view()}
          {phoneEmail()}
        </View>
        <View style={styles.gapBenef}></View>

        <CustomAlert
          overlay_state={showAlert}
          onPressCancel={() => {
            changeAlertState(false);
          }}
          yesNoButtons={true}
          onPressYes={() => {
            changeAlertState(false);
            call();
          }}
          onPressNo={() => changeAlertState(false)}
          iscancelbtn={false}
          onPressOkay={() => {
            // changeAppeaedOnceState(false);
            changeAlertState(false);
          }}
          title={'RAAST Payment'}
          alert_text={i18n['Do you want to proceed with the transaction.']}
          accessibilityLabel={'Do you want to proceed with the transaction.'}
        />
      </ScrollView>

      <KeyboardAvoidingView style={globalStyling.buttonContainer}>
        <Custom_btn
          btn_txt={'Continue'}
          onPress={() => {
            changeAlertState(true);
          }}
          btn_width={wp(90)}
          backgroundColor={Colors.primary_green}
        />
      </KeyboardAvoidingView>
    </View>
  );
}
