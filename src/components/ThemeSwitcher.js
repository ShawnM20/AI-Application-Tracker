import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from '../contexts/ThemeContext';
import { 
  Palette, 
  Sun, 
  Moon, 
  Check,
  Droplet,
  Leaf,
  Flame,
  Cloud,
  Heart,
  Waves,
  Star,
  Sparkles
} from 'lucide-react';

const ThemeSwitcher = () => {
  const { currentTheme, themes, changeTheme, isDarkMode, toggleDarkMode } = useTheme();
  const [isOpen, setIsOpen] = useState(false);

  const themeIcons = {
    purple: Sparkles,
    ocean: Droplet,
    forest: Leaf,
    sunset: Flame,
    midnight: Moon,
    rose: Heart,
    teal: Waves,
    golden: Sun,
  };

  const ThemeIcon = themeIcons[currentTheme] || Sparkles;

  return (
    <div className="relative theme-switcher-container">
      {/* Main Button */}
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(!isOpen)}
        className="w-10 h-10 bg-white/20 hover:bg-white/30 rounded-xl flex items-center justify-center transition-colors"
      >
        <ThemeIcon className="w-5 h-5 text-white" />
      </motion.button>

      {/* Theme Dropdown */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: -10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: -10 }}
            transition={{ duration: 0.2 }}
            className="absolute top-12 right-0 w-80 glass-effect rounded-2xl p-6 border border-white/20 theme-switcher-dropdown"
          >
            <div className="space-y-4">
              {/* Header */}
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-bold text-white">Choose Theme</h3>
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setIsOpen(false)}
                  className="text-white/60 hover:text-white"
                >
                  ×
                </motion.button>
              </div>

              {/* Dark Mode Toggle */}
              <div className="flex items-center justify-between p-3 bg-white/5 rounded-xl">
                <div className="flex items-center space-x-3">
                  {isDarkMode ? <Moon className="w-5 h-5 text-white" /> : <Sun className="w-5 h-5 text-white" />}
                  <span className="text-white font-medium">
                    {isDarkMode ? 'Dark Mode' : 'Light Mode'}
                  </span>
                </div>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={toggleDarkMode}
                  className={`w-12 h-6 rounded-full transition-colors ${
                    isDarkMode ? 'bg-primary-500' : 'bg-white/30'
                  }`}
                >
                  <motion.div
                    animate={{ x: isDarkMode ? 24 : 0 }}
                    transition={{ duration: 0.2 }}
                    className="w-5 h-5 bg-white rounded-full shadow-lg"
                  />
                </motion.button>
              </div>

              {/* Theme Options */}
              <div className="grid grid-cols-2 gap-3">
                {Object.entries(themes).map(([themeName, theme]) => {
                  const Icon = themeIcons[themeName] || Palette;
                  const isActive = currentTheme === themeName;
                  
                  return (
                    <motion.button
                      key={themeName}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => {
                        changeTheme(themeName);
                        setIsOpen(false);
                      }}
                      className={`p-3 rounded-xl border transition-all ${
                        isActive 
                          ? 'border-white/40 bg-white/10' 
                          : 'border-white/10 bg-white/5 hover:bg-white/10'
                      }`}
                    >
                      <div className="flex items-center space-x-2">
                        <div 
                          className="w-6 h-6 rounded-full flex items-center justify-center"
                          style={{ background: theme.gradient }}
                        >
                          <Icon className="w-3 h-3 text-white" />
                        </div>
                        <div className="flex-1 text-left">
                          <p className="text-white text-sm font-medium">{theme.name}</p>
                          {isActive && (
                            <motion.div
                              initial={{ opacity: 0, scale: 0 }}
                              animate={{ opacity: 1, scale: 1 }}
                              className="flex items-center space-x-1"
                            >
                              <Check className="w-3 h-3 text-green-400" />
                              <span className="text-green-400 text-xs">Active</span>
                            </motion.div>
                          )}
                        </div>
                      </div>
                    </motion.button>
                  );
                })}
              </div>

              {/* Preview Section */}
              <div className="p-3 bg-white/5 rounded-xl">
                <p className="text-white/60 text-xs mb-2">Preview</p>
                <div 
                  className="h-16 rounded-lg flex items-center justify-center text-white font-bold text-sm"
                  style={{ background: themes[currentTheme].gradient }}
                >
                  {themes[currentTheme].name}
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Backdrop */}
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 theme-switcher-backdrop"
          onClick={() => setIsOpen(false)}
        />
      )}
    </div>
  );
};

export default ThemeSwitcher;
