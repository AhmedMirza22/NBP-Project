import React from 'react';
import {View, Text, Dimensions} from 'react-native';
const height = Dimensions.get('window').height;
const width = Dimensions.get('window').width;
import Entypo from 'react-native-vector-icons/Entypo';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import styles from './RAASTSuccesStyle';
import Custom_btn from '../../../../Components/Custom_btn/Custom_btn';
import {wp} from '../../../../Constant';
import {Colors} from '../../../../Theme';
import GlobalHeader from '../../../../Components/GlobalHeader/GlobalHeader';
import SubHeader from '../../../../Components/GlobalHeader/SubHeader/SubHeader';
import {logs} from '../../../../Config/Config';
import CustomText from '../../../../Components/CustomText/CustomText';
import analytics from '@react-native-firebase/analytics';

// SubHeader
export default function RAASTSucces(props) {
  const screen = props.route.params?.screen;
  const params = props.route.params?.params;
  const name = props.route.params?.name;
  const alias = props.route.params?.alias;
  const transaction_success = props?.route?.params?.params?.displayMessage;
  logs.log(props.route.params);
  React.useEffect(() => {
    async function analyticsLog() {
      await analytics().logEvent('RaastSucessScreen');
    }
    analyticsLog();
  }, []);

  const headview_request_succes = () => {
    return (
      <View style={styles.main_box_view}>
        <CustomText
          boldFont={true}
          style={{
            alignSelf: 'center',
            fontSize: width / 18,
            // fontWeight: 'bold',
          }}>
          Request Processed Successfully
        </CustomText>
      </View>
    );
  };
  const headview_congrats = () => {
    return (
      <View style={styles.main_box_view}>
        <Text
          style={{
            alignSelf: 'center',
            fontSize: width / 18,
            fontWeight: 'bold',
          }}>
          Congratulations
        </Text>
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
          color={'green'}
          style={{alignSelf: 'center'}}
        />
      </View>
    );
  };
  const message = () => {
    return (
      <View style={styles.main_box_view}>
        <CustomText
          boldFont={true}
          style={{
            alignSelf: 'center',
            textAlign: 'center',
            fontSize: height / 50,
            // fontWeight: 'bold',
          }}>
          {transaction_success}
        </CustomText>
      </View>
    );
  };

  return (
    <View
      style={{backgroundColor: 'white', flex: 1}}
      accessibilityLabel="RAAST Payment Successful">
      {/* <GlobalHeader navigation={props.navigation} /> */}
      <SubHeader
        navigation={props.navigation}
        title={'RAAST'}
        description={'Transaction Successful'}
        // cardmanagment={true}
        hideBackArrow={true}
      />
      <View style={styles.gap}></View>
      {headview_request_succes()}
      <View style={styles.gap}></View>
      {icon_green()}
      <View style={styles.gap}></View>
      {message()}
      <View style={styles.gap}></View>
      <View style={{alignSelf: 'center', position: 'absolute', bottom: wp(10)}}>
        <Custom_btn
          btn_txt={'Done'}
          accessibilityLabel={'Done'}
          btn_width={wp(85)}
          backgroundColor={Colors.primary_green}
          onPress={() => {
            props.navigation.navigate('Dashboard');
          }}
        />
      </View>
    </View>
  );
}
