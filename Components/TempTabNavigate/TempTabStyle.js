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
export default styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '110%',
    alignItems: 'center',
    alignSelf: 'center',
    paddingVertical: wp(2),
    borderBottomWidth: wp(0.2),
    borderColor: 'lightgrey',
    borderRadius: wp(1),
  },
  subRow: {
    flexDirection: 'row',
    alignItems: 'center',
    // marginLeft: wp(1),
  },
  tabText: {fontSize: wp(2), width: '100%', fontWeight:'bold'},
});
