import {StyleSheet, Dimensions} from 'react-native';
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
  item: {
    fontSize: wp(3.5),
    marginVertical: wp(1),
    paddingHorizontal: wp(1),
    width: '49%',
  },
  rowContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  whiteContainer: {
    backgroundColor: 'white',
    width: '90%',
    alignSelf: 'center',
  },
  text: {
    fontSize: wp(4),
    fontWeight: 'bold',
    width: '90%',
    alignSelf: 'center',
    marginVertical: wp(7),
  },
  gap: {
    height: screenHeight / 30,
  },
});
