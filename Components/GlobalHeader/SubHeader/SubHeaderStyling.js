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
    backgroundColor: 'white',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    width: '100%',
    alignSelf: 'center',
    borderColor: Colors.primary_green,
    height: wp(20),
    marginBottom: wp(0.15),
  },
  subRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  backArrowView: {
    width: wp(12),
    borderColor: Colors.primary_green,
    marginLeft: wp(4.5),
    marginRight: wp(2),
  },
  HomeButtonView: {
    backgroundColor: Colors.primary_green,
  },
  imageView: {
    width: wp(15),
    marginRight: wp(0.2),
    backgroundColor: Colors.primary_green,
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: wp(0.5),
  },
  titleText: {fontSize: wp(6), color: Colors.whiteColor},
  descriptionText: {
    fontSize: wp(3.7),
    color: Colors.whiteColor,
  },
  imageIcon: {
    height: '80%',
    width: '80%',
    overflow: 'hidden',
  },
});
