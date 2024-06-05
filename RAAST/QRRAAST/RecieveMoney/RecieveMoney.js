import React, {useRef, useState, useEffect} from 'react';
import {
  View,
  Text,
  Alert,
  TouchableWithoutFeedback,
  Image,
  TouchableOpacity,
  PermissionsAndroid,
  KeyboardAvoidingView,
} from 'react-native';
import {QRreader} from 'react-native-qr-decode-image-camera';
import {launchImageLibrary} from 'react-native-image-picker';
import Share from 'react-native-share';
import {useDispatch, useSelector} from 'react-redux';
import {QRonDashboard, logs} from '../../../../Config/Config';
import {globalStyling, hp, wp} from '../../../../Constant';
import moment from 'moment';
import Entypo from 'react-native-vector-icons/Entypo';
import Feather from 'react-native-vector-icons/Feather';
import DateTimePicker from 'react-native-modal-datetime-picker';
import AndroidDateTimePicker from '@react-native-community/datetimepicker';
import QRCode from 'react-native-qrcode-svg';
import styles from './ReieveMoneyStyle';
import {Images, Colors} from '../../../../Theme';
import {fontFamily} from '../../../../Theme/Fonts';
import TabNavigator from '../../../../Components/TabNavigate/TabNavigate';
import CustomModal from '../../../../Components/CustomModal/CustomModal';
import CustomText from '../../../../Components/CustomText/CustomText';
import SubHeader from '../../../../Components/GlobalHeader/SubHeader/SubHeader';
import CustomTextField from '../../../../Components/CustomTextField/CustomTextField';
import {Switch} from 'react-native-switch';
import {captureRef} from 'react-native-view-shot';
import AntDesign from 'react-native-vector-icons/AntDesign';
import CustomBtn from '../../../../Components/Custom_btn/Custom_btn';
import {ScrollView} from 'react-native';
import analytics from '@react-native-firebase/analytics';
import {
  generatingQr,
  getDateFormat,
  maskedAccount,
} from '../../../../Helpers/Helper';
import DeviceInfo from 'react-native-device-info';
import {Platform} from 'react-native';
import {
  agreeToAddVirtualCard,
  catchError,
  changeGlobalAlertState,
  closeGlobalAlertState,
  getraastbanklist,
  serviceResponseCheck,
  setAppAlert,
  setLoader,
  setQrScannerState,
  setUserObject,
  updateSessionToken,
  generateQrCode,
  QRMaking,
  QRParsing,
} from '../../../../Redux/Action/Action';
import {Service, getTokenCall} from '../../../../Config/Service';
import CustomAlert from '../../../../Components/Custom_Alert/CustomAlert';
import {CommonActions} from '@react-navigation/native';
import store from '../../../../Redux/Store/Store';
import {parseQrScanCode} from '../../../../Components/QrScanner/parseQrScanCode';
import {Message} from '../../../../Constant/Messages';
import I18n from '../../../../Config/Language/LocalizeLanguageString';
var RNFetchBlob = require('rn-fetch-blob').default;
const PictureDir =
  Platform.OS === 'android'
    ? RNFetchBlob.fs.dirs.DownloadDir
    : RNFetchBlob.fs.dirs.DocumentDir;

