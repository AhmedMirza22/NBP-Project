import Carousel, { Pagination } from "react-native-snap-carousel";
import React, { Component } from "react";
import { View } from "react-native";
// import { colors } from "../../Constant/Colors";
// import LinearGradient from "react-native-linear-gradient";
import { hp, wp } from "../../Constant";

export default class MyCarousel extends Component {
  state = {
    activeSlide: 0,
    carouselRef: null,
  };

  _renderItem({ item, index }) {
    myLog.log("index ", index);
    return <MySlideComponent data={item} />;
  }

  get pagination() {
    return (
      <Pagination
        dotsLength={this.props.data.length}
        activeDotIndex={this.state.activeSlide}
        containerStyle={{
          backgroundColor: "transparent",
          padding: 0,
          margin: 0,
          // position: "absolute",
          // bottom: wp(-15),
          alignSelf: "center",
        }}
        dotElement={
        //   <LinearGradient
        //     start={{ x: 0, y: 0 }}
        //     end={{ x: 0.1, y: 2.5 }}
        //     colors={["#019676", "#016242", "#019676"]}
        //     style={{
        //       width: wp(12),
        //       height: wp(2),
        //       borderRadius: wp(50),
        //     }}
        //   />
        <View
        style={{
          width: wp(2),
          height: wp(2),
          borderColor: 'green',
          borderWidth: wp(0.2),
          borderRadius: wp(50),
          backgroundColor: 'green',
          marginHorizontal: wp(1),
        }}
      />
        }
        inactiveDotElement={
          <View
            style={{
              width: wp(2),
              height: wp(2),
              borderColor: 'gray',
              borderWidth: wp(0.2),
              borderRadius: wp(50),
              backgroundColor: 'gray',
              marginHorizontal: wp(1),
            }}
          />
        }
        dotStyle={{
          width: wp(2.5),
          height: wp(2.5),
          borderRadius: wp(50),
          backgroundColor: "rgba(0, 0, 0, 0.75)",
        }}
        inactiveDotStyle={
          {
            // Define styles for inactive dots here
          }
        }
        inactiveDotOpacity={0.4}
        inactiveDotScale={0.6}
        animatedFriction={1}
      />
    );
  }

  render() {
    return (
        <View style={{ height:hp(90) }}>
          <Carousel
            ref={(ref) => {
              // this.setState({
              //   carouselRef:ref
              // },()=>{
              // })
              this.props.getRef ? this.props.getRef(ref) : null;
            }}
            loopClonesPerSide={this.props.data.length}
            initialScrollIndex={this.props.initialScrollIndex}
            data={this.props.data}
            renderItem={this.props.renderItem}
            onSnapToItem={(index) =>
              this.setState({ activeSlide: index }, () => {
                this.props.getCurrentIndex
                  ? this.props.getCurrentIndex(this.state.activeSlide)
                  : null;
                // this.props.getRef?this.props.getRef(this.state.carouselRef):null
              })
            }
            sliderWidth={
              this.props.sliderWidth ? this.props.sliderWidth : wp(100)
            }
            itemWidth={this.props.itemWidth ? this.props.itemWidth : wp(100)}
            autoplay={this.props.stopAutoplay ? false : true}
            loop={true}
            layout={"default"}
          />

          {this.props.hidePagination ? null : this.pagination}
        </View>
    );
  }
}
