import React from 'react';
import {
  View,
  Dimensions,
  Text,
  TouchableHighlight,
  Image,
  StyleSheet,
  Platform,
} from 'react-native';
// import {TouchableHighlight} from 'react-native-gesture-handler';
import Ionicons from 'react-native-vector-icons/Ionicons';
import styles from './TabNavigateStyle';
import {Colors} from '../../Theme';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Fontisto from 'react-native-vector-icons/Fontisto';
import {globalStyling} from '../../Constant';
import I18n from '../../Config/Language/LocalizeLanguageString';

const screenWidth = Dimensions.get('window').width;
function wp(percentage) {
  const value = (percentage * screenWidth) / 100;
  return Math.round(value);
}
import Images from '../../Theme/Images';
import CustomText from '../CustomText/CustomText';
import {isRtlState} from '../../Config/Language/LanguagesArray';
import {useTheme} from '../../Theme/ThemeManager';
import NewView from '../NewView';
import {fontFamily} from '../../Theme/Fonts';

const TabNavigate = React.memo((props) => {
  const {activeTheme} = useTheme();

  return (
    <TouchableHighlight
      accessible={true}
      onPress={() =>
        props.onPress
          ? props.onPress()
          : props.dataObject
          ? props.navigation.navigate(props.navigateTo, props.dataObject)
          : props.navigation.navigate(props.navigateTo)
      }
      underlayColor={props.hideOverlay ? null : Colors.tabNavigateonPress}
      style={{
        backgroundColor: activeTheme.tabNavigateBackground,
        width: props.width ? props.width : '90%',
        alignSelf: 'center',
        borderWidth: props.border ? 1 : 0,
        borderColor: props.border ? activeTheme.textFieldBorderColor : null,
        borderRadius: wp(1),
        margin: props.noMargin ? 0 : wp(2),
      }}>
      <View
        style={[
          {
            flexDirection: isRtlState() ? 'row' : 'row-reverse',
            justifyContent: 'space-between',
            width: wp(90),
            alignItems: 'center',
            // alignSelf: 'center',
            paddingHorizontal: wp(2),
            paddingVertical: wp(2),
            // borderBottomWidth: wp(0.2),
            borderColor: 'lightgrey',
            borderRadius: wp(1),
          },
          {
            backgroundColor: props.backgroundColor
              ? props.backgroundColor
              : 'transparent',
            width: '100%',
            // borderRadius: wp(1),
          },
        ]}>
        <View
          style={{
            flexDirection: isRtlState() ? 'row' : 'row-reverse',
            alignItems: 'center',
            width: props?.NewBiller ? '75%' : props.width ? props.width : '90%',
          }}>
          <View>
            {props.viewAccounts ? (
              // <Ionicons
              //   name={'compass-outline'}
              //   size={wp(6.5)}
              //   color={'orange'}
              // />

              <View
                style={{
                  overflow: 'hidden',
                  width: wp(4.5),
                  height: wp(4.5),
                  // padding: wp(2),
                }}>
                <Image
                  source={Images.addAccount}
                  style={[
                    globalStyling.image,
                    {tintColor: activeTheme.tabNavigateLeftIcon},
                  ]}
                  resizeMode="contain"
                />
              </View>
            ) : props.addAccounts ? (
              <View
                style={{
                  overflow: 'hidden',
                  width: wp(4.5),
                  height: wp(4.5),
                  // padding: wp(2),
                }}>
                <Image
                  source={require('../../Assets/Icons/NewDrawer/benefmanage.png')}
                  style={[
                    globalStyling.image,
                    {tintColor: activeTheme.tabNavigateLeftIcon},
                  ]}
                  resizeMode="contain"
                />
              </View>
            ) : props.rtpRequest ? (
              // <AntDesign name="idcard" size={wp(6.5)} color={'orange'} />
              <View
                style={{overflow: 'hidden', width: wp(4.5), height: wp(4.5)}}>
                <Image
                  style={[
                    globalStyling.image,
                    {tintColor: activeTheme.tabNavigateLeftIcon},
                  ]}
                  resizeMode="stretch"
                  source={Images.rtpRequest}
                />
              </View>
            ) : props.requestsforrequest ? (
              // <AntDesign name="idcard" size={wp(6.5)} color={'orange'} />
              <View
                style={{overflow: 'hidden', width: wp(4.5), height: wp(4.5)}}>
                <Image
                  style={[
                    globalStyling.image,
                    {tintColor: activeTheme.tabNavigateLeftIcon},
                  ]}
                  resizeMode="stretch"
                  source={Images.requestsforrequest}
                />
              </View>
            ) : props.sendMoney ? (
              <View
                style={{overflow: 'hidden', width: wp(4.5), height: wp(4.5)}}>
                <Image
                  source={require('../../Assets/Icons/NewIcons/sendMoney.png')}
                  style={[
                    globalStyling.image,
                    {tintColor: activeTheme.tabNavigateLeftIcon},
                  ]}
                  resizeMode="contain"
                />
              </View>
            ) : props.gold ? (
              <View
                style={{overflow: 'hidden', width: wp(4.5), height: wp(4.5)}}>
                <Image
                  source={require('../../Assets/Icons/NewDrawer/gold.png')}
                  style={[
                    globalStyling.image,
                    {tintColor: activeTheme.tabNavigateLeftIcon},
                  ]}
                  resizeMode="contain"
                />
              </View>
            ) : props.MutualFund ? (
              <View
                style={{overflow: 'hidden', width: wp(4.5), height: wp(4.5)}}>
                <Image
                  source={require('../../Assets/Icons/NewDrawer/mutal.png')}
                  style={[
                    globalStyling.image,
                    {tintColor: activeTheme.tabNavigateLeftIcon},
                  ]}
                  resizeMode="contain"
                />
              </View>
            ) : props.receiveMoney ? (
              <View
                style={{overflow: 'hidden', width: wp(4.5), height: wp(4.5)}}>
                <Image
                  source={require('../../Assets/Icons/NewIcons/receiveMoney.png')}
                  style={[
                    globalStyling.image,
                    {tintColor: activeTheme.tabNavigateLeftIcon},
                  ]}
                  resizeMode="contain"
                />
              </View>
            ) : props.dynamicImage ? (
              <View style={{overflow: 'hidden', width: wp(10), height: wp(10)}}>
                <Image
                  source={{uri: `${props?.dynamicIcon}`}}
                  style={[globalStyling.image]}
                  resizeMode="contain"
                />
              </View>
            ) : props.manageAccounts ? (
              <View
                style={{
                  overflow: 'hidden',
                  width: wp(4.5),
                  height: wp(4.5),
                  // padding: wp(2),
                }}>
                <Image
                  source={Images.manageAccount}
                  style={[
                    globalStyling.image,
                    {tintColor: activeTheme.tabNavigateLeftIcon},
                  ]}
                  resizeMode="contain"
                />
              </View>
            ) : props.airline ? (
              // <SimpleLineIcons name="badge" size={wp(6.5)} color={'orange'} />
              <View
                style={{width: wp(4.5), height: wp(4.5), overflow: 'hidden'}}>
                <Image
                  style={[
                    globalStyling.image,
                    {tintColor: activeTheme.tabNavigateLeftIcon},
                  ]}
                  // resizeMode="contain"
                  source={require('../../Assets/Icons/NewIcons/airplane.png')}
                />
              </View>
            ) : props.assetManagement ? (
              // <SimpleLineIcons name="badge" size={wp(6.5)} color={'orange'} />
              <View
                style={{width: wp(4.5), height: wp(4.5), overflow: 'hidden'}}>
                <Image
                  style={[
                    globalStyling.image,
                    {tintColor: activeTheme.tabNavigateLeftIcon},
                  ]}
                  // resizeMode="contain"
                  source={require('../../Assets/Icons/NewIcons/asset-management.png')}
                />
              </View>
            ) : props.financialService ? (
              // <SimpleLineIcons name="badge" size={wp(6.5)} color={'orange'} />
              <View
                style={{width: wp(4.5), height: wp(4.5), overflow: 'hidden'}}>
                <Image
                  style={[
                    globalStyling.image,
                    {tintColor: activeTheme.tabNavigateLeftIcon},
                  ]}
                  // resizeMode="contain"
                  source={require('../../Assets/Icons/NewIcons/financialServices.png')}
                />
              </View>
            ) : props?.text === 'Mobilink' && props?.onlyMobileTopUp ? (
              <View style={{overflow: 'hidden', width: wp(8), height: wp(8)}}>
                <Image
                  source={Images.Mobilink}
                  style={[globalStyling.image]}
                  resizeMode="stretch"
                />
              </View>
            ) : props?.text === 'Zong' && props?.onlyMobileTopUp ? (
              <View style={{overflow: 'hidden', width: wp(8), height: wp(8)}}>
                <Image
                  source={Images.Zong}
                  style={[globalStyling.image]}
                  resizeMode="stretch"
                />
              </View>
            ) : props?.text === 'Ufone' && props?.onlyMobileTopUp ? (
              <View style={{overflow: 'hidden', width: wp(8), height: wp(8)}}>
                <Image
                  source={Images.Ufone}
                  style={[globalStyling.image]}
                  resizeMode="stretch"
                />
              </View>
            ) : props?.text === 'Telenor' && props?.onlyMobileTopUp ? (
              <View style={{overflow: 'hidden', width: wp(8), height: wp(8)}}>
                <Image
                  source={Images.Telenor}
                  style={[globalStyling.image]}
                  resizeMode="stretch"
                />
              </View>
            ) : props.fundsTransfer ? (
              <View
                style={{overflow: 'hidden', width: wp(4.5), height: wp(4.5)}}>
                <Image
                  source={require('../../Assets/Icons/NewIcons/fund-transfer.png')}
                  style={[
                    globalStyling.image,
                    {tintColor: activeTheme.tabNavigateLeftIcon},
                  ]}
                  resizeMode="stretch"
                />
              </View>
            ) : props.cnicTransfer ? (
              // <AntDesign name="idcard" size={wp(6.5)} color={'orange'} />
              <View
                style={{overflow: 'hidden', width: wp(4.5), height: wp(4.5)}}>
                <Image
                  style={[
                    globalStyling.image,
                    {tintColor: activeTheme.tabNavigateLeftIcon},
                  ]}
                  resizeMode="contain"
                  source={require('../../Assets/Icons/NewIcons/cnic-transfer.png')}
                />
              </View>
            ) : props.by_alias ? (
              // <AntDesign name="idcard" size={wp(6.5)} color={'orange'} />
              <View
                style={{overflow: 'hidden', width: wp(4.5), height: wp(4.5)}}>
                <Image
                  style={[
                    globalStyling.image,
                    {tintColor: activeTheme.tabNavigateLeftIcon},
                  ]}
                  resizeMode="stretch"
                  source={Images.raastBlack}
                />
              </View>
            ) : props.by_iban ? (
              // <AntDesign name="idcard" size={wp(6.5)} color={'orange'} />
              <View
                style={{overflow: 'hidden', width: wp(4.5), height: wp(4.5)}}>
                <Image
                  style={[
                    globalStyling.image,
                    {tintColor: activeTheme.tabNavigateLeftIcon},
                  ]}
                  resizeMode="stretch"
                  source={Images.raastBlack}
                />
              </View>
            ) : props.raastQr ? (
              // <AntDesign name="idcard" size={wp(6.5)} color={'orange'} />
              <View
                style={{overflow: 'hidden', width: wp(4.5), height: wp(4.5)}}>
                <Image
                  style={[
                    globalStyling.image,
                    {tintColor: activeTheme.tabNavigateLeftIcon},
                  ]}
                  resizeMode="stretch"
                  source={Images.raastQr}
                />
              </View>
            ) : props.raastManag ? (
              // <AntDesign name="idcard" size={wp(6.5)} color={'orange'} />
              <View
                style={{overflow: 'hidden', width: wp(4.5), height: wp(4.5)}}>
                <Image
                  style={[
                    globalStyling.image,
                    {tintColor: activeTheme.tabNavigateLeftIcon},
                  ]}
                  resizeMode="stretch"
                  source={Images.raastManag}
                />
              </View>
            ) : props.donation ? (
              // <Entypo name="graduation-cap" size={wp(6.5)} color={'orange'} />
              <View
                style={{width: wp(6.5), height: wp(6.5), overflow: 'hidden'}}>
                <Image
                  style={[
                    globalStyling.image,
                    {tintColor: activeTheme.tabNavigateLeftIcon},
                  ]}
                  // resizeMode="contain"
                  source={require('../../Assets/bottomTaB/bottomDonation.png')}
                />
              </View>
            ) : props.sport ? (
              // <Entypo name="graduation-cap" size={wp(6.5)} color={'orange'} />
              <View
                style={{width: wp(6.5), height: wp(6.5), overflow: 'hidden'}}>
                <Image
                  style={[
                    globalStyling.image,
                    {tintColor: activeTheme.tabNavigateLeftIcon},
                  ]}
                  // resizeMode="contain"
                  source={require('../../Assets/bottomTaB/bottomSport.png')}
                />
              </View>
            ) : props.raastviaId ? (
              // <AntDesign name="idcard" size={wp(6.5)} color={'orange'} />
              <View
                style={{overflow: 'hidden', width: wp(4.5), height: wp(4.5)}}>
                <Image
                  style={[
                    globalStyling.image,
                    {tintColor: activeTheme.tabNavigateLeftIcon},
                  ]}
                  resizeMode="stretch"
                  source={Images.raastViaId}
                />
              </View>
            ) : props.certificates ? (
              // <AntDesign name="idcard" size={wp(6.5)} color={'orange'} />
              <View
                style={{overflow: 'hidden', width: wp(4.5), height: wp(4.5)}}>
                <Image
                  style={[
                    globalStyling.image,
                    {tintColor: activeTheme.tabNavigateLeftIcon},
                  ]}
                  resizeMode="stretch"
                  source={require('../../Assets/Icons/NewDrawer/certificates.png')}
                />
              </View>
            ) : props.profit ? (
              // <AntDesign name="idcard" size={wp(6.5)} color={'orange'} />
              <View style={{overflow: 'hidden', width: wp(5), height: wp(5)}}>
                <Image
                  style={[
                    globalStyling.image,
                    {tintColor: activeTheme.tabNavigateLeftIcon},
                  ]}
                  resizeMode="stretch"
                  source={require('../../Assets/Icons/NewDrawer/profit_360.png')}
                />
              </View>
            ) : props.alias_register ? (
              // <AntDesign name="idcard" size={wp(6.5)} color={'orange'} />
              <View
                style={{overflow: 'hidden', width: wp(4.5), height: wp(4.5)}}>
                <Image
                  style={[
                    globalStyling.image,
                    {tintColor: activeTheme.tabNavigateLeftIcon},
                  ]}
                  resizeMode="stretch"
                  source={require('../../Assets/RAAST_Icons/Create_RaastID.png')}
                />
              </View>
            ) : props.referralCount ? (
              // <AntDesign name="idcard" size={wp(6.5)} color={'orange'} />
              <View
                style={{overflow: 'hidden', width: wp(4.5), height: wp(4.5)}}>
                <Image
                  style={[
                    globalStyling.image,
                    {tintColor: activeTheme.tabNavigateLeftIcon},
                  ]}
                  resizeMode="stretch"
                  source={require('../../Assets/Icons/NewDrawer/referralCount.png')}
                />
              </View>
            ) : props?.addReferral ? (
              // <AntDesign name="idcard" size={wp(6.5)} color={'orange'} />
              <View
                style={{overflow: 'hidden', width: wp(4.5), height: wp(4.5)}}>
                <Image
                  style={[
                    globalStyling.image,
                    {tintColor: activeTheme.tabNavigateLeftIcon},
                  ]}
                  resizeMode="stretch"
                  source={require('../../Assets/Icons/NewDrawer/referral.png')}
                />
              </View>
            ) : props.alias_link ? (
              // <AntDesign name="idcard" size={wp(6.5)} color={'orange'} />
              <View
                style={{overflow: 'hidden', width: wp(4.5), height: wp(4.5)}}>
                <Image
                  style={[
                    globalStyling.image,
                    {tintColor: activeTheme.tabNavigateLeftIcon},
                  ]}
                  resizeMode="stretch"
                  source={require('../../Assets/RAAST_Icons/Link.png')}
                />
              </View>
            ) : props.alias_unlink ? (
              // <AntDesign name="idcard" size={wp(6.5)} color={'orange'} />
              <View
                style={{overflow: 'hidden', width: wp(4.5), height: wp(4.5)}}>
                <Image
                  style={[
                    globalStyling.image,
                    {tintColor: activeTheme.tabNavigateLeftIcon},
                  ]}
                  resizeMode="stretch"
                  source={require('../../Assets/RAAST_Icons/Delink.png')}
                />
              </View>
            ) : props.alias_remove ? (
              // <AntDesign name="idcard" size={wp(6.5)} color={'orange'} />
              <View
                style={{overflow: 'hidden', width: wp(4.5), height: wp(4.5)}}>
                <Image
                  style={[
                    globalStyling.image,
                    {tintColor: activeTheme.tabNavigateLeftIcon},
                  ]}
                  resizeMode="stretch"
                  source={require('../../Assets/RAAST_Icons/Delete_ID.png')}
                />
              </View>
            ) : props.alias_status ? (
              // <AntDesign name="idcard" size={wp(6.5)} color={'orange'} />
              <View
                style={{overflow: 'hidden', width: wp(4.5), height: wp(4.5)}}>
                <Image
                  style={[
                    globalStyling.image,
                    {tintColor: activeTheme.tabNavigateLeftIcon},
                  ]}
                  resizeMode="stretch"
                  source={Images.raastBlack}
                />
              </View>
            ) : props.interBankTransfer ? (
              // <MaterialCommunityIcons
              //   name={'bank-transfer'}
              //   size={wp(7)}
              //   color={'orange'}
              // />
              <View
                style={{width: wp(4.5), height: wp(4.5), overflow: 'hidden'}}>
                <Image
                  source={require('../../Assets/Icons/NewIcons/ibft.png')}
                  style={[
                    globalStyling.image,
                    {tintColor: activeTheme.tabNavigateLeftIcon},
                  ]}
                  resizeMode="contain"
                />
              </View>
            ) : props.addBeneficiary ? (
              <View
                style={{overflow: 'hidden', width: wp(4.5), height: wp(4.5)}}>
                <Image
                  source={require('../../Assets/Icons/NewDrawer/benefmanage.png')}
                  style={[
                    globalStyling.image,
                    {tintColor: activeTheme.tabNavigateLeftIcon},
                  ]}
                  resizeMode="contain"
                />
              </View>
            ) : props.viewBeneficiary ? (
              // <Ionicons
              //   name={'compass-outline'}
              //   size={wp(6.5)}
              //   color={'orange'}
              // />
              <View
                style={{width: wp(4.5), height: wp(4.5), overflow: 'hidden'}}>
                <Image
                  style={[
                    globalStyling.image,
                    {tintColor: activeTheme.tabNavigateLeftIcon},
                  ]}
                  resizeMode="contain"
                  source={require('../../Assets/Icons/NewIcons/viewbene.png')}
                />
              </View>
            ) : props.utilityBillPayments ? (
              // <Entypo name="text-document" size={wp(6.5)} color={'orange'} />
              <View style={{width: wp(4.5), height: wp(4), overflow: 'hidden'}}>
                <Image
                  style={[
                    globalStyling.image,
                    {tintColor: activeTheme.tabNavigateLeftIcon},
                  ]}
                  resizeMode="contain"
                  source={require('../../Assets/Icons/NewIcons/utilitybill.png')}
                />
              </View>
            ) : props.mobilePayment ? (
              // <MaterialIcons
              //   name="send-to-mobile"
              //   size={wp(6.5)}
              //   color={'orange'}
              // />
              <View
                style={{width: wp(4.5), height: wp(4.5), overflow: 'hidden'}}>
                <Image
                  style={[
                    globalStyling.image,
                    {tintColor: activeTheme.tabNavigateLeftIcon},
                  ]}
                  // resizeMode="contain"
                  source={require('../../Assets/Icons/NewIcons/mobilebill.png')}
                />
              </View>
            ) : props.internetBillPayment ? (
              // <AntDesign name="earth" size={wp(6.5)} color={'orange'} />
              <View
                style={{width: wp(4.5), height: wp(4.5), overflow: 'hidden'}}>
                <Image
                  style={[
                    globalStyling.image,
                    {tintColor: activeTheme.tabNavigateLeftIcon},
                  ]}
                  // resizeMode="contain"
                  source={require('../../Assets/Icons/NewIcons/internetbill.png')}
                />
              </View>
            ) : props.educationPayment ? (
              // <Entypo name="graduation-cap" size={wp(6.5)} color={'orange'} />
              <View
                style={{width: wp(4.5), height: wp(4.5), overflow: 'hidden'}}>
                <Image
                  style={[
                    globalStyling.image,
                    {tintColor: activeTheme.tabNavigateLeftIcon},
                  ]}
                  // resizeMode="contain"
                  source={require('../../Assets/Icons/NewIcons/educationpay.png')}
                />
              </View>
            ) : props.insurancePayment ? (
              // <SimpleLineIcons name="badge" size={wp(6.5)} color={'orange'} />
              <View
                style={{width: wp(4.5), height: wp(4.5), overflow: 'hidden'}}>
                <Image
                  style={[
                    globalStyling.image,
                    {tintColor: activeTheme.tabNavigateLeftIcon},
                  ]}
                  // resizeMode="contain"
                  source={require('../../Assets/Icons/NewIcons/insurancepay.png')}
                />
              </View>
            ) : props.onlineShopping ? (
              // <Ionicons name="cart-outline" size={wp(6.5)} color={'orange'} />
              <View
                style={{width: wp(4.5), height: wp(4.5), overflow: 'hidden'}}>
                <Image
                  style={[
                    globalStyling.image,
                    {tintColor: activeTheme.tabNavigateLeftIcon},
                  ]}
                  // resizeMode="contain"
                  source={require('../../Assets/Icons/NewIcons/onlineshopping.png')}
                />
              </View>
            ) : props.investment ? (
              <View
                style={{width: wp(4.5), height: wp(4.5), overflow: 'hidden'}}>
                <Image
                  style={[
                    globalStyling.image,
                    {tintColor: activeTheme.tabNavigateLeftIcon},
                  ]}
                  // resizeMode="contain"
                  source={require('../../Assets/Icons/NewIcons/investments.png')}
                />
              </View>
            ) : props.governmentPayments ? (
              <View
                style={{width: wp(4.5), height: wp(4.5), overflow: 'hidden'}}>
                <Image
                  style={[
                    globalStyling.image,
                    {tintColor: activeTheme.tabNavigateLeftIcon},
                  ]}
                  // resizeMode="contain"
                  source={require('../../Assets/Icons/NewIcons/governmentpay.png')}
                />
              </View>
            ) : props.creditCardBills ? (
              <View
                style={{width: wp(4.5), height: wp(4.5), overflow: 'hidden'}}>
                <Image
                  style={[
                    globalStyling.image,
                    {tintColor: activeTheme.tabNavigateLeftIcon},
                  ]}
                  // resizeMode="contain"
                  source={require('../../Assets/Icons/NewIcons/1billcredit.png')}
                />
              </View>
            ) : props.topUp ? (
              <View
                style={{width: wp(4.5), height: wp(4.5), overflow: 'hidden'}}>
                <Image
                  style={[
                    globalStyling.image,
                    {tintColor: activeTheme.tabNavigateLeftIcon},
                  ]}
                  // resizeMode="contain"
                  source={require('../../Assets/Icons/NewIcons/onebilltopup.png')}
                />
              </View>
            ) : props.voucherPayment ? (
              <View
                style={{width: wp(4.5), height: wp(4.5), overflow: 'hidden'}}>
                <Image
                  style={[
                    globalStyling.image,
                    {tintColor: activeTheme.tabNavigateLeftIcon},
                  ]}
                  // resizeMode="contain"
                  source={require('../../Assets/Icons/NewIcons/onebillvoucher.png')}
                />
              </View>
            ) : props.others ? (
              <View
                style={{width: wp(4.5), height: wp(4.5), overflow: 'hidden'}}>
                <Image
                  style={[
                    globalStyling.image,
                    {tintColor: activeTheme.tabNavigateLeftIcon},
                  ]}
                  // resizeMode="contain"
                  source={require('../../Assets/Icons/NewDrawer/otherpayments.png')}
                />
              </View>
            ) : props.addCard ? (
              <View style={imageStyles.wp7Styling}>
                <Image
                  source={Images.addVirtualCard}
                  style={[
                    globalStyling.image,
                    {tintColor: activeTheme.tabNavigateLeftIcon},
                  ]}
                  resizeMode="contain"
                />
              </View>
            ) : props.viewCard ? (
              <View style={imageStyles.wp7Styling}>
                <Image
                  source={require('../../Assets/Icons/NewIcons/1billcredit.png')}
                  style={[
                    globalStyling.image,
                    {tintColor: activeTheme.tabNavigateLeftIcon},
                  ]}
                  resizeMode="contain"
                />
              </View>
            ) : props.merchantPay ? (
              <Image
                style={{
                  height: wp(4.5),
                  width: wp(4.5),
                  tintColor: 'black',
                  alignSelf: 'center',
                  // left: wp(4),
                }}
                source={require('../../Assets/Icons/NewDrawer/payments.png')}
              />
            ) : props.merchantPayment ? (
              <View style={imageStyles.wp7Styling}>
                <Image
                  style={[
                    globalStyling.image,
                    {tintColor: activeTheme.tabNavigateLeftIcon},
                  ]}
                  // resizeMode="contain"
                  source={Images.fbrTax}
                />
              </View>
            ) : props.qrViaScan ? (
              <MaterialCommunityIcons
                name="qrcode"
                size={wp(6.5)}
                color={'orange'}
              />
            ) : props.generateQr ? (
              <MaterialCommunityIcons
                name="barcode-scan"
                size={wp(6.5)}
                color={'orange'}
              />
            ) : props.pos ? (
              <Fontisto
                name="shopping-pos-machine"
                size={wp(6.5)}
                color={'orange'}
              />
            ) : props.mpin ? (
              <View style={imageStyles.wp7Styling}>
                <Image
                  style={[
                    globalStyling.image,
                    {tintColor: activeTheme.tabNavigateLeftIcon},
                  ]}
                  resizeMode="contain"
                  source={require('../../Assets/Icons/NewDrawer/mpinmanage.png')}
                />
              </View>
            ) : props.cardissuance ? (
              <View style={imageStyles.wp7Styling}>
                <Image
                  source={Images.debitCard}
                  style={[
                    globalStyling.image,
                    {tintColor: activeTheme.tabNavigateLeftIcon},
                  ]}
                  resizeMode="contain"
                />
              </View>
            ) : props.Gallery ? (
              <View style={{overflow: 'hidden', width: wp(5), height: wp(5)}}>
                <Image
                  source={Images.galleryLineIcon}
                  style={[
                    globalStyling.image,
                    {tintColor: activeTheme.tabNavigateLeftIcon},
                  ]}
                  resizeMode="contain"
                />
              </View>
            ) : props.Camera ? (
              <View style={{overflow: 'hidden', width: wp(5), height: wp(5)}}>
                <Image
                  source={Images.cameraLineicon}
                  style={[
                    globalStyling.image,
                    {tintColor: activeTheme.tabNavigateLeftIcon},
                  ]}
                  resizeMode="contain"
                />
              </View>
            ) : props.cardstatus ? (
              <View style={imageStyles.wp7Styling}>
                <Image
                  source={Images.SplashScreen}
                  style={[
                    globalStyling.image,
                    {tintColor: activeTheme.tabNavigateLeftIcon},
                  ]}
                  resizeMode="contain"
                />
              </View>
            ) : props.cardActivationTab ? (
              <View style={imageStyles.wp7Styling}>
                <Image
                  source={Images.virtualCard}
                  style={[
                    globalStyling.image,
                    {tintColor: activeTheme.tabNavigateLeftIcon},
                  ]}
                  resizeMode="contain"
                />
              </View>
            ) : props.cardStatusTab ? (
              <View style={imageStyles.wp7Styling}>
                <Image
                  source={Images.raastBlack}
                  resizeMode="contain"
                  style={[
                    globalStyling.image,
                    {tintColor: activeTheme.tabNavigateLeftIcon},
                  ]}
                />
              </View>
            ) : props.cardPinTab ? (
              <View style={imageStyles.wp7Styling}>
                <Image
                  source={Images.raastBlack}
                  resizeMode="contain"
                  style={[
                    globalStyling.image,
                    {tintColor: activeTheme.tabNavigateLeftIcon},
                  ]}
                />
              </View>
            ) : props.cardForgotPinTab ? (
              <View style={imageStyles.wp7Styling}>
                <Image
                  source={Images.raastBlack}
                  style={[
                    globalStyling.image,
                    {tintColor: activeTheme.tabNavigateLeftIcon},
                  ]}
                />
              </View>
            ) : props.card_ping ? (
              <View style={imageStyles.wp7Styling}>
                <Image
                  source={Images.raastBlack}
                  style={[
                    globalStyling.image,
                    {tintColor: activeTheme.tabNavigateLeftIcon},
                  ]}
                  resizeMode="contain"
                />
              </View>
            ) : props.complaint ? (
              <View style={imageStyles.wp7Styling}>
                <Image
                  source={require('../../Assets/Icons/NewDrawer/mpinmanage.png')}
                  style={[
                    globalStyling.image,
                    {tintColor: activeTheme.tabNavigateLeftIcon},
                  ]}
                  resizeMode="contain"
                />
              </View>
            ) : props.isRAASTBenef ? (
              <View style={{width: wp(7), height: wp(7), overflow: 'hidden'}}>
                <Image
                  source={require('../../Assets/Rast-transparetn.png')}
                  style={[
                    globalStyling.image,
                    {tintColor: activeTheme.tabNavigateLeftIcon},
                  ]}
                  resizeMode="contain"
                />
              </View>
            ) : props.raast ? (
              <View style={{overflow: 'hidden', width: wp(5), height: wp(5)}}>
                <Image
                  source={require('../../Assets/Rast-transparetn.png')}
                  style={[
                    globalStyling.image,
                    {tintColor: activeTheme.tabNavigateLeftIcon},
                  ]}
                  resizeMode="contain"
                />
              </View>
            ) : props.raast2 ? (
              <View style={{overflow: 'hidden', width: wp(5), height: wp(5)}}>
                <Image
                  source={Images.raast2nd}
                  style={[
                    globalStyling.image,
                    {tintColor: activeTheme.tabNavigateLeftIcon},
                  ]}
                  resizeMode="contain"
                />
              </View>
            ) : props.ibft2 ? (
              <View
                style={{overflow: 'hidden', width: wp(4.5), height: wp(4.5)}}>
                <Image
                  source={require('../../Assets/Icons/NewDrawer/etransactions.png')}
                  style={[
                    globalStyling.image,
                    {tintColor: activeTheme.tabNavigateLeftIcon},
                  ]}
                  resizeMode="contain"
                />
              </View>
            ) : null}
          </View>
          <View
            style={{
              width: props.tabHeading ? wp(80) : null,
              flexDirection: props.tabHeading
                ? 'column'
                : isRtlState()
                ? 'row'
                : 'row-reverse',
            }}>
            {props.tabHeading ? (
              <Text
                style={[
                  globalStyling.textFontNormal,
                  {
                    textAlign: isRtlState() ? 'left' : 'right',
                    fontFamily: props.boldFont
                      ? fontFamily[`ArticulatCF-Bold`]
                      : fontFamily['ArticulatCF-Normal'],
                    color: Colors.grey,
                  },
                ]}>
                {I18n[props.tabHeading]
                  ? I18n[props.tabHeading]
                  : props.tabHeading}
              </Text>
            ) : null}

            <Text
              boldFont={props.boldFont}
              style={[
                props.boldFont
                  ? globalStyling.textFontBold
                  : globalStyling.textFontNormal,

                {
                  width: props.textWidth
                    ? props.textWidth
                    : props.NewBiller
                    ? null
                    : '97%',
                  color: props.color
                    ? props.color
                    : activeTheme.tabNavigateTextBackground,
                  fontSize: props.fontSize ? props.fontSize : wp(4.5),
                  marginLeft: props.tabHeading ? wp(1) : wp(1),
                  textAlign: isRtlState() ? 'left' : 'right',
                },
              ]}
              numberOfLines={
                props.multipleLines && typeof props.multipleLines === 'number'
                  ? props.multipleLines
                  : 2
              }>
              {props.multipleLines ? null : ''}
              {I18n[props.text] ? I18n[props.text] : props.text}
            </Text>
          </View>
        </View>
        <View
          style={{
            flexDirection: isRtlState() ? 'row' : 'row-reverse',
            alignItems: 'center',
          }}>
          {props.NewBiller ? <NewView /> : null}
          {props?.arrowColor === 'white' ? null : isRtlState() ? (
            <Ionicons
              name={'chevron-forward'}
              size={props.arrowqqSize ? props.arrowSize : wp(8)}
              color={
                props.arrowColor
                  ? props.arrowColor
                  : activeTheme.tabNavigateRightIcon
              }
            />
          ) : (
            <Ionicons
              name={'chevron-back'}
              size={props.arrowSize ? props.arrowSize : wp(8)}
              color={
                props.arrowColor
                  ? props.arrowColor
                  : activeTheme.tabNavigateRightIcon
              }
            />
          )}
        </View>
      </View>
    </TouchableHighlight>
  );
});
export default TabNavigate;

const imageStyles = StyleSheet.create({
  wp7Styling: {overflow: 'hidden', width: wp(4.5), height: wp(4.5)},
});
