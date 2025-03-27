'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import axiosInstance from '@/services/axios';
import { User, ProfileUpdateData } from '@/types/user';
import { 
  UserIcon, 
  XMarkIcon,
  CheckIcon
} from '@heroicons/react/24/outline';

function ProfileContent() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const router = useRouter();

  // Форма для редактирования профиля
  const [formData, setFormData] = useState<ProfileUpdateData>({
    userName: '',
    position: '',
    photoUrl: '',
  });

  // Загружаем данные пользователя
  useEffect(() => {
    const fetchUser = async () => {
      try {
        setLoading(true);
        const response = await axiosInstance.get('/auth/me');
        const authResponse = response.data;
        
        if (!authResponse || !authResponse.user) {
          setError('Не удалось получить данные пользователя');
          setLoading(false);
          return;
        }
        
        setUser(authResponse.user);
        setFormData({
          userName: authResponse.user.userName,
          position: authResponse.user.position,
          photoUrl: authResponse.user.photoUrl || '',
        });
        
        setLoading(false);
      } catch (err: any) {
        console.error('Error fetching user:', err);
        setError(err.message || 'Ошибка при загрузке данных пользователя');
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  // Обработчик отправки формы
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      setSaving(true);
      setError(null);
      setSuccess(null);
      
      // Обновляем профиль пользователя
      const response = await axiosInstance.put('/users/profile', formData);
      const updatedUser = response.data;
      
      setUser(updatedUser);
      setSuccess('Профиль успешно обновлен');
      
      setSaving(false);
    } catch (err: any) {
      console.error('Error updating profile:', err);
      setError(err.message || 'Ошибка при обновлении профиля');
      setSaving(false);
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

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-black mx-auto"></div>
          <p className="mt-4 text-lg text-gray-600">Загрузка профиля...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <XMarkIcon className="h-5 w-5 text-red-500" />
            </div>
            <div className="ml-3">
              <p className="text-sm text-red-700">{error || 'Не удалось загрузить профиль пользователя'}</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Мой профиль</h1>
      
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
        <div className="px-4 py-5 sm:px-6 flex justify-between items-center">
          <div>
            <h3 className="text-lg leading-6 font-medium text-gray-900">Информация о пользователе</h3>
            <p className="mt-1 max-w-2xl text-sm text-gray-500">Личные данные и настройки профиля</p>
          </div>
          <div className="flex items-center">
            <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-purple-100 text-purple-800">
              {getRoleText(user.role)}
            </span>
          </div>
        </div>
        
        <div className="border-t border-gray-200">
          <form onSubmit={handleSubmit}>
            <div className="px-4 py-5 sm:p-6">
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-6">
                {/* Фото профиля */}
                <div className="sm:col-span-6">
                  <div className="flex items-center">
                    <div className="h-24 w-24 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden">
                      {formData.photoUrl ? (
                        <img 
                          src={formData.photoUrl} 
                          alt={user.userName} 
                          className="h-full w-full object-cover"
                          onError={(e) => {
                            const img = e.target as HTMLImageElement;
                            img.style.display = 'none';
                            img.parentElement!.innerHTML = getUserInitials(user.userName);
                          }}
                        />
                      ) : (
                        <span className="text-2xl font-medium">{getUserInitials(user.userName)}</span>
                      )}
                    </div>
                    <div className="ml-5">
                      <div className="text-sm font-medium text-gray-900">Фото профиля</div>
                      <div className="text-sm text-gray-500 mt-1">
                        Рекомендуемый размер: 400x400 пикселей
                      </div>
                      <div className="mt-2">
                        <label htmlFor="photoUrl" className="text-sm font-medium text-gray-700">
                          URL изображения
                        </label>
                        <input
                          type="text"
                          id="photoUrl"
                          name="photoUrl"
                          value={formData.photoUrl}
                          onChange={(e) => setFormData({ ...formData, photoUrl: e.target.value })}
                          className="mt-1 block w-full border-2 border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-black focus:border-black sm:text-sm"
                          placeholder="https://example.com/photo.jpg"
                        />
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Email (только для чтения) */}
                <div className="sm:col-span-3">
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                    Email
                  </label>
                  <div className="mt-1">
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={user.email}
                      disabled
                      className="block w-full border-2 border-gray-300 bg-gray-50 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-black focus:border-black sm:text-sm"
                    />
                  </div>
                  <p className="mt-1 text-xs text-gray-500">Email нельзя изменить</p>
                </div>
                
                {/* Имя пользователя */}
                <div className="sm:col-span-3">
                  <label htmlFor="userName" className="block text-sm font-medium text-gray-700">
                    Имя пользователя
                  </label>
                  <div className="mt-1">
                    <input
                      type="text"
                      id="userName"
                      name="userName"
                      value={formData.userName}
                      onChange={(e) => setFormData({ ...formData, userName: e.target.value })}
                      className="block w-full border-2 border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-black focus:border-black sm:text-sm"
                      required
                    />
                  </div>
                </div>
                
                {/* Должность */}
                <div className="sm:col-span-6">
                  <label htmlFor="position" className="block text-sm font-medium text-gray-700">
                    Должность
                  </label>
                  <div className="mt-1">
                    <input
                      type="text"
                      id="position"
                      name="position"
                      value={formData.position}
                      onChange={(e) => setFormData({ ...formData, position: e.target.value })}
                      className="block w-full border-2 border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-black focus:border-black sm:text-sm"
                    />
                  </div>
                </div>
              </div>
            </div>
            
            <div className="px-4 py-3 bg-gray-50 text-right sm:px-6 border-t border-gray-200">
              <button
                type="submit"
                disabled={saving}
                className="inline-flex justify-center py-2 px-4 border-2 border-black shadow-sm text-sm font-medium rounded-md text-white bg-black hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black"
              >
                {saving ? 'Сохранение...' : 'Сохранить изменения'}
              </button>
            </div>
          </form>
        </div>
      </div>
      
      <div className="mt-6">
        <button
          type="button"
          onClick={() => router.push('/settings')}
          className="inline-flex items-center px-4 py-2 border-2 border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black"
        >
          <UserIcon className="h-4 w-4 mr-2" />
          Изменить пароль
        </button>
      </div>
    </div>
  );
}

export default ProfileContent;