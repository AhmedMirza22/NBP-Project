import {View, TouchableOpacity, Image, Dimensions} from 'react-native';
import React, {useState} from 'react';
import Icon from 'react-native-vector-icons/Feather';
import Icon2 from 'react-native-vector-icons/MaterialCommunityIcons';
import CustomAlert from '../Custom_Alert/CustomAlert';
import {Images, Colors} from '../../Theme';
import styles from './GlobalHeaderStyle';
import {CommonActions} from '@react-navigation/native';
import {
  changeGlobalAlertState,
  logOutOfAccount,
} from '../../Redux/Action/Action';
import {globalStyling, wp} from '../../Constant';
import {useDispatch} from 'react-redux';

const GlobalHeader = (props) => {
  const [showLogoutAlert, changeLogoutAlertState] = useState(false);
  const dispatch = useDispatch();
  return (
    <View style={{backgroundColor: 'white'}}>
      <View style={styles.row}>
        {props.hideBoth ? (
          <View style={wp(6.5)}></View>
        ) : (
          <TouchableOpacity
            style={{
              width: wp(15),
              // height: wp(10),
              justifyContent: 'center',
            }}
            onPress={() => {
              props.navigation?.toggleDrawer();
            }}>
            <Icon name="menu" size={wp(6.5)} color={Colors.dash_icon_color} />
          </TouchableOpacity>
        )}
        <View />

        <View />
        <View style={styles.imageView}>
          <Image source={Images.main_logo} style={styles.imageStyle} />
        </View>
        {/* <View /> */}
        <View />

        <View />
        <View style={{flex: 0.1}}>
          {props.hideBoth ? null : (
            <TouchableOpacity
              style={{
                width: wp(12),
                height: wp(10),
                justifyContent: 'center',
                alignItems: 'center',
                borderRadius: wp(5),
                overflow: 'hidden',
              }}
              onPress={() => {
                // changeLogoutAlertState(true);
                // setTimeout(() => {
                dispatch(changeGlobalAlertState(true, props.navigation));
                // }, 500);
              }}>
              <Icon2
                name="power"
                size={wp(5)}
                color={Colors.dash_icon_color}
                style={{
                  backgroundColor: 'lightgrey',
                  opacity: 0.7,
                  padding: wp(2),
                  borderRadius: wp(1),
                }}
              />
            </TouchableOpacity>
          )}
        </View>
      </View>
      <CustomAlert
        overlay_state={showLogoutAlert}
        onCancel={() => changeLogoutAlertState(false)}
        onPressCancel={() => changeLogoutAlertState(false)}
        yesNoButtons={true}
        onPressYes={() => {
          changeLogoutAlertState(false);
          // dispatch(logOutOfAccount(props.navigation));

          // props.navigation.dispatch(
          //   CommonActions.reset({
          //     index: 0,
          //     routes: [{name: 'Login'}],
          //   }),
          // );
        }}
        onPressNo={() => {
          changeLogoutAlertState(false);
        }}
        alert_text={'Are you sure you want to logout?'}
        defaultAlert={true}
      />
    </View>
  );
};

export default GlobalHeader;
