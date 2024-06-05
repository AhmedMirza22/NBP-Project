// CustomText.js
import React from 'react';
import {Platform, View} from 'react-native';
import {Text, StyleSheet} from 'react-native';
import {fontFamily} from '../../Theme/Fonts';
import I18n from '../../Config/Language/LocalizeLanguageString';
import {isRtlState} from '../../Config/Language/LanguagesArray';
import {useTheme} from '../../Theme/ThemeManager';
import store from '../../Redux/Store/Store';
export default function CustomText(props) {
  const {activeTheme} = useTheme();

  return (
    <Text
      numberOfLines={props?.numberOfLines ? props?.numberOfLines : null}
      ellipsizeMode={props?.ellipsizeMode ? props?.ellipsizeMode : null}
      style={[
        {
          color: activeTheme.mainTextColors,
        },
        styles.defaultStyle,
        props.style,
        {
          fontFamily: props.boldFont
            ? fontFamily['ArticulatCF-DemiBold']
            : fontFamily['ArticulatCF-Normal'],
          fontWeight: Platform.OS == 'ios' ? null : '100',
        },
      ]}
      onPress={props.onPress}>
      {I18n[props.children] ? I18n[props.children] : props.children}
    </Text>
  );
}

const styles = StyleSheet.create({
  // ... add your default style here
  defaultStyle: {},
});
