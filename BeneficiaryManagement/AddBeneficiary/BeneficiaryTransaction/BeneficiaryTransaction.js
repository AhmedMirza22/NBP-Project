import React, {useState} from 'react';
import {
  View,
  Text,
  Dimensions,
  ScrollView,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
} from 'react-native';
import GlobalHeader from '../../../../Components/GlobalHeader/GlobalHeader';
import SubHeader from '../../../../Components/GlobalHeader/SubHeader/SubHeader';
import CustomTextField from '../../../../Components/CustomTextField/CustomTextField';
import CustomBtn from '../../../../Components/Custom_btn/Custom_btn';
import TabNavigator from '../../../../Components/TabNavigate/TabNavigate';
import CustomModal from '../../../../Components/CustomModal/CustomModal';
import CustomAlert from '../../../../Components/Custom_Alert/CustomAlert';
import styles from './BeneficiaryTransactionStyling';
import {useSelector, useDispatch} from 'react-redux';
import HTML from 'react-native-render-html';
import {
  title_benef,
  fundTransfer,
  setLoader,
  getInterBankFundTransferData,
  setCurrentFlow,
  setAppAlert,
} from '../../../../Redux/Action/Action';
import CustomText from '../../../../Components/CustomText/CustomText';
import {post} from '../../../../API/API';
import {Config, logs} from '../../../../Config/Config';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {CheckBox} from 'react-native-elements';
import AsyncStorage from '@react-native-async-storage/async-storage';
import analytics from '@react-native-firebase/analytics';
import {
  BankData,
  ElectricityCompanyData,
  WaterCompanyData,
  GasCompanyData,
  PtclCompanyData,
  MobilePhoneCompanyData,
  PaymentType,
  InternetCompanies,
  EducationInstitutions,
  InsuranceCompanies,
  OnlineShoppingLocations,
  InvestmentCompanies,
  GovernmentDepartments,
  OtherPayments,
} from '../../../../Constant/Data';
import {Colors} from '../../../../Theme';
import Feather from 'react-native-vector-icons/Feather';
import {hp, validateOnlyNumberInput} from '../../../../Constant';
import {Message} from '../../../../Constant/Messages';
import {checkNBPIBAN} from '../../../../Helpers/Helper';
import {TouchableOpacity} from 'react-native';

const screenHeight = Dimensions.get('window').height;
const screenWidth = Dimensions.get('window').width;
function wp(percentage) {
  const value = (percentage * screenWidth) / 100;
  return Math.round(value);
}

