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
  labelText: {
    fontSize: wp(4.2),
    alignSelf: 'center',
    width: '90%',
    paddingVertical: wp(5),
  },
  margined: {marginVertical: wp(15)},
  title: {
    width: '90%',
    alignSelf: 'center',
    fontSize: wp(4.2),
    marginVertical: wp(3),
  },
  marginTop: {
    marginTop: wp(5),
  },
});
