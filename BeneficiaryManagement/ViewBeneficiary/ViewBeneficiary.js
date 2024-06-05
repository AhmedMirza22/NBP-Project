import React, {useEffect} from 'react';
import {View, Dimensions, ScrollView} from 'react-native';
import styles from './ViewBeneficiaryStyling';
import GlobalHeader from '../../../Components/GlobalHeader/GlobalHeader';
import SubHeader from '../../../Components/GlobalHeader/SubHeader/SubHeader';
import TabNavigator from '../../../Components/TabNavigate/TabNavigate';
import {all_benef, setCurrentFlow} from '../../../Redux/Action/Action';
import {useSelector, useDispatch} from 'react-redux';
import {logs, isRAAST, showRAASTPayments} from '../../../Config/Config';
import CustomText from '../../../Components/CustomText/CustomText';
import {wp} from '../../../Constant';
import {Colors} from '../../../Theme';
import analytics from '@react-native-firebase/analytics';
const screenWidth = Dimensions.get('window').width;

const ViewBeneficiary = React.memo((props) => {
  const dispatch = useDispatch();
  const token = useSelector((state) => state.reducers.token);

  useEffect(() => {
    props.navigation.addListener('focus', () => {
      dispatch(setCurrentFlow('View Beneficiary'));
      async function analyticsLog() {
        await analytics().logEvent('ViewBeneficaryScreen');
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
        <View style={{backgroundColor: Colors.backgroundColor}}>
          <CustomText
            style={{
              color: Colors.grey,
              paddingLeft: wp(5),
              padding: wp(3),
              fontSize: wp(4),
            }}>
            {'Trasnfers'}
          </CustomText>
        </View>
        {showRAASTPayments ? (
          <TabNavigator
            border={true}
            text={' RAAST ID'}
            raast={true}
            boldFont={true}
            navigation={props.navigation}
            navigateTo={'ViewRAASTBenef'}
            // dataObject={1}
            // onPress={() => {
            //   // dispatch(all_benef(token, props.navigation, 1, 16));
            //   // props.navigation.navigate('ViewRAASTBenef');
            // }}
            border={true}
          />
        ) : null}
        <TabNavigator
          border={true}
          text={' Fund Transfer'}
          fundsTransfer={true}
          boldFont={true}
          navigation={props.navigation}
          navigateTo={'TransactionRecord'}
          // dataObject={1}
          onPress={() => {
            dispatch(all_benef(token, props.navigation, 1, 1));
          }}
          border={true}
        />
        <TabNavigator
          border={true}
          text={' Inter Bank Fund Transfer'}
          ibft2={true}
          boldFont={true}
          navigation={props.navigation}
          navigateTo={'TransactionRecord'}
          // dataObject={2}
          onPress={() => {
            dispatch(all_benef(token, props.navigation, 1, 2));
          }}
          border={true}
        />
        <View style={{backgroundColor: Colors.backgroundColor}}>
          <CustomText
            style={{
              color: Colors.grey,
              paddingLeft: wp(5),
              padding: wp(3),
              fontSize: wp(4),
            }}>
            {'Bill Payments'}
          </CustomText>
        </View>
        <TabNavigator
          border={true}
          text={' Utility Bill Payment'}
          utilityBillPayments={true}
          boldFont={true}
          navigation={props.navigation}
          navigateTo={'TransactionRecord'}
          // dataObject={3}
          onPress={() => {
            dispatch(all_benef(token, props.navigation, 1, 3));
          }}
          border={true}
        />

        <TabNavigator
          border={true}
          text={' Internet Bill Payment'}
          internetBillPayment={true}
          boldFont={true}
          navigation={props.navigation}
          navigateTo={'TransactionRecord'}
          // dataObject={5}
          onPress={() => {
            dispatch(all_benef(token, props.navigation, 1, 5));
          }}
          border={true}
        />
        <TabNavigator
          border={true}
          text={' Education Payment'}
          educationPayment={true}
          boldFont={true}
          navigation={props.navigation}
          navigateTo={'TransactionRecord'}
          // dataObject={6}
          onPress={() => {
            dispatch(all_benef(token, props.navigation, 1, 8));
          }}
          border={true}
        />
        <TabNavigator
          text={' 1Bill Voucher/ Fee Payment'}
          voucherPayment={true}
          navigation={props.navigation}
          boldFont={true}
          multipleLines={1}
          navigateTo={'TransactionRecord'}
          // dataObject={13}
          onPress={() => {
            dispatch(all_benef(token, props.navigation, 1, 15));
          }}
          border={true}
        />
        <View style={{backgroundColor: Colors.backgroundColor}}>
          <CustomText
            style={{
              color: Colors.grey,
              paddingLeft: wp(5),
              padding: wp(3),
              fontSize: wp(4),
            }}>
            {'Mobile TopUp'}
          </CustomText>
        </View>
        <TabNavigator
          border={true}
          text={' Mobile Bill Payment'}
          mobilePayment={true}
          boldFont={true}
          navigation={props.navigation}
          navigateTo={'TransactionRecord'}
          // dataObject={4}
          onPress={() => {
            dispatch(all_benef(token, props.navigation, 1, 4));
          }}
          border={true}
        />
        <View style={{backgroundColor: Colors.backgroundColor}}>
          <CustomText
            style={{
              color: Colors.grey,
              paddingLeft: wp(5),
              padding: wp(3),
              fontSize: wp(4),
            }}>
            {'Government Payments'}
          </CustomText>
        </View>
        <TabNavigator
          text={' Government Payments'}
          governmentPayments={true}
          navigation={props.navigation}
          navigateTo={'TransactionRecord'}
          boldFont={true}
          // dataObject={10}
          onPress={() => {
            dispatch(all_benef(token, props.navigation, 1, 11));
          }}
          border={true}
        />
        <View style={{backgroundColor: Colors.backgroundColor}}>
          <CustomText
            style={{
              color: Colors.grey,
              paddingLeft: wp(5),
              padding: wp(3),
              fontSize: wp(4),
            }}>
            {'Credit Cards Payments'}
          </CustomText>
        </View>
        <TabNavigator
          text={' 1Bill Credit Card Bills'}
          creditCardBills={true}
          navigation={props.navigation}
          boldFont={true}
          navigateTo={'TransactionRecord'}
          // dataObject={11}
          onPress={() => {
            dispatch(all_benef(token, props.navigation, 1, 13));
          }}
          border={true}
        />
        <View style={{backgroundColor: Colors.backgroundColor}}>
          <CustomText
            style={{
              color: Colors.grey,
              paddingLeft: wp(5),
              padding: wp(3),
              fontSize: wp(4),
            }}>
            {'Others'}
          </CustomText>
        </View>
        <TabNavigator
          text={' Insurance Payment'}
          insurancePayment={true}
          navigation={props.navigation}
          boldFont={true}
          navigateTo={'TransactionRecord'}
          // dataObject={7}
          onPress={() => {
            dispatch(all_benef(token, props.navigation, 1, 7));
          }}
          border={true}
        />
        <TabNavigator
          text={' Online Shopping'}
          onlineShopping={true}
          navigation={props.navigation}
          boldFont={true}
          navigateTo={'TransactionRecord'}
          // dataObject={8}
          onPress={() => {
            dispatch(all_benef(token, props.navigation, 1, 6));
          }}
          border={true}
        />
        <TabNavigator
          text={' Investments'}
          investment={true}
          navigation={props.navigation}
          boldFont={true}
          navigateTo={'TransactionRecord'}
          // dataObject={9}
          onPress={() => {
            dispatch(all_benef(token, props.navigation, 1, 9));
          }}
          border={true}
        />

        <TabNavigator
          text={' 1Bill Top Up'}
          topUp={true}
          navigation={props.navigation}
          navigateTo={'TransactionRecord'}
          boldFont={true}
          // dataObject={12}
          onPress={() => {
            dispatch(all_benef(token, props.navigation, 1, 14));
          }}
          border={true}
        />

        <TabNavigator
          text={' Other'}
          others={true}
          boldFont={true}
          navigation={props.navigation}
          navigateTo={'TransactionRecord'}
          // dataObject={14}
          onPress={() => {
            dispatch(all_benef(token, props.navigation, 1, 10));
          }}
          border={true}
        />
      </ScrollView>
    </View>
  );
});

export default ViewBeneficiary;
