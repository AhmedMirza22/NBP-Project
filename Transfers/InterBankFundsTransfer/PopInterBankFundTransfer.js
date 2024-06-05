import React, {useEffect, useState} from 'react';
import {
  View,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  TouchableOpacity,
  Image,
} from 'react-native';
import I18n from '../../../Config/Language/LocalizeLanguageString';
import SubHeader from '../../../Components/GlobalHeader/SubHeader/SubHeader';
import styles from './InterBankFundsTransferStyling';
import TabNavigator from '../../../Components/TabNavigate/TabNavigate';
import CustomTextField from '../../../Components/CustomTextField/CustomTextField';
import Custom_btn from '../../../Components/Custom_btn/Custom_btn';
import {Colors} from '../../../Theme';
import CustomModal from '../../../Components/CustomModal/CustomModal';
import CustomAlert from '../../../Components/Custom_Alert/CustomAlert';
import {
  ibftPayment,
  setCurrentFlow,
  setAppAlert,
  getInterBankFundTransferData,
  gettransferbanklist,
  setUserObject,
  helpInforamtion,
  setLoader,
  updateSessionToken,
  serviceResponseCheck,
  catchError,
  raastPaybyIBANTitleFetch,
  getdefaultaccounsbyalias,
} from '../../../Redux/Action/Action';
import analytics from '@react-native-firebase/analytics';

import {
  globalStyling,
  hp,
  newDesignBenefFlowObject,
  validateonlyAlphaNumeric,
  wp,
} from '../../../Constant';
import {defaultAccount} from '../../../Helpers/Helper';
import {useSelector, useDispatch} from 'react-redux';
import {
  IBFT_PURPOSE_OF_PAYMENT_LIST,
  RAASTACCOUNT_PURPOSE_OF_PAYMENT_LIST,
} from '../../purposeOfPayments';
import CustomText from '../../../Components/CustomText/CustomText';
import {benefType, logs} from '../../../Config/Config';
import BenefModal from '../../../Components/BeneficiaryModal/BenefModal';
import store from '../../../Redux/Store/Store';
import moment from 'moment';
import {Keyboard} from 'react-native';
import {postTokenCall, Service} from '../../../Config/Service';

