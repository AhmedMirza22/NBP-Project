import React, {useEffect, useState} from 'react';
import {View} from 'react-native';
import SubHeader from '../../../../Components/GlobalHeader/SubHeader/SubHeader';
import styles from '../MyAccountsStyle';
import {useDispatch} from 'react-redux';
import {wp} from '../../../../Constant';
import {Colors} from '../../../../Theme';
import LimitViewComponent from '../../../../Components/ViewLimit/ViewLimit';
import TabNavigate from '../../../../Components/TabNavigate/TabNavigate';
import analytics from '@react-native-firebase/analytics';
import {logs} from '../../../../Config/Config';
import {Service, getTokenCall} from '../../../../Config/Service';
import {
  setLoader,
  updateSessionToken,
  catchError,
  serviceResponseCheck,
  setUserObject,
  helpInforamtion,
} from '../../../../Redux/Action/Action';
import InformationIcon from '../../../../Components/InformationIcon/InformationIcon';
const LimitLandingScreen = (props) => {
  const [isLoader, setIsLoader] = useState(false);
  useEffect(() => {
    async function analyticsLog() {
      await analytics().logEvent('LimitLandingScreen');
    }
    analyticsLog();
  });
  const dispatch = useDispatch();

  const getLimit = async (token) => {
    try {
      setIsLoader(true);
      dispatch(setLoader(true));
      const response = await getTokenCall(Service.getcustomerlimit, token);
      logs.log('response---->', response);
      const responseData = response.data;
      logs.log('yeh send karna hai', responseData);
      if (
        response.data.responseCode === '00' ||
        response.data.responseCode === '200'
      ) {
        logs.log(response?.data?.data);
        dispatch(updateSessionToken(response));
        setIsLoader(false);
        dispatch(
          setUserObject({
            Limit: response?.data?.data,
          }),
        );
        dispatch(setLoader(false));
      } else {
        dispatch(serviceResponseCheck(response, props.navigation));
        setIsLoader(false);
        dispatch(setLoader(false));
      }
    } catch (error) {
      setIsLoader(false);
      dispatch(setLoader(false));
      logs.log(`screen crash error : ${JSON.stringify(error)}`);
      dispatch(catchError(error));
    }
  };

  return (
    <View
      style={[styles.container, {backgroundColor: Colors.backgroundColor}]}
      accessibilityLabel="My Accounts">
      <SubHeader
        title={'Limit Management'}
        description={'Manage Your Daily Transfer Limit'}
        navigateHome={true}
        navigation={props.navigation}
      />

      <TabNavigate
        accessibilityLabel="Press to Manage Dormant Accounts"
        text={'View Existing Limits'}
        boldFont={true}
        border={true}
        navigation={props.navigation}
        onPress={() => {
          getLimit();
          props.navigation.navigate('LimitView');
        }}
        textWidth={'80%'}
      />
      <TabNavigate
        accessibilityLabel="Press to Limit Management"
        text={'Change Existing Limit'}
        boldFont={true}
        border={true}
        navigation={props.navigation}
        onPress={() => {
          props.navigation.navigate('LimitManagement');
        }}
        textWidth={'80%'}
      />

      {/* <InformationIcon
        onPress={() => {
          dispatch(
            helpInforamtion({
              title: 'Limit Management',
              page: 'limitManagement',
              state: true,
            }),
          );
        }}
      /> */}
    </View>
  );
};
export default LimitLandingScreen;
