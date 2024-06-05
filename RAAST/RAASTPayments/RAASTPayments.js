import React from 'react';
import {View, Dimensions} from 'react-native';
import styles from './RAASTPaymentsStyle';
import GlobalHeader from '../../../Components/GlobalHeader/GlobalHeader';
import SubHeader from '../../../Components/GlobalHeader/SubHeader/SubHeader';
import TabNavigator from '../../../Components/TabNavigate/TabNavigate';
import {useSelector, useDispatch} from 'react-redux';
import {
  getcitycode,
  getraastbanklist,
  setCurrentFlow,
} from '../../../Redux/Action/Action';
import {wp} from '../../../Constant';
import analytics from '@react-native-firebase/analytics';
const screenHeight = Dimensions.get('window').height;
const screenWidth = Dimensions.get('window').width;
const RAASTPayments = (props) => {
  const token = useSelector((state) => state.reducers.token);
  const dispatch = useDispatch();
  React.useEffect(() => {
    props.navigation.addListener('focus', () => {
      dispatch(setCurrentFlow('RAAST Payments'));
      async function analyticsLog() {
        await analytics().logEvent('RAASTPaymentScreen');
      }
      analyticsLog();
    });
  }, []);
  return (
    <View style={styles.container} accessibilityLabel="RAAST Payment Selection">
      <SubHeader
        navigation={props.navigation}
        title={'RAAST Payments'}
        description={'RAAST Payments Management'}

        // navigateHome={true}
      />
      <View style={{height: wp(5)}}></View>

      <TabNavigator
        accessibilityLabel="Press to Pay by RAAST ID"
        by_alias={true}
        text={'Pay By RAAST ID'}
        navigation={props.navigation}
        navigateTo={'by_alias'}
        boldFont={true}
        border={0.5}
      />
      <TabNavigator
        accessibilityLabel="Press to pay by IBAN"
        by_iban={true}
        boldFont={true}
        border={0.5}
        text={'Pay by IBAN'}
        navigation={props.navigation}
        onPress={() => {
          dispatch(
            getraastbanklist(props.navigation, () => {
              props.navigation.navigate('by_iban');
            }),
          );
        }}
      />
    </View>
  );
};

export default RAASTPayments;
