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
    backgroundColor: '#f4f4f4',
  },
  text: {
    fontSize: wp(4.2),
    width: '90%',
    alignSelf: 'center',
    marginVertical: wp(3),
  },
  text1: {
    fontSize: wp(4.2),
    // width: '90%',
    alignSelf: 'center',
    marginVertical: wp(3),
  },
  labelViewText: {
    width: '90%',
    alignSelf: 'center',
    padding: wp(5),
    backgroundColor: Colors.whiteColor,
    color: 'black',
    fontSize: wp(4),
    borderWidth: 1,
    borderColor: 'lightgrey',
  },
  accountText: {
    fontSize: wp(4),
    width: '90%',
    alignSelf: 'center',
    marginVertical: wp(3),
    color: 'grey',
  },
  infoText: {
    fontSize: wp(3.8),
    width: '84%',
    alignSelf: 'center',
    marginVertical: wp(4),
  },
  description: {
    fontSize: hp(2),
    width: '90%',
    alignSelf: 'center',
    color: 'grey',
  },
  marginvertical3: {position: 'absolute', bottom: wp(10), alignSelf: 'center'},
  textLabel: {
    fontSize: wp(4.2),
    marginLeft: wp(5),
  },
  gap: {
    height: wp(4),
  },
});
