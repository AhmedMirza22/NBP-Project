import React, {useState, useEffect, useContext} from 'react';
import {View, TouchableOpacity, FlatList, Image} from 'react-native';
import {useDispatch} from 'react-redux';
import {
  setCurrentFlow,
  changeGlobalTransferAlertState,
  closeGlobalTransferAlert,
} from '../../Redux/Action/Action';
import {wp, hp, currencyFormat} from '../../Constant';
import {Colors} from '../../Theme';
import CustomText from '../../Components/CustomText/CustomText';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Ionicons from 'react-native-vector-icons/Ionicons';
import styles from './RTPRequestStyling';
import SubHeader from '../../Components/GlobalHeader/SubHeader/SubHeader';
import {
  catchError,
  serviceResponseCheck,
  setLoader,
  setLoginResponse,
  setUserObject,
  updateSessionToken,
} from '../../Redux/Action/Action';
import analytics from '@react-native-firebase/analytics';

import {getTokenCall, Service} from '../../Config/Service';
import {logs} from '../../Config/Config';
import store from '../../Redux/Store/Store';
import moment from 'moment';
import {useTheme} from '../../Theme/ThemeManager';
// import {NotificationScreen} from '../../Context';
// import {NotificationScreen} from '../Context/index';

const RTPRequest = (props) => {
  useEffect(() => {
    async function analyticsLog() {
      await analytics().logEvent('RTPRequest');
    }
    analyticsLog();
  }, []);

  const {activeTheme} = useTheme();
  // const {notificationScreen, setNotificationState} =
  //   useContext(NotificationScreen);

  const [activeTab, setActiveTab] = useState(1);
  const [rtpData, setRtpData] = useState([]);
  const [rtpActiveData, setRtpActiveData] = useState([]);
  const [rtpPaidData, setRtpPaidData] = useState([]);
  const [rtpRejectedData, setRtpRejectedData] = useState([]);

  const [isLoader, setIsLoader] = useState(false);
  const [rtpcurrentPage1, setRtpCurrentPage1] = useState(0);
  const [rtptotalSize, setRtpTotalSize] = useState(0);

  useEffect(() => {
    getRTPNotifications(store.getState().reducers.token);
  }, [rtpcurrentPage1]);

  // useEffect(() => {
  //   setTimeout(() => {
  //     getRTPNotifications(store.getState().reducers.token);
  //   }, 500);
  // }, []);

  const rtpLoadMoreDataNotification = () => {
    if (rtpcurrentPage1 < rtptotalSize) {
      setRtpCurrentPage1(rtpcurrentPage1 + 1);
    }
  };

  const dispatch = useDispatch();

  const getRTPNotifications = async (token) => {
    try {
      // setIsLoader(true);
      dispatch(setLoader(true));

      const response = await getTokenCall(
        Service.getNotifications,
        `page=${rtpcurrentPage1}&size=20&type=rtp_request&filterByStatus=${true}`,
        token,
      );
      // logs.log('response---->', response);
      const responseData = response.data;
      if (
        response.data.responseCode === '00' ||
        response.data.responseCode === '200'
      ) {
        dispatch(updateSessionToken(response));
        setIsLoader(true);

        dispatch(setLoader(false));
        let tempData = rtpData.concat(response?.data?.data?.notifications); // logs.logResponse('tempData Response========', tempData);
        setRtpTotalSize(response?.data?.data?.totalPages);
        filteringData(tempData);
        // setRtpData(tempData);
      } else {
        dispatch(serviceResponseCheck(response, props.navigation));
        setIsLoader(false);
        dispatch(setLoader(false));
      }
    } catch (error) {
      setIsLoader(false);
      dispatch(setLoader(false));
      // logs.log(`screen crash error : ${JSON.stringify(error)}`);
      dispatch(catchError(error));
    }
  };

  const tabs = () => {
    return (
      <View style={{flexDirection: 'row', justifyContent: 'space-evenly'}}>
        <TouchableOpacity
          onPress={() => {
            setActiveTab(1);
          }}
          style={{
            height: hp(5),
            width: wp(30),
            backgroundColor:
              activeTab === 1 ? Colors.primary_green : Colors.themeGrey,
            justifyContent: 'center',
            alignItems: 'center',
            borderRadius: wp(5),
          }}>
          <CustomText
            style={{
              color: activeTab === 1 ? Colors.whiteColor : Colors.blackColor,
            }}
            onPress={() => {
              setActiveTab(1);
            }}>
            Active
          </CustomText>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => {
            setActiveTab(2);
          }}
          style={{
            height: hp(5),
            width: wp(30),
            backgroundColor:
              activeTab === 2 ? Colors.primary_green : Colors.themeGrey,
            justifyContent: 'center',
            alignItems: 'center',
            borderRadius: wp(5),
          }}>
          <CustomText
            style={{
              color: activeTab === 2 ? Colors.whiteColor : Colors.blackColor,
            }}
            onPress={() => {
              setActiveTab(2);
            }}>
            Paid
          </CustomText>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => {
            setActiveTab(3);
          }}
          style={{
            height: hp(5),
            width: wp(30),
            backgroundColor:
              activeTab === 3 ? Colors.primary_green : Colors.themeGrey,
            justifyContent: 'center',
            alignItems: 'center',
            borderRadius: wp(5),
          }}>
          <CustomText
            style={{
              color: activeTab === 3 ? Colors.whiteColor : Colors.blackColor,
              fontSize: wp(3),
            }}
            onPress={() => {
              setActiveTab(3);
            }}>
            Expired/Rejected
          </CustomText>
        </TouchableOpacity>
      </View>
    );
  };

  const active_details = ({item}) => {
    // logs.log('ITEM---------', item);
    const payNowData = item?.additionalData;
    // logs.log('payNowData?---------', payNowData);

    const fee = parseFloat('1');
    const amount = parseFloat(`${payNowData?.amountInfo?.instructedAmount}`);
    const formattedFee = fee.toFixed(2);
    const formattedAmount = amount.toFixed(2);
    const inputDateString = payNowData?.paymentInfo?.rtpExpiryDateTime;

    // Extract year, month, and day from the input string
    const year = inputDateString?.substring(0, 4);
    const month = inputDateString?.substring(4, 6);
    const day = inputDateString?.substring(6, 8);
    const formattedDate = `${year}${month}${day}`;

    return (
      <TouchableOpacity
        style={{
          backgroundColor: Colors.childContainer,
          marginTop: hp(2),
          paddingHorizontal: wp(2),
          marginHorizontal: wp(4),
          borderWidth: 0.5,
          borderColor: Colors.textFieldBorderColor,
          borderRadius: wp(1),
        }}
        onPress={() => {
          // logs.log('Item On PRess....', item);
          // logs.log('payNowData On PRess....', payNowData?.additionalData);

          const payLaterObject = {
            senderIban: payNowData?.senderInfo?.iban,
            senderAccountTitle: payNowData?.senderInfo?.accountTitle,
            merchantIban: payNowData?.merchantInfo?.iban,
            merchantAccountTitle: payNowData?.merchantInfo?.accountTitle,
            merchantDba: payNowData?.merchantInfo?.dba,
            merchantMemberId: payNowData?.merchantInfo?.memberId,
            merchantAlias: payNowData?.merchantInfo?.merchantAlias
              ? payNowData?.merchantInfo?.merchantAlias
              : '',
            // fee: formattedFee,
            amount: formattedAmount,
            currency: payNowData?.additionalInfo?.currency,
            country: 'PK',
            billNumber: payNowData?.additionalInfo?.billNumber,
            billDueDate: formattedDate,
            billDueDate: payNowData?.paymentInfo?.rtpExpiryDateTime.substring(
              0,
              8,
            ),
            dateTime: '',
            amountAfterDueDate: payNowData?.additionalInfo?.amountAfterDueDate
              ? payNowData?.additionalInfo?.amountAfterDueDate
              : '',
            loyaltyNumber: '',
            storeLabel: '',
            customerLabel: '',
            terminalId: payNowData?.additionalInfo?.terminalId,
            paymentPurpose: '',
            merchantTaxId: payNowData?.additionalInfo?.merchantTaxId,
            merchantChannel: payNowData?.additionalInfo?.merchantChannel,
            rtpId: payNowData?.additionalInfo?.rtpId,
            rtpExpiryDateTime: payNowData?.paymentInfo?.rtpExpiryDateTime,
            rtpExecutionDateTime: payNowData?.paymentInfo?.rtpExecutionDateTime,
            ttc: payNowData?.additionalInfo?.ttc,
            customerEmail: '',
            customerMobile: '',
            customerAddress: '',
            referenceLabel: '',
            r1: 'r1',
            r2: 'r2',
            r3: 'r3',
            r4: 'r4',
            r5: 'r5',
            // mpin: mpin,
            schemeId: '01',
          };
          const payNowObject = {
            senderIban: payNowData?.senderInfo?.iban,
            senderAccountTitle: payNowData?.senderInfo?.accountTitle,
            merchantIban: payNowData?.merchantInfo?.iban,
            merchantAccountTitle: payNowData?.merchantInfo?.accountTitle,
            merchantDba: payNowData?.merchantInfo?.dba,
            merchantMemberId: payNowData?.merchantInfo?.memberId,
            merchantAlias: payNowData?.merchantInfo?.merchantAlias
              ? payNowData?.merchantInfo?.merchantAlias
              : '',
            // fee: formattedFee,
            amount: formattedAmount,
            currency: payNowData?.additionalInfo?.currency,
            country: 'PK',
            billNumber: payNowData?.additionalInfo?.billNumber,
            billDueDate: payNowData?.paymentInfo?.rtpExpiryDateTime.substring(
              0,
              8,
            ),
            dateTime: '',
            // amountAfterDueDate: payNowData?.additionalInfo?.amountAfterDueDate,
            loyaltyNumber: '',
            storeLabel: '',
            customerLabel: '',
            terminalId: payNowData?.additionalInfo?.terminalId,
            paymentPurpose: '',
            merchantTaxId: payNowData?.additionalInfo?.merchantTaxId,
            merchantChannel: payNowData?.additionalInfo?.merchantChannel,
            rtpId: payNowData?.additionalInfo?.rtpId,
            rtpExpiryDateTime: payNowData?.paymentInfo?.rtpExpiryDateTime,
            rtpExecutionDateTime: payNowData?.paymentInfo?.rtpExecutionDateTime,
            ttc: payNowData?.additionalInfo?.ttc,
            customerEmail: '',
            customerMobile: '',
            customerAddress: '',
            referenceLabel: '',
            r1: 'r1',
            r2: 'r2',
            r3: 'r3',
            r4: 'r4',
            r5: 'r5',
            // mpin: mpin,
            schemeId: '01',
          };

          // // logs.log('Item Pressed:--', payNowObject);
          // logs.log('payNowObject payNowObject:--', payNowData);

          payNowData?.paymentInfo?.rtpType === 'LATER'
            ? props.navigation.navigate('RTPConfirmDetails', {
                payLater: payLaterObject,
              })
            : props.navigation.navigate('RTPConfirmDetails', {
                payNow: payNowObject,
              });
        }}>
        <View style={{alignItems: 'flex-end'}}>
          <CustomText style={{marginTop: hp(1), fontSize: hp(2)}}>
            {moment(item?.dateTime, 'DD-MM-YYYY hh:mm:ss A').format(
              'DD-MM-YYYY',
            )}
          </CustomText>
        </View>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
          }}>
          {/* Raast Image */}
          <View
            style={{
              width: wp(12),
              height: wp(12),
              justifyContent: 'center',
            }}>
            <Image
              source={require('../../Assets/raastIconDash.png')}
              resizeMode={'contain'}
              style={{
                width: '100%',
                height: '100%',
                borderRadius: wp(100),
                tintColor:
                  activeTheme?.BtnBackground === '#009951'
                    ? Colors.whiteColor
                    : Colors.blackColor,
              }}
            />
          </View>

          {/* Title, Desc, Valid Date in Column */}
          <View
            style={{
              flexDirection: 'column',
              flex: 1,
              marginLeft: wp(3),
            }}>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
              }}>
              <CustomText boldFont={true}>
                {payNowData?.merchantInfo?.dba}
              </CustomText>
              <CustomText> requests </CustomText>
            </View>
            <CustomText boldFont={true} style={{color: Colors.primary_green}}>
              {payNowData?.amountInfo?.duePayableAmount}
            </CustomText>
            <CustomText
              style={{
                fontSize: hp(2),
                paddingBottom: hp(2),
              }}>
              {`Valid Till: ${moment(
                payNowData?.paymentInfo?.rtpExpiryDateTime,
                'YYYYMMDD',
              ).format('DD-MMM-YYYY')}`}
            </CustomText>
          </View>

          {/* Forward Arrow */}
          <View style={{marginBottom: wp(3)}}>
            <Ionicons
              name={'chevron-forward'}
              size={wp(8)}
              color={'black'}
              style={{alignSelf: 'flex-end'}}
            />
          </View>
        </View>

        {/* Valid Date in Row */}
      </TouchableOpacity>
    );
  };

  const pending_Tabs = ({item}) => {
    logs.log('pending_Tabs', item?.status);
    const receiptData = item?.additionalData;
    logs.log('receiptData', receiptData?.additionalInfo?.rtpId);
    logs.log('Merchant Bank', item?.merchantBank);

    return (
      <TouchableOpacity
        style={{
          backgroundColor: Colors.childContainer,
          marginTop: hp(2),
          paddingHorizontal: wp(2),
          marginHorizontal: wp(4),
          borderWidth: 0.5,
          borderColor: Colors.textFieldBorderColor,
          borderRadius: wp(1),
        }}
        onPress={() => {
          dispatch(
            changeGlobalTransferAlertState(true, props.navigation, {
              paymentType: 'P2M payment',
              amount: `${receiptData?.amountInfo?.instructedAmount}`,
              fromName: `${receiptData?.senderInfo?.accountTitle}`,
              fromAccount: `${receiptData?.senderInfo?.iban}`,
              toName: `${receiptData?.merchantInfo?.accountTitle}`,
              toAccount: `${receiptData?.merchantInfo?.iban}`,
              // rrn: response?.data?.data?.rnn ? response?.data?.data?.rnn : false,
              // tran_Id: response?.data?.data?.rnn
              //   ? response?.data?.data?.rnn
              //   : false,
              stanId: receiptData?.additionalInfo?.rtpId,
              // currentDate: `${moment(dataObject?.date, 'MM:DD').format(
              //   'DD MMM, YYYY',
              // )}`,
              // currentTime: `${dataObject?.time}`,
              // status: 'Fail',
              onPressClose: () => {
                dispatch(closeGlobalTransferAlert(props.navigation, '', true));
              },
            }),
          );
          // props.navigation.navigate('RTPConfirmDetails', {data: item});
        }}>
        <View
          style={{
            alignItems: 'center',
            flexDirection: 'row',
            backgroundColor:
              activeTab === 2 ? Colors.lightThemeGreen : Colors.lightRedColor,
            justifyContent: 'space-between',
            paddingHorizontal: wp(2),
            marginTop: wp(2),
            marginHorizontal: wp(2),
            borderRadius: wp(1),
          }}>
          <View style={{flexDirection: 'row', alignItems: 'center'}}>
            <MaterialCommunityIcons
              name={'arrow-top-right'}
              size={wp(6)}
              color={activeTab === 2 ? Colors.primary_green : Colors.red}
            />
            <CustomText
              style={{
                marginLeft: wp(2),
                fontSize: hp(2),
                color: activeTab === 2 ? Colors.primary_green : Colors.red,
              }}>
              RTP
            </CustomText>
          </View>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-evenly',
            }}>
            <CustomText
              style={{fontSize: hp(2), color: Colors.dashboardIconBack}}>
              {moment(
                item?.additionalData?.paymentInfo?.rtpExpiryDateTime,
                'YYYYMMDDHHmmss',
              ).format('DD-MMM-YYYY - h:mm:ss')}
            </CustomText>
          </View>
        </View>

        <View style={{marginTop: wp(3)}}>
          <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
            <View style={{flexDirection: 'column'}}>
              <CustomText
                style={{
                  fontSize: hp(2),
                  paddingHorizontal: wp(2),
                }}>
                Bank:
              </CustomText>
              <CustomText
                style={{
                  marginTop: hp(0.5),
                  paddingHorizontal: wp(2),
                  paddingBottom: hp(2),
                }}>
                {item.merchantBank}
              </CustomText>
            </View>
            {item?.status !== 'Paid' ? (
              <View style={{flexDirection: 'column'}}>
                <CustomText>Status</CustomText>
                <CustomText
                  style={{
                    fontSize: hp(2),
                    paddingBottom: hp(2),
                    // color: Colors.labelGrey,
                  }}>
                  {item?.status}
                </CustomText>
              </View>
            ) : null}
          </View>
          <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
            <View style={{flexDirection: 'column'}}>
              <CustomText
                style={{
                  fontSize: hp(2),
                  paddingHorizontal: wp(2),
                }}>
                A/C:
              </CustomText>
              <CustomText
                style={{
                  paddingHorizontal: wp(2),
                  paddingBottom: hp(2),
                }}>
                {item?.additionalData?.merchantInfo?.accountTitle}
              </CustomText>
            </View>
            <View style={{flexDirection: 'column'}}>
              <CustomText>{`Rs ${currencyFormat(
                Number(item?.additionalData?.amountInfo?.instructedAmount),
              )}`}</CustomText>
              <CustomText
                style={{
                  fontSize: hp(2),
                  paddingBottom: hp(2),
                  color: Colors.labelGrey,
                }}>
                Amount
              </CustomText>
            </View>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  const rejected_Tabs = ({item}) => {
    logs.log('rejected_Tabs', item?.status);
    const receiptData = item?.additionalData;
    logs.log('receiptData', receiptData?.additionalInfo?.rtpId);
    logs.log('Merchant Bank', item?.merchantBank);

    return (
      <TouchableOpacity
        style={{
          backgroundColor: Colors.childContainer,
          marginTop: hp(2),
          paddingHorizontal: wp(2),
          marginHorizontal: wp(4),
          borderWidth: 0.5,
          borderColor: Colors.textFieldBorderColor,
          borderRadius: wp(1),
        }}
        onPress={() => {
          logs.log('receiptData', receiptData);
          dispatch(
            changeGlobalTransferAlertState(true, props.navigation, {
              paymentType: 'P2M payment',
              amount: `${receiptData?.amountInfo?.instructedAmount}`,
              fromName: `${receiptData?.senderInfo?.accountTitle}`,
              fromAccount: `${receiptData?.senderInfo?.iban}`,
              toName: `${receiptData?.merchantInfo?.accountTitle}`,
              toAccount: `${receiptData?.merchantInfo?.iban}`,
              // rrn: response?.data?.data?.rnn ? response?.data?.data?.rnn : false,
              // tran_Id: response?.data?.data?.rnn
              //   ? response?.data?.data?.rnn
              //   : false,
              stanId: receiptData?.additionalInfo?.rtpId,
              // currentDate: `${moment(dataObject?.date, 'MM:DD').format(
              //   'DD MMM, YYYY',
              // )}`,
              // currentTime: `${dataObject?.time}`,
              status: 'Fail',
              onPressClose: () => {
                dispatch(closeGlobalTransferAlert(props.navigation, '', true));
              },
            }),
          );

          // props.navigation.navigate('RTPConfirmDetails', {data: item});
        }}>
        <View
          style={{
            alignItems: 'center',
            flexDirection: 'row',
            backgroundColor:
              activeTab === 2 ? Colors.lightThemeGreen : Colors.lightRedColor,
            justifyContent: 'space-between',
            paddingHorizontal: wp(2),
            marginTop: wp(2),
            marginHorizontal: wp(2),
            borderRadius: wp(1),
          }}>
          <View style={{flexDirection: 'row', alignItems: 'center'}}>
            <MaterialCommunityIcons
              name={'arrow-top-right'}
              size={wp(6)}
              color={activeTab === 2 ? Colors.primary_green : Colors.red}
            />
            <CustomText
              style={{
                marginLeft: wp(2),
                fontSize: hp(2),
                color: activeTab === 2 ? Colors.primary_green : Colors.red,
              }}>
              RTP
            </CustomText>
          </View>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-evenly',
            }}>
            <CustomText
              style={{fontSize: hp(2), color: Colors.dashboardIconBack}}>
              {moment(
                item?.additionalData?.paymentInfo?.rtpExpiryDateTime,
                'YYYYMMDDHHmmss',
              ).format('DD-MMM-YYYY - h:mm:ss')}
            </CustomText>
          </View>
        </View>

        <View style={{marginTop: wp(3)}}>
          <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
            <View style={{flexDirection: 'column'}}>
              <CustomText
                style={{
                  fontSize: hp(2),
                  paddingHorizontal: wp(2),
                }}>
                Bank:
              </CustomText>
              <CustomText
                style={{
                  marginTop: hp(0.5),
                  paddingHorizontal: wp(2),
                  paddingBottom: hp(2),
                }}>
                {item.merchantBank}
              </CustomText>
            </View>
            {item?.status !== 'Paid' ? (
              <View style={{flexDirection: 'column'}}>
                <CustomText>Status</CustomText>
                <CustomText
                  style={{
                    fontSize: hp(2),
                    paddingBottom: hp(2),
                    // color: Colors.labelGrey,
                  }}>
                  {item?.status}
                </CustomText>
              </View>
            ) : null}
          </View>
          <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
            <View style={{flexDirection: 'column'}}>
              <CustomText
                style={{
                  fontSize: hp(2),
                  paddingHorizontal: wp(2),
                }}>
                A/C:
              </CustomText>
              <CustomText
                style={{
                  paddingHorizontal: wp(2),
                  paddingBottom: hp(2),
                }}>
                {item?.additionalData?.merchantInfo?.accountTitle}
              </CustomText>
            </View>
            <View style={{flexDirection: 'column'}}>
              <CustomText>{`Rs ${currencyFormat(
                Number(item?.additionalData?.amountInfo?.instructedAmount),
              )}`}</CustomText>
              <CustomText
                style={{
                  fontSize: hp(2),
                  paddingBottom: hp(2),
                  color: Colors.labelGrey,
                }}>
                Amount
              </CustomText>
            </View>
          </View>
        </View>
      </TouchableOpacity>
    );
  };
  const noTransactions = () => {
    return (
      <View
        style={{
          alignSelf: 'center',
          justifyContent: 'center',
          alignItems: 'center',
          flex: 1,
        }}>
        <CustomText
          style={{
            textAlign: 'center',
            padding: wp(2),
            fontSize: wp(8),
            color: Colors.labelGrey,
          }}>
          No Transactions Available
        </CustomText>
      </View>
    );
  };

  const filteringData = (data) => {
    logs.log('filteringData', data, activeTab);
    // let activeNotifications = [];
    // let paidNotifications = [];
    // let rejectAndExpiredNotifications = [];
    data.forEach((notification) => {
      switch (notification.status) {
        case 'Active':
          // rtpActiveData.push(notification);
          setRtpActiveData((prevState) => [...prevState, notification]);
          break;
        case 'Paid':
          // paidNotifications.push(notification);
          setRtpPaidData((prevState) => [...prevState, notification]);
          break;
        case 'Expired':
          // rejectAndExpiredNotifications.push(notification);
          setRtpRejectedData((prevState) => [...prevState, notification]);
          break;
        case 'Rejected':
          // rejectAndExpiredNotifications.push(notification);
          setRtpRejectedData((prevState) => [...prevState, notification]);
          break;
        default:
          // Handle unexpected status
          break;
      }
      logs.log('notification.status--', notification.status);
    });
    // setRtpData(filteredData);
    // console.log('Active Notifications:', activeNotifications);
    // console.log('Paid Notifications:', paidNotifications);
    // console.log(
    //   'Reject and Expired Notifications:',
    //   rejectAndExpiredNotifications,
    // );
  };

  // logs.log('Filter Data------', filteredData);
  // logs.log('rtpData Data------', rtpData);

  return (
    <View
      style={[styles.container, {backgroundColor: Colors.backgroundColor}]}
      accessibilityLabel="RTP Requests">
      <SubHeader
        navigation={props.navigation}
        title={'RTP Requests'}
        description={'Make Payments in just few steps'}
        // navigateDashboard={true}
      />
      <View style={{height: wp(4)}} />
      {tabs()}

      {activeTab === 1 && rtpActiveData.length === 0 ? noTransactions() : null}
      {activeTab === 2 && rtpPaidData.length === 0 ? noTransactions() : null}
      {activeTab === 3 && rtpRejectedData.length === 0
        ? noTransactions()
        : null}

      <FlatList
        accessibilityLabel="Accounts List"
        showsVerticalScrollIndicator={false}
        renderItem={
          activeTab === 1
            ? active_details
            : activeTab === 2
            ? pending_Tabs
            : rejected_Tabs
        }
        data={
          activeTab === 1
            ? rtpActiveData
            : activeTab === 2
            ? rtpPaidData
            : rtpRejectedData
        }
        removeClippedSubviews={true}
        keyExtractor={(item, index) => index.toString()}
        disableVirtualization={false}
        scrollEnabled={true}
        onEndReachedThreshold={0.25}
        onEndReached={rtpLoadMoreDataNotification}
      />
      <View style={{height: wp(4)}} />
    </View>
  );
};

export default RTPRequest;
