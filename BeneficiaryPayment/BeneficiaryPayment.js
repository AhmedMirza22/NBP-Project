import React from 'react';
import {
  View,
  Dimensions,
  Text,
  SectionList,
  Image,
  TextInput,
  TouchableOpacity,
} from 'react-native';
import SubHeader from '../../Components/GlobalHeader/SubHeader/SubHeader';
import {paymentsData} from './Data';
import styles from './BeneficiaryPaymentStyling';
import {connect, useDispatch} from 'react-redux';
import {bindActionCreators} from 'redux';
import * as reduxActions from '../../Redux/Action/Action';
import {logs, Config} from '../../Config/Config';
import {globalStyling, hp} from '../../Constant';
import {Colors, Images} from '../../Theme';
import CustomText from '../../Components/CustomText/CustomText';
import Icon from 'react-native-vector-icons/Ionicons';
import CustomBtn from '../../Components/Custom_btn/Custom_btn';
import {log} from 'react-native-reanimated';
import {fontFamily} from '../../Theme/Fonts';
import store from '../../Redux/Store/Store';
import axios from 'axios';
import * as actionTypes from '../../Redux/Action/types';
import {Service, getTokenCall} from '../../Config/Service';
import I18n from '../../Config/Language/LocalizeLanguageString';
import {isRtlState} from '../../Config/Language/LanguagesArray';
import InformationIcon from '../../Components/InformationIcon/InformationIcon';
import {TouchableWithoutFeedback} from 'react-native-gesture-handler';
import IonIcons from 'react-native-vector-icons/Ionicons';

const screenWidth = Dimensions.get('window').width;
function wp(percentage) {
  const value = (percentage * screenWidth) / 100;
  return Math.round(value);
}

class BeneficiaryPayment extends React.PureComponent {
  state = {
    loader: false,
    data: [],
    searchText: '',
    filteredData: [],
    searchedData: [],
  };

  GetBankListCallApiOnce = () => {
    logs.log('GetBankListCallApiOnce Function====>');
    const {reduxState} = this.props;
    if (reduxState.bankList.length == 0) {
      logs.log('If Case ================>');
      this.props.reduxActions.gettransferbanklist(
        this.props.navigation,
        (banks) => {
          let tempBank = banks.banks;
          tempBank.unshift({
            bankName: 'National Bank of Pakistan',
            imd: '123456',
            abbreviation: 'NBP',
            accountFormat: 'Enter the 14 digit account number',
          });

          const mobileTopUpLimits = store.getState().reducers.mobileTopUpLimits;
          if (Object.keys(mobileTopUpLimits).length === 0) {
            this.getMobileTopUp();
          } else {
            this.getMobileTopUp();
          }
        },
      );
    } else {
      logs.log('else Case ================>');
      const mobileTopUpLimits = store.getState().reducers.mobileTopUpLimits;
      if (Object.keys(mobileTopUpLimits).length === 0) {
        this.getMobileTopUp();
      } else {
        this.props.navigation.navigate('PaymentsBeneficiary', {
          BenefPay: true,
        });
      }
    }
  };
  filterByImd = (ResponsecObeject, bankList, benefID) => {
    const {reduxState} = this.props;
    // The filter method returns a new array containing all elements that match the condition
    const bankData = bankList.filter(
      (bank) => bank.participantCode === ResponsecObeject?.imd,
    );
    logs.log('---------->', bankData[0]?.name);
    this.props.reduxActions.setUserObject({
      ftPayment: {
        benefAlias: ResponsecObeject?.benefAlias,
        isDirectPayment: false,
        isPayBenef: true,
        benefEmail: ResponsecObeject?.benefEmail,
        benefPhone: ResponsecObeject?.benefMobile,
        benefMobile: ResponsecObeject?.benefMobile,
        tfenable: benefID == 18 ? true : false,
        benefAccount: ResponsecObeject?.benefAccount,
        memberId: ResponsecObeject?.imd,
        bankName: bankData[0]?.name,
        benefID: benefID,
      },
    });

    this.props?.navigation.navigate('InterBankFundsTransfer');
  };

