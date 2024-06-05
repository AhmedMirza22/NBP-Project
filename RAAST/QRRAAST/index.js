import React from 'react';
import {View} from 'react-native';
import styles from '../RAASTStyle';
import SubHeader from '../../../Components/GlobalHeader/SubHeader/SubHeader';
import TabNavigate from '../../../Components/TabNavigate/TabNavigate';
import {useSelector, useDispatch} from 'react-redux';
import {getraastbanklist, setAppAlert} from '../../../Redux/Action/Action';
import {wp} from '../../../Constant';
import {showRAASTPayments} from '../../../Config/Config';
import analytics from '@react-native-firebase/analytics';
const MyAccounts = (props) => {
  React.useEffect(() => {
    async function analyticsLog() {
      await analytics().logEvent('QRCodetoReceive&SendMoney');
    }
    analyticsLog();
  }, []);

  const dispatch = useDispatch();
  const token = useSelector((state) => state.reducers.token);

  return (
    <View style={styles.container} accessibilityLabel="My Accounts">
      {/* <GlobalHeader navigation={props.navigation} /> */}
      <SubHeader
        title={'QR Pay'}
        description={'QR Code to Receive & Send Money'}
        navigation={props.navigation}
      />
      <View style={{height: wp(6)}}></View>
      <TabNavigate
        accessibilityLabel="Receive Money"
        text={'Receive Money'}
        boldFont={true}
        border={true}
        receiveMoney={true}
        navigation={props.navigation}
        onPress={() => {
          // dispatch(
          // getraastbanklist(props.navigation, () => {
          props.navigation.navigate('RecieveMoneyRAAST');
          // }),
          // );
        }}
      />
      {showRAASTPayments ? (
        <TabNavigate
          accessibilityLabel="Send Money"
          text={'Send Money'}
          boldFont={true}
          border={true}
          sendMoney={true}
          navigation={props.navigation}
          onPress={() => {
            dispatch(
              getraastbanklist(props.navigation, () => {
                props.navigation.navigate('SendMoneyRAAST');
              }),
            );
          }}
        />
      ) : null}
    </View>
  );
};
export default MyAccounts;
