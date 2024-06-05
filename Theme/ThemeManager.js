import React, {createContext, useContext, useState, useEffect} from 'react';
import {colors, setThemeColors} from './Colors';
import {
  lightTheme,
  indigoTheme,
  orangeTheme,
  darkTheme,
  pinkTheme,
} from './ThemeColors';
import AsyncStorage from '@react-native-async-storage/async-storage';

const ThemeContext = createContext();
const retrieveThemeFromStorage = async () => {
  try {
    const selectedTheme = await AsyncStorage.getItem('@MyApp:theme');
    return selectedTheme;
  } catch (error) {
    console.error('Error retrieving theme from storage:', error);
  }
};
export const ThemeProvider = ({children}) => {
  useEffect(() => {
    const fetchTheme = async () => {
      const selectedTheme = await retrieveThemeFromStorage();
      if (selectedTheme == 'lightTheme') {
        changeTheme(lightTheme);
      } else if (selectedTheme == 'dark') {
        changeTheme(darkTheme);
      } else if (selectedTheme == 'pink') {
        changeTheme(pinkTheme);
      } else if (selectedTheme == 'indigo') {
        changeTheme(indigoTheme);
      } else if (selectedTheme == 'orange') {
        changeTheme(orangeTheme);
      } else {
        changeTheme(lightTheme);
      }
    };

    fetchTheme();
  }, []);
  const [activeTheme, setActiveTheme] = useState(lightTheme);

  const changeTheme = (selectedTheme) => {
    setActiveTheme(selectedTheme);
    setThemeColors(selectedTheme);
  };

  return (
    <ThemeContext.Provider value={{activeTheme, changeTheme}}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  return useContext(ThemeContext);
};
