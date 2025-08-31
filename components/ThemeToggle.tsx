import React from 'react';
import useTheme from '../hooks/useTheme';
import { SunIcon, MoonIcon, ComputerDesktopIcon } from './Icons';
import { Theme } from '../types';

const ThemeToggle: React.FC = () => {
  const [theme, setTheme] = useTheme();

  const options: { name: Theme; icon: React.ReactNode }[] = [
    { name: 'light', icon: <SunIcon className="w-5 h-5" /> },
    { name: 'dark', icon: <MoonIcon className="w-5 h-5" /> },
    { name: 'system', icon: <ComputerDesktopIcon className="w-5 h-5" /> },
  ];

  return (
    <div className="flex items-center p-1 rounded-lg bg-gray-200/80 dark:bg-gray-800/80 border border-gray-300/50 dark:border-gray-700/50">
      {options.map((option) => (
        <button
          key={option.name}
          onClick={() => setTheme(option.name)}
          className={`p-2 rounded-md transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-200 dark:focus:ring-offset-gray-900 focus:ring-indigo-500 ${
            theme === option.name
              ? 'bg-white dark:bg-gray-950 text-indigo-600 dark:text-indigo-400 shadow-sm'
              : 'text-gray-500 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200'
          }`}
          aria-pressed={theme === option.name}
          title={`Switch to ${option.name} theme`}
        >
          {option.icon}
        </button>
      ))}
    </div>
  );
};

export default ThemeToggle;
