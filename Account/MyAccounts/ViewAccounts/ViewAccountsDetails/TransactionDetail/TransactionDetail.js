import React, {useRef, useState} from 'react';
import {
  View,
  Text,
  ImageBackground,
  TouchableOpacity,
  PermissionsAndroid,
  Platform,
} from 'react-native';
import DeviceInfo from 'react-native-device-info';
import {currencyFormat, globalStyling, wp} from '../../../../../../Constant';
import CustomText from '../../../../../../Components/CustomText/CustomText';
import GlobalHeader from '../../../../../../Components/GlobalHeader/GlobalHeader';
import SubHeader from '../../../../../../Components/GlobalHeader/SubHeader/SubHeader';
import AntDesign from 'react-native-vector-icons/AntDesign';
import styles from './TransactionDetailStyling';
import {useIsFocused} from '@react-navigation/native';
import {captureRef} from 'react-native-view-shot';
import {useDispatch} from 'react-redux';
import {setCurrentFlow} from '../../../../../../Redux/Action/Action';
import CameraRoll from '@react-native-community/cameraroll';
import {logs} from '../../../../../../Config/Config';
import {Colors} from '../../../../../../Theme';
import I18n from '../../../../../../Config/Language/LocalizeLanguageString';
import {ScrollView} from 'react-native';
import analytics from '@react-native-firebase/analytics';
var RNFetchBlob = require('rn-fetch-blob').default;
const PictureDir =
  Platform.OS === 'android'
    ? RNFetchBlob.fs.dirs.DownloadDir
    : RNFetchBlob.fs.dirs.DocumentDir;

