import React, {useState} from 'react';
import {View, FlatList} from 'react-native';
import styles from './ViewAccountsStyling';
import GlobalHeader from '../../../../Components/GlobalHeader/GlobalHeader';
import SubHeader from '../../../../Components/GlobalHeader/SubHeader/SubHeader';
import TabNavigator from '../../../../Components/TabNavigate/TabNavigate';
import {useSelector, useDispatch} from 'react-redux';
import {
  getViewAccountsStatementData,
  setCurrentFlow,
} from '../../../../Redux/Action/Action';
import moment from 'moment';
import {Colors} from '../../../../Theme';
import analytics from '@react-native-firebase/analytics';
export default function ViewAccounts(props) {
  const token = useSelector((state) => state.reducers.token);
  const viewAccountsData = useSelector(
    (state) => state.reducers.viewAccountsData,
  );
  const dispatch = useDispatch();
  const [date, setdate] = useState(new Date());
  const [formattedDate, setFormattedDate] = useState(
    moment(new Date()).format('MM-DD-YYYY'),
  );
  const [tenLessDays, setTenLessDays] = useState(
    moment(new Date()).subtract(10, 'days').format('MM-DD-YYYY'),
  );
  React.useEffect(() => {
    props.navigation.addListener('focus', () => {
      dispatch(setCurrentFlow('View Accounts'));
      async function analyticsLog() {
        await analytics().logEvent('ViewAccountScreen');
      }
      analyticsLog();
    });
  }, []);
  const renderAccountsFlatlist = ({item}) => (
    <TabNavigator
      border={true}
      textWidth={'98%'}
      tabHeading={item.accountType}
      // tabHeadingBold={true}
      // tabHeadingColor={'black'}
      text={`${item.account}`}
      accessibilityLabel={`${String(item.accountType).replace('-', ' ')}-${
        item.account
      }`}
      navigation={props.navigation}
      height={'20%'}
      onPress={() =>
        dispatch(
          getViewAccountsStatementData(
            token,
            props.navigation,
            item.account,
            item.accountType,
            tenLessDays,
            formattedDate,
            {
              account: item.account,
              accountType: item.accountType,
              iban: item?.iban,
            },
            item,
          ),
        )
      }
    />
  );
  return (
    <View style={[styles.container, {backgroundColor: Colors.backgroundColor}]}>
      {/* <GlobalHeader navigation={props.navigation} /> */}
      <SubHeader
        title={'View Accounts'}
        description={'Account Details'}
        // viewAccounts={true}
        navigation={props.navigation}
      />

      <FlatList
        accessible={true}
        accessibilityLabel="Accounts List"
        showsVerticalScrollIndicator={false}
        renderItem={renderAccountsFlatlist}
        data={viewAccountsData}
        removeClippedSubviews={true}
        keyExtractor={(item) => item.account.toString()}
        disableVirtualization={false}
      />
    </View>
  );
}
