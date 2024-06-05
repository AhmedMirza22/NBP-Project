import React, {useState} from 'react';
import {FlatList, TouchableOpacity, View, Text} from 'react-native';
import {globalStyling, hp, wp, currencyFormat} from '../../Constant';
import {useTheme} from '../../Theme/ThemeManager';
import CustomText from '../CustomText/CustomText';
import {Colors} from '../../Theme';
import Svg, {Circle} from 'react-native-svg';
import {logs} from '../../Config/Config';
import {useSelector} from 'react-redux';
import {isRtlState} from '../../Config/Language/LanguagesArray';

const CircularProgress = ({radius, strokeWidth, progress, percent}) => {
  const circumference = 2 * Math.PI * radius - 30;
  const rotation = `rotate(-90 ${radius} ${radius})`;
  const progressStrokeDashoffset =
    circumference - (progress / 100) * circumference;
  const dotRadius = 7;
  const startAngleAdjustment = Math.PI / 2;
  const angle = (2 * Math.PI * progress) / 100 - startAngleAdjustment;
  const dotCenterX = radius + (radius - strokeWidth / 2) * Math.cos(angle);
  const dotCenterY = radius + (radius - strokeWidth / 2) * Math.sin(angle);
  const [item, setitem] = useState('');
  return (
    <View
      style={{
        aspectRatio: 1,
      }}>
      <Svg width={radius * 2} height={radius * 2}>
        <Circle
          cx={radius}
          cy={radius}
          r={radius - strokeWidth / 2}
          fill="none"
          stroke="#E0E0E0"
          strokeWidth={strokeWidth}
        />
        <Circle
          cx={radius}
          cy={radius}
          r={radius - strokeWidth / 2}
          fill="none"
          stroke={Colors.primary_green}
          strokeWidth={strokeWidth}
          strokeDasharray={`${circumference}, ${circumference}`}
          strokeDashoffset={progressStrokeDashoffset}
          transform={rotation}
        />
        {logs.log(
          'Percentage Calculator----',
          Math.round(
            (item?.usedAmount / item?.currentCustomerLimitAmount) * 100 * 100,
          ) / 100,
        )}
        {Math.round(
          (item?.usedAmount / item?.currentCustomerLimitAmount) * 100 * 100,
        ) /
          100 ===
        100 ? null : (
          <Circle
            cx={dotCenterX}
            cy={dotCenterY}
            r={dotRadius}
            fill={Colors.whiteColor}
          />
        )}
        <View
          style={{
            alignItems: 'center',
            justifyContent: 'center',
            alignContent: 'center',
            alignSelf: 'center',
            height: '100%',
          }}>
          <CustomText
            style={{
              color: Colors.grey,
              textAlign: 'center',
            }}>
            {`${percent}%\nAvailed`}
          </CustomText>
        </View>
      </Svg>
    </View>
  );
};

const LimitViewComponent = () => {
  const {activeTheme} = useTheme();
  const userObject = useSelector((state) => state?.reducers?.userObject?.Limit);

  const renderLimitFlatlist = ({item}) => (
    logs.log(item, 'itemtoooooo'),
    item.transactionType.typeCode !== 'Mobile Top-Up' &&
    item.transactionType.typeCode !== 'P2M' ? (
      <View
        style={[
          {
            borderColor: activeTheme.textFieldBorderColor,
            flexDirection: 'row',
            width: wp(94),
            alignSelf: 'center',
            backgroundColor: Colors.tabNavigateBackground,
            margin: wp(1.5),
            padding: wp(4),
            borderWidth: 0.5,
            borderRadius: wp(1),
          },
        ]}>
        <View
          style={{
            backgroundColor: activeTheme.subContainer,
            width: '75%',
            paddingLeft: wp(1),
          }}>
          <View
            style={{
              backgroundColor: activeTheme.subContainer,
              flexDirection: 'column',
            }}>
            <CustomText
              boldFont={true}
              style={[
                // {textAlign: isRtlState() ? 'left' : 'right'},
                {
                  fontSize: wp(4.5),
                  backgroundColor: activeTheme.subContainer,
                  padding: 1,
                  margin: hp(0.25),
                  alignSelf: 'flex-start',
                },
              ]}
              numberOfLines={1}>
              {item?.transactionType?.typeName}
            </CustomText>
            <View
              style={{
                flexDirection: 'row',
                flexDirection: isRtlState() ? 'row' : 'row-reverse',
                alignSelf: 'flex-start',
              }}>
              <CustomText
                style={[
                  globalStyling.textFontNormal,
                  {
                    color: Colors.grey,
                    fontSize: wp(4),
                    padding: 1,
                    margin: hp(0.25),
                    marginTop: hp(0.5),
                  },
                ]}
                numberOfLines={1}>
                Total Limits:
              </CustomText>
              <CustomText
                // boldFont={true}
                style={[
                  globalStyling.textFontNormal,
                  {
                    fontSize: wp(4),
                    padding: 1,
                    margin: hp(0.25),
                    marginTop: hp(0.5),
                  },
                ]}
                numberOfLines={1}>
                {currencyFormat(
                  Number(item?.currentCustomerLimitAmount),
                ).replace('.00', '')}
              </CustomText>
            </View>

            <View
              style={{
                flexDirection: 'row',
                flexDirection: isRtlState() ? 'row' : 'row-reverse',
                alignSelf: 'flex-start',
              }}>
              <CustomText
                style={[
                  globalStyling.textFontNormal,
                  {
                    color: Colors.grey,
                    fontSize: wp(4),
                    padding: 1,
                    margin: hp(0.25),
                    marginTop: hp(1),
                  },
                ]}
                numberOfLines={1}>
                Consumed Limit:
              </CustomText>
              <CustomText
                // boldFont={true}
                style={[
                  globalStyling.textFontNormal,
                  {
                    fontSize: wp(4),
                    padding: 1,
                    margin: hp(0.25),
                    marginTop: hp(1),
                  },
                ]}
                numberOfLines={1}>
                {currencyFormat(Number(item?.usedAmount)).replace('.00', '')}
              </CustomText>
            </View>
          </View>
        </View>
        <View style={{flexDirection: 'row', right: wp(5)}}>
          <CircularProgress
            radius={45}
            strokeWidth={11}
            progress={
              (item?.usedAmount / item?.currentCustomerLimitAmount) * 100
            }
            percent={`${
              Math.round(
                (item?.usedAmount / item?.currentCustomerLimitAmount) *
                  100 *
                  100,
              ) / 100
            }`}
          />
        </View>
      </View>
    ) : null
  );

  return (
    <View
      style={[
        globalStyling.container,
        {backgroundColor: Colors.backgroundColor},
      ]}>
      <FlatList
        accessibilityLabel="Accounts List"
        showsVerticalScrollIndicator={false}
        renderItem={renderLimitFlatlist}
        data={userObject}
        removeClippedSubviews={true}
        keyExtractor={(item) => item?.transactionType?.typeCode}
        disableVirtualization={false}
        scrollEnabled={true}
      />
    </View>
  );
};

export default LimitViewComponent;
