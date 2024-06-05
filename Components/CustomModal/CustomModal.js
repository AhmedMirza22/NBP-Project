import React from 'react';
import {
  View,
  FlatList,
  Text,
  Dimensions,
  TouchableHighlight,
  TouchableWithoutFeedback,
  Image,
} from 'react-native';
import CustomText from '../CustomText/CustomText';
const width = Dimensions.get('screen').width;
import {Colors, Images} from '../../Theme';
import Feather from 'react-native-vector-icons/Feather';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Modal from 'react-native-modal';
import styles from './CustomModalStyle';
import {globalStyling, hp, wp} from '../../Constant';
import {GestureHandlerRootView, TextInput} from 'react-native-gesture-handler';
import {fontFamily} from '../../Theme/Fonts';
import {logs} from '../../Config/Config';
import I18n from '../../Config/Language/LocalizeLanguageString';

//visible
//headtext
//data
//onPress_item(item)

class CustomModal extends React.PureComponent {
  componentDidMount() {
    // console.log('this.props.data ',this.props.data);
  }
  render() {
    const renderModalList = ({item}) => (
      <TouchableHighlight
        underlayColor={Colors.primary_green}
        onPress={() => {
          this.props.onPress_item(item);
        }}>
        <View
          style={[
            styles.row,
            {
              borderBottomWidth: wp(0.2),
              borderColor: 'lightgrey',
            },
          ]}>
          <View
            style={{
              margin:
                this.props.beneficiaries ||
                this.props.beneficiaryData ||
                this.props.mobileTopUpBeneficiary ||
                this.props.alias ||
                this.props.alias_accounts
                  ? wp(1)
                  : wp(3),
              paddingVertical: wp(1),
              flexDirection: 'row',
              alignSelf: 'center',
            }}>
            {this.props.utilityBenef ? (
              <Image
                style={{
                  width: wp(5),
                  height: wp(5),
                  marginRight: wp(2),
                  // tintColor: Colors.tabNavigateLeftIcon,
                }}
                source={{uri: `${item?.billerImage}`}}
              />
            ) : null}
            {item.id == 4000 || item.id == 4001 ? (
              <Image
                style={{
                  width: wp(5),
                  height: wp(5),
                  marginRight: wp(2),
                  tintColor: Colors.tabNavigateLeftIcon,
                }}
                resizeMode="contain"
                source={
                  item.id == 4000
                    ? Images.cameraLineicon
                    : Images.galleryLineIcon
                }
              />
            ) : null}
            {this.props.beneficiaries ||
            this.props.beneficiaryData ||
            this.props.mobileTopUpBeneficiary ||
            this.props.alias ||
            this.props.alias_accounts ? (
              <CustomText
                style={
                  ([globalStyling.textFontBold],
                  {
                    backgroundColor: Colors.backgroundColor,
                  })
                }>
                {this.props.beneficiaries
                  ? `${item.benefAlias}`
                  : this.props.beneficiaryData
                  ? `${item.benefAlias}`
                  : this.props.mobileTopUpBeneficiary
                  ? `${item.accountType}`
                  : this.props.alias
                  ? `${item.alias_type}`
                  : this.props.alias_accounts
                  ? `${item.type}`
                  : null}
              </CustomText>
            ) : null}
            <CustomText style={[styles.itemText, globalStyling.textFontNormal]}>
              {item.complaintName
                ? item.complaintName
                : this?.props?.iban
                ? `${item.iban}`
                : this.props.beneficiaries
                ? `${item.benefAccount}`
                : this.props.beneficiaryData
                ? `${item.benefAccount}`
                : this.props.mobileTopUpBeneficiary
                ? `${item.account}`
                : this.props.accounts
                ? `${item['account']}`
                : this.props.accountNumber
                ? item.accountNumber
                : this.props.banks
                ? item.bankName
                : this.props.citycode
                ? item.cityName
                : this.props.product
                ? item.prod_name
                : this.props.utilityBenef
                ? item.companyName
                : this.props.alias
                ? `${item.alias_value}`
                : this.props.reason
                ? item.reason
                : this.props.action
                ? item.action
                : this.props.alias_accounts
                ? `${item.value}`
                : this.props.existingCardArray
                ? `${item.cardno}`
                : this.props.purpose
                ? item.purpose
                : this.props.raastbank
                ? item.participantName
                : item.text}
            </CustomText>
          </View>
          <Ionicons
            name={'chevron-forward'}
            size={wp(7)}
            color={Colors.tabNavigateRightIcon}
          />
        </View>
      </TouchableHighlight>
    );
    return (
      <Modal
        animationIn="slideInRight"
        animationOut="slideOutRight"
        backdropOpacity={0.3}
        onBackButtonPress={() => {
          setTimeout(() => {
            this.props.onCancel
              ? this.props.onCancel()
              : logs.log('backDrop Press');
          }, 300);
        }}
        isVisible={this.props.visible}
        onBackdropPress={() => {}}>
        <View
          style={{
            marginVertical: wp(10),
            // width: wp(),
            alignSelf: 'center',
            padding: wp(2),
            paddingHorizontal: wp(4),
            paddingBottom: this.props.data?.length > 8 ? wp(14) : wp(5),
            // width: wp(82),
            borderBottomLeftRadius: wp(1),
            borderBottomRightRadius: wp(1),
            // backgroundColor: Colors.whiteColor,
            height: '50%',
          }}>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
              alignSelf: 'center',
              backgroundColor: Colors.primary_green,
              paddingHorizontal: wp(3),
              width: wp(90),
              height: wp(13),
              borderTopLeftRadius: wp(1),
              borderTopRightRadius: wp(1),
            }}>
            <Text
              style={{
                fontSize: wp(4.3),
                fontFamily: fontFamily['ArticulatCF-DemiBold'],
                color: Colors.whiteColor,
              }}>
              {I18n[this.props.headtext]
                ? I18n[this.props.headtext]
                : this.props.headtext}
            </Text>
            <TouchableWithoutFeedback
              onPress={() => {
                this.props.onCancel();
              }}>
              <AntDesign
                size={wp(6)}
                name="closecircle"
                color={Colors.whiteColor}
                // style={{backgroundColor:Colors.whiteColor}}
              />
              {/* <Image
                source={Images.closeBtn}
                style={{width: wp(6), height: wp(6)}}
              /> */}
            </TouchableWithoutFeedback>
            {/* <AntDesign
              name={'closecircle'}
              size={wp(5)}
              color={Colors.whiteColor}
              onPress={() => {
                this.props.onCancel();
              }}
            /> */}
          </View>

