import React, {useEffect} from 'react';
import {StatusBar} from 'react-native';
import {logs} from '../../Config/Config';
import {Colors} from '../../Theme';
import {useSelector} from 'react-redux';
import {useTheme} from '../../Theme/ThemeManager';
// create a component
const CustomStatusBar = () => {
  const {activeTheme} = useTheme();
  const statusBarString = useSelector(
    (state) => state.reducers.statusBarString,
  );
  logs.log('statsuBar', statusBarString);
  return (
    <StatusBar
      barStyle={'light-content'}
      hidden={false}
      backgroundColor={activeTheme.appHeaderColor}
      translucent={false}
    />
  );
};

//make this component available to the app
export default CustomStatusBar;
