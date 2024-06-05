import React, {useEffect, useState} from 'react';
import {
  View,
  ScrollView,
  Text,
  KeyboardAvoidingView,
  Dimensions,
  Platform,
} from 'react-native';
import styles from './Change_StatusStyle';
import GlobalHeader from '../..//../../Components/GlobalHeader/GlobalHeader';
import SubHeader from '../../../../Components/GlobalHeader/SubHeader/SubHeader';
import TabNavigator from '../../../../Components/TabNavigate/TabNavigate';
import CustomModal from '../../../../Components/CustomModal/CustomModal';
import {wp, globalStyling} from '../../../../Constant';
import CustomBtn from '../../../../Components/Custom_btn/Custom_btn';
import {useSelector, useDispatch} from 'react-redux';
import {Colors} from '../../../../Theme';
// import CustomAlert from '../../../Components/Custom_Alert/CustomAlert';
import {setCurrentFlow, setAppAlert} from '../../../../Redux/Action/Action';
import {logs} from '../../../../Config/Config';
import analytics from '@react-native-firebase/analytics';

const screenWidth = Dimensions.get('window').width;
const Change_Status = (props) => {
  const acc_info = useSelector(
    (state) => state.reducers.overViewData?.data?.accounts,
  );
  logs.log(acc_info.iban);
  logs.log(props.route.params?.screen);
  //tab_text
  const dispatch = useDispatch();
  //tab_text
  useEffect(() => {
    props.navigation.addListener('focus', () => {
      dispatch(setCurrentFlow('Debit Card Issuance'));
      async function analyticsLog() {
        await analytics().logEvent('DebitCardIssuanceChangeStatus');
      }
      analyticsLog();
    });
  }, []);
  const screen = props.route.params?.screen;
  const [tab_action, change_action] = useState({action: 'Select Action'});

  const [modal, change_modal_state] = useState(false);
  const [modal_type, change_modal_type] = useState('');
  const aliases = useSelector((state) => state.reducers.aliases);
  const [tab_alias, change_alias] = useState({
    type: aliases[0]?.type,
    value: aliases[0]?.value,
  });
  const action = [{action: 'Active'}, {action: 'Suspend'}];
  const requestobj = {};
  function validate() {
    requestobj.aliasType = tab_alias.type;
    requestobj.aliasValue = tab_alias.value;
    requestobj.iban = acc_info.iban;
    requestobj.idType = 'CNIC';
    requestobj.idValue = acc_info.cnic;
    requestobj.status = tab_action.action == 'Suspend' ? 'suspend' : 'active';

    if (!tab_action.action) {
      dispatch(setAppAlert('Please select action'));
    } else if (!requestobj.aliasValue) {
      dispatch(setAppAlert('Please Select Raast ID'));
    } else {
      props.navigation.navigate('RAASTMpin', {from_screen: screen, requestobj});
    }
    3;
  }
  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : null}
      keyboardVerticalOffset={40}
      style={globalStyling.whiteContainer}
      accessibilityLabel="Change Status Screen">
      {/* <GlobalHeader navigation={props.navigation} /> */}
      <SubHeader
        navigation={props.navigation}
        title={'Status Change Raast ID'}
        description={'Raast Account Management'}
        cardmanagment={true}
      />
      <ScrollView showsVerticalScrollIndicator={false}>
        <Text style={styles.text}>Raast ID:</Text>
        <TabNavigator
          text={tab_alias.type + ' - ' + tab_alias.value}
          accessibilityLabel={tab_alias.type + ' - ' + tab_alias.value}
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
        />
        <Text style={styles.text}>Action:</Text>
        <TabNavigator
          text={tab_action.action}
          accessibilityLabel={tab_action.action}
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
            change_modal_type('action');
          }}
        />

        <View style={styles.gap}></View>
        <CustomBtn
          btn_txt={'Continue'}
          accessibilityLabel={'Continue'}
          onPress={() => {
            validate();
          }}
          btn_width={screenWidth / 2}
          backgroundColor={Colors.primary_green}
        />
        <CustomModal
          visible={modal}
          headtext={
            modal_type == 'action'
              ? 'Select From Account'
              : modal_type == 'alias'
              ? 'Select Raast ID'
              : ''
          }
          data={
            modal_type == 'action'
              ? action
              : modal_type == 'alias'
              ? aliases
              : null
          }
          onPress_item={(param) => {
            logs.log(`option selected ${param}`);
            modal_type == 'action'
              ? change_action(param)
              : modal_type == 'alias'
              ? change_alias(param)
              : null;
            change_modal_state(false);
          }}
          action={modal_type === 'action' ? true : false}
          alias_accounts={modal_type === 'alias' ? true : false}
          onCancel={() => change_modal_state(false)}
        />
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default Change_Status;
