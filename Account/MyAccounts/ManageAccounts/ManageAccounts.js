import React, {useState} from 'react';
import {View, FlatList} from 'react-native';
import GlobalHeader from '../../../../Components/GlobalHeader/GlobalHeader';
import SubHeader from '../../../../Components/GlobalHeader/SubHeader/SubHeader';
import TabNavigator from '../../../../Components/TabNavigate/TabNavigate';
import {useSelector, useDispatch} from 'react-redux';
import styles from './ManageAccountsStyling';
import {
  managedAccountDetails,
  setCurrentFlow,
} from '../../../../Redux/Action/Action';
import {Colors} from '../../../../Theme';
import analytics from '@react-native-firebase/analytics';
export default function ManageAccounts(props) {
  const token = useSelector((state) => state.reducers.token);
  const dispatch = useDispatch();

  const manageAccounts = useSelector((state) => state.reducers.manageAccounts);
  const renderAccountsFlatlist = ({item}) => (
    <TabNavigator
      border={true}
      tabHeadingBold={true}
      // tabHeadingColor={'black'}
      tabHeading={item.accountType}
      text={`${item.account}`}
      accessibilityLabel={`${item.accountType}-${item.account}`}
      navigation={props.navigation}
      textWidth={'100%'}
      onPress={() => {
        dispatch(managedAccountDetails(token, props.navigation, item));
      }}
    />
  );

  React.useEffect(() => {
    props.navigation.addListener('focus', () => {
      dispatch(setCurrentFlow('Manage Account'));
      async function analyticsLog() {
        await analytics().logEvent('ManageAccounts');
      }
      analyticsLog();
    });
  }, []);

  return (
    <View
      style={[styles.container, {backgroundColor: Colors.backgroundColor}]}
      accessible={true}
      accessibilityLabel="Manage Linked Accounts">
      {/* <GlobalHeader navigation={props.navigation} /> */}
      <SubHeader
        navigation={props.navigation}
        title={'Manage Account'}
        description={'Manage your linked accounts'}
        // manageAccounts={true}
      />
      {/* <TabNavigator
        text={'Savings-Account-00023135510381'}
        navigateTo={'ManageAccountsDetails'}
        navigation={props.navigation}
      /> */}
      <FlatList
        accessibilityLabel="Accounts List"
        showsVerticalScrollIndicator={false}
        renderItem={renderAccountsFlatlist}
        data={manageAccounts?.accounts}
        removeClippedSubviews={true}
        keyExtractor={(item) => item.account.toString()}
        disableVirtualization={false}
      />
    </View>
  );
}