          <View
            style={{
              backgroundColor: Colors.modalBackGround,
              // marginVertical: wp(10),
              width: wp(90),
              alignSelf: 'center',
              // padding: wp(5),
              borderBottomLeftRadius: wp(1),
              borderBottomRightRadius: wp(1),
              paddingHorizontal: wp(2),
            }}>
            {/* {this.props.searchable ? <View style={styles.seperator} /> : null} */}
            {this.props.searchable ? (
              <View
                style={{
                  marginTop: wp(2),
                  borderRadius: wp(1),
                  backgroundColor: Colors.childContainer,
                  padding: wp(2.3),
                }}>
                <TextInput
                  onChangeText={(searchText) => {
                    this.props.onChangeText
                      ? this.props.onChangeText(searchText)
                      : null;
                  }}
                  // style={{backgroundColor: 'yellow', height: wp(10)}}
                  style={{
                    fontSize: wp(4.2),
                    fontFamily: fontFamily['ArticulatCF-Normal'],
                    backgroundColor: Colors.childContainer,
                    color: Colors.mainTextColors,
                  }}
                  placeholder={I18n['Search City']}
                  placeholderTextColor={Colors.grey}
                />
              </View>
            ) : null}
            {!this.props.data || this.props.data?.length === 0 ? (
              <View>
                <Text
                  style={{
                    textAlign: 'center',
                    paddingVertical: wp(5),
                    fontSize: wp(4.5),
                  }}>
                  No Data to Show
                </Text>
              </View>
            ) : (
              <FlatList
                data={this.props.data}
                keyExtractor={(item, index) => index.toString()}
                renderItem={renderModalList}
                ListFooterComponent={<View />}
                ListFooterComponentStyle={{marginBottom: wp(3)}}
              />
            )}
          </View>
        </View>
      </Modal>
    );
  }
}

export default CustomModal;
