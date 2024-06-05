import {StyleSheet, Dimensions} from 'react-native';
import {Colors} from '../../../../Theme';
// import { Colors } from 'react-native/Libraries/NewAppScreen';

// const screenHeight = Dimensions.get('window').height;
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
  label: {
    alignSelf: 'center',
    fontSize: wp(4.5),
    marginVertical: wp(3),
  },
  label1: {
    width: '88%',
    alignSelf: 'center',
    fontSize: wp(4.5),
    marginVertical: wp(3),
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
  },
  infoText: {
    fontSize: wp(3.8),
    width: '90%',
    alignSelf: 'flex-start',
    left:wp(6)
    // marginVertical: wp(4),

  },
});
