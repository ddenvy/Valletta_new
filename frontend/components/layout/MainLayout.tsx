"use client";

import React, { ReactNode } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { usePathname } from 'next/navigation';
import UserMenu from './UserMenu';

interface SubMenuItem {
  name: string;
  href: string;
}

interface MainLayoutProps {
  children: ReactNode;
}

const subMenuItems: { [key: string]: { title: string; items: SubMenuItem[] } } = {
  '/': {
    title: 'Главная',
    items: [
      { name: 'Панель управления', href: '/' },
      { name: 'Кандидаты', href: '/candidates' },
      { name: 'Отделы', href: '/departments' },
      { name: 'Сотрудники', href: '/employee' },
      { name: 'Вакансии', href: '/vacancy' },
      { name: 'Отчеты', href: '/reports' },
      { name: 'Зарплата', href: '/payroll' },
      { name: 'Статистика', href: '/statistic' },
    ],
  },
  '/calendar': {
    title: 'Календарь',
    items: [
      { name: 'Собеседования', href: '/calendar/interviews' },
      { name: 'Встречи', href: '/calendar/meetings' },
      { name: 'Задачи', href: '/calendar/tasks' },
      { name: 'Сроки', href: '/calendar/deadlines' },
    ],
  },
  '/chat': {
    title: 'Чат',
    items: [
      { name: 'Командный чат', href: '/chat/team' },
      { name: 'Личные сообщения', href: '/chat/direct' },
      { name: 'Каналы', href: '/chat/channels' },
    ],
  },
  '/notifications': {
    title: 'Уведомления',
    items: [
      { name: 'Все', href: '/notifications/all' },
      { name: 'Непрочитанные', href: '/notifications/unread' },
      { name: 'Важные', href: '/notifications/important' },
    ],
  },
};

export default function MainLayout({ children }: MainLayoutProps) {
  const pathname = usePathname();
  
  // Determine which section is active
  const activeSection = Object.keys(subMenuItems).find(
    (key) => pathname === key || pathname?.startsWith(`${key}/`)
  ) || '/';
  
  const activeMenu = subMenuItems[activeSection];

  return (
    <div className="flex h-screen overflow-hidden bg-white">
      {/* Sidebar */}
      <div className="w-64 border-r border-[rgb(var(--border))] overflow-y-auto">
        <div className="p-6">
          <h1 className="text-xl font-bold">Valletta CRM</h1>
        </div>
        
        <nav className="px-3 pb-6">
          {Object.keys(subMenuItems).map((key) => {
            const isActive = key === activeSection;
            const section = subMenuItems[key];
            
            return (
              <div key={key} className="mb-2">
                <Link 
                  href={key}
                  className={`nav-item mb-1 ${isActive ? 'active' : ''}`}
                >
                  {section.title}
                </Link>
                
                {isActive && (
                  <div className="ml-4 space-y-1">
                    {section.items.map((item) => (
                      <Link
                        key={item.href}
                        href={item.href}
                        className={`nav-item text-sm ${pathname === item.href ? 'active' : ''}`}
                      >
                        {item.name}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </nav>
        
        <div className="px-4 py-4 border-t border-[rgb(var(--border))]">
          <UserMenu />
        </div>
      </div>
      
      {/* Main content */}
      <div className="flex-1 overflow-y-auto">
        {children}
      </div>
    </div>
  );
}