const BeneficiaryTransaction = React.memo((props) => {
  const overViewData = useSelector(
    (state) => state.reducers.overViewData?.data?.accounts?.account,
  );

  const [passedParam, setPassParam] = useState(props.route.params?.data);
  const [showModal, changeModalState] = useState(false);
  const [selectedBank, changeSelectedBank] = useState({});
  const [beneficiaryObject, setBeneficiaryObject] = useState({});

  const [showAlert, changeAlertState] = useState(false);
  const [utilityBillPayment, setUtilityBillPayment] = useState('');
  const [billpPaymentModalState, changeBillPaymentModalState] = useState(false);
  const [billPaymentAlertState, changeBillPaymentAlertState] = useState(false);
  const [mobileBillModalState, changeMobileBillModalState] = useState(false);
  const [mobilePaymentCompany, changeMobilePaymentCompany] = useState('');
  const [mobilePaymentType, changeMobilePaymentType] = useState('');
  const [mobilePaymentTabType, changeMobilePaymentTabType] = useState('');
  const [mobilePaymentAlertState, changeMobilePaymentAlertState] =
    useState(false);
  const [mobilePayError, setMobilePayError] = useState('');
  const [showImageAlert, changeImageAlertStatus] = React.useState(false);

  const [internetCompany, changeInternetCompany] = useState('');
  const [showInternetCompanyModal, changeInternetCompanyModal] =
    useState(false);
  const [showInternetCompanyAlert, changeInternetCompanyAlert] =
    useState(false);
  const [showEducationalInstitutionAlert, changeEducationalInstitutionalAlert] =
    useState(false);
  const [
    showEducationalInstitutionalModal,
    changeEducationalInstitutionalModal,
  ] = useState(false);
  const [educationalInstitution, changeEducationInstition] = useState('');
  const [insuranceCompany, changeInsuranceCompany] = useState('');
  const [showInsuranceCompanyAlert, changeInsuranceCompanyAlert] =
    useState(false);
  const [showInsuranceCompanyModal, changeInsuranceCompanyModal] =
    useState(false);
  const [onlineShopping, changeOnlineShopping] = useState('');
  const [showOnlineShoppingAlert, changeOnlineShoppingAlert] = useState(false);
  const [showOnlineShoppingModal, changeOnlineShoppingModal] = useState(false);
  const [investments, changeInvestments] = useState('');
  const [showInvestmentsAlert, changeInvestmentsAlert] = useState(false);
  const [showInvestmentModal, changeInvestmentModal] = useState(false);
  const [governmentDepartment, changeGovernmentDepartment] = useState('');
  const [showGovernmentPayAlert, changeGovernmentPayAlert] = useState(false);
  const [showGovernmentPayModal, changeGovernmentPayModal] = useState(false);
  const [show1BillCreditCardAlert, change1BillCreditCardAlert] =
    useState(false);
  const [utilityDataAsync, setUtilityDataAsync] = useState();
  const [showTopUpAlert, changeTopUpAlert] = useState(false);
  const [showVoucherFeePayment, changeVoucherFeePayment] = useState(false);
  const [otherPaymentMethod, changeOtherPaymentMethod] = useState('');
  const [showOtherPaymentAlert, changeOtherPaymentAlert] = useState(false);
  const [showOtherPaymentModal, changeOtherPaymentModal] = useState(false);
  //***************************text fields**************** */
  const [field_fund_trans, set_fundtrans] = useState('');
  const [field_inter_fund_trans, set_inter_fundtrans] = useState('');
  const [field_util_bill, set_util_bill] = useState('');
  const [field_mobilePayment, set_mobilePayment] = useState('');
  const [field_internet_bill, set_internet_bill] = useState('');
  const [field_education_pay, set_education_pay] = useState('');
  const [field_insurance, set_insurance] = useState('');
  const [field_online_shop, set_online_shop] = useState('');
  const [field_investment, set_investment] = useState('');
  const [field_govt_pay, set_govt_pay] = useState('');
  const [field_credit_card, set_credit_card] = useState('');
  const [field_top_up, set_topup] = useState('');
  const [field_fee_pay, set_fee_pay] = useState('');
  const [field_other, set_other] = useState('');
  const [showBanksModalState, setShowBanksModalState] = useState(false);
  const [checkCard, setCheckCard] = useState(true);
  const [accountNumber, setAccountNumber] = useState('');
  const [prevScreenObj, setPrevScreenObj] = useState('');
  const dispatch = useDispatch();
  const retrieveDataByChunkKey = async (objectKey) => {
    dispatch(setLoader(true));
    try {
      const credentials = await AsyncStorage.getItem(`billerData_${objectKey}`);
      // const credentials = await Keychain.getGenericPassword({
      //   service: `billerData_${objectKey}`, // Use the corresponding service for the key
      // });
      // Check if credentials exist and parse the JSON data
      if (credentials) {
        const savedData = JSON.parse(credentials);
        // Check if the requested key exists in the saved data
        if (savedData && savedData[objectKey]) {
          console.log(
            `Data retrieved successfully for object key=${objectKey}:`,
            savedData[objectKey],
          );
          changeBillPaymentModalState(true);

          dispatch(setLoader(false));
          // setIsLoading(false);
          return savedData[objectKey];
        } else {
          dispatch(setLoader(false));

          console.log(`Data not found for object key=${objectKey}`);
          return null;
        }
      } else {
        dispatch(setLoader(false));

        console.log(`No data found for object key=${objectKey}`);
        return null;
      }
    } catch (error) {
      dispatch(setLoader(false));

      console.error('Error retrieving data:', error);
      return null;
    }
  };
  logs.log('props.route.params', props.route.params);
  // React.useEffect(() => {
  //   changeSelectedBank(props?.route?.params?.generalObj);
  //   // setPrevScreenObj(props?.route?.params?.generalObj);
  //   props.navigation.addListener('focus', () => {
  //     dispatch(setCurrentFlow('Add Beneficiary'));
  //     dispatch(
  //       getInterBankFundTransferData(
  //         '',
  //         props.navigation,
  //         true,
  //         false,
  //         '',
  //         () => {},
  //       ),
  //     );
  //   });
  // }, []);
  React.useEffect(() => {
    async function analyticsLog() {
      await analytics().logEvent('BeneficairyTransactionScreen');
    }
    analyticsLog();
  }, []);

  React.useEffect(() => {
    // changeInvestments
    // logs.log('asdasdasd==>', props.route.params?.bankName);
    props.route.params?.benefType == 2
      ? changeSelectedBank(props?.route?.params?.generalObj)
      : props.route.params?.benefType == 5
      ? changeInternetCompany(props?.route?.params?.generalObj)
      : props.route.params?.benefType == 6
      ? changeEducationInstition(props?.route?.params?.generalObj)
      : props.route.params?.benefType == 4
      ? changeMobilePaymentCompany(props?.route?.params?.generalObj)
      : props.route.params?.benefType == 11
      ? changeGovernmentDepartment(props?.route?.params?.generalObj)
      : props.route.params?.benefType == 8
      ? changeInsuranceCompany(props?.route?.params?.generalObj)
      : props.route.params?.benefType == 9
      ? changeOnlineShopping(props?.route?.params?.generalObj)
      : props.route.params?.benefType == 10
      ? changeInvestments(props?.route?.params?.generalObj)
      : props.route.params?.benefType == 12
      ? changeOtherPaymentMethod(props?.route?.params?.generalObj)
      : null;
  });

  const interBankFundsTransferData = useSelector(
    (state) => state.reducers.interBankFundsTransferData,
  );

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : null}
      keyboardVerticalOffset={40}
      style={[styles.container, {backgroundColor: Colors.backgroundColor}]}
      accessibilityLabel="Beneficiary Transaction Screen">
      {/* <GlobalHeader navigation={props.navigation} /> */}
      <SubHeader
        navigation={props.navigation}
        title={'Add Beneficiary'}
        description={'Add Beneficiary in the list'}
        // addBeneficiary={true}
      />
      <View style={{height: wp(3)}} />
      {props.route.params?.data === 'utilityBillPayments' ? null : (
        <TabNavigator
          tabHeading={'Transaction Type'}
          text={
            props.route.params?.data === 'fundsTransfer'
              ? 'Funds Transfer'
              : props.route.params?.data === 'interBankTransfer'
              ? 'Inter Bank Fund Transfer'
              : props.route.params?.data === 'electricityBill' ||
                props.route.params?.data === 'gasBill' ||
                props.route.params?.data === 'waterBill' ||
                props.route.params?.data === 'ptclBill'
              ? 'Utility Bill Payment'
              : props.route.params?.data === 'mobilePayment'
              ? 'Mobile Bill Payment'
              : props.route.params?.data === 'internetBillPayment'
              ? 'Internet Payment'
              : props.route.params?.data === 'educationPayment'
              ? 'Education Payment'
              : props.route.params?.data === 'insurancePayment'
              ? 'Insurance Payment'
              : props.route.params?.data === 'onlineShopping'
              ? 'Online Shopping Payment'
              : props.route.params?.data === 'investment'
              ? 'Investment'
              : props.route.params?.data === 'governmentPayments'
              ? 'Government Payments'
              : props.route.params?.data === 'creditCardBills'
              ? 'Credit Card Bills'
              : props.route.params?.data === 'topUp'
              ? '1Bill-TopUp'
              : props.route.params?.data === 'voucherPayment'
              ? '1Bill-Voucher/Fee Payment'
              : props.route.params?.data === 'others'
              ? 'Other'
              : 'Transaction'
          }
          border={true}
          // accessibilityLabel={tab_from_acc.account}
          navigation={props.navigation}
          width={'90%'}
          fontSize={wp(4.2)}
          textWidth={'100%'}
          // arrowColor={Colors.whiteColor}
          arrowSize={wp(9)}
          multipleLines={2}
          onPress={() => {}}
        />
      )}

      {/* /////////////fundsTransfer//////////// */}
      {props.route.params?.data === 'fundsTransfer' ? (
        <View style={{flex: 1}}>
          {/* <CustomText style={styles.text}>Transaction Type</CustomText> */}

          {/* <CustomText style={styles.labelViewText}>Fund Transfer</CustomText> */}
          <TabNavigator
            tabHeading={'Bank'}
            text={props.route.params?.bankName}
            multipleLines={1}
            textWidth={'100%'}
            width={'90%'}
            backgroundColor={'white'}
            color={'black'}
            border={true}
            // arrowColor={'white'}
            fontSize={wp(4)}
            onPress={() => {}}
          />

          <View style={{height: wp(3)}}></View>

          {/* <View style={{flexDirection: 'row', marginLeft: 20}}> */}
          <CustomTextField
            textHeading={
              accountNumber.length == 0
                ? null
                : checkCard
                ? 'Account Number'
                : 'IBAN'
            }
            width={wp(90)}
            borderColor={'lightgrey'}
            placeholder={'Enter Account Number/ IBAN'}
            maxLength={24}
            fontSize={wp(3.8)}
            text_input={accountNumber}
            keyboardType={'default'}
            onChangeText={(value) => {
              // if (isNaN(value)) {
              //   logs.log('is Alpha');
              // } else {
              //   logs.log('is a number');
              // }
              if (!isNaN(value)) {
                setAccountNumber(validateOnlyNumberInput(value));
                setCheckCard(true);
              } else {
                setAccountNumber(String(value).replace(/[^a-z0-9]/gi, ''));
                setCheckCard(false);
              }
              // checkCard
              //   ? setAccountNumber(validateOnlyNumberInput(value))
              //   : setAccountNumber(String(value).replace(/[^a-z0-9]/gi, ''));
              // logs.log(value);
            }}
          />
          <CustomText
            style={{
              fontSize: wp(3.5),
              width: wp(90),
              marginTop: wp(2),
              marginLeft: wp(5),
            }}>
            Enter a 14 digit Account Number or a 24 character IBAN as
            PKXXNBPAXXXXXXXXXXXXXXXX that is linked to Raast.
          </CustomText>
          {/* <View
              style={{
                backgroundColor: Colors.whiteColor,
                justifyContent: 'center',
                borderRadius: wp(1),
                borderColor: Colors.themeGreyColor,
                borderWidth: 0.5,
                height: wp(13),
                alignSelf: 'center',
              }}>
              <Feather
                name={'info'}
                size={wp(7)}
                color={'black'}
                onPress={() => {
                  changeImageAlertStatus(true);
                }}
                style={{alignSelf: 'center', padding: 5}}
              />
            </View> */}
          {/* </View> */}
          <View
            style={{
              flexDirection: 'row',
              marginHorizontal: wp(4),
              alignSelf: 'center',
            }}></View>

          <View style={{height: wp(4)}} />
          <View
            style={{position: 'absolute', bottom: wp(10), alignSelf: 'center'}}>
            <CustomBtn
              btn_txt={'Continue'}
              accessibilityLabel={'Submit'}
              onPress={() => {
                if (accountNumber == '') {
                  dispatch(
                    setAppAlert(
                      checkCard
                        ? Message.emptyAccountNumber
                        : Message.emptyIBANNumber,
                    ),
                  );
                } else if (
                  checkCard
                    ? accountNumber.length !== 14
                    : accountNumber.length !== 24
                ) {
                  dispatch(
                    setAppAlert(
                      checkCard
                        ? Message.incompleteAccountNumber
                        : Message.incompleteiban,
                    ),
                  );
                } else {
                  if (checkCard) {
                    const TranRequest = {
                      amoun: '0.00',
                      cnic: '',
                      fromAccount: overViewData,
                      benefiType: props.route.params?.benefType,
                      imd: '979898',
                      purposeOfPayment: '9999',
                      titleFetchAccount: accountNumber,
                      tranType: 'FundTransfer',
                      companyName: 'NBP',
                    };
                    dispatch(
                      fundTransfer(
                        true,
                        '',
                        props.navigation,
                        '0.00',
                        props.route.params?.benefType,
                        '',
                        overViewData,
                        '979898',
                        '9999',
                        accountNumber,
                        TranRequest,
                        (data, responseData) => {
                          logs.log('here in benef', data, responseData);
                          props?.navigation.navigate(
                            'BeneficiaryinputDetails',
                            {
                              data: data,
                              responseData: responseData.data,
                            },
                          );
                        },
                      ),
                    );
                  } else {
                    if (checkNBPIBAN(accountNumber)) {
                      const TranRequest = {
                        amoun: '0.00',
                        cnic: '',
                        fromAccount: overViewData,
                        benefiType: props.route.params?.benefType,
                        imd: '979898',
                        purposeOfPayment: '9999',
                        titleFetchAccount: accountNumber.toUpperCase(),
                        tranType: 'FundTransfer',
                        companyName: 'NBP',
                      };
                      dispatch(
                        fundTransfer(
                          true,
                          '',
                          props.navigation,
                          '0.00',
                          props.route.params?.benefType,
                          '',
                          overViewData,
                          '979898',
                          '9999',
                          accountNumber.toUpperCase(),
                          TranRequest,
                          (data, responseData) => {
                            logs.log('here in benef', data, responseData);
                            props?.navigation.navigate(
                              'BeneficiaryinputDetails',
                              {
                                data: data,
                                responseData: responseData.data,
                              },
                            );
                          },
                        ),
                      );
                    } else {
                      dispatch(setAppAlert(Message.incompleteiban));
                    }
                  }
                }

                // post_(TranRequest);
                // if (field_fund_trans.length == '14') {
                //   dispatch(
                //     fundTransfer(
                //       true,
                //       '',
                //       props.navigation,
                //       '0.00',
                //       props.route.params?.benefType,
                //       '',
                //       overViewData,
                //       '979898',
                //       '9999',
                //       field_fund_trans,
                //       TranRequest,
                //     ),
                //   );
                // } else {
                //   changeAlertState(true);
                // }
              }}
              btn_width={wp(90)}
              backgroundColor={Colors.primary_green}
            />
          </View>
        </View>
      ) : /* /////////////interBankTransfer//////////// */

      props.route.params?.data === 'interBankTransfer' ? (
        <View style={{flex: 1}}>
          <TabNavigator
            tabHeading={'Bank'}
            text={selectedBank?.bankName}
            multipleLines={1}
            textWidth={'100%'}
            width={'90%'}
            // backgroundColor={
            //   Object.keys(selectedBank).length === 0 ? 'white' : 'transparent'
            // }
            // color={Object.keys(selectedBank).length === 0 ? 'black' : 'black'}
            border={true}
            // arrowColor={'white'}
            fontSize={wp(4)}
            onPress={() => {
              // changeModalState(true);
            }}
          />
          <CustomTextField
            placeholder={'Account Number/IBAN'}
            Textfield_label={'Enter Debit/ATM Card Number'}
            onChangeText={(value) => {
              set_inter_fundtrans(value);
            }}
            width={'90%'}
            maxLength={
              selectedBank.accountLenght
                ? Number(selectedBank.accountLenght)
                : 24
            }
            // keyboardType="number-pad"
          />
          <ScrollView
            style={{marginBottom: wp(22)}}
            showsVerticalScrollIndicator={false}>
            {Object.keys(selectedBank).length === 0 ? null : (
              <View style={{marginTop: wp(4)}}>
                <Text style={styles.description}>
                  Please enter {selectedBank.bankName} Account Number
                </Text>
                <Text style={styles.description}>
                  Following the layout below
                </Text>
                <HTML
                  source={{html: selectedBank.accountFormat}}
                  baseFontStyle={{fontSize: wp(4), color: 'grey'}}
                  containerStyle={{
                    width: '90%',
                    alignSelf: 'center',
                    marginVertical: wp(2),
                  }}
                />
              </View>
            )}
          </ScrollView>
          <View style={styles.marginvertical3}>
            <CustomBtn
              btn_txt={'Continue'}
              accessibilityLabel={'Submit'}
              onPress={() => {
                const IBFTRequest = {
                  amoun: '0.00',
                  cnic: '',
                  fromAccount: overViewData,
                  benefiType: props.route.params?.benefType,
                  imd: selectedBank.imd,
                  purposeOfPayment: '9999',
                  titleFetchAccount: field_inter_fund_trans.toUpperCase(),
                  tranType: 'IBFT',
                  companyName: selectedBank.bankName,
                };
                if (
                  field_inter_fund_trans != '' &&
                  Object.keys(selectedBank).length !== 0 &&
                  selectedBank.text != ''
                ) {
                  dispatch(
                    fundTransfer(
                      true,
                      '',
                      props.navigation,
                      '0.00',
                      props.route.params?.benefType,
                      '',
                      overViewData,
                      selectedBank.imd,
                      '9999',
                      field_inter_fund_trans.toUpperCase(),
                      IBFTRequest,
                      (data, responseData) => {
                        props?.navigation.navigate('BeneficiaryinputDetails', {
                          data: data,
                          responseData: responseData,
                        });
                      },
                    ),
                  );
                } else {
                  changeAlertState(true);
                }
              }}
              btn_width={wp(90)}
              backgroundColor={Colors.primary_green}
            />
          </View>
          {/* modal starts here */}
          <CustomModal
            visible={showModal}
            headtext={'Please Select Options Below'}
            banks={true}
            data={interBankFundsTransferData?.Banks?.banks}
            onPress_item={(param) => {
              changeSelectedBank(param);
              setBeneficiaryObject(param);
              setShowBanksModalState(false);
              changeModalState(false);
            }}
            onCancel={() => {
              setShowBanksModalState(false);
              changeModalState(false);
            }}
          />
          {/* modal ends here */}
          {/* custom alert start here  */}
          {/* 
          <CustomAlert
            overlay_state={showAlert}
            onPressCancel={() => {
              changeAlertState(false);
            }}
            iscancelbtn={false}
            onPressOkay={() => {
              // changeAppeaedOnceState(false);
              changeAlertState(false);
            }}
            title={'Add Beneficiary'}
            alert_text={'Invalid Account Number.'}
          /> */}
          {/* custom alert ends here  */}
        </View>
      ) : //////////////////utilityBillPayments///////////////////////
      props.route.params?.data === 'utilityBillPayments' ? (
        <View>
          <TabNavigator
            border={true}
            boldFont={true}
            text={'Electricity'}
            navigation={props.navigation}
            onPress={() => {
              setUtilityBillPayment('electricityBill');
              props.navigation.navigate('BeneficiaryTransaction', {
                data: 'electricityBill',
              });
            }}
          />
          <TabNavigator
            border={true}
            boldFont={true}
            text={'Gas'}
            navigation={props.navigation}
            onPress={() => {
              setUtilityBillPayment('gasBill');
              props.navigation.navigate('BeneficiaryTransaction', {
                data: 'gasBill',
              });
            }}
          />
          <TabNavigator
            border={true}
            boldFont={true}
            text={'Water'}
            navigation={props.navigation}
            onPress={() => {
              setUtilityBillPayment('waterBill');
              props.navigation.navigate('BeneficiaryTransaction', {
                data: 'waterBill',
              });
            }}
          />
          <TabNavigator
            border={true}
            boldFont={true}
            text={'PTCL'}
            navigation={props.navigation}
            onPress={() => {
              setUtilityBillPayment('ptclBill');
              props.navigation.navigate('BeneficiaryTransaction', {
                data: 'ptclBill',
              });
            }}
          />
        </View>
      ) : props.route.params?.data === 'electricityBill' ||
        props.route.params?.data === 'gasBill' ||
        props.route.params?.data === 'waterBill' ||
        props.route.params?.data === 'ptclBill' ? (
        <View style={{flex: 1}}>
          <TabNavigator
            tabHeading={
              props.route.params?.data === 'electricityBill'
                ? 'Electricity'
                : props.route.params?.data === 'gasBill'
                ? 'Gas'
                : props.route.params?.data === 'waterBill'
                ? 'Water'
                : props.route.params?.data === 'ptclBill'
                ? 'PTCL'
                : 'Company Name'
            }
            text={
              Object.keys(selectedBank).length === 0
                ? 'Select Company'
                : selectedBank.text
            }
            multipleLines={1}
            textWidth={'100%'}
            width={'90%'}
            // backgroundColor={
            //   Object.keys(selectedBank).length === 0
            //     ? Colors.whiteColor
            //     : 'transparent'
            // }
            // color={Object.keys(selectedBank).length === 0 ? 'black' : 'black'}
            border={true}
            fontSize={wp(4)}
            navigation={props.navigation}
            onPress={async () => {
              const benefTypo =
                props.route.params?.data === 'electricityBill'
                  ? '01'
                  : props.route.params?.data === 'gasBill'
                  ? '03'
                  : props.route.params?.data === 'waterBill'
                  ? '02'
                  : props.route.params?.data === 'ptclBill'
                  ? '04'
                  : null;
              setUtilityDataAsync(await retrieveDataByChunkKey(benefTypo));
            }}
          />
          <CustomTextField
            placeholder={'Consumer Number'}
            // Textfield_label={'Enter Debit/ATM Card Number'}
            onChangeText={(value) => {
              'Card number :';
              set_util_bill(value);
            }}
            // keyboardType="number-pad"
            width={'90%'}
            maxLength={30}
          />
          <View style={styles.marginvertical3}>
            <CustomBtn
              btn_txt={'Continue'}
              onPress={() => {
                if (
                  field_util_bill != '' &&
                  Object.keys(selectedBank).length !== 0 &&
                  selectedBank.text != ''
                ) {
                  dispatch(
                    title_benef(
                      props.navigation,
                      field_util_bill,
                      props.route.params?.data,
                      props.route.params?.benefType,
                      selectedBank.code,
                      selectedBank.text,
                    ),
                  );
                } else {
                  changeBillPaymentAlertState(true);
                }
              }}
              btn_width={wp(90)}
              backgroundColor={Colors.primary_green}
            />
          </View>

          <CustomAlert
            overlay_state={billPaymentAlertState}
            onPressCancel={() => {
              changeBillPaymentAlertState(false);
            }}
            iscancelbtn={false}
            onPressOkay={() => {
              // changeAppeaedOnceState(false);
              changeBillPaymentAlertState(false);
            }}
            title={'Add Beneficiary'}
            alert_text={'Invalid Consumer Number.'}
          />
          <CustomModal
            visible={billpPaymentModalState}
            headtext={'Please Select Options Below'}
            data={
              props.route.params?.data === 'electricityBill'
                ? utilityDataAsync
                : props.route.params?.data === 'gasBill'
                ? utilityDataAsync
                : props.route.params?.data === 'waterBill'
                ? utilityDataAsync
                : utilityDataAsync
            }
            onPress_item={(param) => {
              let objects = {
                CompanyName: param?.companyType,
                code: param?.companyID,
                imd: param?.companyID,
                text: param?.companyName,
              };
              changeSelectedBank(objects);
              changeBillPaymentModalState(false);
            }}
            utilityBenef={true}
            onCancel={() => changeBillPaymentModalState(false)}
          />
        </View>
      ) : props.route.params?.data === 'mobilePayment' ? (
        <View style={{flex: 1}}>
          <TabNavigator
            tabHeading={'Mobile Company'}
            text={
              mobilePaymentCompany === ''
                ? 'Select Mobile Company'
                : mobilePaymentCompany.text
            }
            navigation={props.navigation}
            border={true}
            width={'90%'}
            multipleLines={1}
            textWidth={'100%'}
            fontSize={wp(3.7)}
            // color={mobilePaymentCompany.text === '' ? 'black' : 'black'}
            // backgroundColor={
            //   mobilePaymentCompany.text === ''
            //     ? 'transparent'
            //     : Colors.whiteColor
            // }
            // arrowColor={'white'}
            onPress={() => {
              // changeMobilePaymentTabType('company');
              // changeMobileBillModalState(true);
            }}
          />
          <TabNavigator
            tabHeading={'Payment Type'}
            text={
              mobilePaymentType === ''
                ? 'Select Payment Type'
                : mobilePaymentType.text
            }
            navigation={props.navigation}
            border={true}
            width={'90%'}
            multipleLines={1}
            textWidth={'100%'}
            fontSize={wp(3.7)}
            // color={mobilePaymentType === '' ? 'black' : 'black'}
            // backgroundColor={
            //   mobilePaymentType.text === '' ? 'transparent' : Colors.whiteColor
            // }
            onPress={() => {
              changeMobilePaymentTabType('payment');
              changeMobileBillModalState(true);
            }}
          />
          <CustomTextField
            placeholder={'Mobile Number'}
            // Textfield_label={'Enter Debit/ATM Card Number'}

            text_input={field_mobilePayment}
            onChangeText={(value) => {
              set_mobilePayment(String(value).replace(/[^0-9]/g, ''));
            }}
            maxLength={11}
            keyboardType="phone-pad"
            width={'90%'}
          />
          <View style={styles.marginvertical3}>
            <CustomBtn
              btn_txt={'Continue'}
              onPress={() => {
                logs.log('=========>Raffay');
                if (Object.keys(mobilePaymentCompany).length === 0) {
                  setMobilePayError('Utility Company not Selected.');
                  setTimeout(() => {
                    changeMobilePaymentAlertState(true);
                  }, 200);
                } else if (mobilePaymentType.length === 0) {
                  setMobilePayError('Payment type not selected.');
                  setTimeout(() => {
                    changeMobilePaymentAlertState(true);
                  }, 200);
                } else if (
                  field_mobilePayment.length == 11 &&
                  mobilePaymentType.text != '' &&
                  mobilePaymentCompany.text != ''
                ) {
                  logs.log(
                    '=======>mobilePaymentType.text',
                    mobilePaymentType.length,
                  );
                  const ucid =
                    mobilePaymentType.text === 'Prepaid' ? '01' : '02';
                  dispatch(
                    title_benef(
                      props.navigation,
                      field_mobilePayment,
                      'BillPayment',
                      props.route.params.benefType,
                      mobilePaymentCompany.code + ucid,
                      mobilePaymentCompany.text,
                      props.route.params?.data,
                    ),
                  );
                } else {
                  setMobilePayError('Invalid Mobile Number.');
                  setTimeout(() => {
                    changeMobilePaymentAlertState(true);
                  }, 200);
                }
              }}
              btn_width={wp(90)}
              backgroundColor={Colors.primary_green}
            />
          </View>
          <CustomAlert
            overlay_state={mobilePaymentAlertState}
            onPressCancel={() => {
              changeMobilePaymentAlertState(false);
            }}
            iscancelbtn={false}
            onPressOkay={() => {
              // changeAppeaedOnceState(false);
              changeMobilePaymentAlertState(false);
            }}
            title={'Add Beneficiary'}
            alert_text={mobilePayError}
          />
          <CustomModal
            visible={mobileBillModalState}
            headtext={'Please Select Option Below'}
            data={
              mobilePaymentTabType === 'payment'
                ? PaymentType
                : MobilePhoneCompanyData
            }
            onPress_item={(param) => {
              mobilePaymentTabType === 'payment'
                ? changeMobilePaymentType(param)
                : changeMobilePaymentCompany(param);

              changeMobileBillModalState(false);
              // currentModal === 'others' ? changePurposeOfPayment(param) : null;
              // changeModalState(!showModalState);
              // currentModal === 'transferTo'
              //   ? changeTransferFundModalState(true)
              //   : null;
            }}
            onCancel={() => changeMobileBillModalState(false)}
          />
        </View>
      ) : props.route.params?.data === 'internetBillPayment' ? (
        <View style={{flex: 1}}>
          <TabNavigator
            tabHeading={'Company Name'}
            text={
              internetCompany === ''
                ? 'Select Company Name'
                : internetCompany.text
            }
            navigation={props.navigation}
            border={true}
            width={'90%'}
            multipleLines={1}
            textWidth={'100%'}
            fontSize={wp(3.7)}
            // color={internetCompany.text === '' ? 'black' : 'black'}
            // backgroundColor={
            //   internetCompany.text === '' ? 'transparent' : Colors.whiteColor
            // }
            // arrowColor={'white'}
            onPress={() => {
              // changeInternetCompanyModal(true);
            }}
          />
          <CustomTextField
            onChangeText={(value) => {
              'Card number :';
              set_internet_bill(value);
            }}
            // keyboardType="phone-pad"
            placeholder={'Consumer Number'}
            width={'90%'}
            maxLength={30}
          />
          <View style={styles.marginvertical3}>
            <CustomBtn
              btn_txt={'Submit'}
              onPress={() => {
                if (
                  field_internet_bill != '' &&
                  Object.keys(internetCompany).length !== 0 &&
                  internetCompany.text != ''
                ) {
                  dispatch(
                    title_benef(
                      props.navigation,
                      field_internet_bill,
                      'BillPayment',
                      props.route.params.benefType,
                      internetCompany.code,
                      internetCompany.text,
                    ),
                  );
                } else {
                  changeInternetCompanyAlert(true);
                }
              }}
              btn_width={wp(90)}
              backgroundColor={Colors.primary_green}
            />
          </View>

          <CustomAlert
            overlay_state={showInternetCompanyAlert}
            onPressCancel={() => {
              changeInternetCompanyAlert(false);
            }}
            iscancelbtn={false}
            onPressOkay={() => {
              // changeAppeaedOnceState(false);
              changeInternetCompanyAlert(false);
            }}
            title={'Add Beneficiary'}
            alert_text={'Invalid Consumer Number.'}
          />
          <CustomModal
            visible={showInternetCompanyModal}
            headtext={'Please Select Option Below'}
            data={InternetCompanies}
            onPress_item={(param) => {
              changeInternetCompany(param);

              changeInternetCompanyModal(false);
              // currentModal === 'others' ? changePurposeOfPayment(param) : null;
              // changeModalState(!showModalState);
              // currentModal === 'transferTo'
              //   ? changeTransferFundModalState(true)
              //   : null;
            }}
            onCancel={() => changeInternetCompanyModal(false)}
          />
        </View>
      ) : props.route.params?.data === 'educationPayment' ? (
        <View style={{flex: 1}}>
          <TabNavigator
            tabHeading={'Company Name'}
            text={
              educationalInstitution === ''
                ? 'Select Company'
                : educationalInstitution.text
            }
            navigation={props.navigation}
            border={true}
            width={'90%'}
            multipleLines={1}
            textWidth={'100%'}
            fontSize={wp(3.7)}
            // color={educationalInstitution.text === '' ? 'black' : 'black'}
            // backgroundColor={
            //   educationalInstitution.text === ''
            //     ? 'transparent'
            //     : Colors.whiteColor
            // }
            // arrowColor={'white'}
            onPress={() => {
              // changeEducationalInstitutionalModal(true);
            }}
          />
          <CustomTextField
            placeholder={'Consumer Number'}
            // Textfield_label={'Enter Debit/ATM Card Number'}
            onChangeText={(value) => {
              'Card number :';
              set_education_pay(value);
            }}
            // keyboardType="number-pad"
            width={'90%'}
            maxLength={30}
          />
          <View style={styles.marginvertical3}>
            <CustomBtn
              btn_txt={'Continue'}
              onPress={() => {
                if (
                  field_education_pay != '' &&
                  Object.keys(educationalInstitution).length !== 0 &&
                  educationalInstitution.text != ''
                ) {
                  dispatch(
                    title_benef(
                      props.navigation,
                      field_education_pay,
                      props.route.params.data,
                      props.route.params.benefType,
                      educationalInstitution.code,
                      educationalInstitution.text,
                    ),
                  );
                } else {
                  changeEducationalInstitutionalAlert(true);
                }
              }}
              btn_width={wp(90)}
              backgroundColor={Colors.primary_green}
            />
          </View>

          <CustomAlert
            overlay_state={showEducationalInstitutionAlert}
            onPressCancel={() => {
              changeEducationalInstitutionalAlert(false);
            }}
            iscancelbtn={false}
            onPressOkay={() => {
              // changeAppeaedOnceState(false);
              changeEducationalInstitutionalAlert(false);
            }}
            title={'Add Beneficiary'}
            alert_text={'Invalid Consumer Number.'}
          />
          <CustomModal
            visible={showEducationalInstitutionalModal}
            headtext={'Please Select Option Below'}
            data={EducationInstitutions}
            onPress_item={(param) => {
              changeEducationInstition(param);

              changeEducationalInstitutionalModal(false);
              // currentModal === 'others' ? changePurposeOfPayment(param) : null;
              // changeModalState(!showModalState);
              // currentModal === 'transferTo'
              //   ? changeTransferFundModalState(true)
              //   : null;
            }}
            onCancel={() => changeInternetCompanyModal(false)}
          />
        </View>
      ) : props.route.params?.data === 'insurancePayment' ? (
        <View style={{flex: 1}}>
          {/* <TabNavigator
            tabHeading={'Transaction Type'}
            text={'Insurance Payment'}
            border={true}
            // accessibilityLabel={tab_from_acc.account}
            navigation={props.navigation}
            width={'90%'}
            fontSize={wp(4.2)}
            textWidth={'100%'}
            arrowColor={Colors.whiteColor}
            arrowSize={wp(9)}
            multipleLines={2}
            onPress={() => {}}
          /> */}
          <TabNavigator
            tabHeading={'Company'}
            text={
              insuranceCompany === '' ? 'Select Company' : insuranceCompany.text
            }
            navigation={props.navigation}
            border={true}
            width={'90%'}
            multipleLines={1}
            textWidth={'100%'}
            fontSize={wp(3.7)}
            // color={insuranceCompany.text === '' ? 'black' : 'black'}
            // backgroundColor={
            //   insuranceCompany.text === '' ? 'transparent' : Colors.whiteColor
            // }
            // arrowColor={'white'}
            onPress={() => {
              // changeInsuranceCompanyModal(true);
            }}
          />
          <CustomTextField
            placeholder={'Consumer Number'}
            // Textfield_label={'Enter Debit/ATM Card Number'}
            onChangeText={(value) => {
              'Card number :';

              set_insurance(value);
            }}
            // keyboardType="number-pad"
            width={'90%'}
            maxLength={30}
          />
          <View style={styles.marginvertical3}>
            <CustomBtn
              btn_txt={'Continue'}
              onPress={() => {
                if (
                  field_insurance != '' &&
                  Object.keys(insuranceCompany).length !== 0 &&
                  insuranceCompany.text != ''
                ) {
                  dispatch(
                    title_benef(
                      props.navigation,
                      field_insurance,
                      props.route.params.data,
                      props.route.params.benefType,
                      insuranceCompany.code,
                      insuranceCompany.text,
                    ),
                  );
                } else {
                  changeInsuranceCompanyAlert(true);
                }
              }}
              btn_width={wp(90)}
              backgroundColor={Colors.primary_green}
            />
          </View>

          <CustomAlert
            overlay_state={showInsuranceCompanyAlert}
            onPressCancel={() => {
              changeInsuranceCompanyAlert(false);
            }}
            iscancelbtn={false}
            onPressOkay={() => {
              // changeAppeaedOnceState(false);
              changeInsuranceCompanyAlert(false);
            }}
            title={'Add Beneficiary'}
            alert_text={'Invalid Consumer Number.'}
          />
          <CustomModal
            visible={showInsuranceCompanyModal}
            headtext={'Please Select Option Below'}
            data={InsuranceCompanies}
            onPress_item={(param) => {
              changeInsuranceCompany(param);

              changeInsuranceCompanyModal(false);
              // currentModal === 'others' ? changePurposeOfPayment(param) : null;
              // changeModalState(!showModalState);
              // currentModal === 'transferTo'
              //   ? changeTransferFundModalState(true)
              //   : null;
            }}
            onCancel={() => changeInsuranceCompanyModal(false)}
          />
        </View>
      ) : props.route.params?.data === 'onlineShopping' ? (
        <View style={{flex: 1}}>
          {/* <TabNavigator
            tabHeading={'Transaction Type'}
            text={'Online Shopping Payment'}
            border={true}
            // accessibilityLabel={tab_from_acc.account}
            navigation={props.navigation}
            width={'90%'}
            fontSize={wp(4.2)}
            textWidth={'100%'}
            arrowColor={Colors.whiteColor}
            arrowSize={wp(9)}
            multipleLines={2}
            onPress={() => {}}
          /> */}

          <TabNavigator
            tabHeading={'Company'}
            text={
              onlineShopping === '' ? 'Select Company' : onlineShopping.text
            }
            navigation={props.navigation}
            border={true}
            width={'90%'}
            multipleLines={1}
            textWidth={'100%'}
            fontSize={wp(3.7)}
            // color={onlineShopping.text === '' ? 'black' : 'black'}
            // backgroundColor={
            //   onlineShopping.text === '' ? 'transparent' : Colors.whiteColor
            // }
            // arrowColor={'white'}
            onPress={() => {
              // changeOnlineShoppingModal(true);
            }}
          />
          <CustomTextField
            placeholder={'Consumer Number'}
            // Textfield_label={'Enter Debit/ATM Card Number'}
            onChangeText={(value) => {
              'Card number :';
              set_online_shop(value);
            }}
            // keyboardType="number-pad"
            width={'90%'}
            maxLength={30}
          />
          <View style={styles.marginvertical3}>
            <CustomBtn
              btn_txt={'Continue'}
              onPress={() => {
                if (
                  field_online_shop != '' &&
                  Object.keys(onlineShopping).length !== 0 &&
                  onlineShopping.text != ''
                ) {
                  dispatch(
                    title_benef(
                      props.navigation,
                      field_online_shop,
                      props.route.params.data,
                      props.route.params.benefType,
                      onlineShopping.code,
                      onlineShopping.text,
                    ),
                  );
                } else {
                  changeOnlineShoppingAlert(true);
                }
              }}
              btn_width={wp(90)}
              backgroundColor={Colors.primary_green}
            />
          </View>

          <CustomAlert
            overlay_state={showOnlineShoppingAlert}
            onPressCancel={() => {
              changeOnlineShoppingAlert(false);
            }}
            iscancelbtn={false}
            onPressOkay={() => {
              // changeAppeaedOnceState(false);
              changeOnlineShoppingAlert(false);
            }}
            title={'Add Beneficiary'}
            alert_text={'Invalid Consumer Number.'}
          />
          <CustomModal
            visible={showOnlineShoppingModal}
            headtext={'Please Select Option Below'}
            data={OnlineShoppingLocations}
            onPress_item={(param) => {
              changeOnlineShopping(param);

              changeOnlineShoppingModal(false);
            }}
            onCancel={() => changeOnlineShoppingModal(false)}
          />
        </View>
      ) : props.route.params?.data === 'investment' ? (
        <View style={{flex: 1}}>
          {/* <TabNavigator
            tabHeading={'Transaction Type'}
            text={'Investment'}
            border={true}
            // accessibilityLabel={tab_from_acc.account}
            navigation={props.navigation}
            width={'90%'}
            fontSize={wp(4.2)}
            textWidth={'100%'}
            arrowColor={Colors.whiteColor}
            arrowSize={wp(9)}
            multipleLines={2}
            onPress={() => {}}
          /> */}
          <TabNavigator
            tabHeading={'Company'}
            text={investments === '' ? 'Select Company' : investments.text}
            navigation={props.navigation}
            border={true}
            width={'90%'}
            multipleLines={1}
            textWidth={'100%'}
            fontSize={wp(3.7)}
            // color={investments === '' ? 'black' : 'black'}
            // backgroundColor={
            //   investments === '' ? 'transparent' : Colors.whiteColor
            // }
            // arrowColor={'white'}
            onPress={() => {
              // changeInvestmentModal(true);
            }}
          />
          <CustomTextField
            placeholder={'Consumer Number'}
            // Textfield_label={'Enter Debit/ATM Card Number'}
            onChangeText={(value) => {
              set_investment(value);
              ('Card number :');
            }}
            // keyboardType="number-pad"
            maxLength={30}
            width={'90%'}
          />
          <View style={styles.marginvertical3}>
            <CustomBtn
              btn_txt={'Continue'}
              onPress={() => {
                if (
                  field_investment != '' &&
                  Object.keys(investments).length !== 0 &&
                  investments.text != ''
                ) {
                  dispatch(
                    title_benef(
                      props.navigation,
                      field_investment,
                      props.route.params.data,
                      props.route.params.benefType,
                      investments.code,
                      investments.text,
                    ),
                  );
                } else {
                  changeInvestmentsAlert(true);
                }
              }}
              btn_width={wp(90)}
              backgroundColor={Colors.primary_green}
            />
          </View>

          <CustomAlert
            overlay_state={showInvestmentsAlert}
            onPressCancel={() => {
              changeInvestmentsAlert(false);
            }}
            iscancelbtn={false}
            onPressOkay={() => {
              // changeAppeaedOnceState(false);
              changeInvestmentsAlert(false);
            }}
            title={'Add Beneficiary'}
            alert_text={'Invalid Consumer Number.'}
          />
          <CustomModal
            visible={showInvestmentModal}
            headtext={'Please Select Option Below'}
            data={InvestmentCompanies}
            onPress_item={(param) => {
              changeInvestments(param);

              changeInvestmentModal(false);
            }}
            onCancel={() => changeInvestmentModal(false)}
          />
        </View>
      ) : props.route.params?.data === 'governmentPayments' ? (
        <View style={{flex: 1}}>
          {/* <CustomText style={styles.labelViewText}>
            Government Payments
          </CustomText> */}
          <TabNavigator
            text={
              governmentDepartment === ''
                ? 'Select Company'
                : governmentDepartment.text
            }
            tabHeading={'Company Name'}
            navigation={props.navigation}
            border={true}
            width={'90%'}
            multipleLines={1}
            textWidth={'100%'}
            fontSize={wp(3.7)}
            // color={governmentDepartment.text === '' ? 'black' : 'black'}
            // backgroundColor={
            //   governmentDepartment.text === ''
            //     ? 'transparent'
            //     : Colors.whiteColor
            // }
            // arrowColor={'white'}
            onPress={() => {
              // changeGovernmentPayModal(true);
            }}
          />
          <CustomTextField
            placeholder={'Consumer Number'}
            // Textfield_label={'Enter Debit/ATM Card Number'}
            onChangeText={(value) => {
              set_govt_pay(value);
              ('Card number :');
            }}
            // keyboardType="number-pad"
            maxLength={30}
            width={'90%'}
          />
          <View style={styles.marginvertical3}>
            <CustomBtn
              btn_txt={'Continue'}
              onPress={() => {
                if (
                  field_govt_pay != '' &&
                  Object.keys(governmentDepartment).length !== 0 &&
                  governmentDepartment.text != ''
                ) {
                  dispatch(
                    title_benef(
                      props.navigation,
                      field_govt_pay,
                      props.route.params.data,
                      props.route.params.benefType,
                      governmentDepartment.code,
                      governmentDepartment.text,
                    ),
                  );
                } else {
                  changeGovernmentPayAlert(true);
                }
              }}
              btn_width={wp(90)}
              backgroundColor={Colors.primary_green}
            />
          </View>

          <CustomAlert
            overlay_state={showGovernmentPayAlert}
            onPressCancel={() => {
              changeGovernmentPayAlert(false);
            }}
            iscancelbtn={false}
            onPressOkay={() => {
              // changeAppeaedOnceState(false);
              changeGovernmentPayAlert(false);
            }}
            title={'Add Beneficiary'}
            alert_text={'Invalid Consumer Number.'}
          />
          <CustomModal
            visible={showGovernmentPayModal}
            headtext={'Please Select Option Below'}
            data={GovernmentDepartments}
            onPress_item={(param) => {
              changeGovernmentDepartment(param);

              changeGovernmentPayModal(false);
            }}
            onCancel={() => changeGovernmentPayModal(false)}
          />
        </View>
      ) : props.route.params?.data === 'creditCardBills' ? (
        <View style={{flex: 1}}>
          <View style={{height: wp(2)}} />
          <CustomTextField
            placeholder={'Credit Card Number'}
            // Textfield_label={'Enter Debit/ATM Card Number'}
            text_input={field_credit_card}
            onChangeText={(value) => {
              set_credit_card(String(value).replace(/[^0-9]/g, ''));
              ('Card number :');
            }}
            keyboardType="number-pad"
            maxLength={24}
            width={'90%'}
          />
          <View style={styles.marginvertical3}>
            <CustomBtn
              btn_txt={'Continue'}
              onPress={() => {
                if (field_credit_card != '') {
                  dispatch(
                    title_benef(
                      props.navigation,
                      field_credit_card,
                      props.route.params.data,
                      props.route.params.benefType,
                      'CC01BILL',
                      'Credit Card Bills',
                    ),
                  );
                } else {
                  change1BillCreditCardAlert(true);
                }
              }}
              btn_width={wp(90)}
              backgroundColor={Colors.primary_green}
            />
          </View>
          <CustomAlert
            overlay_state={show1BillCreditCardAlert}
            onPressCancel={() => {
              change1BillCreditCardAlert(false);
            }}
            iscancelbtn={false}
            onPressOkay={() => {
              // changeAppeaedOnceState(false);
              change1BillCreditCardAlert(false);
            }}
            title={'Add Beneficiary'}
            alert_text={'Invalid Credit Card Number.'}
          />
        </View>
      ) : props.route.params?.data === 'topUp' ? (
        <View style={{flex: 1}}>
          <View style={{height: wp(2)}} />
          <CustomTextField
            placeholder={'Mobile Number'}
            text_input={field_top_up}
            onChangeText={(value) => {
              set_topup(String(value).replace(/[^0-9]/g, ''));
            }}
            maxLength={11}
            width={'90%'}
            keyboardType="phone-pad"
          />
          <View style={styles.marginvertical3}>
            <CustomBtn
              btn_txt={'Continue'}
              onPress={() => {
                if (field_top_up.length == 11) {
                  dispatch(
                    title_benef(
                      props.navigation,
                      field_top_up,
                      props.route.params.data,
                      props.route.params.benefType,
                      'TP01BILL',
                      'TOP UP',
                    ),
                  );
                } else {
                  changeTopUpAlert(true);
                }
              }}
              btn_width={wp(90)}
              backgroundColor={Colors.primary_green}
            />
          </View>
          <CustomAlert
            overlay_state={showTopUpAlert}
            onPressCancel={() => {
              changeTopUpAlert(false);
            }}
            iscancelbtn={false}
            onPressOkay={() => {
              // changeAppeaedOnceState(false);
              changeTopUpAlert(false);
            }}
            title={'Add Beneficiary'}
            alert_text={'Invalid Mobile Number.'}
          />
        </View>
      ) : props.route.params?.data === 'voucherPayment' ? (
        <View style={{flex: 1}}>
          {/* <CustomText style={styles.labelViewText}>
            1Bill-Voucher/Fee Payment
          </CustomText>
          <View style={{height: wp(2)}} />
          <CustomText style={styles.labelViewText}>
            Voucher Fee Payment
          </CustomText> */}
          <View style={{height: wp(2)}} />
          <CustomTextField
            placeholder={'Account Number'}
            // Textfield_label={'Enter Debit/ATM Card Number'}
            text_input={field_fee_pay}
            onChangeText={(value) => {
              set_fee_pay(String(value).replace(/[^0-9]/g, ''));
            }}
            keyboardType="number-pad"
            maxLength={24}
            width={'90%'}
          />
          <View style={styles.marginvertical3}>
            <CustomBtn
              btn_txt={'Continue'}
              onPress={() => {
                if (field_fee_pay != '') {
                  dispatch(
                    title_benef(
                      props.navigation,
                      field_fee_pay,
                      props.route.params.data,
                      props.route.params.benefType,
                      'IN01BILL',
                      'Voucher Fee Payment',
                    ),
                  );
                } else {
                  changeVoucherFeePayment(true);
                }
              }}
              btn_width={wp(90)}
              backgroundColor={Colors.primary_green}
            />
          </View>
          <CustomAlert
            overlay_state={showVoucherFeePayment}
            onPressCancel={() => {
              changeVoucherFeePayment(false);
            }}
            iscancelbtn={false}
            onPressOkay={() => {
              changeVoucherFeePayment(false);
            }}
            title={'Add Beneficiary'}
            alert_text={'Invalid Account Number.'}
          />
        </View>
      ) : props.route.params?.data === 'others' ? (
        <View style={{flex: 1}}>
          <TabNavigator
            text={
              otherPaymentMethod === ''
                ? 'Select Company'
                : otherPaymentMethod.text
            }
            navigation={props.navigation}
            border={true}
            width={'90%'}
            multipleLines={1}
            textWidth={'88%'}
            tabHeading={'Company'}
            fontSize={wp(3.7)}
            // color={otherPaymentMethod.text === '' ? 'black' : 'black'}
            // backgroundColor={
            //   otherPaymentMethod.text === '' ? 'transparent' : Colors.whiteColor
            // }
            // arrowColor={'white'}
            onPress={() => {
              // changeOtherPaymentModal(true);
            }}
          />
          <CustomTextField
            placeholder={'Consumer Number'}
            onChangeText={(value) => {
              set_other(value);
              ('Card number :');
            }}
            // keyboardType="number-pad"
            maxLength={30}
            width={'90%'}
          />
          <View style={styles.marginvertical3}>
            <CustomBtn
              btn_txt={'Continue'}
              onPress={() => {
                if (
                  field_other != '' &&
                  Object.keys(otherPaymentMethod).length !== 0 &&
                  otherPaymentMethod.text != ''
                ) {
                  dispatch(
                    title_benef(
                      props.navigation,
                      field_other,
                      props.route.params.data,
                      props.route.params.benefType,
                      otherPaymentMethod.code,
                      otherPaymentMethod.text,
                    ),
                  );
                } else {
                  changeOtherPaymentAlert(true);
                }
              }}
              btn_width={wp(90)}
              backgroundColor={Colors.primary_green}
            />
          </View>

          <CustomAlert
            overlay_state={showOtherPaymentAlert}
            onPressCancel={() => {
              changeOtherPaymentAlert(false);
            }}
            iscancelbtn={false}
            onPressOkay={() => {
              // changeAppeaedOnceState(false);
              changeOtherPaymentAlert(false);
            }}
            title={'Add Beneficiary'}
            alert_text={'Invalid Consumer Number.'}
          />
          <CustomModal
            visible={showOtherPaymentModal}
            headtext={'Please Select Option Below'}
            data={OtherPayments}
            onPress_item={(param) => {
              changeOtherPaymentMethod(param);

              changeOtherPaymentModal(false);
            }}
            onCancel={() => changeOtherPaymentModal(false)}
          />
        </View>
      ) : null}

      <CustomAlert
        overlay_state={showAlert}
        onPressCancel={() => {
          changeAlertState(false);
        }}
        iscancelbtn={false}
        onPressOkay={() => {
          // changeAppeaedOnceState(false);
          changeAlertState(false);
        }}
        title={'Add Beneficiary'}
        alert_text={'Invalid Account Number.'}
      />
      {checkCard ? (
        <CustomAlert
          overlay_state={showImageAlert}
          nationalBankAccountNumberPolicy={true}
          title={'National Bank Account Number Policy'}
          onPressCancel={() => changeImageAlertStatus(false)}
          noTitle={true}
        />
      ) : (
        <CustomAlert
          overlay_state={showImageAlert}
          nationalBankIBANPolicy={true}
          title={'National Bank IBAN Policy'}
          noTitle={true}
          onPressCancel={() => changeImageAlertStatus(false)}
        />
      )}
    </KeyboardAvoidingView>
  );
});
export default BeneficiaryTransaction;
