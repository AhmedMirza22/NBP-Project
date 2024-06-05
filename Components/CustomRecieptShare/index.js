import React, {useEffect, useState, useRef} from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  TouchableWithoutFeedback,
  PermissionsAndroid,
  Modal,
  ScrollView,
  Device,
} from 'react-native';
import DeviceInfo from 'react-native-device-info';

import {CommonActions} from '@react-navigation/native';
import CameraRoll from '@react-native-community/cameraroll';
// import Modal from 'react-native-modal';
import Share from 'react-native-share';
import {Colors, Images} from '../../Theme';
import {globalStyling, wp, hp, currencyFormat} from '../../Constant';
import {Platform} from 'react-native';
// import AntDesign from 'react-native-vector-icons/AntDesign';
import {useSelector, useDispatch} from 'react-redux';
import CustomText from '../CustomText/CustomText';
import {captureRef} from 'react-native-view-shot';
import I18n from '../../Config/Language/LocalizeLanguageString';
var RNFetchBlob = require('rn-fetch-blob').default;

const PictureDir =
  Platform.OS === 'android'
    ? RNFetchBlob.fs.dirs.DownloadDir
    : RNFetchBlob.fs.dirs.DocumentDir;
import AntDesign from 'react-native-vector-icons/AntDesign';
import {
  changeGlobalIconAlertState,
  closeGlobalTransferAlert,
} from '../../Redux/Action/Action';
import {logs} from '../../Config/Config';
import {maskedAccount} from '../../Helpers/Helper';
import moment from 'moment';
const customFolderName = 'NBP';
const customFolderPath =
  RNFetchBlob.fs.dirs.DocumentDir + `/${customFolderName}`;
const pathSegments = customFolderPath.split('/');
const filesIndex = pathSegments.indexOf('NBP');
// Get the path starting from "files"
const filesPath = pathSegments.slice(filesIndex).join('/');

