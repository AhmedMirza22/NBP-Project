import React from 'react'
import {View,Text,TouchableWithoutFeedback,TouchableOpacity} from 'react-native'
import QRCode from 'react-native-qrcode-svg';
import Modal from 'react-native-modal';
import { useSelector,useDispatch } from 'react-redux';
import { globalStyling, wp } from '../../Constant';
import {setQrGenerateState} from '../../Redux/Action/Action'
export default function QrGenerator(props){
    const qrGenerateState=useSelector((state)=>state.reducers.qrGenerateState)
    const qrGenerateValue=useSelector((state)=>state.reducers.qrGenerateValue)
    const dispatch=useDispatch()
    return(
        <Modal
        // animationIn="slideInRight"
        // animationOut="slideOutRight"
        backdropOpacity={1}
        isVisible={qrGenerateState}
        onBackdropPress={() => {}}>
        {/* <View style={{width:'95%',alignSelf:'center'}}> */}
        <TouchableWithoutFeedback  
        onPress={()=>dispatch(setQrGenerateState(false))}
        >
          <View style={globalStyling.whiteContainer}>
        <View style={{width:wp(50),alignSelf:'center',marginTop:wp(50)}}>
        <QRCode
       value={qrGenerateValue}
       size={wp(50)}
       logo={require('../../Assets/unionpay.png')}
       logoSize={wp(10)}
       logoBackgroundColor={'transparent'}
       logoMargin={5}
     />
     </View>
        </View>
        </TouchableWithoutFeedback>
        {/* </View> */}
      </Modal>
    
    )
}
