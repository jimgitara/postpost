import React from 'react';
import { Globe, Sun, Moon, Languages } from 'lucide-react';
import { useApp } from '../contexts/AppContext';

const LanguageThemeToggle: React.FC = () => {
  const { language, setLanguage, theme, toggleTheme } = useApp();

  return (
    <div className="flex items-center space-x-2">
      {/* Language Toggle */}
      <div className="relative group">
        <button className="flex items-center space-x-1 text-gray-300 dark:text-gray-300 light:text-gray-600 hover:text-blue-400 transition-all duration-300 p-2 rounded-lg hover:bg-slate-800/50 dark:hover:bg-slate-800/50 light:hover:bg-gray-100">
          <Languages className="h-4 w-4" />
          <span className="text-sm font-medium uppercase">{language}</span>
        </button>
        
        {/* Language Dropdown */}
        <div className="absolute top-full right-0 mt-2 bg-slate-800/95 dark:bg-slate-800/95 light:bg-white backdrop-blur-sm border border-blue-400/20 dark:border-blue-400/20 light:border-gray-200 rounded-xl shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 z-50 min-w-[120px]">
          <button
            onClick={() => setLanguage('hr')}
            className={`w-full flex items-center space-x-2 px-4 py-3 text-left hover:bg-blue-500/10 transition-colors rounded-t-xl ${
              language === 'hr' ? 'text-blue-400 bg-blue-500/10' : 'text-gray-300 dark:text-gray-300 light:text-gray-700'
            }`}
          >
            <span className="text-lg">🇭🇷</span>
            <span className="text-sm">Hrvatski</span>
          </button>
          <button
            onClick={() => setLanguage('en')}
            className={`w-full flex items-center space-x-2 px-4 py-3 text-left hover:bg-blue-500/10 transition-colors rounded-b-xl ${
              language === 'en' ? 'text-blue-400 bg-blue-500/10' : 'text-gray-300 dark:text-gray-300 light:text-gray-700'
            }`}
          >
            <span className="text-lg">🇬🇧</span>
            <span className="text-sm">English</span>
          </button>
        </div>
      </div>

      {/* Theme Toggle */}
      <button
        onClick={toggleTheme}
        className="flex items-center space-x-1 text-gray-300 dark:text-gray-300 light:text-gray-600 hover:text-blue-400 transition-all duration-300 p-2 rounded-lg hover:bg-slate-800/50 dark:hover:bg-slate-800/50 light:hover:bg-gray-100 group"
        title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
      >
        <div className="relative">
          {theme === 'dark' ? (
            <Sun className="h-4 w-4 group-hover:rotate-180 transition-transform duration-500" />
          ) : (
            <Moon className="h-4 w-4 group-hover:rotate-12 transition-transform duration-300" />
          )}
        </div>
      </button>
    </div>
  );
};

export default LanguageThemeToggle;