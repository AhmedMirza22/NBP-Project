import React, {useEffect, useState} from 'react';
import {View, Text, Dimensions, TextInput} from 'react-native';
import styles from './BeneficiaryDetailStyling';
import GlobalHeader from '../../../../Components/GlobalHeader/GlobalHeader';
import SubHeader from '../../../../Components/GlobalHeader/SubHeader/SubHeader';
import CustomBtn from '../../../../Components/Custom_btn/Custom_btn';
import CustomAlert from '../../../../Components/Custom_Alert/CustomAlert';
import {Colors} from '../../../../Theme';
import {
  update_benef,
  delete_benef,
  changeGlobalIconAlertState,
  setAppAlert,
} from '../../../../Redux/Action/Action';
import {check_email} from '../../../../Helpers/Helper';
import {useSelector, useDispatch} from 'react-redux';
import {Message} from '../../../../Constant/Messages/index';
import CustomText from '../../../../Components/CustomText/CustomText';
import {hp, wp} from '../../../../Constant';
import {logs} from '../../../../Config/Config';
import {isRtlState} from '../../../../Config/Language/LanguagesArray';
import analytics from '@react-native-firebase/analytics';

const screenWidth = Dimensions.get('window').width;

export default function BeneficiaryDetail(props) {
  useEffect(() => {
    async function analyticsLog() {
      await analytics().logEvent('BeneficiaryDetailScreen');
    }
    analyticsLog();
  }, []);

  const [mode, changeMode] = useState('view');
  const [shortName, changeShortName] = useState(
    props.route.params?.data?.benefAlias,
  );
  const [showAlert, changeAlert] = useState(false);
  const [email, changeEmail] = useState(props.route.params?.data?.benefEmail);
  const [mobileNumber, changeMobileNumber] = useState(
    props.route.params?.data?.benefMobile,
  );
  const [updatePressed, setUpdatePressed] = useState(false);
  const dispatch = useDispatch();
  logs.log('asdasdsd', props.route.params);
  return (
    <View style={[styles.container, {backgroundColor: Colors.backgroundColor}]}>
      {/* <GlobalHeader navigation={props.navigation} /> */}
      <SubHeader
        navigation={props.navigation}
        title={'View Beneficiary'}
        // viewBeneficiaries={true}
        description={'View List of Beneficiaries'}
      />
      <View style={styles.gap} />
      <View
        style={{
          width: wp(90),
          alignSelf: 'center',
          backgroundColor: Colors.subContainer,
          borderRadius: wp(1),
          borderColor: Colors.textFieldBorderColor,
          borderWidth: 0.5,
        }}>
        <View
          style={{
            width: wp(80),
            backgroundColor: Colors.childContainer,
            alignSelf: 'center',
            paddingHorizontal: wp(3),
            marginVertical: hp(2),
            borderRadius: wp(1),
            paddingVertical: wp(1),
            alignItems: isRtlState() ? 'flex-start' : 'flex-end',
            // margin: wp(2),
          }}>
          <View style={styles.gap}>
            <CustomText style={styles.titleText}>Short Name</CustomText>
            <CustomText style={styles.descriptionText} boldFont={true}>
              {shortName}
            </CustomText>
          </View>
          <View style={styles.gap}>
            <CustomText style={styles.titleText}>Beneficiary Name</CustomText>
            <CustomText
              style={styles.descriptionText}
              boldFont={true}
              numberOfLines={1}
              ellipsizeMode={'tail'}>
              {props.route.params?.data?.benefTitle}
            </CustomText>
          </View>
          <View style={styles.gap}>
            <CustomText style={styles.titleText}>
              {props.route.params?.data?.type === 'bank'
                ? 'Beneficiary Account'
                : 'Consumer Number'}
            </CustomText>
            <CustomText
              style={styles.descriptionText}
              boldFont={true}
              numberOfLines={1}
              ellipsizeMode={'tail'}>
              {props.route.params?.data?.benefAccount}
            </CustomText>
          </View>

          <View style={styles.gap}>
            <CustomText style={styles.titleText}>
              {props.route.params?.data?.type === 'bank'
                ? 'Beneficiary Bank Name'
                : 'Company Name'}
            </CustomText>
            <CustomText
              style={styles.descriptionText}
              boldFont={true}
              numberOfLines={1}
              ellipsizeMode={'tail'}>
              {props.route.params?.data?.companyName
                ? props.route.params?.data?.companyName
                : '-'}
            </CustomText>
          </View>

          <View style={styles.gap}>
            <CustomText style={styles.titleText}>Mobile Number</CustomText>
            <CustomText style={styles.descriptionText} boldFont={true}>
              {mobileNumber ? mobileNumber : '-'}
            </CustomText>
          </View>
          <View style={styles.gap}>
            <CustomText style={styles.titleText}>Email Address</CustomText>
            <CustomText
              style={styles.descriptionText}
              boldFont={true}
              numberOfLines={1}
              ellipsizeMode={'tail'}>
              {email ? email : '-'}
            </CustomText>
          </View>
        </View>
      </View>
      {/* <View style={styles.row}>
        <CustomText style={styles.titleText}>
          Beneficiary Short Name:
        </CustomText>
        {mode === 'view' ? (
          <CustomText style={styles.descriptionText}>{shortName}</CustomText>
        ) : (
          <TextInput
            value={shortName}
            placeholder={shortName}
            style={styles.inputText}
            maxLength={40}
            onChangeText={(text) => changeShortName(text)}
          />
        )}
      </View> */}
      {/* <View style={styles.row}>
        <CustomText style={styles.titleText}>Beneficiary Full Name:</CustomText>
        <CustomText style={styles.descriptionText}>
          {props.route.params?.data?.benefTitle}
        </CustomText>
      </View> */}
      {/* <View style={styles.row}>
        <CustomText style={styles.titleText}>
          {props.route.params?.data?.type === 'bank'
            ? 'Beneficiary Account'
            : 'Consumer Number'}
          :
        </CustomText>
        <CustomText style={styles.descriptionText}>
          {props.route.params?.data?.benefAccount}
        </CustomText>
      </View> */}
      {/* <View style={styles.row}>
        <CustomText style={styles.titleText}>
          {props.route.params?.data?.type === 'bank'
            ? 'Beneficiary Bank Name'
            : 'Company Name'}
          :
        </CustomText>
        <CustomText style={styles.descriptionText}>
          {props.route.params?.data?.companyName}
        </CustomText>
      </View> */}
      {/* <View style={styles.row}>
        <CustomText style={styles.titleText}>
          Beneficiary Mobile Number:
        </CustomText>
        {mode === 'view' ? (
          <CustomText style={styles.descriptionText}>{mobileNumber}</CustomText>
        ) : (
          <TextInput
            value={mobileNumber}
            placeholder={mobileNumber}
            style={styles.inputText}
            maxLength={11}
            keyboardType={'numeric'}
            onChangeText={(text) =>
              changeMobileNumber(String(text).replace(/[^0-9]/g, ''))
            }
          />
        )}
      </View> */}
      {/* <View style={styles.row}>
        <CustomText style={styles.titleText}>
          Beneficiary Email Address:
        </CustomText>
        {mode === 'view' ? (
          <CustomText style={styles.descriptionText}>{email}</CustomText>
        ) : (
          <TextInput
            value={email}
            placeholder={email}
            style={styles.inputText}
            maxLength={50}
            onChangeText={(text) => changeEmail(text)}
          />
        )}
      </View> */}
      <View style={{height: hp(2)}} />
      <View
        style={{
          width: wp(90),
          flexDirection: 'row',
          justifyContent: 'space-between',
          // paddingHorizontal: wp(3),
          alignSelf: 'center',
        }}>
        <CustomBtn
          btn_txt={'Edit'}
          onPress={() => {
            props.navigation.navigate(
              'EditBeneficiary',
              props.route.params?.data,
            );
            changeMode('edit');
          }}
          color={Colors.whiteColor}
          btn_width={wp(43)}
          backgroundColor={Colors.primary_green}
        />
        <CustomBtn
          btn_txt={'Delete'}
          onPress={() => {
            changeAlert(true);
          }}
          btn_width={wp(43)}
          color={Colors.blackColor}
          backgroundColor={Colors.themeGrey}
        />
      </View>
      {/* <View style={styles.buttonRow}>
        {mode === 'edit' ? (
          <CustomBtn
            btn_txt={'Update'}
            onPress={() => {
              if (check_email(email) || email == '') {
                dispatch(
                  update_benef(
                    props.navigation,
                    props.route.params.data.benefID,
                    shortName,
                    email,
                    mobileNumber,
                  ),
                );
              } else {
                dispatch(setAppAlert(Message.invalidEmail));
              }

              changeMode('view');
            }}
            btn_width={wp(40)}
            backgroundColor={Colors.primary_green}
          />
        ) : (
          <CustomBtn
            btn_txt={'Edit'}
            onPress={() => {
              changeMode('edit');
            }}
            color={Colors.blackColor}
            btn_width={wp(40)}
            backgroundColor={Colors.themeGrey}
          />
        )}
        <View style={{height: wp(4)}} />
      </View>
      */}
      <CustomAlert
        overlay_state={showAlert}
        onPressCancel={() => {
          changeAlert(false);
        }}
        iscancelbtn={false}
        onPressOkay={() => {
          changeAlert(false);
        }}
        onPressYes={() => {
          dispatch(
            delete_benef(props.navigation, props.route.params?.data?.benefID),
          );
          changeAlert(false);
        }}
        onPressNo={() => {
          changeAlert(false);
        }}
        yesNoButtons={true}
        title={'Beneficiary'}
        alert_text={'Are you sure you want to delete Beneficiary?'}
      />
    </View>
  );
}
