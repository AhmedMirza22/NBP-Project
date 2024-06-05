import React, {useEffect, useState, useRef, useLayoutEffect} from 'react';
import {
  View,
  ScrollView,
  Text,
  KeyboardAvoidingView,
  Dimensions,
  TouchableOpacity,
  PermissionsAndroid,
} from 'react-native';
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
import Ionicons from 'react-native-vector-icons/AntDesign';
import Contacts from 'react-native-contacts';
import {overview, setUserObject} from '../../../Redux/Action/Action';
import RecentTransaction from '../../../Components/RecentTransaction/RecentTransaction';
import analytics from '@react-native-firebase/analytics';

// import CustomAlert from '../../../Components/Custom_Alert/CustomAlert';
import {
  setCurrentFlow,
  setAppAlert,
  getdefaultaccounsbyalias,
} from '../../../Redux/Action/Action';
import {logs} from '../../../Config/Config';
import {Platform} from 'react-native';
import {RAAST_PURPOSE_OF_PAYMENT_LIST} from '../../purposeOfPayments';
import CustomText from '../../../Components/CustomText/CustomText';
import {TouchableWithoutFeedback} from 'react-native';
import {Keyboard} from 'react-native';
import {isRtlState} from '../../../Config/Language/LanguagesArray';

const screenWidth = Dimensions.get('window').width;

