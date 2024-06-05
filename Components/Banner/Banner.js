/* eslint-disable react/prop-types */
import {StyleSheet, Image, View, Modal} from 'react-native';
import React, {useEffect, useState} from 'react';
import {hp, wp} from '../../Constant';
import {Colors} from '../../Theme';
import Carousel, {Pagination} from 'react-native-snap-carousel';
import {logs} from '../../Config/Config';
const BannerComponent = ({data, onIndexChange}) => {
  const [isModal, setModal] = useState(false);
  const [carousalData, setCarousalData] = useState([]);
  const [carousalIndex, setCarousalIndex] = useState(0);

  useEffect(() => {
    if (data && data.length !== 0) {
      setTimeout(() => {
        setModal(true);
        // carousalTrigger(data.length);
      }, 2000);
    }
  }, [data]);

  const carousalTrigger = (noOfImagaes) => {
    setTimeout(() => {
      carousalIndex === 3 ? setModal(false) : null;
    }, 2000);

    // setTimeout(() => {
    //   setModal(false);
    // }, noOfImagaes * 2000);
  };

  useEffect(() => {
    carousalIndex === 3
      ? setTimeout(() => {
          setModal(false);
        }, 2000)
      : null;
  }, [carousalIndex]);

  useEffect(() => {
    if (data && data.length) {
      let tempArray = [];
      data.map((item) => {
        tempArray.push({image: item});
      });
      logs.log('TempArray', tempArray);
      setCarousalData(tempArray);
    }
  }, []);

  const _renderItem = ({item}) => {
    logs.log('Render Item....', item?.image?.image);
    return (
      <View
        style={{
          // width: wp(70),
          // height: hp(90),
          width: '100%',
          height: '100%',
          justifyContent: 'center',
          alignItems: 'center',
          alignSelf: 'center',
          alignContent: 'center',
        }}>
        <Image
          source={item?.image?.image}
          resizeMode={'contain'}
          style={{
            alignSelf: 'center',
            width: '100%',
            height: '100%',
            alignItems: 'center',
          }}
        />
      </View>
    );
  };

  return (
    <Modal transparent={true} visible={isModal} animationType={'fade'}>
      <View
        style={{
          width: '100%',
          height: '100%',
          backgroundColor: 'rgba(0, 0, 0,0.5)',
          justifyContent: 'center',
          alignSelf: 'center',
          alignItems: 'center',
        }}
        pointerEvents="none">
        {/* <View
          style={{
            width: '100%',
            height: '75%',
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: 'red',
          }}> */}
        <Carousel
          data={carousalData}
          renderItem={_renderItem}
          sliderWidth={300}
          itemWidth={300}
          windowSize={1}
          autoplay={true}
          autoplayInterval={2000}
          onSnapToItem={(index) => {
            logs.log('Index---------', index);
            setCarousalIndex(index);
            onIndexChange(index + 1); // Adding 1 so the index starts from 1 instead of 0
            // index === 2
            //   ? setTimeout(() => {
            //       setModal(false);
            //     }, 2000)
            //   : null;
            index === 2 ? logs.log('Printing Index', index) : null;
          }}
        />
        <Pagination
          dotsLength={carousalData.length}
          activeDotIndex={carousalIndex}
          containerStyle={styles.paginationContainer}
          dotColor={Colors.primary_green}
          inactiveDotColor={Colors.grey}
          inactiveDotOpacity={0.4}
          inactiveDotScale={0.6}
        />
      </View>
      {/* </View> */}
    </Modal>
  );
};

export default BannerComponent;

const styles = StyleSheet.create({
  activeDotStyle: {
    backgroundColor: Colors.primary_green,
    width: 10,
    height: 10,
  },
  dotStyle: {backgroundColor: Colors.grey, width: 10, height: 10},
  paginationContainer: {
    height: hp(2),
    width: wp(5),
    // backgroundColor: 'red',
    alignSelf: 'center',
    bottom: 60,
  },
});
