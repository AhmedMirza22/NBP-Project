import axios from 'axios';
import {
  Config,
  appInfoObject_ForServices,
  deviceVersionString,
  globalPaymentTypes,
  logs,
  appInfo,
  jailbrokenAllow,
} from '../../Config/Config';
import * as actionTypes from './types';
import {Platform, Alert, Linking} from 'react-native';
import {CommonActions} from '@react-navigation/native';
import store from '../Store/Store';
import TouchID from 'react-native-touch-id';
import DeviceInfo from 'react-native-device-info';
import AsyncStorage from '@react-native-async-storage/async-storage';
import messaging from '@react-native-firebase/messaging';
import {post_login} from '../../API/API';
import * as Keychain from 'react-native-keychain';
import ReactNativeBiometrics from 'react-native-biometrics';
import {capitalizeFirstLetter, globalStyling} from '../../Constant';
import {geoLocation, sessionControl} from '../../Config/Service/index';
import QRCodeScanner from 'react-native-qrcode-scanner';
import {RNCamera} from 'react-native-camera';
import SdkComponent from '../../SdkService/SdkModule';
import NetInfo from '@react-native-community/netinfo';
// import {} from '../../'
import {deactivateCard, deleteCardLifeCycle} from '../../SdkService';
import JailMonkey from 'jail-monkey';
import RNExitApp from 'react-native-exit-app';
import moment from 'moment';
import I18n from '../../Config/Language/LocalizeLanguageString';
const optionalConfigObject = {
  title: 'Authentication Required', // Android
  imageColor: '#e00606', // Android
  imageErrorColor: '#ff0000', // Android
  sensorDescription: 'Touch sensor', // Android
  sensorErrorDescription: 'Failed', // Android
  cancelText: 'Cancel', // Android
  fallbackLabel: 'Show Passcode', // iOS (if empty, then label is hidden)
  unifiedErrors: false, // use unified error messages (default false)
  passcodeFallback: false, // iOS - allows the device to fall back to using the passcode, if faceid/touch is not available. this does not mean that if touchid/faceid fails the first few times it will revert to passcode, rather that if the former are not enrolled, then it will use the passcode.
};
export const internetListener = () => async (dispatch) => {
  NetInfo.addEventListener((state) => {
    logs.log('Connection type', state.type);
    logs.log('Is connected?', state.isConnected);
  });
};
const repeatInternetListener = () => async (dispatch) => {
  NetInfo.fetch().then((state) => {
    if (!state.isConnected) {
      logs.log('not connected');
    } else {
      // checkUser();
      logs.log('connected');
    }
  });
};

////////////////////////////// CODE ENDS FOR TOUCH ID ///////////////////////////////////

// ***** ELSE RESPONSE ***** //

// const staticResponse = (responseStatic, navigation) => async (dispatch) => {
//   if (responseStatic.headers['x-auth-next-token']) {
//     dispatch({
//       type: actionTypes.SET_TOKEN,
//       payload: responseStatic.headers['x-auth-next-token'],
//     });
//   }
//     navigation.dispatch(
//       CommonActions.reset({
//         index: 0,
//         routes: [{name: 'Login'}],
//       }),
//     );
//     dispatch({
//       type: actionTypes.CLEAR_APP_DATA,
//     });
//   }

//   dispatch({
//     type: actionTypes.SET_LOADER,
//     payload: false,
//   });

//   dispatch({
//     type: actionTypes.SET_ELSE_RESPONSE_ALERT,
//     payload: {
//       state: true,
//       alertTitle: '',
//       alertText: responseStatic.data?.data?.message
//         ? responseStatic.data.data.message
//         : responseStatic.data.responseDescription,
//     },
//   });
// };

// ***** ENDS ELSE RESPONSE ***** //

// ***** DEFAULT/VERSION CHECK *****
export const versionCheck =
  (onPress, onSuccess, onFaliure) => async (dispatch) => {
    var bodyFormData = new FormData();
    bodyFormData.append(`version`, `${DeviceInfo.getVersion()}`);
    bodyFormData.append(
      `deviceData`,
      `${DeviceInfo.getBrand()}%20${DeviceInfo.getDeviceNameSync()
        .replace(/\s+/g, '%20')
        .toLowerCase()},%20${DeviceInfo.getVersion()},%20${capitalizeFirstLetter(
        Platform.OS,
      )}%20SDK:%20${DeviceInfo.getApiLevelSync()}%20(${DeviceInfo.getSystemVersion()}),%20Device%20ID:%${DeviceInfo.getUniqueId()}`,
    );

    logs.logRequest(
      `${Config.base_url.UAT_URL}${Config.method.webpages}/${
        Config.endpoint.version
      },
  ${JSON.stringify(bodyFormData)},`,
    );

    axios
      .post(
        `${Config.base_url.UAT_URL}${Config.method.webpages}/${Config.endpoint.version}`,
        bodyFormData,
      )
      .then((response) => {
        if (response.data?.responseCode === '00') {
          logs.logResponse('RaffayZoro====>', response.data);
          dispatch({
            type: actionTypes.SET_LOADER,
            payload: false,
          });
          let smsShortCode = response.data?.data?.smsShortCode;
          let bannerbase64 = response.data?.data?.banners;
          let latestVersion,
            minVersion,
            myVersion = String(Config.versions.applicationVersion).replace(
              /[^\w\s]/gi,
              '',
            );
          // myVersion;
          if (Platform.OS === 'android') {
            let androidSplitString = String(
              response.data?.data?.androidMaxVersion,
            ).split(',');
            // latestVersion = response.data?.data?.androidMaxVersion
            //   ? String(response.data.data.androidMaxVersion).replace(
            //       /[^\w\s]/gi,
            //       '',
            //     )
            //   : '';
            latestVersion = String(
              androidSplitString[androidSplitString.length - 1],
            ).replace(/[^\w\s]/gi, '');
            minVersion = response.data?.data?.androidVersion
              ? String(response.data.data.androidVersion).replace(
                  /[^\w\s]/gi,
                  '',
                )
              : '';
            logs.log('latestVersion', latestVersion, 'minVersion', minVersion);
          } else {
            let iosSplitString = String(
              response.data?.data?.iosMaxVersion,
            ).split(',');
            latestVersion = String(
              iosSplitString[iosSplitString.length - 1],
            ).replace(/[^\w\s]/gi, '');

            minVersion = response.data?.data?.iosVersion
              ? String(response.data.data.iosVersion).replace(/[^\w\s]/gi, '')
              : '';
          }
          logs.log(`latest version is  ${latestVersion}`);
          if (latestVersion !== '') {
            logs.log(
              `myVersion : ${myVersion} , latestVersion : ${latestVersion} , minVersion : ${minVersion}`,
            );
            if (
              Number(myVersion) >= Number(minVersion) &&
              Number(myVersion) <= Number(latestVersion)
            ) {
              logs.log('version are fine do nothing');
            } else {
              logs.log(
                `!store.getState().reducers.elseResponse?.state :
            ${!store.getState().reducers.elseResponse?.state},
            myVersion :
            ${myVersion},
             latestVersion: :
            ${latestVersion},
         `,
              );
              if (!store.getState().reducers.elseResponse?.state) {
                logs.log('SET_ELSE_RESPONSE_ALERT ');
                dispatch({
                  type: actionTypes.SET_ELSE_RESPONSE_ALERT,
                  payload: {
                    state: true,
                    latestVersion: latestVersion,
                    myVersion: myVersion,
                    alertTitle: 'Security Alert',
                    alertText: `You are using the Older Version of NBP application ,Please update the application from ${
                      Platform.OS === 'android' ? 'PlayStore' : 'AppStore'
                    } to use this app.`,
                    onPress: () => {
                      onPress();
                    },
                  },
                });
              }
            }
          }
          logs.log(`--asdasdasdasd$$$${response.data.data?.billerVersion}`);
          let obj = {
            currentVersion: myVersion,
            maxVersion: latestVersion,
            minVersion: minVersion,
            smsShortCode: smsShortCode,
            versionObject: response.data.data,
            bannerbase64: bannerbase64,
          };
          onSuccess(store.getState().reducers.keychainObject, obj);
        } else {
          dispatch(setLoader(false));
          onFaliure(response);
        }
      })
      .catch((error) => {
        dispatch({
          type: actionTypes.SET_LOADER,
          payload: false,
        });
        let message = '';
        if (!error.status) {
          // network error
          message = Message.networkErrorMessage;
        } else {
          message = String(error);
        }
        dispatch({
          type: actionTypes.SET_ELSE_RESPONSE_ALERT,
          payload: {
            state: true,
            alertTitle: 'Login',
            alertText: message,
          },
        });
      });
  };

///Finger Print creating key chain
export const functionUpdateWithDeletedKeychainObject =
  (object) => async (dispatch) => {
    await Keychain.setGenericPassword('keyChainObject', JSON.stringify(object));
    dispatch({
      type: actionTypes.SET_KEYCHAIN_OBJECT,
      payload: object,
    });
  };
export const updateWithDeletedKeychainObjectLOgin =
  (object) => async (dispatch) => {
    await Keychain.setGenericPassword('keyChainObject', JSON.stringify(object));
    dispatch({
      type: actionTypes.SET_KEYCHAIN_OBJECT,
      payload: object,
    });
  };

export const changeAlertStatus = (payload) => async (dispatch) => {
  dispatch({
    type: actionTypes.ALERT_STATUS,
    payload: payload,
  });
};

const touchIdSupport = store.getState().reducers.touchIdSupport;
let isbioactive;
ReactNativeBiometrics.isSensorAvailable().then((resultObject) => {
  const {available, biometryType} = resultObject;
  if (available && biometryType === ReactNativeBiometrics.TouchID) {
    logs.log('touch is supported');
    isbioactive = 'touch';
  } else if (available && biometryType === ReactNativeBiometrics.FaceID) {
    logs.log('face is supported');
    isbioactive = 'face';
  } else if (available && biometryType === ReactNativeBiometrics.Biometrics) {
    logs.log('Biometrics is supported');
    isbioactive = 'touch';
  } else {
    logs.log('login Biometrics not supported');
  }
});
export const changeSplashScreenState = () => async (dispatch) => {
  dispatch({
    type: actionTypes.SPLASHSCREEN_STATE,
    payload: true,
  });
};

// ***** ENDS DEFAULT/VERSION CHECK *****
// internat connectivity call
const checkNetworkConnectivityInternal = () => async (dispatch) => {
  //https://nbp-service-dev.nbp.p.azurewebsites.net/api/v1/webpages/version?version=1.0&deviceData=motorola%20moto%20x4,%201.0,%20Android%20SDK:%2028%20(9),%20Device%20ID:%d82f31193f28892a
  dispatch({
    type: actionTypes.SET_LOADER,
    payload: true,
  });
  axios
    .post(
      `${Config.base_url.UAT_URL}${Config.method.webpages}/${
        Config.endpoint.version
      }?version=${
        Config.versions.applicationVersion
      }&deviceData=${DeviceInfo.getBrand()}%20${DeviceInfo.getDeviceNameSync()
        .replace(/\s+/g, '%20')
        .toLowerCase()},%20${
        Config.versions.applicationVersion
      },%20${capitalizeFirstLetter(
        Platform.OS,
      )}%20SDK:%20${DeviceInfo.getApiLevelSync()}%20(${DeviceInfo.getSystemVersion()}),%20Device%20ID:%${DeviceInfo.getUniqueId()}`,
    )
    .then((response) => {
      dispatch({
        type: actionTypes.SET_LOADER,
        payload: false,
      });
      setTimeout(() => {
        dispatch({
          type: actionTypes.SET_ELSE_RESPONSE_ALERT,
          payload: {
            state: false,
            alertTitle: '',
            alertText: '',
          },
        });
      }, 500);
    })
    .catch((error) => {
      dispatch({
        type: actionTypes.SET_LOADER,
        payload: false,
      });
      let message = '';
      if (!error.status) {
        // network error
        message = Message.networkErrorMessage;
      } else {
        message = String(error);
      }
      setTimeout(() => {
        dispatch({
          type: actionTypes.SET_ELSE_RESPONSE_ALERT,
          payload: {
            state: true,
            alertTitle: '',
            alertText: message,
          },
        });
      }, 500);
    });
};

// ends
// ***** CHECK INTERNET CONNECTIVITY *****//
export const checkNetworkConnectivity = () => async (dispatch) => {
  //https://nbp-service-dev.nbp.p.azurewebsites.net/api/v1/webpages/version?version=1.0&deviceData=motorola%20moto%20x4,%201.0,%20Android%20SDK:%2028%20(9),%20Device%20ID:%d82f31193f28892a
  dispatch({
    type: actionTypes.SET_LOADER,
    payload: true,
  });
  axios
    .post(
      `${Config.base_url.UAT_URL}${Config.method.webpages}/${
        Config.endpoint.version
      }?version=${
        Config.versions.applicationVersion
      }&deviceData=${DeviceInfo.getBrand()}%20${DeviceInfo.getDeviceNameSync()
        .replace(/\s+/g, '%20')
        .toLowerCase()},%20${
        Config.versions.applicationVersion
      },%20${capitalizeFirstLetter(
        Platform.OS,
      )}%20SDK:%20${DeviceInfo.getApiLevelSync()}%20(${DeviceInfo.getSystemVersion()}),%20Device%20ID:%${DeviceInfo.getUniqueId()}`,
    )
    .then((response) => {
      dispatch({
        type: actionTypes.SET_LOADER,
        payload: false,
      });
      setTimeout(() => {
        dispatch({
          type: actionTypes.SET_ELSE_RESPONSE_ALERT,
          payload: {
            state: false,
            alertTitle: '',
            alertText: '',
          },
        });
      }, 500);
    })
    .catch((error) => {
      dispatch({
        type: actionTypes.SET_LOADER,
        payload: false,
      });
      let message = '';
      if (!error.status) {
        // network error
        message = Message.networkErrorMessage;
      } else {
        message = String(error);
      }
      setTimeout(() => {
        dispatch({
          type: actionTypes.SET_ELSE_RESPONSE_ALERT,
          payload: {
            state: true,
            alertTitle: '',
            alertText: message,
          },
        });
      }, 500);
    });
};
// ***** ENDS CHECK INTERNET CONNECTIVITY *****//

// ***** CHANGE TOKEN STATE *****
export const setToken = (tokenValue) => async (dispatch) => {
  dispatch({
    type: actionTypes.SET_TOKEN,
    payload: tokenValue,
  });
};
// ***** END CHANGE TOKEN STATE *****

// ***** SHOW ONCE VIRTUAL CARD ALERT ***** //

export const showOnceVirtualCardAlertState = () => async (dispatch) => {
  const credentials = await Keychain.getGenericPassword();
  let parsedCredential;
  if (credentials) {
    parsedCredential = JSON.parse(credentials.password);
  } else {
    parsedCredential = {};
  }

  if (parsedCredential.virtualCardAlertOnce) {
    if (parsedCredential.virtualCardAlertOnce !== 'hide') {
      dispatch({
        type: actionTypes.VIRTUAL_CARD_ALERT_ONCE,
        payload: true,
      });
    } else {
      dispatch({
        type: actionTypes.VIRTUAL_CARD_ALERT_ONCE,
        payload: false,
      });
    }
  } else {
    dispatch({
      type: actionTypes.VIRTUAL_CARD_ALERT_ONCE,
      payload: true,
    });
  }
};

// ***** ENDS SHOW ONCE VIRTUAL CARD ALERT ***** //

// ***** CHANGE ONCE VIRTUAL CARD ALERT ***** //

export const changeOnceVirtualCardAlertState = (state) => async (dispatch) => {
  dispatch(setKeyChainObject({virtualCardAlertOnce: state}));
  dispatch({
    type: actionTypes.VIRTUAL_CARD_ALERT_ONCE,
    payload: state === 'hide' ? false : true,
  });
};

// ***** ENDS CHANGE ONCE VIRTUAL CARD ALERT ***** //

// ***** CHANGE ONCE VIRTUAL CARD ALERT SESSION STATE ***** //

export const changeOnceVirtualCardAlertSessionState =
  (state) => async (dispatch) => {
    dispatch({
      type: actionTypes.VIRTUAL_CARD_ALERT_ONCE_ALERT_STATE,
      payload: state,
    });
  };

// ***** ENDS CHANGE ONCE VIRTUAL CARD ALERT SESSION STATE  ***** //

//***********RAAAST ALERT SESSION STATE***// */
export const changeonceraastalertSessionState = (state) => async (dispatch) => {
  dispatch({
    type: actionTypes.RAAST_ONCE_ALERT_STATE,
    payload: state,
  });
};
//***********RAAAST ALERT SESSION STATE***// */

export const generateMpin = (mpin, confirmMpin) => async (dispatch) => {
  dispatch({
    type: actionTypes.SET_LOADER,
    payload: true,
  });

  axios
    .post(
      `${Config.base_url.UAT_URL}${Config.method.mpin}/${Config.endpoint.generate}`,
      {
        mPin: mpin,
        reEntermPin: confirmMpin,
        channel: `${Config.channel.channel}`,
      },
      {
        headers: {
          'X-Auth-Token': store.getState().reducers.token,
        },
      },
    )
    .then((response) => {
      if (response.status === 200 && response.data.responseCode === '00') {
        dispatch({
          type: actionTypes.SET_TOKEN,
          payload: response?.headers?.['x-auth-next-token'],
        });
        dispatch({
          type: actionTypes.SET_ELSE_RESPONSE_ALERT,
          payload: {
            state: true,
            alertTitle: '',
            alertText: I18n['MPIN Generated Successfully.'],
          },
        });
      } else {
        if (response?.headers?.['x-auth-next-token']) {
          dispatch({
            type: actionTypes.SET_TOKEN,
            payload: response?.headers?.['x-auth-next-token'],
          });
        }
        if (sessionControl(response)) {
          navigation.dispatch(
            CommonActions.reset({
              index: 0,
              routes: [{name: 'Login'}],
            }),
          );
          dispatch({
            type: actionTypes.CLEAR_APP_DATA,
          });
        }

        dispatch({
          type: actionTypes.SET_LOADER,
          payload: false,
        });

        dispatch({
          type: actionTypes.SET_ELSE_RESPONSE_ALERT,
          payload: {
            state: true,
            alertTitle: '',
            alertText: response.data?.data?.message
              ? response.data.data.message
              : response.data.responseDescription,
          },
        });
      }
    })
    .catch((error) => {
      dispatch({
        type: actionTypes.SET_LOADER,
        payload: false,
      });
      let message = '';
      if (!error.status) {
        // network err
        message = Message.networkErrorMessage;
      } else {
        message = String(error);
      }
      dispatch({
        type: actionTypes.SET_ELSE_RESPONSE_ALERT,
        payload: {
          state: true,
          alertTitle: 'Add Account',
          alertText: message,
        },
      });
    });

  //   --> POST https://nbp-service-dev.nbp.p.azurewebsites.net/api/v1/mpin/generate http/1.1
  // X-Auth-Token: 317de131-ef9a-4c76-9435-7b30eaaf1109
  // {"mPin":"1111","reEntermPin":"1111"}
};

// ***** CHANGE LOADER STATE *****
export const setLoader = (state) => async (dispatch) => {
  dispatch({
    type: actionTypes.SET_LOADER,
    payload: state,
  });
};

export const setBillersCache = (state) => async (dispatch) => {
  dispatch({
    type: actionTypes.SET_BILLERS_DATA,
    payload: state,
  });
};
// ***** END CHANGE LOADER STATE *****

// ***** GET WEBVIEW LINK *****//
export const getWebViewHTML = (apiEndpoint, navigation) => async (dispatch) => {
  dispatch({
    type: actionTypes.SET_WEB_VIEW_HTML,
    payload: '<div></div>',
  });

  axios
    .get(`${Config.base_url.UAT_URL}${Config.method.webpages}/${apiEndpoint}`)
    .then((response) => {
      if (response.status === 200) {
        const fixedStr = response.data.replace(
          /(<\/[^>]+>)\s+(<)/gm,
          (substring, group1, group2) => {
            return `${group1}<span style="color: transparent">_</span>${group2}`;
          },
        );
        dispatch({
          type: actionTypes.SET_WEB_VIEW_HTML,
          payload: fixedStr,
        });
        if (response?.headers?.['x-auth-next-token']) {
          dispatch({
            type: actionTypes.SET_TOKEN,
            payload: response?.headers?.['x-auth-next-token'],
          });
        }
      } else {
        if (response?.headers?.['x-auth-next-token']) {
          dispatch({
            type: actionTypes.SET_TOKEN,
            payload: response?.headers?.['x-auth-next-token'],
          });
        }
        if (sessionControl(response)) {
          navigation.dispatch(
            CommonActions.reset({
              index: 0,
              routes: [{name: 'Login'}],
            }),
          );
          dispatch({
            type: actionTypes.CLEAR_APP_DATA,
          });
        }
        dispatch({
          type: actionTypes.SET_LOADER,
          payload: false,
        });
        dispatch({
          type: actionTypes.SET_ELSE_RESPONSE_ALERT,
          payload: {
            state: true,
            alertTitle: '',
            alertText: response.data?.data?.message
              ? response.data.data.message
              : response.data.responseDescription,
          },
        });
      }
    })
    .catch((error2) => {
      dispatch({
        type: actionTypes.SET_LOADER,
        payload: false,
      });
      let message = '';
      if (!error2.status) {
        // network error
        message = Message.networkErrorMessage;
      } else {
        message = String(error2);
      }
      dispatch({
        type: actionTypes.SET_ELSE_RESPONSE_ALERT,
        payload: {
          state: true,
          alertTitle: '',
          alertText: message,
        },
      });
    });
};
// ***** ENDS  GET WEBVIEW LINK *****//

// ***** GET OVERVIEW DATA *****

export const getDashboardData =
  (
    // token,
    navigation,
    onSuccessisCredential,
    onSuccessoFVirtualCardCall,
    onSuccesError,
    // dispatchAgreeToVirtualCardTermsAndCondition,
    // hideVirtualCardAlert,
    // hideGlobalAlert,
    // sessionVirtualCardAlertShown,
    // virtualCardAlertForL2UpgradationState,
    // ShowDebitCardBanner,
    // showFloodReliefBanner,
  ) =>
  async (dispatch) => {
    logs.log('in Dashboard');
    let filtererd_acc = [];

    let parsedCredential;

    try {
      const credentials = await Keychain.getGenericPassword();
      // logs.log(`credentials in dashboard are : ${JSON.stringify(credentials)}`);
      if (credentials) {
        dispatch({
          type: actionTypes.SET_LOADER,
          payload: false,
        });
        dispatch({
          type: actionTypes.SET_LOADER,
          payload: false,
        });
        parsedCredential = JSON.parse(credentials.password);
      } else {
        parsedCredential = {};
      }
    } catch (error) {
      logs.log(error, 'on getting keyChina from Dashbaord');
    }

    if (parsedCredential.virtualCardData) {
      dispatch({
        type: actionTypes.SET_LOADER,
        payload: true,
      });
      logs.log(
        ` parsedCredential.virtualCardData is :
        ${parsedCredential.virtualCardData}`,
      );
      logs.log(
        `'parsedCredential.virtualCardData.username is ',
        ${parsedCredential.virtualCardData.username},
        'store.getState().reducers.userSignedIn ',
        ${store.getState().reducers.userSignedIn}`,
      );
      if (
        String(parsedCredential.virtualCardData.username).toLowerCase() ===
        String(store.getState().reducers.userSignedIn).toLowerCase()
      ) {
        logs.log(`parsedCredential.virtualCardData.username ===
        store.getState().reducers.userSignedIn
      `);
        dispatch({
          type: actionTypes.SET_VIRTUAL_CARD_OBJECT,
          payload: parsedCredential.virtualCardData,
        });
        logs.log(
          `'parsedCredential.virtualCardData ',
          ${parsedCredential.virtualCardData}`,
        );
        dispatch({
          type: actionTypes.SET_LOADER,
          payload: false,
        });
        onSuccessisCredential();
        // if (
        //   store.getState()?.reducers?.overViewData?.data?.accounts
        //     ?.isEmployee
        //   //   &&
        //   // store.getState().reducers.userObject.isEmployeeBannerState
        // ) {
        //   // ShowEmployeeBanner();
        //   dispatch(
        //     functionSetKeyChainObject({
        //       isEmployee: true,
        //       myReferalCode:
        //         store.getState()?.reducers?.overViewData?.data
        //           ?.accounts?.myReferalCode,
        //     }),
        //   );
        // }
        // if (
        //   // store.getState()?.reducers?.overViewData?.data?.accounts
        //   //   ?.raastPopup &&
        //   store.getState().reducers.userObject.isRaastBannerState
        // ) {
        //   logs.log(
        //     'RAAST BANNER1',
        //     response?.data?.accounts?.raastPopup,
        //   );
        //   ShowDebitCardBanner(
        //     response?.data?.data?.accounts?.raastPopup,
        //   );
        // }
      } else {
        dispatch({
          type: actionTypes.SET_LOADER,
          payload: true,
        });
        logs.logRequest(`(
          ${Config.base_url.UAT_URL}${Config.method.gateway}/${
          Config.endpoint.tokenStateUpdate
        },
          {
            deviceID: ${store.getState().reducers.fcmToken},
            token: ${parsedCredential.virtualCardData.token},

            tokenAction: 'DELETE',
          },
          {
            headers: {
              'X-Auth-Token': ${store.getState().reducers.token},
            },
          },
        )`);
        axios
          .post(
            `${Config.base_url.UAT_URL}${Config.method.gateway}/${Config.endpoint.tokenStateUpdate}`,
            {
              deviceID: store.getState().reducers.fcmToken,
              // enrollID: '', //store.getState().reducers.virtualCardObject.enrollID,
              token: parsedCredential.virtualCardData.token,

              tokenAction: 'DELETE',
            },
            {
              headers: {
                'X-Auth-Token': store.getState().reducers.token,
              },
            },
          )
          .then((responsing) => {
            logs.logResponse(responsing.data);
            if (
              responsing.status === 200 &&
              responsing.data.responseCode === '00'
            ) {
              dispatch({
                type: actionTypes.SET_TOKEN,
                payload: responsing.headers['x-auth-next-token'],
              });
              let removableObject = {...parsedCredential};
              logs.log(
                `'removableObject before ',
                ${removableObject},`,
              );
              delete removableObject['virtualCardMpin'];
              delete removableObject['virtualCardData'];
              delete removableObject['virtualCardStatus'];
              logs.log(
                `removableObject after : ${JSON.stringify(removableObject)}`,
              );
              dispatch(updateWithDeletedKeychainObject(removableObject));

              dispatch({
                type: actionTypes.SET_VIRTUAL_CARD_MPIN,
                payload: false,
              });
              dispatch({
                type: actionTypes.SET_VIRTUAL_CARD_OBJECT,
                payload: false,
              });
              dispatch({
                type: actionTypes.SET_VIRTUAL_CARD_STATUS,
                payload: false,
              });
              dispatch({
                type: actionTypes.SET_LOADER,
                payload: false,
              });
              onSuccessoFVirtualCardCall();

              // if (
              //   store.getState().reducers
              //     .virtualCardAlertOnceAlertState &&
              //   store.getState().reducers.virtualCardAlertOnce
              // ) {
              //   setTimeout(() => {
              //     dispatch({
              //       type: actionTypes.GLOBAL_ALERT_STATE,
              //       payload: {
              //         state: true,
              //         navigation: navigation,
              //         // props: props ? props : false,
              //         props: {
              //           onPressYes: () => {
              //             hideGlobalAlert();
              //             sessionVirtualCardAlertShown();
              //             setTimeout(() => {
              //               dispatchAgreeToVirtualCardTermsAndCondition();
              //             }, 500);
              //           },
              //           onPressNo: () => {
              //             sessionVirtualCardAlertShown();
              //             hideGlobalAlert();
              //             hideVirtualCardAlert();
              //             logs.log(
              //               `asdasd${
              //                 store.getState().reducer
              //                   .keychainObject.DebitCardBannerState
              //               }`,
              //             );
              //             logs.log('yahan at 843');
              //             // if (
              //             //   // !store.getState().reducers
              //             //   //   .keychainObject.DebitCardBannerState
              //             //   store.getState()?.reducers?.overViewData
              //             //     ?.data?.accounts?.raastPopup
              //             // ) {
              //             //   logs.log('showDebut');
              //             //   ShowDebitCardBanner();
              //             // } else if (
              //             //   store.getState()?.reducers?.overViewData
              //             //     ?.data?.accounts?.isEmployee
              //             // ) {
              //             //   ShowEmployeeBanner();
              //             // }

              //             if (
              //               store.getState()?.reducers?.overViewData
              //                 ?.data?.accounts?.isEmployee
              //               //   &&
              //               // store.getState().reducers.userObject
              //               //   .isEmployeeBannerState
              //             ) {
              //               // ShowEmployeeBanner();
              //               dispatch(
              //                 functionSetKeyChainObject({
              //                   isEmployee: true,
              //                   myReferalCode:
              //                     store.getState()?.reducers
              //                       ?.overViewData?.data?.accounts
              //                       ?.myReferalCode,
              //                 }),
              //               );
              //             }
              //             if (
              //               // store.getState()?.reducers?.overViewData
              //               //   ?.data?.accounts?.raastPopup &&
              //               store.getState().reducers.userObject
              //                 .isRaastBannerState
              //             ) {
              //               logs.log(
              //                 'RAAST BANNER2',
              //                 response?.data?.accounts?.raastPopup,
              //               );
              //               ShowDebitCardBanner(
              //                 response?.data?.data?.accounts
              //                   ?.raastPopup,
              //               );
              //             }
              //             showFloodReliefBanner(true);
              //           },
              //           title: 'QR Payments',
              //           alert_text:
              //             'ZPlease add virtual card for QR Payments.\nDo you want to add Virtual Card?',
              //         },
              //       },
              //     });
              //   }, 500);
              // }

              // if (
              //   store.getState()?.reducers?.overViewData?.data
              //     ?.accounts?.isEmployee
              //   //   &&
              //   // store.getState().reducers.userObject
              //   //   .isEmployeeBannerState
              // ) {
              //   dispatch(
              //     functionSetKeyChainObject({
              //       isEmployee: true,
              //       myReferalCode:
              //         store.getState()?.reducers?.overViewData?.data
              //           ?.accounts?.myReferalCode,
              //     }),
              //   ); // ShowEmployeeBanner();
              // }
              // if (
              //   // store.getState()?.reducers?.overViewData?.data
              //   //   ?.accounts?.raastPopup &&
              //   store.getState().reducers.userObject
              //     .isRaastBannerState
              // ) {
              //   logs.log(
              //     'RAAST BANNER3',
              //     response?.data?.accounts?.raastPopup,
              //   );
              //   ShowDebitCardBanner(
              //     response?.data?.data?.accounts?.raastPopup,
              //   );
              // }
              // showFloodReliefBanner(true);
            } else {
              if (responsing.headers['x-auth-next-token']) {
                dispatch({
                  type: actionTypes.SET_TOKEN,
                  payload: responsing.headers['x-auth-next-token'],
                });
              }
              if (sessionControl(responsing)) {
                navigation.dispatch(
                  CommonActions.reset({
                    index: 0,
                    routes: [{name: 'Login'}],
                  }),
                );
                dispatch({
                  type: actionTypes.CLEAR_APP_DATA,
                });
              }

              dispatch({
                type: actionTypes.SET_LOADER,
                payload: false,
              });

              dispatch({
                type: actionTypes.SET_ELSE_RESPONSE_ALERT,
                payload: {
                  state: true,
                  alertTitle: '',
                  alertText: responsing.data?.data?.message
                    ? responsing.data.data.message
                    : responsing.data.responseDescription,
                },
              });
            }
          })
          .catch((erroring) => {
            logs.log(erroring);
            dispatch({
              type: actionTypes.SET_LOADER,
              payload: false,
            });
          });
      }

      // .catch((error) => {
      //   logs.log(`catcherror : ${JSON.stringify(error)}`);
      //   dispatch({
      //     type: actionTypes.SET_LOADER,
      //     payload: false,
      //   });
      //   let message = '';
      //   if (!error.status) {
      //     // network error
      //     message = Message.networkErrorMessage;
      //   } else {
      //     message = String(error);
      //   }
      //   dispatch({
      //     type: actionTypes.SET_ELSE_RESPONSE_ALERT,
      //     payload: {
      //       state: true,
      //       alertTitle: '',
      //       alertText: message,
      //     },
      //   });
      // });
    } else {
      dispatch({
        type: actionTypes.SET_LOADER,
        payload: false,
      });
      onSuccesError();
    }
  };
// ***** ENDS GET OVERVIEW DATA *****

// ***** UPDATE OVERVIEW DATA *****
export const setOverViewData = (data) => async (dispatch) => {
  dispatch({
    type: actionTypes.SET_OVERVIEW_DATA,
    payload: data,
  });
};
// ***** ENDS UPDATE OVERVIEW DATA *****

// ***** UPDATE VIEW ACCOUNTS DATA *****
export const setViewAccountsData = (data) => async (dispatch) => {
  dispatch({
    type: actionTypes.SET_VIEW_ACCOUNTS_DATA,
    payload: data,
  });
};
// ***** ENDS UPDATE VIEW ACCOUNTS DATA *****
export const setStatusServices = (data) => async (dispatch) => {
  dispatch({
    type: actionTypes.STATUS_BAR,
    payload: data,
  });
};
// ***** ENDS UPDATE VIEW ACCOUNTS DATA *****

export const overview_without_balance =
  (X_Auth_Token, channel, isTnCAgreed) => async (dispatch) => {
    const authOptions = {
      url: `${Config.base_url.UAT_URL}/${Config.endpoint.overview_without_balance}`,
      method: 'GET',
      headers: {
        'X-Auth-Token': X_Auth_Token,
      },
      isTnCAgreed: isTnCAgreed,
      channel: channel,
    };
    dispatch({
      type: actionTypes.SET_LOADER,
      payload: true,
    });
    axios(authOptions)
      .then((response) => {
        if (response.status === 200) {
        } else {
        }
      })
      .catch((error) => {});
    // dispatch({
    //   type: actionTypes.SET_LOADER,
    //   payload: false,
    // });
  };

// ****** DASHBOARD API HIT
export const getOverViewData = (token, navigation) => async (dispatch) => {
  dispatch({
    type: actionTypes.SET_LOADER,
    payload: true,
  });
  axios
    .get(
      `${Config.base_url.UAT_URL}${Config.method.my}/${Config.endpoint.overview_without_balance}?channel=${Config.channel.channel}`,
      {
        headers: {
          'X-Auth-Token': store.getState().reducers.token,
          isTnCAgreed: true,
        },
      },
    )
    .then((response) => {
      if (response.status === 200 && response.data.responseCode === '00') {
        dispatch({
          type: actionTypes.SET_TOKEN,
          payload: response?.headers?.['x-auth-next-token'],
        });
        dispatch({
          type: actionTypes.SET_OVERVIEW_DATA,
          payload: response.data,
        });
        dispatch({
          type: actionTypes.SET_LOADER,
          payload: false,
        });
        // global.showToast.show('Some Problem Occured !', 5000);
      } else {
        if (response?.headers?.['x-auth-next-token']) {
          dispatch({
            type: actionTypes.SET_TOKEN,
            payload: response?.headers?.['x-auth-next-token'],
          });
        }
        if (sessionControl(response)) {
          navigation.dispatch(
            CommonActions.reset({
              index: 0,
              routes: [{name: 'Login'}],
            }),
          );
        }

        dispatch({
          type: actionTypes.SET_LOADER,
          payload: false,
        });

        dispatch({
          type: actionTypes.SET_ELSE_RESPONSE_ALERT,
          payload: {
            state: true,
            alertTitle: '',
            alertText: response.data?.data?.message
              ? response.data.data.message
              : response.data.responseDescription,
          },
        });
      }
    })
    .catch((error) => {
      dispatch({
        type: actionTypes.SET_LOADER,
        payload: false,
      });
      let message = '';
      if (!error.status) {
        // network error
        message = Message.networkErrorMessage;
      } else {
        message = String(error);
      }
      dispatch({
        type: actionTypes.SET_ELSE_RESPONSE_ALERT,
        payload: {
          state: true,
          alertTitle: '',
          alertText: message,
        },
      });
    });
};
// ****** ENDS DASHBOARD API HIT

// ***** VIEW ACCOUNTS DATA : DASHBOARD => MyAccounts => View Accounts => HIT *****
export const getViewAccountsData = (token, navigation) => async (dispatch) => {
  dispatch({
    type: actionTypes.SET_LOADER,
    payload: true,
  });
  axios
    .get(
      `${Config.base_url.UAT_URL}${Config.method.my}/${Config.endpoint.accounts}`,
      {
        channel: `${Config.channel.channel}`,
        headers: {
          'X-Auth-Token': token,
        },
      },
    )
    .then((response) => {
      if (response.status === 200 && response.data.responseCode === '00') {
        dispatch({
          type: actionTypes.SET_TOKEN,
          payload: response?.headers?.['x-auth-next-token'],
        });
        logs.log(
          ' response.data.data.accounts87623874621-->',
          response.data.data.accounts,
        );
        dispatch({
          type: actionTypes.SET_VIEW_ACCOUNTS_DATA,
          payload: response.data.data.accounts,
        });
        navigation.navigate('ViewAccounts');
        dispatch({
          type: actionTypes.SET_LOADER,
          payload: false,
        });
      } else {
        if (response?.headers?.['x-auth-next-token']) {
          dispatch({
            type: actionTypes.SET_TOKEN,
            payload: response?.headers?.['x-auth-next-token'],
          });
        }
        if (sessionControl(response)) {
          navigation.dispatch(
            CommonActions.reset({
              index: 0,
              routes: [{name: 'Login'}],
            }),
          );
          dispatch({
            type: actionTypes.CLEAR_APP_DATA,
          });
        }

        dispatch({
          type: actionTypes.SET_LOADER,
          payload: false,
        });

        dispatch({
          type: actionTypes.SET_ELSE_RESPONSE_ALERT,
          payload: {
            state: true,
            alertTitle: '',
            alertText: response.data?.data?.message
              ? response.data.data.message
              : response.data.responseDescription,
          },
        });
      }
    })
    .catch((error) => {
      dispatch({
        type: actionTypes.SET_LOADER,
        payload: false,
      });
      let message = '';
      if (!error.status) {
        // network error
        message = Message.networkErrorMessage;
      } else {
        message = String(error);
      }
      dispatch({
        type: actionTypes.SET_ELSE_RESPONSE_ALERT,
        payload: {
          state: true,
          alertTitle: '',
          alertText: message,
          onPress: () => {
            navigation.goBack();
          },
        },
      });
    });
};
// ***** ENDS VIEW ACCOUNTS DATA : DASHBOARD => MyAccounts => View Accounts => HIT *****

//************************* END OF ADD BENEFICIARY******************** */

// ***** ACCOUNTS DATA CALL *****//
export const getAccountsData = (navigation) => async (dispatch) => {
  axios
    .get(
      `${Config.base_url.UAT_URL}${Config.method.my}/${Config.endpoint.accounts}`,
      {
        channel: `${Config.channel.channel}`,
        headers: {'X-Auth-Token': store.getState().reducers.token},
      },
    )
    .then((response) => {
      if (response.status === 200 && response.data.responseCode === '00') {
        dispatch({
          type: actionTypes.SET_TOKEN,
          payload: response?.headers?.['x-auth-next-token'],
        });
        dispatch({
          type: actionTypes.SET_VIEW_ACCOUNTS_DATA,
          payload: response.data.data.accounts,
        });
      } else {
        if (response?.headers?.['x-auth-next-token']) {
          dispatch({
            type: actionTypes.SET_TOKEN,
            payload: response?.headers?.['x-auth-next-token'],
          });
        }
        if (sessionControl(response)) {
          navigation.dispatch(
            CommonActions.reset({
              index: 0,
              routes: [{name: 'Login'}],
            }),
          );
          dispatch({
            type: actionTypes.CLEAR_APP_DATA,
          });
        }

        dispatch({
          type: actionTypes.SET_ELSE_RESPONSE_ALERT,
          payload: {
            state: true,
            alertTitle: '',
            alertText: response.data?.data?.message
              ? response.data.data.message
              : response.data.responseDescription,
          },
        });
      }
    })
    .catch((error) => {
      let message = '';
      if (!error.status) {
        // network error
        message = Message.networkErrorMessage;
      } else {
        message = String(error);
      }
      dispatch({
        type: actionTypes.SET_ELSE_RESPONSE_ALERT,
        payload: {
          state: true,
          alertTitle: '',
          alertText: message,
        },
      });
    });
};

// ***** END ACCOUNT DATA CALL *****//

// **** VIEW BENFICARIES ******//
export const all_benef =
  (token, navigation, status, benefTypes) => async (dispatch) => {
    dispatch({
      type: actionTypes.SET_LOADER,
      payload: true,
    });

    logs.log(
      `${Config.base_url.UAT_URL}${Config.method.my}/${Config.endpoint.beneficiaries}?benefTypes=${benefTypes}&status=${status}&channel=${Config.channel.channel}`,
    );

    axios
      .get(
        `${Config.base_url.UAT_URL}${Config.method.my}/${Config.endpoint.beneficiaries}?benefTypes=${benefTypes}&status=${status}&channel=${Config.channel.channel}`,

        {
          headers: {'X-Auth-Token': token},
        },
      )
      .then((response) => {
        if (response.status === 200 && response.data.responseCode === '00') {
          dispatch({
            type: actionTypes.SET_TOKEN,
            payload: response?.headers?.['x-auth-next-token'],
          });
          if (sessionControl(response)) {
            navigation.dispatch(
              CommonActions.reset({
                index: 0,
                routes: [{name: 'Login'}],
              }),
            );
            dispatch({
              type: actionTypes.CLEAR_APP_DATA,
            });
          } else {
            dispatch({
              type: actionTypes.SET_TOKEN,
              payload: response?.headers?.['x-auth-next-token'],
            });
            dispatch({
              type: actionTypes.SET_BENEFICIARIES,
              payload: response.data.data.beneficiaries,
            });
            navigation.navigate('TransactionRecord', {
              data: benefTypes === 1 || benefTypes === 2 ? 'bank' : 'other',
            });
            // return response.data.data.beneficiaries;
            dispatch({
              type: actionTypes.SET_LOADER,
              payload: false,
            });
          }
        } else {
          if (response?.headers?.['x-auth-next-token']) {
            dispatch({
              type: actionTypes.SET_TOKEN,
              payload: response?.headers?.['x-auth-next-token'],
            });
          }
          if (sessionControl(response)) {
            dispatch({
              type: actionTypes.SET_ELSE_RESPONSE_ALERT,
              payload: {
                state: true,
                alertTitle: 'Session Expire',
                alertText: response.data?.data?.message
                  ? response.data.data.message
                  : response.data.responseDescription,
              },
            });

            navigation.dispatch(
              CommonActions.reset({
                index: 0,
                routes: [{name: 'Login'}],
              }),
            );
            dispatch({
              type: actionTypes.CLEAR_APP_DATA,
            });
          }
          dispatch({
            type: actionTypes.SET_LOADER,
            payload: false,
          });
        }
      })
      .catch((error) => {
        dispatch({
          type: actionTypes.SET_LOADER,
          payload: false,
        });
      });
  };
//******************VIEW BENFICARY ENDS******************/

// ******* DELETE BENFECIRIES ************//
export const delete_benef = (navigation, request_id) => async (dispatch) => {
  dispatch({
    type: actionTypes.SET_LOADER,
    payload: true,
  });

  axios
    .delete(
      `${Config.base_url.UAT_URL}${Config.method.my}/${Config.endpoint.beneficary}`,
      {
        headers: {'X-Auth-Token': store.getState().reducers.token},
        data: {
          benefID: request_id,
        },
      },
    )

    .then((response) => {
      if (response.status === 200 && response.data.responseCode === '00') {
        dispatch({
          type: actionTypes.SET_TOKEN,
          payload: response?.headers?.['x-auth-next-token'],
        });

        dispatch({
          type: actionTypes.SET_LOADER,
          payload: false,
        });
        setTimeout(() => {
          dispatch({
            type: actionTypes.GLOBAL_ICON_ALERT_STATE,
            payload: {
              state: true,
              navigation: navigation,
              props: {
                message: 'Beneficiary deleted successfully',
                removeAlert: true,
                onPressOk: () => {
                  navigation.navigate('BeneficiaryManagement');
                  // hideGlobalIconAlert();
                },
              },
            },
          });
        }, 500);
        // setTimeout(() => {
        //   dispatch({
        //     type: actionTypes.SET_ELSE_RESPONSE_ALERT,
        //     payload: {
        //       state: true,
        //       alertTitle: '',
        //       alertText: 'Beneficary deleted successfully',
        //     },
        //   });
        // }, 500);
      } else {
        if (sessionControl(response)) {
          navigation.dispatch(
            CommonActions.reset({
              index: 0,
              routes: [{name: 'Login'}],
            }),
          );
          setTimeout(() => {
            dispatch({
              type: actionTypes.GLOBAL_ICON_ALERT_STATE,
              payload: {
                state: true,
                navigation: navigation,
                props: {
                  message: response.data?.data?.message
                    ? response.data.data.message
                    : response.data.responseDescription,
                  onPressOk: () => {
                    navigation.navigate('BeneficiaryManagement');
                    // hideGlobalIconAlert();
                  },
                },
              },
            });
          }, 500);
        }

        if (response?.headers?.['x-auth-next-token']) {
          dispatch({
            type: actionTypes.SET_TOKEN,
            payload: response?.headers?.['x-auth-next-token'],
          });
        }

        dispatch({
          type: actionTypes.SET_LOADER,
          payload: false,
        });
        setTimeout(() => {
          dispatch({
            type: actionTypes.SET_ELSE_RESPONSE_ALERT,
            payload: {
              state: true,
              alertTitle: '',
              alertText: response.data?.data?.message
                ? response.data.data.message
                : response.data.responseDescription,
            },
          });
        }, 500);
      }
    })
    .catch((error) => {
      dispatch({
        type: actionTypes.SET_LOADER,
        payload: false,
      });
    });
};
//**************************DELETE BENEFICERY ENDS**********//

//******************ADD BENEF TITLE FETCH*************** */
export const title_benef =
  (
    navigation,
    titleFetchAccount,
    transtype,
    benefiType,
    ucid,
    companyName,
    type,
  ) =>
  async (dispatch) => {
    dispatch({
      type: actionTypes.SET_LOADER,
      payload: true,
    });
    logs.logRequest(
      `${Config.base_url.UAT_URL}${Config.method.bill}/${
        Config.endpoint.get
      }?consumerNo=${titleFetchAccount}&ucid=${ucid},
      {
        headers: {'X-Auth-Token': ${store.getState().reducers.token}},
      },`,
    );
    axios
      .get(
        `${Config.base_url.UAT_URL}${Config.method.bill}/${Config.endpoint.get}?consumerNo=${titleFetchAccount}&ucid=${ucid}`,
        {
          headers: {'X-Auth-Token': store.getState().reducers.token},
        },
      )
      .then((response) => {
        logs.logResponse(response.data);
        if (response.status === 200 && response.data.responseCode === '00') {
          dispatch({
            type: actionTypes.SET_TOKEN,
            payload: response?.headers?.['x-auth-next-token'],
          });
          {
            dispatch({
              type: actionTypes.SET_LOADER,
              payload: false,
            });
            const title = response.data.data.customerName;
            const imd = ucid;
            logs.log('poporaffay');

            navigation.navigate('BeneficiaryinputDetails', {
              data: {
                titleFetchAccount,
                benefiType,
                transtype,
                title,
                imd,
                companyName,
                type: type ? type : false,
              },
              responseData: response.data,
            });
          }

          //     dispatch({
          //       type: actionTypes.SET_BENEFICIARIES,
          //       payload: response.data.data.beneficiaries,
          // });
          // return response.data.data.beneficiaries;
        } else {
          if (sessionControl(response)) {
            navigation.dispatch(
              CommonActions.reset({
                index: 0,
                routes: [{name: 'Login'}],
              }),
            );
            dispatch({
              type: actionTypes.CLEAR_APP_DATA,
            });
          }
          if (response?.headers?.['x-auth-next-token']) {
            dispatch({
              type: actionTypes.SET_TOKEN,
              payload: response?.headers?.['x-auth-next-token'],
            });
          }
          dispatch({
            type: actionTypes.SET_LOADER,
            payload: false,
          });
          dispatch({
            type: actionTypes.SET_ELSE_RESPONSE_ALERT,
            payload: {
              state: true,
              alertTitle: 'Beneficary Update',
              alertText: response.data?.data?.message
                ? response.data.data.message
                : response.data.responseDescription,
            },
          });
        }
      })
      .catch((error) => {
        dispatch({
          type: actionTypes.SET_LOADER,
          payload: false,
        });
      });
  };
//******************VIEW BENFICARY ENDS******************/

// **** VIEW BENFICARIES ******//
export const all_benef_pay =
  (navigation, isManage, onSucess) => async (dispatch) => {
    dispatch({
      type: actionTypes.SET_LOADER,
      payload: true,
    });
    logs.logRequest(
      `${Config.base_url.UAT_URL}${
        Config.method.my
      }/allBeneficiaries?status=unpaid&channel=MOBILE_APP,

    {
      headers: {'X-Auth-Token': ${store.getState().reducers.token}},
    },`,
    );
    axios
      .get(
        `${Config.base_url.UAT_URL}${Config.method.my}/allBeneficiaries?status=unpaid&channel=MOBILE_APP`,

        {
          headers: {'X-Auth-Token': store.getState().reducers.token},
        },
      )
      .then(async (response) => {
        logs.logResponse(response.data);
        if (response.status === 200 && response.data.responseCode === '00') {
          dispatch({
            type: actionTypes.SET_TOKEN,
            payload: response?.headers?.['x-auth-next-token'],
          });

          let data = await response.data.data.beneficiaries;
          onSucess(response.data);
          isManage
            ? navigation.navigate('BeneficiaryManagement', response.data)
            : navigation.navigate('BeneficiaryPayment', response.data); //change from BeneficiaryPayment
          dispatch({
            type: actionTypes.SET_LOADER,
            payload: false,
          });
          // if (data.length === 0) {
          //   setTimeout(() => {
          //     dispatch({
          //       type: actionTypes.SET_ELSE_RESPONSE_ALERT,
          //       payload: {
          //         state: true,
          //         alertTitle: 'Session Expire',
          //         alertText: `No Beneficiary Found.s`,
          //         // onPress: () => {
          //         //   navigation.goBack();
          //         // },
          //       },
          //     });
          //   }, 500);
          // }
        } else {
          logs.log('inside Elase dasjhdg');
          if (response?.headers?.['x-auth-next-token']) {
            dispatch({
              type: actionTypes.SET_TOKEN,
              payload: response?.headers?.['x-auth-next-token'],
            });
          }
          if (sessionControl(response)) {
            dispatch({
              type: actionTypes.SET_LOADER,
              payload: false,
            });
            dispatch({
              type: actionTypes.SET_ELSE_RESPONSE_ALERT,
              payload: {
                state: true,
                alertTitle: 'Session Expire',
                alertText: response.data?.data?.message
                  ? response.data.data.message
                  : response.data.responseDescription,
                onPress: () => {
                  navigation.dispatch(
                    CommonActions.reset({
                      index: 0,
                      routes: [{name: 'Login'}],
                    }),
                  );
                  dispatch({
                    type: actionTypes.CLEAR_APP_DATA,
                  });
                },
              },
            });
          }
        }
      })
      .catch((error) => {
        dispatch({
          type: actionTypes.SET_LOADER,
          payload: false,
        });
      });
  };

//******************VIEW BENFICARY ENDS******************/

// ***** VIEW ACC BENEF PAY  => *****
export const view_accounts = (token, navigation, data) => async (dispatch) => {
  dispatch({
    type: actionTypes.SET_LOADER,
    payload: true,
  });
  axios
    .get(
      `${Config.base_url.UAT_URL}${Config.method.my}/accounts?channel=MOBILE_APP`,

      {
        headers: {'X-Auth-Token': store.getState().reducers.token},
      },
    )
    .then((response) => {
      if (response.status === 200 && response.data.responseCode === '00') {
        dispatch({
          type: actionTypes.SET_TOKEN,
          payload: response?.headers?.['x-auth-next-token'],
        });
        dispatch({
          type: actionTypes.SET_VIEW_ACCOUNTS_DATA,
          payload: response.data.data.accounts,
        });
        navigation.navigate('PaymentDetail', {data: data});
        dispatch({
          type: actionTypes.SET_LOADER,
          payload: false,
        });
      } else {
        if (response?.headers?.['x-auth-next-token']) {
          dispatch({
            type: actionTypes.SET_TOKEN,
            payload: response?.headers?.['x-auth-next-token'],
          });
        }
        if (sessionControl(response)) {
          navigation.dispatch(
            CommonActions.reset({
              index: 0,
              routes: [{name: 'Login'}],
            }),
          );
          dispatch({
            type: actionTypes.CLEAR_APP_DATA,
          });
        }

        dispatch({
          type: actionTypes.SET_LOADER,
          payload: false,
        });

        dispatch({
          type: actionTypes.SET_ELSE_RESPONSE_ALERT,
          payload: {
            state: true,
            alertTitle: '',
            alertText: response.data?.data?.message
              ? response.data.data.message
              : response.data.responseDescription,
          },
        });
      }
    })
    .catch((error) => {
      dispatch({
        type: actionTypes.SET_LOADER,
        payload: false,
      });
      dispatch({
        type: actionTypes.SET_ELSE_RESPONSE_ALERT,
        payload: {
          state: true,
          alertTitle: '',
          alertText: error,
        },
      });
    });
};
// ***** ENDS VIEW ACC BENEF PAY  =>*****
// ***** GET CONSUMER BILL *****

export const getbenefpaybill =
  (token, navigation, consumerNumber, ucid, fromAccount, biller, benefitype) =>
  async (dispatch) => {
    dispatch({
      type: actionTypes.SET_LOADER,
      payload: true,
    });
    axios
      .get(
        `${Config.base_url.UAT_URL}${Config.method.bill}/get?consumerNo=${consumerNumber}&ucid=${ucid}`,
        {
          headers: {
            'X-Auth-Token': store.getState().reducers.token,
          },
        },
      )
      .then((response) => {
        if (response.status === 200 && response.data.responseCode === '00') {
          dispatch({
            type: actionTypes.SET_BILL_OBJECT,
            payload: response.data.data,
          });
          navigation.navigate('PaymentDescription', {
            data: {
              fromAccount: fromAccount,
              biller: biller,
              consumerNumber: consumerNumber,
              ucid: ucid,
              benifType: benefitype,
            },
          });
          dispatch({
            type: actionTypes.SET_LOADER,
            payload: false,
          });
          dispatch({
            type: actionTypes.SET_TOKEN,
            payload: response?.headers?.['x-auth-next-token'],
          });
        } else {
          if (response?.headers?.['x-auth-next-token']) {
            dispatch({
              type: actionTypes.SET_TOKEN,
              payload: response?.headers?.['x-auth-next-token'],
            });
          }
          if (sessionControl(response)) {
            navigation.dispatch(
              CommonActions.reset({
                index: 0,
                routes: [{name: 'Login'}],
              }),
            );
            dispatch({
              type: actionTypes.CLEAR_APP_DATA,
            });
          }
          dispatch({
            type: actionTypes.SET_LOADER,
            payload: false,
          });

          dispatch({
            type: actionTypes.SET_ELSE_RESPONSE_ALERT,
            payload: {
              state: true,
              alertTitle: '',
              alertText: response.data?.data?.message
                ? response.data.data.message
                : response.data.responseDescription,
            },
          });
        }
      });
  };
// ***** ENDS GET CONSUMER BILL *****
// *****  benefi bill  PAYMENTS *****
export const billpaymentbeeficiary =
  (
    token,
    navigation,
    billToken,
    accountNumber,
    benefType,
    imd,
    amount,
    benefId,
    comments,
    companyName,
    customerName,
    fromAccount,
  ) =>
  async (dispatch) => {
    dispatch({
      type: actionTypes.SET_LOADER,
      payload: true,
    });
    axios
      .post(
        `${Config.base_url.UAT_URL}${Config.method.my}/${Config.endpoint.otp}`,
        {
          accountNumber: accountNumber,
          benefType: benefType,
          imd: imd,
          isBenef: true,
          tranType: 'BillPayment',
        },
        {headers: {'X-Auth-Token': store.getState().reducers.token}},
      )
      .then((response1) => {
        if (response1.status === 200 && response1.data.responseCode === '00') {
          dispatch({
            type: actionTypes.SET_TOKEN,
            payload: response1.headers['x-auth-next-token'],
          });

          axios
            .post(
              `${Config.base_url.UAT_URL}${Config.method.bill}/${Config.endpoint.pay}`,
              {
                amount: amount,
                benefType: benefType,
                benefiId: benefId,
                comments: comments,
                companyName: companyName,
                companyType: '4',
                consumerNo: accountNumber,
                customerName: customerName,
                fromAccount: fromAccount,
                isBenef: true,
                otp: '',
                rcvrEmailAddress: '',
                rcvrMobileNumber: '',
                token: billToken,
                ucid: imd,
                validateOTP: true,
              },
              {headers: {'X-Auth-Token': store.getState().reducers.token}},
            )
            .then((response2) => {
              if (
                response2.status === 200 &&
                response2.data.responseCode === '00'
              ) {
                dispatch({
                  type: actionTypes.SET_TOKEN,
                  payload: response2.headers['x-auth-next-token'],
                });
                navigation.navigate('OtherPaymentResponse', {
                  data: response2.data.data,
                });
                dispatch({
                  type: actionTypes.SET_LOADER,
                  payload: false,
                });
              } else {
                if (response2.headers['x-auth-next-token']) {
                  dispatch({
                    type: actionTypes.SET_TOKEN,
                    payload: response2.headers['x-auth-next-token'],
                  });
                }
                if (sessionControl(response2)) {
                  navigation.dispatch(
                    CommonActions.reset({
                      index: 0,
                      routes: [{name: 'Login'}],
                    }),
                  );
                  dispatch({
                    type: actionTypes.CLEAR_APP_DATA,
                  });
                }
                dispatch({
                  type: actionTypes.SET_LOADER,
                  payload: false,
                });

                dispatch({
                  type: actionTypes.SET_ELSE_RESPONSE_ALERT,
                  payload: {
                    state: true,
                    alertTitle: '',
                    alertText: response2.data?.data?.message
                      ? response2.data.data.message
                      : response2.data.responseDescription,
                  },
                });
              }
            })
            .catch((error2) => {
              dispatch({
                type: actionTypes.SET_LOADER,
                payload: false,
              });
              dispatch({
                type: actionTypes.SET_ELSE_RESPONSE_ALERT,
                payload: {
                  state: true,
                  alertTitle: '',
                  alertText: error2,
                },
              });
            });
        } else {
          if (response1.headers['x-auth-next-token']) {
            dispatch({
              type: actionTypes.SET_TOKEN,
              payload: response1.headers['x-auth-next-token'],
            });
          }
          if (sessionControl(response1)) {
            navigation.dispatch(
              CommonActions.reset({
                index: 0,
                routes: [{name: 'Login'}],
              }),
            );
            dispatch({
              type: actionTypes.CLEAR_APP_DATA,
            });
          }

          dispatch({
            type: actionTypes.SET_LOADER,
            payload: false,
          });

          dispatch({
            type: actionTypes.SET_ELSE_RESPONSE_ALERT,
            payload: {
              state: true,
              alertTitle: '',
              alertText: response1.data?.data?.message
                ? response1.data.data.message
                : response1.data.responseDescription,
            },
          });
        }
      })
      .catch((error1) => {
        dispatch({
          type: actionTypes.SET_LOADER,
          payload: false,
        });
        dispatch({
          type: actionTypes.SET_ELSE_RESPONSE_ALERT,
          payload: {
            state: true,
            alertTitle: '',
            alertText: error1,
          },
        });
      });
  };
// ***** ENDS benefi bill payy PAYMENTS *****

//******************MAPS ATM AND BRANCH********* */
export const map_atm = () => async (dispatch) => {
  dispatch({
    type: actionTypes.SET_LOADER,
    payload: true,
  });

  axios
    .get(
      `${Config.base_url.UAT_URL}${Config.method.webpages}/${Config.endpoint.atm}`,
    )
    .then((response) => {
      if (response.status === 200 && response.data.responseCode === '00') {
        dispatch({
          type: actionTypes.SET_ATM_PINS,
          payload: response.data.data.atmRecords,
        });
        dispatch({
          type: actionTypes.SET_LOADER,
          payload: false,
        });
      } else {
        dispatch({
          type: actionTypes.SET_LOADER,
          payload: false,
        });
        dispatch({
          type: actionTypes.SET_ELSE_RESPONSE_ALERT,
          payload: {
            state: true,
            alertTitle: 'Beneficary Update',
            alertText: response.data?.data?.message
              ? response.data.data.message
              : response.data.responseDescription,
          },
        });
      }
    })
    .catch((error) => {
      dispatch({
        type: actionTypes.SET_LOADER,
        payload: false,
      });
    });
};

////////****************************BRACNHES MAP PIN API  */

export const map_branch = () => async (dispatch) => {
  dispatch({
    type: actionTypes.SET_LOADER,
    payload: true,
  });

  axios
    .get()
    .then((response) => {
      if (response.status === 200 && response.data.responseCode === '00') {
        dispatch({
          type: actionTypes.SET_ATM_PINS,
          payload: response.data.data.atmRecords,
        });
        dispatch({
          type: actionTypes.SET_LOADER,
          payload: false,
        });
      } else {
        dispatch({
          type: actionTypes.SET_LOADER,
          payload: false,
        });
        dispatch({
          type: actionTypes.SET_ELSE_RESPONSE_ALERT,
          payload: {
            state: true,
            alertTitle: 'Beneficary Update',
            alertText: response.data?.data?.message
              ? response.data.data.message
              : response.data.responseDescription,
          },
        });
      }
    })
    .catch((error) => {
      dispatch({
        type: actionTypes.SET_LOADER,
        payload: false,
      });
    });
};

// ***** VIEW ACCOUNTS STATEMENT DATA : DASHBOARD => MyAccounts => View Accounts => ACCOUNT => HIT *****
const hideGlobalIconAlert = () => {
  logs.log('poki');
};
export const getViewAccountsStatementData =
  (
    token,
    navigation,
    accountNumber,
    accountType,
    fromDate,
    toDate,
    accountObject,
    item,
  ) =>
  async (dispatch) => {
    let accountObj = {...item, ...accountObject};
    dispatch({
      type: actionTypes.SET_VIEW_ACCOUNT_STATEMENT_DATA,
      payload: [],
    });
    dispatch({
      type: actionTypes.SET_LOADER,
      payload: true,
    });
    logs.logRequest(
      `${Config.base_url.UAT_URL}${Config.method.my}/${Config.endpoint.statement}/${accountNumber}/${accountType}?fromDate=${fromDate}&toDate=${toDate}&sendEmail=false&channel=${Config.channel.channel}&isBalanceRequired=true,
      {
        headers: {
          'X-Auth-Token': ${token},
        },
      },`,
    );
    axios
      .get(
        `${Config.base_url.UAT_URL}${Config.method.my}/${Config.endpoint.statement}/${accountNumber}/${accountType}?fromDate=${fromDate}&toDate=${toDate}&sendEmail=false&channel=${Config.channel.channel}&isBalanceRequired=true`,
        {
          headers: {
            'X-Auth-Token': token,
          },
        },
      )
      .then((response) => {
        logs.logResponse(response.data);
        if (response.status === 200 && response.data.responseCode === '00') {
          navigation.navigate('ViewAccountsDetails', {data: accountObj});
          dispatch({
            type: actionTypes.SET_TOKEN,
            payload: response?.headers?.['x-auth-next-token'],
          });
          if (
            response.data?.data?.balance &&
            response.data?.data?.balance !== ''
          ) {
            dispatch({
              type: actionTypes.SET_BALANCE,
              payload: response.data?.data?.balance,
            });
          }
          dispatch({
            type: actionTypes.SET_VIEW_ACCOUNT_STATEMENT_DATA,
            payload: response.data,
          });

          dispatch({
            type: actionTypes.SET_LOADER,
            payload: false,
          });
        } else {
          if (
            response.data?.data?.balance &&
            response.data?.data?.balance !== ''
          ) {
            dispatch({
              type: actionTypes.SET_BALANCE,
              payload: response.data?.data?.balance,
            });
          }
          if (response?.headers?.['x-auth-next-token']) {
            dispatch({
              type: actionTypes.SET_TOKEN,
              payload: response?.headers?.['x-auth-next-token'],
            });
          }
          if (sessionControl(response)) {
            navigation.dispatch(
              CommonActions.reset({
                index: 0,
                routes: [{name: 'Login'}],
              }),
            );
            dispatch({
              type: actionTypes.CLEAR_APP_DATA,
            });
          }
          // else {
          //   navigation.goBack();
          // }

          dispatch({
            type: actionTypes.SET_LOADER,
            payload: false,
          });

          dispatch({
            type: actionTypes.SET_ELSE_RESPONSE_ALERT,
            payload: {
              state: true,
              alertTitle: '',
              alertText: response.data?.data?.message
                ? response.data.data.message
                : response.data.responseDescription,
            },
          });
        }
      })
      .catch((error) => {
        logs.log(`error : ${error}`);
        dispatch({
          type: actionTypes.SET_LOADER,
          payload: false,
        });
        let message = '';
        if (!error.status) {
          // network error
          message = Message.networkErrorMessage;
        } else {
          message = String(error);
        }
        dispatch({
          type: actionTypes.SET_ELSE_RESPONSE_ALERT,
          payload: {
            state: true,
            alertTitle: '',
            alertText: message,
            onPress: () => {
              navigation.goBack();
            },
          },
        });
      });
  };

// ***** ENDS VIEW ACCOUNTS STATEMENT DATA : DASHBOARD => MyAccounts => View Accounts => ACCOUNT => HIT *****

//***************EDIT BENEFICARY****************** */
export const update_benef =
  (navigation, benefID, benefAlias, benefEmail, benefMobile) =>
  async (dispatch) => {
    dispatch({
      type: actionTypes.SET_LOADER,
      payload: true,
    });
    axios
      .put(
        `${Config.base_url.UAT_URL}${Config.method.my}/${Config.endpoint.updatebeneficary}?channel=${Config.channel.channel}`,
        {
          benefID: benefID,
          benefiAlias: benefAlias,
          benefiEmail: benefEmail,
          benefiMobile: benefMobile,
        },
        {
          headers: {'X-Auth-Token': store.getState().reducers.token},
        },
      )
      .then((response) => {
        if (response.status === 200 && response.data.responseCode === '00') {
          dispatch({
            type: actionTypes.SET_TOKEN,
            payload: response?.headers?.['x-auth-next-token'],
          });
          setTimeout(() => {
            dispatch({
              type: actionTypes.GLOBAL_ICON_ALERT_STATE,
              payload: {
                state: true,
                navigation: navigation,
                props: {
                  message: 'Beneficiary Updated successfully',
                  successAlert: true,
                  onPressOk: () => {
                    navigation.navigate('BeneficiaryManagement');
                    // hideGlobalIconAlert();
                  },
                },
              },
            });
          }, 500);
          // setTimeout(() => {
          //   dispatch({
          //     type: actionTypes.SET_ELSE_RESPONSE_ALERT,
          //     payload: {
          //       state: true,
          //       alertTitle: '',
          //       alertText: 'Beneficary Updated successfully',
          //     },
          //   });
          // }, 500);

          dispatch({
            type: actionTypes.SET_LOADER,
            payload: false,
          });
        } else {
          if (response?.headers?.['x-auth-next-token']) {
            dispatch({
              type: actionTypes.SET_TOKEN,
              payload: response?.headers?.['x-auth-next-token'],
            });
          }
          dispatch({
            type: actionTypes.SET_LOADER,
            payload: false,
          });
          // dispatch({
          //   type: actionTypes.SET_ELSE_RESPONSE_ALERT,
          //   payload: {
          //     state: true,
          //     alertTitle: 'Beneficary Update',
          //     alertText: response.data?.data?.message
          //       ? response.data.data.message
          //       : response.data.responseDescription,
          //   },
          // });
          setTimeout(() => {
            dispatch({
              type: actionTypes.GLOBAL_ICON_ALERT_STATE,
              payload: {
                state: true,
                navigation: navigation,
                props: {
                  message: response.data?.data?.message
                    ? response.data.data.message
                    : response.data.responseDescription,
                  onPressOk: () => {
                    navigation.navigate('BeneficiaryManagement');
                    // hideGlobalIconAlert();
                  },
                },
              },
            });
          }, 500);
          if (sessionControl(response)) {
            navigation.dispatch(
              CommonActions.reset({
                index: 0,
                routes: [{name: 'Login'}],
              }),
            );
            dispatch({
              type: actionTypes.CLEAR_APP_DATA,
            });
          }
        }
      })
      .catch((error) => {
        dispatch({
          type: actionTypes.SET_LOADER,
          payload: false,
        });
        setTimeout(() => {
          dispatch({
            type: actionTypes.GLOBAL_ICON_ALERT_STATE,
            payload: {
              state: true,
              navigation: navigation,
              props: {
                message: error.data?.data?.message
                  ? error.data.data.message
                  : error.data.responseDescription,
                onPressOk: () => {
                  navigation.navigate('BeneficiaryManagement');
                  // hideGlobalIconAlert();
                },
              },
            },
          });
        }, 500);
        // dispatch({
        //   type: actionTypes.SET_ELSE_RESPONSE_ALERT,
        //   payload: {
        //     state: true,
        //     alertTitle: 'Beneficary Update',
        //     alertText: response.data?.data?.message
        //       ? response.data.data.message
        //       : response.data.responseDescription,
        //   },
        // });
      });
  };

//***************EDIT BENEFICARY END****************** */

//*************************ADD BENEFICIARY******************** */
export const add_benef =
  (
    navigation,
    params,
    // accountno,
    // benefAlias,
    // benefiEmail,
    // benefiMobile,
    // benefiTitle,
    // benefiType,
    // companyName,
    // imd,
    // token,
    // tranType,
  ) =>
  async (dispatch) => {
    dispatch({
      type: actionTypes.SET_LOADER,
      payload: true,
    });

    logs.log(`raffy   =>>${JSON.stringify(params)}`);

    axios
      .put(
        `${Config.base_url.UAT_URL}${Config.method.my}/${Config.endpoint.beneficary}`,
        params,
        {
          headers: {'X-Auth-Token': store.getState().reducers.token},
        },
      )

      .then((response) => {
        if (response.status === 200 && response.data.responseCode === '00') {
          dispatch({
            type: actionTypes.SET_TOKEN,
            payload: response?.headers?.['x-auth-next-token'],
          });

          navigation.navigate('BeneficiaryMpin', {response: response.data});
          dispatch({
            type: actionTypes.SET_LOADER,
            payload: false,
          });
        } else {
          if (sessionControl(response)) {
            navigation.dispatch(
              CommonActions.reset({
                index: 0,
                routes: [{name: 'Login'}],
              }),
            );
            dispatch({
              type: actionTypes.CLEAR_APP_DATA,
            });
          }

          if (response?.headers?.['x-auth-next-token']) {
            dispatch({
              type: actionTypes.SET_TOKEN,
              payload: response?.headers?.['x-auth-next-token'],
            });
          }
          dispatch({
            type: actionTypes.SET_LOADER,
            payload: false,
          });
          dispatch({
            type: actionTypes.GLOBAL_ICON_ALERT_STATE,
            payload: {
              state: true,
              navigation: navigation,
              props: {
                message: response.data?.data?.message
                  ? response.data.data.message
                  : response.data.responseDescription,
                onPressOk: () => {
                  navigation.navigate('AddBeneficiary');
                  // hideGlobalIconAlert();
                },
              },
            },
          });

          // dispatch({
          //   type: actionTypes.SET_ELSE_RESPONSE_ALERT,
          //   payload: {
          //     state: true,
          //     alertTitle: '',
          //     alertText: response.data?.data?.message
          //       ? response.data.data.message
          //       : response.data.responseDescription,
          //   },
          // });
        }
      })
      .catch((error) => {
        dispatch({
          type: actionTypes.SET_LOADER,
          payload: false,
        });
      });
  };
//************************* END OF ADD BENEFICIARY******************** */
//************************* START VALIDATE ADD BENEFICIARY******************** */

export const validate_add_benef =
  (
    navigation,
    params,
    // accountno,
    // benefAlias,
    // benefiEmail,
    // benefiMobile,
    // benefiTitle,
    // benefiType,
    // companyName,
    // imd,
    // token,
    // tranType,
  ) =>
  async (dispatch) => {
    dispatch({
      type: actionTypes.SET_LOADER,
      payload: true,
    });
    logs.logRequest(
      `${Config.base_url.UAT_URL}${Config.method.my}/${Config.endpoint.beneficary}`,
      params,
      {
        headers: {'X-Auth-Token': store.getState().reducers.token},
      },
    );
    axios
      .post(
        `${Config.base_url.UAT_URL}${Config.method.my}/${Config.endpoint.beneficary}`,
        params,
        {
          headers: {'X-Auth-Token': store.getState().reducers.token},
        },
      )

      .then((response) => {
        logs.log('one you have added bened suvccess', response?.data);
        if (response.status === 200 && response.data.responseCode === '00') {
          dispatch({
            type: actionTypes.SET_TOKEN,
            payload: response?.headers?.['x-auth-next-token'],
          });
          logs.log('one you have added bened suvccess');
          dispatch({
            type: actionTypes.GLOBAL_ICON_ALERT_STATE,
            payload: {
              state: true,
              navigation: navigation,
              props: {
                message: 'Your beneficiary has been successfully added',
                successAlert: true,
                onPressOk: () => {
                  navigation.navigate('Home');
                  // hideGlobalIconAlert();
                },
              },
            },
          });
          // navigation.navigate('BeneficiaryManagement');

          // dispatch({
          //   type: actionTypes.SET_ELSE_RESPONSE_ALERT,
          //   payload: {
          //     state: true,
          //     alertTitle: '',
          //     alertText: 'Your beneficiary has been successfully added',
          //   },
          // });
          //  navigation.navigate('BeneficiaryMpin', {response: response.data});
          dispatch({
            type: actionTypes.SET_LOADER,
            payload: false,
          });
        } else {
          if (sessionControl(response)) {
            navigation.dispatch(
              CommonActions.reset({
                index: 0,
                routes: [{name: 'Login'}],
              }),
            );
            dispatch({
              type: actionTypes.CLEAR_APP_DATA,
            });
          }

          if (response?.headers?.['x-auth-next-token']) {
            dispatch({
              type: actionTypes.SET_TOKEN,
              payload: response?.headers?.['x-auth-next-token'],
            });
          }
          dispatch({
            type: actionTypes.SET_LOADER,
            payload: false,
          });
          dispatch({
            type: actionTypes.GLOBAL_ICON_ALERT_STATE,
            payload: {
              state: true,
              navigation: navigation,
              props: {
                message: response.data?.data?.message
                  ? response.data.data.message
                  : response.data.responseDescription,
                // successAlert: true,
                onPressOk: () => {
                  // navigation.navigate('BeneficiaryManagement');
                  // hideGlobalIconAlert();
                },
              },
            },
          });
          // dispatch({
          //   type: actionTypes.SET_ELSE_RESPONSE_ALERT,
          //   payload: {
          //     state: true,
          //     alertTitle: '',
          //     alertText: response.data?.data?.message
          //       ? response.data.data.message
          //       : response.data.responseDescription,
          //   },
          // });
        }
      })
      .catch((error) => {
        dispatch({
          type: actionTypes.SET_LOADER,
          payload: false,
        });
      });
  };

// ***** SEND EMAIL STATEMENT DATA *****
export const sendEmailStatementData =
  (token, navigation, accountNumber, accountType, fromDate, toDate) =>
  async (dispatch) => {
    dispatch({
      type: actionTypes.SET_LOADER,
      payload: true,
    });
    logs.log(
      `${Config.base_url.UAT_URL}${Config.method.my}/${Config.endpoint.statement}/${accountNumber}/${accountType}?fromDate=${fromDate}&toDate=${toDate}&sendEmail=true&isBalanceRequired=false`,
    );
    axios
      .get(
        `${Config.base_url.UAT_URL}${Config.method.my}/${Config.endpoint.statement}/${accountNumber}/${accountType}?fromDate=${fromDate}&toDate=${toDate}&sendEmail=true&isBalanceRequired=false`,
        {
          headers: {
            'X-Auth-Token': store.getState().reducers.token,
          },
        },
      )
      .then((response) => {
        if (response.status === 200 && response.data.responseCode === '00') {
          dispatch({
            type: actionTypes.SET_TOKEN,
            payload: response?.headers?.['x-auth-next-token'],
          });
          dispatch({
            type: actionTypes.SET_LOADER,
            payload: false,
          });
          global.showToast.show(
            I18n['Email has been successfully sent.'],
            1000,
          );
        } else {
          if (response?.headers?.['x-auth-next-token']) {
            dispatch({
              type: actionTypes.SET_TOKEN,
              payload: response?.headers?.['x-auth-next-token'],
            });
          }
          if (sessionControl(response)) {
            navigation.dispatch(
              CommonActions.reset({
                index: 0,
                routes: [{name: 'Login'}],
              }),
            );
            dispatch({
              type: actionTypes.CLEAR_APP_DATA,
            });
          }
          dispatch({
            type: actionTypes.SET_LOADER,
            payload: false,
          });

          dispatch({
            type: actionTypes.SET_ELSE_RESPONSE_ALERT,
            payload: {
              state: true,
              alertTitle: '',
              alertText: response.data?.data?.message
                ? response.data.data.message
                : response.data.responseDescription,
            },
          });
        }
      })
      .catch((error) => {
        dispatch({
          type: actionTypes.SET_LOADER,
          payload: false,
        });
        let message = '';
        if (!error.status) {
          // network error
          message = Message.networkErrorMessage;
        } else {
          message = String(error);
        }
        dispatch({
          type: actionTypes.SET_ELSE_RESPONSE_ALERT,
          payload: {
            state: true,
            alertTitle: '',
            alertText: message,
          },
        });
      });
  };
// ***** ENDS SEND EMAIL STATEMENT DATA *****

//***** UPDATE STATEMENT DATA *****
export const updateViewStatementsData =
  (token, navigation, accountNumber, accountType, fromDate, toDate, noEmail) =>
  async (dispatch) => {
    dispatch({
      type: actionTypes.SET_VIEW_ACCOUNT_STATEMENT_DATA,
      payload: [],
    });
    dispatch({
      type: actionTypes.SET_LOADER,
      payload: true,
    });

    axios
      .get(
        `${Config.base_url.UAT_URL}${Config.method.my}/${
          Config.endpoint.statement
        }/${accountNumber}/${accountType}?fromDate=${fromDate}&toDate=${toDate}&sendEmail=${
          noEmail ? false : true
        }&isBalanceRequired=false`,
        {
          headers: {
            'X-Auth-Token': store.getState().reducers.token,
          },
        },
      )
      .then((response) => {
        if (response.status === 200 && response.data.responseCode === '00') {
          dispatch({
            type: actionTypes.SET_TOKEN,
            payload: response?.headers?.['x-auth-next-token'],
          });
          dispatch({
            type: actionTypes.SET_VIEW_ACCOUNT_STATEMENT_DATA,
            payload: response.data,
          });
          dispatch({
            type: actionTypes.SET_LOADER,
            payload: false,
          });
        } else {
          if (response?.headers?.['x-auth-next-token']) {
            dispatch({
              type: actionTypes.SET_TOKEN,
              payload: response?.headers?.['x-auth-next-token'],
            });
          }
          if (sessionControl(response)) {
            navigation.dispatch(
              CommonActions.reset({
                index: 0,
                routes: [{name: 'Login'}],
              }),
            );
            dispatch({
              type: actionTypes.CLEAR_APP_DATA,
            });
            dispatch({
              type: actionTypes.SET_LOADER,
              payload: false,
            });
            dispatch({
              type: actionTypes.SET_ELSE_RESPONSE_ALERT,
              payload: {
                state: true,
                alertTitle: '',
                alertText: response.data?.data?.message
                  ? response.data.data.message
                  : response.data.responseDescription,
              },
            });
          } else {
            dispatch({
              type: actionTypes.SET_LOADER,
              payload: false,
            });
            dispatch({
              type: actionTypes.SET_ELSE_RESPONSE_ALERT,
              payload: {
                state: true,
                alertTitle: '',
                alertText: I18n['No Transaction Found.'],
              },
            });
          }
        }
      })
      .catch((error) => {
        dispatch({
          type: actionTypes.SET_LOADER,
          payload: false,
        });
        let message = '';
        if (!error.status) {
          // network error
          message = Message.networkErrorMessage;
        } else {
          message = String(error);
        }
        dispatch({
          type: actionTypes.SET_ELSE_RESPONSE_ALERT,
          payload: {
            state: true,
            alertTitle: '',
            alertText: message,
          },
        });
      });
  };
// ***** ENDS UPDATE STATMENT DATA

// ***** ADD ACCOUNT MY ACCOUNTS
export const addAccount =
  (
    token,
    navigation,
    amount,
    benefiType,
    cnic,
    fromAccount,
    imd,
    otac,
    purposeOfPayment,
    titleFetchAccount,
  ) =>
  async (dispatch) => {
    dispatch({
      type: actionTypes.SET_LOADER,
      payload: true,
    });
    logs.logRequest(
      `${Config.base_url.UAT_URL}${Config.method.transfer}/${Config.endpoint.titlefetch},
  {
    amount: ${amount},
    benefiType: ${benefiType},
    cnic: ${cnic},
    fromAccount: ${fromAccount},
    imd: ${imd},
    titleFetchAccount: ${titleFetchAccount},
  },
  {
    headers: {
      'X-Auth-Token': ${token},
    },
  },`,
    );
    axios
      .post(
        `${Config.base_url.UAT_URL}${Config.method.transfer}/${Config.endpoint.titlefetch}`,
        {
          amount: amount,
          benefiType: benefiType,
          cnic: cnic,
          fromAccount: fromAccount,
          imd: imd,
          titleFetchAccount: titleFetchAccount,
        },
        {
          headers: {
            'X-Auth-Token': token,
          },
        },
      )
      .then((response) => {
        logs.log(response.data);
        if (response.status === 200 && response.data.responseCode === '00') {
          dispatch({
            type: actionTypes.SET_TOKEN,
            payload: response?.headers?.['x-auth-next-token'],
          });
          let routeObject = {...response.data.data, cnic, titleFetchAccount};
          navigation.navigate('AddDetail', {data: routeObject});

          dispatch({
            type: actionTypes.SET_LOADER,
            payload: false,
          });
        } else {
          if (response?.headers?.['x-auth-next-token']) {
            dispatch({
              type: actionTypes.SET_TOKEN,
              payload: response?.headers?.['x-auth-next-token'],
            });
          }
          if (sessionControl(response)) {
            navigation.dispatch(
              CommonActions.reset({
                index: 0,
                routes: [{name: 'Login'}],
              }),
            );
            dispatch({
              type: actionTypes.CLEAR_APP_DATA,
            });
          }
          dispatch({
            type: actionTypes.SET_LOADER,
            payload: false,
          });

          dispatch({
            type: actionTypes.SET_ELSE_RESPONSE_ALERT,
            payload: {
              state: true,
              alertTitle: '',
              alertText: response.data?.data?.message
                ? response.data.data.message
                : response.data.responseDescription,
            },
          });
        }
      })
      .catch((error) => {
        dispatch({
          type: actionTypes.SET_LOADER,
          payload: false,
        });
        let message = '';
        if (!error.status) {
          // network error
          message = Message.networkErrorMessage;
        } else {
          message = String(error);
        }
        dispatch({
          type: actionTypes.SET_ELSE_RESPONSE_ALERT,
          payload: {
            state: true,
            alertTitle: '',
            alertText: message,
          },
        });
      });
  };
// ***** ENDS ADD ACCOUNT MY ACCOUNTS

// ***** MY ACCOUNT ADD ACCOUNT ***** //
export const addAccountPut =
  (navigation, atmPin, cardNumber, cnic, object) => async (dispatch) => {
    // {"atmPin":"1111","cardNumber":"6243860080061576","cnic":"4230146389023"}
    dispatch({
      type: actionTypes.SET_LOADER,
      payload: true,
    });
    logs.logRequest(
      `${Config.base_url.UAT_URL}${Config.method.my}/${Config.endpoint.account},
      {
        accountNumber: ${
          object.titleFetchAccount ? object.titleFetchAccount : ''
        },
        accountType: 'Savings-Account',
        otp: '',
        token: ${object.token ? object.token : ''},
      },
      {
        headers: ${{'X-Auth-Token': store.getState().reducers.token}},
      },`,
    );
    axios
      .put(
        `${Config.base_url.UAT_URL}${Config.method.my}/${Config.endpoint.account}`,
        {
          accountNumber: object.titleFetchAccount
            ? object.titleFetchAccount
            : '',
          accountType: 'Savings-Account',
          otp: '',
          token: object.token ? object.token : '',
        },
        {
          headers: {'X-Auth-Token': store.getState().reducers.token},
        },
      )
      .then((response) => {
        logs.logResponse(response.data);
        if (response.status === 200 && response.data.responseCode === '00') {
          dispatch({
            type: actionTypes.SET_TOKEN,
            payload: response?.headers?.['x-auth-next-token'],
          });
          dispatch({
            type: actionTypes.SET_LOADER,
            payload: false,
          });
          // dispatch({
          //   type: actionTypes.SET_ELSE_RESPONSE_ALERT,
          //   payload: {
          //     state: true,
          //     alertTitle: 'Add Account',
          //     alertText: 'Account added successfully.',
          //     onPress: () => {
          //       navigation.goBack();
          //       navigation.goBack();
          //     },
          //   },
          // });
          setTimeout(() => {
            dispatch({
              type: actionTypes.GLOBAL_ICON_ALERT_STATE,
              payload: {
                state: true,
                navigation: navigation,
                props: {
                  successAlert: true,
                  message: 'Account Added Successfully',
                  onPressOk: () => {
                    hideGlobalIconAlert();
                    navigation.dispatch(
                      CommonActions.reset({
                        index: 0,
                        routes: [{name: 'Home'}],
                      }),
                    );
                  },
                },
              },
            });
          }, 500);
        } else {
          if (response?.headers?.['x-auth-next-token']) {
            dispatch({
              type: actionTypes.SET_TOKEN,
              payload: response?.headers?.['x-auth-next-token'],
            });
          }
          if (sessionControl(response)) {
            navigation.dispatch(
              CommonActions.reset({
                index: 0,
                routes: [{name: 'Login'}],
              }),
            );
            dispatch({
              type: actionTypes.CLEAR_APP_DATA,
            });
          }

          dispatch({
            type: actionTypes.SET_LOADER,
            payload: false,
          });

          dispatch({
            type: actionTypes.SET_ELSE_RESPONSE_ALERT,
            payload: {
              state: true,
              alertTitle: 'Add Account',
              alertText: response.data?.data?.message
                ? response.data.data.message
                : response.data.responseDescription,
            },
          });
        }
      })
      .catch((error) => {
        logs.log(`error ${error}`);
        dispatch({
          type: actionTypes.SET_LOADER,
          payload: false,
        });
        let message = '';
        if (!error.status) {
          // network err
          message = Message.networkErrorMessage;
        } else {
          message = String(error);
        }
        dispatch({
          type: actionTypes.SET_ELSE_RESPONSE_ALERT,
          payload: {
            state: true,
            alertTitle: 'Add Account',
            alertText: message,
          },
        });
      });
  };
// ***** ENDS MY ACCOUNT ADD ACCOUNT ***** //

// ***** MANAGE ACCOUNTS *****
export const manageAccounts = (token, navigation) => async (dispatch) => {
  dispatch({
    type: actionTypes.SET_LOADER,
    payload: true,
  });
  axios
    .get(
      `${Config.base_url.UAT_URL}${Config.method.my}/${Config.endpoint.accounts}`,
      {
        headers: {
          'X-Auth-Token': token,
        },
        channel: Config.channel.channel,
      },
    )
    .then((response) => {
      if (response.status === 200 && response.data.responseCode === '00') {
        dispatch({
          type: actionTypes.SET_TOKEN,
          payload: response?.headers?.['x-auth-next-token'],
        });
        dispatch({
          type: actionTypes.SET_MANAGE_ACCOUNTS_DATA,
          payload: response.data.data,
        });
        navigation.navigate('ManageAccounts');
        dispatch({
          type: actionTypes.SET_LOADER,
          payload: false,
        });
      } else {
        if (response?.headers?.['x-auth-next-token']) {
          dispatch({
            type: actionTypes.SET_TOKEN,
            payload: response?.headers?.['x-auth-next-token'],
          });
        }
        if (sessionControl(response)) {
          navigation.dispatch(
            CommonActions.reset({
              index: 0,
              routes: [{name: 'Login'}],
            }),
          );
          dispatch({
            type: actionTypes.CLEAR_APP_DATA,
          });
        }
        dispatch({
          type: actionTypes.SET_LOADER,
          payload: false,
        });

        dispatch({
          type: actionTypes.SET_ELSE_RESPONSE_ALERT,
          payload: {
            state: true,
            alertTitle: '',
            alertText: response.data?.data?.message
              ? response.data.data.message
              : response.data.responseDescription,
          },
        });
      }
    })
    .catch((error) => {
      dispatch({
        type: actionTypes.SET_LOADER,
        payload: false,
      });
      let message = '';
      if (!error.status) {
        // network error
        message = Message.networkErrorMessage;
      } else {
        message = String(error);
      }
      dispatch({
        type: actionTypes.SET_ELSE_RESPONSE_ALERT,
        payload: {
          state: true,
          alertTitle: '',
          alertText: message,
        },
      });
    });
};
// ***** ENDS MANAGE ACCOUNTS *****
// ***** MANAGED ACCOUNT DETAILS *****
export const managedAccountDetails =
  (token, navigation, item) => async (dispatch) => {
    dispatch({
      type: actionTypes.SET_LOADER,
      payload: true,
    });
    axios
      .get(
        `${Config.base_url.UAT_URL}${Config.method.my}/${Config.endpoint.overview_without_balance}`,
        {
          headers: {
            'X-Auth-Token': token,
          },
          channel: Config.channel.channel,
        },
      )
      .then((response) => {
        if (response.status === 200 && response.data.responseCode === '00') {
          dispatch({
            type: actionTypes.SET_TOKEN,
            payload: response?.headers?.['x-auth-next-token'],
          });
          dispatch({
            type: actionTypes.SET_MANAGED_ACCOUNT_DETAILS,
            payload: response.data.data,
          });
          navigation.navigate('ManageAccountsDetails', {data: item});
          dispatch({
            type: actionTypes.SET_LOADER,
            payload: false,
          });
        } else {
          if (response?.headers?.['x-auth-next-token']) {
            dispatch({
              type: actionTypes.SET_TOKEN,
              payload: response?.headers?.['x-auth-next-token'],
            });
          }
          if (sessionControl(response)) {
            navigation.dispatch(
              CommonActions.reset({
                index: 0,
                routes: [{name: 'Login'}],
              }),
            );
            dispatch({
              type: actionTypes.CLEAR_APP_DATA,
            });
          }
          dispatch({
            type: actionTypes.SET_LOADER,
            payload: false,
          });

          dispatch({
            type: actionTypes.SET_ELSE_RESPONSE_ALERT,
            payload: {
              state: true,
              alertTitle: '',
              alertText: response.data?.data?.message
                ? response.data.data.message
                : response.data.responseDescription,
            },
          });
        }
      })
      .catch((error) => {
        dispatch({
          type: actionTypes.SET_LOADER,
          payload: false,
        });
        let message = '';
        if (!error.status) {
          // network error
          message = Message.networkErrorMessage;
        } else {
          message = String(error);
        }
        dispatch({
          type: actionTypes.SET_ELSE_RESPONSE_ALERT,
          payload: {
            state: true,
            alertTitle: '',
            alertText: message,
          },
        });
      });
  };
// ***** ENDS MANAGED ACCOUNT DETAILS

// ***** SET ACCOUNT AS DEFAULT *****
export const setManageAccountState =
  (token, accountNumber, setDefault, removeAccount, navigation, user) =>
  async (dispatch) => {
    dispatch({
      type: actionTypes.SET_LOADER,
      payload: true,
    });

    axios
      .post(
        `${Config.base_url.UAT_URL}${Config.method.my}/${Config.endpoint.updateAccount}`,
        {
          accountNumber: accountNumber,
          default: setDefault,
          remove: removeAccount,
        },
        {
          headers: {
            'X-Auth-Token': token,
          },
        },
      )
      .then((response) => {
        if (
          response.status === 200 &&
          // (response.data.responseCode === '66' ||
          //   response.data.responseCode === '67' ||
          response.data.responseCode === '00'
          // )
        ) {
          dispatch({
            type: actionTypes.SET_TOKEN,
            payload: response?.headers?.['x-auth-next-token'],
          });
          dispatch({
            type: actionTypes.SET_LOADER,
            payload: false,
          });
          let message = '';
          if (setDefault) {
            message = `${user.accountType}-${accountNumber} has been Set as Default Account.`;
          } else {
            // navigation.pop(2) crash on drawer push and pop not supported

            message = `${user.accountType}-${accountNumber} has been removed from your linked accounts.`;
          }
          // dispatch({
          //   type: actionTypes.SET_ELSE_RESPONSE_ALERT,
          //   payload: {
          //     state: true,
          //     alertTitle: 'Manage Account',
          //     alertText: message,
          //     onPress: () => {
          //       if (setDefault) {
          //         navigation.goBack();
          //       } else {
          //         navigation.goBack();
          //         navigation.goBack();
          //       }
          //     },
          //   },
          // });
          setTimeout(() => {
            dispatch({
              type: actionTypes.GLOBAL_ICON_ALERT_STATE,
              payload: {
                state: true,
                navigation: navigation,
                props: {
                  successAlert: true,
                  message: message,
                  onPressOk: () => {
                    navigation.dispatch(
                      CommonActions.reset({
                        index: 0,
                        routes: [{name: 'Home'}],
                      }),
                    );
                    hideGlobalIconAlert();
                  },
                },
              },
            });
          }, 500);
        } else {
          if (response?.headers?.['x-auth-next-token']) {
            dispatch({
              type: actionTypes.SET_TOKEN,
              payload: response?.headers?.['x-auth-next-token'],
            });
          }
          if (sessionControl(response)) {
            navigation.dispatch(
              CommonActions.reset({
                index: 0,
                routes: [{name: 'Login'}],
              }),
            );
            dispatch({
              type: actionTypes.CLEAR_APP_DATA,
            });
          }
          dispatch({
            type: actionTypes.SET_LOADER,
            payload: false,
          });

          dispatch({
            type: actionTypes.SET_ELSE_RESPONSE_ALERT,
            payload: {
              state: true,
              alertTitle: 'Manage Account',
              alertText: response.data?.data?.message
                ? response.data.data.message
                : response.data.responseDescription,
            },
          });
        }
      })
      .catch((error) => {
        dispatch({
          type: actionTypes.SET_LOADER,
          payload: false,
        });
        let message = '';
        if (!error.status) {
          // network error
          message = Message.networkErrorMessage;
        } else {
          message = String(error);
        }
        dispatch({
          type: actionTypes.SET_ELSE_RESPONSE_ALERT,
          payload: {
            state: true,
            alertTitle: '',
            alertText: message,
          },
        });
      });
  };
// ***** ENDS SET ACCOUNT AS DEFAULT *****

// ***** MOBILE TOP UP COMPANY AND BENEFICIARY DATA*****
export const setMobileTopUpLimits = (limits) => {
  return {
    type: actionTypes.SET_MOBILE_TOP_UP_LIMITS,
    payload: limits,
  };
};
export const mobileTopUp =
  (token, navigation, isPayBenef, benefObject) => async (dispatch) => {
    dispatch({
      type: actionTypes.SET_LOADER,
      payload: true,
    });
    if (isPayBenef) {
      navigation.navigate('MobileBillPayment', {
        data: {isPayBenef, benefObject},
      });
    } else {
      navigation.navigate('MobileTopUp');
    }

    axios
      .get(
        `${Config.base_url.UAT_URL}${Config.method.bill}/${Config.endpoint.mobileLimits}`,
        {
          headers: {
            'X-Auth-Token': token,
          },
        },
      )

      .then((response) => {
        if (response.status === 200 && response.data.responseCode === '00') {
          dispatch({
            type: actionTypes.SET_TOKEN,
            payload: response?.headers?.['x-auth-next-token'],
          });
          dispatch({
            type: actionTypes.SET_MOBILE_TOP_UP_LIMITS,
            payload: response.data.data.limits,
          });
          dispatch({
            type: actionTypes.SET_LOADER,
            payload: false,
          });
          // axios
          //   .get(
          // `${Config.base_url.UAT_URL}${Config.method.my}/${Config.endpoint.beneficiaries}?benefTypes=4&status=1`,
          //     {
          //       headers: {
          //         'X-Auth-Token': store.getState().reducers.token,
          //       },
          //     },
          //   )
          //   .then((res) => {
          //     if (res.status === 200 && res.data.responseCode === '00') {
          //       dispatch({
          //         type: actionTypes.SET_TOKEN,
          //         payload: res.headers['x-auth-next-token'],
          //       });
          //       dispatch({
          //         type: actionTypes.SET_MOBILE_TOP_UP_BENEFICIARY_DATA,
          //         payload: res.data.data.beneficiaries,
          //       });

          //       dispatch({
          //         type: actionTypes.SET_LOADER,
          //         payload: false,
          //       });
          //     } else {
          //       if (res.headers['x-auth-next-token']) {
          //         dispatch({
          //           type: actionTypes.SET_TOKEN,
          //           payload: res.headers['x-auth-next-token'],
          //         });
          //       }
          //         navigation.dispatch(
          //           CommonActions.reset({
          //             index: 0,
          //             routes: [{name: 'Login'}],
          //           }),
          //         );
          //         dispatch({
          //           type: actionTypes.CLEAR_APP_DATA,
          //         });
          //       }
          //       dispatch({
          //         type: actionTypes.SET_LOADER,
          //         payload: false,
          //       });

          //       dispatch({
          //         type: actionTypes.SET_ELSE_RESPONSE_ALERT,
          //         payload: {
          //           state: true,
          //           alertTitle: '',
          //           alertText: res.data?.data?.message
          //             ? res.data.data.message
          //             : res.data.responseDescription,
          //         },
          //       });
          //     }
          //   })
          //   .catch((error) => {
          //     dispatch({
          //       type: actionTypes.SET_LOADER,
          //       payload: false,
          //     });
          //     let message = '';
          //     if (!error.status) {
          //       // network error
          //       message = Message.networkErrorMessage;
          //     } else {
          //       message = String(error);
          //     }
          //     dispatch({
          //       type: actionTypes.SET_ELSE_RESPONSE_ALERT,
          //       payload: {
          //         state: true,
          //         alertTitle: '',
          //         alertText: message,
          //       },
          //     });
          //   });
        } else {
          if (response?.headers?.['x-auth-next-token']) {
            dispatch({
              type: actionTypes.SET_TOKEN,
              payload: response?.headers?.['x-auth-next-token'],
            });
          }
          if (sessionControl(response)) {
            navigation.dispatch(
              CommonActions.reset({
                index: 0,
                routes: [{name: 'Login'}],
              }),
            );
            dispatch({
              type: actionTypes.CLEAR_APP_DATA,
            });
          } else {
            navigation.goBack();
          }
          dispatch({
            type: actionTypes.SET_LOADER,
            payload: false,
          });

          dispatch({
            type: actionTypes.SET_ELSE_RESPONSE_ALERT,
            payload: {
              state: true,
              alertTitle: '',
              alertText: response.data?.data?.message
                ? response.data.data.message
                : response.data.responseDescription,
            },
          });
        }
      })
      .catch((error) => {
        dispatch({
          type: actionTypes.SET_LOADER,
          payload: false,
        });
        let message = '';
        if (!error.status) {
          // network error
          message = Message.networkErrorMessage;
        } else {
          message = String(error);
        }
        dispatch({
          type: actionTypes.SET_ELSE_RESPONSE_ALERT,
          payload: {
            state: true,
            alertTitle: '',
            alertText: message,
            onPress: () => {
              navigation.goBack();
            },
          },
        });
      });
  };
// ***** ENDS MOBILE TOP UP COMPANY AND BENEFICIARY DATA*****

export const mobileBeneficiaries = (token, navigation) => async (dispatch) => {
  dispatch({
    type: actionTypes.SET_LOADER,
    payload: true,
  });
  axios
    .get(
      `${Config.base_url.UAT_URL}${Config.method.my}/${Config.endpoint.beneficiaries}?benefTypes=4&status=1`,
      {
        headers: {
          'X-Auth-Token': token,
        },
      },
    )
    .then((response) => {
      dispatch({
        type: actionTypes.SET_LOADER,
        payload: false,
      });
    })
    .catch((error) => {
      dispatch({
        type: actionTypes.SET_LOADER,
        payload: false,
      });
      let message = '';
      if (!error.status) {
        // network error
        message = Message.networkErrorMessage;
      } else {
        message = String(error);
      }
      dispatch({
        type: actionTypes.SET_ELSE_RESPONSE_ALERT,
        payload: {
          state: true,
          alertTitle: '',
          alertText: message,
        },
      });
    });
};

// ***** ENDS MOBILE BENEFICIARY DATA *****
// ***** GET BILL API REQUEST *****
export const getBillRequest =
  (token, ucid, consumerNumber, navigation, beneficiaryObject, onSuccess) =>
  async (dispatch) => {
    dispatch({
      type: actionTypes.SET_LOADER,
      payload: true,
    });
    logs.logRequest(
      `${Config.base_url.UAT_URL}bill/get?consumerNo=${consumerNumber}&ucid=${ucid},
      {
        headers: {
          'X-Auth-Token': ${token},
        },
      },`,
    );
    axios
      .get(
        `${Config.base_url.UAT_URL}bill/get?consumerNo=${consumerNumber}&ucid=${ucid}`,
        {
          headers: {
            'X-Auth-Token': token,
          },
        },
      )
      .then((response) => {
        logs.logResponse(response.data);
        let routeData = {data: {...response.data.data, ...beneficiaryObject}};
        if (response.status === 200 && response.data.responseCode === '00') {
          dispatch({
            type: actionTypes.SET_TOKEN,
            payload: response?.headers?.['x-auth-next-token'],
          });
          dispatch({
            type: actionTypes.SET_MOBILE_TOPUP_BILL_PAYMENT,
            payload: response.data.data,
          });
          logs.log('=================raffay here');
          onSuccess(routeData, response?.data?.data);
          dispatch({
            type: actionTypes.SET_LOADER,
            payload: false,
          });
        } else {
          if (response?.headers?.['x-auth-next-token']) {
            dispatch({
              type: actionTypes.SET_TOKEN,
              payload: response?.headers?.['x-auth-next-token'],
            });
          }
          if (sessionControl(response)) {
            navigation.dispatch(
              CommonActions.reset({
                index: 0,
                routes: [{name: 'Login'}],
              }),
            );
            dispatch({
              type: actionTypes.CLEAR_APP_DATA,
            });
          }
          dispatch({
            type: actionTypes.SET_LOADER,
            payload: false,
          });

          dispatch({
            type: actionTypes.SET_ELSE_RESPONSE_ALERT,
            payload: {
              state: true,
              alertTitle: '',
              alertText: response.data?.data?.message
                ? response.data.data.message
                : response.data.responseDescription,
            },
          });
        }
      })
      .catch((error) => {
        dispatch({
          type: actionTypes.SET_LOADER,
          payload: false,
        });
        let message = '';
        if (!error.status) {
          // network error
          message = Message.networkErrorMessage;
        } else {
          message = String(error);
        }
        dispatch({
          type: actionTypes.SET_ELSE_RESPONSE_ALERT,
          payload: {
            state: true,
            alertTitle: '',
            alertText: message,
          },
        });
      });
  };
// ***** ENDS GET BILL API REQUEST *****

// ***** PAY MOBILE BILL *****

export const beneficiaryPayMobileBill =
  (params, navigation, isDirectPayment) => async (dispatch) => {
    dispatch({type: actionTypes.SET_LOADER, payload: true});
    // mama
    logs.logRequest(
      `${Config.base_url.UAT_URL}${Config.method.my}/${Config.endpoint.otp},
      {
        accountNumber: ${params.benefAccount},
        isBenef: ${isDirectPayment ? false : true},
        benefType: ${params.benefType},
        imd: ${params.imd},
        tranType: ${params.tranType},
      },
      {
        headers: {
          'X-Auth-Token': ${store.getState().reducers.token},
        },
      },`,
    );
    axios
      .post(
        `${Config.base_url.UAT_URL}${Config.method.my}/${Config.endpoint.otp}`,
        {
          accountNumber: params.benefAccount,
          isBenef: isDirectPayment ? false : true,
          benefType: params.benefType,
          imd: params.imd,
          tranType: params.tranType,
        },
        {
          headers: {
            'X-Auth-Token': store.getState().reducers.token,
          },
        },
      )
      .then((response) => {
        logs.logResponse(response.data);
        if (response.status === 200 && response.data.responseCode === '00') {
          dispatch({
            type: actionTypes.SET_TOKEN,
            payload: response?.headers?.['x-auth-next-token'],
          });
          dispatch({
            type: actionTypes.SET_MOBILE_TOPUP_BILL_PAYMENT,
            payload: response.data.data,
          });
          const body = {
            amount: params.amount,
            benefType: params.benefType,
            benefiId: params.benefID,
            comments: params.comments,
            companyName: params.companyName,
            companyType: params.companyType,
            consumerNo: params.benefAccount,
            customerName: params.customerName,
            fromAccount: params.fromAccount,
            isBenef: true,
            otp: params.otp,
            rcvrEmailAddress: params.rcvrEmailAddress,
            rcvrMobileNumber: params.rcvrMobileNumber,
            token: params.token,
            ucid: params.imd,
            validateOTP: true,
          };
          logs.logRequest(
            `${Config.base_url.UAT_URL}${Config.method.bill}/${
              Config.endpoint.pay
            },
            ${JSON.stringify(body)},
            {
              headers: {
                'X-Auth-Token': store.getState().reducers.token,
              },
            },`,
          );
          axios
            .post(
              `${Config.base_url.UAT_URL}${Config.method.bill}/${Config.endpoint.pay}`,
              {
                amount: params.amount,
                benefType: params.benefType,
                benefiId: params.benefID,
                comments: params.comments,
                companyName: params.companyName,
                companyType: params.companyType,
                consumerNo: params.benefAccount,
                customerName: params.customerName,
                fromAccount: params.fromAccount,
                isBenef: true,
                otp: params.otp,
                rcvrEmailAddress: params.rcvrEmailAddress,
                rcvrMobileNumber: params.rcvrMobileNumber,
                token: params.token,
                ucid: params.imd,
                validateOTP: true,
              },
              {
                headers: {
                  'X-Auth-Token': store.getState().reducers.token,
                },
              },
            )
            .then((res) => {
              logs.logResponse(res.data);
              if (res.status === 200 && res.data.responseCode === '00') {
                dispatch({
                  type: actionTypes.SET_TOKEN,
                  payload: res.headers['x-auth-next-token'],
                });

                dispatch({
                  type: actionTypes.SET_LOADER,
                  payload: false,
                });

                dispatch(
                  actionChangeGlobalTransferAlertState(true, navigation, {
                    paymentType: globalPaymentTypes['Mobile Top Up'],
                    amount: params.amount,
                    fromName: `${
                      store.getState()?.reducers?.overViewData?.data?.accounts
                        ?.accountTitle
                    }`,
                    rrn: res?.data?.data?.rrn ? res?.data?.data?.rrn : false,
                    stanId: res?.data?.data?.transactionDetails?.stan
                      ? res?.data?.data?.transactionDetails?.stan
                      : false,
                    fromAccount: `${params.fromAccount}`,
                    toName: `${params.customerName}`,
                    toAccount: `${params.benefAccount}`,
                    onPressClose: () => {
                      dispatch(closeGlobalTransferAlert(navigation));
                    },
                  }),
                );
              } else {
                if (res.headers['x-auth-next-token']) {
                  dispatch({
                    type: actionTypes.SET_TOKEN,
                    payload: res.headers['x-auth-next-token'],
                  });
                }
                if (sessionControl(res)) {
                  navigation.dispatch(
                    CommonActions.reset({
                      index: 0,
                      routes: [{name: 'Login'}],
                    }),
                  );
                  dispatch({
                    type: actionTypes.CLEAR_APP_DATA,
                  });
                }
                dispatch({
                  type: actionTypes.SET_LOADER,
                  payload: false,
                });

                // dispatch({
                //   type: actionTypes.SET_ELSE_RESPONSE_ALERT,
                //   payload: {
                //     state: true,
                //     alertTitle: '',
                //     alertText: res.data?.data?.message
                //       ? res.data.data.message
                //       : res.data.responseDescription,
                //   },
                // });
                dispatch({
                  type: actionTypes.GLOBAL_ICON_ALERT_STATE,
                  payload: {
                    state: true,
                    navigation: navigation,
                    props: {
                      message: res.data?.data?.message
                        ? res.data.data.message
                        : res.data.responseDescription,
                      // successAlert: true,
                      onPressOk: () => {
                        navigation.dispatch(
                          CommonActions.reset({
                            index: 0,
                            routes: [{name: 'Home'}],
                          }),
                        ); // hideGlobalIconAlert();
                      },
                    },
                  },
                });
              }
            })
            .catch((err) => {
              logs.log(err);
              dispatch({
                type: actionTypes.SET_LOADER,
                payload: false,
              });
              let message = '';
              if (!err.status) {
                // network err
                message = Message.networkErrorMessage;
              } else {
                message = String(err);
              }
              dispatch({
                type: actionTypes.SET_ELSE_RESPONSE_ALERT,
                payload: {
                  state: true,
                  alertTitle: '',
                  alertText: message,
                },
              });
            });
        } else {
          if (response?.headers?.['x-auth-next-token']) {
            dispatch({
              type: actionTypes.SET_TOKEN,
              payload: response?.headers?.['x-auth-next-token'],
            });
          }
          if (sessionControl(response)) {
            navigation.dispatch(
              CommonActions.reset({
                index: 0,
                routes: [{name: 'Login'}],
              }),
            );
            dispatch({
              type: actionTypes.CLEAR_APP_DATA,
            });
          }
          dispatch({
            type: actionTypes.SET_LOADER,
            payload: false,
          });

          dispatch({
            type: actionTypes.SET_ELSE_RESPONSE_ALERT,
            payload: {
              state: true,
              alertTitle: '',
              alertText: response.data?.data?.message
                ? response.data.data.message
                : response.data.responseDescription,
            },
          });
        }
      })
      .catch((error) => {
        dispatch({
          type: actionTypes.SET_LOADER,
          payload: false,
        });
        let message = '';
        if (!error.status) {
          // network err
          message = Message.networkErrorMessage;
        } else {
          message = String(error);
        }
        dispatch({
          type: actionTypes.SET_ELSE_RESPONSE_ALERT,
          payload: {
            state: true,
            alertTitle: '',
            alertText: message,
          },
        });
      });
  };

// ***** ENDS PAY MOBILE BILL *****

//**************** */
export const QRMaking = (read, callback, navigation) => async (dispatch) => {
  try {
    let parsed = [];
    let tempString = read.data;
    logs.log(tempString);
    let count = 0;
    while (tempString != '') {
      count++;
      const tag = tempString.substring(0, 2);
      const length = parseInt(tempString.substring(2, 4));
      logs.log('======>', isNaN(length));
      if (isNaN(length)) {
        logs.log('break for inValid Qr');
        dispatch(
          setAppAlert('Invalid QR', '', navigation, () => {
            navigation.goBack();
          }),
        );
        break;
      }
      const value = tempString.substring(4, 4 + length);
      if (tag === '62') {
        let additionalMessage = value;
        const additionalMessageParsed = [];
        while (additionalMessage != '') {
          const addTag = additionalMessage.substring(0, 2);
          const addLength = parseInt(additionalMessage.substring(2, 4));
          const addValue = additionalMessage.substring(4, 4 + addLength);
          additionalMessage = additionalMessage.substring(
            4 + addLength,
            additionalMessage.length,
          );
          additionalMessageParsed.push({
            tag: addTag,
            length: addLength,
            value: addValue,
          });
        }
        tempString = tempString.substring(4 + length, tempString.length);
        parsed.push({tag, length, value: additionalMessageParsed});
        if (count > 1000) {
          dispatch(
            setAppAlert('Invalid Qr', '', navigation, () => {
              navigation.goBack();
            }),
          );
          break;
        }
      } else {
        tempString = tempString.substring(4 + length, tempString.length);
        parsed.push({tag, length, value});
      }
    }
    logs.log('parsed Object ', parsed);
    callback(parsed);
    return parsed;
  } catch (error) {
    logs.log(error);
    dispatch(
      setAppAlert('Invalid Qr', '', navigation, () => {
        navigation.goBack();
      }),
    );
  }
};

const parseDate = (dateString) => {
  const day = parseInt(dateString.slice(0, 2), 10);
  const month = parseInt(dateString.slice(2, 4), 10) - 1; // JavaScript months are 0-based
  const year = parseInt(dateString.slice(4, 8), 10);
  const hours = parseInt(dateString.slice(8, 10), 10);
  const minutes = parseInt(dateString.slice(10, 12), 10);

  return new Date(year, month, day, hours, minutes);
};
export const QRParsing =
  (read, setCameraOff, goBack, navigation) => async (dispatch) => {
    setCameraOff(true);
    logs.log('askjhdkajsh');
    let tempString = read.data;
    const P2pValue = tempString.substring(4, 6);
    const P2MValue = tempString.substring(4, 6);
    logs.log('P2MValue', P2MValue);
    if (P2pValue == '02') {
      try {
        let parsed = [];
        let tempString = read.data;
        logs.log(tempString);
        let count = 0;
        while (tempString != '') {
          count++;
          const tag = tempString.substring(0, 2);
          const length = parseInt(tempString.substring(2, 4));
          logs.log('======>', isNaN(length));
          if (isNaN(length)) {
            goBack();
            //aslkjiasd
            break;
          }
          const value = tempString.substring(4, 4 + length);
          if (tag === '62') {
            let additionalMessage = value;
            const additionalMessageParsed = [];
            while (additionalMessage != '') {
              const addTag = additionalMessage.substring(0, 2);
              const addLength = parseInt(additionalMessage.substring(2, 4));
              const addValue = additionalMessage.substring(4, 4 + addLength);
              additionalMessage = additionalMessage.substring(
                4 + addLength,
                additionalMessage.length,
              );
              additionalMessageParsed.push({
                tag: addTag,
                length: addLength,
                value: addValue,
              });
            }
            tempString = tempString.substring(4 + length, tempString.length);
            parsed.push({tag, length, value: additionalMessageParsed});
            if (count > 1000) {
              goBack();
              break;
            }
          } else {
            tempString = tempString.substring(4 + length, tempString.length);
            parsed.push({tag, length, value});
          }
        }
        logs.log('parsed Object ', parsed);
        const unformateDate = parsed.filter((obj) => obj.tag === '07')[0];
        const targetDate = moment(unformateDate?.value, 'DDMMYYYYHHmm').format(
          'YYYY-MM-DDTHH:MM:SS',
        );
        const currentDate = moment(new Date()).format('YYYY-MM-DDTHH:MM:SS');

        if (parsed.filter((obj) => obj.tag === '00')[0]) {
          let isP2P = parsed.filter((obj) => obj.tag === '00')[0];
          if (isP2P.value == '02') {
            let object = {};
            if (parsed.filter((obj) => obj.tag === '05')[0]) {
              let filteredAmount = parsed.filter((obj) => obj.tag === '05')[0];
              logs.log(filteredAmount.value);
              object.amount = filteredAmount.value;
            }
            let filteredIBAN = parsed.filter((obj) => obj.tag === '04')[0];
            object.iban = filteredIBAN.value;
            if (filteredIBAN.value.slice(4, 8) == 'NBPA') {
              setCameraOff(false);
              object.isQrRaast = true;
              dispatch(
                setUserObject({
                  ftPayment: {
                    toAccount: filteredIBAN.value,
                    isDirectPayment: true,
                    isRaastQr: true,
                    amount: object.amount,
                  },
                }),
              );

              if (targetDate < currentDate) {
                goBack(true);
              } else {
                navigation.navigate('FundsTransfer');
              }
            } else {
              const unsorted_reason = store.getState().reducers.raastbank;
              var foundBank = unsorted_reason.filter(
                (obj) =>
                  obj.prefix == filteredIBAN.value.slice(4, 8).toUpperCase(),
              );
              if (foundBank.length == 0) {
                goBack();
              } else {
                if (targetDate < currentDate) {
                  logs.log('---qr is expire>', targetDate, currentDate);
                  goBack(true);
                } else {
                  logs.log('qr is not expitre', targetDate, currentDate);
                  logs.log(object);
                  setCameraOff(false);
                  navigation.navigate('SendMoneyQRPay', {object});
                }
              }
            }

            // if (filteredIBAN.value.slice(4,8)!=)
          } else {
            goBack();
          }
        }
      } catch (error) {
        logs.log(error);
        goBack();
      }
    } else if (P2MValue == '01') {
      try {
        let parsed = [];
        if (ptoMQRParser(read.data)) {
          parsed = ptoMQRParser(read.data);
        } else {
          dispatch(
            setAppAlert('Invalid Qr', '', navigation, () => {
              navigation.goBack();
            }),
          );
        }

        logs.log('parsed Objects ', JSON.stringify(parsed));
        const qrCrc = read.data.slice(0, -4);
        const crc = require('crc');
        var strinCrc = crc.crc16ccitt(qrCrc).toString(16).toLocaleUpperCase();
        const crcValue = read.data.slice(-4);
        logs.log(
          'fron dtribg last 4 digit',
          crcValue,
          'calculated crc',
          strinCrc,
        );
        if (strinCrc.length !== 4) {
          logs.log('IN IF of CRC>>>>>>>>');
          if (strinCrc.length == 3) {
            strinCrc = `0${strinCrc}`;
          } else if (strinCrc.length == 2) {
            strinCrc = `00${strinCrc}`;
          } else if (strinCrc.length == 1) {
            strinCrc = `000${strinCrc}`;
          }
          logs.log('87129837129731', crcValue, '1927839123', strinCrc);
        }
        if (crcValue == strinCrc) {
          logs.log(
            'In condition crc = calculated value',
            crcValue,
            'calculated crc',
            strinCrc,
          );
          dispatch(
            setUserObject({
              PtoMObject: {
                ptomArray: parsed,
                ptoMQRString: read.data,
              },
            }),
          );
          navigation.navigate('PaymentQRCode');
        } else {
          dispatch(
            setAppAlert('Invalid Qr', '', navigation, () => {
              navigation.goBack();
            }),
          );
        }
      } catch (error) {
        logs.log(error);
        goBack();
      }
    } else {
      dispatch(
        setAppAlert('Invalid Qr', '', navigation, () => {
          navigation.goBack();
        }),
      );
    }
  };

// ***** DIRECT PAY MOBILE BILL *****

export const directPayMobileTopUpOtp =
  (params, navigation) => async (dispatch) => {
    dispatch({type: actionTypes.SET_LOADER, payload: true});
    // mama
    logs.logRequest(
      `${Config.base_url.UAT_URL}${Config.method.my}/${Config.endpoint.otp},
      {
        accountNumber: ${params.benefAccount},
        isBenef: false,
        benefType: ${params.benefType},
        imd: ${params.imd},
        tranType: ${params.tranType},
      },
      {
        headers: {
          'X-Auth-Token': ${store.getState().reducers.token},
        },
      },`,
    );
    axios
      .post(
        `${Config.base_url.UAT_URL}${Config.method.my}/${Config.endpoint.otp}`,
        {
          accountNumber: params.benefAccount,
          isBenef: false,
          benefType: params.benefType,
          imd: params.imd,
          tranType: params.tranType,
        },
        {
          headers: {
            'X-Auth-Token': store.getState().reducers.token,
          },
        },
      )
      .then((response) => {
        logs.logResponse(response.data);
        if (response.status === 200 && response.data.responseCode === '00') {
          dispatch({
            type: actionTypes.SET_TOKEN,
            payload: response?.headers?.['x-auth-next-token'],
          });
          dispatch({
            type: actionTypes.SET_MOBILE_TOPUP_BILL_PAYMENT,
            payload: response.data.data,
          });
          navigation.navigate('MobileTopUpMpin', {data: params});

          dispatch({
            type: actionTypes.SET_LOADER,
            payload: false,
          });
        } else {
          if (response?.headers?.['x-auth-next-token']) {
            dispatch({
              type: actionTypes.SET_TOKEN,
              payload: response?.headers?.['x-auth-next-token'],
            });
          }
          if (sessionControl(response)) {
            navigation.dispatch(
              CommonActions.reset({
                index: 0,
                routes: [{name: 'Login'}],
              }),
            );
            dispatch({
              type: actionTypes.CLEAR_APP_DATA,
            });
          }
          dispatch({
            type: actionTypes.SET_LOADER,
            payload: false,
          });

          dispatch({
            type: actionTypes.SET_ELSE_RESPONSE_ALERT,
            payload: {
              state: true,
              alertTitle: '',
              alertText: response.data?.data?.message
                ? response.data.data.message
                : response.data.responseDescription,
            },
          });
        }
      })
      .catch((error) => {
        dispatch({
          type: actionTypes.SET_LOADER,
          payload: false,
        });
        let message = '';
        if (!error.status) {
          // network err
          message = Message.networkErrorMessage;
        } else {
          message = String(error);
        }
        dispatch({
          type: actionTypes.SET_ELSE_RESPONSE_ALERT,
          payload: {
            state: true,
            alertTitle: '',
            alertText: message,
          },
        });
      });
  };

// ***** ENDS DIRECT PAY MOBILE BILL *****

// ***** DIRECT MOBILE TOPUP BILL PAY *****
export const directPayMobileTopUpBillPay =
  (params, navigation, mpin) => async (dispatch) => {
    dispatch({type: actionTypes.SET_LOADER, payload: true});
    const body = {
      amount: params.amount,
      benefType: params.benefType,
      benefiId: params.benefID,
      comments: params.comments,
      companyName: params.companyName,
      companyType: params.companyType,
      consumerNo: params.benefAccount,
      customerName: params.customerName,
      fromAccount: params.fromAccount,
      isBenef: false,
      otp: mpin,
      rcvrEmailAddress: params.rcvrEmailAddress,
      rcvrMobileNumber: params.rcvrMobileNumber,
      token: params.token,
      ucid: params.imd,
      validateOTP: true,
    };

    logs.logRequest(
      `${Config.base_url.UAT_URL}${Config.method.bill}/${Config.endpoint.pay},
      ${JSON.stringify(body)},
      {
        headers: {
          'X-Auth-Token': ${store.getState().reducers.token},
        },
      },`,
    );
    axios
      .post(
        `${Config.base_url.UAT_URL}${Config.method.bill}/${Config.endpoint.pay}`,
        {
          amount: params.amount,
          benefType: params.benefType,
          benefiId: params.benefID,
          comments: params.comments,
          companyName: params.companyName,
          companyType: params.companyType,
          consumerNo: params.benefAccount,
          customerName: params.customerName,
          fromAccount: params.fromAccount,
          isBenef: false,
          otp: mpin,
          rcvrEmailAddress: params.rcvrEmailAddress,
          rcvrMobileNumber: params.rcvrMobileNumber,
          token: params.token,
          ucid: params.imd,
          validateOTP: true,
        },
        {
          headers: {
            'X-Auth-Token': store.getState().reducers.token,
          },
        },
      )
      .then((res) => {
        logs.logResponse(res.data);
        if (res.status === 200 && res.data.responseCode === '00') {
          dispatch({
            type: actionTypes.SET_TOKEN,
            payload: res.headers['x-auth-next-token'],
          });
          // navigation.navigate('PaymentResponse', {
          //   data: res.data.data,
          // });
          // dispatch({
          //   type: actionTypes.GLOBAL_ICON_ALERT_STATE,
          //   payload: {
          //     state: true,
          //     navigation: navigation,
          //     props: {
          //       message: res.data.data.transactionDetails.displayMessage,
          //       successAlert: true,
          //       onPressOk: () => {
          //         navigation.dispatch(
          //           CommonActions.reset({
          //             index: 0,
          //             routes: [{name: 'Home'}],
          //           }),
          //         ); // hideGlobalIconAlert();
          //       },
          //     },
          //   },
          // });

          dispatch({
            type: actionTypes.SET_LOADER,
            payload: false,
          });
          dispatch(
            actionChangeGlobalTransferAlertState(true, navigation, {
              paymentType: globalPaymentTypes['Mobile Top Up'],
              amount: params.amount,
              fromName: `${
                store.getState()?.reducers?.overViewData?.data?.accounts
                  ?.accountTitle
              }`,
              rrn: res?.data?.data?.rrn ? res?.data?.data?.rrn : false,
              stanId: res?.data?.data?.transactionDetails?.stan
                ? res?.data?.data?.transactionDetails?.stan
                : false,
              fromAccount: `${params.fromAccount}`,
              toName: `${params.customerName}`,
              toAccount: `${params.benefAccount}`,
              onPressClose: () => {
                dispatch(closeGlobalTransferAlert(navigation));
              },
            }),
          );
        } else {
          if (res.headers['x-auth-next-token']) {
            dispatch({
              type: actionTypes.SET_TOKEN,
              payload: res.headers['x-auth-next-token'],
            });
          }
          if (sessionControl(res)) {
            navigation.dispatch(
              CommonActions.reset({
                index: 0,
                routes: [{name: 'Login'}],
              }),
            );
            dispatch({
              type: actionTypes.CLEAR_APP_DATA,
            });
          }
          dispatch({
            type: actionTypes.SET_LOADER,
            payload: false,
          });

          dispatch({
            type: actionTypes.SET_ELSE_RESPONSE_ALERT,
            payload: {
              state: true,
              alertTitle: '',
              alertText: res.data?.data?.message
                ? res.data.data.message
                : res.data.responseDescription,
            },
          });
        }
      })
      .catch((err) => {
        dispatch({
          type: actionTypes.SET_LOADER,
          payload: false,
        });
        let message = '';
        if (!err.status) {
          // network err
          message = Message.networkErrorMessage;
        } else {
          message = String(err);
        }
        // dispatch({
        //   type: actionTypes.SET_ELSE_RESPONSE_ALERT,
        //   payload: {
        //     state: true,
        //     alertTitle: '',
        //     alertText: message,
        //   },
        // });
        dispatch({
          type: actionTypes.GLOBAL_ICON_ALERT_STATE,
          payload: {
            state: true,
            navigation: navigation,
            props: {
              message: message,
              onPressOk: () => {
                navigation.dispatch(
                  CommonActions.reset({
                    index: 0,
                    routes: [{name: 'Home'}],
                  }),
                ); // hideGlobalIconAlert();
              },
            },
          },
        });
      });
  };
// ***** ENDS DIRECT MOBILE TOPUP BILL PAY *****

// ***** UTILITY DIRECT BILL PAY ***** //
export const directPayUtilityBill =
  (params, navigation, mpin) => async (dispatch) => {
    dispatch({type: actionTypes.SET_LOADER, payload: true});
    logs.logRequest(
      `${Config.base_url.UAT_URL}${Config.method.bill}/${Config.endpoint.pay}`,
      {
        amount: params.amount,
        benefType: params.benefType ? params.benefType : '3',
        // benefiId: params.benefID,
        comments: params.comments,
        companyName: params.companyName,
        companyType: params.companyType ? params.companyType : '1',
        consumerNo: params.benefAccount
          ? params.benefAccount
          : params.consumerNumber,
        customerName: params.customerName,
        fromAccount: params.fromAccount,
        isBenef: false,
        otp: mpin,
        rcvrEmailAddress: params.rcvrEmailAddress,
        rcvrMobileNumber: params.rcvrMobileNumber,
        token: params.token ? params.token : params.billToken,
        ucid: params.imd ? params.imd : params.ucid,
        validateOTP: true,
      },
    );
    axios
      .post(
        `${Config.base_url.UAT_URL}${Config.method.bill}/${Config.endpoint.pay}`,
        {
          amount: params.amount,
          benefType: params.benefType ? params.benefType : '3',
          // benefiId: params.benefID,
          comments: params.comments,
          companyName: params.companyName,
          companyType: params.companyType ? params.companyType : '1',
          consumerNo: params.benefAccount
            ? params.benefAccount
            : params.consumerNumber,
          customerName: params.customerName,
          fromAccount: params.fromAccount,
          isBenef: false,
          otp: mpin,
          rcvrEmailAddress: params.rcvrEmailAddress,
          rcvrMobileNumber: params.rcvrMobileNumber,
          token: params.token ? params.token : params.billToken,
          ucid: params.imd ? params.imd : params.ucid,
          validateOTP: true,
        },
        {
          headers: {
            'X-Auth-Token': store.getState().reducers.token,
          },
        },
      )
      .then((res) => {
        logs.logResponse(res.data);
        if (res.status === 200 && res.data.responseCode === '00') {
          dispatch({
            type: actionTypes.SET_TOKEN,
            payload: res.headers['x-auth-next-token'],
          });

          dispatch({
            type: actionTypes.SET_LOADER,
            payload: false,
          });
          dispatch(
            actionChangeGlobalTransferAlertState(true, navigation, {
              paymentType: globalPaymentTypes.Bill,
              amount: params.amount,
              fromName: `${
                store.getState()?.reducers?.overViewData?.data?.accounts
                  ?.accountTitle
              }`,
              fromAccount: `${params.fromAccounts}`,
              rrn: res?.data?.data?.rrn ? res?.data?.data?.rrn : false,
              stanId: res?.data?.data?.transactionDetails?.stan
                ? res?.data?.data?.transactionDetails?.stan
                : false,
              toName: `${params.customerName}`,
              toAccount: `${
                params.benefAccount
                  ? params.benefAccount
                  : params.consumerNumber
              }`,
              onPressClose: () => {
                dispatch(closeGlobalTransferAlert(navigation));
              },
            }),
          );
        } else {
          if (res.headers['x-auth-next-token']) {
            dispatch({
              type: actionTypes.SET_TOKEN,
              payload: res.headers['x-auth-next-token'],
            });
          }
          if (sessionControl(res)) {
            navigation.dispatch(
              CommonActions.reset({
                index: 0,
                routes: [{name: 'Login'}],
              }),
            );
            dispatch({
              type: actionTypes.CLEAR_APP_DATA,
            });
          }
          dispatch({
            type: actionTypes.SET_LOADER,
            payload: false,
          });

          dispatch({
            type: actionTypes.SET_ELSE_RESPONSE_ALERT,
            payload: {
              state: true,
              alertTitle: '',
              alertText: res.data?.data?.message
                ? res.data.data.message
                : res.data.responseDescription,
            },
          });
        }
      })
      .catch((err) => {
        dispatch({
          type: actionTypes.SET_LOADER,
          payload: false,
        });
        let message = '';
        if (!err.status) {
          // network err
          message = Message.networkErrorMessage;
        } else {
          message = String(err);
        }
        dispatch({
          type: actionTypes.GLOBAL_ICON_ALERT_STATE,
          payload: {
            state: true,
            navigation: navigation,
            props: {
              message: message,
              onPressOk: () => {
                navigation.dispatch(
                  CommonActions.reset({
                    index: 0,
                    routes: [{name: 'Home'}],
                  }),
                ); // hideGlobalIconAlert();
              },
            },
          },
        });
      });
  };
// ***** UTILITY DIRECT BILL PAY ***** //

// ***** CHANGE GLOBAL ALERT STATE ***** //

export const changeGlobalAlertState =
  (state, navigation, props, logoutAlert) => async (dispatch) => {
    logs.log('state', state);
    dispatch({
      type: actionTypes.GLOBAL_ALERT_STATE,
      payload: {
        state: state,
        navigation: navigation,
        props: props ? props : false,
        logoutAlert: logoutAlert ? logoutAlert : false,
      },
    });
  };
export const closeGlobalAlertState = () => async (dispatch) => {
  logs.log('sdsd inside closeGlobal');
  dispatch({
    type: actionTypes.GLOBAL_ALERT_STATE,
    payload: {
      state: false,
    },
  });
};

// ***** CHANGE GLOBAL ALERT STATE ***** //
// ***** CHANGE GLOBAL icon ALERT STATE ***** //

export const changeGlobalIconAlertState =
  (state, navigation, props) => async (dispatch) => {
    dispatch({
      type: actionTypes.GLOBAL_ICON_ALERT_STATE,
      payload: {
        state: state,
        navigation: navigation,
        props: props ? props : false,
      },
    });
  };
const closeGlobalIconAlertState = () => async (dispatch) => {
  logs.log('closeGlobalIconAlertState =========>');
  dispatch({
    type: actionTypes.GLOBAL_ICON_ALERT_STATE,
    payload: {
      state: false,
    },
  });
};

// ***** CHANGE GLOBAL  icon ALERT STATE ***** //
// ***** CHANGE GLOBAL icon ALERT STATE ***** //

export const changeGlobalTransferAlertState =
  (state, navigation, props) => async (dispatch) => {
    logs.log(' in state of alert', state);
    dispatch({
      type: actionTypes.GLOBAL_ALERT_TRANSFER,
      payload: {
        state: state,
        navigation: navigation,
        props: props ? props : false,
      },
    });
  };

const actionChangeGlobalTransferAlertState =
  (state, navigation, props) => async (dispatch) => {
    logs.log(' in state of alert', state);
    dispatch({
      type: actionTypes.GLOBAL_ALERT_TRANSFER,
      payload: {
        state: state,
        navigation: navigation,
        props: props ? props : false,
      },
    });
  };

export const setMobileTopUpData = (response) => async (dispatch) => {
  dispatch({
    type: actionTypes.SET_MOBILE_TOPUP_BILL_PAYMENT,
    payload: response,
  });
};

// ***** CHANGE GLOBAL  icon ALERT STATE ***** //
export const closeGlobalTransferAlert =
  (navigation, navigateTo, closeModal) => async (dispatch) => {
    if (closeModal) {
      dispatch({
        type: actionTypes.GLOBAL_ALERT_TRANSFER,
        payload: {
          state: false,
        },
      });
    } else {
      if (navigateTo) {
        dispatch({
          type: actionTypes.GLOBAL_ALERT_TRANSFER,
          payload: {
            state: false,
          },
        });
        navigation.navigate(navigateTo);
      } else {
        dispatch({
          type: actionTypes.GLOBAL_ALERT_TRANSFER,
          payload: {
            state: false,
          },
        });

        navigation.dispatch(
          CommonActions.reset({
            index: 0,
            routes: [{name: 'Home'}],
          }),
        );
      }
    }
  };

// ***** CHANGE GLOBAL  icon ALERT STATE ***** //

// ***** SET CURRENT NAVIGATION ***** //

export const setCurrentNavigation = (navigation) => async (dispatch) => {
  dispatch({
    type: actionTypes.SET_CURRENT_NAVIGATION,
    payload: navigation,
  });
};

// ***** ENDS SET CURRENT NAVIGATION ***** //

// ***** LOGOUT OF ACCOUNT *****
export const logOutOfAccount = (navigation) => async (dispatch) => {
  dispatch({
    type: actionTypes.SET_LOADER,
    payload: true,
  });
  logs.logRequest(
    `${Config.base_url.UAT_URL}${Config.method.my}/${Config.endpoint.logout},
  {
    channel: ${Config.channel.channel},
  },
  {
    headers: {
      'X-Auth-Token': ${store.getState().reducers.token},
    },
  },`,
  );
  axios
    .post(
      `${Config.base_url.UAT_URL}${Config.method.my}/${Config.endpoint.logout}`,
      {
        channel: Config.channel.channel,
      },
      {
        headers: {
          'X-Auth-Token': store.getState().reducers.token,
        },
      },
    )
    .then((response) => {
      logs.logResponse(response.data);
      if (response.status === 200 && response.data.responseCode === '00') {
        dispatch({
          type: actionTypes.SET_TOKEN,
          payload: response?.headers?.['x-auth-next-token'],
        });
        dispatch({
          type: actionTypes.LOGIN_STATE_UPDATE,
          payload: false,
        });
        navigation.dispatch(
          CommonActions.reset({
            index: 0,
            routes: [{name: 'Login'}],
          }),
        );
        dispatch({
          type: actionTypes.CLEAR_APP_DATA,
        });

        dispatch({
          type: actionTypes.SET_LOADER,
          payload: false,
        });
      } else {
        dispatch({
          type: actionTypes.LOGIN_STATE_UPDATE,
          payload: false,
        });
        if (response?.headers?.['x-auth-next-token']) {
          dispatch({
            type: actionTypes.SET_TOKEN,
            payload: response?.headers?.['x-auth-next-token'],
          });
        }
        if (sessionControl(response)) {
          navigation.dispatch(
            CommonActions.reset({
              index: 0,
              routes: [{name: 'Login'}],
            }),
          );
          dispatch({
            type: actionTypes.CLEAR_APP_DATA,
          });
        }
        dispatch({
          type: actionTypes.SET_LOADER,
          payload: false,
        });

        dispatch({
          type: actionTypes.SET_ELSE_RESPONSE_ALERT,
          payload: {
            state: true,
            alertTitle: '',
            alertText: response.data?.data?.message
              ? response.data.data.message
              : response.data.responseDescription,
          },
        });
      }
    })
    .catch((error) => {
      logs.log(`error : ${JSON.stringify(error)}`);
      dispatch({
        type: actionTypes.SET_LOADER,
        payload: false,
      });
      let message = '';
      if (!error.status) {
        // network err
        message = Message.networkErrorMessage;
      } else {
        message = String(error);
      }
      dispatch({
        type: actionTypes.SET_ELSE_RESPONSE_ALERT,
        payload: {
          state: true,
          alertTitle: '',
          alertText: message,
        },
      });
    });
};
// ***** ENDS LOGOUT OF ACCOUNT *****

// ***** CHANGE PASSWORD OF ACCOUNT *****

export const changeUserPassword =
  (token, newPassword, oldPassword, userName, navigation) =>
  async (dispatch) => {
    dispatch({
      type: actionTypes.SET_LOADER,
      payload: true,
    });
    logs.logRequest(
      `${Config.base_url.UAT_URL}${Config.method.my}/${Config.endpoint.password},
      {
        newPassword: ${newPassword},
        oldPassword: ${oldPassword},
        username: ${userName},
      },
      {
        headers: {
          'X-Auth-Token': ${token},
        },
      },`,
    );
    axios
      .post(
        `${Config.base_url.UAT_URL}${Config.method.my}/${Config.endpoint.password}`,
        {
          newPassword: newPassword,
          oldPassword: oldPassword,
          username: userName,
        },
        {
          headers: {
            'X-Auth-Token': token,
          },
        },
      )
      .then((response) => {
        logs.logResponse(response.data);
        if (response.status === 200 && response.data.responseCode === '00') {
          dispatch({
            type: actionTypes.SET_TOKEN,
            payload: response?.headers?.['x-auth-next-token'],
          });

          navigation.dispatch(
            CommonActions.reset({
              index: 0,
              routes: [{name: 'Home'}],
            }),
          );
          dispatch({
            type: actionTypes.SET_LOADER,
            payload: false,
          });
          dispatch({
            type: actionTypes.SET_ELSE_RESPONSE_ALERT,
            payload: {
              state: true,
              alertTitle: 'Change Password/PIN',
              alertText: response.data.data.message,
            },
          });
        } else {
          if (response?.headers?.['x-auth-next-token']) {
            dispatch({
              type: actionTypes.SET_TOKEN,
              payload: response?.headers?.['x-auth-next-token'],
            });
          }
          if (sessionControl(response)) {
            navigation.dispatch(
              CommonActions.reset({
                index: 0,
                routes: [{name: 'Login'}],
              }),
            );
            dispatch({
              type: actionTypes.CLEAR_APP_DATA,
            });
          }
          dispatch({
            type: actionTypes.SET_LOADER,
            payload: false,
          });

          dispatch({
            type: actionTypes.SET_ELSE_RESPONSE_ALERT,
            payload: {
              state: true,
              alertTitle: '',
              alertText: response.data?.data?.message
                ? response.data.data.message
                : response.data.responseDescription,
            },
          });
        }
      })
      .catch((error) => {
        logs.log(`error : ${JSON.stringify(error)}`);
        dispatch({
          type: actionTypes.SET_LOADER,
          payload: false,
        });
        let message = '';
        if (!error.status) {
          // network err
          message = Message.networkErrorMessage;
        } else {
          message = String(error);
        }
        dispatch({
          type: actionTypes.SET_ELSE_RESPONSE_ALERT,
          payload: {
            state: true,
            alertTitle: '',
            alertText: message,
          },
        });
      });
  };

// ***** ENDS CHANGE PASSWORD OF ACCOUNT *****

// CHANGE PASSWORD OF ACCOUNT NEW FLOW
export const changeUserPasswordNewFlow =
  (token, newPassword, oldPassword, userName, navigation, onPress) =>
  async (dispatch) => {
    dispatch({
      type: actionTypes.SET_LOADER,
      payload: true,
    });
    logs.logRequest(
      `${Config.base_url.UAT_URL}${Config.method.my}/${Config.endpoint.newpassword},
      {
        newPassword: ${newPassword},
        oldPassword: ${oldPassword},
        username: ${userName},
      },
      {
        headers: {
          'X-Auth-Token': ${token},
        },
      },`,
    );
    axios
      .post(
        `${Config.base_url.UAT_URL}${Config.method.my}/${Config.endpoint.newpassword}`,
        {
          newPassword: newPassword,
          oldPassword: oldPassword,
          username: userName,
        },
        {
          headers: {
            'X-Auth-Token': token,
          },
        },
      )
      .then((response) => {
        logs.logResponse(response.data);
        if (response.status === 200 && response.data.responseCode === '00') {
          dispatch({
            type: actionTypes.SET_TOKEN,
            payload: response?.headers?.['x-auth-next-token'],
          });

          dispatch({
            type: actionTypes.SET_LOADER,
            payload: false,
          });
          dispatch({
            type: actionTypes.SET_ELSE_RESPONSE_ALERT,
            payload: {
              state: true,
              alertTitle: 'Change Password/PIN',
              alertText: response.data.data.message,
              onPress: () => {
                navigation.dispatch(
                  CommonActions.reset({
                    index: 0,
                    routes: [{name: 'Home'}],
                  }),
                );
              },
            },
          });
        } else {
          if (response?.headers?.['x-auth-next-token']) {
            dispatch({
              type: actionTypes.SET_TOKEN,
              payload: response?.headers?.['x-auth-next-token'],
            });
          }
          if (sessionControl(response)) {
            navigation.dispatch(
              CommonActions.reset({
                index: 0,
                routes: [{name: 'Login'}],
              }),
            );
            dispatch({
              type: actionTypes.CLEAR_APP_DATA,
            });
          }
          dispatch({
            type: actionTypes.SET_LOADER,
            payload: false,
          });

          dispatch({
            type: actionTypes.SET_ELSE_RESPONSE_ALERT,
            payload: {
              state: true,
              alertTitle: '',
              alertText: response.data?.data?.message
                ? response.data.data.message
                : response.data.responseDescription,
              onPress: onPress
                ? () => {
                    onPress();
                  }
                : false,
            },
          });
        }
      })
      .catch((error) => {
        logs.log(`catch error ${JSON.stringify(error)}`);
        dispatch({
          type: actionTypes.SET_LOADER,
          payload: false,
        });
        let message = '';
        if (!error.status) {
          // network err
          message = Message.networkErrorMessage;
        } else {
          message = String(error);
        }
        dispatch({
          type: actionTypes.SET_ELSE_RESPONSE_ALERT,
          payload: {
            state: true,
            alertTitle: '',
            alertText: message,
          },
        });
      });
  };

// ENDS CHANGE PASSWORD OF ACCOUNT NEW FLOW

// ***** USER NAME SET FOR REDUX *****
export const setUserSignedIn = (userName) => async (dispatch) => {
  dispatch({
    type: actionTypes.SET_USER_SIGNED_IN,
    payload: userName,
  });
};
// ***** ENDS USER NAME SET FOR REDUX *****

// ***** GET E-TRANSACTION RECEIPTS DATA *****
export const getETransactionReceiptsData =
  (token, navigation, fromDate, toDate, state) => async (dispatch) => {
    dispatch({
      type: actionTypes.SET_LOADER,
      payload: true,
    });
    dispatch({
      type: actionTypes.SET_ETRANSACTION_DATA,
      payload: [],
    });
    logs.log(
      'E-transReciept========>',
      `${Config.base_url.UAT_URL}${Config.method.my}/${Config.endpoint.transactionhistoryNew}/${state}?fromDate=${fromDate}&toDate=${toDate}&channel=${Config.channel.channel}`,
    );
    axios
      .get(
        `${Config.base_url.UAT_URL}${Config.method.my}/${Config.endpoint.transactionhistoryNew}/${state}?fromDate=${fromDate}&toDate=${toDate}&channel=${Config.channel.channel}`,
        {
          headers: {
            'X-Auth-Token': token,
          },
        },
      )
      .then((response) => {
        if (response.status === 200 && response.data.responseCode === '00') {
          dispatch({
            type: actionTypes.SET_TOKEN,
            payload: response.headers['x-auth-next-token'],
          });
          dispatch({
            type: actionTypes.SET_ETRANSACTION_DATA,
            payload: response.data.data.transactionsHistory,
          });
          dispatch({
            type: actionTypes.SET_LOADER,
            payload: false,
          });
        } else {
          if (response.headers['x-auth-next-token']) {
            dispatch({
              type: actionTypes.SET_TOKEN,
              payload: response.headers['x-auth-next-token'],
            });
          }
          if (sessionControl(response)) {
            navigation.dispatch(
              CommonActions.reset({
                index: 0,
                routes: [{name: 'Login'}],
              }),
            );
            dispatch({
              type: actionTypes.CLEAR_APP_DATA,
            });
          }
          dispatch({
            type: actionTypes.SET_LOADER,
            payload: false,
          });

          dispatch({
            type: actionTypes.SET_ELSE_RESPONSE_ALERT,
            payload: {
              state: true,
              alertTitle: '',
              alertText: response.data?.data?.message
                ? response.data.data.message
                : response.data.responseDescription,
            },
          });
        }
      })
      .catch((error) => {
        dispatch({
          type: actionTypes.SET_LOADER,
          payload: false,
        });
        let message = '';
        if (!error.status) {
          // network err
          message = Message.networkErrorMessage;
        } else {
          message = String(error);
        }
        dispatch({
          type: actionTypes.SET_ELSE_RESPONSE_ALERT,
          payload: {
            state: true,
            alertTitle: '',
            alertText: message,
          },
        });
      });
  };
// ***** ENDS GET E-TRANSACTION RECEIPTS DATA *****

// ***** CHANGE MPIN REQUEST *****
export const changeMpin =
  (token, oldPassword, newPassword, confirmPassword, navigation) =>
  async (dispatch) => {
    dispatch({
      type: actionTypes.SET_LOADER,
      payload: true,
    });
    axios
      .post(
        `${Config.base_url.UAT_URL}${Config.method.mpin}/${Config.endpoint.change}?${Config.channel.channel}`,
        {
          mPin: newPassword,
          oldMpin: oldPassword,
          reEntermPin: confirmPassword,
        },
        {
          headers: {
            'X-Auth-Token': token,
          },
        },
      )
      .then((response) => {
        if (response.status === 200 && response.data.responseCode === '00') {
          dispatch({
            type: actionTypes.SET_TOKEN,
            payload: response.headers['x-auth-next-token'],
          });

          dispatch({
            type: actionTypes.SET_LOADER,
            payload: false,
          });
          dispatch({
            type: actionTypes.SET_ELSE_RESPONSE_ALERT,
            payload: {
              state: true,
              alertTitle: 'Change MPIN',
              alertText: I18n['MPIN changed successfully'],
              onPress: () => {
                navigation.dispatch(
                  CommonActions.reset({
                    index: 0,
                    routes: [{name: 'Home'}],
                  }),
                );
              },
            },
          });
        } else {
          if (response.headers['x-auth-next-token']) {
            dispatch({
              type: actionTypes.SET_TOKEN,
              payload: response.headers['x-auth-next-token'],
            });
          }
          if (sessionControl(response)) {
            navigation.dispatch(
              CommonActions.reset({
                index: 0,
                routes: [{name: 'Login'}],
              }),
            );
            dispatch({
              type: actionTypes.CLEAR_APP_DATA,
            });
          }
          dispatch({
            type: actionTypes.SET_LOADER,
            payload: false,
          });

          dispatch({
            type: actionTypes.SET_ELSE_RESPONSE_ALERT,
            payload: {
              state: true,
              alertTitle: '',
              alertText: response.data?.data?.message
                ? response.data.data.message
                : response.data.responseDescription,
            },
          });
        }
      })
      .catch((error) => {
        dispatch({
          type: actionTypes.SET_LOADER,
          payload: false,
        });
        let message = '';
        if (!error.status) {
          // network err
          message = Message.networkErrorMessage;
        } else {
          message = String(error);
        }
        dispatch({
          type: actionTypes.SET_ELSE_RESPONSE_ALERT,
          payload: {
            state: true,
            alertTitle: '',
            alertText: message,
          },
        });
      });
  };
// ***** END CHANGE MPIN REQUEST *****

// ***** FORGET MPIN *****
export const foregetMpin =
  (token, atmPin, cardNumber, cnic, navigation) => async (dispatch) => {
    dispatch({
      type: actionTypes.SET_LOADER,
      payload: true,
    });
    logs.logRequest(
      `${Config.base_url.UAT_URL}${Config.method.my}/${
        Config.endpoint.forgetpassword
      }?channel=${Config.channel.channel},
  {
    atmPin: ${atmPin},
    cardNumber: ${cardNumber},
    cnic: ${cnic},
    ${{...appInfoObject_ForServices}}
  },
  {
    headers: {
      'X-Auth-Token': ${token},
    },
  },`,
    );
    axios
      .post(
        `${Config.base_url.UAT_URL}${Config.method.my}/${Config.endpoint.forgetpassword}?channel=${Config.channel.channel}`,
        {
          atmPin: atmPin,
          cardNumber: cardNumber,
          cnic: cnic,
          ...appInfoObject_ForServices,
        },
        {
          headers: {
            'X-Auth-Token': token,
          },
        },
      )
      .then((response) => {
        logs.logResponse(response.data);
        if (response.status === 200 && response.data.responseCode === '00') {
          dispatch({
            type: actionTypes.SET_TOKEN,
            payload: response.headers['x-auth-next-token'],
          });
          dispatch({
            type: actionTypes.SET_LOADER,
            payload: false,
          });
        } else {
          if (response?.headers?.['x-auth-next-token']) {
            dispatch({
              type: actionTypes.SET_TOKEN,
              payload: response?.headers?.['x-auth-next-token'],
            });
          }
          if (sessionControl(response)) {
            navigation.dispatch(
              CommonActions.reset({
                index: 0,
                routes: [{name: 'Login'}],
              }),
            );
            dispatch({
              type: actionTypes.CLEAR_APP_DATA,
            });
          }
          dispatch({
            type: actionTypes.SET_LOADER,
            payload: false,
          });

          dispatch({
            type: actionTypes.SET_ELSE_RESPONSE_ALERT,
            payload: {
              state: true,
              alertTitle: '',
              alertText: response.data?.data?.message
                ? response.data.data.message
                : response.data.responseDescription,
            },
          });
        }
      })
      .catch((error) => {
        dispatch({
          type: actionTypes.SET_LOADER,
          payload: false,
        });
        let message = '';
        if (!error.status) {
          // network err
          message = Message.networkErrorMessage;
        } else {
          message = String(error);
        }
        dispatch({
          type: actionTypes.SET_ELSE_RESPONSE_ALERT,
          payload: {
            state: true,
            alertTitle: '',
            alertText: message,
          },
        });
      });
  };
// ***** ENDS GET E-TRANSACTION RECEIPTS DATA *****

// ***** CHANGE MPIN REQUEST *****
// export const changeMpin =
//   (token, oldPassword, newPassword, confirmPassword, navigation) =>
//   async (dispatch) => {
//     dispatch({
//       type: actionTypes.SET_LOADER,
//       payload: true,
//     });
//     axios
//       .post(
//         `${Config.base_url.UAT_URL}${Config.method.mpin}/${Config.endpoint.change}?${Config.channel.channel}`,
//         {
//           mPin: newPassword,
//           oldMpin: oldPassword,
//           reEntermPin: confirmPassword,
//         },
//         {
//           headers: {
//             'X-Auth-Token': token,
//           },
//         },
//       )
//       .then((response) => {
//         if (response.status === 200 && response.data.responseCode === '00') {
//           dispatch({
//             type: actionTypes.SET_TOKEN,
//             payload: response?.headers?.['x-auth-next-token'],
//           });

//           dispatch({
//             type: actionTypes.SET_LOADER,
//             payload: false,
//           });
//           dispatch({
//             type: actionTypes.SET_ELSE_RESPONSE_ALERT,
//             payload: {
//               state: true,
//               alertTitle: 'Change MPIN',
//               alertText: 'MPIN changed successfully',
//             },
//           });
//         } else {
//           if (response?.headers?.['x-auth-next-token']) {
//             dispatch({
//               type: actionTypes.SET_TOKEN,
//               payload: response?.headers?.['x-auth-next-token'],
//             });
//           }
//           if (sessionControl(response)) {
//             navigation.dispatch(
//               CommonActions.reset({
//                 index: 0,
//                 routes: [{name: 'Login'}],
//               }),
//             );
//             dispatch({
//               type: actionTypes.CLEAR_APP_DATA,
//             });
//           }
//           dispatch({
//             type: actionTypes.SET_LOADER,
//             payload: false,
//           });

//           dispatch({
//             type: actionTypes.SET_ELSE_RESPONSE_ALERT,
//             payload: {
//               state: true,
//               alertTitle: '',
//               alertText: response.data?.data?.message
//                 ? response.data.data.message
//                 : response.data.responseDescription,
//             },
//           });
//         }
//       })
//       .catch((error) => {
//         dispatch({
//           type: actionTypes.SET_LOADER,
//           payload: false,
//         });
//         let message = '';
//         if (!error.status) {
//           // network err
//           message = Message.networkErrorMessage;
//         } else {
//           message = String(error);
//         }
//         dispatch({
//           type: actionTypes.SET_ELSE_RESPONSE_ALERT,
//           payload: {
//             state: true,
//             alertTitle: '',
//             alertText: message,
//           },
//         });
//       });
//   };
// ***** END CHANGE MPIN REQUEST *****

// ***** TRANSFER FUNDS *****
// export const fundTransfer =
//   (
//     isAddBenef,
//     token,
//     navigation,
//     amount,
//     benefiType,
//     cnic,
//     fromAccount,
//     imd,
//     purposeOfPayment,
//     titleFetchAccount,
//     routeObject,
//     onSuccess,
//   ) =>
//   async (dispatch) => {
//     dispatch({
//       type: actionTypes.SET_LOADER,
//       payload: true,
//     });
//     logs.logRequest(
//       `${Config.base_url.UAT_URL}${Config.method.my}/${Config.endpoint.forgetpassword}?channel=${Config.channel.channel},
//   {
//     atmPin: ${atmPin},
//     cardNumber: ${cardNumber},
//     cnic: ${cnic},
//   },
//   {
//     headers: {
//       'X-Auth-Token': ${token},
//     },
//   },`,
//     );
//     axios
//       .post(
//         `${Config.base_url.UAT_URL}${Config.method.my}/${Config.endpoint.forgetpassword}?channel=${Config.channel.channel}`,
//         {
//           atmPin: atmPin,
//           cardNumber: cardNumber,
//           cnic: cnic,
//         },
//         {
//           headers: {
//             'X-Auth-Token': token,
//           },
//         },
//       )
//       .then((response) => {
//         logs.logResponse(response.data);
//         if (response.status === 200 && response.data.responseCode === '00') {
//           logs.log('in the funds teansfer walii call', response.data.data);
//           dispatch({
//             type: actionTypes.SET_TOKEN,
//             payload: response?.headers?.['x-auth-next-token'],
//           });
//           const title = response.data.data.title;
//           let object = {
//             amount,
//             benefiType,
//             cnic,
//             fromAccount,
//             imd,
//             purposeOfPayment,
//             titleFetchAccount,
//             title,
//             ...routeObject,
//             token: response.data.data.token,
//             ...response.data,
//             benefExists: response.data.data.benefExists,
//           };

//           // navigation.navigate('FundTransferResponse', {data: object});
//           // let object = {token: response.data.data.token, ...routeObject};
//           dispatch({
//             type: actionTypes.SET_LOADER,
//             payload: false,
//           });
//           onSuccess(object, response.data);
//         } else {
//           if (response?.headers?.['x-auth-next-token']) {
//             dispatch({
//               type: actionTypes.SET_TOKEN,
//               payload: response?.headers?.['x-auth-next-token'],
//             });
//           }
//           if (sessionControl(response)) {
//             navigation.dispatch(
//               CommonActions.reset({
//                 index: 0,
//                 routes: [{name: 'Login'}],
//               }),
//             );
//             dispatch({
//               type: actionTypes.CLEAR_APP_DATA,
//             });
//           }
//           dispatch({
//             type: actionTypes.SET_LOADER,
//             payload: false,
//           });

//           dispatch({
//             type: actionTypes.SET_ELSE_RESPONSE_ALERT,
//             payload: {
//               state: true,
//               alertTitle: '',
//               alertText: response.data?.data?.message
//                 ? response.data.data.message
//                 : response.data.responseDescription,
//             },
//           });
//         }
//       })
//       .catch((error) => {
//         dispatch({
//           type: actionTypes.SET_LOADER,
//           payload: false,
//         });
//         let message = '';
//         if (!error.status) {
//           // network err
//           message = Message.networkErrorMessage;
//         } else {
//           message = String(error);
//         }
//         dispatch({
//           type: actionTypes.SET_ELSE_RESPONSE_ALERT,
//           payload: {
//             state: true,
//             alertTitle: '',
//             alertText: message,
//           },
//         });
//       });
//   };
// ***** END FORGET MPIN *****

// ***** GET FUNDS TRANSFER DATA *****
export const getFundsTransferData =
  (token, navigation, isPayBenef, benefObject, onSuccess) =>
  async (dispatch) => {
    dispatch({
      type: actionTypes.SET_LOADER,
      payload: true,
    });
    logs.log('FundsTransfer', benefObject);
    navigation.navigate('FundsTransfer', {data: {isPayBenef, benefObject}});
    logs.logRequest(
      `${Config.base_url.UAT_URL}${Config.method.my}/${Config.endpoint.accounts},
      {
        headers: {
          'X-Auth-Token': ${token},
        },
      },`,
    );
    axios
      .get(
        `${Config.base_url.UAT_URL}${Config.method.my}/${Config.endpoint.accounts}`,
        {
          headers: {
            'X-Auth-Token': token,
          },
        },
      )
      .then((response) => {
        logs.logResponse(response.data);
        if (response.status === 200 && response.data.responseCode === '00') {
          dispatch({
            type: actionTypes.SET_TOKEN,
            payload: response?.headers?.['x-auth-next-token'],
          });
          dispatch({
            type: actionTypes.SET_MY_ACCOUNTS,
            payload: response.data.data.accounts,
          });
          logs.logRequest(
            `${Config.base_url.UAT_URL}${Config.method.my}/${
              Config.endpoint.beneficiaries
            }?benefTypes=1&status=1,
            {
              headers: {
                'X-Auth-Token': ${store.getState().reducers.token},
              },
            },`,
          );
          axios
            .get(
              `${Config.base_url.UAT_URL}${Config.method.my}/${Config.endpoint.beneficiaries}?benefTypes=1&status=1`,
              {
                headers: {
                  'X-Auth-Token': store.getState().reducers.token,
                },
              },
            )
            .then((res) => {
              logs.logResponse(res.data);
              if (res.status === 200 && res.data.responseCode === '00') {
                dispatch({
                  type: actionTypes.SET_BENEFICIARIES,
                  payload: res.data.data.beneficiaries,
                });
                onSuccess();
                dispatch({
                  type: actionTypes.SET_TOKEN,
                  payload: res.headers['x-auth-next-token'],
                });
                dispatch({
                  type: actionTypes.SET_LOADER,
                  payload: false,
                });
              } else {
                if (res.headers['x-auth-next-token']) {
                  dispatch({
                    type: actionTypes.SET_TOKEN,
                    payload: res.headers['x-auth-next-token'],
                  });
                }
                if (sessionControl(res)) {
                  navigation.dispatch(
                    CommonActions.reset({
                      index: 0,
                      routes: [{name: 'Login'}],
                    }),
                  );
                  dispatch({
                    type: actionTypes.CLEAR_APP_DATA,
                  });
                }
                dispatch({
                  type: actionTypes.SET_LOADER,
                  payload: false,
                });

                dispatch({
                  type: actionTypes.SET_ELSE_RESPONSE_ALERT,
                  payload: {
                    state: true,
                    alertTitle: '',
                    alertText: res.data?.data?.message
                      ? res.data.data.message
                      : res.data.responseDescription,
                  },
                });
              }
            })
            .catch((err) => {
              dispatch({
                type: actionTypes.SET_LOADER,
                payload: false,
              });
              let message = '';
              if (!err.status) {
                // network err
                message = Message.networkErrorMessage;
              } else {
                message = String(err);
              }
              dispatch({
                type: actionTypes.SET_ELSE_RESPONSE_ALERT,
                payload: {
                  state: true,
                  alertTitle: '',
                  alertText: message,
                },
              });
            });
        } else {
          if (response?.headers?.['x-auth-next-token']) {
            dispatch({
              type: actionTypes.SET_TOKEN,
              payload: response?.headers?.['x-auth-next-token'],
            });
          }
          if (sessionControl(response)) {
            navigation.dispatch(
              CommonActions.reset({
                index: 0,
                routes: [{name: 'Login'}],
              }),
            );
            dispatch({
              type: actionTypes.CLEAR_APP_DATA,
            });
          } else {
            navigation.goBack();
          }
          dispatch({
            type: actionTypes.SET_LOADER,
            payload: false,
          });

          dispatch({
            type: actionTypes.SET_ELSE_RESPONSE_ALERT,
            payload: {
              state: true,
              alertTitle: '',
              alertText: response.data?.data?.message
                ? response.data.data.message
                : response.data.responseDescription,
            },
          });
        }
      })
      .catch((error) => {
        navigation.goBack();
        dispatch({
          type: actionTypes.setLoader,
          payload: false,
        });
        let message = '';
        if (!error.status) {
          // network err
          message = Message.networkErrorMessage;
        } else {
          message = String(error);
        }
        dispatch({
          type: actionTypes.SET_ELSE_RESPONSE_ALERT,
          payload: {
            state: true,
            alertTitle: '',
            alertText: message,
          },
        });
      });
  };
// ***** ENDS GET FUNDS TRANSFER DATA *****

// ***** TRANSFER FUNDS *****
export const fundTransfer =
  (
    isAddBenef,
    token,
    navigation,
    amount,
    benefiType,
    cnic,
    fromAccount,
    imd,
    purposeOfPayment,
    titleFetchAccount,
    routeObject,
    onSuccess,
    purposeOfPaymentString,
  ) =>
  async (dispatch) => {
    dispatch({
      type: actionTypes.SET_LOADER,
      payload: true,
    });

    logs.logRequest(
      `${Config.base_url.UAT_URL}${Config.method.transfer}/${Config.endpoint.titlefetch}`,
      {
        amount: amount,
        benefiType: benefiType,
        cnic: cnic,
        fromAccount: fromAccount,
        imd: !routeObject.isDirectPayment ? imd : '979898',
        purposeOfPayment: purposeOfPayment,
        titleFetchAccount: titleFetchAccount,
      },
      {
        headers: {
          'X-Auth-Token': store.getState().reducers.token,
        },
      },
    );

    axios
      .post(
        `${Config.base_url.UAT_URL}${Config.method.transfer}/${Config.endpoint.titlefetch}`,
        {
          amount: amount,
          benefiType: benefiType,
          cnic: cnic,
          fromAccount: fromAccount,
          imd: !routeObject.isDirectPayment ? imd : '979898',
          purposeOfPayment: purposeOfPayment,
          titleFetchAccount: titleFetchAccount,
        },
        {
          headers: {
            'X-Auth-Token': store.getState().reducers.token,
          },
        },
      )
      .then((response) => {
        logs.logResponse(response?.data);
        if (response.status === 200 && response.data.responseCode === '00') {
          dispatch({
            type: actionTypes.SET_TOKEN,
            payload: response?.headers?.['x-auth-next-token'],
          });
          dispatch({
            type: actionTypes.SET_FUND_TRANSFER_DATA,
            payload: response.data.data,
          });
          const title = response.data.data.title;
          let object = {
            amount,
            benefiType,
            cnic,
            fromAccount,
            imd,
            purposeOfPayment,
            titleFetchAccount,
            title,
            ...routeObject,
            token: response.data.data.token,
            ...response.data,
            purposeOfPaymentString,
          };
          onSuccess(object, response.data);

          // navigation.navigate('FundTransferResponse', {data: object});
          // let object = {token: response.data.data.token, ...routeObject};
          //         if (isAddBenef) {
          //           logs.log('here in benef');
          //           navigation.navigate('BeneficiaryinputDetails', {
          //             data: object,
          //             responseData: response.data,
          //           });
          //         } else {
          //           logs.log(response?.data?.data?.benefExists, 'here in not  benef');

          // navigation.navigate('FundTransferResponse', {
          //   data: object,
          // });
          //         }

          dispatch({
            type: actionTypes.SET_LOADER,
            payload: false,
          });
        } else {
          if (response?.headers?.['x-auth-next-token']) {
            dispatch({
              type: actionTypes.SET_TOKEN,
              payload: response?.headers?.['x-auth-next-token'],
            });
          }
          if (sessionControl(response)) {
            navigation.dispatch(
              CommonActions.reset({
                index: 0,
                routes: [{name: 'Login'}],
              }),
            );
            dispatch({
              type: actionTypes.CLEAR_APP_DATA,
            });
          }
          dispatch({
            type: actionTypes.SET_LOADER,
            payload: false,
          });

          dispatch({
            type: actionTypes.SET_ELSE_RESPONSE_ALERT,
            payload: {
              state: true,
              alertTitle: '',
              alertText: response.data?.data?.message
                ? response.data.data.message
                : response.data.responseDescription,
            },
          });
        }
      });
  };
// ***** ENDS TRANSFER FUNDS *****

// ***** FUND TRANSFER OTP DIRECT PAY ***** //

export const fundTransferDirectPayOtp =
  (params, navigation) => async (dispatch) => {
    dispatch({
      type: actionTypes.SET_LOADER,
      payload: true,
    });

    logs.logRequest(
      `${Config.base_url.UAT_URL}${Config.method.my}/${Config.endpoint.otp},
      {
        accountNumber: ${params.toAccount},
        benefType: '1',
        imd: ${params.imd},
        isBenef: ${params.isDirectPayment ? false : true},
        tranType: 'FundTransfer',
      },
      {
        headers: {
          'X-Auth-Token': ${store.getState().reducers.token},
        },
      },`,
    );

    axios
      .post(
        `${Config.base_url.UAT_URL}${Config.method.my}/${Config.endpoint.otp}`,
        {
          accountNumber: params.toAccount,
          benefType: '1',
          imd: params.imd,
          isBenef: params.isDirectPayment ? false : true,
          tranType: 'FundTransfer',
        },
        {
          headers: {
            'X-Auth-Token': store.getState().reducers.token,
          },
        },
      )
      .then((response) => {
        logs.logResponse(response.data);
        if (response.status === 200 && response.data.responseCode === '00') {
          dispatch({
            type: actionTypes.SET_TOKEN,
            payload: response?.headers?.['x-auth-next-token'],
          });
          dispatch({type: actionTypes.SET_LOADER, payload: false});
          navigation.navigate('FundTransferMpin');
        } else {
          if (response?.headers?.['x-auth-next-token']) {
            dispatch({
              type: actionTypes.SET_TOKEN,
              payload: response?.headers?.['x-auth-next-token'],
            });
          }
          if (sessionControl(response)) {
            navigation.dispatch(
              CommonActions.reset({
                index: 0,
                routes: [{name: 'Login'}],
              }),
            );
            dispatch({
              type: actionTypes.CLEAR_APP_DATA,
            });
          }
          dispatch({
            type: actionTypes.SET_LOADER,
            payload: false,
          });

          dispatch({
            type: actionTypes.SET_ELSE_RESPONSE_ALERT,
            payload: {
              state: true,
              alertTitle: 'Fund Transfer',
              alertText: response.data?.data?.message
                ? response.data.data.message
                : response.data.responseDescription,
            },
          });
        }
      })
      .catch((error) => {
        dispatch({
          type: actionTypes.SET_LOADER,
          payload: false,
        });
        let message = '';
        if (!error.status) {
          // network err
          message = Message.networkErrorMessage;
        } else {
          message = String(error);
        }
        dispatch({
          type: actionTypes.SET_ELSE_RESPONSE_ALERT,
          payload: {
            state: true,
            alertTitle: '',
            alertText: message,
          },
        });
      });
  };

// ***** ENDS FUND TRANSFER OTP DIRECT PAY ***** //

// ***** FUND TRANSFER MPIN DIRECT PAY ***** //

export const fundTransferDirectPayMpin =
  (params, navigation, mpin, onSuccess) => async (dispatch) => {
    dispatch({
      type: actionTypes.SET_LOADER,
      payload: true,
    });

    logs.logRequest(
      `${Config.base_url.UAT_URL}${Config.method.transfer}/${
        Config.endpoint.threepft
      },
      {
        amount: ${params.amount},
        benef: false,
        benefID: '',
        comments: ${params.comments ? params.comments : ''},
        fromAccount: ${params.fromAccount},
        imd: '979898',
        isOwnAccountTransfer: '0',
        otp: ${mpin},
        purposeOfPayment: ${
          params.purposeOfPayment ? params.purposeOfPayment : '0370'
        },
        rcvrEmailAddress: ${params.email ? params.email : ''},
        rcvrMobileNumber: ${params.phone ? params.phone : ''},
        toAccount: ${params.toAccount},
        token: ${params.billToken},
        validateOTP: true,
      },
      {
        headers: {
          'X-Auth-Token': ${store.getState().reducers.token},
        },
      },`,
    );

    axios
      .post(
        `${Config.base_url.UAT_URL}${Config.method.transfer}/${Config.endpoint.threepft}`,
        {
          amount: params.amount,
          benef: false,
          benefID: '',
          comments: params.comments ? params.comments : '',
          fromAccount: params.fromAccount,
          imd: '979898',
          isOwnAccountTransfer: '0',
          otp: mpin,
          purposeOfPayment: params.purposeOfPayment
            ? params.purposeOfPayment
            : '0370',
          rcvrEmailAddress: params.email ? params.email : '',
          rcvrMobileNumber: params.phone ? params.phone : '',
          toAccount: params.toAccount,
          token: params.billToken,
          validateOTP: true,
        },
        {
          headers: {
            'X-Auth-Token': store.getState().reducers.token,
          },
        },
      )
      .then((response2) => {
        logs.logResponse(response2.data);
        if (response2.status === 200 && response2.data.responseCode === '00') {
          dispatch({
            type: actionTypes.SET_TOKEN,
            payload: response2.headers['x-auth-next-token'],
          });
          // navigation.navigate('ResponseDisplay', response2.data);
          onSuccess(response2.data.data.transactionDetails);
          // setTimeout(() => {
          //   dispatch({
          //     type: actionTypes.GLOBAL_ICON_ALERT_STATE,
          //     payload: {
          //       state: true,
          //       navigation: navigation,
          //       props: {
          //         message:
          //           response2.data.data.transactionDetails.displayMessage,
          //         successAlert: true,
          //         onPressOk: () => {
          //           navigation.navigate('Dashboard');
          //           hideGlobalIconAlert();
          //         },
          //       },
          //     },
          //   });
          // }, 500);
          // raffayhere
          // logs.log('asdkjhaskjgasjdjasgdhjgsagfd');

          dispatch({
            type: actionTypes.SET_LOADER,
            payload: false,
          });
        } else {
          if (response2.headers['x-auth-next-token']) {
            dispatch({
              type: actionTypes.SET_TOKEN,
              payload: response2.headers['x-auth-next-token'],
            });
          }
          if (sessionControl(response2)) {
            navigation.dispatch(
              CommonActions.reset({
                index: 0,
                routes: [{name: 'Login'}],
              }),
            );
            dispatch({
              type: actionTypes.CLEAR_APP_DATA,
            });
          }
          dispatch({
            type: actionTypes.SET_LOADER,
            payload: false,
          });

          dispatch({
            type: actionTypes.SET_ELSE_RESPONSE_ALERT,
            payload: {
              state: true,
              alertTitle: '',
              alertText: response2.data?.data?.message
                ? response2.data.data.message
                : response2.data.responseDescription,
            },
          });
        }
      })
      .catch((error2) => {
        dispatch({
          type: actionTypes.SET_LOADER,
          payload: false,
        });
        let message = '';
        if (!error2.status) {
          // network err
          message = Message.networkErrorMessage;
        } else {
          message = String(error2);
        }
        dispatch({
          type: actionTypes.SET_ELSE_RESPONSE_ALERT,
          payload: {
            state: true,
            alertTitle: '',
            alertText: message,
          },
        });
      });
  };

// ***** ENDS FUND TRANSFER MPIN DIRECT PAY ***** //

// ***** GET INTER BANK FUND TRANSFER *****

export const getInterBankFundTransferData =
  (token, navigation, isBenef, isPayBenef, benefObject, onSuccess) =>
  async (dispatch) => {
    if (!isBenef) {
      navigation.navigate('InterBankFundsTransfer', {
        data: {isPayBenef, benefObject},
      });
    }

    let dispatchableObject = {};
    dispatch({
      type: actionTypes.SET_LOADER,
      payload: true,
    });
    logs.logRequest(
      `${Config.base_url.UAT_URL}${Config.method.my}/${
        Config.endpoint.accounts
      },
      {
        headers: {
          'X-Auth-Token': ${store.getState().reducers.token},
        },
      },`,
    );
    axios
      .get(
        `${Config.base_url.UAT_URL}${Config.method.my}/${Config.endpoint.accounts}`,
        {
          headers: {
            'X-Auth-Token': store.getState().reducers.token,
          },
        },
      )
      .then((response1) => {
        logs.logResponse(response1.data);
        if (response1.status === 200 && response1.data.responseCode === '00') {
          dispatch({
            type: actionTypes.SET_TOKEN,
            payload: response1.headers['x-auth-next-token'],
          });
          logs.logRequest(
            `${Config.base_url.UAT_URL}${Config.method.my}/${
              Config.endpoint.beneficiaries
            }?benefTypes=2&status=1,
            {
              headers: {
                'X-Auth-Token': ${store.getState().reducers.token},
              },
            },`,
          );
          axios
            .get(
              `${Config.base_url.UAT_URL}${Config.method.my}/${Config.endpoint.beneficiaries}?benefTypes=2&status=1`,
              {
                headers: {
                  'X-Auth-Token': store.getState().reducers.token,
                },
              },
            )
            .then((response2) => {
              logs.logResponse(JSON.stringify(response2.data));
              if (
                response2.status === 200 &&
                response2.data.responseCode === '00'
              ) {
                dispatch({
                  type: actionTypes.SET_TOKEN,
                  payload: response2.headers['x-auth-next-token'],
                });
                logs.logRequest(
                  `${Config.base_url.UAT_URL}${Config.method.transfer}/${
                    Config.endpoint.banks
                  },
                  {
                    headers: {
                      'X-Auth-Token': ${store.getState().reducers.token},
                    },
                  },`,
                );
                axios
                  .get(
                    `${Config.base_url.UAT_URL}${Config.method.transfer}/${Config.endpoint.banks}`,
                    {
                      headers: {
                        'X-Auth-Token': store.getState().reducers.token,
                      },
                    },
                  )
                  .then((response3) => {
                    logs.logResponse(response3.data);
                    if (
                      response3.status === 200 &&
                      response3.data.responseCode === '00'
                    ) {
                      dispatch({
                        type: actionTypes.SET_BENEFICIARIES,
                        payload: response2.data.data.beneficiaries,
                      });
                      dispatchableObject = {
                        Accounts: response1.data.data,
                        Beneficiaries: response2.data.data.beneficiaries,
                        Banks: response3.data.data,
                      };

                      dispatch({
                        type: actionTypes.SET_INTER_BANK_FUND_TRANSFER_DATA,
                        payload: dispatchableObject,
                      });
                      onSuccess();
                      dispatch({
                        type: actionTypes.SET_TOKEN,
                        payload: response3.headers['x-auth-next-token'],
                      });
                      dispatch({
                        type: actionTypes.SET_LOADER,
                        payload: false,
                      });
                    } else {
                      if (response3.headers['x-auth-next-token']) {
                        dispatch({
                          type: actionTypes.SET_TOKEN,
                          payload: response3.headers['x-auth-next-token'],
                        });
                      }
                      if (sessionControl(response3)) {
                        navigation.dispatch(
                          CommonActions.reset({
                            index: 0,
                            routes: [{name: 'Login'}],
                          }),
                        );
                        dispatch({
                          type: actionTypes.CLEAR_APP_DATA,
                        });
                      }
                      dispatch({
                        type: actionTypes.SET_LOADER,
                        payload: false,
                      });

                      dispatch({
                        type: actionTypes.SET_ELSE_RESPONSE_ALERT,
                        payload: {
                          state: true,
                          alertTitle: '',
                          alertText: response3.data?.data?.message
                            ? response3.data.data.message
                            : response3.data.responseDescription,
                        },
                      });
                    }
                  });
              } else {
                if (response2.headers['x-auth-next-token']) {
                  dispatch({
                    type: actionTypes.SET_TOKEN,
                    payload: response2.headers['x-auth-next-token'],
                  });
                }
                if (sessionControl(response2)) {
                  navigation.dispatch(
                    CommonActions.reset({
                      index: 0,
                      routes: [{name: 'Login'}],
                    }),
                  );
                  dispatch({
                    type: actionTypes.CLEAR_APP_DATA,
                  });
                }
                dispatch({
                  type: actionTypes.SET_LOADER,
                  payload: false,
                });

                dispatch({
                  type: actionTypes.SET_ELSE_RESPONSE_ALERT,
                  payload: {
                    state: true,
                    alertTitle: '',
                    alertText: response2.data?.data?.message
                      ? response2.data.data.message
                      : response2.data.responseDescription,
                  },
                });
              }
            });
        } else {
          if (response1.headers['x-auth-next-token']) {
            dispatch({
              type: actionTypes.SET_TOKEN,
              payload: response1.headers['x-auth-next-token'],
            });
          }
          if (sessionControl(response1)) {
            navigation.dispatch(
              CommonActions.reset({
                index: 0,
                routes: [{name: 'Login'}],
              }),
            );
            dispatch({
              type: actionTypes.CLEAR_APP_DATA,
            });
          } else {
            navigation.goBack();
          }
          dispatch({
            type: actionTypes.SET_LOADER,
            payload: false,
          });

          dispatch({
            type: actionTypes.SET_ELSE_RESPONSE_ALERT,
            payload: {
              state: true,
              alertTitle: '',
              alertText: response1.data?.data?.message
                ? response1.data.data.message
                : response1.data.responseDescription,
            },
          });
        }
      })
      .catch((error) => {
        navigation.goBack();
        dispatch({
          type: actionTypes.SET_LOADER,
          payload: false,
        });
        let message = '';
        if (!error.status) {
          // network err
          message = Message.networkErrorMessage;
        } else {
          message = String(error);
        }
        dispatch({
          type: actionTypes.SET_ELSE_RESPONSE_ALERT,
          payload: {
            state: true,
            alertTitle: '',
            alertText: message,
          },
        });
      });
  };
// ***** ENDS GET INTER BANK FUND TRANSFER *****

// ***** INTERBANK FUND TRANFER REQUEST  ******
export const ibftPayment =
  (
    token,
    navigation,
    amount,
    fromAccount,
    imd,
    purposeOfPayment,
    titleFetchAccount,
    isDirectPayment,
    object,
    purposeOfPaymentString,
    onSuccess,
  ) =>
  async (dispatch) => {
    dispatch({
      type: actionTypes.SET_LOADER,
      payload: true,
    });

    logs.logRequest(
      `${Config.base_url.UAT_URL}${Config.method.transfer}/${
        Config.endpoint.titlefetch
      },
      {
        amount: ${amount},
        benefiType: '2',
        cnic: '',
        fromAccount: ${fromAccount},
        imd: ${imd},
        purposeOfPayment: ${purposeOfPayment},
        titleFetchAccount: ${titleFetchAccount},
      },
      {
        headers: {
          'X-Auth-Token': ${store.getState().reducers.token},
        },
      },`,
    );

    axios
      .post(
        `${Config.base_url.UAT_URL}${Config.method.transfer}/${Config.endpoint.titlefetch}`,
        {
          amount: amount,
          benefiType: '2',
          cnic: '',
          fromAccount: fromAccount,
          imd: imd,
          purposeOfPayment: purposeOfPayment, //purposeOfPayment === '' ? '99999' : purposeOfPayment,
          titleFetchAccount: titleFetchAccount,
        },
        {
          headers: {
            'X-Auth-Token': store.getState().reducers.token,
          },
        },
      )
      .then((response) => {
        logs.logResponse(response.data);
        if (response.status === 200 && response.data.responseCode === '00') {
          dispatch({
            type: actionTypes.SET_TOKEN,
            payload: response?.headers?.['x-auth-next-token'],
          });
          logs.log(response.data);
          let routeObject = isDirectPayment
            ? {
                fromAccount,
                titleFetchAccount,
                amount,
                imd,
                purposeOfPayment,
                ...response.data.data,
                isDirectPayment,
                purposeOfPaymentString,
                ...object,
                ...response?.data?.data,
              }
            : {...object, ...response.data.data};
          onSuccess(routeObject, response?.data?.data);
          // navigation.navigate('InterBankFundTransferDetail', {
          //   data: routeObject,
          // });
          dispatch({
            type: actionTypes.SET_LOADER,
            payload: false,
          });
        } else {
          if (response?.headers?.['x-auth-next-token']) {
            dispatch({
              type: actionTypes.SET_TOKEN,
              payload: response?.headers?.['x-auth-next-token'],
            });
          }
          if (sessionControl(response)) {
            navigation.dispatch(
              CommonActions.reset({
                index: 0,
                routes: [{name: 'Login'}],
              }),
            );
            dispatch({
              type: actionTypes.CLEAR_APP_DATA,
            });
          }
          dispatch({
            type: actionTypes.SET_LOADER,
            payload: false,
          });

          dispatch({
            type: actionTypes.SET_ELSE_RESPONSE_ALERT,
            payload: {
              state: true,
              alertTitle: '',
              alertText: response.data?.data?.message
                ? response.data.data.message
                : response.data.responseDescription,
            },
          });
        }
      })
      .catch((error) => {
        dispatch({
          type: actionTypes.SET_LOADER,
          payload: false,
        });
        let message = '';
        if (!error.status) {
          // network err
          message = Message.networkErrorMessage;
        } else {
          message = String(error);
        }
        dispatch({
          type: actionTypes.SET_ELSE_RESPONSE_ALERT,
          payload: {
            state: true,
            alertTitle: '',
            alertText: message,
          },
        });
      });
  };
// ***** ENDS INTERBANK FUND TRANFER REQUEST  ******

// ***** IBFT DETAIL PAY OTP *****//

export const ibftPayOtp = (navigation, params) => async (dispatch) => {
  dispatch({
    type: actionTypes.SET_LOADER,
    payload: true,
  });
  logs.logRequest(
    `${Config.base_url.UAT_URL}${Config.method.my}/${Config.endpoint.otp},
    {
      accountNumber: ${params?.toAccount ? params?.toAccount : ''},
      benefType: '2',
      imd: ${params.imd},
      isBenef: false,
      tranType: 'IBFT',
    },
    {
      headers: {
        'X-Auth-Token': ${store.getState().reducers.token},
      },
    },`,
  );
  axios
    .post(
      `${Config.base_url.UAT_URL}${Config.method.my}/${Config.endpoint.otp}`,
      {
        accountNumber: params?.toAccount ? params?.toAccount.toUpperCase() : '',
        benefType: '2',
        imd: params.imd,
        isBenef: false,
        tranType: 'IBFT',
      },
      {
        headers: {
          'X-Auth-Token': store.getState().reducers.token,
        },
      },
    )
    .then((response) => {
      logs.log('Call Response', response?.headers);
      logs.logResponse(response.data);
      if (response.status === 200 && response.data.responseCode === '00') {
        dispatch({
          type: actionTypes.SET_TOKEN,
          payload: response?.headers?.['x-auth-next-token'],
        });
        dispatch({type: actionTypes.SET_LOADER, payload: false});
        navigation.navigate('InterBankFundTransferMpin', {data: params});
      } else {
        if (response?.headers?.['x-auth-next-token']) {
          dispatch({
            type: actionTypes.SET_TOKEN,
            payload: response?.headers?.['x-auth-next-token'],
          });
        }
        if (sessionControl(response)) {
          navigation.dispatch(
            CommonActions.reset({
              index: 0,
              routes: [{name: 'Login'}],
            }),
          );
          dispatch({
            type: actionTypes.CLEAR_APP_DATA,
          });
        }
        dispatch({
          type: actionTypes.SET_LOADER,
          payload: false,
        });

        dispatch({
          type: actionTypes.SET_ELSE_RESPONSE_ALERT,
          payload: {
            state: true,
            alertTitle: '',
            alertText: response.data?.data?.message
              ? response.data.data.message
              : response.data.responseDescription,
          },
        });
      }
    })
    .catch((error) => {
      dispatch({
        type: actionTypes.SET_LOADER,
        payload: false,
      });
      let message = '';
      if (!error.status) {
        // network err
        message = Message.networkErrorMessage;
      } else {
        message = String(error);
      }
      dispatch({
        type: actionTypes.SET_ELSE_RESPONSE_ALERT,
        payload: {
          state: true,
          alertTitle: '',
          alertText: message,
        },
      });
    });
};

// ***** ENDS IBFT DETAIL PAY OTP*****//

// ****** GET CNIC TRANSFER DATA *****
export const getCnicTransferData = (token, navigation) => async (dispatch) => {
  navigation.navigate('CnicTransfer');
  dispatch({
    type: actionTypes.SET_LOADER,
    payload: true,
  });
  logs.logRequest(
    `${Config.base_url.UAT_URL}${Config.method.my}/${Config.endpoint.accounts},
    {
      headers: {
        'X-Auth-Token': ${store.getState().reducers.token},
      },
    },`,
  );
  axios
    .get(
      `${Config.base_url.UAT_URL}${Config.method.my}/${Config.endpoint.accounts}`,
      {
        headers: {
          'X-Auth-Token': store.getState().reducers.token,
        },
      },
    )
    .then((response) => {
      logs.logResponse(response.data);
      if (response.status === 200 && response.data.responseCode === '00') {
        dispatch({
          type: actionTypes.SET_LOADER,
          payload: false,
        });
        dispatch({
          type: actionTypes.SET_TOKEN,
          payload: response?.headers?.['x-auth-next-token'],
        });
      } else {
        if (sessionControl(response)) {
          navigation.dispatch(
            CommonActions.reset({
              index: 0,
              routes: [{name: 'Login'}],
            }),
          );
          dispatch({
            type: actionTypes.CLEAR_APP_DATA,
          });
        } else {
          navigation.goBack();
        }
        dispatch({
          type: actionTypes.SET_LOADER,
          payload: false,
        });
        dispatch({
          type: actionTypes.SET_ELSE_RESPONSE_ALERT,
          payload: {
            state: true,
            alertTitle: 'CNIC Transfer',
            alertText: response.data?.data?.message
              ? response.data.data.message
              : response.data.responseDescription,
          },
        });
      }
    })
    .catch((error) => {
      navigation.goBack();
      dispatch({
        type: actionTypes.SET_LOADER,
        payload: false,
      });
      let message = '';
      if (!error.status) {
        // network err
        message = Message.networkErrorMessage;
      } else {
        message = String(error);
      }
      dispatch({
        type: actionTypes.SET_ELSE_RESPONSE_ALERT,
        payload: {
          state: true,
          alertTitle: 'CNIC Transfer',
          alertText: message,
        },
      });
    });
};
// ****** ENDS GET CNIC TRANSFER DATA *****

// ***** CNIC TRANSFER *****
export const cnicTransfer =
  (
    navigation,
    amount,
    fromAccount,
    rcvrCNIC,
    rcvrMsisdn,
    purposeOfPaymentString,
  ) =>
  async (dispatch) => {
    dispatch({
      type: actionTypes.SET_LOADER,
      payload: true,
    });

    logs.logRequest(
      `${Config.base_url.UAT_URL}${Config.method.bill}/${
        Config.endpoint.payToCnicTitleFetch
      },
      {
        amount: ${amount},
        carrierId: '01',
        carrierName: 'jazzcash',
        companyType: '11',
        fromAccount: ${fromAccount},
        pan: '',
        rcvrCNIC: ${rcvrCNIC},
        rcvrMsisdn: ${rcvrMsisdn},
      },
      {
        headers: {
          'X-Auth-Token': ${store.getState().reducers.token},
        },
      },`,
    );

    axios
      .post(
        `${Config.base_url.UAT_URL}${Config.method.bill}/${Config.endpoint.payToCnicTitleFetch}`,
        {
          amount: amount,
          carrierId: '01',
          carrierName: 'jazzcash',
          companyType: '11',
          fromAccount: fromAccount,
          pan: '',
          rcvrCNIC: rcvrCNIC, //'5252838338538',
          rcvrMsisdn: rcvrMsisdn, //'03038303838',
        },
        {
          headers: {
            'X-Auth-Token': store.getState().reducers.token,
          },
        },
      )
      .then((response) => {
        logs.logResponse(response.data);
        if (response.status === 200 && response.data.responseCode === '00') {
          dispatch({
            type: actionTypes.SET_TOKEN,
            payload: response?.headers?.['x-auth-next-token'],
          });
          let routeObject = {
            ...response.data.data,
            amount: amount,
            carrierId: '01',
            carrierName: 'jazzcash',
            companyType: '11',
            fromAccount: fromAccount,
            pan: '',
            rcvrCNIC: rcvrCNIC, //'5252838338538',
            rcvrMsisdn: rcvrMsisdn, //'03038303838',
            purposeOfPaymentString,
          };

          // navigation.navigate('CnicTransferResponse', {data: routeObject});
          navigation.navigate('CnicBillDetail', {data: routeObject});
          dispatch({
            type: actionTypes.SET_LOADER,
            payload: false,
          });
        } else {
          if (response?.headers?.['x-auth-next-token']) {
            dispatch({
              type: actionTypes.SET_TOKEN,
              payload: response?.headers?.['x-auth-next-token'],
            });
          }
          if (sessionControl(response)) {
            navigation.dispatch(
              CommonActions.reset({
                index: 0,
                routes: [{name: 'Login'}],
              }),
            );
            dispatch({
              type: actionTypes.CLEAR_APP_DATA,
            });
          }
          dispatch({
            type: actionTypes.SET_LOADER,
            payload: false,
          });

          dispatch({
            type: actionTypes.SET_ELSE_RESPONSE_ALERT,
            payload: {
              state: true,
              alertTitle: 'CNIC Transfer',
              alertText: response.data?.data?.message
                ? response.data.data.message
                : response.data.responseDescription,
            },
          });
        }
      })
      .catch((error) => {
        dispatch({
          type: actionTypes.SET_LOADER,
          payload: false,
        });
        let message = '';
        if (!error.status) {
          // network err
          message = Message.networkErrorMessage;
        } else {
          message = String(error);
        }
        dispatch({
          type: actionTypes.SET_ELSE_RESPONSE_ALERT,
          payload: {
            state: true,
            alertTitle: 'CNIC Transfer',
            alertText: message,
          },
        });
      });
  };
// *****  ENDS CNIC TRANSFER *****

// ***** CNIC PAY OTP ***** //

export const cnicPayOtp = (navigation, params) => async (dispatch) => {
  dispatch({
    type: actionTypes.SET_LOADER,
    payload: true,
  });

  logs.logRequest(
    `${Config.base_url.UAT_URL}${Config.method.my}/${Config.endpoint.otp},
    {
      accountNumber: ${params.fromAccount},
      benefType: '12',
      imd: '01',
      isBenef: false,
      tranType: 'paytoCNIC',
    },
    {
      headers: {
        'X-Auth-Token': ${store.getState().reducers.token},
      },
    },`,
  );

  axios
    .post(
      `${Config.base_url.UAT_URL}${Config.method.my}/${Config.endpoint.otp}`,
      {
        accountNumber: params.fromAccount,
        benefType: '12',
        imd: '01',
        isBenef: false,
        tranType: 'paytoCNIC',
      },
      {
        headers: {
          'X-Auth-Token': store.getState().reducers.token,
        },
      },
    )
    .then((response) => {
      logs.logResponse(response.data);
      if (response.status === 200 && response.data.responseCode === '00') {
        dispatch({
          type: actionTypes.SET_TOKEN,
          payload: response?.headers?.['x-auth-next-token'],
        });
        dispatch({type: actionTypes.SET_LOADER, payload: false});
        navigation.navigate('CnicTransferMpin', {data: params});
      } else {
        if (response?.headers?.['x-auth-next-token']) {
          dispatch({
            type: actionTypes.SET_TOKEN,
            payload: response?.headers?.['x-auth-next-token'],
          });
        }
        if (sessionControl(response)) {
          navigation.dispatch(
            CommonActions.reset({
              index: 0,
              routes: [{name: 'Login'}],
            }),
          );
          dispatch({
            type: actionTypes.CLEAR_APP_DATA,
          });
        }
        dispatch({
          type: actionTypes.SET_LOADER,
          payload: false,
        });

        dispatch({
          type: actionTypes.SET_ELSE_RESPONSE_ALERT,
          payload: {
            state: true,
            alertTitle: '',
            alertText: response.data?.data?.message
              ? response.data.data.message
              : response.data.responseDescription,
          },
        });
      }
    })
    .catch((error) => {
      dispatch({
        type: actionTypes.SET_LOADER,
        payload: false,
      });
      let message = '';
      if (!error.status) {
        // network err
        message = Message.networkErrorMessage;
      } else {
        message = String(error);
      }
      dispatch({
        type: actionTypes.SET_ELSE_RESPONSE_ALERT,
        payload: {
          state: true,
          alertTitle: '',
          alertText: message,
        },
      });
    });
};

// ***** ENDS CNIC PAY OTP ***** //

// ***** GET UTILITY BILL *****
export const utilityBillRequest =
  (token, navigation, service, isPayBenef, benefObject) => async (dispatch) => {
    dispatch({
      type: actionTypes.SET_LOADER,
      payload: true,
    });
    navigation.navigate('BillPayment', {
      data: {service, isPayBenef, benefObject},
    });
    logs.logRequest(
      `${Config.base_url.UAT_URL}${Config.method.my}/${
        Config.endpoint.accounts
      },
      {
        headers: {
          'X-Auth-Token': ${store.getState().reducers.token},
        },
      },`,
    );
    axios
      .get(
        `${Config.base_url.UAT_URL}${Config.method.my}/${Config.endpoint.accounts}`,
        {
          headers: {
            'X-Auth-Token': store.getState().reducers.token,
          },
        },
      )
      .then((response1) => {
        logs.logResponse(response1.data);
        if (response1.status === 200 && response1.data.responseCode === '00') {
          dispatch({
            type: actionTypes.SET_TOKEN,
            payload: response1.headers['x-auth-next-token'],
          });
          logs.logRequest(
            `${Config.base_url.UAT_URL}${Config.method.my}/${
              Config.endpoint.beneficiaries
            }?benefTypes=3&status=1,
            {
              headers: {
                'X-Auth-Token': ${store.getState().reducers.token},
              },
            },`,
          );
          axios
            .get(
              `${Config.base_url.UAT_URL}${Config.method.my}/${Config.endpoint.beneficiaries}?benefTypes=3&status=1`,
              {
                headers: {
                  'X-Auth-Token': store.getState().reducers.token,
                },
              },
            )
            .then((response2) => {
              logs.logResponse(response2.data);
              if (
                response2.status === 200 &&
                response2.data.responseCode === '00'
              ) {
                dispatch({
                  type: actionTypes.SET_TOKEN,
                  payload: response2.headers['x-auth-next-token'],
                });
                dispatch({
                  type: actionTypes.SET_UTILITY_BILL_DATA,
                  payload: {
                    Accounts: response1.data.data,
                    Beneficiaries: response2.data.data.beneficiaries,
                  },
                });
                dispatch({
                  type: actionTypes.SET_LOADER,
                  payload: false,
                });
              } else {
                if (response2.headers['x-auth-next-token']) {
                  dispatch({
                    type: actionTypes.SET_TOKEN,
                    payload: response2.headers['x-auth-next-token'],
                  });
                }
                if (sessionControl(response2)) {
                  navigation.dispatch(
                    CommonActions.reset({
                      index: 0,
                      routes: [{name: 'Login'}],
                    }),
                  );
                  dispatch({
                    type: actionTypes.CLEAR_APP_DATA,
                  });
                }
                dispatch({
                  type: actionTypes.SET_LOADER,
                  payload: false,
                });

                dispatch({
                  type: actionTypes.SET_ELSE_RESPONSE_ALERT,
                  payload: {
                    state: true,
                    alertTitle: '',
                    alertText: response2.data?.data?.message
                      ? response2.data.data.message
                      : response2.data.responseDescription,
                  },
                });
              }
            })
            .catch((err2) => {
              dispatch({
                type: actionTypes.SET_LOADER,
                payload: false,
              });
              let message = '';
              if (!err2.status) {
                // network err
                message = Message.networkErrorMessage;
              } else {
                message = String(err2);
              }
              dispatch({
                type: actionTypes.SET_ELSE_RESPONSE_ALERT,
                payload: {
                  state: true,
                  alertTitle: '',
                  alertText: message,
                },
              });
            });
        } else {
          if (response1.headers['x-auth-next-token']) {
            dispatch({
              type: actionTypes.SET_TOKEN,
              payload: response1.headers['x-auth-next-token'],
            });
          }
          if (sessionControl(response1)) {
            navigation.dispatch(
              CommonActions.reset({
                index: 0,
                routes: [{name: 'Login'}],
              }),
            );
            dispatch({
              type: actionTypes.CLEAR_APP_DATA,
            });
          } else {
            navigation.goBack();
          }
          dispatch({
            type: actionTypes.SET_LOADER,
            payload: false,
          });

          dispatch({
            type: actionTypes.SET_ELSE_RESPONSE_ALERT,
            payload: {
              state: true,
              alertTitle: response1?.data?.data?.error,
              alertText: response1.data?.data?.message
                ? response1.data.data.message
                : response1.data.responseDescription,
            },
          });
        }
      })
      .catch((error) => {
        navigation.goBack();
        dispatch({
          type: actionTypes.SET_LOADER,
          payload: false,
        });
        let message = '';
        if (!error.status) {
          // network err
          message = Message.networkErrorMessage;
        } else {
          message = String(error);
        }
        dispatch({
          type: actionTypes.SET_ELSE_RESPONSE_ALERT,
          payload: {
            state: true,
            alertTitle: '',
            alertText: message,
          },
        });
      });
  };
// ***** ENDS GET UTILITY BILL *****

// ***** GET CONSUMER BILL *****

export const getUtilityBill =
  (
    token,
    navigation,
    consumerNumber,
    ucid,
    fromAccount,
    biller,
    benefID,
    isDirectPayment,
    onSuccess,
  ) =>
  async (dispatch) => {
    dispatch({
      type: actionTypes.SET_LOADER,
      payload: true,
    });
    logs.logRequest(
      `${Config.base_url.UAT_URL}${
        Config.method.bill
      }/get?consumerNo=${consumerNumber}&ucid=${ucid},
  {
    headers: {
      'X-Auth-Token': ${store.getState().reducers.token},
    },
  },`,
    );
    axios
      .get(
        `${Config.base_url.UAT_URL}${Config.method.bill}/get?consumerNo=${consumerNumber}&ucid=${ucid}`,
        {
          headers: {
            'X-Auth-Token': store.getState().reducers.token,
          },
        },
      )
      .then((response) => {
        logs.logResponse(response.data);
        if (response.status === 200 && response.data.responseCode === '00') {
          dispatch({
            type: actionTypes.SET_BILL_OBJECT,
            payload: response.data.data,
          });
          logs.log('============>raffay');
          let responseObj = {
            fromAccount: fromAccount,
            biller: biller,
            consumerNumber: consumerNumber,
            ucid: ucid,
            token: response.data.data.token,
            benefID,
            isDirectPayment,
          };
          onSuccess(responseObj, response?.data);

          // navigation.navigate('ConfirmDetails', {
          //   data: responseObj,
          // });
          dispatch({
            type: actionTypes.SET_LOADER,
            payload: false,
          });
          dispatch({
            type: actionTypes.SET_TOKEN,
            payload: response?.headers?.['x-auth-next-token'],
          });
        } else {
          if (response?.headers?.['x-auth-next-token']) {
            dispatch({
              type: actionTypes.SET_TOKEN,
              payload: response?.headers?.['x-auth-next-token'],
            });
          }
          if (sessionControl(response)) {
            navigation.dispatch(
              CommonActions.reset({
                index: 0,
                routes: [{name: 'Login'}],
              }),
            );
            dispatch({
              type: actionTypes.CLEAR_APP_DATA,
            });
          }
          dispatch({
            type: actionTypes.SET_LOADER,
            payload: false,
          });

          dispatch({
            type: actionTypes.SET_ELSE_RESPONSE_ALERT,
            payload: {
              state: true,
              alertTitle: '',
              alertText: response.data?.data?.message
                ? response.data.data.message
                : response.data.responseDescription,
            },
          });
        }
      });
  };
// ***** ENDS GET CONSUMER BILL *****

// ***** PAY UTILITY BILL *****
export const payUtilityBill =
  (
    token,
    navigation,
    billToken,
    ucid,
    amount,
    comments,
    companyName,
    // companyType,
    consumerNumber,
    customerName,
    fromAccount,
    rcvrEmailAddress,
    rcvrMobileNumber,
    benefID,
  ) =>
  async (dispatch) => {
    // last utility bill validate beneficiary issue
    dispatch({
      type: actionTypes.SET_LOADER,
      payload: true,
    });
    logs.logRequest(
      `${Config.base_url.UAT_URL}${Config.method.my}/${Config.endpoint.otp},
      {
        accountNumber: ${consumerNumber},
        benefType: '3',
        imd: ${ucid},
        isBenef: true,
        tranType: 'BillPayment',
      },
      {headers: {'X-Auth-Token': ${store.getState().reducers.token}}},`,
    );
    axios
      .post(
        `${Config.base_url.UAT_URL}${Config.method.my}/${Config.endpoint.otp}`,
        {
          accountNumber: consumerNumber,
          benefType: '3',
          imd: ucid,
          isBenef: true,
          tranType: 'BillPayment',
        },
        {headers: {'X-Auth-Token': store.getState().reducers.token}},
      )
      .then((response1) => {
        logs.logResponse(response1.data);
        if (response1.status === 200 && response1.data.responseCode === '00') {
          dispatch({
            type: actionTypes.SET_TOKEN,
            payload: response1.headers['x-auth-next-token'],
          });

          logs.logRequest(
            `${Config.base_url.UAT_URL}${Config.method.bill}/${
              Config.endpoint.pay
            },
            {
              amount: ${amount},
              benefType: '3',
              benefiId: ${benefID},
              comments: '',
              companyName: ${companyName},
              companyType: '1',
              consumerNo: ${consumerNumber},
              customerName: ${customerName},
              fromAccount: ${fromAccount},
              isBenef: true,
              otp: '',
              rcvrEmailAddress: '',
              rcvrMobileNumber: '',
              token: ${billToken},
              ucid: ${ucid},
              validateOTP: true,
            },
            {
              headers: {
                'X-Auth-Token': ${store.getState().reducers.token},
              },
            },`,
          );

          axios
            .post(
              `${Config.base_url.UAT_URL}${Config.method.bill}/${Config.endpoint.pay}`,
              {
                amount: amount,
                benefType: '3',
                benefiId: benefID,
                comments: '',
                companyName: companyName,
                companyType: '1',
                consumerNo: consumerNumber,
                customerName: customerName,
                fromAccount: fromAccount,
                isBenef: true,
                otp: '',
                rcvrEmailAddress: '',
                rcvrMobileNumber: '',
                token: billToken,
                ucid: ucid,
                validateOTP: true,
              },
              {
                headers: {
                  'X-Auth-Token': store.getState().reducers.token,
                },
              },
            )
            .then((response2) => {
              logs.logResponse(response2.data);
              if (
                response2.status === 200 &&
                response2.data.responseCode === '00'
              ) {
                dispatch({
                  type: actionTypes.SET_TOKEN,
                  payload: response2.headers['x-auth-next-token'],
                });
                dispatch({
                  type: actionTypes.SET_RESPONSE_OBJECT,
                  payload: response2.data.data.transactionDetails,
                });

                dispatch({type: actionTypes.SET_LOADER, payload: false});

                // dispatch({
                //   type: actionTypes.GLOBAL_ICON_ALERT_STATE,
                //   payload: {
                //     state: true,
                //     navigation: navigation,
                //     props: {
                //       message:
                //         response2.data.data.transactionDetails.displayMessage,
                //       successAlert: true,
                //       onPressOk: () => {
                //         navigation.dispatch(
                //           CommonActions.reset({
                //             index: 0,
                //             routes: [{name: 'Home'}],
                //           }),
                //         );
                //         hideGlobalIconAlert();
                //       },
                //     },
                //   },
                // });
                dispatch(
                  actionChangeGlobalTransferAlertState(true, navigation, {
                    paymentType: globalPaymentTypes.Bill,
                    amount: amount,
                    fromName: `${
                      store.getState()?.reducers?.overViewData?.data?.accounts
                        ?.accountTitle
                    }`,
                    fromAccount: `${fromAccount}`,
                    rrn: response2?.data?.data?.rrn
                      ? response2?.data?.data?.rrn
                      : false,
                    stanId: response2?.data?.data?.transactionDetails?.stan
                      ? response2?.data?.data?.transactionDetails?.stan
                      : false,
                    toName: `${customerName}`,
                    toAccount: `${consumerNumber}`,
                    onPressClose: () => {
                      dispatch(closeGlobalTransferAlert(navigation));
                    },
                  }),
                );
              } else {
                if (response2.headers['x-auth-next-token']) {
                  dispatch({
                    type: actionTypes.SET_TOKEN,
                    payload: response2.headers['x-auth-next-token'],
                  });
                }
                if (sessionControl(response2)) {
                  navigation.dispatch(
                    CommonActions.reset({
                      index: 0,
                      routes: [{name: 'Login'}],
                    }),
                  );
                  dispatch({
                    type: actionTypes.CLEAR_APP_DATA,
                  });
                }

                dispatch({
                  type: actionTypes.SET_LOADER,
                  payload: false,
                });

                // dispatch({
                //   type: actionTypes.SET_ELSE_RESPONSE_ALERT,
                //   payload: {
                //     state: true,
                //     alertTitle: '',
                //     alertText: response2.data?.data?.message
                //       ? response2.data.data.message
                //       : response2.data.responseDescription,
                //   },
                // });
                dispatch({
                  type: actionTypes.GLOBAL_ICON_ALERT_STATE,
                  payload: {
                    state: true,
                    navigation: navigation,
                    props: {
                      message: response2.data?.data?.message
                        ? response2.data.data.message
                        : response2.data.responseDescription,
                      onPressOk: () => {
                        navigation.dispatch(
                          CommonActions.reset({
                            index: 0,
                            routes: [{name: 'Home'}],
                          }),
                        );
                        hideGlobalIconAlert();
                      },
                    },
                  },
                });
              }
            })
            .catch((error2) => {
              dispatch({type: actionTypes.SET_LOADER, payload: false});
              let message = '';
              if (!error2.status) {
                // network err
                message = Message.networkErrorMessage;
              } else {
                message = String(error2);
              }
              dispatch({
                type: actionTypes.SET_ELSE_RESPONSE_ALERT,
                payload: {
                  state: true,
                  alertTitle: '',
                  alertText: message,
                },
              });
            });
        } else {
          if (response1.headers['x-auth-next-token']) {
            dispatch({
              type: actionTypes.SET_TOKEN,
              payload: response1.headers['x-auth-next-token'],
            });
          }
          if (sessionControl(response1)) {
            navigation.dispatch(
              CommonActions.reset({
                index: 0,
                routes: [{name: 'Login'}],
              }),
            );
            dispatch({
              type: actionTypes.CLEAR_APP_DATA,
            });
          }
          dispatch({
            type: actionTypes.SET_LOADER,
            payload: false,
          });
          dispatch({
            type: actionTypes.SET_ELSE_RESPONSE_ALERT,
            payload: {
              state: true,
              alertTitle: response1.data?.data?.error
                ? response1.data.data.error
                : '',
              alertText: response1.data?.data?.message
                ? response1.data.data.message
                : response1.data.responseDescription,
            },
          });
        }
      })
      .catch((error1) => {
        dispatch({
          type: actionTypes.SET_LOADER,
          payload: false,
        });
        let message = '';
        if (!error1.status) {
          // network err
          message = Message.networkErrorMessage;
        } else {
          message = String(error1);
        }
        dispatch({
          type: actionTypes.SET_ELSE_RESPONSE_ALERT,
          payload: {
            state: true,
            alertTitle: '',
            alertText: message,
          },
        });
      });
  };
// ***** ENDS PAY UTILITY BILL ***** //

// ***** UTILITY DIRECT OTP ***** //
export const utilityDirectOtp =
  (
    token,
    navigation,
    billToken,
    ucid,
    amount,
    comments,
    companyName,
    consumerNumber,
    customerName,
    fromAccount,
    rcvrEmailAddress,
    rcvrMobileNumber,
  ) =>
  async (dispatch) => {
    dispatch({type: actionTypes.SET_LOADER, payload: true});
    axios
      .post(
        `${Config.base_url.UAT_URL}${Config.method.my}/${Config.endpoint.otp}`,
        {
          accountNumber: consumerNumber,
          benefType: '3',
          imd: ucid,
          isBenef: false,
          tranType: 'BillPayment',
        },
        {headers: {'X-Auth-Token': store.getState().reducers.token}},
      )
      .then((response) => {
        if (response.status === 200 && response.data.responseCode === '00') {
          dispatch({
            type: actionTypes.SET_TOKEN,
            payload: response?.headers?.['x-auth-next-token'],
          });
          let object = {
            billToken,
            ucid,
            amount,
            comments,
            companyName,
            consumerNumber,
            customerName,
            fromAccount,
            rcvrEmailAddress,
            rcvrMobileNumber,
            ...response.data,
          };
          navigation.navigate('UtilityMPIN', {data: object});
          dispatch({
            type: actionTypes.SET_LOADER,
            payload: false,
          });
        } else {
          if (response?.headers?.['x-auth-next-token']) {
            dispatch({
              type: actionTypes.SET_TOKEN,
              payload: response?.headers?.['x-auth-next-token'],
            });
          }
          if (sessionControl(response)) {
            navigation.dispatch(
              CommonActions.reset({
                index: 0,
                routes: [{name: 'Login'}],
              }),
            );
            dispatch({
              type: actionTypes.CLEAR_APP_DATA,
            });
          }
          dispatch({
            type: actionTypes.SET_LOADER,
            payload: false,
          });

          dispatch({
            type: actionTypes.SET_ELSE_RESPONSE_ALERT,
            payload: {
              state: true,
              alertTitle: '',
              alertText: response.data?.data?.message
                ? response.data.data.message
                : response.data.responseDescription,
            },
          });
        }
      })
      .catch((error1) => {
        dispatch({
          type: actionTypes.SET_LOADER,
          payload: false,
        });
        let message = '';
        if (!error1.status) {
          // network err
          message = Message.networkErrorMessage;
        } else {
          message = String(error1);
        }
        dispatch({
          type: actionTypes.SET_ELSE_RESPONSE_ALERT,
          payload: {
            state: true,
            alertTitle: 'Bill Payment',
            alertText: message,
          },
        });
      });
  };
// ***** ENDS UTILITY DIRECT OTP ***** //

// ***** FORGET PASSWORD API *****

export const forgotPassowrd =
  (
    token,
    navigation,
    atmPin,
    cardNumber,
    cnic,
    latitude,
    longitude,
    performFunctionOnSuccess,
  ) =>
  async (dispatch) => {
    dispatch({
      type: actionTypes.SET_LOADER,
      payload: true,
    });
    dispatch({
      type: actionTypes.SET_CURRENT_NAVIGATION,
      payload: navigation,
    });
    logs.logRequest(
      `${Config.base_url.UAT_URL}${Config.method.registration}/${
        Config.endpoint.forgetpassword2
      },
      {atmPin: ${atmPin}, cardNumber: ${cardNumber}, cnic: ${cnic},${{
        ...appInfoObject_ForServices,
      }}},`,
    );
    logs.log('latitude---->', latitude, 'longitude=====>', longitude);
    axios
      .post(
        `${Config.base_url.UAT_URL}${Config.method.registration}/${Config.endpoint.forgetpassword2}`,
        {
          atmPin: atmPin,
          cardNumber: cardNumber,
          cnic: cnic,
          latitude: latitude,
          longitude: longitude,
          ...appInfoObject_ForServices,
        },
      )
      .then((response) => {
        logs.logResponse(response.data);
        if (response.status === 200 && response.data.responseCode === '00') {
          dispatch({
            type: actionTypes.SET_TOKEN,
            payload: response?.headers?.['x-auth-next-token'],
          });
          // if (performFunctionOnSuccess) {
          //   performFunctionOnSuccess();
          // }
          dispatch({
            type: actionTypes.SET_LOADER,
            payload: false,
          });

          setTimeout(() => {
            dispatch({
              type: actionTypes.SET_ELSE_RESPONSE_ALERT,
              payload: {
                state: true,
                alertTitle: 'Forgot Password',
                alertText: response.data?.data?.message
                  ? response.data.data.message
                  : response.data.responseDescription,
                onPress: () => {
                  navigation.dispatch(
                    CommonActions.reset({
                      index: 0,
                      routes: [{name: 'Login'}],
                    }),
                  );
                },
              },
            });
          }, 500);
        } else {
          if (response?.headers?.['x-auth-next-token']) {
            dispatch({
              type: actionTypes.SET_TOKEN,
              payload: response?.headers?.['x-auth-next-token'],
            });
          }
          dispatch({
            type: actionTypes.SET_LOADER,
            payload: false,
          });
          dispatch({
            type: actionTypes.SET_ELSE_RESPONSE_ALERT,
            payload: {
              state: true,
              alertTitle: 'Forgot Password',
              alertText: response.data?.data?.message
                ? response.data.data.message
                : response.data.responseDescription,
            },
          });
        }
      })
      .catch((error1) => {
        dispatch({type: actionTypes.SET_LOADER, payload: false});
        let message = '';
        if (!error1.status) {
          // network err
          message = Message.networkErrorMessage;
        } else {
          message = String(error1);
        }
        dispatch({
          type: actionTypes.SET_ELSE_RESPONSE_ALERT,
          payload: {
            state: true,
            alertTitle: '',
            alertText: message,
          },
        });
      });
  };

// ***** ENDS FORGET PASSWORD API *****

// ***** GET OTHER PAYMENTS *****
export const getOtherPayments =
  (token, navigation, routeData, benefType, isPayBenef, benefObject) =>
  async (dispatch) => {
    dispatch({
      type: actionTypes.SET_LOADER,
      payload: true,
    });
    navigation.navigate('OtherPaymentService', {
      data: {isPayBenef, benefObject, routeData},
    });
    logs.logRequest(
      `${Config.base_url.UAT_URL}${Config.method.my}/${
        Config.endpoint.accounts
      },
      {headers: {'X-Auth-Token': ${store.getState().reducers.token}}},`,
    );
    axios
      .get(
        `${Config.base_url.UAT_URL}${Config.method.my}/${Config.endpoint.accounts}`,
        {headers: {'X-Auth-Token': store.getState().reducers.token}},
      )
      .then((response1) => {
        logs.logResponse(response1.data);
        if (response1.status === 200 && response1.data.responseCode) {
          dispatch({
            type: actionTypes.SET_TOKEN,
            payload: response1.headers['x-auth-next-token'],
          });
          logs.logRequest(
            `${Config.base_url.UAT_URL}${Config.method.my}/${
              Config.endpoint.beneficiaries
            }?benefTypes=${benefType}&status=1,
  {
    headers: {
      'X-Auth-Token': ${store.getState().reducers.token},
    },
  },`,
          );
          axios
            .get(
              `${Config.base_url.UAT_URL}${Config.method.my}/${Config.endpoint.beneficiaries}?benefTypes=${benefType}&status=1`,
              {
                headers: {
                  'X-Auth-Token': store.getState().reducers.token,
                },
              },
            )
            .then((response2) => {
              logs.logResponse(response2.data);
              if (
                response2.status === 200 &&
                response2.data.responseCode === '00'
              ) {
                dispatch({
                  type: actionTypes.SET_TOKEN,
                  payload: response2.headers['x-auth-next-token'],
                });
                dispatch({
                  type: actionTypes.SET_BENEFICIARIES,
                  payload: response2.data.data.beneficiaries,
                });

                dispatch({
                  type: actionTypes.SET_LOADER,
                  payload: false,
                });
              } else {
                if (response2.headers['x-auth-next-token']) {
                  dispatch({
                    type: actionTypes.SET_TOKEN,
                    payload: response2.headers['x-auth-next-token'],
                  });
                }
                if (sessionControl(response2)) {
                  navigation.dispatch(
                    CommonActions.reset({
                      index: 0,
                      routes: [{name: 'Login'}],
                    }),
                  );
                  dispatch({
                    type: actionTypes.CLEAR_APP_DATA,
                  });
                }

                dispatch({
                  type: actionTypes.SET_LOADER,
                  payload: false,
                });

                dispatch({
                  type: actionTypes.SET_ELSE_RESPONSE_ALERT,
                  payload: {
                    state: true,
                    alertTitle: '',
                    alertText: response2.data?.data?.message
                      ? response2.data.data.message
                      : response2.data.responseDescription,
                  },
                });
              }
            })
            .catch((error2) => {
              dispatch({
                type: actionTypes.SET_LOADER,
                payload: false,
              });
              let message = '';
              if (!error2.status) {
                // network err
                message = Message.networkErrorMessage;
              } else {
                message = String(error2);
              }
              dispatch({
                type: actionTypes.SET_ELSE_RESPONSE_ALERT,
                payload: {
                  state: true,
                  alertTitle: '',
                  alertText: message,
                },
              });
            });
        } else {
          if (response1.headers['x-auth-next-token']) {
            dispatch({
              type: actionTypes.SET_TOKEN,
              payload: response1.headers['x-auth-next-token'],
            });
          }
          if (sessionControl(response1)) {
            navigation.dispatch(
              CommonActions.reset({
                index: 0,
                routes: [{name: 'Login'}],
              }),
            );
            dispatch({
              type: actionTypes.CLEAR_APP_DATA,
            });
          }

          dispatch({
            type: actionTypes.SET_LOADER,
            payload: false,
          });

          dispatch({
            type: actionTypes.SET_ELSE_RESPONSE_ALERT,
            payload: {
              state: true,
              alertTitle: '',
              alertText: response1.data?.data?.message
                ? response1.data.data.message
                : response1.data.responseDescription,
            },
          });
        }
      })
      .catch((error1) => {
        dispatch({type: actionTypes.SET_LOADER, payload: false});
        let message = '';
        if (!error1.status) {
          // network err
          message = Message.networkErrorMessage;
        } else {
          message = String(error1);
        }
        dispatch({
          type: actionTypes.SET_ELSE_RESPONSE_ALERT,
          payload: {
            state: true,
            alertTitle: '',
            alertText: message,
          },
        });
      });
  };
// *****ENDS GET OTHER PAYMENTS *****

//***** GET OTHER PAYMENTS BILL ******/
export const getOtherPaymentsBill =
  (token, navigation, routeObject, onSuccess) => async (dispatch) => {
    dispatch({
      type: actionTypes.SET_LOADER,
      payload: true,
    });

    logs.logRequest(
      `${Config.base_url.UAT_URL}${Config.method.bill}/${
        Config.endpoint.get
      }?consumerNo=${
        routeObject.benefAccount
          ? routeObject.benefAccount
          : routeObject.consumerNumber
      }&ucid=${
        routeObject.imd
          ? routeObject.imd
          : routeObject?.benefObject?.imd
          ? routeObject?.benefObject?.imd
          : routeObject.staticImd
      },
      {headers: {'X-Auth-Token': ${store.getState().reducers.token}}},
      `,
    );
    axios
      .get(
        `${Config.base_url.UAT_URL}${Config.method.bill}/${
          Config.endpoint.get
        }?consumerNo=${
          routeObject.benefAccount
            ? routeObject.benefAccount
            : routeObject.consumerNumber
        }&ucid=${
          routeObject.imd
            ? routeObject.imd
            : routeObject?.benefObject?.imd
            ? routeObject?.benefObject?.imd
            : routeObject.staticImd
        }`,
        {headers: {'X-Auth-Token': store.getState().reducers.token}},
      )
      .then((response) => {
        logs.logResponse(response.data);
        if (response.status === 200 && response.data.responseCode === '00') {
          let object = {...routeObject, ...response.data.data};
          logs.log(`object is  ${JSON.stringify(object)}`);
          dispatch({
            type: actionTypes.SET_TOKEN,
            payload: response?.headers?.['x-auth-next-token'],
          });
          onSuccess(object, response?.data);
          // navigation.navigate('OtherPaymentBill', {data: object});
          dispatch({
            type: actionTypes.SET_LOADER,
            payload: false,
          });
        } else {
          if (response?.headers?.['x-auth-next-token']) {
            dispatch({
              type: actionTypes.SET_TOKEN,
              payload: response?.headers?.['x-auth-next-token'],
            });
          }
          if (sessionControl(response)) {
            navigation.dispatch(
              CommonActions.reset({
                index: 0,
                routes: [{name: 'Login'}],
              }),
            );
            dispatch({
              type: actionTypes.CLEAR_APP_DATA,
            });
          }
          dispatch({
            type: actionTypes.SET_LOADER,
            payload: false,
          });

          dispatch({
            type: actionTypes.SET_ELSE_RESPONSE_ALERT,
            payload: {
              state: true,
              alertTitle: 'Bill Payment',
              alertText: response.data?.data?.message
                ? response.data.data.message
                : response.data.responseDescription,
            },
          });
        }
      })
      .catch((error) => {
        dispatch({type: actionTypes.SET_LOADER, payload: false});
        let message = '';
        if (!error.status) {
          // network err
          message = Message.networkErrorMessage;
        } else {
          message = String(error);
        }
        dispatch({
          type: actionTypes.SET_ELSE_RESPONSE_ALERT,
          payload: {
            state: true,
            alertTitle: 'Bill Payment',
            alertText: message,
          },
        });
      });
  };
//***** ENDS GET OTHER PAYMENTS BILL ******/

// *****  DO OTHER PAYMENTS *****
export const doOtherPayments =
  (
    token,
    navigation,
    billToken,
    accountNumber,
    benefType,
    imd,
    amount,
    benefId,
    comments,
    companyName,
    customerName,
    fromAccount,
  ) =>
  async (dispatch) => {
    dispatch({
      type: actionTypes.SET_LOADER,
      payload: true,
    });
    logs.logRequest(
      `${Config.base_url.UAT_URL}${Config.method.my}/${Config.endpoint.otp},
      {
        accountNumber: ${accountNumber},
        benefType: ${benefType},
        imd: ${imd},
        isBenef: true,
        tranType: 'BillPayment',
      },
      {headers: {'X-Auth-Token': ${store.getState().reducers.token}}},`,
    );
    axios
      .post(
        `${Config.base_url.UAT_URL}${Config.method.my}/${Config.endpoint.otp}`,
        {
          accountNumber: accountNumber,
          benefType: benefType,
          imd: imd,
          isBenef: true,
          tranType: 'BillPayment',
        },
        {headers: {'X-Auth-Token': store.getState().reducers.token}},
      )
      .then((response1) => {
        logs.logResponse(response1.data);
        if (response1.status === 200 && response1.data.responseCode === '00') {
          dispatch({
            type: actionTypes.SET_TOKEN,
            payload: response1.headers['x-auth-next-token'],
          });

          axios
            .post(
              `${Config.base_url.UAT_URL}${Config.method.bill}/${Config.endpoint.pay}`,
              {
                amount: amount,
                benefType: benefType,
                benefiId: benefId,
                comments: comments,
                companyName: companyName,
                companyType: '4',
                consumerNo: accountNumber,
                customerName: customerName,
                fromAccount: fromAccount,
                isBenef: true,
                otp: '',
                rcvrEmailAddress: '',
                rcvrMobileNumber: '',
                token: billToken,
                ucid: imd,
                validateOTP: true,
              },
              {headers: {'X-Auth-Token': store.getState().reducers.token}},
            )
            .then((response2) => {
              if (
                response2.status === 200 &&
                response2.data.responseCode === '00'
              ) {
                dispatch({
                  type: actionTypes.SET_TOKEN,
                  payload: response2.headers['x-auth-next-token'],
                });
                // navigation.navigate('OtherPaymentResponse', {
                //   data: response2.data.data,
                // });
                dispatch({
                  type: actionTypes.SET_LOADER,
                  payload: false,
                });
                dispatch(
                  actionChangeGlobalTransferAlertState(true, navigation, {
                    paymentType: globalPaymentTypes.Bill,
                    amount: amount,
                    fromName: `${
                      store.getState()?.reducers?.overViewData?.data?.accounts
                        ?.accountTitle
                    }`,
                    fromAccount: `${fromAccount}`,
                    rrn: response2?.data?.data?.rrn
                      ? response2?.data?.data?.rrn
                      : false,
                    stanId: response2?.data?.data?.transactionDetails?.stan
                      ? response2?.data?.data?.transactionDetails?.stan
                      : false,
                    toName: `${customerName}`,
                    toAccount: `${accountNumber}`,
                    onPressClose: () => {
                      dispatch(closeGlobalTransferAlert(navigation));
                    },
                  }),
                );
              } else {
                if (response2.headers['x-auth-next-token']) {
                  dispatch({
                    type: actionTypes.SET_TOKEN,
                    payload: response2.headers['x-auth-next-token'],
                  });
                }
                if (sessionControl(response2)) {
                  navigation.dispatch(
                    CommonActions.reset({
                      index: 0,
                      routes: [{name: 'Login'}],
                    }),
                  );
                  dispatch({
                    type: actionTypes.CLEAR_APP_DATA,
                  });
                }
                dispatch({
                  type: actionTypes.SET_LOADER,
                  payload: false,
                });

                dispatch({
                  type: actionTypes.SET_ELSE_RESPONSE_ALERT,
                  payload: {
                    state: true,
                    alertTitle: '',
                    alertText: response2.data?.data?.message
                      ? response2.data.data.message
                      : response2.data.responseDescription,
                  },
                });
              }
            })
            .catch((error2) => {
              dispatch({
                type: actionTypes.SET_LOADER,
                payload: false,
              });

              dispatch({
                type: actionTypes.SET_ELSE_RESPONSE_ALERT,
                payload: {
                  state: true,
                  alertTitle: 'Bill Payment',
                  alertText:
                    typeof error2 === String ? error2 : 'Network Error',
                },
              });
            });
        } else {
          if (response1.headers['x-auth-next-token']) {
            dispatch({
              type: actionTypes.SET_TOKEN,
              payload: response1.headers['x-auth-next-token'],
            });
          }
          if (sessionControl(response1)) {
            navigation.dispatch(
              CommonActions.reset({
                index: 0,
                routes: [{name: 'Login'}],
              }),
            );
            dispatch({
              type: actionTypes.CLEAR_APP_DATA,
            });
          }

          dispatch({
            type: actionTypes.SET_LOADER,
            payload: false,
          });

          dispatch({
            type: actionTypes.SET_ELSE_RESPONSE_ALERT,
            payload: {
              state: true,
              alertTitle: '',
              alertText: response1.data?.data?.message
                ? response1.data.data.message
                : response1.data.responseDescription,
            },
          });
        }
      })
      .catch((error1) => {
        dispatch({
          type: actionTypes.SET_LOADER,
          payload: false,
        });
        let message = '';
        if (!error1.status) {
          // network err
          message = Message.networkErrorMessage;
        } else {
          message = String(error1);
        }
        dispatch({
          type: actionTypes.SET_ELSE_RESPONSE_ALERT,
          payload: {
            state: true,
            alertTitle: 'Bill Payment',
            alertText: message,
          },
        });
      });
  };
// ***** ENDS DO OTHER PAYMENTS *****

//***** OTHER DIRECT PAYMENT OTP *****/
export const otherDirectPaymentOtp =
  (
    token,
    navigation,
    billToken,
    accountNumber,
    benefType,
    imd,
    amount,
    benefId,
    comments,
    companyName,
    customerName,
    fromAccount,
    phone,
    email,
    companyType,
  ) =>
  async (dispatch) => {
    dispatch({
      type: actionTypes.SET_LOADER,
      payload: true,
    });
    let object = {
      token: billToken,
      accountNumber: accountNumber,
      benefType: benefType,
      imd: imd,
      amount: amount,
      benefId: benefId,
      comments: comments,
      companyName: companyName,
      customerName: customerName,
      fromAccount: fromAccount,
      rcvrMobileNumber: phone,
      rcvrEmailAddress: email,
      companyType: companyType,
    };

    axios
      .post(
        `${Config.base_url.UAT_URL}${Config.method.my}/${Config.endpoint.otp}`,
        {
          accountNumber: accountNumber,
          benefType: benefType,
          imd: imd,
          isBenef: false,
          tranType: 'BillPayment',
        },
        {headers: {'X-Auth-Token': store.getState().reducers.token}},
      )
      .then((response) => {
        if (response.status === 200 && response.data.responseCode === '00') {
          dispatch({
            type: actionTypes.SET_TOKEN,
            payload: response?.headers?.['x-auth-next-token'],
          });
          navigation.navigate('OtherPaymentMpin', {data: object});
          dispatch({
            type: actionTypes.SET_LOADER,
            payload: false,
          });
        } else {
          if (response?.headers?.['x-auth-next-token']) {
            dispatch({
              type: actionTypes.SET_TOKEN,
              payload: response?.headers?.['x-auth-next-token'],
            });
          }
          if (sessionControl(response)) {
            navigation.dispatch(
              CommonActions.reset({
                index: 0,
                routes: [{name: 'Login'}],
              }),
            );
            dispatch({
              type: actionTypes.CLEAR_APP_DATA,
            });
          }
          dispatch({
            type: actionTypes.SET_LOADER,
            payload: false,
          });

          dispatch({
            type: actionTypes.SET_ELSE_RESPONSE_ALERT,
            payload: {
              state: true,
              alertTitle: '',
              alertText: response.data?.data?.message
                ? response.data.data.message
                : response.data.responseDescription,
            },
          });
        }
      })
      .catch((error1) => {
        dispatch({
          type: actionTypes.SET_LOADER,
          payload: false,
        });
        let message = '';
        if (!error1.status) {
          // network err
          message = Message.networkErrorMessage;
        } else {
          message = String(error1);
        }
        dispatch({
          type: actionTypes.SET_ELSE_RESPONSE_ALERT,
          payload: {
            state: true,
            alertTitle: 'Bill Payment',
            alertText: message,
          },
        });
      });
  };
//***** ENDS OTHER DIRECT PAYMENT OTP *****/

// ***** DIRECT PAY OTHER PAYMENTS BILL PAY *****
export const otherPaymentsDirectPay =
  (params, navigation, mpin) => async (dispatch) => {
    dispatch({type: actionTypes.SET_LOADER, payload: true});
    axios
      .post(
        `${Config.base_url.UAT_URL}${Config.method.bill}/${Config.endpoint.pay}`,
        {
          amount: params.amount,
          benefType: params.benefType,
          benefiId: '',
          comments: params.comments,
          companyName: params.companyName,
          companyType: params.companyType,
          consumerNo: params.accountNumber,
          customerName: params.customerName,
          fromAccount: params.fromAccount,
          isBenef: false,
          otp: mpin,
          rcvrEmailAddress: params.rcvrEmailAddress,
          rcvrMobileNumber: params.rcvrMobileNumber,
          token: params.token,
          ucid: params.imd,
          validateOTP: true,
        },
        {
          headers: {
            'X-Auth-Token': store.getState().reducers.token,
          },
        },
      )
      .then((res) => {
        if (res.status === 200 && res.data.responseCode === '00') {
          dispatch({
            type: actionTypes.SET_TOKEN,
            payload: res.headers['x-auth-next-token'],
          });
          // navigation.navigate('PaymentResponse', {
          //   data: res.data.data,
          // });

          dispatch({
            type: actionTypes.SET_LOADER,
            payload: false,
          });
          dispatch(
            actionChangeGlobalTransferAlertState(true, navigation, {
              paymentType: globalPaymentTypes.Bill,
              amount: params.amount,
              fromName: `${
                store.getState()?.reducers?.overViewData?.data?.accounts
                  ?.accountTitle
              }`,
              fromAccount: `${params.fromAccount}`,
              rrn: res?.data?.data?.rrn ? res?.data?.data?.rrn : false,
              stanId: res?.data?.data?.transactionDetails?.stan
                ? res?.data?.data?.transactionDetails?.stan
                : false,
              toName: `${params.customerName}`,
              toAccount: `${params.accountNumber}`,
              onPressClose: () => {
                dispatch(closeGlobalTransferAlert(navigation));
              },
            }),
          );
        } else {
          if (res.headers['x-auth-next-token']) {
            dispatch({
              type: actionTypes.SET_TOKEN,
              payload: res.headers['x-auth-next-token'],
            });
          }
          if (sessionControl(res)) {
            navigation.dispatch(
              CommonActions.reset({
                index: 0,
                routes: [{name: 'Login'}],
              }),
            );
            dispatch({
              type: actionTypes.CLEAR_APP_DATA,
            });
          }
          dispatch({
            type: actionTypes.SET_LOADER,
            payload: false,
          });

          dispatch({
            type: actionTypes.SET_ELSE_RESPONSE_ALERT,
            payload: {
              state: true,
              alertTitle: '',
              alertText: res.data?.data?.message
                ? res.data.data.message
                : res.data.responseDescription,
            },
          });
        }
      })
      .catch((err) => {
        dispatch({
          type: actionTypes.SET_LOADER,
          payload: false,
        });
        let message = '';
        if (!err.status) {
          // network err
          message = Message.networkErrorMessage;
        } else {
          message = String(err);
        }
        dispatch({
          type: actionTypes.SET_ELSE_RESPONSE_ALERT,
          payload: {
            state: true,
            alertTitle: '',
            alertText: message,
          },
        });
      });
  };
// ***** ENDS DIRECT PAY OTHER PAYMENTS BILL PAY *****

// TRIAL ENDS

// ***** SET ELSE RESPONSE ALERT *****

export const setElseResponseAlert = () => async (dispatch) => {
  dispatch({
    type: actionTypes.SET_ELSE_RESPONSE_ALERT,
    payload: {
      state: false,
      alertText: store.getState().reducers.elseResponse?.alertText
        ? store.getState().reducers.elseResponse?.alertText
        : '',
      alertTitle: '',
    },
  });
};

// ***** ENDS SET ELSE RESPONSE ALERT *****

// ***** SHOW ELSE RESPONSE ALERT *****

export const setAlertObject = (object) => async (dispatch) => {
  dispatch({
    type: actionTypes.SET_ELSE_RESPONSE_ALERT,
    payload: {
      state: true,
      alertText: object?.message ? object?.message : '',
      alertTitle: object?.alertTitle
        ? object?.alertTitle
        : store.getState().reducers.currentFlow,
      onPress: object?.goLogin
        ? () => {
            object?.navigation.dispatch(
              CommonActions.reset({
                index: 0,
                routes: [{name: 'Login'}],
              }),
            );
          }
        : object?.goHome
        ? () => {
            object?.navigation.dispatch(
              CommonActions.reset({
                index: 0,
                routes: [{name: 'Home'}],
              }),
            );
          }
        : object?.onPress
        ? () => object?.onPress()
        : false,
    },
  });
};
export const Localization = (Lang) => async (dispatch) => {
  dispatch({
    type: actionTypes.SET_LOCALIZATION,
    payload: Lang,
  });
};
export const setAppAlert =
  (alertText, alertTitle, navigation, onPress) => async (dispatch) => {
    let fingerprintLableForOS =
      Platform.OS == 'ios' ? 'Touch ID' : 'Fingerprint';
    Platform.OS === 'android'
      ? dispatch({
          type: actionTypes.GLOBAL_ICON_ALERT_STATE,
          payload: {
            state: true,
            navigation: navigation,
            props: {
              message: alertText,
              onPressOk: onPress ? () => onPress() : false,
            },
          },
        })
      : alertText === Message.networkErrorMessage
      ? Alert.alert(
          store.getState().reducers.currentFlow === ''
            ? 'NBP Digital'
            : store.getState().reducers.currentFlow,
          Message.networkErrorMessage,
          [
            {
              text: I18n[`Retry`],
              onPress: () => {
                setTimeout(() => {
                  dispatch(checkNetworkConnectivityInternal());
                }, 500);
              },
            },
          ],
        )
      : alertText ===
        `Please note ${fingerprintLableForOS} has not been enabled for this device. To use this feature, please enable ${fingerprintLableForOS} in your device settings.`
      ? Alert.alert(
          store.getState().reducers.currentFlow !== ''
            ? store.getState().reducers.currentFlow
            : 'NBP Digital',
          `Please note ${fingerprintLableForOS} has not been enabled for this device. To use this feature, please enable ${fingerprintLableForOS} in your device settings.`,
          [
            {
              text: I18n[`OK`],
              onPress: () => {
                setTimeout(() => {
                  store.getState().reducers.currentNavigation.goBack();
                }, 500);
              },
            },
          ],
        )
      : alertText === 'Card Already Provisoned!' ||
        alertText === 'Card Enrolled Successfully.' ||
        alertText === 'MPIN added successfully' ||
        alertText === 'Transaction Successfull' ||
        alertText === 'Card not active' ||
        alertText ===
          'Unable to perform transaction as your card is currently suspended' ||
        alertText === 'MPIN Generated successfully'
      ? Alert.alert(
          store.getState().reducers.currentFlow !== ''
            ? store.getState().reducers.currentFlow
            : 'NBP Digital',
          alertText,
          [
            {
              text: I18n[`OK`],
              onPress: () => {
                setTimeout(() => {
                  store.getState().reducers.currentNavigation.navigate('Home');
                }, 500);
              },
            },
          ],
        )
      : Alert.alert(
          store.getState().reducers.currentFlow !== ''
            ? I18n[`${store.getState().reducers.currentFlow}`]
              ? I18n[`${store.getState().reducers.currentFlow}`]
              : store.getState().reducers.currentFlow
            : 'NBP Digital',
          I18n[`${alertText}`] ? I18n[`${alertText}`] : alertText,
          onPress
            ? [
                {
                  text: I18n[`OK`],
                  onPress: () => {
                    onPress();
                  },
                },
              ]
            : [
                {
                  text: I18n[`OK`],
                },
              ],
        );
  };

// ***** ENDS SHOW ELSE RESPONSE ALERT *****

// ***** CHECK TOUCH ID STATUS *****

export const touchIdStatus = () => async (dispatch) => {
  TouchID.isSupported(optionalConfigObject)
    .then((state) => {
      if (state) {
        dispatch({
          type: actionTypes.SET_TOUCH_ID_SUPPORT,
          payload: true,
        });
      } else {
        dispatch({
          type: actionTypes.SET_TOUCH_ID_SUPPORT,
          payload: false,
        });
      }
    })
    .catch((error) => {
      let errorCode = Platform.OS == 'ios' ? error.name : error.code;
      if (
        errorCode === 'LAErrorTouchIDNotEnrolled' ||
        errorCode === 'NOT_AVAILABLE' ||
        errorCode === 'NOT_ENROLLED'
      ) {
        dispatch({
          type: actionTypes.SET_TOUCH_ID_SUPPORT,
          payload: true,
        });
      }
    });
};

// ***** ENDS CHECK TOUCH ID STATUS *****

// ***** 1 BILL TOP UP *****

export const OneBillTopUp =
  (token, navigation, routeData, benefType, isPayBenef, benefObject) =>
  async (dispatch) => {
    dispatch({
      type: actionTypes.SET_LOADER,
      payload: true,
    });
    navigation.navigate('OtherPaymentService', {
      data: {isPayBenef, benefObject, routeData},
    });
    logs.logRequest(
      `${Config.base_url.UAT_URL}${Config.method.my}/${
        Config.endpoint.accounts
      },
      {
        headers: {'X-Auth-Token': ${store.getState().reducers.token}},
      },`,
    );
    axios
      .get(
        `${Config.base_url.UAT_URL}${Config.method.my}/${Config.endpoint.accounts}`,
        {
          headers: {'X-Auth-Token': store.getState().reducers.token},
        },
      )
      .then((response1) => {
        logs.logResponse(response1.data);
        if (response1.status === 200 && response1.data.responseCode === '00') {
          dispatch({
            type: actionTypes.SET_TOKEN,
            payload: response1.headers['x-auth-next-token'],
          });

          logs.logRequest(
            `${Config.base_url.UAT_URL}${Config.method.bill}/${
              Config.endpoint.mobileLimits
            },
            {
              headers: {'X-Auth-Token': ${store.getState().reducers.token}},
            },`,
          );

          axios
            .get(
              `${Config.base_url.UAT_URL}${Config.method.bill}/${Config.endpoint.mobileLimits}`,
              {
                headers: {'X-Auth-Token': store.getState().reducers.token},
              },
            )
            .then((response2) => {
              logs.logResponse(response2.data);
              if (
                response2.status === 200 &&
                response2.data.responseCode === '00'
              ) {
                dispatch({
                  type: actionTypes.SET_MOBILE_TOP_UP_LIMITS,
                  payload: response2.data.data,
                });
                dispatch({
                  type: actionTypes.SET_TOKEN,
                  payload: response2.headers['x-auth-next-token'],
                });
                logs.logRequest(
                  `${Config.base_url.UAT_URL}${Config.method.my}/${
                    Config.endpoint.beneficiaries
                  }?benefTypes=${benefType}&status=1,
                  {
                    headers: {
                      'X-Auth-Token': ${store.getState().reducers.token},
                    },
                  },`,
                );
                axios
                  .get(
                    `${Config.base_url.UAT_URL}${Config.method.my}/${Config.endpoint.beneficiaries}?benefTypes=${benefType}&status=1`,
                    {
                      headers: {
                        'X-Auth-Token': store.getState().reducers.token,
                      },
                    },
                  )
                  .then((response3) => {
                    logs.logResponse(response3.data);
                    if (
                      response3.status === 200 &&
                      response3.data.responseCode === '00'
                    ) {
                      dispatch({
                        type: actionTypes.SET_TOKEN,
                        payload: response3.headers['x-auth-next-token'],
                      });
                      dispatch({
                        type: actionTypes.SET_BENEFICIARIES,
                        payload: response3.data.data.beneficiaries,
                      });
                      dispatch({
                        type: actionTypes.SET_LOADER,
                        payload: false,
                      });
                    } else {
                      if (response3.headers['x-auth-next-token']) {
                        dispatch({
                          type: actionTypes.SET_TOKEN,
                          payload: response3.headers['x-auth-next-token'],
                        });
                      }
                      if (sessionControl(response3)) {
                        navigation.dispatch(
                          CommonActions.reset({
                            index: 0,
                            routes: [{name: 'Login'}],
                          }),
                        );
                        dispatch({
                          type: actionTypes.CLEAR_APP_DATA,
                        });
                      }

                      dispatch({
                        type: actionTypes.SET_LOADER,
                        payload: false,
                      });

                      dispatch({
                        type: actionTypes.SET_ELSE_RESPONSE_ALERT,
                        payload: {
                          state: true,
                          alertTitle: 'Bill Payment',
                          alertText: response3.data?.data?.message
                            ? response3.data.data.message
                            : response3.data.responseDescription,
                        },
                      });
                    }
                  })
                  .catch((error3) => {
                    dispatch({
                      type: actionTypes.SET_LOADER,
                      payload: false,
                    });

                    let message = '';
                    if (!error3.status) {
                      // network err
                      message = Message.networkErrorMessage;
                    } else {
                      message = String(error3);
                    }
                    dispatch({
                      type: actionTypes.SET_ELSE_RESPONSE_ALERT,
                      payload: {
                        state: true,
                        alertTitle: 'Bill Payment',
                        alertText: message,
                      },
                    });
                  });
              } else {
                if (response2.headers['x-auth-next-token']) {
                  dispatch({
                    type: actionTypes.SET_TOKEN,
                    payload: response2.headers['x-auth-next-token'],
                  });
                }
                if (sessionControl(response2)) {
                  navigation.dispatch(
                    CommonActions.reset({
                      index: 0,
                      routes: [{name: 'Login'}],
                    }),
                  );
                  dispatch({
                    type: actionTypes.CLEAR_APP_DATA,
                  });
                }

                dispatch({
                  type: actionTypes.SET_LOADER,
                  payload: false,
                });

                dispatch({
                  type: actionTypes.SET_ELSE_RESPONSE_ALERT,
                  payload: {
                    state: true,
                    alertTitle: 'Bill Payment',
                    alertText: response2.data?.data?.message
                      ? response2.data.data.message
                      : response2.data.responseDescription,
                  },
                });
              }
            })
            .catch((error2) => {
              dispatch({
                type: actionTypes.SET_LOADER,
                payload: false,
              });
              let message = '';
              if (!error2.status) {
                // network err
                message = Message.networkErrorMessage;
              } else {
                message = String(error2);
              }
              dispatch({
                type: actionTypes.SET_ELSE_RESPONSE_ALERT,
                payload: {
                  state: true,
                  alertTitle: 'Bill Payment',
                  alertText: message,
                },
              });
            });
        } else {
          if (response1.headers['x-auth-next-token']) {
            dispatch({
              type: actionTypes.SET_TOKEN,
              payload: response1.headers['x-auth-next-token'],
            });
          }
          if (sessionControl(response1)) {
            navigation.dispatch(
              CommonActions.reset({
                index: 0,
                routes: [{name: 'Login'}],
              }),
            );
            dispatch({
              type: actionTypes.CLEAR_APP_DATA,
            });
          } else {
            navigation.goBack();
          }

          dispatch({
            type: actionTypes.SET_LOADER,
            payload: false,
          });

          dispatch({
            type: actionTypes.SET_ELSE_RESPONSE_ALERT,
            payload: {
              state: true,
              alertTitle: 'Bill Payment',
              alertText: response1.data?.data?.message
                ? response1.data.data.message
                : response1.data.responseDescription,
            },
          });
        }
      })
      .catch((error1) => {
        navigation.goBack();
        dispatch({
          type: actionTypes.SET_LOADER,
          payload: false,
        });

        let message = '';
        if (!error1.status) {
          // network err
          message = Message.networkErrorMessage;
        } else {
          message = String(error1);
        }
        dispatch({
          type: actionTypes.SET_ELSE_RESPONSE_ALERT,
          payload: {
            state: true,
            alertTitle: 'Bill Payment',
            alertText: message,
          },
        });
      });
  };

// ***** ENDS 1 BILL TOP UP *****

export const helpInforamtion = (props) => async (dispatch) => {
  logs.log('18276391263971293', props);
  dispatch({
    type: actionTypes.INFORMATION_PAGE,
    payload: {props: props},
  });
};
export const showingBannerOnce = (props) => async (dispatch) => {
  logs.log('BannerInitalValue', props);
  dispatch({
    type: actionTypes.SET_BANNER,
    payload: {props: props},
  });
};
export const closeInformationAlert = () => async (dispatch) => {
  dispatch({
    type: actionTypes.INFORMATION_PAGE,
    payload: {
      props: {
        state: false,
        title: '',
      },
    },
  });
};
// ***** RESEND OTP *****

export const resendOtp = (token, navigation, onPress) => async (dispatch) => {
  dispatch({
    type: actionTypes.SET_LOADER,
    payload: true,
  });
  logs.logRequest(
    `${Config.base_url.UAT_URL}${Config.method.my}/${Config.method.resendOtp}/${
      Config.endpoint.device_verification
    },
    {},
    {
      headers: {'X-Auth-Token': ${store.getState().reducers.token}},
    },`,
  );
  axios
    .post(
      `${Config.base_url.UAT_URL}${Config.method.my}/${Config.method.resendOtp}/${Config.endpoint.device_verification}`,
      {},
      {
        headers: {'X-Auth-Token': store.getState().reducers.token},
      },
    )
    .then((response) => {
      logs.logResponse(response.data);
      if (response.status === 200 && response.data.responseCode === '00') {
        dispatch({
          type: actionTypes.SET_TOKEN,
          payload: response?.headers?.['x-auth-next-token'],
        });
        if (onPress) {
          onPress();
        }
        dispatch({
          type: actionTypes.SET_LOADER,
          payload: false,
        });
        {
          Platform.OS === 'ios'
            ? dispatch({
                type: actionTypes.SET_ELSE_RESPONSE_ALERT,
                payload: {
                  state: true,
                  alertTitle: 'Device Verification',
                  alertText: 'OTP has been sent again.',
                },
              })
            : global.showToast.show(I18n['OTP has been sent again.'], 1000);
        }
      } else {
        if (response?.headers?.['x-auth-next-token']) {
          dispatch({
            type: actionTypes.SET_TOKEN,
            payload: response?.headers?.['x-auth-next-token'],
          });
        }

        if (sessionControl(response)) {
          navigation.dispatch(
            CommonActions.reset({
              index: 0,
              routes: [{name: 'Login'}],
            }),
          );
          dispatch({
            type: actionTypes.CLEAR_APP_DATA,
          });
        }

        dispatch({
          type: actionTypes.SET_LOADER,
          payload: false,
        });

        dispatch({
          type: actionTypes.SET_ELSE_RESPONSE_ALERT,
          payload: {
            state: true,
            alertTitle: 'Device Verification',
            alertText: response.data?.data?.message
              ? response.data.data.message
              : response.data.responseDescription,
            onPress: onPress
              ? () => {
                  onPress();
                }
              : false,
          },
        });
      }
    })
    .catch((error) => {
      logs.log(error);
      dispatch({
        type: actionTypes.SET_LOADER,
        payload: false,
      });
      let message = '';
      if (!error.status) {
        // network err
        message = Message.networkErrorMessage;
      } else {
        message = String(error);
      }
      dispatch({
        type: actionTypes.SET_ELSE_RESPONSE_ALERT,
        payload: {
          state: true,
          alertTitle: 'Device Verification',
          alertText: message,
        },
      });
    });
};

// ***** ENDS RESEND OTP *****

// ***** VIRTUAL CARD : Add Card ******
export const addVirtualCard = (token, navigation) => async (dispatch) => {
  dispatch({
    type: actionTypes.SET_LOADER,
    payload: true,
  });
  axios
    .post(
      ``,
      {},
      {
        headers: {},
      },
    )
    .then((response1) => {
      dispatch({
        type: actionTypes.SET_LOADER,
        payload: false,
      });
    })
    .catch((error1) => {
      dispatch({
        type: actionTypes.SET_LOADER,
        payload: false,
      });
    });
};
// ***** ENDS VIRTUAL CARD : Add Card ******

// ***** FINGERPRINT REGISTER *****

export const registerFingerPrint =
  (userName, password, fcmToken, navigation) => async (dispatch) => {
    let currentLatitude = 0;
    let currentLongitude = 0;
    geoLocation((location) => {
      logs.debug(
        'location.latitude--->>>',
        location.latitude,
        'location.longitude',
        location.longitude,
      );
      currentLatitude = location.latitude;
      currentLongitude = location.longitude;
    });
    dispatch({
      type: actionTypes.SET_LOADER,
      payload: true,
    });
    dispatch({
      type: actionTypes.SET_CURRENT_NAVIGATION,
      payload: navigation,
    });

    axios
      .post(
        `${Config.base_url.UAT_URL}${Config.method.authenticate}`,
        {},
        {
          headers: {
            'X-Device-Token': fcmToken,
            'X-Auth-Password': password,
            'X-Auth-Username': userName,
            IS_FP: false,
            'X-Device-Type': Platform.OS === 'android' ? 'android' : 'ios',
            'X-Device-ID': DeviceInfo.getUniqueId(),
            'X-Device-Version': deviceVersionString,
            'Is-Rooted': appInfo.isJailBroken,
            'Make-Model': appInfo.deviceName,
            latitude: currentLatitude,
            longitude: currentLongitude,
            'X-Player-ID': store.getState().reducers.userObject.PlayerId,
          },
        },
      )
      .then((response1) => {
        logs.log('Device Version=========>,', deviceVersionString);
        if (response1.status === 200 && response1.data.responseCode === '00') {
          dispatch({
            type: actionTypes.SET_TOKEN,
            payload: response1.headers['x-auth-next-token'],
          });
          dispatch({
            type: actionTypes.SET_USER_OBJECT,
            payload: {
              ...store.getState().reducers.userObject,
              customerLevel: response1.data?.data?.details?.customerlevel,
              customerEmail: response1.data?.data?.details?.email,
              customerMobile: response1.data?.data?.details?.mobile,
            },
          });

          axios
            .post(
              `${Config.base_url.UAT_URL}${Config.method.my}/${Config.method.fingerprint}/${Config.endpoint.changeStatus}`,
              {
                deviceId: DeviceInfo.getUniqueId(),
                enable: true,
                fpToken: 'hi',
                userName: userName,
              },
              {
                headers: {'X-Auth-Token': response1.data?.data?.token},
              },
            )
            .then((response2) => {
              if (
                response2.status === 200 &&
                response2.data.responseCode === '00'
              ) {
                dispatch({
                  type: actionTypes.SET_TOKEN,
                  payload: response2.headers['x-auth-next-token'],
                });
                dispatch({
                  type: actionTypes.SET_LOADER,
                  payload: false,
                });
                // dispatch({
                //   type: actionTypes.SET_ASK_FOR_FINGERPRINT,
                //   payload: true,
                // });
                // COMMENTED TEST

                TouchID.isSupported(optionalConfigObject)
                  .then((status) => {
                    if (status) {
                      TouchID.authenticate(
                        'Place your finger on scanner',
                        optionalConfigObject,
                      )
                        .then((success) => {
                          dispatch(
                            setKeyChainObject({
                              fpToken: response2.data?.data.fpToken,
                              userName: userName,
                              fingerPrintEnabled: true,
                            }),
                          );
                          post_login(
                            userName,
                            password,
                            Config.method.authenticate,
                            '',
                            {},
                            navigation,
                            async (response) => {
                              let fpToken = response2.data?.data.fpToken;

                              dispatch({
                                type: actionTypes.SET_LOADER,
                                payload: false,
                              });
                              dispatch(setToken(response.token));
                              if (response.details.deviceExist) {
                                navigation.dispatch(
                                  CommonActions.reset({
                                    index: 0,
                                    routes: [{name: 'Home'}],
                                  }),
                                );
                                dispatch(setUserSignedIn(userName));
                              } else {
                                navigation.navigate('Login_Otp', {
                                  data: userName,
                                });
                                global.showToast.show(
                                  I18n[
                                    'OTP has been sent to Your Email and SMS'
                                  ],
                                  1000,
                                );
                              }
                            },
                            (error) => {
                              dispatch({
                                type: actionTypes.SET_LOADER,
                                payload: false,
                              });
                            },
                          );
                        })
                        .catch((error) => {});
                    }
                  })
                  .catch((error) => {
                    //
                    // iOS Error Format and android error formats are different
                    // android use code and ios use name
                    // check at https://github.com/naoufal/react-native-touch-id
                    let errorCode =
                      Platform.OS == 'ios' ? error.name : error.code;
                    if (
                      errorCode === 'LAErrorTouchIDNotEnrolled' ||
                      errorCode === 'NOT_AVAILABLE' ||
                      errorCode === 'NOT_ENROLLED'
                    ) {
                      let fingerprintLableForOS =
                        Platform.OS == 'ios' ? 'Touch ID' : 'Fingerprint';
                      // dispatch(
                      //   setAppAlert(
                      //     `Please note ${fingerprintLableForOS} has not been enabled for this device. To use this feature, please enable ${fingerprintLableForOS} in your device settings.`,
                      //     'NBP',
                      //   ),
                      // );
                      dispatch({
                        type: actionTypes.SET_ELSE_RESPONSE_ALERT,
                        payload: {
                          state: true,
                          alertTitle: 'NBP Digital',
                          alertText: `Please note ${fingerprintLableForOS} has not been enabled for this device. To use this feature, please enable ${fingerprintLableForOS} in your device settings.`,
                        },
                      });
                    } else {
                    }
                    //
                  });

                // ENDS COMMENTED TEST
              } else {
                if (response2.headers['x-auth-next-token']) {
                  dispatch({
                    type: actionTypes.SET_TOKEN,
                    payload: response2.headers['x-auth-next-token'],
                  });
                }

                dispatch({
                  type: actionTypes.SET_LOADER,
                  payload: false,
                });

                dispatch({
                  type: actionTypes.SET_ELSE_RESPONSE_ALERT,
                  payload: {
                    state: true,
                    alertTitle: 'Touch ID',
                    alertText: response2.data?.data?.message
                      ? response2.data.data.message
                      : response2.data.responseDescription,
                  },
                });
              }
            })
            .catch((error2) => {
              let message = '';
              if (!error2.status) {
                message = Message.networkErrorMessage;
              } else {
                message = String(error2);
              }
              dispatch({
                type: actionTypes.SET_ELSE_RESPONSE_ALERT,
                payload: {
                  state: true,
                  alertTitle: '',
                  alertText: message,
                },
              });
            });
        } else {
          if (response1.headers['x-auth-next-token']) {
            dispatch({
              type: actionTypes.SET_TOKEN,
              payload: response1.headers['x-auth-next-token'],
            });
          }

          dispatch({
            type: actionTypes.SET_LOADER,
            payload: false,
          });

          dispatch({
            type: actionTypes.SET_ELSE_RESPONSE_ALERT,
            payload: {
              state: true,
              alertTitle: 'Device Verification',
              alertText: response1.data?.data?.message
                ? response1.data.data.message
                : response1.data.responseDescription,
            },
          });
        }
      })
      .catch((error1) => {
        dispatch({
          type: actionTypes.SET_LOADER,
          payload: false,
        });
        let message = '';
        if (!error1.status) {
          // network err
          message = Message.networkErrorMessage;
        } else {
          message = String(error1);
        }
        dispatch({
          type: actionTypes.SET_ELSE_RESPONSE_ALERT,
          payload: {
            state: true,
            alertTitle: '',
            alertText: message,
          },
        });
      });
  };

// ***** ENDS FINGERPRINT REGISTER *****

export const storeFingerPrint2 =
  (
    userName,
    password,
    fcmToken,
    currentLatitude,
    currentLongitude,
    navigation,
    triggerAgain,
  ) =>
  async (dispatch) => {
    logs.log('AMeer............');
    const credentials = await Keychain.getGenericPassword();
    let parsedCredential;
    if (credentials) {
      parsedCredential = JSON.parse(credentials.password);
    } else {
      parsedCredential = {};
    }
    dispatch({
      type: actionTypes.SET_LOADER,
      payload: true,
    });
    dispatch({
      type: actionTypes.SET_CURRENT_NAVIGATION,
      payload: navigation,
    });
    dispatch({
      type: actionTypes.SET_USER_SIGNED_IN,
      payload: userName,
    });
    setTimeout(function () {
      TouchID.isSupported(optionalConfigObject)
        .then(async (status) => {
          if (status) {
            logs.log('AMeer............22');

            // dispatch({
            //   type: actionTypes.SET_LOADER,
            //   payload: false,
            // });

            let epochTimeSeconds = Math.round(
              new Date().getTime() / 1000,
            ).toString();
            let payload = epochTimeSeconds + 'some message';
            // GGGGG
            logs.log('AMerr......5payload', payload);
            ReactNativeBiometrics.createKeys('Confirm fingerprint')
              .then(async (createKeys) => {
                logs.log('storing Finger Print', createKeys);
                dispatch({
                  type: actionTypes.SET_LOADER,
                  payload: false,
                });
                await ReactNativeBiometrics.createSignature({
                  promptMessage: 'Place Finger on Scanner', // 'Touch ID',
                  payload: payload,
                })
                  .then((resultObject) => {
                    const {success, signature} = resultObject;
                    logs.log('resultObject....Amerr', resultObject);
                    if (success) {
                      dispatch({
                        type: actionTypes.SET_LOADER,
                        payload: true,
                      });

                      dispatch(setKeyChainObject({fingerPrintEnabled: true}));
                      logs.logRequest(
                        `${Config.base_url.UAT_URL}${
                          Config.method.authenticate
                        },
                        {},
                        {
                          headers: {
                            'X-Device-Token': ${fcmToken},
                            'X-Auth-Password': ${password},
                            'X-Auth-Username': ${userName},
                            IS_FP: false,
                            'X-Device-Type': ${
                              Platform.OS === 'android' ? 'android' : 'ios'
                            },
                            'X-Device-ID': ${DeviceInfo.getUniqueId()},
                            'X-Device-Version': ${deviceVersionString},
                            'Is-Rooted': ${appInfo.isJailBroken},
                            'Make-Model': ${appInfo.deviceName},
                            latitude: ${currentLatitude},
                            longitude: ${currentLongitude},
                            'X-Player-ID': ${
                              store.getState().reducers.userObject.PlayerId
                            },
                          },
                        },`,
                      );

                      axios
                        .post(
                          `${Config.base_url.UAT_URL}${Config.method.authenticate}`,
                          {},
                          {
                            headers: {
                              'X-Device-Token': fcmToken,
                              'X-Auth-Password': password,
                              'X-Auth-Username': userName,
                              IS_FP: false,
                              'X-Device-Type':
                                Platform.OS === 'android' ? 'android' : 'ios',
                              'X-Device-ID': DeviceInfo.getUniqueId(),
                              'X-Device-Version': deviceVersionString,
                              'Is-Rooted': appInfo.isJailBroken,
                              'Make-Model': appInfo.deviceName,
                              latitude: currentLatitude,
                              longitude: currentLongitude,
                              'X-Player-ID':
                                store.getState().reducers.userObject.PlayerId,
                            },
                          },
                        )
                        .then((response1) => {
                          logs.logResponse(response1.data);
                          if (
                            response1.status === 200 &&
                            response1.data.responseCode === '00'
                          ) {
                            logs.log('AMeer............1w1');
                            dispatch(
                              updateKeyChainObject({
                                userInfoObject: response1.data.data.details,
                              }),
                            );
                            dispatch({
                              type: actionTypes.SET_TOKEN,
                              payload: response1.headers['x-auth-next-token'],
                            });
                            dispatch({
                              type: actionTypes.SET_USER_OBJECT,
                              payload: {
                                ...store.getState().reducers.userObject,
                                customerLevel:
                                  response1.data?.data?.details?.customerlevel,
                                customerEmail:
                                  response1.data?.data?.details?.email,
                                customerMobile:
                                  response1.data?.data?.details?.mobile,
                              },
                            });
                            logs.log('AMeer............1198999');
                            axios
                              .post(
                                `${Config.base_url.UAT_URL}${Config.method.my}/${Config.method.fingerprint}/${Config.endpoint.changeStatus}`,
                                {
                                  deviceId: DeviceInfo.getUniqueId(),
                                  enable: true,
                                  fpToken: `${
                                    parsedCredential.fpToken
                                      ? parsedCredential.fpToken
                                      : '00000000'
                                  }`,
                                  userName: userName,
                                },
                                {
                                  headers: {
                                    'X-Auth-Token': response1.data?.data?.token,
                                  },
                                },
                              )
                              .then((response2) => {
                                if (
                                  response2.status === 200 &&
                                  response2.data.responseCode === '00'
                                ) {
                                  dispatch({
                                    type: actionTypes.SET_TOKEN,
                                    payload:
                                      response2.headers['x-auth-next-token'],
                                  });

                                  dispatch({
                                    type: actionTypes.SET_USER_SIGNED_IN,
                                    payload: userName,
                                  });
                                  dispatch({
                                    type: actionTypes.SET_LOGIN_RESPONSE,
                                    payload: response1.data.data,
                                  });

                                  dispatch(
                                    setKeyChainObject({
                                      userName: userName,
                                      fpToken: response2.data?.data.fpToken,
                                      fingerPrintEnabled: true,
                                    }),
                                  );
                                  dispatch({
                                    type: actionTypes.SET_FINGER_PRINT_STATE,
                                    payload: true,
                                  });
                                  if (response1.data.data.details.deviceExist) {
                                    navigation.dispatch(
                                      CommonActions.reset({
                                        index: 0,
                                        routes: [{name: 'Home'}],
                                      }),
                                    );
                                  } else {
                                    navigation.navigate('Login_Otp', {
                                      data: userName,
                                    });

                                    global.showToast.show(
                                      I18n[
                                        'OTP has been sent to Your Email and SMS'
                                      ],
                                      1000,
                                    );
                                  }
                                  dispatch({
                                    type: actionTypes.SET_LOADER,
                                    payload: false,
                                  });
                                } else if (
                                  response2.data.responseCode === '6613'
                                ) {
                                  dispatch({
                                    type: actionTypes.SET_LOADER,
                                    payload: false,
                                  });

                                  dispatch({
                                    type: actionTypes.SET_ELSE_RESPONSE_ALERT,
                                    payload: {
                                      state: true,
                                      alertTitle: 'Touch ID',
                                      alertText: response2.data?.data?.message
                                        ? response2.data.data.message
                                        : response2.data.responseDescription,
                                      onPress: () => {
                                        navigation.dispatch(
                                          CommonActions.reset({
                                            index: 0,
                                            routes: [{name: 'Login'}],
                                          }),
                                        );
                                      },
                                    },
                                  });
                                } else {
                                  if (response2.headers['x-auth-next-token']) {
                                    dispatch({
                                      type: actionTypes.SET_TOKEN,
                                      payload:
                                        response2.headers['x-auth-next-token'],
                                    });
                                  }
                                  if (sessionControl(response2)) {
                                    navigation.dispatch(
                                      CommonActions.reset({
                                        index: 0,
                                        routes: [{name: 'Login'}],
                                      }),
                                    );
                                    dispatch({
                                      type: actionTypes.CLEAR_APP_DATA,
                                    });
                                  }

                                  dispatch({
                                    type: actionTypes.SET_LOADER,
                                    payload: false,
                                  });

                                  dispatch({
                                    type: actionTypes.SET_ELSE_RESPONSE_ALERT,
                                    payload: {
                                      state: true,
                                      alertTitle: 'Touch ID',
                                      alertText: response2.data?.data?.message
                                        ? response2.data.data.message
                                        : response2.data.responseDescription,
                                    },
                                  });
                                }
                              })
                              .catch((error2) => {});
                          } else {
                            logs.log('AMeer............1199');
                            if (response1.headers['x-auth-next-token']) {
                              dispatch({
                                type: actionTypes.SET_TOKEN,
                                payload: response1.headers['x-auth-next-token'],
                              });
                            }
                            dispatch({
                              type: actionTypes.SET_LOADER,
                              payload: false,
                            });
                            if (sessionControl(response1)) {
                              navigation.dispatch(
                                CommonActions.reset({
                                  index: 0,
                                  routes: [{name: 'Login'}],
                                }),
                              );
                              dispatch({
                                type: actionTypes.CLEAR_APP_DATA,
                              });
                            }

                            dispatch({
                              type: actionTypes.SET_LOADER,
                              payload: false,
                            });

                            dispatch({
                              type: actionTypes.SET_ELSE_RESPONSE_ALERT,
                              payload: {
                                state: true,
                                alertTitle: 'Touch ID',
                                alertText: response1.data?.data?.message
                                  ? response1.data.data.message
                                  : response1.data.responseDescription,
                              },
                            });
                          }
                        })
                        .catch((error1) => {
                          logs.log('--------->', error1);
                          dispatch({
                            type: actionTypes.SET_LOADER,
                            payload: false,
                          });
                          let message = '';
                          if (!error1.status) {
                            // network err
                            message = Message.networkErrorMessage;
                          } else {
                            message = String(error1);
                          }
                          dispatch({
                            type: actionTypes.SET_ELSE_RESPONSE_ALERT,
                            payload: {
                              state: true,
                              alertTitle: '',
                              alertText: message,
                            },
                          });
                        });
                    } else {
                      logs.log('in else cond of creating signature');
                    }
                  })
                  .catch((error) => {
                    logs.log('error for trigger again ', error);
                    ReactNativeBiometrics.createKeys('Confirm fingerprint')
                      .then((resultObject) => {
                        const {publicKey} = resultObject;
                        if (triggerAgain) {
                          triggerAgain();
                        } else {
                          dispatch({
                            type: actionTypes.SET_LOADER,
                            payload: false,
                          });
                        }
                      })
                      .catch((error3) => {
                        setTimeout(() => {
                          dispatch(
                            setAppAlert(
                              'Enabling Face/Touch ID allows you quick and secure access to your account.',
                              'Permission',
                              navigation,
                              () => {
                                Linking.openSettings();
                              },
                            ),
                          );
                        }, 500);
                      });
                  });
              })
              .catch((error2) => {
                setTimeout(() => {
                  dispatch(
                    setAppAlert(
                      'Enabling Face/Touch ID allows you quick and secure access to your account.',
                      'Permission',
                      navigation,
                      () => {
                        Linking.openSettings();
                      },
                    ),
                  );
                }, 500);
              });
          } else {
            logs.log('--=-=-=--=-=-=>');
          }
        })
        .catch((error) => {
          logs.log('8934712974982374');
          dispatch({
            type: actionTypes.SET_LOADER,
            payload: false,
          });
          let errorCode = Platform.OS == 'ios' ? error.name : error.code;
          if (
            errorCode === 'LAErrorTouchIDNotEnrolled' ||
            errorCode === 'NOT_AVAILABLE' ||
            errorCode === 'NOT_ENROLLED'
          ) {
            let fingerprintLableForOS =
              Platform.OS == 'ios' ? 'Touch ID' : 'Fingerprint';
            // dispatch(
            //   setAppAlert(
            //     `Please note ${fingerprintLableForOS} has not been enabled for this device. To use this feature, please enable ${fingerprintLableForOS} in your device settings.`,
            //     'NBP',
            //   ),
            // );
            dispatch({
              type: actionTypes.SET_ELSE_RESPONSE_ALERT,
              payload: {
                state: true,
                alertTitle: 'NBP Digital',
                alertText: `Please note ${fingerprintLableForOS} has not been enabled for this device. To use this feature, please enable ${fingerprintLableForOS} in your device settings.`,
              },
            });
          } else {
            setTimeout(() => {
              dispatch(
                setAppAlert(
                  'Enabling Face/Touch ID allows you quick and secure access to your account.',
                  'Permission',
                  navigation,
                  () => {
                    Linking.openSettings();
                  },
                ),
              );
            }, 500);
          }
          //
        });
    }, 100);
  };

//****** TRIAL FINGERPRINT REGISTER ******/
export const storeFingerPrint =
  (
    userName,
    password,
    fcmToken,
    currentLatitude,
    currentLongitude,
    navigation,
    triggerAgain,
  ) =>
  async (dispatch) => {
    logs.log('AMeer............');
    const credentials = await Keychain.getGenericPassword();
    let parsedCredential;
    if (credentials) {
      parsedCredential = JSON.parse(credentials.password);
    } else {
      parsedCredential = {};
    }
    dispatch({
      type: actionTypes.SET_LOADER,
      payload: true,
    });
    dispatch({
      type: actionTypes.SET_CURRENT_NAVIGATION,
      payload: navigation,
    });
    dispatch({
      type: actionTypes.SET_USER_SIGNED_IN,
      payload: userName,
    });

    logs.logRequest(
      `${Config.base_url.UAT_URL}${Config.method.authenticate},
      {},
      {
        headers: {
          'X-Device-Token': ${fcmToken},
          'X-Auth-Password': ${password},
          'X-Auth-Username': ${userName},
          IS_FP: false,
          'X-Device-Type': ${Platform.OS === 'android' ? 'android' : 'ios'},
          'X-Device-ID': ${DeviceInfo.getUniqueId()},
          'X-Device-Version': ${deviceVersionString},
          'Is-Rooted': ${appInfo.isJailBroken},
          'Make-Model': ${appInfo.deviceName},
          latitude: ${currentLatitude},
          longitude: ${currentLongitude},
          'X-Player-ID': ${store.getState().reducers.userObject.PlayerId},
        },
      },`,
    );

    axios
      .post(
        `${Config.base_url.UAT_URL}${Config.method.authenticate}`,
        {},
        {
          headers: {
            'X-Device-Token': fcmToken,
            'X-Auth-Password': password,
            'X-Auth-Username': userName,
            IS_FP: false,
            'X-Device-Type': Platform.OS === 'android' ? 'android' : 'ios',
            'X-Device-ID': DeviceInfo.getUniqueId(),
            'X-Device-Version': deviceVersionString,
            'Is-Rooted': appInfo.isJailBroken,
            'Make-Model': appInfo.deviceName,
            latitude: currentLatitude,
            longitude: currentLongitude,
            'X-Player-ID': store.getState().reducers.userObject.PlayerId,
          },
        },
      )
      .then((response1) => {
        logs.logResponse(response1.data);
        if (response1.status === 200 && response1.data.responseCode === '00') {
          logs.log('AMeer............1w1');
          dispatch(
            updateKeyChainObject({
              userInfoObject: response1.data.data.details,
            }),
          );
          dispatch({
            type: actionTypes.SET_TOKEN,
            payload: response1.headers['x-auth-next-token'],
          });
          dispatch({
            type: actionTypes.SET_USER_OBJECT,
            payload: {
              ...store.getState().reducers.userObject,
              customerLevel: response1.data?.data?.details?.customerlevel,
              customerEmail: response1.data?.data?.details?.email,
              customerMobile: response1.data?.data?.details?.mobile,
            },
          });
          logs.log('AMeer............1198999');
        } else {
          logs.log('AMeer............1199');
          if (response1.headers['x-auth-next-token']) {
            dispatch({
              type: actionTypes.SET_TOKEN,
              payload: response1.headers['x-auth-next-token'],
            });
          }
          dispatch({
            type: actionTypes.SET_LOADER,
            payload: false,
          });
          if (sessionControl(response1)) {
            navigation.dispatch(
              CommonActions.reset({
                index: 0,
                routes: [{name: 'Login'}],
              }),
            );
            dispatch({
              type: actionTypes.CLEAR_APP_DATA,
            });
          }

          dispatch({
            type: actionTypes.SET_LOADER,
            payload: false,
          });

          dispatch({
            type: actionTypes.SET_ELSE_RESPONSE_ALERT,
            payload: {
              state: true,
              alertTitle: 'Touch ID',
              alertText: response1.data?.data?.message
                ? response1.data.data.message
                : response1.data.responseDescription,
            },
          });
        }
      })
      .catch((error1) => {
        logs.log('--------->', error1);
        dispatch({
          type: actionTypes.SET_LOADER,
          payload: false,
        });
        let message = '';
        if (!error1.status) {
          // network err
          message = Message.networkErrorMessage;
        } else {
          message = String(error1);
        }
        dispatch({
          type: actionTypes.SET_ELSE_RESPONSE_ALERT,
          payload: {
            state: true,
            alertTitle: '',
            alertText: message,
          },
        });
      });
  };
//****** ENDS TRIAL FINGERPRINT REGISTER ******/

// ***** INTERNAL FINGERPRINT SIGNIN ***** //

export const enableFingerPrint =
  (userName, navigation, triggerAgain) => async (dispatch) => {
    dispatch({
      type: actionTypes.SET_LOADER,
      payload: true,
    });
    dispatch({
      type: actionTypes.SET_CURRENT_NAVIGATION,
      payload: navigation,
    });
    logs.logRequest(
      `${Config.base_url.UAT_URL}${Config.method.my}/${
        Config.method.fingerprint
      }/${Config.endpoint.changeStatus},
      {
        deviceId: ${DeviceInfo.getUniqueId()},
        enable: true,
        fpToken: ${Platform.OS === 'android' ? 'android' : 'ios'}, 
        userName: ${store.getState().reducers.userSignedIn},
      },
      {
        headers: {'X-Auth-Token': ${store.getState().reducers.token}},
      },`,
    );
    axios
      .post(
        `${Config.base_url.UAT_URL}${Config.method.my}/${Config.method.fingerprint}/${Config.endpoint.changeStatus}`,
        {
          deviceId: DeviceInfo.getUniqueId(),
          enable: triggerAgain,
          fpToken: Platform.OS === 'android' ? 'android' : 'ios', //"android",
          userName: store.getState().reducers.userSignedIn,
        },
        {
          headers: {'X-Auth-Token': store.getState().reducers.token},
        },
      )
      .then((response) => {
        logs.logResponse(response.data);
        if (response.status === 200 && response.data.responseCode === '00') {
          dispatch({
            type: actionTypes.SET_TOKEN,
            payload: response?.headers?.['x-auth-next-token'],
          });
          dispatch({
            type: actionTypes.SET_LOADER,
            payload: false,
          });
          TouchID.isSupported(optionalConfigObject)
            .then(async (status) => {
              if (status) {
                dispatch({
                  type: actionTypes.SET_LOADER,
                  payload: false,
                });
                // TouchID.authenticate(
                //   'Place your finger on scanner',
                //   optionalConfigObject,
                // )
                ReactNativeBiometrics.createKeys('Confirm fingerprint')
                  .then(async (resultObject) => {
                    const {publicKey} = resultObject;

                    let epochTimeSeconds = Math.round(
                      new Date().getTime() / 1000,
                    ).toString();
                    let payload = epochTimeSeconds + 'some message';
                    await ReactNativeBiometrics.createSignature({
                      promptMessage: 'Place Finger on Scanner', // 'Touch ID',
                      payload: payload,
                    })
                      .then((resultObject) => {
                        const {success, signature} = resultObject;

                        if (success) {
                          dispatch({
                            type: actionTypes.SET_LOADER,
                            payload: false,
                          });

                          dispatch(
                            setKeyChainObject({
                              userName: store.getState().reducers.userSignedIn,
                              fpToken: response.data.data.fpToken,
                              fingerPrintEnabled: true,
                            }),
                          );
                          dispatch({
                            type: actionTypes.SET_FINGER_PRINT_STATE,
                            payload: true,
                          });
                          setTimeout(() => {
                            dispatch(
                              setAppAlert(
                                `${
                                  touchIdSupport && Platform.OS == 'android'
                                    ? 'Touch ID'
                                    : isbioactive === 'touch' &&
                                      Platform.OS == 'ios'
                                    ? 'Touch ID'
                                    : isbioactive == 'face' &&
                                      Platform.OS == 'ios'
                                    ? 'Face ID'
                                    : isbioactive === 'touch'
                                    ? 'Touch ID'
                                    : null
                                } is now enabled.`,
                                '',
                                navigation,
                                () => {
                                  navigation.navigate('Home');
                                },
                              ),
                            );
                          }, 500);
                        } else {
                          dispatch({
                            type: actionTypes.SET_LOADER,
                            payload: false,
                          });
                        }
                      })
                      .catch((error) => {
                        dispatch({
                          type: actionTypes.SET_LOADER,
                          payload: false,
                        });
                      });

                    // sendPublicKeyToServer(publicKey);
                  })
                  .catch((CatchforCreatingKeys) => {
                    logs.log(CatchforCreatingKeys);
                  });
              }
            })
            .catch((error2) => {
              dispatch({
                type: actionTypes.SET_LOADER,
                payload: false,
              });
              let errorCode = Platform.OS == 'ios' ? error2.name : error2.code;
              if (
                errorCode === 'LAErrorTouchIDNotEnrolled' ||
                errorCode === 'NOT_AVAILABLE' ||
                errorCode === 'NOT_ENROLLED'
              ) {
                let fingerprintLableForOS =
                  Platform.OS == 'ios' ? 'Touch ID' : 'Fingerprint';
                // dispatch(
                //   setAppAlert(
                //     `Please note ${fingerprintLableForOS} has not been enabled for this device. To use this feature, please enable ${fingerprintLableForOS} in your device settings.`,
                //     'NBP',
                //   ),
                // );
                dispatch({
                  type: actionTypes.SET_ELSE_RESPONSE_ALERT,
                  payload: {
                    state: true,
                    alertTitle: 'NBP Digital',
                    alertText: `Please note ${fingerprintLableForOS} has not been enabled for this device. To use this feature, please enable ${fingerprintLableForOS} in your device settings.`,
                  },
                });
              } else {
              }
              //
            });
        } else {
          if (response?.headers?.['x-auth-next-token']) {
            dispatch({
              type: actionTypes.SET_TOKEN,
              payload: response?.headers?.['x-auth-next-token'],
            });
          }
          if (sessionControl(response)) {
            navigation.dispatch(
              CommonActions.reset({
                index: 0,
                routes: [{name: 'Login'}],
              }),
            );
            dispatch({
              type: actionTypes.CLEAR_APP_DATA,
            });
          }

          dispatch({
            type: actionTypes.SET_LOADER,
            payload: false,
          });

          dispatch({
            type: actionTypes.SET_ELSE_RESPONSE_ALERT,
            payload: {
              state: true,
              alertTitle: 'Device Verification',
              alertText: response.data?.data?.message
                ? response.data.data.message
                : response.data.responseDescription,
            },
          });
        }
      })
      .catch((error1) => {
        dispatch({
          type: actionTypes.SET_LOADER,
          payload: false,
        });
        let message = '';
        if (!error1.status) {
          // network err
          message = Message.networkErrorMessage;
        } else {
          message = String(error1);
        }
        dispatch({
          type: actionTypes.SET_ELSE_RESPONSE_ALERT,
          payload: {
            state: true,
            alertTitle: '',
            alertText: message,
          },
        });
      });
  };

// ***** ENDS INTERNAL FINGERPRINT SIGNIN ***** //

// ***** GET FINGERPRINT SECURITY STATE *****

export const getFingerPrintState = () => async (dispatch) => {
  // try {
  let checkFirstEverInstallForKeychainClear = await AsyncStorage.getItem(
    'checkFirstEverInstallForKeychainClear',
  );
  // } catch (errorStringAsync) {
  //   logs.log(errorStringAsync, 'rror in gettingFingerPrint in Async');
  // }

  let notFirstInstall = JSON.parse(checkFirstEverInstallForKeychainClear);
  logs.log(`notFirstInstall is : ${notFirstInstall}`);
  if (notFirstInstall) {
    const credentials = await Keychain.getGenericPassword();
    let parsedCredential;
    if (credentials) {
      parsedCredential = JSON.parse(credentials.password);
    } else {
      parsedCredential = {};
    }

    if (parsedCredential && parsedCredential.fingerPrintEnabled === true) {
      dispatch({
        type: actionTypes.SET_FINGER_PRINT_STATE,
        payload: true,
      });
    } else {
      dispatch({
        type: actionTypes.SET_FINGER_PRINT_STATE,
        payload: false,
      });
    }
  } else {
    dispatch({
      type: actionTypes.SET_FINGER_PRINT_STATE,
      payload: false,
    });
    // if (Platform.OS === 'ios') {
    try {
      await AsyncStorage.setItem(
        'checkFirstEverInstallForKeychainClear',
        JSON.stringify(true),
      );
    } catch (errorSettingASync) {
      logs.log('error in setting the Async', errorSettingASync);
    }

    // }

    await Keychain.setGenericPassword('keyChainObject', JSON.stringify({}));
    dispatch({
      type: actionTypes.SET_KEYCHAIN_OBJECT,
      payload: {},
    });
  }
};
// ***** ENDS GET FINGERPRINT SECURITY STATE *****

// ***** CHANGE FINGERPTING REDUX STATE ***** //
export const changeFingerPrintReduxState = (state) => async (dispatch) => {
  dispatch({
    type: actionTypes.SET_FINGER_PRINT_STATE,
    payload: state,
  });
};
// ***** ENDS CHANGE FINGERPTING REDUX STATE ***** //

// ***** SET FINGERPRINT SECURITY STATE *****

export const setFingerPrintState =
  (state, navigation, fromUpgrade, deviceBindingSuccess) =>
  async (dispatch) => {
    dispatch({
      type: actionTypes.SET_LOADER,
      payload: true,
    });
    const credentials = await Keychain.getGenericPassword();
    let parsedCredential;
    if (credentials) {
      parsedCredential = JSON.parse(credentials.password);
    } else {
      parsedCredential = {};
    }
    logs.log(
      'parsedCredential.userName && parsedCredential.fpToken : ',
      parsedCredential.userName && parsedCredential.fpToken,
      'parsedCredential.userName : ',
      parsedCredential.userName,
      'parsedCredential.fpToken : ',
      parsedCredential.fpToken,
    );
    if (parsedCredential.userName && parsedCredential.fpToken) {
      logs.log(
        'parsedCredential.userName && parsedCredential.fpToken Success : ',
        parsedCredential.userName && parsedCredential.fpToken,
      );
      axios
        .post(
          `${Config.base_url.UAT_URL}${Config.method.my}/${Config.method.fingerprint}/${Config.endpoint.changeStatus}`,
          {
            deviceId: DeviceInfo.getUniqueId(),
            enable: state,
            fpToken: parsedCredential.fpToken,
            userName: parsedCredential.userName,
          },
        )
        .then((response1) => {
          if (
            response1.status === 200 &&
            (response1.data.responseCode === '99' ||
              response1.data.responseCode === '00')
          ) {
            dispatch({
              type: actionTypes.SET_FINGER_PRINT_STATE,
              payload: state,
            });
            dispatch({
              type: actionTypes.SET_LOADER,
              payload: false,
            });
            let removableObject = {
              ...store.getState().reducers.keychainObject,
              fingerPrintEnabled: false,
            };
            delete removableObject['userName'];
            delete removableObject['fpToken'];
            dispatch(updateWithDeletedKeychainObject(removableObject));
            if (deviceBindingSuccess) {
              deviceBindingSuccess();
            } else {
              dispatch({
                type: actionTypes.SET_CURRENT_NAVIGATION,
                payload: navigation,
              });
              setTimeout(() => {
                dispatch(
                  fromUpgrade
                    ? {
                        type: actionTypes.SET_LOADER,
                        payload: false,
                      }
                    : {
                        type: actionTypes.SET_ELSE_RESPONSE_ALERT,
                        payload: {
                          state: true,
                          alertTitle: '',
                          alertText: `${
                            touchIdSupport && Platform.OS == 'android'
                              ? 'Touch ID'
                              : isbioactive === 'touch' && Platform.OS == 'ios'
                              ? 'Touch ID'
                              : isbioactive == 'face' && Platform.OS == 'ios'
                              ? 'Face ID'
                              : isbioactive === 'touch'
                              ? 'Touch ID'
                              : null
                          } is now disabled.`,
                        },
                      },
                );
              }, 500);
            }
          } else {
            if (response1.headers['x-auth-next-token']) {
              dispatch({
                type: actionTypes.SET_TOKEN,
                payload: response1.headers['x-auth-next-token'],
              });
            }
            if (sessionControl(response1)) {
              navigation.dispatch(
                CommonActions.reset({
                  index: 0,
                  routes: [{name: 'Login'}],
                }),
              );
              dispatch({
                type: actionTypes.CLEAR_APP_DATA,
              });
            }
            dispatch({
              type: actionTypes.SET_LOADER,
              payload: false,
            });
            dispatch({
              type: actionTypes.SET_ELSE_RESPONSE_ALERT,
              payload: {
                state: true,
                alertTitle: 'Device Verification',
                alertText: response1.data?.data?.message
                  ? response1.data.data.message
                  : response1.data.responseDescription,
              },
            });
          }
        })
        .catch((error1) => {
          dispatch({
            type: actionTypes.SET_LOADER,
            payload: false,
          });
          let message = '';
          if (!error1.status) {
            // network err
            message = Message.networkErrorMessage;
          } else {
            message = String(error1);
          }
          dispatch({
            type: actionTypes.SET_ELSE_RESPONSE_ALERT,
            payload: {
              state: true,
              alertTitle: '',
              alertText: message,
            },
          });
        });
    } else {
      logs.log(
        'parsedCredential.userName && parsedCredential.fpToken dropped here',
      );
      dispatch({
        type: actionTypes.SET_FINGER_PRINT_STATE,
        payload: false,
      });
      dispatch({
        type: actionTypes.SET_LOADER,
        payload: false,
      });
      // if (deviceBindingSuccess) {
      //   deviceBindingSuccess();
      // }
    }
  };

// ENDS SET FINGEPRINT SECURITY STATE *****

// ***** ASK FINGERPRINT CUSTOM ALERT *****

export const setAskForFingerPrintState = (state) => async (dispatch) => {
  dispatch({
    type: actionTypes.SET_ASK_FOR_FINGERPRINT,
    payload: state,
  });
};

// ***** ENDS ASK FINGERPRINT CUSTOM ALERT *****

// ***** GENERATE DEVICE FCM *****

export const getFcm = () => async (dispatch) => {
  await messaging().requestPermission();
  const authStatus = await messaging().requestPermission();
  const enabled =
    authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
    authStatus === messaging.AuthorizationStatus.PROVISIONAL;
  if (enabled) {
    logs.log('1Status', authStatus);
  } else {
    logs.log('1else Status', authStatus);
  }

  messaging()
    .getToken()
    .then((token) => {
      logs.log(`fcm token generated is : ${token}`);
      dispatch({
        type: actionTypes.SET_FCM_TOKEN,
        payload: token,
      });
    })
    .catch((error) => {
      logs.log(`fcmtoken generation error : ${error}`);
    });
};

// ***** ENDS GENERATE DEVICE FCM *****

// ***** SIGNIN WITH FINGERPRINT *****

export const signInWithFingerPrint =
  (fcmToken, currentLatitude, currentLongitude, navigation) =>
  async (dispatch) => {
    logs.log('signInWithFingerPrint service triggered ');
    dispatch({
      type: actionTypes.SET_LOADER,
      payload: true,
    });
    const credentials = await Keychain.getGenericPassword();
    logs.log(`credentials are ${JSON.stringify(credentials)}`);
    let parsedCredential;
    if (credentials) {
      parsedCredential = JSON.parse(credentials.password);
    } else {
      parsedCredential = {};
    }
    logs.log(`parsed Credentials are : ${JSON.stringify(parsedCredential)}`);

    if (parsedCredential.userName && parsedCredential.fpToken) {
      logs.log(`
        parsedCredential.userName && parsedCredential.fpToken ,
        ${parsedCredential.userName},
        ${parsedCredential.fpToken},
     `);
      logs.logRequest(
        `${Config.base_url.UAT_URL}${Config.method.authenticate},
        {},
        {
          headers: {
            'X-Auth-Username': ${parsedCredential.userName},
            'X-Auth-Password': ${parsedCredential.fpToken},
            'X-Device-Token': ${fcmToken},
            IS_FP: true,
            'X-Device-Type': ${Platform.OS === 'android' ? 'android' : 'ios'},
            'X-Device-ID': ${DeviceInfo.getUniqueId()},
            'X-Device-Version': ${deviceVersionString},
            'Is-Rooted': ${appInfo.isJailBroken},
            'Make-Model': ${appInfo.deviceName},
            latitude: ${currentLatitude},
              longitude: ${currentLongitude},
              'X-Player-ID': ${store.getState().reducers.userObject.PlayerId},
          },
        },`,
      );

      axios
        .post(
          `${Config.base_url.UAT_URL}${Config.method.authenticate}`,
          {},
          {
            headers: {
              'X-Auth-Username': parsedCredential.userName,
              'X-Auth-Password': parsedCredential.fpToken,
              'X-Device-Token': fcmToken,
              IS_FP: true,
              'X-Device-Type': Platform.OS === 'android' ? 'android' : 'ios',
              'X-Device-ID': DeviceInfo.getUniqueId(),
              'X-Device-Version': deviceVersionString,
              'Is-Rooted': appInfo.isJailBroken,
              'Make-Model': appInfo.deviceName,
              latitude: currentLatitude,
              longitude: currentLongitude,
              'X-Player-ID': store.getState().reducers.userObject.PlayerId,
            },
          },
        )
        .then((response1) => {
          logs.logResponse('asdasdasdagsfdhas=====>', response1.data);
          if (
            response1.status === 200 &&
            response1.data.responseCode === '00'
          ) {
            dispatch(
              updateKeyChainObject({
                userInfoObject: response1.data.data.details,
              }),
            );
            logs.log('sdasdasdsd', response1.data.data.details);
            dispatch({
              type: actionTypes.SET_TOKEN,
              payload: response1.data.data.token,
            });
            dispatch({
              type: actionTypes.SET_USER_OBJECT,
              payload: {
                ...store.getState().reducers.userObject,
                customerLevel: response1.data?.data?.details?.customerlevel,
                customerEmail: response1.data?.data?.details?.email,
                customerMobile: response1.data?.data?.details?.mobile,
              },
            });
            dispatch({
              type: actionTypes.SET_USER_SIGNED_IN,
              payload: parsedCredential.userName,
            });
            dispatch({
              type: actionTypes.SET_LOGIN_RESPONSE,
              payload: response1.data.data,
            });
            dispatch({
              type: actionTypes.SET_LOADER,
              payload: false,
            });
            if (response1.data.data.details.deviceExist) {
              navigation.dispatch(
                CommonActions.reset({
                  index: 0,
                  routes: [{name: 'Home'}],
                }),
              );
              dispatch(setUserSignedIn(parsedCredential.userName));
              dispatch({
                type: actionTypes.SET_USER_SIGNED_IN,
                payload: response1.data.data.details.username,
              });
            } else {
              navigation.navigate('Login_Otp', {
                data: response1.data.data.details.username,
              });
              global.showToast.show(
                I18n['OTP has been sent to Your Email and SMS'],
                1000,
              );
            }
          } else if (response1.data.responseCode === '613') {
            /////////////////////////////// hamza verify with waqas bhai

            let removableObject = {
              ...store.getState().reducers.keychainObject,
              fingerPrintEnabled: false,
            };
            delete removableObject['userName'];
            delete removableObject['fpToken'];
            dispatch(updateWithDeletedKeychainObject(removableObject));

            dispatch({
              type: actionTypes.SET_CURRENT_NAVIGATION,
              payload: navigation,
            });

            dispatch({
              type: actionTypes.SET_FINGER_PRINT_STATE,
              payload: false,
            });
            dispatch({
              type: actionTypes.SET_LOADER,
              payload: false,
            });

            //////////////////////////////////
          } else {
            if (response1.headers['x-auth-next-token']) {
              dispatch({
                type: actionTypes.SET_TOKEN,
                payload: response1.headers['x-auth-next-token'],
              });
            }
            if (sessionControl(response1)) {
              navigation.dispatch(
                CommonActions.reset({
                  index: 0,
                  routes: [{name: 'Login'}],
                }),
              );
              dispatch({
                type: actionTypes.CLEAR_APP_DATA,
              });
            }

            dispatch({
              type: actionTypes.SET_LOADER,
              payload: false,
            });

            dispatch({
              type: actionTypes.SET_ELSE_RESPONSE_ALERT,
              payload: {
                state: true,
                alertTitle: 'Device Verification',
                alertText: response1.data?.data?.message
                  ? response1.data.data.message
                  : response1.data.responseDescription,
              },
            });
          }
        })
        .catch((error1) => {
          logs.log(`error1 : ${error1}`);
          dispatch({type: actionTypes.SET_LOADER, payload: false});
          let message = '';
          if (!error1.status) {
            // network err
            message = Message.networkErrorMessage;
          } else {
            message = String(error1);
          }
          dispatch({
            type: actionTypes.SET_ELSE_RESPONSE_ALERT,
            payload: {
              state: true,
              alertTitle: '',
              alertText: message,
            },
          });
        });
    } else {
      logs.log('else else');
      dispatch({
        type: actionTypes.SET_LOADER,
        payload: false,
      });
      navigation.navigate('TouchID', {data: 'fromLogin'});
    }
  };

// ***** ENDS SIGNIN WITH FINGERPRINT *****

export const createSignature = async () => {
  let epochTimeSeconds = Math.round(new Date().getTime() / 1000).toString();
  let payload = epochTimeSeconds + 'some message';
  await ReactNativeBiometrics.createSignature({
    promptMessage: 'Place Finger on Scanner', // 'Touch ID',
    payload: payload,
  })
    .then((resultObject) => {
      const {success, signature} = resultObject;
      if (success) {
        // verifySignatureWithServer(signature, payload);
        return true;
      } else {
        return false;
      }
    })
    .catch((error) => {
      return false;
    });
};

// ***** RESET PASSWORD *****//

export const resetPassword =
  (navigation, newPassword, oldPassword, userName) => async (dispatch) => {
    dispatch({
      type: actionTypes.SET_LOADER,
      payload: true,
    });
    logs.logRequest(
      `${Config.base_url.UAT_URL}${Config.method.my}/${
        Config.endpoint.password
      },
      {
        newPassword: ${newPassword},
        oldPassword: ${oldPassword},
        username: ${userName},
      },
      {
        headers: {'X-Auth-Token': ${store.getState().reducers.token}},
      },`,
    );
    axios
      .post(
        `${Config.base_url.UAT_URL}${Config.method.my}/${Config.endpoint.password}`,
        {
          newPassword: newPassword,
          oldPassword: oldPassword,
          username: userName,
        },
        {
          headers: {'X-Auth-Token': store.getState().reducers.token},
        },
      )
      .then((response) => {
        logs.logResponse(response.data);
        if (response.status === 200 && response.data.responseCode === '00') {
          if (response?.headers?.['x-auth-next-token']) {
            dispatch({
              type: actionTypes.SET_TOKEN,
              payload: response?.headers?.['x-auth-next-token'],
            });
          }
          navigation.dispatch(
            CommonActions.reset({
              index: 0,
              routes: [{name: 'Login'}],
            }),
          );
          dispatch({
            type: actionTypes.SET_LOADER,
            payload: false,
          });
          dispatch({
            type: actionTypes.SET_ELSE_RESPONSE_ALERT,
            payload: {
              state: true,
              alertTitle: '',
              alertText: response.data.data.message,
            },
          });
        } else {
          if (response?.headers?.['x-auth-next-token']) {
            dispatch({
              type: actionTypes.SET_TOKEN,
              payload: response?.headers?.['x-auth-next-token'],
            });
          }
          if (sessionControl(response)) {
            navigation.dispatch(
              CommonActions.reset({
                index: 0,
                routes: [{name: 'Login'}],
              }),
            );
            dispatch({
              type: actionTypes.CLEAR_APP_DATA,
            });
          }

          dispatch({
            type: actionTypes.SET_LOADER,
            payload: false,
          });

          dispatch({
            type: actionTypes.SET_ELSE_RESPONSE_ALERT,
            payload: {
              state: true,
              alertTitle: 'Device Verification',
              alertText: response.data?.data?.message
                ? response.data.data.message
                : response.data.responseDescription,
            },
          });
        }
      })
      .catch((error1) => {
        dispatch({
          type: actionTypes.SET_LOADER,
          payload: false,
        });
        let message = '';
        if (!error1.status) {
          // network err
          message = Message.networkErrorMessage;
        } else {
          message = String(error1);
        }
        dispatch({
          type: actionTypes.SET_ELSE_RESPONSE_ALERT,
          payload: {
            state: true,
            alertTitle: '',
            alertText: message,
          },
        });
      });
  };

// ***** ENDS RESET PASSWORD *****//

// NEW RESET PASSWORD DEBIT CARD MANAGEMENT

export const resetNewPassword =
  (navigation, newPassword, oldPassword, userName) => async (dispatch) => {
    dispatch({
      type: actionTypes.SET_LOADER,
      payload: true,
    });
    logs.logRequest(
      `${Config.base_url.UAT_URL}${Config.method.my}/${
        Config.endpoint.newpassword
      },
      {
        newPassword: ${newPassword},
        oldPassword: ${oldPassword},
        username: ${userName},
      },
      {
        headers: {'X-Auth-Token': ${store.getState().reducers.token}},
      },`,
    );
    axios
      .post(
        `${Config.base_url.UAT_URL}${Config.method.my}/${Config.endpoint.newpassword}`,
        {
          newPassword: newPassword,
          oldPassword: oldPassword,
          username: userName,
        },
        {
          headers: {'X-Auth-Token': store.getState().reducers.token},
        },
      )
      .then((response) => {
        logs.logResponse(response.data);
        if (response.status === 200 && response.data.responseCode === '00') {
          if (response?.headers?.['x-auth-next-token']) {
            dispatch({
              type: actionTypes.SET_TOKEN,
              payload: response?.headers?.['x-auth-next-token'],
            });
          }
          navigation.dispatch(
            CommonActions.reset({
              index: 0,
              routes: [{name: 'Login'}],
            }),
          );
          dispatch({
            type: actionTypes.SET_LOADER,
            payload: false,
          });
          dispatch({
            type: actionTypes.SET_ELSE_RESPONSE_ALERT,
            payload: {
              state: true,
              alertTitle: '',
              alertText: response.data.data.message,
            },
          });
        } else {
          if (response?.headers?.['x-auth-next-token']) {
            dispatch({
              type: actionTypes.SET_TOKEN,
              payload: response?.headers?.['x-auth-next-token'],
            });
          }
          if (sessionControl(response)) {
            navigation.dispatch(
              CommonActions.reset({
                index: 0,
                routes: [{name: 'Login'}],
              }),
            );
            dispatch({
              type: actionTypes.CLEAR_APP_DATA,
            });
          }

          dispatch({
            type: actionTypes.SET_LOADER,
            payload: false,
          });

          dispatch({
            type: actionTypes.SET_ELSE_RESPONSE_ALERT,
            payload: {
              state: true,
              alertTitle: 'Device Verification',
              alertText: response.data?.data?.message
                ? response.data.data.message
                : response.data.responseDescription,
            },
          });
        }
      })
      .catch((error1) => {
        dispatch({
          type: actionTypes.SET_LOADER,
          payload: false,
        });
        let message = '';
        if (!error1.status) {
          // network err
          message = Message.networkErrorMessage;
        } else {
          message = String(error1);
        }
        dispatch({
          type: actionTypes.SET_ELSE_RESPONSE_ALERT,
          payload: {
            state: true,
            alertTitle: '',
            alertText: message,
          },
        });
      });
  };

// ENDS NEW RESET PASSWORD DEBIT CARD MANAGEMENT

// ***** MY ACCOUNT ADD ACCOUNT TITLE FETCH ***** //
export const addAccountTitleFetch =
  (cnic, titleFetchAccount, navigation) => async (dispatch) => {
    dispatch({
      type: actionTypes.SET_LOADER,
      payload: true,
    });

    axios
      .post(
        `${Config.base_url.UAT_URL}${Config.method.transfer}/${Config.endpoint.titlefetch}`,
        {
          amount: '1.00',
          benefiType: '1',
          cnic: cnic,
          fromAccount: '',
          imd: '979898',
          titleFetchAccount: titleFetchAccount,
        },
        {},
      )
      .then((response) => {
        if (response.status === 200 && response.data.responseCode === '00') {
          dispatch({
            type: actionTypes.SET_TOKEN,
            payload: response?.headers?.['x-auth-next-token'],
          });
          navigation.navigate('AddDetail', {data: {cnic, titleFetchAccount}});
          dispatch({
            type: actionTypes.SET_LOADER,
            payload: false,
          });
        } else {
          if (response?.headers?.['x-auth-next-token']) {
            dispatch({
              type: actionTypes.SET_TOKEN,
              payload: response?.headers?.['x-auth-next-token'],
            });
          }
          if (sessionControl(response)) {
            navigation.dispatch(
              CommonActions.reset({
                index: 0,
                routes: [{name: 'Login'}],
              }),
            );
            dispatch({
              type: actionTypes.CLEAR_APP_DATA,
            });
          }

          dispatch({
            type: actionTypes.SET_LOADER,
            payload: false,
          });

          dispatch({
            type: actionTypes.SET_ELSE_RESPONSE_ALERT,
            payload: {
              state: true,
              alertTitle: 'Add Account',
              alertText: response.data?.data?.message
                ? response.data.data.message
                : response.data.responseDescription,
            },
          });
        }
      })
      .catch((error) => {
        dispatch({
          type: actionTypes.SET_LOADER,
          payload: false,
        });
        let message = '';
        if (!error.status) {
          // network err
          message = Message.networkErrorMessage;
        } else {
          message = String(error);
        }
        dispatch({
          type: actionTypes.SET_ELSE_RESPONSE_ALERT,
          payload: {
            state: true,
            alertTitle: 'Add Account',
            alertText: message,
          },
        });
      });
  };
// ***** MY ACCOUNT ADD ACCOUNT TITLE FETCH ***** //

// ***** MY ACCOUNT ADD ACCOUNT ***** //
export const addAccountCreate =
  (atmPin, cardNumber, cnic) => async (dispatch) => {
    // {"atmPin":"1111","cardNumber":"6243860080061576","cnic":"4230146389023"}
    dispatch({
      type: actionTypes.SET_LOADER,
      payload: true,
    });
    logs.logRequest(
      `${Config.base_url.UAT_URL}${Config.method.my}/${Config.endpoint.forgetpassword}`,
      {
        atmPin: atmPin,
        cardNumber: cardNumber,
        cnic: cnic,
        ...appInfoObject_ForServices,
      },
      {
        headers: {'X-Auth-Token': store.getState().reducers.token},
      },
    );
    axios
      .post(
        `${Config.base_url.UAT_URL}${Config.method.my}/${Config.endpoint.forgetpassword}`,
        {
          atmPin: atmPin,
          cardNumber: cardNumber,
          cnic: cnic,
          ...appInfoObject_ForServices,
        },
        {
          headers: {'X-Auth-Token': store.getState().reducers.token},
        },
      )
      .then((response) => {
        logs.logResponse(response);
        if (response.status === 200 && response.data.responseCode === '00') {
          dispatch({
            type: actionTypes.SET_TOKEN,
            payload: response?.headers?.['x-auth-next-token'],
          });
          dispatch({
            type: actionTypes.SET_LOADER,
            payload: false,
          });
          dispatch({
            type: actionTypes.SET_ELSE_RESPONSE_ALERT,
            payload: {
              state: true,
              alertTitle: 'Add Account',
              alertText: 'Account added successfully.',
            },
          });
        } else {
          if (response?.headers?.['x-auth-next-token']) {
            dispatch({
              type: actionTypes.SET_TOKEN,
              payload: response?.headers?.['x-auth-next-token'],
            });
          }
          if (sessionControl(response)) {
            navigation.dispatch(
              CommonActions.reset({
                index: 0,
                routes: [{name: 'Login'}],
              }),
            );
            dispatch({
              type: actionTypes.CLEAR_APP_DATA,
            });
          }

          dispatch({
            type: actionTypes.SET_LOADER,
            payload: false,
          });

          dispatch({
            type: actionTypes.SET_ELSE_RESPONSE_ALERT,
            payload: {
              state: true,
              alertTitle: 'Add Account',
              alertText: response.data?.data?.message
                ? response.data.data.message
                : response.data.responseDescription,
            },
          });
        }
      })
      .catch((error) => {
        dispatch({
          type: actionTypes.SET_LOADER,
          payload: false,
        });
        let message = '';
        if (!error.status) {
          // network err
          message = Message.networkErrorMessage;
        } else {
          message = String(error);
        }
        dispatch({
          type: actionTypes.SET_ELSE_RESPONSE_ALERT,
          payload: {
            state: true,
            alertTitle: 'Add Account',
            alertText: message,
          },
        });
      });
  };
// ***** ENDS MY ACCOUNT ADD ACCOUNT ***** //

// ***** SET CURRENT FLOW ***** //
export const setCurrentFlow = (currentFlow) => async (dispatch) => {
  dispatch({
    type: actionTypes.SET_CURRENT_FLOW,
    payload: currentFlow,
  });
};
// ***** ENDS SET CURRENT FLOW ***** //

// ***** TRIGGER QR SCANNER ***** //

// export const triggerQrCodeScanner = () => async () => {
//   return (
//     <QRCodeScanner
//       onRead={(read) => {
//         Alert.alert('QR', read.data);
//       }}
//       flashMode={RNCamera.Constants.FlashMode.torch}
//       topContent={
//           Go to{' '}
//           on your computer and scan the QR code.
//         </Text>
//       }
//       bottomContent={
//         <TouchableOpacity style={globalStyling.buttonTouchable}>
//         </TouchableOpacity>
//       }
//     />
//   );
// };

// ***** ENDS TRIGGER QR SCANNER ***** //

// ***** QR SCANNER STATE ***** //

export const setQrScannerState = (state) => async (dispatch) => {
  dispatch({
    type: actionTypes.SET_QR_SCANNER_STATE,
    payload: state,
  });
};

// ***** ENDS QR SCANNER STATE ***** //

// ***** QR SCANNER RESPONSE ***** //

export const setQrScannerResponse = (response) => async (dispatch) => {
  dispatch({
    type: actionTypes.SET_QR_SCANNER_RESPONSE,
    payload: response,
  });
};

// ***** ENDS QR SCANNER RESPONSE ***** //

// ***** QR GENERATE STATE ***** //

export const setQrGenerateState = (state) => async (dispatch) => {
  dispatch({
    type: actionTypes.SET_QR_GENERATE_STATE,
    payload: state,
  });
};

// ***** ENDS QR GENERATE STATE ***** //

// ***** QR GENERATE VALUE ***** //

export const setQrGenerateResponse = (response) => async (dispatch) => {
  dispatch({
    type: actionTypes.SET_GENERATE_VALUE,
    payload: response,
  });
};

// ***** ENDS QR GENERATE VALUE ***** //

// ***** PTo M Parsing ***** //
const parsingSubTags = (tag, length, value) => {
  let additionalMessage28 = value;
  const additionalMessageParsed28 = [];
  while (additionalMessage28 != '') {
    const addTag28 = additionalMessage28.substring(0, 2);
    const addLength28 = parseInt(additionalMessage28.substring(2, 4));
    const addValue28 = additionalMessage28.substring(4, 4 + addLength28);
    additionalMessage28 = additionalMessage28.substring(
      4 + addLength28,
      additionalMessage28.length,
    );
    // console.log({
    //   tag: addTag28,
    //   length: addLength28,
    //   value: addValue28,
    // });
    additionalMessageParsed28.push({
      tag: addTag28,
      length: addLength28,
      value: addValue28,
    });
  }
  return {tag, length, value: additionalMessageParsed28};
};
export const ParsingP2M =
  (qrString, setCameraOff, goBack, navigation) => async (dispatch) => {
    setCameraOff(true);
    logs.log('ParsingP2M Function Triggered ParsingP2M...');
    try {
      let parsed = [];
      let tempString = qrString;
      logs.log('it is qrString', tempString);
      let count = 0;
      while (tempString != '') {
        count++;
        const tag = tempString.substring(0, 2);
        const length = parseInt(tempString.substring(2, 4));
        logs.log('======>', isNaN(length));
        if (isNaN(length)) {
          //aslkjiasd
          break;
        }
        const value = tempString.substring(4, 4 + length);
        if (tag === '28') {
          tempString = tempString.substring(4 + length, tempString.length);
          const parsedSubObject = parsingSubTags(tag, length, value);
          parsed.push(parsedSubObject);
          logs.log(parsed, '------->Parsed Array with SubTags');
          logs.log(parsedSubObject, '------> Parsed Sub Tags');
          if (count > 1000) {
            goBack();
            break;
          }
        } else if (tag === '62') {
          tempString = tempString.substring(4 + length, tempString.length);
          const parsedSubObject = parsingSubTags(tag, length, value);
          parsed.push(parsedSubObject);
          logs.log(parsed, '------->Parsed Array with SubTags');
          // logs.log(parsedSubObject,'------> Parsed Sub Tags');
          if (count > 1000) {
            goBack();
            break;
          }
        } else if (tag === '80') {
          tempString = tempString.substring(4 + length, tempString.length);
          const parsedSubObject = parsingSubTags(tag, length, value);
          parsed.push(parsedSubObject);
          logs.log(parsed, '------->Parsed Array with SubTags');
          // logs.log(parsedSubObject,'------> Parsed Sub Tags');
          if (count > 1000) {
            goBack();
            break;
          }
        } else {
          tempString = tempString.substring(4 + length, tempString.length);
          parsed.push({tag, length, value});
        }
      }
      logs.log('parsed Objects ', JSON.stringify(parsed));
      let filteredQrType = parsed.filter((obj) => obj.tag === '01')[0];
      if (filteredQrType?.value == '11') {
        let filteredIBAN = parsed.filter((obj) => obj.tag === '28')[0];
        let filteredAmount = parsed.filter((obj) => obj.tag === '54')[0];
        let filteredTip = parsed.filter((obj) => obj.tag === '55')[0];
        let filteredTipAmountFixed = parsed.filter(
          (obj) => obj.tag === '56',
        )[0];

        let filteredTipAmountPrecent = parsed.filter(
          (obj) => obj.tag === '57',
        )[0];
        logs.log('Static Qr');

        if (filteredTip?.value === '01') {
          navigation.navigate('PaymentQRCode', {
            filteredIBAN: filteredIBAN?.value[2]?.value,
            filteredAmount: filteredAmount?.value,
            qrType: 'Static',
            Tip: true,
          });
        } else if (filteredTip?.value === '02') {
          navigation.navigate('PaymentQRCode', {
            filteredIBAN: filteredIBAN?.value[2]?.value,
            filteredAmount: filteredAmount?.value,
            tipAmount: filteredTipAmountFixed?.value,
            qrType: 'Static',
            Tip: true,
            Fixedtip: true,
          });
        } else if (filteredTip?.value === '03') {
          navigation.navigate('PaymentQRCode', {
            filteredIBAN: filteredIBAN?.value[2]?.value,
            filteredAmount: filteredAmount?.value,
            tipPrecentage: filteredTipAmountPrecent.value,
            qrType: 'Static',
            Fixedtip: true,
            Tip: true,
          });
        } else {
          navigation.navigate('PaymentQRCode', {
            filteredIBAN: filteredIBAN?.value[2]?.value,
            filteredAmount: filteredAmount?.value,
            qrType: 'Static',
            Tip: false,
          });
        }
      } else if (filteredQrType?.value == '12') {
        logs.log('Dynamic Qr');
        let filteredIBAN = parsed.filter((obj) => obj.tag === '28')[0];
        let filteredAmount = parsed.filter((obj) => obj.tag === '54')[0];
        navigation.navigate('PaymentQRCode', {
          filteredIBAN: filteredIBAN?.value[2]?.value,
          filteredAmount: filteredAmount?.value,
          qrType: 'Dynamic',
        });
      }
    } catch (error) {
      logs.log(error);
      goBack();
    }
  };
// ***** End P To M Parsing ***** //

// ***** AGREE TO ADD VIRTUAL CARD ***** //

export const agreeToAddVirtualCard = (navigation) => async (dispatch) => {
  dispatch({
    type: actionTypes.SET_LOADER,
    payload: true,
  });
  navigation.navigate('AddVirtualCardTermsAndCondition');
  logs.logRequest(
    `${Config.base_url.UAT_URL}${Config.method.gateway}/${
      Config.endpoint.panEnrollment
    },
    {
      gcmId: ${store.getState().reducers.fcmToken},
      pan: ${store.getState().reducers.loginResponse.details.umpsCardNumber},
      deviceType: ${Platform.OS === 'android' ? 'ANDROID' : 'IOS'},
    },
    {
      headers: {'X-Auth-Token': ${store.getState().reducers.token}},
    },`,
  );
  axios
    .post(
      `${Config.base_url.UAT_URL}${Config.method.gateway}/${Config.endpoint.panEnrollment}`,
      {
        gcmId: store.getState().reducers.fcmToken,
        pan: store.getState().reducers.loginResponse.details.umpsCardNumber,
        deviceType: Platform.OS === 'android' ? 'ANDROID' : 'IOS',
      },
      {
        headers: {'X-Auth-Token': store.getState().reducers.token},
      },
    )
    .then((response) => {
      if (response.status === 200 && response.data.responseCode === '00') {
        dispatch({
          type: actionTypes.SET_TOKEN,
          payload: response?.headers?.['x-auth-next-token'],
        });
        dispatch({
          type: actionTypes.SET_VIRTUAL_CARD_DATA_ONE,
          payload: response.data,
        });
        dispatch({
          type: actionTypes.SET_LOADER,
          payload: false,
        });
      } else {
        if (response?.headers?.['x-auth-next-token']) {
          dispatch({
            type: actionTypes.SET_TOKEN,
            payload: response?.headers?.['x-auth-next-token'],
          });
        }
        if (sessionControl(response)) {
          navigation.dispatch(
            CommonActions.reset({
              index: 0,
              routes: [{name: 'Login'}],
            }),
          );
          dispatch({
            type: actionTypes.CLEAR_APP_DATA,
          });
        }

        dispatch({
          type: actionTypes.SET_LOADER,
          payload: false,
        });
        if (sessionControl(response)) {
          dispatch({
            type: actionTypes.SET_ELSE_RESPONSE_ALERT,
            payload: {
              state: true,
              alertTitle: 'Add Account',
              alertText: response.data?.data?.message
                ? response.data.data.message
                : response.data.responseDescription,
            },
          });
        } else {
          dispatch({
            type: actionTypes.SET_ELSE_RESPONSE_ALERT,
            payload: {
              state: true,
              alertTitle: 'Add Account',
              alertText: response.data?.data?.message
                ? response.data.data.message
                : response.data.responseDescription,
              onPress: () => {
                navigation.dispatch(
                  CommonActions.reset({
                    index: 0,
                    routes: [{name: 'Home'}],
                  }),
                );
              },
            },
          });
        }
      }
    })
    .catch((error) => {
      dispatch({
        type: actionTypes.SET_LOADER,
        payload: false,
      });
      let message = '';
      if (!error.status) {
        // network err
        message = Message.networkErrorMessage;
      } else {
        message = String(error);
      }
      dispatch({
        type: actionTypes.SET_ELSE_RESPONSE_ALERT,
        payload: {
          state: true,
          alertTitle: 'Add Account',
          alertText: message,
        },
      });
    });
};

// ***** ENDS AGREE TO ADD VIRTUAL CARD ***** //

// ***** ALREADY INITIALIZED STATE DELETE THEN AGREE TO ADD VIRTUAL CARD ***** //

export const deleteThenAgreeToAddVirtualCard =
  (navigation) => async (dispatch) => {
    dispatch({
      type: actionTypes.SET_LOADER,
      payload: true,
    });

    navigation.navigate('AddVirtualCardTermsAndCondition');
    axios
      .post(
        `${Config.base_url.UAT_URL}${Config.method.gateway}/${Config.endpoint.panEnrollment}`,
        {
          gcmId: store.getState().reducers.fcmToken,
          pan: store.getState().reducers.loginResponse.details.umpsCardNumber,
          deviceType: Platform.OS === 'android' ? 'ANDROID' : 'IOS',
        },
        {
          headers: {'X-Auth-Token': store.getState().reducers.token},
        },
      )
      .then((response) => {
        if (response.status === 200 && response.data.responseCode === '00') {
          dispatch({
            type: actionTypes.SET_TOKEN,
            payload: response?.headers?.['x-auth-next-token'],
          });
          dispatch({
            type: actionTypes.SET_VIRTUAL_CARD_DATA_ONE,
            payload: response.data,
          });
          dispatch({
            type: actionTypes.SET_LOADER,
            payload: false,
          });
        } else {
          if (response?.headers?.['x-auth-next-token']) {
            dispatch({
              type: actionTypes.SET_TOKEN,
              payload: response?.headers?.['x-auth-next-token'],
            });
          }
          if (sessionControl(response)) {
            navigation.dispatch(
              CommonActions.reset({
                index: 0,
                routes: [{name: 'Login'}],
              }),
            );
            dispatch({
              type: actionTypes.CLEAR_APP_DATA,
            });
          }

          dispatch({
            type: actionTypes.SET_LOADER,
            payload: false,
          });

          dispatch({
            type: actionTypes.SET_ELSE_RESPONSE_ALERT,
            payload: {
              state: true,
              alertTitle: 'Add Account',
              alertText: response.data?.data?.message
                ? response.data.data.message
                : response.data.responseDescription,
            },
          });
        }
      })
      .catch((error) => {
        dispatch({
          type: actionTypes.SET_LOADER,
          payload: false,
        });
        let message = '';
        if (!error.status) {
          // network err
          message = Message.networkErrorMessage;
        } else {
          message = String(error);
        }
        dispatch({
          type: actionTypes.SET_ELSE_RESPONSE_ALERT,
          payload: {
            state: true,
            alertTitle: 'Add Account',
            alertText: message,
          },
        });
      });
  };

// *****  ENDS ALREADY INITIALIZED STATE DELETE THEN AGREE TO ADD VIRTUAL CARD ***** //

// ***** SET LOGIN RESPONSE ***** //

export const setLoginResponse = (response) => async (dispatch) => {
  dispatch({
    type: actionTypes.SET_LOGIN_RESPONSE,
    payload: response,
  });
};

// ***** ENDS SET LOGIN RESPONSE ***** //

export const accountVerification = (navigation) => async (dispatch) => {
  dispatch({
    type: actionTypes.SET_LOADER,
    payload: true,
  });
  logs.logRequest(
    `${Config.base_url.UAT_URL}${Config.method.gateway}/${
      Config.endpoint.accountVerification
    },
  {
    cvmInfo: ${store.getState().reducers.virtualCardDataOne?.data?.cvList},
    deviceID: ${store.getState().reducers.fcmToken},
    enrollID: ${store.getState().reducers.virtualCardDataOne.data.enrollID},
    mobileNo: ${store.getState().reducers.loginResponse.details.mobile},
  },
  {
    headers: {'X-Auth-Token': ${store.getState().reducers.token}},
  },`,
  );
  axios
    .post(
      `${Config.base_url.UAT_URL}${Config.method.gateway}/${Config.endpoint.accountVerification}`,
      {
        cvmInfo: store.getState().reducers.virtualCardDataOne?.data?.cvList,
        deviceID: store.getState().reducers.fcmToken,
        enrollID: store.getState().reducers.virtualCardDataOne.data.enrollID,
        mobileNo: store.getState().reducers.loginResponse.details.mobile,
      },
      {
        headers: {'X-Auth-Token': store.getState().reducers.token},
      },
    )
    .then((response) => {
      logs.logResponse(response.data);
      if (response.status === 200 && response.data.responseCode === '00') {
        dispatch({
          type: actionTypes.SET_TOKEN,
          payload: response?.headers?.['x-auth-next-token'],
        });
        dispatch({
          type: actionTypes.SET_VIRTUAL_CARD_DATA_TWO,
          payload: response.data,
        });
        logs.logRequest(
          `${Config.base_url.UAT_URL}${Config.method.gateway}/${Config.endpoint.sendingOTP},
  {
    deviceId: ${response.data.data.deviceId},
    enrollId: ${response.data.data.enrollID},
    otpMethod: ${response.data.data.otpMethod[0]},
  },
  {
    headers: {'X-Auth-Token': ${response?.headers?.['x-auth-next-token']}},
  },`,
        );
        axios
          .post(
            `${Config.base_url.UAT_URL}${Config.method.gateway}/${Config.endpoint.sendingOTP}`,
            {
              deviceId: response.data.data.deviceId,
              enrollId: response.data.data.enrollID,
              otpMethod: response.data.data.otpMethod[0],
            },
            {
              headers: {
                'X-Auth-Token': response?.headers?.['x-auth-next-token'],
              },
            },
          )
          .then((response2) => {
            logs.logResponse(response2.data);
            if (
              response2.status === 200 &&
              response2.data.responseCode === '00'
            ) {
              // navigation.navigate('VirtualCardOtp')
              dispatch({
                type: actionTypes.SET_TOKEN,
                payload: response2.headers['x-auth-next-token'],
              });
              dispatch({
                type: actionTypes.SET_VIRTUAL_CARD_DATA_THREE,
                payload: response2.data,
              });
              navigation.navigate('VirtualCardOtp');
              dispatch({
                type: actionTypes.SET_LOADER,
                payload: false,
              });
            } else {
              if (response2.headers['x-auth-next-token']) {
                dispatch({
                  type: actionTypes.SET_TOKEN,
                  payload: response2.headers['x-auth-next-token'],
                });
              }
              if (sessionControl(response2)) {
                navigation.dispatch(
                  CommonActions.reset({
                    index: 0,
                    routes: [{name: 'Login'}],
                  }),
                );
                dispatch({
                  type: actionTypes.CLEAR_APP_DATA,
                });
              }

              dispatch({
                type: actionTypes.SET_LOADER,
                payload: false,
              });

              dispatch({
                type: actionTypes.SET_ELSE_RESPONSE_ALERT,
                payload: {
                  state: true,
                  alertTitle: 'Add Account',
                  alertText: response2.data?.data?.message
                    ? response2.data.data.message
                    : response2.data.responseDescription,
                },
              });
            }
          })
          .catch((error2) => {
            dispatch({
              type: actionTypes.SET_LOADER,
              payload: false,
            });
            let message = '';
            if (!error2.status) {
              // network err
              message = Message.networkErrorMessage;
            } else {
              message = String(error2);
            }
            dispatch({
              type: actionTypes.SET_ELSE_RESPONSE_ALERT,
              payload: {
                state: true,
                alertTitle: 'Add Account',
                alertText: message,
              },
            });
          });
      } else {
        if (response?.headers?.['x-auth-next-token']) {
          dispatch({
            type: actionTypes.SET_TOKEN,
            payload: response?.headers?.['x-auth-next-token'],
          });
        }
        if (sessionControl(response)) {
          navigation.dispatch(
            CommonActions.reset({
              index: 0,
              routes: [{name: 'Login'}],
            }),
          );
          dispatch({
            type: actionTypes.CLEAR_APP_DATA,
          });
        }

        dispatch({
          type: actionTypes.SET_LOADER,
          payload: false,
        });

        dispatch({
          type: actionTypes.SET_ELSE_RESPONSE_ALERT,
          payload: {
            state: true,
            alertTitle: 'Add Account',
            alertText: response.data?.data?.message
              ? response.data.data.message
              : response.data.responseDescription,
          },
        });
      }
    })
    .catch((error) => {
      dispatch({
        type: actionTypes.SET_LOADER,
        payload: false,
      });
      let message = '';
      if (!error.status) {
        // network err
        message = Message.networkErrorMessage;
      } else {
        message = String(error);
      }
      dispatch({
        type: actionTypes.SET_ELSE_RESPONSE_ALERT,
        payload: {
          state: true,
          alertTitle: 'Add Account',
          alertText: message,
        },
      });
    });
};

// ***** RESEND VIRTUAL OTP ***** //

export const resendVirtualOtp = (navigation) => async (dispatch) => {
  dispatch({
    type: actionTypes.SET_LOADER,
    payload: true,
  });

  axios
    .post(
      `${Config.base_url.UAT_URL}${Config.method.gateway}/${Config.endpoint.sendingOTP}`,
      {
        deviceId: store.getState().reducers.virtualCardDataTwo.data.deviceId,
        enrollId: store.getState().reducers.virtualCardDataTwo.data.enrollID,
        otpMethod:
          store.getState().reducers.virtualCardDataTwo.data.otpMethod[0],
      },
      {
        headers: {'X-Auth-Token': store.getState().reducers.token},
      },
    )
    .then((response2) => {
      if (response2.status === 200 && response2.data.responseCode === '00') {
        // navigation.navigate('VirtualCardOtp')
        dispatch({
          type: actionTypes.SET_TOKEN,
          payload: response2.headers['x-auth-next-token'],
        });
        dispatch({
          type: actionTypes.SET_VIRTUAL_CARD_DATA_THREE,
          payload: response2.data,
        });
        dispatch({
          type: actionTypes.SET_LOADER,
          payload: false,
        });
        // Alert.alert(
        //   store.getState().reducers.currentFlow,
        //   'Otp Resend Successfull',
        // );

        dispatch({
          type: actionTypes.SET_ELSE_RESPONSE_ALERT,
          payload: {
            state: true,
            alertTitle: 'Add Account',
            alertText: 'OTP has been sent to your mobile.',
          },
        });
      } else {
        if (response2.headers['x-auth-next-token']) {
          dispatch({
            type: actionTypes.SET_TOKEN,
            payload: response2.headers['x-auth-next-token'],
          });
        }
        if (sessionControl(response2)) {
          navigation.dispatch(
            CommonActions.reset({
              index: 0,
              routes: [{name: 'Login'}],
            }),
          );
          dispatch({
            type: actionTypes.CLEAR_APP_DATA,
          });
        }

        dispatch({
          type: actionTypes.SET_LOADER,
          payload: false,
        });

        dispatch({
          type: actionTypes.SET_ELSE_RESPONSE_ALERT,
          payload: {
            state: true,
            alertTitle: 'Add Account',
            alertText: response2.data?.data?.message
              ? response2.data.data.message
              : response2.data.responseDescription,
          },
        });
      }
    })
    .catch((error2) => {
      dispatch({
        type: actionTypes.SET_LOADER,
        payload: false,
      });
      let message = '';
      if (!error2.status) {
        // network err
        message = Message.networkErrorMessage;
      } else {
        message = String(error2);
      }
      dispatch({
        type: actionTypes.SET_ELSE_RESPONSE_ALERT,
        payload: {
          state: true,
          alertTitle: 'Add Account',
          alertText: message,
        },
      });
    });
};

// ***** SEND VIRTUAL CARD OTP ***** //

export const virtualCardVerifyOtp =
  (navigation, pass, sdkProperties) => async (dispatch) => {
    const sdkData =
      'eyJmcEluZm8iOiI4NjhGMUVEQjE0QkVFQkNBRTAyREQxRDQ4NjVBNkMwNkU2NUVCREJCMjdFRDc1OUIzMzUyODk4QTcwMEM1Q0IzQkY2MzVDNDM5NTU4MTBDN0FBODM3QjY3NDg4NzUwNUZGNjRGRTE2MzZDNjIwMjFBQjg1MTI3OTc4RTIwMEJEOTI0NjY2QUJFNDU0QzgzODdEOTg5QjI1RjY1NUY0MUI1QkM2MjRBMUM5QzM1ODhGOEEyREY4OUY0RDAwRDgwMTM4RkUzQzFDQThCQUNENkQ1QjcwNTAxM0M2QjFBOEQyNUI4NDM2RTJBN0U4N0Y1MkRCMDhERkZDNEFDRkQwNkQzRkI1QTcwQjFDREVBODk2QUNGOUY3RTlBMkVFOEVDMEE0MkM2NUFFRjEwNEJCMkVFMzYxOUM5NTY1MTZFNDQxOTdBOTREMzM1NjVBNzIxNkE3OTEwRUM3NzE4QjcxRUQ1NzU5MUIxN0JCNjNDNDk5MDlFM0ZFNzA4OERBNTVBQkU5NkVGRUJFNDY4RTM4QUUzNkNGMDMyRTZGQkZEMjkyNkUxOERDNUIyMTVCNzVBQjM2RkVENTU3RTg1ODEzNDlBIiwicHJvSUQiOiIyNyIsImVuY3J5cHRlZERFSyI6IkI4RkQyNkYyNjFGOUFGRUZFRDI0ODg2QzIwQUE1NUYxNTk2NzIwMEQ3QjVDRjAwNEVDQTIzRTI0NjI4NUE3Q0JFOTk2MDM2QzI2NkYwMUZGMzg0MzU4RjRDRTE1QkY4OUZFNTI2QUU5NTJERDIwQUFCNjUwRjU4NUE5MTI3NzUzMzNFQ0Y3RTFCNjY3RkNBODUwRDRDRkM5RDNBRjY5QzJBMjQ2RDkyODE2NjkxQzAxN0NBMTUyNzcxODQxODg4OTc5QkRBNUFFRjU0MDBFQUI5RTMwMDIwMjA5QTUxN0U1NjQ5Q0MxODQ5NzJGRkM4REUyNzdDOUI0NDYyNEM5RUQiLCJwdWJsaWNLZXlJRCI6IjIiLCJkZWtJRCI6IjE2Mjc2NDE2MjY0NzQifQ==';
    dispatch({
      type: actionTypes.SET_LOADER,
      payload: true,
    });
    logs.logRequest(
      `${Config.base_url.UAT_URL}${Config.method.gateway}/${
        Config.endpoint.tokenProvisioning
      },
  {
    deviceID: ${store.getState().reducers.fcmToken},
    enrollID:
      ${store.getState().reducers.virtualCardDataThree.data.enrollId},
    otpValue: ${pass},
    tncID: ${store.getState().reducers.virtualCardDataOne.data.tncID},
    sdkProperties: '', // Platform.OS === 'ios' ? '' : sdkProperties,
  },
  {
    headers: {'X-Auth-Token': ${store.getState().reducers.token}},
  },`,
    );
    axios
      .post(
        `${Config.base_url.UAT_URL}${Config.method.gateway}/${Config.endpoint.tokenProvisioning}`,
        {
          deviceID: store.getState().reducers.fcmToken,
          enrollID:
            store.getState().reducers.virtualCardDataThree.data.enrollId,
          otpValue: pass,
          tncID: store.getState().reducers.virtualCardDataOne.data.tncID,
          sdkProperties: '', // Platform.OS === 'ios' ? '' : sdkProperties,
        },
        {
          headers: {'X-Auth-Token': store.getState().reducers.token},
        },
      )
      .then((response) => {
        logs.logResponse(response.data);
        if (response.data.responseCode === '00' && response.status === 200) {
          let object = {
            username: store.getState().reducers.userSignedIn,
            ...response.data.data,
          };

          dispatch(
            setKeyChainObject({
              virtualCardData: object,
              virtualCardStatus: response.data.data.tokenState,
            }),
          );
          dispatch({
            type: actionTypes.SET_VIRTUAL_CARD_OBJECT,
            payload: response.data.data,
          });
          dispatch({
            type: actionTypes.SET_TOKEN,
            payload: response?.headers?.['x-auth-next-token'],
          });
          dispatch({
            type: actionTypes.SET_VIRTUAL_CARD_DATA_FOUR,
            payload: response.data.data,
          });
          navigation.navigate('AddVirtualCardMpin');
          dispatch({
            type: actionTypes.SET_LOADER,
            payload: false,
          });
        } else {
          if (response?.headers?.['x-auth-next-token']) {
            dispatch({
              type: actionTypes.SET_TOKEN,
              payload: response?.headers?.['x-auth-next-token'],
            });
          }
          if (sessionControl(response)) {
            navigation.dispatch(
              CommonActions.reset({
                index: 0,
                routes: [{name: 'Login'}],
              }),
            );
            dispatch({
              type: actionTypes.CLEAR_APP_DATA,
            });
          }

          dispatch({
            type: actionTypes.SET_LOADER,
            payload: false,
          });

          dispatch({
            type: actionTypes.SET_ELSE_RESPONSE_ALERT,
            payload: {
              state: true,
              alertTitle: 'Add Account',
              alertText: response.data?.data?.message
                ? response.data.data.message
                : response.data.responseDescription,
            },
          });
        }
      })
      .catch((error) => {
        dispatch({
          type: actionTypes.SET_LOADER,
          payload: false,
        });
        let message = '';
        if (!error.status) {
          // network err
          message = Message.networkErrorMessage;
        } else {
          message = String(error);
        }
        dispatch({
          type: actionTypes.SET_ELSE_RESPONSE_ALERT,
          payload: {
            state: true,
            alertTitle: 'Add Account',
            alertText: message,
          },
        });
      });
  };

// ***** ENDS SEND VIRTUAL CARD OTP ***** //

// ***** ADD VIRTUAL MPIN ***** //

export const umpsNotifyCustomerRequest =
  (navigation, param, mpin) => async (dispatch) => {
    dispatch({
      type: actionTypes.SET_LOADER,
      payload: true,
    });

    axios
      .post(
        `${Config.base_url.UAT_URL}${Config.method.umps}/${Config.endpoint.notifyCustomer}?request=${param}`,
        {
          channel: Config.channel.channel,
        },
        {
          headers: {'X-Auth-Token': store.getState().reducers.token},
        },
      )
      .then((response) => {
        if (
          (response.status === 200 || response.status === 201) &&
          response.data.responseCode === '00'
        ) {
          dispatch({
            type: actionTypes.SET_TOKEN,
            payload: response?.headers?.['x-auth-next-token'],
          });
          dispatch({
            type: actionTypes.SET_LOADER,
            payload: false,
          });
        } else {
          dispatch({
            type: actionTypes.SET_VIRTUAL_CARD_MPIN,
            payload: false,
          });

          if (response?.headers?.['x-auth-next-token']) {
            dispatch({
              type: actionTypes.SET_TOKEN,
              payload: response?.headers?.['x-auth-next-token'],
            });
          }
          if (sessionControl(response)) {
            navigation.dispatch(
              CommonActions.reset({
                index: 0,
                routes: [{name: 'Login'}],
              }),
            );
            dispatch({
              type: actionTypes.CLEAR_APP_DATA,
            });
          }

          dispatch({
            type: actionTypes.SET_LOADER,
            payload: false,
          });

          dispatch({
            type: actionTypes.SET_ELSE_RESPONSE_ALERT,
            payload: {
              state: true,
              alertTitle: 'Add Account',
              alertText: response.data?.data?.message
                ? response.data.data.message
                : response.data.responseDescription,
            },
          });
        }
      })
      .catch((error2) => {
        dispatch({
          type: actionTypes.SET_LOADER,
          payload: false,
        });
        let message = '';
        if (!error2.status) {
          // network err
          message = Message.networkErrorMessage;
        } else {
          message = String(error2);
        }
        dispatch({
          type: actionTypes.SET_ELSE_RESPONSE_ALERT,
          payload: {
            state: true,
            alertTitle: 'Add Account',
            alertText: message,
          },
        });
      });
  };

// ***** ENDS ADD VIRTUAL MPIN ***** //

// ***** GENERATE VIRTUAL QR ***** //

export const generateQrCode = (navigation) => async (dispatch) => {
  dispatch({
    type: actionTypes.SET_LOADER,
    payload: true,
  });

  axios
    .post(
      `${Config.base_url.UAT_URL}${Config.method.umps}/${Config.endpoint.cpqrc}`,
      {
        backURL: '',
        couponInfo: '',
        cpqrcNo: '',
        cvmLimit: '',
        deviceID: '',
        limitCurrency: '',
        rrn: '',
        token: store.getState().reducers.virtualCardObject.tokenID,
        trxLimit: '',
        username: '',
      },
      {
        headers: {'X-Auth-Token': store.getState().reducers.token},
      },
    )
    .then((response) => {
      if (response.status === 200 && response.data.responseCode === '00') {
        dispatch({
          type: actionTypes.SET_TOKEN,
          payload: response?.headers?.['x-auth-next-token'],
        });
        dispatch({
          type: actionTypes.SET_GENERATE_QR_CODE,
          payload: response.data.data.emvCpqrcPayload[0],
        });
        dispatch({
          type: actionTypes.SET_LOADER,
          payload: false,
        });
      } else {
        dispatch({
          type: actionTypes.SET_GENERATE_QR_CODE,
          payload: '',
        });
        if (response?.headers?.['x-auth-next-token']) {
          dispatch({
            type: actionTypes.SET_TOKEN,
            payload: response?.headers?.['x-auth-next-token'],
          });
        }
        if (sessionControl(response)) {
          navigation.dispatch(
            CommonActions.reset({
              index: 0,
              routes: [{name: 'Login'}],
            }),
          );
          dispatch({
            type: actionTypes.CLEAR_APP_DATA,
          });
        } else {
          navigation.goBack();
        }

        dispatch({
          type: actionTypes.SET_LOADER,
          payload: false,
        });

        setTimeout(() => {
          dispatch({
            type: actionTypes.SET_ELSE_RESPONSE_ALERT,
            payload: {
              state: true,
              alertTitle: '',
              alertText: response.data?.data?.message
                ? response.data.data.message
                : response.data.responseDescription,
            },
          });
        }, 500);
      }
    })
    .catch((error2) => {
      dispatch({
        type: actionTypes.SET_LOADER,
        payload: false,
      });
      let message = '';
      if (!error2.status) {
        // network err
        message = Message.networkErrorMessage;
      } else {
        message = String(error2);
      }
      dispatch({
        type: actionTypes.SET_ELSE_RESPONSE_ALERT,
        payload: {
          state: true,
          alertTitle: 'Add Account',
          alertText: message,
        },
      });
    });
};

// ***** ENDS GENERATE VIRTUAL QR ***** //

// ***** GET VIRTUAL CARD TOKEN ***** //

// export const getVirtualCardObject = () => async (dispatch) => {
//   const credentials = await Keychain.getGenericPassword();
//   let parsedCredential;
//   if (credentials) {
//     parsedCredential = JSON.parse(credentials.password);
//   } else {
//     parsedCredential = {};
//   }

//   if (parsedCredential.virtualCardData) {
//     if (
//       parsedCredential.virtualCardData.username ===
//       store.getState().reducers.userSignedIn
//     ) {
//       dispatch({
//         type: actionTypes.SET_VIRTUAL_CARD_OBJECT,
//         payload: parsedCredential.virtualCardData,
//       });
//     } else {
//       dispatch({
//         type: actionTypes.SET_LOADER,
//         payload: true,
//       });
//       axios
//         .post(
//           `${Config.base_url.UAT_URL}${Config.method.gateway}/${Config.endpoint.tokenStateUpdate}`,
//           {
//             deviceID: store.getState().reducers.fcmToken,
//             // enrollID: '', //store.getState().reducers.virtualCardObject.enrollID,
//             token: store.getState().reducers.virtualCardObject.token,

//             tokenAction: 'DELETE',
//           },
//           {
//             headers: {'X-Auth-Token': store.getState().reducers.token},
//           },
//         )
//         .then((response) => {
//           if (response.status === 200 && response.data.responseCode === '00') {
//             dispatch({
//               type: actionTypes.SET_TOKEN,
//               payload: response?.headers?.['x-auth-next-token'],
//             });

//             dispatch({
//               type: actionTypes.SET_VIRTUAL_CARD_MPIN,
//               payload: false,
//             });

//             dispatch({
//               type: actionTypes.SET_VIRTUAL_CARD_OBJECT,
//               payload: false,
//             });

//             dispatch({
//               type: actionTypes.SET_VIRTUAL_CARD_STATUS,
//               payload: false,
//             });

//             dispatch({
//               type: actionTypes.SET_LOADER,
//               payload: false,
//             });
//           } else {
//             if (response?.headers?.['x-auth-next-token']) {
//               dispatch({
//                 type: actionTypes.SET_TOKEN,
//                 payload: response?.headers?.['x-auth-next-token'],
//               });
//             }
//             if (sessionControl(response)) {
//               navigation.dispatch(
//                 CommonActions.reset({
//                   index: 0,
//                   routes: [{name: 'Login'}],
//                 }),
//               );
//               dispatch({
//                 type: actionTypes.CLEAR_APP_DATA,
//               });
//             }

//             dispatch({
//               type: actionTypes.SET_LOADER,
//               payload: false,
//             });

//             dispatch({
//               type: actionTypes.SET_ELSE_RESPONSE_ALERT,
//               payload: {
//                 state: true,
//                 alertTitle: '',
//                 alertText: response.data?.data?.message
//                   ? response.data.data.message
//                   : response.data.responseDescription,
//               },
//             });
//           }
//         })
//         .catch((error) => {
//           dispatch({
//             type: actionTypes.SET_LOADER,
//             payload: false,
//           });
//         });
//     }
//   } else {
//     dispatch({
//       type: actionTypes.SET_VIRTUAL_CARD_OBJECT,
//       payload: false,
//     });
//   }
// };

// ***** ENDS GET VIRTUAL CARD TOKEN ***** //

// ***** SET VIRTUAL CARD MPIN ***** //
export const setVirtualCardMpin =
  (mpin, navigation, directMpin) => async (dispatch) => {
    dispatch(setKeyChainObject({virtualCardMpin: mpin}));
    dispatch({
      type: actionTypes.SET_VIRTUAL_CARD_MPIN,
      payload: mpin,
    });
  };
// ***** ENDS SET VIRTUAL CARD MPIN ***** //

// ***** GET VIRTUAL CARD MPIN ***** //
export const getVirtualCardMpin = () => async (dispatch) => {
  const credentials = await Keychain.getGenericPassword();
  let parsedCredential;
  if (credentials) {
    parsedCredential = JSON.parse(credentials.password);
  } else {
    parsedCredential = {};
  }
  if (parsedCredential.virtualCardMpin) {
    dispatch({
      type: actionTypes.SET_VIRTUAL_CARD_MPIN,
      payload: parsedCredential.virtualCardMpin,
    });
  } else {
    dispatch({
      type: actionTypes.SET_VIRTUAL_CARD_MPIN,
      payload: false,
    });
  }
};
// ***** ENDS GET VIRTUAL CARD MPIN ***** //

// ***** GET VIRTUAL CARD BITMAP ***** //
export const cardfaceDownloading =
  (navigation, navigateTo) => async (dispatch) => {
    dispatch({
      type: actionTypes.SET_CARD_FACE_DOWNLOADING,
      payload: {},
    });
    dispatch({
      type: actionTypes.SET_LOADER,
      payload: true,
    });

    logs.logRequest(
      `${Config.base_url.UAT_URL}${Config.method.gateway}/${
        Config.endpoint.cardfaceDownloading
      },
  {
    cardFaceID: ${
      store.getState().reducers.virtualCardObject.cardFaceId
    }, // cardFaceID: '62622900',

    deviceID: ${store.getState().reducers.fcmToken},
  },
  {
    headers: {'X-Auth-Token': ${store.getState().reducers.token}},
  },`,
    );
    axios
      .post(
        `${Config.base_url.UAT_URL}${Config.method.gateway}/${Config.endpoint.cardfaceDownloading}`,
        {
          cardFaceID: store.getState().reducers.virtualCardObject.cardFaceId, // cardFaceID: '62622900',

          deviceID: store.getState().reducers.fcmToken,
        },
        {
          headers: {'X-Auth-Token': store.getState().reducers.token},
        },
      )
      .then((response) => {
        logs.logResponse(response.data);
        if (response.status === 200 && response.data.responseCode === '00') {
          dispatch({
            type: actionTypes.SET_TOKEN,
            payload: response?.headers?.['x-auth-next-token'],
          });
          dispatch({
            type: actionTypes.SET_CARD_FACE_DOWNLOADING,
            payload: response.data.data,
          });
          dispatch({
            type: actionTypes.SET_LOADER,
            payload: false,
          });
          if (navigateTo) {
            navigation.navigate(navigateTo);
          } else {
            navigation.navigate('ViewCard');
          }
        } else {
          if (response?.headers?.['x-auth-next-token']) {
            dispatch({
              type: actionTypes.SET_TOKEN,
              payload: response?.headers?.['x-auth-next-token'],
            });
          }
          if (sessionControl(response)) {
            navigation.dispatch(
              CommonActions.reset({
                index: 0,
                routes: [{name: 'Login'}],
              }),
            );
            dispatch({
              type: actionTypes.CLEAR_APP_DATA,
            });
          } else {
            navigation.goBack();
          }

          dispatch({
            type: actionTypes.SET_LOADER,
            payload: false,
          });

          dispatch({
            type: actionTypes.SET_ELSE_RESPONSE_ALERT,
            payload: {
              state: true,
              alertTitle: 'Add Account',
              alertText: response.data?.data?.message
                ? response.data.data.message
                : response.data.responseDescription,
            },
          });
        }
      })
      .catch((error) => {
        dispatch({
          type: actionTypes.SET_LOADER,
          payload: false,
        });
        let message = '';
        if (!error.status) {
          // network err
          message = Message.networkErrorMessage;
        } else {
          message = String(error);
        }
        dispatch({
          type: actionTypes.SET_ELSE_RESPONSE_ALERT,
          payload: {
            state: true,
            alertTitle: 'Add Account',
            alertText: message,
          },
        });
      });
  };

// ***** ENDS GET VIRTUAL CARD BITMAP ***** //

// ***** GET CVV DATA ***** //

export const getCvvData = (navigation) => async (dispatch) => {
  dispatch({
    type: actionTypes.SET_LOADER,
    payload: true,
  });
  logs.logRequest(
    `${Config.base_url.UAT_URL}${Config.method.umps}/${
      Config.endpoint.getCardAndCVV
    },
    {},
    {
      headers: {'X-Auth-Token': ${store.getState().reducers.token}},
    },`,
  );
  axios
    .post(
      `${Config.base_url.UAT_URL}${Config.method.umps}/${Config.endpoint.getCardAndCVV}`,
      {},
      {
        headers: {'X-Auth-Token': store.getState().reducers.token},
      },
    )
    .then((response) => {
      if (response.status === 200 && response.data.responseCode === '00') {
        dispatch({
          type: actionTypes.SET_TOKEN,
          payload: response?.headers?.['x-auth-next-token'],
        });
        dispatch({
          type: actionTypes.SET_ECOMMERCE_DATA,
          payload: response.data.data,
        });
        dispatch({
          type: actionTypes.SET_LOADER,
          payload: false,
        });

        setTimeout(() => {
          dispatch({
            type: actionTypes.SET_CVV_ALERT,
            payload: true,
          });
        }, 500);
      } else {
        if (response?.headers?.['x-auth-next-token']) {
          dispatch({
            type: actionTypes.SET_TOKEN,
            payload: response?.headers?.['x-auth-next-token'],
          });
        }
        if (sessionControl(response)) {
          navigation.dispatch(
            CommonActions.reset({
              index: 0,
              routes: [{name: 'Login'}],
            }),
          );
          dispatch({
            type: actionTypes.CLEAR_APP_DATA,
          });
        } else {
          navigation.goBack();
        }

        dispatch({
          type: actionTypes.SET_LOADER,
          payload: false,
        });

        dispatch({
          type: actionTypes.SET_ELSE_RESPONSE_ALERT,
          payload: {
            state: true,
            alertTitle: 'Add Account',
            alertText: response.data?.data?.message
              ? response.data.data.message
              : response.data.responseDescription,
          },
        });
      }
    })
    .catch((error) => {
      dispatch({
        type: actionTypes.SET_LOADER,
        payload: false,
      });
      let message = '';
      if (!error.status) {
        // network err
        message = Message.networkErrorMessage;
      } else {
        message = String(error);
      }
      dispatch({
        type: actionTypes.SET_ELSE_RESPONSE_ALERT,
        payload: {
          state: true,
          alertTitle: 'Add Account',
          alertText: message,
        },
      });
    });
};

// ***** ENDS GET CVV DATA ***** //

export const hideCvvAlert = () => async (dispatch) => {
  dispatch({
    type: actionTypes.SET_CVV_ALERT,
    payload: false,
  });
};
// ***** FORGOT VIRTUAL CARD PIN ***** //
export const forgotVirtualCardPin =
  (cardNumber, pin, navigation) => async (dispatch) => {
    dispatch({
      type: actionTypes.SET_LOADER,
      payload: true,
    });

    axios
      .post(
        `${Config.base_url.UAT_URL}${Config.method.umps}/${Config.endpoint.verifypin3}`,
        {
          deviceId: '',
          pinNumber: pin,
          token: cardNumber,
        },
        {
          headers: {'X-Auth-Token': store.getState().reducers.token},
        },
      )
      .then((response) => {
        if (response.status === 200 && response.data.responseCode === '00') {
          dispatch({
            type: actionTypes.SET_TOKEN,
            payload: response?.headers?.['x-auth-next-token'],
          });
          navigation.navigate('SetNewCardPin');
          dispatch({
            type: actionTypes.SET_LOADER,
            payload: false,
          });
        } else {
          if (response?.headers?.['x-auth-next-token']) {
            dispatch({
              type: actionTypes.SET_TOKEN,
              payload: response?.headers?.['x-auth-next-token'],
            });
          }
          if (sessionControl(response)) {
            navigation.dispatch(
              CommonActions.reset({
                index: 0,
                routes: [{name: 'Login'}],
              }),
            );
            dispatch({
              type: actionTypes.CLEAR_APP_DATA,
            });
          } else {
            navigation.goBack();
          }

          dispatch({
            type: actionTypes.SET_LOADER,
            payload: false,
          });

          dispatch({
            type: actionTypes.SET_ELSE_RESPONSE_ALERT,
            payload: {
              state: true,
              alertTitle: 'Add Account',
              alertText: response.data?.data?.message
                ? response.data.data.message
                : response.data.responseDescription,
            },
          });
        }
      })
      .catch((error) => {
        dispatch({
          type: actionTypes.SET_LOADER,
          payload: false,
        });
        let message = '';
        if (!error.status) {
          // network err
          message = Message.networkErrorMessage;
        } else {
          message = String(error);
        }
        dispatch({
          type: actionTypes.SET_ELSE_RESPONSE_ALERT,
          payload: {
            state: true,
            alertTitle: 'Add Account',
            alertText: message,
          },
        });
      });
  };

// ***** ENDS FORGOT VIRTUAL CARD PIN ***** //

// ***** TOKEN STATE UPDATE ***** //

export const tokenStateUpdate =
  (navigation, tokenAction) => async (dispatch) => {
    dispatch({
      type: actionTypes.SET_LOADER,
      payload: true,
    });

    axios
      .post(
        `${Config.base_url.UAT_URL}${Config.method.gateway}/${Config.endpoint.tokenStateUpdate}`,
        {
          deviceID: store.getState().reducers.fcmToken,
          // enrollID: '', //store.getState().reducers.virtualCardObject.enrollID,
          token: store.getState().reducers.virtualCardObject.token,

          tokenAction: tokenAction,
        },
        {
          headers: {'X-Auth-Token': store.getState().reducers.token},
        },
      )
      .then((response) => {
        if (response.status === 200 && response.data.responseCode === '00') {
          dispatch({
            type: actionTypes.SET_TOKEN,
            payload: response?.headers?.['x-auth-next-token'],
          });
          if (tokenAction === 'DELETE') {
            // deleteCardLifeCycle();
            let removableObject = {...store.getState().reducers.keychainObject};
            logs.log(`removable object is ${removableObject}`);
            delete removableObject['virtualCardMpin'];
            delete removableObject['virtualCardData'];
            delete removableObject['virtualCardStatus'];
            dispatch(updateWithDeletedKeychainObject(removableObject));

            dispatch({
              type: actionTypes.SET_VIRTUAL_CARD_MPIN,
              payload: false,
            });

            dispatch({
              type: actionTypes.SET_VIRTUAL_CARD_OBJECT,
              payload: false,
            });

            dispatch({
              type: actionTypes.SET_VIRTUAL_CARD_STATUS,
              payload: false,
            });

            setTimeout(() => {
              dispatch({
                type: actionTypes.SET_ELSE_RESPONSE_ALERT,
                payload: {
                  state: true,
                  alertTitle: '',
                  alertText: 'Card Deleted Successfully.',
                  onPress: () => {
                    navigation.dispatch(
                      CommonActions.reset({
                        index: 0,
                        routes: [{name: 'Home'}],
                      }),
                    );
                  },
                },
              });
            }, 500);
          } else {
            let tokenAct = {
              action: tokenAction === 'RESUME' ? 'ACTIVE' : tokenAction,
            };

            dispatch({
              type: actionTypes.SET_VIRTUAL_CARD_STATUS,
              payload: tokenAct.action,
            });
            let object = {
              ...store.getState().reducers.virtualCardObject,
              tokenState: tokenAct.action,
              username: store.getState().reducers.userSignedIn,
            };
            dispatch(
              setKeyChainObject({
                virtualCardData: object,
                virtualCardStatus: tokenAct.action,
              }),
            );
            dispatch({
              type: actionTypes.SET_VIRTUAL_CARD_OBJECT,
              payload: object,
            });
          }
          // if (tokenAction === 'SUSPEND') {
          //   deactivateCard();
          // } else if (tokenAction === 'RESUME') {
          //   deactivateCard();
          // }
          dispatch({
            type: actionTypes.SET_LOADER,
            payload: false,
          });
        } else {
          if (response?.headers?.['x-auth-next-token']) {
            dispatch({
              type: actionTypes.SET_TOKEN,
              payload: response?.headers?.['x-auth-next-token'],
            });
          }
          if (sessionControl(response)) {
            navigation.dispatch(
              CommonActions.reset({
                index: 0,
                routes: [{name: 'Login'}],
              }),
            );
            dispatch({
              type: actionTypes.CLEAR_APP_DATA,
            });
          }

          dispatch({
            type: actionTypes.SET_LOADER,
            payload: false,
          });

          dispatch({
            type: actionTypes.SET_ELSE_RESPONSE_ALERT,
            payload: {
              state: true,
              alertTitle: '',
              alertText: response.data?.data?.message
                ? response.data.data.message
                : response.data.responseDescription,
            },
          });
        }
      })
      .catch((error) => {
        dispatch({
          type: actionTypes.SET_LOADER,
          payload: false,
        });
        let message = '';
        if (!error.status) {
          // network err
          message = Message.networkErrorMessage;
        } else {
          message = String(error);
        }
        dispatch({
          type: actionTypes.SET_ELSE_RESPONSE_ALERT,
          payload: {
            state: true,
            alertTitle: 'Add Account',
            alertText: message,
          },
        });
      });
  };

// ***** ENDS TOKEN STATE UPDATE ***** //

export const activateVirtualCard =
  (navigation, param, changeCardPin) => async (dispatch) => {
    dispatch({
      type: actionTypes.SET_LOADER,
      payload: true,
    });

    axios
      .post(
        `${Config.base_url.UAT_URL}${Config.method.gateway}/${Config.endpoint.tokenStateUpdate}`,
        {
          deviceID: store.getState().reducers.fcmToken,
          enrollID: store.getState().reducers.virtualCardObject.enrollID,
          token: store.getState().reducers.virtualCardObject.token,
          tokenAction: 'ACTIVATE',
        },
        {
          headers: {'X-Auth-Token': store.getState().reducers.token},
        },
      )
      .then((response2) => {
        if (response2.status === 200 && response2.data.responseCode === '00') {
          let object = {
            ...store.getState().reducers.virtualCardObject,
            tokenState: 'ACTIVE',
            username: store.getState().reducers.userSignedIn,
          };

          dispatch(
            setKeyChainObject({
              virtualCardData: object,
              virtualCardStatus: object.tokenState,
            }),
          );
          dispatch({
            type: actionTypes.SET_TOKEN,
            payload: response2.headers['x-auth-next-token'],
          });
          dispatch({
            type: actionTypes.SET_LOADER,
            payload: false,
          });

          if (changeCardPin) {
            dispatch({
              type: actionTypes.SET_ELSE_RESPONSE_ALERT,
              payload: {
                state: true,
                alertTitle: '',
                alertText: 'Pin reset successfully',
              },
            });
          } else {
            dispatch({
              type: actionTypes.SET_ELSE_RESPONSE_ALERT,
              payload: {
                state: true,
                alertTitle: '',
                alertText: I18n['Digital Debit Card PIN successfully created'],
                onPress: () => {
                  navigation.dispatch(
                    CommonActions.reset({
                      index: 0,
                      routes: [{name: 'Home'}],
                    }),
                  );
                },
              },
            });
          }

          // }
        } else {
          if (response2.headers['x-auth-next-token']) {
            dispatch({
              type: actionTypes.SET_VIRTUAL_CARD_MPIN,
              payload: false,
            });

            dispatch({
              type: actionTypes.SET_TOKEN,
              payload: response2.headers['x-auth-next-token'],
            });
          }
          if (sessionControl(response2)) {
            navigation.dispatch(
              CommonActions.reset({
                index: 0,
                routes: [{name: 'Login'}],
              }),
            );
            dispatch({
              type: actionTypes.CLEAR_APP_DATA,
            });
          }

          dispatch({
            type: actionTypes.SET_LOADER,
            payload: false,
          });

          dispatch({
            type: actionTypes.SET_ELSE_RESPONSE_ALERT,
            payload: {
              state: true,
              alertTitle: '',
              alertText: response2.data?.data?.message
                ? response2.data.data.message
                : response2.data.responseDescription,
            },
          });
        }
      })
      .catch((error2) => {
        dispatch({
          type: actionTypes.SET_LOADER,
          payload: false,
        });
        let message = '';
        if (!error2.status) {
          // network err
          message = Message.networkErrorMessage;
        } else {
          message = String(error2);
        }
        dispatch({
          type: actionTypes.SET_ELSE_RESPONSE_ALERT,
          payload: {
            state: true,
            alertTitle: 'Add Account',
            alertText: message,
          },
        });
      });
  };

// ***** GET VIRTUAL CARD STATUS STATE ***** //

export const getVirtualCardStatus = () => async (dispatch) => {
  const credentials = await Keychain.getGenericPassword();
  let parsedCredential;
  if (credentials) {
    parsedCredential = JSON.parse(credentials.password);
  } else {
    parsedCredential = {};
  }

  if (parsedCredential.virtualCardStatus) {
    dispatch({
      type: actionTypes.SET_VIRTUAL_CARD_STATUS,
      payload: parsedCredential.virtualCardStatus,
    });
  } else {
    dispatch({
      type: actionTypes.SET_VIRTUAL_CARD_STATUS,
      payload: 'DEACTIVE',
    });
  }
};

// ***** ENDS GET VIRTUAL CARD STATUS STATE ***** //

// ***** SET VIRTUAL CARD STATUS STATE ***** //
export const setVirtualCardStatus = (param) => async (dispatch) => {
  dispatch(setKeyChainObject({virtualCardStatus: param}));
  dispatch({
    type: actionTypes.SET_VIRTUAL_CARD_STATUS,
    payload: param,
  });
};
// ***** ENDS SET VIRTUAL CARD STATUS STATE ***** //

// ***** scanned qr object ***** //

export const setQrObject = (param) => async (dispatch) => {
  dispatch({
    type: actionTypes.SET_SCANNED_QR_OBJECT,
    payload: param,
  });
};

// ***** ends scanned qr object ***** //

export const apiTriggered = (state) => async (dispatch) => {
  dispatch({
    type: actionTypes.SET_API_HIT,
    payload: state,
  });
};

export const setQrString = (string) => async (dispatch) => {
  dispatch({
    type: actionTypes.SET_QR_STRING,
    payload: string,
  });
};

// ***** GET MAP DATA ***** //
export const getMapData = (param, navigation) => async (dispatch) => {
  dispatch({
    type: actionTypes.SET_LOADER,
    payload: true,
  });

  if (store.getState().reducers.isLoginState) {
    axios
      .get(`${Config.base_url.UAT_URL}${Config.method.webpages}/${param}`, {
        headers: {'X-Auth-Token': store.getState().reducers.token},
      })
      .then((response) => {
        if (response.status === 200 && response.data.responseCode === '00') {
          let data = response.data?.data?.atmRecords
            ? response.data.data.atmRecords
            : response.data.data.branchRecords;
          dispatch({
            type: actionTypes.SET_TOKEN,
            payload: response?.headers?.['x-auth-next-token'],
          });
          dispatch({
            type: actionTypes.SET_MAP_DATA,
            payload: data,
          });
          dispatch({
            type: actionTypes.SET_LOADER,
            payload: false,
          });
        } else {
          if (response?.headers?.['x-auth-next-token']) {
            dispatch({
              type: actionTypes.SET_TOKEN,
              payload: response?.headers?.['x-auth-next-token'],
            });
          }
          if (response.data.responseCode === '606') {
            navigation.dispatch(
              CommonActions.reset({
                index: 0,
                routes: [{name: 'Login'}],
              }),
            );
            dispatch({
              type: actionTypes.CLEAR_APP_DATA,
            });
          }
          dispatch({
            type: actionTypes.SET_LOADER,
            payload: false,
          });
          dispatch({
            type: actionTypes.SET_ELSE_RESPONSE_ALERT,
            payload: {
              state: true,
              alertTitle: '',
              alertText: response.data?.data?.message
                ? response.data.data.message
                : response.data.responseDescription,
            },
          });
        }
      })
      .catch((error) => {
        dispatch({
          type: actionTypes.SET_LOADER,
          payload: false,
        });
      });
  } else {
    axios
      .get(`${Config.base_url.UAT_URL}${Config.method.webpages}/${param}`)
      .then((response) => {
        if (response.status === 200 && response.data.responseCode === '00') {
          let data = response.data?.data?.atmRecords
            ? response.data.data.atmRecords
            : response.data.data.branchRecords;
          dispatch({
            type: actionTypes.SET_MAP_DATA,
            payload: data,
          });
          dispatch({
            type: actionTypes.SET_LOADER,
            payload: false,
          });
        } else {
          dispatch({
            type: actionTypes.SET_MAP_DATA,
            payload: [],
          });
          dispatch({
            type: actionTypes.SET_LOADER,
            payload: false,
          });
          dispatch({
            type: actionTypes.SET_ELSE_RESPONSE_ALERT,
            payload: {
              state: true,
              alertTitle: '',
              alertText: response.data?.data?.message
                ? response.data.data.message
                : response.data.responseDescription,
            },
          });
        }
      })
      .catch((error) => {
        dispatch({
          type: actionTypes.SET_LOADER,
          payload: false,
        });
      });
  }
};

// ***** ENDS GET MAP DATA ***** //

// ***** SET MAP DATA ***** //
export const clearAppData = () => async (dispatch) => {
  dispatch({
    type: actionTypes.CLEAR_APP_DATA,
  });
};
export const setMapData = (data) => async (dispatch) => {
  dispatch({
    type: actionTypes.SET_MAP_DATA,
    payload: data,
  });
};

// ***** ENDS SET MAP DATA ***** //

// ***** FORGOT CHANGE MPIN *****//

export const changeForgotMpin = (param, navigation) => async (dispatch) => {
  dispatch({
    type: actionTypes.SET_LOADER,
    payload: true,
  });
  axios
    .post(
      `${Config.base_url.UAT_URL}${Config.method.my}/${Config.endpoint.mobileLimits}`,
      {},
      {
        headers: {},
      },
    )
    .then((response) => {})
    .catch((error) => {});
};

// ***** ENDS FORGOT CHANGE MPIN *****//

// ****** ATM AND MERCHANT MARKER PINS UPDATE *****//

export const updateAtmMarkerPins = (pins) => async (dispatch) => {
  dispatch({
    type: actionTypes.SET_ATM_MARKER_PINS,
    payload: pins,
  });
};
export const updateMerchantMarkerPins = (pins) => async (dispatch) => {
  dispatch({
    type: actionTypes.SET_MERCHANT_MARKER_PINS,
    payload: pins,
  });
};

// ****** ENDS ATM AND MERCHANT MARKER PINS UPDATE *****//

// ***** STARTS NFC ACTIONS ***** //

export const triggerNfcCheck = () => async (dispatch) => {
  dispatch({
    type: actionTypes.SET_NFC_CHECK_TRIGGERED_STATE,
    payload: true,
  });
};

export const nfcSupportState = (state) => async (dispatch) => {
  dispatch({
    type: actionTypes.SET_NFC_SUPPORT_STATE,
    payload: state,
  });
};

export const nfcEnableState = (state) => async (dispatch) => {
  dispatch({
    type: actionTypes.SET_NFC_ENABLE_STATE,
    payload: state,
  });
};

// ***** ENDS NFC ACTIONS ***** //
//******START OF CITY CODE********* */
export const getcitycode = (token, navigation) => async (dispatch) => {
  dispatch({
    type: actionTypes.SET_LOADER,
    payload: true,
  });

  logs.logRequest(
    `${Config.base_url.UAT_URL}${Config.method.my}/${Config.endpoint.citycode},
    {
      channel: ${Config.channel.channel},
      headers: {
        'X-Auth-Token': ${token},
      },
    },-`,
  );
  axios
    .get(
      `${Config.base_url.UAT_URL}${Config.method.my}/${Config.endpoint.citycode}`,
      {
        channel: `${Config.channel.channel}`,
        headers: {
          'X-Auth-Token': token,
        },
      },
    )
    .then((response) => {
      logs.logResponse(response.data);
      if (response.status === 200 && response.data.responseCode === '00') {
        dispatch({
          type: actionTypes.SET_TOKEN,
          payload: response?.headers?.['x-auth-next-token'],
        });
        dispatch({
          type: actionTypes.SET_CITY_CODE,
          payload: response.data.data.cityCode,
        });
        navigation.navigate('Cardissuance');

        dispatch({
          type: actionTypes.SET_LOADER,
          payload: false,
        });
      } else {
        if (response?.headers?.['x-auth-next-token']) {
          dispatch({
            type: actionTypes.SET_TOKEN,
            payload: response?.headers?.['x-auth-next-token'],
          });
        }
        dispatch({
          type: actionTypes.SET_LOADER,
          payload: false,
        });
        if (sessionControl(response)) {
          navigation.dispatch(
            CommonActions.reset({
              index: 0,
              routes: [{name: 'Login'}],
            }),
          );
          dispatch({
            type: actionTypes.CLEAR_APP_DATA,
          });
          dispatch({
            type: actionTypes.SET_ELSE_RESPONSE_ALERT,
            payload: {
              state: true,
              alertTitle: '',
              alertText: response.data?.data?.message
                ? response.data.data.message
                : response.data.responseDescription,
            },
          });
        } else {
          dispatch({
            type: actionTypes.SET_ELSE_RESPONSE_ALERT,
            payload: {
              state: true,
              alertTitle: '',
              alertText: response.data?.data?.message
                ? response.data.data.message
                : response.data.responseDescription,
            },
          });
        }
      }
    })
    .catch((error) => {
      navigation.goBack();

      dispatch({
        type: actionTypes.SET_LOADER,
        payload: false,
      });
      let message = '';
      if (!error.status) {
        // network error
        message = Message.networkErrorMessage;
      } else {
        message = String(error);
      }
      dispatch({
        type: actionTypes.SET_ELSE_RESPONSE_ALERT,
        payload: {
          state: true,
          alertTitle: '',
          alertText: message,
        },
      });
    });
};
//*********END OF CITY CODE */
//************START OF THE CARD ISSUANCE **********//
export const debit_card_issuance =
  (navigation, params, clearMpin) => async (dispatch) => {
    dispatch({
      type: actionTypes.SET_LOADER,
      payload: true,
    });
    logs.logRequest(
      `${Config.base_url.UAT_URL}${Config.method.transfer}/${
        Config.method.rda
      }/${Config.endpoint.cardissuance},
    ${JSON.stringify(params)},
    {
      headers: {'X-Auth-Token': ${store.getState().reducers.token}},
    },`,
    );

    axios
      .post(
        `${Config.base_url.UAT_URL}${Config.method.debitcard}/${Config.endpoint.cardissuance}`,
        params,
        {
          headers: {'X-Auth-Token': store.getState().reducers.token},
        },
      )

      .then((response) => {
        logs.logResponse(response.data);
        if (response.status === 200 && response.data.responseCode === '00') {
          dispatch({
            type: actionTypes.SET_TOKEN,
            payload: response?.headers?.['x-auth-next-token'],
          });

          //if success take to  navigation.navigate('DebitCardReferral',params)

          dispatch({
            type: actionTypes.SET_ELSE_RESPONSE_ALERT,
            payload: {
              state: true,
              alertTitle: '',
              alertText: response.data?.data?.message,
              onPress: () => {
                navigation.navigate('ShowCards');
              },
            },
          });

          dispatch({
            type: actionTypes.SET_LOADER,
            payload: false,
          });
        } else {
          const invalidSession = sessionControl(response);
          const incorrectMpin = response.data.responseCode === '02';
          if (invalidSession) {
            navigation.dispatch(
              CommonActions.reset({
                index: 0,
                routes: [{name: 'Login'}],
              }),
            );
            dispatch({
              type: actionTypes.CLEAR_APP_DATA,
            });
          }

          if (response?.headers?.['x-auth-next-token']) {
            dispatch({
              type: actionTypes.SET_TOKEN,
              payload: response?.headers?.['x-auth-next-token'],
            });
          }
          dispatch({
            type: actionTypes.SET_LOADER,
            payload: false,
          });
          dispatch({
            type: actionTypes.SET_ELSE_RESPONSE_ALERT,
            payload: {
              state: true,
              alertTitle: '',
              alertText: response.data?.data?.message
                ? response.data.data.message
                : response.data.responseDescription,
              onPress: invalidSession
                ? false
                : incorrectMpin
                ? () => {
                    clearMpin();
                  }
                : () => {
                    navigation.navigate('ShowCards');
                  },
            },
          });
        }
      })
      .catch((error) => {
        logs.log(`error : ${error}`);
        dispatch({
          type: actionTypes.SET_LOADER,
          payload: false,
        });
        navigation.navigate('ShowCards');
      });
  };
//************END OF CARD ISSUANCE****************//
//******START OF GET CARD STATUS********* */
export const get_card_status =
  (card_number, navigation, onPressFunction) => async (dispatch) => {
    dispatch({
      type: actionTypes.SET_LOADER,
      payload: true,
    });
    logs.logRequest(
      `${Config.base_url.UAT_URL}${Config.method.transfer}/${
        Config.method.rda
      }/${Config.endpoint.getcardstatus}/${card_number},
      {
        channel: ${Config.channel.channel},
        headers: {'X-Auth-Token': ${store.getState().reducers.token}},
      },`,
    );
    axios
      .get(
        `${Config.base_url.UAT_URL}${Config.method.debitcard}/${Config.endpoint.getcardstatus}/${card_number}`,
        {
          channel: `${Config.channel.channel}`,
          headers: {'X-Auth-Token': store.getState().reducers.token},
        },
      )
      .then((response) => {
        logs.logResponse(response.data);
        if (response.status === 200 && response.data.responseCode === '00') {
          dispatch({
            type: actionTypes.SET_TOKEN,
            payload: response?.headers?.['x-auth-next-token'],
          });
          // dispatch({
          //   type: actionTypes.SET_ELSE_RESPONSE_ALERT,
          //   payload: {
          //     state: true,
          //     alertTitle: '',
          //     alertText: `Your Card Status is ${response.data?.data?.cardStatus}`,
          //   },
          // });
          dispatch({
            type: actionTypes.SET_DEBIT_CARD_STATUS,
            payload: response.data?.data?.cardStatus
              ? response.data?.data?.cardStatus
              : '',
          });

          dispatch({
            type: actionTypes.SET_LOADER,
            payload: false,
          });
          if (onPressFunction) {
            if (
              String(response.data?.data?.cardStatus)
                .toLocaleLowerCase()
                .includes('hot')
            ) {
              setTimeout(() => {
                dispatch({
                  type: actionTypes.SET_ELSE_RESPONSE_ALERT,
                  payload: {
                    state: true,
                    alertTitle: '',
                    alertText: `Card Status is ${response.data.data.cardStatus}`,
                  },
                });
              }, 500);
            } else {
              onPressFunction();
            }
          }
        } else {
          if (response?.headers?.['x-auth-next-token']) {
            dispatch({
              type: actionTypes.SET_TOKEN,
              payload: response?.headers?.['x-auth-next-token'],
            });
          }
          if (sessionControl(response)) {
            navigation.dispatch(
              CommonActions.reset({
                index: 0,
                routes: [{name: 'Login'}],
              }),
            );
            dispatch({
              type: actionTypes.CLEAR_APP_DATA,
            });
          }

          dispatch({
            type: actionTypes.SET_LOADER,
            payload: false,
          });

          dispatch({
            type: actionTypes.SET_ELSE_RESPONSE_ALERT,
            payload: {
              state: true,
              alertTitle: '',
              alertText: response.data?.data?.message
                ? response.data.data.message
                : response.data.responseDescription,
            },
          });
        }
      })
      .catch((error) => {
        logs.log(`error : ${JSON.stringify(error)}`);
        navigation.goBack();

        dispatch({
          type: actionTypes.SET_LOADER,
          payload: false,
        });
        let message = '';
        if (!error.status) {
          // network error
          message = Message.networkErrorMessage;
        } else {
          message = String(error);
        }
        dispatch({
          type: actionTypes.SET_ELSE_RESPONSE_ALERT,
          payload: {
            state: true,
            alertTitle: '',
            alertText: message,
          },
        });
      });
  };
//*********END OF GET CARD STATUS */
//**9**********START OF THE CHANGE  CARD STATUS **********//
export const change_card_status =
  (navigation, params, clearMpin, onSuccess) => async (dispatch) => {
    dispatch({
      type: actionTypes.SET_LOADER,
      payload: true,
    });
    logs.logRequest(
      `${Config.base_url.UAT_URL}${Config.method.transfer}/${
        Config.method.rda
      }/${Config.endpoint.cardverify},
  {
    accountNo: ${params.accountNo},
    cardNumber: ${params.cardNumber},
    expiryDate: '',
    newPin: '',
    otp: ${params.otp},
    pageName: 'changecardstatus',
    comment:${params.comment}

  },
  {
    headers: {'X-Auth-Token': ${store.getState().reducers.token}},
  },`,
    );
    axios
      .post(
        `${Config.base_url.UAT_URL}${Config.method.debitcard}/${Config.endpoint.cardverify}`,
        {
          accountNo: params.accountNo,
          cardNumber: params.cardNumber,
          expiryDate: '',
          newPin: '',
          otp: params.otp,
          pageName: 'changecardstatus',
          comment: params.comment,
        },
        {
          headers: {'X-Auth-Token': store.getState().reducers.token},
        },
      )

      .then((response) => {
        logs.logResponse(response.data);
        if (response.status === 200 && response.data.responseCode === '00') {
          dispatch({
            type: actionTypes.SET_TOKEN,
            payload: response?.headers?.['x-auth-next-token'],
          });
          logs.logRequest(
            `${Config.base_url.UAT_URL}${Config.method.transfer}/${
              Config.method.rda
            }/${Config.endpoint.changecardstatus},
          ${JSON.stringify(params)},
          {
            headers: {'X-Auth-Token': ${store.getState().reducers.token}},
          },`,
          );
          axios
            .post(
              `${Config.base_url.UAT_URL}${Config.method.debitcard}/${Config.endpoint.changecardstatus}`,
              params,
              {
                headers: {'X-Auth-Token': store.getState().reducers.token},
              },
            )

            .then((response) => {
              logs.logResponse(response.data);
              if (
                response.status === 200 &&
                response.data.responseCode === '00'
              ) {
                dispatch({
                  type: actionTypes.SET_TOKEN,
                  payload: response?.headers?.['x-auth-next-token'],
                });

                dispatch({
                  type: actionTypes.SET_ELSE_RESPONSE_ALERT,
                  payload: {
                    state: true,
                    alertTitle: '',
                    alertText: I18n['Card Status has been changed'],
                    onPress: () => {
                      navigation.navigate('ShowCards');
                    },
                  },
                });
                // onSuccess();
                // navigation.navigate('CardManagment');
                // navigation.navigate('ShowCards');

                dispatch({
                  type: actionTypes.SET_LOADER,
                  payload: false,
                });
              } else {
                const invalidSession = sessionControl(response);
                const incorrectMpin = response.data.responseCode === '02';

                if (invalidSession) {
                  navigation.dispatch(
                    CommonActions.reset({
                      index: 0,
                      routes: [{name: 'Login'}],
                    }),
                  );
                  dispatch({
                    type: actionTypes.CLEAR_APP_DATA,
                  });
                }

                if (response?.headers?.['x-auth-next-token']) {
                  dispatch({
                    type: actionTypes.SET_TOKEN,
                    payload: response?.headers?.['x-auth-next-token'],
                  });
                }
                dispatch({
                  type: actionTypes.SET_LOADER,
                  payload: false,
                });
                dispatch({
                  type: actionTypes.SET_ELSE_RESPONSE_ALERT,
                  payload: {
                    state: true,
                    alertTitle: '',
                    alertText: response.data?.data?.message
                      ? response.data.data.message
                      : response.data.responseDescription,
                    onPress: invalidSession
                      ? false
                      : incorrectMpin
                      ? () => {
                          clearMpin();
                        }
                      : () => {
                          navigation.navigate('ShowCards');
                        },
                  },
                });
                // navigation.navigate('CardManagment');
              }
            })
            .catch((error) => {
              logs.log(`error : ${error}`);
              dispatch({
                type: actionTypes.SET_LOADER,
                payload: false,
              });
            });
        } else {
          const invalidSession = sessionControl(response);
          const incorrectMpin = response.data.responseCode === '02';

          if (invalidSession) {
            navigation.dispatch(
              CommonActions.reset({
                index: 0,
                routes: [{name: 'Login'}],
              }),
            );
            dispatch({
              type: actionTypes.CLEAR_APP_DATA,
            });
          }

          if (response?.headers?.['x-auth-next-token']) {
            dispatch({
              type: actionTypes.SET_TOKEN,
              payload: response?.headers?.['x-auth-next-token'],
            });
          }
          dispatch({
            type: actionTypes.SET_LOADER,
            payload: false,
          });
          dispatch({
            type: actionTypes.SET_ELSE_RESPONSE_ALERT,
            payload: {
              state: true,
              alertTitle: '',
              alertText: response.data?.data?.message
                ? response.data.data.message
                : response.data.responseDescription,
              onPress:
                invalidSession || incorrectMpin
                  ? false
                  : () => {
                      navigation.navigate('ShowCards');
                    },
            },
          });
        }
      })
      .catch((error) => {
        logs.log(`error : ${error}`);
        dispatch({
          type: actionTypes.SET_LOADER,
          payload: false,
        });
      });
  };
//************END OF CHANGE  CARD STATUS****************//
export const card_status = (state) => async (dispatch) => {
  dispatch({type: actionTypes.SET_DEBIT_CARD_STATUS, payload: state});
};
//************END OF CHANGE  CARD STATUS****************//

//**9**********START OF THE CARD ACTIVATION **********//
export const card_activation =
  (navigation, params, clearMpin, isCardChangePinFlow) => async (dispatch) => {
    dispatch({
      type: actionTypes.SET_LOADER,
      payload: true,
    });
    logs.logRequest(
      `${Config.base_url.UAT_URL}/${Config.method.debitcard}/${
        Config.endpoint.cardactivation
      },
  ${JSON.stringify(params)},
  {
    headers: {'X-Auth-Token': ${store.getState().reducers.token}},
  },`,
    );
    axios
      .post(
        `${Config.base_url.UAT_URL}${Config.method.debitcard}/${Config.endpoint.cardactivation}`,
        params,
        {
          headers: {'X-Auth-Token': store.getState().reducers.token},
        },
      )

      .then((response) => {
        logs.logResponse(response.data);
        if (response.status === 200 && response.data.responseCode === '00') {
          dispatch({
            type: actionTypes.SET_TOKEN,
            payload: response?.headers?.['x-auth-next-token'],
          });
          dispatch({
            type: actionTypes.SET_LOADER,
            payload: false,
          });
          // if(isCardChangePinFlow) //show the following alert and take back to card management screen else proceed to referral code screen navigation.navigate('DebitCardReferral',params)
          dispatch({
            type: actionTypes.SET_ELSE_RESPONSE_ALERT,
            payload: {
              state: true,
              alertTitle: 'Card Activation',
              alertText: response.data?.data?.message
                ? response.data?.data?.message
                : response.data?.message
                ? response.data?.message
                : '',
              onPress: () => {
                navigation.navigate('ShowCards');
              },
            },
          });
          // navigation.navigate('DebitCardReferral',params)
        } else {
          const invalidSession = sessionControl(response);
          const incorrectMpin = response.data.responseCode === '58';

          if (invalidSession) {
            navigation.dispatch(
              CommonActions.reset({
                index: 0,
                routes: [{name: 'Login'}],
              }),
            );
            dispatch({
              type: actionTypes.CLEAR_APP_DATA,
            });
          }

          if (response?.headers?.['x-auth-next-token']) {
            dispatch({
              type: actionTypes.SET_TOKEN,
              payload: response?.headers?.['x-auth-next-token'],
            });
          }
          dispatch({
            type: actionTypes.SET_LOADER,
            payload: false,
          });
          dispatch({
            type: actionTypes.SET_ELSE_RESPONSE_ALERT,
            payload: {
              state: true,
              alertTitle: '',
              alertText: response.data?.data?.message
                ? response.data.data.message
                : response.data.responseDescription,
              onPress: invalidSession
                ? false
                : incorrectMpin
                ? () => {
                    clearMpin();
                  }
                : () => {
                    navigation.navigate('ShowCards');
                  },
            },
          });
          // navigation.navigate('CardManagment');
        }
      })
      .catch((error) => {
        logs.log(`catch error ${error}`);
        dispatch({
          type: actionTypes.SET_LOADER,
          payload: false,
        });
      });
  };
//**9**********END OF THE CARD ACTIVATION **********//

// IS LOGIN STATE

export const setIsLoginState = (state) => async (dispatch) => {
  dispatch({
    type: actionTypes.SET_IS_LOGIN_STATE,
    payload: state,
  });
};

// ENDS IS LOGIN STATE

export const checkCertificatePinning = () => async (dispatch) => {
  fetch(Config.base_url.authenticate, {
    method: 'GET',
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error(`Status ${response.status}`);
      }
    })
    .catch((error) => {
      this.setState({sslPinningAlert: true});
    });
};
import {fetch} from 'react-native-ssl-pinning';
import {Message} from '../../Constant/Messages';
import {ptoMQRParser} from '../../Helpers/Helper';

// set ssl pin state

export const setSslSuccessPinState = (state) => async (dispatch) => {
  dispatch({
    type: actionTypes.SET_SSL_PIN_SUCCESS_STATE,
    payload: state,
  });
};

// end ssl pin set state

// set keychain object
export const updateKeyChainObject = (object) => async (dispatch) => {
  let tempObject = {...store.getState().reducers.keychainObject, object};
  await Keychain.setGenericPassword(
    'keyChainObject',
    JSON.stringify(tempObject),
  );
  dispatch({
    type: actionTypes.SET_KEYCHAIN_OBJECT,
    payload: tempObject,
  });
};
// ends set keychain object

export const setKeyChainObject = (object) => async (dispatch) => {
  logs.log(`setKeychainObject passed is : ${JSON.stringify(object)}`);
  let tempObject = {...store.getState().reducers.keychainObject, ...object};
  logs.log(
    `redux keychain object + appended object is : ${JSON.stringify(
      tempObject,
    )}`,
  );
  await Keychain.setGenericPassword(
    'keyChainObject',
    JSON.stringify(tempObject),
  );
  dispatch({
    type: actionTypes.SET_KEYCHAIN_OBJECT,
    payload: tempObject,
  });
};
export const functionSetKeyChainObject = (object) => async (dispatch) => {
  let tempObject = {...store.getState().reducers.keychainObject, ...object};
  await Keychain.setGenericPassword(
    'keyChainObject',
    JSON.stringify(tempObject),
  );
  dispatch({
    type: actionTypes.SET_KEYCHAIN_OBJECT,
    payload: tempObject,
  });
};
export const getBillerObject = () => async (dispatch) => {
  try {
    const credentials = await Keychain.getGenericPassword();
    // logs.log(`credentials are  ${JSON.stringify(credentials)}`);
    if (credentials) {
      logs.log('Billers are getting ');
      logs.log(
        `Billers successfully loaded for user credentials.username : ${credentials.username}  credentials.password ${credentials.password}`,
      );
      const parsedCredential = JSON.parse(credentials.password);
      logs.log(
        `parsedCredential  for Billers are : ${JSON.stringify(
          parsedCredential,
        )}`,
      );
      dispatch({
        type: actionTypes.SET_KEYCHAIN_OBJECT,
        payload: parsedCredential,
      });
    } else {
      logs.log('not getting any thing ');
    }
  } catch (errorBillers) {
    logs.log('1289371927312', errorBillers);
  }
};
export const getKeyChainObject = () => async (dispatch) => {
  logs.log('getKeyChainObject triggered ');
  let checkFirstEverInstallForKeychainClear = await AsyncStorage.getItem(
    'checkFirstEverInstallForKeychainClear',
  );
  logs.log(
    `checkFirstEverInstallForKeychainClear is  ${checkFirstEverInstallForKeychainClear}`,
  );
  let notFirstInstall = JSON.parse(checkFirstEverInstallForKeychainClear);
  logs.log(`notFirstInstall is 21873681263 ${notFirstInstall}`);
  if (notFirstInstall) {
    logs.log(
      `notFirstInstall conditiion triggered 213127631  ${notFirstInstall}`,
    );
    try {
      const credentials = await Keychain.getGenericPassword();
      logs.log(`credentials are  ${JSON.stringify(credentials)}`);
      if (credentials) {
        logs.log('if (credentials)  triggered ');
        logs.log(
          `Credentials successfully loaded for user credentials.username : ${credentials.username}  credentials.password ${credentials.password}`,
        );
        const parsedCredential = JSON.parse(credentials.password);
        logs.log(`parsedCredential : ${JSON.stringify(parsedCredential)}`);
        dispatch({
          type: actionTypes.SET_KEYCHAIN_OBJECT,
          payload: parsedCredential,
        });
        if (JailMonkey.isJailBroken() && Platform.OS == 'ios') {
          setTimeout(() => {
            if (!store.getState().reducers.jailBrokenAlertState) {
              dispatch(exitAlert());
            }
          }, 500);
        }
      } else {
        logs.log('keyCHain is being emptied ');
        await Keychain.setGenericPassword('keyChainObject', JSON.stringify({}));
        dispatch({
          type: actionTypes.SET_KEYCHAIN_OBJECT,
          payload: {},
        });
        if (JailMonkey.isJailBroken() && Platform.OS == 'ios') {
          setTimeout(() => {
            if (!store.getState().reducers.jailBrokenAlertState) {
              dispatch(exitAlert());
            }
          }, 500);
        }
      }
    } catch (errorString) {
      logs.log('error in getting the keyChain pokemon', errorString);
    }
  } else {
    //not first focus login display screen
    dispatch({
      type: actionTypes.SET_FINGER_PRINT_STATE,
      payload: false,
    });
    // if (Platform.OS === 'ios') {
    await AsyncStorage.setItem(
      'checkFirstEverInstallForKeychainClear',
      JSON.stringify(true),
    );
    // }

    await Keychain.setGenericPassword('keyChainObject', JSON.stringify({}));
    dispatch({
      type: actionTypes.SET_KEYCHAIN_OBJECT,
      payload: {},
    });
    if (JailMonkey.isJailBroken() && Platform.OS == 'ios') {
      setTimeout(() => {
        if (!store.getState().reducers.jailBrokenAlertState) {
          dispatch(exitAlert());
        }
      }, 500);
    }
  }
};

export const testFunction = (object) => async (dispatch) => {
  let appendObject = {...store.getState().reducers.keychainObject, ...object};
  dispatch({
    type: actionTypes.SET_KEYCHAIN_OBJECT,
    payload: appendObject,
  });
};

export const deleteKeychainObject = (objects) => async (dispatch) => {
  let tempObject = {...store.getState().reducers.keychainObject};
  let stored = {};
};

const updateWithDeletedKeychainObject = (object) => async (dispatch) => {
  logs.log(
    `updateWithDeletedKeychainObject triggered with new keychain is  ${object}`,
  );
  await Keychain.setGenericPassword('keyChainObject', JSON.stringify(object));
  dispatch({
    type: actionTypes.SET_KEYCHAIN_OBJECT,
    payload: object,
  });
};

//******START OF OVERVIEW********* */
export const overview = (navigation) => async (dispatch) => {
  logs.log('account over view wcall start ');
  dispatch({
    type: actionTypes.SET_LOADER,
    payload: true,
  });
  // start of over view
  logs.logRequest(
    `${Config.base_url.UAT_URL}${Config.method.my}/${Config.endpoint.overview},
    {
      channel: ${Config.channel.channel},
      headers: {'X-Auth-Token': ${store.getState().reducers.token}},
    },`,
  );
  axios
    .get(
      `${Config.base_url.UAT_URL}${Config.method.my}/${Config.endpoint.overview}`,
      {
        channel: `${Config.channel.channel}`,
        headers: {'X-Auth-Token': store.getState().reducers.token},
      },
    )
    .then((response_overview) => {
      logs.logResponse(response_overview.data);
      // logs.logResponse(response_overview.data);
      if (
        response_overview.status === 200 &&
        response_overview.data.responseCode === '00'
      ) {
        dispatch({
          type: actionTypes.SET_TOKEN,
          payload: response_overview.headers['x-auth-next-token'],
        });
        dispatch({
          type: actionTypes.SET_OVERVIEW,
          payload: response_overview.data.data.accounts,
        });
        dispatch({
          type: actionTypes.SET_LOADER,
          payload: false,
        });
        logs.log(
          `response_overview.data.data.accounts.cnic : ${response_overview?.data?.data?.accounts?.cnic}`,
        );
      } else {
        if (response_overview.headers['x-auth-next-token']) {
          dispatch({
            type: actionTypes.SET_TOKEN,
            payload: response_overview.headers['x-auth-next-token'],
          });
        }
        if (sessionControl(response_overview)) {
          navigation.dispatch(
            CommonActions.reset({
              index: 0,
              routes: [{name: 'Login'}],
            }),
          );
          dispatch({
            type: actionTypes.CLEAR_APP_DATA,
          });
        }

        dispatch({
          type: actionTypes.SET_LOADER,
          payload: false,
        });

        dispatch({
          type: actionTypes.SET_ELSE_RESPONSE_ALERT,
          payload: {
            state: true,
            alertTitle: '',
            alertText: response_overview.data?.data?.message
              ? response_overview.data.data.message
              : response_overview.data.responseDescription,
          },
        });
      }
    })
    .catch((error_overview) => {
      navigation.goBack();

      dispatch({
        type: actionTypes.SET_LOADER,
        payload: false,
      });
      let message = '';
      if (!error_overview.status) {
        // network error
        message = Message.networkErrorMessage;
      } else {
        message = String(error_overview);
      }
      dispatch({
        type: actionTypes.SET_ELSE_RESPONSE_ALERT,
        payload: {
          state: true,
          alertTitle: '',
          alertText: message,
        },
      });
    });
  //start of over view
};
//*********END OF OVERVIEW */

//************START OF THE ALIASE LINK **********//
export const alias_link =
  (screen_status, navigation, params, name, alias, onSuccess, onFaliure) =>
  async (dispatch) => {
    dispatch({
      type: actionTypes.SET_LOADER,
      payload: true,
    });

    logs.log(params);
    axios
      .post(
        `${Config.base_url.UAT_URL}${Config.method.raast}/${Config.method.registration}/${Config.endpoint.alias_link}`,
        params,
        {
          headers: {'X-Auth-Token': store.getState().reducers.token},
        },
      )

      .then((response) => {
        logs.log('params going in call ', response.config.data);
        if (response.status === 200 && response.data.responseCode === '00') {
          dispatch({
            type: actionTypes.SET_TOKEN,
            payload: response?.headers?.['x-auth-next-token'],
          });
          onSuccess();

          dispatch({
            type: actionTypes.SET_LOADER,
            payload: false,
          });
        } else {
          // onFaliure();
          if (sessionControl(response)) {
            navigation.dispatch(
              CommonActions.reset({
                index: 0,
                routes: [{name: 'Login'}],
              }),
            );
            dispatch({
              type: actionTypes.CLEAR_APP_DATA,
            });
          }

          if (response?.headers?.['x-auth-next-token']) {
            dispatch({
              type: actionTypes.SET_TOKEN,
              payload: response?.headers?.['x-auth-next-token'],
            });
          }
          dispatch({
            type: actionTypes.SET_LOADER,
            payload: false,
          });
          onFaliure(response.data.responseDescription);

          // dispatch({
          //   type: actionTypes.SET_ELSE_RESPONSE_ALERT,
          //   payload: {
          //     state: true,
          //     alertTitle: '',
          //     alertText: response.data?.data?.message
          //       ? response.data.data.message
          //       : response.data.responseDescription,
          //     onPress: () => {
          //       navigation.navigate('AliasManagment');
          //     },
          //   },
          // });
          // navigation.navigate('AliasManagment');
        }
      })
      .catch((error) => {
        logs.log(error);
        dispatch({
          type: actionTypes.SET_LOADER,
          payload: false,
        });
        navigation.navigate('AliasManagment');
      });
  };
//************START OF THE ALIASE LINK **********//

//************START OF THE ALIASE REGISTER **********//
export const alias_one_registration =
  (screen_status, navigation, params, name, alias, onSuccess, onFaliure) =>
  async (dispatch) => {
    dispatch({
      type: actionTypes.SET_LOADER,
      payload: true,
    });
    logs.log('BEFORE GOING TO REGISTER ', params);

    axios
      .post(
        `${Config.base_url.UAT_URL}${Config.method.raast}/${Config.method.registration}/${Config.endpoint.onestepregistation}`,
        params,
        {
          headers: {'X-Auth-Token': store.getState().reducers.token},
        },
      )

      .then((response) => {
        logs.log('response of one step register alias', response.data);
        if (response.status === 200 && response.data.responseCode === '00') {
          dispatch({
            type: actionTypes.SET_TOKEN,
            payload: response?.headers?.['x-auth-next-token'],
          });

          // navigation.navigate('SuccessnotSucess', {
          //   screen: screen_status,
          //   params: params,
          //   name: name,
          //   alias: alias,
          // });
          logs.log(response.data);
          onSuccess(params);

          dispatch({
            type: actionTypes.SET_LOADER,
            payload: false,
          });
        } else {
          if (sessionControl(response)) {
            navigation.dispatch(
              CommonActions.reset({
                index: 0,
                routes: [{name: 'Login'}],
              }),
            );
            dispatch({
              type: actionTypes.CLEAR_APP_DATA,
            });
          }

          if (response?.headers?.['x-auth-next-token']) {
            dispatch({
              type: actionTypes.SET_TOKEN,
              payload: response?.headers?.['x-auth-next-token'],
            });
            // navigation.navigate('AliasManagment');
          }
          dispatch({
            type: actionTypes.SET_LOADER,
            payload: false,
          });
          onFaliure(response.data.responseDescription);

          // dispatch({
          //   type: actionTypes.SET_ELSE_RESPONSE_ALERT,
          //   payload: {
          //     state: true,
          //     alertTitle: '',
          //     alertText: response.data?.data?.message
          //       ? response.data.data.message
          //       : response.data.responseDescription,
          //     onPress: () => {
          //       navigation.navigate('Dashboard');
          //     },
          //   },
          // });
          // navigation.navigate('AliasManagment');
        }
      })
      .catch((error) => {
        logs.log(`error : ${JSON.stringify(error)}`);
        dispatch({
          type: actionTypes.SET_LOADER,
          payload: false,
        });
        navigation.navigate('AliasManagment');
      });
  };
//************END OF THE ALIASE REGISTER **********//

//************START OF THE ALIASES UNLINK **********//
export const alias_unlink =
  (screen_status, navigation, params, name, alias, onSuccess, onFaliure) =>
  async (dispatch) => {
    dispatch({
      type: actionTypes.SET_LOADER,
      payload: true,
    });
    logs.logRequest(
      `${Config.base_url.UAT_URL}${Config.method.raast}/${
        Config.method.customeraccount
      }/${Config.endpoint.alias_unlink},
  ${JSON.stringify(params)},
  {
    headers: {'X-Auth-Token': ${store.getState().reducers.token}},
  },`,
    );

    axios
      .post(
        `${Config.base_url.UAT_URL}${Config.method.raast}/${Config.method.customeraccount}/${Config.endpoint.alias_unlink}`,
        params,
        {
          headers: {'X-Auth-Token': store.getState().reducers.token},
        },
      )

      .then((response) => {
        logs.logResponse(response.data);
        if (response.status === 200 && response.data.responseCode === '00') {
          dispatch({
            type: actionTypes.SET_TOKEN,
            payload: response?.headers?.['x-auth-next-token'],
          });
          dispatch({
            type: actionTypes.SET_ALIAS_ACC,
            payload: response.data.data,
          });
          onSuccess(response.data.responseDescription);

          // navigation.navigate('SuccessnotSucess', {
          //   screen: screen_status,
          //   params: params,
          //   name: name,
          //   alias: alias,
          // });

          dispatch({
            type: actionTypes.SET_LOADER,
            payload: false,
          });
        } else {
          // onFaliure();
          if (sessionControl(response)) {
            navigation.dispatch(
              CommonActions.reset({
                index: 0,
                routes: [{name: 'Login'}],
              }),
            );
            dispatch({
              type: actionTypes.CLEAR_APP_DATA,
            });
          }

          if (response?.headers?.['x-auth-next-token']) {
            dispatch({
              type: actionTypes.SET_TOKEN,
              payload: response?.headers?.['x-auth-next-token'],
            });
            navigation.navigate('AliasManagment');
          }
          dispatch({
            type: actionTypes.SET_LOADER,
            payload: false,
          });
          onFaliure(response.data.responseDescription);

          // dispatch({
          //   type: actionTypes.SET_ELSE_RESPONSE_ALERT,
          //   payload: {
          //     state: true,
          //     alertTitle: '',
          //     alertText: response.data?.data?.message
          //       ? response.data.data.message
          //       : response.data.responseDescription,
          //     onPress: () => {
          //       navigation.navigate('AliasManagment');
          //     },
          //   },
          // });
          // navigation.navigate('AliasManagment');
        }
      })

      .catch((error) => {
        logs.log(error);
        dispatch({
          type: actionTypes.SET_LOADER,
          payload: false,
        });
        navigation.navigate('AliasManagment');
      });
  };
//************START OF THE ALIASES UNLINK **********//

//************START OF THE ALIAS REMOVAL **********//
export const alias_removal =
  (screen_status, navigation, params, name, alias, onSuccess, onFaliure) =>
  async (dispatch) => {
    dispatch({
      type: actionTypes.SET_LOADER,
      payload: true,
    });
    logs.logRequest(
      `${Config.base_url.UAT_URL}${Config.method.raast}/${
        Config.method.customer
      }/${Config.endpoint.alias_delete},
  ${JSON.stringify(params)},
  {
    headers: {'X-Auth-Token': ${store.getState().reducers.token}},
  },`,
    );
    axios
      .post(
        `${Config.base_url.UAT_URL}${Config.method.raast}/${Config.method.customer}/${Config.endpoint.alias_delete}`,
        params,
        {
          headers: {'X-Auth-Token': store.getState().reducers.token},
        },
      )

      .then((response) => {
        logs.logResponse(response.data);
        if (response.status === 200 && response.data.responseCode === '00') {
          dispatch({
            type: actionTypes.SET_TOKEN,
            payload: response?.headers?.['x-auth-next-token'],
          });
          // onSuccess();
          // dispatch({
          //   type: actionTypes.SET_ELSE_RESPONSE_ALERT,
          //   payload: {
          //     state: true,
          //     alertTitle: '',
          //     alertText: response.data?.data?.message
          //       ? response.data.data.message
          //       : response.data.responseDescription,
          //     onPress: () => {
          //       navigation.navigate('AliasManagment');
          //     },
          //   },
          // });
          onSuccess(params);

          // navigation.navigate('SuccessnotSucess', {
          //   screen: screen_status,
          //   params: params,
          //   name: name,
          //   alias: alias,
          // });

          dispatch({
            type: actionTypes.SET_LOADER,
            payload: false,
          });
        } else {
          // onFaliure();
          if (sessionControl(response)) {
            navigation.dispatch(
              CommonActions.reset({
                index: 0,
                routes: [{name: 'Login'}],
              }),
            );
            dispatch({
              type: actionTypes.CLEAR_APP_DATA,
            });
          }

          if (response?.headers?.['x-auth-next-token']) {
            dispatch({
              type: actionTypes.SET_TOKEN,
              payload: response?.headers?.['x-auth-next-token'],
            });
            // navigation.navigate('AliasManagment');
          }
          dispatch({
            type: actionTypes.SET_LOADER,
            payload: false,
          });
          onFaliure(
            response.data?.data?.message
              ? response.data.data.message
              : response.data.responseDescription,
          );

          // dispatch({
          //   type: actionTypes.SET_ELSE_RESPONSE_ALERT,
          //   payload: {
          //     state: true,
          //     alertTitle: '',
          //     alertText: response.data?.data?.message
          //       ? response.data.data.message
          //       : response.data.responseDescription,
          //     onPress: () => {
          //       navigation.navigate('AliasManagment');
          //     },
          //   },
          // });
          // navigation.navigate('AliasManagment');
        }
      })
      .catch((error) => {
        logs.log(error);
        dispatch({
          type: actionTypes.SET_LOADER,
          payload: false,
        });
        navigation.navigate('AliasManagment');
      });
  };
//************START OF THE ALIAS REMOVAL **********//

//************START OF THE ALIASE GETTING **********//
export const alias_getaccounts = (navigation, params) => async (dispatch) => {
  dispatch({
    type: actionTypes.SET_LOADER,
    payload: true,
  });
  logs.logRequest(
    `${Config.base_url.UAT_URL}${Config.method.raast}/${
      Config.method.customeralias
    }/${Config.endpoint.alias_getaccounts},
    ${JSON.stringify(params)},
    {
      headers: {'X-Auth-Token': ${store.getState().reducers.token}},
    },`,
  );
  axios
    .post(
      `${Config.base_url.UAT_URL}${Config.method.raast}/${Config.method.customeralias}/${Config.endpoint.alias_getaccounts}`,
      params,
      {
        headers: {'X-Auth-Token': store.getState().reducers.token},
      },
    )

    .then((response) => {
      logs.logResponse(response.data);
      if (response.status === 200 && response.data.responseCode === '00') {
        dispatch({
          type: actionTypes.SET_TOKEN,
          payload: response?.headers?.['x-auth-next-token'],
        });
        dispatch({
          type: actionTypes.SET_ELSE_RESPONSE_ALERT,
          payload: {
            state: true,
            alertTitle: '',
            alertText: response.data?.data?.message
              ? response.data.data.message
              : response.data.responseDescription,
          },
        });

        dispatch({
          type: actionTypes.SET_LOADER,
          payload: false,
        });
      } else {
        if (sessionControl(response)) {
          navigation.dispatch(
            CommonActions.reset({
              index: 0,
              routes: [{name: 'Login'}],
            }),
          );
          dispatch({
            type: actionTypes.CLEAR_APP_DATA,
          });
        }

        if (response?.headers?.['x-auth-next-token']) {
          dispatch({
            type: actionTypes.SET_TOKEN,
            payload: response?.headers?.['x-auth-next-token'],
          });
          navigation.navigate('AliasManagment');
        }
        dispatch({
          type: actionTypes.SET_LOADER,
          payload: false,
        });
        dispatch({
          type: actionTypes.SET_ELSE_RESPONSE_ALERT,
          payload: {
            state: true,
            alertTitle: '',
            alertText: response.data?.data?.message
              ? response.data.data.message
              : response.data.responseDescription,
            onPress: () => {
              navigation.navigate('AliasManagment');
            },
          },
        });
        // navigation.navigate('AliasManagment');
      }
    })
    .catch((error) => {
      logs.log(error);
      dispatch({
        type: actionTypes.SET_LOADER,
        payload: false,
      });
      navigation.navigate('AliasManagment');
    });
};
//************START OF THE ALIASE GETTING **********//
//******START OF RAAST BANK LIST ********* */
export const getraastbanklist =
  (navigation, navigateto) => async (dispatch) => {
    const bankList = store.getState().reducers?.raastbank;
    const bankListLength = bankList.length;
    if (bankListLength == 0) {
      logs.log('bankListLength---->', bankListLength);
      dispatch({
        type: actionTypes.SET_LOADER,
        payload: true,
      });
      logs.logRequest(
        `${Config.base_url.UAT_URL}${Config.method.raast}/${
          Config.method.payment
        }/${Config.endpoint.getbanklist},
  {
    channel: ${Config.channel.channel},
    headers: {'X-Auth-Token': ${store.getState().reducers.token}},
  },`,
      );
      axios
        .get(
          `${Config.base_url.UAT_URL}${Config.method.raast}/${Config.method.payment}/${Config.endpoint.getbanklist}`,
          {
            channel: `${Config.channel.channel}`,
            headers: {'X-Auth-Token': store.getState().reducers.token},
          },
        )
        .then((response) => {
          logs.logResponse(response.data);
          if (response.status === 200 && response.data.responseCode === '00') {
            dispatch({
              type: actionTypes.SET_TOKEN,
              payload: response?.headers?.['x-auth-next-token'],
            });
            dispatch({
              type: actionTypes.SET_RAAST_BANK,
              payload: response.data.data,
            });
            dispatch({
              type: actionTypes.SET_LOADER,
              payload: false,
            });
            // navigation.navigate('by_iban');
            navigateto();
          } else {
            if (response?.headers?.['x-auth-next-token']) {
              dispatch({
                type: actionTypes.SET_TOKEN,
                payload: response?.headers?.['x-auth-next-token'],
              });
            }
            if (sessionControl(response)) {
              navigation.dispatch(
                CommonActions.reset({
                  index: 0,
                  routes: [{name: 'Login'}],
                }),
              );
              dispatch({
                type: actionTypes.CLEAR_APP_DATA,
              });
            }

            dispatch({
              type: actionTypes.SET_LOADER,
              payload: false,
            });

            dispatch({
              type: actionTypes.SET_ELSE_RESPONSE_ALERT,
              payload: {
                state: true,
                alertTitle: '',
                alertText: response.data?.data?.message
                  ? response.data.data.message
                  : response.data.responseDescription,
              },
            });
          }
        })
        .catch((error) => {
          logs.log(`error : ${JSON.stringify(error)}`);
          navigation.goBack();

          dispatch({
            type: actionTypes.SET_LOADER,
            payload: false,
          });
          let message = '';
          if (!error.status) {
            // network error
            message = Message.networkErrorMessage;
          } else {
            message = String(error);
          }
          dispatch({
            type: actionTypes.SET_ELSE_RESPONSE_ALERT,
            payload: {
              state: true,
              alertTitle: '',
              alertText: message,
            },
          });
        });
    } else {
      navigateto();
    }
  };
//*********END OF RAAST BANK LIST */
//************START OF PAYMENT TITLE FETCHL **********//
export const raast_payment_title_fetch =
  (screen_status, navigation, params) => async (dispatch) => {
    dispatch({
      type: actionTypes.SET_LOADER,
      payload: true,
    });
    logs.log(';;;;;;;;;;;;;;', JSON.stringify(params));
    logs.log(
      `${Config.base_url.UAT_URL}${Config.method.raast}/${Config.method.payment}/${Config.endpoint.titlefetch}`,
      {
        amount: params.amount,
        idType: params.idType,
        idValue: params.idValue,
        memberid: params.memberid,
        receiveriban: params.receiveriban,
      },
    );

    axios
      .post(
        `${Config.base_url.UAT_URL}${Config.method.raast}/${Config.method.payment}/${Config.endpoint.titlefetch}`,
        {
          amount: params.amount,
          idType: params.idType,
          idValue: '',
          memberid: params.memberid,
          receiveriban: params.receiveriban,
        },
        {
          headers: {'X-Auth-Token': store.getState().reducers.token},
        },
      )

      .then((response) => {
        logs.logResponse(response.data);
        if (response.status === 200 && response.data.responseCode === '00') {
          dispatch({
            type: actionTypes.SET_TOKEN,
            payload: response?.headers?.['x-auth-next-token'],
          });
          params.acctitle = response.data.data.acctitle;
          params.acctype = response.data.data.acctype;
          params.token = response.data.data.token;
          (params.fee = '0'),
            (params.narration = 'NBP RAAST PAYMENTS'),
            (params.rcvrEmailAddress = response.data?.data?.rcvrEmailAddress
              ? response.data.data.rcvrEmailAddress
              : ''),
            (params.rcvrMobileNumber = response.data?.data?.rcvrMobileNumber
              ? response.data.data.rcvrMobileNumber
              : ''),
            (params.receiverName = response.data.data.acctitle),
            (params.receiveriban = params.receiveriban);
          // navigateTo(screen,params)
          if (screen_status == 'ibanbybenef') {
            logs.log('RAASTBenefShowInfo');
            navigation.navigate('RAASTBenefShowInfo', {
              screen: 'iban',
              paramsAlias: response.data,
              param: params,
            });
          } else {
            logs.log('RAASTInfoShow', params, 'response', response.data);

            navigation.navigate('RAASTInfoShow', {
              screen: screen_status,
              param: params,
              paramsAlias: response.data,
            });
          }

          dispatch({
            type: actionTypes.SET_LOADER,
            payload: false,
          });
        } else {
          if (sessionControl(response)) {
            navigation.dispatch(
              CommonActions.reset({
                index: 0,
                routes: [{name: 'Login'}],
              }),
            );
            dispatch({
              type: actionTypes.CLEAR_APP_DATA,
            });
          }

          if (response?.headers?.['x-auth-next-token']) {
            dispatch({
              type: actionTypes.SET_TOKEN,
              payload: response?.headers?.['x-auth-next-token'],
            });
            // navigation.navigate('AliasManagment');
          }
          dispatch({
            type: actionTypes.SET_LOADER,
            payload: false,
          });
          dispatch({
            type: actionTypes.SET_ELSE_RESPONSE_ALERT,
            payload: {
              state: true,
              alertTitle: '',
              alertText: response.data?.data?.message
                ? response.data.data.message
                : response.data.responseDescription,
              onPress: () => {
                navigation.goBack();
                navigation.goBack();
              },
            },
          });
          // navigation.navigate('AliasManagment');
        }
      })
      .catch((error) => {
        logs.log(error);
        dispatch({
          type: actionTypes.SET_LOADER,
          payload: false,
        });
        navigation.goBack();
      });
  };
//************END OF PAYMENT TITLE FETCH **********//.

//************START OF PAYMENT TITLE FETCHL **********//
export const raastPaybyIBANTitleFetch =
  (screen_status, navigation, params, onSuccess) => async (dispatch) => {
    dispatch({
      type: actionTypes.SET_LOADER,
      payload: true,
    });
    logs.log(';;;;;;;;;;;;;;', JSON.stringify(params));
    logs.log(
      `${Config.base_url.UAT_URL}${Config.method.raast}/${Config.method.payment}/${Config.endpoint.titlefetch}`,
      {
        amount: params.amount,
        idType: params.idType,
        idValue: params.idValue,
        memberid: params.memberid,
        receiveriban: params.receiveriban,
      },
    );

    axios
      .post(
        `${Config.base_url.UAT_URL}${Config.method.raast}/${Config.method.payment}/${Config.endpoint.titlefetch}`,
        {
          amount: params.amount,
          idType: params.idType,
          idValue: '',
          memberid: params.memberid,
          receiveriban: params.receiveriban,
        },
        {
          headers: {'X-Auth-Token': store.getState().reducers.token},
        },
      )

      .then((response) => {
        logs.logResponse(response.data);
        if (response.status === 200 && response.data.responseCode === '00') {
          dispatch({
            type: actionTypes.SET_TOKEN,
            payload: response?.headers?.['x-auth-next-token'],
          });
          params.acctitle = response.data.data.acctitle;
          params.acctype = response.data.data.acctype;
          params.token = response.data.data.token;
          (params.fee = '0'),
            (params.narration = 'NBP RAAST PAYMENTS'),
            (params.rcvrEmailAddress = response.data?.data?.rcvrEmailAddress
              ? response.data.data.rcvrEmailAddress
              : ''),
            (params.rcvrMobileNumber = response.data?.data?.rcvrMobileNumber
              ? response.data.data.rcvrMobileNumber
              : ''),
            (params.receiverName = response.data.data.acctitle),
            (params.receiveriban = params.receiveriban);
          // navigateTo(screen,params)
          // if (screen_status == 'ibanbybenef') {
          //   logs.log('RAASTBenefShowInfo');
          //   navigation.navigate('RAASTBenefShowInfo', {
          //     screen: 'iban',
          //     paramsAlias: response.data,
          //     param: params,
          //   });
          // } else {
          logs.log('sadasdjkasghjdgadajkshdjhabsd======>', response?.data);
          onSuccess(screen_status, params, response.data);
          // logs.log('RAASTInfoShow', params, 'response', response.data);

          // navigation.navigate('RAASTInfoShow', {
          //   screen: screen_status,
          //   param: params,
          //   paramsAlias: response.data,
          // });

          dispatch({
            type: actionTypes.SET_LOADER,
            payload: false,
          });
        } else {
          if (sessionControl(response)) {
            navigation.dispatch(
              CommonActions.reset({
                index: 0,
                routes: [{name: 'Login'}],
              }),
            );
            dispatch({
              type: actionTypes.CLEAR_APP_DATA,
            });
          }

          if (response?.headers?.['x-auth-next-token']) {
            dispatch({
              type: actionTypes.SET_TOKEN,
              payload: response?.headers?.['x-auth-next-token'],
            });
            // navigation.navigate('AliasManagment');
          }
          dispatch({
            type: actionTypes.SET_LOADER,
            payload: false,
          });
          dispatch({
            type: actionTypes.SET_ELSE_RESPONSE_ALERT,
            payload: {
              state: true,
              alertTitle: '',
              alertText: response.data?.data?.message
                ? response.data.data.message
                : response.data.responseDescription,
              onPress: () => {
                navigation.goBack();
                navigation.goBack();
              },
            },
          });
          // navigation.navigate('AliasManagment');
        }
      })
      .catch((error) => {
        logs.log(error);
        dispatch({
          type: actionTypes.SET_LOADER,
          payload: false,
        });
        navigation.goBack();
      });
  };
//************END OF PAYMENT TITLE FETCH **********//.

//******START OF GET DEFAULT ACC BY ALIAS *** */
export const getdefaultaccounsbyalias =
  (screen_status, navigation, params, onSuccess) => async (dispatch) => {
    dispatch({
      type: actionTypes.SET_LOADER,
      payload: true,
    });
    logs.log(params.idType, params.idValue, params.amount, params.source_iban);
    axios
      .post(
        `${Config.base_url.UAT_URL}${Config.method.raast}/${Config.method.customeraccount}/${Config.endpoint.getdefaultaccountbyalias}`,

        {
          aliasType: params.idType,
          aliasValue: params.idValue,
          amount: params.amount,
          iban: params.source_iban,
        },
        {
          headers: {'X-Auth-Token': store.getState().reducers.token},
        },
      )

      .then((response) => {
        logs.logResponse(response.data);
        if (response.status === 200 && response.data.responseCode === '00') {
          dispatch({
            type: actionTypes.SET_TOKEN,
            payload: response?.headers?.['x-auth-next-token'],
          });
          onSuccess(screen_status, params, response);

          dispatch({
            type: actionTypes.SET_LOADER,
            payload: false,
          });
        } else {
          if (sessionControl(response)) {
            navigation.dispatch(
              CommonActions.reset({
                index: 0,
                routes: [{name: 'Login'}],
              }),
            );
            dispatch({
              type: actionTypes.CLEAR_APP_DATA,
            });
          }

          if (response?.headers?.['x-auth-next-token']) {
            dispatch({
              type: actionTypes.SET_TOKEN,
              payload: response?.headers?.['x-auth-next-token'],
            });
            // navigation.navigate('AliasManagment');
          }
          dispatch({
            type: actionTypes.SET_LOADER,
            payload: false,
          });
          dispatch({
            type: actionTypes.SET_ELSE_RESPONSE_ALERT,
            payload: {
              state: true,
              alertTitle: '',
              alertText: response.data?.data?.message
                ? response.data.data.message
                : response.data.responseDescription,
              onPress: () => {
                navigation.goBack();
                navigation.goBack();
              },
            },
          });
        }
      })
      .catch((error) => {
        logs.log(error);
        dispatch({
          type: actionTypes.SET_LOADER,
          payload: false,
        });
        navigation.goBack();
      });
  };
//******END OF GET DEFAULT ACC BY ALIAS *** */
export const setRaastList = (state) => async (dispatch) => {
  dispatch({
    type: actionTypes.SET_BANK_LIST,
    payload: state,
  });
};
//****************START OF  PAYMENT REQUEST ****************** *///
export const raastpyamentrequest =
  (screen_status, navigation, params, onSuccess) => async (dispatch) => {
    logs.log('RAAST PAY REQ STATUS>>>>>>>>>>>>', screen_status);
    logs.log('RAAST PAY REQ PARAMS>>>>>>>>>>>>', params);
    dispatch({
      type: actionTypes.SET_LOADER,
      payload: true,
    });

    logs.logRequest(
      `${Config.base_url.UAT_URL}${Config.method.raast}/${Config.method.payment}/${Config.endpoint.paymentrequest}`,

      params?.shortName
        ? {
            addBenef: params.isbenef ? false : true,
            benefiAlias: params?.shortName,
            amount: params.amount,
            fee: params.fee,
            iban: params.source_iban,
            idType: params.idType,
            idValue: params.idValue,
            isBenef: params.isbenef,
            narration: params.narration,
            otp: params.otp,
            paymentPurpose: params.pay_pur_id,
            rcvrEmailAddress: params.rcvrEmailAddress,
            rcvrMobileNumber: params.rcvrMobileNumber,
            receiverName: params.receiverName,
            receiveriban: params.receiveriban,
            receiverParticipantCode: params.memberid,
            // receiveriban: params.receiveriban,
            senderName: params.senderName,
            transactionDate: params.transactionDate,
            transactionTime: params.transactionTime,
            //ADDED BY TUFAIL BHAi  FOR PAYEMNTS
            paymentMethod: params.paymentMethod,
            //ADDED BY UMAR
            receiverAlias: params.receiverAlias,
          }
        : {
            amount: params.amount,
            fee: params.fee,
            iban: params.source_iban,
            idType: params.idType,
            idValue: params.idValue,
            isBenef: params.isbenef,
            narration: params.narration,
            otp: params.otp,
            paymentPurpose: params.pay_pur_id,
            rcvrEmailAddress: params.rcvrEmailAddress,
            rcvrMobileNumber: params.rcvrMobileNumber,
            receiverName: params.receiverName,
            receiveriban: params.receiveriban,
            receiverParticipantCode: params.memberid,
            // receiveriban: params.receiveriban,
            senderName: params.senderName,
            transactionDate: params.transactionDate,
            transactionTime: params.transactionTime,
            //ADDED BY TUFAIL BHAi  FOR PAYEMNTS
            paymentMethod: params.paymentMethod,
            //ADDED BY UMAR
            receiverAlias: params.receiverAlias,
          },
      {
        headers: {'X-Auth-Token': store.getState().reducers.token},
      },
    );

    axios
      .post(
        `${Config.base_url.UAT_URL}${Config.method.raast}/${Config.method.payment}/${Config.endpoint.paymentrequest}`,

        params?.shortName
          ? {
              addBenef: params.isbenef ? false : true,
              benefiAlias: params?.shortName,
              amount: params.amount,
              fee: params.fee,
              iban: params.source_iban,
              idType: params.idType,
              idValue: params.idValue,
              isBenef: params.isbenef,
              narration: params.narration,
              otp: params.otp,
              paymentPurpose: params.pay_pur_id,
              rcvrEmailAddress: params.rcvrEmailAddress,
              rcvrMobileNumber: params.rcvrMobileNumber,
              receiverName: params.receiverName,
              receiveriban: params.receiveriban,
              receiverParticipantCode: params.memberid,
              // receiveriban: params.receiveriban,
              senderName: params.senderName,
              transactionDate: params.transactionDate,
              transactionTime: params.transactionTime,
              //ADDED BY TUFAIL BHAi  FOR PAYEMNTS
              paymentMethod: params.paymentMethod,
              //ADDED BY UMAR
              receiverAlias: params.receiverAlias,
            }
          : {
              amount: params.amount,
              fee: params.fee,
              iban: params.source_iban,
              idType: params.idType,
              idValue: params.idValue,
              isBenef: params.isbenef,
              narration: params.narration,
              otp: params.otp,
              paymentPurpose: params.pay_pur_id,
              rcvrEmailAddress: params.rcvrEmailAddress,
              rcvrMobileNumber: params.rcvrMobileNumber,
              receiverName: params.receiverName,
              receiveriban: params.receiveriban,
              receiverParticipantCode: params.memberid,
              // receiveriban: params.receiveriban,
              senderName: params.senderName,
              transactionDate: params.transactionDate,
              transactionTime: params.transactionTime,
              //ADDED BY TUFAIL BHAi  FOR PAYEMNTS
              paymentMethod: params.paymentMethod,
              //ADDED BY UMAR
              receiverAlias: params.receiverAlias,
            },
        {
          headers: {'X-Auth-Token': store.getState().reducers.token},
        },
      )
      .then((response) => {
        logs.logResponse('rrast success Trans Rec', response.data);
        if (response.status === 200 && response.data.responseCode === '00') {
          dispatch({
            type: actionTypes.SET_TOKEN,
            payload: response?.headers?.['x-auth-next-token'],
          });
          params.displayMessage = response.data.data.displayMessage;
          logs.log('ygyg', response.data.data.displayMessage);
          params.acctitle = response.data.data.acctitle;
          params.acctype = response.data.data.acctype;
          params.token = response.data.data.token;

          // navigation.navigate('RAASTSuccess', {
          //   screen: screen_status,
          //   params: params,
          // });

          // setTimeout(() => {
          //   dispatch({
          //     type: actionTypes.GLOBAL_ICON_ALERT_STATE,
          //     payload: {
          //       state: true,
          //       navigation: navigation,
          //       props: {
          //         message: response.data.data.displayMessage,
          //         successAlert: true,
          //         onPressOk: () => {
          //           navigation.dispatch(
          //             CommonActions.reset({
          //               index: 0,
          //               routes: [{name: 'Home'}],
          //             }),
          //           );
          //           hideGlobalIconAlert();
          //         },
          //       },
          //     },
          //   });
          // }, 500);
          onSuccess(response);

          dispatch({
            type: actionTypes.SET_LOADER,
            payload: false,
          });
        } else {
          logs.log(
            'response ode raast wrong mpin ',
            response.data.responseCode,
          );

          if (sessionControl(response)) {
            navigation.dispatch(
              CommonActions.reset({
                index: 0,
                routes: [{name: 'Login'}],
              }),
            );
            dispatch({
              type: actionTypes.CLEAR_APP_DATA,
            });
          }

          if (response?.headers?.['x-auth-next-token']) {
            dispatch({
              type: actionTypes.SET_TOKEN,
              payload: response?.headers?.['x-auth-next-token'],
            });
            // navigation.navigate('AliasManagment');
          }
          dispatch({
            type: actionTypes.SET_LOADER,
            payload: false,
          });
          // dispatch({
          //   type: actionTypes.SET_ELSE_RESPONSE_ALERT,
          //   payload: {
          //     state: true,
          //     alertTitle: '',
          //     alertText: response.data?.data?.message
          //       ? response.data.data.message
          //       : response.data.responseDescription,
          //     onPress: () => {
          //       navigation.goBack();
          //       navigation.goBack();
          //       navigation.goBack();
          //       // navigation.navigate('RAASTMenue');
          //     },
          //   },
          // });
          setTimeout(() => {
            dispatch({
              type: actionTypes.GLOBAL_ICON_ALERT_STATE,
              payload: {
                state: true,
                navigation: navigation,
                props: {
                  message: response.data?.data?.message
                    ? response.data.data.message
                    : response.data.responseDescription,
                  onPressOk: () => {
                    if (response.data.responseCode == '02') {
                    } else {
                      navigation.dispatch(
                        CommonActions.reset({
                          index: 0,
                          routes: [{name: 'Home'}],
                        }),
                      );
                    }

                    hideGlobalIconAlert();
                  },
                },
              },
            });
          }, 500);
          // navigation.navigate('AliasManagment');
        }
      })
      .catch((error) => {
        logs.log(error);
        dispatch({
          type: actionTypes.SET_LOADER,
          payload: false,
        });
        // navigation.navigate('RAASTMenue');
        navigation.pop(4);
      });
  };
//***************END OF PAYMENT REQUEST *************** *///
//EXIT ALER//
const exitAlert = () => async (dispatch) => {
  Platform.OS === 'ios'
    ? Alert.alert(
        'NBP Digital',
        'Dear Customer, NBP Digital is not allowed on rooted/Jail broken phones/devices. Inconvenience is highly regretted.',
        [
          {
            text: 'Okay',
            onPress: () => {
              if (!jailbrokenAllow) {
                RNExitApp.exitApp();
              } else {
                dispatch({
                  type: actionTypes.SET_JAIL_BROKEN_ALERT_STATE,
                  payload: true,
                });
              }
            },
          },
        ],
      )
    : Alert.alert(
        'NBP Digital',
        'Dear Customer, NBP Digital is not allowed on rooted/Jail broken phones/devices. Inconvenience is highly regretted.',
        [
          {
            text: 'Okay',
            onPress: () => {
              if (!jailbrokenAllow) {
                RNExitApp.exitApp();
              } else {
                dispatch({
                  type: actionTypes.SET_JAIL_BROKEN_ALERT_STATE,
                  payload: true,
                });
              }
            },
          },
        ],
      );
};
//EXIT ALER//
export const changeUpgradeRegistration = (state) => async (dispatch) => {
  dispatch({
    type: actionTypes.SET_UPGRADE_REGISTRATION,
    payload: state,
  });
};

// performCustomerRegistrationWithReferral

export const performCustomerRegistrationWithoutReferral =
  (navigation, params, stopNavigation) => async (dispatch) => {
    dispatch({
      type: actionTypes.SET_LOADER,
      payload: true,
    });
    logs.logRequest(
      `${Config.base_url.UAT_URL}${Config.method.registration}/${
        Config.method.customeregistration
      },
    ${JSON.stringify(params)},`,
    );

    axios
      .post(
        `${Config.base_url.UAT_URL}${Config.method.registration}/${Config.method.customeregistration}`,
        params,
      )
      .then((response) => {
        logs.logResponse(response.data);
        if (response.status === 200 && response.data.responseCode === '00') {
          logs.log(`response.config ${JSON.stringify(response.config)}`);
          dispatch({
            type: actionTypes.SET_TOKEN,
            payload: response.data.data.token,
          });
          dispatch({
            type: actionTypes.SET_LOADER,
            payload: false,
          });

          if (!stopNavigation) {
            navigation.navigate('RegistrationStep1_otp', {data: params});
          } else {
            dispatch({
              type: actionTypes.SET_ELSE_RESPONSE_ALERT,
              payload: {
                state: true,
                alertTitle: 'Registration',
                alertText: Message.otpResentSuccessfully,
                // onPress: () => {
                //   navigation.navigate('RegistrationStep1_otp');
                // },
              },
            });
          }
        } else {
          if (response?.headers?.['x-auth-next-token']) {
            dispatch({
              type: actionTypes.SET_TOKEN,
              payload: response?.headers?.['x-auth-next-token'],
            });
          }
          dispatch({
            type: actionTypes.SET_LOADER,
            payload: false,
          });
          dispatch({
            type: actionTypes.SET_ELSE_RESPONSE_ALERT,
            payload: {
              state: true,
              alertTitle: 'Registration',
              alertText: response.data?.data?.message
                ? response.data.data.message
                : response.data.responseDescription,
              // onPress: () => {
              //   navigation.navigate('RegistrationStep1_otp');
              // },
            },
          });
        }
      })
      .catch((error1) => {
        dispatch({type: actionTypes.SET_LOADER, payload: false});
        logs.log(error1);
        let message = '';
        if (!error1.status) {
          // network err
          message = Message.networkErrorMessage;
        } else {
          message = String(error1);
        }
        dispatch({
          type: actionTypes.SET_ELSE_RESPONSE_ALERT,
          payload: {
            state: true,
            alertTitle: 'Registration',
            alertText: message,
          },
        });
      });
  };

// ends performCustomerRegistrationWithReferral

// performCustomerRegistrationWithReferral

const performCustomerRegistrationWithReferral =
  (navigation, params, stopNavigation) => async (dispatch) => {
    logs.logRequest(
      `${Config.base_url.UAT_URL}${Config.method.registration}/${
        Config.method.customeregistration
      },
    ${JSON.stringify({
      ...params,
      ...params?.data,
      ...appInfoObject_ForServices,
    })},`,
    );

    axios
      .post(
        `${Config.base_url.UAT_URL}${Config.method.registration}/${Config.method.customeregistration}`,
        {
          ...params,
          ...params.data,
          appInfoObject_ForServices,
        },
      )
      .then((response) => {
        logs.logResponse(response.data);
        if (response.status === 200 && response.data.responseCode === '00') {
          logs.log(`response.config ${JSON.stringify(response.config)}`);
          dispatch({
            type: actionTypes.SET_TOKEN,
            payload: response.data.data.token,
          });
          dispatch({
            type: actionTypes.SET_LOADER,
            payload: false,
          });
          if (!stopNavigation) {
            navigation.navigate('RegistrationStep1_otp', {data: params});
          } else {
            dispatch({
              type: actionTypes.SET_ELSE_RESPONSE_ALERT,
              payload: {
                state: true,
                alertTitle: 'Registration',
                alertText: Message.otpResentSuccessfully,
                // onPress: () => {
                //   navigation.navigate('RegistrationStep1_otp');
                // },
              },
            });
          }
        } else {
          if (response?.headers?.['x-auth-next-token']) {
            dispatch({
              type: actionTypes.SET_TOKEN,
              payload: response?.headers?.['x-auth-next-token'],
            });
          }
          dispatch({
            type: actionTypes.SET_LOADER,
            payload: false,
          });
          dispatch({
            type: actionTypes.SET_ELSE_RESPONSE_ALERT,
            payload: {
              state: true,
              alertTitle: 'Registration',
              alertText: response.data?.data?.message
                ? response.data.data.message
                : response.data.responseDescription,
              // onPress: () => {
              //   navigation.navigate('RegistrationStep1_otp');
              // },
            },
          });
        }
      })
      .catch((error1) => {
        dispatch({type: actionTypes.SET_LOADER, payload: false});
        logs.log(error1);
        let message = '';
        if (!error1.status) {
          // network err
          message = Message.networkErrorMessage;
        } else {
          message = String(error1);
        }
        dispatch({
          type: actionTypes.SET_ELSE_RESPONSE_ALERT,
          payload: {
            state: true,
            alertTitle: 'Registration',
            alertText: message,
          },
        });
      });
  };

// ends performCustomerRegistrationWithReferral

// validateNbpEmployeeReferralCode

export const validateNbpEmployeeReferralCode =
  (navigation, params, stopNavigation) => async (dispatch) => {
    // success
    //   logs.logRequest(`${Config.base_url.UAT_URL}${Config.method.registration}/${Config.endpoint.validatereferalcode},{
    //   referalCode:${params.referalCode},
    //   channel:${Config.channel.channel}
    // }`);
    dispatch({
      type: actionTypes.SET_LOADER,
      payload: true,
    });
    logs.logRequest(
      `${Config.base_url.UAT_URL}${Config.method.registration}/${
        Config.endpoint.validatereferalcode
      }?channel=${Config.channel.channel}
      ${JSON.stringify({
        ...params?.CnicObject,
        ...params?.data,
      })},`,
    );
    axios
      .post(
        `${Config.base_url.UAT_URL}${Config.method.registration}/${Config.endpoint.validatereferalcode}?channel=${Config.channel.channel}`,
        {
          ...params?.CnicObject,
          ...params?.data,
        },
      )
      .then((response) => {
        logs.logResponse(response.data);
        if (response.status === 200 && response.data.responseCode === '00') {
          dispatch(
            performCustomerRegistrationWithReferral(
              navigation,
              params.RegistartionObject
                ? params?.RegistartionObject
                : params?.data,
              stopNavigation,
            ),
          );
        } else {
          if (response?.headers?.['x-auth-next-token']) {
            dispatch({
              type: actionTypes.SET_TOKEN,
              payload: response?.headers?.['x-auth-next-token'],
            });
          }
          dispatch({
            type: actionTypes.SET_LOADER,
            payload: false,
          });
          dispatch({
            type: actionTypes.SET_ELSE_RESPONSE_ALERT,
            payload: {
              state: true,
              alertTitle: 'Registration',
              alertText: response.data?.data?.message
                ? response.data.data.message
                : response.data.responseDescription,
            },
          });
        }
      })
      .catch((error1) => {
        logs.log(`catch error1.1.1 ${JSON.stringify(error1)}`);
        dispatch({type: actionTypes.SET_LOADER, payload: false});
        logs.log(error1);
        let message = '';
        if (!error1.status) {
          // network err
          message = Message.networkErrorMessage;
        } else {
          message = String(error1);
        }
        dispatch({
          type: actionTypes.SET_ELSE_RESPONSE_ALERT,
          payload: {
            state: true,
            alertTitle: 'Registration',
            alertText: message,
          },
        });
      });
  };

// ends validateNbpEmployeeReferralCode

// start of new customer registration apis
export const customerRegistrationStep1 =
  (navigation, params, stopNavigation) => async (dispatch) => {
    dispatch({
      type: actionTypes.SET_LOADER,
      payload: true,
    });
    dispatch({
      type: actionTypes.SET_CURRENT_NAVIGATION,
      payload: navigation,
    });
    dispatch(
      validateNbpEmployeeReferralCode(navigation, params, stopNavigation),
    );
  };
// start of new customer registration apis

//start of register otp
export const registrationStep1Otp =
  (navigation, params) => async (dispatch) => {
    dispatch({
      type: actionTypes.SET_LOADER,
      payload: true,
    });
    logs.logRequest(
      `${Config.base_url.UAT_URL}${Config.method.registration}/${
        Config.endpoint.verifyregistrationotp
      },
      ${JSON.stringify({
        ...params,
        ...appInfoObject_ForServices,
      })},`,
    );

    axios
      .post(
        `${Config.base_url.UAT_URL}${Config.method.registration}/${Config.endpoint.verifyregistrationotp}`,
        {
          ...params,
          ...appInfoObject_ForServices,
        },
        // {
        //   headers: {'X-Auth-Token': store.getState().reducers.token},
        // },
      )

      .then((response) => {
        logs.logResponse(response.data);
        logs.log(`params in call ${response.config}`);
        if (response.status === 200 && response.data.responseCode === '00') {
          dispatch({
            type: actionTypes.SET_TOKEN,
            payload: response.data.data.token,
          });

          dispatch({
            type: actionTypes.SET_LOADER,
            payload: false,
          });
          navigation.navigate('RegisterationStep1_generate');
        } else {
          // if (sessionControl(response)) {
          //   navigation.dispatch(
          //     CommonActions.reset({
          //       index: 0,
          //       routes: [{name: 'Login'}],
          //     }),
          //   );
          //   dispatch({
          //     type: actionTypes.CLEAR_APP_DATA,
          //   });
          // }

          if (response?.headers?.['x-auth-next-token']) {
            dispatch({
              type: actionTypes.SET_TOKEN,
              payload: response?.headers?.['x-auth-next-token'],
            });
            navigation.navigate('Login');
          }
          dispatch({
            type: actionTypes.SET_LOADER,
            payload: false,
          });
          dispatch({
            type: actionTypes.SET_ELSE_RESPONSE_ALERT,
            payload: {
              state: true,
              alertTitle: '',
              alertText: response.data?.data?.message
                ? response.data.data.message
                : response.data.responseDescription,
            },
          });
          // navigation.navigate('AliasManagment');
        }
      })
      .catch((error) => {
        logs.log(error);
        dispatch({
          type: actionTypes.SET_LOADER,
          payload: false,
        });
        dispatch(catchError(error));
        // navigation.navigate('AliasManagment');
      });
  };
//end of register otp

//start of pin genrate
export const registrationStep1PinGenerate =
  (navigation, params) => async (dispatch) => {
    dispatch({
      type: actionTypes.SET_LOADER,
      payload: true,
    });
    logs.logRequest(
      `${Config.base_url.UAT_URL}${Config.method.registration}/${
        Config.endpoint.submitregistrationpin
      },
  ${JSON.stringify({
    ...params,
    ...appInfoObject_ForServices,
  })},`,
    );

    axios
      .post(
        `${Config.base_url.UAT_URL}${Config.method.registration}/${Config.endpoint.submitregistrationpin}`,
        {
          ...params,
          ...appInfoObject_ForServices,
        },
        // {
        //   headers: {'X-Auth-Token': store.getState().reducers.token},
        // },
      )

      .then((response) => {
        logs.logResponse(response.data);
        logs.log(`params going in call ${response.config.data}`);
        if (response.status === 200 && response.data.responseCode === '00') {
          dispatch({
            type: actionTypes.SET_TOKEN,
            payload: response.data.data.token,
          });
          dispatch({
            type: actionTypes.SET_SUCCESS_MODAL_STATE,
            payload: true,
          });

          dispatch({
            type: actionTypes.SET_LOADER,
            payload: false,
          });
          navigation.navigate('RegisterationStep1_generate');
        } else {
          if (sessionControl(response)) {
            navigation.dispatch(
              CommonActions.reset({
                index: 0,
                routes: [{name: 'Login'}],
              }),
            );
            dispatch({
              type: actionTypes.CLEAR_APP_DATA,
            });
          }

          if (response?.headers?.['x-auth-next-token']) {
            dispatch({
              type: actionTypes.SET_TOKEN,
              payload: response?.headers?.['x-auth-next-token'],
            });
            navigation.navigate('Login');
          }
          dispatch({
            type: actionTypes.SET_LOADER,
            payload: false,
          });
          dispatch({
            type: actionTypes.SET_ELSE_RESPONSE_ALERT,
            payload: {
              state: true,
              alertTitle: '',
              alertText: response.data?.data?.message
                ? response.data.data.message
                : response.data.responseDescription,
              onPress: () => {
                navigation.navigate('Login');
              },
            },
          });
          // navigation.navigate('AliasManagment');
        }
      })
      .catch((error) => {
        logs.log(error);
        dispatch({
          type: actionTypes.SET_LOADER,
          payload: false,
        });
        // navigation.navigate('AliasManagment');
        dispatch(catchError(error));
      });
  };
//end of pin genrate
//start of upgradeuser
export const verifycardregistration =
  (navigation, params) => async (dispatch) => {
    dispatch({
      type: actionTypes.SET_LOADER,
      payload: true,
    });
    logs.logRequest(
      `${Config.base_url.UAT_URL}${Config.method.registration}/${
        Config.endpoint.verifycardregistration
      },
      {
        cardNumber: ${params.cardNumber},
        pinNumber: ${params.pinNumber},
        email: ${params.email},
        token: ${store.getState().reducers.token},
      },`,
    );

    axios
      .post(
        `${Config.base_url.UAT_URL}${Config.method.registration}/${Config.endpoint.verifycardregistration}`,
        {
          cardNumber: params.cardNumber,
          pinNumber: params.pinNumber,
          email: params.email,
          token: store.getState().reducers.token,
        },
        // {
        //   headers: {'X-Auth-Token': store.getState().reducers.token},
        // },
      )

      .then((response) => {
        logs.logResponse(response.data);
        if (response.status === 200 && response.data.responseCode === '00') {
          dispatch({
            type: actionTypes.SET_TOKEN,
            payload: response?.headers?.['x-auth-next-token'],
          });

          dispatch({
            type: actionTypes.SET_LOADER,
            payload: false,
          });
          dispatch({
            type: actionTypes.SET_SUCCESS_MODAL_STATE,
            payload: true,
          });
          // navigation.navigate('Upgrade_Debit_otp', {params});

          // navigation.navigate('RegisterationStep1_generate');
        } else {
          if (response?.headers?.['x-auth-next-token']) {
            dispatch({
              type: actionTypes.SET_TOKEN,
              payload: response?.headers?.['x-auth-next-token'],
            });
          }
          if (sessionControl(response)) {
            navigation.dispatch(
              CommonActions.reset({
                index: 0,
                routes: [{name: 'Login'}],
              }),
            );
            dispatch({
              type: actionTypes.CLEAR_APP_DATA,
            });
          }
          dispatch({
            type: actionTypes.SET_LOADER,
            payload: false,
          });
          dispatch({
            type: actionTypes.SET_ELSE_RESPONSE_ALERT,
            payload: {
              state: true,
              alertTitle: '',
              alertText: response.data?.data?.message
                ? response.data.data.message
                : response.data.responseDescription,
            },
          });
        }
      })
      .catch((error) => {
        logs.log(`error catch block ${error}`);
        dispatch({
          type: actionTypes.SET_LOADER,
          payload: false,
        });
        let message = '';
        if (!error.status) {
          // network error
          message = Message.networkErrorMessage;
        } else {
          message = String(error);
        }
        dispatch({
          type: actionTypes.SET_ELSE_RESPONSE_ALERT,
          payload: {
            state: true,
            alertTitle: '',
            alertText: message,
          },
        });
      });
  };
//end of upgradeuser

// SET CUSTOMER LEVEL
export const setCustomerLevel = (level) => async (dispatch) => {
  dispatch({
    type: actionTypes.SET_CUSTOMER_LEVEL,
    payload: level,
  });
};
// ENDS SET CUSTOMER LEVEL

//start of upgradeuser
export const upgradeRegistration =
  (navigation, params, onSuccess) => async (dispatch) => {
    logs.log('upgradeRegistration triggered');
    dispatch({
      type: actionTypes.SET_LOADER,
      payload: true,
    });
    logs.logRequest(
      `${Config.base_url.UAT_URL}${Config.method.my}/${
        Config.endpoint.upgradereistration
      },
      {
        username:${params.username},
        cardNumber: ${params.cardNumber},
        email: ${params.email},
        accountNo: ${
          store.getState().reducers.userObject.accountNumber
            ? store.getState().reducers.userObject.accountNumber
            : params.defaultAccount
        },
      },{
        headers: {'X-Auth-Token': ${store.getState().reducers.token}},
      },`,
    );

    axios
      .post(
        `${Config.base_url.UAT_URL}${Config.method.my}/${Config.endpoint.upgradereistration}`,
        {
          username: params.username,
          cardNumber: params.cardNumber,
          email: params.email,
          accountNo: store.getState().reducers.userObject.accountNumber
            ? store.getState().reducers.userObject.accountNumber
            : params.defaultAccount,
        },
        {
          headers: {'X-Auth-Token': store.getState().reducers.token},
        },
      )

      .then((response) => {
        logs.logResponse(response.data);
        if (response.status === 200 && response.data.responseCode === '00') {
          if (response?.headers?.['x-auth-next-token']) {
            dispatch({
              type: actionTypes.SET_TOKEN,
              payload: response?.headers?.['x-auth-next-token'],
            });
          }
          // dispatch({
          //   type: actionTypes.SET_TOKEN,
          //   payload: response?.headers?.['x-auth-next-token'],
          // });

          dispatch({
            type: actionTypes.SET_USER_SIGNED_IN,
            payload: params?.username,
          });
          dispatch({
            type: actionTypes.SET_USER_OBJECT,
            payload: {
              ...store.getState().reducers.userObject,
              customerLevel: response.data?.data?.customerLevel,
            },
          });
          dispatch({
            type: actionTypes.SET_LOADER,
            payload: false,
          });
          setTimeout(() => {
            dispatch({
              type: actionTypes.SET_ELSE_RESPONSE_ALERT,
              payload: {
                state: true,
                alertTitle: '',
                alertText: response.data?.data?.response
                  ? response.data?.data?.response
                  : response.data?.data?.message
                  ? response.data.data.message
                  : response.data.responseDescription,
                onPress: () => {
                  navigation.dispatch(
                    CommonActions.reset({
                      index: 0,
                      routes: [{name: 'Login'}],
                    }),
                  );
                },
              },
            });
          }, 500);
          // dispatch({
          //   type: actionTypes.SET_SUCCESS_MODAL_STATE,
          //   payload: true,
          // });
          // navigation.navigate('Upgrade_Debit_otp', {params});

          // navigation.navigate('RegisterationStep1_generate');

          //change for the upgrade registration
          onSuccess();
        } else {
          if (response?.headers?.['x-auth-next-token']) {
            dispatch({
              type: actionTypes.SET_TOKEN,
              payload: response?.headers?.['x-auth-next-token'],
            });
          }
          if (sessionControl(response)) {
            navigation.dispatch(
              CommonActions.reset({
                index: 0,
                routes: [{name: 'Login'}],
              }),
            );
            dispatch({
              type: actionTypes.CLEAR_APP_DATA,
            });
          }
          dispatch({
            type: actionTypes.SET_LOADER,
            payload: false,
          });
          dispatch({
            type: actionTypes.SET_ELSE_RESPONSE_ALERT,
            payload: {
              state: true,
              alertTitle: '',
              alertText: response.data?.data?.message
                ? response.data.data.message
                : response.data.responseDescription,
            },
          });
        }
      })
      .catch((error) => {
        logs.log(`error catch block ${error}`);
        dispatch({
          type: actionTypes.SET_LOADER,
          payload: false,
        });
        let message = '';
        if (!error.status) {
          // network error
          message = Message.networkErrorMessage;
        } else {
          message = String(error);
        }
        dispatch({
          type: actionTypes.SET_ELSE_RESPONSE_ALERT,
          payload: {
            state: true,
            alertTitle: '',
            alertText: message,
          },
        });
      });
  };
//end of upgradeuser

// SET REDUX LEVEL UPGRADE STATE
export const setCustomerUpgradeState = (state) => async (dispatch) => {
  dispatch({
    type: actionTypes.SET_UPGRADE_REGISTRATION,
    payload: state,
  });
};
// ENDS SET REDUX LEVEL UPGRADE STATE

//for  the sucess modal
export const successModalClose = () => async (dispatch) => {
  dispatch({
    type: actionTypes.SET_SUCCESS_MODAL_STATE,
    payload: false,
  });
};
//pkr accounts ki call
export const getAccounts = (navigation, onSuccess) => async (dispatch) => {
  dispatch({
    type: actionTypes.SET_LOADER,
    payload: true,
  });
  // navigation.navigate('ShowCards');

  logs.logRequest(
    `${Config.base_url.UAT_URL}${Config.method.my}/${
      Config.endpoint.pkraccounts
    }?channel=${Config.channel.channel},
    {
      headers: {
        'X-Auth-Token': ${store.getState().reducers.token},
      },
    },`,
  );
  axios
    .get(
      `${Config.base_url.UAT_URL}${Config.method.my}/${Config.endpoint.accounts}?channel=${Config.channel.channel}`,
      {
        headers: {
          'X-Auth-Token': store.getState().reducers.token,
        },
      },
    )
    .then((response) => {
      logs.logResponse(response.data);
      if (response.status === 200 && response.data.responseCode === '00') {
        dispatch({
          type: actionTypes.SET_TOKEN,
          payload: response?.headers?.['x-auth-next-token'],
        });
        dispatch({
          type: actionTypes.SET_PKR_ACCOUNTS_DATA,
          payload: response.data.data.accounts,
        });
        logs.log(response.data.data);

        onSuccess(response?.headers?.['x-auth-next-token']);
      } else {
        if (response?.headers?.['x-auth-next-token']) {
          dispatch({
            type: actionTypes.SET_TOKEN,
            payload: response?.headers?.['x-auth-next-token'],
          });
        }
        dispatch({
          type: actionTypes.SET_LOADER,
          payload: false,
        });
        if (sessionControl(response)) {
          navigation.dispatch(
            CommonActions.reset({
              index: 0,
              routes: [{name: 'Login'}],
            }),
          );

          dispatch({
            type: actionTypes.SET_ELSE_RESPONSE_ALERT,
            payload: {
              state: true,
              alertTitle: '',
              alertText: response.data?.data?.message
                ? response.data.data.message
                : response.data.responseDescription,
            },
          });
        } else {
          dispatch({
            type: actionTypes.SET_ELSE_RESPONSE_ALERT,
            payload: {
              state: true,
              alertTitle: '',
              alertText: response.data?.data?.message
                ? response.data.data.message
                : response.data.responseDescription,
              onPress: () => {
                navigation.goBack();
              },
            },
          });
        }
      }
    })
    .catch((error) => {
      dispatch({
        type: actionTypes.SET_LOADER,
        payload: false,
      });
      let message = '';
      if (!error.status) {
        // network error
        message = Message.networkErrorMessage;
      } else {
        message = String(error);
      }
      dispatch({
        type: actionTypes.SET_ELSE_RESPONSE_ALERT,
        payload: {
          state: true,
          alertTitle: '',
          alertText: message,
          onPress: () => {
            navigation.goBack();
          },
        },
      });
    });
};
//khtam okr accoutns ki call
// SET USER OBJECT

export const setLOGIN_STATE = (logInState) => async (dispatch) => {
  logs.log('logInState=================', logInState);
  dispatch({
    type: actionTypes.LOGIN_STATE_UPDATE,
    payload: logInState,
  });
};

export const setUserObject = (userData) => async (dispatch) => {
  const data = {...store.getState().reducers.userObject, ...userData};
  logs.log('userData ', userData);
  dispatch({
    type: actionTypes.SET_USER_OBJECT,
    payload: data,
  });
};
export const setUfoneBundles = (bundles) => async (dispatch) => {
  dispatch({
    type: actionTypes.UFONE_BUNDLES,
    payload: bundles,
  });
};

// ENDS SET USER OBJECT

// SERVICE UNSUCCESSFULL RESPONSE
export const serviceResponseCheck =
  (response, navigation, navigateHome) => async (dispatch) => {
    logs.log('serviceResponseCheck RESPONSE : ', response, response?.data);
    let responseMessage = response.data?.data?.message
      ? response?.data?.data?.message
      : response.data?.message
      ? response.data?.message
      : response?.data?.responseDescription
      ? response?.data?.responseDescription
      : response?.data?.message
      ? response?.data?.message
      : response?.responseDescription
      ? response?.responseDescription
      : response?.message;

    let responseCode = response?.data?.responseCode
      ? response?.data?.responseCode
      : response?.responseCode
      ? response?.responseCode
      : response?.responseCode;
    const navigateHomeFlag =
      responseCode === '606' || responseCode === '605' ? false : navigateHome;
    logs.log('responseMessage', responseMessage);
    logs.log('response in service Resposne ====>', response?.data);

    if (response?.headers?.['x-auth-next-token']) {
      logs.log('in the next headerrer ========>');
      dispatch({
        type: actionTypes.SET_TOKEN,
        payload: response.headers['x-auth-next-token'],
      });
    }
    if (response?.headers?.['X-Auth-Next-Token']) {
      logs.log('in the next headerrer ========>');
      dispatch({
        type: actionTypes.SET_TOKEN,
        payload: response.headers['X-Auth-Next-Token'],
      });
    }
    if (sessionControl(response)) {
      navigation.dispatch(
        CommonActions.reset({
          index: 0,
          routes: [{name: 'Login'}],
        }),
      );
    }

    dispatch({
      type: actionTypes.SET_LOADER,
      payload: false,
    });

    dispatch({
      type: actionTypes.SET_ELSE_RESPONSE_ALERT,
      payload: {
        state: true,
        navigation: navigation,
        message: responseMessage,
        alertText: responseMessage,
        alertCode: responseCode,
        onPress: () => {
          navigateHomeFlag
            ? navigation.dispatch(
                CommonActions.reset({
                  index: 0,
                  routes: [{name: 'Home'}],
                }),
              )
            : null;
        },
        props: {
          message: responseMessage,
          alertText: responseMessage,

          // onPressOk: () => {
          //   // hideGlobalIconAlert();
          // },
        },
      },
    });
  };
// ENDS SERVICE UNSUCCESSFULL RESPONSE

// SERVICE UNSUCCESSFULL RESPONSE
// ENDS SERVICE UNSUCCESSFULL RESPONSE
export const sessionAlert = () => async (dispatch) => {
  dispatch({
    type: actionTypes.SET_ELSE_RESPONSE_ALERT,
    payload: {
      state: false,
      alertTitle: '',
      alertText: '',
    },
  });
  closeGlobalIconAlertState();
  dispatch({
    type: actionTypes.SET_LOADER,
    payload: false,
  });
  const navigation = store.getState().reducers.currentNavigation;
  const navigation2 = store.getState().reducers.currentNavigation;
  navigation2?.closeDrawer();
  navigation.dispatch(
    CommonActions.reset({
      index: 0,
      routes: [{name: 'Login'}],
    }),
  );
  dispatch({
    type: actionTypes.CLEAR_APP_DATA,
  });
};
// STARTS UPDATE SESSION TOKEN

export const updateSessionToken = (response) => async (dispatch) => {
  if (
    response?.headers?.['x-auth-next-token'] ||
    response?.headers?.['X-Auth-Next-Token']
  ) {
    dispatch({
      type: actionTypes.SET_TOKEN,
      payload: response.headers['x-auth-next-token']
        ? response.headers['x-auth-next-token']
        : response.headers['X-Auth-Next-Token'],
    });
  }
};
export const emptyViewAccOverView = () => async (dispatch) => {
  dispatch({
    type: actionTypes.SET_DASHBOARD_CHECK,
    payload: true,
  });
};

export const updateAccountTitle = (res) => async (dispatch) => {
  dispatch({
    type: actionTypes.SET_USER_TITLE_UPDATE,
    payload: res,
  });
};

// ENDS UPDATE SESSION TOKEN

// CATCH ERROR

export const catchError = (error) => async (dispatch) => {
  logs.log(
    'catchError : ',
    error && typeof error === 'object' && error?.message
      ? error.message
      : JSON.stringify(error),
  );
  dispatch({
    type: actionTypes.SET_LOADER,
    payload: false,
  });
  let message = '';
  if (!error.status) {
    // network error
    message = Message.networkErrorMessage;
  } else {
    message = String(error);
  }
  dispatch({
    type: actionTypes.SET_ELSE_RESPONSE_ALERT,
    payload: {
      state: true,
      alertTitle: '',
      alertText: message,
    },
  });
};

// ENDS CATCH ERROR
// ***** GET EXISTING CARD DETAILS  *****

export const getExistingCardsDetails =
  (accountNumber, reason, cardType, onSuccess, updateCardReason, navigation) =>
  async (dispatch) => {
    dispatch({
      type: actionTypes.SET_LOADER,
      payload: true,
    });
    logs.log(`accountNumber : ${accountNumber}`);
    logs.logRequest(
      `${Config.base_url.UAT_URL}${Config.method.debitcard}/${Config.endpoint.getExistingCardsDetails}?accountNumber=${accountNumber}&applicationType=${reason}&cardType=${cardType}`,
    );
    axios
      .post(
        `${Config.base_url.UAT_URL}${Config.method.debitcard}/${Config.endpoint.getExistingCardsDetails}?accountNumber=${accountNumber}&applicationType=${reason}&cardType=${cardType}`,
        {},
        {
          headers: {
            'X-Auth-Token': store.getState().reducers.token,
          },
        },
      )
      .then((response) => {
        logs.logResponse(response.data);
        if (response.status === 200 && response.data.responseCode === '00') {
          dispatch({
            type: actionTypes.SET_TOKEN,
            payload: response?.headers?.['x-auth-next-token'],
          });
          onSuccess({
            data: response?.data?.data?.cardRecordResponse,
            type: reason,
          });
          if (reason !== 'New' && updateCardReason) {
            updateCardReason();
          }
          dispatch({
            type: actionTypes.SET_LOADER,
            payload: false,
          });
        } else {
          if (response?.headers?.['x-auth-next-token']) {
            dispatch({
              type: actionTypes.SET_TOKEN,
              payload: response?.headers?.['x-auth-next-token'],
            });
          }
          logs.log('sadasd', response.data.responseDescription);
          if (sessionControl(response)) {
            navigation.dispatch(
              CommonActions.reset({
                index: 0,
                routes: [{name: 'Login'}],
              }),
            );
            dispatch({
              type: actionTypes.CLEAR_APP_DATA,
            });

            dispatch({
              type: actionTypes.SET_LOADER,
              payload: false,
            });
            dispatch({
              type: actionTypes.SET_ELSE_RESPONSE_ALERT,
              payload: {
                state: true,
                alertTitle: '',
                alertText: response.data?.data?.message
                  ? response.data.data.message
                  : response.data.responseDescription,
              },
            });
          } else {
            dispatch({
              type: actionTypes.SET_LOADER,
              payload: false,
            });
            if (reason !== 'New') {
              dispatch({
                type: actionTypes.SET_ELSE_RESPONSE_ALERT,
                payload: {
                  state: true,
                  alertTitle: '',
                  alertText: response.data?.data?.message
                    ? response.data.data.message
                    : response.data.responseDescription,
                },
              });
            }
            if (reason === 'New') {
              if (
                response.data.responseCode === '002' ||
                response.data.responseCode === '011'
              ) {
                onSuccess({
                  data: false,
                  type: reason,
                });
              }
            }
          }
        }
      })
      .catch((error) => {
        logs.log(`errors : ${JSON.stringify(error)}`);
        dispatch({
          type: actionTypes.SET_LOADER,
          payload: false,
        });
        let message = '';
        if (!error.status) {
          // network err
          message = Message.networkErrorMessage;
        } else {
          message = String(error);
        }
        dispatch({
          type: actionTypes.SET_ELSE_RESPONSE_ALERT,
          payload: {
            state: true,
            alertTitle: 'Add Account',
            alertText: message,
          },
        });
      });
    // *****ENDS GET EXISTING CARD DETAILS  *****

    //   --> POST https://nbp-service-dev.nbp.p.azurewebsites.net/api/v1/mpin/generate http/1.1
    // X-Auth-Token: 317de131-ef9a-4c76-9435-7b30eaaf1109
    // {"mPin":"1111","reEntermPin":"1111"}
  };

// ***** GET EXISTING CARD DETAILS  *****
// export const getExistingCardsDetails =
//   (token, accountNumber, navigation) => async (dispatch) => {
//     dispatch({
//       type: actionTypes.SET_LOADER,
//       payload: true,
//     });

//     axios
//       .post(
//         `${Config.base_url.UAT_URL}${Config.method.transfer}/${Config.method.rda}/${Config.endpoint.getExistingCardsDetails}`,
//         {
//           accountNumber: accountNumber,
//           accountType: setDefault,
//           branchCode: removeAccount,
//         },
//         {
//           headers: {
//             'X-Auth-Token': token,
//           },
//         },
//       )
//       .then((response) => {
//         if (response.status === 200 && response.data.responseCode === '00') {
//           dispatch({
//             type: actionTypes.SET_TOKEN,
//             payload: response?.headers?.['x-auth-next-token'],
//           });
//           dispatch({
//             type: actionTypes.SET_LOADER,
//             payload: false,
//           });
//         } else {
//           if (response?.headers?.['x-auth-next-token']) {
//             dispatch({
//               type: actionTypes.SET_TOKEN,
//               payload: response?.headers?.['x-auth-next-token'],
//             });
//           }
//           if (sessionControl(response)) {
//             navigation.dispatch(
//               CommonActions.reset({
//                 index: 0,
//                 routes: [{name: 'Login'}],
//               }),
//             );
//             dispatch({
//               type: actionTypes.CLEAR_APP_DATA,
//             });
//           }
//           dispatch({
//             type: actionTypes.SET_LOADER,
//             payload: false,
//           });

//           dispatch({
//             type: actionTypes.SET_ELSE_RESPONSE_ALERT,
//             payload: {
//               state: true,
//               alertTitle: 'Manage Account',
//               alertText: response.data?.data?.message
//                 ? response.data.data.message
//                 : response.data.responseDescription,
//             },
//           });
//         }
//       })
//       .catch((error) => {
//         dispatch({
//           type: actionTypes.SET_LOADER,
//           payload: false,
//         });
//         let message = '';
//         if (!error.status) {
//           // network error
//           message =
//             Message.networkErrorMessage;
//         } else {
//           message = String(error);
//         }
//         dispatch({
//           type: actionTypes.SET_ELSE_RESPONSE_ALERT,
//           payload: {
//             state: true,
//             alertTitle: '',
//             alertText: message,
//           },
//         });
//       });
//   };
// ***** ENDS GET EXISTING CARD DETAILS *****
//-------------------------- GET CHECK USERNAME ------------//
export const checkavaliableusername =
  (navigation, username, onSuccess, onFaliure) => async (dispatch) => {
    logs.log('call in chaceckuseraaliable');
    dispatch({
      type: actionTypes.SET_LOADER,
      payload: true,
    });
    // navigation.navigate('CardManagment');

    logs.logRequest(
      `${Config.base_url.UAT_URL}${Config.method.my}/${
        Config.endpoint.checkavailablename
      }?username=${username},
    {
      headers: {
        'X-Auth-Token': ${store.getState().reducers.token},
      },
    },`,
    );
    axios
      .get(
        `${Config.base_url.UAT_URL}${Config.method.my}/${Config.endpoint.checkavailablename}?username=${username}`,
        {
          headers: {
            'X-Auth-Token': store.getState().reducers.token,
          },
        },
      )
      .then((response) => {
        logs.logResponse(response.data);
        if (response.status === 200 && response.data.responseCode === '00') {
          dispatch({
            type: actionTypes.SET_TOKEN,
            payload: response?.headers?.['x-auth-next-token'],
          });
          dispatch({
            type: actionTypes.SET_LOADER,
            payload: false,
          });
          onSuccess();
        } else {
          if (response?.headers?.['x-auth-next-token']) {
            dispatch({
              type: actionTypes.SET_TOKEN,
              payload: response?.headers?.['x-auth-next-token'],
            });
          }
          dispatch({
            type: actionTypes.SET_LOADER,
            payload: false,
          });
          if (sessionControl(response)) {
            logs.log('my yahan hn ');
            navigation.dispatch(
              CommonActions.reset({
                index: 0,
                routes: [{name: 'Login'}],
              }),
            );

            dispatch({
              type: actionTypes.SET_ELSE_RESPONSE_ALERT,
              payload: {
                state: true,
                alertTitle: '',
                alertText: response.data?.data?.message
                  ? response.data.data.message
                  : response.data.responseDescription,
              },
            });
          } else {
            logs.log('my yahan hn 2');
            onFaliure(response?.data);
            // dispatch({
            //   type: actionTypes.SET_ELSE_RESPONSE_ALERT,
            //   payload: {
            //     state: true,
            //     alertTitle: '',
            //     alertText: response.data?.data?.message
            //       ? response.data.data.message
            //       : response.data.responseDescription,
            //     onPress: () => {
            //       navigation.goBack();
            //     },
            //   },
            // });
          }
        }
      })
      .catch((error) => {
        dispatch({
          type: actionTypes.SET_LOADER,
          payload: false,
        });
        let message = '';
        if (!error.status) {
          // network error
          message = Message.networkErrorMessage;
        } else {
          message = String(error);
        }
        dispatch({
          type: actionTypes.SET_ELSE_RESPONSE_ALERT,
          payload: {
            state: true,
            alertTitle: '',
            alertText: message,
            onPress: () => {
              navigation.goBack();
            },
          },
        });
      });
  };
///******START OF CITY CODE********* */
export const getAvailableCards =
  (navigation, cardNo, onSuccess) => async (dispatch) => {
    dispatch({
      type: actionTypes.SET_LOADER,
      payload: true,
    });

    logs.logRequest(
      `${Config.base_url.UAT_URL}${Config.method.debitcard}/getavailablecard/${cardNo},
    {
      channel: ${Config.channel.channel},
      headers: {
     
      },
    },-`,
    );
    axios
      .get(
        `${Config.base_url.UAT_URL}${Config.method.debitcard}/getavailablecard/${cardNo}`,

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
          logs.log(`response ${response?.data?.data}`);

          dispatch({
            type: actionTypes.SET_TOKEN,
            payload: response?.headers?.['x-auth-next-token'],
          });

          dispatch({
            type: actionTypes.SET_LOADER,
            payload: false,
          });
          if (response?.data?.data && response?.data?.data === 'true') {
            onSuccess(response?.data?.data);
          } else {
            dispatch({
              type: actionTypes.SET_ELSE_RESPONSE_ALERT,
              payload: {
                state: true,
                alertTitle: '',
                alertText:
                  I18n[
                    'Card Application Already In Process, Kindly Call Our Helpline 021 111 627 627'
                  ],
                onPress: () => {
                  navigation.navigate('ShowCards');
                },
              },
            });
          }
        } else {
          if (response?.headers?.['x-auth-next-token']) {
            dispatch({
              type: actionTypes.SET_TOKEN,
              payload: response?.headers?.['x-auth-next-token'],
            });
          }
          dispatch({
            type: actionTypes.SET_LOADER,
            payload: false,
          });
          if (sessionControl(response)) {
            navigation.dispatch(
              CommonActions.reset({
                index: 0,
                routes: [{name: 'Login'}],
              }),
            );
            dispatch({
              type: actionTypes.CLEAR_APP_DATA,
            });
            dispatch({
              type: actionTypes.SET_ELSE_RESPONSE_ALERT,
              payload: {
                state: true,
                alertTitle: '',
                alertText: response.data?.data?.message
                  ? response.data.data.message
                  : response.data.responseDescription,
              },
            });
          } else {
            dispatch({
              type: actionTypes.SET_ELSE_RESPONSE_ALERT,
              payload: {
                state: true,
                alertTitle: '',
                alertText: response.data?.data?.message
                  ? response.data.data.message
                  : response.data.responseDescription,
                onPress: () => {
                  navigation.navigate('ShowCards');
                },
              },
            });
          }
        }
      })
      .catch((error) => {
        navigation.goBack();

        dispatch({
          type: actionTypes.SET_LOADER,
          payload: false,
        });
        let message = '';
        if (!error.status) {
          // network error
          message = Message.networkErrorMessage;
        } else {
          message = String(error);
        }
        dispatch({
          type: actionTypes.SET_ELSE_RESPONSE_ALERT,
          payload: {
            state: true,
            alertTitle: '',
            alertText: message,
          },
        });
      });
  };
//*********END OF CITY CODE */
// -------====CUSTOMER ALIAS =====--------------//
export const getRaastAccounts = (params, navigation) => async (dispatch) => {
  logs.log('runing un raastbanner');
  logs.log(params);
  dispatch({
    type: actionTypes.setLoader,
    payload: true,
  });
  axios
    .get(
      `${Config.base_url.UAT_URL}${Config.method.raast}/${Config.method.customeralias}/${Config.endpoint.getaccounts}`,
      params,
      {
        channel: `${Config.channel.channel}`,
        headers: {'X-Auth-Token': store.getState().reducers.token},
      },
    )
    .then((response) => {
      dispatch({
        type: actionTypes.setLoader,
        payload: false,
      });
      if (response.status === 200 && response.data.responseCode === '00') {
        // dispatch({
        //   type: actionTypes.SET_TOKEN,
        //   payload: response?.headers?.['x-auth-next-token'],
        // });

        navigation.navigate('oneStepReg', {
          screen: 'Register',
        });
      } else {
        if (response?.headers?.['x-auth-next-token']) {
          dispatch({
            type: actionTypes.SET_TOKEN,
            payload: response?.headers?.['x-auth-next-token'],
          });
        }
        if (sessionControl(response)) {
          navigation.dispatch(
            CommonActions.reset({
              index: 0,
              routes: [{name: 'Login'}],
            }),
          );
          dispatch({
            type: actionTypes.CLEAR_APP_DATA,
          });
        }

        dispatch({
          type: actionTypes.SET_ELSE_RESPONSE_ALERT,
          payload: {
            state: true,
            alertTitle: '',
            alertText: response.data?.data?.message
              ? response.data.data.message
              : response.data.responseDescription,
          },
        });
      }
    })
    .catch((error) => {
      dispatch({
        type: actionTypes.setLoader,
        payload: false,
      });
      let message = '';
      if (!error.status) {
        // network error
        message = Message.networkErrorMessage;
      } else {
        message = String(error);
      }
      dispatch({
        type: actionTypes.SET_ELSE_RESPONSE_ALERT,
        payload: {
          state: true,
          alertTitle: '',
          alertText: message,
        },
      });
    });
};
export const titleFetchRAASTBenef =
  (screen_status, navigation, params) => async (dispatch) => {
    dispatch({
      type: actionTypes.SET_LOADER,
      payload: true,
    });
    logs.log(
      'TITLE FERTCH FOR IBAN',
      params.idType,
      params.idValue,
      params.amount,
      params.source_iban,
    );
    axios
      .post(
        `${Config.base_url.UAT_URL}${Config.method.raast}/${Config.method.customeraccount}/${Config.endpoint.getdefaultaccountbyalias}`,

        {
          aliasType: params.idType,
          aliasValue: params.idValue,
          amount: params.amount,
          iban: params.source_iban,
        },
        {
          headers: {'X-Auth-Token': store.getState().reducers.token},
        },
      )

      .then((response) => {
        logs.logResponse(response.data);
        if (response.status === 200 && response.data.responseCode === '00') {
          dispatch({
            type: actionTypes.SET_TOKEN,
            payload: response?.headers?.['x-auth-next-token'],
          });

          logs.log(
            `title Fetch Benef response ${JSON.stringify(
              response.data.data?.iban,
            )}`,
          );
          logs.log(`from previous screen${JSON.stringify(params)}`);
          let res1 = response.data.data?.iban.slice(8, 12);
          let res2 = response.data.data?.iban.slice(14, 24);
          let result = `${res1}${res2}`;
          let body = {
            iban: response.data.data?.iban,
            toAccount: result,
            amount: params?.amount,
            title: `${response?.data?.data?.name.toUpperCase()} ${response?.data?.data?.surname.toUpperCase()}`,
            isDirectPayment: true,
            token: response?.data?.data?.token,
            imd: response?.data?.data?.servicer,
            date: moment(new Date()).format('YYYY-MM-DD hh:mm:ss A'),
          };
          dispatch({
            type: actionTypes.SET_LOADER,
            payload: false,
          });
          // if (response.data.data?.iban.substr(4, 4).toUpperCase() == 'NBPA') {
          // dispatch({
          //   type: actionTypes.SET_ELSE_RESPONSE_ALERT,
          //   payload: {
          //     state: true,
          //     alertTitle: '',
          //     alertText:
          //       'Same bank beneficiary not allowed for RAAST beneficiary,please try to add beneficiary for IBT',
          //     onPress: () => {
          //       navigation.goBack();
          //     },
          //   },
          // });
          // }
          //  else {
          navigation.navigate('RAASTConfirmDetils', {
            data: body,
            screen: screen_status,
            accountNumber: params.idValue,
          });
          // }
        } else {
          if (sessionControl(response)) {
            navigation.dispatch(
              CommonActions.reset({
                index: 0,
                routes: [{name: 'Login'}],
              }),
            );
            dispatch({
              type: actionTypes.CLEAR_APP_DATA,
            });
          }

          if (response?.headers?.['x-auth-next-token']) {
            dispatch({
              type: actionTypes.SET_TOKEN,
              payload: response?.headers?.['x-auth-next-token'],
            });
            // navigation.navigate('AliasManagment');
          }
          dispatch({
            type: actionTypes.SET_LOADER,
            payload: false,
          });
          dispatch({
            type: actionTypes.SET_ELSE_RESPONSE_ALERT,
            payload: {
              state: true,
              alertTitle: '',
              alertText: response.data?.data?.message
                ? response.data.data.message
                : response.data.responseDescription,
              onPress: () => {
                navigation.goBack();
              },
            },
          });
          // navigation.navigate('AliasManagment');
        }
      })
      .catch((error) => {
        logs.log(error);
        dispatch({
          type: actionTypes.SET_LOADER,
          payload: false,
        });
        navigation.goBack();
      });
  };
//******END OF GET DEFAULT ACC BY ALIAS *** */

//UPDATE RAAST BENEF
export const updateRAASTBenef = (navigation, params) => async (dispatch) => {
  dispatch({
    type: actionTypes.SET_LOADER,
    payload: true,
  });

  logs.log('before going into the update Benef ', params);
  logs.log(
    `${Config.base_url.UAT_URL}${Config.method.raast}/${Config.endpoint.beneficary}/${Config.endpoint.add}?channel=${Config.channel.channel}`,
  );

  axios
    .put(
      `${Config.base_url.UAT_URL}${Config.method.raast}/${Config.endpoint.beneficary}/${Config.endpoint.add}`,
      {
        accountNo: params.accountNo,
        benefiAlias: params.benefiAlias,
        benefiEmail: params.benefiEmail,
        benefiMobile: params.benefiMobile,
        benefiTitle: params.benefiTitle,
        benefiType: params.benefiType,
        companyName: params.companyName,
        imd: params.imd,
        token: params.token,
        tranType: params.tranType,
      },
      {
        headers: {'X-Auth-Token': store.getState().reducers.token},
      },
    )
    .then((response) => {
      logs.log('updateRAASTBenef', response.data);
      if (response.status === 200 && response.data.responseCode === '00') {
        logs.log('updateRAASTBenef', response.data);
        dispatch({
          type: actionTypes.SET_TOKEN,
          payload: response?.headers?.['x-auth-next-token'],
        });
        // logs.log('HOGYA ');
        navigation.navigate('RAASTBenefMPIN', response?.data);

        // setTimeout(() => {
        //   dispatch({
        //     type: actionTypes.SET_ELSE_RESPONSE_ALERT,
        //     payload: {
        //       state: true,
        //       alertTitle: '',
        //       alertText: 'Beneficary Added Successfully',
        //       onPress: () => {
        //         navigation.goBack();
        //         navigation.goBack();
        //         navigation.goBack();
        //       },
        //     },
        //   });
        // }, 200);

        dispatch({
          type: actionTypes.SET_LOADER,
          payload: false,
        });
      } else {
        if (response?.headers?.['x-auth-next-token']) {
          dispatch({
            type: actionTypes.SET_TOKEN,
            payload: response?.headers?.['x-auth-next-token'],
          });
        }
        dispatch({
          type: actionTypes.SET_LOADER,
          payload: false,
        });
        dispatch({
          type: actionTypes.SET_ELSE_RESPONSE_ALERT,
          payload: {
            state: true,
            alertTitle: 'Beneficary Update',
            alertText: response.data?.data?.message
              ? response.data.data.message
              : response.data.responseDescription,
          },
        });
        if (sessionControl(response)) {
          navigation.dispatch(
            CommonActions.reset({
              index: 0,
              routes: [{name: 'Login'}],
            }),
          );
          dispatch({
            type: actionTypes.CLEAR_APP_DATA,
          });
        }
      }
    })
    .catch((error) => {
      dispatch({
        type: actionTypes.SET_LOADER,
        payload: false,
      });
      dispatch({
        type: actionTypes.SET_ELSE_RESPONSE_ALERT,
        payload: {
          state: true,
          alertTitle: 'Beneficary Update',
          alertText: error.data?.data?.message
            ? error.data.data.message
            : error.data.responseDescription,
        },
      });
    });
};
///////GET PKR ACCOUNTS FOR RAAST BENEF

export const getRAASTbenefiData =
  (navigation, onSuccess) => async (dispatch) => {
    dispatch(setLoader(true));
    axios
      .get(
        `${Config.base_url.UAT_URL}${Config.method.my}/${Config.endpoint.pkraccounts}`,
        {
          channel: `${Config.channel.channel}`,
          headers: {'X-Auth-Token': store.getState().reducers.token},
        },
      )
      .then((response) => {
        if (response.status === 200 && response.data.responseCode === '00') {
          dispatch({
            type: actionTypes.SET_TOKEN,
            payload: response?.headers?.['x-auth-next-token'],
          });
          dispatch(
            setUserObject({
              pkAccounts: response?.data?.data?.accounts,
            }),
          );
          onSuccess();
          dispatch(setLoader(false));

          // navigation.navigate('by_alias');
        } else {
          if (response?.headers?.['x-auth-next-token']) {
            dispatch(setLoader(false));

            dispatch({
              type: actionTypes.SET_TOKEN,
              payload: response?.headers?.['x-auth-next-token'],
            });
          }
          if (sessionControl(response)) {
            dispatch(setLoader(false));

            navigation.dispatch(
              CommonActions.reset({
                index: 0,
                routes: [{name: 'Login'}],
              }),
            );
            dispatch({
              type: actionTypes.CLEAR_APP_DATA,
            });
          }

          dispatch({
            type: actionTypes.SET_ELSE_RESPONSE_ALERT,
            payload: {
              state: true,
              alertTitle: '',
              alertText: response.data?.data?.message
                ? response.data.data.message
                : response.data.responseDescription,
            },
          });
          dispatch(setLoader(false));
        }
      })
      .catch((error) => {
        dispatch(setLoader(false));

        let message = '';
        if (!error.status) {
          // network error
          message = Message.networkErrorMessage;
        } else {
          message = String(error);
        }
        dispatch({
          type: actionTypes.SET_ELSE_RESPONSE_ALERT,
          payload: {
            state: true,
            alertTitle: '',
            alertText: message,
          },
        });
      });
  };

// export const titleFetchRAASTBenefByIban =
//   (screen_status, navigation, params) => async (dispatch) => {
//     dispatch({
//       type: actionTypes.SET_LOADER,
//       payload: true,
//     });

//     axios
//       .post(
//         `${Config.base_url.UAT_URL}${Config.method.raast}/${Config.method.payment}/${Config.endpoint.titlefetch}`,
//         {
//           amount: params.amount,
//           idType: params.idType,
//           idValue: '',
//           memberid: params.memberid,
//           receiveriban: params.receiveriban,
//         },
//         {
//           headers: {'X-Auth-Token': store.getState().reducers.token},
//         },
//       )

//       .then((response) => {
//         logs.logResponse(response.data);
//         if (response.status === 200 && response.data.responseCode === '00') {
//           dispatch({
//             type: actionTypes.SET_TOKEN,
//             payload: response?.headers?.['x-auth-next-token'],
//           });
//           // params.acctitle = response.data.data.acctitle;
//           // params.acctype = response.data.data.acctype;
//           // params.token = response.data.data.token;
//           // (params.fee = '0'),
//           //   (params.narration = 'NBP RAAST PAYMNETS'),
//           //   (params.rcvrEmailAddress = response.data?.data?.rcvrEmailAddress
//           //     ? response.data.data.rcvrEmailAddress
//           //     : ''),
//           //   (params.rcvrMobileNumber = response.data?.data?.rcvrMobileNumber
//           //     ? response.data.data.rcvrMobileNumber
//           //     : ''),
//           //   (params.receiverName = response.data.data.acctitle),
//           //   (params.receiveriban = params.receiveriban),
//           //   // navigateTo(screen,params)
//           //   navigation.navigate('RAASTInfoShow', {
//           //     screen: screen_status,
//           //     param: params,
//           //   });

//           dispatch({
//             type: actionTypes.SET_LOADER,
//             payload: false,
//           });
//         } else {
//           if (sessionControl(response)) {
//             navigation.dispatch(
//               CommonActions.reset({
//                 index: 0,
//                 routes: [{name: 'Login'}],
//               }),
//             );
//             dispatch({
//               type: actionTypes.CLEAR_APP_DATA,
//             });
//           }

//           if (response?.headers?.['x-auth-next-token']) {
//             dispatch({
//               type: actionTypes.SET_TOKEN,
//               payload: response?.headers?.['x-auth-next-token'],
//             });
//             // navigation.navigate('AliasManagment');
//           }
//           dispatch({
//             type: actionTypes.SET_LOADER,
//             payload: false,
//           });
//           dispatch({
//             type: actionTypes.SET_ELSE_RESPONSE_ALERT,
//             payload: {
//               state: true,
//               alertTitle: '',
//               alertText: response.data?.data?.message
//                 ? response.data.data.message
//                 : response.data.responseDescription,
//               onPress: () => {
//                 navigation.goBack();
//               },
//             },
//           });
//           // navigation.navigate('AliasManagment');
//         }
//       })
//       .catch((error) => {
//         logs.log(error);
//         dispatch({
//           type: actionTypes.SET_LOADER,
//           payload: false,
//         });
//         navigation.goBack();
//       });
//   };

export const titleFetchRAASTBenefByIban =
  (screen_status, navigation, params) => async (dispatch) => {
    dispatch({
      type: actionTypes.SET_LOADER,
      payload: true,
    });
    logs.log(
      'from payemnt ',

      `${Config.base_url.UAT_URL}${Config.method.raast}/${Config.method.payment}/${Config.endpoint.titlefetch}`,
      {
        amount: params.amount,
        idType: params.idType,
        idValue: params.idValue,
        memberid: params.memberid,
        receiveriban: params.receiveriban,
        bankName: params.bankName,
      },
    );
    axios
      .post(
        `${Config.base_url.UAT_URL}${Config.method.raast}/${Config.method.payment}/${Config.endpoint.titlefetch}`,
        {
          amount: params.amount,
          idType: params.idType,
          idValue: '',
          memberid: params.memberid,
          receiveriban: params.receiveriban,
        },
        {
          headers: {'X-Auth-Token': store.getState().reducers.token},
        },
      )

      .then((response) => {
        logs.logResponse(response.data);
        if (response.status === 200 && response.data.responseCode === '00') {
          dispatch({
            type: actionTypes.SET_TOKEN,
            payload: response?.headers?.['x-auth-next-token'],
          });
          logs.log(`from previous screen${JSON.stringify(params)}`);
          let res1 = params.receiveriban.slice(8, 12);
          let res2 = params.receiveriban.slice(14, 24);
          let result = `${res1}${res2}`;
          let body = {
            iban: params.source_iban,
            toAccount: result,
            amount: params?.amount,
            title: `${response?.data?.data.acctitle}`,
            isDirectPayment: true,
            token: response?.data?.data?.token,
            imd: params.memberid,
            date: moment(new Date()).format('YYYY-MM-DD hh:mm:ss A'),
            fullIBAN: params.receiveriban,
            bankName: params.bankName,
          };

          // let body=
          // {
          //   title=response?.data?.data.acctitle
          // }
          logs.log('response.data from iban title fetch', response?.data?.data);

          navigation.navigate('RAASTConfirmDetils', {
            data: body,
            benefAlias: params.idValue,
            screenRoute: screen_status,
          });
          dispatch({
            type: actionTypes.SET_LOADER,
            payload: false,
          });
        } else {
          if (sessionControl(response)) {
            navigation.dispatch(
              CommonActions.reset({
                index: 0,
                routes: [{name: 'Login'}],
              }),
            );
            dispatch({
              type: actionTypes.CLEAR_APP_DATA,
            });
            dispatch({
              type: actionTypes.SET_LOADER,
              payload: false,
            });
          }

          if (response?.headers?.['x-auth-next-token']) {
            dispatch({
              type: actionTypes.SET_LOADER,
              payload: false,
            });
            dispatch({
              type: actionTypes.SET_TOKEN,
              payload: response?.headers?.['x-auth-next-token'],
            });
            // navigation.navigate('AliasManagment');
          }
          dispatch({
            type: actionTypes.SET_LOADER,
            payload: false,
          });
          dispatch({
            type: actionTypes.SET_ELSE_RESPONSE_ALERT,
            payload: {
              state: true,
              alertTitle: '',
              alertText: response.data?.data?.message
                ? response.data.data.message
                : response.data.responseDescription,
              onPress: () => {
                navigation.goBack();
              },
            },
          });
          // navigation.navigate('AliasManagment');
        }
      })

      .catch((error) => {
        logs.log(error);
        dispatch({
          type: actionTypes.SET_LOADER,
          payload: false,
        });
        navigation.goBack();
      });
  };

export const getRAASTID =
  (navigation, params, onSuccess, onFailure) => async (dispatch) => {
    dispatch({
      type: actionTypes.SET_LOADER,
      payload: true,
    });
    logs.log(
      'asdasdasdasd',
      `${Config.base_url.UAT_URL}${Config.method.raast}/${Config.method.customeraccount}/${Config.endpoint.getdefaultaccountbyalias}`,
      params.idType,
      params.idValue,
      params.amount,
      params.iban,
    );
    axios
      .post(
        `${Config.base_url.UAT_URL}${Config.method.raast}/${Config.method.customeraccount}/${Config.endpoint.getdefaultaccountbyalias}`,

        {
          aliasType: params.aliasType,
          aliasValue: params.aliasValue,
          amount: params.amount,
          iban: params.iban,
        },
        {
          headers: {'X-Auth-Token': store.getState().reducers.token},
        },
      )

      .then((response) => {
        logs.logResponse(response.data);
        if (response.status === 200 && response.data.responseCode === '00') {
          dispatch({
            type: actionTypes.SET_TOKEN,
            payload: response?.headers?.['x-auth-next-token'],
          });
          if (response.data.data.iban.includes('NBP')) {
            onSuccess();
          } else {
            onFailure();
          }

          dispatch({
            type: actionTypes.SET_LOADER,
            payload: false,
          });
        } else {
          if (response?.headers?.['x-auth-next-token']) {
            dispatch({
              type: actionTypes.SET_TOKEN,
              payload: response?.headers?.['x-auth-next-token'],
            });
            // navigation.navigate('AliasManagment');
          }
          onFailure();
          dispatch({
            type: actionTypes.SET_LOADER,
            payload: false,
          });
        }
      })
      .catch((error) => {
        dispatch({
          type: actionTypes.SET_LOADER,
          payload: false,
        });
        onFailure();
      });
  };
//******START OF  BANK LIST ********* */
export const gettransferbanklist =
  (navigation, navigateto) => async (dispatch) => {
    dispatch({
      type: actionTypes.SET_LOADER,
      payload: true,
    });
    logs.logRequest(
      `${Config.base_url.UAT_URL}${Config.method.transfer}/${
        Config.endpoint.banks
      },
{
  channel: ${Config.channel.channel},
  headers: {'X-Auth-Token': ${store.getState().reducers.token}},
},`,
    );
    axios
      .get(
        `${Config.base_url.UAT_URL}${Config.method.transfer}/${Config.endpoint.banks}`,
        {
          channel: `${Config.channel.channel}`,
          headers: {'X-Auth-Token': store.getState().reducers.token},
        },
      )
      .then((response) => {
        logs.logResponse(response.data);
        if (response.status === 200 && response.data.responseCode === '00') {
          dispatch({
            type: actionTypes.SET_TOKEN,
            payload: response?.headers?.['x-auth-next-token'],
          });
          dispatch({
            type: actionTypes.SET_BANK_LIST,
            payload: response.data.data,
          });
          dispatch({
            type: actionTypes.SET_LOADER,
            payload: false,
          });
          // navigation.navigate('by_iban');
          navigateto(response.data.data);
        } else {
          if (response?.headers?.['x-auth-next-token']) {
            dispatch({
              type: actionTypes.SET_TOKEN,
              payload: response?.headers?.['x-auth-next-token'],
            });
          }
          if (sessionControl(response)) {
            navigation.dispatch(
              CommonActions.reset({
                index: 0,
                routes: [{name: 'Login'}],
              }),
            );
            dispatch({
              type: actionTypes.CLEAR_APP_DATA,
            });
          }

          dispatch({
            type: actionTypes.SET_LOADER,
            payload: false,
          });

          dispatch({
            type: actionTypes.SET_ELSE_RESPONSE_ALERT,
            payload: {
              state: true,
              alertTitle: '',
              alertText: response.data?.data?.message
                ? response.data.data.message
                : response.data.responseDescription,
            },
          });
        }
      })
      .catch((error) => {
        logs.log(`error : ${JSON.stringify(error)}`);
        navigation.goBack();

        dispatch({
          type: actionTypes.SET_LOADER,
          payload: false,
        });
        let message = '';
        if (!error.status) {
          // network error
          message = Message.networkErrorMessage;
        } else {
          message = String(error);
        }
        dispatch({
          type: actionTypes.SET_ELSE_RESPONSE_ALERT,
          payload: {
            state: true,
            alertTitle: '',
            alertText: message,
          },
        });
      });
  };
//*********END OF BANK LIST */
