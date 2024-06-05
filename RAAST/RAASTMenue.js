import React, {useEffect} from 'react';
import {View, Dimensions} from 'react-native';
import styles from './RAASTStyle';
import GlobalHeader from '../../Components/GlobalHeader/GlobalHeader';
import SubHeader from '../../Components/GlobalHeader/SubHeader/SubHeader';
import TabNavigator from '../../Components/TabNavigate/TabNavigate';
import TempTabNavigate from '../../Components/TempTabNavigate/TempTab';
import {useSelector, useDispatch} from 'react-redux';
import {
  overview,
  setLoader,
  catchError,
  serviceResponseCheck,
  updateSessionToken,
  setUserObject,
  getraastbanklist,
} from '../../Redux/Action/Action';
import CustomAlert from '../../Components/Custom_Alert/CustomAlert';
import analytics from '@react-native-firebase/analytics';
import RAASTModal from '../../Components/RAASTModal/RAASTModal';
import {getTokenCall, Service} from '../../Config/Service';
import {useState} from 'react';
import {logs, showRAASTPayments} from '../../Config/Config';
import {wp} from '../../Constant';
import I18n from '../../Config/Language/LocalizeLanguageString';
const screenHeight = Dimensions.get('window').height;
const screenWidth = Dimensions.get('window').width;
const RAASTMenue = (props) => {
  logs.log('props from transfer ', props?.route?.params?.params);
  const fromScreen = props?.route?.params?.params
    ? props?.route?.params?.params
    : 'nothing';
  const [proceedAlert, changeproceedAlert] = useState(false);
  // const [isAlias, changeIsAlias] = useState(true);
  const userObject = useSelector((state) => state.reducers.userObject);
  const isL0Customer =
    userObject.customerLevel &&
    String(userObject.customerLevel).toUpperCase() == 'L0'
      ? false
      : String(userObject.customerLevel).toUpperCase() == 'L1'
      ? false
      : true;
  const isL1Customer =
    userObject.customerLevel &&
    String(userObject.customerLevel).toUpperCase() == 'L1'
      ? true
      : false;
  const token = useSelector((state) => state.reducers.token);
  const dispatch = useDispatch();
  useEffect(() => {
    props.navigation.addListener('focus', () => {
      async function analyticsLog() {
        await analytics().logEvent('RaastMenuSucessnonSucessScreen');
      }
      analyticsLog();

      // setTimeout(() => {
      // dispatch(overview(props.navigation));
      // }, 500);
    });
  }, []);
  const getpkrAccounts = async (isAlias, isQr) => {
    if (isQr) {
      props.navigation.navigate('RAASTQR');
    } else {
      if (isAlias) {
        props.navigation.navigate('AliasManagment');
      } else {
        if (isL0Customer) {
          props.navigation.navigate('by_alias');
        } else if (isL1Customer) {
          changeproceedAlert(true);
        } else {
          changeproceedAlert(true);
        }
      }
    }
    // changeIsAlias(!isAlias);
    logs.log(`asdasd${isAlias}`);
    // logs.log('adasdasd');
    // try {
    //   dispatch(setLoader(true));
    //   const response = await getTokenCall(Service.getPkrAccounts);
    //   const responseData = response.data;
    //   logs.logResponse(responseData);
    //   if (response.data.responseCode === '00') {
    //     dispatch(setLoader(false));
    //     dispatch(updateSessionToken(response));
    //     logs.log(JSON.stringify(response?.data?.data?.accounts));
    //     dispatch(
    //       setUserObject({
    //         pkAccounts: response?.data?.data?.accounts,
    //       }),
    //     );
    //     // console.log(response?.data?.data?.accounts);
    //     if (isQr) {
    //       props.navigation.navigate('RAASTQR');
    //     } else {
    //       if (isAlias) {
    //         props.navigation.navigate('AliasManagment');
    //       } else {
    //         if (isL0Customer) {
    //           props.navigation.navigate('by_alias');
    //         } else if (isL1Customer) {
    //           changeproceedAlert(true);
    //         } else {
    //           changeproceedAlert(true);
    //         }
    //       }
    //     }
    //   } else {
    //     dispatch(serviceResponseCheck(response, props.navigation));
    //     logs.log(error);
    //     dispatch(catchError(error));
    //   }
    // } catch (error) {
    //   dispatch(setLoader(false));

    //   logs.log(`screen crash error : ${JSON.stringify(error)}`);
    //   dispatch(catchError(error));
    // }
  };
  return (
    <View style={styles.container} accessibilityLabel="RAAST Menu Screen">
      {/* <GlobalHeader navigation={props.navigation} /> */}
      <SubHeader
        navigation={props.navigation}
        title={'Raast Payments'}
        description={'Payments & Management'}
        // cardmanagment={true}
        navigateHome={true}
      />
      <View style={{height: wp(5)}}></View>
      {showRAASTPayments ? (
        <TabNavigator
          accessibilityLabel="Press for RAAST Payments"
          raastviaId={true}
          text={' Pay via Raast'}
          navigation={props.navigation}
          navigateTo={'RAASTPayments'}
          boldFont={true}
          border={1}
          onPress={() => {
            // changeIsAlias(false);
            dispatch(
              getraastbanklist(props.navigation, () => {
                // props.navigation.navigate('RAASTBeneficiary');
                getpkrAccounts(false, false);
              }),
            );
            // getpkrAccounts();
          }}
        />
      ) : null}
      {fromScreen == 'fromTransfer' ? null : (
        <TabNavigator
          accessibilityLabel="Press for RAAST ID or Account Management"
          raastManag={true}
          text={' Raast ID Management'}
          navigation={props.navigation}
          navigateTo={'AliasManagment'}
          boldFont={true}
          border={1}
          onPress={() => {
            // changeIsAlias(true);
            getpkrAccounts(true, false);
          }}
        />
      )}

      {/* {showRAASTPayments ? ( */}
      <TabNavigator
        accessibilityLabel="Press for RAAST Payments"
        raastQr={true}
        text={' Raast QR Pay'}
        navigation={props.navigation}
        navigateTo={'RAASTQR'}
        boldFont={true}
        border={1}
        onPress={() => {
          getpkrAccounts(false, true);
        }}
      />
      {/* ) : null} */}

      <CustomAlert
        overlay_state={proceedAlert}
        title={'Upgrade Registration'}
        label={'Upgrade User'}
        alert_text={
          isL1Customer
            ? 'Dear Customer, Your registration has been upgraded but your transaction activation is pending. You will be contacted by NBP call center representative. You may contact NBP call center also for activation at 021-111-627-627.'
            : I18n[
                'You need to Upgrade your registration to unlock all features .Do you want to upgrade?'
              ]
        }
        yesNoButtons={isL1Customer ? false : true}
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

export default RAASTMenue;
