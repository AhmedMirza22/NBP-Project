import React, {useEffect} from 'react';
import {
  View,
  Dimensions,
  TouchableOpacity,
  Text,
  TextInput,
  Image,
  TouchableWithoutFeedback,
  Platform,
} from 'react-native';
import i18n from '../../Config/Language/LocalizeLanguageString';
import CustomText from '../CustomText/CustomText';
import styles from './TextFieldStyle';
import {Colors} from '../../Theme';
import Icon from 'react-native-vector-icons/Feather';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import TextInputMask from 'react-native-text-input-mask';
// import {TextInput} from 'react-native-paper';
import {globalStyling, wp} from '../../Constant';
import CurrencyInput from 'react-native-currency-input';
import {Keyboard} from 'react-native';
// import {TouchableWithoutFeedback} from 'react-native-gesture-handler';
import {fontFamily} from '../../Theme/Fonts';
import {logs} from '../../Config/Config';
import {isRtlState} from '../../Config/Language/LanguagesArray';
import {useTheme} from '../../Theme/ThemeManager';
const screenWidth = Dimensions.get('window').width;

//props
//placeholder
//maxLength
//ispass
//text_input
//keyboardType
//icon_namec
//Textfield_label
//backgroundColor
//onChangeText
//left_icon_name
//onPress_icon
//masked
//disabled
//onBlur
//onFocus
//onSubmitEditing

