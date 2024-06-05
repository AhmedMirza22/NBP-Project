import React, {useEffect, useState, useRef} from 'react';
import {
  View,
  KeyboardAvoidingView,
  Text,
  TouchableOpacity,
  PermissionsAndroid,
  TouchableWithoutFeedback,
  Platform,
  Keyboard,
  Modal,
  Image,
} from 'react-native';
import {CheckBox} from 'react-native-elements';
import {fontFamily} from '../../../../Theme/Fonts';
import FontAwsome from 'react-native-vector-icons/FontAwesome';
import Material from 'react-native-vector-icons/MaterialCommunityIcons';
import moment from 'moment';
import CustomText from '../../../../Components/CustomText/CustomText';
import IOSDatePicker from 'react-native-modal-datetime-picker';
import styles from './ReieveMoneyStyle';
import SubHeader from '../../../../Components/GlobalHeader/SubHeader/SubHeader';
import TabNavigator from '../../../../Components/TabNavigate/TabNavigate';
import CustomModal from '../../../../Components/CustomModal/CustomModal';
import CustomTextField from '../../../../Components/CustomTextField/CustomTextField';
import {wp, globalStyling, hp} from '../../../../Constant';
import CustomBtn from '../../../../Components/Custom_btn/Custom_btn';
import {useSelector, useDispatch} from 'react-redux';
import {Colors, Images} from '../../../../Theme';
import {setAppAlert, setCurrentFlow} from '../../../../Redux/Action/Action';
import Share from 'react-native-share';
import {logs} from '../../../../Config/Config';
import IonIcons from 'react-native-vector-icons/AntDesign';
import QRCode from 'react-native-qrcode-svg';
import {captureRef} from 'react-native-view-shot';
import {maskedAccount} from '../../../../Helpers/Helper';
import DateTimePicker from '@react-native-community/datetimepicker';
import DeviceInfo from 'react-native-device-info';
import analytics from '@react-native-firebase/analytics';

var RNFetchBlob = require('rn-fetch-blob').default;
const PictureDir =
  Platform.OS === 'android'
    ? RNFetchBlob.fs.dirs.DownloadDir
    : RNFetchBlob.fs.dirs.DocumentDir;

