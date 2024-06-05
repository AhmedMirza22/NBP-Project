import {StyleSheet, Dimensions} from 'react-native';
import {Colors} from '../../../Theme';

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
    fontWeight: 'bold',
    width: '90%',
    alignSelf: 'center',
    marginVertical: wp(7),
  },
});
