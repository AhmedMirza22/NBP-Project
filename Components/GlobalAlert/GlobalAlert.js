import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Platform,
  Alert,
  Image,
  Linking,
} from 'react-native';
import {useSelector, useDispatch} from 'react-redux';
import Modal from 'react-native-modal';
import {wp} from '../../Constant';
import {
  changeGlobalAlertState,
  logOutOfAccount,
} from '../../Redux/Action/Action';
import {Colors, Images} from '../../Theme';
import CustomBtn from '../ModalButton/ModalButton';
import {fontFamily} from '../../Theme/Fonts';
import AntDesign from 'react-native-vector-icons/AntDesign';
import CustomText from '../CustomText/CustomText';
import {logs} from '../../Config/Config';
import I18n from '../../Config/Language/LocalizeLanguageString';
const GlobalAlert = (props) => {
  const globalAlertState = useSelector(
    (state) => state.reducers.globalAlertState,
  );
  const dispatch = useDispatch();
  const getYesNoAlert = () => {
    Alert.alert(
      globalAlertState.props?.title
        ? globalAlertState.props?.title
        : I18n['Logout'],
      globalAlertState.props?.alert_text
        ? globalAlertState.props?.alert_text
        : globalAlertState?.logoutAlert?.title
        ? globalAlertState?.logoutAlert?.title
        : I18n['Are you sure you want to logout?'],
      [
        {
          text: I18n['Yes'],
          onPress: () => {
            if (globalAlertState.props) {
              globalAlertState.props.onPressYes();
            } else {
              dispatch(changeGlobalAlertState(false));

              setTimeout(() => {
                dispatch(logOutOfAccount(globalAlertState.navigation));
              }, 200);
              if (globalAlertState?.logoutAlert?.url) {
                Linking.openURL(globalAlertState?.logoutAlert?.url);
              }
            }
          },
        },
        {
          text: I18n['No'],
          onPress: () => {
            if (globalAlertState.props) {
              globalAlertState.props.onPressNo();
            } else {
              dispatch(changeGlobalAlertState(false));
            }
          },
        },
      ],
    );
  };
  return Platform.OS === 'android' ? (
    <Modal
      animationIn="slideInRight"
      animationOut="slideOutRight"
      backdropOpacity={0.3}
      isVisible={globalAlertState.state}
      onBackdropPress={() => {}}>
      {/* <View style={styles.mainView}> */}
      {globalAlertState.props ? (
        <View
          style={{
            backgroundColor: Colors.alertBackGroundColor,
            padding: wp(3),
            borderRadius: wp(1),
          }}>
          <AntDesign
            onPress={() => {
              globalAlertState.props.onPressNo();
            }}
            name={'closecircle'}
            size={wp(6)}
            color={Colors.themeGrey}
            style={{alignSelf: 'flex-end'}}
          />
          <Image
            source={Images.alertIcon}
            style={{alignSelf: 'center', width: wp(15), height: wp(15)}}
          />
          <CustomText
            boldFont={true}
            style={{
              fontSize: wp(7),
              alignSelf: 'center',
              padding: wp(4),
              fontFamily: fontFamily['ArticulatCF-DemiBold'],
            }}>
            Alert
          </CustomText>
          {/* <Text
            style={{
              fontSize: wp(4.2),
              paddingVertical: wp(1),
            }}>
            {globalAlertState.props.title}
          </Text> */}
          {/* <View style={styles.seperator} /> */}
          <CustomText
            style={{
              fontFamily: fontFamily['ArticulatCF-Normal'],
              fontSize: wp(4.2),
              textAlign: 'center',
              paddingVertical: wp(3),
            }}>
            {globalAlertState.props.alert_text}
          </CustomText>
          <View
            style={{
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'space-around',
              width: '80%',
              alignSelf: 'center',
            }}>
            <View style={{height: wp(6)}} />

            <CustomBtn
              btn_txt={'No'}
              onPress={() => {
                globalAlertState.props.onPressNo();
              }}
              btn_width={wp(70)}
              backgroundColor={Colors.themeGrey}
              color={'black'}
            />
            <View style={{height: wp(4)}} />

            <CustomBtn
              btn_txt={'Yes'}
              onPress={() => {
                globalAlertState.props.onPressYes();
              }}
              // btn_width={width / 3.5}
              btn_width={wp(70)}
              backgroundColor={Colors.primary_green}
            />
          </View>
        </View>
      ) : (
        <View
          style={{
            backgroundColor: Colors.alertBackGroundColor,
            borderRadius: wp(1),
          }}>
          <CustomText
            style={{
              fontSize: wp(4.5),
              padding: wp(5),
              textAlign: 'left',
              // color: Colors.mainTextColors,
            }}>
            {globalAlertState?.logoutAlert?.title
              ? globalAlertState?.logoutAlert?.title
              : 'Are you sure you want to logout?'}
          </CustomText>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'flex-end',
              alignItems: 'center',
              padding: wp(2),
              paddingBottom: wp(4),
            }}>
            <CustomText
              boldFont={true}
              style={[
                styles.defaultAlertText,
                {color: Colors.alertThemeTextColor},
              ]}
              onPress={() => dispatch(changeGlobalAlertState(false))}>
              {I18n['No']}
            </CustomText>
            <CustomText
              boldFont={true}
              style={[
                styles.defaultAlertText,
                {color: Colors.alertThemeTextColor},
              ]}
              onPress={() => {
                logs.log('globalAlertState.url', globalAlertState.url);
                dispatch(changeGlobalAlertState(false));
                setTimeout(() => {
                  dispatch(logOutOfAccount(globalAlertState.navigation));
                }, 200);
                globalAlertState.logoutAlert?.url
                  ? Linking.openURL(globalAlertState?.logoutAlert?.url)
                  : null;
              }}>
              {I18n['Yes']}
            </CustomText>
          </View>
        </View>
      )}
      {/* </View> */}
    </Modal>
  ) : globalAlertState.state ? (
    <View>{getYesNoAlert()}</View>
  ) : (
    <View></View>
  );
};
export default GlobalAlert;
const styles = StyleSheet.create({
  okayImage: {
    width: wp(50),
    height: wp(15),
    overflow: 'hidden',
    alignSelf: 'center',
  },
  mainView: {
    backgroundColor: 'white',
    paddingVertical: wp(1.5),
    paddingHorizontal: wp(3),
    justifyContent: 'center',
    borderRadius: wp(1),
  },
  rowView: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  alertText: {
    fontSize: wp(4.2),
    textAlign: 'center',
    marginVertical: wp(5),
    width: '97%',
    alignSelf: 'center',
  },
  titleText: {
    fontSize: wp(4.3),
  },
  seperator: {
    width: '99%',
    alignSelf: 'center',
    borderWidth: wp(0.2),
    borderColor: 'grey',
  },
  defaultAlertText: {
    paddingVertical: wp(2),
    paddingHorizontal: wp(4),
    marginHorizontal: wp(1),
    fontSize: wp(4.2),
    color: Colors.primary_green,
    // fontWeight: 'bold',
  },
});
