import React, {useEffect, useState} from 'react';
import {View, Platform, Alert} from 'react-native';
import SubHeader from '../../Components/GlobalHeader/SubHeader/SubHeader';
import TabNavigate from '../../Components/TabNavigate/TabNavigate';
import {useSelector, useDispatch} from 'react-redux';
import {globalStyling} from '../../Constant';
import CustomAlert from '../../Components/Custom_Alert/CustomAlert';
import {
  overview,
  setLoader,
  catchError,
  serviceResponseCheck,
  updateSessionToken,
  setUserObject,
  getraastbanklist,
  agreeToAddVirtualCard,
  setQrScannerState,
  changeGlobalAlertState,
  closeGlobalAlertState,
} from '../../Redux/Action/Action';
import {wp} from '../../Constant';
import {getTokenCall, Service} from '../../Config/Service';
import {logs} from '../../Config/Config';
import {Message} from '../../Constant/Messages';
import I18n from "../../Config/Language/LocalizeLanguageString"

const SelectQR = (props) => {
  const virtualCardStatus = useSelector(
    (state) => state.reducers.virtualCardStatus,
  );
  const [noCardAlertState, setNoCardAlertState] = useState(false);
  const [mpinAlertState, setMpinAlertState] = useState(false);
  const [proceedAlert, changeproceedAlert] = useState(false);
  const virtualCardObject = useSelector(
    (state) => state.reducers.virtualCardObject,
  );
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
  const dispatch = useDispatch();
  useEffect(() => {
    props.navigation.addListener('focus', () => {
      // setTimeout(() => {
      dispatch(overview(props.navigation));
      // }, 500);
    });
  }, []);

  const navigationTOQr = () => {
    props.navigation.navigate('RAASTQR');
  };
  const getpkrAccounts = async (isAlias, isQr) => {
    getraastbanklist(props.navigation, navigationTOQr());
    logs.log(`asdasd${isAlias}`);
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
    //     getraastbanklist(props.navigation, navigationTOQr());
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

  const token = useSelector((state) => state.reducers.token);
  const virtualCardAlert = () => {
    if (!virtualCardObject) {
      dispatch(
        changeGlobalAlertState(true, props.navigation, {
          onPressYes: () => {
            logs.log('-----1');

            dispatch(closeGlobalAlertState());
            setTimeout(() => {
              dispatch(agreeToAddVirtualCard(props.navigation));
            }, 500);
          },
          onPressNo: () => {
            logs.log('-----0');
            dispatch(closeGlobalAlertState());
          },
          title: 'QR Payments',
          alert_text: Message.digitalDebitOption,
        }),
      );
    } else {
    }
  };
  return (
    <View style={[globalStyling.container]} accessibilityLabel="My Accounts">
      {/* <GlobalHeader navigation={props.navigation} /> */}
      <SubHeader
        title={'QR'}
        description={'QR Code to Receive & Send Money'}
        navigation={props.navigation}
      />
      <View style={{height: wp(6)}}></View>
      <TabNavigate
        accessibilityLabel="Raast QR"
        text={' Raast QR'}
        interBankTransfer={true}
        boldFont={true}
        border={true}
        navigation={props.navigation}
        onPress={() => {
          //   props.navigation.navigate('RecieveMoneyRAAST');
          getpkrAccounts();
        }}
      />
      <TabNavigate
        accessibilityLabel="Send Money"
        text={' UnionPay QR'}
        boldFont={true}
        creditCardBills={true}
        border={true}
        // sendMoney={true}
        navigation={props.navigation}
        onPress={() => {
          virtualCardAlert();
        }}
      />
      <CustomAlert
        overlay_state={mpinAlertState}
        onPressCancel={() => setMpinAlertState(false)}
        yesNoButtons={true}
        onPressYes={() => {
          setMpinAlertState(false);
          setTimeout(() => {
            props.navigation.navigate('AddVirtualCardMpin');
          }, 500);
        }}
        onPressNo={() => {
          logs.log('sad');
          setMpinAlertState(false);
        }}
        title={'QR Payments'}
        alert_text={Message.digitalDebitActivated}
        accessibilityLabel={Message.digitalDebitActivated}
      />
      <CustomAlert
        overlay_state={proceedAlert}
        title={'Upgrade Registration'}
        accessibilityLabel={'Upgrade Registration'}
        label={'Upgrade User'}
        alert_text={
          isL1Customer
            ? 'Dear Customer, Your registration has been upgraded but your transaction activation is pending. You will be contacted by NBP call center representative. You may contact NBP call center also for activation at 021-111-627-627.'
            : I18n['You need to Upgrade your registration to unlock all features .Do you want to upgrade?']
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
export default SelectQR;
