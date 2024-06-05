import React, {useEffect, useState} from 'react';
import {View, Dimensions, TouchableWithoutFeedback} from 'react-native';
import I18n from '../../Config/Language/LocalizeLanguageString';
import IonIcons from 'react-native-vector-icons/Ionicons';

import {Colors, Images} from '../../Theme';
import {wp, hp} from '../../Constant';
import {useDispatch} from 'react-redux';
import CustomText from '../CustomText/CustomText';
import {useTheme} from '../../Theme/ThemeManager';

import {isRtlState} from '../../Config/Language/LanguagesArray';
// import TouchableNativeFeedback from 'react-native-gesture-handler/lib/typescript/components/touchables/TouchableNativeFeedback.android';

const screenWidth = Dimensions.get('window').width;
const screenheight = Dimensions.get('window').height;

const InformationIcon = (props) => {
  const {activeTheme} = useTheme();
  const dispatch = useDispatch();

  return (
    <>
      {props?.noAbs ? (
        <View
          style={{
            width: wp(90),
            alignSelf: 'flex-end',
            marginBottom: wp(4),
          }}>
          <View
            style={{
              width: wp(13),
              height: wp(13),
              backgroundColor: Colors.primary_green,
              justifyContent: 'center',
              borderRadius: wp(1),
              alignSelf: 'flex-end',
            }}>
            <TouchableWithoutFeedback
              onPress={() => {
                props.onPress();
              }}>
              <View>
                <IonIcons
                  name={'information-circle-outline'}
                  size={wp(5)}
                  color={Colors.whiteColor}
                  style={{
                    alignSelf: 'center',
                  }}
                />
                <CustomText
                  style={{
                    fontSize: wp(3),
                    alignSelf: 'center',
                    color: 'white',
                    // color: Colors.textfieldBackgroundColor,
                  }}>
                  Help
                </CustomText>
              </View>
            </TouchableWithoutFeedback>
          </View>
        </View>
      ) : (
        <TouchableWithoutFeedback
          style={{
            position: 'absolute',
            width: 50,
            height: 50,
            alignItems: 'center',
            justifyContent: 'center',
            right: 30,
            bottom: 30,
          }}
          onPress={() => {
            props.onPress();
          }}>
          <View
            style={{
              backgroundColor: activeTheme.BtnBackground,
              width: wp(13),
              margin: wp(5),
              position: 'absolute',
              bottom: 15,
              right: isRtlState() ? 0 : null,
              left: isRtlState() ? null : 0,
              bottom: 10,
              borderRadius: 4,
              padding: 2,
              // borderColor: 'white',
              // borderWidth: 1,
            }}>
            <IonIcons
              name={'information-circle-outline'}
              size={wp(5)}
              color={Colors.whiteColor}
              style={{
                padding: 1,
                alignSelf: 'center',
              }}
            />
            <CustomText
              style={{
                padding: 1,
                fontSize: wp(3),
                alignSelf: 'center',
                color: Colors.whiteColor,
              }}>
              Help
            </CustomText>
          </View>
        </TouchableWithoutFeedback>
      )}
    </>
  );
};

export default InformationIcon;
