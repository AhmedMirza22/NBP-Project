import {setLoader, setToken, setAppAlert} from '../Redux/Action/Action';
import axios from 'axios';
import {
  callBaseUrl,
  Config,
  logs,
  sslBuild_Enviornment,
  sslcertificates,
} from '../Config/Config';
import {CommonActions} from '@react-navigation/native';
import store from '../Redux/Store/Store';
import {Message} from '../Constant/Messages';
import {Keyboard} from 'react-native';
import {fetch} from 'react-native-ssl-pinning';
import {sessionControl} from '../Config/Service';

import {Platform, PermissionsAndroid} from 'react-native';
import Geolocation from 'react-native-geolocation-service';
//headerBody,hideLoader,navigateTo,routeObject,notNavigateHome,method,endPoint,navigateBackTo

const makeUrl = (method, endPoint) => {
  // logs.debug(method, endPoint);
  // logs.debug(
  //   `${Config.base_url.UAT_URL}${method}${endPoint ? '/' : ''}${
  //     endPoint ? endPoint : ''
  //   }`,
  // );
  const Request = `${Config.base_url.UAT_URL}${method}${endPoint ? '/' : ''}${
    endPoint ? endPoint : ''
  }`;
  return Request;
};

export const Service = {
  termsAndConditions: makeUrl(
    Config.method.webpages,
    Config.endpoint.getTermsAndConditions,
  ),
  authenticate: makeUrl(Config.method.authenticate, false),
  otpDeviceVerification: makeUrl(
    Config.method.my,
    `${Config.method.Otpwithsmsandemail}/${Config.endpoint.device_verification}`,
  ),
  getAllBillersList: makeUrl(
    Config.method.bill,
    Config.endpoint.getAllBillersList,
  ),
  getOtherBill: makeUrl(`${Config.method.bill}/${Config.endpoint.get}`),
  getUfoneBundles: makeUrl(
    Config.method.bill,
    `${Config.endpoint.getbundleslist}?ucid=UFONE004`,
  ),
  staticQrPayment: makeUrl(Config.method.merchantPayment, Config.endpoint.sqrc),
  dynamicQrPayment: makeUrl(
    Config.method.merchantPayment,
    Config.endpoint.dqrc,
  ),
  versionCheck: makeUrl(Config.method.webpages, Config.endpoint.version),

  billPayment: makeUrl(Config.method.bill, Config.endpoint.pay),
  ibftPayment: makeUrl(Config.method.transfer, Config.endpoint.ibft2),
  validate_Mpin_Otp: makeUrl(Config.method.my, Config.endpoint.otp),
  fundTransferPayment: makeUrl(
    Config.method.transfer,
    Config.endpoint.threepft,
  ),
  cnicPayment: makeUrl(Config.method.bill, Config.endpoint.payToCnic),
  oneStepRegistration: makeUrl(
    `${Config.method.raast}/${Config.method.registration}`,
    Config.endpoint.onestepregistation,
  ),
  aliasLink: makeUrl(
    `${Config.method.raast}/${Config.method.registration}`,
    Config.endpoint.alias_link,
  ),
  aliasUnLink: makeUrl(
    `${Config.method.raast}/${Config.method.customeraccount}`,
    Config.endpoint.alias_unlink,
  ),
  aliasRemoval: makeUrl(
    `${Config.method.raast}/${Config.method.customer}`,
    Config.endpoint.alias_delete,
  ),
  raastPaymentRequest: makeUrl(
    `${Config.method.raast}/${Config.method.payment}`,
    Config.endpoint.paymentrequest,
  ),
  getDefaultAccountByAlias: makeUrl(
    `${Config.method.raast}/${Config.method.customeraccount}`,
    Config.endpoint.getdefaultaccountbyalias,
  ),
  raastTitleFetch: makeUrl(
    `${Config.method.raast}/${Config.method.payment}`,
    Config.endpoint.titlefetch,
  ),
  generateMpin: makeUrl(Config.method.mpin, Config.endpoint.generate),
  forgotMpin: makeUrl(
    Config.method.my,
    `${Config.endpoint.forgetpassword}?channel=${Config.channel.channel}`,
  ),
  changeForgotPin: makeUrl(Config.method.mpin, Config.endpoint.forgot),
  mpinChange: makeUrl(
    Config.method.mpin,
    `${Config.endpoint.change}?${Config.channel.channel}`,
  ),

  resetPassword: makeUrl(Config.method.my, Config.endpoint.password),
  generatePassword: makeUrl(Config.method.my, Config.endpoint.newpassword),
  makeUmpsPayment: makeUrl(Config.method.purchase, Config.endpoint.umpsPayment),
  changeThePassword: makeUrl(Config.method.my, Config.endpoint.newpassword),
  registerWithOTP: makeUrl(
    Config.method.registration,
    Config.endpoint.verifyregistrationotp,
  ),
  registerationGenerate: makeUrl(
    Config.method.registration,
    Config.endpoint.submitregistrationpin,
  ),
  submitRegistrationPin: makeUrl(
    Config.method.registration,
    Config.endpoint.submitregistrationpin,
  ),
  validateCustomerInfo: makeUrl(
    Config.method.registration,
    Config.endpoint.validatecustomerinfo,
  ),
  getBeneficiaries: makeUrl(Config.method.my, Config.endpoint.beneficiaries),
};

