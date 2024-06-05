import React, {useState, useCallback} from 'react';
import {
  View,
  Text,
  Dimensions,
  BackHandler,
  TouchableOpacity,
  Image,
} from 'react-native';
import CustomText from '../../../Components/CustomText/CustomText';
const height = Dimensions.get('window').height;
const width = Dimensions.get('window').width;
import Entypo from 'react-native-vector-icons/Entypo';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import Clipboard from '@react-native-community/clipboard';
import Share from 'react-native-share';
import Feather from 'react-native-vector-icons/Feather';
import styles from './Sucessmessagestyle';
import Custom_btn from '../../../Components/Custom_btn/Custom_btn';
import {wp} from '../../../Constant';
import {Colors, Images} from '../../../Theme';
import GlobalHeader from '../../../Components/GlobalHeader/GlobalHeader';
import SubHeader from '../../../Components/GlobalHeader/SubHeader/SubHeader';
import {logs} from '../../../Config/Config';
import {useFocusEffect} from '@react-navigation/native';
import {TouchableHighlight} from 'react-native';
import {Platform} from 'react-native';
// SubHeader
export default function SuccessnotSucess(props) {
  const screen = props.route.params?.screen;
  const params = props.route.params?.params;
  const name = props.route.params?.name;
  const alias = props.route.params?.alias;
  logs.log(`props.route.params : ${JSON.stringify(props.route.params)}`);
  const [isSelectionModeEnabled, disableSelectionMode] = useState(true);

  useFocusEffect(
    useCallback(() => {
      const onBackPress = () => {
        if (isSelectionModeEnabled) {
          props.navigation.navigate('RAASTMenue');
          return true;
        } else {
          return false;
        }
      };

      BackHandler.addEventListener('hardwareBackPress', onBackPress);

      return () =>
        BackHandler.removeEventListener('hardwareBackPress', onBackPress);
    }, [isSelectionModeEnabled, disableSelectionMode]),
  );

  const options = {
    title: 'RAAST ID',
    url: ``,
    message: `RAAST ID: ${alias}`,
  };
  const shareButton = () => {
    return (
      <TouchableOpacity
        // style={{alignSelf: 'flex-end', flexDirection: 'row'}}
        onPress={async () => {
          await share();
          Clipboard.setString(`RAAST ID: ${alias}`);
        }}>
        <Image
          source={
            Platform.OS == 'android'
              ? Images.androidShareGold
              : Images.iosShareGold
          }
          resizeMode={'contain'}
          style={{
            width: wp(10),
            height: wp(10),
            alignSelf: 'center',
          }}
        />
      </TouchableOpacity>
    );
  };

  const headview_request_succes = () => {
    return (
      <View style={styles.main_box_view}>
        <CustomText
          style={{
            alignSelf: 'center',
            fontSize: width / 18,
            // fontWeight: 'bold',
          }}
          boldFont={true}>
          Request Processed Successfully
        </CustomText>
      </View>
    );
  };
  const headview_congrats = () => {
    return (
      <View style={styles.main_box_view}>
        <CustomText
          style={{
            alignSelf: 'center',
            fontSize: width / 18,
            fontWeight: 'bold',
          }}>
          Congratulations
        </CustomText>
      </View>
    );
  };
  const icon = () => {
    return (
      <View style={styles.main_box_view}>
        <Entypo
          name={'circle-with-cross'}
          size={height / 5}
          color={'red'}
          style={{alignSelf: 'center'}}
        />
      </View>
    );
  };
  const icon_green = () => {
    return (
      <View style={styles.main_box_view}>
        <FontAwesome5
          name={'check-circle'}
          size={height / 5}
          color={Colors.primary_green}
          style={{alignSelf: 'center'}}
        />
      </View>
    );
  };
  const message = () => {
    return (
      <View style={styles.main_box_view}>
        <CustomText
          style={{
            alignSelf: 'center',
            textAlign: 'center',
            fontSize: height / 50,
          }}>
          {screen == 'Link'
            ? `Dear ${name}, Your RAAST ID ${alias} has been Linked successfully with IBAN
          ${params?.iban}. For further assistance, please call NBP HelpLine
          021-111-627-627`
            : screen == 'Register'
            ? `Dear ${name}, Your RAAST ID ${alias} has been Registered and Linked successfully with IBAN
          ${params?.iban}. For further assistance, please call NBP HelpLine
          021-111-627-627`
            : screen == 'Unlink'
            ? `Dear ${name}, Your RAAST ID ${alias} has been Delinked successfully with IBAN
          ${params?.iban}. For further assistance, please call NBP HelpLine
          021-111-627-627`
            : `Dear ${name}, Your RAAST ID ${alias} has been Deleted successfully with IBAN
          ${params?.iban}. For further assistance, please call NBP HelpLine
          021-111-627-627`}
        </CustomText>
      </View>
    );
  };

  const share = async (customOptions = options) => {
    try {
      await Share.open(customOptions);
    } catch (err) {
      // console.log(err);
    }
  };

  return (
    <View style={{backgroundColor: 'white', flex: 1}}>
      <SubHeader
        hideBackArrow={true}
        navigation={props.navigation}
        title={'RAAST'}
        description={'RAAST Account Managment'}
        onRaastBack={true}
      />
      <View style={styles.gap}></View>
      {screen == 'Link' || screen == 'Register'
        ? headview_congrats()
        : headview_request_succes()}
      <View style={styles.gap}></View>
      {icon_green()}
      <View style={styles.gap}></View>
      {message()}
      <View style={styles.gap}></View>
      {screen == 'Register' ? (
        <TouchableOpacity
          onPress={async () => {
            await share();
            Clipboard.setString(`RAAST ID: ${alias}`);
          }}
          style={{alignSelf: 'center'}}>
          <View
            style={{flexDirection: 'row', margin: wp(2), alignItems: 'center'}}>
            <Text
              style={{
                color: Colors.primary_green,
                fontWeight: 'bold',
                fontSize: wp(5),
                alignSelf: 'center',
              }}>
              {'Share Your RAAST ID'}
            </Text>
            <View style={{width: wp(4)}}></View>

            {Platform.OS == 'android' ? (
              <Entypo
                name={'share'}
                size={wp(7)}
                color={Colors.primary_green}
                style={{alignSelf: 'center'}}
              />
            ) : (
              <Feather
                name={'share'}
                size={wp(7)}
                color={Colors.primary_green}
                style={{alignSelf: 'center'}}
              />
            )}
          </View>
        </TouchableOpacity>
      ) : // <Custom_btn
      //   btn_txt={'Share Your\nRAAST ID'}
      //   btn_width={wp(45)}
      //   backgroundColor={Colors.primary_green}
      // onPress={async () => {
      //   await share();
      //   Clipboard.setString(`RAAST ID: ${alias}`);
      // }}
      // />
      null}
      <View style={styles.littlegap}></View>

      <Custom_btn
        btn_txt={'Done'}
        btn_width={wp(35)}
        backgroundColor={Colors.primary_green}
        onPress={() => {
          props.navigation.navigate('Dashboard');
        }}
      />

      {/* {screen == 'Register' ? shareButton() :null} */}

      {/* {request_message()} */}
    </View>
  );
}
