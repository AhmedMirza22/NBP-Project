import {StyleSheet, Dimensions} from 'react-native';
import {Colors} from '../../Theme';
const heighto = Dimensions.get('screen').height;
const width = Dimensions.get('screen').width;
export default StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: 'white',
    height: heighto / 17,
    width: width,
    justifyContent: 'space-between',
    marginTop: 10,
  },
  head_text_view: {
    flexDirection: 'column',
    alignSelf: 'center',
    marginLeft: 20,
  },
  head_text: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  sub_text: {
    fontSize: 15,
    color: 'darkgrey',
  },
  icon_style: {
    width: width / 9,
    height: width / 9,
    resizeMode: 'contain',
    alignSelf: 'center',
    marginRight: 10,
  },
});
