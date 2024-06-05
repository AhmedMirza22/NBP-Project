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
    fontSize: wp(5),
    fontWeight: 'bold',
    width: '90%',
    alignSelf: 'center',
    marginVertical: wp(3),
    color: '#9ea3a6',
  },
  main_box_view: {
    width: screenWidth,
    backgroundColor: 'red',
  },
  gap: {
    height: screenHeight / 30,
  },
  textField: {
    padding: wp(2),
    backgroundColor: 'white',
    alignSelf: 'center',
    textAlign: 'center',
    borderRadius: wp(1),
    borderWidth: 1,
    borderColor: 'lightgrey',
    fontSize: wp(4),
  },
});
