import {StyleSheet, Dimensions} from 'react-native';
const heighto = Dimensions.get('screen').height;
const width = Dimensions.get('screen').width;
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
    // justifyContent: 'center',
    backgroundColor: 'white',
    overflow: 'hidden',
  },
  alignEnd: {
    alignSelf: 'flex-end',
  },
  widthCentered: {
    width: '80%',
    alignSelf: 'center',
  },
  title: {
    width: '90%',
    alignSelf: 'center',
    fontSize: wp(4),
    marginVertical: wp(2),
  },
  gap: {
    height: width / 35,
  },
  forget_pass_text: {
    fontSize: wp(4.5),
    alignSelf: 'center',
    textDecorationLine: 'underline',
  },
  login_footer: {
    flexDirection: 'row',
    width: width,
    justifyContent: 'space-evenly',
    position: 'absolute',
    bottom: wp(5),
  },
  icon_style: {
    alignSelf: 'center',
  },
  icon_text: {
    alignSelf: 'center',
    fontSize: wp(3.5),
    color: 'white',
  },
  img_bg: {
    zIndex: -1,
    width: width,
    height: heighto,
    position: 'absolute',
  },
  main_logo: {
    width: width,
    height: heighto / 7,
    resizeMode: 'contain',
    alignSelf: 'center',
    marginTop: hp(5),
  },
});
