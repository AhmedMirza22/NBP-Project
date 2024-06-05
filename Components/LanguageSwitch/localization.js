import React, {useEffect, useState} from 'react';
import {Switch} from 'react-native-switch';
import LanguagesArray, {isRtlState} from '../../Config/Language/LanguagesArray';
import I18n from '../../Config/Language/LocalizeLanguageString';
import {useDispatch} from 'react-redux';
import {Colors} from '../../Theme';
import {fontFamily} from '../../Theme/Fonts';
import {wp} from '../../Constant';
import {Localization} from '../../Redux/Action/Action';
import CustomText from '../../Components/CustomText/CustomText';
import {logs} from '../../Config/Config';

const Locallangaugeswitch = (props) => {
  const {isRtl, onToggleLanguage} = props;

  return (
    <Switch
      value={isRtl}
      onValueChange={onToggleLanguage}
      inActiveText={'Eng'}
      activeText={'اردو'}
      backgroundActive={Colors.lightGrey}
      backgroundInactive={Colors.lightGrey}
      inactiveTextStyle={{
        fontSize: wp(3.5),
        paddingHorizontal: wp(2),
        color: Colors.grey,
        fontFamily: fontFamily['ArticulatCF-Normal'],
      }}
      activeTextStyle={{
        fontSize: wp(3.5),
        paddingHorizontal: wp(2),
        color: Colors.grey,
        fontFamily: fontFamily['ArticulatCF-Normal'],
      }}
      barHeight={wp(8)}
      circleBorderActiveColor={Colors.whiteColor}
      circleBorderInactiveColor={Colors.whiteColor}
      circleSize={wp(6)}
      switchLeftPx={wp(6)}
      switchRightPx={wp(20)}
      renderActiveText={isRtlState() ? true : false}
      renderInActiveText={!isRtlState() ? true : false}
      switchWidthMultiplier={3}
      switchBorderRadius={wp(1)}
      innerCircleStyle={{
        borderRadius: wp(1),
        width: wp(10),
        height: wp(8),
        justifyContent: 'center',
        alignItems: 'center',
      }}
      renderInsideCircle={() => {
        return (
          <CustomText
            boldFont={true}
            style={{fontSize: wp(4), color: Colors.primary_green}}>
            {isRtlState() ? 'Eng' : 'اردو'}
          </CustomText>
        );
      }}
    />
  );
};
export default Locallangaugeswitch;
