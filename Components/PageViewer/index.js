import React, {useRef} from 'react';
import {View, Text, Image, ImageBackground} from 'react-native';
import PagerView from 'react-native-pager-view';
import {useSelector} from 'react-redux';
import {globalStyling, wp} from '../../Constant';
import {Images} from '../../Theme';

export default function PageViewer(props) {
  const loginResponse = useSelector((state) => state.reducers.loginResponse);

  const pageViewer = () => {
    return (
      <View style={{flex: 10}}>
        {/* <PagerView
          //   ref={viewPager}
          scrollEnabled={true}
          style={{width: '98.5%', alignSelf: 'center', flex: 1}}
          initialPage={0}
          overScrollMode="auto">
          <View key="1" style={styles.image}>
            <Image
              source={Images.banner2}
              style={globalStyling.image}
              resizeMode="stretch"
            />
          </View>
          <View key="2" style={styles.image}>
            <Image
              source={Images.banner3}
              style={globalStyling.image}
              resizeMode="stretch"
            />
          </View>
          <View key="3" style={styles.image}>
            <Image
              source={Images.banner4}
              style={globalStyling.image}
              resizeMode="stretch"
            />
          </View>
          <View key="4" style={styles.image}>
            <ImageBackground
              source={Images.banner1}
              style={[
                globalStyling.image,
                {justifyContent: 'center', alignItems: 'center'},
              ]}>
              <Text style={styles.bannerText}>
                {' '}
                {loginResponse?.details?.accountTitle
                  ? `${loginResponse?.details?.accountTitle}`
                  : ''}{' '}
              </Text>
              {loginResponse?.details?.lastLoginDate ? (
                <Text style={[styles.bannerText, {fontSize: wp(4.5)}]}>
                  {' '}
                  Last Login: {loginResponse?.details?.lastLoginDate}
                </Text>
              ) : null}
            </ImageBackground>
          </View>
        </PagerView> */}
      </View>
    );
  };
  return <View>{pageViewer()}</View>;
}
