import React, {useState, useRef} from 'react';
import {TextInput, View} from 'react-native';
import {Colors} from '../../Theme';
import {wp} from '../../Constant';
import {fontFamily} from '../../Theme/Fonts';
import I18n from '../../Config/Language/LocalizeLanguageString';
import {isRtlState} from '../../Config/Language/LanguagesArray';
import CustomText from '../CustomText/CustomText';
import {useTheme} from '../../Theme/ThemeManager';
const AutoGrowingText = (props) => {
  const {activeTheme} = useTheme();
  const [height, setHeight] = useState(0);
  const handleContentSizeChange = (contentHeight) => {
    setHeight(Math.max(wp(13), Math.min(wp(60), contentHeight)));
  };
  const inputRef = useRef(null);

  return (
    <View removeClippedSubviews={Platform.OS === 'android' ? true : false}>
      {props?.textHeading ? (
        <CustomText style={{marginLeft: wp(2), color: Colors.grey}}>
          {props?.textHeading}
        </CustomText>
      ) : null}

      <TextInput
        ref={inputRef}
        contextMenuHidden={true}
        onTouchStart={() => {
          inputRef.current.blur(); // Unfocus the TextInput when the user taps on it
        }}
        multiline
        value={props.value}
        onChangeText={props.onChange}
        onContentSizeChange={(e) =>
          handleContentSizeChange(e.nativeEvent.contentSize.height)
        }
        style={{
          backgroundColor: activeTheme.textfieldBackgroundColor,
          height,
          paddingBottom: 5,
          paddingLeft: 10,
          paddingRight: 10,
          fontSize: wp(4.6),
          fontFamily: fontFamily['ArticulatCF-Normal'],
          textAlignVertical: 'center',
          color: activeTheme.mainTextColors,
          //   textAlign: isRtlState()?'left',
        }}
        placeholderTextColor={Colors.grey}
        placeholder={
          I18n[props.placeholder] ? I18n[props.placeholder] : props.placeholder
        }
        maxLength={props.maxLength}
        minHeight={props.minHeight}
        maxHeight={props.maxHeight}
      />
    </View>
  );
};
export default AutoGrowingText;
