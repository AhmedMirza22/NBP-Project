/* eslint-disable prettier/prettier */
import React, {useEffect, useState} from 'react';
import {View, KeyboardAvoidingView, Dimensions} from 'react-native';
import styles from './by_aliasstyle';
import CustomAlert from '../../../../Components/Custom_Alert/CustomAlert';

import SubHeader from '../../../../Components/GlobalHeader/SubHeader/SubHeader';
import TabNavigator from '../../../../Components/TabNavigate/TabNavigate';
import CustomModal from '../../../../Components/CustomModal/CustomModal';
import CustomTextField from '../../../../Components/CustomTextField/CustomTextField';
import {wp, globalStyling} from '../../../../Constant';
import CustomBtn from '../../../../Components/Custom_btn/Custom_btn';
import {useSelector, useDispatch} from 'react-redux';
import {Colors} from '../../../../Theme';
import {RAAST_PURPOSE_OF_PAYMENT_LIST} from '../../../purposeOfPayments';
// import CustomAlert from '../../../Components/Custom_Alert/CustomAlert';
import analytics from '@react-native-firebase/analytics';
import moment from 'moment';
import {
  setCurrentFlow,
  setAppAlert,
  getdefaultaccounsbyalias,
  raastPaybyIBANTitleFetch,
  setUserObject,
  setLoader,
  serviceResponseCheck,
  catchError,
  updateSessionToken,
} from '../../../../Redux/Action/Action';
import {logs} from '../../../../Config/Config';
import {Platform} from 'react-native';
import {TouchableWithoutFeedback} from 'react-native';
import {Keyboard} from 'react-native';
import store from '../../../../Redux/Store/Store';
import {postTokenCall, Service} from '../../../../Config/Service';