export default function TransactionDetail(props) {
  const dispatch = useDispatch();
  const isFocused = useIsFocused();
  const viewRef = useRef();
  const [previewSource, setPreviewResource] = useState(null);
  const [error, setError] = useState(null);
  const [res, setRes] = useState(null);
  const [value, setValue] = useState({
    format: 'jpg',
    quality: 0.9,
  });
  const takeScreenShot = async () => {
    if (Platform.OS === 'ios') {
      captureRef(viewRef, value)
        .then((res) =>
          value.result !== 'file'
            ? res
            : new Promise((success, failure) =>
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
          let imageLocation =
            PictureDir + '/' + String(res).split('-').pop() + '_img.jpg';
          try {
            RNFetchBlob.fs.writeFile(imageLocation, res, 'uri');
            //       CameraRoll.save(res).then(()=>{
            //   console.log('saved');
            // })
            // .catch(err => console.log('err:', err))
            // global.showToast.show(
            //   `Your Screenshot has been saved in ${imageLocation}`,
            //   1000,
            // );
            global.showToast.show(
              I18n[`Screenshot captured successfully. You may save it now.`],
              1500,
            );
            setTimeout(() => {
              RNFetchBlob.ios.openDocument(imageLocation);
            }, 2000);
          } catch (err) {}
          // console.log('FILE CREATED!!');
        })
        .catch((error) => {
          // console.log('HERE', error)
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
              title: 'NBP DIGITAL App Location Permission',
              message: 'NBP DIGITAL App needs access to your location',
              buttonNeutral: 'Ask Me Later',
              buttonNegative: 'Cancel',
              buttonPositive: 'OK',
            },
          );
        }
        if (granted === PermissionsAndroid.RESULTS.GRANTED) {
          captureRef(viewRef, value)
            .then((res) =>
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
            )
            .catch((exp) => {
              logs.log(`exp : ${exp}`);
            })
            .then((res) => {
              setError(null);
              setRes(res);
              setPreviewResource({uri: res});
              logs.log(`res ${res}`);
              let imageLocation =
                PictureDir + '/' + String(res).split('-').pop();
              logs.log(`img ${imageLocation}`);
              try {
                RNFetchBlob.fs.writeFile(imageLocation, res, 'uri');
                global.showToast.show(
                  `${I18n['Your Screenshot has been saved in']} ${imageLocation}`,
                  1500,
                );
              } catch (err) {
                logs.log(err);
              }
              logs.log('FILE CREATED!!');
            })
            .catch((error) => console.log('HERE', error));
        } else {
          // "Location permission denied"
        }
      } catch (err) {}
    }
  };
  React.useEffect(() => {
    getInitialData();
  }, [props, isFocused]);
  const getInitialData = async () => {};
  React.useEffect(() => {
    props.navigation.addListener('focus', () => {
      dispatch(setCurrentFlow('Manage Account'));
      async function analyticsLog() {
        await analytics().logEvent('TransactionDetailScreen');
      }
      analyticsLog();
    });
  }, []);
  return (
    <View
      style={globalStyling.container}
      ref={viewRef}
      accessibilityLabel="Transaction Details">
      {/* <GlobalHeader navigation={props.navigation} /> */}
      <SubHeader
        title={'View Accounts'}
        description={'Account Details'}
        navigation={props.navigation}
        // myAccounts={true}
      />
      {/* <View
        style={styles.imageBackgroundView}
        // ref={viewRef}
        collapsable={false}> */}
      <ScrollView showsVerticalScrollIndicator={false}>
        <View
          style={{
            alignSelf: 'center',
            justifyContent: 'flex-start',
            // elevation: 6,
            borderRadius: 10,
            width: wp(90),
            backgroundColor: 'white',
            marginTop: wp(6),
            padding: wp(3),
          }}>
          <View style={{height: wp(1)}} />
          <View
            style={{
              // height: wp(10),
              backgroundColor: Colors.greyInfoShow,
              width: wp(80),
              alignSelf: 'center',
              borderRadius: wp(1.5),
              padding: wp(4),
            }}>
            <CustomText style={{padding: wp(1), color: '#9ea3a6'}}>
              Transaction Date
            </CustomText>
            <CustomText
              boldFont={true}
              style={{padding: wp(1), fontSize: wp(4.45)}}>
              {props.route.params?.data?.transactiondate}
            </CustomText>
            {/* <View style={{}} /> */}
            <CustomText style={{padding: wp(1), color: '#9ea3a6'}}>
              Transaction Description
            </CustomText>
            <CustomText
              boldFont={true}
              style={{padding: wp(1), fontSize: wp(5)}}>
              {props.route.params?.data?.transactiondesc}
            </CustomText>
            {/* <View style={{height: wp(5)}} /> */}
            <CustomText style={{padding: wp(1), color: '#9ea3a6'}}>
              DR/CR
            </CustomText>
            <CustomText
              boldFont={true}
              style={{padding: wp(1), fontSize: wp(5)}}>
              {props.route.params?.data?.drcr}
            </CustomText>
            <CustomText style={{padding: wp(1), color: '#9ea3a6'}}>
              Cheque Number
            </CustomText>
            <CustomText
              boldFont={true}
              style={{padding: wp(1), fontSize: wp(5)}}>
              -
            </CustomText>
            <CustomText style={{padding: wp(1), color: '#9ea3a6'}}>
              Transaction Details
            </CustomText>
            <CustomText
              boldFont={true}
              style={{padding: wp(1), fontSize: wp(5)}}>
              {props.route.params?.data?.transactiondetail}
            </CustomText>
            <CustomText style={{padding: wp(1), color: '#9ea3a6'}}>
              Error
            </CustomText>
            <CustomText
              boldFont={true}
              style={{padding: wp(1), fontSize: wp(5)}}>
              {props.route.params?.data?.error}
            </CustomText>
          </View>
        </View>
        <View
          style={{
            alignSelf: 'center',
            borderStyle: 'dashed',
            width: wp(85),
            borderWidth: 2,
            height: 2,
            borderRadius: 10,
            borderColor: '#33ad74',
          }}></View>
        <View
          style={{
            width: wp(90),
            alignSelf: 'center',
            // borderStyle: 'dashed',
            // borderWidth: 2,
            borderRadius: 10,
            padding: wp(6),
            backgroundColor: '#33ad74',
            // borderBottomColor: '#33ad74',
            // borderColor: '#33ad74',
          }}>
          <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
            <View
              style={{flexDirection: 'column', justifyContent: 'space-around'}}>
              <CustomText
                style={{
                  alignSelf: 'flex-start',
                  color: '#e6f5ee',
                  textAlign: 'left',
                }}>
                Amount
              </CustomText>
              <CustomText
                style={{
                  alignSelf: 'flex-start',
                  color: '#e6f5ee',
                  textAlign: 'left',
                }}>
                End Balance
              </CustomText>
            </View>
            <View
              style={{flexDirection: 'column', justifyContent: 'space-around'}}>
              <CustomText
                boldFont={true}
                style={{
                  fontSize: wp(5),
                  color: '#e6f5ee',
                  alignSelf: 'flex-end',
                }}>
                {currencyFormat(Number(props.route.params?.data?.amount))}
              </CustomText>
              <CustomText
                boldFont={true}
                style={{
                  fontSize: wp(5),
                  color: '#e6f5ee',
                  alignSelf: 'flex-end',
                }}>
                {currencyFormat(Number(props.route.params?.data?.endbalance))}
              </CustomText>
            </View>
          </View>
        </View>
        {/* <ImageBackground
          source={require('../../../../../../Assets/bg_top.png')}
          style={styles.image}
          resizeMode="stretch">
          <View style={styles.row}>
            <Text style={styles.text}>Transaction Date : </Text>
            <Text style={[styles.text, {width: '50%', textAlign: 'right'}]}>
              {props.route.params?.data?.transactiondate}
            </Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.text}>Transaction Description : </Text>
            <Text style={[styles.text, {width: '50%', textAlign: 'right'}]}>
              {props.route.params?.data?.transactiondesc}
            </Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.text}>DR/CR : </Text>
            <Text style={[styles.text, {width: '50%', textAlign: 'right'}]}>
              {props.route.params?.data?.drcr}
            </Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.text}>Cheque Number : </Text>
            <Text style={[styles.text, {width: '50%', textAlign: 'right'}]}> */}
        {/* {props.route.params?.data?.drcr} */}
        {/* </Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.text}>Amount : </Text>
            <Text style={[styles.text, {width: '50%', textAlign: 'right'}]}>
              {currencyFormat(Number(props.route.params?.data?.amount))}
            </Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.text}>End Balance : </Text>
            <Text style={[styles.text, {width: '50%', textAlign: 'right'}]}>
              {currencyFormat(Number(props.route.params?.data?.endbalance))}
            </Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.text}>Transaction Detail : </Text>
            <Text style={[styles.text, {width: '50%', textAlign: 'right'}]}>
              {props.route.params?.data?.transactiondetail}
            </Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.text}>Error : </Text>
            <Text style={[styles.text, {width: '50%', textAlign: 'right'}]}>
              {props.route.params?.data?.error}
            </Text>
          </View>
        </ImageBackground> */}
        {/* </View> */}
        <TouchableOpacity
          style={styles.screenShotView}
          onPress={() => {
            takeScreenShot();
          }}>
          <Text
            style={[
              {fontSize: wp(3.5), color: 'white'},
              globalStyling.textFontBold,
            ]}>
            {' '}
            Take Screenshot
          </Text>
          <AntDesign
            name="camerao"
            size={wp(4.5)}
            color={'white'}
            style={{bottom: wp(0.5)}}
          />
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}
