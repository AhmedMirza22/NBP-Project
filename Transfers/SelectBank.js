import React, {useEffect, useState} from 'react';
import {View, FlatList, Image, TextInput} from 'react-native';
import SubHeader from '../../Components/GlobalHeader/SubHeader/SubHeader';
import {useSelector, useDispatch} from 'react-redux';
import TabNavigator from '../../Components/TabNavigate/TabNavigate';
import {
  setCurrentFlow,
  gettransferbanklist,
  setUserObject,
  helpInforamtion,
  updateSessionToken,
  serviceResponseCheck,
  setLoader,
  catchError,
  setRaastList,
} from '../../Redux/Action/Action';

import styles from './TransfersStyling';
import {bas64nbpLogo, generalBank, logs} from '../../Config/Config';
import {hp, wp} from '../../Constant';
import {Colors, Images} from '../../Theme';
import {fontFamily} from '../../Theme/Fonts';
import CustomText from '../../Components/CustomText/CustomText';
import {isRtlState} from '../../Config/Language/LanguagesArray';
import I18n from '../../Config/Language/LocalizeLanguageString';
import InformationIcon from '../../Components/InformationIcon/InformationIcon';
import {Service, getTokenCall} from '../../Config/Service';
export default function SelectBanks(props) {
  const raastbank = useSelector((state) => state.reducers.bankList);
  const dispatch = useDispatch();
  const [BankList, setBankList] = useState([]);

  useEffect(() => {
    props.navigation.addListener(
      'focus',
      () => {
        dispatch(setCurrentFlow('Select Bank'));
      },
      [],
    );
  }, []);

  const bankList = (item) => {
    const temp = item?.item;
    return (
      <TabNavigator
        accessibilityLabel="Bank Name"
        text={temp?.name}
        border={true}
        multipleLines={1}
        boldFont={true}
        textWidth={wp(60)}
        onPress={() => {
          let data = {
            bankName: temp?.name,
            imd: temp?.imd,
            accountFormat: temp?.accountFormat,
            isDirectPayment: true,
            benefTrans: false,
            memberId: temp?.participantCode,
            tfenable: temp?.tfenable,
            active: temp?.active,
          };
          dispatch(
            setUserObject({
              ftPayment: data,
            }),
          );
          temp?.name === 'National Bank of Pakistan'
            ? props.navigation.navigate('FundsTransfer', {data: data})
            : props.navigation.navigate('InterBankFundsTransfer', {data: data});
        }}
        navigation={props.navigation}
        dynamicIcon={temp?.smallIcon ? temp?.smallIcon : generalBank.icon}
        dynamicImage={true}
      />
    );
  };
  const getMerchantNotification = async (token) => {
    try {
      dispatch(setLoader(true));

      const response = await getTokenCall(Service.getallbanks);
      const responseData = response.data;
      logs.log('response---->', responseData);
      if (
        response.data.responseCode === '00' ||
        response.data.responseCode === '200'
      ) {
        dispatch(updateSessionToken(response));
        dispatch(setLoader(false));
        let tempBank = responseData?.data;
        tempBank.unshift({
          name: 'National Bank of Pakistan',
          imd: '123456',
          abbreviation: 'NBP',
          accountFormat: 'Enter the 14 digit account number',
          smallIcon: bas64nbpLogo.nbp,
        });
        setBankList(tempBank);
        dispatch(setRaastList(tempBank));
      } else {
        dispatch(serviceResponseCheck(response, props.navigation));
        // setIsLoader(false);
        dispatch(setLoader(false));
      }
    } catch (error) {
      dispatch(setLoader(false));
      dispatch(catchError(error));
    }
  };
  useEffect(() => {
    if (Object.keys(raastbank).length === 0) {
      getMerchantNotification();
    } else {
      setBankList(raastbank);
    }
  }, []);

  // useEffect(() => {
  //   if (Object.keys(raastbank).length === 0) {
  //     dispatch(
  //       gettransferbanklist(props.navigation, (banks) => {
  //         let tempBank = banks.banks;
  //         tempBank.unshift({
  //           bankName: 'National Bank of Pakistan',
  //           imd: '123456',
  //           abbreviation: 'NBP',
  //           accountFormat: 'Enter the 14 digit account number',
  //           smallIcon: bas64nbpLogo.nbp,
  //         });
  //         // setBankList(tempBank);
  //         logs.log('setBankList----', JSON.stringify(tempBank));
  //       }),
  //     );
  //   } else {
  //     setBankList(raastbank?.banks);
  //   }
  // }, []);

  const [searchText, setSearchText] = useState('');
  const [filteredData, setFilteredData] = useState([]);

  const handleSearch = (text) => {
    setSearchText(text);

    const filtered = BankList.filter(
      (item) =>
        item.name.toLowerCase().includes(text.toLowerCase()) ||
        item?.abbreviation?.toLowerCase()?.includes(text?.toLowerCase()),
    );
    setFilteredData(filtered);
  };

  return (
    <View
      style={[styles.container, {backgroundColor: Colors.backgroundColor}]}
      accessibilityLabel="Select Type of Transfer">
      {/* <GlobalHeader navigation={props.navigation} /> */}
      <SubHeader
        // transfers={true}
        navigation={props.navigation}
        title="Fund Transfers"
        description="Transfer Funds to other account"
        navigateHome={true}
      />
      <View style={{height: hp(2.5)}} />

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
            value={searchText}
            placeholder={I18n['Search Bank']}
            style={{
              borderBottomColor: 'transparent',
              backgroundColor: Colors.textfieldBackgroundColor,
              fontFamily: fontFamily['ArticulatCF-Normal'],
              width: wp(50),
              color: Colors.textFieldText,
            }}
            maxLength={40}
            onChangeText={(value) => handleSearch(value)}
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
      <FlatList
        data={searchText === '' ? BankList : filteredData}
        renderItem={bankList}
        showsVerticalScrollIndicator={false}
        keyExtractor={(item, index) => String(index)}
        ListEmptyComponent={() => {
          return (
            <>
              <View style={{height: hp(15)}} />
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
                    style={{
                      fontSize: wp(4),
                      marginTop: hp(1),
                      alignSelf: 'center',
                    }}>
                    No Result Found
                  </CustomText>
                  <View style={{height: hp(5)}} />
                </View>
              </View>
            </>
          );
        }}
      />
      <InformationIcon
        onPress={() => {
          dispatch(
            helpInforamtion({
              title: 'Transfer',
              page: 'ibftandft',
              state: true,
            }),
          );
        }}
      />
    </View>
  );
}
