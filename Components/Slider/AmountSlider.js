import React, {useState, useEffect} from 'react';
import {View, Slider, StyleSheet, TouchableOpacity} from 'react-native';
import {logs} from '../../Config/Config';
import {Colors} from '../../Theme';
import {wp, hp, currencyFormat} from '../../Constant';
import CustomText from '../CustomText/CustomText';
import {useTheme} from '../../Theme/ThemeManager';

const AmountSlider = (props) => {
  const {activeTheme} = useTheme();
  const [limitAmount, setLimitAmount] = useState(
    props.currentCustomerLimitAmount,
  );
  const [selectedPercentage, setSelectedPercentage] = useState(null);
  const [clickedPosition, setClickedPosition] = useState(null);
  const percentages = [0, 25, 50, 75, 100];
  useEffect(() => {
    const percentage = calculatePercentage(
      10000,
      props.currentCustomerLimitAmount,
      props.lastAmount,
    );
    console.log(percentage, '----Percentage');
    const roundedValue =
      percentage > 1 && percentage < 10
        ? 25
        : roundToNearest(percentages, percentage);
    console.log(roundedValue, '----- rounded Value');
    setSelectedPercentage(
      roundedValue === 0
        ? 0
        : roundedValue === 25
        ? 22.72727272727273
        : roundedValue === 50
        ? 40.32258064516129
        : roundedValue === 75
        ? 58.13953488372093
        : roundedValue === 100
        ? 75.18796992481203
        : null,
    );
    setClickedPosition(roundedValue);
  }, []);

  function calculatePercentage(minimum, current, maximum) {
    if (minimum >= maximum) {
      logs.log('Minimum value should be less than the maximum value.');
    }
    let percentage;
    if (current < minimum) {
      percentage = 0.0;
    } else {
      const rangeSize = maximum - minimum;
      percentage = Math.round(((current - minimum) / rangeSize) * 100.0);
    }
    return percentage;
  }

  function roundToNearest(arr, value) {
    if (!Array.isArray(arr) || arr.length === 0) {
      logs.log('Invalid array provided.');
    }
    const nearestValue = arr.reduce((closest, current) => {
      return Math.abs(current - value) < Math.abs(closest - value)
        ? current
        : closest;
    });
    return nearestValue;
  }

  function getSelectedPercentage(roundedValue) {
    switch (roundedValue) {
      case 0:
        return 0;
      case 25:
        return 22.72727272727273;
      case 50:
        return 40.32258064516129;
      case 75:
        return 58.13953488372093;
      case 100:
        return 75.18796992481203;
      default:
        return null;
    }
  }
  const handlePress = (percentage, title, amount) => {
    logs.log(percentage, 'bhjhbhj');
    logs.log(percentage, 'title--', title);
    logs.log(percentage, 'amount--', amount);

    setClickedPosition(percentage);
    if (percentage === 0) {
      setSelectedPercentage(0);
      setLimitAmount(10000);
      props.onChange(title, 10000);
    } else if (percentage === 25) {
      setSelectedPercentage(percentage / 1.1);
      setLimitAmount((25 / 100) * props.lastAmount);
      props.onChange(title, (25 / 100) * props.lastAmount);
    } else if (percentage === 50) {
      setSelectedPercentage(percentage / 1.24);
      setLimitAmount((50 / 100) * props.lastAmount);
      props.onChange(title, (50 / 100) * props.lastAmount);
    } else if (percentage === 75) {
      setSelectedPercentage(percentage / 1.29);
      setLimitAmount((75 / 100) * props.lastAmount);
      props.onChange(title, (75 / 100) * props.lastAmount);

      logs.log((75 / 100) * props.lastAmount, 'hjbjjbj', props.lastAmount);
    } else if (percentage === 100) {
      setSelectedPercentage(percentage / 1.33);
      setLimitAmount(props.lastAmount);
      props.onChange(title, props.lastAmount);
    }
  };

  const DottedView = ({totalWidth, percentages}) => {
    const renderDots = (title, amount) => {
      return percentages.map((percentage) => (
        <TouchableOpacity
          hitSlop={{top: 10, bottom: 10, left: 50, right: 50}}
          key={percentage}
          onPress={() => handlePress(percentage, title, amount)}
          style={{
            position: 'absolute',
            left: `${percentage}%`,
            zIndex: 1,
          }}>
          <View
            style={[
              styles.dot,
              {
                backgroundColor:
                  clickedPosition === percentage ? 'orange' : Colors.labelGrey,
                width: clickedPosition === percentage ? 15 : 8,
                height: clickedPosition === percentage ? 15 : 8,
                borderRadius: clickedPosition === percentage ? 9 : 5,
              },
            ]}
          />
        </TouchableOpacity>
      ));
    };

    return (
      <View>
        <View
          style={{
            justifyContent: 'center',
            backgroundColor: 'rgba(158, 163, 166, 0.3)',
            borderRadius: wp(100),
            width: wp(75),
            alignSelf: 'center',
            height: wp(4),
            marginBottom: wp(2),
          }}>
          <View
            style={{
              height: wp(4),
              width: wp(selectedPercentage),
              backgroundColor: Colors.primary_green,
              position: 'absolute',
              borderRadius: wp(100),
            }}
          />
          <View style={[styles.dottedcontainer, {width: totalWidth}]}>
            {renderDots(props?.transactiontypeCode, limitAmount)}
          </View>
        </View>
      </View>
    );
  };

  return (
    <View>
      <View
        style={[
          {backgroundColor: activeTheme.subContainer},
          styles.sliderView,
        ]}>
        <CustomText
          style={[
            styles.sliderViewText,
            {
              marginLeft: wp(3),
            },
          ]}>
          {props.title}
        </CustomText>

        <DottedView totalWidth={wp(70)} percentages={percentages} />

        <View
          style={[
            styles.sliderAmountView,
            {backgroundColor: activeTheme.subContainer},
          ]}>
          <CustomText style={{fontSize: wp(3.5)}}>
            {'PKR. ' + limitAmount
              ? currencyFormat(Number(limitAmount)).replace('.00', '')
              : limitAmount}
          </CustomText>
        </View>
      </View>
      {/* <View style={{width: '90%', alignSelf: 'center'}}>
        <CustomText style={[styles.bottomText]}>
          {`*Your Previous limit for ${props.title} tranfer is  ${props.lastAmount}`}
        </CustomText>
      </View> */}
    </View>
  );
};

export default AmountSlider;

const styles = StyleSheet.create({
  bottomText: {
    fontSize: wp(3.5),
  },
  sliderViewText: {
    fontSize: wp(4),
    marginTop: wp(3),
    marginBottom: wp(3.5),
  },
  sliderAmountView: {
    // backgroundColor: Colors.backgroundColor,
    width: '35%',
    borderRadius: wp(3),
    alignSelf: 'center',
    justifyContent: 'center',
    alignItems: 'center',
    padding: wp(1),
    marginTop: wp(2),
  },
  sliderView: {
    height: wp(28),
    width: '90%',
    alignSelf: 'center',
    marginVertical: hp(2),
    borderColor: Colors.greyInfoShow,
    borderWidth: 1,
  },
  dottedcontainer: {
    height: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    position: 'relative',
    width: wp(80),
    alignSelf: 'center',
  },
  dot: {
    height: 8,
    width: 8,
    borderRadius: 5,
  },
});