  getMerchantNotification = async (ResponsecObeject, beneID) => {
    const {reduxState} = this.props;
    // logs.log(reduxState.bankList, '---------reduxState.bankList');
    if (reduxState.bankList.length === 0) {
      try {
        this.props.reduxActions.setLoader(true);

        const response = await getTokenCall(Service.getallbanks);
        const responseData = response.data;
        console.log('response---->', responseData);

        if (
          responseData.responseCode === '00' ||
          responseData.responseCode === '200'
        ) {
          this.props.reduxActions.updateSessionToken(response);
          this.props.reduxActions.setLoader(false);
          let tempBank = responseData?.data || [];
          this.props.reduxActions.setRaastList(tempBank);
          this.filterByImd(ResponsecObeject, tempBank, beneID);
        } else {
          this.props.reduxActions.serviceResponseCheck(
            response,
            this.props.navigation,
          );
          this.props.reduxActions.setLoader(false);
        }
      } catch (error) {
        this.props.reduxActions.setLoader(false);
        this.props.reduxActions.catchError(error);
      }
    } else {
      logs.log('19283901823');
      this.filterByImd(ResponsecObeject, reduxState.bankList, beneID);
    }
  };

  getMobileTopUp = async () => {
    logs.log('From BeneficiaryPayment ================>');

    // axios
    //   .get(
    //     `${Config.base_url.UAT_URL}${Config.method.bill}/${Config.endpoint.mobileLimits}`,
    //     {
    //       headers: {
    //         'X-Auth-Token': this.props.reduxState.token,
    //       },
    //     },
    //   )
    try {
      this.props.reduxActions.setLoader(true);
      const response = await getTokenCall(Service.getMobileList);
      if (response.data.responseCode === '00') {
        this.props.reduxActions.updateSessionToken(response);
        this.props.reduxActions.setLoader(false);
        this.props.reduxActions.setMobileTopUpLimits(response.data.data.limits);
        this.props.navigation.navigate('PaymentsBeneficiary', {
          BenefPay: true,
        });
      } else {
        this.props.reduxActions.serviceResponseCheck(
          response,
          this.props.navigation,
        );
      }
    } catch (error) {
      this.props.reduxActions.catchError(error);
    }
  };

