import React, {useEffect, useState, useRef} from 'react';
import {
  View,
  ScrollView,
  Text,
  KeyboardAvoidingView,
  Dimensions,
  TextInput,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';

import styles from './by_ibanstyle';
import GlobalHeader from '../../../../Components/GlobalHeader/GlobalHeader';
import SubHeader from '../../../../Components/GlobalHeader/SubHeader/SubHeader';
import TabNavigator from '../../../../Components/TabNavigate/TabNavigate';
import CustomModal from '../../../../Components/CustomModal/CustomModal';
import CustomTextField from '../../../../Components/CustomTextField/CustomTextField';
import {
  wp,
  globalStyling,
  validateOnlyNumberInput,
  validateonlyAlphaNumeric,
} from '../../../../Constant';
import CustomBtn from '../../../../Components/Custom_btn/Custom_btn';
import {useSelector, useDispatch} from 'react-redux';
import {Colors} from '../../../../Theme';
import analytics from '@react-native-firebase/analytics';
// import CustomAlert from '../../../Components/Custom_Alert/CustomAlert';
import {
  setCurrentFlow,
  setAppAlert,
  raast_payment_title_fetch,
} from '../../../../Redux/Action/Action';
import {logs} from '../../../../Config/Config';
import {RAAST_PURPOSE_OF_PAYMENT_LIST} from '../../../purposeOfPayments';
import CustomText from '../../../../Components/CustomText/CustomText';
const screenWidth = Dimensions.get('window').width;

const ByIban_step2 = (props) => {
  logs.log('props recieved in step 2', props?.route?.params?.reqObj);
  const ibanText3 = useRef();
  const ibanText4 = useRef();
  //tab_text
  const dispatch = useDispatch();
  //tab_text
  logs.log('payment ', props?.route?.params?.requiredData?.imd);
  useEffect(() => {
    props.navigation.addListener('focus', () => {
      dispatch(setCurrentFlow('Payment by IBAN'));
      async function analyticsLog() {
        await analytics().logEvent('ByIBANStep2screen');
      }
      analyticsLog();

      // logs.log('iabn by', props?.route?.params);
      // // change_benef(
      // props?.route?.params?.isbenef
      //   ? props?.route?.params?.requiredData?.benefAccount
      //   : '',
      // );
      // change_reason(
      //   props?.route?.params?.isbenef
      //     ? props?.route?.params?.requiredData?.companyName
      //     : 'Beneficiary Bank',
      // );
      change_purpose(product_type[1]);
      change_from_acc({
        account: accounts[0]?.account,
        iban: accounts[0]?.iban,
        accountType: accounts[0]?.accountType,
        currency: accounts[0]?.currency,
        accountTitle: accounts[0]?.accountTitle,
      });
      bankSearch(reason, enteredBic);
    });
  }, []);

  const [tab_purpose, change_purpose] = useState({
    purpose: 'Select Purpose of Payment',
  });
  const [IBAN, changeIBAN] = useState('');
  const [tab_amount, change_amount] = useState('');
  const [tab_reason, change_reason] = useState({
    participantName: 'Beneficiary Bank',
  });
  const [firsttwo, changeFirstTwo] = useState('');
  const [lastDigits, changeLastDigits] = useState('');
  const [modal, change_modal_state] = useState(false);
  const [modal_type, change_modal_type] = useState('');
  const [enteredBic, setEnteredBic] = useState('');
  const [isFocused1, setIsFocused1] = useState(false);
  const [isFocused2, setIsFocused2] = useState(false);
  const [isFocused3, setIsFocused3] = useState(false);
  const city = useSelector((state) => state.reducers.viewcitycode);
  const userObject = useSelector((state) => state.reducers.userObject);
  const accounts = userObject?.pkAccounts;
  const [tab_from_acc, change_from_acc] = useState({
    // account: accounts[0]?.account,
    // iban: accounts[0]?.iban,
    // accountType: accounts[0]?.accountType,
    // currency: accounts[0]?.currency,
    // accountTitle: accounts[0]?.accountTitle,
  });
  // const reason = useSelector((state) => state.reducers.raastbank);
  const unsorted_reason = useSelector((state) => state.reducers.raastbank);
  const reason = unsorted_reason.sort((a, b) =>
    a.participantName.localeCompare(b.participantName),
  );
  let filtered_acc = accounts;

  const product_type = RAAST_PURPOSE_OF_PAYMENT_LIST;
  const requestobj = {};
  const bankSearch = (arr, text) => {
    var foundValue = arr.filter((obj) => obj.name === text);
    // console.log('bank search result', foundValue);
  };

  //   useEffect(() => {
  //     logs.log('my komi', IBAN.substr(4, 4).toUpperCase());

  //     if (IBAN.length >= 8) {
  //       logs.log('my love', IBAN.substr(4, 4).toUpperCase());
  //       var foundBank = unsorted_reason.filter(
  //         (obj) => obj.prefix == IBAN.substr(4, 4).toUpperCase(),
  //       );
  //       if (foundBank.length == 1) {
  //         change_reason(foundBank[0]);
  //       } else if (foundBank.length == 0) {
  //         logs.log('done1');
  //         change_reason({
  //           participantName: 'Beneficiary Bank',
  //         });

  //         global.showToast.show('IBAN incorrect', 1000);
  //         changeIBAN('');
  //       }
  //     } else if (IBAN.length < 8) {
  //       logs.log('done2');
  //       change_reason({
  //         participantName: 'Beneficiary Bank',
  //       });
  //     }
  //   }, [IBAN]);
  function validate() {
    // logs.log('sdasd', autoIban);
    requestobj.amount = tab_amount;
    requestobj.idType = props?.route?.params?.reqObj?.idType;
    requestobj.idValue = props?.route?.params?.reqObj?.idValue;
    requestobj.memberid = props?.route?.params?.reqObj?.memberid;
    //for next screen
    requestobj.account = props?.route?.params?.reqObj?.account;
    requestobj.name = props?.route?.params?.reqObj?.name;
    requestobj.source_iban = props?.route?.params?.reqObj?.source_iban;
    requestobj.benef_bank = props?.route?.params?.reqObj?.benef_bank;
    requestobj.pay_pur = tab_purpose.purpose;
    requestobj.pay_pur_id = tab_purpose.pur_code;
    requestobj.isbenef = props?.route?.params?.reqObj?.isbenef;
    logs.log(tab_purpose.purpose);
    const screen_status = 'iban';
    if (tab_amount == '') {
      dispatch(setAppAlert('Please Enter Amount'));
    } else if (tab_purpose.purpose == 'Select Purpose of Payment') {
      dispatch(setAppAlert('Please Select Purpose of Payment'));
    }
    // else if (firsttwo <= 2) {
    //   dispatch(setAppAlert('Please Enter IBAN'));
    // } else if (lastDigits <= 16) {
    //   dispatch(setAppAlert('Please Enter IBAN'));
    // }
    else {
      // const autoIban = `PK${firsttwo}${tab_reason.bic.substr(
      //   0,
      //   4,
      // )}${lastDigits}`;
      requestobj.receiveriban = props?.route?.params?.reqObj?.receiveriban;
      dispatch(
        raast_payment_title_fetch(screen_status, props.navigation, requestobj),
      );
    }
  }
  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : null}
      keyboardVerticalOffset={40}
      style={globalStyling.whiteContainer}
      accessibilityLabel="RAAST Payment by IBAN">
      <SubHeader
        navigation={props.navigation}
        title={'RAAST Payments'}
        description={'Pay by IBAN'}
      />
      <View style={{height: wp(6)}} />

      <TabNavigator
        tabHeading={'Purpose Of Payment'}
        text={tab_purpose.purpose}
        accessibilityLabel={tab_purpose.purpose}
        navigation={props.navigation}
        width={'90%'}
        fontSize={wp(4.2)}
        textWidth={'100%'}
        arrowColor={'grey'}
        border={0.5}
        arrowSize={wp(9)}
        multipleLines={2}
        backgroundColor={'white'}
        color={'black'}
        onPress={() => {
          change_modal_state(true);
          change_modal_type('purpose');
        }}
      />
      <View style={{height: wp(6)}} />

      <CustomText style={styles.text} boldFont={true}>
        Amount
      </CustomText>

      <CustomTextField
        text_input={tab_amount}
        accessibilityLabel="Enter Amount here"
        keyboardType={'numeric'}
        placeholder={'Enter Amount'}
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

      <View style={styles.gap}></View>
      <View style={{position: 'absolute', alignSelf: 'center', bottom: wp(10)}}>
        <CustomBtn
          btn_txt={'Pay'}
          accessibilityLabel={'Next'}
          onPress={() => {
            validate(requestobj);
          }}
          btn_width={wp(90)}
          backgroundColor={Colors.primary_green}
        />
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
    </KeyboardAvoidingView>
  );
};

export default ByIban_step2;
