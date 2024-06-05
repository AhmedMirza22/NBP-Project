import {StyleSheet, Dimensions} from 'react-native';
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
export default styles = StyleSheet.create({
  gap: {
    height: screenHeight / 30,
  },
  text: {
    fontWeight: 'bold',
    fontSize: wp(4),
    margin: wp(3),
  },
  lightText: {
    // fontWeight: 'bold',
    fontSize: wp(4),
    margin: wp(3),
  },
  marginVertical: {
    marginVertical: hp(1),
  },
});
