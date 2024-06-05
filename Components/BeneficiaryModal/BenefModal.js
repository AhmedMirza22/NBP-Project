//import liraries
import React, {Component, useEffect, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Image,
  TouchableOpacity,
  TextInput,
  Modal,
  ScrollView,
  Platform,
  TouchableWithoutFeedback,
} from 'react-native';
// import Modal from 'react-native-modal';
import {logs} from '../../Config/Config';
import {globalStyling, hp, wp} from '../../Constant';
import {Colors, Images} from '../../Theme';
import CustomText from '../CustomText/CustomText';
import {useIsFocused} from '@react-navigation/native';
import {fontFamily} from '../../Theme/Fonts';
import SubHeader from '../GlobalHeader/SubHeader/SubHeader';
import I18n from '../../Config/Language/LocalizeLanguageString';
import {isRtlState} from '../../Config/Language/LanguagesArray';
import {useTheme} from '../../Theme/ThemeManager';
import Entypo from 'react-native-vector-icons/Entypo';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {CommonActions} from '@react-navigation/native';

const BenefModal = (props) => {
  const isFocused = useIsFocused();
  const [search, setSearcch] = useState('');
  const {activeTheme} = useTheme();
  const [searchArry, setSearcchArry] = useState([]);
  // const [modalVisible, setModalVisible] = useState(false);
  useEffect(() => {
    if (search.length === 0) {
      setSearcchArry(props?.data);
    } else {
      setSearcchArry(
        searchArry.filter(
          (item) =>
            String(item.benefAlias)
              .toLowerCase()
              .includes(search.toLowerCase()) ||
            String(item.benefAccount)
              .toLowerCase()
              .includes(search.toLowerCase()),
        ),
      );
    }
  }, [search]);
  useEffect(() => {
    setSearcchArry(props?.data);
  }, [props, isFocused]);

  const renderAccountsFlatlist = ({item}) => (
    <TouchableOpacity
      style={[
        globalStyling.benefPayRowView,
        {
          backgroundColor: activeTheme.subContainer,
          borderColor: activeTheme.textFieldBorderColor,
        },
      ]}
      onPress={() => {
        props?.onItemPress ? props?.onItemPress(item) : logs.log(item);
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
              ? require('../../Assets/Rast-transparetn.png')
              : item.benefType == '17'
              ? require('../../Assets/Rast-transparetn.png')
              : item.benefType == '18'
              ? require('../../Assets/Rast-transparetn.png')
              : require('../../Assets/Icons/NewDrawer/otherpayments.png')
          }
          style={{
            width: wp(5),
            height: wp(5),
            alignSelf: 'center',
            tintColor: activeTheme.tabNavigateLeftIcon,
          }}
        />
      </View>
      <View
        style={{
          backgroundColor: activeTheme.subContainer,
          width: '75%',
          paddingLeft: wp(1),
        }}>
        <View
          style={{
            backgroundColor: activeTheme.subContainer,
            flexDirection: 'column',
          }}>
          <CustomText
            style={[
              globalStyling.textFontBold,
              {
                fontSize: wp(3),
                backgroundColor: activeTheme.subContainer,
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
                : item.benefType == '18'
                ? 'Raast'
                : 'Others'}{' '}
            </Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );

  const noResultFound = () => {
    return (
      <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
        <View style={{flex: 0.6}}>
          <Image
            source={Images.noResultFound}
            resizeMode={'contain'}
            style={{
              width: hp(17),
              height: hp(17),
              margin: wp(3),
            }}
          />
          <CustomText
            boldFont={true}
            style={{fontSize: wp(4), alignSelf: 'center'}}>
            No Result Found!
          </CustomText>
        </View>
      </View>
    );
  };

  const mainView = () => {
    return (
      <View style={{flex: 1, backgroundColor: Colors.backgroundColor}}>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            width: '100%',
            alignSelf: 'center',
            borderBottomWidth: wp(0.2),
            borderColor: activeTheme.headerBackGroundColor,
            height: wp(20),
            backgroundColor: activeTheme.headerBackGroundColor,
            marginBottom: wp(0.15),
          }}>
          <View
            style={{
              width: wp(12),
              borderBottomWidth: wp(0.5),
              borderColor: activeTheme.headerBackGroundColor,
              marginLeft: wp(2.5),
              marginRight: wp(2),
            }}>
            <TouchableWithoutFeedback
              onPress={() => {
                props?.onBackdropPress
                  ? props?.onBackdropPress()
                  : logs.log('==========>');
              }}>
              <View
                style={{
                  backgroundColor: activeTheme.headerArrowColor,
                  width: wp(10),
                  height: wp(10),
                  borderRadius: wp(100),
                  justifyContent: 'center',
                }}>
                <Entypo
                  name={'chevron-thin-left'}
                  size={wp(5)}
                  color={Colors.whiteColor}
                  style={{alignSelf: 'center'}}
                />
              </View>
            </TouchableWithoutFeedback>
          </View>
          <View style={{width: isRtlState() ? wp(70) : wp(70)}}>
            <CustomText
              style={{
                fontSize: props.headerFont ? props.headerFont : wp(6),
                color: Colors.whiteColor,
                //width: isRtlState() ? null : wp(80),
              }}
              boldFont={true}>
              {props?.headTitle ? props?.headTitle : 'Inter Bank Fund Transfer'}
            </CustomText>
            <CustomText
              style={{fontSize: wp(3.7), color: Colors.whiteColor}}
              numberOfLines={1}>
              {props?.headDescription
                ? props?.headDescription
                : 'Transfer funds to other bank accounts'}
            </CustomText>
          </View>
          <View
            style={{
              width: wp(15),
              alignContent: 'center',
              justifyContent: 'center',
              alignItems: 'center',
              alignSelf: 'center',
            }}>
            <TouchableWithoutFeedback
              onPress={() => {
                props.navigation.dispatch(
                  CommonActions.reset({
                    index: 0,
                    routes: [{name: 'Home'}],
                  }),
                );
              }}>
              <View
                style={{
                  width: wp(10),
                  height: wp(10),
                  justifyContent: 'center',
                }}>
                <Ionicons
                  name={'home-outline'}
                  size={wp(7)}
                  color={Colors.whiteColor}
                  style={{alignSelf: 'center'}}
                />
              </View>
            </TouchableWithoutFeedback>
          </View>
        </View>

        {/* <SubHeader
          title={
            props?.headTitle ? props?.headTitle : 'Inter Bank Fund Transfer'
          }
          description={
            props?.headDescription
              ? props?.headDescription
              : 'Transfer funds to other bank accounts'
          }
          navigation={props.navigation}
          onPress={() => {
            props?.onBackdropPress
              ? props?.onBackdropPress()
              : logs.log('==========>');
          }}
        /> */}
        <View
          style={{
            height: wp(13),
            width: wp(90),
            backgroundColor: Colors.tabNavigateBackground,
            alignSelf: 'center',
            flexDirection: isRtlState() ? 'row' : 'row-reverse',
            borderWidth: 1,
            borderColor: Colors.borderColor,
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
            value={search}
            placeholder={I18n['Search Beneficiary']}
            style={{
              borderBottomColor: 'transparent',
              backgroundColor: Colors.tabNavigateBackground,
              fontFamily: fontFamily['ArticulatCF-Normal'],
              fontSize: wp(3.5),
              width: wp(70),
              color: Colors.textFieldText,
            }}
            maxLength={40}
            onChangeText={(value) => setSearcch(value)}
            placeholderTextColor={Colors.grey}
            textContentType="none"
            selectionColor={Colors.primary_green}
            underlineColor={'white'}
            autoCompleteType="off"
            mode={'flat'}
            autoCorrect={false}
            blurOnSubmit={true}
            underlineColorAndroid="transparent"
            // style={}
          />
        </View>
        {/* Search here */}
        {searchArry.length == 0 ? (
          noResultFound()
        ) : (
          <FlatList
            accessibilityLabel="Accounts List"
            showsVerticalScrollIndicator={false}
            renderItem={renderAccountsFlatlist}
            data={search.length == 0 ? props?.data : searchArry}
            removeClippedSubviews={true}
            keyExtractor={(item) => item.benefID}
            disableVirtualization={false}
            scrollEnabled={true}
          />
        )}
      </View>
    );
  };

  return props?.isVisible ? (
    <Modal
      backdropOpacity={0}
      animationType={'fade'}
      transparent={true}
      visible={props?.isVisible}
      onRequestClose={() => {
        props?.onBackdropPress ? props?.onBackdropPress() : logs.log();
      }}>
      <View
        style={[
          styles.centeredView,
          {marginTop: Platform.OS == 'ios' ? hp(5) : hp(0)},
        ]}>
        {mainView()}
      </View>
    </Modal>
  ) : null;
};

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    backgroundColor: Colors.backgroundColor,

    width: '100%',
  },
});

export default BenefModal;