const CustomTextField = React.forwardRef((props, ref) => {
  const {changeTheme, activeTheme} = useTheme();

  useEffect(() => {
    if (inputRef) {
      inputRef.current.setNativeProps({
        style: {fontFamily: fontFamily['ArticulatCF-Normal']},
      });
    }
  }, []);
  const inputRef = ref || React.useRef(null);

  // const handleFocus = () => {
  //   // Prevent the default behavior of focusing the TextInput
  //   if (inputRef.current) {
  //     inputRef.current.blur();
  //   }
  // };

  let masked = props.masked;
  return (
    <View
      removeClippedSubviews={Platform.OS === 'android' ? true : false}
      style={{
        width: props.width ? props.width : screenWidth / 1.08,
        height: props.heightContainer
          ? props.heightContainer
          : props.textHeading
          ? wp(13.5)
          : wp(13),
        borderWidth: props.hideBorder ? 0 : 1,
        borderColor: activeTheme.textFieldBorderColor, //Colors.primary_green,
        backgroundColor: activeTheme.textfieldBackgroundColor,
        alignSelf: 'center',
        borderRadius: wp(1),
        justifyContent: 'center',
        alignItems: 'center',
        marginVertical: wp(0.5),
        overflow: 'hidden',
      }}>
      {props.textHeading ? (
        <Text
          style={[
            {
              color: Colors.grey,
              alignSelf: isRtlState() ? 'flex-start' : 'flex-end',
              marginLeft: wp(2),
              padding: wp(1),
              fontSize: wp(2.6),
            },
            globalStyling.textFontNormal,
          ]}>
          {i18n[props.textHeading]
            ? i18n[props.textHeading]
            : props.textHeading}
        </Text>
      ) : null}

      <View
        style={[
          {
            flexDirection: isRtlState() ? 'row' : 'row-reverse',
            justifyContent: 'center',
            alignItems: 'center',
            height: props.textHeading ? wp(9) : wp(13),
            // marginVertical: wp(0.5),
            // overflow: 'hidden',
          },
          {
            backgroundColor: activeTheme.textfieldBackgroundColor,
          },
        ]}>
        {/* FontAwesome */}
        {props.icon_name ? (
          <FontAwesome
            name={props.icon_name}
            color={props.icon_color ? props.icon_color : Colors.primary_green}
            style={styles.icon_style}
            size={wp(5)}
          />
        ) : null}
        {props.showCurrency ? (
          <CustomText
            style={{
              fontSize: wp(4.5),
              justifyContent: 'center',
              alignItems: 'center',
              color: 'grey',
              padding: wp(1),
              // paddingHorizontal: wp(3),
            }}>
            PKR
          </CustomText>
        ) : null}
        {props.currencyInput ? (
          <CurrencyInput
            // pointerEvents="none"
            selectTextOnFocus={false}
            contextMenuHidden={true}
            onTouchStart={() => {
              inputRef.current.blur(); // Unfocus the TextInput when the user taps on it
            }}
            // ref={ref ? ref : null}
            ref={inputRef}
            value={props.text_input}
            autoCompleteType="off"
            // onChangeValue={setValue}
            onChangeValue={(value) => {
              // console.log('pressed ', value);
              props.onChangeText(value);
            }}
            editable={props.editable}
            accessibilityLabel={props.accessibilityLabel}
            testID={props.testID}
            prefix=""
            delimiter=","
            separator="."
            precision={0}
            placeholder={
              i18n[props.placeholder]
                ? i18n[props.placeholder]
                : props.placeholder
            }
            placeholderTextColor={'grey'}
            // maxValue={props.maxLength ? props.maxLength * 10 : 999999999999}
            maxLength={props.maxLength ? props.maxLength : 15}
            textContentType="none"
            style={{
              textAlign: isRtlState() ? 'left' : 'right',
              width: '85%',
              alignSelf: 'center',
              height: props.textHeading ? wp(10) : wp(12),
              fontSize: props.fontSize ? props.fontSize : wp(4.5),
              backgroundColor: activeTheme.textfieldBackgroundColor,
              justifyContent: 'center',
              borderBottomWidth: props.borderBottomWidth
                ? props.borderBottomWidth
                : props.showUnderline
                ? wp(0.2)
                : 0,
              borderBottomColor: props.showUnderline ? 'grey' : 'transparent',
              // marginVertical: wp(3),
              right: props.textHeading ? wp(2) : wp(2),
              color: activeTheme.textFieldText,
              fontFamily: fontFamily['ArticulatCF-Normal'],
            }}
            // onChangeText={(formattedValue) => {
            //   props.onChangeText(formattedValue);
            //   // console.log('formattedValue ', formattedValue); // $2,310.46
            // }}
          />
        ) : (
          <TextInput
            ref={inputRef}
            // pointerEvents="none"
            selectTextOnFocus={false}
            // contextMenuHidden={true}
            // onTouchStart={() => {
            //   inputRef.current && inputRef.current.blur();
            // }}
            // ref={(input) => {
            //   ref = input;
            // }}
            accessibilityLabel={props.accessibilityLabel}
            testID={props.testID}
            returnKeyType={props.returnKeyType ? props.returnKeyType : 'done'}
            placeholderTextColor={Colors.grey}
            // returnKeyType={'done'}
            // placeholderTextSize={wp(10)}
            textContentType="none"
            onSubmitEditing={() => {
              if (props.onSubmitEditing) {
                Keyboard.dismiss();
                props.onSubmitEditing();
              } else {
                Keyboard.dismiss();
              }
            }}
            disabled={props.disabled}
            selectionColor={Colors.textFieldCursor}
            underlineColor={'white'}
            autoCompleteType="off"
            mode={'flat'}
            multiline={props.multiline}
            numberOfLines={props.numberOfLines}
            // autoCapitalize={false}
            autoCorrect={false}
            blurOnSubmit={true}
            placeholder={
              i18n[props.placeholder]
                ? i18n[props.placeholder]
                : props.placeholder
            }
            underlineColorAndroid="transparent"
            style={{
              textAlign: isRtlState() ? 'left' : 'right',
              // paddingLeft: wp(1),
              width:
                props.showPassword || props.isInfoBtn || props.isBillerinfo
                  ? '80%'
                  : '85%',
              alignSelf: 'center',
              height: props.height ? props.height : wp(12),
              fontSize: props.fontSize ? props.fontSize : wp(4.5),
              backgroundColor: activeTheme.textfieldBackgroundColor,
              justifyContent: 'center',
              borderBottomWidth: props.borderBottomWidth
                ? props.borderBottomWidth
                : props.showUnderline
                ? wp(0.2)
                : 0,
              borderBottomColor: props.showUnderline ? 'grey' : 'transparent',
              marginVertical: wp(3),
              color: activeTheme.textFieldText,
              fontFamily: fontFamily['ArticulatCF-Normal'],
              right: props.textHeading ? wp(2) : wp(2),
            }}
            maxLength={props.maxLength}
            secureTextEntry={props.ispass ? true : false}
            value={props.text_input}
            keyboardType={props.keyboardType ? props.keyboardType : 'default'}
            onBlur={props.onBlur}
            onFocus={props.onFocus}
            onChangeText={(value) => {
              props.editable == false ? null : props.onChangeText(value);
            }}
            showSoftInputOnFocus={props.showSoftInputOnFocus}
            // defaultValue={props.defaultValue}
            render={(props) => <TextInputMask {...props} mask={masked} />}
            theme={{
              colors: {primary: 'white'},
            }}
          />
        )}
        {/* {props.showPassword ? null : (
          <TouchableOpacity
            style={{alignSelf: 'center'}}
            onPress={() => {
              props.onPress_icon ? props.onPress_icon() : logs.log('pressed');
            }}>
            <Icon
              name={props.left_icon_name}
              color={
                props.left_icon_name_color
                  ? props.left_icon_name_color
                  : Colors.primary_green
              }
              style={styles.icon_style}
              size={20}
            />
          </TouchableOpacity>
        )} */}

        {props.showPassword ? (
          <TouchableWithoutFeedback
            onPressIn={props.onPressIn}
            onPressOut={props.onPressOut}
            style={{
              backgroundColor: 'white',
              left: wp(2),
              width: wp(8),
              alignItems: 'center',
            }}>
            <Image
              source={require('../../Assets/Icons/NewIcons/showPass.png')}
              style={{width: wp(6), height: wp(6), right: wp(1)}}
              // resizeMode={'stretch'}
            />
          </TouchableWithoutFeedback>
        ) : null}
        {props.isInfoBtn ? (
          <TouchableWithoutFeedback
            onPress={props?.onPressinfo ? props?.onPressinfo : null}
            style={{
              backgroundColor: 'white',
              left: wp(2),
              width: wp(8),
              alignItems: 'center',
            }}>
            <Icon
              name={props.left_icon_name}
              color={Colors.grey}
              // style={styles.icon_style}
              size={20}
            />
          </TouchableWithoutFeedback>
        ) : null}
        {props.isBillerinfo ? (
          <TouchableWithoutFeedback
            onPress={props?.onPressinfo ? props?.onPressinfo : null}
            style={{
              backgroundColor: 'white',
              left: wp(2),
              width: wp(8),
              alignItems: 'center',
            }}>
            <Icon
              name={props.left_icon_name}
              color={Colors.grey}
              // style={styles.icon_style}
              size={20}
            />
          </TouchableWithoutFeedback>
        ) : null}
      </View>
    </View>
    // </TouchableWithoutFeedback>
  );
});

export default CustomTextField;
