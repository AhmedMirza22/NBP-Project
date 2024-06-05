import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  FlatList,
  Image,
  Modal,
  Button,
  ActivityIndicator,
  Platform,
  TouchableWithoutFeedback,
} from 'react-native';
import SubHeader from '../../Components/GlobalHeader/SubHeader/SubHeader';
import CustomText from '../../Components/CustomText/CustomText';
import {globalStyling, wp, hp} from '../../Constant';
import {Colors, Images} from '../../Theme';
import {logs, Config} from '../../Config/Config';
import Entypo from 'react-native-vector-icons/Entypo';
import CustomBtn from '../../Components/Custom_btn/Custom_btn';
import {useDispatch, useSelector} from 'react-redux';
import {
  catchError,
  serviceResponseCheck,
  setLoader,
  setLoginResponse,
  setUserObject,
  updateSessionToken,
} from '../../Redux/Action/Action';
import axios from 'axios';
import {Service, getTokenCall, postTokenCall} from '../../Config/Service';
import GlobalTransferAlert from '../../Components/Custom_Alert/GlobalTransferAlert';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import store from '../../Redux/Store/Store';
import {ScrollView} from 'react-native-gesture-handler';
const Appnotifications = (props) => {
  const dispatch = useDispatch();
  const [daylimit, setDayLimit] = useState(2);
  const userObject = useSelector(
    (state) => state?.reducers?.userObject.notifications,
  );
  const [notificationModal, setNotificationModal] = useState(false);
  const [notificationitem, setNotificationItem] = useState(false);
  const [BannerImgOnly, setBannerImgOnly] = useState();
  const [notificationsArray, setNotificationsArray] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [size, setSize] = useState(10);
  const [totalSize, setTotalSize] = useState(0);
  const [isLoader, setIsLoader] = useState(false);
  //const [ResponseData, setResponseData] = useState();

  useEffect(() => {
    return props.navigation.addListener('focus', () => {
      getNotifications(store.getState().reducers.token);
    });
  }, []);

  //logs.log("nsdnn",notificationsArray[0]?.isOnlyImageType,"nnsnd")

  const getNotifications = async (token) => {
    try {
      setIsLoader(true);
      dispatch(setLoader(true));

      const response = await getTokenCall(
        Service.getNotifications,
        `page=${currentPage}&size=10`,
        token,
      );
      logs.log('response---->', response);
      const responseData = response.data;
      logs.logResponse('yeh send karna hai', responseData);
      if (
        response.data.responseCode === '00' ||
        response.data.responseCode === '200'
      ) {
        logs.log(response?.data?.data?.additionalData, 'maaz');
        dispatch(updateSessionToken(response));
        setIsLoader(false);

        dispatch(setLoader(false));
        let tempData = notificationsArray.concat(
          response?.data?.data?.notifications,
        );
        let tempData2 = tempData.map((item) => {
          return {...item, isRead: true};
        });
        setCurrentPage(currentPage + 1);
        setTotalSize(response?.data?.data?.totalPages);
        setNotificationsArray(tempData2);
      } else {
        dispatch(serviceResponseCheck(response, props.navigation));
        setIsLoader(false);
        dispatch(setLoader(false));
      }
    } catch (error) {
      setIsLoader(false);
      dispatch(setLoader(false));
      logs.log(`screen crash error : ${JSON.stringify(error)}`);
      dispatch(catchError(error));
    }
  };

  const getBillTitleFetch = async (
    ucId,
    consumerNumber,
    beneficiaryType,
    companyName,
  ) => {
    //logs.log(ucId, consumerNumber, 'hhghgh');
    try {
      dispatch(setLoader(true));
      // postTokenCall
      const response = await getTokenCall(
        Service.getOtherBill,
        `consumerNo=${consumerNumber}&ucid=${ucId}`,
        // &isOfflineBiller=${false}`,
      );
      if (response.data.responseCode === '00') {
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
              benefId: response?.data?.data?.benefID,
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
          isNotificationdirectPayment: false,
        };
        dispatch(updateSessionToken(response));
        // success
        dispatch(setLoader(false));
        props?.navigation.navigate('OtherPaymentBill');
      } else {
        dispatch(serviceResponseCheck(response, props.navigation));
      }
    } catch (error) {
      dispatch(catchError(error));
    }
  };

  const renderItem = ({item, id}) => (
    <TouchableWithoutFeedback
      onPress={() => {
        item?.additionalData?.consumerNo && item?.additionalData?.ucid
          ? // setNotificationModal(true),
            // setNotificationItem(item),
            getBillTitleFetch(
              item?.additionalData?.ucid,
              item?.additionalData?.consumerNo,
              item?.additionalData?.beneficiaryType,
              item?.additionalData?.companyName,
            )
          : (setNotificationModal(true),
            setNotificationItem(item),
            setBannerImgOnly(item.isOnlyImageType),
            logs.log(item, 'chechNotification'));
        // logs.log(item?.additionalData?.consumerNo, 'NotificationData');
        //logs.log(item?.additionalData?.ucid, 'NotificationData');

        //  getBillTitleFetch(item?.additionalData?.ucid,item?.additionalData?.consumerNo)

        //  setNotificationModal(true),
        //    setNotificationItem(item),
        //    setBannerImgOnly(item.isOnlyImageType),
        //    logs.log(item,"chechNotification")
      }}>
      <View
        style={{
          backgroundColor: Colors.subContainer,
          width: wp(90),
          alignSelf: 'center',
          marginVertical: wp(2),
          borderRadius: wp(1),
          borderWidth: 0.4,
          borderColor: Colors.labelGrey,
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
                style={{width: '100%', height: '100%', borderRadius: wp(100)}}
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
  const markNotificationAsRead = (notificationId) => {
    const updatedNotifications = notificationsArray.map((notification) => {
      if (notification.notificationId === notificationId) {
        return {...notification, isRead: true};
      }
      // return notification;
      return {...notification, isRead: true};
    });

    setNotificationsArray(updatedNotifications);
  };

  const serviceCall = async (item) => {
    try {
      dispatch(setLoader(true));
      const response = await postTokenCall(
        `${Config.base_url.UAT_URL}my/viewNotification?notificationId=${item.notificationId}`,
        null,
      );
      if (
        (response.status === 200 && response.data.responseCode === '00') ||
        (response.status === 200 && response.data.responseCode === '200')
      ) {
        setNotificationModal(true);
        dispatch(updateSessionToken(response));
        dispatch(setLoader(false));
        markNotificationAsRead(item.notificationId);
        if (!item.isRead) {
          dispatch(
            setLoginResponse({
              ...store.getState().reducers.loginResponse,
              details: {
                ...store.getState().reducers.loginResponse?.details,

                notificationCount:
                  parseInt(
                    store.getState().reducers.loginResponse?.details
                      ?.notificationCount,
                  ) - 1,
              },
            }),
          );
        }
      } else {
        dispatch(serviceResponseCheck(response));
      }
    } catch (error) {
      dispatch(catchError(error));
    }
  };

  return (
    <View style={{flex: 1, backgroundColor: Colors.backgroundColor}}>
      <SubHeader
        title={'Notifications'}
        description={'Instant Updates and Important Notices'}
        navigation={props.navigation}
      />

      <FlatList
        data={notificationsArray}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        onEndReached={() => {
          if (currentPage !== totalSize) {
            getNotifications();
          }
        }}
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
                  right: 0,
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
                {/* <View style={{height: wp(6)}} /> */}
              </ScrollView>
            </View>
          </View>
        )}
      </Modal>
    </View>
  );
};

export default Appnotifications;
