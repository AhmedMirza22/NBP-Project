import {StyleSheet, Dimensions} from 'react-native';
import {Colors} from '../../../../../Theme';

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
    backgroundColor: Colors.backgroundColor,
  },
  title: {
    fontSize: wp(4.2),
    color: 'white',
    paddingVertical: wp(1),
    paddingHorizontal: wp(1),
  },
  rowStyling: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '95%',
    alignSelf: 'center',
  },
  titleText: {
    fontSize: wp(4.5),
    color: 'grey',
    paddingTop: wp(2),
  },
  descriptionText: {
    fontSize: wp(4.5),
    paddingTop: wp(2),
    width: '60%',
    textAlign: 'right',
    marginRight: wp(1),
  },
  touchableView: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '99%',
    alignSelf: 'center',
    marginTop: wp(2),
    backgroundColor: 'white',
  },
  touchableText1: {
    fontSize: wp(3.8),
    width: wp(25),
    backgroundColor: 'lightgrey',
    fontWeight: 'bold',
    textAlign: 'center',
    padding: wp(3),
    borderBottomWidth: wp(0.5),
    borderBottomColor: Colors.primary_green,
  },
  touchableText2: {
    fontSize: wp(3.8),
    width: wp(25),
    fontWeight: 'bold',
    textAlign: 'center',
    padding: wp(3),
  },
  touchableText3: {
    fontSize: wp(3.7),
    width: wp(25),
    fontWeight: 'bold',
    textAlign: 'center',
    padding: wp(3),
  },
  seperator: {
    borderWidth: wp(4),
    borderColor: Colors.primary_green,
    marginVertical: wp(1),
    width: '99%',
    alignSelf: 'center',
  },
  amountView: {
    width: '99%',
    alignSelf: 'center',
    borderBottomWidth: wp(0.125),
    backgroundColor: 'white',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  amountText: {
    fontSize: wp(4),
    paddingVertical: wp(2),
  },
  iosDoneLabel:{fontSize:wp(4.5),width:'80%',alignSelf:'center',color:'#006ee6',letterSpacing:wp(0.5),fontWeight:'bold',textAlign:'right',paddingTop:wp(3)},
  headingText:{
    fontSize:wp(4.5),
    textAlign:'center',
    marginVertical:wp(22)
  },
  defStyle:{
    width: '100%',
          flexDirection: 'row',
          alignItems: 'center',
          marginVertical: wp(1),
          justifyContent: 'space-between',
        
  }
});
