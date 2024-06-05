import React, {useEffect} from 'react';
import {View} from 'react-native';
import SubHeader from '../../../../Components/GlobalHeader/SubHeader/SubHeader';
import {useSelector, useDispatch} from 'react-redux';
import TabNavigator from '../../../../Components/TabNavigate/TabNavigate';
import {
  setCurrentFlow,
  getraastbanklist,
} from '../../../../Redux/Action/Action';

import styles from './../../../Transfers/TransfersStyling';
import {showRAASTPayments} from '../../../../Config/Config';
import {logs} from '../../../../Config/Config';
import {hp} from '../../../../Constant';
import {Message} from '../../../../Constant/Messages';
import {Colors} from '../../../../Theme';
import analytics from '@react-native-firebase/analytics';
export default function RTPMerhcantPayments(props) {
  const token = useSelector((state) => state.reducers.token);
  const dispatch = useDispatch();
  useEffect(() => {
    props.navigation.addListener(
      'focus',
      () => {
        dispatch(setCurrentFlow('RTP MERCHANT'));
        async function analyticsLog() {
          await analytics().logEvent('RtpMerchantPaymentScreen');
        }
        analyticsLog();
      },
      [],
    );
  }, []);

  const getpkrAccountsforRAAST = async (isAlias) => {
    logs.log(`asdasd${isAlias}`);
    if (isAlias) {
      props.navigation.navigate('AliasManagment');
    } else {
      props.navigation.navigate('by_alias');
    }
  };

  return (
    <View
      style={[styles.container, {backgroundColor: Colors.backgroundColor}]}
      accessibilityLabel="Select Type of Transfer">
      <SubHeader
        navigation={props.navigation}
        title="Merchant Payments"
        description="RTP Request & Return Payment"
        navigateHome={true}
      />
      <View style={{height: hp(2.5)}} />

      <TabNavigator
        accessibilityLabel="Press for RTP Requests"
        text="RTP Requests"
        border={true}
        boldFont={true}
        onPress={() => props.navigation.navigate('RTPRequest')}
        navigation={props.navigation}
        rtpRequest={true}
      />

      <TabNavigator
        accessibilityLabel="Press for Requests for Return"
        text=" Requests for Return"
        border={true}
        requestsforrequest={true}
        // cnicTransfer={true}
        navigateTo={'CnicTransfer'}
        navigation={props.navigation}
        onPress={() => {
          props.navigation.navigate('RequestReturn');
        }}
        boldFont={true}
      />
    </View>
  );
}
