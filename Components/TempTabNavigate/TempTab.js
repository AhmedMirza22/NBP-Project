import React from 'react';
import {
  View,
  Dimensions,
  Text,
  TouchableHighlight,
  Image,
  StyleSheet,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
// import styles from './TabNavigateStyle';
import styles from './TempTabStyle';
import {Colors} from '../../Theme';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Fontisto from 'react-native-vector-icons/Fontisto';
import {globalStyling} from '../../Constant';
const screenWidth = Dimensions.get('window').width;
function wp(percentage) {
  const value = (percentage * screenWidth) / 100;
  return Math.round(value);
}
import Images from '../../Theme/Images';

class TempTabNavigate extends React.PureComponent {
  render() {
    return (
      <TouchableHighlight
        accessible={true}
        onPress={() =>
          this.props.onPress
            ? this.props.onPress()
            : this.props.dataObject
            ? this.props.navigation.navigate(
                this.props.navigateTo,
                this.props.dataObject,
              )
            : this.props.navigation.navigate(this.props.navigateTo)
        }
        underlayColor={this.props.hideOverlay ? null : Colors.primary_green}
        style={{
          width: this.props.width ? this.props.width : '90%',
          alignSelf: 'center',
          borderWidth: this.props.border ? wp(0.125) : wp(0.125),
          borderColor: this.props.border ? 'lightgrey' : null,
          borderRadius: wp(1),
        }}>
        <View
          style={[
            styles.row,
            {
              backgroundColor: this.props.backgroundColor
                ? this.props.backgroundColor
                : 'transparent',
              width: '97%',
            },
          ]}>
          <View style={styles.subRow}>
            <View>
              <View style={{overflow: 'hidden', width: wp(7), height: wp(7)}}>
                <Image
                  source={Images.alertIcon}
                  style={globalStyling.image}
                  resizeMode="contain"
                />
              </View>
            </View>
            <Text
              style={[
                styles.tabText,
                {
                  width: this.props.textWidth ? this.props.textWidth : '85%',
                  color: this.props.color ? this.props.color : 'black',
                  fontSize: this.props.fontSize ? this.props.fontSize : wp(4.5),
                  // margin: 10,
                },
              ]}
              numberOfLines={
                this.props.multipleLines ? this.props.multipleLines : 2
              }>
              {this.props.multipleLines ? null : ' '}
              {this.props.text}
            </Text>
          </View>
          <Ionicons
            name={'chevron-forward'}
            size={this.props.arrowSize ? this.props.arrowSize : wp(8)}
            color={this.props.arrowColor ? this.props.arrowColor : 'black'}
          />
        </View>
      </TouchableHighlight>
    );
  }
}

export default TempTabNavigate;

const imageStyles = StyleSheet.create({
  wp7Styling: {overflow: 'hidden', width: wp(7), height: wp(7)},
});
