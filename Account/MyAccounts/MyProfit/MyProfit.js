import React, {useState, useEffect} from 'react';
import {View, StyleSheet, Text} from 'react-native';
import SubHeader from '../../../../Components/GlobalHeader/SubHeader/SubHeader';
import {useSelector, useDispatch} from 'react-redux';
import CustomText from '../../../../Components/CustomText/CustomText';
import TabNavigator from '../../../../Components/TabNavigate/TabNavigate';
import {logs} from '../../../../Config/Config';
import {Colors} from '../../../../Theme';
import {wp, hp, currencyFormat} from '../../../../Constant';
import CustomModal from '../../../../Components/CustomModal/CustomModal';
import I18n from '../../../../Config/Language/LocalizeLanguageString';
import {defaultAccount} from '../../../../Helpers/Helper';
import {Service, getTokenCall} from '../../../../Config/Service';
import {
  setLoader,
  updateSessionToken,
  catchError,
  serviceResponseCheck,
  helpInforamtion,
} from '../../../../Redux/Action/Action';
import {useTheme} from '../../../../Theme/ThemeManager';
import InformationIcon from '../../../../Components/InformationIcon/InformationIcon';
import {isRtlState} from '../../../../Config/Language/LanguagesArray';
import analytics from '@react-native-firebase/analytics';
export default function MyProfit(props) {
  const {activeTheme} = useTheme();
  const [limitAmount, setLimitAmount] = useState('');
  const [transferType, changeTransferType] = useState('');
  const [showModalState, changeModalState] = useState(false);
  const [showTransferModalState, changeTransferModalState] = useState(false);
  const [currentModal, changeCurrentModal] = useState('');
  const [profitAmount, setProfitAmount] = useState('No Profit Found');
  const [multiAcc, setMultiAcc] = useState('');

  const dispatch = useDispatch();
  useEffect(() => {
    async function analyticsLog() {
      await analytics().logEvent('MyProfitScreen');
    }
    analyticsLog();
  }, []);

  useEffect(() => {
    if (mappedAccounts.length > 1) {
      getAccountProfit(mappedAccounts[0]?.account);
      // logs.log('dnnj', mappedAccounts[0]?.account);
    } else if (transferFundsFrom) {
      logs.log('transferFundsFrom chala hai bhai ------>', transferFundsFrom);
      getAccountProfit(transferFundsFrom?.account);
    }
  }, [transferFundsFrom]);

  const getAccountProfit = async (account) => {
    try {
      dispatch(setLoader(true));
      const response = await getTokenCall(
        Service.getAccountProfit,
        `accountNumber=${account}`,
      );
      if (response?.data?.responseCode === '00') {
        dispatch(setLoader(false));
        dispatch(updateSessionToken(response));
        logs.log(
          'getAccountProfitAPI',
          response?.data?.data?.response['get-account-profit']?.accruedProfit,
        );
        logs.log('getAccountProfitAPImaaz', response?.data?.data);

        const amount =
          response?.data?.data?.response['get-account-profit']?.accruedProfit;

        setProfitAmount(
          response?.data?.data?.response['get-account-profit']?.accruedProfit,
        );
      } else {
        dispatch(serviceResponseCheck(response, props.navigation));
      }
    } catch (error) {
      logs.log('errors', error);
      dispatch(catchError(error));
    }
  };

  const viewAccountsData = useSelector(
    (state) => state.reducers.viewAccountsData,
  );
  const mappedAccounts =
    viewAccountsData.length === 0
      ? []
      : viewAccountsData.map(function (object) {
          return {
            ...object,
            text: `${object.accountType} - ${object.account}`,
          };
        });
  const arrayFilter = defaultAccount(mappedAccounts);

  const [transferFundsFrom, changeTransferFundsFrom] = useState(
    arrayFilter.length === 0 ? {} : arrayFilter[0],
  );

  const Data = [
    {
      text: 'Fund Transfer',
      limit: '200,000.00',
    },
    {
      text: 'Raast Transfer',
      limit: '100,000.00',
    },
    {
      text: 'Bill Payment',
      limit: '300,000.00',
    },
  ];

  checkValidation = () => {
    if (transferType === '') {
      global.showToast.show(I18n['TransferType'], 1000);
    } else if (limitAmount === '') {
      global.showToast.show(I18n['TransferAmount'], 1000);
    } else {
      props.navigation.navigate('LimitManagementMpin');
    }
  };

  const onHandleMultiAcc = () => {
    changeCurrentModal('transferFrom');
    changeTransferModalState(true);
  };

  logs.log(transferFundsFrom, 'maazcheck');

  const fromContainer = () => {
    return (
      <TabNavigator
        tabHeading={transferFundsFrom.accountType}
        border={true}
        accessibilityLabel={
          Object.keys(transferFundsFrom).length === 0
            ? 'Tap here to select an option'
            : transferFundsFrom.text
        }
        text={
          Object.keys(transferFundsFrom).length === 0
            ? 'Tap here to select an option'
            : transferFundsFrom?.iban
            ? transferFundsFrom?.iban
            : transferFundsFrom?.account
        }
        textWidth={'100%'}
        navigation={props.navigation}
        width={'90%'}
        hideOverlay={
          Object.keys(transferFundsFrom).length === 0
            ? 'transparent'
            : Colors.primary_green
        }
        multipleLines={2}
        fontSize={wp(4)}
        arrowColor={viewAccountsData.length == 1 ? 'white' : 'black'}
        arrowSize={wp(9)}
        onPress={() => {
          viewAccountsData.length == 1
            ? logs.log('asdasd')
            : onHandleMultiAcc();
        }}
      />
    );
  };

  const detailView = () => {
    return (
      <View style={{justifyContent: 'center', alignItems: 'center'}}>
        <View
          style={[
            styles.detailBox,
            {backgroundColor: activeTheme.subContainer},
          ]}>
          <CustomText
            style={[
              styles.detailBoxext,
              {
                marginLeft: wp(5),
              },
            ]}>
            Account Type
          </CustomText>
          <CustomText
            style={styles.infoText}
            // boldFont={true}
          >
            Savings Account
          </CustomText>
          <CustomText
            style={[
              styles.detailBoxext,
              {
                marginLeft: wp(5),
                marginTop: hp(5),
              },
            ]}>
            Profit Amount
          </CustomText>
          <CustomText
            style={[
              styles.infoText,
              {color: Colors.primary_green, marginBottom: wp(5)},
            ]}
            boldFont={true}>
            {/* 1010.00 */}
            {profitAmount !== 'No Profit Found'
              ? currencyFormat(Number(profitAmount)).replace('.00', '')
              : 'No Profit Found'}
          </CustomText>
        </View>
      </View>
    );
  };

  return (
    <View style={[styles.container, {backgroundColor: Colors.backgroundColor}]}>
      <SubHeader
        title={'MyProfits'}
        description={'Monitor your accrued profits'}
        navigation={props.navigation}
      />
      <View style={{height: wp(3)}} />

      {fromContainer()}

      {detailView()}

      <View style={{height: wp(3)}} />

      <View
        style={{
          width: '95%',
          // height: hp(7),
          // backgroundColor: Colors.themeGrey,
          alignSelf: 'center',
          justifyContent: 'center',
          paddingHorizontal: wp(2),
        }}>
        <>
          <CustomText style={styles.description}>
            The displayed profit represents an estimate and is subject to change
            based on the final profit distribution rate. Applicable taxes will
            be deducted as per prevailing laws.
          </CustomText>
        </>
      </View>

      <CustomModal
        visible={showTransferModalState}
        headtext={'Please Select Options Below'}
        data={mappedAccounts}
        mobileTopUpBeneficiary={currentModal === 'transferFrom' ? true : false}
        onPress_item={(param) => {
          logs.log('param modal 1', param);
          changeTransferModalState(!showTransferModalState);
          changeTransferFundsFrom(param);
          getAccountProfit(param?.account);
        }}
        onCancel={() => changeTransferModalState(!showTransferModalState)}
      />
      <CustomModal
        visible={showModalState}
        headtext={'Please Select Options Below'}
        data={Data}
        onPress_item={(param) => {
          changeTransferType(param);
          changeModalState(!showModalState);
        }}
        onCancel={() => changeModalState(!showModalState)}
      />
      {/* <InformationIcon
        onPress={() => {
          dispatch(
            helpInforamtion({
              title: 'My Profit',
              page: 'myProfit',
              state: true,
            }),
          );
        }}
      /> */}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#eaeaea',
  },
  infoText: {
    fontSize: wp(4.2),
    width: '90%',
    alignSelf: 'flex-start',
    left: wp(5),
    marginTop: wp(2),
  },
  detailBoxext: {
    fontSize: wp(3.8),
    marginTop: wp(4),
    color: Colors.labelGrey,
  },
  detailBox: {
    width: '90%',
    marginTop: hp(5),
    borderWidth: 1,
    borderColor: Colors.textFieldBorderColor,
    borderRadius: wp(1),
  },
  description: {
    fontSize: hp(2),
    width: '100%',
    // alignSelf: 'center',
    // color: Colors.mainTextColors,
  },
});
