'use client';

import React, { ReactNode } from 'react';

interface PageLayoutProps {
  title: string;
  actions?: ReactNode;
  header?: ReactNode;
  children: ReactNode;
  /** Отступы для содержимого (в формате Bootstrap, например, 'px-4 py-3') */
  contentPadding?: string;
  /** Отступы для заголовка (в формате Bootstrap, например, 'px-4 pt-3') */
  headerPadding?: string;
}

/**
 * Компонент PageLayout - шаблон для всех страниц приложения
 * Обеспечивает единую структуру с фиксированным заголовком и прокручиваемым содержимым
 */
export default function PageLayout({ 
  title, 
  actions, 
  header, 
  children,
  contentPadding = 'px-4',
  headerPadding = 'pt-4 px-4 pb-3'
}: PageLayoutProps) {
  return (
    <div className="d-flex flex-column h-100">
      {/* Фиксированный заголовок */}
      <div className={`sticky-top bg-body ${headerPadding}`}>
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h1 className="h3 mb-0">{title}</h1>
          {actions}
        </div>
        
        {header && (
          <div className="mb-3">
            {header}
          </div>
        )}
      </div>

      {/* Прокручиваемое содержимое */}
      <div className={`flex-grow-1 overflow-auto ${contentPadding}`}>
        {children}
      </div>
    </div>
  );
} 