export default function InterBankFundsTransfer(props) {
  const interBankFundsTransferData = useSelector(
    (state) => state.reducers.interBankFundsTransferData.Beneficiaries,
  );
  const beneficiaries = useSelector((state) => state.reducers.beneficiaries);
  const viewAccountsData = useSelector(
    (state) => state.reducers.viewAccountsData,
  );
  const mappedAccounts =
    viewAccountsData.length === 0
      ? []
      : viewAccountsData.map(function (object) {
          return {
            ...object,
            text: `${object.account}`,
          };
        });
  const arrayFilter = defaultAccount(mappedAccounts);
  const dispatch = useDispatch();
  const token = useSelector((state) => state.reducers.token);
  const [showModalState, changeModalState] = useState(false);
  const [currentModal, changeCurrentModal] = useState('');
  const [BankList, setBankList] = useState([]);
  const [purposeOfPayment, changePurposeOfPayment] = useState([]);
  const [transferFundsTo, changeTransferFundsTo] = useState('');
  const [responseData, setResponseData] = useState('');

  const [transferFundModalState, changeTransferFundModalState] =
    useState(false);
  const [benefAddition, changeBenefAddition] = useState(false);
  const [amount, setAmount] = useState('');
  const [showBanksModalState, setShowBanksModalState] = useState(false);
  const [selectedBank, setSelectedBank] = useState('');
  const [ibftBankAlert, setIbftBankAlert] = useState(false);
  const [accountNumber, setAccountNumber] = useState('');
  const [transferFrom, setTransferFrom] = useState(
    arrayFilter.length === 0 ? {} : arrayFilter[0],
  );
  const [beneficiaryObject, setBeneficiaryObject] = useState({});
  const userObject = useSelector((state) => state?.reducers?.userObject);
  const ibftPaymentConstant = userObject?.ftPayment;
  const [isDirectPayment, setDirectPaymentState] = useState(true);
  const [isALIAS, setisALIAS] = useState(true);
  const [keyboardOpen, setKeyboardOpen] = useState(false);
  const [params, changeParams] = useState({});

  const requestobj = {};

  const accountNumberObject = {};
  const memberId = props?.route?.params?.reqObj?.memberid;

  const updateFtPaymentObject = (obj) => {
    dispatch(
      setUserObject({
        ftPayment: {
          ...store.getState().reducers.userObject.ftPayment,
          ...obj,
        },
      }),
    );
  };

  // logs.log(props?.route?.params?.transferFromaccount,"ibft sa i rah ahay")

  logs.log(props?.route?.params, 'NewFundTransfer');
  const screenStatus = props?.route?.params?.screen_status;
  logs.log(screenStatus, 'screenStatus=======');

  const apiCall = () => {
    //ASDASD
    // requestobj.memberid = "";
    // requestobj.receiveriban = tab_benef;
    //for next screen
    (accountNumberObject.amount = amount),
      (accountNumberObject.idType = props?.route?.params?.reqObj?.idType);
    accountNumberObject.idValue = props?.route?.params?.reqObj?.idValue
      ? props?.route?.params?.reqObj?.idValue
      : '';
    accountNumberObject.memberid = props?.route?.params?.reqObj?.memberid;
    accountNumberObject.receiveriban =
      props?.route?.params?.reqObj?.receiveriban;

    requestobj.amount = amount;
    requestobj.idType = props?.route?.params?.reqObj?.idType;
    requestobj.idValue = props?.route?.params?.reqObj?.idValue
      ? props?.route?.params?.reqObj?.idValue
      : '';
    if (props?.route?.params?.screen_status == 'IBAN' || 'IBFT') {
      requestobj.memberid = props?.route?.params?.reqObj?.memberid;
      requestobj.receiveriban = props?.route?.params?.reqObj?.receiveriban;
    }
    requestobj.account = props?.route?.params?.reqObj?.account;
    // requestobj.name = props?.route?.params?.reqObj?.name;
    requestobj.source_iban = props?.route?.params?.reqObj?.source_iban;
    requestobj.benef_bank = props?.route?.params?.reqObj?.benef_bank;
    // requestobj.pay_pur = tab_purpose?.purpose;
    requestobj.purposeOfPayment = purposeOfPayment.id;
    // requestobj.pay_pur_id = tab_purpose?.pur_code;
    requestobj.isbenef = props?.route?.params?.reqObj?.isbenef;
    if (amount == '') {
      dispatch(setAppAlert('Please Enter amount'));
    } else if (amount < 2) {
      dispatch(setAppAlert('Amount should be greater then 1 Rs.'));
    } else {
      if (props?.route?.params?.screen_status == 'IBAN') {
        dispatch(
          raastPaybyIBANTitleFetch(
            'iban',
            props.navigation,
            requestobj,
            (screen_status, params, response) => {
              params.fromScreen = 'raastIBAN';
              // setResponseData2(response);
              // changeParams(params);
              logs.log('Account Title------', response?.data);
              setResponseData({response: response?.data, parmas: params});
              const reqObject = {
                fromAccount: props?.route?.params?.reqObj?.account,
                accountTitle: response?.data?.acctitle,
                toAccount: props?.route?.params?.reqObj?.receiveriban,
                amount: amount,
              };

              logs.log('Response of titleFetch -2---', response?.data);
              dispatch(
                setUserObject({
                  ftPayment: reqObject,
                }),
              );

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
      } else if (props?.route?.params?.screen_status == 'Account Number') {
        accountNumberApi();
      } else if (
        props?.route?.params?.reqObj?.screen_status == 'IBFT' ||
        props?.route?.params?.screen_status == 'IBFT'
      ) {
        dispatch(
          ibftPayment(
            // logs.log("props?.route?.params?",props?.route?.params?.reqObj?.account)
            // logs.log("props?.route?.params?",props?.route?.params?.reqObj?.receiveriban)
            token,
            props.navigation,
            amount,
            props?.route?.params?.reqObj?.account,
            props?.route?.params?.reqObj?.beneficiaryObjectimd,
            purposeOfPayment.id,
            isDirectPayment
              ? props?.route?.params?.reqObj?.receiveriban.toUpperCase()
              : props?.route?.params?.reqObj?.receiveriban,
            isDirectPayment,
            {
              ...beneficiaryObject,
              ...transferFrom,
              amount,
              purposeOfPayment: purposeOfPayment.id,
              purposeOfPaymentString: purposeOfPayment.text,
            },
            purposeOfPayment.text,
            (routedObject_, responseObject) => {
              logs.log('routedObject_routedObject_:', routedObject_);
              setResponseData(routedObject_);
              let ftPayment = {
                ...store.getState().reducers.userObject.ftPayment,
                amount: amount,
                benefType: benefType.IBFT,
                fromAccount: props?.route?.params?.transferFromaccount
                  ? props?.route?.params?.transferFromaccount
                  : props?.route?.params?.reqObj?.account,
                toAccount: isDirectPayment
                  ? props?.route?.params?.reqObj?.receiveriban.toUpperCase()
                  : beneficiaryObject?.benefAccount,
                purposeOfPayment: purposeOfPayment.id,
                purposeOfPaymentString: purposeOfPayment.text,
                imd: beneficiaryObject.imd
                  ? beneficiaryObject.imd
                  : props?.route?.params?.reqObj?.beneficiaryObjectimd,
                date: moment(new Date()).format('YYYY-MM-DD hh:mm:ss A'),
                // ...routedObject_,
                token: routedObject_?.token,
                title: routedObject_?.title,
                benefExists: routedObject_?.benefExists,
                isCertainBeneficiaryFlow: routedObject_?.benefExists
                  ? true
                  : false,
                isDirectPayment: isDirectPayment ? true : false,
                accountType: transferFrom.accountType,
                benefID: routedObject_?.benefId
                  ? routedObject_?.benefId
                  : beneficiaryObject?.benefID
                  ? beneficiaryObject?.benefID
                  : '',
                benefAlias: beneficiaryObject.benefAlias,
                benefEmail: beneficiaryObject?.benefEmail,
                benefPhone: beneficiaryObject?.benefMobile,
              };
              if (responseObject?.benefExists === false) {
                dispatch(setUserObject({ftPayment: ftPayment}));
                changeBenefAddition(true);
              } else {
                let newData = {...newDesignBenefFlowObject};
                if (responseObject?.benefExists === true) {
                  logs.log('askdjajs7657--->', responseObject);
                  newData.benefEmail = routedObject_?.benefEmail;
                  newData.benefMobile = routedObject_?.benefMobileNumber;
                  newData.benefAlias = routedObject_?.benefAlias;
                  // newData.benefEmail = routedObject_?.benefEmail;
                  // newData.accountType = viewAccountsData[0]?.accountType;
                  // newData.benefAccount = routedObject_?.titleFetchAccount;
                }
                let newFtPayment = {ftPayment: {...ftPayment, ...newData}};
                dispatch(setUserObject(newFtPayment));
                props?.navigation.navigate('InterBankFundTransferDetail');
                // let newData = {...routedObject_, ...newDesignBenefFlowObject};
                // props?.navigation.navigate('InterBankFundTransferDetail', {
                //   data: newData,
                // });
              }
            },
          ),
        );
      } else {
        logs.log('Raast ID flow');
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
              logs.log(
                'jaksh872t7312r3123------->dadarwqereqwrerwe',
                response?.data?.data,
              );

              const reqObject = {
                fromAccount: props?.route?.params?.reqObj?.account,
                accountTitle: response?.data?.data?.name,
                toAccount: response?.data?.data?.iban,
                amount: amount,
                purposeOfPayment: purposeOfPayment,
              };

              logs.log('Response of titleFetch -2---', response?.data);
              dispatch(
                setUserObject({
                  ftPayment: reqObject,
                }),
              );
              // params.pay_pur_id = tab_purpose?.pur_code;
              params.fromScreen = 'raastAlias';
              // setResponseData2(response);
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
                // props?.navigation.navigate('RAASTInfoShow', {
                //   screen: screen_status,
                //   param: params,
                //   paramsAlias: response,
                // });
              }
            },
          ),
        );
      }
    }
  };

  const accountNumberApi = async () => {
    try {
      dispatch(setLoader(true));
      const response = await postTokenCall(Service.titleFetch2, {
        amount: amount,
        idType: props?.route?.params?.reqObj?.idType,
        idValue: props?.route?.params?.reqObj?.idValue
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
          fromAccount: props?.route?.params?.reqObj?.account,
          accountTitle: response?.data?.data?.acctitle,
          toAccount: props?.route?.params?.reqObj?.receiveriban,
          amount: amount,
          purposeOfPayment: purposeOfPayment,
          imd: props?.route?.params?.reqObj?.imd,
          bankName: props?.route?.params?.reqObj?.bankName,
        };

        logs.log('Response of titleFetch -2---', response?.data?.data);
        setResponseData(response?.data?.data);

        dispatch(
          setUserObject({
            ftPayment: reqObject,
          }),
        );
        if (response?.data?.data?.benefExists == false) {
          changeBenefAddition(true);
        } else {
          logs.log(
            response?.data?.data?.benefEmail,
            response?.data?.data?.benefMobileNumber,
          );

          // props?.navigation.navigate('RAASTInfoShow', {
          //   screen: screen_status,
          //   param: params,
          //   paramsAlias: response,
          // });
          props?.navigation.navigate('InterBankFundTransferDetail');
        }
      } else {
        dispatch(serviceResponseCheck(response, props.navigation));
      }
    } catch (error) {
      logs.log('errors', error);
      dispatch(catchError(error));
    }
  };

  const checkValidation = () => {
    if (transferFrom === '' || Object.keys(transferFrom).length === 0) {
      global.showToast.show(I18n['Please select an account'], 1000);
    }
    // else if (transferFundsTo === '') {
    //   global.showToast.show(I18n['Account number cannot be empty'], 1000);
    // }
    else if (amount === '' || amount === '0') {
      global.showToast.show(
        I18n['Please provide amount for transaction'],
        1000,
      );
    } else if (amount < 2) {
      global.showToast.show(I18n['Amount should be greater than 1 Rs.'], 1000);
    } else {
      apiCall();
    }
  };

  const fromComp = () => {
    return (
      <>
        <CustomText style={styles.text}>From</CustomText>

        <TabNavigator
          border={true}
          accessibilityLabel={
            Object.keys(transferFrom).length === 0
              ? 'Tap here to select an option'
              : transferFrom.text
          }
          text={
            Object.keys(transferFrom).length === 0
              ? 'Tap here to select an option'
              : transferFrom?.iban
              ? transferFrom?.iban
              : transferFrom?.text
          }
          tabHeadingColor={
            Object.keys(transferFrom).length === 0
              ? Colors.whiteColor
              : Colors.grey
          }
          tabHeading={
            Object.keys(transferFrom).length === 0
              ? 'Account Number'
              : viewAccountsData[0]?.accountType
          }
          navigation={props.navigation}
          width={'90%'}
          fontSize={wp(4.2)}
          textWidth={'100%'}
          // arrowColor={viewAccountsData.length == 1 ? 'white' : 'black'}
          arrowSize={wp(9)}
          multipleLines={2}
          // backgroundColor={
          //   Object.keys(transferFrom).length === 0
          //     ? Colors.primary_green
          //     : 'white'
          // }
          // color={Object.keys(transferFrom).length === 0 ? 'white' : 'black'}
          onPress={() => {
            viewAccountsData.length == 1 ? null : onHandleMultiAcc();
          }}
        />
      </>
    );
  };

  const popComp = () => {
    return (
      <TabNavigator
        tabHeading={'Purpose Of Payment'}
        border={true}
        accessibilityLabel={
          Object.keys(purposeOfPayment).length === 0
            ? 'Tap here to select an option'
            : purposeOfPayment.text
        }
        text={
          Object.keys(purposeOfPayment).length === 0
            ? 'Tap here to select an option'
            : purposeOfPayment.text
        }
        navigation={props.navigation}
        width={'90%'}
        fontSize={wp(4.5)}
        arrowSize={wp(9)}
        // arrowColor={'black'}
        textWidth={'100%'}
        onPress={() => {
          changeCurrentModal('others');
          changeModalState(true);
        }}
      />
    );
  };
  const selectBank = () => {
    return (
      <TabNavigator
        border={true}
        accessibilityLabel={'Bank'}
        text={ibftPaymentConstant?.bankName}
        // tabHeadingColor={
        //   Object.keys(transferFrom).length === 0
        //     ? Colors.whiteColor
        //     : Colors.grey
        // }
        tabHeading={'Bank'}
        navigation={props.navigation}
        width={'90%'}
        fontSize={wp(4.2)}
        textWidth={'100%'}
        // arrowColor={viewAccountsData.length == 1 ? 'white' : 'black'}
        arrowSize={wp(9)}
        multipleLines={2}
        // backgroundColor={
        //   Object.keys(transferFrom).length === 0
        //     ? Colors.primary_green
        //     : Colors.whiteColor
        // }
        // color={Object.keys(transferFrom).length === 0 ? 'white' : 'black'}
        onPress={() => {
          if (isDirectPayment == false) {
            // do nothing
          } else {
            props.navigation.goBack();
          }
        }}
      />
    );
  };

  useEffect(() => {
    if (ibftPaymentConstant?.isPayBenef) {
      changeTransferFundsTo(
        `${ibftPaymentConstant?.benefAlias} - ${ibftPaymentConstant?.benefAccount}`,
      );
      setDirectPaymentState(false);
      setBeneficiaryObject(ibftPaymentConstant?.benefObject);
    } else {
      setBeneficiaryObject(ibftPaymentConstant);
    }
    props.navigation.addListener('focus', () => {
      dispatch(setCurrentFlow('Inter Bank Fund Transfer'));
      async function analyticsLog() {
        await analytics().logEvent('POPIBFTFundTransferScreen');
      }
      analyticsLog();
    });
    changeTransferFundsTo(ibftPaymentConstant?.bankName);
  }, []);
  useEffect(() => {
    if (
      screenStatus === 'Account Number' ||
      screenStatus === 'IBAN' ||
      screenStatus === 'Raast'
    ) {
      changePurposeOfPayment(RAASTACCOUNT_PURPOSE_OF_PAYMENT_LIST[12]);
    } else {
      changePurposeOfPayment(IBFT_PURPOSE_OF_PAYMENT_LIST[12]);
    }
  }, []);
  const onHandleMultiAcc = () => {
    changeModalState(true);
    setTransferFrom({});
    changeCurrentModal('transferFrom');
  };

  const benefAditionNoPress = () => {
    if (props?.route?.params?.reqObj?.screen_status == 'IBFT') {
      logs.log('In IBFT');
      props?.navigation.navigate('InterBankFundTransferDetail');
    } else if (props?.route?.params?.screen_status == 'Account Number') {
      logs.log('In Account');
      logs.log('In Account Object', props?.route?.params?.reqObj);
      logs.log('In IBAN');
      logs.log('Params', params);
      logs.log('responseData', responseData);
      logs.log('responseData?.parmas', responseData?.parmas);
      logs.log('purposeOfPayment', purposeOfPayment);

      let raastAccount = props?.route?.params?.reqObj;
      logs.log('raastAccount.receiveriban', raastAccount.receiveriban);

      raastAccount.receiveriban = responseData?.iban;
      const iban = raastAccount.receiveriban;
      logs.log('responseData', responseData);
      logs.log('iban', iban);

      // raastAccount.receiveriban = responseData

      // props?.navigation.navigate('InterBankFundTransferDetail', {
      //   data: 'AccountNumber',
      // });x
      props?.navigation.navigate('RAASTInfoShow', {
        screen: 'account',
        param: params,
        paramsAlias: responseData.response,
        raastIban: raastAccount,
        purposeOfPayment: purposeOfPayment,
      });
    } else if (props?.route?.params?.screen_status == 'IBAN') {
      logs.log('In IBAN');
      logs.log('Params', params);
      logs.log('responseData', responseData);
      logs.log('responseData?.parmas', responseData?.parmas);
      logs.log('purposeOfPayment', purposeOfPayment);

      props?.navigation.navigate('RAASTInfoShow', {
        screen: 'iban',
        param: params,
        paramsAlias: responseData.response,
        raastIban: responseData?.parmas,
        purposeOfPayment: purposeOfPayment,
      });
    } else {
      logs.log('In Else', props?.route?.params?.screen_status);
      props?.navigation.navigate('RAASTInfoShow', {
        screen: 'raastAlias',
        param: params,
        paramsAlias: responseData.response,
      });
    }
  };

  const accountBenefComp = () => {
    return (
      <View
        style={{
          flexDirection: 'row',
          alignSelf: 'center',
          justifyContent: 'space-between',
          width: wp(90),
        }}>
        <View style={{flexDirection: 'column'}}>
          <CustomTextField
            textHeading={
              !isDirectPayment
                ? beneficiaryObject?.benefAlias
                : accountNumber.length == 0 || beneficiaryObject?.benefAccount
                ? null
                : isALIAS
                ? 'Enter Account Number'
                : 'Enter IBAN'
            }
            placeholder={'Enter Account or IBAN Number'}
            accessibilityLabel="Enter Amount"
            text_input={
              isDirectPayment ? accountNumber : beneficiaryObject?.benefAccount
            }
            fontSize={isALIAS ? wp(4) : wp(3.6)}
            editable={!isDirectPayment ? false : true}
            onSubmitEditing={() => {}}
            returnKeyType={'next'}
            // showPassword={true}
            isInfoBtn={true}
            left_icon_name={'info'}
            onPress_icon={() => {}}
            onPressinfo={() => {
              dispatch(
                helpInforamtion({
                  title: ibftPaymentConstant?.bankName,
                  page: 'AcountNoINfo',
                  state: true,
                  accountFormat: ibftPaymentConstant?.accountFormat,
                }),
              );
            }}
            onChangeText={(value) => {
              setDirectPaymentState(true);
              if (!isNaN(value)) {
                setisALIAS(true);
                setAccountNumber(String(value).replace(/[^0-9]/g, ''));
              } else {
                setisALIAS(false);
                setAccountNumber(validateonlyAlphaNumeric(value));
              }
            }}
            maxLength={24}
            width={wp(74)}
            // keyboardType={'default'}
          />
          <CustomText
            style={{
              fontSize: wp(2.5),
              width: wp(74),
              marginTop: wp(2),
            }}>
            {'Enter Account Number or 24 digit IBAN Number'}
          </CustomText>
        </View>
        <View style={{flexDirection: 'column'}}>
          <TouchableOpacity
            style={{alignSelf: 'center'}}
            onPress={() => {
              if (ibftPaymentConstant?.isPayBenef) {
                // removed logs raffays code had log command
              } else {
                dispatch(
                  getInterBankFundTransferData(
                    token,
                    props.navigation,
                    false,
                    false,
                    '',
                    () => {
                      changeTransferFundModalState(true);
                    },
                  ),
                );
                setAccountNumber('');
              }
            }}>
            <View
              style={{
                backgroundColor: ibftPaymentConstant?.isPayBenef
                  ? Colors.beneficiaryListPressed
                  : Colors.beneficiaryList,
                justifyContent: 'center',
                width: wp(13),
                height: wp(13),
                borderWidth: 1,
                borderColor: Colors.textFieldBorderColor,
                borderRadius: wp(1),
                alignSelf: 'center',
                marginTop: wp(0.5),
              }}>
              <TouchableOpacity
                style={{alignSelf: 'center'}}
                onPress={() => {
                  if (ibftPaymentConstant?.isPayBenef) {
                    // logs.log('sdadasd');
                  } else {
                    dispatch(
                      getInterBankFundTransferData(
                        token,
                        props.navigation,
                        false,
                        false,
                        '',
                        () => {
                          changeTransferFundModalState(true);
                        },
                      ),
                    );
                    setAccountNumber('');
                  }
                }}>
                <Image
                  resizeMode="stretch"
                  source={require('../../../Assets/RAAST_Icons/ContactList.png')}
                  style={{tintColor: Colors.tabNavigateRightIcon}}
                />
              </TouchableOpacity>
            </View>
          </TouchableOpacity>

          <CustomText
            style={{
              fontSize: wp(2.5),
              marginTop: wp(2),
              width: wp(15),
              textAlign: 'center',
            }}>
            {`Beneficiary\nList`}
          </CustomText>
        </View>
      </View>
    );
  };
  const amountComp = () => {
    return (
      <CustomTextField
        textHeading={amount.length == 0 ? null : 'Enter Amount'}
        placeholder={'Amount'}
        accessibilityLabel="Enter Amount"
        currencyInput={true}
        // showCurrency={true}
        Textfield_label={''}
        text_input={amount}
        onChangeText={(value) => {
          setAmount(String(value).replace(/[^0-9]/g, ''));
        }}
        width={'90%'}
        keyboardType={'number-pad'}
      />
    );
  };

  return (
    <View style={[styles.container, {backgroundColor: Colors.backgroundColor}]}>
      {/* <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : null}
        keyboardVerticalOffset={hp(8)}
        enabled
        style={{flex: 1}}
        
        accessibilityLabel="Inter Bank Funds Transfer Screen"> */}
      <SubHeader
        title={'Inter Bank Fund Transfer'}
        description={'Transfer funds to other bank accounts'}
        navigation={props.navigation}
      />
      <ScrollView contentContainerStyle={globalStyling.scrollContent}>
        <View style={{flex: 1}}>
          {/* {fromComp()} */}

          {/* <CustomText style={styles.text}>To</CustomText> */}
          {/* {selectBank()} */}

          {popComp()}
          <View style={{height: wp(1)}}></View>

          {/* {accountBenefComp()} */}
          <View style={{height: hp(1)}}></View>
          {amountComp()}
        </View>

        <CustomModal
          visible={showModalState}
          headtext={
            currentModal === 'transferFrom'
              ? 'Select Account'
              : currentModal === 'others'
              ? 'Purpose Of Payment'
              : 'Transfer Funds To'
          }
          data={
            screenStatus === 'Account Number' ||
            screenStatus === 'IBAN' ||
            screenStatus === 'Raast'
              ? RAASTACCOUNT_PURPOSE_OF_PAYMENT_LIST
              : currentModal === 'transferFrom'
              ? mappedAccounts
              : currentModal === 'others'
              ? IBFT_PURPOSE_OF_PAYMENT_LIST
              : [
                  {id: 71, text: 'Beneficiary List'},
                  {id: 72, text: 'Other Account'},
                ]
          }
          mobileTopUpBeneficiary={
            currentModal === 'transferFrom' ? true : false
          }
          // currentModal === 'beneficiary'
          onPress_item={(param) => {
            if (param.text === 'Other Account') {
              currentModal === 'others' ? changePurposeOfPayment(param) : null;
              changeModalState(!showModalState);
              if (currentModal === 'transferTo') {
                setTimeout(
                  () => {
                    dispatch(
                      gettransferbanklist(props.navigation, (banks) => {
                        setBankList(banks.banks);
                        // logs.log('hjasgdhas', banks);
                        changeModalState(false);
                        setShowBanksModalState(true);
                        setAccountNumber('');
                      }),
                    );
                  },
                  Platform.OS === 'ios' ? 500 : 100,
                );
              }
            } else {
              changeCurrentModal('beneficiary');
              if (currentModal === 'transferFrom') {
                setTransferFrom(param);
              }
              currentModal === 'others' ? changePurposeOfPayment(param) : null;
              changeModalState(!showModalState);
              if (currentModal === 'transferTo') {
                setTimeout(
                  () => {
                    dispatch(
                      getInterBankFundTransferData(
                        token,
                        props.navigation,
                        false,
                        false,
                        '',
                        () => {
                          changeTransferFundModalState(true);
                        },
                      ),
                    );
                    // changeTransferFundModalState(true);
                  },
                  Platform.OS === 'ios' ? 500 : 100,
                );
              }
            }
          }}
          onCancel={() => changeModalState(!showModalState)}
        />
        <CustomModal
          visible={false}
          headtext={'Please Select Options Below'}
          data={interBankFundsTransferData}
          beneficiaries={currentModal === 'beneficiary' ? true : false}
          onPress_item={(param) => {
            setBeneficiaryObject(param);
            changeTransferFundsTo(
              `${param.benefAlias} - ${param?.benefAccount}`,
            );
            changeTransferFundModalState(!transferFundModalState);
          }}
          onCancel={() => changeTransferFundModalState(!transferFundModalState)}
        />
        <CustomModal
          visible={showBanksModalState}
          headtext={'Please Select Options Below'}
          banks={true}
          // data={interBankFundsTransferData?.Banks?.banks}
          data={BankList}
          onPress_item={(param) => {
            setSelectedBank(param);
            setBeneficiaryObject(param);
            setShowBanksModalState(false);
            changeModalState(false);
            changeTransferFundsTo(param.bankName);
          }}
          onCancel={() => setShowBanksModalState(false)}
        />
        <CustomAlert
          overlay_state={ibftBankAlert}
          title={'Please Select Option Below'}
          ibftBankTransfer={true}
          bankObject={selectedBank}
          alert_text={selectedBank?.accountFormat}
          showBankListModal={() => {
            setIbftBankAlert(false);
            setTimeout(
              () => {
                setShowBanksModalState(true);
              },
              Platform.OS === 'ios' ? 500 : 100,
            );
          }}
          onChangeText={(value) => setAccountNumber(value)}
          onPressCancel={() => setIbftBankAlert(false)}
          onPress={() => {
            if (accountNumber.length <= 8) {
              dispatch(setAppAlert('Please Enter Valid Account Number/IBAN.'));
            } else {
              setTimeout(
                () => {
                  setDirectPaymentState(true);
                },
                Platform.OS === 'ios' ? 500 : 100,
              );
              changeTransferFundsTo(
                accountNumber === ''
                  ? `${selectedBank.bankName}`
                  : `${selectedBank.bankName} - ${accountNumber}`,
              );
              setIbftBankAlert(false);
            }
          }}
        />
        <CustomAlert
          overlay_state={benefAddition}
          title={'Beneficiary Addition'}
          alert_text={'Do you want to Add as a Beneficiary?'}
          onPressCancel={() => {
            changeBenefAddition(false);
          }}
          yesNoButtons={true}
          onPressYes={() => {
            // screenStatus === 'Raast'
            //   ? props.navigation.navigate('byAlias_step2', {
            //       reqObj: requestobj,
            //       screen_status: isALIAS ? 'alias' : 'iban',
            //     })
            //   :
            props?.navigation.navigate('BenefAdditionTransfer', {
              data: responseData,
              fromScreen: 'Ibft',
            });
            changeBenefAddition(false);
          }}
          onPressNo={() => {
            changeBenefAddition(false);
            benefAditionNoPress();
            // props?.navigation.navigate('RAASTInfoShow', {
            //   screen: 'raastAlias',
            //   param: params,
            //   paramsAlias: responseData.response,
            // });
          }}
        />
        <BenefModal
          navigation={props.navigation}
          isVisible={transferFundModalState}
          data={beneficiaries}
          onBackdropPress={() => {
            changeTransferFundModalState(false);
            setDirectPaymentState(true);
          }}
          onItemPress={(param) => {
            logs.log('newitemparam : ', param);
            let newBenefObject = {
              ...param,
              bankName: param.companyName,
              toAccount: param.benefAccount,
            };
            delete newBenefObject.companyName;
            delete newBenefObject.benefAccount;
            updateFtPaymentObject(newBenefObject);
            setDirectPaymentState(false);
            setBeneficiaryObject(param);
            changeTransferFundsTo(
              `${param.benefAlias} - ${param?.benefAccount}`,
            );
            changeTransferFundModalState(!transferFundModalState);
          }}
        />
      </ScrollView>
      <KeyboardAvoidingView
        keyboardVerticalOffset={hp(7)}
        behavior={'padding'}
        style={globalStyling.buttonContainer}>
        <Custom_btn
          btn_txt={'Continue'}
          accessibilityLabel="Tap to Proceed"
          onPress={() => {
            Keyboard.dismiss();
            checkValidation();
          }}
          btn_width={wp(90)}
          backgroundColor={Colors.primary_green}
        />
      </KeyboardAvoidingView>
    </View>
  );
}
