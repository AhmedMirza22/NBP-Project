import {wp} from '../../../../../../Constant';
import {StyleSheet} from 'react-native';

export default styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  imageBackgroundView: {
    width: '100%',
    alignSelf: 'center',
    // height: wp(70),
    overflow: 'hidden',
    marginLeft: wp(5),
    marginTop: wp(10),
  },
  image: {width: '100%', padding: wp(2),},
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '95%',
  },
  text: {color: 'white', fontSize: wp(4.2), marginVertical: wp(1)},
  screenShotView: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'center',
    width:wp(45),
    height:wp(10),
    marginVertical: wp(5),
    justifyContent:'space-evenly',
    backgroundColor:'#252f37', 
    borderRadius:wp(5),
    padding:wp(2)
  },
});
