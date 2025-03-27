'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import axiosInstance from '@/services/axios';
import { User } from '@/types/user';
import { 
  UserIcon, 
  Cog6ToothIcon, 
  ArrowRightOnRectangleIcon 
} from '@heroicons/react/24/outline';

export default function UserMenu() {
  const [isOpen, setIsOpen] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const menuRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        setIsLoading(true);
        const response = await axiosInstance.get('/auth/me');
        const authResponse = response.data;
        if (authResponse && authResponse.user) {
          setUser(authResponse.user);
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUser();
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleLogout = async () => {
    try {
      await axiosInstance.post('/auth/logout');
      router.push('/login');
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  // Получаем инициалы пользователя
  const getUserInitials = (name: string) => {
    return name
      .split(' ')
      .map(part => part[0])
      .join('')
      .toUpperCase()
      .substring(0, 2);
  };

  // Получаем текст роли на русском
  const getRoleText = (role: string) => {
    switch (role) {
      case 'admin':
        return 'Администратор';
      case 'hr':
        return 'HR-менеджер';
      case 'employee':
        return 'Сотрудник';
      default:
        return role;
    }
  };

  if (isLoading) {
    return (
      <div className="d-flex align-items-center">
        <div className="rounded-circle bg-secondary" style={{ width: '32px', height: '32px' }}></div>
      </div>
    );
  }

  if (!user) {
    return (
      <Link href="/login" className="text-decoration-none text-dark">
        <div className="d-flex align-items-center">
          <div className="rounded-circle bg-secondary d-flex align-items-center justify-content-center overflow-hidden" style={{ width: '32px', height: '32px' }}>
            <UserIcon className="icon-sm" />
          </div>
          <span className="ms-2 small fw-medium">Войти</span>
        </div>
      </Link>
    );
  }

  return (
    <div className="relative" ref={menuRef}>
      <button
        className="d-flex align-items-center focus:outline-none"
        onClick={() => setIsOpen(!isOpen)}
        aria-expanded={isOpen}
        aria-haspopup="true"
      >
        <div className="rounded-circle bg-secondary d-flex align-items-center justify-content-center overflow-hidden" style={{ width: '32px', height: '32px' }}>
          {user.photoUrl ? (
            <img 
              src={user.photoUrl} 
              alt={user.userName} 
              className="img-fluid"
              onError={(e) => {
                const img = e.target as HTMLImageElement;
                img.style.display = 'none';
                img.parentElement!.innerHTML = getUserInitials(user.userName);
              }}
            />
          ) : (
            <span className="small fw-medium">{getUserInitials(user.userName)}</span>
          )}
        </div>
        <span className="ms-2 small fw-medium text-muted d-none d-sm-inline">{user.userName}</span>
      </button>

      {isOpen && (
        <div className="position-absolute end-0 mt-2 bg-white rounded shadow-sm py-1 z-10 border">
          <div className="px-3 py-2 border-bottom">
            <p className="text-sm font-medium text-gray-900 truncate">{user.userName}</p>
            <p className="text-xs text-gray-500 truncate">{user.email}</p>
            <p className="text-xs font-medium text-gray-700 mt-1 bg-gray-100 rounded-full px-2 py-0.5 inline-block">
              {getRoleText(user.role)}
            </p>
          </div>
          
          <Link 
            href="/profile" 
            className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center"
            onClick={() => setIsOpen(false)}
          >
            <UserIcon className="h-4 w-4 mr-2" />
            Мой профиль
          </Link>
          
          <Link 
            href="/settings" 
            className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center"
            onClick={() => setIsOpen(false)}
          >
            <Cog6ToothIcon className="h-4 w-4 mr-2" />
            Настройки
          </Link>
          
          {user.role === 'admin' && (
            <Link 
              href="/users" 
              className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center"
              onClick={() => setIsOpen(false)}
            >
              <UserIcon className="h-4 w-4 mr-2" />
              Управление пользователями
            </Link>
          )}
          
          <button 
            className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100 flex items-center"
            onClick={handleLogout}
          >
            <ArrowRightOnRectangleIcon className="h-4 w-4 mr-2" />
            Выйти
          </button>
        </div>
      )}
    </div>
  );
} 