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
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  text: {
    fontSize: wp(4),
    fontWeight: 'bold',
    width: '90%',
    alignSelf: 'center',
    marginVertical: wp(7),
  },
  main_box_view: {
    // height: screenHeight / 1,
    justifyContent: 'center',
    // backgroundColor: 'red',
  },
  gap: {
    height: screenHeight / 30,
  },
  littlegap: {
    height: screenHeight / 55,
  },
});
