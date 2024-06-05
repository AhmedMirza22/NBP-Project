import React, {useEffect} from 'react';
import {View, Dimensions, ScrollView} from 'react-native';
import styles from './AddBeneficiaryStyling';
import GlobalHeader from '../../../Components/GlobalHeader/GlobalHeader';
import SubHeader from '../../../Components/GlobalHeader/SubHeader/SubHeader';
import TabNavigator from '../../../Components/TabNavigate/TabNavigate';
import {useDispatch} from 'react-redux';
import {
  setCurrentFlow,
  getraastbanklist,
  catchError,
  serviceResponseCheck,
  setUserObject,
  setLoader,
  updateSessionToken,
} from '../../../Redux/Action/Action';
import {getTokenCall, Service} from '../../../Config/Service';
import {logs, isRAAST, showRAASTPayments} from '../../../Config/Config';
import CustomText from '../../../Components/CustomText/CustomText';
import {wp} from '../../../Constant';
import {Colors} from '../../../Theme';
import {Message} from '../../../Constant/Messages';
import analytics from '@react-native-firebase/analytics';

const AddBeneficiary = React.memo((props) => {
  const dispatch = useDispatch();

  const getpkrAccounts = async () => {
    logs.log('lag gai');
    try {
      dispatch(setLoader(true));

      const response = await getTokenCall(Service.getPkrAccounts);
      const responseData = response.data;
      logs.logResponse(responseData);
      if (response.data.responseCode === '00') {
        dispatch(setLoader(false));
        dispatch(updateSessionToken(response));
        dispatch(
          setUserObject({
            pkAccounts: response?.data?.data?.accounts,
          }),
        );
        props.navigation.navigate('RAASTBeneficiary');
      } else {
        dispatch(serviceResponseCheck(response, props.navigation));
      }
    } catch (error) {
      dispatch(setLoader(false));

      logs.log(`screen crash error : ${JSON.stringify(error)}`);
      dispatch(catchError(error));
    }
  };

  useEffect(() => {
    props.navigation.addListener('focus', () => {
      dispatch(setCurrentFlow('Add Beneficiary'));
      async function analyticsLog() {
        await analytics().logEvent('AddBeneficiaryScreen');
      }
      analyticsLog();
    });
  }, []);
  return (
    <View
      style={[styles.container, {backgroundColor: Colors.backgroundColor}]}
      accessibilityLabel="Add Beneficiary Screen">
      {/* <GlobalHeader navigation={props.navigation} /> */}
      <SubHeader
        title={'Add Beneficiary'}
        description={'Add Beneficiary in the list'}
        // addBeneficiary={true}
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
            {'Transfers'}
          </CustomText>
        </View>
        {/* {showRAASTPayments ? (
          <TabNavigator
            raast2={true}
            boldFont={true}
            text={Message.raastTitle}
            navigation={props.navigation}
            // navigateTo={'RAASTBeneficiary'}
            multipleLines={1}
            onPress={() => {
              dispatch(
                getraastbanklist(props.navigation, () => {
                  // props.navigation.navigate('RAASTBeneficiary');
                  getpkrAccounts();
                }),
              );
            }}
            border={true}
          />
        ) : null} */}
        {/* <TabNavigator
          text={' Fund Transfer'}
          boldFont={true}
          accessibilityLabel={'Fund Transfer'}
          fundsTransfer={true}
          navigation={props.navigation}
          navigateTo={'BeneficiaryTransaction'}
          dataObject={{data: 'fundsTransfer', benefType: 1}}
          multipleLines={1}
          border={true}
        /> */}
        <TabNavigator
          boldFont={true}
          text={'Fund Transfer'}
          accessibilityLabel={' Fund Transfer'}
          ibft2={true}
          navigation={props.navigation}
          navigateTo={'BenefDataSelection'}
          dataObject={{data: 'interBankTransfer', benefType: 2}}
          multipleLines={1}
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
          boldFont={true}
          text={'Utility Bill Payment'}
          accessibilityLabel={'Utility Bill Payment'}
          utilityBillPayments={true}
          navigation={props.navigation}
          navigateTo={'BeneficiaryTransaction'}
          dataObject={{data: 'utilityBillPayments', benefType: 3}}
          multipleLines={1}
          border={true}
        />

        <TabNavigator
          boldFont={true}
          text={'Internet Bill Payment'}
          accessibilityLabel={'Internet Bill Payment'}
          internetBillPayment={true}
          navigation={props.navigation}
          navigateTo={'BenefDataSelection'}
          dataObject={{data: 'internetBillPayment', benefType: 5}}
          multipleLines={1}
          border={true}
        />
        <TabNavigator
          boldFont={true}
          text={'Education Payment'}
          accessibilityLabel={'Education Payment'}
          educationPayment={true}
          navigation={props.navigation}
          navigateTo={'BenefDataSelection'}
          dataObject={{data: 'educationPayment', benefType: 6}}
          multipleLines={1}
          border={true}
        />
        <TabNavigator
          boldFont={true}
          text={'1Bill Voucher/ Fee Payment'}
          accessibilityLabel={'1Bill Voucher/ Fee Payment'}
          voucherPayment={true}
          // textWidth={'100%'}
          multipleLines={1}
          navigation={props.navigation}
          navigateTo={'BeneficiaryTransaction'}
          dataObject={{data: 'voucherPayment', benefType: 15}}
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
          boldFont={true}
          text={'Mobile Bill Payment'}
          accessibilityLabel={'Mobile Bill Payment'}
          mobilePayment={true}
          navigation={props.navigation}
          navigateTo={'BenefDataSelection'}
          dataObject={{data: 'mobilePayment', benefType: 4}}
          border={true}
          multipleLines={1}
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
          boldFont={true}
          text={'Government Payments'}
          accessibilityLabel={'Government Payments'}
          governmentPayments={true}
          navigation={props.navigation}
          navigateTo={'BenefDataSelection'}
          multipleLines={1}
          dataObject={{data: 'governmentPayments', benefType: 11}}
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
            {'Credit Card Payments'}
          </CustomText>
        </View>
        <TabNavigator
          boldFont={true}
          text={'1Bill Credit Card Bills'}
          accessibilityLabel={'1Bill Credit Card Bills'}
          creditCardBills={true}
          navigation={props.navigation}
          navigateTo={'BeneficiaryTransaction'}
          multipleLines={1}
          dataObject={{data: 'creditCardBills', benefType: 13}}
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
          boldFont={true}
          text={'Insurance Payment'}
          accessibilityLabel={'Insurance Payment'}
          insurancePayment={true}
          navigation={props.navigation}
          navigateTo={'BenefDataSelection'}
          multipleLines={1}
          dataObject={{data: 'insurancePayment', benefType: 8}}
          border={true}
        />
        <TabNavigator
          boldFont={true}
          text={'Online Shopping'}
          accessibilityLabel={'Online Shopping'}
          onlineShopping={true}
          navigation={props.navigation}
          navigateTo={'BenefDataSelection'}
          multipleLines={1}
          dataObject={{data: 'onlineShopping', benefType: 9}}
          border={true}
        />
        <TabNavigator
          boldFont={true}
          text={'Investments'}
          accessibilityLabel={'Investments'}
          investment={true}
          navigation={props.navigation}
          navigateTo={'BenefDataSelection'}
          dataObject={{data: 'investment', benefType: 10}}
          multipleLines={1}
          border={true}
        />

        <TabNavigator
          boldFont={true}
          text={'1Bill Top Up'}
          accessibilityLabel={'1Bill Top Up'}
          topUp={true}
          navigation={props.navigation}
          navigateTo={'BeneficiaryTransaction'}
          dataObject={{data: 'topUp', benefType: 14}}
          multipleLines={1}
          border={true}
        />

        <TabNavigator
          boldFont={true}
          text={'Other'}
          accessibilityLabel={'Other'}
          others={true}
          navigation={props.navigation}
          navigateTo={'BenefDataSelection'}
          dataObject={{data: 'others', benefType: 12}}
          border={true}
        />
      </ScrollView>
    </View>
  );
});

export default AddBeneficiary;
