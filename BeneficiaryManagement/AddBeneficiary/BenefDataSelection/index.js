//import liraries
import React, {useEffect, useState} from 'react';
import {View, Text, StyleSheet, FlatList, TextInput, Image} from 'react-native';
import {Colors, Images} from '../../../../Theme';
import {
  setLoader,
  serviceResponseCheck,
  catchError,
  updateSessionToken,
  gettransferbanklist,
} from '../../../../Redux/Action/Action';
import {useDispatch, useSelector} from 'react-redux';
// create a component
import AsyncStorage from '@react-native-async-storage/async-storage';
import TabNavigator from '../../../../Components/TabNavigate/TabNavigate';
import SubHeader from '../../../../Components/GlobalHeader/SubHeader/SubHeader';
import {generalBank, logs, bas64nbpLogo} from '../../../../Config/Config';
import {isRtlState} from '../../../../Config/Language/LanguagesArray';
import {
  InternetCompanies,
  EducationInstitutions,
  GovernmentDepartments,
  InsuranceCompanies,
  OnlineShoppingLocations,
  InvestmentCompanies,
  OtherPayments,
} from '../../../../Constant/Data';
import analytics from '@react-native-firebase/analytics';
import {hp, wp} from '../../../../Constant';
import {fontFamily} from '../../../../Theme/Fonts';
import {getTokenCall, Service} from '../../../../Config/Service';
import I18n from '../../../../Config/Language/LocalizeLanguageString';
const BenefDataSelection = (props) => {
  // logs.log(MobilePhoneCompanyData, '190283109830128');
  const MobilePhoneCompanyData = [
    {id: 1, text: 'Zong', code: 'ZONG00'},
    // {id: 2, text: 'WARID', code: 'WARID0'},
    {id: 3, text: 'Ufone', code: 'UFONE0'},
    {id: 4, text: 'Telenor', code: 'TELNOR'},
    {id: 5, text: 'Mobilink', code: 'MBLINK'},
  ];
  const dispatch = useDispatch();
  let dataTrasnfer = props?.route?.params;
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [search, setSearcch] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const raastbank = useSelector((state) => state.reducers.bankList);

  const interBanksTransfer = async () => {
    dispatch(setLoader(true));
    logs.log('1293871928739172312');
    if (Object.keys(raastbank).length === 0) {
      dispatch(setLoader(false));
      dispatch(
        gettransferbanklist(props.navigation, (banks) => {
          let tempBank = banks.banks;
          tempBank.unshift({
            bankName: 'National Bank of Pakistan',
            imd: '123456',
            abbreviation: 'NBP',
            accountFormat: 'Enter the 14 digit account number',
            smallIcon: bas64nbpLogo.nbp,
          });
          setData(tempBank);
          logs.log(JSON.stringify(tempBank));
        }),
      );
    } else {
      dispatch(setLoader(false));

      setData(raastbank?.banks);
    }
    // try {
    //   dispatch(setLoader(true));
    //   const response = await getTokenCall(Service.getIBFTBanks);
    //   const responseData = response.data;
    //   logs.logResponse(responseData);
    //   if (response.data.responseCode === '00') {
    //     let tempBank = response?.data?.data?.banks;
    //     tempBank.unshift({
    //       bankName: 'National Bank of Pakistan',
    //       imd: '123456',
    //       abbreviation: 'NBP',
    //       accountFormat: 'Enter the 14 digit account number',
    //       smallIcon: bas64nbpLogo.nbp,
    //     });
    //     setData(tempBank);
    //     dispatch(setLoader(false));
    //     dispatch(updateSessionToken(response));
    //   } else {
    //     dispatch(serviceResponseCheck(response, props.navigation));
    //     logs.log(response);
    //     dispatch(catchError(response));
    //   }
    // } catch (error) {
    //   dispatch(setLoader(false));
    //   logs.log(`screen crash error : ${JSON.stringify(error)}`);
    //   dispatch(catchError(error));
    // }
  };
  // const internetBillPay = () => {
  //   setData(InternetCompanies);
  // };
  // const educationPay = () => {
  //   setData(EducationInstitutions);
  // };
  const mobilePay = () => {
    logs.log(MobilePhoneCompanyData, '12938719827192873');
    setData(MobilePhoneCompanyData);
  };
  // const govtpay = () => {
  //   setData(GovernmentDepartments);
  // };
  // const insurancePay = () => {
  //   setData(InsuranceCompanies);
  // };
  // const onlineShopingPay = () => {
  //   setData(OnlineShoppingLocations);
  // };
  // const investmentPay = () => {
  //   setData(InvestmentCompanies);
  // };
  // const otherPay = () => {
  //   setData(OtherPayments);
  // };
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
          dispatch(setLoader(false));
          setIsLoading(false);
          return savedData[objectKey];
        } else {
          console.log(`Data not found for object key=${objectKey}`);
          return null;
        }
      } else {
        console.log(`No data found for object key=${objectKey}`);
        return null;
      }
    } catch (error) {
      console.error('Error retrieving data:', error);
      return null;
    }
  };
  const getBillers = async (BillersTypeID) => {
    logs.log('12ui3618726381623', BillersTypeID);
    let biller; // function formatValue(value) {
    // Check if the value is less than 10
    if (BillersTypeID < 10) {
      // If less than 10, pad with '0' to make it two digits
      biller = BillersTypeID.toString().padStart(2, '0');
    } else {
      // If greater than or equal to 10, return the value as it is
      biller = BillersTypeID.toString();
    }
    logs.log('190283091283', biller);
    setData(await retrieveDataByChunkKey(biller));
    dispatch(setLoader(false));
  };
  useEffect(() => {
    dataTrasnfer?.benefType === 2
      ? interBanksTransfer()
      : dataTrasnfer?.benefType === 4
      ? mobilePay()
      : getBillers(dataTrasnfer?.benefType);
    async function analyticsLog() {
      await analytics().logEvent('BeneficiaryDataSelection');
    }
    analyticsLog();
  }, []);
  useEffect(() => {
    let tempData = data.filter((item) =>
      String(item.bankName).toLowerCase().includes(search.toLowerCase()),
    );
    setFilteredData(tempData);
  }, [search]);
  const renderAccountsFlatlist = ({item}) => (
    <TabNavigator
      border={true}
      dynamicIcon={
        item?.smallIcon
          ? item?.smallIcon
          : dataTrasnfer?.benefType != 2
          ? item?.billerImage
          : generalBank.icon
      }
      dynamicImage={dataTrasnfer?.benefType === 4 ? false : true}
      onlyMobileTopUp={dataTrasnfer?.benefType === 4 ? true : false}
      // textWidth={dataTrasnfer?.benefType == 2 ? null : '98%'}
      // tabHeading={dataTrasnfer?.benefType == 2 ? null : item.accountType}
      tabHeadingBold={true}
      tabHeadingColor={'black'}
      boldFont={true}
      text={
        dataTrasnfer?.benefType == 2
          ? `${item.bankName}`
          : dataTrasnfer?.benefType == 4
          ? `${item?.text}`
          : `${item?.companyName}`
      }
      accessibilityLabel={`${String(item.accountType).replace('-', ' ')}-${
        item.account
      }`}
      multipleLines={1}
      navigation={props.navigation}
      height={'20%'}
      textWidth={wp(60)}
      onPress={() => {
        // navigateTo={'BeneficiaryTransaction'}
        //   dataObject={{data: 'fundsTransfer', benefType: 1}}
        if (
          dataTrasnfer.benefType == 2 &&
          item.bankName == 'National Bank of Pakistan'
        ) {
          props.navigation.navigate('BeneficiaryTransaction', {
            data: 'fundsTransfer',
            benefType: 1,
            bankName: item.bankName,
          });
        } else {
          logs.log('pressed item', item);
          let tempItem = item;

          if (dataTrasnfer.benefType === 4) {
            tempItem.benefType = dataTrasnfer.benefType;
            tempItem.code = item?.code;
            tempItem.text = item?.text;
            dataTrasnfer.generalObj = tempItem;
          } else {
            tempItem.benefType = dataTrasnfer.benefType;
            tempItem.code = item?.companyID;
            tempItem.text = item?.companyName;
            dataTrasnfer.generalObj = tempItem;
          }

          // logs.log('2019830183=-=-=-=-', tempItem);
          props.navigation.navigate('BeneficiaryTransaction', dataTrasnfer);
        }
      }}
    />
  );
  const searchFiled = () => {
    return (
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
          placeholder={I18n['Search Bank']}
          style={{
            borderBottomColor: 'transparent',
            backgroundColor: Colors.tabNavigateBackground,
            fontFamily: fontFamily['ArticulatCF-Normal'],
            fontSize: wp(3.5),
            width: wp(70),
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
        />
      </View>
    );
  };
  return (
    <View style={[styles.container, {backgroundColor: Colors.backgroundColor}]}>
      <SubHeader
        navigation={props.navigation}
        title={'Add Beneficiary'}
        description={'Add Beneficiary in the list'}
      />
      {dataTrasnfer?.benefType == 2 ? searchFiled() : null}
      <View style={{height: hp(3)}} />
      <FlatList
        accessible={true}
        accessibilityLabel="Accounts List"
        showsVerticalScrollIndicator={false}
        renderItem={renderAccountsFlatlist}
        data={search.length == 0 ? data : filteredData}
        removeClippedSubviews={true}
        keyExtractor={(item, index) => String(index)}
        disableVirtualization={false}
      />
    </View>
  );
};
// define your styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.backgroundColor,
  },
});
//make this component available to the app
export default BenefDataSelection;
