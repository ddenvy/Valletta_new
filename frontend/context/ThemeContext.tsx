'use client';

import React, { createContext, useState, useContext, useEffect } from 'react';
import { useIsomorphicLayoutEffect } from '@/utils/useIsomorphicLayoutEffect';

type Theme = 'light' | 'dark';

interface ThemeContextType {
  theme: Theme;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType>({
  theme: 'light',
  toggleTheme: () => {}
});

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<Theme>('light');
  const [mounted, setMounted] = useState(false);

  // Загружаем сохраненную тему при инициализации
  useEffect(() => {
    setMounted(true);
    const savedTheme = localStorage.getItem('theme') as Theme;
    if (savedTheme) {
      setTheme(savedTheme);
    } else if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      // Если пользователь предпочитает темную тему в настройках системы
      setTheme('dark');
    }

    // Обработчик события изменения хранилища для синхронизации тем между вкладками
    const handleStorageChange = (event: StorageEvent) => {
      if (event.key === 'theme') {
        setTheme(event.newValue as Theme || 'light');
      }
    };

    // Создаем канал синхронизации для разных вкладок
    const broadcastChannel = new BroadcastChannel('theme_channel');
    
    // Слушаем сообщения из других вкладок
    broadcastChannel.onmessage = (event) => {
      if (event.data && event.data.theme) {
        setTheme(event.data.theme);
      }
    };

    // Подписываемся на событие изменения localStorage
    window.addEventListener('storage', handleStorageChange);

    // Отписываемся при размонтировании компонента
    return () => {
      window.removeEventListener('storage', handleStorageChange);
      broadcastChannel.close();
    };
  }, []);

  // Применяем тему к документу
  useIsomorphicLayoutEffect(() => {
    if (!mounted) return;

    const htmlElement = document.documentElement;
    
    if (theme === 'dark') {
      htmlElement.setAttribute('data-bs-theme', 'dark');
    } else {
      htmlElement.setAttribute('data-bs-theme', 'light');
    }
    
    localStorage.setItem('theme', theme);
    
    // Отправляем сообщение в другие вкладки
    try {
      const broadcastChannel = new BroadcastChannel('theme_channel');
      broadcastChannel.postMessage({ theme });
    } catch (error) {
      console.error('Error broadcasting theme change:', error);
    }
  }, [theme, mounted]);

  const toggleTheme = () => {
    setTheme(prevTheme => (prevTheme === 'light' ? 'dark' : 'light'));
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export const useTheme = () => useContext(ThemeContext); 