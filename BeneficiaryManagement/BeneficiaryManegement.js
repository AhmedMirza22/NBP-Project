import React from 'react';
import {
  View,
  Dimensions,
  FlatList,
  Text,
  SectionList,
  Image,
  TextInput,
} from 'react-native';
import GlobalHeader from '../../Components/GlobalHeader/GlobalHeader';
import SubHeader from '../../Components/GlobalHeader/SubHeader/SubHeader';
import TabNavigator from '../../Components/TabNavigate/TabNavigate';
import styles from './BeneficiaryManagementStyling';
import {connect, useDispatch} from 'react-redux';
import {bindActionCreators} from 'redux';
import * as reduxActions from '../../Redux/Action/Action';
import {view_accounts, getFundsTransferData} from '../../Redux/Action/Action';
import {logs} from '../../Config/Config';
import {getTokenCall, Service} from '../../Config/Service';
import {TouchableOpacity} from 'react-native';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import {globalStyling, hp} from '../../Constant';
import {Colors, Images} from '../../Theme';
import CustomText from '../../Components/CustomText/CustomText';
import Icon from 'react-native-vector-icons/Ionicons';
import CustomBtn from '../../Components/Custom_btn/Custom_btn';
import {fontFamily} from '../../Theme/Fonts';
import I18n from '../../Config/Language/LocalizeLanguageString';
import {isRtlState} from '../../Config/Language/LanguagesArray';
import analytics from '@react-native-firebase/analytics';
const screenWidth = Dimensions.get('window').width;
function wp(percentage) {
  const value = (percentage * screenWidth) / 100;
  return Math.round(value);
}

class BeneficiaryPayment extends React.PureComponent {
  state = {
    loader: false,
    data: [],
    benefAll: [],
    searchText: '',
  };
  // useEffect(() => {

  // }, []);

