import {StyleSheet,Dimensions} from 'react-native';
import {Colors} from '../../Theme'; 
const width = Dimensions.get('screen').width;

export default StyleSheet.create({




    text_container: {
        width:width/1.08,
        height:45,
        alignSelf:'center',
        borderRadius:100,
        flexDirection:'row',
        
      },
      head_text:{marginLeft:30,marginBottom:5},
      text:{width:width/1.3,alignSelf:'center',marginLeft:20,fontSize:16}

})