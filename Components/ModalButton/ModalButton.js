import React from 'react';
import {Text, Dimensions, View, TouchableWithoutFeedback} from 'react-native';
import {globalStyling} from '../../Constant';
import styles from './btn_style';
import CustomText from '../CustomText/CustomText';
const screenWidth = Dimensions.get('window').width;
function wp(percentage) {
  const value = (percentage * screenWidth) / 100;
  return Math.round(value);
}
//onPress
//btn_txt
//btn_width
const ModalButton = (props) => {
  return (
    <TouchableWithoutFeedback
      onPress={() => {
        props.onPress();
      }}>
      <View
        style={[
          styles.btn_container,
          {
            height: props.btn_height ? props.btn_height : wp(12),
            width: props.btn_width,
            backgroundColor: props.backgroundColor,
            borderWidth: props.borderColor ? wp(0.5) : 0,
            borderColor: props.borderColor ? props.borderColor : 'transparent',
          },
        ]}>
        <CustomText
          style={[
            globalStyling.textFontBold,
            {
              color: props.color ? props.color : 'white',
              fontSize: props.fontSize ? props.fontSize : wp(4.2),
              // fontWeight: 'bold',
              // paddingVertical:wp(3),
            },
          ]}>
          {props.btn_txt}
        </CustomText>
      </View>
    </TouchableWithoutFeedback>
  );
};

export default ModalButton;