export const postCall = (params) => async (dispatch) => {
  let headerBody =
    params.headerBody && Object.keys(params.headerBody).length > 0
      ? params.headerBody
      : {};
  {
    params.hideLoader ? null : dispatch(setLoader(true));
  }
  if (params.navigateTo && params.routeObject && !params.executeThenNavigate) {
    params.navigation.navigate(params.navigateTo, {data: params.routeObject});
  } else if (params.navigateTo && !params.executeThenNavigate) {
    params.navigation.navigate(params.navigateTo);
  }

  axios
    .post(
      `${callBaseUrl}${params.method}/${params.endPoint}`,
      params.queryBody
        ? {
            ...params.queryBody,
          }
        : null,
      params.hideHeader
        ? null
        : params.hideToken
        ? {
            headers: {
              ...headerBody,
            },
          }
        : {
            headers: {
              'X-Auth-Token': store.getState().reducers.token,
              ...headerBody,
            },
          },
    )
    .then((response) => {
      if (
        response.status === 200 &&
        (response.data.responseCode === '00' ||
        response.data.responseCode === params.responseCode
          ? params.responseCode
          : '00')
      ) {
        if (response?.headers?.['x-auth-next-token']) {
          dispatch(setToken(response?.headers?.['x-auth-next-token']));
        }
        if (params.getResponse) {
          params.getResponse(response.data);
        } else {
          if (params.navigateTo && params.executeThenNavigate) {
            if (params.navigateTo && params.routeObject) {
              params.navigation.navigate(params.navigateTo, {
                data: params.routeObject,
              });
              dispatch(setLoader(false));
            } else if (params.navigateTo) {
              params.navigation.navigate(params.navigateTo);
              dispatch(setLoader(false));
            }
          } else if (params.navigateBackTo) {
            params.navigation.navigate(params.navigateBackTo);
            dispatch(setLoader(false));
          } else {
            dispatch(setLoader(false));
          }
        }
      } else {
        if (response?.headers?.['x-auth-next-token']) {
          dispatch(setToken(response?.headers?.['x-auth-next-token']));
        }
        if (sessionControl(response)) {
          params.navigation.dispatch(
            CommonActions.reset({
              index: 0,
              routes: [{name: 'Login'}],
            }),
          );
        }
        if (params.navigateTo) {
          params.navigation.goBack();
        }
        dispatch(setLoader(false));
        if (!params.hideElseResponse) {
          dispatch(
            setAppAlert(
              '',
              response.data?.data?.message
                ? response.data.data.message
                : response.data.responseDescription,
            ),
          );
        }
      }
    })
    .catch((error) => {
      if (params.getErrorData) {
        params.getErrorData(error);
      } else {
        if (params.hideCatchErrorResponse) {
        } else {
          dispatch(setLoader(false));
          let message = '';
          if (!error.status) {
            // network err
            message = Message.networkErrorMessage;
          } else {
            message = String(error);
          }
          dispatch(setAppAlert('', message));
        }
      }
    });
};

function toString(o) {
  Object.keys(o).forEach((k) => {
    if (typeof o[k] === 'object' && o[k]) {
      return toString(o[k]);
    }

    o[k] = '' + o[k];
  });

  return o;
}

