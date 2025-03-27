'use client';

import { useEffect } from 'react';

// Добавляем типы для Bootstrap
declare global {
  interface Window {
    bootstrap: any;
  }
}

export default function ClientBootstrap() {
  useEffect(() => {
    // Динамически импортируем Bootstrap только на стороне клиента
    const loadBootstrap = async () => {
      const bootstrap = await import('bootstrap/dist/js/bootstrap.bundle.min.js');
      
      // Ждем немного, чтобы DOM полностью загрузился
      setTimeout(() => {
        try {
          // Инициализация тултипов
          const tooltipTriggerList = document.querySelectorAll('[data-bs-toggle="tooltip"]');
          tooltipTriggerList.forEach(tooltipTriggerEl => {
            new window.bootstrap.Tooltip(tooltipTriggerEl);
          });
          
          // Инициализация попперов
          const popoverTriggerList = document.querySelectorAll('[data-bs-toggle="popover"]');
          popoverTriggerList.forEach(popoverTriggerEl => {
            new window.bootstrap.Popover(popoverTriggerEl);
          });
          
          console.log('Bootstrap инициализирован успешно');
        } catch (error) {
          console.error('Ошибка при инициализации Bootstrap:', error);
        }
      }, 200);
    };
    
    loadBootstrap();
  }, []);

  // Компонент не рендерит никакого UI
  return null;
} 