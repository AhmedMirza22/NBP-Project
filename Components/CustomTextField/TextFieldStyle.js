import {StyleSheet, Dimensions} from 'react-native';
import {Colors} from '../../Theme';
const screenHeight = Dimensions.get('window').height;
const screenWidth = Dimensions.get('window').width;
function wp(percentage) {
  const value = (percentage * screenWidth) / 100;
  return Math.round(value);
}
function hp(percentage) {
  const value = (percentage * screenHeight) / 100;
  return Math.round(value);
}
const heighto = Dimensions.get('screen').height;
const width = Dimensions.get('screen').width;
const margin = 20;

export default StyleSheet.create({
  text_container: {
    width: width / 1.08,
    height: wp(13),
    borderWidth: 1,
    borderColor: Colors.primary_green,
    backgroundColor: Colors.White,
    alignSelf: 'center',
    borderRadius: wp(1),
    flexDirection: 'row',
  },
  icon_style: {
    // alignSelf: 'center',
    // // marginLeft: wp(5),
    // paddingHorizontal: wp(2),
  },
  text_input: {
    width: width / 1.4,
    marginLeft: wp(3),
    height: heighto / 20,
    fontSize: wp(4.5),
    backgroundColor: 'transparent',
    justifyContent: 'center',
  },
});
