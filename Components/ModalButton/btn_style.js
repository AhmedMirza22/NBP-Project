// import {StyleSheet, Dimensions} from 'react-native';
// import {Colors} from '../../Theme';
// const screenHeight = Dimensions.get('window').height;
// const screenWidth = Dimensions.get('window').width;
// function wp(percentage) {
//   const value = (percentage * screenWidth) / 100;
//   return Math.round(value);
// }
// const heighto = Dimensions.get('screen').height;
// const width = Dimensions.get('screen').width;
// export default StyleSheet.create({
//   container: {
//     flex: 1,
//     justifyContent: 'center',
//   },
//   gap: {
//     height: heighto / 40,
//   },
//   btn_container: {
//     backgroundColor: Colors.primary_green,
//     height: wp(12),
//     justifyContent: 'center',
//     alignItems: 'center',
//     alignSelf: 'center',
//     borderRadius: wp(4),
//     marginBottom:wp(2)
//   },
// });

import {StyleSheet, Dimensions} from 'react-native';
import {Colors} from '../../Theme';
const screenHeight = Dimensions.get('window').height;
const screenWidth = Dimensions.get('window').width;
function wp(percentage) {
  const value = (percentage * screenWidth) / 100;
  return Math.round(value);
}
const heighto = Dimensions.get('screen').height;
const width = Dimensions.get('screen').width;
export default StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
  },
  gap: {
    height: heighto / 40,
  },
  btn_container: {
    backgroundColor: Colors.primary_green,
    // width: width / 3,
    height: wp(11),
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    borderRadius: wp(1),
    marginBottom: wp(1),
  },
});
