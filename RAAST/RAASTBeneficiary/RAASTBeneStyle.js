import {StyleSheet, Dimensions} from 'react-native';
import {Colors} from '../../../Theme';
import {wp} from '../../../Constant';
const heighto = Dimensions.get('screen').height;
const width = Dimensions.get('screen').width;

export default StyleSheet.create({
  //Registeration Step1 styles
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  gap: {
    marginVertical: wp(3),
  },
  little_gap: {
    height: heighto / 50,
  },
  label: {
    fontSize: wp(4.5),
    marginVertical: wp(3),
    width: '90%',
    alignSelf: 'center',
  },
  label1: {
    fontSize: wp(4.2),
    marginVertical: wp(3),
  },
  //Registeration Step2 styles
  //Registeration Step 3 styles
  pinView: {
    alignSelf: 'center',
    alignItems: 'center',
  },
  text_container: {
    width: wp(90),
    padding: wp(3.5),
    borderWidth: wp(0.35),
    borderColor: Colors.grey,
    // backgroundColor: 'white',
    alignSelf: 'center',
    borderRadius: wp(1),
    // flexDirection: 'row',
  },
  seperator: {
    width: '100%',
    alignSelf: 'center',
    borderWidth: wp(0.13),
    borderColor: 'silver',
    marginTop: wp(2),
  },
  icon_style: {
    alignSelf: 'center',
    marginLeft: 20,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
    paddingVertical: wp(4),
  },
  textlabel: {
    width: '90%',
    alignSelf: 'center',
    fontSize: wp(4.5),
    paddingVertical: wp(3),
  },
  checkRow: {
    width: '85%',
    alignSelf: 'center',
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: wp(5),
  },

  heading: {
    width: '88%',
    alignSelf: 'center',
    fontSize: wp(6),
    fontWeight: 'bold',
  },
  text: {
    fontSize: wp(5),
    color: Colors.labelGrey,
    paddingVertical: wp(1),
    paddingLeft: wp(5.5),
    paddingRight:wp(5.5),
  },
  titleText: {
    alignSelf: 'center',
    fontSize: wp(4.5),
    width: '95%',
    textAlign: 'center',
    marginVertical: wp(2),
  },
  whiteContainer: {
    backgroundColor: Colors.whiteColor,
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
    paddingVertical: wp(1),
    paddingHorizontal: wp(1),
    // fontWeight: 'bold',
  },
  marginVertical: {
    marginVertical: wp(1.5),
  },
  main_box_view: {
    width: width,
    backgroundColor: 'red',
  },
  gapBenef: {
    height: heighto / 30,
  },
  textBenef: {
    fontWeight: 'bold',
    fontSize: wp(4),
    margin: wp(3),
  },
  lightText: {
    // fontWeight: 'bold',
    fontSize: wp(4),
    margin: wp(3),
  },
});
