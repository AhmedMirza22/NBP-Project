import React, {useEffect, useState} from 'react';
import {View, Text, FlatList, TouchableOpacity, Platform} from 'react-native';
import styles from './ViewAccountDetailsStyling';
import GlobalHeader from '../../../../../Components/GlobalHeader/GlobalHeader';
import SubHeader from '../../../../../Components/GlobalHeader/SubHeader/SubHeader';
import DateTimePicker from '@react-native-community/datetimepicker';
import moment from 'moment';
import CustomModal from '../../../../../Components/CustomModal/CustomModal';
import CustomAlert from '../../../../../Components/Custom_Alert/CustomAlert';
import {useSelector, useDispatch} from 'react-redux';
import I18n from '../../../../../Config/Language/LocalizeLanguageString';
import {
  sendEmailStatementData,
  updateViewStatementsData,
  setCurrentFlow,
  setAppAlert,
  overview,
  changeGlobalAlertState,
  changeGlobalTransferAlertState,
  closeGlobalTransferAlert,
} from '../../../../../Redux/Action/Action';
import analytics from '@react-native-firebase/analytics';

import {Colors} from '../../../../../Theme';
import IOSDatePicker from 'react-native-modal-datetime-picker';
import {currencyFormat, globalStyling} from '../../../../../Constant';
import {logs} from '../../../../../Config/Config';
import {wp} from '../../../../../Constant';
import CustomText from '../../../../../Components/CustomText/CustomText';
import CustomBtn from '../../../../../Components/Custom_btn/Custom_btn';
import {isRtlState} from '../../../../../Config/Language/LanguagesArray';

