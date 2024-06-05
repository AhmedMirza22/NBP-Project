import React, {useEffect} from 'react';
import {View} from 'react-native';
import GlobalHeader from '../../Components/GlobalHeader/GlobalHeader';
import SubHeader from '../../Components/GlobalHeader/SubHeader/SubHeader';
import {useSelector, useDispatch} from 'react-redux';
import TabNavigator from '../../Components/TabNavigate/TabNavigate';
import {
  getFundsTransferData,
  getInterBankFundTransferData,
  getCnicTransferData,
  setCurrentFlow,
  setLoader,
  updateSessionToken,
  setUserObject,
  serviceResponseCheck,
  catchError,
  getraastbanklist,
  helpInforamtion,
} from '../../Redux/Action/Action';

import styles from './TransfersStyling';
import {showRAASTPayments} from '../../Config/Config';
import {getTokenCall, Service} from '../../Config/Service';
import {logs} from '../../Config/Config';
import {hp} from '../../Constant';
import {Message} from '../../Constant/Messages';
import {Colors} from '../../Theme';
import InformationIcon from '../../Components/InformationIcon/InformationIcon';
import analytics from '@react-native-firebase/analytics';

export default function Transfers(props) {
  const token = useSelector((state) => state.reducers.token);
  const dispatch = useDispatch();
  useEffect(() => {
    props.navigation.addListener(
      'focus',
      () => {
        dispatch(setCurrentFlow('Transfers'));
        async function analyticsLog() {
          await analytics().logEvent('TransferScreen');
        }
        analyticsLog();
      },
      [],
    );
  }, []);

  const getpkrAccountsforRAAST = async (isAlias) => {
    // changeIsAlias(!isAlias);
    logs.log(`asdasd${isAlias}`);
    if (isAlias) {
      props.navigation.navigate('AliasManagment');
    } else {
      // props.navigation.navigate('by_alias');
      props.navigation.navigate('NewTransfer');

      // NewFundTransfer
    }
    // logs.log('adasdasd');
    // try {
    //   dispatch(setLoader(true));

    //   const response = await getTokenCall(Service.getPkrAccounts);
    //   const responseData = response.data;
    //   logs.logResponse(responseData);
    //   if (response.data.responseCode === '00') {
    //     dispatch(setLoader(false));
    //     dispatch(updateSessionToken(response));
    //     dispatch(
    //       setUserObject({
    //         pkAccounts: response?.data?.data?.accounts,
    //       }),
    //     );
    //     if (isAlias) {
    //       props.navigation.navigate('AliasManagment');
    //     } else {
    //       props.navigation.navigate('by_alias');
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
    <View
      style={[styles.container, {backgroundColor: Colors.backgroundColor}]}
      accessibilityLabel="Select Type of Transfer">
      {/* <GlobalHeader navigation={props.navigation} /> */}
      <SubHeader
        // transfers={true}
        navigation={props.navigation}
        title="Transfers"
        description="Transfer Funds to other account"
        navigateHome={true}
      />
      <View style={{height: hp(2.5)}} />
      {showRAASTPayments ? (
        <TabNavigator
          accessibilityLabel="Press for Funds Transfer"
          border={true}
          boldFont={true}
          text=" Fund Transfers"
          fundsTransfer={true}
          navigateTo={'CnicTransfer'}
          navigation={props.navigation}
          // multipleLines={1}
          onPress={
            () => {
              dispatch(
                getraastbanklist(props.navigation, () => {
                  // props.navigation.navigate('RAASTBeneficiary');
                  getpkrAccountsforRAAST(false);
                }),
              );
            }
            // props.navigation.navigate('RAASTMenue', {params: 'fromTransfer'})
          }
        />
      ) : null}

      {/* <TabNavigator
        accessibilityLabel="Press for Funds Transfer"
        text=" Fund Transfers"
        border={true}
        boldFont={true}
        onPress={() =>
          // dispatch(getFundsTransferData(token, props.navigation, false, ''))
          // props.navigation.navigate('FundsTransfer')
          //SelectBanks
          props.navigation.navigate('SelectBanks')
        }
        navigation={props.navigation}
        fundsTransfer={true}
      /> */}
      {/* <TabNavigator
        accessibilityLabel="Press for Inter Bank Funds Transfer"
        text=" Inter Bank Fund Transfer"
        ibft2={true}
        border={true}
        onPress={() => {
          // dispatch(
          //   getInterBankFundTransferData(
          //     token,
          //     props.navigation,
          //     false,
          //     false,
          //     '',
          //   ),
          // )
          props.navigation.navigate('InterBankFundsTransfer');
        }}
        boldFont={true}
        navigation={props.navigation}
        navigateTo={'InterBankFundsTransfer'}
      /> */}
      <TabNavigator
        accessibilityLabel="Press for CNIC Transfer"
        text=" CNIC Transfer"
        border={true}
        cnicTransfer={true}
        navigateTo={'CnicTransfer'}
        navigation={props.navigation}
        onPress={() => {
          props.navigation.navigate('CnicTransfer');
        }}
        boldFont={true}
      />
      <TabNavigator
        accessibilityLabel="Press for Raast QR Payments"
        text=" QR (Raast)"
        border={true}
        raast2={true}
        navigation={props.navigation}
        onPress={() => {
          dispatch(
            getraastbanklist(props.navigation, () => {
              // props.navigation.navigate('RAASTBeneficiary');
              props.navigation.navigate('RaastQrSelections');
            }),
          );
        }}
        boldFont={true}
      />

      <InformationIcon
        onPress={() => {
          logs.log('testing');
          dispatch(
            helpInforamtion({
              title: 'Transfers',
              page: 'RAAST',
              state: true,
            }),
          );
        }}
      />
      <TabNavigator
        accessibilityLabel="Merchant Payments"
        text=" Merchant Alias Payments"
        border={true}
        boldFont={true}
        raast2={true}
        onPress={() =>
          // dispatch(getFundsTransferData(token, props.navigation, false, ''))
          // props.navigation.navigate('FundsTransfer')
          //SelectBanks
          props.navigation.navigate('MerchantPayment')
        }
        navigation={props.navigation}
      />
    </View>
  );
}
