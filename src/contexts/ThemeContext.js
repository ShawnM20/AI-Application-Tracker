import React, { createContext, useContext, useState, useEffect } from 'react';
import { themes, getThemeVariables } from '../themes/themes';
import { userStorage } from '../utils/storage';

const ThemeContext = createContext();

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

export const ThemeProvider = ({ children }) => {
  const [currentTheme, setCurrentTheme] = useState('purple');
  const [isDarkMode, setIsDarkMode] = useState(false);

  // Load theme from storage on mount (with fallback for non-authenticated users)
  useEffect(() => {
    try {
      const currentUser = userStorage.getCurrentUser();
      if (currentUser) {
        const settings = userStorage.getUserSettings(currentUser.id);
        if (settings.theme) {
          setCurrentTheme(settings.theme);
        }
        if (settings.darkMode !== undefined) {
          setIsDarkMode(settings.darkMode);
        }
      }
    } catch (error) {
      // Use default theme if no user is logged in or storage fails
      console.log('Using default theme');
    }
  }, []);

  // Apply theme variables to CSS
  useEffect(() => {
    const root = document.documentElement;
    const variables = getThemeVariables(currentTheme);
    
    Object.entries(variables).forEach(([key, value]) => {
      root.style.setProperty(key, value);
    });

    // Apply dark mode class
    if (isDarkMode) {
      root.classList.add('dark-mode');
    } else {
      root.classList.remove('dark-mode');
    }

    // Save to storage if user is logged in
    try {
      const currentUser = userStorage.getCurrentUser();
      if (currentUser) {
        userStorage.updateUserSettings(currentUser.id, 'theme', currentTheme);
        userStorage.updateUserSettings(currentUser.id, 'darkMode', isDarkMode);
      }
    } catch (error) {
      // Don't save if no user is logged in
    }
  }, [currentTheme, isDarkMode]);

  const changeTheme = (themeName) => {
    if (themes[themeName]) {
      setCurrentTheme(themeName);
    }
  };

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
  };

  const value = {
    currentTheme,
    themes,
    changeTheme,
    toggleDarkMode,
    isDarkMode,
    theme: themes[currentTheme],
  };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
};

export default ThemeContext;
