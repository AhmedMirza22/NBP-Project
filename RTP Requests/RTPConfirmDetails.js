import React, {useState, useRef, useEffect, useContext} from 'react';
import {
  View,
  Platform,
  ScrollView,
  KeyboardAvoidingView,
  TouchableOpacity,
} from 'react-native';
import SubHeader from '../../Components/GlobalHeader/SubHeader/SubHeader';
import CustomTextField from '../../Components/CustomTextField/CustomTextField';
import CustomBtn from '../../Components/Custom_btn/Custom_btn';
import CustomAlert from '../../Components/Custom_Alert/CustomAlert';
import CustomText from '../../Components/CustomText/CustomText';
import styles from './RTPRequestStyling';
import {Colors} from '../../Theme';
import i18n from '../../Config/Language/LocalizeLanguageString';
import {
  currencyFormat,
  globalStyling,
  hp,
  validateOnlyNumberInput,
  wp,
} from '../../Constant';
import analytics from '@react-native-firebase/analytics';

import {useSelector, useDispatch} from 'react-redux';
import {postTokenCall, Service} from '../../Config/Service';
import moment from 'moment';
import {Keyboard} from 'react-native';
import {isRtlState} from '../../Config/Language/LanguagesArray';
import {logs} from '../../Config/Config';
import CustomModal from '../../Components/CustomModal/CustomModal';
import Octicons from 'react-native-vector-icons/Octicons';
import {
  setLoader,
  updateSessionToken,
  serviceResponseCheck,
  catchError,
  changeGlobalIconAlertState,
} from '../../Redux/Action/Action';
import SuccessModal from '../../Components/SuccessModal/SuccessModal';
import {useNotification} from '../Context';
export default function RTPConfirmDetails(props) {
  const {nullifyObject} = useNotification();

  const ref1 = useRef();
  const ref2 = useRef();
  const ref3 = useRef();
  const [showAlertState, changeAlertState] = useState(false);
  const [showAlertStateReject, changeAlertStateReject] = useState(false);

  const [currentModal, changeCurrentModal] = useState('');
  const [comment, setComment] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [email, setEmail] = useState('');
  const [timerDays, setTimerDays] = useState('----:--:-:--:-:--:-:--');
  const [timerDetails, setTimerDetails] = useState('');
  const [successModalState, setSuccessModalState] = useState(false);
  const [hideButtons, setHideButtons] = useState(false);

  const myAccounts = useSelector((state) => state.reducers.viewAccountsData);
  const dispatch = useDispatch();

  logs.log('props?.route?.params', props?.route?.params);
  useEffect(() => {
    async function analyticsLog() {
      await analytics().logEvent('RTPConfirmationScreen');
    }
    analyticsLog();
  }, []);

  const RTP_DATA = props?.route?.params?.payLater
    ? props?.route?.params?.payLater
    : props?.route?.params?.payNow;
  const [rtpPayNow, setRtpPayNow] = useState(() => ({
    ...RTP_DATA,
    customerEmail: email,
    customerMobile: phoneNumber,
  }));
  const currentDate = new Date();

  const year = currentDate.getFullYear();
  const month = String(currentDate.getMonth() + 1).padStart(2, '0');
  const day = String(currentDate.getDate()).padStart(2, '0');
  const hours = currentDate.getHours();
  const minutes = currentDate.getMinutes();
  const seconds = currentDate.getSeconds();

  // Formatting hours, minutes, and seconds to ensure they are always two digits
  const formattedHours = hours < 10 ? `0${hours}` : hours;
  const formattedMinutes = minutes < 10 ? `0${minutes}` : minutes;
  const formattedSeconds = seconds < 10 ? `0${seconds}` : seconds;

  // Combining formatted time components
  const currentTime = `${formattedHours}${formattedMinutes}${formattedSeconds}`; // Fetching current time

  const formattedDate = `${year}${month}${day}${currentTime}`;
  // const totalSeconds =
  useEffect(() => {
    props.navigation.addListener('focus', () => {
      RTP_DATA?.rtpExpiryDateTime < formattedDate ? setHideButtons(true) : null;
      // RTP_DATA?.
      nullifyObject();
      logs.log('RTP_DATA=======>2', RTP_DATA?.status);
      logs.log('myAccounts=======>2', myAccounts);
      logs.log('currentTime=======>currentTime', currentTime);
      logs.log(
        'RTP_DATA?.rtpExpiryDateTime=======>RTP_DATA?.rtpExpiryDateTime',
        RTP_DATA?.rtpExpiryDateTime,
      );
      logs.log('formattedDate=======>formattedDate', formattedDate);

      if (props.route.params?.data?.benefEmail) {
        setEmail(props.route.params?.data?.benefEmail);
      }
      if (props.route.params?.data?.benefMobile) {
        setPhoneNumber(props.route.params?.data?.benefMobile);
      }
    });
  }, []);

  useEffect(() => {
    setTimeout(() => {
      if (RTP_DATA?.rtpExpiryDateTime) {
        props?.route?.params?.payNow
          ? startCountdown(
              calculateSecondsBetweenDates(
                RTP_DATA?.rtpExpiryDateTime,
                formattedDate,
              ),
            )
          : startCountdown(
              calculateSecondsBetweenDates(
                RTP_DATA?.rtpExpiryDateTime.slice(0, 8),
                formattedDate.slice(0, 8),
              ),
            );
        // logs.log(
        //   'RTP_DATA?.rtpExpiryDateTime.slice(0,8)',
        //   RTP_DATA?.rtpExpiryDateTime.slice(0, 8),
        // );
        logs.log('formattedDate.slice(0,8)', formattedDate.slice(0, 8));
      }
    }, 1000);
  }, []);

  const calculateSecondsBetweenDates = (dateString1, dateString2) => {
    // Parsing date components from the date strings
    const year1 = dateString1.slice(0, 4);
    const month1 = dateString1.slice(4, 6) - 1; // Subtracting 1 since months are 0-indexed in JavaScript
    const day1 = dateString1.slice(6, 8);
    const hour1 = dateString1.slice(8, 10);
    const minute1 = dateString1.slice(10, 12);
    const second1 = dateString1.slice(12, 14);

    const year2 = dateString2.slice(0, 4);
    const month2 = dateString2.slice(4, 6) - 1;
    const day2 = dateString2.slice(6, 8);
    const hour2 = dateString2.slice(8, 10);
    const minute2 = dateString2.slice(10, 12);
    const second2 = dateString2.slice(12, 14);

    // Constructing Date objects
    const date1 = props?.route?.params?.payNow
      ? new Date(year1, month1, day1, hour1, minute1, second1)
      : new Date(year1, month1, day1);
    const date2 = props?.route?.params?.payNow
      ? new Date(year2, month2, day2, hour2, minute2, second2)
      : new Date(year2, month2, day2);

    // Calculating the difference in seconds
    const differenceInSeconds = Math.abs((date2 - date1) / 1000);

    return differenceInSeconds;
  };

  const convertSecondsToTime = (seconds) => {
    if (isNaN(seconds) || seconds < 0) {
      return {
        days: 0,
        hours: 0,
        minutes: 0,
        seconds: 0,
      };
    }

    const days = Math?.floor(seconds / (3600 * 24));
    const hours = Math?.floor((seconds % (3600 * 24)) / 3600);
    const minutes = Math?.floor((seconds % 3600) / 60);
    const remainingSeconds = seconds % 60;

    return {
      days: days,
      hours: hours,
      minutes: minutes,
      seconds: remainingSeconds,
    };
  };

  const startCountdown = (totalSeconds) => {
    logs.log('totalSeconds...', totalSeconds);
    const intervalId = setInterval(() => {
      // console.clear();

      const formattedTime = convertSecondsToTime(totalSeconds - 1); // Subtract 1 second
      logs.log('formattedTime...', formattedTime);

      setTimeout(() => {
        if (totalSeconds <= 0) {
          setTimerDetails(`0 H : 0 M : 0 S`);
          clearInterval(intervalId);
        } else {
          if (formattedTime?.days >= 1) {
            setTimerDays(formattedTime?.days);
            setTimerDetails('');
          } else {
            setTimerDays('');
            setTimerDetails(
              `${formattedTime?.hours} H : ${formattedTime?.minutes} M : ${formattedTime?.seconds} S`,
            );
          }
          totalSeconds--;
        }
      }, 500);
    }, 1000);
  };

  const rtpRejected = async () => {
    try {
      dispatch(setLoader(true));
      const response = await postTokenCall(Service.requestRejected, {
        rtpId: RTP_DATA?.rtpId,
        rtpStatus: '2',
        rejectReason: comment,
      });
      logs.logResponse(response);
      if (response?.data?.responseCode === '00') {
        dispatch(updateSessionToken(response));
        logs.log('Response=============== Rejected', response?.data?.data);
        // props.navigation.navigate('PaymentResponse', {
        //   data: response.data.data,
        // });
        const dataObject = response?.data?.data?.transactionDetails;
        const dateString = String(`${dataObject?.date} ${dataObject?.time}`);
        dispatch(setLoader(false));
        // setSuccessModalState(true);
        dispatch(
          changeGlobalIconAlertState(true, props.navigation, {
            message: 'Request to Pay Rejected successfully',
            removeAlert: true,
            onPressOk: () => {
              changeGlobalIconAlertState(false);
              props.navigation.navigate('Home');
            },
          }),
        );

        logs.log('Api Integrated Successfully.....', response?.data);
      } else {
        // setMpin('');
        logs.log('requestAcceptance Api Integration failed...');
        // dispatch(
        //   changeGlobalIconAlertState(false, props.navigation, {
        //     removeAlert: false,
        //     successAlert: true,
        //   }),
        // );
        // setSuccessModalState(true);
        dispatch(setLoader(false));
        dispatch(serviceResponseCheck(response, props.navigation, true));
        // props?.navigation.dispatch(
        //   CommonActions.reset({
        //     index: 0,
        //     routes: [{name: 'Home'}],
        //   }),
        // );
      }
    } catch (error) {
      dispatch(catchError(error));
    }
  };
  logs.log(RTP_DATA?.rtpExpiryDateTime, 'RTP_DATA?.rtpExpiryDateTime');
  logs.log(formattedDate, 'formattedDate');
  return (
    <View style={[styles.container, {backgroundColor: Colors.backgroundColor}]}>
      <SubHeader
        navigation={props.navigation}
        title={'Request to Pay'}
        description={'Make Payments in just few steps'}
        navigateHome={true}
      />
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={globalStyling.scrollContent}>
        <View style={styles.container}>
          <View style={{marginTop: hp(5), alignItems: 'center'}}>
            <Octicons
              name={'clock'}
              size={wp(10)}
              color={Colors.primary_green}
            />

            {RTP_DATA?.rtpExpiryDateTime > formattedDate ? (
              <CustomText
                boldFont={true}
                style={{
                  left: wp(1),
                  fontSize: wp(6.5),
                  color: Colors.primary_green,
                }}>
                {timerDetails
                  ? timerDetails
                  : null || timerDays
                  ? `${timerDays} Days`
                  : null}
              </CustomText>
            ) : // <CustomText
            //   boldFont={true}
            //   style={{
            //     left: wp(1),
            //     fontSize: wp(6.5),
            //     color: Colors.primary_green,
            //   }}>
            //   {timerDetails
            //     ? timerDetails
            //     : null || timerDays
            //     ? timerDays === 1
            //       ? `${timerDays} Day`
            //       : `${timerDays} Days`
            //     : null}
            // </CustomText>
            props.route?.params?.payLater ? (
              RTP_DATA?.rtpExpiryDateTime?.slice(0, 8) ===
              formattedDate?.slice(0, 8) ? (
                <CustomText
                  boldFont={true}
                  style={{
                    left: wp(1),
                    fontSize: wp(6.5),
                    color: Colors.primary_green,
                  }}>
                  0 Days
                </CustomText>
              ) : (
                <CustomText
                  boldFont={true}
                  style={{
                    left: wp(1),
                    fontSize: wp(6.5),
                    color: '#ff4d72',
                  }}>
                  Expired
                </CustomText>
              )
            ) : (
              <CustomText
                boldFont={true}
                style={{
                  left: wp(1),
                  fontSize: wp(6.5),
                  color: '#ff4d72',
                }}>
                Expired
              </CustomText>
            )}
            {RTP_DATA?.rtpExpiryDateTime > formattedDate ? (
              <CustomText
                boldFont={true}
                style={{left: wp(1), fontSize: wp(4.5), color: '#9ea3a6'}}>
                Time Remaining
              </CustomText>
            ) : null}
          </View>
          <View
            style={{
              alignSelf: 'center',
              justifyContent: 'flex-start',
              borderRadius: 10,
              width: wp(90),
              marginTop: wp(6),
              padding: wp(2),
              backgroundColor: Colors.subContainer,
            }}>
            <View style={{padding: wp(1)}}>
              <CustomText
                boldFont={true}
                style={{left: wp(1), fontSize: wp(4.5), color: '#9ea3a6'}}>
                From
              </CustomText>
            </View>
            <View
              style={{
                backgroundColor: Colors.childContainer,
                width: wp(80),
                alignSelf: 'center',
                borderRadius: wp(1.5),
                // borderWidth: 1,
                padding: wp(4),
                // borderColor: Colors.borderColor,
              }}>
              <CustomText
                style={{
                  padding: wp(1),
                  color: '#9ea3a6',
                  textAlign: isRtlState() ? 'left' : 'right',
                }}>
                Account Number
              </CustomText>
              <CustomText
                boldFont={true}
                style={{
                  padding: wp(1),
                  fontSize: wp(4.45),
                  textAlign: isRtlState() ? 'left' : 'right',
                }}>
                {RTP_DATA?.senderIban}
              </CustomText>
            </View>
            <View style={{height: wp(4)}} />
            <View style={{padding: wp(1)}}>
              <CustomText
                style={{left: wp(1), fontSize: wp(4.5), color: '#9ea3a6'}}
                boldFont={true}>
                To
              </CustomText>
            </View>
            <View
              style={{
                backgroundColor: Colors.childContainer,
                width: wp(80),
                alignSelf: 'center',
                borderRadius: wp(1.5),
                // borderWidth: 1,
                padding: wp(4),
                // borderColor: Colors.borderColor,
              }}>
              <CustomText
                style={{
                  padding: wp(1),
                  color: '#9ea3a6',
                  textAlign: isRtlState() ? 'left' : 'right',
                }}>
                Merchant Name
              </CustomText>
              <CustomText
                boldFont={true}
                style={{
                  fontSize: wp(5),
                  padding: wp(1),
                  textAlign: isRtlState() ? 'left' : 'right',
                }}>
                {RTP_DATA?.merchantDba}
              </CustomText>
              <View style={{height: wp(1)}} />
              <CustomText
                style={{
                  padding: wp(1),
                  color: '#9ea3a6',
                  textAlign: isRtlState() ? 'left' : 'right',
                }}>
                Merchant Account
              </CustomText>
              <CustomText
                boldFont={true}
                style={{
                  padding: wp(1),
                  fontSize: wp(4.45),
                  textAlign: isRtlState() ? 'left' : 'right',
                }}>
                {RTP_DATA?.merchantIban}
              </CustomText>
              <View style={{height: wp(1)}} />
              <CustomText
                style={{
                  padding: wp(1),
                  color: '#9ea3a6',
                  textAlign: isRtlState() ? 'left' : 'right',
                }}>
                RTP Valid Till
              </CustomText>
              <CustomText
                boldFont={true}
                style={{
                  padding: wp(1),
                  fontSize: wp(4.45),
                  textAlign: isRtlState() ? 'left' : 'right',
                }}>
                {props?.route?.params?.payNow
                  ? moment(
                      RTP_DATA?.rtpExpiryDateTime,
                      'YYYYMMDDHHmmss',
                    ).format('DD-MMM-YYYY | h:mm:ss')
                  : moment(
                      RTP_DATA?.rtpExpiryDateTime,
                      'YYYYMMDDHHmmss',
                    ).format('DD-MMM-YYYY')}
              </CustomText>
              {RTP_DATA?.amountAfterDueDate ? (
                <>
                  <CustomText
                    style={{
                      padding: wp(1),
                      color: '#9ea3a6',
                      textAlign: isRtlState() ? 'left' : 'right',
                    }}>
                    Due Date
                  </CustomText>
                  <CustomText
                    boldFont={true}
                    style={{
                      padding: wp(1),
                      fontSize: wp(4.45),
                      textAlign: isRtlState() ? 'left' : 'right',
                    }}>
                    {moment(
                      RTP_DATA?.rtpExecutionDateTime,
                      'YYYYMMDDHHmmss',
                    ).format('DD-MMM-YYYY')}
                    {/* {RTP_DATA?.rtpExecutionDateTime} */}
                  </CustomText>
                </>
              ) : null}
              {RTP_DATA?.amountAfterDueDate ? (
                <>
                  {logs.log(
                    'RTP_DATA?.amountAfterDueDate',
                    RTP_DATA?.amountAfterDueDate,
                  )}
                  <CustomText
                    style={{
                      padding: wp(1),
                      color: '#9ea3a6',
                      textAlign: isRtlState() ? 'left' : 'right',
                    }}>
                    Amount After Due Date
                  </CustomText>
                  <CustomText
                    boldFont={true}
                    style={{
                      padding: wp(1),
                      fontSize: wp(4.45),
                      textAlign: isRtlState() ? 'left' : 'right',
                    }}>
                    {RTP_DATA?.amountAfterDueDate}
                  </CustomText>
                </>
              ) : null}

              <CustomText
                style={{
                  padding: wp(1),
                  color: '#9ea3a6',
                  textAlign: isRtlState() ? 'left' : 'right',
                }}>
                Status
              </CustomText>
              {/* {billObject.billStatus == 'Paid' ? (
                <CustomText
                  boldFont={true}
                  style={{
                    padding: wp(1),
                    fontSize: wp(4.75),
                    color: '#33ad74',
                    textAlign: isRtlState() ? 'left' : 'right',
                  }}>
                  Paid
                </CustomText>
              ) : ( */}
              <CustomText
                boldFont={true}
                style={{
                  padding: wp(1),
                  fontSize: wp(4.75),
                  color: '#ff4d72',
                  textAlign: isRtlState() ? 'left' : 'right',
                }}>
                {RTP_DATA?.status === 'Rejected' ? 'Rejected' : 'Unpaid'}
              </CustomText>
              {/* )} */}
            </View>
            <View style={{height: wp(5)}} />
            <View
              style={{
                flexDirection: isRtlState() ? 'row' : 'row-reverse',
                backgroundColor: Colors.childContainer,
                width: wp(80),
                alignSelf: 'center',
                borderRadius: wp(1.5),
                justifyContent: 'space-between',
                // borderWidth: 1,
                padding: wp(4),
                // borderColor: Colors.borderColor,
              }}>
              <CustomText style={{alignSelf: 'center', color: '#9ea3a6'}}>
                Amount
              </CustomText>
              {RTP_DATA?.amountAfterDueDate ? (
                <>
                  <CustomText boldFont={true} style={{fontSize: wp(5)}}>
                    {RTP_DATA?.rtpExpiryDateTime.slice(0, 8) ===
                    formattedDate.slice(0, 8)
                      ? currencyFormat(Number(RTP_DATA.amount))
                      : RTP_DATA?.rtpExpiryDateTime > formattedDate
                      ? currencyFormat(Number(RTP_DATA.amount))
                      : currencyFormat(Number(RTP_DATA?.amountAfterDueDate))}
                  </CustomText>
                </>
              ) : (
                <CustomText boldFont={true} style={{fontSize: wp(5)}}>
                  {currencyFormat(Number(RTP_DATA?.amount))}
                </CustomText>
              )}
            </View>
          </View>
          <View style={styles.marginVertical}>
            <CustomTextField
              accessibilityLabel="Enter Address"
              ref={ref1}
              text_input={comment}
              placeholder={'Address (Optional)'}
              Textfield_label={''}
              onChangeText={(value) => {
                setComment(value);
              }}
              onSubmitEditing={() => {
                ref2.current.focus();
              }}
              returnKeyType={'next'}
              width={'90%'}
              maxLength={50}
              backgroundColor={Colors.whiteColor}
            />
          </View>
          <View style={styles.marginVertical}>
            <CustomTextField
              accessibilityLabel="Enter Phone number"
              ref={ref2}
              placeholder={'Phone (Optional)'}
              Textfield_label={''}
              text_input={phoneNumber}
              keyboardType={'numeric'}
              onChangeText={(value) => {
                setPhoneNumber(
                  validateOnlyNumberInput(String(value).replace(/[^0-9]/g, '')),
                );
              }}
              onSubmitEditing={() => {
                ref3.current.focus();
              }}
              returnKeyType={Platform.OS === 'ios' ? 'done' : 'next'}
              width={'90%'}
              maxLength={11}
              backgroundColor={Colors.whiteColor}
            />
          </View>
          <View style={styles.marginVertical}>
            <CustomTextField
              accessibilityLabel={email}
              ref={ref3}
              text_input={email}
              placeholder={'Email (Optional)'}
              Textfield_label={''}
              maxLength={50}
              onChangeText={(value) => {
                setEmail(value);
              }}
              width={'90%'}
              keyboardType={'email-address'}
              backgroundColor={Colors.whiteColor}
            />
          </View>
        </View>
        <CustomAlert
          overlay_state={showAlertState}
          yesNoButtons={true}
          title={showAlertStateReject ? 'Request To Reject' : 'Request To Pay'}
          alert_text={
            showAlertStateReject
              ? i18n['Do you want to reject the transaction.']
              : i18n['Do you want to proceed with the transaction.']
          }
          onPressYes={() => {
            changeAlertState(false);
            changeAlertStateReject(false);
            showAlertStateReject
              ? rtpRejected()
              : setTimeout(() => {
                  currentModal === 'payNow'
                    ? props.navigation.navigate('RTPMPIN', {
                        payNowdata: rtpPayNow,
                      })
                    : props.navigation.navigate('RTPMPIN', {
                        payLaterdata: rtpPayNow,
                      });
                }, 500);
          }}
          onPressCancel={() => {
            changeAlertState(false);
            changeAlertStateReject(false);
          }}
          onPressNo={() => {
            changeAlertState(false);
            changeAlertStateReject(false);
          }}
        />
        {RTP_DATA?.status == 'Rejected' ? null : (
          <View
            keyboardVerticalOffset={hp(7)}
            behavior={'padding'}
            style={globalStyling.buttonContainer}>
            {hideButtons === true ? null : (
              <View>
                <View style={{marginTop: wp(4)}}>
                  {RTP_DATA?.rtpExpiryDateTime > formattedDate ? (
                    <CustomBtn
                      btn_txt={'Pay Now'}
                      accessibilityLabel="Tap to Proceed"
                      onPress={() => {
                        Keyboard.dismiss();
                        setTimeout(() => {
                          changeAlertState(true);
                        }, 500);

                        props?.route?.params?.payNow
                          ? changeCurrentModal('payNow')
                          : changeCurrentModal('payLater');
                      }}
                      btn_width={wp(90)}
                      backgroundColor={Colors.primary_green}
                    />
                  ) : null}
                </View>
                {props?.route?.params?.payLater ? (
                  <View style={{marginTop: wp(3)}}>
                    <CustomBtn
                      btn_txt={'Pay Later'}
                      accessibilityLabel="Tap to Proceed"
                      onPress={() => {
                        Keyboard.dismiss();

                        props.navigation.navigate('Home');
                      }}
                      btn_width={wp(90)}
                      backgroundColor={Colors.primary_green}
                    />
                  </View>
                ) : null}
                <View style={{marginTop: wp(3)}}>
                  {RTP_DATA?.rtpExpiryDateTime > formattedDate ? (
                    <CustomBtn
                      btn_txt={'Reject'}
                      accessibilityLabel="Tap to Proceed"
                      onPress={() => {
                        Keyboard.dismiss();
                        logs.log(
                          `props.route.params?.data : ${props.route.params?.data}`,
                        );
                        changeAlertState(true);
                        changeAlertStateReject(true);

                        // rtpRejected();
                        // props.navigation.navigate('Home');
                        //   if (props.route.params?.data?.merchant) {
                        //     props.navigation.navigate('MerchantPaymentMPIN', {
                        //       data: {paymentCallData: passObject},
                        //     });
                        //   } else {
                        //     if (check_email(email) || email == '') {
                        //       if (
                        //         !props.route.params?.data?.isDirectPayment ||
                        //         isCertainBeneficiaryFlow
                        //       ) {
                        //         changeAlertState(true);
                        //       } else {
                        //         utilityDirectPay();
                        //       }
                        //       // if (props.route.params?.data?.isDirectPayment) {
                        //       //   utilityDirectPay();
                        //       // } else {
                        //       //   changeAlertState(true);
                        //       // }
                        //     } else {
                        //       dispatch(setAppAlert(Message.invalidEmail));
                        //     }
                        //   }
                      }}
                      btn_width={wp(90)}
                      backgroundColor={Colors.themeGrey}
                      color={Colors.blackColor}
                    />
                  ) : null}
                </View>
              </View>
            )}
          </View>
        )}

        {/* <SuccessModal
          visible={successModalState}
          message={'Request Acceptance Successfull'}
          // secondMessage={'Request Acceptance Successfull'}
          onPress_yes={() => {
            setSuccessModalState(false);
            props.navigation.navigate('Home');
          }}
        /> */}
      </ScrollView>
    </View>
  );
}