const GlobalTransferAlert = (props) => {
  const routeName = props?.route?.params;

  logs.log('GLOBAL TRANSFER ALERT-----', routeName);

  const viewRef = useRef();
  const [previewSource, setPreviewResource] = useState(null);
  const [error, setError] = useState(null);
  const [res, setRes] = useState(null);
  const [value, setValue] = useState({
    format: 'jpg',
    quality: 0.9,
  });
  const [currentDate, setCurrentDate] = useState(
    moment(new Date()).format('DD MMM, YYYY'),
  );
  const [currentTime, setCurrentTime] = useState(
    moment(new Date()).format('hh:mm:ss a'),
  );
  const globalAlertTransfer = useSelector(
    (state) => state.reducers.globalAlertTransfer,
  );

  const SharePress = (Resource) => {
    logs.log('inSHrePress');
    const shareOptions = {
      title: 'Share Receipt',
      message: '',
      url: Resource,
      type: 'image/png',
    };
    // Share
    Share.open(shareOptions)
      .then((res) => {
        globalAlertTransfer.navigation.dispatch(
          CommonActions.reset({
            index: 0,
            routes: [{name: 'Home'}],
          }),
        );
      })
      .catch((err) => {
        globalAlertTransfer.navigation.dispatch(
          CommonActions.reset({
            index: 0,
            routes: [{name: 'Home'}],
          }),
        );
        err && console.log('paopdoapods', err);
      });
  };
  const DownloadPressIOS = (Resouce) => {
    // this.setState({modalView: false});
    global.showToast.show(
      I18n['Screenshot captured successfully. You may save it now.'],
      1500,
    );
    setTimeout(() => {
      RNFetchBlob.ios.openDocument(Resouce);
    }, 2000);
  };
  const takeScreenShot = async (isSharePress) => {
    logs.log(isSharePress, 'asjhdgasjgd8u7e');
    if (Platform.OS === 'ios') {
      logs.log('inb ios ');
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
          let fileName =
            globalAlertTransfer?.props?.paymentType === 'ThreePFT'
              ? 'FundsTransfer'
              : globalAlertTransfer?.props?.paymentType;
          let time = moment(
            globalAlertTransfer?.props?.currentTime,
            'HH:mm:ss',
          ).format('hmms');
          let fullpath = `NBP-${fileName}-${globalAlertTransfer?.props?.currentDate}-${time}`;
          // let imageLocation = PictureDir + '/' + `NBP-${fullpath}.jpg`;
          let imageLocation =
            PictureDir + '/' + filesPath + '/' + `NBP-${fullpath}.jpg`;
          try {
            RNFetchBlob.fs.writeFile(imageLocation, res, 'uri');
            isSharePress ? SharePress(res) : DownloadPressIOS(imageLocation);
          } catch (err) {
            logs.log('oioioio', err);
          }
        })
        .catch((error) => console.log('HERE', error));
    } else {
      logs.log('popii');
      logs.log('Route Name', routeName);
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
          logs.log('here in first else of granted', granted);

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
              let fileName =
                globalAlertTransfer?.props?.paymentType === 'ThreePFT'
                  ? 'FundsTransfer'
                  : globalAlertTransfer?.props?.paymentType;
              let time = moment(
                globalAlertTransfer?.props?.currentTime,
                'HH:mm:ss',
              ).format('hmms');
              let fullpath = `NBP-${fileName}-${globalAlertTransfer?.props?.currentDate}-${time}`;
              // let imageLocation = PictureDir + '/' + `NBP-${fullpath}.jpg`;
              let imageLocation =
                PictureDir + '/' + filesPath + '/' + `NBP-${fullpath}.jpg`;
              try {
                CameraRoll.save(res, 'uri')
                  .then(() => {
                    if (routeName.routeName === `download`) {
                      global.showToast.show(
                        `Your Receipt has been saved in ${imageLocation}`,
                        2000,
                      );
                      setTimeout(() => {
                        globalAlertTransfer.navigation.dispatch(
                          CommonActions.reset({
                            index: 0,
                            routes: [{name: `Home`}],
                          }),
                        );
                      }, 200);
                    } else {
                      const shareOptions = {
                        title: 'Share Receipt',
                        message: ``,
                        url: res,
                        type: 'image/png',
                      };
                      Share.open(shareOptions)
                        .then((res) => {
                          globalAlertTransfer.navigation.dispatch(
                            CommonActions.reset({
                              index: 0,
                              routes: [{name: 'Home'}],
                            }),
                          );
                        })
                        .catch((err) => {
                          globalAlertTransfer.navigation.dispatch(
                            CommonActions.reset({
                              index: 0,
                              routes: [{name: 'Home'}],
                            }),
                          );
                          err && logs.log('asdasdasdzzzzz', err);
                        });
                    }

                    console.log(res, 'uri');
                  })
                  .catch((err) => console.log('err:', err));
              } catch (err) {
                logs.log('asiiii', err);
              }
            })
            .catch((error2) => logs.log('asdasd', error2));
        } else {
          globalAlertTransfer.navigation.dispatch(
            CommonActions.reset({
              index: 0,
              routes: [{name: 'Home'}],
            }),
          );
          // "Location permission denied"
        }
      } catch (err3) {
        logs.log('---0', err3);
      }
    }
  };
  useEffect(() => {
    logs.log('RouteName=================', routeName);
    setTimeout(
      () => {
        takeScreenShot(true);
      },
      routeName.routeName === 'download' ? 1000 : 500,
    );

    logs.log('Global Transfer ALert Data', globalAlertTransfer?.props);
  }, []);

  const rrn = () => {
    return (
      <View
        style={{
          flexDirection: 'row',
          alignSelf: 'center',
          width: wp(80),
          justifyContent: 'space-between',
          paddingHorizontal: wp(2),
          margin: wp(2),
        }}>
        <CustomText style={styles.lightText}>{`RRN`}</CustomText>
        <CustomText
          style={{
            textAlign: 'right',
            fontSize: wp(3.5),
            alignSelf: 'center',
          }}>
          {globalAlertTransfer?.props?.rrn
            ? globalAlertTransfer?.props?.rrn
            : 'XXXXX'}
        </CustomText>
      </View>
    );
  };
  const companyName = () => {
    return (
      <View
        style={{
          flexDirection: 'row',
          alignSelf: 'center',
          width: wp(80),
          justifyContent: 'space-between',
          paddingHorizontal: wp(2),
          margin: wp(2),
        }}>
        <CustomText style={styles.lightText}>{`Biller Name`}</CustomText>
        <CustomText
          style={{
            textAlign: 'right',
            fontSize: wp(3.5),
            alignSelf: 'center',
          }}>
          {globalAlertTransfer?.props?.companyName
            ? globalAlertTransfer?.props?.companyName
            : 'XXXXX'}
        </CustomText>
      </View>
    );
  };
  const tran_Id = () => {
    return (
      <View
        style={{
          flexDirection: 'row',
          alignSelf: 'center',
          width: wp(80),
          justifyContent: 'space-between',
          paddingHorizontal: wp(2),
          margin: wp(2),
        }}>
        <CustomText style={styles.lightText}>{`Transaction ID`}</CustomText>
        <CustomText
          style={{
            textAlign: 'right',
            fontSize: wp(3.5),
            alignSelf: 'center',
          }}>
          {globalAlertTransfer?.props?.tran_Id
            ? globalAlertTransfer?.props?.tran_Id
            : 'XXXXX'}
        </CustomText>
      </View>
    );
  };
  const headingView = () => {
    return (
      <>
        <View style={{height: wp(4)}} />
        <CustomText
          style={{alignSelf: 'center', fontSize: wp(6)}}
          boldFont={true}>
          {globalAlertTransfer?.props?.paymentType
            ? globalAlertTransfer?.props?.paymentType
            : '------------'}
        </CustomText>
        <View style={{height: wp(4)}} />
      </>
    );
  };
  const amountTransfer = () => {
    return (
      <View
        style={{
          flexDirection: 'row',
          width: wp(80),
          justifyContent: 'space-between',
          paddingVertical: wp(2),
          paddingHorizontal: wp(2),
        }}>
        <CustomText
          style={{
            alignSelf: 'center',
            fontSize: hp(1.5),
          }}>
          {`Amount\nTransferred`}
        </CustomText>
        <CustomText
          boldFont={true}
          style={{
            alignSelf: 'center',
            fontSize: hp(3),
          }}>
          Rs.
          {globalAlertTransfer?.props?.amount
            ? currencyFormat(Number(globalAlertTransfer?.props?.amount))
            : 'Rs.00.00'}
        </CustomText>
      </View>
    );
  };
  const fromAcc = () => {
    return (
      <>
        <View
          style={{
            flexDirection: 'row',
            alignSelf: 'center',
            width: wp(80),
            // backgroundColor: 'red',
            justifyContent: 'space-between',
            paddingHorizontal: wp(2),
          }}>
          <CustomText style={styles.lightText}>From</CustomText>
          <View>
            <CustomText
              style={[
                styles.generalRightDetails,
                {width: wp(40), alignItems: 'flex-end'},
              ]}
              numberOfLines={1}
              ellipsizeMode={'tail'}>
              {globalAlertTransfer?.props?.fromName
                ? globalAlertTransfer?.props?.fromName
                : 'xxxxxxxxxx'}
            </CustomText>
            <CustomText style={styles.generalRightDetails}>
              {globalAlertTransfer?.props?.fromAccount
                ? maskedAccount(globalAlertTransfer?.props?.fromAccount)
                : 'xxxxxxxxx'}
            </CustomText>
          </View>
        </View>
        <View
          style={{
            height: 0.5,
            width: wp(75),
            backgroundColor: 'black',
            alignSelf: 'center',
            margin: wp(2),
          }}
        />
      </>
    );
  };
  const toAcc = () => {
    return (
      <>
        <View
          style={{
            flexDirection: 'row',
            alignSelf: 'center',
            width: wp(80),
            // backgroundColor: 'red',
            justifyContent: 'space-between',
            paddingHorizontal: wp(2),
          }}>
          <CustomText style={styles.lightText}>To</CustomText>
          <View>
            <CustomText
              style={[
                styles.generalRightDetails,
                {width: wp(40), alignItems: 'flex-end'},
              ]}
              numberOfLines={1}
              ellipsizeMode={'tail'}>
              {globalAlertTransfer?.props?.toName
                ? globalAlertTransfer?.props?.toName
                : 'xxxxxxxx'}
            </CustomText>
            <CustomText style={styles.generalRightDetails}>
              {globalAlertTransfer?.props?.toAccount
                ? maskedAccount(globalAlertTransfer?.props?.toAccount)
                : '----------'}
            </CustomText>
          </View>
        </View>
        <View
          style={{
            height: 0.5,
            width: wp(75),
            backgroundColor: 'black',
            alignSelf: 'center',
            margin: wp(2),
          }}
        />
      </>
    );
  };
  const transacDes = () => {
    return (
      <>
        <View
          style={{
            height: 0.5,
            width: wp(75),
            backgroundColor: 'black',
            alignSelf: 'center',
            margin: wp(2),
          }}
        />
        <View
          style={{
            flexDirection: 'row',
            alignSelf: 'center',
            width: wp(80),
            justifyContent: 'space-between',
            paddingHorizontal: wp(2),
            margin: wp(2),
          }}>
          <CustomText
            style={styles.lightText}>{`Transaction Description`}</CustomText>
          <CustomText
            style={{
              textAlign: 'right',
              fontSize: wp(3.5),
              alignSelf: 'center',
            }}>
            {globalAlertTransfer?.props?.transactiondesc
              ? globalAlertTransfer?.props?.transactiondesc
              : ''}
          </CustomText>
        </View>
      </>
    );
  };
  const benefAliasView = () => {
    return (
      <>
        <View
          style={{
            flexDirection: 'row',
            alignSelf: 'center',
            width: wp(80),
            justifyContent: 'space-between',
            paddingHorizontal: wp(2),
            margin: wp(1),
          }}>
          <CustomText style={styles.lightText}>{`Nickname`}</CustomText>
          <CustomText
            numberOfLines={2}
            ellipsizeMode={'tail'}
            style={{
              textAlign: 'right',
              fontSize: wp(3.5),
              width: wp(40),
              // alignSelf: 'center',
              // textWidth: wp(50),
            }}>
            {globalAlertTransfer?.props?.benefAlias
              ? `${globalAlertTransfer?.props?.benefAlias}`
              : ``}
          </CustomText>
        </View>
      </>
    );
  };
  const purposeOfPaymentView = () => {
    return (
      <>
        <View
          style={{
            flexDirection: 'row',
            alignSelf: 'center',
            width: wp(80),
            justifyContent: 'space-between',
            paddingHorizontal: wp(2),
            margin: wp(1),
          }}>
          <CustomText style={styles.lightText}>
            {`Purpose Of\nPayment`}
          </CustomText>
          <CustomText
            style={{
              textAlign: 'right',
              fontSize: wp(3.5),
              alignSelf: 'center',
            }}>
            {globalAlertTransfer?.props?.purposeOfPayment
              ? `${globalAlertTransfer?.props?.purposeOfPayment}`
              : ``}
          </CustomText>
        </View>
      </>
    );
  };
  const trasacDate = () => {
    return (
      <>
        <View
          style={{
            flexDirection: 'row',
            alignSelf: 'center',
            width: wp(80),
            justifyContent: 'space-between',
            paddingHorizontal: wp(2),
            margin: wp(1),
          }}>
          <CustomText style={styles.lightText}>
            {`Transaction\nDate`}
          </CustomText>
          <CustomText
            style={{
              textAlign: 'right',
              fontSize: wp(3.5),
              alignSelf: 'center',
            }}>
            {globalAlertTransfer?.props?.currentDate
              ? `${globalAlertTransfer?.props?.currentDate}`
              : `${currentDate}`}
            {globalAlertTransfer?.props?.showTime === false
              ? null
              : globalAlertTransfer?.props?.currentTime
              ? `\n${globalAlertTransfer?.props?.currentTime}`
              : `\n${currentTime}`}
          </CustomText>
        </View>
      </>
    );
  };
  const stanID = () => {
    return (
      <View
        style={{
          flexDirection: 'row',
          alignSelf: 'center',
          width: wp(80),
          justifyContent: 'space-between',
          paddingHorizontal: wp(2),
          margin: wp(2),
        }}>
        <CustomText style={styles.lightText}>{`Stan ID`}</CustomText>
        <CustomText
          style={{
            textAlign: 'right',
            fontSize: wp(3.5),
            alignSelf: 'center',
            width: '50%',
          }}>
          {globalAlertTransfer?.props?.stanId
            ? globalAlertTransfer?.props?.stanId
            : 'XXXXX'}
        </CustomText>
      </View>
    );
  };
  const transDet = () => {
    return (
      <View
        style={{
          flexDirection: 'row',
          alignSelf: 'center',
          width: wp(80),
          justifyContent: 'space-between',
          paddingHorizontal: wp(2),
          margin: wp(2),
        }}>
        <CustomText style={styles.lightText}>{`Transaction Detail`}</CustomText>
        <CustomText
          style={{
            textAlign: 'right',
            fontSize: wp(3.5),
            alignSelf: 'center',
            width: wp(40),
          }}
          numberOfLines={2}>
          {globalAlertTransfer?.props?.transactionDetail
            ? globalAlertTransfer?.props?.transactionDetail
            : ''}
        </CustomText>
      </View>
    );
  };
  const comment = () => {
    return (
      <View
        style={{
          flexDirection: 'row',
          alignSelf: 'center',
          width: wp(80),
          justifyContent: 'space-between',
          paddingHorizontal: wp(2),
          margin: wp(2),
        }}>
        <CustomText style={styles.lightText}>{`Comment`}</CustomText>
        <CustomText
          numberOfLines={2}
          ellipsizeMode={'tail'}
          style={{
            textAlign: 'right',
            fontSize: wp(3.5),
            alignSelf: 'center',
            width: wp(40),
          }}>
          {globalAlertTransfer?.props?.comments
            ? globalAlertTransfer?.props?.comments
            : 'XXXXX'}
        </CustomText>
      </View>
    );
  };
  const MemeberID = () => {
    return (
      <View
        style={{
          flexDirection: 'row',
          alignSelf: 'center',
          width: wp(80),
          justifyContent: 'space-between',
          paddingHorizontal: wp(2),
          margin: wp(2),
        }}>
        <CustomText style={styles.lightText}>{`Member ID`}</CustomText>
        <CustomText
          numberOfLines={2}
          ellipsizeMode={'tail'}
          style={{
            textAlign: 'right',
            fontSize: wp(3.5),
            alignSelf: 'center',
            width: wp(40),
          }}>
          {globalAlertTransfer?.props?.comments
            ? globalAlertTransfer?.props?.comments
            : 'XXXXX'}
        </CustomText>
      </View>
    );
  };
  const merchantName = () => {
    return (
      <View
        style={{
          flexDirection: 'row',
          alignSelf: 'center',
          width: wp(80),
          justifyContent: 'space-between',
          paddingHorizontal: wp(2),
          margin: wp(2),
        }}>
        <CustomText style={styles.lightText}>{`merchantName`}</CustomText>
        <CustomText
          numberOfLines={2}
          ellipsizeMode={'tail'}
          style={{
            textAlign: 'right',
            fontSize: wp(3.5),
            alignSelf: 'center',
            width: wp(40),
          }}>
          {globalAlertTransfer?.props?.merchantName
            ? globalAlertTransfer?.props?.merchantName
            : 'XXXXX'}
        </CustomText>
      </View>
    );
  };
  const merchantCode = () => {
    return (
      <View
        style={{
          flexDirection: 'row',
          alignSelf: 'center',
          width: wp(80),
          justifyContent: 'space-between',
          paddingHorizontal: wp(2),
          margin: wp(2),
        }}>
        <CustomText style={styles.lightText}>{`merchantCode`}</CustomText>
        <CustomText
          numberOfLines={2}
          ellipsizeMode={'tail'}
          style={{
            textAlign: 'right',
            fontSize: wp(3.5),
            alignSelf: 'center',
            width: wp(40),
          }}>
          {globalAlertTransfer?.props?.merchantCode
            ? globalAlertTransfer?.props?.merchantCode
            : 'XXXXX'}
        </CustomText>
      </View>
    );
  };
  const city = () => {
    return (
      <View
        style={{
          flexDirection: 'row',
          alignSelf: 'center',
          width: wp(80),
          justifyContent: 'space-between',
          paddingHorizontal: wp(2),
          margin: wp(2),
        }}>
        <CustomText style={styles.lightText}>{`city`}</CustomText>
        <CustomText
          numberOfLines={2}
          ellipsizeMode={'tail'}
          style={{
            textAlign: 'right',
            fontSize: wp(3.5),
            alignSelf: 'center',
            width: wp(40),
          }}>
          {globalAlertTransfer?.props?.city
            ? globalAlertTransfer?.props?.city
            : 'XXXXX'}
        </CustomText>
      </View>
    );
  };
  const errorView = () => {
    return (
      <View
        style={{
          flexDirection: 'row',
          alignSelf: 'center',
          width: wp(80),
          justifyContent: 'space-between',
          paddingHorizontal: wp(2),
          margin: wp(2),
        }}>
        <CustomText style={styles.lightText}>{`Transaction Status`}</CustomText>
        <CustomText
          style={{
            textAlign: 'right',
            fontSize: wp(3.5),
            alignSelf: 'center',
          }}>
          {globalAlertTransfer?.props?.error
            ? globalAlertTransfer?.props?.error
            : ''}
        </CustomText>
      </View>
    );
  };
  const transId = () => {
    return (
      <View
        style={{
          flexDirection: 'row',
          alignSelf: 'center',
          width: wp(80),
          justifyContent: 'space-between',
          paddingHorizontal: wp(2),
          margin: wp(2),
        }}>
        <CustomText style={styles.lightText}>{`Transaction\nID`}</CustomText>
        <CustomText
          style={{
            textAlign: 'right',
            fontSize: wp(3.5),
            alignSelf: 'center',
          }}>
          {globalAlertTransfer?.props?.transId
            ? globalAlertTransfer?.props?.transId
            : 'XXXXXX'}
        </CustomText>
      </View>
    );
  };
  return (
    <ScrollView
      showsVerticalScrollIndicator={false}
      style={{backgroundColor: Colors.backgroundColor}}>
      <View
        ref={viewRef}
        style={{flex: 1, backgroundColor: Colors.backgroundColor}}>
        <View style={{height: hp(3)}} />
        <CustomText
          boldFont={true}
          style={{
            fontSize: wp(6),
            alignSelf: 'center',
            padding: wp(2),
            top: wp(2),
          }}>
          Transaction Receipt
        </CustomText>
        <View
          style={{
            // elevation: 2,
            backgroundColor: Colors.backgroundColor,
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          <View>
            {globalAlertTransfer?.props?.status === 'Fail' ? (
              <Image
                source={Images.failAlert}
                style={{
                  width: wp(15),
                  height: wp(15),
                  alignSelf: 'center',
                  top: wp(8),
                  zIndex: 2,
                }}
              />
            ) : (
              <Image
                source={Images.successAlert}
                style={{
                  width: wp(15),
                  height: wp(15),
                  alignSelf: 'center',
                  top: wp(8),
                  zIndex: 2,
                }}
              />
            )}

            <View
              style={{
                width: wp(90),
                alignSelf: 'center',
                backgroundColor: Colors.subContainer,
                borderRadius: wp(1),
              }}>
              <View style={{height: wp(6)}}></View>

              <View
                ref={viewRef}
                style={{backgroundColor: Colors.subContainer}}>
                {headingView()}
                <View
                  style={{
                    flexDirection: 'column',
                    width: wp(80),
                    backgroundColor: Colors.childContainer,
                    alignSelf: 'center',
                    borderRadius: wp(1),
                  }}>
                  {amountTransfer()}
                  {/* {EndBalance()} */}
                </View>
                <View style={{height: wp(4)}} />
                {globalAlertTransfer?.props?.fromAccount ? fromAcc() : null}
                {globalAlertTransfer?.props?.toAccount ? toAcc() : null}
                {globalAlertTransfer?.props?.transactiondesc
                  ? transacDes()
                  : null}
                {globalAlertTransfer?.props?.drcr ? (
                  <View
                    style={{
                      flexDirection: 'row',
                      alignSelf: 'center',
                      width: wp(80),
                      justifyContent: 'space-between',
                      paddingHorizontal: wp(2),
                      margin: wp(2),
                    }}>
                    <CustomText style={styles.lightText}>{`DR/CR`}</CustomText>
                    <CustomText
                      style={{
                        textAlign: 'right',
                        fontSize: wp(3.5),
                        alignSelf: 'center',
                      }}
                      boldFont={true}>
                      {globalAlertTransfer?.props?.drcr
                        ? globalAlertTransfer?.props?.drcr
                        : ''}
                    </CustomText>
                  </View>
                ) : null}
                {/* drcr */}

                {/* cheque number */}
                {globalAlertTransfer?.props?.drcr ? (
                  <>
                    <View
                      style={{
                        flexDirection: 'row',
                        alignSelf: 'center',
                        width: wp(80),
                        justifyContent: 'space-between',
                        paddingHorizontal: wp(2),
                        margin: wp(2),
                      }}>
                      <CustomText
                        style={styles.lightText}>{`Cheque Number`}</CustomText>
                      <CustomText
                        style={{
                          textAlign: 'right',
                          fontSize: wp(3.5),
                          alignSelf: 'center',
                        }}>
                        {/* {globalAlertTransfer?.props?.drcr
                      ? globalAlertTransfer?.props?.drcr
                      : ''} */}
                        -
                      </CustomText>
                    </View>
                    <View
                      style={{
                        height: 0.5,
                        width: wp(75),
                        backgroundColor: 'black',
                        alignSelf: 'center',
                        margin: wp(2),
                      }}
                    />
                  </>
                ) : null}
                {/* {globalAlertTransfer?.props?.benefAlias
                  ? benefAliasView()
                  : null} */}
                {globalAlertTransfer?.props?.purposeOfPayment
                  ? purposeOfPaymentView()
                  : null}

                {globalAlertTransfer?.props?.companyName ? companyName() : null}

                {trasacDate()}
                {globalAlertTransfer?.props?.stanId ? stanID() : null}
                {globalAlertTransfer?.props?.rrn ? rrn() : null}

                {globalAlertTransfer?.props?.NbpSport
                  ? MemeberID()
                  : globalAlertTransfer?.props?.comments
                  ? comment()
                  : null}
                {globalAlertTransfer?.props?.tran_Id ? tran_Id() : null}

                {/* {globalAlertTransfer?.props?.comments ? comment() : null} */}
                {globalAlertTransfer?.props?.merchantName
                  ? merchantName()
                  : null}
                {globalAlertTransfer?.props?.merchantCode
                  ? merchantCode()
                  : null}
                {globalAlertTransfer?.props?.city ? city() : null}
                {globalAlertTransfer?.props?.transactionDetail
                  ? transDet()
                  : null}
                {globalAlertTransfer?.props?.error ? errorView() : null}
                {globalAlertTransfer?.props?.transId ? transId() : null}
              </View>
              <View style={{height: wp(3)}} />
            </View>
          </View>
        </View>
        <View style={{bottom: wp(5), alignSelf: 'center'}}>
          <Image source={Images.logoWithText} style={styles.main_logo} />
          <CustomText
            style={{
              textAlign: 'center',
            }}>{`For further assistance, please call NBP\nHelpline 021-111-627-627`}</CustomText>
        </View>
      </View>
    </ScrollView>
  );
};

// define your styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#2c3e50',
  },
  lightText: {
    // color: Colors.blackColor,
    alignSelf: 'center',
  },
  main_logo: {
    width: wp(40),
    height: wp(10),
    resizeMode: 'contain',
    alignSelf: 'center',
    marginTop: hp(5),
    // backgroundColor: 'red',
  },
  generalTextSize: {
    fontSize: wp(4.5),
    alignSelf: 'center',
    textAlign: 'center',
    // width: wp(70),
  },
  generalDetails: {
    fontSize: wp(3.5),
    alignSelf: 'flex-end',
  },
  generalRightDetails: {
    fontSize: wp(3.5),
    // alignSelf: 'center',
    alignSelf: 'flex-end',

    textAlign: 'right',
  },
});

//make this component available to the app
export default GlobalTransferAlert;
