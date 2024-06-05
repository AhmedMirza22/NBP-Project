import {Config, deviceVersionString, logs, appInfo} from '../Config/Config';
import axios from 'axios';
import {getRequest} from '../Helpers/Helper';
// import {AsyncStorage} from 'react-native';
import DeviceInfo from 'react-native-device-info';
import {Platform} from 'react-native';
import {setLoader} from '../Redux/Action/Action';
import {geoLocation} from '../Config/Service';
import store from '../Redux/Store/Store';
function setnexttoken(next_token) {
  // AsyncStorage.setItem('nextToken', next_token);
}
export function get_version(version) {
  var authOptions = {
    url:
      Config.base_url.UAT_URL +
      '/' +
      Config.method.version_check +
      '/' +
      Config.endpoint.version_check +
      'version?version=' +
      version +
      '&deviceData=Older%20Application%20Version',
    method: 'POST',
    header: {'Content-Type': 'application/jason'},
    data: version,
  };

  return axios(authOptions)
    .then((res) => {})
    .catch((err) => {});
}
export async function post(
  token,
  moduleName,
  methodName,
  requestData,
  navigation,
  getResponseData,
  getErrorData,
  setNextToken,
  otpVerification,
) {
  logs.log(`requestData : ${JSON.stringify(requestData)}`);
  var headers = {
    'X-Auth-Token': token === null ? '' : token,
    'Content-Type': 'application/json',
    Accept: 'application/json',
  };
  if (token) {
    var authOptions = getRequest(
      'POST',
      `${Config.base_url.UAT_URL}${moduleName}/${methodName}`,
      headers,
    );

    logs.log('B0909', `${Config.base_url.UAT_URL}${moduleName}/${methodName}`);
  } else {
    var authOptions = getRequest(
      'POST',
      `${Config.base_url.UAT_URL}${moduleName}/${methodName}`,
    );
  }
  logs.logRequest(`authOptions : ${JSON.stringify(authOptions)}`);

  authOptions.data = requestData;

  return axios(authOptions)
    .then((res) => {
      const response = res.data;
      logs.logResponse(response);
      //{"responseCode": "71", "responseDescription": "OTP tries exhaust"}
      if (response.responseCode == '00') {
        setNextToken(res.headers['x-auth-next-token']);
        logs.log('A6575', response);
        getResponseData(response.data == null ? response : response.data);
      } else if (otpVerification && response.responseCode === '58') {
        if (res.headers['x-auth-next-token']) {
          setNextToken(res.headers['x-auth-next-token']);
        }
        getResponseData(response);
      } else if (res.headers['x-auth-next-token']) {
        getErrorData(response);
        setNextToken(res.headers['x-auth-next-token']);
      } else {
        getErrorData(response);
      }
    })
    .catch((error) => {
      getErrorData(error);
      return error;
    });
}

/////second call  for login

export async function post_login(
  username,
  pass,
  moduleName,
  methodName,
  requestData,
  navigation,
  getResponseData,
  getErrorData,
  fcmToken,
) {
  // let currentLatitude = 0;
  // let currentLongitude = 0;
  // geoLocation((location) => {
  //   logs.debug(
  //     'location.latitude--->>>',
  //     location.latitude,
  //     'location.longitude',
  //     location.longitude,
  //   );
  //   currentLatitude = location.latitude;
  //   currentLongitude = location.longitude;
  // });
  logs.log('asd6123761523---====>', requestData);
  var authOptions = {
    url: `${Config.base_url.UAT_URL}${Config.method.authenticate}`,
    method: 'POST',
    headers: {
      'X-Auth-Username': username,
      'X-Auth-Password': pass,
      IS_FP: false,
      'X-Device-Token': fcmToken,
      'X-Device-Type': Platform.OS == 'ios' ? 'ios' : 'android',
      'X-Device-ID': DeviceInfo.getUniqueId(),
      Channel: 'MOBILE_APP',
      'Is-Rooted': appInfo.isJailBroken,
      'Make-Model': appInfo.deviceName,
      latitude: requestData?.currentLatitude,
      longitude: requestData?.currentLongitude,
      'X-Player-ID': store.getState().reducers.userObject.PlayerId,
      'X-Device-Version': deviceVersionString,
    },
  };

  logs.logRequest(`
  ${Config.base_url.UAT_URL}${Config.method.authenticate},
    method: 'POST',
    headers: {
      'X-Auth-Username': ${username},
      'X-Auth-Password': ${pass},
      IS_FP: false,
      'X-Device-Token': '${fcmToken}',
      'X-Device-Type': ${Platform.OS == 'ios' ? 'ios' : 'android'},
      'X-Device-ID': ${DeviceInfo.getUniqueId()},
      Channel: 'MOBILE_APP',
      Is-Rooted: ${appInfo.isJailBroken},
      Make-Model: ${appInfo.deviceName},
      'X-Player-ID': ${store.getState().reducers.userObject.PlayerId},
      'X-Device-Version': ${deviceVersionString},

    },
  };
  `);

  return axios(authOptions)
    .then((res) => {
      const response = res.data;
      logs.logResponse(response);
      if (response.responseCode == '00') {
        logs.logResponse(response);
        getResponseData(response.data == null ? response : response.data);
      } else {
        getErrorData(response);
      }
    })
    .catch((error) => {
      getErrorData(error.message);
      return error;
    });
}