const RecieveDynamicQR = (props) => {
  const [isSelected, setSelection] = useState(false);
  const viewRef = useRef();
  const loginResponse = useSelector((state) => state.reducers.loginResponse);
  useEffect(() => {
    props.navigation.addListener('focus', () => {
      dispatch(setCurrentFlow('Payment By RAAST ID'));
      async function analyticsLog() {
        await analytics().logEvent('RecieveDnynamicQrScreen');
      }
      analyticsLog();
    });
  }, []);

  useEffect(() => {
    props.navigation.addListener('focus', () => {
      change_from_acc({
        account: accounts[0]?.account,
        iban: accounts[0]?.iban,
        accountType: accounts[0]?.accountType,
        currency: accounts[0]?.currency,
        accountTitle: accounts[0]?.accountTitle,
      });
    });
  }, []);
  const dispatch = useDispatch();
  const [error, setError] = useState(null);
  const [res, setRes] = useState(null);
  const [previewSource, setPreviewResource] = useState(null);
  const [qrShareModal, setQRShareModal] = useState(false);
  const [qrString, setQrString] = useState();
  const [tab_amount, change_amount] = useState('');
  const [modal, change_modal_state] = useState(false);
  const [date, setDate] = useState('');
  const [modal_type, change_modal_type] = useState('');
  const userObject = useSelector((state) => state?.reducers?.userObject);
  const accounts = userObject?.pkAccounts;
  const [tab_from_acc, change_from_acc] = useState({});
  const [value, setValue] = useState({
    format: 'jpg',
    quality: 0.9,
  });
  const inputTextRef = useRef(null);
  useEffect(() => {
    inputTextRef.current.focus();
  }, []);

  const past = new Date();
  past.setDate(past.getDate() - 6570);
  past.toISOString().slice(0, 10);
  const [displaydate, setDisplayDate] = useState(
    moment(new Date()).add(7, 'days').format('DD MMMM YYYY'),
  );
  const currentTime = moment(new Date()).format('hh:mm A');
  const twoHoursLater = '11:59 PM';
  const [displaytime, setDisplayTime] = useState(twoHoursLater);
  const [dateModal, setDateModal] = useState(false);
  const [timeModal, setTimeModal] = useState(false);
  const [validDate, setValidDate] = useState('');
  useEffect(() => {
    const dateo = new Date();
    logs.log('alberto');
    logs.log(
      `${moment(new Date()).add(1, 'days').format('DD')}${moment(
        new Date(),
      ).format('MM')}${dateo.getFullYear()}${moment(new Date()).format(
        'HH',
      )}${dateo.getMinutes()}`,
    );
  }, []);
  function validate() {
    if (tab_amount.length == 0) {
      dispatch(setAppAlert('Enter Amount Correctly'));
    } else if (tab_amount == '0') {
      dispatch(setAppAlert('Amount Should be grater than 1 Rs.'));
    } else if (displaydate == 'Select Date') {
      dispatch(setAppAlert('Date not selected.'));
    } else if (displaytime == 'Select Time') {
      dispatch(setAppAlert('Time not selected.'));
    } else {
      // setDate(

      // );
      // logs.log(
      //   `${moment(displaydate, 'DD MMMM YYYY').format('DDMMYYYY')}${moment(
      //     displaytime,
      //     'hh:mm A',
      //   ).format('HHmm')}`,
      // );
      generatingQr();
      setQRShareModal(true);
    }
  }
  const isAmount = true;
  const overViewData = useSelector((state) => state.reducers.overViewData);

  const onHandleMultiAcc = () => {
    change_modal_state(true);
    change_modal_type('account');
  };
  const generatingQr = () => {
    //SORTED BY CODE AND LENGTH
    //for P2P
    let qrSrtring = '000202';
    //for amount present
    if (isAmount) {
      //if amount
      qrSrtring += '010212';
    } else {
      //if not amount
      qrSrtring += '010211';
    }
    //for RAAST
    qrSrtring += '020200';

    //for iban{
    qrSrtring += '0424';
    qrSrtring += isAmount
      ? tab_from_acc?.iban
      : overViewData.data.accounts.iban;
    //}

    //for amount value
    if (isAmount) {
      //amount id
      qrSrtring += '05';
      //for length of amount added 0
      // qrSrtring += '0';
      //for length of string

      if (tab_amount.length == 1) {
        //amount length if singular unit
        logs.log(
          'if singular unit amount length',
          tab_amount.length,
          'amount ',
          tab_amount,
        );
        qrSrtring += '02';
      } else {
        logs.log(
          'if plural unit amount length',
          tab_amount.length,
          'amount ',
          tab_amount,
        );
        // for decimal
        const decimalLength = tab_amount.length;

        if (String(decimalLength).length == 1) {
          logs.log(
            'singularf decimalm length=====-=->',
            String(decimalLength).length,
          );
          qrSrtring += '0';
        }

        qrSrtring += decimalLength;
      }
      //for amount length
      if (tab_amount.length == 1) {
        logs.log(
          'for checking  if singular unit ammount length',
          tab_amount.length,
          'amount ',
          tab_amount,
        );
        qrSrtring += '0' + tab_amount;
      } else {
        logs.log(
          'for checking  if plural unit ammount',
          tab_amount.length,
          'amount ',
          tab_amount,
        );

        qrSrtring += tab_amount;
      }
      //for time duration for paye
      qrSrtring += '0712';
      qrSrtring += `${moment(displaydate, 'DD MMMM YYYY').format(
        'DDMMYYYY',
      )}${moment(displaytime, 'hh:mm A').format('HHmm')}`;
      logs.log('datelength', date, '=<====', date.length);
    }
    qrSrtring += '1004';
    logs.log(`qrSrtring before crc${qrSrtring}`);

    //calculating crc
    const crc = require('crc');
    const strinCrc = crc.crc16ccitt(qrSrtring).toString(16);
    logs.log('crc', strinCrc);
    if (strinCrc.length == 3) {
      qrSrtring += `0${strinCrc.toUpperCase()}`;
    } else {
      qrSrtring += `${strinCrc.toUpperCase()}`;
    }
    // qrSrtring += `${strinCrc.toUpperCase()}`;
    setQrString(qrSrtring);
    logs.log('qrSrtring', qrSrtring);
  };
  const takeScreenShot = async () => {
    if (Platform.OS === 'ios') {
      logs.log('presseing');
      // info.plist permission has to be  added
      // info.plist permission has to be  added
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
          logs.log('asds');
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
                err && console.log(err);
              });
          } catch (err) {
            logs.log(err);
          }
        });
    } else {
      logs.log('popii');
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
              let imageLocation =
                PictureDir + '/' + String(res).split('-').pop();
              logs.log(imageLocation, String(res));
              try {
                RNFetchBlob.fs.writeFile(imageLocation, res, 'uri');
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
                    err && console.log(err);
                  });
              } catch (err) {
                logs.log(err);
              }
            })
            .catch((error2) => logs.log(error2));
        } else {
          // "Location permission denied"
        }
      } catch (err3) {
        logs.log(err3);
      }
    }
  };

  const DateTimeView = () => {
    return (
      <>
        <CustomText
          style={{
            fontSize: wp(4.5),
            marginLeft: wp(5),
            color: Colors.grey,
            margin: wp(3),
          }}>
          {`Expiry Date`}
        </CustomText>

        <TabNavigator
          tabHeading={'Select Date'}
          text={displaydate}
          accessibilityLabel={'Select Date'}
          navigation={props.navigation}
          width={'90%'}
          fontSize={wp(4.2)}
          textWidth={'100%'}
          // arrowColor={'black'}
          arrowSize={wp(9)}
          multipleLines={2}
          // backgroundColor={Colors.whiteColor}
          // color={'black'}
          border={true}
          onPress={() => {
            setDateModal(true);
            logs.log('Date Tab Navigator Pressed....');
          }}
        />
        {Platform.OS === 'ios' ? iosdateModalComponent() : dateModalComponent()}

        <TabNavigator
          tabHeading={'Select Time'}
          text={displaytime}
          accessibilityLabel={'Select Time'}
          navigation={props.navigation}
          width={'90%'}
          fontSize={wp(4.2)}
          textWidth={'100%'}
          // arrowColor={'black'}
          arrowSize={wp(9)}
          multipleLines={2}
          // backgroundColor={Colors.whiteColor}
          // color={'black'}
          border={true}
          onPress={() => {
            setTimeModal(true);
            logs.log('Time Tab Navigator Pressed....');
          }}
        />
        {Platform.OS === 'ios' ? iostimeModalComponent() : TimeModalComponent()}
      </>
    );
  };

  const dateModalComponent = () => {
    return dateModal === true ? (
      <DateTimePicker
        value={new Date()}
        minimumDate={new Date(Date.now() + 24 * 60 * 60 * 1000)}
        display="calendar"
        onChange={(newDate) => {
          logs.debug(
            'newDate : ',
            newDate.nativeEvent.timestamp,
            moment(newDate.nativeEvent.timestamp).format('DD/MMM/YYYY'),
          );
          setDateModal(false);
          setDisplayDate(
            moment(newDate.nativeEvent.timestamp).format('DD MMMM YYYY'),
          );
        }}
      />
    ) : // )
    null;
  };

  const TimeModalComponent = () => {
    return timeModal === true ? (
      <DateTimePicker
        value={new Date()}
        mode="time"
        minimumDate={new Date(Date.now() + 60 * 60 * 1000)}
        onChange={(newTime) => {
          logs.debug(
            'newTime : ',
            newTime.nativeEvent.timestamp,
            moment(newTime.nativeEvent.timestamp).format('hh:mm'),
          );
          setTimeModal(false);
          setDisplayTime(
            moment(newTime.nativeEvent.timestamp).format('hh:mm A'),
          );
        }}
      />
    ) : null;
  };

  const iosdateModalComponent = () => {
    return (
      <IOSDatePicker
        date={new Date(Date.now() + 24 * 60 * 60 * 1000)}
        isVisible={dateModal}
        mode="date"
        minimumDate={new Date(Date.now() + 24 * 60 * 60 * 1000)}
        onConfirm={(newDate) => {
          logs.debug(
            'newDate : ',
            newDate,

            moment(newDate).format('DD MMMM YYYY'),
          );
          setDateModal(false);
          setDisplayDate(moment(newDate).format('DD MMMM YYYY'));
        }}
        onCancel={() => {
          setDateModal(false);
        }}
      />
    );
  };
  const iostimeModalComponent = () => {
    return (
      <IOSDatePicker
        date={new Date(Date.now() + 24 * 60 * 60 * 1000)}
        isVisible={timeModal}
        mode="time"
        onConfirm={(newTime) => {
          logs.debug(
            'newTime : ',

            moment(newTime).format('hh:mm'),
          );
          setTimeModal(false);
          setDisplayTime(moment(newTime).format('hh:mm A'));
        }}
        onCancel={() => {
          setTimeModal(false);
        }}
      />
    );
  };
  return (
    <TouchableWithoutFeedback
      onPress={() => {
        Keyboard.dismiss();
      }}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : null}
        keyboardVerticalOffset={40}
        style={[
          globalStyling.whiteContainer,
          {backgroundColor: Colors.backgroundColor},
        ]}
        accessibilityLabel="RAAST Payment by RAAST ID Screen">
        <SubHeader
          navigation={props.navigation}
          title={'QR Pay'}
          description={'QR Code to Receive Money'}
        />
        <View style={{height: wp(6)}} />

        <View style={{height: wp(6)}} />
        <CustomTextField
          accessibilityLabel="Enter Amount here"
          keyboardType={'numeric'}
          ref={inputTextRef}
          placeholder={'Enter Amounts'}
          text_input={tab_amount}
          textHeading={tab_amount.length == 0 ? null : 'Amount'}
          currencyInput={true}
          onChangeText={(value) => {
            change_amount(String(value).replace(/[^0-9]/g, ''));
          }}
          onSubmitEditing={() => {}}
          returnKeyType={'next'}
          maxLength={7}
          width={'90%'}
        />
        <View style={{height: wp(2)}}></View>
        <CheckBox
          checked={isSelected}
          title={'To change expiry date & time'}
          textStyle={{
            fontSize: wp(4.5),
            fontFamily: fontFamily['ArticulatCF-DemiBold'],
          }}
          containerStyle={{
            borderColor: Colors.backgroundColor,
            backgroundColor: Colors.backgroundColor,
            width: '95%',
            alignSelf: 'center',
          }}
          onPress={() => {
            setSelection(!isSelected);
            setDisplayDate(
              moment(new Date()).add(7, 'days').format('DD MMMM YYYY'),
            );
            setDisplayTime('11:59 PM');
          }}
          checkedColor={Colors.primary_green}
          size={wp(7)}
          checkedIcon={
            <FontAwsome
              name={'check-square'}
              size={wp(6)}
              color={Colors.primary_green}
            />
          }
          uncheckedIcon={
            <Material
              name={'checkbox-blank-outline'}
              size={wp(6)}
              color={Colors.grey}
            />
          }
        />

        {isSelected ? DateTimeView() : null}
        <View
          style={{position: 'absolute', alignSelf: 'center', bottom: wp(10)}}>
          <CustomBtn
            btn_txt={'Generate'}
            accessibilityLabel={'Next'}
            onPress={() => {
              validate();
            }}
            btn_width={wp(90)}
            backgroundColor={Colors.primary_green}
          />
        </View>
        <CustomModal
          visible={modal}
          headtext={'Select From Account'}
          data={accounts}
          onPress_item={(param) => {
            change_from_acc(param);
            change_modal_state(false);
          }}
          accounts={modal_type === 'account' ? true : false}
          onCancel={() => change_modal_state(false)}
        />
        <Modal
          transparent={true}
          visible={qrShareModal}
          animationType={'slide'}
          onRequestClose={() => {
            setQRShareModal(false);
          }}
          style={{
            alignSelf: 'center',
            alignItems: 'center',
          }}
          ref={viewRef}>
          <View
            style={{
              flex: 1,
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'center',
              backgroundColor: '#00000080',
            }}>
            <View
              style={{
                // height: '60%',
                width: wp(90),
                backgroundColor: Colors.subContainer,
                borderRadius: wp(1),
                justifyContent: 'center',
                alignSelf: 'center',
              }}>
              <IonIcons
                name={'closecircle'}
                size={wp(6)}
                color={Colors.lightGrey}
                onPress={() => {
                  setQRShareModal(false);
                }}
                style={{
                  alignSelf: 'flex-end',
                  marginRight: wp(2),
                  marginTop: 4,
                }}
              />
              <View
                ref={viewRef}
                style={{backgroundColor: Colors.subContainer}}>
                <View style={{height: wp(2)}} />
                <Image
                  // source={Images.main_logo_withtext}
                  source={Images.logoWithText}
                  style={{width: wp(40), height: wp(15), alignSelf: 'center'}}
                  resizeMode={'contain'}
                />
                <View style={{height: wp(4)}} />
                <View>
                  <View style={{alignSelf: 'center'}}>
                    <QRCode
                      value={qrString}
                      size={wp(50)}
                      logo={Images.raast2nd}
                      logoSize={wp(10)}
                      logoMargin={5}
                      color={Colors.mainTextColors}
                      logoBackgroundColor={Colors.subContainer}
                      // logoMargin={5}
                      backgroundColor="transparent"
                    />
                  </View>
                  <View style={{height: wp(4)}} />
                  <View
                    style={{
                      flexDirection: 'column',
                      justifyContent: 'space-between',
                    }}>
                    <CustomText
                      boldFont={true}
                      style={{textAlign: 'center', fontSize: wp(5)}}>
                      {overViewData.data.accounts.accountTitle}
                    </CustomText>
                    <CustomText
                      style={{
                        textAlign: 'center',
                        fontSize: wp(4),
                        padding: wp(1),
                      }}>
                      <CustomText boldFont={true}>RAAST ID :</CustomText>
                      {loginResponse?.details?.mobile}
                    </CustomText>
                    <CustomText style={{textAlign: 'center', fontSize: wp(4)}}>
                      {maskedAccount(overViewData.data.accounts.account)}
                    </CustomText>
                  </View>
                  <CustomText
                    boldFont={true}
                    style={{textAlign: 'center', fontSize: wp(6)}}>
                    {`Rs.${tab_amount}`}
                  </CustomText>
                  <CustomText
                    // boldFont={true}
                    style={{
                      textAlign: 'center',
                      fontSize: wp(4),
                      width: wp(60),
                      alignSelf: 'center',
                    }}>
                    Expires on {displaydate} at {displaytime}
                  </CustomText>
                  <View style={{height: wp(4)}} />
                </View>
              </View>

              <TouchableOpacity
                style={{
                  width: wp(70),
                  backgroundColor: Colors.primary_green,
                  height: wp(13),
                  justifyContent: 'center',
                  alignItems: 'center',
                  borderRadius: wp(1),
                  alignSelf: 'center',
                }}
                onPress={() => {
                  takeScreenShot();
                }}>
                <Text
                  style={[
                    globalStyling.textFontBold,
                    {color: Colors.whiteColor, fontSize: wp(4)},
                  ]}>
                  Share
                </Text>
              </TouchableOpacity>

              <View style={{height: wp(4)}} />
            </View>
          </View>
        </Modal>
      </KeyboardAvoidingView>
    </TouchableWithoutFeedback>
  );
};

export default RecieveDynamicQR;
