import React, {useEffect, useState} from 'react';
import {View} from 'react-native';
import SubHeader from '../../../../Components/GlobalHeader/SubHeader/SubHeader';
import styles from '../MyAccountsStyle';
import {useDispatch, useSelector} from 'react-redux';
import {hp, wp} from '../../../../Constant';
import {Colors} from '../../../../Theme';
import LimitViewComponent from '../../../../Components/ViewLimit/ViewLimit';
import {logs} from '../../../../Config/Config';
import CustomText from '../../../../Components/CustomText/CustomText';
import analytics from '@react-native-firebase/analytics';
const LimitView = (props) => {
  useEffect(() => {
    async function analyticsLog() {
      await analytics().logEvent('ViewLimitScreen');
    }
    analyticsLog();
  }, []);
  const userObject = useSelector((state) => state?.reducers?.userObject?.Limit);
  return (
    <View
      style={[styles.container, {backgroundColor: Colors.backgroundColor}]}
      accessibilityLabel="My Accounts">
      <SubHeader
        title={'View Limits'}
        description={'View your Transfer Limit'}
        navigateHome={true}
        navigation={props.navigation}
      />
      {userObject?.length >= 1 ? (
        <LimitViewComponent />
      ) : (
        <View style={{justifyContent: 'center', height: hp(80)}}>
          <CustomText
            boldFont={true}
            style={{
              fontSize: wp(6),
              alignSelf: 'center',

              color: Colors.grey,
            }}>
            No Record Found
          </CustomText>
        </View>
      )}
    </View>
  );
  e;
};
export default LimitView;