export const postTokenCall = async (service, body, header, token) => {
  if (sslBuild_Enviornment) {
    logs.logRequest('SSL PINNING=====', token);
    Keyboard.dismiss();
    const newHeader =
      header && typeof header === 'object'
        ? {
            'X-Auth-Token': token ? token : store.getState().reducers.token,
            ...header,
            'Content-Type': 'application/json',
          }
        : {
            'X-Auth-Token': token ? token : store.getState().reducers.token,
            'Content-Type': 'application/json',
          };
    const stringHeader = toString(newHeader);
    const stringbody = toString(body);

    logs.logRequest(service, {
      method: 'POST',
      body: stringbody ? JSON.stringify(stringbody) : JSON.stringify({}),
      pkPinning: true,
      sslPinning: {
        certs: sslcertificates,
      },
      headers: stringHeader ? stringHeader : JSON.stringify({}),
      // ? JSON.stringify(newHeader)
    });
    return fetch(service, {
      method: 'POST',
      body: stringbody ? JSON.stringify(stringbody) : JSON.stringify({}),
      pkPinning: true,
      sslPinning: {
        certs: sslcertificates,
      },
      headers: stringHeader ? stringHeader : JSON.stringify({}),
      // ? JSON.stringify(newHeader)
    })
      .then((response) => {
        let res = response?.bodyString ? response : null;
        res ? (res['data'] = JSON.parse(response?.bodyString)) : null;
        return res;
      })
      .catch((error) => {
        logs.log('yeh hy mera ofc ', error);
        return error;
      });
  } else {
    Keyboard.dismiss();
    const headerObject =
      header && typeof header === 'object'
        ? {
            'X-Auth-Token': token ? token : store.getState().reducers.token,
            ...header,
          }
        : {
            'X-Auth-Token': token ? token : store.getState().reducers.token,
          };
    logs.logRequest(`
    ${service},${body ? JSON.stringify(body) : `{}`},{
        headers: ${JSON.stringify(headerObject)},
    }
    `);
    // 15000);
    return axios.post(service, body ? body : {}, {
      headers: headerObject,
    });
  }
};

export const postNoTokenCall = async (service, body, header) => {
  if (sslBuild_Enviornment) {
    logs.logRequest('SSL PINNING');

    Keyboard.dismiss();

    const newHeader = {...header, 'Content-Type': 'application/json'};
    const stringHeader = toString(newHeader);
    const stringbody = toString(body);
    newHeader && typeof newHeader === 'object'
      ? logs.logRequest(service, {
          method: 'POST',
          body: body ? JSON.stringify(stringbody) : JSON.stringify(stringbody),
          pkPinning: true,
          sslPinning: {
            certs: sslcertificates,
          },
          headers: stringHeader,
        })
      : logs.logRequest(service, {
          method: 'POST',
          body: body ? JSON.stringify(stringbody) : JSON.stringify(stringbody),
          pkPinning: true,
          sslPinning: {
            certs: sslcertificates,
          },
          headers: {'Content-Type': 'application/json'},
        });

    return newHeader && typeof newHeader === 'object'
      ? fetch(service, {
          method: 'POST',
          body: body ? JSON.stringify(stringbody) : JSON.stringify(stringbody),
          pkPinning: true,
          sslPinning: {
            certs: sslcertificates,
          },
          headers: stringHeader,
        }).then((response) => {
          logs.logResponse(response.bodyString);
          return JSON.parse(response.bodyString);
        })
      : fetch(service, {
          method: 'POST',
          body: body ? JSON.stringify(stringbody) : JSON.stringify(stringbody),
          pkPinning: true,
          sslPinning: {
            certs: sslcertificates,
          },
          headers: {'Content-Type': 'application/json'},
        }).then((response) => {
          return JSON.parse(response.bodyString);
        });
  } else {
    Keyboard.dismiss();
    logs.debug('Service:', service, 'Body: ', body, 'Header: ', header);

    const newHeader = header ? {...header} : false;
    newHeader && typeof newHeader === 'object'
      ? logs.logRequest(service, body ? body : {}, {
          headers: newHeader,
        })
      : logs.logRequest(service, body ? body : {});

    return newHeader && typeof newHeader === 'object'
      ? axios
          .post(service, body ? body : {}, {
            headers: newHeader,
          })
          .then((response) => {
            return response.data;
          })
      : axios.post(service, body ? body : {}).then((response) => {
          return response.data;
        });
  }
};

export const getTokenCall = async (service, queryString, header) => {
  if (sslBuild_Enviornment) {
    Keyboard.dismiss();

    const headerObject =
      header && typeof header === 'object'
        ? {
            'X-Auth-Token': store.getState().reducers.token,
            ...header,
          }
        : {
            'X-Auth-Token': store.getState().reducers.token,
          };
    logs.logRequest(`\n GET REQUEST\n
          ${`${service}${queryString ? `?${queryString}` : ''}`},{
              headers: ${JSON.stringify(headerObject)},
          }
          `);
    const stringHeader = toString(headerObject);

    logs.logRequest(`${service}${queryString ? `?${queryString}` : ''}`, {
      method: 'GET',
      pkPinning: true,
      sslPinning: {
        certs: sslcertificates,
      },
      headers: stringHeader,
    });

    return fetch(`${service}${queryString ? `?${queryString}` : ''}`, {
      method: 'GET',
      pkPinning: true,
      sslPinning: {
        certs: sslcertificates,
      },
      headers: stringHeader,
    }).then((response) => {
      logs.debug(
        'Response==>>getFetchTokenCall',
        JSON.parse(response.bodyString),
        'Response==>>getFetchTokenCall',
      );
      let res = {};
      res['data'] = JSON.parse(response.bodyString);
      return res;
    });
  } else {
    Keyboard.dismiss();
    const headerObject =
      header && typeof header === 'object'
        ? {
            'X-Auth-Token': store.getState().reducers.token,
            ...header,
          }
        : {
            'X-Auth-Token': store.getState().reducers.token,
          };
    logs.logRequest(`\n GET REQUEST\n
        ${`${service}${queryString ? `?${queryString}` : ''}`},{
            headers: ${JSON.stringify(headerObject)},
        }
        `);
    return axios.get(`${service}${queryString ? `?${queryString}` : ''}`, {
      headers: headerObject,
    });
  }
};

