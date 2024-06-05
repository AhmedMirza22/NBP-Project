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
    backgroundColor: '#f4f4f4',
  },
  text: {
    width: '92%',
    alignSelf: 'center',
    fontSize: wp(4.2),
    paddingVertical: wp(3),
    paddingLeft: wp(1),
    color: Colors.grey,
  },
  seperator: {
    marginVertical: wp(3),
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 20,
  },
  circle: {
    height: 18,
    width: 18,
    borderRadius: 12,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  filledCircle: {
    height: 10,
    width: 10,
    borderRadius: 7.5,
    backgroundColor: Colors.primary_green,
  },
  text: {
    marginLeft: 15,
    fontWeight: 'bold',
    fontSize: wp(4),
  },
});
