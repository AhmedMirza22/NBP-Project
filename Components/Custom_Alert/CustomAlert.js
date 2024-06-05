import React, {useEffect, useState} from 'react';
import {
  View,
  Dimensions,
  Text,
  Image,
  ScrollView,
  Alert,
  KeyboardAvoidingView,
  TouchableNativeFeedbackBase,
  TouchableWithoutFeedback,
  TouchableOpacity,
} from 'react-native';
import I18n from '../../Config/Language/LocalizeLanguageString';
import Modal from 'react-native-modal';
import FontAwsome from 'react-native-vector-icons/FontAwesome';
import Material from 'react-native-vector-icons/MaterialCommunityIcons';
import styles from './CustomAlertStyle';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {Colors, Images} from '../../Theme';
import Feather from 'react-native-vector-icons/Feather';
import CustomBtn from '../../Components/ModalButton/ModalButton';
import TabNavigator from '../../Components/TabNavigate/TabNavigate';
import CustomTextField from '../CustomTextField/CustomTextField';
import {globalStyling, wp, hp} from '../../Constant';
import {WebView} from 'react-native-webview';
import {Platform} from 'react-native';
import AntDesign from 'react-native-vector-icons/AntDesign';
import {useSelector, useDispatch} from 'react-redux';
import CountDown from 'react-native-countdown-component';
import HTML from 'react-native-render-html';
import {GestureHandlerRootView} from 'react-native-gesture-handler';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {CheckBox} from 'react-native-elements';
import {setAppAlert} from '../../Redux/Action/Action';
import {Message} from '../../Constant/Messages';
import {checkNBPIBAN} from '../../Helpers/Helper';
import {fontFamily} from '../../Theme/Fonts';
import CustomText from '../CustomText/CustomText';
import {TouchableHighlight} from 'react-native';
import {logs} from '../../Config/Config';
import {isRtlState} from '../../Config/Language/LanguagesArray';
import {useTheme} from '../../Theme/ThemeManager';
// import TouchableNativeFeedback from 'react-native-gesture-handler/lib/typescript/components/touchables/TouchableNativeFeedback.android';

const screenWidth = Dimensions.get('window').width;

//overlay_state
//props.onPressClosebtn()
//props.onPressCancel()
//props.onPressOkay()
//alert_text

