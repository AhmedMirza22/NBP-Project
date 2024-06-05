// export default Custom_btn;
import React from 'react';
import {Text, Dimensions, View, TouchableOpacity} from 'react-native';
import {globalStyling} from '../../Constant';
import CustomText from '../CustomText/CustomText';
import {TouchableWithoutFeedback} from 'react-native-gesture-handler';
import styles from './btn_style';
import Colors from '../../Constant/Colors';
import {useTheme} from '../../Theme/ThemeManager';
const screenHeight = Dimensions.get('window').height;
const screenWidth = Dimensions.get('window').width;
function wp(percentage) {
  const value = (percentage * screenWidth) / 100;
  return Math.round(value);
}
//onPress
//btn_txt
//btn_width
const Custom_btn = (props) => {
  const {activeTheme} = useTheme();
  return (
    <View
      style={[
        styles.btn_container,
        {
          width: props.btn_width,
          marginBottom: !props.marginBottom ? wp(1) : 0,

          backgroundColor: props.backgroundColor
            ? props.backgroundColor
            : activeTheme.BtnBackground,
          borderWidth: props.borderColor ? wp(0.5) : 0,
          borderColor: props.borderColor ? props.borderColor : 'transparent',
          marginHorizontal: props.marginHorizontal ? props.marginHorizontal : 0,
        },
      ]}>
      <TouchableOpacity
        onPress={() => {
          props.onPress();
        }}>
        <View
          style={[
            styles.btn_container,
            {
              width: props.btn_width,
              backgroundColor: props.backgroundColor,
              marginBottom: !props.marginBottom ? wp(1) : 0,

              borderWidth: props.borderColor ? wp(0.5) : 0,
              borderColor: props.borderColor
                ? props.borderColor
                : 'transparent',
            },
          ]}>
          <CustomText
            style={[
              {
                color: props.color ? props.color : Colors.whiteColor,
                fontSize: props.fontSize ? props.fontSize : wp(4.2),
                // fontWeight: 'bold',
                // paddingVertical:wp(3),
              },
              globalStyling.textFontBold,
            ]}
            boldFont={true}>
            {props.btn_txt}
          </CustomText>
        </View>
      </TouchableOpacity>
    </View>
  );
};

export default Custom_btn;
