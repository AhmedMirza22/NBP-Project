import {StyleSheet, Dimensions} from 'react-native';
import {Colors} from '../../../../../Theme';
// import {Colors} from '../../../../../Theme';

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
  text: {
    fontSize: wp(4),
    width: '95%',
    alignSelf: 'center',
    // paddingVertical: wp(2),
  },
  rowStyling: {
    // flexDirection: 'row',
    // justifyContent: 'space-between',
    // alignItems: 'center',
    // width: '95%',
    // alignSelf: 'center',
  },
  titleText: {padding: wp(1), color: '#9ea3a6'},
  descriptionText: {padding: wp(1), fontSize: wp(4.45)},
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '90%',
    alignSelf: 'center',
    marginVertical: wp(5),
  },
});
