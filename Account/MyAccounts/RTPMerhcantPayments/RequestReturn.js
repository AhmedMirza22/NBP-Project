import React, {useState, useRef, useEffect} from 'react';
import {
  View,
  Dimensions,
  ScrollView,
  KeyboardAvoidingView,
  TouchableOpacity,
  FlatList,
  Platform,
} from 'react-native';
import SubHeader from '../../../../Components/GlobalHeader/SubHeader/SubHeader';
import styles from '../../../Transfers/CnicTransfer/CnicTransferStyling';
import TabNavigator from '../../../../Components/TabNavigate/TabNavigate';
import Custom_btn from '../../../../Components/Custom_btn/Custom_btn';
import {Colors} from '../../../../Theme';
import CustomModal from '../../../../Components/CustomModal/CustomModal';
import {useSelector, useDispatch} from 'react-redux';
import {
  cnicTransfer,
  setCurrentFlow,
  changeGlobalTransferAlertState,
  setLoader,
  updateSessionToken,
  serviceResponseCheck,
  catchError,
} from '../../../../Redux/Action/Action';
import analytics from '@react-native-firebase/analytics';

import {globalStyling, hp, wp, currencyFormat} from '../../../../Constant';
import {defaultAccount} from '../../../../Helpers/Helper';
import {Keyboard} from 'react-native';
import I18n from '../../../../Config/Language/LocalizeLanguageString';
import {logs} from '../../../../Config/Config';
import store from '../../../../Redux/Store/Store';
import CustomText from '../../../../Components/CustomText/CustomText';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Ionicons from 'react-native-vector-icons/Ionicons';
import moment from 'moment';
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';
import DateTimePicker from '@react-native-community/datetimepicker';
import IOSDatePicker from 'react-native-modal-datetime-picker';
import {getTokenCall, Service} from '../../../../Config/Service';
import {color} from 'react-native-reanimated';

const screenWidth = Dimensions.get('window').width;