const screenWidth = Dimensions.get('window').width;
const ByAlias_step2 = (props) => {
  //   let updatedPhoneNumber = props?.route?.params?.phoneNumber;
  useEffect(() => {
    props.navigation.addListener('focus', () => {
      async function analyticsLog() {
        await analytics().logEvent('PaymentByRAASTIDByAliasStep2Screen');
      }
      analyticsLog();

      change_purpose(product_type[12]);
      dispatch(setCurrentFlow('Payment By RAAST ID'));
    });
  }, []);
  useEffect(() => {
    props.navigation.addListener('focus', () => {
      change_card_name(userObject.aliasPhoneNumber);
      //   change_purpose(product_type[1]);

      change_from_acc({
        account: accounts[0]?.account,
        iban: accounts[0]?.iban,
        accountType: accounts[0]?.accountType,
        currency: accounts[0]?.currency,
        accountTitle: accounts[0]?.accountTitle,
      });
    });
  }, []);
  const [tab_name_card, change_card_name] = useState('');
  const dispatch = useDispatch();
  const [tab_purpose, change_purpose] = useState({
    purpose: 'Purpose of Payment',
  });
  const [tab_amount, change_amount] = useState('');
  const [tab_reason, change_reason] = useState({reason: 'MOBILE'});
  const [modal, change_modal_state] = useState(false);
  const [param, changeParams] = useState({});
  const [benefAddition, changeBenefAddition] = useState(false);
  const [responseData, setResponseData] = useState({});
  const [responseData2, setResponseData2] = useState({});

  const [modal_type, change_modal_type] = useState('');
  const city = useSelector((state) => state?.reducers?.viewcitycode);
  const userObject = useSelector((state) => state?.reducers?.userObject);
  const accounts = userObject?.pkAccounts;
  const [tab_from_acc, change_from_acc] = useState({
    // account: accounts[0]?.account,
    // iban: accounts[0]?.iban,
    // accountType: accounts[0]?.accountType,
    // currency: accounts[0]?.currency,
    // accountTitle: accounts[0]?.accountTitle,
  });
  const product_type = RAAST_PURPOSE_OF_PAYMENT_LIST;
  const reason = [{reason: 'MOBILE'}];
  const requestobj = {};

  function screenProcess(screen_status, params, response) {
    let res1 = response.data.data?.iban.slice(8, 12);
    let res2 = response.data.data?.iban.slice(14, 24);
    let result = `${res1}${res2}`;
    let body = {
      fromAccount: params?.account,
      toAccount: result,
      amount: params?.amount,
      title: `${response?.data?.data?.name.toUpperCase()} ${response?.data?.data?.surname.toUpperCase()}`,
      isDirectPayment: params.isbenef ? false : true,
      token: response?.data?.data?.token,
      purposeOfPayment: params?.pay_pur,
      purposeOfPaymentString: params?.pay_pur,
      date: moment(new Date()).format('YYYY-MM-DD hh:mm:ss A'),
    };
    if (response.data.data.iban.includes('NBP')) {
      logs.log('nbp hy ', params);

      if (response?.data?.data?.benefID) {
        dispatch(
          setUserObject({
            ftPayment: {
              accountFormat: 'Enter the 14 digit account number',
              amount: body?.amount,
              bankName: 'National Bank of Pakistan',
              benefId: response?.data?.data?.benefID,
              benefTrans: false,
              benefType: 1,
              date: body?.date,
              fromAccount: body?.fromAccount,
              imd: '979898',
              isDirectPayment: false,
              purposeOfPayment: params?.pay_pur_id,
              purposeOfPaymentString: body?.purposeOfPaymentString,
              title: body?.title,
              toAccount: body?.toAccount,
              token: body?.token,
              shortName: response?.data?.data?.benefAlias,
            },
          }),
        );
      } else {
        dispatch(
          setUserObject({
            ftPayment: {
              accountFormat: 'Enter the 14 digit account number',
              amount: body?.amount,
              bankName: 'National Bank of Pakistan',
              benefTrans: false,
              benefType: 1,
              date: body?.date,
              fromAccount: body?.fromAccount,
              imd: '979898',
              isDirectPayment: true,
              purposeOfPayment: params?.pay_pur_id,
              purposeOfPaymentString: body?.purposeOfPaymentString,
              title: body?.title,
              toAccount: body?.toAccount,
              token: body?.token,
            },
          }),
        );
      }

      props.navigation.navigate('FundTransferResponse');
    } else {
      logs.log('nbp  nhi hy ');
      if (screen_status == 'aliasbybenef') {
        props.navigation.navigate('RAASTBenefShowInfo', {
          screen: 'alias',
          paramsAlias: response.data,
          param: params,
        });
      } else {
        props.navigation.navigate('RAASTInfoShow', {
          screen: 'alias',
          paramsAlias: response.data,
          param: params,
        });
      }
    }
  }
  const accountNumberApi = async () => {
    requestobj.amount = tab_amount;
    requestobj.idType = props?.route?.params?.reqObj?.idType;
    requestobj.idValue = props?.route?.params?.reqObj?.idValue
      ? props?.route?.params?.reqObj?.idValue
      : '';
    logs.log('props?.route?.params?.reqObj', props?.route?.params?.reqObj);
    logs.log('requestobj---', requestobj);
    try {
      dispatch(setLoader(true));
      const response = await postTokenCall(Service.titleFetch2, {
        amount: requestobj.amount,
        idType: requestobj.idType,
        idValue: requestobj.idValue
          ? props?.route?.params?.reqObj?.idValue
          : '',
        receiveriban: props?.route?.params?.reqObj?.receiveriban,
        memberid: props?.route?.params?.reqObj?.memberid,
        // receiveriban: '00023000101505',
        // idType: 'CNIC',
        // idValue: '',
        // memberid: 'NBPBPKKA',
        // amount: '152.0',
      });
      if (response?.data?.responseCode === '00') {
        dispatch(setLoader(false));
        dispatch(updateSessionToken(response));

        logs.log(
          'props?.route?.params?.reqObj?.beneficiaryObjectimd,',
          props?.route?.params?.reqObj?.imd,
        );

        const reqObject = {
          acctype: 'Account',
          fee: '0',
          fromScreen: 'raastIBAN',
          account: props?.route?.params?.reqObj?.account,
          acctitle: response?.data?.data?.acctitle,
          toAccount: props?.route?.params?.reqObj?.receiveriban,
          amount: requestobj.amount,
          pay_pur: requestobj.pay_pur,
          pay_pur_id: requestobj.pay_pur_id,
          purposeOfPayment: requestobj.purposeOfPayment,
          imd: props?.route?.params?.reqObj?.imd,
          benef_bank: props?.route?.params?.reqObj?.bankName,
          idType: props?.route?.params?.reqObj?.idType,
          isbenef: props?.route?.params?.reqObj?.isbenef,
          receiveriban: response?.data?.data?.iban,
          receiverName: response?.data?.data?.acctitle,
          narration: 'NBP RAAST PAYMENTS',
          rcvrEmailAddress: '',
          rcvrMobileNumber: '',
          name: props?.route?.params?.reqObj?.name,
          memberid: props?.route?.params?.reqObj?.memberid,
          source_iban: props?.route?.params?.reqObj?.source_iban,
          idValue: props?.route?.params?.reqObj?.idValue,
        };
        // changeParams(response?.data?.data);
        // setResponseData2(reqObject);
        changeParams(reqObject);
        setResponseData2(response?.data?.data);

        logs.log('Response of titleFetch -2---', response?.data?.data);
        logs.log('reqObject', reqObject);

        // setResponseData(response?.data?.data);
        setResponseData({response: response?.data?.data, parmas: reqObject});

        dispatch(
          setUserObject({
            ftPayment: reqObject,
          }),
        );
        if (response?.data?.data?.benefExists == false) {
          logs.log('response?.data?.data?', response?.data?.data);
          changeBenefAddition(true);
        } else {
          logs.log(
            response?.data?.data?.benefEmail,
            response?.data?.data?.benefMobileNumber,
          );

          logs.log('response?.data?.data', response?.data?.data);
          logs.log('reqObject', reqObject);

          props?.navigation.navigate('RAASTInfoShow', {
            screen: 'iban',
            param: response?.data?.data,
            paramsAlias: reqObject,
          });
          // props?.navigation.navigate('InterBankFundTransferDetail');
        }
      } else {
        dispatch(serviceResponseCheck(response, props.navigation));
      }
    } catch (error) {
      logs.log('errors', error);
      dispatch(catchError(error));
    }
  };

  function validate() {
    //ASDASD
    // requestobj.memberid = "";
    // requestobj.receiveriban = tab_benef;
    //for next screen
    requestobj.amount = tab_amount;
    requestobj.idType = props?.route?.params?.reqObj?.idType;
    requestobj.idValue = props?.route?.params?.reqObj?.idValue
      ? props?.route?.params?.reqObj?.idValue
      : '';
    if (props?.route?.params?.screen_status == 'iban') {
      requestobj.memberid = props?.route?.params?.reqObj?.memberid;
      requestobj.receiveriban = props?.route?.params?.reqObj?.receiveriban;
    }
    requestobj.account = props?.route?.params?.reqObj?.account;
    requestobj.name = props?.route?.params?.reqObj?.name;
    requestobj.source_iban = props?.route?.params?.reqObj?.source_iban;
    requestobj.benef_bank = props?.route?.params?.reqObj?.benef_bank;
    requestobj.pay_pur = tab_purpose?.purpose;
    requestobj.purposeOfPayment = tab_purpose?.purpose;
    requestobj.pay_pur_id = tab_purpose?.pur_code;
    requestobj.isbenef = props?.route?.params?.reqObj?.isbenef;
    if (tab_purpose.purpose == 'Purpose of Payment') {
      dispatch(setAppAlert('Please Select Purpose of Payment'));
    } else if (requestobj.amount == '') {
      dispatch(setAppAlert('Please Enter amount'));
    } else if (requestobj.amount < 2) {
      dispatch(setAppAlert('Amount should be greater then 1 Rs.'));
    } else {
      if (props?.route?.params?.screen_status == 'iban') {
        dispatch(
          raastPaybyIBANTitleFetch(
            'iban',
            props.navigation,
            requestobj,
            (screen_status, params, response) => {
              logs.log('Iban Call screen_status', screen_status);

              logs.log('Iban Call Params', params);
              logs.log('Iban Call Response', response);

              params.fromScreen = 'raastIBAN';
              setResponseData2(response);
              changeParams(params);
              setResponseData({response: response?.data, parmas: params});

              if (response?.data?.benefExists == false) {
                changeBenefAddition(true);
              } else {
                logs.log(
                  response?.data?.benefEmail,
                  response?.data?.benefMobileNumber,
                );
                // (params.benefEmail = response?.data?.benefEmail),
                //   (params.benefMobile = response?.data?.benefMobileNumber),
                props?.navigation.navigate('RAASTInfoShow', {
                  screen: screen_status,
                  param: params,
                  paramsAlias: response,
                });
              }
            },
          ),
        );
      } else if (props?.route?.params?.screen_status == 'account') {
        logs.log('Account Number Api');
        accountNumberApi();
      } else {
        logs.log('Reqouest Object------', requestobj);
        dispatch(
          getdefaultaccounsbyalias(
            'alias',
            props.navigation,
            requestobj,
            (screen_status, params, response) => {
              logs.log(
                'jaksh872t7312r3123------->',
                response?.data?.data?.token,
              );
              params.pay_pur_id = tab_purpose?.pur_code;
              params.fromScreen = 'raastAlias';
              setResponseData2(response);
              changeParams(params);
              setResponseData({response: response?.data, parmas: params});
              if (response?.data?.data?.benefExists == false) {
                changeBenefAddition(true);
              } else {
                logs.log(
                  '--=-==-=->',
                  response?.data,
                  response?.data?.data?.benefEmail,
                  response?.data?.data?.benefMobileNumber,
                  '198273912313123-----=>',
                );
                (params.email = response?.data?.data?.benefEmail),
                  (params.phone = response?.data?.data?.benefMobileNumber),
                  screenProcess(screen_status, params, response);
              }
            },
          ),
        );
      }
    }
  }

  return (
    <TouchableWithoutFeedback
      onPress={() => {
        Keyboard.dismiss();
      }}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : null}
        keyboardVerticalOffset={40}
        style={[
          globalStyling.whiteContainer,
          {backgroundColor: Colors.backgroundColor},
        ]}
        accessibilityLabel="RAAST Payment by RAAST ID Screen">
        <SubHeader
          navigation={props.navigation}
          title={'RAAST Payments'}
          description={'Pay by RAAST ID/IBAN'}
        />

        <View style={{height: wp(6)}} />
        {/* <CustomText style={styles.text} boldFont={true}>
          Purpose Of Payment
        </CustomText> */}

        <TabNavigator
          tabHeading={'Purpose Of Payment'}
          text={tab_purpose.purpose}
          accessibilityLabel={tab_purpose.purpose}
          navigation={props.navigation}
          width={'90%'}
          border={0.5}
          fontSize={wp(4.2)}
          textWidth={'100%'}
          // arrowColor={'grey'}
          // arrowSize={wp(9)}
          multipleLines={2}
          // backgroundColor={'white'}
          // color={'black'}
          onPress={() => {
            change_modal_state(true);
            change_modal_type('purpose');
          }}
        />
        <View style={{height: wp(6)}} />

        <CustomTextField
          accessibilityLabel="Enter Amount here"
          keyboardType={'numeric'}
          placeholder={'Enter Amount'}
          text_input={tab_amount}
          textHeading={tab_amount.length == 0 ? null : 'Amount'}
          // Textfield_label={'Enter Debit/ATM Card Number'}
          currencyInput={true}
          onChangeText={(value) => {
            change_amount(String(value).replace(/[^0-9]/g, ''));
          }}
          onSubmitEditing={() => {}}
          returnKeyType={'next'}
          maxLength={7}
          width={'90%'}
        />

        <View style={styles.gap}></View>
        <View
          style={{position: 'absolute', alignSelf: 'center', bottom: wp(10)}}>
          <CustomBtn
            btn_txt={'Pay'}
            accessibilityLabel={'Next'}
            onPress={() => {
              validate();
            }}
            btn_width={wp(90)}
            backgroundColor={Colors.primary_green}
          />
        </View>

        <CustomAlert
          overlay_state={benefAddition}
          title={'Beneficiary Addition'}
          alert_text={'Do you want to Add as a Beneficiary?'}
          onPressCancel={() => {
            changeBenefAddition(false);
          }}
          yesNoButtons={true}
          onPressYes={() => {
            if (responseData2?.data?.data?.iban.includes('NBP')) {
              changeBenefAddition(false);

              let res1 = responseData2.data.data?.iban.slice(8, 12);
              let res2 = responseData2.data.data?.iban.slice(14, 24);
              let result = `${res1}${res2}`;
              dispatch(
                setUserObject({
                  ftPayment: {
                    accountFormat: 'Enter the 14 digit account number',
                    amount: param?.amount,
                    bankName: 'National Bank of Pakistan',
                    benefTrans: false,
                    benefType: 1,
                    date: moment(new Date()).format('YYYY-MM-DD hh:mm:ss A'),
                    fromAccount: param?.account,
                    imd: '979898',
                    isDirectPayment: true,
                    purposeOfPayment: param?.pay_pur_id,
                    purposeOfPaymentString: param?.purposeOfPaymentString,
                    title: `${responseData2?.data?.data?.name.toUpperCase()} ${responseData2?.data?.data?.surname.toUpperCase()}`,
                    toAccount: result,
                    token: responseData2?.data?.data?.token,
                  },
                }),
              );
              props?.navigation.navigate('BenefAdditionTransfer', responseData);
            } else {
              props?.navigation.navigate('BenefAdditionTransfer', responseData);
              changeBenefAddition(false);
            }
          }}
          onPressNo={() => {
            if (
              props?.route?.params?.screen_status == 'iban' ||
              props?.route?.params?.screen_status == 'account'
            ) {
              changeBenefAddition(false);
              props?.navigation.navigate('RAASTInfoShow', {
                screen: 'iban',
                param: param,
                paramsAlias: responseData2,
              });
            } else {
              changeBenefAddition(false);
              screenProcess('alias', param, responseData2);
            }
          }}
        />
        <CustomModal
          visible={modal}
          headtext={
            modal_type == 'account'
              ? 'Select From Account'
              : modal_type == 'purpose'
              ? 'Select Purpose Of Payment'
              : modal_type == 'reason'
              ? 'Select reason Type'
              : ''
          }
          data={
            modal_type == 'account'
              ? accounts
              : modal_type == 'purpose'
              ? product_type
              : modal_type == 'reason'
              ? reason
              : null
          }
          onPress_item={(param) => {
            modal_type == 'account'
              ? change_from_acc(param)
              : modal_type == 'purpose'
              ? change_purpose(param)
              : modal_type == 'reason'
              ? change_reason(param)
              : null;
            change_modal_state(false);
          }}
          // citycode={modal_type==='city'?true:false}
          accounts={modal_type === 'account' ? true : false}
          reason={modal_type === 'reason' ? true : false}
          purpose={modal_type == 'purpose' ? true : false}
          onCancel={() => change_modal_state(false)}
        />
      </KeyboardAvoidingView>
    </TouchableWithoutFeedback>
  );
};

export default ByAlias_step2;