const CustomAlert = (props) => {
  const {activeTheme} = useTheme();
  const loginResponse = useSelector((state) => state.reducers.loginResponse);

  const currentFlow = useSelector((state) => state.reducers.currentFlow);
  // const []
  const [checkCard, changeCheckCard] = useState(false);
  const dispatch = useDispatch();
  const getYesNoAlert = (onYes, onNo) => {
    Alert.alert(
      props.alert_text === 'Are you sure you want to logout?'
        ? 'Logout'
        : props?.title
        ? props?.title
        : currentFlow !== ''
        ? currentFlow
        : 'NBP Digital',
      props.alert_text,
      [
        {
          text: I18n['Yes'],
          onPress: () => {
            onYes();
          },
        },
        {
          text: I18n['No'],
          onPress: () => {
            onNo();
          },
        },
      ],
    );
  };
  // let timeout;
  // React.useEffect(()=>{
  //   props.timer?
  //    timeout=setTimeout(() => {
  //     console.log('setTimeout executed');
  //       props.onPress()
  //         clearTimeout(timeout)
  //   }, 5000):null;
  // },[])
  // const [overlay_state,setOverlayState]=useState(false)
  return (
    //   // animationType={'slide'}
    //   animationType={'fade'}
    //   isVisible={props.overlay_state}
    //   overlayStyle={styles.overlay}
    //   >
    props.overlay_state && props.yesNoButtons && Platform.OS === 'ios' ? (
      <View>{getYesNoAlert(props.onPressYes, props.onPressNo)}</View>
    ) : (
      <Modal
        animationIn="slideInRight"
        animationOut="slideOutRight"
        onBackButtonPress={() => {
          setTimeout(() => {
            props.onPressCancel ? props.onPressCancel() : null;
          }, 300);
        }}
        isVisible={props.overlay_state}
        backdropOpacity={0.3}
        // animationInTiming={2}
        // animationOutTiming={2}
        onBackdropPress={() => {
          setTimeout(() => {
            props.onPressCancel ? props.onPressCancel() : null;
          }, 300);
        }}>
        <View>
          {/* {props.noTitle ? null : (
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
                alignSelf: 'center',
                backgroundColor: Colors.primary_green,
                paddingHorizontal: wp(3),
                // width: wp(90),
                width: '100%',
                height: wp(13),
                borderTopLeftRadius: wp(1),
                borderTopRightRadius: wp(1),
              }}>
              <Text
                style={{
                  fontSize: wp(4.3),
                  fontFamily: fontFamily['ArticulatCF-DemiBold'],
                  color: Colors.whiteColor,
                }}>
                {props.title}
              </Text>
              <TouchableWithoutFeedback
                onPress={() => {
                  props.onPressCancel();
                }}>
                <Image
                  source={Images.closeBtn}
                  style={{width: wp(6), height: wp(6)}}
                />
              </TouchableWithoutFeedback>
            </View>
          )} */}

          <View
            style={{
              backgroundColor: activeTheme.alertBackGroundColor,
              padding: props.padding ? props.padding : wp(3),
              borderRadius: wp(1),
            }}>
            {props.noTitle ? (
              <View style={{height: wp(3)}} />
            ) : (
              <>
                {props?.closeBtnOff ? null : (
                  <AntDesign
                    name={'closecircle'}
                    size={wp(5)}
                    color={Colors.themeGrey}
                    style={{marginRight: wp(2), alignSelf: 'flex-end'}}
                    onPress={() => {
                      props.onPressCancel();
                    }}
                  />
                )}

                {props?.nationalBankAccountNumberPolicy ||
                props?.nationalBankIBANPolicy ? null : (
                  <>
                    <Image
                      source={Images.alertIcon}
                      style={{
                        alignSelf: 'center',
                        width: wp(15),
                        height: wp(15),
                      }}
                    />
                    <CustomText
                      style={{
                        fontSize: wp(7),
                        alignSelf: 'center',
                        padding: wp(4),
                        fontFamily: fontFamily['ArticulatCF-DemiBold'],
                      }}>
                      Alert
                    </CustomText>
                  </>
                )}
              </>
            )}
            {props.qrScanInputr ? (
              <View>
                <CustomText
                  style={[
                    styles.text2,
                    globalStyling.textFontNormal,
                    {width: '90%'},
                  ]}>
                  Enter Amount
                </CustomText>
                <CustomTextField
                  width={'90%'}
                  borderColor={'grey'}
                  placeholder=""
                  maxLength={14}
                  keyboardType={'number-pad'}
                  text_input={props.text_input}
                  onChangeText={(value) => {
                    props.onChangeText(String(value).replace(/[^0-9]/g, ''));
                  }}
                />
                <View style={{paddingTop: wp(3)}} />
                <CustomBtn
                  btn_width={wp(76)}
                  backgroundColor={Colors.primary_green}
                  btn_txt={'Confirm'}
                  fontSize={wp(4.8)}
                  onPress={() => props.onPress()}
                />
              </View>
            ) : props.timer ? (
              <View style={{paddingHorizontal: wp(2)}}>
                <View
                  style={{
                    height: wp(10),
                    width: wp(80),
                    alignSelf: 'center',
                    backgroundColor: '#99d6b9',
                    borderTopLeftRadius: wp(1),
                    borderTopRightRadius: wp(1),
                  }}></View>
                <View
                  style={{
                    // height: wp(10),
                    width: wp(80),
                    alignSelf: 'center',
                    backgroundColor: '#ccebdc',
                    borderBottomLeftRadius: wp(1),
                    borderBottomRightRadius: wp(1),
                  }}>
                  <View style={styles.rowView}>
                    <CustomText style={styles.textAlert1} boldFont={true}>
                      {`Card Number`}
                    </CustomText>
                    <CustomText style={styles.textAlert2}>
                      {props?.showCardNumber === true
                        ? props.object.cardNumber
                        : props.object.cardNumber
                        ? `${String(props.object.cardNumber).substr(
                            0,
                            6,
                          )}******${String(props.object.cardNumber).substr(
                            12,
                            16,
                          )}`
                        : ''}
                    </CustomText>
                  </View>
                  <View style={styles.rowView}>
                    <CustomText style={styles.textAlert1} boldFont={true}>
                      Expiry Date
                    </CustomText>
                    <CustomText style={styles.textAlert2}>
                      {String(props.object.expiryDate).slice(0, 2)}/
                      {String(props.object.expiryDate).slice(2, 4)}
                    </CustomText>
                  </View>
                  <View style={styles.rowView}>
                    <CustomText style={styles.textAlert1} boldFont={true}>
                      CVV
                    </CustomText>
                    <CustomText style={styles.textAlert2}>
                      {props.object.cvn}
                    </CustomText>
                  </View>
                  <View style={styles.rowView}>
                    <CustomText style={styles.textAlert1} boldFont={true}>
                      Full Name
                    </CustomText>
                    <CustomText style={styles.textAlert2}>
                      {loginResponse?.details?.accountTitle}
                    </CustomText>
                  </View>
                  <View style={styles.rowView}>
                    <CustomText style={styles.textAlert1} boldFont={true}>
                      Cell #
                    </CustomText>
                    <CustomText style={styles.textAlert2}>
                      {loginResponse?.details?.mobile}
                    </CustomText>
                  </View>
                  <View style={{flexDirection: 'row', paddingLeft: wp(2)}}>
                    <View
                      style={{
                        height: wp(4),
                        width: wp(14),
                        backgroundColor: Colors.backgroundColor,
                        borderRadius: wp(10),
                      }}></View>
                    <View style={{width: wp(2)}} />
                    <View
                      style={{
                        height: wp(4),
                        width: wp(14),
                        borderRadius: wp(10),
                        backgroundColor: Colors.backgroundColor,
                      }}></View>
                  </View>
                  <View style={{height: wp(3)}} />
                </View>
                {/* 
                <View style={[styles.row, {paddingBottom: wp(7)}]}>
                  <Text style={[styles.textAlert, {fontWeight: 'bold'}]}>
                    {props.title}
                  </Text>
                  <View
                    style={{
                      borderBottomWidth: 0,
                      flexDirection: 'row',
                      alignItems: 'center',
                    }}>
                    <Text style={styles.greenText}>Time : 00 :</Text>
                    <CountDown
                      until={30}
                      onFinish={() => props.onPress()}
                      onPress={() => {}}
                      size={wp(4.5)}
                      digitStyle={{
                        backgroundColor: 'transparent',
                        padding: 0,
                        margin: 0,
                      }}
                      digitTxtStyle={{color: Colors.primary_green}}
                      timeToShow={['S']}
                      timeLabels={{m: null, s: null}}
                    />
                  </View>
                </View> */}

                <View style={{marginVertical: wp(4)}}>
                  <CustomBtn
                    btn_width={wp(80)}
                    backgroundColor={Colors.primary_green}
                    btn_txt={'OK'}
                    // fontSize={wp(4.8)}
                    onPress={() => props.onPress()}
                  />
                </View>
              </View>
            ) : props.otherBeneficiaryAlert ? (
              <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : null}
                keyboardVerticalOffset={160}
                style={[styles.container]}>
                <ScrollView showsVerticalScrollIndicator={false}>
                  <TabNavigator
                    border={true}
                    text={
                      props.text ? props.text : 'Tap here to select an option'
                    }
                    width={'93%'}
                    fontSize={wp(4)}
                    textWidth={'90%'}
                    hideOverlay={props.hideOverlay ? props.hideOverlay : false}
                    color={props.color ? props.color : false}
                    onPress={() => props.showCompanyNames()}
                    backgroundColor={
                      props.backgroundColor ? props.backgroundColor : false
                    }
                  />
                  <View
                    style={{
                      width: wp(80),
                      borderColor: 'lightgrey',
                      borderWidth: wp(0.125),
                      alignSelf: 'center',
                    }}
                  />
                  {/* Company Number */}

                  <View style={{height: wp(2)}} />
                  <CustomTextField
                    textHeading={props.text_input ? 'Consumer Number' : null}
                    placeholder={'Consumer Number'}
                    width={'93%'}
                    // borderColor={Colors.grey}
                    maxLength={30}
                    keyboardType={'number-pad'}
                    text_input={props.text_input}
                    onChangeText={(value) => {
                      props.onChangeText(String(value).replace(/[^0-9]/g, ''));
                    }}
                  />
                  <View style={{marginTop: hp(2)}}>
                    <CustomBtn
                      btn_width={'93%'}
                      backgroundColor={Colors.primary_green}
                      btn_txt={'Continue'}
                      fontSize={wp(4.8)}
                      onPress={() => props.onPress()}
                    />
                  </View>
                </ScrollView>
              </KeyboardAvoidingView>
            ) : props.changePasswordPolicy ? (
              <View>
                {/* <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    width: '90%',
                    alignSelf: 'center',
                    paddingBottom: wp(1),
                    borderBottomWidth: wp(0.13),
                  }}>
                  <Text style={styles.text}>{props.title}</Text>

                  <Feather
                    name={'x'}
                    size={wp(10)}
                    color={'black'}
                    // style={{width: '50%'}}
                    onPress={() => {
                      props.onPressCancel();
                    }}
                  />
                </View> */}

                <CustomText
                  style={[
                    styles.note,
                    {textAlign: isRtlState() ? 'left' : 'right'},
                  ]}>
                  Password to be created as per below NBP Password Policy
                </CustomText>
                <CustomText
                  style={[
                    styles.note,
                    {textAlign: isRtlState() ? 'left' : 'right'},
                  ]}>
                  a. Password Must contain Lower & Upper Case Characters (e.g.,
                  a-z, A-Z)
                </CustomText>
                <CustomText
                  style={[
                    styles.note,
                    {textAlign: isRtlState() ? 'left' : 'right'},
                  ]}>
                  b. Must have at least one digit and special character from (@,
                  $, %, !, +, _, -)
                </CustomText>
                <CustomText
                  style={[
                    styles.note,
                    {textAlign: isRtlState() ? 'left' : 'right'},
                  ]}>
                  c. At least eight (8) alphanumeric characters long
                </CustomText>
                {/* <View style={styles.seperator} /> */}
                <CustomBtn
                  btn_txt={'OK'}
                  onPress={() => props.onPressCancel()}
                  btn_width={'50%'}
                  backgroundColor={Colors.primary_green}
                />
              </View>
            ) : props.ibftBankTransfer ? (
              <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : null}
                keyboardVerticalOffset={160}
                style={styles.container}>
                <ScrollView showsVerticalScrollIndicator={false}>
                  {/* <View style={styles.row}>
                    <Text style={styles.textLabel}>
                      Inter Bank Fund Transfer
                    </Text>
                    <Feather
                      name={'x'}
                      size={wp(10)}
                      color={'black'}
                      style={{alignSelf: 'flex-end'}}
                      onPress={() => {
                        props.onPressCancel();
                      }}
                    />
                  </View> */}
                  {/* <ScrollView showsVerticalScrollIndicator={false}> */}
                  <CustomText style={styles.title}>Beneficiary Bank</CustomText>
                  <TabNavigator
                    border={true}
                    text={props.bankObject?.bankName}
                    textWidth={'90%'}
                    onPress={() => props.showBankListModal()}
                  />

                  <HTML
                    source={{
                      html: props.bankObject?.accountFormat
                        ? props.bankObject?.accountFormat
                        : '',
                    }}
                    baseFontStyle={{fontSize: wp(3.5)}}
                    containerStyle={{
                      width: '95%',
                      alignSelf: 'center',
                      marginVertical: wp(2),
                      paddingLeft: wp(3),
                    }}
                    // contentWidth={contentWidth}
                  />
                  {/* </ScrollView>
            </View> */}
                  <CustomText
                    style={[
                      styles.title,
                      {width: '95%', alignSelf: 'center', paddingLeft: wp(3)},
                    ]}>
                    Account Number
                  </CustomText>
                  <View style={{flexDirection: 'row', marginLeft: 20}}>
                    <CustomTextField
                      width={'95%'}
                      borderColor={Colors.lightGrey}
                      // maxLength={14}
                      // keyboardType={'number-pad'}
                      onChangeText={(value) => {
                        props.onChangeText(value);
                      }}
                      maxLength={24}
                    />
                  </View>
                  <View style={{marginVertical: wp(3)}}>
                    <CustomBtn
                      btn_width={'90%'}
                      backgroundColor={Colors.primary_green}
                      btn_txt={'Continue'}
                      fontSize={wp(4.8)}
                      onPress={() => props.onPress()}
                    />
                  </View>
                </ScrollView>
              </KeyboardAvoidingView>
            ) : props.customInputAlert ? (
              <View>
                {/* <View style={styles.row}>
                  <Text style={styles.textLabel}>
                    {checkCard ? 'Enter Account Number' : 'Enter IBAN'}
                  </Text>
                  <Feather
                    name={'x'}
                    size={wp(10)}
                    color={'black'}
                    style={{alignSelf: 'flex-end'}}
                    onPress={() => {
                      props.onPressCancel();
                    }}
                  />
                </View> */}
                <View
                  style={{
                    height: wp(14),
                    width: wp(81),
                    marginTop: wp(1),
                    borderRadius: wp(1),
                    justifyContent: 'center',
                    // backgroundColor: 'silver',
                    alignSelf: 'center',
                    marginBottom: wp(2),
                    borderWidth: 1,
                    borderColor: 'lightgrey',
                  }}>
                  <View
                    style={{
                      flexDirection: 'row',
                      justifyContent: 'center',
                    }}>
                    <TouchableWithoutFeedback
                      onPress={() => {
                        changeCheckCard(!checkCard);
                        props.onPressAcc(checkCard);
                        logs.log('onPressAcc', checkCard);
                        changeCheckCard(true);
                      }}>
                      <View
                        style={{
                          height: wp(13),
                          width: wp(40),
                          // borderRadius: wp(1.5),
                          borderBottomLeftRadius: wp(1),
                          borderTopLeftRadius: wp(1),
                          justifyContent: 'center',
                          alignItems: 'center',
                          backgroundColor: checkCard
                            ? 'white'
                            : Colors.greyInfoShow,
                        }}>
                        <CustomText
                          // style={style.txt}
                          boldFont={true}
                          style={[
                            {
                              fontSize: wp(4),
                              color: checkCard ? 'black' : Colors.grey,
                            },
                            checkCard
                              ? globalStyling.textFontBold
                              : globalStyling.textFontNormal,
                          ]}>
                          Account Number
                        </CustomText>
                      </View>
                    </TouchableWithoutFeedback>
                    <TouchableWithoutFeedback
                      onPress={() => {
                        changeCheckCard(!checkCard);
                        props.onPressIban(checkCard);
                        changeCheckCard(false);
                      }}>
                      <View
                        style={{
                          height: wp(13),
                          width: wp(40),
                          // borderRadius: wp(6),
                          borderBottomRightRadius: wp(1),
                          borderTopRightRadius: wp(1),
                          justifyContent: 'center',
                          alignItems: 'center',
                          backgroundColor: checkCard
                            ? Colors.greyInfoShow
                            : 'white',
                        }}>
                        <CustomText
                          // style={style.txt}

                          style={[
                            {
                              fontSize: wp(4),
                              color: checkCard
                                ? Colors.grey
                                : Colors.blackColor,
                            },
                            checkCard
                              ? globalStyling.textFontNormal
                              : globalStyling.textFontBold,
                          ]}>
                          IBAN
                        </CustomText>
                      </View>
                    </TouchableWithoutFeedback>
                  </View>
                </View>
                {/* <CustomText
                  style={[styles.text2, globalStyling.textFontNormal]}>
                  {checkCard ? props.label : 'IBAN'}
                </CustomText> */}
                <View style={{height: wp(5)}} />

                <View style={{flexDirection: 'row', marginLeft: wp(2)}}>
                  <CustomTextField
                    textHeading={
                      props.text_input.length > 0
                        ? checkCard
                          ? 'Account Number'
                          : 'IBAN'
                        : null
                    }
                    width={wp(70)}
                    borderColor={Colors.lightGrey}
                    placeholder={
                      checkCard ? 'Enter Account Number' : 'Enter IBAN Number'
                    }
                    maxLength={checkCard ? 14 : 24}
                    fontSize={checkCard ? wp(3.8) : wp(3.2)}
                    text_input={props.text_input}
                    keyboardType={checkCard ? 'number-pad' : 'default'}
                    onChangeText={(value) => {
                      checkCard
                        ? props.onChangeText(
                            String(value).replace(/[^0-9]/g, ''),
                          )
                        : props.onChangeText(
                            String(value).replace(/[^a-z0-9]/gi, ''),
                          );
                    }}
                  />
                  <View style={{width: wp(2)}}></View>
                  <TouchableHighlight
                    style={{
                      width: wp(9),
                      height: wp(13),
                      borderColor: Colors.lightGrey,
                      borderWidth: 0.5,
                      borderRadius: wp(1),
                      justifyContent: 'center',
                      alignSelf: 'center',
                      backgroundColor: 'white',
                    }}
                    onPress={() => {
                      props.onPressInfo();
                    }}>
                    <Feather
                      name={'info'}
                      size={wp(5)}
                      color={'black'}
                      onPress={() => {
                        props.onPressInfo();
                      }}
                      style={{alignSelf: 'center', padding: 5}}
                    />
                  </TouchableHighlight>
                </View>

                {/* {
                  <View
                    style={{
                      flexDirection: 'row',
                      marginHorizontal: wp(4),
                      alignSelf: 'center',
                    }}>
                    <CheckBox
                      checked={checkCard ? true : false}
                      textStyle={[
                        {fontSize: wp(4.5), fontWeight: '500'},
                        globalStyling.textFontNormal,
                      ]}
                      containerStyle={{
                        borderColor: Colors.whiteColor,
                        backgroundColor: Colors.whiteColor,
                        // width: '95%',
                        alignSelf: 'center',
                      }}
                      title={'Account Number'}
                      onPress={() => {
                        // set_account_no('');
                        changeCheckCard(!checkCard);
                        props.onPressAcc(checkCard);
                      }}
                      checkedIcon={
                        <Ionicons
                          name={'radio-button-on'}
                          size={wp(6)}
                          color={Colors.primary_green}
                        />
                      }
                      uncheckedIcon={
                        <Ionicons
                          name={'radio-button-off-outline'}
                          size={wp(6)}
                          color={Colors.grey}
                        />
                      }
                      checkedColor={Colors.primary_green}
                      size={wp(6)}
                    />

                    <CheckBox
                      checked={checkCard ? false : true}
                      textStyle={[
                        {fontSize: wp(4.5), fontWeight: '500'},
                        globalStyling.textFontNormal,
                      ]}
                      containerStyle={{
                        borderColor: Colors.whiteColor,
                        backgroundColor: Colors.whiteColor,
                        // width: '95%',
                        alignSelf: 'center',
                      }}
                      checkedIcon={
                        <Ionicons
                          name={'radio-button-on'}
                          size={wp(6)}
                          color={Colors.primary_green}
                        />
                      }
                      uncheckedIcon={
                        <Ionicons
                          name={'radio-button-off-outline'}
                          size={wp(6)}
                          color={Colors.grey}
                        />
                      }
                      title={'IBAN'}
                      onPress={() => {
                        // set_account_no('');
                        changeCheckCard(!checkCard);
                        props.onPressIban(checkCard);
                      }}
                      checkedColor={Colors.primary_green}
                      size={wp(6)}
                    />
                  </View>
                } */}
                <View style={{height: wp(5)}} />

                <View style={{paddingTop: wp(3)}} />
                <CustomBtn
                  btn_width={'95%'}
                  backgroundColor={Colors.primary_green}
                  btn_txt={'Continue'}
                  fontSize={wp(4.8)}
                  onPress={() => {
                    if (props.text_input == '') {
                      dispatch(
                        setAppAlert(
                          checkCard
                            ? Message.emptyAccountNumber
                            : Message.emptyIBANNumber,
                        ),
                      );
                    } else if (
                      checkCard
                        ? props.text_input.length !== 14
                        : props.text_input.length !== 24
                    ) {
                      dispatch(
                        setAppAlert(
                          checkCard
                            ? Message.incompleteAccountNumber
                            : Message.incompleteiban,
                        ),
                      );
                    } else {
                      if (checkCard) {
                        props.onPress();
                      } else {
                        if (checkNBPIBAN(props.text_input)) {
                          props.onPress();
                        } else {
                          dispatch(setAppAlert(Message.incompleteiban));
                        }
                      }
                    }
                  }}
                />
              </View>
            ) : props.addOtherBeneficiaryAccount ? (
              <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : null}
                keyboardVerticalOffset={160}
                style={styles.container}>
                <ScrollView showsVerticalScrollIndicator={false}>
                  {/* <View style={styles.row}>
                    <Text style={styles.textLabel}>
                      Please Select Option Below
                    </Text>
                    <Feather
                      name={'x'}
                      size={wp(10)}
                      color={'black'}
                      style={{alignSelf: 'flex-end'}}
                      onPress={() => {
                        props.onPressCancel();
                      }}
                    />
                  </View> */}
                  {/* <CustomText style={styles.label}>Payment Type:</CustomText> */}
                  <TabNavigator
                    border={true}
                    text={
                      props.label ? props.label : 'Tap here to select option'
                    }
                    color={props.label ? 'black' : 'black'}
                    fontSize={wp(4)}
                    textWidth={'90%'}
                    backgroundColor={props.label ? 'white' : 'white'}
                    width={'90%'}
                    onPress={() => {
                      console.log('asdjkhasdg');
                      props.onNavigatorPress();
                    }}
                  />
                  {/* <View style={{marginVertical: wp(3)}} /> */}
                  <View
                    style={{
                      width: wp(77),
                      borderColor: 'lightgrey',
                      borderWidth: wp(0.125),
                      alignSelf: 'center',
                    }}
                  />
                  {/* <CustomText style={styles.label}>Consumer Number</CustomText> */}
                  <View style={{height: wp(2)}} />
                  <CustomTextField
                    textHeading={props.text_input ? 'Mobile Number' : null}
                    width={'90%'}
                    borderColor={Colors.lightGrey}
                    placeholder={'Mobile Number'}
                    maxLength={11}
                    text_input={props.text_input}
                    keyboardType="number-pad"
                    onChangeText={(value) => {
                      // props.phoneNumber
                      //   ?
                      props.onChangeText(String(value).replace(/[^0-9]/g, ''));
                      // : props.onChangeText(value);
                    }}
                  />
                  <View style={{marginVertical: wp(3)}} />
                  <CustomBtn
                    btn_width={'90%'}
                    backgroundColor={Colors.primary_green}
                    btn_txt={'Continue'}
                    fontSize={wp(4.8)}
                    onPress={() => props.onPress()}
                  />
                  <View style={{marginVertical: wp(3)}} />
                </ScrollView>
              </KeyboardAvoidingView>
            ) : props.fingerPrintScanner ? (
              <View>
                <View style={styles.imagePrint}>
                  <Image
                    source={require('../../Assets/btn_finger_normal.png')}
                    style={[globalStyling.image, {backgroundColor: 'grey'}]}
                    resizeMode="contain"
                  />
                </View>
                <CustomText style={styles.alert}>{props.alert_text}</CustomText>
                <View style={styles.seperator} />
                <View>
                  <CustomBtn
                    btn_txt={'Cancel'}
                    backgroundColor={Colors.primary_green}
                    btn_width={wp(30)}
                    onPress={() => props.onPressCancel()}
                  />
                </View>
              </View>
            ) : props.defaultAlert ? (
              <View>
                <CustomText
                  style={{
                    fontSize: wp(4.5),
                    padding: wp(3),
                    textAlign: 'left',
                  }}>
                  {props.alert_text}
                </CustomText>
                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'flex-end',
                    alignItems: 'center',
                    padding: wp(2),
                  }}>
                  <CustomText
                    style={styles.defaultAlertText}
                    onPress={() => props.onPressNo()}>
                    NO
                  </CustomText>
                  <CustomText
                    style={styles.defaultAlertText}
                    onPress={() => {
                      props.onPressYes();
                    }}>
                    YES
                  </CustomText>
                </View>
              </View>
            ) : props.nationalBankAccountNumberPolicy ? (
              <View>
                {/* <View style={{width: '100%'}}>
                  <AntDesign
                    name={'closecircle'}
                    color={Colors.themeGrey}
                    size={wp(7)}
                    style={{alignSelf: 'flex-end'}}
                    onPress={() => {
                      props.onPressCancel();
                    }}
                  />
                </View> */}
                <Image
                  source={Images.alertIconGreen}
                  style={{
                    width: wp(15),
                    height: wp(15),
                    alignSelf: 'center',
                    paddingVertical: wp(5),
                  }}
                />
                <CustomText
                  style={[
                    globalStyling.textFontBold,
                    {
                      fontSize: wp(4),
                      textAlign: 'center',
                      paddingVertical: wp(5),
                    },
                  ]}>
                  {props.title}
                </CustomText>

                <View style={styles.imageView}>
                  <Image
                    source={require('../../Assets/image_cheque_book.png')}
                    style={styles.image}
                    resizeMode="stretch"
                  />
                </View>
                {/* <CustomText style={styles.note}>
                  Please enter 14 digits account number BBBBAAAAAAAAAA where
                  BBBB=Branch code & AAAAAAAAAA= Account Number
                </CustomText> */}
                <View style={{height: wp(4)}} />
                <CustomBtn
                  btn_txt={'OK'}
                  onPress={() => props.onPressCancel()}
                  btn_width={wp(85)}
                  backgroundColor={Colors.primary_green}
                />
              </View>
            ) : props.nationalBankIBANPolicy ? (
              <View>
                <View style={{width: '100%'}}></View>
                <Image
                  source={Images.successAlert}
                  style={{
                    width: wp(15),
                    height: wp(15),
                    alignSelf: 'center',
                    paddingVertical: wp(5),
                  }}
                />

                <CustomText
                  style={[
                    globalStyling.textFontBold,
                    {
                      fontSize: wp(4),
                      textAlign: 'center',
                      paddingVertical: wp(5),
                    },
                  ]}>
                  {props.title}
                </CustomText>
                <View style={styles.imageView}>
                  <Image
                    source={Images.checkIBAN}
                    style={styles.image}
                    resizeMode="stretch"
                  />
                </View>
                {/* <CustomText style={styles.note}>
                  Please enter 24 digits IBAN PKXX-NBPA-BBBB-XXXX-XXXX-XXXX
                  where BBBB=Branch code & AAAAAAAAAA= Account Number
                </CustomText> */}
                {/* <View style={styles.seperator} /> */}
                <View style={{height: wp(4)}} />

                <CustomBtn
                  btn_txt={'OK'}
                  onPress={() => props.onPressCancel()}
                  btn_width={wp(85)}
                  backgroundColor={Colors.primary_green}
                />
              </View>
            ) : (
              <View>
                {/* {props.title ? null : (
                  <View>
                    <Icon
                      name={'alert-outline'}
                      size={55}
                      style={{alignSelf: 'center'}}
                      color={Colors.alet_icon}
                    />
                    <View style={styles.gap}></View>
                  </View>
                )} */}

                <CustomText
                  style={[
                    styles.alert_text,
                    {
                      textAlign: 'center',
                    },
                  ]}>
                  {props.alert_text}
                </CustomText>
                <View style={styles.gap}></View>
                {props?.bvsCheck ? (
                  <View style={{flexDirection: 'row', alignSelf: 'center'}}>
                    <TouchableOpacity
                      style={{flexDirection: 'row', justifyContent: 'center'}}
                      onPress={() => {
                        props?.onCheckBoxPress();
                      }}>
                      {props?.isBvs ? (
                        <FontAwsome
                          name={'check-square'}
                          size={wp(6)}
                          color={Colors.primary_green}
                        />
                      ) : (
                        <Material
                          name={'checkbox-blank-outline'}
                          size={wp(6)}
                          color={Colors.grey}
                        />
                      )}
                      <CustomText> I accept the</CustomText>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => props?.onTermPress()}>
                      <CustomText
                        style={{
                          alignSelf: 'center',
                          color: Colors.primary_green,
                        }}>
                        {` `}Terms & Conditions
                      </CustomText>
                    </TouchableOpacity>
                    <View style={{height: hp(1.3)}}></View>
                  </View>
                ) : null}
                <View style={{flexDirection: 'row', alignSelf: 'center'}}>
                  {props.iscancelbtn ? (
                    <>
                      <CustomBtn
                        btn_txt={'Cancel'}
                        onPress={() => {
                          props.onPressCancel();
                        }}
                        btn_width={screenWidth / 3.5}
                        backgroundColor={Colors.grey}
                      />
                      <View style={{width: 20}}></View>
                    </>
                  ) : null}
                  {props.yesNoButtons ? (
                    <View
                      style={{
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'space-around',
                        width: '80%',
                      }}>
                      <CustomBtn
                        btn_txt={I18n['Yes']}
                        onPress={() => {
                          props.onPressYes();
                        }}
                        // btn_width={width / 3.5}
                        btn_width={wp(70)}
                        backgroundColor={Colors.primary_green}
                      />
                      <View style={{height: wp(2)}}></View>
                      <CustomBtn
                        btn_txt={'No'}
                        onPress={() => {
                          props.onPressNo();
                        }}
                        btn_width={wp(70)}
                        color={Colors.blackColor}
                        backgroundColor={Colors.lightGrey}
                      />
                    </View>
                  ) : (
                    <CustomBtn
                      btn_txt={'Ok'}
                      onPress={() => {
                        props.onPressOkay();
                      }}
                      btn_width={wp(50)}
                      backgroundColor={Colors.primary_green}
                    />
                  )}
                </View>
              </View>
            )}
          </View>
        </View>
      </Modal>
    )
  );
};

export default CustomAlert;
