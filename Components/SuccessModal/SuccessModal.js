import React from 'react';
import {
  View,
  FlatList,
  Text,
  Dimensions,
  TouchableHighlight,
  TouchableOpacity,
  Image,
  Linking,
} from 'react-native';
const width = Dimensions.get('screen').width;
const heighto = Dimensions.get('screen').height;
import {Colors, Images} from '../../Theme';
import Feather from 'react-native-vector-icons/Feather';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Modal from 'react-native-modal';
import styles from './SuccessModalStyle';
import {globalStyling, hp, wp} from '../../Constant';
import Custom_btn from '../Custom_btn/Custom_btn';
import CustomText from '../CustomText/CustomText';
import {logs} from '../../Config/Config';
//visible
//headtext
//data
//onPress_item(item)
//onPress_yes
//onPress_no

class CustomModal extends React.PureComponent {
  componentDidMount() {}
  render() {
    return (
      <Modal
        animationIn="slideInRight"
        animationOut="slideOutRight"
        backdropOpacity={0.3}
        isVisible={this.props.visible}
        onBackdropPress={() =>
          this.props.onCancel
            ? this.props.onCancel()
            : logs.log('backDrop Press')
        }>
        <View>
          <View
            style={{
              width: width / 1.09,
              backgroundColor: Colors.subContainer,
              borderRadius: 5,
            }}>
            <View style={styles.gap2}></View>

            <Image
              source={Images.successAlert}
              style={{alignSelf: 'center', width: wp(15), height: wp(15)}}
            />
            <View style={styles.gap2}></View>
            <CustomText
              style={{
                fontSize: this.props?.titleHeadSize
                  ? this.props?.titleHeadSize
                  : wp(4),
                alignSelf: 'center',
                fontWeight: 'bold',
              }}>
              {this.props.titleHead}
              {/* CONGRATULATIONS */}
            </CustomText>
            {/* <View style={styles.gap2}></View> */}

            <CustomText
              style={{
                alignSelf: 'center',
                textAlign: 'center',
                fontSize: this.props.messageSize ? this.props.messageSize : 20,
                marginHorizontal: 10,
                // fontWeight: 'bold',
              }}>
              {this.props.message}
            </CustomText>
            <View style={styles.gap2}></View>
            <CustomText
              style={{
                alignSelf: 'center',
                textAlign: 'center',
                marginHorizontal: 20,
                fontSize: 15,
              }}>
              {this.props.secondMessage}
            </CustomText>
            <View style={styles.gap2}></View>

            <View style={{flexDirection: 'row', alignSelf: 'center'}}>
              <TouchableOpacity
                style={{
                  backgroundColor: Colors.primary_green,
                  width: wp(70),
                  justifyContent: 'center',
                  borderRadius: wp(1),
                  height: wp(13),
                  marginVertical: wp(3),
                }}
                onPress={() => this.props.onPress_yes()}>
                <CustomText
                  style={[
                    globalStyling.textFontBold,
                    {
                      color: Colors.whiteColor,
                      fontSize: wp(5),
                      alignSelf: 'center',
                    },
                  ]}>
                  OK
                </CustomText>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    );
  }
}

export default CustomModal;
