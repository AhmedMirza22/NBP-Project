import {logs} from '../../Config/Config';
import * as actionTypes from '../Action/types';

const initialState = {
  Localiztion: {
    language: {
      languageCode: 'en',
      languageId: 1,
      languageName: 'English',
    },
  },
  billersCache: [],
  alertStatus: {},
  splashscreenstate: false,
  token: '',
  InformationPage: {},
  loader: false,
  responseAlert: false,
  responseAlertObject: {},
  overViewData: [],
  ufoneBundles: [],
  isDashboardCall: false,
  viewAccountsData: [],
  viewcitycode: [],
  viewAccountStatementData: [],
  manageAccounts: {},
  managedAccountDetails: {},
  mobileTopUpLimits: {},
  mobileTopUpBeneficiaryData: {},
  mobileTopUpBillPayment: {},
  mobileTopUpBillPayedResponse: {},
  userSignedIn: '',
  eTransactionData: [],
  addAccountResponse: {},
  myAccounts: [],
  beneficiaries: [],
  interBankFundsTransferData: {},
  utilityBillPaymentData: {},
  billObject: {},
  responseObject: {},
  fundTransferData: {},
  elseResponse: {},
  atm_pin: [],
  touchIdSupport: false,
  faceIdSupport: false,
  fingerPrintState: false,
  askForFingerPrintState: false,
  fcmToken: '',
  webViewHTML: '',
  currentFlow: '',
  statusBarString: 'login',
  virtualCardAlertOnce: false,
  virtualCardAlertOnceAlertState: true,
  globalAlertState: {
    state: false,
    navigation: false,
  },
  globalIconAlerState: {
    state: false,
    navigation: false,
  },
  globalTransferAlertState: {
    state: false,
    navigation: false,
  },
  globalAlertTransfer: {
    state: false,
    navigation: false,
  },
  alertFlag: false,
  currentNavigation: {},
  qrState: false,
  qrResponse: '',
  qrGenerateState: false,
  qrGenerateValue: '',
  loginResponse: {},
  virtualCardDataOne: {},
  virtualCardDataTwo: {},
  virtualCardDataThree: {},
  virtualCardDataFour: {},
  virtualCardDataFive: {},
  virtualCardObject: {},
  cardFaceDownloading: {},
  virtualCardMpin: '',
  virtualCardStatus: false,
  ecommerceData: {},
  cvvAlertState: false,
  scannedQrObject: {},
  apiHit: false,
  qrString: '',
  mapData: [],
  balance: '',
  atmPins: [],
  merchantPins: [],
  nfcSupport: false,
  nfcEnabled: false,
  nfcCheck: false,
  requestResponseNavigation: {},
  debit_card_status: 'No Card Status',
  isLoginState: false,
  sslPinSuccessState: true,
  keychainObject: {},
  jailBrokenAlertState: false,
  balanceInquery: false,
  banner: false,
  pkraccounts: [],
  aliases: [],
  raastbank: [],
  bankList: [],

  upgradeRegister: false,
  successModal: false,
  userObject: {},
  customerLevel: false,
  logInState: false,
};

