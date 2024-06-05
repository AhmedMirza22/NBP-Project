//import liraries
import React, { Component } from 'react';
import { TouchableOpacityBase } from 'react-native';
import { View, Text, StyleSheet ,TouchableOpacity,Image} from 'react-native';
import styles from './Custom_Header_Style'
import Icon from 'react-native-vector-icons/Ionicons'
import {Colors,Images} from '../../Theme'
// create a component
// right_image
const Custom_Header = (props) => {
    return (
        <View style={styles.container}>
            <View style={{flexDirection:'row'}}>
            <TouchableOpacity style={{alignSelf:'center',marginLeft:10  }} onPress={()=>{props.onPress()}}>
            <Icon name={'chevron-back'} size={27} color={Colors.header_left_btn_color} style={{alignSelf:'center'}}/>
            </TouchableOpacity>
            <View style={styles.head_text_view}>
                <Text style={styles.head_text}>{props.Head_text}</Text>
                <Text style={styles.sub_text}>{props.subText}</Text> 
            </View>
            </View>
           
            <Image source={props.right_image} style={styles.icon_style}/>
        </View>
    );
};

// define your styles


//make this component available to the app
export default Custom_Header;
