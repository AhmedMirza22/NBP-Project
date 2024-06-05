import {StyleSheet, Dimensions} from 'react-native';
import {Colors, ApplicationStyles} from '../../Theme';
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
const heighto = Dimensions.get('screen').height;
const width = Dimensions.get('screen').width;
const margin = 20;
export default styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  modal_container: {
    width: width / 1.08,
    height: 45,
    borderWidth: 1,
    borderColor: Colors.primary_green,
    backgroundColor: Colors.White,
    alignSelf: 'center',
    flexDirection: 'row',
  },
  gap: {
    height: heighto / 40,
  },
  gap2: {
    height: heighto / 50,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  seperator: {
    width: '99%',
    alignSelf: 'center',
    borderWidth: wp(0.2),
    borderColor: 'lightgrey',
  },
  itemText: {
    margin: 3,
    fontSize: wp(4.2),
    paddingVertical: wp(3),
  },
  green_box: {
    width: width / 1.09,
    height: heighto / 15,
    backgroundColor: Colors.primary_green,
    borderTopLeftRadius: 5,
    borderTopRightRadius: 5,
    justifyContent: 'center',
  },
});
