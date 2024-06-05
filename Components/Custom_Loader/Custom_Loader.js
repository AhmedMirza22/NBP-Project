import React from 'react';
import {View, Image, StyleSheet} from 'react-native';
import {wp, hp} from '../../Constant';
import {Images} from '../../Theme';
export default function Custom_Loader(props) {
  return props.visible ? (
    <View style={styles.fullScreenView}>
      <View style={styles.loaderView}>
        <Image
          source={Images.nbp_loader}
          style={styles.image}
          resizeMode="contain"
        />
      </View>
    </View>
  ) : null;
}

const styles = StyleSheet.create({
  fullScreenView: {
    position: 'absolute',
    height: hp(100),
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(52, 52, 52, 0.3)',
  },
  loaderView: {
    width: wp(12),
    height: wp(12),
    overflow: 'hidden',
    position: 'absolute',
    opacity: 1,
  },
  image: {width: '100%', height: '100%'},
});
