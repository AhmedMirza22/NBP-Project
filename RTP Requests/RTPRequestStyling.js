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
export default StyleSheet.create({
  container: {
    flex: 1,
  },
  text: {
    width: '90%',
    alignSelf: 'center',
    fontSize: wp(4),
    paddingHorizontal: wp(3),
    paddingVertical: wp(4),
    marginVertical: wp(3),
    backgroundColor: Colors.whiteColor,
  },
  whiteContainer: {
    backgroundColor: Colors.whiteColor,
    width: '90%',
    alignSelf: 'center',
  },
  rowContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  item: {
    fontSize: wp(4),
    paddingVertical: wp(1),
    paddingHorizontal: wp(1),
  },
  marginVertical: {
    marginVertical: wp(1.5),
  },
});