export default function (state = initialState, action) {
  switch (action.type) {
    case actionTypes.SET_TOKEN:
      logs.log(`LATEST DISPATCHED TOKEN : ${action.payload}`);
      return {
        ...state,
        token: action.payload,
      };
    case actionTypes.SET_LOADER:
      return {
        ...state,
        loader: action.payload,
      };
    case actionTypes.SET_BANNER:
      return {
        ...state,
        banner: action.payload,
      };
    case actionTypes.SET_ATM_PINS:
      return {
        ...state,
        atm_pin: action.payload,
      };
    case actionTypes.SET_SUCCESS_MODAL_STATE:
      return {
        ...state,
        successModal: action.payload,
      };

    case actionTypes.SET_USER_SIGNED_IN:
      return {
        ...state,
        userSignedIn: action.payload,
      };
    case actionTypes.SET_OVERVIEW_DATA:
      logs.log('inside the reducer of OVerView Data', action.payload);
      return {
        ...state,
        overViewData: action.payload,
      };
    case actionTypes.UFONE_BUNDLES:
      return {
        ...state,
        ufoneBundles: action.payload,
      };
    case actionTypes.SET_BILLERS_DATA:
      return {
        ...state,
        billersCache: action.payload,
      };
    case actionTypes.SET_DASHBOARD_CHECK:
      return {
        ...state,
        isDashboardCall: action.payload,
      };
    case actionTypes.SET_OVERVIEW:
      return {
        ...state,
        overview: action.payload,
      };
    case actionTypes.SET_VIEW_ACCOUNTS_DATA:
      return {
        ...state,
        viewAccountsData: action.payload,
      };
    case actionTypes.SET_PKR_ACCOUNTS_DATA:
      return {
        ...state,
        pkraccounts: action.payload,
      };
    case actionTypes.SET_CITY_CODE:
      return {
        ...state,
        viewcitycode: action.payload,
      };
    case actionTypes.SET_RAAST_BANK:
      return {
        ...state,
        raastbank: action.payload,
      };
    case actionTypes.SET_BANK_LIST:
      return {
        ...state,
        bankList: action.payload,
      };

    case actionTypes.SET_UPGRADE_REGISTRATION:
      return {
        ...state,
        upgradeRegister: action.payload,
      };
    case actionTypes.SET_DEBIT_CARD_STATUS:
      return {
        ...state,
        debit_card_status: action.payload,
      };
    case actionTypes.SET_VIEW_ACCOUNT_STATEMENT_DATA:
      return {
        ...state,
        viewAccountStatementData: action.payload,
      };
    case actionTypes.ALERT_STATUS:
      return {
        ...state,
        alertStatus: action.payload,
      };
    case actionTypes.SPLASHSCREEN_STATE:
      return {
        ...state,
        splashscreenstate: action.payload,
      };

    case actionTypes.SET_MANAGE_ACCOUNTS_DATA:
      return {
        ...state,
        manageAccounts: action.payload,
      };
    case actionTypes.SET_MANAGED_ACCOUNT_DETAILS:
      return {
        ...state,
        managedAccountDetails: action.payload,
      };

    case actionTypes.SET_ALIAS_ACC:
      return {
        ...state,
        aliases: action.payload,
      };
    case actionTypes.SET_MOBILE_TOP_UP_LIMITS:
      return {
        ...state,
        mobileTopUpLimits: action.payload,
      };
    case actionTypes.SET_MOBILE_TOP_UP_BENEFICIARY_DATA:
      return {
        ...state,
        mobileTopUpBeneficiaryData: action.payload,
      };
    case actionTypes.SET_MOBILE_TOPUP_BILL_PAYMENT:
      return {
        ...state,
        mobileTopUpBillPayment: action.payload,
      };
    case actionTypes.SET_MOBILE_TOPUP_BILL_PAYMENT:
      return {
        ...state,
        mobileTopUpBillPayedResponse: action.payload,
      };
    case actionTypes.SET_ETRANSACTION_DATA:
      return {
        ...state,
        eTransactionData: action.payload,
      };
    case actionTypes.SET_ADD_ACCOUNT_RESPONSE:
      return {
        ...state,
        addAccountResponse: action.payload,
      };
    case actionTypes.SET_MY_ACCOUNTS:
      return {
        ...state,
        myAccounts: action.payload,
      };
    case actionTypes.SET_BENEFICIARIES:
      return {
        ...state,
        beneficiaries: action.payload,
      };
    case actionTypes.SET_INTER_BANK_FUND_TRANSFER_DATA:
      return {
        ...state,
        interBankFundsTransferData: action.payload,
      };
    case actionTypes.SET_RESPONSE_ALERT:
      return {
        ...state,
        responseAlert: action.payload,
      };
    case actionTypes.SET_RESPONSE_ALERT_OBJECT:
      return {
        ...state,
        responseAlertObject: action.payload,
      };
    case actionTypes.INFORMATION_PAGE:
      return {
        ...state,
        InformationPage: action.payload,
      };
    case actionTypes.SET_UTILITY_BILL_DATA:
      return {
        ...state,
        utilityBillPaymentData: action.payload,
      };
    case actionTypes.SET_BILL_OBJECT:
      return {
        ...state,
        billObject: action.payload,
      };
    case actionTypes.SET_BALANCE_INQERY:
      return {
        ...state,
        balanceInquery: action.payload,
      };

    case actionTypes.SET_RESPONSE_OBJECT:
      return {
        ...state,
        responseObject: action.payload,
      };
    case actionTypes.SET_FUND_TRANSFER_DATA:
      return {
        ...state,
        fundTransferData: action.payload,
      };
    case actionTypes.SET_ELSE_RESPONSE_ALERT:
      return {
        ...state,
        elseResponse: action.payload,
      };
    case actionTypes.SET_TOUCH_ID_SUPPORT:
      return {
        ...state,
        touchIdSupport: action.payload,
      };
    case actionTypes.SET_FACE_ID_SUPPORT:
      return {
        ...state,
        faceIdSupport: action.payload,
      };
    case actionTypes.SET_FINGER_PRINT_STATE:
      return {
        ...state,
        fingerPrintState: action.payload,
      };
    case actionTypes.SET_ASK_FOR_FINGERPRINT:
      return {
        ...state,
        askForFingerPrintState: action.payload,
      };
    case actionTypes.SET_FCM_TOKEN:
      return {
        ...state,
        fcmToken: action.payload,
      };
    case actionTypes.SET_WEB_VIEW_HTML:
      return {
        ...state,
        webViewHTML: action.payload,
      };
    case actionTypes.SET_CURRENT_FLOW:
      return {
        ...state,
        currentFlow: action.payload,
      };
    case actionTypes.VIRTUAL_CARD_ALERT_ONCE:
      return {
        ...state,
        virtualCardAlertOnce: action.payload,
      };
    case actionTypes.VIRTUAL_CARD_ALERT_ONCE_ALERT_STATE:
      return {
        ...state,
        virtualCardAlertOnceAlertState: action.payload,
      };
    case actionTypes.RAAST_ONCE_ALERT_STATE:
      return {
        ...state,
        raastaliasAlertOnceState: action.payload,
      };
    case actionTypes.STATUS_BAR:
      return {
        ...state,
        statusBarString: action.payload,
      };

    case actionTypes.GLOBAL_ALERT_STATE:
      return {
        ...state,
        globalAlertState: action.payload,
      };
    case actionTypes.GLOBAL_ICON_ALERT_STATE:
      return {
        ...state,
        globalIconAlerState: action.payload,
      };
    case actionTypes.GLOBAL_ALERT_TRANSFER:
      return {
        ...state,
        globalAlertTransfer: action.payload,
      };
    case actionTypes.SET_USER_TITLE_UPDATE:
      return {
        ...state,
        loginResponse: {
          ...state.loginResponse,
          details: {
            ...state.loginResponse.details,
            alias: action.payload,
          },
        },
      };
    case actionTypes.SET_CURRENT_FLOW:
      return {
        ...state,
        currentFlow: action.payload,
      };
    case actionTypes.SET_ALERT_FLAG:
      return {
        ...state,
        alertFlag: action.payload,
      };
    case actionTypes.SET_CURRENT_NAVIGATION:
      return {
        ...state,
        currentNavigation: action.payload,
      };
    case actionTypes.SET_QR_SCANNER_STATE:
      return {
        ...state,
        qrState: action.payload,
      };
    case actionTypes.SET_QR_SCANNER_RESPONSE:
      return {
        ...state,
        qrResponse: action.payload,
      };
    case actionTypes.SET_QR_GENERATE_STATE:
      return {
        ...state,
        qrGenerateState: action.payload,
      };
    case actionTypes.SET_GENERATE_VALUE:
      return {
        ...state,
        qrResponse: action.payload,
      };

    case actionTypes.SET_LOGIN_RESPONSE:
      return {
        ...state,
        loginResponse: action.payload,
      };

    case actionTypes.SET_VIRTUAL_CARD_DATA_ONE:
      return {
        ...state,
        virtualCardDataOne: action.payload,
      };
    case actionTypes.SET_VIRTUAL_CARD_DATA_TWO:
      return {
        ...state,
        virtualCardDataTwo: action.payload,
      };
    case actionTypes.SET_VIRTUAL_CARD_DATA_THREE:
      return {
        ...state,
        virtualCardDataThree: action.payload,
      };
    case actionTypes.SET_VIRTUAL_CARD_DATA_FOUR:
      return {
        ...state,
        virtualCardDataFour: action.payload,
      };
    case actionTypes.SET_VIRTUAL_CARD_DATA_FIVE:
      return {
        ...state,
        virtualCardDataFive: action.payload,
      };
    case actionTypes.SET_VIRTUAL_CARD_OBJECT:
      return {
        ...state,
        virtualCardObject: action.payload,
      };

    case actionTypes.SET_CARD_FACE_DOWNLOADING:
      return {
        ...state,
        cardFaceDownloading: action.payload,
      };
    case actionTypes.SET_VIRTUAL_CARD_MPIN:
      return {
        ...state,
        virtualCardMpin: action.payload,
      };
    case actionTypes.SET_VIRTUAL_CARD_STATUS:
      return {
        ...state,
        virtualCardStatus: action.payload,
      };
    case actionTypes.SET_ECOMMERCE_DATA:
      return {
        ...state,
        ecommerceData: action.payload,
      };
    case actionTypes.SET_CVV_ALERT:
      return {
        ...state,
        cvvAlertState: action.payload,
      };
    case actionTypes.SET_GENERATE_QR_CODE:
      return {
        ...state,
        qrGenerateValue: action.payload,
      };
    case actionTypes.SET_SCANNED_QR_OBJECT:
      return {
        ...state,
        scannedQrObject: action.payload,
      };
    case actionTypes.SET_API_HIT:
      return {
        ...state,
        apiHit: action.payload,
      };
    case actionTypes.SET_QR_STRING:
      return {
        ...state,
        qrString: action.payload,
      };
    case actionTypes.SET_MAP_DATA:
      return {
        ...state,
        mapData: action.payload,
      };

    case actionTypes.SET_BALANCE:
      return {
        ...state,
        balance: action.payload,
      };
    case actionTypes.SET_ATM_MARKER_PINS:
      return {
        ...state,
        atmPins: action.payload,
      };
    case actionTypes.SET_MERCHANT_MARKER_PINS:
      return {
        ...state,
        merchantPins: action.payload,
      };
    case actionTypes.SET_NFC_SUPPORT_STATE:
      return {
        ...state,
        nfcSupport: action.payload,
      };
    case actionTypes.SET_NFC_ENABLE_STATE:
      return {
        ...state,
        nfcEnabled: action.payload,
      };
    case actionTypes.SET_NFC_CHECK_TRIGGERED_STATE:
      return {
        ...state,
        nfcCheck: true,
      };
    case actionTypes.SET_REQUEST_RESPONSE_NAVIGATION:
      return {
        ...state,
        requestResponseNavigation: action.payload,
      };

    case actionTypes.SET_IS_LOGIN_STATE:
      return {
        ...state,
        isLoginState: action.payload,
      };

    case actionTypes.SET_SSL_PIN_SUCCESS_STATE:
      return {
        ...state,
        sslPinSuccessState: action.payload,
      };

    case actionTypes.SET_KEYCHAIN_OBJECT:
      logs.log(
        `REDUCER SET_KEYCHAIN_OBJECT is : ${JSON.stringify(action.payload)}`,
      );
      return {
        ...state,
        keychainObject: action.payload,
      };
    case actionTypes.SET_JAIL_BROKEN_ALERT_STATE:
      return {
        ...state,
        jailBrokenAlertState: action.payload,
      };
    case actionTypes.SET_USER_OBJECT:
      return {
        ...state,
        userObject: action.payload,
      };

    case actionTypes.SET_CUSTOMER_LEVEL:
      return {
        ...state,
        customerLevel: action.payload,
      };
    case actionTypes.SET_LOCALIZATION:
      return {
        ...state,
        Localiztion: action.payload,
      };
    case actionTypes.LOGIN_STATE_UPDATE:
      return {
        ...state,
        logInState: action.payload,
      };
    case actionTypes.CLEAR_APP_DATA:
      return {
        Localiztion: {
          language: {
            languageCode: 'en',
            languageId: 1,
            languageName: 'English',
          },
        },
        ...state,
        token: '',
        alertStatus: {},
        splashscreenstate: false,
        statusBarString: '',
        balance: '',
        overViewData: [],
        isDashboardCall: false,
        overview: [],
        viewAccountsData: [],
        viewAccountStatementData: [],
        manageAccounts: {},
        managedAccountDetails: {},
        mobileTopUpLimits: {},
        mobileTopUpBeneficiaryData: {},
        mobileTopUpBillPayment: {},
        mobileTopUpBillPayedResponse: {},
        userSignedIn: '',
        eTransactionData: [],
        addAccountResponse: {},
        myAccounts: [],
        beneficiaries: [],
        interBankFundsTransferData: {},
        responseAlertObject: {},
        utilityBillPaymentData: {},
        billObject: {},
        responseObject: {},
        fundTransferData: {},
        currentNavigation: {},
        elseResponse: {},
        webViewHTML: '',
        currentFlow: '',
        virtualCardAlertOnce: false,
        virtualCardAlertOnceAlertState: true,
        raastaliasAlertOnceState: true,
        globalAlertState: {
          state: false,
          navigation: false,
        },
        globalIconAlerState: {
          state: false,
          navigation: false,
        },
        globalTransferAlertState: {
          state: false,
          navigation: false,
        },
        globalAlertTransfer: {
          state: false,
          navigation: false,
        },
        alertFlag: false,
        virtualCardMpin: '',
        userObject: {},
        upgradeRegister: false,
      };
    default:
      return state;
  }
}
