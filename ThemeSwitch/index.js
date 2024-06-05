import React, {useState, useEffect} from 'react';
import {View, Switch, StyleSheet} from 'react-native';
import SubHeader from '../../Components/GlobalHeader/SubHeader/SubHeader';
import {globalStyling, wp} from '../../Constant';
import CustomText from '../../Components/CustomText/CustomText';
import {Colors} from '../../Theme';
import {useTheme} from '../../Theme/ThemeManager';
import {
  darkTheme,
  lightTheme,
  pinkTheme,
  indigoTheme,
  orangeTheme,
} from '../../Theme/ThemeColors';
import * as Keychain from 'react-native-keychain';
import {logs} from '../../Config/Config';
import {useDispatch} from 'react-redux';
import {setKeyChainObject} from '../../Redux/Action/Action';
import AsyncStorage from '@react-native-async-storage/async-storage';
import analytics from '@react-native-firebase/analytics';

const ThemeScreen = (props) => {
  const {changeTheme, activeTheme} = useTheme();

  const [defaultTheme, setDefaultTheme] = useState(false);
  const [darkMode, setdarkMode] = useState(false);
  const [pinkMode, setpinkMode] = useState(false);
  const [indigoMode, setindigoMode] = useState(false);
  const [orangeMode, setorangeMode] = useState(false);
  const dispatch = useDispatch();
  const handleSwitchToggle = (theme) => {
    setDefaultTheme(theme === 'default');
    setdarkMode(theme === 'dark');
    setpinkMode(theme === 'pink');
    setindigoMode(theme === 'indigo');
    setorangeMode(theme === 'orange');
  };

  const PermenantTheme = async (Theme) => {
    try {
      await AsyncStorage.setItem('@MyApp:theme', Theme);
    } catch (error) {
      console.error('Error saving theme to storage:', error);
    }
    // dispatch(
    //   setKeyChainObject({
    //     Theme: Theme,
    //   }),
    // );
  };
  useEffect(() => {
    if (activeTheme.isDarkTheme) {
      handleSwitchToggle('dark');
    } else if (activeTheme.isLightTheme) {
      handleSwitchToggle('default');
    } else if (activeTheme.isPinkTheme) {
      handleSwitchToggle('pink');
    } else if (activeTheme.isIndigoTheme) {
      handleSwitchToggle('indigo');
    } else if (activeTheme.isOrangeTheme) {
      handleSwitchToggle('orange');
    }
    async function analyticsLog() {
      await analytics().logEvent('ThemeChangeScreen');
    }
    analyticsLog();
  }, []);

  return (
    <View
      style={[
        globalStyling.container,
        {backgroundColor: Colors.backgroundColor},
      ]}>
      <SubHeader
        title={'Change Theme'}
        description={'Select theme according to your preference'}
        navigateHome={true}
        navigation={props.navigation}
      />
      {/* '--------------------------DEFAULT--------------------------------' */}
      <View style={styles.viewContainer}>
        <CustomText style={[globalStyling.textFontNormal, {fontSize: wp(4)}]}>
          {`Default Theme`}
        </CustomText>
        <Switch
          trackColor={{false: 'white', true: '#6fd9a8'}}
          thumbColor="#009951"
          ios_backgroundColor={Colors.lightGrey}
          onValueChange={() => {
            changeTheme(lightTheme);
            handleSwitchToggle('default');
            PermenantTheme('lightTheme');
          }}
          value={defaultTheme}
        />
      </View>
      {/* '--------------------------DARK--------------------------------' */}
      <View style={styles.viewContainer}>
        <CustomText style={[globalStyling.textFontNormal, {fontSize: wp(4)}]}>
          {`Dark Theme`}
        </CustomText>
        <Switch
          trackColor={{false: 'white', true: '#aeaeae'}}
          thumbColor="#272727"
          ios_backgroundColor={Colors.lightGrey}
          onValueChange={() => {
            changeTheme(darkTheme);
            handleSwitchToggle('dark');
            PermenantTheme('dark');
          }}
          value={darkMode}
        />
      </View>
      {/* '--------------------------PINK--------------------------------' */}
      <View style={styles.viewContainer}>
        <CustomText style={[globalStyling.textFontNormal, {fontSize: wp(4)}]}>
          {`Pink Theme`}
        </CustomText>
        <Switch
          trackColor={{false: 'white', true: '#fabdce'}}
          thumbColor="#ff8cad"
          ios_backgroundColor={Colors.lightGrey}
          onValueChange={() => {
            changeTheme(pinkTheme);
            handleSwitchToggle('pink');
            PermenantTheme('pink');
          }}
          value={pinkMode}
        />
      </View>
      {/* '--------------------------INDIGO--------------------------------' */}
      <View style={styles.viewContainer}>
        <CustomText style={[globalStyling.textFontNormal, {fontSize: wp(4)}]}>
          {`Indigo Theme`}
        </CustomText>
        <Switch
          trackColor={{false: 'white', true: '#a185de'}}
          thumbColor="#321179"
          ios_backgroundColor={Colors.lightGrey}
          onValueChange={() => {
            changeTheme(indigoTheme);
            handleSwitchToggle('indigo');
            PermenantTheme('indigo');
          }}
          value={indigoMode}
        />
      </View>
      {/* '--------------------------ORANGE--------------------------------' */}
      <View style={styles.viewContainer}>
        <CustomText style={[globalStyling.textFontNormal, {fontSize: wp(4)}]}>
          {`Orange Theme`}
        </CustomText>
        <Switch
          trackColor={{false: 'white', true: '#fdca82'}}
          thumbColor="#fe9602"
          ios_backgroundColor={Colors.lightGrey}
          onValueChange={() => {
            changeTheme(orangeTheme);
            handleSwitchToggle('orange');
            PermenantTheme('orange');
          }}
          value={orangeMode}
        />
      </View>
    </View>
  );
};

export default ThemeScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'black',
  },
  toastBody: {
    backgroundColor: 'black',
    justifyContent: 'center',
    marginHorizontal: wp(2),
    alignSelf: 'center',
  },
  viewContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    // backgroundColor: 'red',
    paddingHorizontal: wp(4),
    padding: wp(4),
  },
});
