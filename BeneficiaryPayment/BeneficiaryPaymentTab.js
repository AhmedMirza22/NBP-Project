import React, {useEffect} from 'react';
import {View} from 'react-native';
import GlobalHeader from '../../Components/GlobalHeader/GlobalHeader';
import SubHeader from '../../Components/GlobalHeader/SubHeader/SubHeader';
import {useSelector, useDispatch} from 'react-redux';
import TabNavigator from '../../Components/TabNavigate/TabNavigate';
import {setCurrentFlow} from '../../Redux/Action/Action';

import {showRAASTPayments} from '../../Config/Config';
import {getTokenCall, Service} from '../../Config/Service';
import {logs} from '../../Config/Config';
import {hp} from '../../Constant';
import {useState} from 'react';
import {Colors} from '../../Theme';

export default function BeneficiaryPaymentTab(props) {
  const token = useSelector((state) => state.reducers.token);
  const [propData, setPropData] = useState([]);
  const dispatch = useDispatch();
  const Data = props.route.params?.data?.beneficiaries;
  useEffect(() => {
    props.navigation.addListener(
      'focus',
      () => {
        dispatch(setCurrentFlow('BeneficiaryPaymentTab'));
      },
      [],
    );
  }, []);

  useEffect(() => {
    console.log('Props Data...', Data);
    const data = Data.sort(function (a, b) {
      var nameA = a.benefAlias.toLowerCase(),
        nameB = b.benefAlias.toLowerCase();
      if (nameA < nameB) return -1;
      if (nameA > nameB) return 1;
      return 0;
    });
    const filteredArray = data.reduce((result, item) => {
      if (
        item.benefType === 1 ||
        item.benefType === 2 ||
        item.benefType === 16 ||
        item.benefType === 17
      ) {
        // Add to "Transfer" group
        const transferGroup = result.find(
          (group) => group.title === 'Transfer',
        );
        if (transferGroup) {
          transferGroup.data.push(item);
        } else {
          result.push({title: 'Transfer', data: [item]});
        }
      } else if (item.benefType === 3 || item.benefType === 5) {
        // Add to "Bill Payment" group
        const billPaymentGroup = result.find(
          (group) => group.title === 'Bill Payment',
        );
        if (billPaymentGroup) {
          billPaymentGroup.data.push(item);
        } else {
          result.push({title: 'Bill Payment', data: [item]});
        }
      } else if (item.benefType === 4) {
        // Add to "Mobile TopUp" group
        const mobileTopUpGroup = result.find(
          (group) => group.title === 'Mobile TopUp',
        );
        if (mobileTopUpGroup) {
          mobileTopUpGroup.data.push(item);
        } else {
          result.push({title: 'Mobile TopUp', data: [item]});
        }
      } else if (item.benefType === 11) {
        // Add to "Government Payment" group
        const govtPayGroup = result.find(
          (group) => group.title === 'Government Payment',
        );
        if (govtPayGroup) {
          govtPayGroup.data.push(item);
        } else {
          result.push({title: 'Government Payment', data: [item]});
        }
      } else if (item.benefType === 13) {
        // Add to "Credit Card Payment" group
        const CCPayGroup = result.find(
          (group) => group.title === 'Credit Card Payment',
        );
        if (CCPayGroup) {
          CCPayGroup.data.push(item);
        } else {
          result.push({title: 'Credit Card Payment', data: [item]});
        }
      } else {
        const otherGroup = result.find((group) => group.title === 'Others');
        if (otherGroup) {
          otherGroup.data.push(item);
        } else {
          result.push({title: 'Others', data: [item]});
        }
      }
      return result;
    }, []);
    const order = 'tbmgcoadefhijklnpqrsuvwxyz';

    filteredArray.sort((a, b) => {
      const titleA = a.title.toLowerCase();
      const titleB = b.title.toLowerCase();
      let i = 0;
      while (i < titleA.length && i < titleB.length) {
        const indexA = order.indexOf(titleA.charAt(i));
        const indexB = order.indexOf(titleB.charAt(i));
        if (indexA !== indexB) {
          return indexA - indexB;
        }
        i++;
      }
      return titleA.length - titleB.length;
    });

    setPropData(filteredArray);
    logs.log(`Sendable data : ${JSON.stringify(filteredArray)}`);
  }, []);

  return (
    <View
      style={{flex: 1, backgroundColor: Colors.backgroundColor}}
      accessibilityLabel="Select Type of Transfer">
      <SubHeader
        navigation={props.navigation}
        title="Beneficiary Payments"
        description="Pay to your Beneficiary list"
        navigateHome={true}
      />
      <View style={{height: hp(2.5)}} />
      <TabNavigator
        accessibilityLabel="Press for Transfer"
        border={true}
        boldFont={true}
        text=" Transfers"
        interBankTransfer={true}
        navigateTo={'BeneficiaryPayment'}
        navigation={props.navigation}
        onPress={() => {
          const indedx = propData.findIndex(
            (item) => item.title === 'Transfer',
          );
          props.navigation.navigate('BeneficiaryPayment', propData[indedx]);
        }}
      />

      <TabNavigator
        accessibilityLabel="Press for Bill Payments"
        text=" Bill Payments"
        border={true}
        boldFont={true}
        onPress={() => {
          const indedx = propData.findIndex(
            (item) => item.title === 'Bill Payment',
          );
          props.navigation.navigate('BeneficiaryPayment', propData[indedx]);
        }}
        navigation={props.navigation}
        utilityBillPayments={true}
      />
      <TabNavigator
        accessibilityLabel="Press for Mobile Top Up"
        text=" Mobile Top Up"
        mobilePayment={true}
        border={true}
        onPress={() => {
          {
            const indedx = propData.findIndex(
              (item) => item.title === 'Mobile TopUp',
            );
            props.navigation.navigate('BeneficiaryPayment', propData[indedx]);
          }
        }}
        boldFont={true}
        navigation={props.navigation}
        navigateTo={'BeneficiaryPayment'}
      />
      <TabNavigator
        accessibilityLabel="Press for Government Payments"
        text=" Government Payments"
        border={true}
        governmentPayments={true}
        navigateTo={'BeneficiaryPayment'}
        navigation={props.navigation}
        onPress={() => {
          const indedx = propData.findIndex(
            (item) => item.title === 'Government Payment',
          );
          props.navigation.navigate('BeneficiaryPayment', propData[indedx]);
        }}
        boldFont={true}
      />
      <TabNavigator
        accessibilityLabel="Press for Credit Card Payments"
        text=" Credit Card Payments"
        border={true}
        creditCardBills={true}
        navigateTo={'BeneficiaryPayment'}
        navigation={props.navigation}
        onPress={() => {
          const indedx = propData.findIndex(
            (item) => item.title === 'Credit Card Payment',
          );
          props.navigation.navigate('BeneficiaryPayment', propData[indedx]);
        }}
        boldFont={true}
      />
      <TabNavigator
        accessibilityLabel="Press for Other Payments"
        text=" Others"
        border={true}
        others={true}
        navigateTo={'BeneficiaryPayment'}
        navigation={props.navigation}
        onPress={() => {
          const indedx = propData.findIndex((item) => item.title === 'Others');
          props.navigation.navigate('BeneficiaryPayment', propData[indedx]);
        }}
        boldFont={true}
      />
    </View>
  );
}
