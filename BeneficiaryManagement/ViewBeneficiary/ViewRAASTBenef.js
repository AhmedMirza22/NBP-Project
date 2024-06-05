import React, {useEffect} from 'react';
import {View, Dimensions, ScrollView} from 'react-native';
import styles from './ViewBeneficiaryStyling';
import GlobalHeader from '../../../Components/GlobalHeader/GlobalHeader';
import SubHeader from '../../../Components/GlobalHeader/SubHeader/SubHeader';
import TabNavigator from '../../../Components/TabNavigate/TabNavigate';
import {all_benef, setCurrentFlow} from '../../../Redux/Action/Action';
import {useSelector, useDispatch} from 'react-redux';
const screenWidth = Dimensions.get('window').width;
import analytics from '@react-native-firebase/analytics';

const ViewRAASTBenef = React.memo((props) => {
  const dispatch = useDispatch();
  const token = useSelector((state) => state.reducers.token);

  useEffect(() => {
    props.navigation.addListener('focus', () => {
      dispatch(setCurrentFlow('View RAAST Beneficiary'));
      async function analyticsLog() {
        await analytics().logEvent('ViewRaastBenefScreen');
      }
      analyticsLog();
    });
  }, []);

  return (
    <View style={styles.container}>
      {/* <GlobalHeader navigation={props.navigation} /> */}
      <SubHeader
        title={'View Beneficiary'}
        description={'View List of Beneficiaries'}
        // viewBeneficiaries={true}
        navigation={props.navigation}
      />
      <ScrollView showsVerticalScrollIndicator={false}>
        <TabNavigator
          border={true}
          text={'RAAST ID'}
          interBankTransfer={true}
          navigation={props.navigation}
          navigateTo={'TransactionRecord'}
          // dataObject={2}
          onPress={() => {
            dispatch(all_benef(token, props.navigation, 1, 16));
          }}
        />
        <TabNavigator
          border={true}
          text={'IBAN'}
          fundsTransfer={true}
          navigation={props.navigation}
          navigateTo={'TransactionRecord'}
          // dataObject={1}
          onPress={() => {
            dispatch(all_benef(token, props.navigation, 1, 17));
          }}
        />
      </ScrollView>
    </View>
  );
});

export default ViewRAASTBenef;