export default function SendMoneyRAAST(props) {
  const loginResponse = useSelector((state) => state.reducers.loginResponse);
  const dispatch = useDispatch();
  const hideButton = props?.route?.params?.fromShareModal;
  const [amount, setAmount] = useState('0');
  const [isAmount, setIsAmount] = useState(false);
  const overViewData = useSelector((state) => state.reducers.overViewData);
  const [qrString, setQrString] = useState();

  const [date, setDate] = useState('');
  const [date_show, setDate_show] = useState(false);
  const [modal, change_modal_state] = useState(false);
  const [modal_type, change_modal_type] = useState('');
  const [dateValue, setDateValue] = useState(false);
  const [value, setValue] = useState({
    format: 'jpg',
    quality: 0.9,
  });
  const [cameraOff, setCameraOff] = useState(false);
  const [proceedAlert, changeproceedAlert] = useState(false);
  const [error, setError] = useState(null);
  const [res, setRes] = useState(null);
  const [previewSource, setPreviewResource] = useState(null);
  const userObject = useSelector((state) => state?.reducers?.userObject);
  const accounts = userObject?.pkAccounts;
  const [tab_from_acc, change_from_acc] = useState({
    // account: accounts[0]?.account,
    // iban: accounts[0]?.iban,
    // accountType: accounts[0]?.accountType,
    // currency: accounts[0]?.currency,
    // accountTitle: accounts[0]?.accountTitle,
  });
  const qrGenerateValue = useSelector(
    (state) => state.reducers.qrGenerateValue,
  );
  const [checkCard, setCheckCard] = useState(true);
  const unsorted_reason = useSelector((state) => state.reducers.raastbank);
  const [QrTypeModal, setQRTypeModal] = useState(false);
  const QrType = [
    {text: 'Gallery', id: 4001},
    {text: 'Camera', id: 4000},
  ];
  const virtualCardObject = useSelector(
    (state) => state.reducers.virtualCardObject,
  );
  const virtualCardStatus = useSelector(
    (state) => state.reducers.virtualCardStatus,
  );
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
  var future = new Date();
  future.setDate(future.getDate() + 1);
  future.toISOString().slice(0, 10);
  const viewRef = useRef();
  const prevDate = useRef();
  const prevAmount = useRef();
  const onChangeAmount = () => {
    setAmount('0');
    setIsAmount(!isAmount);
  };
  let interval;
  function clearInt() {
    clearInterval(interval);
  }
  const hitApiCall = () => {
    dispatch(generateQrCode(props.navigation));

    // Replace this with your API call to generate the QR code string
    console.log('API call to generate QR code');
  };

  useEffect(() => {
    let interval;

    const handleApiCallAndTimer = () => {
      if (!checkCard) {
        hitApiCall();
        interval = setInterval(hitApiCall, 5 * 60 * 1000);
      }
    };

    handleApiCallAndTimer();

    return () => clearInterval(interval);
  }, [checkCard]);

  useEffect(() => {
    change_from_acc({
      account: accounts[0]?.account,
      iban: accounts[0]?.iban,
      accountType: accounts[0]?.accountType,
      currency: accounts[0]?.currency,
      accountTitle: accounts[0]?.accountTitle,
    });
    async function analyticsLog() {
      await analytics().logEvent('RecievedMoney');
    }
    analyticsLog();
  }, []);
  React.useEffect(() => {
    if (amount.length == 0) {
      logs.log('amount.length', amount.length);
      setAmount('0');
    }
    prevAmount.current = amount;
  }, [amount]);

  React.useEffect(() => {
    prevDate.current = date;
  }, [date]);
  React.useEffect(() => {
    if (checkCard) {
    }
    setDate(moment(future).format('DDMMYYYYhhmm'));
    setDateValue(moment(future).format('DD-MMMM-YYYY'));
    if (hideButton) {
      setTimeout(() => {
        takeScreenShot();
      }, 500);
    }
  }, []);
  React.useEffect(() => {}, [isAmount, amount]);
  function handleConfirm(datee) {
    logs.log('logsdate', datee);
    setDate_show(false);

    setDate(moment(datee).format('DD-MM-YYYY hh:mm'));
  }
  function hideDatePicker() {
    setDate_show(false);
  }

  const qr = () => {
    return (
      <View style={{alignSelf: 'center'}}>
        <QRCode
          value={generatingQr(overViewData.data.accounts.iban)}
          size={wp(40)}
          logo={Images.raast2nd}
          color={Colors.mainTextColors}
          logoSize={wp(10)}
          logoBackgroundColor={Colors.subContainer}
          // logoMargin={5}
          backgroundColor="transparent"
        />
      </View>
    );
  };
  const unionPayQrCode = () => {
    return (
      <View style={{alignSelf: 'center'}}>
        {qrGenerateValue !== '' ? (
          <QRCode
            value={qrGenerateValue}
            size={wp(40)}
            logo={Images.unionPay}
            logoSize={wp(10)}
            logoBackgroundColor={Colors.whiteColor}
          />
        ) : (
          <View
            style={{
              height: wp(40),
              width: wp(40),
              justifyContent: 'center',
              alignItems: 'center',
            }}>
            <Image source={Images.unionPay} style={globalStyling.image} />
          </View>
        )}
      </View>
    );
  };

  const infoPortion = () => {
    return (
      <View style={{width: wp(70), alignSelf: 'center'}}>
        <View
          style={{flexDirection: 'column', justifyContent: 'space-between'}}>
          <CustomText
            boldFont={true}
            style={{textAlign: 'center', fontSize: wp(5)}}>
            {loginResponse?.details?.accountTitle}
          </CustomText>
          {checkCard ? (
            <CustomText
              style={{textAlign: 'center', fontSize: wp(4), padding: wp(1)}}>
              <CustomText boldFont={true}>RAAST ID :</CustomText>
              {loginResponse?.details?.mobile}
            </CustomText>
          ) : null}
          {checkCard ? (
            <CustomText style={{textAlign: 'center', fontSize: wp(4)}}>
              {maskedAccount(loginResponse?.details?.ibanNo)}
            </CustomText>
          ) : null}
        </View>
        {isAmount ? (
          <>
            <View
              style={{flexDirection: 'row', justifyContent: 'space-between'}}>
              <CustomText boldFont={true}>Amount</CustomText>
              <CustomText>{amount}</CustomText>
            </View>
            <View
              style={{flexDirection: 'row', justifyContent: 'space-between'}}>
              <CustomText boldFont={true}>Date</CustomText>
              <CustomText>{dateValue}</CustomText>
            </View>
          </>
        ) : null}

        {/* <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
          <CustomText boldFont={true}>Title</CustomText>
          <CustomText>{overViewData.data.accounts.accountTitle}</CustomText>
        </View> */}
      </View>
    );
  };
  const shareButton = () => {
    return (
      <TouchableOpacity
        style={{
          backgroundColor: Colors.secondaryColor,
          //   width: wp(15),
          height: wp(10),
          alignItems: 'center',
          alignSelf: 'center',
          justifyContent: 'center',
          borderRadius: wp(100),
          flexDirection: 'row',
        }}
        onPress={() => {
          takeScreenShot();
        }}>
        <CustomText
          style={{
            color: Colors.whiteColor,
            alignSelf: 'center',
            fontSize: wp(4),
            fontFamily: fontFamily['ArticulatCF-Normal'],
          }}>
          {`    Share   `}
        </CustomText>

        {Platform.OS == 'android' ? (
          <Entypo
            name={'share'}
            size={wp(5)}
            color={Colors.whiteColor}
            style={{alignSelf: 'center'}}
          />
        ) : (
          <Feather
            name={'share'}
            size={wp(5)}
            color={Colors.whiteColor}
            style={{alignSelf: 'center'}}
          />
        )}
        <CustomText
          style={{color: Colors.whiteColor, alignSelf: 'center'}}
          boldFont={true}>
          {`    `}
        </CustomText>
      </TouchableOpacity>
    );
  };
  const takeScreenShot = async () => {
    if (Platform.OS === 'ios') {
      // info.plist permission has to be  added
      // info.plist permission has to be  added
      captureRef(viewRef, value)
        .then((res) =>
          value.result !== 'file'
            ? res
            : new Promise((success, failure) =>
                // just a test to ensure res can be used in Image.getSize
                Image.getSize(
                  res,
                  (width, height) => (console.log(res, 300, 300), success(res)),
                  failure,
                ),
              ),
        )
        .then((res) => {
          setError(null);
          setRes(res);
          setPreviewResource({uri: res});
          let imageLocation = PictureDir + '/' + String(res).split('-').pop();
          try {
            // RNFetchBlob.fs.writeFile(imageLocation, res, 'uri');
            const shareOptions = {
              title: 'Share QR Code',
              message: '',
              url: res,
              type: 'image/png',
            };
            // Share
            Share.open(shareOptions)
              .then((res) => {
                console.log(res);
              })
              .catch((err) => {
                if (hideButton) {
                  props.navigation.dispatch(
                    CommonActions.reset({
                      index: 0,
                      routes: [{name: 'Dashboard'}],
                    }),
                  );
                }
                err && console.log(err);
              });
          } catch (err) {
            if (hideButton) {
              props.navigation.dispatch(
                CommonActions.reset({
                  index: 0,
                  routes: [{name: 'Dashboard'}],
                }),
              );
            }
          }
        })
        .catch(() => {
          if (hideButton) {
            props.navigation.dispatch(
              CommonActions.reset({
                index: 0,
                routes: [{name: 'Dashboard'}],
              }),
            );
          }
        });
    } else {
      try {
        let deviceVersion = DeviceInfo.getSystemVersion();
        let granted = PermissionsAndroid.RESULTS.DENIED;
        if (deviceVersion >= 13) {
          granted = PermissionsAndroid.RESULTS.GRANTED;
        } else {
          granted = await PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
            {
              title: 'NBP DIGITAL App Storage Permission',
              message: 'NBP DIGITAL App needs access to your storage',
              buttonNeutral: 'Ask Me Later',
              buttonNegative: 'Cancel',
              buttonPositive: 'OK',
            },
          );
        }
        logs.log('here in first else ', granted);

        // logs.log()
        if (granted === PermissionsAndroid.RESULTS.GRANTED) {
          logs.log('here in first else ', granted);

          captureRef(viewRef, value)
            .then(
              (res) =>
                value.result !== 'file'
                  ? res
                  : new Promise((success, failure) =>
                      // just a test to ensure res can be used in Image.getSize
                      Image.getSize(
                        res,
                        (width, height) => (
                          console.log(res, 300, 300), success(res)
                        ),
                        failure,
                      ),
                    ),

              // logs.log('in then ')
            )
            .then((res) => {
              logs.log('in then ');
              setError(null);
              setRes(res);
              setPreviewResource({uri: res});
              let imageLocation =
                PictureDir + '/' + String(res).split('-').pop();
              logs.log(imageLocation, String(res));
              try {
                RNFetchBlob.fs.writeFile(imageLocation, res, 'uri');
                // global.showToast.show(
                //   `Your Screenshot has been saved in ${imageLocation}`,
                //   1500,
                // );
                const shareOptions = {
                  title: 'Share QR Code',
                  message: '',
                  url: res,
                  type: 'image/png',
                };
                // Share
                Share.open(shareOptions)
                  .then((res) => {
                    console.log(res);
                  })
                  .catch((err) => {
                    if (hideButton) {
                      props.navigation.dispatch(
                        CommonActions.reset({
                          index: 0,
                          routes: [{name: 'Dashboard'}],
                        }),
                      );
                    }
                    err && console.log(err);
                  });
              } catch (err) {
                if (hideButton) {
                  props.navigation.dispatch(
                    CommonActions.reset({
                      index: 0,
                      routes: [{name: 'Dashboard'}],
                    }),
                  );
                }
                logs.log(err);
              }
            })
            .catch((error) => {
              if (hideButton) {
                props.navigation.dispatch(
                  CommonActions.reset({
                    index: 0,
                    routes: [{name: 'Dashboard'}],
                  }),
                );
              }
            });
        } else {
          // "Location permission denied"
        }
      } catch (err) {
        if (hideButton) {
          props.navigation.dispatch(
            CommonActions.reset({
              index: 0,
              routes: [{name: 'Dashboard'}],
            }),
          );
        }
      }
    }
  };
  const getpkrAccountsforRAAST = async () => {
    if (checkCard) {
      dispatch(
        getraastbanklist(props.navigation, () => {
          props.navigation.navigate('SendMoneyRAAST');
        }),
      );
    } else {
      dispatch(
        getraastbanklist(props.navigation, () => {
          props.navigation.navigate('SendMoneyRAAST', {UnionPayQr: true});
        }),
      );
    }
  };
  const cameraOffFunction = (flag) => {
    setCameraOff(flag);
  };
  const parsingUnionPayQR = async (data) => {
    const response = await dispatch(
      parseQrScanCode(data, () => props.navigation.navigate('PayViaQrScan')),
    );
    if (response) {
      props.navigation.navigate('PayViaQrScan');
    } else {
      dispatch(setAppAlert('Invalid QR Image', '', props.navigation));
      logs.log('in elase');
    }
  };
  const goBack = (Expire) => {
    if (Expire) {
      dispatch(setAppAlert('Expired QR', '', props.navigation));
    } else {
      dispatch(setAppAlert('Invalid QR', '', props.navigation));
    }
  };

  const qrFromGallery = () => {
    // console.log('ImagePicker');
    setTimeout(
      () => {
        launchImageLibrary(
          {mediaType: 'photo', includeBase64: true},
          (response) => {
            // console.log('Response = ', response);
            // console.log('Response Inner = ', response.uri);

            if (response.didCancel) {
              // console.log('User cancelled image picker');
            } else if (response.error) {
              // console.log('ImagePicker Error: ', response.error);
            } else if (response.customButton) {
              // console.log('User tapped custom button: ', response.customButton);
            } else {
              logs.log('in else');
              if (response.assets[0].uri) {
                logs.log('if response.uri', response.assets[0].uri);
                var path = response.assets[0].path;
                if (!path) {
                  path = response.assets[0].uri;
                  logs.log('path', path);
                }
                QRreader(path)
                  .then(async (data) => {
                    let obj = {};
                    // console.log('QR Code:', data);
                    obj.data = data;
                    if (checkCard) {
                      dispatch(
                        QRParsing(
                          obj,
                          cameraOffFunction,
                          goBack,
                          props.navigation,
                        ),
                      );
                      logs.log('from --------> Gallery', data);
                    } else {
                      parsingUnionPayQR(obj);
                    }
                  })
                  .catch((err) => {
                    logs.log('error', err);
                    dispatch(
                      setAppAlert(
                        'Invalid QR Image',
                        '',
                        props.navigation,
                        () => {},
                      ),
                    );
                  });
              }
            }
          },
        );
      },
      Platform.OS == 'ios' ? 500 : 100,
    );
  };

  const tabBar = () => {
    return (
      <View
        style={{
          height: wp(14),
          width: wp(90),
          justifyContent: 'center',
          alignSelf: 'center',
        }}>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'center',
          }}>
          <TouchableWithoutFeedback
            onPress={() => {
              setCheckCard(true);
            }}>
            <View
              style={{
                height: wp(13),
                width: wp(45),
                borderWidth: 0.5,
                borderColor: Colors.subContainer,
                borderRadius: checkCard ? wp(1) : 0,
                borderBottomLeftRadius: wp(1),
                borderTopLeftRadius: wp(1),
                justifyContent: 'center',
                alignItems: 'center',
                backgroundColor: checkCard ? 'white' : Colors.lightGrey,
              }}>
              <CustomText
                boldFont={checkCard ? true : false}
                style={{
                  color: checkCard ? Colors.blackColor : Colors.grey,
                  // fontFamily:
                  //   fontFamily[
                  //     checkCard ? 'ArticulatCF-Bold' : 'ArticulatCF-Normal'
                  //   ],
                }}>
                Raast
              </CustomText>
            </View>
          </TouchableWithoutFeedback>
          <TouchableWithoutFeedback
            onPress={() => {
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
                        }, 300);
                      },
                      onPressNo: () => {
                        logs.log('-----0');
                        dispatch(closeGlobalAlertState());
                      },
                      title: 'QR Payments',
                      alert_text: Message.digitalDebitOption,
                    }),
                  );
                } else {
                  if (Object.keys(virtualCardObject).length !== 0) {
                    setCheckCard(false);
                  }
                  logs.log('ashjgdahjsgfd00-=->');
                }
              }
            }}>
            <View
              style={{
                height: wp(13),
                width: wp(45),
                borderWidth: 0.5,
                borderColor: Colors.lightGrey,
                borderRadius: checkCard ? 0 : wp(1),
                borderBottomRightRadius: wp(1),
                borderTopRightRadius: wp(1),
                justifyContent: 'center',
                alignItems: 'center',
                backgroundColor: checkCard ? Colors.lightGrey : 'white',
              }}>
              <CustomText
                // style={style.txt}
                boldFont={checkCard ? false : true}
                style={{
                  color: checkCard ? Colors.grey : 'black',
                  // fontFamily:
                  //   fontFamily[
                  //     checkCard ? 'ArticulatCF-Normal' : 'ArticulatCF-Bold'
                  //   ],
                }}>
                Unionpay
              </CustomText>
            </View>
          </TouchableWithoutFeedback>
        </View>
      </View>
    );
  };

  const QRScreenNavigate = () => {
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
  };
  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: Colors.backgroundColor,
          justifyContent: hideButton ? 'center' : null,
        },
      ]}
      accessibilityLabel="QR Receive">
      {/* <GlobalHeader navigation={props.navigation} /> */}
      <SubHeader
        title={'QR Pay'}
        description={'QR Code to Receive Money'}
        // myAccounts={true}
        // navigateHome={true}
        navigation={props.navigation}
      />
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={{height: hp(2)}}></View>

        {hideButton ? null : tabBar()}
        <View style={{height: hp(2)}}></View>
        <View
          style={{
            backgroundColor: Colors.subContainer,
            width: wp(90),
            alignSelf: 'center',
            borderWidth: 0.5,
            borderColor: Colors.textFieldBorderColor,
            borderRadius: wp(1),
          }}>
          <View
            style={{
              backgroundColor: Colors.subContainer,
              borderRadius: wp(1),
            }}
            ref={viewRef}>
            {/* {checkCard ? (
              <> */}
            <View style={{height: hp(3)}}></View>
            <Image
              // source={Images.main_logo_withtext}
              source={Images.logoWithText}
              style={{width: wp(50), height: wp(10), alignSelf: 'center'}}
              resizeMode={'contain'}
            />
            {/* </>
            ) : null} */}

            <View style={{height: hp(3)}}></View>

            {checkCard ? qr() : unionPayQrCode()}
            <View style={{height: hp(2)}}></View>

            {infoPortion()}
            <View style={{height: hp(2)}}></View>
          </View>
          {hideButton ? null : shareButton()}
          <View style={{height: hp(2)}}></View>
        </View>
        <View style={{height: hp(2)}}></View>
        {hideButton || !checkCard ? null : (
          <TouchableOpacity
            style={{alignSelf: 'center'}}
            onPress={() => {
              props.navigation.navigate('RecieveDynamicQR');
            }}>
            <CustomText
              boldFont={true}
              style={{
                fontFamily: fontFamily['ArticulatCF-Bold'],
                color: Colors.primary_green,
                fontSize: wp(4),
              }}>
              Share QR with Amount
            </CustomText>
          </TouchableOpacity>
        )}
        {hideButton || !checkCard ? null : (
          <TouchableOpacity
            style={{alignSelf: 'center', margin: hp(1)}}
            onPress={() => {
              dispatch(
                getraastbanklist(props.navigation, () => {
                  // props.navigation.navigate('RAASTBeneficiary');
                  props.navigation.navigate('by_alias');
                }),
              );
            }}>
            <CustomText
              style={{
                fontFamily: fontFamily['ArticulatCF-Normal'],
                color: Colors.primary_green,
                fontSize: wp(4),
              }}>
              {`Funds Transfer Mobile (RAAST)`}
            </CustomText>
          </TouchableOpacity>
        )}

        <View style={{height: hp(2)}}></View>
      </ScrollView>
      {hideButton ? null : (
        <KeyboardAvoidingView style={globalStyling.buttonContainer}>
          <CustomBtn
            btn_width={wp(90)}
            backgroundColor={Colors.primary_green}
            btn_txt={checkCard ? 'Scan Raast QR' : 'Scan UnionPay QR'}
            onPress={() => {
              setQRTypeModal(true);

              // props.navigation.navigate('RecieveDynamicQR');
            }}
          />
        </KeyboardAvoidingView>
      )}

      <CustomModal
        visible={QrTypeModal}
        headtext={checkCard ? 'Scan Raast QR' : 'Scan UnionPay QR'}
        data={QrType}
        onPress_item={(param) => {
          logs.log(param);
          setQRTypeModal(false);
          if (param.id == 4000) {
            logs.log('selected Camera');
            QRScreenNavigate();
          } else {
            qrFromGallery();
          }
          // changeTransferFundsTo(param);
          // changeTransferFundModalState(!transferFundModalState);
        }}
        onCancel={() => {
          setQRTypeModal(false);
        }}
      />
      {Platform.OS === 'android' ? null : (
        <DateTimePicker
          minimumDate={future}
          date={future}
          isVisible={date_show}
          mode="date"
          onConfirm={handleConfirm}
          onCancel={hideDatePicker}
        />
      )}
      {Platform.OS === 'ios' ? null : date_show ? (
        <AndroidDateTimePicker
          minimumDate={future}
          value={future}
          display={'spinner'}
          mode="date"
          textColor={Colors.blackColor}
          onChange={(event, dateSelected) => {
            setDate_show(false);

            if (event.type !== 'dismissed') {
              setDate(moment(dateSelected).format('DDMMYYYYhhmm'));
              setDateValue(moment(dateSelected).format('DD-MMMM-YYYY'));
            }
          }}
        />
      ) : null}
      <CustomModal
        visible={modal}
        headtext={'Select Account'}
        data={accounts}
        accounts={true}
        onPress_item={(param) => {
          change_from_acc(param);
          change_modal_state(false);
        }}
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
    </View>
  );
}
