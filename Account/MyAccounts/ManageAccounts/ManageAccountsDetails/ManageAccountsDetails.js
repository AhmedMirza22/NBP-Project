import React, {useState} from 'react';
import {View, Text, Dimensions} from 'react-native';
import SubHeader from '../../../../../Components/GlobalHeader/SubHeader/SubHeader';
import styles from './ManageAccountsDetailsStyling';
import CustomBtn from '../../../../../Components/Custom_btn/Custom_btn';
import {Colors} from '../../../../../Theme';
import CustomAlert from '../../../../../Components/Custom_Alert/CustomAlert';
import {useSelector, useDispatch} from 'react-redux';
import i18n from '../../../../../Config/Language/LocalizeLanguageString';
import {
  setManageAccountState,
  setCurrentFlow,
} from '../../../../../Redux/Action/Action';
import CustomText from '../../../../../Components/CustomText/CustomText';
import {wp} from '../../../../../Constant';
import {isRtlState} from '../../../../../Config/Language/LanguagesArray';
import {logs} from '../../../../../Config/Config';
import analytics from '@react-native-firebase/analytics';
export default function ManageAccountsDetails(props) {
  const token = useSelector((state) => state.reducers.token);
  const dispatch = useDispatch();
  const [showAlert, changeShowAlert] = React.useState(false);
  const [showRemoveResponse, changeshowRemoveResponse] = React.useState(false);
  const object = props.route.params?.data;
  const isDormant =
    object?.status === '1' || object?.status === '2' ? true : false;
  logs.log('12873891273982173asdasd', object);
  React.useEffect(() => {
    props.navigation.addListener('focus', () => {
      dispatch(setCurrentFlow('Manage Account'));
      async function analyticsLog() {
        await analytics().logEvent('ManageAccountsDetails');
      }
      analyticsLog();
    });
  }, []);
  const dormantCall = async () => {
    props.navigation.navigate('DormantMpin', object);
  };
  const [proceedAlert, changeproceedAlert] = useState(false);
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

  return (
    <View
      style={[styles.container, {backgroundColor: Colors.backgroundColor}]}
      accessibilityLabel="Manage Accounts">
      {/* <GlobalHeader navigation={props.navigation} /> */}
      <SubHeader
        navigation={props.navigation}
        title={'Manage Account'}
        description={'Manage your linked accounts'}
        // manageAccounts={true}
      />
      <View style={{height: wp(4)}} />
      <View
        style={{
          width: wp(90),
          alignSelf: 'center',
          backgroundColor: Colors.subContainer,
          borderRadius: wp(1),
          padding: wp(3),
          top: wp(1),
        }}>
        {/* <View style={{height: wp()}} /> */}

        {/* <CustomText
          boldFont={true}
          style={{
            fontSize: wp(4.5),
            color: '#9ea3a6',
            paddingVertical: wp(2),
            paddingLeft: wp(4),
          }}>
          Account Details
        </CustomText> */}
        <View
          style={{
            // height: wp(10),
            backgroundColor: Colors.childContainer,
            width: wp(80),
            alignSelf: 'center',
            borderRadius: wp(1.5),
            padding: wp(4),
            top: wp(2),
          }}>
          <View style={styles.rowStyling}>
            <CustomText style={styles.titleText}>Account Title</CustomText>
            <CustomText
              boldFont={true}
              style={{
                padding: wp(1),
                fontSize: wp(4.45),
                textAlign: isRtlState() ? 'left' : 'right',
              }}>
              {object?.accountTitle}
            </CustomText>
          </View>
          <View style={styles.rowStyling}>
            <CustomText style={styles.titleText}>Account Type</CustomText>
            <CustomText
              style={{
                padding: wp(1),
                fontSize: wp(4.45),
                textAlign: isRtlState() ? 'left' : 'right',
              }}
              boldFont={true}>
              {object?.accountType == 'C'
                ? 'Conventional'
                : object?.accountType == 'I'
                ? 'Islamic'
                : object?.accountType}
            </CustomText>
          </View>
          <View style={styles.rowStyling}>
            <CustomText style={styles.titleText}>Account Number</CustomText>
            <CustomText
              style={{
                padding: wp(1),
                fontSize: wp(4.45),
                textAlign: isRtlState() ? 'left' : 'right',
              }}
              // numberOfLines={1}
              boldFont={true}>
              {isDormant ? object?.accountNumber : object?.account}
            </CustomText>
          </View>
        </View>
        <View style={{height: wp(4)}} />
      </View>
      {isDormant ? (
        <View
          style={{position: 'absolute', alignSelf: 'center', bottom: wp(10)}}>
          <CustomBtn
            accessibilityLabel="Set as default"
            btn_txt={'Request to Remove Dormancy'}
            onPress={() => {
              if (isL0Customer) {
                dormantCall();
              } else if (isL1Customer) {
                changeproceedAlert(true);
              } else {
                changeproceedAlert(true);
              }

              // dormantCall();
              // changeShowAlert(true);
              // dispatch(
              //   setManageAccountState(
              //     token,
              //     object?.account,
              //     true,
              //     false,
              //     props.navigation,
              //     object,
              //   ),
              // );
            }}
            btn_width={wp(90)}
            backgroundColor={Colors.primary_green}
          />
        </View>
      ) : (
        <View
          style={{position: 'absolute', alignSelf: 'center', bottom: wp(10)}}>
          <CustomBtn
            accessibilityLabel="Set as default"
            btn_txt={'Set as default'}
            onPress={() => {
              // changeShowAlert(true);
              dispatch(
                setManageAccountState(
                  token,
                  object?.account,
                  true,
                  false,
                  props.navigation,
                  object,
                ),
              );
            }}
            btn_width={wp(90)}
            backgroundColor={Colors.primary_green}
          />

          <View style={{height: wp(4)}} />
          <CustomBtn
            accessibilityLabel="Remove Account"
            btn_txt={'Remove Account'}
            onPress={() => {
              changeshowRemoveResponse(true);
              // dispatch(
              //   setManageAccountState(
              //     token,
              //     object?.account,
              //     false,
              //     true,
              //     props.navigation,
              //     object
              //   ),
              // );
            }}
            color={Colors.blackColor}
            btn_width={wp(90)}
            backgroundColor={Colors.themeGrey}
          />
        </View>
      )}
      <CustomAlert
        accessibilityLabel="Account already set to default."
        overlay_state={showAlert}
        title={'Manage Account'}
        alert_text={'Account already set to defaults.'}
        onPressCancel={() => changeShowAlert(false)}
        onPressOkay={() => changeShowAlert(false)}
        alertTextCenter={true}
      />
      <CustomAlert
        overlay_state={proceedAlert}
        title={'Upgrade Registration'}
        accessibilityLabel={'Upgrade Registration'}
        label={'Upgrade User'}
        alert_text={
          isL1Customer
            ? 'Dear Customer, Your registration has been upgraded but your transaction activation is pending. You will be contacted by NBP call center representative. You may contact NBP call center also for activation at 021-111-627-627.'
            : i18n[
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

      <CustomAlert
        accessibilityLabel="Are you sure you want to remove the account?"
        overlay_state={showRemoveResponse}
        title={'Manage Account'}
        alert_text={i18n['Are you sure you want to remove the account?']}
        onPressCancel={() => {
          changeshowRemoveResponse(false);
        }}
        yesNoButtons={true}
        onPressYes={() => {
          changeshowRemoveResponse(false);
          setTimeout(() => {
            dispatch(
              setManageAccountState(
                token,
                object?.account,
                false,
                true,
                props.navigation,
                object,
              ),
            );
          }, 200);
        }}
        onPressNo={() => changeshowRemoveResponse(false)}
      />
    </View>
  );
}
