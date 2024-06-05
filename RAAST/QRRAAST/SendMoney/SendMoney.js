import React, {useRef, useState, useEffect} from 'react';
import {View, Text, Alert, TouchableWithoutFeedback, Image} from 'react-native';
import QRCodeScanner from 'react-native-qrcode-scanner';
import {useDispatch, useSelector} from 'react-redux';
import {logs} from '../../../../Config/Config';
import {globalStyling, hp, wp} from '../../../../Constant';
import {
  setQrScannerState,
  setAppAlert,
  getFundsTransferData,
  agreeToAddVirtualCard,
  changeGlobalAlertState,
  closeGlobalAlertState,
  setUserObject,
  QRParsing,
} from '../../../../Redux/Action/Action';
import {parseQrScanCode} from '../../../../Components/QrScanner/parseQrScanCode';
import store from '../../../../Redux/Store/Store';
import {Images, Colors} from '../../../../Theme';
import CustomText from '../../../../Components/CustomText/CustomText';
import {TouchableOpacity} from 'react-native';
import {QRreader} from 'react-native-qr-decode-image-camera';
import {launchImageLibrary} from 'react-native-image-picker';
import {Message} from '../../../../Constant/Messages';
import analytics from '@react-native-firebase/analytics';
export default function SendMoneyRAAST(props) {
  useEffect(() => {
    async function analyticsLog() {
      await analytics().logEvent('SendMoneyScreen');
    }
    analyticsLog();
  }, []);

  const userObject = useSelector((state) => state.reducers.userObject);
  const isL0Customer =
    userObject.customerLevel &&
    String(userObject.customerLevel).toUpperCase() == 'L0'
      ? false
      : String(userObject.customerLevel).toUpperCase() == 'L1'
      ? false
      : true;
  const virtualCardObject = useSelector(
    (state) => state.reducers.virtualCardObject,
  );
  const virtualCardStatus = useSelector(
    (state) => state.reducers.virtualCardStatus,
  );
  const isL1Customer =
    userObject.customerLevel &&
    String(userObject.customerLevel).toUpperCase() == 'L1'
      ? true
      : false;
  const token = useSelector((state) => state.reducers.token);
  const unsorted_reason = useSelector((state) => state.reducers.raastbank);
  const reason = unsorted_reason.sort((a, b) =>
    a.participantName.localeCompare(b.participantName),
  );
  const qrState = useSelector((state) => state.reducers.qrState);
  const dispatch = useDispatch();
  const qrScannerReference = useRef();
  const [cameraOff, setCameraOff] = useState(false);
  const [flashMode, setFlashMode] = useState(false);
  const [checkCard, changeCheckCard] = useState(true);
  const [proceedAlert, changeproceedAlert] = useState(false);
  const [noCardAlertState, setNoCardAlertState] = useState(false);

  const currentNavigation = useSelector(
    (state) => state.reducers.currentNavigation,
  );
  const [warning, setWarning] = useState(false);
  const GalleryStatus = props?.route?.params?.Gallery;
  useEffect(() => {
    if (GalleryStatus === true) {
      qrFromGallery();
    }
  }, [GalleryStatus]);
  useEffect(() => {
    if (props?.route?.params?.UnionPayQr === true) {
      changeCheckCard(false);
    }
  });
  const qrFromGallery = () => {
    setCameraOff(true);
    // console.log('ImagePicker');
    launchImageLibrary({}, (response) => {
      // console.log('Response = ', response);
      // console.log('Response Inner = ', response.uri);

      if (response.didCancel) {
        setCameraOff(false);
        if (GalleryStatus === true) {
          props.navigation.goBack();
        }
        // console.log('User cancelled image picker');
      } else if (response.error) {
        setCameraOff(false);

        // console.log('ImagePicker Error: ', response.error);
      } else if (response.customButton) {
        setCameraOff(false);

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
            .then((data) => {
              let obj = {};
              // console.log('QR Code:', data);
              obj.data = data;
              logs.log('from --------> Gallery', data);
              parsingQR(data);
            })
            .catch((err) => {
              setCameraOff(false);
              logs.log('error', err);
              goBack();
            });
        }
      }
    });
  };

  const goBack = (Expire) => {
    if (Expire) {
      dispatch(setAppAlert('Expired QR', '', props.navigation));
    } else {
      if (GalleryStatus === true) {
        dispatch(setAppAlert('Invalid QR', '', props.navigation));
        props.navigation.goBack();
      } else {
        dispatch(
          setAppAlert('Invalid QR', '', props.navigation, () => {
            props.navigation.goBack();
          }),
        );
      }
    }
  };
  const cameraOffFunction = (flag) => {
    setCameraOff(flag);
  };
  const parsingQR = (read) => {
    dispatch(QRParsing(read, cameraOffFunction, goBack, props.navigation));
  };
  const parsingUnionay = async (read) => {
    logs.log('nasdjhgashjda', read);
    const response = await dispatch(
      parseQrScanCode(read, () => currentNavigation.navigate('PayViaQrScan')),
    );
    if (response) {
      setWarning(false);
      setTimeout(() => {
        currentNavigation.navigate('PayViaQrScan');
      }, 300);
    } else {
      setWarning(true);
      qrScannerReference.reactivate();
    }
    //  dispatch(parseQrScanCode(response))
    // dispatch(setQrScannerState(false));

    // if(!("00" in response)){
    //   dispatch(setAppAlert("NO_PAYLOAD_INDICATOR_FOUND"))
    // }else if(response["00"]!=="01"){
    //   dispatch(setAppAlert(`INVALID_PAYLOAD_INDICATOR => ${response["00"]}`))
    // }else if(!("01" in response)){
    //   dispatch(setAppAlert('NO_POINT_OF_INITIATION_FOUND'))
    // }else {
    //   let type = response["01"]==="12"?'DYNAMIC':'STATIC'
    //   if (this.type == null) {
    //       throw new Exception("INVALID_POINT_OF_INITIATION => " + (String)tlv.get("01"));
    //   } else {
    //       this.merchantAccountInformation = (String)tlv.get("15");
    //       this.merchantCategoryCode = (String)tlv.get("52");
    //       this.transactionCurrency = (String)tlv.get("53");
    //       if (tlv.containsKey("54")) {
    //           this.transactionAmount = new BigDecimal((String)tlv.get("54"));
    //       }
    // dispatch(setQrScannerState(false));
    // setTimeout(() => {
    //   Alert.alert('QR', read.data);
    // }, 500);
  };
  const virtualCardAlert = () => {
    if (virtualCardObject && virtualCardStatus === 'INITIALIZED') {
      props.navigation.navigate('AddVirtualCardMpin', {
        data: true,
      });
    } else {
      if (Object.keys(virtualCardObject).length === 0) {
        setCameraOff(true);
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
              setCameraOff(false);
              logs.log('-----0');
              changeCheckCard(true);
              dispatch(closeGlobalAlertState());
            },
            title: 'QR Payments',
            alert_text: Message.digitalDebitOption,
          }),
        );
      } else {
        changeCheckCard(false);
      }
    }
  };
  const GalleryAndRecieve = () => {
    return (
      <View
        style={{
          flexDirection: 'row',
          width: '100%',
          justifyContent: 'space-between',
          // height: wp(40),
          alignItems: 'center',
          // marginHorizontal: wp(2),
        }}>
        <TouchableOpacity
          onPress={() => {
            qrFromGallery();
          }}
          style={{marginLeft: wp(5), alignItems: 'center'}}>
          <Image
            source={Images.galleryQR}
            style={{width: wp(7), height: wp(7)}}
          />
          <CustomText style={{color: Colors.whiteColor}}>Gallery</CustomText>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => {
            checkCard
              ? props.navigation.navigate('RecieveMoneyRAAST')
              : props.navigation.navigate('PayViaGenerateQr');
          }}
          style={{marginRight: wp(5), alignItems: 'center'}}>
          <Image
            source={Images.receiveQR}
            style={{width: wp(7), height: wp(7)}}
          />
          <CustomText style={{color: Colors.whiteColor}}>Receive</CustomText>
        </TouchableOpacity>
      </View>
    );
  };
  return (
    <QRCodeScanner
      ref={qrScannerReference}
      cameraTimeout={10000}
      reactivate={false}
      fadeIn={cameraOff}
      cameraStyle={{width: '100%', height: '100%'}}
      containerStyle={{backgroundColor: 'white', flex: 1}}
      bottomViewStyle={{
        position: 'absolute',
        bottom: 0,
        alignSelf: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.4)',
        // opacity: 0.5,
      }}
      topViewStyle={{
        position: 'absolute',
        height: wp(20),
        backgroundColor: 'rgba(0, 0, 0, 0.4)',
        zIndex: 1,
      }}
      onRead={async (read) => {
        if (checkCard) {
          parsingQR(read);
          logs.log('from --------> camera', read);
        } else {
          parsingUnionay(read);
        }
      }}
      showMarker={true}
      bottomContent={
        <>
          <View style={{height: hp(17)}} />

          {/* <View style={{height: hp(5)}} /> */}
          {/* {GalleryAndRecieve()} */}
          {/* <View style={{height: hp(3)}} /> */}
        </>
      }
      topContent={
        <View
          style={{
            marginLeft: wp(5),
            flexDirection: 'row',
            justifyContent: 'flex-start',
            alignItems: 'center',
            width: '100%',
            // position:'absolute'
          }}>
          <TouchableOpacity
            onPress={() => {
              props.navigation.goBack();
            }}>
            <Image
              source={Images.BackBlack}
              style={{width: wp(10), height: wp(10), alignSelf: 'center'}}
            />
          </TouchableOpacity>
          <View style={{width: wp(4)}}></View>
          <View style={{flexDirection: 'column'}}>
            <CustomText
              style={{fontSize: wp(7), color: Colors.whiteColor}}
              boldFont={true}>
              {`${checkCard ? 'Raast' : 'UnionPay'} QR Scan`}
            </CustomText>
            <CustomText
              style={{
                fontSize: wp(3.7),
                color: Colors.whiteColor,
              }}
              numberOfLines={1}>
              Scan QR to Send Money
            </CustomText>
          </View>
        </View>
      }
    />
  );
}
