import {StyleSheet, Dimensions} from 'react-native';
import {Colors} from '../../Theme';
import {isRtlState} from '../../Config/Language/LanguagesArray';

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
    flexDirection: isRtlState() ? 'row' : 'row-reverse',
    justifyContent: 'space-between',
    width: wp(90),
    alignItems: 'center',
    // alignSelf: 'center',
    paddingHorizontal: wp(2),
    paddingVertical: wp(2),
    // borderBottomWidth: wp(0.2),
    borderColor: 'lightgrey',
    borderRadius: wp(1),
  },
  subRow: {
    flexDirection: isRtlState() ? 'row' : 'row-reverse',
    alignItems: 'center',
    // marginLeft: wp(3),
    backgroundColor: 'yellow',
  },
  tabText: {
    // fontSize: wp(4.5),
    // width: '90%',
  },
});
