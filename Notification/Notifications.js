import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableWithoutFeedback,
  Image,
  FlatList,
  TouchableOpacity,
  Modal,
  ScrollView,
} from 'react-native';
import SubHeader from '../../Components/GlobalHeader/SubHeader/SubHeader';
import {useDispatch} from 'react-redux';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {
  catchError,
  serviceResponseCheck,
  setLoader,
  setUserObject,
  updateSessionToken,
} from '../../Redux/Action/Action';
import analytics from '@react-native-firebase/analytics';
import {Service, getTokenCall} from '../../Config/Service';
import {hp, wp} from '../../Constant';
import CustomText from '../../Components/CustomText/CustomText';
import {Colors} from '../../Theme';
import {logs} from '../../Config/Config';
import moment from 'moment';
import Entypo from 'react-native-vector-icons/Entypo';
import store from '../../Redux/Store/Store';
import {useTheme} from '../../Theme/ThemeManager';
const MyComponent = (props) => {
  useEffect(() => {
    async function analyticsLog() {
      await analytics().logEvent('NotificationScreen1');
    }
    analyticsLog();
  }, []);

  const dispatch = useDispatch();
  const {activeTheme} = useTheme();
  const [activeTab, setActiveTab] = useState(1);
  const [notificationModal, setNotificationModal] = useState(false);
  const [notificationitem, setNotificationItem] = useState(false);
  const [announcementData, setAnnouncementData] = useState({
    items: [],
    currentPage: -1,
    totalPages: 0,
    isLoading: false,
  });
  const [rtpData, setRtpData] = useState({
    items: [],
    currentPage: -1,
    totalPages: 0,
    isLoading: false,
  });
  const [BannerImgOnly, setBannerImgOnly] = useState(false);
  const fetchAnnouncements = async (page) => {
    if (!announcementData.isLoading) {
      dispatch(setLoader(true));
      setAnnouncementData((prev) => ({...prev, isLoading: true}));
      try {
        const response = await getTokenCall(
          Service.getNotifications,
          `page=${page}&size=10`,
        );
        if (
          response.data.responseCode === '00' ||
          response.data.responseCode === '200'
        ) {
          dispatch(updateSessionToken(response));
          setAnnouncementData((prev) => ({
            ...prev,
            items:
              page === 0
                ? response.data.data.notifications
                : [...prev.items, ...response.data.data.notifications],
            currentPage: page,
            totalPages: response.data.data.totalPages,
            isLoading: false,
          }));
        } else {
          dispatch(serviceResponseCheck(response, props.navigation));
        }
      } catch (error) {
        dispatch(catchError(error));
      }
      dispatch(setLoader(false));
    }
  };

  const fetchRTPRequests = async (page) => {
    if (!rtpData.isLoading) {
      dispatch(setLoader(true));
      setRtpData((prev) => ({...prev, isLoading: true}));
      try {
        const response = await getTokenCall(
          Service.getNotifications,
          `page=${page}&size=10&type=rtp_request`,
        );
        if (
          response.data.responseCode === '00' ||
          response.data.responseCode === '200'
        ) {
          dispatch(updateSessionToken(response));
          setRtpData((prev) => ({
            ...prev,
            items:
              page === 0
                ? response.data.data.notifications
                : [...prev.items, ...response.data.data.notifications],
            currentPage: page,
            totalPages: response.data.data.totalPages,
            isLoading: false,
          }));
        } else {
          dispatch(serviceResponseCheck(response, props.navigation));
        }
      } catch (error) {
        dispatch(catchError(error));
      }
      dispatch(setLoader(false));
    }
  };

  const handleLoadMore = () => {
    const data = activeTab === 1 ? announcementData : rtpData;
    if (!data.isLoading && data.currentPage < data.totalPages - 1) {
      const nextPage = data.currentPage + 1;
      if (activeTab === 1) {
        fetchAnnouncements(nextPage);
      } else {
        fetchRTPRequests(nextPage);
      }
    }
  };

  useEffect(() => {
    fetchAnnouncements(0); // Initial fetch for the Announcements tab
  }, []);

  const tabs = () => (
    <View style={styles.tabContainer}>
      <TouchableOpacity
        onPress={() => {
          setActiveTab(1);
          if (
            announcementData.items.length === 0 &&
            !announcementData.isLoading
          ) {
            fetchAnnouncements(0);
          }
        }}
        style={{
          width: '40%',
          padding: hp(1),
          backgroundColor:
            activeTab === 1 ? Colors.primary_green : Colors.themeGrey,
          justifyContent: 'center',
          alignItems: 'center',
          borderRadius: wp(5),
        }}>
        <CustomText
          style={{
            color: activeTab === 1 ? Colors.whiteColor : Colors.blackColor,
          }}>
          Announcements
        </CustomText>
      </TouchableOpacity>
      <TouchableOpacity
        style={{
          width: '40%',
          padding: hp(1),
          backgroundColor:
            activeTab === 2 ? Colors.primary_green : Colors.themeGrey,
          justifyContent: 'center',
          alignItems: 'center',
          borderRadius: wp(5),
        }}
        onPress={() => {
          setActiveTab(2);
          if (rtpData.items.length === 0 && !rtpData.isLoading) {
            fetchRTPRequests(0);
          }
        }}>
        <CustomText
          style={{
            color: activeTab === 2 ? Colors.whiteColor : Colors.blackColor,
          }}>
          RTP Requests
        </CustomText>
      </TouchableOpacity>
    </View>
  );
  const renderItem = ({item, id}) => (
    <TouchableWithoutFeedback
      onPress={() => {
        logs.log(item?.additionalData, 'checKNotificationyaha');
        // setNotificationModal(true);
        // setNotificationItem(item);
        // setBannerImgOnly(item.isOnlyImageType);
        item?.additionalData?.consumerNo && item?.additionalData?.ucid
          ? getBillTitleFetch(
              item?.additionalData?.ucid,
              item?.additionalData?.consumerNo,
              item?.additionalData?.beneficiaryType,
              item?.additionalData?.companyName,
              item?.additionalData?.benefID,
            )
          : (setNotificationModal(true),
            setNotificationItem(item),
            setBannerImgOnly(item.isOnlyImageType),
            logs.log(item, 'chechNotification'));

        // if (!isLoader) {
        //   serviceCall(item);
        // }
      }}>
      <View
        style={{
          backgroundColor: Colors.subContainer,
          width: wp(90),
          alignSelf: 'center',
          marginVertical: wp(2),
          borderRadius: wp(1),
          borderWidth: 0.4,
          borderColor: Colors.textFieldBorderColor,
        }}>
        <View
          style={{
            padding: 5,
            margin: 10,
            flexDirection: 'row',
            justifyContent: 'space-between',
            // width: wp(90),
          }}
          keyExtractor={id}>
          <View style={{flexDirection: 'row'}}>
            <View
              style={{
                width: wp(12),
                height: wp(12),
                borderRadius: wp(100),
                backgroundColor: Colors.greyInfoShow,
                justifyContent: 'center',
              }}>
              <Image
                source={{
                  uri: item.imageIcon,
                }}
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
            <View style={{width: wp(4)}}></View>
            <View style={{flexDirection: 'column', alignSelf: 'center'}}>
              <CustomText
                boldFont={true}
                numberOfLines={1}
                ellipsizeMode={'tail'}
                style={{
                  fontSize: item.isRead ? wp(4) : wp(5),
                  width: wp(40),
                }}>
                {item.title}
              </CustomText>
              <CustomText
                ellipsizeMode={'tail'}
                boldFont={item.isRead ? false : true}
                numberOfLines={1}
                style={{
                  width: wp(40),
                  fontSize: item.isRead ? wp(3.5) : wp(4.5),
                }}>
                {item.description}
              </CustomText>
            </View>
          </View>
          <View style={{alignSelf: 'center'}}>
            <CustomText
              boldFont={item.isRead ? false : true}
              style={{fontSize: wp(3), color: Colors.primary_green}}>
              {item.dateTime.slice(0, 10)}
            </CustomText>
            {item.isRead ? null : (
              <View
                style={{
                  width: wp(3.5),
                  height: wp(3.5),
                  backgroundColor: Colors.primary_green,
                  borderRadius: wp(100),
                  alignSelf: 'flex-end',
                }}></View>
            )}
          </View>
        </View>
      </View>
    </TouchableWithoutFeedback>
  );

  const renderItemRTP = ({item}) => {
    // logs.log('ITEM---------', item);
    // logs.log('ITEM DAteTime---------', item?.dateTime);
    const payNowData = item?.additionalData;
    // logs.log('payNowDatacheck', payNowData);
    // logs.log('payNowData?additionalData---------', item.status);
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
          backgroundColor: Colors.subContainer,
          marginTop: hp(2),
          paddingHorizontal: wp(2),
          marginHorizontal: wp(4),
          borderWidth: 0.5,
          borderColor: Colors.textFieldBorderColor,
          marginBottom: wp(1.5),
          borderRadius: wp(1),
        }}
        onPress={() => {
          // console.log('Item On PRess....', item);
          console.log('payNowData On PRess....', item?.status);
          const payLaterObject = {
            status: item?.status,
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
            status: item?.status,
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
          // logs.log('Item Pressed:--', payNowObject);
          logs.log('payNowObject payNowObject:--', payNowData);
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
                tintColor: Colors.textFieldText,
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
          <View style={{alignSelf: 'center'}}>
            <Ionicons
              name={'chevron-forward'}
              size={wp(8)}
              color={Colors.tabNavigateLeftIcon}
              style={{alignSelf: 'flex-end'}}
            />
          </View>
        </View>
        {/* Valid Date in Row */}
      </TouchableOpacity>
    );
  };
  const getBillTitleFetch = async (
    ucId,
    consumerNumber,
    beneficiaryType,
    companyName,
    benefID,
  ) => {
    logs.log(
      ucId,
      consumerNumber,
      beneficiaryType,
      companyName,
      benefID,
      'hhghgh',
    );
    try {
      dispatch(setLoader(true));

      // setNotificationScreen(null);
      // postTokenCall
      const response = await getTokenCall(
        Service.getOtherBill,
        `consumerNo=${consumerNumber}&ucid=${ucId}`,
        // &isOfflineBiller=${false}`,
      );
      if (response.data.responseCode === '00') {
        dispatch(updateSessionToken(response));
        // // nullifyObject();
        logs.log(response, 'getBillTitleFetch');
        // setResponseData(response.data.data);
        dispatch(
          setUserObject({
            otherPayment: {
              ...store.getState().reducers.userObject.otherPayment,
              amountAfterDueDate: response?.data?.data?.amountAfterDueDate,
              amountPayable: response?.data?.data?.amountPayable,
              amountWithInDueDate: response?.data?.data?.amountWithInDueDate,
              billMonth: response?.data?.data?.billMonth,
              billStatus: response?.data?.data?.billStatus,
              customerName: response?.data?.data?.customerName,
              dueDate: response?.data?.data?.dueDate,
              token: response?.data?.data?.token,
              consumerNumber: consumerNumber,
              ucId: ucId,
              benefType: beneficiaryType,
              benefId: benefID,
              isNotificationdirectPayment: true,
              companyName: companyName,
              benefTrans: true,
              //consumerNumber: "9751780000"
            },
          }),
        );
        const object = {
          // consumerNumber: "0400043985246",
          // UCID:"KESC0001",
          // benefType:'3',
          // companyName: "K-Electric",
          // isNotificationdirectPayment: false,

          consumerNumber: consumerNumber,
          UCID: ucId,
          benefType: beneficiaryType,
          companyName: companyName,
          benefID: benefID,

          isNotificationdirectPayment: true,
        };

        // success
        dispatch(setLoader(false));
        logs.log('Object-----', object);
        props?.navigation.navigate('OtherPaymentBill');
      } else {
        dispatch(serviceResponseCheck(response, props.navigation));
        // // // nullifyObject();
      }
    } catch (error) {
      dispatch(catchError(error));
    }
  };

  logs.log('notificationitem.imageUrl', notificationitem.imageUrl);
  return (
    <View style={{flex: 1, backgroundColor: Colors.backgroundColor}}>
      <SubHeader
        title={'Notifications'}
        description={'Instant Updates and Important Notices'}
        navigation={props.navigation}
      />
      {tabs()}
      <FlatList
        data={activeTab === 1 ? announcementData.items : rtpData.items}
        renderItem={activeTab === 1 ? renderItem : renderItemRTP}
        keyExtractor={(item, index) => index.toString()}
        onEndReached={handleLoadMore}
        onEndReachedThreshold={0.5}
      />
      <Modal
        animationType="slide"
        transparent={true}
        visible={notificationModal}
        onRequestClose={() => {
          setNotificationModal(false);
        }}>
        {BannerImgOnly ? (
          <View
            style={{
              flex: 1,
              justifyContent: 'center',
              alignItems: 'center',
              backgroundColor: 'rgba(0,0,0,0.7)',
            }}>
            <View style={{width: '100%', paddingHorizontal: wp(5)}}>
              <Entypo
                name={'circle-with-cross'}
                size={wp(7)}
                color={Colors.blackColor}
                style={{
                  alignSelf: 'flex-end',
                  zIndex: 1,
                  top: wp(9),
                  right: wp(3),
                  // padding: wp(10),
                }}
                onPress={() => setNotificationModal(false)}
              />
              {/* <View
                style={{
                  backgroundColor: Colors.whiteColor,
                  borderRadius: wp(4),
                }}> */}
              <Image
                style={{
                  width: wp(90),
                  //marginRight:wp(5),
                  height: 400,
                  borderRadius: wp(2),
                  resizeMode: 'stretch',
                }}
                source={{
                  uri: notificationitem.imageUrl,
                }}
              />
              {/* </View> */}
            </View>
          </View>
        ) : (
          <View
            style={{
              flex: 1,
              justifyContent: 'center',
              alignItems: 'center',
              backgroundColor: 'rgba(0,0,0,0.7)',
            }}>
            <View style={{width: '100%', paddingHorizontal: wp(5)}}>
              <Entypo
                name={'circle-with-cross'}
                size={wp(7)}
                color={Colors.blackColor}
                style={{
                  alignSelf: 'flex-end',
                  zIndex: 1,
                  right: 0,
                  top: wp(9),
                  right: wp(3),
                  // padding: wp(10),
                }}
                onPress={() => setNotificationModal(false)}
              />
              <View
                style={{
                  backgroundColor: Colors.whiteColor,
                  borderTopLeftRadius: wp(4),
                  borderTopRightRadius: wp(4),
                }}>
                <Image
                  style={{
                    width: '100%',
                    height: 200,
                    borderTopLeftRadius: wp(4),
                    borderTopRightRadius: wp(4),
                  }}
                  source={{
                    uri: notificationitem.imageUrl,
                  }}
                />
              </View>
              <ScrollView
                style={{
                  backgroundColor: Colors.subContainer,
                  height: hp(25),
                  paddingHorizontal: wp(5),

                  // padding: wp(2),
                  // marginTop: wp(3),
                  borderBottomLeftRadius: wp(3),
                  borderBottomRightRadius: wp(3),
                }}>
                <View style={{height: wp(7)}} />
                <CustomText
                  boldFont={true}
                  style={{textAlign: 'center', fontSize: wp(6)}}>
                  {notificationitem.title}
                </CustomText>
                <CustomText
                  style={{
                    textAlign: 'center',
                    padding: wp(2),
                    fontSize: wp(4),
                  }}>
                  {notificationitem.description}
                </CustomText>
              </ScrollView>
            </View>
          </View>
        )}
      </Modal>
    </View>
  );
};

// Styles as previously defined...

export default MyComponent;
const styles = StyleSheet.create({
  tabContainer: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    marginTop: 20, // Adjust the top margin as needed
    paddingVertical: 10, // Padding for better touch area
    // backgroundColor: '#f0f0f0', // Light grey background for the tab area
  },
  activeTab: {
    width: '48%', // Slightly less than half width to fit two tabs within container
    paddingVertical: 10, // Vertical padding to increase height of the tab
    backgroundColor: '#00aaff', // Primary color for active tab
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10, // Rounded corners for tabs
    shadowColor: '#000', // Shadow to lift the tab off the container visually
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  inactiveTab: {
    width: '48%',
    paddingVertical: 10,
    backgroundColor: '#cccccc', // Grey color for inactive tab
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
  },
  activeTabText: {
    color: '#ffffff', // White text for active tab
    fontWeight: 'bold', // Bold text to emphasize active tab
  },
  inactiveTabText: {
    color: '#666666', // Dark grey text for inactive tab
    fontWeight: 'normal',
  },
});
