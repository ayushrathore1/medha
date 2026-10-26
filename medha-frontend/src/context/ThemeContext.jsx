import React, { createContext, useContext, useState, useEffect } from 'react';

const ThemeContext = createContext();

export const useTheme = () => useContext(ThemeContext);

export const ThemeProvider = ({ children }) => {
  // Theme state with localStorage persistence
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem('medha-theme') || 'dark';
  });

  // Apply theme class to document
  useEffect(() => {
    localStorage.setItem('medha-theme', theme);
    document.documentElement.className = theme === 'light' ? 'light-theme' : '';
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => prev === 'dark' ? 'light' : 'dark');
  };

  // No-op for backward compatibility
  const updateAppearance = () => {};
  
  const appearance = {
    bgImage: 'none',
    bgOverlay: 0,
    fontFamily: 'Manrope',
    fontScale: 1,
  };

  const isDarkThemeEnabled = true;

  return (
    <ThemeContext.Provider value={{ 
      theme, 
      setTheme, 
      toggleTheme, 
      isDarkThemeEnabled, 
      appearance, 
      updateAppearance 
    }}>
      {children}
    </ThemeContext.Provider>
  );
};
