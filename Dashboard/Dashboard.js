import React, {
  useCallback,
  useEffect,
  useState,
  useRef,
  useContext,
} from 'react';
import {
  View,
  Image,
  Text,
  ScrollView,
  ImageBackground,
  BackHandler,
  PermissionsAndroid,
  Platform,
  Alert,
  ActivityIndicator,
  FlatList,
  Dimensions,
  TextInput,
  // Share,
} from 'react-native';
import {CommonActions} from '@react-navigation/native';
import CustomModal from '../../Components/CustomModal/CustomModal';
import {TouchableOpacity} from 'react-native-gesture-handler';
import Clipboard from '@react-native-community/clipboard';
import Share from 'react-native-share';
import {TouchableOpacity1} from 'react-native-gesture-handler';
import CustomBtn from '../../Components/Custom_btn/Custom_btn';
import styles from './DashboardStyle';
import GlobalHeader from '../../Components/GlobalHeader/GlobalHeader';
import {Images, Colors} from '../../Theme';

import {
  Config,
  huaweimessage,
  ishuawei,
  logs,
  isRAAST,
  showRAASTPayments,
  isUatEnvironment,
  benefType,
  QRonDashboard,
} from '../../Config/Config';
import CustomAlert from '../../Components/Custom_Alert/CustomAlert';
import IonIcons from 'react-native-vector-icons/Ionicons';
import Entypo from 'react-native-vector-icons/Entypo';
import Feather from 'react-native-vector-icons/Feather';

import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import SplashScreen from 'react-native-splash-screen';
import {useSelector, useDispatch} from 'react-redux';
import {currencyFormat, globalStyling, hp, wp} from '../../Constant';
import analytics from '@react-native-firebase/analytics';
import {
  logOutOfAccount,
  mobileTopUp,
  getDashboardData,
  setCurrentFlow,
  changeOnceVirtualCardAlertSessionState,
  all_benef_pay,
  changeGlobalAlertState,
  getVirtualCardMpin,
  getVirtualCardStatus,
  setCurrentNavigation,
  setQrScannerState,
  agreeToAddVirtualCard,
  changeOnceVirtualCardAlertState,
  setIsLoginState,
  getAccounts,
  setAppAlert,
  catchError,
  serviceResponseCheck,
  setToken,
  setUserObject,
  setLoader,
  functionSetKeyChainObject,
  getRaastAccounts,
  updateSessionToken,
  getRAASTID,
  setKeyChainObject,
  getOtherPayments,
  getraastbanklist,
  getOverViewData,
  setViewAccountsData,
  setOverViewData,
  closeGlobalAlertState,
  changeGlobalIconAlertState,
  updateAccountTitle,
} from '../../Redux/Action/Action';
import Modal from 'react-native-modal';
import RAASTModal from '../../Components/RAASTModal/RAASTModal';
import {useFocusEffect} from '@react-navigation/native';
import Geolocation from 'react-native-geolocation-service';
import axios from 'axios';
import store from '../../Redux/Store/Store';
import {getTokenCall, Service, postTokenCall} from '../../Config/Service';
import {TouchableHighlight} from 'react-native';
import CustomText from '../../Components/CustomText/CustomText';
import color from 'color';
import {Message} from '../../Constant/Messages';
import {maskedAccount} from '../../Helpers/Helper';
import {useTheme} from '../../Theme/ThemeManager';
import I18n from '../../Config/Language/LocalizeLanguageString';
import {FakeCurrencyInput} from 'react-native-currency-input';
import {log} from 'react-native-reanimated';
import NewView from '../../Components/NewView';