const RAAASTBenefByAlias = (props) => {
  logs.log('asdmanbsdjasd', props?.route?.params);
  let updatedPhoneNumber = props?.route?.params?.phoneNumber;

  useEffect(() => {
    change_purpose(product_type[12]);

    props.navigation.addListener('focus', () => {
      dispatch(setCurrentFlow('Payment By Raast ID'));
      async function analyticsLog() {
        await analytics().logEvent('RAASTBenefByAliasScreen');
      }
      analyticsLog();
    });
  }, []);
  useEffect(() => {
    setFromPay(
      props?.route?.params?.isByAlias ? props?.route?.params?.isByAlias : false,
    );
    dispatch(overview(props.navigation));
    chnageAliasFromPay(props?.route?.params?.requiredData?.benefAccount);
    props.navigation.addListener('focus', () => {
      logs.log(
        `tab car n------ame is ${JSON.stringify(
          props?.route?.params?.requiredData?.benefID,
        )}`,
      );
      logs.log(`userobject.aliadname is ${userObject.aliasPhoneNumber}`);
      change_card_name(userObject?.aliasPhoneNumber);
      change_from_acc({
        account: accounts[0]?.account,
        iban: accounts[0]?.iban,
        accountType: accounts[0]?.accountType,
        currency: accounts[0]?.currency,
        accountTitle: accounts[0]?.accountTitle,
      });
    });
  }, [updatedPhoneNumber]);
  const [tab_name_card, change_card_name] = useState('');
  const dispatch = useDispatch();
  const [tab_purpose, change_purpose] = useState({
    purpose: 'Select Purpose of Payment',
  });
  const [aliasFromPay, chnageAliasFromPay] = useState('');
  const [tab_amount, change_amount] = useState('');
  const [tab_reason, change_reason] = useState({reason: 'MOBILE'});
  const [modal, change_modal_state] = useState(false);
  const [modal_type, change_modal_type] = useState('');
  const city = useSelector((state) => state?.reducers?.viewcitycode);
  const userObject = useSelector((state) => state?.reducers?.userObject);
  const accounts = userObject?.pkAccounts;
  const [fromPay, setFromPay] = useState(false);

  const [tab_from_acc, change_from_acc] = useState({});
  const product_type = RAAST_PURPOSE_OF_PAYMENT_LIST;
  const reason = [{reason: 'MOBILE'}];
  const requestobj = {};

  //Contact From list

  function validate() {
    //ASDASD
    // requestobj.memberid = "";
    // requestobj.receiveriban = tab_benef;
    //for next screen
    requestobj.amount = tab_amount;
    requestobj.idType = tab_reason.reason;
    requestobj.idValue = fromPay ? aliasFromPay : tab_name_card;
    requestobj.account = tab_from_acc?.account;
    requestobj.name = tab_from_acc?.accountTitle;
    requestobj.source_iban = tab_from_acc?.iban;
    requestobj.benef_bank = tab_reason?.participantName;
    requestobj.pay_pur = tab_purpose?.purpose;
    requestobj.pay_pur_id = tab_purpose?.pur_code;
    requestobj.isbenef = true;
    // requestobj.isbenef = true;
    requestobj.benefAlias = props?.route?.params?.requiredData?.benefAlias;
    requestobj.benefID = props?.route?.params?.requiredData?.benefID;
    if (tab_purpose.purpose == 'Select Purpose of Payment') {
      dispatch(setAppAlert('Please Select Purpose of Payment'));
    } else if (requestobj.amount == '') {
      dispatch(setAppAlert('Please Enter amount'));
    } else if (requestobj.idValue == '') {
      dispatch(setAppAlert('Please Enter the alias'));
    } else {
      logs.log('insdie this beofre hitting function');
      logs.log(JSON.stringify(requestobj));
      dispatch(
        getdefaultaccounsbyalias(
          'aliasbybenef',
          props.navigation,
          requestobj,
          (screenStatus, params, response) => {
            props.navigation.navigate('RAASTBenefShowInfo', {
              screen: 'aliasbybenef',
              paramsAlias: response.data,
              param: params,
            });
          },
        ),
      );
    }
  }
  const setOfActions = () => {
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
        description={'Pay by Raast ID'}
        // cardmanagment={true}
      />
      <ScrollView contentContainerStyle={globalStyling.scrollContent}>
        <View style={{flex: 1}}>
          <View style={{height: wp(2)}} />
          <CustomText
            style={[
              styles.text,
              {
                paddingLeft: isRtlState() ? wp(5) : null,
                paddingRight: isRtlState() ? null : wp(5),
              },
            ]}>
            From
          </CustomText>
          <TabNavigator
            tabHeading={tab_from_acc?.accountType}
            border={true}
            text={tab_from_acc?.account}
            navigation={props.navigation}
            width={'90%'}
            fontSize={wp(4.2)}
            textWidth={'100%'}
            arrowColor={accounts.length == 1 ? 'white' : 'grey'}
            arrowSize={wp(9)}
            multipleLines={2}
            // backgroundColor={'white'}
            // color={'black'}
            onPress={() => {
              accounts.length == 1 ? logs.log('') : setOfActions();
            }}
          />
          <TabNavigator
            border={true}
            tabHeading={'Purpose of Payment'}
            text={tab_purpose.purpose}
            navigation={props.navigation}
            width={'90%'}
            fontSize={wp(4.2)}
            textWidth={'100%'}
            // arrowColor={'grey'}
            arrowSize={wp(9)}
            multipleLines={2}
            // backgroundColor={'white'}
            // color={'black'}
            onPress={() => {
              change_modal_state(true);
              change_modal_type('purpose');
            }}
          />

          <CustomText
            style={[
              styles.text,
              {
                paddingLeft: isRtlState() ? wp(5) : null,
                paddingRight: isRtlState() ? null : wp(5),
              },
            ]}>
            To
          </CustomText>
          <TabNavigator
            border={true}
            tabHeading={
              props?.route?.params?.requiredData?.benefAlias
                ? props?.route?.params?.requiredData?.benefAlias
                : 'Raast ID'
            }
            text={aliasFromPay}
            navigation={props.navigation}
            width={'90%'}
            fontSize={wp(4.2)}
            textWidth={'100%'}
            // arrowColor={'white'}
            arrowSize={wp(9)}
            multipleLines={2}
            // backgroundColor={'white'}
            // color={'black'}
            onPress={() => {
              // change_modal_state(true);
              // change_modal_type('purpose');
            }}
          />
          {/* <View>
          <CustomText
            style={{
              fontSize: wp(5),
              color: Colors.blackColor,
              paddingVertical: wp(1),
              paddingLeft: wp(5),
            }}
            boldFont={true}>
            Raast ID
          </CustomText>
          <CustomText
            style={{
              fontSize: wp(5),
              color: Colors.blackColor,
              paddingVertical: wp(3),
              paddingLeft: wp(5),
            }}
            boldFont={true}>
            {aliasFromPay}
          </CustomText>
        </View> */}
          {/* <View
          style={{
            width: screenWidth / 1.08,
            height: wp(13),
            borderWidth: 1,
            borderColor: 'silver', //Colors.primary_green,
            backgroundColor: 'white',
            alignSelf: 'center',
            borderRadius: wp(1),
            // flexDirection: 'row',
            justifyContent: 'center',
            // alignItems: 'center',
            marginVertical: wp(0.5),
            overflow: 'hidden',
          }}>
          <Text
            style={{
              color: 'black',
              // fontWeight: 'bold',
              fontSize: wp(4.5),
              marginLeft: wp(5),
            }}>
            {aliasFromPay}
          </Text>
        </View> */}

          {/* <CustomText style={styles.text} boldFont={true}>
          Enter Amount
        </CustomText> */}
          <CustomTextField
            keyboardType={'numeric'}
            placeholder={tab_amount ? null : 'Enter Amount'}
            text_input={tab_amount}
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
          <View style={{height: wp(3)}} />

          {props?.route?.params?.requiredData ? (
            <RecentTransaction
              navigation={props.navigation}
              AccountType={'RAAST_BY_ALIAS'}
              FromAccount={userObject?.pkAccounts[0]?.iban}
              ToAccount={aliasFromPay}
              ToAccountname={props?.route?.params?.requiredData?.benefAlias}
            />
          ) : null}

          <View style={styles.gap}></View>
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
              ? accounts
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
          reason={modal_type === 'reason' ? true : false}
          purpose={modal_type == 'purpose' ? true : false}
          onCancel={() => change_modal_state(false)}
        />
      </ScrollView>
      <KeyboardAvoidingView
        keyboardVerticalOffset={hp(7)}
        behavior={'padding'}
        style={globalStyling.buttonContainer}>
        {/* <GlobalHeader navigation={props.navigation} /> */}

        {/* <ScrollView showsVerticalScrollIndicator={false}> */}

        <CustomBtn
          btn_txt={'Continue'}
          onPress={() => {
            validate();
          }}
          btn_width={wp(90)}
          backgroundColor={Colors.primary_green}
        />

        {/* </ScrollView> */}
      </KeyboardAvoidingView>
    </View>
  );
};

export default RAAASTBenefByAlias;
