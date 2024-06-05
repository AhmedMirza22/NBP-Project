import React from "react";
import { View ,TouchableOpacity,Text,Dimensions} from "react-native";
import styles from './DromdownStyle'
import Icon from 'react-native-vector-icons/MaterialIcons';
import {Colors} from '../../Theme'
const width = Dimensions.get('screen').width;

//text
//iswhite
//head_text
//onPress()

const CustomDropdown = (props) => {
    return (
        <>
        <Text style={styles.head_text}>{props.head_text}</Text>
        <TouchableOpacity style={[styles.text_container,{backgroundColor:props.iswhite?Colors.primary_green:Colors.White}]} onPress={()=>{props.onPress()}}>
            <Text style={[styles.text,{color:props.iswhite?Colors.White:Colors.primary_green}]}>{props.text}</Text>
            <Icon name={'keyboard-arrow-down'} size={30} style={{alignSelf:'center'}}
            color={props.iswhite?Colors.White:Colors.primary_green}/>
        </TouchableOpacity>
        </>
    );
};

export default CustomDropdown;