import {useNotification} from '../Context/index';
const Dashboard = React.memo((props) => {
  const {notificationScreen, nullifyObject} = useNotification();

  const payNowData = notificationScreen;
  logs.log('notificationScreen3724982748923794------>', payNowData?.ucid);
  // logs.log('ucid9823749872------>', payNowData);

  const {activeTheme} = useTheme();

  const navigateTo = (objectString, benefType) => {
    props.navigation.navigate('OtherConsumers', {
      // props.navigation.navigate('OtherPaymentService', {
      data: {
        routeData: {data: objectString},
        isPayBenef: false,
        benefObject: '',
        benefType: benefType,
      },
    });
  };
  // ***** INITIALIZATION *****
  const data = [
    {id: 1, text: 'Account Details', code: 'Account001'},
    {id: 2, text: 'Raast QR', code: 'QR001'},
  ];
  const token = useSelector((state) => state.reducers.token);
  const overViewData = useSelector((state) => state.reducers.overViewData);
  const [proceedAlert, changeproceedAlert] = useState(false);
  const [navigateToNotification, setNavigateToNotification] = useState(
    props?.route?.data,
  );

  const [alwaysClose, changeAlwaysClose] = useState(false);
  const [checkBoxRAAST, setCheckBoxRAAST] = useState(false);
  const [raastPopup, SetRaastPopup] = useState(false);

  const virtualCardAlertOnce = useSelector(
    (state) => state.reducers.virtualCardAlertOnce,
  );
  const [shareModal, setShareModal] = useState(false);
  const virtualCardAlertOnceAlertState = useSelector(
    (state) => state.reducers.virtualCardAlertOnceAlertState,
  );
  const languageRedux = useSelector(
    (state) => state.reducers?.Localiztion?.language?.languageCode,
  );
  // store.getState()?.reducers?.Localiztion?.language?.languageCode
  const cuurency = useSelector((state) => state.reducers.viewAccountsData);
  const filteredAccount =
    cuurency && cuurency instanceof Array && cuurency?.length > 0
      ? cuurency.filter((currency) => currency.isDefault == '1')
      : [];
  const [bvcCheck, setbvsCheck] = useState(false);
  const [bvcAlert, setBVSAlert] = useState(false);
  const dispatch = useDispatch();
  const [alerttext, set_alert_text] = useState('N/A');
  const [overlay_state, setOverlayState] = useState(false);
  const [isSelectionModeEnabled, disableSelectionMode] = useState(true);
  const virtualCardObject = useSelector(
    (state) => state.reducers.virtualCardObject,
  );
  const virtualCardStatus = useSelector(
    (state) => state.reducers.virtualCardStatus,
  );
  const loginResponse = useSelector((state) => state.reducers.loginResponse);
  const [mpinAlertState, setMpinAlertState] = useState(false);
  const [raastbanner, setraastbanner] = useState(false);

  const [noCardAlertState, setNoCardAlertState] = useState(false);
  const [showLogoutAlert, changeLogoutAlertState] = useState(false);
  const isUpgraded = useSelector((state) => state.reducers.upgradeRegister);
  const [balance_show, set_balance_show] = useState(true);
  const [showBalanceLoader, setShowBalanceLoader] = useState(false);
  const [balance, setBalance] = useState(false);
  const [naBalance, setNaBalance] = useState(false);
  const [fullScreenModal, setfullScreenModal] = useState(false);
  const [debitCardBanner, setDebitCardBannerState] = useState(false);
  const [floodReliefBanner, setFloodRelifBanner] = useState(false);
  const [languageChange, setLanguageChnage] = useState(false);
  // logs.log('8127391729371923791273921------->', loginResponse);
  // const [RAASTBanner,setRAASTBanner]
  // logs.log('overViewData', loginResponse.details?.mobile);
  // const keychainObject = useSelector((state) => state.reducers.keychainObject);
  const keychainObject = useSelector((state) => state.reducers.keychainObject);
  const userObject = useSelector((state) => state.reducers.userObject);
  const isL0Customer =
    userObject.customerLevel &&
    String(userObject.customerLevel).toUpperCase() == 'L0'
      ? false
      : String(userObject.customerLevel).toUpperCase() == 'L1'
      ? false
      : true;
  const isL1Customer =
    userObject.customerLevel &&
    String(userObject.customerLevel).toUpperCase() == 'L1'
      ? true
      : false;

  const scrollViewRef = useRef(null);
  const tabWidth = 200;
  const contentWidth = 5 * tabWidth; // Adjust tabWidth and the number of tabs
  const containerWidth = 3 * tabWidth; // Number of tabs to display at once
  const [showLeftArrow, setShowLeftArrow] = useState(false);
  const [showRightArrow, setShowRightArrow] = useState(true);
  const [newNoticationRecived, setNewNoticationRecived] = useState(true);

  useFocusEffect(
    useCallback(() => {
      const onBackPress = () => {
        if (isSelectionModeEnabled) {
          dispatch(changeGlobalAlertState(true, props.navigation));
          return true;
        } else {
          return false;
        }
      };

      BackHandler.addEventListener('hardwareBackPress', onBackPress);
      return () =>
        BackHandler.removeEventListener('hardwareBackPress', onBackPress);
    }, [isSelectionModeEnabled, disableSelectionMode]),
  );

  const fee = parseFloat('1');
  const amount = parseFloat(`${payNowData?.amountInfo?.instructedAmount}`);
  const formattedFee = fee.toFixed(2);
  const formattedAmount = amount.toFixed(2);
  const inputDateString = payNowData?.paymentInfo?.rtpExpiryDateTime;

  // Extract year, month, and day from the input string
  const year = inputDateString?.substring(0, 4);
  const month = inputDateString?.substring(4, 6);
  const day = inputDateString?.substring(6, 8);
  const formattedDate = `${year}${month}${day}`;

  const payLaterObject = {
    senderIban: payNowData?.senderInfo?.iban,
    senderAccountTitle: payNowData?.senderInfo?.accountTitle,
    merchantIban: payNowData?.merchantInfo?.iban,
    merchantAccountTitle: payNowData?.merchantInfo?.accountTitle,
    merchantDba: payNowData?.merchantInfo?.dba,
    merchantMemberId: payNowData?.merchantInfo?.memberId,
    merchantAlias: payNowData?.merchantInfo?.merchantAlias
      ? payNowData?.merchantInfo?.merchantAlias
      : '',
    // fee: formattedFee,
    amount: formattedAmount,
    currency: payNowData?.additionalInfo?.currency,
    country: 'PK',
    billNumber: payNowData?.additionalInfo?.billNumber,
    billDueDate: formattedDate,
    billDueDate: payNowData?.paymentInfo?.rtpExpiryDateTime.substring(0, 8),
    dateTime: '',
    amountAfterDueDate: payNowData?.additionalInfo?.amountAfterDueDate
      ? payNowData?.additionalInfo?.amountAfterDueDate
      : '',
    loyaltyNumber: '',
    storeLabel: '',
    customerLabel: '',
    terminalId: payNowData?.additionalInfo?.terminalId,
    paymentPurpose: '',
    merchantTaxId: payNowData?.additionalInfo?.merchantTaxId,
    merchantChannel: payNowData?.additionalInfo?.merchantChannel,
    rtpId: payNowData?.additionalInfo?.rtpId,
    rtpExpiryDateTime: payNowData?.paymentInfo?.rtpExpiryDateTime,
    rtpExecutionDateTime: payNowData?.paymentInfo?.rtpExecutionDateTime,
    ttc: payNowData?.additionalInfo?.ttc,
    customerEmail: '',
    customerMobile: '',
    customerAddress: '',
    referenceLabel: '',
    r1: 'r1',
    r2: 'r2',
    r3: 'r3',
    r4: 'r4',
    r5: 'r5',
    // mpin: mpin,
    schemeId: '01',
  };
  const payNowObject = {
    senderIban: payNowData?.senderInfo?.iban,
    senderAccountTitle: payNowData?.senderInfo?.accountTitle,
    merchantIban: payNowData?.merchantInfo?.iban,
    merchantAccountTitle: payNowData?.merchantInfo?.accountTitle,
    merchantDba: payNowData?.merchantInfo?.dba,
    merchantMemberId: payNowData?.merchantInfo?.memberId,
    merchantAlias: payNowData?.merchantInfo?.merchantAlias
      ? payNowData?.merchantInfo?.merchantAlias
      : '',
    // fee: formattedFee,
    amount: formattedAmount,
    currency: payNowData?.additionalInfo?.currency,
    country: 'PK',
    billNumber: payNowData?.additionalInfo?.billNumber,
    billDueDate: payNowData?.paymentInfo?.rtpExpiryDateTime.substring(0, 8),
    dateTime: '',
    // amountAfterDueDate: payNowData?.additionalInfo?.amountAfterDueDate,
    loyaltyNumber: '',
    storeLabel: '',
    customerLabel: '',
    terminalId: payNowData?.additionalInfo?.terminalId,
    paymentPurpose: '',
    merchantTaxId: payNowData?.additionalInfo?.merchantTaxId,
    merchantChannel: payNowData?.additionalInfo?.merchantChannel,
    rtpId: payNowData?.additionalInfo?.rtpId,
    rtpExpiryDateTime: payNowData?.paymentInfo?.rtpExpiryDateTime,
    rtpExecutionDateTime: payNowData?.paymentInfo?.rtpExecutionDateTime,
    ttc: payNowData?.additionalInfo?.ttc,
    customerEmail: '',
    customerMobile: '',
    customerAddress: '',
    referenceLabel: '',
    r1: 'r1',
    r2: 'r2',
    r3: 'r3',
    r4: 'r4',
    r5: 'r5',
    // mpin: mpin,
    schemeId: '01',
  };

  useEffect(() => {
    setLanguageChnage(true);
  }, [languageRedux]);
  useEffect(() => {
    props.navigation.addListener('focus', () => {
      async function analyticsLog() {
        await analytics().logEvent('DashboardScreen');
      }
      analyticsLog();

      console.log(
        'loginResponse?.details?.totalNotificationCount////',
        loginResponse?.details?.totalNotificationCount,
        'store.getState().reducers.keychainObject?.KeyChain_totalNotificationCount////',
        store.getState().reducers.keychainObject
          ?.KeyChain_totalNotificationCount,
      );
      if (
        loginResponse?.details?.totalNotificationCount === 0
          ? null
          : store.getState().reducers.keychainObject
              ?.KeyChain_totalNotificationCount &&
            loginResponse?.details?.totalNotificationCount &&
            loginResponse?.details?.totalNotificationCount <=
              store.getState().reducers.keychainObject
                ?.KeyChain_totalNotificationCount
      ) {
        setNewNoticationRecived(true);
      } else {
        setNewNoticationRecived(false);
      }
      // if (store.getState().reducers?.userObject?.bvsCheck) {
      //   // setBVSAlert(true);
      //   props?.navigation.navigate('TermsConditionBVS');
      // }
      console.log('setNewNoticationRecived', newNoticationRecived);

      setBalance(false);
      setShowBalanceLoader(false);
      setfullScreenModal(false);
      dispatch(setCurrentFlow('Dashboard'));
      dispatch(setIsLoginState(true));
      dispatch(setCurrentNavigation(props.navigation));
      // newDashboardCall();
      dispatch(
        setUserObject({
          ftPayment: {},
        }),
      );
      dispatch(
        getDashboardData(
          props.navigattion,
          () => {
            logs.log('in siode success of parsed credential');
            newDashboardCall();
          },
          () => {
            logs.log('inside of the succes of call of update token');
            newDashboardCall();
          },
          () => {
            logs.log('Notthing Happen=====>');
            newDashboardCall();
          },
        ),
      );

      dispatch(getVirtualCardMpin());
      dispatch(getVirtualCardStatus());
      let duration = Platform.OS === 'android' ? 1000 : 2000;

      setTimeout(() => SplashScreen.hide(), duration);
    });
  }, []);

  const BillIntimation = () => {
    // setTimeout(() => {
    payNowData?.consumerNo || payNowData?.ucid
      ? getBillTitleFetch(
          payNowData?.ucid,
          payNowData?.consumerNo,
          payNowData?.beneficiaryType,
          payNowData?.companyName,
          payNowData?.benefID,
        )
      : logs.log(
          'Notification not valid',
          payNowData?.ucid,
          'UCID',
          payNowData?.consumerNo,
          'consumerNo',
        );
    // }, 2000);
  };

  const raastRegister = async () => {
    dispatch(setCurrentFlow('Raast'));
    try {
      dispatch(setLoader(true));
      // `${Config.base_url.UAT_URL}${Config.method.raast}/${Config.method.registration}/${Config.endpoint.onestepregistation}`,
      const response = await postTokenCall(Service.oneStepRegistration, {
        aliasType: 'MOBILE',
        aliasValue: loginResponse?.details?.mobile,
        iban: loginResponse?.details?.ibanNo,
        idType: 'CNIC',
        idValue: store.getState().reducers.overViewData?.data?.accounts?.cnic,
      });

      logs.logResponse(response);
      logs.logResponse(response?.data);
      dispatch(updateSessionToken(response));
      if (response?.data?.responseCode === '00') {
        dispatch(
          changeGlobalIconAlertState(true, props.navigation, {
            message: `Dear ${
              loginResponse?.details?.accountTitle
            }, Your RAAST ID ${
              loginResponse?.details?.mobile
            } has been Registered and Linked successfully with IBAN
            ${maskedAccount(
              loginResponse?.details?.ibanNo,
            )}. For further assistance, please call NBP HelpLine
            021-111-627-627`,
            successAlert: true,
            onPressOk: () => {
              logs.log('chalya ok 1 ');
              changeGlobalIconAlertState(false);
              accountsCall();
            },
          }),
        );

        dispatch(setLoader(false));
      } else if (response?.data?.responseCode === '02') {
        logs.log('chalya ok 2 ');
        dispatch(serviceResponseCheck(response, props.navigation));
        dispatch(setCurrentFlow('Dashboard'));
        BillIntimation();
      } else {
        dispatch(serviceResponseCheck(response, props.navigation));
        BillIntimation();
        logs.log('chalya ok 3 ');
      }
    } catch (error) {
      dispatch(catchError(error));
    }
  };
  const bvsStatusChange = async () => {
    // console.log('ameer............');
    try {
      dispatch(setLoader(true));
      const response = await postTokenCall(Service.changeBvsStatusChange, {});
      if (response.status === 200 && response?.data?.responseCode === '00') {
        console.log('response.data......', response);
        dispatch(updateSessionToken(response));
        dispatch(setUserObject({bvsCheck: false}));
      } else {
        dispatch(serviceResponseCheck(response, props.navigation));
      }
      dispatch(setLoader(false));
    } catch (error) {
      // logs.log("Udhar ki phatti")
      dispatch(catchError(error));
    }
  };
  //asmnbdasd
  const hideDebitCardBanner = () => {
    setDebitCardBannerState(false);
    logs.log('Debit Card State------', debitCardBanner);
    payNowData?.additionalInfo?.rtpId ? rtplResquest(payNowData) : null;
    dispatch(
      setUserObject({
        isRaastBannerState: false,
      }),
    );
    if (checkBoxRAAST) {
      dispatch(
        setKeyChainObject({
          showRaastBannerPermanent: false,
        }),
      );
    }
  };
  const share = async (body) => {
    try {
      await Share.open(body);
    } catch (err) {
      // console.log(err);
    }
  };
  const onSuccessRAASTID = async () => {
    logs.log('onSuccessRAASTID', loginResponse?.details?.accountTitle);
    let body = {
      title: 'ACCOUNT DETAILS',
      url: ``,
      message: `Bank Name: National Bank Of Pakistan\nAccount Title: ${
        loginResponse?.details?.accountTitle
      }\nIBAN: ${loginResponse?.details?.ibanNo}\nRAAST ID: ${
        loginResponse?.details?.mobile
      }\nAccount Number: ${loginResponse?.details?.account}${
        loginResponse?.details?.branchName
          ? `\nBranch Name: ${loginResponse?.details?.branchName}`
          : ''
      }\nBranch Code: ${loginResponse?.details?.branchCode}`,
    };
    await share(body);
    Clipboard.setString(
      `Bank Name: National Bank Of Pakistan\nAccount Title: ${
        loginResponse?.details?.accountTitle
      }\nIBAN: ${loginResponse?.details?.ibanNo}\nRAAST ID: ${
        loginResponse?.details?.mobile
      }\nAccount Number: ${loginResponse?.details?.account}${
        loginResponse?.details?.branchName
          ? `\nBranch Name: ${loginResponse?.details?.branchName}`
          : ''
      }\nBranch Code: ${loginResponse?.details?.branchCode}`,
    );
  };
  const onFaliureRAASTID = async () => {
    logs.log('onFaliureRAASTID', loginResponse?.details?.accountTitle);

    let body = {
      title: 'ACCOUNT DETAILS',
      url: ``,
      message: `Bank Name: National Bank Of Pakistan\nAccount Title: ${
        loginResponse?.details?.accountTitle
      }\nIBAN: ${loginResponse?.details?.ibanNo}\nRAAST ID: ${
        loginResponse?.details?.mobile
      }\nAccount Number: ${loginResponse?.details?.account}${
        loginResponse?.details?.branchName
          ? `\nBranch Name: ${loginResponse?.details?.branchName}`
          : ''
      }\nBranch Code: ${loginResponse?.details?.branchCode}`,
    };
    await share(body);
    Clipboard.setString(
      `Bank Name: National Bank Of Pakistan\nAccount Title: ${
        loginResponse?.details?.accountTitle
      }\nIBAN: ${loginResponse?.details?.ibanNo}\nRAAST ID: ${
        loginResponse?.details?.mobile
      }\nAccount Number: ${loginResponse?.details?.account}${
        loginResponse?.details?.branchName
          ? `\nBranch Name: ${loginResponse?.details?.branchName}`
          : ''
      }\nBranch Code: ${loginResponse?.details?.branchCode}`,
    );
  };
  const getDefaultAccountByAlias = async (isOnlyIban) => {
    let body = {
      aliasType: 'MOBILE',
      aliasValue: loginResponse?.details?.mobile,
      amount: '0',
      iban: loginResponse?.details?.ibanNo,
    };
    let onlyIBAN = {
      iban: loginResponse?.details?.ibanNo,
    };
    logs.log('body', isOnlyIban ? onlyIBAN : body);
    dispatch(
      getRAASTID(props.navigation, body, onSuccessRAASTID, onFaliureRAASTID),
    );
  };
  const newDashboardCall = async () => {
    logs.log(
      'store.getState().reducers.viewAccountsData',
      store.getState().reducers.viewAccountsData,
      'Object.keys(store.getState().reducers.viewAccountsData).length',
      Object.keys(store.getState().reducers.viewAccountsData).length,
      'Object.keys(store.getState().reducers.overViewData).length',
      Object.keys(store.getState().reducers.overViewData).length,
      'store.getState().reducers.overViewData',
      store.getState().reducers.overViewData,
    );

    // store.getState().reducers.viewAccountsData
    if (
      Object.keys(store.getState().reducers.viewAccountsData).length === 0 ||
      store.getState().reducers.isDashboardCall === true
    ) {
      generalpkrAccountCall();
    }
  };

  // const rtplResquest = (payNowData) => {
  //   setTimeout(() => {
  //     if (payNowData?.additionalInfo?.rtpId) {
  //       const {paymentInfo} = payNowData;
  //       if (paymentInfo && paymentInfo?.rtpType === 'LATER') {
  //         props.navigation.navigate('RTPConfirmDetails', {
  //           payLater: payLaterObject,
  //         });
  //       } else {
  //         props.navigation.navigate('RTPConfirmDetails', {
  //           payNow: payNowObject,
  //         });
  //       }
  //     } else {
  //       console.log('paymentData object is null or undefined');
  //     }
  //     // // nullifyObject();
  //   }, 1000);
  // };

  const rtplResquest = (payNowData) => {
    if (payNowData?.additionalInfo?.rtpId) {
      const {paymentInfo} = payNowData;
      if (paymentInfo && paymentInfo?.rtpType === 'LATER') {
        props.navigation.navigate('RTPConfirmDetails', {
          payLater: payLaterObject,
        });
      } else {
        props.navigation.navigate('RTPConfirmDetails', {
          payNow: payNowObject,
        });
      }
    } else {
      console.log('paymentData object is null or undefined');
    }
    // // nullifyObject();
  };

  const overViewCall = async () => {
    try {
      dispatch(setLoader(true));
      const response = await getTokenCall(Service.getOverViewWithoutBalance);
      if (response.data.responseCode === '00') {
        response?.data?.data?.accounts?.raastPopup === false;
        if (payNowData?.additionalInfo?.rtpId) {
          rtplResquest(payNowData);
          // setTimeout(() => {
          //   rtplResquest(payNowData);
          // }, 2000);
        } else {
          BillIntimation();
        }

        logs.log(
          'asdasdahjsgdhjasd======>',
          response?.data?.data?.accounts?.raastPopup,
        );
        // SetRaastPopup(response?.data?.data?.accounts?.raastPopup)
        dispatch(setLoader(false));
        dispatch(setOverViewData(response.data));
        dispatch(updateSessionToken(response));
        if (
          loginResponse?.details?.bvsStatus === false &&
          loginResponse?.details?.customerConsent === false
        ) {
          // setBVSAlert(true);
          dispatch(setUserObject({bvsCheck: true}));
          dispatch(
            setAppAlert(
              'Biometric Verification of your account is not found due to which you have limited access to transactions. Please visit NBP Branch to update your Biometric records. Login and upgrade your registration once your record is updated.',
              '',
              props.navigation,
            ),
          );
        } else if (loginResponse?.details?.customerConsent === false) {
          props?.navigation.navigate('TermsConditionBVS');
          dispatch(setUserObject({bvsCheck: true}));
        } else {
          dispatch(setUserObject({bvsCheck: true}));
          if (response?.data?.data?.accounts?.raastPopup) {
            if (keychainObject?.showRaastBannerPermanent == false) {
              logs.log('here');
              setDebitCardBannerState(false);
              payNowData?.additionalInfo?.rtpId
                ? rtplResquest(payNowData)
                : BillIntimation();
            } else {
              logs.log('here2');
              // setDebitCardBannerState(true);
              payNowData !== 'SomeValue'
                ? setDebitCardBannerState(false)
                : setDebitCardBannerState(true);
            }
          } else {
            logs.log('here3');
            logs.log('UseEffect-2 Triggered');
            payNowData?.rtpId ? rtplResquest(payNowData) : null;
            setDebitCardBannerState(false);
          }
        }
      } else {
        dispatch(serviceResponseCheck(response, props.navigation));
        dispatch(catchError(response));
      }
    } catch (error) {
      dispatch(setLoader(false));
      logs.log(`screen crash error : ${JSON.stringify(error)}`);
      dispatch(catchError(error));
    }
  };

  const accountsCall = async () => {
    try {
      dispatch(setLoader(true));
      const response = await getTokenCall(Service.getAccounts);
      if (response.data.responseCode === '00') {
        logs.log('accountsCall=====>', response.data.data.accounts);
        dispatch(setViewAccountsData(response.data.data.accounts));
        dispatch(setLoader(false));
        dispatch(updateSessionToken(response));
        // BillIntimation();

        if (
          Object.keys(store.getState().reducers.overViewData).length === 0 ||
          store.getState().reducers.isDashboardCall === true
        ) {
          overViewCall();
        }
      } else {
        dispatch(serviceResponseCheck(response, props.navigation));
        dispatch(catchError(response));
      }
    } catch (error) {
      dispatch(setLoader(false));
      logs.log(`screen crash error : ${JSON.stringify(error)}`);
      dispatch(catchError(error));
    }
  };
  const generalpkrAccountCall = async () => {
    logs.log('lag gai');
    try {
      dispatch(setLoader(true));
      const response = await getTokenCall(Service.getPkrAccounts);
      const responseData = response.data;
      logs.logResponse(responseData);
      if (response.data.responseCode === '00') {
        dispatch(setLoader(false));
        dispatch(updateSessionToken(response));
        dispatch(
          setUserObject({
            pkAccounts: response?.data?.data?.accounts,
          }),
        );
        accountsCall();
      } else {
        dispatch(serviceResponseCheck(response, props.navigation));
      }
    } catch (error) {
      dispatch(setLoader(false));

      logs.log(`screen crash error : ${JSON.stringify(error)}`);
      dispatch(catchError(error));
    }
  };
  const hideFloodReliefBanner = () => {
    setFloodRelifBanner(false);
    dispatch(
      setUserObject({
        isEmployeeBannerState: false,
      }),
    );
    // dispatch(functionSetKeyChainObject({DebitCardBannerState: true}));
  };
  // SHOW BALANCE ENQUIRY
  const setShowBalanceHandling = () => {
    setShowBalanceLoader(true);
    setfullScreenModal(true);
    const acc_no = cuurency;
    const filtererd_acc = acc_no.filter((item) => item.isDefault == '1');
    logs.log(filtererd_acc);
    logs.log(`acc_no ${JSON.stringify(acc_no)}`);
    logs.logRequest(
      `${Config.base_url.UAT_URL}${Config.method.my}/${Config.endpoint.balanceenquiry}?accountNumber=${filtererd_acc[0]?.account}`,
    );
    axios
      .get(
        `${Config.base_url.UAT_URL}${Config.method.my}/${Config.endpoint.balanceenquiry}?accountNumber=${filtererd_acc[0]?.account}`,
        {
          channel: `${Config.channel.channel}`,

          headers: {
            'X-Auth-Token': store.getState().reducers.token,
          },
        },
      )
      .then((response) => {
        logs.logResponse(response.data);
        if (response.status === 200 && response.data.responseCode === '00') {
          if (response?.headers?.['x-auth-next-token']) {
            dispatch(setToken(response?.headers?.['x-auth-next-token']));
          }
          logs.log('balance', response.data?.data);
          if (response.data?.data == 'N/A') {
            setNaBalance(true);
          }
          setBalance(response.data?.data);
          setShowBalanceLoader(false);
          setfullScreenModal(false);
        } else {
          setShowBalanceLoader(false);
          setfullScreenModal(false);

          setBalance(false);
          dispatch(serviceResponseCheck(response, props.navigation));
        }
      })
      .catch((error) => {
        setShowBalanceLoader(false);
        setfullScreenModal(false);

        setBalance(false);
        logs.logResponse(`Balance Inquiry Error : ${error}`);
        dispatch(catchError(error));
      });
  };
  const getpkrAccounts = async (code) => {
    code === 'QR001'
      ? props.navigation.navigate('RecieveMoneyRAAST', {
          fromShareModal: true,
        })
      : props.navigation.navigate('oneStepReg', {
          screen: 'Register',
        });
  };
  const getpkrAccountsforRAAST = async () => {
    if (isL0Customer) {
      dispatch(
        getraastbanklist(props.navigation, () => {
          props.navigation.navigate('RecieveMoneyRAAST');
        }),
      );
    } else if (isL1Customer) {
      changeproceedAlert(true);
    } else {
      changeproceedAlert(true);
    }
  };
  const getcustomerdetails = (token) => {
    props.navigation.navigate('ShowCards');
  };
  // const getNotifications = async () => {
  //   logs.log('lag gai call');
  //   try {
  //     dispatch(setLoader(true));
  //     const response = await getTokenCall(
  //       Service.getNotifications,
  //       `page=1&size=10`,
  //     );
  //     logs.log('response---->', response);
  //     const responseData = response.data;
  //     logs.logResponse('yeh send karna hai', responseData);
  //     if (
  //       response.data.responseCode === '00' ||
  //       response.data.responseCode === '200'
  //     ) {
  //       logs.log(response?.data?.data);
  //       dispatch(updateSessionToken(response));
  //       dispatch(setLoader(false));
  //       dispatch(
  //         setUserObject({
  //           notifications: response?.data?.data?.notifications,
  //         }),
  //       );
  //       props.navigation.navigate('Appnotifications');
  //     } else {
  //       dispatch(serviceResponseCheck(response, props.navigation));
  //       dispatch(setLoader(false));
  //     }
  //   } catch (error) {
  //     dispatch(setLoader(false));
  //     logs.log(`screen crash error : ${JSON.stringify(error)}`);
  //     dispatch(catchError(error));
  //   }
  // };

  // ENDS SHOW BALANCE ENQUIRY
  // IMAGE SLIDER HOOK

  // SLIDER IMAGE END
  // console.log('-------------------', overViewData?.data?.accounts?.isEmployee);
  // console.log('-------------------', overViewData?.data?.accounts?.isEmployee);

  const type = overViewData.data?.accounts?.accountType
    ? String(overViewData.data?.accounts?.accountType).replace('-', ' ')
    : null;

  const shareButton = () => {
    return (
      <TouchableOpacity
        style={{alignSelf: 'flex-end', flexDirection: 'row'}}
        onPress={async () => {
          setShareModal(true);
          // getDefaultAccountByAlias(false);
        }}>
        <View
          style={{
            backgroundColor: '#252f37',
            borderRadius: wp(100),
            width: hp(4),
            height: hp(4),
            alignItems: 'center',
            justifyContent: 'center',
          }}>
          <Image
            source={
              Platform.OS == 'android'
                ? Images.androidShareDash
                : Images.iosShareDash
            }
            resizeMode={'contain'}
            style={{
              width: wp(3),
              height: wp(3),
              alignSelf: 'center',
            }}
          />
        </View>
      </TouchableOpacity>
    );
  };

  const [showTextInput, setShowTextInput] = useState(false);
  const [CustomerAlias, setCustomerAlias] = useState(
    loginResponse?.details?.alias,
  );
  const ref1 = useRef(null);
  const ref2 = useRef(null);

  const handlePress = () => {
    setShowTextInput((prev) => !prev);
  };
  const updateCustomerAlias = async () => {
    logs.log('updateCustomerAlias..............................');
    try {
      dispatch(setLoader(true));
      const response = await postTokenCall(Service.updateCustomerAlias, {
        alias: CustomerAlias,
      });
      if (response.status === 200 && response?.data?.responseCode === '00') {
        console.log('response.data......updateCustomerAlias', response);
        setShowTextInput(false);

        logs.log(
          loginResponse,
          'loginResponemaaz',
          loginResponse?.details?.accountTitle,
          'accountTitle',
        );
        logs.log(CustomerAlias, 'CustomerAliasUpdated');
        dispatch(updateAccountTitle(CustomerAlias));

        //  dispatch(loginResponse?.details?.accountTitle(CustomerAlias))

        logs.log(loginResponse, 'updatedloginRespose');

        dispatch(updateSessionToken(response));
      } else {
        dispatch(serviceResponseCheck(response, props.navigation));
      }
      dispatch(setLoader(false));
    } catch (error) {
      dispatch(catchError(error));
    }
  };

  const getBillTitleFetch = async (
    ucId,
    consumerNumber,
    beneficiaryType,
    companyName,
    benefID,
  ) => {
    try {
      dispatch(setLoader(true));

      // postTokenCall
      const response = await getTokenCall(
        Service.getOtherBill,
        `consumerNo=${consumerNumber}&ucid=${ucId}`,
        // &isOfflineBiller=${false}`,
      );
      if (response.data.responseCode === '00') {
        dispatch(updateSessionToken(response));
        // // nullifyObject();
        logs.log(response, 'getBillTitleFetch');
        // setResponseData(response.data.data);
        dispatch(
          setUserObject({
            otherPayment: {
              ...store.getState().reducers.userObject.otherPayment,
              amountAfterDueDate: response?.data?.data?.amountAfterDueDate,
              amountPayable: response?.data?.data?.amountPayable,
              amountWithInDueDate: response?.data?.data?.amountWithInDueDate,
              billMonth: response?.data?.data?.billMonth,
              billStatus: response?.data?.data?.billStatus,
              customerName: response?.data?.data?.customerName,
              dueDate: response?.data?.data?.dueDate,
              token: response?.data?.data?.token,
              consumerNumber: consumerNumber,
              ucId: ucId,
              benefType: beneficiaryType,
              benefId: benefID,
              isNotificationdirectPayment: true,
              companyName: companyName,
              benefTrans: true,
              //consumerNumber: "9751780000"
            },
          }),
        );
        const object = {
          // consumerNumber: "0400043985246",
          // UCID:"KESC0001",
          // benefType:'3',
          // companyName: "K-Electric",
          // isNotificationdirectPayment: false,

          consumerNumber: consumerNumber,
          UCID: ucId,
          benefType: beneficiaryType,
          companyName: companyName,
          benefID: benefID,
          isNotificationdirectPayment: true,
        };
        // dispatch(updateSessionToken(response));
        // success
        dispatch(setLoader(false));
        logs.log('Object-----', object);
        payNowData !== 'SomeValue'
          ? props?.navigation.navigate('OtherPaymentBill')
          : null;
      } else {
        dispatch(serviceResponseCheck(response, props.navigation));
        // // // nullifyObject();
      }
    } catch (error) {
      dispatch(catchError(error));
    }
  };

  const accountDetailViewWithEditAlias = () => {
    return (
      <View
        style={[
          {
            flex: 0.26,
            overflow: 'hidden',
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: Colors.dashboardSubContainerBack,
          },
        ]}>
        <View style={{height: hp(1)}}></View>

        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          {showTextInput ? (
            // <TextInput
            //   ref={ref1}
            //   style={styles.bannerText}
            //   onChangeText={(value) => {
            //     //  console.log('Newvalue:', value);
            //     setCustomerAlias(value);
            //   }}
            //   value={CustomerAlias}
            //   // placeholder={`${loginResponse?.details?.accountTitle}`}
            //   // placeholderTextColor='white'
            //   keyboardType="email"
            //   autoFocus={true}
            // />
            <TextInput
              ref={ref1}
              style={styles.bannerText}
              onChangeText={(value) => {
                // Filter out non-alphabetical characters and limit the length to 25
                const filteredValue = value
                  .replace(/[^a-zA-Z ]/g, '') // Remove characters that are not letters or spaces
                  .replace(/\s+/g, ' '); // Collapse multiple spaces to a single space

                setCustomerAlias(filteredValue);

                setCustomerAlias(filteredValue);
                console.log('New value:', filteredValue); // Optionally log the new value
              }}
              value={CustomerAlias}
              maxLength={25} // Limit string length to 25 characters
              // keyboardType="email"
              autoFocus={true}
            />
          ) : (
            <CustomText
              boldFont={true}
              style={styles.bannerText}
              numberOfLines={2}>
              {' '}
              {/* {loginResponse?.details?.alias
                  ? `${CustomerAlias.toUpperCase()}`
                  : ''} */}
              {CustomerAlias
                ? CustomerAlias.length >= 14
                  ? `${CustomerAlias?.toUpperCase().slice(0, 10)}...`
                  : CustomerAlias?.toUpperCase()
                : ''}{' '}
            </CustomText>
          )}
          {showTextInput ? (
            <TouchableOpacity
              style={{}}
              onPress={() => {
                updateCustomerAlias();
                // Assuming setShowTextInput is a state-setting function for a boolean state
              }}>
              <View
                style={{
                  backgroundColor: '#252f37',
                  borderRadius: wp(100),
                  width: wp(8),
                  height: wp(8),
                  alignItems: 'center',
                  alignSelf: 'flex-end',
                  justifyContent: 'center',
                  //  alignSelf: 'center',
                }}>
                <Feather name={'save'} size={wp(4)} color={Colors.whiteColor} />
              </View>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity
              style={{}}
              onPress={() => {
                handlePress();
                if (ref2.current) {
                  ref2.current.focus();
                }
              }}>
              <View
                style={{
                  backgroundColor: '#252f37',
                  borderRadius: wp(100),
                  width: wp(8),
                  height: wp(8),
                  alignItems: 'center',
                  alignSelf: 'flex-end',
                  justifyContent: 'center',
                }}>
                <Feather name={'edit'} size={wp(4)} color={Colors.whiteColor} />
              </View>
            </TouchableOpacity>
          )}
        </View>

        <View style={{height: hp(1)}}></View>

        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          <TouchableOpacity
            onPress={async () => {
              getDefaultAccountByAlias(true);
            }}>
            <Text
              style={[
                globalStyling.textFontNormal,
                {
                  color: Colors.whiteColor,
                  fontSize: hp(2),
                  alignSelf: 'center',
                },
              ]}>
              {loginResponse?.details?.ibanNo}
              {'  '}
            </Text>
          </TouchableOpacity>
          {shareButton()}
        </View>

        <View style={{height: hp(1)}}></View>

        <View
          style={{
            width: wp(90),
            height: hp(9),
            backgroundColor: Colors.dashboardChildContainerBack,
            borderRadius: wp(1.5),
            justifyContent: 'center',
          }}>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              // backgroundColor: 'red',
              paddingHorizontal: wp(5),
            }}>
            <View
              style={{
                flexDirection: 'column',
                // marginLeft: wp(4),
                justifyContent: 'space-between',
              }}>
              <CustomText style={{color: Colors.whiteColor, fontSize: hp(1.5)}}>
                Account Balance
              </CustomText>
              {showBalanceLoader ? (
                <ActivityIndicator
                  size="small"
                  color={Colors.whiteColor}
                  style={{height: wp(4), width: wp(3), marginLeft: wp(1)}}
                />
              ) : balance ? (
                <CustomText
                  style={{color: Colors.whiteColor, fontSize: hp(2.5)}}>
                  {filteredAccount[0]?.currency
                    ? filteredAccount[0]?.currency
                    : 'PKR'}{' '}
                  {balance == 'N/A' ? balance : currencyFormat(Number(balance))}
                </CustomText>
              ) : (
                <View
                  style={{
                    backgroundColor: Colors.dashboardBalancehider,
                    width: wp(10),
                    height: hp(1.5),
                    borderRadius: wp(10),
                  }}></View>
              )}
            </View>
            {balance ? (
              <TouchableOpacity
                style={{
                  backgroundColor: Colors.whiteColor,
                  borderRadius: wp(100),
                  justifyContent: 'center',
                  alignSelf: 'center',
                  height: hp(5),
                  // marginRight: wp(2),
                }}
                onPress={() => {
                  set_balance_show(true);
                  setBalance(false);
                }}>
                <View style={{flexDirection: 'row', marginHorizontal: wp(4)}}>
                  <CustomText
                    boldFont={true}
                    style={{
                      color: 'black',
                      fontSize: hp(2),
                    }}>{`Hide`}</CustomText>
                </View>
              </TouchableOpacity>
            ) : (
              <TouchableOpacity
                style={{
                  backgroundColor: Colors.whiteColor,
                  borderRadius: wp(100),
                  justifyContent: 'center',
                  alignSelf: 'center',
                  height: hp(5),
                  // marginRight: wp(2),
                }}
                onPress={() => {
                  setShowBalanceHandling();
                }}>
                <View style={{flexDirection: 'row', marginHorizontal: wp(4)}}>
                  <CustomText
                    style={{color: 'black', fontSize: hp(2)}}
                    boldFont={true}>{`Show`}</CustomText>
                </View>
              </TouchableOpacity>
            )}
          </View>
        </View>
        <View style={{height: hp(1)}}></View>
      </View>
    );
  };

  const accountDetailView = () => {
    return (
      <View
        style={[
          {
            flex: 0.26,
            overflow: 'hidden',
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: Colors.dashboardSubContainerBack,
          },
        ]}>
        <View style={{height: hp(1)}}></View>
        <CustomText boldFont={true} style={styles.bannerText}>
          {loginResponse?.details?.accountTitle
            ? `${loginResponse?.details?.accountTitle}`
            : ''}
        </CustomText>
        <View style={{height: hp(1)}}></View>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          <TouchableOpacity
            onPress={async () => {
              getDefaultAccountByAlias(true);
            }}>
            <Text
              style={[
                globalStyling.textFontNormal,
                {
                  color: Colors.whiteColor,
                  fontSize: hp(2),
                  alignSelf: 'center',
                },
              ]}>
              {loginResponse?.details?.ibanNo}
              {'  '}
            </Text>
          </TouchableOpacity>
          {shareButton()}
        </View>
        <View style={{height: hp(1)}}></View>
        <View
          style={{
            width: wp(90),
            height: hp(9),
            backgroundColor: Colors.dashboardChildContainerBack,
            borderRadius: wp(1.5),
            justifyContent: 'center',
          }}>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              // backgroundColor: 'red',
              paddingHorizontal: wp(5),
            }}>
            <View
              style={{
                flexDirection: 'column',
                // marginLeft: wp(4),
                justifyContent: 'space-between',
              }}>
              <CustomText style={{color: Colors.whiteColor, fontSize: hp(1.5)}}>
                Account Balance
              </CustomText>
              {showBalanceLoader ? (
                <ActivityIndicator
                  size="small"
                  color={Colors.whiteColor}
                  style={{height: wp(4), width: wp(3), marginLeft: wp(1)}}
                />
              ) : balance ? (
                <CustomText
                  style={{color: Colors.whiteColor, fontSize: hp(2.5)}}>
                  {filteredAccount[0]?.currency
                    ? filteredAccount[0]?.currency
                    : 'PKR'}{' '}
                  {balance == 'N/A' ? balance : currencyFormat(Number(balance))}
                </CustomText>
              ) : (
                <View
                  style={{
                    backgroundColor: Colors.dashboardBalancehider,
                    width: wp(10),
                    height: hp(1.5),
                    borderRadius: wp(10),
                  }}></View>
              )}
            </View>
            {balance ? (
              <TouchableOpacity
                style={{
                  backgroundColor: Colors.whiteColor,
                  borderRadius: wp(100),
                  justifyContent: 'center',
                  alignSelf: 'center',
                  height: hp(5),
                  // marginRight: wp(2),
                }}
                onPress={() => {
                  set_balance_show(true);
                  setBalance(false);
                }}>
                <View style={{flexDirection: 'row', marginHorizontal: wp(4)}}>
                  <CustomText
                    boldFont={true}
                    style={{
                      color: 'black',
                      fontSize: hp(2),
                    }}>{`Hide`}</CustomText>
                </View>
              </TouchableOpacity>
            ) : (
              <TouchableOpacity
                style={{
                  backgroundColor: Colors.whiteColor,
                  borderRadius: wp(100),
                  justifyContent: 'center',
                  alignSelf: 'center',
                  height: hp(5),
                  // marginRight: wp(2),
                }}
                onPress={() => {
                  setShowBalanceHandling();
                }}>
                <View style={{flexDirection: 'row', marginHorizontal: wp(4)}}>
                  <CustomText
                    style={{color: 'black', fontSize: hp(2)}}
                    boldFont={true}>{`Show`}</CustomText>
                </View>
              </TouchableOpacity>
            )}
          </View>
        </View>
        <View style={{height: hp(1)}}></View>
      </View>
    );
  };

  const Header = () => {
    return (
      <View
        style={{
          alignSelf: 'center',
          width: wp(90),
          flexDirection: 'row',
          // height: hp(10.3),
          justifyContent: 'space-between',
          alignItems: 'center',
          // paddingHorizontal: wp(1),
          paddingVertical: wp(1),
        }}>
        <TouchableOpacity
          style={{
            // marginLeft: wp(2),
            alignSelf: 'center',
          }}
          onPress={() => {
            props.navigation.toggleDrawer();
          }}>
          <Image
            source={Images.menuDash}
            style={{width: hp(3.5), height: hp(3.5)}}
          />
        </TouchableOpacity>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          <TouchableOpacity
            style={{alignSelf: 'center'}}
            onPress={() => {
              // getNotifications();
              console.log(
                'loginResponse...totalNotificationCount..........',
                loginResponse?.details?.totalNotificationCount,
              );
              if (
                loginResponse?.details?.totalNotificationCount !=
                store.getState().reducers.keychainObject
                  ?.KeyChain_totalNotificationCount
              ) {
                dispatch(
                  setKeyChainObject({
                    KeyChain_totalNotificationCount:
                      loginResponse?.details?.totalNotificationCount,
                  }),
                );
              }
              props.navigation.navigate('Appnotifications');
            }}>
            <View>
              {newNoticationRecived ? (
                <View
                  style={{
                    height: hp(1.5),
                    alignItems: 'center',
                    position: 'absolute',
                    bottom: wp(7),
                    right: wp(1.5),
                    zIndex: 2,
                  }}></View>
              ) : (
                <View
                  style={{
                    backgroundColor: Colors.redColor,
                    borderRadius: wp(1000),
                    // width: '60%'
                    width: hp(1.5),
                    height: hp(1.5),
                    alignItems: 'center',
                    // top: newNoticationRecived ? wp(3) : wp(5),
                    position: 'absolute',
                    bottom: wp(7),
                    right: wp(1.5),
                    zIndex: 2,
                  }}></View>
              )}

              {newNoticationRecived ? (
                <Feather
                  name={'bell'}
                  size={hp(3.5)}
                  color={Colors.whiteColor}
                  onPress={scrollLeft}
                  style={{
                    alignSelf: 'center',
                    marginHorizontal: wp(3),
                  }}
                />
              ) : (
                <Image
                  source={Images.BellGif}
                  resizeMode={'contain'}
                  style={{
                    width: hp(6),
                    height: hp(6),
                    // tintColor: 'white',
                  }}
                />
              )}
            </View>
          </TouchableOpacity>

          <TouchableOpacity
            style={{
              backgroundColor: Colors.dashboardLogoutBtn,
              justifyContent: 'center',
              borderRadius: wp(10),
              alignSelf: 'center',
              width: wp(25),
              alignItems: 'center',
              // marginRight: wp(2),
            }}
            onPress={() => {
              logs.log('ashjdgas');
              dispatch(changeGlobalAlertState(true, props.navigation));
              nullifyObject();
            }}>
            <CustomText
              boldFont={true}
              style={{
                color: Colors.whiteColor,
                margin: hp(1),
                fontSize: hp(2),
              }}>
              Logout
            </CustomText>
          </TouchableOpacity>
        </View>
      </View>
    );
  };
  const [currentIndex, setCurrentIndex] = useState(0);
  const flatListRef = useRef(null);

  const tabData = [
    {
      key: '1',
      title: 'E-Receipt',
      image: activeTheme.isPinkTheme
        ? Images.newBottomEreciptPinkTheme
        : activeTheme.isIndigoTheme
        ? Images.newBottomEreciptIndigoTheme
        : activeTheme.isOrangeTheme
        ? Images.newBottomEreciptOrangeTheme
        : Images.newBottomErecipt,

      onPress: () => {
        if (isL0Customer) {
          props.navigation.navigate('ETransactionReceipts');
        } else if (isL1Customer) {
          changeproceedAlert(true);
        } else {
          changeproceedAlert(true);
        }
      },
    },
    {
      key: '2',
      title: 'Online Shopping',
      image: activeTheme.isPinkTheme
        ? Images.newBottomShopPinkTheme
        : activeTheme.isIndigoTheme
        ? Images.newBottomShopIndigoTheme
        : activeTheme.isOrangeTheme
        ? Images.newBottomShopOrangeTheme
        : Images.newBottomShop,
      onPress: () => {
        if (isL0Customer) {
          dispatch(
            setUserObject({
              otherPayment: {
                benefType: 6,
                benefTrans: false,
              },
            }),
          );
          navigateTo('onlineShopping', benefType.OnlineShoppinPayment);
        } else if (isL1Customer) {
          changeproceedAlert(true);
        } else {
          changeproceedAlert(true);
        }
      },
    },
    {
      key: '3',
      title: 'QR Pay',
      image: activeTheme.isPinkTheme
        ? Images.newBottomQRPinkTheme
        : activeTheme.isIndigoTheme
        ? Images.newBottomQRIndigoTheme
        : activeTheme.isOrangeTheme
        ? Images.newBottomQROrangeTheme
        : Images.newBottomQR,
      onPress: () => {
        if (QRonDashboard) {
          getpkrAccountsforRAAST();
        } else {
          // dispatch(setAppAlert(Message.ServicesUnavilable));
          // dispatch(setAppAlert(Message.FeatureUnavilable));
          if (isL0Customer) {
            if (virtualCardObject && virtualCardStatus === 'INITIALIZED') {
              props.navigation.navigate('AddVirtualCardMpin', {
                data: true,
              });
            } else {
              if (Object.keys(virtualCardObject).length === 0) {
                dispatch(
                  changeGlobalAlertState(true, props.navigation, {
                    onPressYes: () => {
                      logs.log('-----1');

                      dispatch(closeGlobalAlertState());
                      setTimeout(() => {
                        dispatch(agreeToAddVirtualCard(props.navigation));
                      }, 500);
                    },
                    onPressNo: () => {
                      logs.log('-----0');
                      dispatch(closeGlobalAlertState());
                    },
                    title: 'QR Payments',
                    alert_text: Message.digitalDebitOption,
                  }),
                );
                console.log('asdbhashgfddnsbavd');
              } else {
                dispatch(setQrScannerState(true));
              }
            }

            // props.navigation.navigate('Transfers');
          } else if (isL1Customer) {
            changeproceedAlert(true);
          } else {
            changeproceedAlert(true);
          }
        }
      },
    },
    {
      key: '4',
      title: 'Insurance Payments',
      image: activeTheme.isPinkTheme
        ? Images.newBottomInsurancePinkTheme
        : activeTheme.isIndigoTheme
        ? Images.newBottomInsuranceIndigoTheme
        : activeTheme.isOrangeTheme
        ? Images.newBottomInsuranceOrangeTheme
        : Images.newBottomInsurance,
      onPress: () => {
        if (isL0Customer) {
          dispatch(
            setUserObject({
              otherPayment: {
                benefType: 7,
                benefTrans: false,
              },
            }),
          );
          navigateTo('insurancePayment', benefType.InsurancePayment);
        } else if (isL1Customer) {
          changeproceedAlert(true);
        } else {
          changeproceedAlert(true);
        }
      },
    },
    {
      key: '5',
      title: 'KuickPay',
      image: activeTheme.isPinkTheme
        ? Images.newBottomKuickPinkTheme
        : activeTheme.isIndigoTheme
        ? Images.newBottomKuickIndigoTheme
        : activeTheme.isOrangeTheme
        ? Images.newBottomKuickOrangeTheme
        : Images.newBottomKuick,
      onPress: () => {
        if (isL0Customer) {
          dispatch(
            setUserObject({
              otherPayment: {
                benefEmail: '',
                benefMobile: '',
                benefPhone: '',
                benefTrans: false,
                benefType: 10,
                comments: '',
                companyName: 'Kuick Pay',
                isDirectPayment: true,
                payId: 'KPAY0001',
                ucId: 'KPAY0001',
              },
            }),
          );
          props.navigation.navigate('OtherPaymentService');
        } else if (isL1Customer) {
          changeproceedAlert(true);
        } else {
          changeproceedAlert(true);
        }
      },
    },
    {
      key: '6',
      title: 'Certificates',
      image: activeTheme.isPinkTheme
        ? Images.newBottomCerPinkTheme
        : activeTheme.isIndigoTheme
        ? Images.newBottomCerIndigoTheme
        : activeTheme.isOrangeTheme
        ? Images.newBottomCerOrangeTheme
        : Images.newBottomCer,
      onPress: () => {
        props.navigation.navigate('Certificates');
        // if (isL0Customer) {
        //   props.navigation.navigate('Certificates');
        // } else if (isL1Customer) {
        //   changeproceedAlert(true);
        // } else {
        //   changeproceedAlert(true);
        // }
      },
    },
    {
      key: '7',
      title: 'Complaints',
      image: activeTheme.isPinkTheme
        ? Images.newBottomComplainPinkTheme
        : activeTheme.isIndigoTheme
        ? Images.newBottomComplainIndigoTheme
        : activeTheme.isOrangeTheme
        ? Images.newBottomComplainOrangeTheme
        : Images.newBottomComplain,
      onPress: () => {
        props.navigation.navigate('Complaints');
        // if (isL0Customer) {
        //   props.navigation.navigate('Complaints');
        // } else if (isL1Customer) {
        //   changeproceedAlert(true);
        // } else {
        //   changeproceedAlert(true);
        // }
      },
    },
    {
      key: '8',
      title: 'RAAST ID\nManagement',
      image: activeTheme.isPinkTheme
        ? Images.newBottomRaastPinkTheme
        : activeTheme.isIndigoTheme
        ? Images.newBottomRaastIndigoTheme
        : activeTheme.isOrangeTheme
        ? Images.newBottomRaastOrangeTheme
        : Images.newBottomRaast,
      onPress: () => {
        props.navigation.navigate('AliasManagment');

        // if (isL0Customer) {
        //   props.navigation.navigate('AliasManagment');
        // } else if (isL1Customer) {
        //   changeproceedAlert(true);
        // } else {
        //   changeproceedAlert(true);
        // }
      },
    },
    {
      key: '9',
      title: 'PayPro',
      image: activeTheme.isPinkTheme
        ? Images.newBottomPayProPinkTheme
        : activeTheme.isIndigoTheme
        ? Images.newBottomPayProIndigoTheme
        : activeTheme.isOrangeTheme
        ? Images.newBottomPayProOrangeTheme
        : Images.Paypro,
      onPress: () => {
        if (isL0Customer) {
          dispatch(
            setUserObject({
              otherPayment: {
                benefEmail: '',
                benefMobile: '',
                benefPhone: '',
                benefTrans: false,
                benefType: 10,
                billerRefImage: 'undefined',
                comments: '',
                companyName: 'PayPro',
                isDirectPayment: true,
                payId: 'THKS0001',
                ucId: 'THKS0001',
              },
            }),
          );
          props.navigation.navigate('OtherPaymentService');
        } else if (isL1Customer) {
          changeproceedAlert(true);
        } else {
          changeproceedAlert(true);
        }
      },
    },
    {
      key: '10',
      title: 'Themes',
      image: activeTheme.isPinkTheme
        ? Images.newBottomThemePinkTheme
        : activeTheme.isIndigoTheme
        ? Images.newBottomThemeIndigoTheme
        : activeTheme.isOrangeTheme
        ? Images.newBottomThemeOrangeTheme
        : Images.newBottomTheme,
      onPress: () => {
        props.navigation.navigate('ThemeSwitch');

        // if (isL0Customer) {
        //   props.navigation.navigate('ThemeSwitch');
        // } else if (isL1Customer) {
        //   changeproceedAlert(true);
        // } else {
        //   changeproceedAlert(true);
        // }
      },
    },
    // {
    //   key: '1',
    //   title: 'Transfer',
    //   image: Images.bottomTransfer,
    //   onPress: () => {
    //     if (isL0Customer) {
    //       props.navigation.navigate('Transfers');
    //     } else if (isL1Customer) {
    //       changeproceedAlert(true);
    //     } else {
    //       changeproceedAlert(true);
    //     }
    //   },
    // },
    // {
    //   key: '3',
    //   title: 'Raast QR',
    //   image: QRonDashboard ? Images.bottomRaastQr : Images.bottomQR,
    //   onPress: () => {
    //     if (QRonDashboard) {
    //       getpkrAccountsforRAAST();
    //     } else {
    //       // dispatch(setAppAlert(Message.ServicesUnavilable));
    //       // dispatch(setAppAlert(Message.FeatureUnavilable));
    //       if (isL0Customer) {
    //         if (virtualCardObject && virtualCardStatus === 'INITIALIZED') {
    //           props.navigation.navigate('AddVirtualCardMpin', {
    //             data: true,
    //           });
    //         } else {
    //           if (Object.keys(virtualCardObject).length === 0) {
    //             dispatch(
    //               changeGlobalAlertState(true, props.navigation, {
    //                 onPressYes: () => {
    //                   logs.log('-----1');

    //                   dispatch(closeGlobalAlertState());
    //                   setTimeout(() => {
    //                     dispatch(agreeToAddVirtualCard(props.navigation));
    //                   }, 500);
    //                 },
    //                 onPressNo: () => {
    //                   logs.log('-----0');
    //                   dispatch(closeGlobalAlertState());
    //                 },
    //                 title: 'QR Payments',
    //                 alert_text: Message.digitalDebitOption,
    //               }),
    //             );
    //             console.log('asdbhashgfddnsbavd');
    //           } else {
    //             dispatch(setQrScannerState(true));
    //           }
    //         }

    //         // props.navigation.navigate('Transfers');
    //       } else if (isL1Customer) {
    //         changeproceedAlert(true);
    //       } else {
    //         changeproceedAlert(true);
    //       }
    //     }
    //   },
    // },
    // {
    //   key: '7',
    //   title: 'Donations',
    //   image: Images.bottomDonation,
    //   onPress: () => {
    //     if (isL0Customer) {
    //       props.navigation.navigate('DonationsData');
    //     } else if (isL1Customer) {
    //       changeproceedAlert(true);
    //     } else {
    //       changeproceedAlert(true);
    //     }
    //   },
    // },
    // {
    //   key: '8',
    //   title: 'Sports',
    //   image: Images.bottomSport,
    //   onPress: () => {
    //     if (isL0Customer) {
    //       props.navigation.navigate('DonationPayments', {
    //         iban: 'PK97NBPA2158003100379901',
    //         id: 10,
    //         text: 'NBP Sports Club Fee',
    //       });
    //     } else if (isL1Customer) {
    //       changeproceedAlert(true);
    //     } else {
    //       changeproceedAlert(true);
    //     }
    //   },
    // },
    // {
    //   key: '2',
    //   title: 'Bills',
    //   image: Images.bottomBill,
    //   onPress: () => {
    //     logs.log(`isUpgraded : ${isUpgraded}`);
    //     if (isL0Customer) {
    //       props.navigation.navigate('UtilityBillPayments');
    //     } else if (isL1Customer) {
    //       changeproceedAlert(true);
    //     } else {
    //       changeproceedAlert(true);
    //     }
    //   },
    // },
    // {
    //   key: '4',
    //   title: 'TopUP',
    //   image: Images.bottomTop,
    //   onPress: () => {
    //     if (isL0Customer) {
    //       dispatch(mobileTopUp(token, props.navigation, false, ''));
    //     } else {
    //       changeproceedAlert(true);
    //     }
    //   },
    // },
    // {
    //   key: '5',
    //   title: 'Investments',
    //   image: Images.bottomInvest,
    //   onPress: () => {
    //     props.navigation.navigate('InvestmentScreen');
    //   },
    // },
    // {
    //   key: '6',
    //   title: 'Cards',
    //   image: Images.bottomCard,
    //   onPress: () => {
    //     props.navigation.navigate('CardManagment');
    //   },
    // },
  ];

  const scrollLeft = () => {
    if (currentIndex > 0) {
      flatListRef.current.scrollToIndex({index: currentIndex - 1});
      setCurrentIndex(currentIndex - 1);
    }
  };

  const scrollRight = () => {
    if (currentIndex < tabData.length - 1) {
      flatListRef.current.scrollToIndex({index: currentIndex + 1});
      setCurrentIndex(currentIndex + 1);
    }
  };
  const BottomNav = () => {
    const handleScroll = (event) => {
      const scrollX = event.nativeEvent.contentOffset.x;
      const screenWidth = event.nativeEvent.layoutMeasurement.width;
      const contentWidth = event.nativeEvent.contentSize.width;

      setShowLeftArrow(scrollX > 0);
      setShowRightArrow(scrollX + screenWidth < contentWidth);
    };

    const renderItem = ({item}) => (
      <TouchableOpacity style={styles.bottomTabView} onPress={item.onPress}>
        <Image
          source={item.image}
          resizeMode="contain"
          style={[
            styles.bottomimagesSize,
            activeTheme?.isDarkTheme ? {tintColor: 'white'} : null,
          ]}
        />
        <View style={{height: hp(1)}} />
        <CustomText
          style={[styles.bottomTabTex]}
          // numberOfLines={1}
        >
          {item.title}
        </CustomText>
      </TouchableOpacity>
    );
    return (
      <View
        style={{
          backgroundColor: Colors.dashboardIconBack,
          justifyContent: 'center',
          borderTopWidth: 0.4,
          borderTopColor: Colors.textFieldBorderColor,
          flex: 0.09,
        }}>
        {showLeftArrow && (
          <IonIcons
            name={'caret-back'}
            size={wp(7)}
            color={Colors.dashboardBottomIcon}
            style={{position: 'absolute', zIndex: 2}}
            onPress={scrollLeft}
          />
        )}
        {showRightArrow && (
          <IonIcons
            name={'caret-forward'}
            size={wp(7)}
            style={{
              // width: wp(10),
              position: 'absolute',
              alignSelf: 'flex-end',
              zIndex: 2,
            }}
            color={Colors.dashboardBottomIcon}
            onPress={scrollRight}
          />
        )}
        <FlatList
          ref={flatListRef}
          horizontal
          showsHorizontalScrollIndicator={false}
          data={tabData}
          keyExtractor={(item) => item.key}
          renderItem={renderItem}
          onScroll={handleScroll}
          onMomentumScrollEnd={(event) => {
            const itemWidth = event.nativeEvent.layoutMeasurement.width;
            const offset = event.nativeEvent.contentOffset.x;
            const index = Math.floor(offset / itemWidth);
            setCurrentIndex(index);
          }}
        />
      </View>
    );
  };

  const ScrollAbleMenu = () => {
    return (
      <View style={{justifyContent: 'center'}}>
        {/* <View style={{height: hp(1)}} /> */}

        <ScrollView showsVerticalScrollIndicator={false}>
          <View
            style={{
              width: wp(90),
              alignSelf: 'center',
              alignItems: 'center',
            }}>
            {/* row1 starts here*/}
            {/* <View style={{he/ight: hp(3)}} /> */}
            <View style={styles.pagesTaps}>
              <TouchableOpacity
                accessibilityLabel="My Accounts"
                style={[
                  styles.imageTapView,
                  {backgroundColor: Colors.dashboardIconBack},
                ]}
                onPress={() => {
                  props.navigation.navigate('MyAccounts');
                }}>
                <Image
                  source={
                    activeTheme.isDarkTheme
                      ? Images.dashboardDarkmyAccount
                      : activeTheme.isPinkTheme
                      ? Images.dashboardPinkmyAccount
                      : activeTheme.isIndigoTheme
                      ? Images.dashboardIndigomyAccount
                      : activeTheme.isOrangeTheme
                      ? Images.dashboardOrangemyAccount
                      : Images.dashboardmyAccount
                  }
                  style={styles.imageStyle}
                  resizeMode="contain"
                />
                <View style={{height: hp(1)}} />

                <CustomText
                  style={[
                    styles.dashboardIconText,
                    {color: activeTheme.dashboardIconText},
                  ]}>
                  {`Account\nManagement`}
                </CustomText>
              </TouchableOpacity>

              <TouchableOpacity
                accessibilityLabel="Card Management"
                style={[
                  styles.imageTapView,
                  {backgroundColor: Colors.dashboardIconBack},
                ]}
                onPress={() => {
                  // dispatch(getAccounts(props.navigation, getcustomerdetails));
                  props.navigation.navigate('CardManagment');
                }}>
                <Image
                  source={
                    activeTheme.isDarkTheme
                      ? Images.dashboardDarkdebitCard
                      : activeTheme.isPinkTheme
                      ? Images.dashboardPinkdebitCard
                      : activeTheme.isIndigoTheme
                      ? Images.dashboardIndigodebitCard
                      : activeTheme.isOrangeTheme
                      ? Images.dashboardOrangedebitCard
                      : Images.dashboarddebitCard
                  }
                  style={styles.imageStyle}
                  resizeMode="contain"
                />
                <View style={{height: hp(1)}} />

                <CustomText
                  style={[
                    styles.dashboardIconText,
                    {color: activeTheme.dashboardIconText},
                  ]}>
                  {`Card\nManagement`}
                </CustomText>
              </TouchableOpacity>

              {/* yahan sy raast comment hoga  */}

              <TouchableOpacity
                accessibilityLabel="Beneficiary Payment"
                style={[
                  styles.imageTapView,
                  {backgroundColor: Colors.dashboardIconBack},
                ]}
                // onPress={() => props.navigation.navigate('BeneficiaryPayment')}>
                onPress={() => {
                  if (isL0Customer) {
                    // props.navigation.navigate('BeneficiaryPayment');
                    dispatch(all_benef_pay(props.navigation, false, () => {}));
                  } else if (isL1Customer) {
                    changeproceedAlert(true);
                  } else {
                    changeproceedAlert(true);
                  }
                }}>
                <Image
                  source={
                    activeTheme.isDarkTheme
                      ? Images.dashboardDarkbenefPay
                      : activeTheme.isPinkTheme
                      ? Images.dashboardPinkbenefPay
                      : activeTheme.isIndigoTheme
                      ? Images.dashboardIndigobenefPay
                      : activeTheme.isOrangeTheme
                      ? Images.dashboardOrangebenefPay
                      : Images.dashboardbenefPay
                  }
                  style={styles.imageStyle}
                  resizeMode="contain"
                />
                <View style={{height: hp(1)}} />

                <CustomText
                  style={[
                    styles.dashboardIconText,
                    {color: activeTheme.dashboardIconText},
                  ]}>
                  {`Beneficiary\nPayments`}
                </CustomText>
              </TouchableOpacity>
              {/* yahan sy raast comment hoga  */}
            </View>
            {/* row1 ends here */}
            {/* row2 starts here */}
            <View style={styles.pagesTaps}>
              <TouchableOpacity
                accessibilityLabel="Transfers"
                style={[
                  styles.imageTapView,
                  {backgroundColor: Colors.dashboardIconBack},
                ]}
                onPress={() => {
                  if (isL0Customer) {
                    props.navigation.navigate('Transfers');
                  } else if (isL1Customer) {
                    changeproceedAlert(true);
                  } else {
                    changeproceedAlert(true);
                  }
                }}>
                <View style={{position: 'absolute', top: wp(1), right: wp(5)}}>
                  <Image
                    style={{
                      height: wp(4),
                      width: wp(4),
                      alignSelf: 'center',
                      // backgroundColor:Colors.whiteColor,
                      left: wp(4),
                    }}
                    source={require('../../Assets/Icons/NewDrawer/Ibftt.png')}
                  />
                </View>
                <Image
                  source={
                    activeTheme.isDarkTheme
                      ? Images.dashboardDarkfundTransfer
                      : activeTheme.isPinkTheme
                      ? Images.dashboardPinkfundTransfer
                      : activeTheme.isIndigoTheme
                      ? Images.dashboardIndigofundTransfer
                      : activeTheme.isOrangeTheme
                      ? Images.dashboardOrangefundTransfer
                      : Images.dashboardfundTransfer
                  }
                  style={styles.imageStyle}
                  resizeMode="contain"
                />
                <View style={{height: hp(1)}} />

                <CustomText
                  style={[
                    styles.dashboardIconText,
                    {color: activeTheme.dashboardIconText},
                  ]}>
                  {`Fund\nTransfers`}
                </CustomText>
              </TouchableOpacity>

              <TouchableOpacity
                accessibilityLabel="Utility Bill Payment"
                style={[
                  styles.imageTapView,
                  {backgroundColor: Colors.dashboardIconBack},
                ]}
                onPress={() => {
                  logs.log(`isUpgraded : ${isUpgraded}`);
                  if (isL0Customer) {
                    props.navigation.navigate('UtilityBillPayments');
                  } else if (isL1Customer) {
                    changeproceedAlert(true);
                  } else {
                    changeproceedAlert(true);
                  }
                }}>
                <View style={{position: 'absolute', top: wp(1), right: wp(2)}}>
                  {/* <NewView /> */}
                </View>
                <Image
                  source={
                    activeTheme.isDarkTheme
                      ? Images.dashboarDarkdutilityBillPay
                      : activeTheme.isPinkTheme
                      ? Images.dashboardPinkutilityBillPay
                      : activeTheme.isIndigoTheme
                      ? Images.dashboardIndigoutilityBillPay
                      : activeTheme.isOrangeTheme
                      ? Images.dashboardOrangeutilityBillPay
                      : Images.dashboardutilityBillPay
                  }
                  style={styles.imageStyle}
                  resizeMode="contain"
                />
                <View style={{height: hp(1)}} />

                <CustomText
                  style={[
                    styles.dashboardIconText,
                    {color: activeTheme.dashboardIconText},
                  ]}>
                  {`Bill\nPayments`}
                </CustomText>
              </TouchableOpacity>

              <TouchableOpacity
                accessibilityLabel="Mobile Top up"
                style={[
                  styles.imageTapView,
                  {backgroundColor: Colors.dashboardIconBack},
                ]}
                onPress={() => {
                  if (isL0Customer) {
                    dispatch(mobileTopUp(token, props.navigation, false, ''));
                    // changeproceedAlert(true);
                  } else {
                    // dispatch(mobileTopUp(token, props.navigation, false, ''));
                    changeproceedAlert(true);
                  }
                  // props.navigation.navigate('MobileTopUp');
                }}>
                <Image
                  source={
                    activeTheme.isDarkTheme
                      ? Images.dashboardDarkmobileTopUp
                      : activeTheme.isPinkTheme
                      ? Images.dashboardPinkmobileTopUp
                      : activeTheme.isIndigoTheme
                      ? Images.dashboardIndigomobileTopUp
                      : activeTheme.isOrangeTheme
                      ? Images.dashboardOrangemobileTopUp
                      : Images.dashboardmobileTopUp
                  }
                  style={styles.imageStyle}
                  resizeMode="contain"
                />
                <View style={{height: hp(1)}} />

                <CustomText
                  style={[
                    styles.dashboardIconText,
                    {color: activeTheme.dashboardIconText},
                  ]}>
                  {`Mobile\nTop-Up`}
                </CustomText>
              </TouchableOpacity>
            </View>
            {/* row2 ends here */}
            {/* row3 starts here */}
            <View style={styles.pagesTaps}>
              <TouchableOpacity
                accessibilityLabel="Utility Bill Payment"
                style={[
                  styles.imageTapView,
                  {backgroundColor: Colors.dashboardIconBack},
                ]}
                onPress={() => {
                  logs.log(`isUpgraded : ${isUpgraded}`);
                  if (isL0Customer) {
                    dispatch(
                      setUserObject({
                        otherPayment: {
                          ucId: 'CC01BILL',
                          companyName: '1Bill Credit Card Bills',
                          isDirectPayment: true,
                          benefType: 13,
                          benefTrans: false,
                        },
                      }),
                    );
                    props.navigation.navigate('OtherPaymentService');
                  } else if (isL1Customer) {
                    changeproceedAlert(true);
                  } else {
                    changeproceedAlert(true);
                  }
                }}>
                <View style={{position: 'absolute', top: wp(1), right: wp(2)}}>
                  {/* <NewView /> */}
                </View>
                <Image
                  source={
                    activeTheme.isDarkTheme
                      ? Images.dashboardDarkdebitCard
                      : activeTheme.isPinkTheme
                      ? Images.dashboardPinkdebitCard
                      : activeTheme.isIndigoTheme
                      ? Images.dashboardIndigodebitCard
                      : activeTheme.isOrangeTheme
                      ? Images.dashboardOrangedebitCard
                      : Images.dashboardutilityBillPay
                  }
                  style={styles.imageStyle}
                  resizeMode="contain"
                />
                <View style={{height: hp(1)}} />

                <CustomText
                  style={[
                    styles.dashboardIconText,
                    {color: activeTheme.dashboardIconText},
                  ]}>
                  {`Credit Card\nPayments`}
                </CustomText>
              </TouchableOpacity>
              <TouchableOpacity
                accessibilityLabel="Government Payments"
                style={[
                  styles.imageTapView,
                  {backgroundColor: Colors.dashboardIconBack},
                ]}
                onPress={() => {
                  if (isL0Customer) {
                    props.navigation.navigate('OtherConsumers', {
                      data: {
                        routeData: {data: 'governmentPayments'},
                        isPayBenef: false,
                        benefObject: '',
                        benefType: benefType.GovtPayment,
                      },
                    });
                    dispatch(
                      setUserObject({
                        otherPayment: {
                          benefType: 11,
                          benefTrans: false,
                        },
                      }),
                    );
                    //   data: 'governmentPayments',
                    //   benefType: 11,
                    // });
                    // dispatch(
                    //   getOtherPayments(
                    //     token,
                    //     props.navigation,
                    //     {
                    //       data: 'governmentPayments',
                    //     },
                    //     11,
                    //     false,
                    //     '',
                    //   ),
                    // );
                    // props.navigation.navigate('OtherPaymentService');
                  } else if (isL1Customer) {
                    changeproceedAlert(true);
                  } else {
                    changeproceedAlert(true);
                  }
                }}>
                <Image
                  source={
                    activeTheme.isDarkTheme
                      ? Images.dashboardDarkbenefManag
                      : activeTheme.isPinkTheme
                      ? Images.dashboardPinkbenefManag
                      : activeTheme.isIndigoTheme
                      ? Images.dashboardIndigobenefManag
                      : activeTheme.isOrangeTheme
                      ? Images.dashboardOrangebenefManag
                      : Images.dashboardbenefManag
                  }
                  style={styles.imageStyle}
                  resizeMode="contain"
                />
                <View style={{height: hp(1)}} />

                <CustomText
                  style={[
                    styles.dashboardIconText,
                    {color: activeTheme.dashboardIconText},
                  ]}>
                  {`Govt. Payment & \Challans`}
                </CustomText>
              </TouchableOpacity>
              {/* <TouchableOpacity
            accessibilityLabel="Mobile Top up"
            style={[
              styles.imageTapView,
              {backgroundColor: Colors.dashboardIconBack},
            ]}
            onPress={() => {
              if (isL0Customer) {
                dispatch(
                  setUserObject({
                    otherPayment: {
                      benefType: 11,
                      benefTrans: false,
                      companyName: 'Federal Board of Revenue (FBR)',
                      ucId: 'PRAL0001',
                      isDirectPayment: true,
                    },
                  }),
                );
                // dispatch(mobileTopUp(token, props.navigation, false, ''));
                props.navigation.navigate('OtherPaymentService');
              } else {
                // dispatch(mobileTopUp(token, props.navigation, false, ''));
                changeproceedAlert(true);
              }
              // props.navigation.navigate('MobileTopUp');
            }}>
            <Image
              source={
                activeTheme.isDarkTheme
                  ? Images.dashboardDarkfbrTax
                  : activeTheme.isPinkTheme
                  ? Images.dashboardPinkfbrTax
                  : activeTheme.isIndigoTheme
                  ? Images.dashboardIndigofbrTax
                  : activeTheme.isOrangeTheme
                  ? Images.dashboardOrangefbrTax
                  : Images.fbrTax
              }
              style={styles.imageStyle}
              resizeMode="contain"
            />
            <View style={{height: wp(2)}} />

            <CustomText style={[styles.dashboardIconText,{backgroundColor:activeTheme.dashboardIconText}]}>
              {`FBR Tax\nPayments`}
            </CustomText>
          </TouchableOpacity> */}
              <TouchableOpacity
                accessibilityLabel="Donation"
                style={[
                  styles.imageTapView,
                  {backgroundColor: Colors.dashboardIconBack},
                ]}
                onPress={() => {
                  if (isL0Customer) {
                    props.navigation.navigate('DonationsData');
                  } else if (isL1Customer) {
                    changeproceedAlert(true);
                  } else {
                    changeproceedAlert(true);
                  }
                }}>
                <View
                  style={{
                    position: 'absolute',
                    top: wp(1),
                    right: wp(2),
                  }}></View>
                <Image
                  source={
                    activeTheme.isDarkTheme
                      ? Images.dashboarDarkdDonation
                      : activeTheme.isPinkTheme
                      ? Images.dashboardPinkDonation
                      : activeTheme.isIndigoTheme
                      ? Images.dashboardIndigoDonation
                      : activeTheme.isOrangeTheme
                      ? Images.dashboardOrangeDonation
                      : Images.dashboardDonation
                  }
                  style={styles.imageStyle}
                  resizeMode="contain"
                />
                <View style={{height: hp(1)}} />
                <CustomText
                  style={[
                    styles.dashboardIconText,
                    {color: activeTheme.dashboardIconText},
                  ]}>
                  {`Donations`}
                </CustomText>
              </TouchableOpacity>

              {/* <TouchableOpacity
          style={[styles.imageTapView,{backgroundColor: Colors.dashboardIconBack}]}
          onPress={() => props.navigation.navigate('CardManagment')}>
          <Image
            source={require('../../Assets/Dashboard_Assets/debit-card-management-01.png')}
            style={styles.imageStyle}
            resizeMode="contain"
          />
        </TouchableOpacity> */}
              {/* Removed otherpayments by waqas bshai  */}
              {/* <TouchableOpacity
        accessibilityLabel="Other Payments"
          style={[styles.imageTapView,{backgroundColor: Colors.dashboardIconBack}]}
          onPress={() => {
            logs.log(String(loginResponse?.details?.customerlevel));
            if (isL0Customer) {
              props.navigation.navigate('OtherPayments');
            } else if (isL1Customer) {
              changeproceedAlert(true);
            } else {
              changeproceedAlert(true);
            }
          }}>
          <Image
            source={require('../../Assets/Dashboard_Assets/btn_otherpayment_normal.png')}
            style={styles.imageStyle}
            resizeMode="contain"
          />
        </TouchableOpacity>  */}
              {/* <TouchableOpacity
          style={[styles.imageTapView,{backgroundColor: Colors.dashboardIconBack}]}
          onPress={() => props.navigation.navigate('CardManagment')}>
          <Image
            source={require('../../Assets/Dashboard_Assets/debit-card-management-01.png')}
            style={styles.imageStyle}
            resizeMode="contain"
          />
        </TouchableOpacity> */}
              {/*for RAAST */}
              {/* <TouchableOpacity
            accessibilityLabel={'Dashboard-Bill1'}
            testID={'Dashboard-Bill1'}
            style={[styles.imageTapView,{backgroundColor: Colors.dashboardIconBack}]}
            onPress={() => {
              if (isL0Customer) {
                props.navigation.navigate('Bill1');
              } else if (isL1Customer) {
                changeproceedAlert(true);
              } else {
                changeproceedAlert(true);
              }
            }}>
            <Image
              source={Images.dashboardoneBill}
              style={styles.imageStyle}
              resizeMode="contain"
            />
            <CustomText style={[styles.dashboardIconText,{backgroundColor:activeTheme.dashboardIconText}]}>
              {`1 Bill\nPayment`}
            </CustomText>
          </TouchableOpacity> */}
            </View>

            {/* row3 ends here */}

            {/* row4 start here */}
            <View style={styles.pagesTaps}>
              <TouchableOpacity
                accessibilityLabel="internetBillPayment"
                style={[
                  styles.imageTapView,
                  {backgroundColor: Colors.dashboardIconBack},
                ]}
                onPress={() => {
                  logs.log();
                  if (isL0Customer) {
                    props.navigation.navigate('OtherConsumers', {
                      data: {
                        routeData: {data: 'internetBillPayment'},
                        isPayBenef: false,
                        benefObject: '',
                        benefType: benefType.InternetBillPayment,
                      },
                    });
                    dispatch(
                      setUserObject({
                        otherPayment: {
                          benefType: 5,
                          benefTrans: false,
                        },
                      }),
                    );
                  } else if (isL1Customer) {
                    changeproceedAlert(true);
                  } else {
                    changeproceedAlert(true);
                  }
                }}>
                <Image
                  source={
                    activeTheme.isDarkTheme
                      ? Images.dashboardDarkInternet
                      : activeTheme.isPinkTheme
                      ? Images.dashboardPinkInternet
                      : activeTheme.isIndigoTheme
                      ? Images.dashboardIndigoInternet
                      : activeTheme.isOrangeTheme
                      ? Images.dashboardOrangeInternet
                      : Images.dashboardInternet
                  }
                  style={styles.imageStyle}
                  resizeMode="contain"
                />
                <View style={{height: hp(1)}} />
                <CustomText
                  style={[
                    styles.dashboardIconText,
                    {color: activeTheme.dashboardIconText},
                  ]}>
                  {`Internet\nPayments`}
                </CustomText>
              </TouchableOpacity>
              <TouchableOpacity
                accessibilityLabel="InternetPayment"
                style={[
                  styles.imageTapView,
                  {backgroundColor: Colors.dashboardIconBack},
                ]}
                onPress={() => {
                  if (isL0Customer) {
                    props.navigation.navigate('OtherConsumers', {
                      data: {
                        routeData: {data: 'educationPayment'},
                        isPayBenef: false,
                        benefObject: '',
                        benefType: benefType.EducationPayment,
                      },
                    });
                    dispatch(
                      setUserObject({
                        otherPayment: {
                          benefType: 8,
                          benefTrans: false,
                        },
                      }),
                    );
                  } else if (isL1Customer) {
                    changeproceedAlert(true);
                  } else {
                    changeproceedAlert(true);
                  }
                }}>
                <Image
                  source={
                    activeTheme.isDarkTheme
                      ? Images.dashboardDarkEducation
                      : activeTheme.isPinkTheme
                      ? Images.dashboardPinkEducation
                      : activeTheme.isIndigoTheme
                      ? Images.dashboardIndigoEducation
                      : activeTheme.isOrangeTheme
                      ? Images.dashboardOrangeEducation
                      : Images.dashboardEducation
                  }
                  style={styles.imageStyle}
                  resizeMode="contain"
                />
                <View style={{height: hp(1)}} />
                <CustomText
                  style={[
                    styles.dashboardIconText,
                    {color: activeTheme.dashboardIconText},
                  ]}>
                  {`Education\nPayments`}
                </CustomText>
              </TouchableOpacity>
              <TouchableOpacity
                accessibilityLabel="Investment"
                style={[
                  styles.imageTapView,
                  {backgroundColor: Colors.dashboardIconBack},
                ]}
                onPress={() => {
                  if (isL0Customer) {
                    props.navigation.navigate('InvestmentScreen');
                  } else if (isL1Customer) {
                    changeproceedAlert(true);
                  } else {
                    changeproceedAlert(true);
                  }
                }}>
                <Image
                  source={
                    activeTheme.isDarkTheme
                      ? Images.dashboardDarkInvestment
                      : activeTheme.isPinkTheme
                      ? Images.dashboardPinkInvestment
                      : activeTheme.isIndigoTheme
                      ? Images.dashboardIndigoInvestment
                      : activeTheme.isOrangeTheme
                      ? Images.dashboardOrangeInvestment
                      : Images.dashboardInvestment
                  }
                  style={styles.imageStyle}
                  resizeMode="contain"
                />
                <View style={{height: hp(1)}} />
                <CustomText
                  style={[
                    styles.dashboardIconText,
                    {color: activeTheme.dashboardIconText},
                  ]}>
                  {`Investments`}
                </CustomText>
              </TouchableOpacity>
            </View>
            {/* row4 ends here */}
          </View>
          {isRAAST ? <View style={styles.pagesTaps}></View> : null}
        </ScrollView>
        {/* <View style={{height: hp(1)}} /> */}
      </View>
    );
  };
  return (
    <View
      style={[
        styles.container,
        {backgroundColor: Colors.dashboardBackGroundColor},
      ]}
      accessibilityLabel="Dashboard Screen">
      {/* Header  */}
      {/* Balance Viw
       */}
      <View style={{flex: 0.07, backgroundColor: Colors.dashboardHeaderBack}}>
        {Header()}
      </View>
      {accountDetailView()}
      <View style={{flex: 0.58, justifyContent: 'center'}}>
        {ScrollAbleMenu()}
      </View>
      {BottomNav()}

      <CustomAlert
        overlay_state={overlay_state}
        iscancelbtn={false}
        onPressOkay={() => {
          setOverlayState(false);
        }}
        alert_text={alerttext}
      />
      <CustomAlert
        overlay_state={mpinAlertState}
        onPressCancel={() => setMpinAlertState(false)}
        yesNoButtons={true}
        onPressYes={() => {
          setMpinAlertState(false);
          setTimeout(() => {
            props.navigation.navigate('AddVirtualCardMpin');
          }, 500);
        }}
        onPressNo={() => {
          logs.log('sad');
          setMpinAlertState(false);
        }}
        title={'QR Payments'}
        alert_text={Message.digitalDebitActivated}
        accessibilityLabel={Message.digitalDebitActivated}
      />
      <CustomAlert
        overlay_state={showLogoutAlert}
        onCancel={() => changeLogoutAlertState(false)}
        onPressCancel={() => changeLogoutAlertState(false)}
        yesNoButtons={true}
        onPressYes={() => {
          changeLogoutAlertState(false);
          dispatch(logOutOfAccount(props.navigation));

          props.navigation.dispatch(
            CommonActions.reset({
              index: 0,
              routes: [{name: 'Login'}],
            }),
          );
        }}
        onPressNo={() => {
          changeLogoutAlertState(false);
        }}
        alert_text={'Are you sure you want to ljogout?'}
        defaultAlert={true}
      />
      <CustomAlert
        overlay_state={noCardAlertState}
        onPressCancel={() => {
          setNoCardAlertState(false);
        }}
        yesNoButtons={true}
        onPressYes={() => {
          setNoCardAlertState(false);
          setTimeout(() => {
            dispatch(agreeToAddVirtualCard(props.navigation));
          }, 500);
        }}
        onPressNo={() => {
          setNoCardAlertState(false);
        }}
        title={'QR Payments'}
        alert_text={Message.digitalDebitOption}
        accessibilityLabel="Please add digital debit card for QR Payments.\nDo you want to add Digital Debit Card?"
      />
      <CustomAlert
        overlay_state={proceedAlert}
        title={'Upgrade Registration'}
        accessibilityLabel={'Upgrade Registration'}
        label={'Upgrade User'}
        alert_text={
          isL1Customer
            ? 'Dear Customer, Your registration has been upgraded but your transaction activation is pending. You will be contacted by NBP call center representative. You may contact NBP call center also for activation at 021-111-627-627.'
            : I18n[
                'You need to Upgrade your registration to unlock all features .Do you want to upgrade?'
              ]
        }
        yesNoButtons={isL1Customer ? false : true}
        onPressYes={() => {
          changeproceedAlert(false);
          setTimeout(() => {
            props.navigation.navigate('Upgrade_Debit_no', {
              screen: 'dashboard',
            });
          }, 500);
        }}
        onPressNo={() => {
          changeproceedAlert(false);
        }}
        onPressOkay={() => {
          changeproceedAlert(false);
        }}
        onPressCancel={() => changeproceedAlert(false)}
      />
      <Modal
        //  backdropOpacity={0.3}
        animationIn={'fadeInDownBig'}
        animationOut={'fadeOutDownBig'}
        //  onBackButtonPress={() => {}}
        backdropOpacity={0}
        isVisible={fullScreenModal}
        onBackButtonPress={() => {}}
        onBackdropPress={() => {}}></Modal>
      <CustomAlert
        // noTitle={true}
        onTermPress={() => {
          setBVSAlert(false);
          props?.navigation.navigate('TermsandCond');
        }}
        isBvs={bvcCheck}
        onCheckBoxPress={() => {
          setbvsCheck(!bvcCheck);
        }}
        closeBtnOff={true}
        overlay_state={bvcAlert}
        bvsCheck={true}
        onPressOkay={() => {
          if (bvcCheck) {
            setBVSAlert(false);
            bvsStatusChange();
          }
        }}
        alert_text={
          'I authorize Bank to use biometric verification performed at the time of account opening for activation of NBP Digital Banking Services.'
        }
      />
      <CustomModal
        visible={shareModal}
        headtext={'Share Accounts Details'}
        data={data}
        onPress_item={(param) => {
          setShareModal(false);
          if (param.code == 'Account001') {
            logs.log(param.code, 'jks');
            logs.log('Onpress share in If', param);

            getDefaultAccountByAlias(false);
          } else {
            getpkrAccounts(param.code, 'bye');
            logs.log('Onpress share', param);
            logs.log('Onpress share in Else', param);
          }
        }}
        onCancel={() => {
          setShareModal(false);
        }}
      />

      <Modal
        isVisible={false}
        backdropOpacity={0.3}
        animationIn={'fadeInDownBig'}
        animationOut={'fadeOutDownBig'}
        onBackButtonPress={() => {}}
        onBackdropPress={() => {
          hideFloodReliefBanner();
        }}>
        <TouchableHighlight
          underlayColor={'transparent'}
          onPress={() => {
            hideFloodReliefBanner();
            props.navigation.navigate('FloodRelief');
          }}>
          <ImageBackground
            source={Images.floodReliefBanner}
            style={{
              width: wp(85),
              height: wp(155),
              alignSelf: 'center',
            }}
            borderRadius={wp(3)}>
            <View style={{height: wp(2)}}></View>

            <IonIcons
              name={'close-circle'}
              size={wp(7)}
              color={Colors.whiteColor}
              onPress={() => {
                hideFloodReliefBanner();
              }}
              style={{
                alignSelf: 'flex-start',
                marginLeft: wp(2),
                borderRadius: wp(100),
              }}
            />
          </ImageBackground>
        </TouchableHighlight>
      </Modal>
      <RAASTModal
        check={checkBoxRAAST}
        visible={isRAAST ? debitCardBanner : false}
        headtext={'RAAST'}
        raastMessage={`Create/Register your Raast ID by Linking your Registered Mobile Number with your account. Your mobile number will be your Raast ID to receive funds from other banks.`}
        onPress_item={() => {
          logs.log('OKAY HA YA1 onPress_item');
        }}
        onCancel={() => {
          hideDebitCardBanner();
          // BillIntimation();
          rtplResquest(payNowData);
        }}
        onPress_yes={() => {
          hideDebitCardBanner();
          raastRegister();
        }}
        onPressCheck={() => {
          setCheckBoxRAAST(!checkBoxRAAST);
          logs.log('OKAY HA YA1 onPressCheck');
        }}
        onPress_no={() => {
          logs.log('OKAY HA YA1 onPress_no');
        }}
      />
    </View>
  );
});

export default Dashboard;
