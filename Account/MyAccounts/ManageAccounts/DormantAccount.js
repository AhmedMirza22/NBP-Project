import React, {useState} from 'react';
import {View, FlatList} from 'react-native';
import GlobalHeader from '../../../../Components/GlobalHeader/GlobalHeader';
import SubHeader from '../../../../Components/GlobalHeader/SubHeader/SubHeader';
import TabNavigator from '../../../../Components/TabNavigate/TabNavigate';
import {useSelector, useDispatch} from 'react-redux';
import styles from './ManageAccountsStyling';
import {
  managedAccountDetails,
  setAppAlert,
  setCurrentFlow,
} from '../../../../Redux/Action/Action';
import {Colors} from '../../../../Theme';
import {hp, wp} from '../../../../Constant';
import CustomText from '../../../../Components/CustomText/CustomText';
import {logs} from '../../../../Config/Config';
import analytics from '@react-native-firebase/analytics';
export default function ManageDormantAccounts(props) {
  const token = useSelector((state) => state.reducers.token);
  const userObject = useSelector((state) => state.reducers.userObject);
  const dispatch = useDispatch();
  const manageAccounts = useSelector((state) => state.reducers.DormantAccount);

  logs.log('userObjectuserObjectuserObject', userObject);

  const renderDormantAccountsFlatlist = ({item}) => (
    <TabNavigator
      border={true}
      tabHeadingBold={true}
      // tabHeadingColor={'black'}
      tabHeading={item?.accountTitle ? item?.accountTitle : null}
      text={`${item.accountNumber}`}
      accessibilityLabel={`${item.accountNumber}`}
      navigation={props.navigation}
      textWidth={'100%'}
      onPress={() => {
        logs.log(item);
        if (item?.accountType === 'I') {
          dispatch(
            setAppAlert(
              'This feature is not yet available for Islamic Accounts.',
            ),
          );
        } else {
          props?.navigation.navigate('ManageAccountsDetails', {data: item});
        }
      }}
    />
  );

  React.useEffect(() => {
    props.navigation.addListener('focus', () => {
      dispatch(setCurrentFlow('Manage Account'));
      async function analyticsLog() {
        await analytics().logEvent('DormatAccountScreen');
      }
      analyticsLog();
    });
  }, []);

  return (
    <View style={{flex: 1, backgroundColor: Colors.backgroundColor}}>
      <View accessible={true} accessibilityLabel="Manage Linked Accounts">
        <SubHeader
          navigation={props.navigation}
          title={'Manage Dormant Account'}
          description={'Manage Your Dormant Account'}

          // manageAccounts={true}
        />

        <FlatList
          accessibilityLabel="Accounts List"
          showsVerticalScrollIndicator={false}
          renderItem={renderDormantAccountsFlatlist}
          data={userObject?.DormantAccount?.accounts}
          removeClippedSubviews={true}
          keyExtractor={(item) => item?.account}
          disableVirtualization={false}
        />
      </View>
    </View>
  );
}
