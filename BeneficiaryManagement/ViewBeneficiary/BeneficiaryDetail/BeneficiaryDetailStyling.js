import {StyleSheet, Dimensions} from 'react-native';
import {Colors} from '../../../../Theme';
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
    backgroundColor: Colors.backgroundColor,
  },
  headingText: {
    fontSize: wp(4.5),
    width: '95%',
    alignSelf: 'center',
    paddingVertical: wp(3),
  },
  gap: {
    // height: hp(3),
    marginLeft: wp(2),
    marginVertical: hp(1),
    // backgroundColor: 'red',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '95%',
    alignSelf: 'center',
    marginVertical: wp(2),
  },
  titleText: {
    fontSize: wp(3),
    color: 'grey',
    // width: '48%',
  },
  descriptionText: {
    fontSize: wp(4.5),
    // width: '48%',
  },
  buttonRow: {
    width: '80%',
    alignSelf: 'center',
    flexDirection: 'column',
    // justifyContent: 'space-around',
    alignItems: 'center',
  },
  inputText: {
    fontSize: wp(4),
    width: '48%',
    borderBottomColor: Colors.primary_green,
    borderBottomWidth: wp(0.15),
  },
});
