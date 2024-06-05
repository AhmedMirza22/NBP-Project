import React, {useState} from 'react';
import {
  View,
  FlatList,
  Text,
  Dimensions,
  TouchableHighlight,
  TouchableOpacity,
  Image,
  Linking,
} from 'react-native';
const width = Dimensions.get('screen').width;
const heighto = Dimensions.get('screen').height;
import {Colors} from '../../Theme';
import Feather from 'react-native-vector-icons/Feather';
import Ionicons from 'react-native-vector-icons/Ionicons';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Modal from 'react-native-modal';
import styles from './RAASTModalStyle';
import {globalStyling, hp, wp} from '../../Constant';
import {fontFamily} from '../../Theme/Fonts';
import Custom_btn from '../Custom_btn/Custom_btn';
import CustomText from '../CustomText/CustomText';
import {CheckBox} from 'react-native-elements';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import {logs} from '../../Config/Config';
import {useSelector} from 'react-redux';
import {useEffect} from 'react';

//visible
//headtext
//data
//onPress_item(item)
//onPress_yes
//onPress_no

//import liraries

// create a component
const MyComponent = (props) => {
  const [language, setLanguageChange] = useState(false);
  const languageRedux = useSelector(
    (state) => state.reducers?.Localiztion?.language?.languageCode,
  );
  useEffect(() => {
    setLanguageChange(false);
  }, [languageRedux]);
  return (
    <Modal
      animationIn="slideInRight"
      animationOut="slideOutRight"
      backdropOpacity={0.3}
      isVisible={props.visible}
      onBackdropPress={() =>
        props.onCancel ? props.onCancel() : logs.log('back Drop press')
      }>
      <View
        style={{
          borderRadius: wp(1),
          alignSelf: 'center',
          width: wp(85),
          backgroundColor: Colors.subContainer,
        }}>
        <View style={styles.gap2}></View>
        <TouchableOpacity
          onPress={() => {
            props.onCancel();
          }}
          style={{alignSelf: 'flex-end', marginRight: wp(3)}}>
          <AntDesign
            name={'closecircle'}
            size={wp(6)}
            color={Colors.lightGrey}
          />
        </TouchableOpacity>
        <View style={styles.gap2}></View>
        <View style={styles.gap2}></View>
        {/* <View style={styles.gap2}></View> */}
        <Image
          resizeMode={'contain'}
          style={{
            height: wp(35),
            width: wp(35),
            alignSelf: 'center',
            // backgroundColor: 'white',
          }}
          source={require('../../Assets/Rast-transparetn.png')}
        />
        <View style={styles.gap2}></View>
        <View style={styles.gap2}></View>

        <CustomText
          boldFont={true}
          style={{
            fontSize: wp(6),
            alignSelf: 'center',
            // fontWeight: 'bold',
          }}>
          Welcome to Raast
        </CustomText>
        <View style={styles.gap2}></View>

        <CustomText
          style={{
            alignSelf: 'center',
            textAlign: 'center',
            marginHorizontal: wp(5),
            fontSize: wp(4),
          }}>
          {props.raastMessage}
          {/* For more information please visit :
              <TouchableOpacity
                nPress={() => {
                  Linking.openURL('https://www.sbp.org.pk/dfs/Raast.html');
                }}>
                <Text style={{color: 'blue'}}>
                  www.sbp.org.pk/dfs/Raast.html
                </Text>
              </TouchableOpacity> */}
        </CustomText>
        <View style={styles.gap2}></View>
        {/* <CheckBox
          accessibilityRole="checkbox"
          checked={props.check}
          title={`Don't Show this message again`}
          textStyle={[
            globalStyling.textFontBold,
            {fontSize: wp(4), fontWeight: '500'},
          ]}
          containerStyle={{
            borderColor: Colors.backgroundColor,
            backgroundColor: Colors.backgroundColor,
            width: '90%',
            alignSelf: 'center',
            borderRadius: wp(1),
          }}
          onPress={() => {
            props.onPressCheck ? props.onPressCheck() : logs.log('sdjhsgdjhg');
          }}
          checkedIcon={
            <FontAwesome
              name={'check-square'}
              size={wp(5)}
              color={Colors.primary_green}
            />
          }
          uncheckedIcon={
            <FontAwesome name={'square'} size={wp(5)} color={Colors.grey} />
          }
          checkedColor={Colors.primary_green}
          size={wp(7)}
        /> */}
        <View style={styles.gap2}></View>

        <View style={{flexDirection: 'row', alignSelf: 'center'}}>
          <TouchableOpacity
            style={{
              backgroundColor: Colors.primary_green,
              width: wp(65),
              justifyContent: 'center',
              borderRadius: wp(1),
              height: wp(12),
              // borderRadius: 10,
            }}
            onPress={() => props.onPress_yes()}>
            <CustomText
              boldFont={true}
              style={{
                color: 'white',
                // fontWeight: 'bold',
                fontFamily: fontFamily['ArticulatCF-DemiBold'],

                fontSize: wp(4),
                alignSelf: 'center',
              }}>
              Register Raast ID Now
            </CustomText>
          </TouchableOpacity>
          <View style={{width: 10}}></View>
        </View>
        <View style={styles.gap2}></View>

        <View style={styles.gap2}></View>
      </View>
    </Modal>
  );
};

export default MyComponent;
