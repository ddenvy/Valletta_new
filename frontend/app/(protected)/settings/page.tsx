'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import axiosInstance from '@/services/axios';
import { PasswordChangeData } from '@/types/user';
import { 
  KeyIcon,
  XMarkIcon,
  CheckIcon
} from '@heroicons/react/24/outline';

export default function SettingsContent() {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Проверяем, что пароли совпадают
    if (newPassword !== confirmPassword) {
      setError('Пароли не совпадают');
      return;
    }
    
    // Проверяем сложность пароля
    if (newPassword.length < 8) {
      setError('Пароль должен содержать минимум 8 символов');
      return;
    }
    
    try {
      setLoading(true);
      setError(null);
      setSuccess(null);
      
      // Изменение пароля
      await axiosInstance.post('/auth/change-password', {
        currentPassword,
        newPassword,
      });
      
      setSuccess('Пароль успешно изменен');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      
      // Перенаправляем на профиль через 2 секунды
      setTimeout(() => {
        router.push('/profile');
      }, 2000);
    } catch (err: any) {
      console.error('Error changing password:', err);
      setError(err.response?.data?.message || 'Ошибка при изменении пароля');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Настройки безопасности</h1>
      
      {error && (
        <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6">
          <div className="flex">
            <div className="flex-shrink-0">
              <XMarkIcon className="h-5 w-5 text-red-500" />
            </div>
            <div className="ml-3">
              <p className="text-sm text-red-700">{error}</p>
            </div>
          </div>
        </div>
      )}
      
      {success && (
        <div className="bg-green-50 border-l-4 border-green-500 p-4 mb-6">
          <div className="flex">
            <div className="flex-shrink-0">
              <CheckIcon className="h-5 w-5 text-green-500" />
            </div>
            <div className="ml-3">
              <p className="text-sm text-green-700">{success}</p>
            </div>
          </div>
        </div>
      )}
      
      <div className="bg-white shadow overflow-hidden border-2 border-black rounded-lg">
        <div className="px-4 py-5 sm:px-6">
          <h3 className="text-lg leading-6 font-medium text-gray-900">Изменение пароля</h3>
          <p className="mt-1 max-w-2xl text-sm text-gray-500">
            Для смены пароля введите текущий пароль и новый пароль дважды
          </p>
        </div>
        
        <div className="border-t border-gray-200">
          <form onSubmit={handleSubmit}>
            <div className="px-4 py-5 sm:p-6">
              <div className="grid grid-cols-1 gap-6">
                {/* Текущий пароль */}
                <div>
                  <label htmlFor="currentPassword" className="block text-sm font-medium text-gray-700">
                    Текущий пароль
                  </label>
                  <div className="mt-1">
                    <input
                      type="password"
                      id="currentPassword"
                      name="currentPassword"
                      value={currentPassword}
                      onChange={(e) => setCurrentPassword(e.target.value)}
                      required
                      className="block w-full border-2 border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-black focus:border-black sm:text-sm"
                    />
                  </div>
                </div>
                
                {/* Новый пароль */}
                <div>
                  <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700">
                    Новый пароль
                  </label>
                  <div className="mt-1">
                    <input
                      type="password"
                      id="newPassword"
                      name="newPassword"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      required
                      className="block w-full border-2 border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-black focus:border-black sm:text-sm"
                    />
                  </div>
                  <p className="mt-1 text-xs text-gray-500">
                    Минимум 8 символов
                  </p>
                </div>
                
                {/* Подтверждение пароля */}
                <div>
                  <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
                    Подтвердите новый пароль
                  </label>
                  <div className="mt-1">
                    <input
                      type="password"
                      id="confirmPassword"
                      name="confirmPassword"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      required
                      className="block w-full border-2 border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-black focus:border-black sm:text-sm"
                    />
                  </div>
                </div>
              </div>
            </div>
            
            <div className="px-4 py-3 bg-gray-50 text-right sm:px-6 border-t border-gray-200">
              <button
                type="submit"
                disabled={loading}
                className="inline-flex justify-center py-2 px-4 border-2 border-black shadow-sm text-sm font-medium rounded-md text-white bg-black hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black"
              >
                {loading ? 'Сохранение...' : 'Изменить пароль'}
              </button>
            </div>
          </form>
        </div>
      </div>
      
      <div className="mt-6">
        <button
          type="button"
          onClick={() => router.push('/profile')}
          className="inline-flex items-center px-4 py-2 border-2 border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black"
        >
          <KeyIcon className="h-4 w-4 mr-2" />
          Вернуться в профиль
        </button>
      </div>
    </div>
  );
}
