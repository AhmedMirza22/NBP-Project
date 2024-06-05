import {StyleSheet} from 'react-native';
import {hp, wp} from '../../Constant';
import {Colors} from '../../Theme';
export default styles = StyleSheet.create({
  imageView: {
    width: '100%',
    height: wp(50),
    overflow: 'hidden',
  },
  gap: {
    height: hp(3),
  },
  littleGap: {
    height: hp(1),
  },
  label: {
    textAlign: 'center',
    width: wp(90),
    fontSize: wp(4),
    alignSelf: 'center',
    marginVertical: wp(2),
  },
  flexEnd: {
    height: wp(30),
  },
  row: {
    flexDirection: 'column',
    // justifyContent: 'space-around',
    alignItems: 'center',
    // width: '80%',
    alignSelf: 'center',
  },
  text: {
    width: '90%',
    alignSelf: 'center',
    color: Colors.primary_green,
    fontSize: wp(4),
    textAlign: 'right',
  },
});
