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
  raast_payment_title_fetch,
  raastpyamentrequest,
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
  RAAST_PURPOSE_OF_PAYMENT_LIST,
} from '../../purposeOfPayments';
import CustomText from '../../../Components/CustomText/CustomText';
import {benefType, logs} from '../../../Config/Config';
import BenefModal from '../../../Components/BeneficiaryModal/BenefModal';
import store from '../../../Redux/Store/Store';
import moment from 'moment';
import {Keyboard} from 'react-native';
import {isRtlState} from '../../../Config/Language/LanguagesArray';
import {getTokenCall, Service, postTokenCall} from '../../../Config/Service';
import RecentTransaction from '../../../Components/RecentTransaction/RecentTransaction';
import {Message} from '../../../Constant/Messages';
import {useTheme} from '../../../Theme/ThemeManager';
import InformationIcon from '../../../Components/InformationIcon/InformationIcon';
export default function InterBankFundsTransfer(props) {
  useEffect(() => {
    async function analyticsLog() {
      await analytics().logEvent('IBFTFundTransferScreen');
    }
    analyticsLog();
  }, []);

  const interBankFundsTransferData = useSelector(
    (state) => state.reducers.interBankFundsTransferData.Beneficiaries,
  );
  // const beneficiaries = useSelector((state) => state.reducers.beneficiaries);

  const dispatch = useDispatch();
  const token = useSelector((state) => state.reducers.token);
  const [showModalState, changeModalState] = useState(false);
  const [currentModal, changeCurrentModal] = useState('');
  const [BankList, setBankList] = useState([]);
  const [BankList2, setBankList2] = useState([]);
  const [purposeOfPayment, changePurposeOfPayment] = useState(
    RAAST_PURPOSE_OF_PAYMENT_LIST[12],
  );
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
  const [transferFrom, setTransferFrom] = useState({});
  const [beneficiaryObject, setBeneficiaryObject] = useState({});
  const userObject = useSelector((state) => state?.reducers?.userObject);
  const acc_info = useSelector(
    (state) => state.reducers.overViewData?.data?.accounts,
  );
  const [ibftPaymentConstant, setIbftPaymentConstant] = useState({
    ...userObject?.ftPayment,
  });
  const [ibftData, setIbftData] = useState(ibftPaymentConstant);
  const [isDirectPayment, setDirectPaymentState] = useState(true);
  const [titleFetch2, setTitleFetch2] = useState(true);
  const [raastPaymentIBAN, setRaastPaymentIBAN] = useState(false);
  const [isALIAS, setisALIAS] = useState(true);
  const [bankObject, setBankObject] = useState();
  const [fromScreen, setFromScreen] = useState('Ibft');
  const [isRaastSelected, setIsRaastSelected] = useState(true);
  const [isRaastBlocked, setIsRaastBlocked] = useState(false);
  const [is1LinkBlocked, setis1LinkBlocked] = useState(false);

  const [beneficiaries, setBeneficiaries] = useState([]);
  const accounts = userObject?.pkAccounts;

  const {activeTheme} = useTheme();

  useEffect(() => {
    let strippedString = ibftPaymentConstant?.memberId;
    if (ibftPaymentConstant?.tfenable) {
      logs.log('is Raasat and TF2');
      setTitleFetch2(true);
      setRaastPaymentIBAN(true);
      if (!ibftPaymentConstant?.isDirectPayment) {
        setis1LinkBlocked(true);
      }
    } else if (
      strippedString &&
      strippedString.length !== 0 &&
      !ibftPaymentConstant?.tfenable
    ) {
      logs.log('is Raasat and iban');
      setTitleFetch2(false);
      setRaastPaymentIBAN(true);
      setisALIAS(false);
      if (!ibftPaymentConstant?.isDirectPayment) {
        setis1LinkBlocked(true);
      }
    } else {
      logs.log('is 1LINK');
      setIsRaastSelected(false); //for checkBox
      setIsRaastBlocked(true); //for blocking UI
      setTitleFetch2(false);
      setRaastPaymentIBAN(false);
    }
  }, []);
  useEffect(() => {
    if (ibftPaymentConstant?.isPayBenef) {
      setDirectPaymentState(false);
      logs.log('12873123123', ibftPaymentConstant?.benefAccount);
      setAccountNumber(ibftPaymentConstant?.benefAccount);
    } else {
      setBeneficiaryObject(ibftPaymentConstant);
    }
    props.navigation.addListener('focus', () => {
      dispatch(setCurrentFlow('Inter Bank Fund Transfer'));
    });
    changeTransferFundsTo(ibftPaymentConstant?.bankName);
  }, []);
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
  const updateStates = (param) => {
    setAccountNumber(param?.benefAccount);
    setIbftPaymentConstant((prevState) => ({
      ...prevState,
      benefAlias: param?.benefAlias,
      // bankName: bankData[0]?.name,
      isDirectPayment: false,
      isPayBenef: true,
      benefEmail: param?.benefEmail,
      benefPhone: param?.benefMobile,
      benefMobile: param?.benefMobile,
      tfenable: false,
      benefAccount: param?.benefAccount,
      imd: param?.imd,
      benefType: param?.benefType,
    }));
    updateFtPaymentObject({
      benefAlias: param?.benefAlias,
      // bankName: bankData[0]?.name,
      isDirectPayment: false,
      isPayBenef: true,
      benefEmail: param?.benefEmail,
      benefPhone: param?.benefMobile,
      benefMobile: param?.benefMobile,
      tfenable: false,
      benefAccount: param?.benefAccount,
      imd: param?.imd,
      benefType: param?.benefType,
    });
  };
  useEffect(() => {
    setTransferFrom({
      account: accounts[0]?.account,
      iban: accounts[0]?.iban,
      accountType: accounts[0]?.accountType,
      currency: accounts[0]?.currency,
      accountTitle: accounts[0]?.accountTitle,
    });
  }, []);
  const ibftTitleFetch = () => {
    dispatch(
      ibftPayment(
        token,
        props.navigation,
        amount,
        transferFrom.account,
        ibftPaymentConstant.imd,
        purposeOfPayment.id,
        isDirectPayment
          ? accountNumber.toUpperCase()
          : ibftPaymentConstant?.benefAccount,
        isDirectPayment,
        {
          ...ibftPaymentConstant,
          ...transferFrom,
          amount,
          purposeOfPayment: purposeOfPayment.id,
          purposeOfPaymentString: purposeOfPayment.text,
        },
        purposeOfPayment.text,
        (routedObject_, responseObject) => {
          logs.log('189273917293871293--->', routedObject_);
          setResponseData({
            title: routedObject_?.title,
            titleFetchAccount: accountNumber,
          });
          if (!responseObject?.benefExists) {
            updateFtPaymentObject({
              isDirectPayment: true,
              token: routedObject_?.token,
              title: routedObject_?.title,
              titleFetchAccount: accountNumber,
            });
            changeBenefAddition(true);
          } else {
            logs.log('is benf exist', ibftPaymentConstant, routedObject_);
            if (routedObject_.benefAlias) {
              let tempObj = {};
              tempObj.shortName = routedObject_.benefAlias;
              tempObj.benefId = routedObject_.benefId;
              tempObj.isDirectPayment = false;
              tempObj.benefEmail = routedObject_.benefEmail;
              tempObj.benefPhone = routedObject_.benefMobileNumber;
              tempObj.benefMobile = routedObject_.benefMobileNumber;
              tempObj.token = routedObject_?.token;
              tempObj.title = routedObject_?.title;
              updateFtPaymentObject(tempObj);
              props?.navigation.navigate('InterBankFundTransferDetail');
            }
          }
        },
      ),
    );
  };
  const getBeneficiaries = async (benefType) => {
    try {
      dispatch(setLoader(true));
      // setConsumerName('');
      const response = await getTokenCall(
        Service.getBeneficiaries,
        `benefTypes=${2}&status=1`,
      );

      dispatch(updateSessionToken(response));
      if (response?.data?.responseCode === '00') {
        // ('1029839012830981293');
        if (
          response?.data?.data?.beneficiaries &&
          response?.data?.data?.beneficiaries instanceof Array
        ) {
          setBeneficiaries(response?.data?.data?.beneficiaries);
          dispatch(setLoader(false));
          // changeModalState(true);
          changeTransferFundModalState(true);
        } else {
          dispatch(setLoader(false));
        }
      } else {
        dispatch(serviceResponseCheck(response, props.navigation));
      }
    } catch (error) {
      dispatch(catchError(error));
    }
  };
  const getRaastBeneficiaries = async () => {
    try {
      dispatch(setLoader(true));
      // setConsumerName('');
      const response = await getTokenCall(
        Service.getBeneficiaries,
        `benefTypes=${17}&status=1`,
      );

      dispatch(updateSessionToken(response));
      if (response?.data?.responseCode === '00') {
        // ('1029839012830981293');
        if (
          response?.data?.data?.beneficiaries &&
          response?.data?.data?.beneficiaries instanceof Array
        ) {
          const oldBenef = response?.data?.data?.beneficiaries;
          try {
            const raastBeneResponse = await getTokenCall(
              Service.getBeneficiaries,
              `benefTypes=${18}&status=1`,
            );
            dispatch(updateSessionToken(raastBeneResponse));
            if (raastBeneResponse?.data?.responseCode === '00') {
              if (
                raastBeneResponse?.data?.data?.beneficiaries &&
                raastBeneResponse?.data?.data?.beneficiaries instanceof Array
              ) {
                const newBenef = raastBeneResponse?.data?.data?.beneficiaries;
                // const combinedarr = [...oldBenef, ...newBenef];
                logs.log([...oldBenef, ...newBenef]);
                setBeneficiaries([...oldBenef, ...newBenef]);
                dispatch(setLoader(false));
                // changeModalState(true);
                changeTransferFundModalState(true);
              } else {
                dispatch(setLoader(false));
              }
            } else {
              dispatch(
                serviceResponseCheck(raastBeneResponse, props.navigation),
              );
            }
          } catch (error) {
            dispatch(catchError(error));
          }
        } else {
          dispatch(setLoader(false));
        }
      } else {
        dispatch(serviceResponseCheck(response, props.navigation));
      }
    } catch (error) {
      dispatch(catchError(error));
    }
  };
  const checkValidation = () => {
    if (transferFrom === '' || Object.keys(transferFrom).length === 0) {
      global.showToast.show(I18n['Please select an account'], 1000);
    } else if (transferFundsTo === '') {
      global.showToast.show(I18n['Please select a beneficiary'], 1000);
    } else if (amount === '' || amount === '0') {
      global.showToast.show(
        I18n['Please provide amount for transaction'],
        1000,
      );
    } else if (amount < 2) {
      global.showToast.show(I18n['Amount should be greater than 1 Rs.'], 1000);
    } else if (accountNumber < 7) {
      global.showToast.show(I18n[Message.accountnumbercannotbeshown], 1000);
    } else {
      let tempObj = {};
      tempObj.amount = amount;
      tempObj.participantName = bankObject?.participantName;
      tempObj.prefix = bankObject?.prefix;
      tempObj.bic = bankObject?.bic;
      tempObj.fromAccount = transferFrom?.account;
      tempObj.accountTitle = transferFrom?.accountTitle;
      tempObj.accountType = transferFrom?.accountType;
      tempObj.iban = transferFrom?.iban;
      tempObj.toAccount = accountNumber;
      tempObj.purposeOfPayment = purposeOfPayment?.id;
      tempObj.purposeOfPaymentString = purposeOfPayment?.text;
      tempObj.popText = purposeOfPayment?.text;

      updateFtPaymentObject(tempObj);
      if (!titleFetch2 && raastPaymentIBAN) {
        if (accountNumber.toUpperCase().startsWith('PK')) {
          raastPaymentTitleFetchByIBAN();
        } else {
          dispatch(
            setAppAlert(Message.tf2notprent, '', props.navigation, () => {}),
          );
        }
      } else if (accountNumber.toUpperCase().startsWith('PK')) {
        if (isRaastSelected) {
          raastPaymentTitleFetchByIBAN();
        } else {
          ibftTitleFetch();
        }
      } else {
        if (isRaastSelected) {
          accountNumberApi();
        } else {
          ibftTitleFetch();
        }
      }

      // if (titleFetch2 && !raastPayment) {
      //   // updateFtPaymentObject({
      //   //   paymentType: 'raastTitleFetch2',
      //   //   narration: 'NBP RAAST PAYMENTS',
      //   //   paymentMethod: 'paybyaccount',
      //   //   accountNo: accountNumber,
      //   // });
      //   // accountNumberApi();
      // } else if (!titleFetch2 && raastPayment) {
      //   // updateFtPaymentObject({
      //   //   paymentType: 'raastpaybyIBAN',
      //   //   narration: 'NBP RAAST PAYMENTS',
      //   //   paymentMethod: 'iban',
      //   // });
      //   // raastPaymentTitleFetchByIBAN();
      // } else {
      //   // dispatch(
      //   //   ibftPayment(
      //   //     token,
      //   //     props.navigation,
      //   //     amount,
      //   //     transferFrom.account,
      //   //     beneficiaryObject.imd,
      //   //     purposeOfPayment.id,
      //   //     isDirectPayment
      //   //       ? accountNumber.toUpperCase()
      //   //       : beneficiaryObject?.benefAccount,
      //   //     isDirectPayment,
      //   //     {
      //   //       ...beneficiaryObject,
      //   //       ...transferFrom,
      //   //       amount,
      //   //       purposeOfPayment: purposeOfPayment.id,
      //   //       purposeOfPaymentString: purposeOfPayment.text,
      //   //     },
      //   //     purposeOfPayment.text,
      //   //     (routedObject_, responseObject) => {
      //   //       setResponseData({
      //   //         title: routedObject_?.title,
      //   //         titleFetchAccount: accountNumber,
      //   //       });
      //   //       if (!responseObject?.benefExists) {
      //   //         updateFtPaymentObject({
      //   //           isDirectPayment: true,
      //   //           token: routedObject_?.token,
      //   //         });
      //   //         changeBenefAddition(true);
      //   //       } else {
      //   //         let newData = {...newDesignBenefFlowObject};
      //   //         newData.benefEmail = routedObject_?.benefEmail;
      //   //         newData.benefMobile = routedObject_?.benefMobileNumber;
      //   //         newData.benefAlias = routedObject_?.benefAlias;
      //   //         props?.navigation.navigate('InterBankFundTransferDetail');
      //   //       }
      //   //     },
      //   //   ),
      //   // );
      // }
    }
  };
  const accountNumberApi = async () => {
    updateFtPaymentObject({
      paymentType: 'raastTitleFetch2',
      narration: 'NBP RAAST PAYMENTS',
      paymentMethod: 'paybyaccount',
      accountNo: accountNumber,
    });
    try {
      dispatch(setLoader(true));
      const response = await postTokenCall(Service.titleFetch2, {
        amount: amount,
        idType: 'CNIC',
        idValue: acc_info.cnic,
        memberid: ibftPaymentConstant?.memberId,
        receiveriban: isDirectPayment
          ? accountNumber.toUpperCase()
          : ibftPaymentConstant?.benefAccount,
      });
      if (response?.data?.responseCode === '00') {
        setResponseData({
          title: response?.data?.data?.acctitle,
          titleFetchAccount: accountNumber,
          toTitle: response?.data?.data?.acctitle,
        });
        dispatch(setLoader(false));
        dispatch(updateSessionToken(response));

        let tempObj = {};
        tempObj.acctype = 'Account';
        tempObj.fee = '0';
        tempObj.title = response?.data?.data?.acctitle;
        tempObj.toTitle = response?.data?.data?.acctitle;
        tempObj.token = response?.data?.data?.token;
        tempObj.receiveriban = response?.data?.data?.iban;

        updateFtPaymentObject(tempObj);

        if (response?.data?.data?.benefExists == false) {
          changeBenefAddition(true);
        } else {
          let tempObj = {};
          tempObj.shortName = response?.data?.data?.benefAlias;
          tempObj.benefId = response?.data?.data?.benefId;
          tempObj.isDirectPayment = false;
          tempObj.benefEmail = response?.data?.data?.benefEmail;
          tempObj.benefPhone = response?.data?.data?.benefMobileNumber;
          tempObj.benefMobile = response?.data?.data?.benefMobileNumber;
          tempObj.token = response?.data?.data?.token;
          tempObj.receiveriban = response?.data?.data?.iban;
          tempObj.isPayBenef = true;
          updateFtPaymentObject(tempObj);
          props?.navigation.navigate('InterBankFundTransferDetail');
        }
      } else {
        dispatch(serviceResponseCheck(response, props.navigation));
      }
    } catch (error) {
      dispatch(catchError(error));
    }
  };
  const raastPaymentTitleFetchByIBAN = async () => {
    updateFtPaymentObject({
      paymentType: 'raastpaybyIBAN',
      narration: 'NBP RAAST PAYMENTS',
      paymentMethod: 'iban',
    });
    try {
      dispatch(setLoader(true));
      const response = await postTokenCall(Service.raastPayment, {
        amount: amount,
        idType: 'CNIC',
        idValue: acc_info.cnic,
        memberid: ibftPaymentConstant?.memberId,
        receiveriban: isDirectPayment
          ? accountNumber.toUpperCase()
          : ibftPaymentConstant?.benefAccount,
      });
      if (response?.data?.responseCode === '00') {
        let tempObj = {};
        tempObj.acctype = 'Account';
        tempObj.fee = '0';
        tempObj.toTitle = response?.data?.data?.acctitle;
        tempObj.token = response?.data?.data?.token;
        tempObj.title = response?.data?.data?.acctitle;
        tempObj.receiveriban = accountNumber;
        updateFtPaymentObject(tempObj);
        setResponseData({
          title: response?.data?.data?.acctitle,
          titleFetchAccount: accountNumber,
        });
        // (titleFetchReqObject.titleFetchAccount = isDirectPayment ? accountNumber.toUpperCase() : beneficiaryObject?.benefAccount,
        dispatch(setLoader(false));
        dispatch(updateSessionToken(response));
        logs.log('91280831203', response?.data);
        if (response?.data?.data?.benefExists == false) {
          changeBenefAddition(true);
        } else {
          logs.log('988797897-------->');
          if (response?.data?.data?.benefAlias) {
            let tempObj = {};
            tempObj.shortName = response?.data?.data?.benefAlias;
            tempObj.benefId = response?.data?.data?.benefId;
            tempObj.isDirectPayment = false;
            tempObj.benefEmail = response?.data?.data?.benefEmail;
            tempObj.benefPhone = response?.data?.data?.benefMobileNumber;
            tempObj.benefMobile = response?.data?.data?.benefMobileNumber;
            tempObj.title = response?.data?.data?.acctitle;
            tempObj.toTitle = response?.data?.data?.acctitle;
            tempObj.receiveriban = accountNumber;
            tempObj.isPayBenef = true;
            updateFtPaymentObject(tempObj);
          }

          props?.navigation.navigate('InterBankFundTransferDetail');
        }
      } else {
        dispatch(serviceResponseCheck(response, props.navigation));
      }
    } catch (error) {
      dispatch(catchError(error));
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
              : transferFrom?.account
              ? transferFrom?.account
              : transferFrom?.account
          }
          tabHeadingColor={
            Object.keys(transferFrom).length === 0
              ? Colors.whiteColor
              : Colors.grey
          }
          tabHeading={
            Object.keys(transferFrom).length === 0
              ? 'Account Number'
              : transferFrom?.accountType
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
            accounts.length == 1 ? null : onHandleMultiAcc();
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
            ? purposeOfPayment.text
            : purposeOfPayment.purpose
        }
        text={
          Object.keys(purposeOfPayment).length === 0
            ? 'Tap here to select an option'
            : purposeOfPayment.text
            ? purposeOfPayment.text
            : purposeOfPayment.purpose
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
          // logs.log('Purpose of payment', item);
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

  const onHandleMultiAcc = () => {
    changeModalState(true);
    setTransferFrom({});
    changeCurrentModal('transferFrom');
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
          {!isDirectPayment ? (
            <CustomTextField
              textHeading={ibftPaymentConstant?.benefAlias}
              placeholder={'Enter Account or IBAN Number'}
              accessibilityLabel="Enter Amount"
              text_input={accountNumber}
              fontSize={isALIAS ? wp(4) : wp(3.6)}
              editable={false}
              onSubmitEditing={() => {}}
              returnKeyType={'next'}
              onChangeText={(value) => {}}
              maxLength={24}
              width={wp(74)}
              // keyboardType={'default'}
            />
          ) : (
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
              text_input={accountNumber}
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
          )}

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
                if (isRaastSelected) {
                  getRaastBeneficiaries();
                } else {
                  getBeneficiaries(2);
                }
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
                    if (isRaastSelected) {
                      getRaastBeneficiaries();
                    } else {
                      getBeneficiaries(2);
                    }
                    // dispatch(
                    //   getInterBankFundTransferData(
                    //     token,
                    //     props.navigation,
                    //     false,
                    //     false,
                    //     '',
                    //     () => {
                    //       changeTransferFundModalState(true);
                    //     },
                    //   ),
                    // );
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
  const RadioButton = () => {
    return (
      <View
        style={{
          flexDirection: 'row',
          marginVertical: hp(3),
          marginLeft: wp(4),
        }}>
        {/* Raast Radio Button */}
        <TouchableOpacity
          style={styles.button}
          onPress={() => {
            if (!isRaastBlocked) {
              handleSelect(true);
            }
          }}>
          <View
            style={{
              ...styles.circle,
              borderColor: isRaastSelected
                ? Colors.primary_green
                : isRaastBlocked
                ? Colors.grey
                : activeTheme?.isDarkTheme
                ? Colors.whiteColor
                : Colors.blackColor,
            }}>
            {isRaastSelected && <View style={styles.filledCircle} />}
          </View>
          <CustomText
            style={{
              ...styles.text,
              color: isRaastBlocked
                ? Colors.grey
                : activeTheme?.isDarkTheme
                ? Colors.whiteColor
                : Colors.blackColor,
            }}
            boldFont={isRaastSelected ? true : false}>
            Raast
          </CustomText>
        </TouchableOpacity>

        {/* 1 LINK Radio Button */}
        <TouchableOpacity
          style={styles.button}
          onPress={() => {
            if (!is1LinkBlocked) {
              handleSelect(false);
            }
          }}>
          <View
            style={{
              ...styles.circle,
              borderColor:
                isRaastSelected === false
                  ? Colors.primary_green
                  : is1LinkBlocked
                  ? Colors.grey
                  : activeTheme?.isDarkTheme
                  ? Colors.whiteColor
                  : Colors.blackColor,
            }}>
            {isRaastSelected === false && <View style={styles.filledCircle} />}
          </View>
          <CustomText
            style={{
              ...styles.text,
              color: is1LinkBlocked
                ? Colors.grey
                : activeTheme?.isDarkTheme
                ? Colors.whiteColor
                : Colors.blackColor,
            }}
            boldFont={isRaastSelected ? false : true}>
            1 LINK
          </CustomText>
        </TouchableOpacity>
      </View>
    );
  };

  const handleSelect = (option) => {
    if (option) {
      setIsRaastSelected(option);
      logs.log('option', option);
      setTitleFetch2(true);
      changePurposeOfPayment(RAAST_PURPOSE_OF_PAYMENT_LIST[12]);
    } else {
      setIsRaastSelected(option);
      logs.log('option', option);
      setTitleFetch2(false);
      setRaastPaymentIBAN(false);
      changePurposeOfPayment(IBFT_PURPOSE_OF_PAYMENT_LIST[12]);
    }
  };

  return (
    <View style={[styles.container, {backgroundColor: Colors.backgroundColor}]}>
      <SubHeader
        title={'Transfer to IBAN/Account No'}
        description={'Transfer funds to other bank accounts'}
        navigation={props.navigation}
        headerFont={wp(5)}
      />
      <ScrollView contentContainerStyle={globalStyling.scrollContent}>
        <View style={{flex: 1}}>
          <View style={{height: wp(1)}}></View>
          {fromComp()}
          <CustomText style={styles.text}>To</CustomText>
          {RadioButton()}
          {selectBank()}
          {popComp()}
          <View style={{height: wp(1)}}></View>
          {accountBenefComp()}
          <View style={{height: hp(1)}}></View>
          {amountComp()}
          <View style={{height: hp(1)}}></View>
          {logs.log('FromAccount----', transferFrom.account)}
          {logs.log('ibftPaymentConstant?.benefType----', ibftPaymentConstant)}
          {logs.log(
            'ibftPaymentConstant?.benefID----',
            ibftPaymentConstant?.benefID,
          )}
          {ibftPaymentConstant?.isDirectPayment ? null : (
            <RecentTransaction
              navigation={props.navigation}
              AccountType={
                ibftPaymentConstant?.benefType == '2' ||
                ibftPaymentConstant?.benefID == '2'
                  ? 'IBFT'
                  : ibftPaymentConstant?.benefType == '17' ||
                    ibftPaymentConstant?.benefID == '17'
                  ? 'RAAST_PAYMENT'
                  : ibftPaymentConstant?.benefType == '18' ||
                    ibftPaymentConstant?.benefID == '18'
                  ? 'RAAST_BY_ALIAS'
                  : 'IBFT'
              }
              FromAccount={
                ibftPaymentConstant?.benefType == '2' ||
                ibftPaymentConstant?.benefID == '2'
                  ? transferFrom?.account
                  : ibftPaymentConstant?.benefType == '17' ||
                    ibftPaymentConstant?.benefID == '17'
                  ? transferFrom?.iban
                  : ibftPaymentConstant?.benefType == '18' ||
                    ibftPaymentConstant?.benefID == '18'
                  ? transferFrom?.iban
                  : transferFrom?.account
              }
              // FromAccount={transferFrom?.account}
              ToAccount={accountNumber}
              ToAccountname={beneficiaryObject?.benefAlias}
            />
          )}
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
            currentModal === 'transferFrom'
              ? accounts
              : currentModal === 'others'
              ? IBFT_PURPOSE_OF_PAYMENT_LIST
              : [
                  {id: 71, text: 'Beneficiary List'},
                  {id: 72, text: 'Other Account'},
                ]
          }
          accounts={currentModal === 'transferFrom' ? true : false}
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
            logs.log('askdjasdad', ibftPaymentConstant);
            props?.navigation.navigate('BenefAdditionTransfer', {
              data: responseData,
              fromScreen: fromScreen,
            });
            changeBenefAddition(false);
          }}
          onPressNo={() => {
            changeBenefAddition(false);
            // if (fromScreen==='raastIBAN'){}
            props?.navigation.navigate('InterBankFundTransferDetail', {
              data: fromScreen,
            });
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
            logs.log('21897312', param);
            setDirectPaymentState(false);
            if (param?.benefType == '2') {
              setTitleFetch2(false);
              setRaastPaymentIBAN(false);
              setIsRaastSelected(false);
              setIsRaastBlocked(true);
              updateStates(param);
              setIbftPaymentConstant((prevState) => ({
                ...prevState,
                bankName: param?.companyName,
              }));
              updateFtPaymentObject({
                bankName: param?.companyName,
              });
            }
            if (param?.benefType == '17') {
              setTitleFetch2(false);
              setRaastPaymentIBAN(true);
              setIsRaastSelected(false);
              setis1LinkBlocked(true);
              setIsRaastSelected(true);
              const bankList = store.getState().reducers.bankList;
              const bankData = bankList.filter(
                (bank) => bank.participantCode === param?.imd,
              );
              changeTransferFundsTo(bankData[0]?.name);
              setIbftPaymentConstant((prevState) => ({
                ...prevState,
                bankName: bankData[0]?.name,
              }));
              updateFtPaymentObject({
                bankName: bankData[0]?.name,
              });
              updateStates(param);
            }
            if (param?.benefType == '18') {
              const bankList = store.getState().reducers.bankList;
              const bankData = bankList.filter(
                (bank) => bank.participantCode === param?.imd,
              );
              logs.log('012903120301290', bankData[0]);
              setTitleFetch2(true);
              setRaastPaymentIBAN(false);
              setIsRaastSelected(false);
              setis1LinkBlocked(true);
              setIsRaastSelected(true);
              changeTransferFundsTo(bankData[0]?.name);
              setAccountNumber(param?.benefAccount);
              setIbftPaymentConstant((prevState) => ({
                ...prevState,
                benefAlias: param?.benefAlias,
                bankName: bankData[0]?.name,
                isDirectPayment: false,
                isPayBenef: true,
                benefEmail: param?.benefEmail,
                benefPhone: param?.benefMobile,
                benefMobile: param?.benefMobile,
                tfenable: false,
                benefAccount: param?.benefAccount,
                imd: param?.imd,
                benefType: param?.benefType,
              }));
              updateFtPaymentObject({
                benefAlias: param?.benefAlias,
                bankName: bankData[0]?.name,
                isDirectPayment: false,
                isPayBenef: true,
                benefEmail: param?.benefEmail,
                benefPhone: param?.benefMobile,
                benefMobile: param?.benefMobile,
                tfenable: false,
                benefAccount: param?.benefAccount,
                imd: param?.imd,
                benefType: param?.benefType,
              });
            }
            changeTransferFundModalState(false);

            // let newBenefObject = {
            //   ...param,
            //   bankName: param.companyName,
            //   toAccount: param.benefAccount,
            // };
            // delete newBenefObject.companyName;
            // delete newBenefObject.benefAccount;
            // setDirectPaymentState(false);
            // setBeneficiaryObject(param);
            // changeTransferFundsTo(
            //   `${param.benefAlias} - ${param?.benefAccount}`,
            // );
            // changeTransferFundModalState(!transferFundModalState);
          }}
        />
      </ScrollView>
      <View style={{marginRight: wp(4)}}>
        <InformationIcon
          noAbs={true}
          onPress={() => {
            logs.log('testing');
            dispatch(
              helpInforamtion({
                title: 'Transfers',
                page: 'newIBFT',
                state: true,
              }),
            );
          }}
        />
      </View>
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
