import React, {useEffect, useState, useRef} from 'react';
import {
  View,
  ScrollView,
  Text,
  KeyboardAvoidingView,
  Dimensions,
  TextInput,
} from 'react-native';
import CustomText from '../../../../Components/CustomText/CustomText';
import Ionicons from 'react-native-vector-icons/Ionicons';
import I18n from '../../../../Config/Language/LocalizeLanguageString';
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
import analytics from '@react-native-firebase/analytics';
import CustomBtn from '../../../../Components/Custom_btn/Custom_btn';
import {useSelector, useDispatch} from 'react-redux';
import {Colors} from '../../../../Theme';
// import CustomAlert from '../../../Components/Custom_Alert/CustomAlert';
import {setCurrentFlow, setAppAlert} from '../../../../Redux/Action/Action';
import {logs} from '../../../../Config/Config';
import {RAAST_PURPOSE_OF_PAYMENT_LIST} from '../../../purposeOfPayments';
const screenWidth = Dimensions.get('window').width;

const By_iban = (props) => {
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
        await analytics().logEvent('ByIBANscreen');
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

  const acc_info = useSelector(
    (state) => state.reducers.overViewData?.data?.accounts,
  );
  const product_type = RAAST_PURPOSE_OF_PAYMENT_LIST;
  const requestobj = {};
  const bankSearch = (arr, text) => {
    var foundValue = arr.filter((obj) => obj.name === text);
    // console.log('bank search result', foundValue);
  };

  useEffect(() => {
    logs.log('my komi', IBAN.substr(4, 4).toUpperCase());

    if (IBAN.length >= 8) {
      logs.log('my love', IBAN.substr(4, 4).toUpperCase());
      var foundBank = unsorted_reason.filter(
        (obj) => obj.prefix == IBAN.substr(4, 4).toUpperCase(),
      );
      if (foundBank.length == 1) {
        change_reason(foundBank[0]);
      } else if (foundBank.length == 0) {
        logs.log('done1');
        change_reason({
          participantName: 'Beneficiary Bank',
        });

        global.showToast.show(I18n['IBAN incorrect'], 1000);
        changeIBAN('');
      }
    } else if (IBAN.length < 8) {
      logs.log('done2');
      change_reason({
        participantName: 'Beneficiary Bank',
      });
    }
  }, [IBAN]);
  function validate() {
    // logs.log('sdasd', autoIban);
    // requestobj.amount = tab_amount;
    requestobj.idType = 'CNIC';
    requestobj.idValue = acc_info.cnic;
    requestobj.memberid = tab_reason.bic;
    requestobj.account = tab_from_acc?.account;
    requestobj.name = tab_from_acc?.accountTitle;
    requestobj.source_iban = tab_from_acc?.iban;
    requestobj.benef_bank = tab_reason.participantName;

    requestobj.isbenef = false;
    logs.log(tab_purpose.purpose);
    const screen_status = 'iban';
    // if (!requestobj.memberid) {
    //   dispatch(setAppAlert('Please Select Beneficiary Bank'));
    // }
    // else if (firsttwo <= 2) {
    //   dispatch(setAppAlert('Please Enter IBAN'));
    // } else if (lastDigits <= 16) {
    //   dispatch(setAppAlert('Please Enter IBAN'));
    // }
    if (IBAN.length < 24) {
      dispatch(setAppAlert('Please Enter IBAN'));
    } else {
      // const autoIban = `PK${firsttwo}${tab_reason.bic.substr(
      //   0,
      //   4,
      // )}${lastDigits}`;
      requestobj.receiveriban = IBAN.toUpperCase();
      logs.log('request object by iban: ', requestobj);

      props.navigation.navigate('byIban_step2', {
        reqObj: requestobj,
        screen_status: screen_status,
      });
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
      {/* <ScrollView showsVerticalScrollIndicator={false}> */}
      <View style={{height: wp(4)}}></View>
      <CustomText style={styles.text}>From</CustomText>
      <TabNavigator
        tabHeading={'Account Number'}
        text={tab_from_acc?.account}
        accessibilityLabel={tab_from_acc?.account}
        navigation={props.navigation}
        width={'90%'}
        border={0.5}
        fontSize={wp(4.2)}
        textWidth={'100%'}
        arrowColor={'grey'}
        arrowSize={wp(9)}
        multipleLines={2}
        backgroundColor={'white'}
        color={'black'}
        onPress={() => {
          change_modal_state(true);
          change_modal_type('account');
        }}
      />

      <>
        <CustomText style={styles.text}>To</CustomText>

        <CustomTextField
          text_input={IBAN}
          accessibilityLabel="IBAN"
          // placeholder={''}
          placeholder={'Enter IBAN'}
          onChangeText={(value) => {
            changeIBAN(validateonlyAlphaNumeric(value));
          }}
          width={'90%'}
          onBlur={() => {}}
          onSubmitEditing={() => {}}
          maxLength={24}
        />
      </>
      <View style={{height: wp(4)}}></View>

      <CustomText
        style={{width: '85%', textAlign: 'left', alignSelf: 'center'}}>
        {`Enter a 24 character IBAN as PKXXBBBBXXXXXXXXXXXXXXXX that is linked to Raast.`}
      </CustomText>

      <View style={styles.gap}></View>
      <View style={{position: 'absolute', alignSelf: 'center', bottom: wp(10)}}>
        <CustomBtn
          btn_txt={'Continue'}
          accessibilityLabel={'Continue'}
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
      {/* </ScrollView> */}
    </KeyboardAvoidingView>
  );
};

export default By_iban;
