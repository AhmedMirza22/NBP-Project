import React, {useEffect, useState} from 'react';
import {
  View,
  ScrollView,
  Text,
  KeyboardAvoidingView,
  Dimensions,
  Platform,
} from 'react-native';
import CustomText from '../../../../Components/CustomText/CustomText';
import styles from './GeneralAliasManagmentStyle';
import GlobalHeader from '../..//../../Components/GlobalHeader/GlobalHeader';
import SubHeader from '../../../../Components/GlobalHeader/SubHeader/SubHeader';
import TabNavigator from '../../../../Components/TabNavigate/TabNavigate';
import CustomModal from '../../../../Components/CustomModal/CustomModal';
import {wp, globalStyling} from '../../../../Constant';
import CustomBtn from '../../../../Components/Custom_btn/Custom_btn';
import {useSelector, useDispatch} from 'react-redux';
import {Colors} from '../../../../Theme';
import {setCurrentFlow, setAppAlert} from '../../../../Redux/Action/Action';
import {logs} from '../../../../Config/Config';
import Ionicons from 'react-native-vector-icons/Ionicons';
import analytics from '@react-native-firebase/analytics';

const screenWidth = Dimensions.get('window').width;
const General_AliasManagment = (props) => {
  const acc_info = useSelector(
    (state) => state.reducers.overViewData?.data?.accounts,
  );
  //tab_text
  const dispatch = useDispatch();
  //tab_text
  useEffect(() => {
    props.navigation.addListener('focus', () => {
      dispatch(setCurrentFlow('Raast ID Managment'));
      async function analyticsLog() {
        await analytics().logEvent('RaastIDManagmentScreen');
      }
      analyticsLog();

      change_from_acc({
        account: accounts[0]?.account,
        iban: accounts[0]?.iban,
        accountType: accounts[0]?.accountType,
        currency: accounts[0]?.currency,
        accountTitle: accounts[0]?.accountTitle,
      });
    });
  }, []);
  const screen = props.route.params?.screen;
  const [modal, change_modal_state] = useState(false);
  const [modal_type, change_modal_type] = useState('');
  const userObject = useSelector((state) => state.reducers.userObject);
  const accounts = userObject?.pkAccounts;
  const [tab_from_acc, change_from_acc] = useState({
    // account: accounts[0]?.account,
    // iban: accounts[0]?.iban,
    // accountType: accounts[0]?.accountType,
    // currency: accounts[0]?.currency,
    // accountTitle: accounts[0]?.accountTitle,
  });
  const login_response = useSelector((state) => state.reducers.loginResponse);
  let filtered_acc = accounts;
  const [tab_product_type, change_product] = useState({
    alias_type: 'MOBILE',
    alias_value: login_response.details?.mobile,
  });
  const product_type = [
    {alias_type: 'MOBILE', alias_value: login_response.details?.mobile},
  ];

  const setOfActions = () => {
    change_modal_state(true);
    change_modal_type('account');
  };
  const requestobj = {};
  function validate() {
    requestobj.aliasType = tab_product_type.alias_type;

    requestobj.aliasValue = tab_product_type.alias_value;

    // {
    //   screen == 'Remove'
    //     ? null
    //     : (requestobj.aliasValue = tab_product_type.alias_value);
    // }
    {
      screen == 'Unlink' || screen == 'Remove' || screen == 'Register'
        ? null
        : (requestobj.currency = tab_from_acc.currency);
    }
    requestobj.iban = tab_from_acc.iban;
    requestobj.idType = 'CNIC';
    requestobj.idValue = acc_info.cnic;
    {
      screen == 'Link' || screen == 'Unlink' || screen == 'Remove'
        ? (requestobj.isDefault = true)
        : '';
    }
    // console.log(requestobj);
    if (!requestobj.iban) {
      dispatch(setAppAlert('Please select account number'));
    } else {
      props.navigation.navigate('RAASTMpin', {
        from_screen: screen,
        requestobj,
        name: tab_from_acc.accountTitle,
        alias: tab_product_type.alias_value,
      });
    }
  }
  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : null}
      keyboardVerticalOffset={40}
      style={[
        globalStyling.whiteContainer,
        {backgroundColor: Colors.backgroundColor},
      ]}
      accessibilityLabel="General RAAST ID Management Screen">
      <SubHeader
        navigation={props.navigation}
        title={
          screen == 'Register'
            ? 'Create Raast ID'
            : screen == 'Link'
            ? 'Link Raast ID'
            : screen == 'Unlink'
            ? 'Unlink Raast ID'
            : screen == 'Remove'
            ? 'Remove Raast ID'
            : ''
        }
        description={
          screen == 'Register'
            ? 'Create your Raast ID'
            : screen == 'Link'
            ? 'Link Raast ID'
            : screen == 'Unlink'
            ? 'Unlink Raast ID'
            : screen == 'Remove'
            ? 'Remove Raast ID'
            : ''
        }
      />
      <View style={{height: wp(4)}} />
      <CustomText
        style={{
          fontSize: wp(5),
          width: '90%',
          alignSelf: 'center',
          marginVertical: wp(2),
          color: '#9ea3a6',
        }}>
        From
      </CustomText>
      <TabNavigator
        tabHeading={'Account Number'}
        border={true}
        text={tab_from_acc?.account}
        accessibilityLabel={
          tab_from_acc?.accountType +
          '\n' +
          tab_from_acc?.account +
          ' (' +
          tab_from_acc?.currency +
          ')'
        }
        navigation={props.navigation}
        width={'90%'}
        fontSize={wp(4.2)}
        textWidth={'100%'}
        arrowColor={accounts.length == 1 ? Colors.whiteColor : Colors.grey}
        arrowSize={wp(9)}
        multipleLines={2}
        // backgroundColor={Colors.whiteColor}
        // color={Colors.blackColor}
        onPress={() => {
          accounts.length == 1 ? logs.log() : setOfActions();
        }}
      />

      {/* <CustomText style={{
            fontSize: wp(5),
            width: '90%',
            alignSelf: 'center',
            marginVertical: wp(4),
            color:'#9ea3a6'
          }} boldFont={true}>
          To
        </CustomText> */}
      <TabNavigator
        tabHeading={'IBAN'}
        border={true}
        text={tab_from_acc?.iban}
        accessibilityLabel={tab_from_acc?.iban}
        navigation={props.navigation}
        width={'90%'}
        fontSize={wp(4.2)}
        textWidth={'100%'}
        arrowColor={Colors.whiteColor}
        arrowSize={wp(9)}
        multipleLines={2}
        // backgroundColor={Colors.whiteColor}
        // color={Colors.blackColor}
        onPress={() => {
          // change_modal_state(true);
          // change_modal_type('account');
        }}
      />

      <CustomText
        style={{
          fontSize: wp(5),
          width: '90%',
          alignSelf: 'center',
          marginVertical: wp(3),
          color: '#9ea3a6',
        }}>
        Raast ID
      </CustomText>
      <TabNavigator
        tabHeading={'Mobile Number'}
        border={true}
        text={tab_product_type.alias_value}
        accessibilityLabel={tab_from_acc?.iban}
        navigation={props.navigation}
        width={'90%'}
        fontSize={wp(4.2)}
        textWidth={'100%'}
        arrowColor={Colors.whiteColor}
        arrowSize={wp(9)}
        multipleLines={2}
        // backgroundColor={Colors.whiteColor}
        // color={Colors.blackColor}
        onPress={() => {
          // change_modal_state(true);
          // change_modal_type('account');
        }}
      />
      {/* REMOVE FOR NEW DEVELOPMENT
        <TabNavigator
          text={
            tab_product_type.alias_type + ' - ' + tab_product_type.alias_value
          }
          accessibilityLabel={
            tab_product_type.alias_type + ' - ' + tab_product_type.alias_value
          }
          navigation={props.navigation}
          width={'90%'}
          fontSize={wp(4.2)}
          textWidth={'85%'}
          arrowColor={'grey'}
          arrowSize={wp(9)}
          multipleLines={2}
          backgroundColor={'white'}
          color={'black'}
          onPress={() => {
            change_modal_state(true);
            change_modal_type('alias');
          }}
        /> */}
      {/* <View
        style={{
          width: wp(90),
          height: wp(12),
          backgroundColor: Colors.whiteColor,
          alignSelf: 'center',
          flexDirection: 'row',
          borderRadius: 5,
          borderWidth: 1,
          borderColor: Colors.primary_green,
        }}>
        <Ionicons
          name={'radio-button-on'}
          size={wp(6)}
          color={Colors.primary_green}
          style={{alignSelf: 'center', marginLeft: wp(5)}}
        />
        <Ionicons
          name={'call'}
          size={wp(5.5)}
          color={Colors.grey}
          style={{alignSelf: 'center', marginLeft: wp(10)}}
        />
        <CustomText
          style={{
            alignSelf: 'center',
            color: 'black',
            fontSize: wp(4.5),
            // fontWeight: 'bold',
          }}>
          {'   '}
          {tab_product_type.alias_value}
        </CustomText>
      </View> */}

      <View style={styles.gap}></View>

      <View style={styles.gap}></View>
      <View style={{position: 'absolute', bottom: wp(10), alignSelf: 'center'}}>
        <CustomBtn
          btn_txt={'Continue'}
          accessibilityLabel={'Continue'}
          onPress={() => {
            validate();
          }}
          btn_width={wp(90)}
          backgroundColor={Colors.primary_green}
        />
      </View>
      <CustomModal
        visible={modal}
        headtext={
          modal_type == 'account'
            ? 'Select From Account'
            : modal_type == 'alias'
            ? 'Select Raast ID'
            : ''
        }
        data={
          modal_type == 'account'
            ? filtered_acc
            : modal_type == 'alias'
            ? product_type
            : null
        }
        onPress_item={(param) => {
          logs.log(`option selected : ${param}`);
          modal_type == 'account'
            ? change_from_acc(param)
            : modal_type == 'alias'
            ? change_product(param)
            : null;
          change_modal_state(false);
        }}
        accounts={modal_type === 'account' ? true : false}
        alias={modal_type === 'alias' ? true : false}
        onCancel={() => change_modal_state(false)}
      />
    </KeyboardAvoidingView>
  );
};

export default General_AliasManagment;
