'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import Image from 'next/image';
import { useTheme } from '@/context/ThemeContext';
import { 
  HomeIcon, 
  UserGroupIcon, 
  CalendarIcon, 
  Cog6ToothIcon,
  BriefcaseIcon,
  BuildingOfficeIcon,
  UsersIcon,
  ChartBarIcon,
  ChevronLeftIcon,
  ChevronRightIcon
} from '@heroicons/react/24/outline';

const navItems = [
  { name: 'Дашборд', href: '/dashboard', icon: HomeIcon },
  { name: 'Кандидаты', href: '/candidates', icon: UserGroupIcon },
  { name: 'Вакансии', href: '/vacancy', icon: BriefcaseIcon },
  { name: 'Сотрудники', href: '/employee', icon: UsersIcon },
  { name: 'Отделы', href: '/departments', icon: BuildingOfficeIcon },
  { name: 'Календарь', href: '/calendar', icon: CalendarIcon },
  { name: 'Статистика', href: '/statistic', icon: ChartBarIcon },
  { name: 'Настройки', href: '/settings', icon: Cog6ToothIcon }
];

export default function Sidebar() {
  const [isOpen, setIsOpen] = useState(true);
  const pathname = usePathname();
  const { theme } = useTheme();

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  // Используем один и тот же логотип для обеих тем
  const logoSrc = '/logo-new.svg';

  return (
    <div className={`sidebar ${isOpen ? 'sidebar-expanded' : 'sidebar-collapsed'} d-flex flex-column`}>
      {/* Логотип */}
      <div className="sidebar-header">
        <Link 
          href="/" 
          className="d-flex align-items-center text-decoration-none"
        >
          <div className="position-relative" style={{ width: '40px', height: '40px', marginRight: '12px' }}>
            <Image
              src={logoSrc}
              alt="Valletta"
              fill
              sizes="48px"
              style={{ objectFit: 'contain' }}
              priority
            />
          </div>
          {isOpen && <span className="fs-5 fw-semibold">Valletta CRM</span>}
        </Link>
        <button 
          className="btn btn-icon d-flex align-items-center justify-content-center p-1"
          onClick={toggleSidebar}
          aria-label={isOpen ? 'Свернуть' : 'Развернуть'}
          title={isOpen ? 'Свернуть' : 'Развернуть'}
        >
          {isOpen ? (
            <ChevronLeftIcon className="icon-base transition-transform" />
          ) : (
            <ChevronRightIcon className="icon-base transition-transform" />
          )}
        </button>
      </div>
      
      {/* Навигация */}
      <nav className="overflow-auto py-3 flex-grow-1">
        <ul className="list-unstyled ps-0 mb-0">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            
            return (
              <li key={item.name} className="mb-1">
                <Link 
                  href={item.href}
                  className={`nav-link ${isActive ? 'active' : ''}`}
                >
                  <item.icon style={{ 
                    width: isOpen ? '20px' : '28px', 
                    height: isOpen ? '20px' : '28px', 
                    marginRight: isOpen ? '12px' : '0',
                    margin: isOpen ? undefined : '0 auto'
                  }} />
                  {isOpen && <span>{item.name}</span>}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
    </div>
  );
}