  SetScreenRouter = (benefType, ResponsecObeject) => {
    switch (benefType) {
      ///FT///

      case 1:
        {
          this.props.reduxActions.getFundsTransferData(
            this.props.reduxState.token,
            this.props.navigation,
            true,
            ResponsecObeject,
            () => {},
          );
        }
        break;

      ///IBFT///
      case 2:
        {
          this.props.reduxActions.getInterBankFundTransferData(
            this.props.reduxState.token,
            this.props.navigation,
            false,
            true,
            ResponsecObeject,
            () => {},
          );
        }
        break;

      //Utility Bill Payment///
      case 3:
        {
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
          this.props.reduxActions.getOtherPayments(
            this.props.reduxState.token,
            this.props.navigation,
            {
              data: 'internetBillPayment',
            },
            5,
            true,
            ResponsecObeject,
          );
        }
        break;
      //Online Shopping///
      case 6:
        {
          this.props.reduxActions.getOtherPayments(
            this.props.reduxState.token,
            this.props.navigation,
            {
              data: 'onlineShopping',
              // data: 'educationPayment',
            },
            6,
            true,
            ResponsecObeject,
          );
        }
        break;
      //Insurance Payment///
      case 7:
        {
          this.props.reduxActions.getOtherPayments(
            this.props.reduxState.token,
            this.props.navigation,
            {
              data: 'insurancePayment',
            },
            7,
            true,
            ResponsecObeject,
          );
        }
        break;
      //Education Payment///
      case 8:
        {
          this.props.reduxActions.getOtherPayments(
            this.props.reduxState.token,
            this.props.navigation,
            {
              data: 'educationPayment',
            },
            8,
            true,
            ResponsecObeject,
          );
        }
        break;
      //Investments///
      case 9:
        {
          this.props.reduxActions.getOtherPayments(
            this.props.reduxState.token,
            this.props.navigation,
            {
              data: 'investment',
            },
            9,
            true,
            ResponsecObeject,
          );
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
          this.props.reduxActions.getOtherPayments(
            this.props.reduxState.token,
            this.props.navigation,
            {
              data: 'others',
            },
            10,
            true,
            ResponsecObeject,
          );
        }
        break;

      //1 Bill Credit Card Bills///
      case 11:
        {
          this.props.reduxActions.getOtherPayments(
            this.props.reduxState.token,
            this.props.navigation,
            {
              // data: 'creditCardBills',
              data: 'governmentPayments',
            },
            11,
            true,
            ResponsecObeject,
          );
        }
        break;
      case 13:
        {
          this.props.reduxActions.OneBillTopUp(
            this.props.reduxState.token,
            this.props.navigation,
            {
              // data: 'topUp',
              data: 'creditCardBills',
            },
            13,
            true,
            ResponsecObeject,
          );
        }
        break;
      //1 Bill Top Up///
      case 14:
        {
          this.props.reduxActions.OneBillTopUp(
            this.props.reduxState.token,
            this.props.navigation,
            {
              data: 'topUp',
              // data: 'others',
            },
            14,
            true,
            ResponsecObeject,
          );
        }
        break;
      ///1 Bill Voucher/ Fee Payment///
      case 15:
        {
          this.props.reduxActions.getOtherPayments(
            this.props.reduxState.token,
            this.props.navigation,
            {
              data: 'voucherPayment',
            },
            15,
            true,
            ResponsecObeject,
          );
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
      case 17:
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
          // this.props.reduxActions.getpk
          this.props.reduxActions.getRAASTbenefiData(
            this.props.navigation,
            () => {
              this.props.reduxActions.getraastbanklist(
                this.props.navigation,
                () => {
                  /// raast payment
                  this.props.navigation.navigate('RAASTBenefByIBAN', {
                    isbenef: true,
                    requiredData: ResponsecObeject,
                  });
                },
              );
            },
          );
        }
        break;
    }
  };
  componentDidMount() {
    var Data = [];
    this.props.navigation.addListener('focus', () => {
      this.props.reduxActions.all_benef_pay(
        this.props.navigation,
        true,
        (allBenef) => {
          // data;
          logs.log('asdasd', allBenef?.data?.beneficiaries);
          Data = allBenef?.data?.beneficiaries
            ? allBenef?.data?.beneficiaries
            : [];
          const data = Data.sort(function (a, b) {
            var nameA = a.benefAlias.toLowerCase(),
              nameB = b.benefAlias.toLowerCase();
            if (nameA < nameB)
              //sort string ascending
              return -1;
            if (nameA > nameB) return 1;
            return 0; //default return value (no sorting)
          });
          const filteredArray = data.reduce((result, item) => {
            if (
              item.benefType === 1 ||
              item.benefType === 2 ||
              item.benefType === 16 ||
              item.benefType === 17
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
              const otherGroup = result.find(
                (group) => group.title === 'Others',
              );
              if (otherGroup) {
                otherGroup.data.push(item);
              } else {
                result.push({title: 'Others', data: [item]});
              }
            }
            return result;
          }, []);
          const order = 'tbmgcoadefhijklnpqrsuvwxyz';

          filteredArray.sort((a, b) => {
            const titleA = a.title.toLowerCase();
            const titleB = b.title.toLowerCase();
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

          this.setState({data: filteredArray}, () => {
            logs.log(`data : ${JSON.stringify(filteredArray)}`);
          });
        },
      );
    });
  }
  render() {
    const renderTransactionRecordFlatlist = ({item, index, separators}) => (
      <TouchableOpacity
        onPress={() => {
          this.props.navigation.navigate('BeneficiaryDetail', {data: item});
          // this.SetScreenRouter(item.benefType, item);
          logs.log(JSON.stringify(item.benefType), JSON.stringify(item));
        }}
        style={[
          globalStyling.benefPayRowView,
          {
            backgroundColor: Colors.tabNavigateBackground,
            borderColor: Colors.textFieldBorderColor,
          },
        ]}>
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
                ? require('../../Assets/Icons/NewDrawer/Ibftt.png')
                : item.benefType == '17'
                ? require('../../Assets/Icons/NewDrawer/Ibftt.png')
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
            backgroundColor: Colors.tabNavigateBackground,
            width: '75%',
            paddingLeft: wp(1),
          }}>
          <View
            style={{
              backgroundColor: Colors.tabNavigateBackground,
              flexDirection: 'column',
            }}>
            <CustomText
              style={[
                globalStyling.textFontBold,
                {
                  fontSize: wp(3),
                  backgroundColor: Colors.tabNavigateBackground,
                  padding: 1,
                },
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
              {item.benefAccount}
            </CustomText>
            <View
              style={{
                backgroundColor: Colors.lightThemeGreen,
                borderRadius: wp(1),
                alignSelf: 'flex-start',
                padding: 1,
              }}>
              <Text
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
                  : 'Others'}{' '}
              </Text>
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
                btn_txt={'+ Add Beneficiary'}
                backgroundColor={Colors.primary_green}
                onPress={() => {
                  this.props.navigation.navigate('AddBeneficiary');
                }}
              />
            </View>
            <View style={{height: hp(5)}} />
          </View>
        </View>
      );
    };
    const handleSearch2 = (text) => {
      this.setState({
        searchText: text,
      });
      var filteredData2 = this.state.data
        .map((item) => {
          var filteredineerData = item.data.filter((subItem) => {
            return (
              subItem.benefAlias.toLowerCase().includes(text.toLowerCase()) ||
              subItem.benefAccount.toLowerCase().includes(text.toLowerCase())
            );
          });
          return {title: item.title, data: filteredineerData};
        })
        .filter((item) => item.data.length > 0);
      logs.log('===---->', filteredData2.length, JSON.stringify(filteredData2));

      this.setState({benefAll: filteredData2});
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
    return (
      <View
        style={[styles.container, {backgroundColor: Colors.backgroundColor}]}
        accessibilityLabel="Beneficiary Payment Screen">
        <SubHeader
          navigation={this.props.navigation}
          title={'Beneficiary Management'}
          description={'Manage your Beneficiary'}
          onPress={() => {
            this.props.navigation?.pop();
          }}
        />

        {this.state.data.length == 0 ? (
          noBenef()
        ) : (
          <>
            <View style={{backgroundColor: Colors.backgroundColor}}>
              <View
                style={{
                  height: wp(13),
                  width: wp(90),
                  backgroundColor: Colors.tabNavigateBackground,
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
                    // backgroundColor: Colors.whiteColor,
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
            this.state.benefAll.length == 0 ? (
              noResult()
            ) : (
              <SectionList
                showsVerticalScrollIndicator={false}
                sections={
                  this.state.searchText.length == 0
                    ? this.state.data
                    : this.state.benefAll
                }
                keyExtractor={(item, index) =>
                  item.toString() + index.toString()
                }
                renderItem={renderTransactionRecordFlatlist}
                renderSectionHeader={({section: {title}}) => (
                  <View style={{backgroundColor: Colors.backgroundColor}}>
                    <CustomText
                      style={{
                        // color: Colors.blackColor,
                        paddingLeft: wp(5),
                        padding: wp(3),
                        fontSize: wp(4),
                      }}>
                      {title}
                    </CustomText>
                  </View>
                )}
              />
            )}

            <View style={{height: wp(20)}} />
            <View
              style={{
                backgroundColor: Colors.backgroundColor,
                position: 'absolute',
                alignSelf: 'center',
                bottom: 0,
              }}>
              <View
                style={{
                  padding: wp(4),
                  backgroundColor: Colors.backgroundColor,
                }}>
                <CustomBtn
                  btn_width={wp(90)}
                  btn_txt={'+ Add Beneficiary'}
                  backgroundColor={Colors.primary_green}
                  onPress={() => {
                    this.props.navigation.navigate('AddBeneficiary');
                  }}
                />
              </View>
            </View>
          </>
        )}
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
