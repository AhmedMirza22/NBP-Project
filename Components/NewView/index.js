import {View, Text} from 'react-native';
import React from 'react';
import {wp} from '../../Constant';
import CustomText from '../CustomText/CustomText';
import {Colors} from '../../Theme';
import {useTheme} from '../../Theme/ThemeManager';

// create a component
const NewView = () => {
  const {activeTheme} = useTheme();
  return (
    <View
      style={{
        height: wp(5),
        width: wp(8),
        alignSelf: 'center',
        //left: wp(3),
        borderRadius: wp(5),
        backgroundColor: activeTheme.newViewBackGround,
      }}>
      <CustomText
        style={{
          color: 'white',
          textAlign: 'center',
          padding: 2.5,
          fontSize: wp(2.5),
        }}>
        New
      </CustomText>
    </View>
  );
};

//make this component available to the app
export default NewView;
