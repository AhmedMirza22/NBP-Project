import React, {useEffect, useState} from 'react';
import {View} from 'react-native';
import styles from '../MyAccounts/MyAccountsStyle';
import GlobalHeader from '../../../Components/GlobalHeader/GlobalHeader';
import SubHeader from '../../../Components/GlobalHeader/SubHeader/SubHeader';
import TabNavigate from '../../../Components/TabNavigate/TabNavigate';
import {useSelector, useDispatch} from 'react-redux';
import CustomAlert from '../../../Components/Custom_Alert/CustomAlert';
import {
  Service,
  getDormantAccountCall,
  getTokenCall,
} from '../../../Config/Service';
import {logs} from '../../../Config/Config';
import analytics from '@react-native-firebase/analytics';
import {
  manageAccounts,
  getViewAccountsData,
  setLoader,
  updateSessionToken,
  catchError,
  serviceResponseCheck,
  setUserObject,
  helpInforamtion,
} from '../../../Redux/Action/Action';
import {wp} from '../../../Constant';
import {Colors} from '../../../Theme';
import InformationIcon from '../../../Components/InformationIcon/InformationIcon';
import I18n from '../../../Config/Language/LocalizeLanguageString';

const MyAccounts = (props) => {
  const [customAlertState, setSustomAlertState] = useState(false);
  const dispatch = useDispatch();
  const userObject = useSelector((state) => state?.reducers?.userObject);
  const token = useSelector((state) => state.reducers.token);
  const [proceedAlert, changeproceedAlert] = useState(false);
  useEffect(() => {
    async function analyticsLog() {
      await analytics().logEvent('ManageAccountScreen');
    }
    analyticsLog();
  }, []);

  const isL0Customer =
    userObject.customerLevel &&
    String(userObject.customerLevel).toUpperCase() == 'L0'
      ? false
      : String(userObject.customerLevel).toUpperCase() == 'L1'
      ? false
      : true;
  logs.log('Customer is -----', isL0Customer);
  const dormantCall = async () => {
    try {
      dispatch(setLoader(true));
      const response = await getTokenCall(Service.dormantAccount);
      const responseData = response;
      if (response?.data?.responseCode === '00') {
        dispatch(setLoader(false));
        dispatch(updateSessionToken(response));
        dispatch(
          setUserObject({
            DormantAccount: responseData?.data?.data,
          }),
        );
        logs.log('91827391723------>', responseData?.data?.data);
        props.navigation.navigate('ManageDormantAccounts', {
          // DormantAccount: true,
        });
      } else {
        dispatch(serviceResponseCheck(response, props.navigation));
      }
    } catch (error) {
      logs.log('errors', error);
      dispatch(catchError(error));
    }
  };

  return (
    <View
      style={[styles.container, {backgroundColor: Colors.backgroundColor}]}
      accessibilityLabel="My Accounts">
      <SubHeader
        title={'Account Management'}
        description={'View All Account Details'}
        navigateHome={true}
        navigation={props.navigation}
      />
      <View style={{height: wp(5)}} />
      <TabNavigate
        accessibilityLabel="Press to View Accounts"
        text={'View Accounts'}
        // navigateTo={'ViewAccounts'}
        boldFont={true}
        border={true}
        viewAccounts={true}
        navigation={props.navigation}
        onPress={() => {
          // props.navigation.navigate('ViewAccounts');

          dispatch(getViewAccountsData(token, props.navigation));
        }}
        textWidth={'80%'}
      />
      <TabNavigate
        accessibilityLabel="Press to Add Accounts"
        text={'Add Account'}
        border={true}
        addAccounts={true}
        boldFont={true}
        navigateTo={'AddAccount'}
        navigation={props.navigation}
        textWidth={'80%'}
      />
      <TabNavigate
        accessibilityLabel="Press to Manage Accounts"
        text={'Manage Account'}
        manageAccounts={true}
        boldFont={true}
        border={true}
        navigateTo={'ManageAccounts'}
        navigation={props.navigation}
        onPress={() => {
          dispatch(manageAccounts(token, props.navigation));
        }}
        textWidth={'80%'}
      />
      {/* <TabNavigate
        accessibilityLabel="Press to Manage Dormant Accounts"
        text={'Dormant Account'}
        manageAccounts={true}
        boldFont={true}
        border={true}
        // navigateTo={'ManageAccounts'}
        navigation={props.navigation}
        onPress={() => {
          dormantCall();
        }}
        textWidth={'80%'}
      /> */}
      <TabNavigate
        accessibilityLabel="Press to Manage Dormant Accounts"
        text={'Certificates'}
        certificates={true}
        boldFont={true}
        border={true}
        navigation={props.navigation}
        onPress={() => {
          props.navigation.navigate('Certificates');
        }}
        textWidth={'80%'}
      />
      {/* <TabNavigate
        accessibilityLabel="Press to Manage Limit Management"
        text={'MyProfits'}
        certificates={true}
        boldFont={true}
        border={true}
        navigation={props.navigation}
        onPress={() => {
          props.navigation.navigate('MyProfit');
        }}
        textWidth={'80%'}
      />
      <TabNavigate
        accessibilityLabel="Press to Manage Limit Management"
        text={'LimitManagement'}
        certificates={true}
        boldFont={true}
        border={true}
        navigation={props.navigation}
        onPress={() => {
          props.navigation.navigate('LimitManagement');
        }}
        textWidth={'80%'}
      /> */}

      <TabNavigate
        accessibilityLabel="Press to Manage Limit Management"
        text={'MyProfits'}
        profit={true}
        boldFont={true}
        border={true}
        navigation={props.navigation}
        onPress={() => {
          if (isL0Customer === false) {
            changeproceedAlert(true);
          } else if (
            userObject?.pkAccounts[0]?.accountType === 'Savings-Account'
          ) {
            props.navigation.navigate('MyProfit');
          } else {
            setSustomAlertState(true);
          }
        }}
        textWidth={'80%'}
      />

      <TabNavigate
        accessibilityLabel="Press to Manage Limit Management"
        text={'LimitManagement'}
        investment={true}
        boldFont={true}
        border={true}
        navigation={props.navigation}
        onPress={() => {
          if (isL0Customer === false) {
            changeproceedAlert(true);
          } else {
            props.navigation.navigate('LimitLandingScreen');
          }
        }}
        textWidth={'80%'}
      />

      <InformationIcon
        onPress={() => {
          logs.log('testing');
          dispatch(
            helpInforamtion({
              title: 'Account Management',
              page: 'MyAccounts',
              state: true,
            }),
          );
        }}
      />
      <CustomAlert
        overlay_state={customAlertState}
        alert_text={'Profit Not Available For This Account Type'}
        onPressOkay={() => {
          //  setAlertState(false)
          // dispatch(hideCvvAlert());
          setSustomAlertState(false);
        }}
        onPressCancel={() => setSustomAlertState(false)}
      />
      <CustomAlert
        overlay_state={proceedAlert}
        title={'Upgrade Registration'}
        accessibilityLabel={'Upgrade Registration'}
        label={'Upgrade User'}
        alert_text={
          I18n[
            'You need to Upgrade your registration to unlock all features .Do you want to upgrade?'
          ]
        }
        yesNoButtons={isL0Customer ? false : true}
        onPressYes={() => {
          changeproceedAlert(false);
          setTimeout(() => {
            props.navigation.navigate('Upgrade_Debit_no', {
              screen: 'dashboard',
            });
          }, 500);
        }}
        onPressNo={() => {
          changeproceedAlert(false);
        }}
        onPressOkay={() => {
          changeproceedAlert(false);
        }}
        onPressCancel={() => changeproceedAlert(false)}
      />
    </View>
  );
};
export default MyAccounts;
