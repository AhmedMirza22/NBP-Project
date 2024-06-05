import {StyleSheet, Dimensions} from 'react-native';
import {Colors} from '../../Theme';
import {wp} from '../../Constant';
const heighto = Dimensions.get('screen').height;
const width = Dimensions.get('screen').width;
export default StyleSheet.create({
  textAlert: {
    textAlign: 'center',
    fontSize: wp(4.5),
  },
  textAlert2: {
    alignSelf: 'flex-end',
    fontSize: wp(3.5),
    color: 'black',
    // width: '50%',
  },
  textAlert1: {
    alignSelf: 'flex-end',
    fontSize: wp(3.5),
    color: 'black',
  },
  greenText: {
    textAlign: 'center',
    fontSize: wp(4.5),
    color: Colors.primary_green,
    fontWeight: 'bold',
  },
  text2: {
    paddingVertical: wp(1.5),
    fontSize: wp(4),
    width: '95%',
    alignSelf: 'center',
  },
  label: {
    fontSize: wp(4),
    marginVertical: wp(3),
    width: '90%',
    alignSelf: 'center',
  },
  textLabel: {
    fontSize: wp(4.2),
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomWidth: wp(0.2),
  },
  imagePrint: {
    width: wp(10),
    height: wp(10),
    alignSelf: 'center',
    overflow: 'hidden',
    borderRadius: wp(3.7),
  },
  alert: {textAlign: 'center', fontSize: wp(4.2)},
  overlay: {
    width: width / 1.09,
    borderRadius: wp(1),
    backgroundColor: 'white',
  },
  gap: {
    height: heighto / 30,
  },
  alert_text: {
    // fontWeight: 'bold',
    fontSize: wp(4.2),
    alignSelf: 'center',
    // width: width / 1.6,
    width: '98%',
    // textAlign: 'center',
    paddingTop: wp(3),
  },
  title: {
    fontSize: wp(4.2),
    padding: wp(1),
    paddingLeft: wp(4),
  },
  yesNoButton: {
    width: wp(8),
  },
  titleView: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomWidth: wp(0.2),
  },
  image: {height: '100%', width: '100%'},
  imageView: {
    height: wp(45),
    width: '100%',
    alignSelf: 'center',
    overflow: 'hidden',
    marginVertical: wp(2),
  },
  text: {
    textAlign: 'center',
    fontSize: wp(4.2),
    fontWeight: 'bold',
  },
  note: {
    fontSize: wp(4),
    textAlign: 'center',
    width: '85%',
    alignSelf: 'center',
  },
  seperator: {
    borderWidth: wp(0.2),
    borderColor: 'grey',
    marginVertical: wp(2),
  },
  defaultAlertText: {
    paddingVertical: wp(2),
    paddingHorizontal: wp(4),
    marginHorizontal: wp(1),
    fontSize: wp(4.2),
    color: Colors.primary_green,
    fontWeight: 'bold',
  },
  rowView: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: wp(2),
    paddingHorizontal: wp(2),
  },
});
