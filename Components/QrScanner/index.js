import React, {useRef, useState} from 'react';
import {View, Text, Alert, TouchableWithoutFeedback} from 'react-native';
import QRCodeScanner from 'react-native-qrcode-scanner';
import Modal from 'react-native-modal';
import {useDispatch, useSelector} from 'react-redux';
import {globalStyling, wp} from '../../Constant';
import {setQrScannerState, setAppAlert} from '../../Redux/Action/Action';
import Entypo from 'react-native-vector-icons/Entypo';
import {breakString, parseQrScanCode} from './parseQrScanCode';
import {Colors} from '../../Theme';
import {fontFamily} from '../../Theme/Fonts';
import {logs} from '../../Config/Config';
export default function QrScanner(props) {
  const qrState = useSelector((state) => state.reducers.qrState);
  const dispatch = useDispatch();
  const qrScannerReference = useRef();
  const [flashMode, setFlashMode] = useState(false);
  const currentNavigation = useSelector(
    (state) => state.reducers.currentNavigation,
  );
  const [warning, setWarning] = useState(false);
  // const breakString=(str)=>{
  //   let idx = 0,map={},object;

  //          while(idx < str.length) {
  //      //console.log('idx < str.length ',idx,String)
  //              let tag=String(str).substring(idx,idx+2)
  //               let length = Number(str.substring(idx + 2, idx + 4))
  //                  let value = str.substring(idx + 4, idx + 4 + length);
  //                   idx += 4 + length;
  //                      object={tag:value}
  //                      map[tag]=value
  //          }
  //          console.log('map ',map);
  //  return map
  //  }

  return (
    <Modal
      // animationIn="slideInRight"
      // animationOut="slideOutRight"
      backdropOpacity={1}
      isVisible={qrState}
      onBackdropPress={() => {}}>
      {/* <View style={{width:'95%',alignSelf:'center'}}> */}
      <QRCodeScanner
        ref={qrScannerReference}
        reactivate={true}
        cameraStyle={{width: '100%', height: '100%'}}
        containerStyle={{backgroundColor: 'white', flex: 1}}
        bottomViewStyle={{
          position: 'absolute',
          bottom: wp(10),
          alignSelf: 'center',
        }}
        onRead={async (read) => {
          logs.log('sjdhfgjshdgf-', read);
          const response = await dispatch(
            parseQrScanCode(read, () =>
              currentNavigation.navigate('PayViaQrScan'),
            ),
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
        }}
        showMarker={true}
        // flashMode={RNCamera.Constants.FlashMode.torch}

        bottomContent={
          <View>
            <View style={{marginVertical: wp(5)}}>
              {warning ? (
                <Text
                  style={{
                    color: 'red',
                    fontSize: wp(4.2),
                    fontFamily: fontFamily['ArticulatCF-Normal'],
                    alignSelf: 'center',
                  }}>
                  Incorrect QR code.
                </Text>
              ) : null}
            </View>
            <TouchableWithoutFeedback
              onPress={() => {
                dispatch(setQrScannerState(false));
              }}>
              <View
                style={{
                  backgroundColor: Colors.primary_green,
                  height: wp(13),
                  width: wp(90),
                  borderRadius: wp(1),
                  alignItems: 'center',
                }}>
                <Text
                  style={[
                    globalStyling.buttonText,
                    {fontFamily: fontFamily['ArticulatCF-Bold']},
                  ]}
                  onPress={() => {
                    setWarning(false);
                    setTimeout(() => {
                      dispatch(setQrScannerState(false));
                    }, 300);
                  }}>
                  Cancel
                </Text>
              </View>
            </TouchableWithoutFeedback>
          </View>
        }
      />
      {/* </View> */}
    </Modal>
  );
}
