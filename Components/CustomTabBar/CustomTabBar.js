import React, {useRef, useState} from 'react';
import {
  View,
  Dimensions,
  TouchableOpacity,
  Text,
  TextInput,
  Image,
  TouchableWithoutFeedback,
  Platform,
  Animated,
} from 'react-native';
import CustomText from '../CustomText/CustomText';
import {hp, wp} from '../../Constant';
import {animations, logs} from '../../Config/Config';
import {Colors} from '../../Theme';
import {useTheme} from '../../Theme/ThemeManager';

export default function CustomTabButton(props) {
  const {activeTheme} = useTheme();
  const [customstyle, SetCustomstyle] = useState(true);
  const headerAnimation = useRef(new Animated.Value(0)).current;
  const onAnimation = (number) => {
    const animateHeaderText = Animated.spring(headerAnimation, {
      toValue: wp(number),
      useNativeDriver: false,
    });
    Animated.parallel([animateHeaderText]).start();
  };
  const LeftSelectPress = () => {
    props.LeftSelectPress();
    SetCustomstyle(true);
    onAnimation(0);
  };

  const RightSelectPress = () => {
    props.RightSelectPress();
    SetCustomstyle(false);
    onAnimation(45);
  };

  const animateSlide = (toValue) => {
    // Animated.timing(slideAnimation, {
    //   toValue: toValue,
    //   duration: 1000,
    //   useNativeDriver: false,
    // }).start();
  };

  return (
    <View
      style={{
        flexDirection: 'row',
        width: wp(90),
        borderRadius: wp(1),
        alignSelf: 'center',
        backgroundColor: Colors.tabBarColor,
        marginVertical: hp(2),
      }}>
      <Animated.View
        style={[
          {
            height: wp(13),
            width: wp(45),
            borderWidth: 0.8,
            borderColor: Colors.primary_green,
            borderBottomLeftRadius: wp(1),
            borderBottomRightRadius: wp(1),
            borderTopLeftRadius: wp(1),
            borderTopRightRadius: wp(1),
            justifyContent: 'center',
            alignItems: 'center',
            position: 'absolute',
            backgroundColor: 'rgba(227,245,238,0.9)',
          },
          {
            transform: [
              {
                translateX: headerAnimation,
              },
            ],
          },
        ]}></Animated.View>
      <TouchableWithoutFeedback onPress={LeftSelectPress}>
        <View
          style={{
            height: wp(13),
            width: wp(45),
            borderBottomLeftRadius: wp(1),
            borderBottomRightRadius: wp(1),
            borderTopLeftRadius: wp(1),
            borderTopRightRadius: wp(1),
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          {props.leftImage ? (
            <Image
              source={props.leftImage}
              resizeMode={'contain'}
              style={{height: wp(10), width: wp(20), alignSelf: 'center'}}
            />
          ) : (
            <CustomText
              style={{
                color: customstyle ? Colors.blackColor : Colors.grey,
                zIndex: customstyle ? 4 : 0,
                fontSize: props?.LeftfontSize ? props?.LeftfontSize : null,
              }}
              boldFont={customstyle ? true : false}
              onPress={LeftSelectPress}>
              {props.leftText}
            </CustomText>
          )}
        </View>
      </TouchableWithoutFeedback>
      <TouchableWithoutFeedback
        onPress={() => {
          RightSelectPress();
        }}>
        <View
          style={{
            height: wp(13),
            width: wp(45),
            borderBottomLeftRadius: wp(1),
            borderBottomRightRadius: wp(1),
            borderTopLeftRadius: wp(1),
            borderTopRightRadius: wp(1),
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          {props.RightImage ? (
            <Image
              source={props.RightImage}
              resizeMode={'contain'}
              style={{height: wp(10), width: wp(20), alignSelf: 'center'}}
            />
          ) : (
            <CustomText
              boldFont={customstyle ? false : true}
              onPress={RightSelectPress}
              style={{
                color: customstyle ? Colors.grey : Colors.blackColor,
                zIndex: customstyle ? 0 : 4,
                fontSize: props?.RightfontSize ? props?.RightfontSize : null,
              }}>
              {props.RightText}
            </CustomText>
          )}
        </View>
      </TouchableWithoutFeedback>
    </View>
  );
}
