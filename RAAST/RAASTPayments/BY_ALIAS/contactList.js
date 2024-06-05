//import liraries
import React, {useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Image,
  TextInput,
} from 'react-native';
import GlobalHeader from '../../../../Components/GlobalHeader/GlobalHeader';
import SubHeader from '../../../../Components/GlobalHeader/SubHeader/SubHeader';
import TabNavigator from '../../../../Components/TabNavigate/TabNavigate';
import {wp, globalStyling} from '../../../../Constant';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {Colors, Images} from '../../../../Theme';
import {setLoader, setUserObject} from '../../../../Redux/Action/Action';
import {useSelector, useDispatch} from 'react-redux';
import CustomTextField from '../../../../Components/CustomTextField/CustomTextField';
import {logs} from '../../../../Config/Config';
import {fontFamily} from '../../../../Theme/Fonts';
import I18n from '../../../../Config/Language/LocalizeLanguageString';
import {isRtlState} from '../../../../Config/Language/LanguagesArray';
// create a component
const MyComponent = (props) => {
  const dispatch = useDispatch();
  const [searchRes, setSearchRes] = useState([]);
  const [searchText, setSearchText] = useState('');
  const [searchState, setSearchState] = useState(false);
  const contactList = props?.route?.params?.contact;
  const isbenef = props?.route?.params?.isbenef;
  const addBenef = props?.route?.params?.addBenef;
  const addContact = props?.route?.params?.AddingContact;
  const searchTask = async (texts) => {
    logs.log(`search k ander=======${texts}`);
    setSearchText(texts);

    if (texts == '') {
      setSearchState(false);
      setSearchRes(contactList);
    } else {
      const newData = addBenef
        ? addBenef.filter(
            (item) =>
              (item?.displayName
                ? item.displayName.toLowerCase().includes(texts.toLowerCase())
                : item.displayName.includes(texts)) ||
              item.number.includes(texts),
          )
        : contactList.filter((item) =>
            item?.displayName
              ? item.displayName.toLowerCase().includes(texts.toLowerCase())
              : item.displayName.includes(texts),
          );
      logs.log(newData);
      setSearchRes(newData);
      setSearchState(true);
    }
  };
  const renderAccountsFlatlist = ({item}) => (
    <TouchableOpacity
      onPress={() => {
        logs.log(`item.number passed is ${item.number}`, props?.route?.params);
        if (isbenef) {
          dispatch(setUserObject({aliasPhoneNumber: item.number}));
          props.navigation.navigate('RAASTBeneficiary', {
            phoneNumber: item.number,
          });
        } else if (addContact) {
          console.log(
            'droping in else if contact  listss',
            props?.route?.params?.params,
          );
          props.navigation.navigate('BenefAdditionTransfer', {
            phoneNumber: item.number,
            ...props?.route?.params?.params,
          });
        } else {
          props.navigation.navigate('by_alias', {
            phoneNumber: item.number,
          });
        }
      }}>
      <View
        style={[
          styles.listMainContain,
          {backgroundColor: Colors.backgroundColor},
        ]}>
        <View style={{alignSelf: 'center', margin: wp(3)}}>
          <Ionicons
            name={'person-circle'}
            size={wp(12)}
            color={Colors.primary_green}
          />
        </View>
        <View style={{alignSelf: 'center'}}>
          <Text
            style={[
              globalStyling.textFontBold,
              styles.displayName,
              {color: Colors.textFieldText},
            ]}>
            {item?.displayName}
          </Text>
          <Text
            style={[
              globalStyling.textFontBold,
              styles.displayName,
              {color: Colors.textFieldText},
            ]}>
            {item?.number}
          </Text>
        </View>
      </View>
      {/* <View style={{height: 1, backgroundColor: 'grey', width: '100%'}}></View> */}
    </TouchableOpacity>
  );
  const List = () => {
    return (
      <FlatList
        showsVerticalScrollIndicator={false}
        renderItem={renderAccountsFlatlist}
        data={searchState ? searchRes : addBenef ? addBenef : contactList}
        removeClippedSubviews={true}
        keyExtractor={(item) => item?.id}
        disableVirtualization={false}
      />
    );
  };

  const Header = () => {
    return (
      <>
        <SubHeader
          navigation={props.navigation}
          title={
            isbenef
              ? 'Raast Beneficiary'
              : addBenef
              ? 'Contact List'
              : 'Raast Payments'
          }
          description={
            isbenef
              ? 'Add Raast Beneficiary'
              : addBenef
              ? ' '
              : 'Pay by RAAST ID'
          }
        />
      </>
    );
  };

  return (
    <View style={[styles.container, {backgroundColor: Colors.backgroundColor}]}>
      {Header()}
      {/* <View style={styles.gap}></View> */}
      <View
        style={{
          height: wp(13),
          width: wp(90),
          backgroundColor: Colors.textfieldBackgroundColor,
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
          value={searchText}
          placeholder={I18n['Search in Contacts..']}
          style={{
            borderBottomColor: 'transparent',
            backgroundColor: Colors.textfieldBackgroundColor,
            fontFamily: fontFamily['ArticulatCF-Normal'],
            fontSize: wp(3.5),
            width: wp(60),
          }}
          maxLength={40}
          onChangeText={(value) => searchTask(value)}
          placeholderTextColor={Colors.grey}
          textContentType="none"
          selectionColor={Colors.primary_green}
          underlineColor={'white'}
          autoCompleteType="off"
          mode={'flat'}
          autoCorrect={false}
          blurOnSubmit={true}
          underlineColorAndroid="transparent"
          color={Colors.textFieldText}
        />
      </View>
      {List()}
    </View>
  );
};

// define your styles
const styles = StyleSheet.create({
  container: {
    flex: 1,

    backgroundColor: Colors.backgroundColor,
  },
  listMainContain: {
    backgroundColor: 'white',
    alignSelf: 'center',
    width: wp(90),
    margin: wp(2),
    borderWidth: 1,
    borderColor: Colors.borderColor,
    borderRadius: wp(1),
    flexDirection: 'row',
  },
  displayName: {
    fontSize: wp(4.5),
    // fontWeight: 'bold',
    // margin: wp(1),
  },
  displayNum: {
    fontSize: wp(4),
    // fontWeight: 'bold',
    // margin: wp(1),
  },
  gap: {
    height: wp(5),
  },
});

//make this component available to the app
export default MyComponent;
