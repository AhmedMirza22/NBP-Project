import React, {useEffect, useState, useContext} from 'react';
import {
  View,
  Dimensions,
  Text,
  Image,
  ScrollView,
  Alert,
  KeyboardAvoidingView,
  TouchableNativeFeedbackBase,
  StyleSheet,
} from 'react-native';
import Modal from 'react-native-modal';
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
import {changeGlobalIconAlertState} from '../../Redux/Action/Action';
import {
  NotificationScreenContext,
  useNotification,
} from '../../Containers/Context';
import {logs} from '../../Config/Config';
import OneSignal from 'react-native-onesignal';
// import {NotificationScreenContext} from '../../Context/index';

const CustomIconAlert = (props) => {
  // const {updateNotificationScreen, notificationScreen} = useNotification();

  // useEffect(() => {
  //   OneSignal.setNotificationOpenedHandler((openedEvent) => {
  //     let notificationData;
  //     if (
  //       openedEvent?.notification?.additionalData?.consumerNo &&
  //       openedEvent?.notification?.additionalData?.ucid
  //     ) {
  //       // Case where specific additional data fields are present
  //       notificationData = openedEvent?.notification;
  //       logs.log(notificationData, 'notificationDataBillIntimation');
  //       updateNotificationScreen(notificationData);
  //     } else {
  //       // General case for handling other types of notifications
  //       logs.log('Notification opened:', openedEvent);
  //       const notificationData =
  //         openedEvent?.notification?.additionalData?.data;

  //       // Check if notificationData is a valid JSON string
  //       if (notificationData && typeof notificationData === 'string') {
  //         try {
  //           const parseData = JSON.parse(notificationData);
  //           logs.log('Notification opened RTP REQUEST:', parseData);
  //           updateNotificationScreen(parseData);
  //         } catch (error) {
  //           logs.log('Error parsing notification data:', error);
  //         }
  //       } else {
  //         logs.log(
  //           'Notification data is not valid JSON or missing:',
  //           notificationData,
  //         );
  //       }
  //     }
  //     OneSignal.getDeviceState()
  //       .then((deviceState) => {
  //         logs.log('Device State:', deviceState);
  //       })
  //       .catch((error) => {
  //         logs.log('Error getting Device State:', error);
  //       });
  //   });
  // }, []);

  // logs.log('CustomIconAlert------>', notificationScreen);
  // logs.log('updateNotificationScreen------>', updateNotificationScreen);

  const dispatch = useDispatch();
  const globalIconAlerState = useSelector(
    (state) => state.reducers.globalIconAlerState,
  );
  const onPresshandle = () => {
    dispatch(
      changeGlobalIconAlertState(false, globalIconAlerState.navigation, {
        removeAlert: globalIconAlerState?.props?.removeAlert ? true : false,
        successAlert: globalIconAlerState?.props?.successAlert ? true : false,
      }),
    );
    globalIconAlerState?.props.onPressOk();
  };
  return (
    <Modal
      // animationIn="slideInDown"
      // animationOut="bounceOutDown"
      // onBackButtonPress={() => {
      //   setTimeout(() => {
      //     globalIconAlerState?.props.onPressCancel
      //       ? globalIconAlerState?.props.onPressCancel()
      //       : null;
      //   }, 300);
      // }}onBa
      onBackdropPress={() => {}}
      isVisible={globalIconAlerState.state}
      backdropOpacity={0.3}
      // animationInTiming={2}
      // animationOutTiming={2}
    >
      <View
        style={{
          width: wp(90),
          alignSelf: 'center',
          backgroundColor: Colors.subContainer,
          borderRadius: wp(1),
        }}>
        <View style={{height: wp(4)}} />
        <Image
          source={
            globalIconAlerState.props?.successAlert
              ? Images.successAlert
              : globalIconAlerState.props?.removeAlert
              ? Images.removeAlert
              : Images.alertIcon
          }
          style={{width: wp(15), height: wp(15), alignSelf: 'center'}}
        />
        <View style={{height: wp(4)}} />
        <CustomText
          style={{alignSelf: 'center', fontSize: wp(6)}}
          boldFont={true}>
          {globalIconAlerState.props?.customTitle
            ? globalIconAlerState.props?.customTitle
            : globalIconAlerState.props?.successAlert
            ? 'Success'
            : globalIconAlerState.props?.removeAlert
            ? 'Deleted'
            : 'Alert'}
        </CustomText>
        <View style={{height: wp(4)}} />
        <CustomText
          style={{
            alignSelf: 'center',
            fontSize: wp(4),
            textAlign: 'center',
            width: wp(80),
          }}>
          {globalIconAlerState.props?.message}
        </CustomText>
        <View style={{height: wp(4)}} />
        <CustomBtn
          btn_txt={
            globalIconAlerState.props?.AlertButtonText
              ? globalIconAlerState.props?.AlertButtonText
              : 'OK'
          }
          onPress={() =>
            globalIconAlerState?.props.onPressOk
              ? onPresshandle()
              : dispatch(
                  changeGlobalIconAlertState(
                    false,
                    globalIconAlerState.navigation,
                    {
                      removeAlert: globalIconAlerState?.props?.removeAlert
                        ? true
                        : false,
                      successAlert: globalIconAlerState?.props?.successAlert
                        ? true
                        : false,
                    },
                  ),
                )
          }
          btn_width={wp(80)}
          backgroundColor={Colors.primary_green}
        />
        <View style={{height: wp(4)}} />
      </View>
    </Modal>
  );
};

// define your styles
const styles = StyleSheet.create({
  container: {
    // flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#2c3e50',
  },
});

//make this component available to the app
export default CustomIconAlert;
