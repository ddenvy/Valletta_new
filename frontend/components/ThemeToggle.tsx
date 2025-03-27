'use client';

import React from 'react';
import { useTheme } from '@/context/ThemeContext';
import { SunIcon, MoonIcon } from '@heroicons/react/24/outline';

interface ThemeToggleProps {
  className?: string;
}

export default function ThemeToggle({ className = '' }: ThemeToggleProps) {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className={`theme-toggle-btn ${className}`}
      aria-label={`Переключить на ${theme === 'light' ? 'темную' : 'светлую'} тему`}
      title={`Переключить на ${theme === 'light' ? 'темную' : 'светлую'} тему`}
    >
      {theme === 'light' ? (
        <MoonIcon style={{ width: '1.25rem', height: '1.25rem' }} />
      ) : (
        <SunIcon style={{ width: '1.25rem', height: '1.25rem' }} />
      )}
    </button>
  );
} 