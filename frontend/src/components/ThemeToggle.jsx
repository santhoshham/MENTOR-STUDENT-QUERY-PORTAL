import React from 'react';
import { RiSunLine, RiMoonLine } from 'react-icons/ri';
import useThemeStore from '../store/themeStore';
import '../styles/ThemeToggle.css';

function ThemeToggle() {
  const { isDarkMode, toggleDarkMode } = useThemeStore();

  return (
    <button 
      className="theme-toggle-btn"
      onClick={toggleDarkMode}
      title={isDarkMode ? 'Switch to light mode' : 'Switch to dark mode'}
    >
      {isDarkMode ? <RiSunLine /> : <RiMoonLine />}
    </button>
  );
}

export default ThemeToggle;