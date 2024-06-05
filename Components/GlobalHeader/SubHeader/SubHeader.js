import React, {useRef, useEffect, useState} from 'react';
import {View, Text, Image, Dimensions, Animated} from 'react-native';
import styles from './SubHeaderStyling';
import {CommonActions} from '@react-navigation/native';
import {Colors, Images} from '../../../Theme';
import {globalStyling, wp} from '../../../Constant';
import {TouchableWithoutFeedback} from 'react-native-gesture-handler';
import CustomText from '../../CustomText/CustomText';
import {animations, logs} from '../../../Config/Config';
import {useFocusEffect} from '@react-navigation/native';
import {useSelector} from 'react-redux';
import {useTheme} from '../../../Theme/ThemeManager';
import Entypo from 'react-native-vector-icons/Entypo';
import Ionicons from 'react-native-vector-icons/Ionicons';

import {isRtlState} from '../../../Config/Language/LanguagesArray';
import store from '../../../Redux/Store/Store';
const SubHeader = (props) => {
  const languageRedux = useSelector(
    (state) => state.reducers?.Localiztion?.language?.languageCode,
  );
  const headerAnimation = useRef(
    new Animated.Value(animations ? -100 : 0),
  ).current;
  const buttonAnimation = useRef(
    new Animated.Value(animations ? -100 : 0),
  ).current;
  const homeButtonAnimation = useRef(
    new Animated.Value(animations ? 0 : -100),
  ).current;
  const opacityAnimation = useRef(
    new Animated.Value(animations ? 0 : 1),
  ).current;
  const [language, setlanguage] = useState(false);
  useEffect(() => {
    // animateHeaderText();
    // animateButton();
    const animateHeaderText = Animated.spring(headerAnimation, {
      toValue: 0,
      useNativeDriver: false,
    });
    const animateButton = Animated.parallel([
      Animated.timing(buttonAnimation, {
        toValue: 0,
        duration: 400,
        useNativeDriver: false,
      }),
      Animated.timing(opacityAnimation, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: false,
      }),
    ]);

    Animated.parallel([animateHeaderText, animateButton]).start();
  });
  useEffect(() => {
    setlanguage(true);
  }, [languageRedux]);
  const {activeTheme} = useTheme();
  return (
    <View
      style={{
        width: '100%',
        backgroundColor: activeTheme.headerBackGroundColor,
      }}>
      <Animated.View
        style={[
          styles.row,
          {
            backgroundColor: activeTheme.headerBackGroundColor,
            // paddingHorizontal: wp(7),
          },
        ]}>
        <View style={styles.subRow}>
          {props.hideBackArrow ? (
            <View style={{width: wp(12)}} />
          ) : (
            <View style={{width: '20%'}}>
              <Animated.View
                style={[
                  styles.backArrowView,
                  {
                    transform: [
                      {
                        translateX: buttonAnimation,
                      },
                    ],
                    opacity: opacityAnimation,
                  },
                ]}>
                <TouchableWithoutFeedback
                  onPress={() => {
                    if (props.onPress) {
                      props.onPress();
                    } else if (props.navigateHome) {
                      props.navigation.dispatch(CommonActions.goBack());
                    } else if (props.onNavigation) {
                      props.onNavigation();
                    } else if (props.onRaastBack) {
                      props.navigation.dispatch(
                        CommonActions.reset({
                          index: 0,
                          routes: [{name: 'RAASTMenue'}],
                        }),
                      );
                    } else {
                      if (props.navigation.canGoBack())
                        props.navigation?.goBack();
                    }
                  }}>
                  <View
                    style={{
                      backgroundColor: activeTheme.headerArrowColor,
                      width: wp(10),
                      height: wp(10),
                      borderRadius: wp(100),
                      justifyContent: 'center',
                    }}>
                    <Entypo
                      name={'chevron-thin-left'}
                      size={wp(5)}
                      color={Colors.whiteColor}
                      style={{alignSelf: 'center'}}
                    />
                  </View>
                </TouchableWithoutFeedback>
              </Animated.View>
            </View>
          )}
          <View
            style={{
              width: '70%',
            }}>
            <Animated.View
              style={[
                {
                  transform: [
                    {
                      translateY: headerAnimation, // Apply the animated vertical position
                    },
                  ],
                },
              ]}>
              <CustomText
                style={{
                  fontSize: props.headerFont ? props.headerFont : wp(6),
                  color: Colors.whiteColor,
                  width: props.width ? props.width : wp(80),
                  textAlign: isRtlState() ? 'left' : 'right',
                  paddingRight: isRtlState() ? 0 : wp(10),
                }}
                numberOfLines={props.numberOfLines ? props.numberOfLines : 2}
                boldFont={true}>
                {props.title}
              </CustomText>
              <CustomText
                style={[
                  styles.descriptionText,
                  {
                    textAlign: isRtlState() ? 'left' : 'right',
                    // paddingRight: isRtlState() ? 0 : wp(2),
                  },
                ]}
                numberOfLines={1}>
                {props?.description ? props?.description : 'Make Payments'}
              </CustomText>
            </Animated.View>
          </View>
          {/* Home Icon Button */}
          {props?.hideHomeButton ? (
            <View style={{width: wp(10)}} />
          ) : (
            <View
              style={{
                width: wp(15),
                alignContent: 'center',
                justifyContent: 'center',
                alignItems: 'center',
                alignSelf: 'center',
              }}>
              <Animated.View
                style={[
                  {
                    transform: [
                      {
                        translateX: homeButtonAnimation,
                      },
                    ],
                    opacity: opacityAnimation,
                    backgroundColor: activeTheme.headerBackGroundColor,
                  },
                ]}>
                <TouchableWithoutFeedback
                  onPress={() => {
                    props.navigation.dispatch(
                      CommonActions.reset({
                        index: 0,
                        routes: [{name: 'Home'}],
                      }),
                    );
                  }}>
                  <View
                    style={{
                      width: wp(10),
                      height: wp(10),
                      justifyContent: 'center',
                    }}>
                    <Ionicons
                      name={'home-outline'}
                      size={wp(7)}
                      color={Colors.whiteColor}
                      style={{alignSelf: 'center'}}
                    />
                  </View>
                </TouchableWithoutFeedback>
              </Animated.View>
            </View>
          )}
        </View>
      </Animated.View>
    </View>
  );
};
export default React.memo(SubHeader);