export const getTokenSlashCall = (service, queryString) => {
  Keyboard.dismiss();

  logs.logRequest(`\n GET REQUEST\n
        ${`${service}${queryString ? `/${queryString}` : ''}`},{
            headers: {'X-Auth-Token': ${store.getState().reducers.token}},
        }
        `);
  return axios.get(`${service}${queryString ? `/${queryString}` : ''}`, {
    headers: {
      'X-Auth-Token': store.getState().reducers.token,
    },
  });
};

export const getNoTokenCall = async (service, queryString) => {
  if (sslBuild_Enviornment) {
    Keyboard.dismiss();
    logs.logRequest(service, {
      method: 'GET',
      pkPinning: true,
      sslPinning: {
        certs: sslcertificates,
      },
    });
    Keyboard.dismiss();

    return fetch(service, {
      method: 'GET',
      pkPinning: true,
      sslPinning: {
        certs: sslcertificates,
      },
    }).then((response) => {
      // let res = {};
      // res['data'] = response.bodyString
      //   ? JSON.parse(response.bodyString)
      //   : response;
      // return res;
      return response;
    });
  } else {
    Keyboard.dismiss();

    logs.logRequest(`\n${service}${queryString ? `?${queryString}` : ''}`, {});
    return axios.get(`${service}${queryString ? `?${queryString}` : ''}`, {});
  }
};

export const getNoTokenQueryCall = (service, queryString) => {
  Keyboard.dismiss();

  logs.logRequest(
    `
        ${service}/${queryString}
        `,
    {},
  );
  return axios.get(`${service}/${queryString}`, {});
};

export const getNoTokenAllCalls = async (services) => {
  if (sslBuild_Enviornment) {
    Keyboard.dismiss();

    const responses = await Promise.all(services);

    return responses;
  } else {
    Keyboard.dismiss();

    logs.logRequest(JSON.stringify(services));
    return axios.all(services);
  }
};

export const getFetchCall = async (service, queryString) => {
  logs.debug('SSL PINNING===>>>>>>>>>>');
  Keyboard.dismiss();

  const rawRes = await fetch(service, {
    method: 'GET',
    pkPinning: true,
    sslPinning: {
      certs: sslcertificates,
    },
  });

  const data = await rawRes.json();
  logs.debug('SSL PINNING', data, '===========SSL PINNING DATA============');
};

export const geoLocation = async (updateStates) => {
  logs.debug('Into Service GeoLocation Fucntion....');
  if (Platform.OS === 'ios') {
    try {
      await Geolocation.requestAuthorization('whenInUse')
        .then(async (response) => {
          logs.debug('locresponse ', response);

          const location = await subscribeLocationLocation(updateStates);
          logs.debug('If Case..........', location);
          updateStates(location);
        })
        .catch((error) => {
          // notOptional === true ? showLocationAlert() : null;

          logs.debug('error loc ios', error);
        });
    } catch (error) {
      logs.debug('exceiption error9 : ', error);
    }
  } else {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        logs.debug('Try Case..........'),
      );
      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        //To Check, If Permission is granted
        const location = await subscribeLocationLocation(updateStates);
        logs.debug('If Case..........', location);
        updateStates(location);
      } else {
        logs.debug('Else Case..........');
        // notOptional === true ? showLocationAlert() : null;
      }
    } catch (err) {
      logs.debug('error getting current location ', err);
      logs.debug('Error Case..........');
    }
  }
};

function subscribeLocationLocation(updateStates) {
  return new Promise((resolve, reject) => {
    Geolocation.getCurrentPosition(
      (position) => {
        const {latitude, longitude} = position.coords;
        resolve({latitude, longitude});
      },
      (error) => {
        reject(error);
      },
      {enableHighAccuracy: true, timeout: 20000, maximumAge: 1000},
    );
  });
}