// FINGERPTINT SIGNIN POSTLOGIN
export async function touchSignin(
  username,
  pass,
  deviceToken,
  moduleName,
  methodName,
  requestData,
  navigation,
  getResponseData,
  getErrorData,
) {
  var authOptions = {
    url: `${Config.base_url.UAT_URL}/${Config.method.authenticate}`,
    method: 'POST',
    headers: {
      'X-Auth-Username': username,
      'X-Auth-Password': pass,
      IS_FP: true,
      'X-Device-Token': deviceToken,
      'X-Device-Type': Platform.OS == 'ios' ? 'ios' : 'android',
      'X-Device-ID': DeviceInfo.getUniqueId(),
      'X-Device-Version': deviceVersionString,
      'Is-Rooted': appInfo.isJailBroken,
      'Make-Model': appInfo.deviceName,

      //
      // 'X-Device-Token': fcmToken,
    },
  };
  // authOptions.data=requestData;
  return axios(authOptions)
    .then((res) => {
      const response = res.data;
      if (response.responseCode == '00') {
        getResponseData(response.data == null ? response : response.data);
      } else {
        getErrorData(response);
      }
    })
    .catch((error) => {
      getErrorData(error.message);
      return error;
    });
}
// ENDS FINGERPTINT SIGNIN POSTLOGIN

// ***** DASHBOARD OVERVIEW WITHOUT BALANCE DATA API *****
export async function get_over_without_blnc(
  token,
  moduleName,
  methodName,
  // requestData,
  navigation,
  getResponseData,
  getErrorData,
) {
  // var token = await AsyncStorage.getItem('nextToken');
  // var token='';
  setLoader(true);
  var headers = {
    'X-Auth-Token': token === null ? '' : token,
    isTnCAgreed: true,
  };
  var authOptions = getRequest(
    'GET',
    `${Config.base_url.UAT_URL}${moduleName}/${methodName}`,
    headers,
  );
  // authOptions.data=requestData;
  return axios(authOptions)
    .then((res) => {
      const response = res.data;
      if (response.responseCode == '00') {
        // setnexttoken(res.headers['x-auth-next-token']);

        getResponseData(response.data == null ? response : res);
      } else {
        getErrorData(response);
        // setnexttoken(res.headers['x-auth-next-token']);
      }
      // getErrorData(
      //     response.data
      // );
      setLoader(false);
    })
    .catch((error) => {
      setLoader(false);
      getErrorData(error);
      // useLinkProps.navigation.navigate('Login')
      return error;
    });
}
// ***** ENDS DASHBOARD OVERVIEW WITHOUT BALANCE DATA API *****

// ***** MY ACCOUNTS/ VIEW ACCOUNTS SCREEN DATA API *****
export async function getMyAccountViewAccounts(
  token,
  method,
  endPoint,
  channel,
) {
  var headers = {
    'X-Auth-Token': token,
  };
  // TODAY 25TH MARCH ENDS THE DAY
}
// ***** ENDS MY ACCOUNTS/ VIEW ACCOUNTS SCREEN DATA API *****

// export const myAccount=(navigation)=async(dispatch)=>{
//   dispatch({})
// }

//city code
