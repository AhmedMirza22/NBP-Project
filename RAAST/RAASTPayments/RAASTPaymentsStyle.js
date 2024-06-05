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
    backgroundColor: '#f3f4f4',
  },
  text: {
    fontSize: wp(4),
    fontWeight: 'bold',
    width: '90%',
    alignSelf: 'center',
    marginVertical: wp(7),
  },
  main_box_view: {
    width: screenWidth,
    backgroundColor: 'red',
  },

  textforRAASt: {
    width: '90%',
    alignSelf: 'center',
    fontSize: wp(4),
    paddingHorizontal: wp(3),
    paddingVertical: wp(4),
    marginVertical: wp(3),
    backgroundColor: 'white',
  },
  whiteContainer: {
    backgroundColor: 'white',
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
    marginVertical: wp(1),
    paddingHorizontal: wp(1),
    width: '50%',
  },
  marginVertical: {
    marginVertical: wp(1.5),
  },
});
