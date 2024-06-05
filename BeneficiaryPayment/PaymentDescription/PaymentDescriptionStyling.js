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
    paddingVertical: wp(3),
  },
  title: {
    fontSize: wp(4),
    padding: wp(5),
    width: '95%',
    alignSelf: 'center',
    marginVertical: wp(3),
    backgroundColor: 'white',
  },
  viewStyle: {
    width: '95%',
    padding: wp(5),
    backgroundColor: 'white',
    alignSelf: 'center',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  text: {
    fontSize: wp(4),
    width: '45%',
  },
  textAligned: {
    fontSize: wp(4),
    width: '45%',
    textAlign: 'right',
  },
  margined: {
    marginVertical: wp(3),
  },
});
