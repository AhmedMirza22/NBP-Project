import React, {useEffect, useState} from 'react';
import {
  View,
  ScrollView,
  Text,
  KeyboardAvoidingView,
  Dimensions,
  Platform,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import CustomText from '../../../Components/CustomText/CustomText';
import styles from './RAASTBeneStyle';
import GlobalHeader from '../../../Components/GlobalHeader/GlobalHeader';
import SubHeader from '../../../Components/GlobalHeader/SubHeader/SubHeader';
import TabNavigator from '../../../Components/TabNavigate/TabNavigate';
import CustomModal from '../../../Components/CustomModal/CustomModal';
import CustomTextField from '../../../Components/CustomTextField/CustomTextField';
import {wp, globalStyling, hp} from '../../../Constant';
import CustomBtn from '../../../Components/Custom_btn/Custom_btn';
import {useSelector, useDispatch} from 'react-redux';
import {Colors} from '../../../Theme';
// import CustomAlert from '../../../Components/Custom_Alert/CustomAlert';
import RecentTransaction from '../../../Components/RecentTransaction/RecentTransaction';
import analytics from '@react-native-firebase/analytics';

import {
  setCurrentFlow,
  setAppAlert,
  raast_payment_title_fetch,
  overview,
  setUserObject,
} from '../../../Redux/Action/Action';
import {logs} from '../../../Config/Config';
import {RAAST_PURPOSE_OF_PAYMENT_LIST} from '../../purposeOfPayments';
import {TouchableWithoutFeedback} from 'react-native';
import {Keyboard} from 'react-native';
const screenWidth = Dimensions.get('window').width;

const RAASTBenefByIBAN = (props) => {
  //tab_text
  const dispatch = useDispatch();
  //tab_text
  logs.log('payment ', props?.route?.params?.requiredData?.companyName);
  useEffect(() => {
    change_purpose(product_type[12]);
    props.navigation.addListener('focus', () => {
      dispatch(overview(props.navigation));
      async function analyticsLog() {
        await analytics().logEvent('RAASTBenegByIBANScreen');
      }
      analyticsLog();
      dispatch(setCurrentFlow('Payment by IBAN'));
      // logs.log('iabn by', props?.route?.params);
      // change_benef(
      props?.route?.params?.isbenef
        ? props?.route?.params?.requiredData?.benefAccount
        : '',
        // );
        // change_reason(
        //   props?.route?.params?.isbenef
        //     ? props?.route?.params?.requiredData?.companyName
        //     : 'Select Beneficiary Bank',
        // );
        change_from_acc({
          account: accounts[0]?.account,
          iban: accounts[0]?.iban,
          accountType: accounts[0]?.accountType,
          currency: accounts[0]?.currency,
          accountTitle: accounts[0]?.accountTitle,
        });
    });
  }, []);

  const [tab_purpose, change_purpose] = useState({
    purpose: 'Select Purpose of Payment',
  });
  const [tab_benef, change_benef] = useState('');
  const [tab_amount, change_amount] = useState('');
  const [tab_reason, change_reason] = useState({
    participantName: 'Select Beneficiary Bank',
  });
  const [modal, change_modal_state] = useState(false);
  const [modal_type, change_modal_type] = useState('');
  const city = useSelector((state) => state.reducers.viewcitycode);
  const userObject = useSelector((state) => state.reducers.userObject);
  const accounts = userObject?.pkAccounts;
  const [tab_from_acc, change_from_acc] = useState({});
  const unsorted_reason = useSelector((state) => state.reducers.raastbank);
  const reason = unsorted_reason.sort((a, b) =>
    a.participantName.localeCompare(b.participantName),
  );
  let filtered_acc = accounts;

  const acc_info = useSelector(
    (state) => state.reducers.overViewData?.data?.accounts,
  );
  const myAcc = useSelector((state) => state.reducers.overViewData);
  const product_type = RAAST_PURPOSE_OF_PAYMENT_LIST;
  const requestobj = {};
  function validate() {
    requestobj.amount = tab_amount;
    requestobj.idType = 'CNIC';
    requestobj.idValue = acc_info.cnic;
    requestobj.memberid = props?.route?.params?.isbenef
      ? props?.route?.params?.requiredData?.imd
      : tab_reason.bic;
    requestobj.receiveriban = props?.route?.params?.requiredData?.benefAccount;
    //for next screen
    requestobj.account = tab_from_acc?.account;
    requestobj.name = tab_from_acc?.accountTitle;
    requestobj.source_iban = tab_from_acc?.iban;
    requestobj.benef_bank = props?.route?.params?.requiredData?.companyName;
    requestobj.pay_pur = tab_purpose.purpose;
    requestobj.pay_pur_id = tab_purpose.pur_code;
    requestobj.isbenef = false;
    requestobj.benefAlias = props?.route?.params?.requiredData?.benefAlias;
    logs.log('pokaasdasd', acc_info);
    const screen_status = 'iban';
    const isbenefs = props?.route?.params?.isbenef ? true : false;
    if (tab_amount == '') {
      dispatch(setAppAlert('Please Enter Amount'));
    } else if (tab_purpose.purpose == 'Select Purpose of Payment') {
      dispatch(setAppAlert('Please Select Purpose of Payemnt'));
    } else {
      logs.log('r----', requestobj);
      dispatch(
        raast_payment_title_fetch('ibanbybenef', props.navigation, requestobj),
      );
    }
  }
  const setOfAction = () => {
    change_modal_state(true);
    change_modal_type('account');
  };
  return (
    <View
      style={[
        globalStyling.container,
        {backgroundColor: Colors.backgroundColor},
      ]}>
      <SubHeader
        navigation={props.navigation}
        title={'Raast Payments'}
        description={'Pay by IBAN'}
        // cardmanagment={true}
      />
      <ScrollView contentContainerStyle={globalStyling.scrollContent}>
        <View style={{flex: 1}}>
          <CustomText style={styles.text}>From</CustomText>
          <TabNavigator
            border={true}
            tabHeading={'From Account'}
            text={tab_from_acc?.account}
            navigation={props.navigation}
            width={'90%'}
            fontSize={wp(4.2)}
            textWidth={'100%'}
            arrowSize={wp(9)}
            multipleLines={2}
            onPress={() => {
              accounts.length == 1 ? logs.log('') : setOfAction();
            }}
          />
          <TabNavigator
            border={true}
            text={tab_purpose.purpose}
            tabHeading={'Purpose of Payment'}
            navigation={props.navigation}
            width={'90%'}
            fontSize={wp(4.2)}
            textWidth={'100%'}
            arrowSize={wp(9)}
            multipleLines={2}
            onPress={() => {
              change_modal_state(true);
              change_modal_type('purpose');
            }}
          />
          <CustomText style={styles.text}>To</CustomText>

          <TabNavigator
            border={true}
            text={props?.route?.params?.requiredData?.benefAccount}
            tabHeading={'IBAN'}
            navigation={props.navigation}
            width={'90%'}
            fontSize={wp(4.2)}
            textWidth={'100%'}
            arrowSize={wp(9)}
            multipleLines={2}
            onPress={() => {}}
          />

          <View style={{height: wp(1.5)}} />
          <CustomTextField
            text_input={tab_amount}
            keyboardType={'numeric'}
            placeholder={tab_amount ? null : 'Enter Amount'}
            textHeading={tab_amount ? 'Enter Amount' : null}
            // Textfield_label={'Enter Debit/ATM Card Number'}
            currencyInput={true}
            onChangeText={(value) => {
              change_amount(String(value).replace(/[^0-9]/g, ''));
            }}
            onSubmitEditing={() => {}}
            returnKeyType={'next'}
            maxLength={7}
            width={'90%'}
          />
          <View style={{height: wp(2)}} />
          {props?.route?.params?.requiredData ? (
            <RecentTransaction
              navigation={props.navigation}
              AccountType={'RAAST_PAYMENT'}
              FromAccount={tab_from_acc?.iban}
              ToAccount={props?.route?.params?.requiredData?.benefAccount}
              ToAccountname={props?.route?.params?.requiredData?.benefAlias}
            />
          ) : null}
        </View>
        <CustomModal
          visible={modal}
          headtext={
            modal_type == 'city'
              ? 'Select City'
              : modal_type == 'account'
              ? 'Select From Account'
              : modal_type == 'purpose'
              ? 'Select Product Type'
              : modal_type == 'reason'
              ? 'Select reason Type'
              : ''
          }
          data={
            modal_type == 'city'
              ? city
              : modal_type == 'account'
              ? filtered_acc
              : modal_type == 'purpose'
              ? product_type
              : modal_type == 'reason'
              ? reason
              : null
          }
          onPress_item={(param) => {
            logs.log(`option selected : ${param}`);
            modal_type == 'account'
              ? change_from_acc(param)
              : modal_type == 'purpose'
              ? change_purpose(param)
              : modal_type == 'reason'
              ? change_reason(param)
              : null;
            change_modal_state(false);
          }}
          // citycode={modal_type==='city'?true:false}
          accounts={modal_type === 'account' ? true : false}
          raastbank={modal_type === 'reason' ? true : false}
          purpose={modal_type == 'purpose' ? true : false}
          onCancel={() => change_modal_state(false)}
        />
      </ScrollView>

      <KeyboardAvoidingView
        keyboardVerticalOffset={hp(7)}
        behavior={'padding'}
        style={globalStyling.buttonContainer}>
        <View style={styles.gap}></View>

        <CustomBtn
          btn_txt={'Continue'}
          onPress={() => {
            logs.log('98273981273123-->', props?.route);
            validate(requestobj);
          }}
          btn_width={wp(90)}
          backgroundColor={Colors.primary_green}
        />

        {/* </ScrollView> */}
      </KeyboardAvoidingView>
    </View>
  );
};

export default RAASTBenefByIBAN;