export default function RequestReturn(props) {
  const merchantAliasData = [
    {
      id: 0,
      text: 'Merchant ID',
      limit: 16,
      key: 'MID',
    },
    {
      id: 1,
      text: 'Virtual Payment Address',
      limit: 13,
      key: 'VPA',
    },
    {
      id: 2,
      text: 'TILL CODE',
      limit: 9,
      key: 'TILL_CODE',
    },
    {
      id: 3,
      text: 'Free Text',
      limit: 50,
      key: 'Free Text',
    },
  ];

  const [showModalState, changeModalState] = useState(false);
  const [currentModal, changeCurrentModal] = useState('');
  const [purposeOfPayment, changePurposeOfPayment] = useState('');
  const [merchantAliasType, changeMerchantAliasType] = useState('');
  const [merchantAliasTypeName, changeMerchantAliasTypeName] = useState('');
  const [activeTab, setActiveTab] = useState(1);
  const [dateModal, setDateModal] = useState(false);
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');
  const [dateTimePickerStatus, setDateTimePickerStatus] = useState(false);
  const [selectDate, setSelectDate] = useState('');
  const [rtpData, setRtpData] = useState([]);

  const dateFrom = moment(fromDate).format('YYYYMMDD');
  const dateTo = moment(toDate).format('YYYYMMDD');

  const past = new Date();
  past.toISOString().slice(0, 10);

  const viewAccountsData = useSelector(
    (state) => state.reducers.viewAccountsData,
  );
  const mappedAccounts =
    viewAccountsData.length === 0
      ? []
      : viewAccountsData.map(function (object) {
          return {
            ...object,
            text: `${object.accountType} - ${object.account}`,
          };
        });
  const arrayFilter = defaultAccount(mappedAccounts);
  const [id, setID] = useState('');

  const [transferFundsFrom, changeTransferFundsFrom] = useState(
    arrayFilter.length === 0 ? {} : arrayFilter[0],
  );
  const dispatch = useDispatch();

  logs.log('arrayFilter-->', arrayFilter[0].iban);

  useEffect(() => {
    if (transferFundsFrom) {
      logs.log('transferFundsFrom-->', transferFundsFrom.iban);
    } else {
      logs.log('arrayFilter-->', arrayFilter[0].iban);
    }
  }, transferFundsFrom);

  // const Data = [
  //   {
  //     type: 'RTP',
  //     bankName: 'Habib Bank Limited',
  //     title: 'K-Electric',
  //     amount: '5000.00',
  //     date: '25 Jan 2024',
  //     time: '02:00 PM',
  //     status: 'Active',
  //     fromAccount: '1234567890',
  //     toAccount: '0987654321',
  //   },
  //   {
  //     type: 'RTP',
  //     bankName: 'Habib Bank Limited',
  //     title: 'K-Electric',
  //     amount: '5000.00',
  //     date: '25 Jan 2024',
  //     time: '02:00 PM',
  //     status: 'Completed',
  //   },
  //   {
  //     type: 'QR',

  //     bankName: 'Habib Bank Limited',
  //     title: '786 Store',
  //     amount: '4000.00',
  //     date: '12 Jan 2024',
  //     time: '03:00 PM',
  //     status: 'Pending',
  //   },
  //   {
  //     type: 'RTP',
  //     bankName: 'Meezan Bank',
  //     title: 'Bismillah Store',
  //     amount: '2000.00',
  //     time: '04:00 PM',
  //     date: '2 Jan 2024',
  //     status: 'Rejected',
  //   },
  // ];

  React.useEffect(() => {
    props.navigation.addListener('focus', () => {
      logs.log('UseEffect 1 Triggered');
      //   dispatch(setCurrentFlow('CNIC Transfer'));
      setTimeout(() => {
        getMerchantNotification(store.getState().reducers.token);
      }, 1000);
      async function analyticsLog() {
        await analytics().logEvent('RequestReturnScreen');
      }
      analyticsLog();
    });
  }, []);

  // useEffect(() => {
  //   logs.log('UseEffect 2 Triggered');

  //   getMerchantNotification(store.getState().reducers.token);
  // }, [transferFundsFrom]);

  useEffect(() => {
    logs.log('From Date: ', fromDate, 'To Date: ', toDate);
  }, [fromDate, toDate]);

  const onHandleMultiAcc = () => {
    // changeTransferFundsFrom({});
    changeCurrentModal('transferFrom');
    changeModalState(true);
  };
  const savingAccounts = () => {
    return (
      <TabNavigator
        tabHeading={transferFundsFrom.accountType}
        border={true}
        accessibilityLabel={
          Object.keys(transferFundsFrom).length === 0
            ? 'Tap here to select an option'
            : transferFundsFrom.text
        }
        text={
          Object.keys(transferFundsFrom).length === 0
            ? 'Tap here to select an option'
            : transferFundsFrom?.iban
            ? transferFundsFrom?.iban
            : transferFundsFrom?.account
        }
        textWidth={'100%'}
        navigation={props.navigation}
        width={'90%'}
        hideOverlay={
          Object.keys(transferFundsFrom).length === 0
            ? 'transparent'
            : Colors.primary_green
        }
        multipleLines={2}
        fontSize={wp(4)}
        arrowColor={viewAccountsData.length == 1 ? 'white' : 'black'}
        arrowSize={wp(9)}
        onPress={() => {
          viewAccountsData.length == 1
            ? logs.log('asdasd')
            : onHandleMultiAcc();
        }}
      />
    );
  };

  const getMerchantNotification = async (token) => {
    try {
      //   setIsLoader(true);
      dispatch(setLoader(true));

      const response = await getTokenCall(
        Service.getMerchantNotification,
        `channel=MOBILE_APP&page=0&size=20&customerAccount=${transferFundsFrom?.iban}`,
        // ${transferFundsFrom?.iban}
        // `channel=MOBILE_APP&page=0&size=20&customerAccount=PK88NBPA0002003117519317`,

        token,
      );
      const responseData = response.data;
      logs.log('response---->', responseData);
      if (
        response.data.responseCode === '00' ||
        response.data.responseCode === '200'
      ) {
        // logs.logResponse('getRTPNotifications Response========', responseData);
        // logs.log(response?.data?.data);
        dispatch(updateSessionToken(response));
        // setIsLoader(false);

        dispatch(setLoader(false));
        let tempData = response?.data?.data?.notifications;
        logs.logResponse('tempData Response========', tempData);
        tempData.sort((a, b) => {
          // Convert stampDate strings to Date objects for comparison

          // const dateA = moment(a?.tranDateTime, 'YYYY-MM-DD').format(
          //   'YYYYMMDD',
          // );
          // const dateB = moment(b?.tranDateTime, 'YYYY-MM-DD').format(
          //   'YYYYMMDD',
          // );
          const dateA = a?.tranDateTime;
          const dateB = b?.tranDateTime;
          logs.log('DateA---------', dateA);
          logs.log('DateB---------', dateB);

          // Compare dates
          return dateB - dateA;
        });

        setRtpData(tempData);
        let tempData2 = tempData.map((item) => {
          logs.logResponse('item Response========', item);
          return {...item, isRead: true};
        });
        logs.logResponse('tempData2 Response========', tempData2);
      } else {
        dispatch(serviceResponseCheck(response, props.navigation));
        // setIsLoader(false);
        dispatch(setLoader(false));
      }
    } catch (error) {
      //   setIsLoader(false);
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
            setFromDate('');
            setToDate('');
          }}
          style={{
            height: hp(5),
            width: wp(40),
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
              setFromDate('');
              setToDate('');
            }}>
            Transactions
          </CustomText>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => {
            setActiveTab(2);
            setFromDate('');
            setToDate('');
          }}
          style={{
            height: hp(5),
            width: wp(40),
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
              setFromDate('');
              setToDate('');
            }}>
            Return Requests
          </CustomText>
        </TouchableOpacity>
      </View>
    );
  };

  const transaction_Tabs = ({item}) => {
    logs.log('pending_Tabs', item?.status);
    const receiptData = item?.additionalData;
    logs.log('receiptData', receiptData?.additionalInfo?.rtpId);
    logs.log('Transaction Tab Data', receiptData);
    logs.log('Item', item);

    const tranDate = moment(item?.tranDateTime, 'YYYY-MM-DD HH:mm').format(
      'YYYYMMDDHHmmss',
    );
    logs.log('tranDate', tranDate);

    logs.log('Merchant Bank', item?.merchantBank);

    const apiObject = {
      originalRrn: item?.rrn,
      originalStan: item?.stan,
      originalAmount: item?.amount,
      requestedAmount: item?.returnPaymentAmount,
      schemeId: '01',
      mpin: '',
      fromAccount: item?.customerAccount,
      toAccount: item?.merchantAccount,
      merchantAccountTitle: item?.merchantName,
      bankName: item?.toBank,
      date: tranDate,
    };

    return (
      <TouchableOpacity
        style={{
          backgroundColor: Colors.subContainer,
          marginBottom: wp(3),
          marginTop: hp(2),
          paddingHorizontal: wp(2),
          marginHorizontal: wp(4),
          borderWidth: 0.5,
          borderColor: Colors.textFieldBorderColor,
          borderRadius: wp(1),
        }}
        onPress={() => {
          props.navigation.navigate('RequestReturnConfirm', {data: apiObject});

          //   dispatch(
          //     changeGlobalTransferAlertState(true, props.navigation, {
          //       paymentType: 'Request To Pay',
          //       amount: `${receiptData?.amountInfo?.instructedAmount}`,
          //       fromName: `${receiptData?.senderInfo?.accountTitle}`,
          //       fromAccount: `${receiptData?.senderInfo?.iban}`,
          //       toName: `${receiptData?.merchantInfo?.accountTitle}`,
          //       toAccount: `${receiptData?.merchantInfo?.iban}`,
          //       // rrn: response?.data?.data?.rnn ? response?.data?.data?.rnn : false,
          //       // tran_Id: response?.data?.data?.rnn
          //       //   ? response?.data?.data?.rnn
          //       //   : false,
          //       stanId: receiptData?.additionalInfo?.rtpId,
          //       // currentDate: `${moment(dataObject?.date, 'MM:DD').format(
          //       //   'DD MMM, YYYY',
          //       // )}`,
          //       // currentTime: `${dataObject?.time}`,
          //       // status: 'Fail',
          //       onPressClose: () => {
          //         dispatch(closeGlobalTransferAlert(props.navigation));
          //       },
          //     }),
          //   );
          // props.navigation.navigate('RTPConfirmDetails', {data: item});
        }}>
        <View
          style={{
            alignItems: 'center',
            flexDirection: 'row',
            backgroundColor: Colors.lightThemeGreen,
            justifyContent: 'space-between',
            paddingHorizontal: wp(2),
            marginTop: hp(2),
            marginHorizontal: wp(2),
            borderRadius: wp(0.5),
            borderWidth: 0.5,
            borderColor: Colors.darkGreen,
          }}>
          <View style={{flexDirection: 'row', alignItems: 'center'}}>
            <MaterialCommunityIcons
              name={'arrow-top-right'}
              size={wp(6)}
              color={Colors.primary_green}
            />
            <CustomText
              style={{
                marginLeft: wp(2),
                fontSize: hp(2),
                color: Colors.primary_green,
              }}>
              {item?.activity}
              {/* RTP */}
            </CustomText>
          </View>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-evenly',
            }}>
            <CustomText style={{fontSize: hp(1.75), color: Colors.grey}}>
              {moment(tranDate, 'YYYYMMDDHHmmss').format('DD-MMM-YYYY hh:mm A')}
            </CustomText>
          </View>
        </View>

        <View style={{marginTop: wp(3)}}>
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
            {item.toBank}
          </CustomText>
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
                {/* {item?.title} */}
                {item?.merchantName}
              </CustomText>
            </View>
            <View
              style={{
                flexDirection: 'column',
                // backgroundColor: 'pink',
                alignItems: 'flex-end',
              }}>
              <CustomText>{`Rs ${currencyFormat(
                Number(item?.amount),
              )}`}</CustomText>
              <CustomText
                style={{
                  fontSize: hp(2),
                  paddingBottom: hp(2),
                  // marginLeft: wp(5),
                  color: Colors.labelGrey,
                  // backgroundColor: 'red',
                }}>
                Amount
              </CustomText>
            </View>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  const returnRequest_Tabs = ({item}) => {
    const tranDate = moment(item?.tranDateTime, 'YYYY-MM-DD HH:mm').format(
      'YYYYMMDDHHmmss',
    );
    logs.log('tranDate', tranDate);

    logs.log('Merchant Bank', item?.merchantBank);

    const apiObject = {
      originalRrn: item?.rrn,
      originalStan: item?.stan,
      originalAmount: item?.returnPaymentAmount,
      requestedAmount: '',
      schemeId: '01',
      mpin: '',
      fromAccount: item?.customerAccount,
      toAccount: item?.merchantAccount,
      merchantAccountTitle: item?.merchantName,
      bankName: item?.toBank,
      date: tranDate,
    };

    return (
      <TouchableOpacity
        style={{
          backgroundColor: Colors.subContainer,
          marginTop: hp(2),
          paddingHorizontal: wp(2),
          marginHorizontal: wp(4),
          borderWidth: 0.5,
          borderColor: Colors.textFieldBorderColor,
          marginBottom: wp(3),
          borderRadius: wp(1),
        }}
        onPress={() => {
          props.navigation.navigate('RequestReturnConfirm', {data: apiObject});
          //   dispatch(
          //     changeGlobalTransferAlertState(true, props.navigation, {
          //       paymentType: 'Request To Pay',
          //       amount: `${receiptData?.amountInfo?.instructedAmount}`,
          //       fromName: `${receiptData?.senderInfo?.accountTitle}`,
          //       fromAccount: `${receiptData?.senderInfo?.iban}`,
          //       toName: `${receiptData?.merchantInfo?.accountTitle}`,
          //       toAccount: `${receiptData?.merchantInfo?.iban}`,
          //       // rrn: response?.data?.data?.rnn ? response?.data?.data?.rnn : false,
          //       // tran_Id: response?.data?.data?.rnn
          //       //   ? response?.data?.data?.rnn
          //       //   : false,
          //       stanId: receiptData?.additionalInfo?.rtpId,
          //       // currentDate: `${moment(dataObject?.date, 'MM:DD').format(
          //       //   'DD MMM, YYYY',
          //       // )}`,
          //       // currentTime: `${dataObject?.time}`,
          //       // status: 'Fail',
          //       onPressClose: () => {
          //         dispatch(closeGlobalTransferAlert(props.navigation));
          //       },
          //     }),
          //   );
          // props.navigation.navigate('RTPConfirmDetails', {data: item});
        }}>
        <View
          style={{
            alignItems: 'center',
            flexDirection: 'row',
            // backgroundColor: Colors.lightThemeGreen,
            justifyContent: 'space-between',
            paddingHorizontal: wp(2),
            marginTop: wp(2),
            marginHorizontal: wp(2),
            borderRadius: wp(1),
            width: '100%',
          }}>
          <View style={{flexDirection: 'row', alignItems: 'center'}}>
            <CustomText
              style={{
                // marginLeft: wp(2),
                fontSize: hp(2),
                // color: Colors.primary_green,
              }}>
              Return Request To
            </CustomText>
          </View>

          <View
            style={{
              // flexDirection: 'row',
              // justifyContent: 'space-evenly',
              alignItems: 'flex-end',
              // backgroundColor: 'red',
            }}>
            <CustomText style={{fontSize: hp(1.75), color: Colors.grey}}>
              {moment(tranDate, 'YYYYMMDDHHmmss').format('DD-MMM-YYYY hh:mm A')}

              {/* {item?.date} */}
            </CustomText>
          </View>
        </View>
        <CustomText
          style={{
            paddingHorizontal: wp(2),
            // marginTop: wp(2),
            marginHorizontal: wp(2),
            // fontSize: hp(2),
            // color: Colors.primary_green,
          }}>
          {item?.merchantName}
        </CustomText>

        <View style={{marginTop: wp(3)}}>
          <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
            <View style={{flexDirection: 'column'}}>
              <CustomText
                style={{
                  fontSize: hp(2),
                  paddingHorizontal: wp(2),
                  marginLeft: wp(2),
                }}>
                Status
              </CustomText>
              <CustomText
                style={{
                  paddingHorizontal: wp(2),
                  paddingBottom: hp(2),
                  marginLeft: wp(2),
                  color:
                    item?.status === 'Pending'
                      ? Colors.orange
                      : item?.status === 'Rejected'
                      ? Colors.red
                      : Colors.primary_green,
                }}>
                {item?.status}
              </CustomText>
            </View>
            <View style={{flexDirection: 'column', alignItems: 'flex-end'}}>
              <View>
                <CustomText>
                  {`Rs ${currencyFormat(Number(item?.returnPaymentAmount))}`}
                </CustomText>
              </View>
              <CustomText
                style={{
                  fontSize: hp(2),
                  paddingBottom: hp(2),
                  color: Colors.labelGrey,
                  justifyContent: 'flex-end',
                  marginLeft: wp(10),
                }}>
                Amount
              </CustomText>
            </View>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  const filteredData = rtpData.filter((item) => {
    if (activeTab === 1 && item.status === 'Paid') {
      return true;
    } else if (
      (activeTab === 2 && item.status === 'Pending') ||
      (activeTab === 2 && item.status === 'Rejected') ||
      (activeTab === 2 && item.status === 'Completed')
    ) {
      return true;
    }
    return false;
  });

  const filterDate = filteredData.filter((item) => {
    const date = moment(item?.tranDateTime, 'YYYY-MM-DD').format('YYYYMMDD');
    logs.log('item?.requestParams?.dateTime=========', date);
    logs.log('dateFrom=========', dateFrom);
    logs.log('dateTo=========', dateTo);
    if (date >= dateFrom && date <= dateTo) {
      return true;
    }
  });

  const dateButton = () => {
    return (
      <View style={styles.margin}>
        <TouchableOpacity
          style={{
            height: wp(13),
            backgroundColor: Colors.BtnBackground,
            borderRadius: wp(1),
            width: wp(90),
            alignSelf: 'center',
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
          }}
          onPress={() => {
            setDateModal(true);
            setFromDate('');
            setToDate('');
          }}>
          <CustomText
            style={[
              globalStyling.textFontBold,
              {
                alignSelf: 'center',
                fontSize: wp(4.5),
                color: Colors.whiteColor,
              },
            ]}>
            Select Date
          </CustomText>
          <MaterialIcon
            name={'date-range'}
            size={wp(5)}
            color={Colors.whiteColor}
            style={{paddingLeft: wp(4)}}
          />
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <View
      style={[
        globalStyling.container,
        {backgroundColor: Colors.backgroundColor},
      ]}>
      <SubHeader
        title={'Merchant Payment'}
        description={'RTP Request & Return Payment'}
        navigation={props.navigation}
      />
      <ScrollView contentContainerStyle={globalStyling.scrollContent}>
        <View style={{height: wp(5)}} />
        {savingAccounts()}

        <View style={{height: wp(2)}} />

        {dateButton()}

        <View style={{height: wp(3)}} />

        <View style={{flexDirection: 'row'}}>
          {fromDate ? (
            <CustomText
              boldFont={true}
              style={{
                fontSize: wp(5),
                marginLeft: wp(6),
                padding: wp(2),
                alignSelf: 'center',
              }}>
              {`${moment(fromDate).format('DD MMM YYYY')}`}
            </CustomText>
          ) : null}

          {toDate ? (
            <CustomText
              boldFont={true}
              style={{
                fontSize: wp(5),
                marginLeft: wp(1),
                padding: wp(2),
                alignSelf: 'center',
              }}>
              {`-  ${moment(toDate).format('DD MMM YYYY')}`}
            </CustomText>
          ) : null}
        </View>

        {tabs()}

        <FlatList
          accessibilityLabel="Accounts List"
          showsVerticalScrollIndicator={false}
          renderItem={activeTab === 1 ? transaction_Tabs : returnRequest_Tabs}
          data={toDate !== '' && fromDate !== '' ? filterDate : filteredData}
          removeClippedSubviews={true}
          keyExtractor={(item, index) => index.toString()}
          disableVirtualization={false}
          scrollEnabled={true}
        />

        {dateTimePickerStatus && Platform.OS === 'android' ? (
          <DateTimePicker
            value={past}
            date={past}
            display={'spinner'}
            mode="date"
            maximumDate={new Date()}
            onChange={(event, dateSelected) => {
              if (selectDate === 'From') {
                setDateTimePickerStatus(false);
                setTimeout(() => {
                  setFromDate(dateSelected);
                  setDateModal(true);
                }, 500);
                logs.log('From Date Change', dateSelected);
              } else if (selectDate === 'To') {
                setDateTimePickerStatus(false);
                setTimeout(() => {
                  setToDate(dateSelected);
                }, 500);
                // setDateModal(true);
                logs.log('To Date Change', dateSelected);
              } else {
                logs.log('Date Change Modal Close');
                setDateTimePickerStatus(false);
              }
            }}
          />
        ) : null}

        {Platform.OS === 'android' ? null : (
          <IOSDatePicker
            date={past}
            isVisible={dateTimePickerStatus}
            mode="date"
            maximumDate={new Date()}
            onConfirm={(dateSelected) => {
              if (selectDate === 'From') {
                setFromDate(dateSelected);
                setDateTimePickerStatus(false);
                setDateModal(true);
                logs.log('From Date Change', dateSelected);
              } else if (selectDate === 'To') {
                setToDate(dateSelected);
                setDateTimePickerStatus(false);
                // setDateModal(true);
                logs.log('To Date Change', dateSelected);
              } else {
                logs.log('Date Change Modal Close');
                setDateTimePickerStatus(false);
              }
            }}
            onCancel={() => {
              // setDateTimePickerStatus(false);
              this.setState({dateTimePickerStatus: false});
            }}
          />
        )}

        <CustomModal
          visible={dateModal}
          headtext={'Select Dates'}
          data={[
            {
              id: 1,
              text: fromDate
                ? `From ${moment(fromDate).format('MM-DD-YYYY')}`
                : 'From Date',
            },
            {
              id: 2,
              text: toDate
                ? `To ${moment(toDate).format('MM-DD-YYYY')}`
                : 'To Date',
            },
          ]}
          onPress_item={(param) => {
            logs.log('Params of Custom Modal', param.text);
            if (String(param.text).includes('From Date')) {
              setSelectDate('From');
            } else {
              setSelectDate('To');
            }
            setDateModal(false);
            setTimeout(() => {
              setDateTimePickerStatus(true);
            }, 500);
          }}
          onCancel={() => {
            setDateModal(false);
          }}
        />

        <CustomModal
          visible={showModalState}
          headtext={'Please Select Options Below'}
          data={
            currentModal === 'transferFrom'
              ? mappedAccounts
              : currentModal === 'merchant'
              ? merchantAliasData
              : null
          }
          mobileTopUpBeneficiary={
            currentModal === 'transferFrom' ? true : false
          }
          onPress_item={(param) => {
            changeModalState(!showModalState);
            currentModal === 'merchant'
              ? changeMerchantAliasTypeName(param.text)
              : null;
            currentModal === 'merchant'
              ? changeMerchantAliasType(param.key)
              : null;
            currentModal === 'merchant' ? changeIdLimit(param.limit) : null;

            currentModal === 'transferFrom'
              ? (changeTransferFundsFrom(param),
                getMerchantNotification(store.getState().reducers.token))
              : null;
            // currentModal === 'transferFrom'
            //   ? getMerchantNotification(store.getState().reducers.token)
            //   : null;
            logs.log('haskdhkajsdkh', param);
          }}
          onCancel={() => changeModalState(!showModalState)}
        />

        <View style={styles.seperator} />
      </ScrollView>
    </View>
  );
}