  SetScreenRouter = (benefType, ResponsecObeject) => {
    switch (benefType) {
      ///FT///

      case 1:
        {
          logs.log(ResponsecObeject);
          this.props.reduxActions.setUserObject({
            ftPayment: {
              ...store.getState().reducers.userObject.ftPayment,
              benefId: ResponsecObeject?.benefID,
              toAccount: ResponsecObeject?.benefAccount,
              shortName: ResponsecObeject?.benefAlias,
              benefEmail: ResponsecObeject?.benefEmail,
              benefPhone: ResponsecObeject?.benefMobile,
              benefType: ResponsecObeject?.benefType,
              imd: ResponsecObeject?.imd,
              companyName: ResponsecObeject?.companyName,
              isDirectPayment: false,
              benefTrans: true,
              // accountTitle: data?.title,
              // date: data?.date,
            },
          });

          this.props?.navigation.navigate('FundsTransfer');

          // this.props.reduxActions.getFundsTransferData(
          //   this.props.reduxState.token,
          //   this.props.navigation,
          //   true,
          //   ResponsecObeject,
          //   () => {},
          // );
        }
        break;

      ///IBFT///
      case 2:
        {
          logs.log('ResponsecObeject : ', ResponsecObeject);
          this.props.reduxActions.setUserObject({
            ftPayment: {
              benefAlias: ResponsecObeject?.benefAlias,
              bankName: ResponsecObeject?.companyName,
              isDirectPayment: false,
              bankName: ResponsecObeject?.companyName,
              isPayBenef: true,
              benefEmail: ResponsecObeject?.benefEmail,
              benefPhone: ResponsecObeject?.benefMobile,
              benefMobile: ResponsecObeject?.benefMobile,
              tfenable: false,
              benefAccount: ResponsecObeject?.benefAccount,
              imd: ResponsecObeject?.imd,
            },
          });
          this.props?.navigation.navigate('InterBankFundsTransfer');

          // this.props.reduxActions.getInterBankFundTransferData(
          //   this.props.reduxState.token,
          //   this.props.navigation,
          //   false,
          //   true,
          //   ResponsecObeject,
          //   () => {},
          // );
        }
        break;

      //Utility Bill Payment///
      case 3:
        {
          logs.log('util', ResponsecObeject);
          // ResponsecObeject.benefEmail = email;
          // ResponsecObeject.benefMobile = phone;
          this.props.reduxActions.utilityBillRequest(
            this.props.reduxState.token,
            this.props.navigation,
            '',
            true,
            ResponsecObeject,
          );
        }
        break;
      case 4:
        {
          this.props.reduxActions.mobileTopUp(
            this.props.reduxState.token,
            this.props.navigation,
            true,
            ResponsecObeject,
          );
        }
        break;
      //Internet Bill Payment///
      case 5:
        {
          this.props.reduxActions.setUserObject({
            otherPayment: {
              benefId: ResponsecObeject?.benefID,
              consumerNumber: ResponsecObeject?.benefAccount,
              shortName: ResponsecObeject?.benefAlias,
              benefEmail: ResponsecObeject?.benefEmail,
              benefPhone: ResponsecObeject?.benefMobile,
              benefType: ResponsecObeject?.benefType,
              ucId: ResponsecObeject?.imd,
              companyName: ResponsecObeject?.companyName,
              isDirectPayment: false,
              benefTrans: true,
              // accountTitle: data?.title,
              // date: data?.date,
            },
          });
          this.props.navigation.navigate('OtherPaymentService');
        }
        break;
      //Online Shopping///
      case 6:
        {
          this.props.reduxActions.setUserObject({
            otherPayment: {
              benefId: ResponsecObeject?.benefID,
              consumerNumber: ResponsecObeject?.benefAccount,
              shortName: ResponsecObeject?.benefAlias,
              benefEmail: ResponsecObeject?.benefEmail,
              benefPhone: ResponsecObeject?.benefMobile,
              benefType: ResponsecObeject?.benefType,
              ucId: ResponsecObeject?.imd,
              companyName: ResponsecObeject?.companyName,
              isDirectPayment: false,
              benefTrans: true,
              // accountTitle: data?.title,
              // date: data?.date,
            },
          });
          this.props.navigation.navigate('OtherPaymentService');
        }
        break;
      //Insurance Payment///
      case 7:
        {
          this.props.reduxActions.setUserObject({
            otherPayment: {
              benefId: ResponsecObeject?.benefID,
              consumerNumber: ResponsecObeject?.benefAccount,
              shortName: ResponsecObeject?.benefAlias,
              benefEmail: ResponsecObeject?.benefEmail,
              benefPhone: ResponsecObeject?.benefMobile,
              benefType: ResponsecObeject?.benefType,
              ucId: ResponsecObeject?.imd,
              companyName: ResponsecObeject?.companyName,
              isDirectPayment: false,
              benefTrans: true,
              // accountTitle: data?.title,
              // date: data?.date,
            },
          });
          this.props.navigation.navigate('OtherPaymentService');
        }
        break;
      //Education Payment///
      case 8:
        {
          this.props.reduxActions.setUserObject({
            otherPayment: {
              benefId: ResponsecObeject?.benefID,
              consumerNumber: ResponsecObeject?.benefAccount,
              shortName: ResponsecObeject?.benefAlias,
              benefEmail: ResponsecObeject?.benefEmail,
              benefPhone: ResponsecObeject?.benefMobile,
              benefType: ResponsecObeject?.benefType,
              ucId: ResponsecObeject?.imd,
              companyName: ResponsecObeject?.companyName,
              isDirectPayment: false,
              benefTrans: true,
              // accountTitle: data?.title,
              // date: data?.date,
            },
          });
          this.props.navigation.navigate('OtherPaymentService');
        }
        break;
      //Investments///
      case 9:
        {
          this.props.reduxActions.setUserObject({
            otherPayment: {
              benefId: ResponsecObeject?.benefID,
              consumerNumber: ResponsecObeject?.benefAccount,
              shortName: ResponsecObeject?.benefAlias,
              benefEmail: ResponsecObeject?.benefEmail,
              benefPhone: ResponsecObeject?.benefMobile,
              benefType: ResponsecObeject?.benefType,
              ucId: ResponsecObeject?.imd,
              companyName: ResponsecObeject?.companyName,
              isDirectPayment: false,
              benefTrans: true,
              // accountTitle: data?.title,
              // date: data?.date,
            },
          });
          this.props.navigation.navigate('OtherPaymentService');
        }
        break;
      //Other///
      // case 10:
      //   {
      //     this.props.reduxActions.getOtherPayments(
      //       this.props.reduxState.token,
      //       this.props.navigation,
      //       {
      //         // data: 'others',
      //         data: 'governmentPayments',

      //       },
      //       10,
      //       true,
      //       ResponsecObeject,
      //     );
      //   }
      //   break;
      case 10:
        {
          this.props.reduxActions.setUserObject({
            otherPayment: {
              benefId: ResponsecObeject?.benefID,
              consumerNumber: ResponsecObeject?.benefAccount,
              shortName: ResponsecObeject?.benefAlias,
              benefEmail: ResponsecObeject?.benefEmail,
              benefPhone: ResponsecObeject?.benefMobile,
              benefType: ResponsecObeject?.benefType,
              ucId: ResponsecObeject?.imd,
              companyName: ResponsecObeject?.companyName,
              isDirectPayment: false,
              benefTrans: true,
              // accountTitle: data?.title,
              // date: data?.date,
            },
          });
          this.props.navigation.navigate('OtherPaymentService');
        }
        break;

      //1 Bill Credit Card Bills///
      case 11:
        {
          logs.log('---------->', JSON.stringify(ResponsecObeject));
          this.props.reduxActions.setUserObject({
            otherPayment: {
              benefId: ResponsecObeject?.benefID,
              consumerNumber: ResponsecObeject?.benefAccount,
              shortName: ResponsecObeject?.benefAlias,
              benefEmail: ResponsecObeject?.benefEmail,
              benefPhone: ResponsecObeject?.benefMobile,
              benefType: ResponsecObeject?.benefType,
              ucId: ResponsecObeject?.imd,
              companyName: ResponsecObeject?.companyName,
              isDirectPayment: false,
              benefTrans: true,
              // accountTitle: data?.title,
              // date: data?.date,
            },
          });
          this.props.navigation.navigate('OtherPaymentService');
          // this.props.reduxActions.getOtherPayments(
          //   this.props.reduxState.token,
          //   this.props.navigation,
          //   {
          //     // data: 'creditCardBills',
          //     data: 'governmentPayments',
          //   },
          //   11,
          //   true,
          //   ResponsecObeject,
          // );
        }
        break;
      case 13:
        {
          this.props.reduxActions.setUserObject({
            otherPayment: {
              benefId: ResponsecObeject?.benefID,
              consumerNumber: ResponsecObeject?.benefAccount,
              shortName: ResponsecObeject?.benefAlias,
              benefEmail: ResponsecObeject?.benefEmail,
              benefPhone: ResponsecObeject?.benefMobile,
              benefType: ResponsecObeject?.benefType,
              ucId: ResponsecObeject?.imd,
              companyName: ResponsecObeject?.companyName,
              isDirectPayment: false,
              benefTrans: true,
              // accountTitle: data?.title,
              // date: data?.date,
            },
          });
          this.props.navigation.navigate('OtherPaymentService');
        }
        break;
      //1 Bill Top Up///
      case 14:
        {
          this.props.reduxActions.setUserObject({
            otherPayment: {
              benefId: ResponsecObeject?.benefID,
              consumerNumber: ResponsecObeject?.benefAccount,
              shortName: ResponsecObeject?.benefAlias,
              benefEmail: ResponsecObeject?.benefEmail,
              benefPhone: ResponsecObeject?.benefMobile,
              benefType: ResponsecObeject?.benefType,
              ucId: ResponsecObeject?.imd,
              companyName: ResponsecObeject?.companyName,
              isDirectPayment: false,
              benefTrans: true,
              // accountTitle: data?.title,
              // date: data?.date,
            },
          });
          this.props.navigation.navigate('OtherPaymentService');
        }
        break;
      ///1 Bill Voucher/ Fee Payment///
      case 15:
        {
          this.props.reduxActions.setUserObject({
            otherPayment: {
              benefId: ResponsecObeject?.benefID,
              consumerNumber: ResponsecObeject?.benefAccount,
              shortName: ResponsecObeject?.benefAlias,
              benefEmail: ResponsecObeject?.benefEmail,
              benefPhone: ResponsecObeject?.benefMobile,
              benefType: ResponsecObeject?.benefType,
              ucId: ResponsecObeject?.imd,
              companyName: ResponsecObeject?.companyName,
              isDirectPayment: false,
              benefTrans: true,
              // accountTitle: data?.title,
              // date: data?.date,
            },
          });
          this.props.navigation.navigate('OtherPaymentService');
        }
        break;
      case 16:
        {
          // this.call();
          // this.props.reduxActions.getOtherPayments(
          //   this.props.reduxState.token,
          //   this.props.navigation,
          //   {
          //     data: 'voucherPayment',
          //   },
          //   16,
          //   true,
          //   ResponsecObeject,
          // );
          // // this.props.reduxActions.getpk
          // console.log('asdasd', benefType, '======', ResponsecObeject);
          this.props.reduxActions.getRAASTbenefiData(
            this.props.navigation,
            () => {
              this.props.navigation.navigate('RAASTBenefByAlias', {
                isByAlias: true,
                requiredData: ResponsecObeject,
              });
            },
          );
        }
        break;
      case 17: {
        this.getMerchantNotification(ResponsecObeject, 17);
      }
      case 18:
        {
          this.getMerchantNotification(ResponsecObeject, 18);
        }
        break;
    }
  };
  componentDidMount() {
    logs.log('asdasd========>', this.props.route.params?.data?.beneficiaries);
    let Data = this.props.route.params?.data?.beneficiaries
      ? this.props.route.params?.data?.beneficiaries
      : [];
    const data = Data.sort(function (a, b) {
      var nameA = a.benefAlias.toLowerCase(),
        nameB = b.benefAlias.toLowerCase();
      if (nameA < nameB) return -1;
      if (nameA > nameB) return 1;
      return 0;
    });
    const filteredArray = data.reduce((result, item) => {
      if (
        item.benefType === 1 ||
        item.benefType === 2 ||
        item.benefType === 16 ||
        item.benefType === 17 ||
        item.benefType === 18
      ) {
        // Add to "Transfer" group
        const transferGroup = result.find(
          (group) => group.title === 'Transfer',
        );
        if (transferGroup) {
          transferGroup.data.push(item);
        } else {
          result.push({title: 'Transfer', data: [item]});
        }
      } else if (item.benefType === 3 || item.benefType === 5) {
        // Add to "Bill Payment" group
        const billPaymentGroup = result.find(
          (group) => group.title === 'Bill Payment',
        );
        if (billPaymentGroup) {
          billPaymentGroup.data.push(item);
        } else {
          result.push({title: 'Bill Payment', data: [item]});
        }
      } else if (item.benefType === 4) {
        // Add to "Mobile TopUp" group
        const mobileTopUpGroup = result.find(
          (group) => group.title === 'Mobile TopUp',
        );
        if (mobileTopUpGroup) {
          mobileTopUpGroup.data.push(item);
        } else {
          result.push({title: 'Mobile TopUp', data: [item]});
        }
      } else if (item.benefType === 11) {
        // Add to "Government Payment" group
        const govtPayGroup = result.find(
          (group) => group.title === 'Government Payment',
        );
        if (govtPayGroup) {
          govtPayGroup.data.push(item);
        } else {
          result.push({title: 'Government Payment', data: [item]});
        }
      } else if (item.benefType === 13) {
        // Add to "Credit Card Payment" group
        const CCPayGroup = result.find(
          (group) => group.title === 'Credit Card Payment',
        );
        if (CCPayGroup) {
          CCPayGroup.data.push(item);
        } else {
          result.push({title: 'Credit Card Payment', data: [item]});
        }
      } else {
        const otherGroup = result.find((group) => group.title === 'Others');
        if (otherGroup) {
          otherGroup.data.push(item);
        } else {
          result.push({title: 'Others', data: [item]});
        }
      }
      return result;
    }, []);
    const order = 'tbmgcoadefhijklnpqrsuvwxyz';

    if (
      filteredArray &&
      filteredArray instanceof Array &&
      filteredArray.length > 0
    ) {
      filteredArray.sort((a, b) => {
        const titleA = a?.title?.toLowerCase();
        const titleB = b?.title?.toLowerCase();
        let i = 0;
        while (i < titleA.length && i < titleB.length) {
          const indexA = order.indexOf(titleA.charAt(i));
          const indexB = order.indexOf(titleB.charAt(i));
          if (indexA !== indexB) {
            return indexA - indexB;
          }
          i++;
        }
        return titleA.length - titleB.length;
      });

      this.setState({data: filteredArray, filteredData: filteredArray}, () => {
        logs.log(`data to me : ${JSON.stringify(filteredArray)}`);
      });
      logs.log(
        'Data: ',
        this.state.data,
        'FilterData: ',
        this.state.filteredData,
      );
    }
  }
  render() {
    const renderTransactionRecordFlatlist = ({item, index, separators}) => (
      // console.log('Item after search', item),

      <TouchableOpacity
        onPress={() => {
          this.SetScreenRouter(item.benefType, item);
          logs.log(JSON.stringify(item.benefType), JSON.stringify(item));
        }}
        style={{
          flexDirection: 'row',
          width: wp(90),
          alignSelf: 'center',
          backgroundColor: Colors.subContainer,
          margin: wp(1.5),
          padding: wp(4),
          borderWidth: 0.5,
          borderColor: Colors.textFieldBorderColor,
          borderRadius: wp(1),
          // justifyContent: 'space-between',
        }}>
        <View
          style={{
            // backgroundColor: 'blue',
            width: '15%',
            justifyContent: 'center',
          }}>
          <Image
            source={
              item.benefType == '1'
                ? require('../../Assets/Icons/NewIcons/fund-transfer.png')
                : item.benefType == '2'
                ? require('../../Assets/Icons/NewDrawer/etransactions.png')
                : item.benefType == '3'
                ? require('../../Assets/Icons/NewIcons/utilitybill.png')
                : item.benefType == '4'
                ? require('../../Assets/Icons/NewIcons/mobilebill.png')
                : item.benefType == '5'
                ? require('../../Assets/Icons/NewIcons/internetbill.png')
                : item.benefType == '6'
                ? require('../../Assets/Icons/NewIcons/onlineshopping.png')
                : item.benefType == '7'
                ? require('../../Assets/Icons/NewIcons/insurancepay.png')
                : item.benefType == '8'
                ? require('../../Assets/Icons/NewIcons/educationpay.png')
                : item.benefType == '9'
                ? require('../../Assets/Icons/NewIcons/investments.png')
                : item.benefType == '10'
                ? require('../../Assets/Icons/NewIcons/internetbill.png')
                : item.benefType == '11'
                ? require('../../Assets/Icons/NewIcons/governmentpay.png')
                : item.benefType == '13'
                ? require('../../Assets/Icons/NewIcons/1billcredit.png')
                : item.benefType == '14'
                ? require('../../Assets/Icons/NewIcons/onebilltopup.png')
                : item.benefType == '15'
                ? require('../../Assets/Icons/NewIcons/onebillvoucher.png')
                : item.benefType == '16'
                ? require('../../Assets/Icons/NewDrawer/raast.png')
                : item.benefType == '17'
                ? require('../../Assets/Icons/NewDrawer/raast.png')
                : item.benefType == '18'
                ? require('../../Assets/Icons/NewDrawer/raast.png')
                : require('../../Assets/Icons/NewDrawer/otherpayments.png')
            }
            style={{
              width: wp(5),
              height: wp(5),
              alignSelf: 'center',
              tintColor: Colors.tabNavigateLeftIcon,
            }}
          />
        </View>

        <View
          style={{
            backgroundColor: Colors.subContainer,
            width: '75%',
            paddingLeft: wp(1),
          }}>
          <View
            style={{
              backgroundColor: Colors.subContainer,
              flexDirection: 'column',
            }}>
            <CustomText
              style={[
                globalStyling.textFontBold,
                {fontSize: wp(3), padding: 1},
              ]}
              numberOfLines={1}>
              {item.benefAlias}
            </CustomText>
            <CustomText
              style={[
                globalStyling.textFontNormal,
                {fontSize: wp(3), padding: 1},
              ]}
              numberOfLines={1}>
              {item.benefTitle}
            </CustomText>
            <CustomText
              style={[
                globalStyling.textFontNormal,
                {fontSize: wp(3), padding: 1},
              ]}
              numberOfLines={1}>
              {item.benefAccount}
            </CustomText>

            <View
              style={{
                backgroundColor: Colors.lightThemeGreen,
                borderRadius: wp(1),
                alignSelf: 'flex-start',
                padding: 1,
              }}>
              <CustomText
                style={[
                  globalStyling.textFontBold,
                  {
                    color: Colors.primary_green,
                    padding: 2,
                    fontSize: wp(2.5),
                  },
                ]}
                numberOfLines={1}>
                {' '}
                {item.benefType == '1'
                  ? 'Fund Transfers'
                  : item.benefType == '2'
                  ? 'IBFT: Inter Bank Fund Trasnfers'
                  : item.benefType == '3'
                  ? 'Utility Bill'
                  : item.benefType == '4'
                  ? 'Mobile Bill'
                  : item.benefType == '5'
                  ? 'Internet Bill'
                  : item.benefType == '6'
                  ? 'Online Shopping'
                  : item.benefType == '7'
                  ? 'Insurance'
                  : item.benefType == '8'
                  ? 'Education Payment'
                  : item.benefType == '9'
                  ? 'Investment'
                  : item.benefType == '11'
                  ? 'Government Payment'
                  : item.benefType == '13'
                  ? '1Bill Credit'
                  : item.benefType == '14'
                  ? '1Bill TopUp'
                  : item.benefType == '15'
                  ? '1Bill Voucher'
                  : item.benefType == '16'
                  ? 'Raast'
                  : item.benefType == '17'
                  ? 'Raast'
                  : item.benefType == '18'
                  ? 'Raast'
                  : 'Others'}{' '}
              </CustomText>
            </View>
          </View>
        </View>
        <View
          style={{
            width: '10%',
            justifyContent: 'center',
          }}>
          <Icon
            name={'chevron-forward'}
            size={27}
            color={Colors.tabNavigateRightIcon}
            style={{alignSelf: 'center'}}
          />
        </View>
      </TouchableOpacity>
    );
    const noBenef = () => {
      return (
        <View
          style={{
            flex: 1,
            alignItems: 'center',
            justifyContent: 'center',
          }}>
          <View style={{alignItems: 'center'}}>
            <Image
              source={Images.noBenef}
              style={{
                width: hp(12),
                // backgroundColor: 'red',
                height: hp(12),
                alignSelf: 'center',
              }}
              resizeMode={'contain'}
            />
            <CustomText
              boldFont={true}
              style={{fontSize: wp(7), marginTop: hp(2), alignSelf: 'center'}}>
              No Beneficiaries
            </CustomText>
            <CustomText
              style={{fontSize: wp(4.5), margin: hp(1), textAlign: 'center'}}>
              {`You have not added\nBeneficiary yet.`}
            </CustomText>

            <View
              style={{
                width: '100%',
                padding: wp(6),
              }}>
              <CustomBtn
                btn_width={wp(90)}
                btn_txt={'Pay To New Beneficiary'}
                backgroundColor={Colors.primary_green}
                onPress={() => {
                  this.GetBankListCallApiOnce();
                }}
              />
            </View>
            <View style={{height: hp(5)}} />
          </View>
        </View>
      );
    };

    const noResult = () => {
      return (
        <View
          style={{
            flex: 1,
            alignItems: 'center',
            justifyContent: 'center',
          }}>
          <View style={{alignItems: 'center'}}>
            <Image
              source={Images.noResultFound}
              resizeMode={'contain'}
              style={{
                width: hp(17),
                height: hp(17),
                margin: wp(2),
              }}
            />
            <CustomText
              boldFont={true}
              style={{fontSize: wp(4), marginTop: hp(1), alignSelf: 'center'}}>
              No Result Found
            </CustomText>
            <View style={{height: hp(5)}} />
          </View>
        </View>
      );
    };

    const handleSearch2 = (text) => {
      this.setState({
        searchText: text,
      });
      var filteredData2 = this.state.filteredData
        .map((item) => {
          var filteredineerData = item.data.filter((subItem) => {
            return (
              subItem.benefAlias.toLowerCase().includes(text.toLowerCase()) ||
              subItem.benefAccount.toLowerCase().includes(text.toLowerCase()) ||
              subItem.benefTitle.toLowerCase().includes(text.toLowerCase())
            );
          });
          return {title: item.title, data: filteredineerData};
        })
        .filter((item) => item.data.length > 0);
      logs.log('===---->', filteredData2.length, JSON.stringify(filteredData2));

      this.setState({searchedData: filteredData2});
    };

    return (
      <View
        style={[styles.container, {backgroundColor: Colors.backgroundColor}]}
        accessibilityLabel="Beneficiary Payment Screen">
        <SubHeader
          navigation={this.props.navigation}
          title={'Beneficiary Payments'}
          description={'Pay to your Beneficiary list'}
        />

        {this.state.data &&
        this.state.data instanceof Array &&
        this.state.data?.length == 0 ? (
          noBenef()
        ) : (
          <View style={{flex: 1}}>
            <View style={{backgroundColor: Colors.backgroundColor}}>
              <View
                style={{
                  height: wp(13),
                  width: wp(90),
                  backgroundColor: Colors.textfieldBackgroundColor,
                  alignSelf: 'center',
                  flexDirection: isRtlState() ? 'row' : 'row-reverse',
                  borderWidth: 1,
                  borderColor: Colors.textFieldBorderColor,
                  borderRadius: wp(1),
                  marginVertical: wp(3),
                }}>
                <Image
                  source={Images.searchBenef}
                  style={{
                    width: wp(8),
                    height: wp(8),
                    alignSelf: 'center',
                    marginHorizontal: wp(2),
                  }}
                  resizeMode={'contain'}
                />
                <TextInput
                  value={this.state.searchText}
                  placeholder={I18n['Search Beneficiary']}
                  style={{
                    borderBottomColor: 'transparent',
                    // backgroundColor: Colors.blackColor,
                    color: Colors.textFieldText,
                    fontFamily: fontFamily['ArticulatCF-Normal'],
                    width: wp(75),
                  }}
                  maxLength={40}
                  onChangeText={(value) => handleSearch2(value)}
                  placeholderTextColor={Colors.grey}
                  textContentType="none"
                  selectionColor={Colors.primary_green}
                  underlineColor={'white'}
                  autoCompleteType="off"
                  mode={'flat'}
                  autoCorrect={false}
                  blurOnSubmit={true}
                  underlineColorAndroid="transparent"
                />
              </View>
            </View>
            {this.state.searchText.length > 0 &&
            this.state.searchedData.length == 0 ? (
              noResult()
            ) : (
              <SectionList
                showsVerticalScrollIndicator={false}
                sections={
                  this.state.searchText.length == 0
                    ? this.state.filteredData
                    : this.state.searchedData
                }
                keyExtractor={(item, index) => item + index}
                renderItem={renderTransactionRecordFlatlist}
                renderSectionHeader={({section: {title}}) => (
                  <View style={{backgroundColor: Colors.backgroundColor}}>
                    <CustomText
                      style={{
                        paddingLeft: isRtlState() ? wp(5) : null,
                        paddingRight: isRtlState() ? null : wp(5),
                        padding: wp(3),
                        fontSize: wp(4),
                      }}>
                      {title}
                    </CustomText>
                  </View>
                )}
              />
            )}

            <View style={{height: hp(3)}} />
          </View>
        )}

        {/* <View
          style={{
            paddingBottom: wp(2),
            alignSelf: 'center',
          }}> */}
        <CustomBtn
          btn_width={wp(90)}
          btn_txt={'Pay To New Beneficiary'}
          backgroundColor={Colors.primary_green}
          onPress={() => {
            this.GetBankListCallApiOnce();
          }}
        />
        {/* </View> */}
        <View style={{bottom: hp(6)}}>
          <InformationIcon
            onPress={() => {
              this.props.reduxActions.helpInforamtion({
                title: 'Beneficiary Payments',
                page: 'BeneficiaryPayments',
                state: true,
              });
            }}
          />
        </View>
      </View>
    );
  }
}

const mapStateToProps = (state) => ({
  reduxState: state.reducers,
});

const mapDispatchToProps = (dispatch) => ({
  reduxActions: bindActionCreators(reduxActions, dispatch),
});

export default connect(mapStateToProps, mapDispatchToProps)(BeneficiaryPayment);
