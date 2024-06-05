import React, {useEffect} from 'react';
import {Platform} from 'react-native';
import {
  View,
  Image,
  StyleSheet,
  BackHandler,
  Text,
  TouchableWithoutFeedback,
} from 'react-native';
import {useDispatch} from 'react-redux';
import {useSelector} from 'react-redux';
import {wp, hp, globalStyling} from '../../Constant';
import {sessionAlert} from '../../Redux/Action/Action';
import {Colors, Images} from '../../Theme';
import {fontFamily} from '../../Theme/Fonts';
import Custom_btn from '../Custom_btn/Custom_btn';
import {useTheme} from '../../Theme/ThemeManager';
import CustomText from '../CustomText/CustomText';

export default function SessionAlert(props) {
  const {activeTheme} = useTheme();
  React.useEffect(() => {});
  const dispatch = useDispatch();
  return props?.isAble ? (
    <View style={[styles.fullScreenView]}>
      <View
        style={{
          backgroundColor: activeTheme.alertBackGroundColor,
          width: wp(90),
          borderRadius: wp(1),
        }}>
        <>
          <View style={{height: wp(3)}} />
          <Image
            source={Images.alertIcon}
            style={{alignSelf: 'center', width: wp(15), height: wp(15)}}
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
          <CustomText
            style={{
              fontSize: wp(4),
              alignSelf: 'center',
              padding: wp(4),
              fontFamily: fontFamily['ArticulatCF-Normal'],
              textAlign: 'center',
            }}>
            The NBP Digital App was inactive for too long. To use the App,
            kindly login again.
          </CustomText>
          {Platform.OS === 'ios' ? (
            <Custom_btn
              btn_txt={'OK'}
              accessibilityLabel={'Continue'}
              onPress={() => {
                props.onPress();
                dispatch(sessionAlert());
              }}
              btn_width={wp(80)}
              backgroundColor={Colors.primary_green}
            />
          ) : (
            <TouchableWithoutFeedback
              // btn_txt={'OK'}
              // accessibilityLabel={'Continue'}
              onPress={() => {
                props.onPress();
                dispatch(sessionAlert());
              }}>
              <View style={styles.androidBtn}>
                <CustomText
                  style={[
                    globalStyling.textFontBold,
                    {fontSize: wp(4.2), color: 'white'},
                  ]}>
                  OK
                </CustomText>
              </View>
            </TouchableWithoutFeedback>
          )}

          <View style={{height: wp(3)}} />
        </>
      </View>
    </View>
  ) : null;
}

const styles = StyleSheet.create({
  fullScreenView: {
    position: 'absolute',
    height: '100%',
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(52, 52, 52, 0.3)',
  },
  loaderView: {
    width: wp(12),
    height: wp(12),
    overflow: 'hidden',
    position: 'absolute',
    opacity: 1,
  },
  image: {width: '100%', height: '100%'},
  androidBtn: {
    width: wp(80),
    backgroundColor: Colors.primary_green,
    height: wp(13),
    borderRadius: wp(1),
    alignSelf: 'center',
    justifyContent: 'center',
    alignItems: 'center',
  },
});