const ViewAccountsDetails = React.memo((props) => {
  const dispatch = useDispatch();
  const [showModalState, changeModalState] = useState(false);
  const [currentModal, changeCurrentModal] = useState('');
  const [showAlertState, changeAlertState] = useState(false);
  const [dateToBeSelected, setDateToBeSelected] = useState('');
  const token = useSelector((state) => state.reducers.token);
  const [dateTimePickerStatus, setDateTimePickerStatus] = useState(false);
  const [todaysDate, setTodaysDate] = useState(
    moment(new Date()).format('MM-DD-YYYY'),
  );
  const [lessDays, setLessDays] = useState(
    moment(new Date()).subtract(10, 'days').format('MM-DD-YYYY'),
  );
  const [show10Trans, setShow10Trans] = useState(true);
  const [fromDate, setFromDate] = useState('');
  const [displayFromDate, setDisplayFromDate] = useState('');
  const [viewLastDays, setViewLastDays] = useState('10');
  const [toDate, setToDate] = useState('');
  const [displayToDate, setDisplayToDate] = useState('');
  const [done, setDone] = useState(false);
  const [doneFromDate, setDoneFromDate] = useState(false);
  const [doneToDate, setDoneToDate] = useState(false);
  const viewAccountStatementData = useSelector(
    (state) => state.reducers.viewAccountStatementData,
  );
  const balance = useSelector((state) => state.reducers.balance);
  const overViewData = useSelector((state) => state.reducers.overViewData);
  const loader = useSelector((state) => state.reducers.loader);
  const routedData = props.route.params?.data;
  logs.log('overViewData', routedData);
  var past = new Date();
  past.toISOString().slice(0, 10);

  useEffect(() => {
    if (fromDate !== '' && toDate !== '' && !dateTimePickerStatus) {
      if (
        moment(fromDate, 'MM-DD-YYYY').isBefore(moment(toDate, 'MM-DD-YYYY'))
      ) {
        if (Platform.OS === 'android') {
          changeModalState(false);
          dispatch(
            updateViewStatementsData(
              token,
              props.navigation,
              props.route.params?.data?.account,
              props.route.params?.data?.accountType,
              fromDate,
              toDate,
              true,
            ),
          );
          setFromDate('');
          setToDate('');
        } else if (
          Platform.OS === 'ios' &&
          !dateTimePickerStatus
          //  doneFromDate && doneToDate
        ) {
          changeModalState(false);
          setDateTimePickerStatus(false);
          dispatch(
            updateViewStatementsData(
              token,
              props.navigation,
              props.route.params?.data?.account,
              props.route.params?.data?.accountType,
              fromDate,
              toDate,
              true,
            ),
          );
          setFromDate('');
          setToDate('');
          setDone(false);
          setDoneFromDate(false);
          setDoneToDate(false);
        }
      } else {
        changeModalState(false);
        setDateTimePickerStatus(false);
        setFromDate('');
        setToDate('');
        setTimeout(
          () => {
            dispatch(
              setAppAlert(
                'Invalid Date Order Selected, Kindly try again.',
                'View Account Details',
                props.navigation,
                () => {
                  setFromDate('');
                  setToDate('');
                },
              ),
            );
          },
          Platform.OS === 'ios' ? 500 : 100,
        );
      }
    }
  }, [fromDate, toDate, doneFromDate, doneToDate]);
  React.useEffect(() => {
    props.navigation.addListener('focus', () => {
      async function analyticsLog() {
        await analytics().logEvent('ViewAccountDetailScreen');
      }
      analyticsLog();

      logs.log(`
        ViewAccountsDetails item is :
        ${JSON.stringify(props.route.params?.data)},
        routedData :
        ${JSON.stringify(routedData)},
      `);
      dispatch(setCurrentFlow('View Accounts'));
    });
  }, []);
  // render function
  var today = moment();
  var startdate = today.subtract(Number(viewLastDays), 'days');
  startdate = startdate.format('MM-DD-YYYY');

  const renderFlatList = ({item}) => {
    // console.log('renderFlatList>>>>>>>>>>', item);
    let convertedDate = new Date(item.transactiondate).toLocaleDateString(
      'en-US',
      {
        year: 'numeric',
        month: 'long',
        day: '2-digit',
      },
    );
    // logs.log('convertedDate>>>>>>', convertedDate);
    return viewAccountStatementData?.data?.transactions.length > 1 ? (
      <TouchableOpacity
        accessibilityLabel="Press to open Transaction Details"
        onPress={() => {
          logs.log('asdasdsad--==>', item);
          if (viewAccountStatementData?.data?.transactions.length > 1) {
            // props.navigation.navigate('TransactionDetail', {data: item});
            dispatch(
              changeGlobalTransferAlertState(true, props.navigation, {
                paymentType: item.transactiondesc,
                purposeOfPayment: item?.purposeOfPayment
                  ? item?.purposeOfPayment
                  : false,
                amount: item?.amount,
                endBalance: `${item?.endbalance}`,
                transactiondesc: item.transactiondesc,
                drcr: item.drcr,
                chequeno: '-',
                showTime: false,
                currentDate: item.transactiondate,
                transactionDetail: item.transactiondetail,
                error: item.error,
                onPressClose: () => {
                  dispatch(closeGlobalTransferAlert(false));
                },
              }),
            );
          }
        }}>
        <View
          style={{
            width: '88%',
            alignSelf: 'center',
            borderWidth: 0.5,
            borderColor: Colors.textFieldBorderColor,
            backgroundColor: Colors.subContainer,
            padding: wp(3),
            top: wp(1),
            borderRadius: wp(1),
          }}>
          <View
            style={[{flexDirection: 'row', justifyContent: 'space-between'}]}>
            <CustomText
              numberOfLines={1}
              style={[
                globalStyling.textFontBold,
                {fontSize: wp(3.8), width: wp(40)},
              ]}>
              {item.transactiondesc}
            </CustomText>
            <CustomText style={[globalStyling.textFontNormal]}>
              {convertedDate}
            </CustomText>
          </View>
          <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
            <CustomText
              style={[
                globalStyling.textFontBold,
                {
                  color: item.drcr === 'Credit' ? '#33ad74' : '#ff4d72',
                  fontSize: wp(4.8),
                },
              ]}>
              Rs. {currencyFormat(Number(item.amount))}
            </CustomText>
            <CustomText
              style={[globalStyling.textFontBold, {fontSize: wp(4.8)}]}>
              Rs. {currencyFormat(Number(item.endbalance))}
            </CustomText>
          </View>
          <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
            <CustomText
              style={[globalStyling.textFontNormal, {color: Colors.labelGrey}]}>
              Amount
            </CustomText>
            <CustomText
              style={[globalStyling.textFontNormal, {color: Colors.labelGrey}]}>
              Balance
            </CustomText>
          </View>
        </View>
        <View style={{height: wp(2)}} />

        {/* //////////////////////////////////////////////////// */}

        {/* ///////////////////////////////////////////////////////////// */}
      </TouchableOpacity>
    ) : null;
  };
  const onDone = (dateSelected) => {
    if (dateToBeSelected === 'From Date') {
      setDateTimePickerStatus(false);
      // setFromDate(moment(dateSelected).format('MM-DD-YYYY'));
      if (fromDate !== '' && toDate !== '') {
        changeModalState(false);
      } else {
        changeModalState(true);
      }
    } else if (dateToBeSelected === 'To Date') {
      setDateTimePickerStatus(false);
      // setToDate(moment(dateSelected).format('MM-DD-YYYY'));

      if (fromDate !== '' && toDate !== '') {
        changeModalState(false);
      } else {
        changeModalState(true);
      }
    } else {
      setDateTimePickerStatus(false);
    }
  };
  //ends render function
  return (
    <View
      style={[styles.container, {backgroundColor: Colors.backgroundColor}]}
      accessibilityLabel="Account Details">
      {/* <GlobalHeader navigation={props.navigation} /> */}
      <SubHeader
        navigation={props.navigation}
        title={'View Accounts'}
        description={'Account Details'}
        // viewAccounts={true}
      />

      <View
        style={{
          alignSelf: 'center',
          justifyContent: 'flex-start',
          // elevation: 6,
          borderRadius: 10,
          width: wp(90),
          backgroundColor: Colors.subContainer,
          marginTop: wp(6),
          padding: wp(3),
        }}>
        <View style={{height: wp(1)}} />
        <View
          style={{
            // height: wp(10),
            backgroundColor: Colors.childContainer,
            width: wp(80),
            alignSelf: 'center',
            borderRadius: wp(1.5),
            padding: wp(4),
          }}>
          <CustomText
            style={{
              padding: wp(1),
              color: '#9ea3a6',
              textAlign: isRtlState() ? 'left' : 'right',
            }}>
            IBAN
          </CustomText>
          <CustomText
            boldFont={true}
            style={{
              padding: wp(1),
              fontSize: wp(4.4),
              textAlign: isRtlState() ? 'left' : 'right',
            }}>
            {routedData?.iban}
          </CustomText>
          {/* <View style={{}} /> */}
          <CustomText
            style={{
              padding: wp(1),
              color: '#9ea3a6',
              textAlign: isRtlState() ? 'left' : 'right',
            }}>
            Account Balance
          </CustomText>
          <CustomText
            boldFont={true}
            style={{
              padding: wp(1),
              fontSize: wp(5),
              textAlign: isRtlState() ? 'left' : 'right',
            }}>
            Rs.
            {balance === '' || !balance ? '' : currencyFormat(Number(balance))}
          </CustomText>
          {/* remove by huyoon
          <CustomText style={{padding: wp(1), color: '#9ea3a6'}}>
            Account Number
          </CustomText>
          <CustomText boldFont={true} style={{padding: wp(1), fontSize: wp(5)}}>
            {routedData?.account}
          </CustomText> */}
        </View>
      </View>
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-around',
          alignItems: 'center',
          margin: wp(4),
        }}>
        <TouchableOpacity
          onPress={() => {
            changeCurrentModal('select');
            setTimeout(() => {
              changeModalState(!showModalState);
            }, 500);
          }}
          style={{
            backgroundColor: Colors.subContainer,
            height: wp(13),
            justifyContent: 'center',
            alignItems: 'center',
            width: wp(40),
            borderColor: Colors.textFieldBorderColor,
            borderWidth: 0.5,
            borderRadius: wp(1),
          }}>
          <CustomText style={[globalStyling.textFontBold]}>
            Select Dates
          </CustomText>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => {
            dispatch(
              sendEmailStatementData(
                token,
                props.navigation,
                props.route.params?.data?.account,
                props.route.params?.data?.accountType,
                lessDays,
                todaysDate === ''
                  ? moment(new Date()).format('MM-DD-YYYY')
                  : todaysDate,
              ),
            );
          }}
          style={{
            backgroundColor: Colors.subContainer,
            height: wp(13),
            justifyContent: 'center',
            alignItems: 'center',
            width: wp(40),
            borderColor: Colors.textFieldBorderColor,
            borderWidth: 0.5,
            borderRadius: wp(1),
          }}>
          <CustomText style={[globalStyling.textFontBold]}>
            Email Statement
          </CustomText>
        </TouchableOpacity>
        {/* <CustomBtn
          color={Colors.blackColor}
          btn_width={'49%'}
          backgroundColor={Colors.whiteColor}
          btn_txt={'Select Dates'}
          fontSize={wp(3)}
         
        /> */}
        {/* <CustomBtn
          btn_width={'49%'}
          color={Colors.blackColor}
          backgroundColor={Colors.whiteColor}
          btn_txt={'Email Statement'}
          fontSize={wp(3.5)}
          onPress={() => {
            dispatch(
              sendEmailStatementData(
                token,
                props.navigation,
                props.route.params?.data?.account,
                props.route.params?.data?.accountType,
                lessDays,
                todaysDate === ''
                  ? moment(new Date()).format('MM-DD-YYYY')
                  : todaysDate,
              ),
            );
          }}
        /> */}
      </View>
      {show10Trans ? (
        <CustomText
          boldFont={true}
          style={{
            fontSize: wp(5),
            marginLeft: isRtlState() ? wp(0) : wp(6),
            marginRight: isRtlState() ? 0 : wp(6),
            padding: wp(2),
          }}>
          Last 10 Days Transactions
        </CustomText>
      ) : (
        <CustomText
          boldFont={true}
          style={{fontSize: wp(5), marginLeft: wp(6), padding: wp(2)}}>
          {`${moment(displayFromDate).format('DD MMM YYYY')} - ${moment(
            displayToDate,
          ).format('DD MMM YYYY')}`}
        </CustomText>
      )}

      {viewAccountStatementData?.data?.transactions?.length === 0 ? (
        <View style={styles.seperator} />
      ) : null}

      <FlatList
        accessible={true}
        data={viewAccountStatementData?.data?.transactions}
        keyExtractor={(item, index) => index.toString()}
        renderItem={(item) => renderFlatList(item)}
        ListFooterComponent={
          viewAccountStatementData?.data?.transactions.length >
          1 ? null : loader ? null : (
            <CustomText style={styles.headingText}>
              No Transaction To Show.
            </CustomText>
          )
        }
      />
      <CustomModal
        visible={showModalState}
        headtext={'Select Dates'}
        data={
          currentModal === 'view'
            ? [
                {id: 1, text: '10 Days'},
                {id: 2, text: '20 Days'},
                {id: 3, text: '30 Days'},
                {id: 4, text: '60 Days'},
                {id: 5, text: '90 Days'},
              ]
            : [
                {
                  id: 1,
                  text: fromDate ? fromDate : 'From Date',
                },
                {
                  id: 2,
                  text: toDate ? toDate : 'To Date',
                },
              ]
        }
        onPress_item={(param) => {
          changeModalState(false);
          if (currentModal === 'view') {
            setViewLastDays(param?.text.split(' ')[0]);
            setLessDays(
              moment(new Date())
                .subtract(Number(param?.text.split(' ')[0]), 'days')
                .format('MM-DD-YYYY'),
            );
            setTodaysDate('');
            var td = moment();
            td = td.subtract(Number(String(param?.text).split(' ')[0]), 'days');
            dispatch(
              updateViewStatementsData(
                token,
                props.navigation,
                props.route.params?.data?.account,
                props.route.params?.data?.accountType,
                moment(td).format('MM-DD-YYYY'),
                moment(new Date()).format('MM-DD-YYYY'),
                true,
              ),
            );
          } else {
            if (String(param.text).includes('From')) {
              logs.log('From Date');
              setDateToBeSelected('From Date');
            } else {
              setDateToBeSelected('To Date');
            }
            setTimeout(
              () => {
                setDateTimePickerStatus(true);
              },
              Platform.OS === 'ios' ? 500 : 100,
            );
          }
        }}
        onCancel={() => changeModalState(false)}
      />
      <CustomAlert
        overlay_state={showAlertState}
        onCancel={() => changeAlertState(false)}
        onPressOkay={() => {
          changeAlertState(false);
        }}
        title="Account Overview"
        alert_text={
          fromDate === '' || toDate === ''
            ? 'Required Parameters Not Provided'
            : 'Are you sure you want to logout?'
        }
      />
      {dateTimePickerStatus && Platform.OS === 'android' ? (
        <View>
          {Platform.OS === 'android' ? null : (
            <Text
              style={styles.iosDoneLabel}
              onPress={() => {
                {
                  if (dateToBeSelected === 'From Date') {
                    setDoneFromDate(true);
                  } else {
                    setDoneToDate(true);
                  }
                  onDone();
                }
              }}>
              Done
            </Text>
          )}
          <DateTimePicker
            // value={past}
            value={
              dateToBeSelected === 'From Date'
                ? fromDate === ''
                  ? past
                  : moment(displayFromDate).toDate()
                : toDate === ''
                ? past
                : moment(displayToDate).toDate()
            }
            maximumDate={new Date()}
            // date={past}
            display={'spinner'}
            mode="date"
            textColor="black"
            onChange={(event, dateSelected) => {
              if (
                dateToBeSelected === 'From Date' &&
                event.type !== 'dismissed'
              ) {
                {
                  Platform.OS === 'android'
                    ? setDateTimePickerStatus(false)
                    : null;
                }
                logs.log('dateToBeSelected', dateToBeSelected);
                setFromDate(moment(dateSelected).format('MM-DD-YYYY'));
                setLessDays(moment(dateSelected).format('MM-DD-YYYY'));
                setDisplayFromDate(dateSelected);
                if (Platform.OS === 'android' && toDate === '') {
                  changeModalState(true);
                }
                logs.debug('from changed');
              } else if (
                dateToBeSelected === 'To Date' &&
                event.type !== 'dismissed'
              ) {
                setShow10Trans(false);
                {
                  Platform.OS === 'android'
                    ? setDateTimePickerStatus(false)
                    : null;
                }
                setToDate(moment(dateSelected).format('MM-DD-YYYY'));
                setTodaysDate(moment(dateSelected).format('MM-DD-YYYY'));

                setDisplayToDate(dateSelected);
                if (fromDate === '' && Platform.OS === 'android') {
                  changeModalState(true);
                }
                logs.debug('todate changed ', dateToBeSelected);
              } else {
                setDateTimePickerStatus(false);
              }
            }}
          />
        </View>
      ) : null}
      {Platform.OS === 'android' ? null : (
        <IOSDatePicker
          date={past}
          isVisible={dateTimePickerStatus}
          mode="date"
          maximumDate={new Date()}
          onConfirm={(dateSelected) => {
            if (dateToBeSelected === 'From Date') {
              setLessDays(moment(dateSelected).format('MM-DD-YYYY'));
              setFromDate(moment(dateSelected).format('MM-DD-YYYY'));
              setDisplayFromDate(dateSelected);
              setDateTimePickerStatus(false);
              if (toDate === '') {
                setTimeout(
                  () => {
                    changeModalState(true);
                  },
                  Platform.OS === 'ios' ? 500 : 100,
                );
              }
            } else if (dateToBeSelected === 'To Date') {
              setShow10Trans(false);
              setTodaysDate(moment(dateSelected).format('MM-DD-YYYY'));
              setToDate(moment(dateSelected).format('MM-DD-YYYY'));
              setDisplayToDate(dateSelected);
              setDateTimePickerStatus(false);
              if (fromDate === '') {
                setTimeout(
                  () => {
                    changeModalState(true);
                  },
                  Platform.OS === 'ios' ? 500 : 100,
                );
              }
            }
          }}
          onCancel={() => {
            setDateTimePickerStatus(false);
          }}
        />
      )}
    </View>
  );
});
export default ViewAccountsDetails;
