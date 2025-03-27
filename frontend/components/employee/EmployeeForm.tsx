'use client';

import React, { useState } from 'react';
import { Employee, EmployeeFormData, EMPLOYMENT_TYPES } from '@/types/employee';

interface EmployeeFormProps {
  initialData?: Employee;
  onSubmit: (data: EmployeeFormData) => Promise<void>;
  onCancel: () => void;
}

export default function EmployeeForm({ initialData, onSubmit, onCancel }: EmployeeFormProps) {
  const [formData, setFormData] = useState<EmployeeFormData>({
    nameRu: initialData?.nameRu || '',
    nameEn: initialData?.nameEn || '',
    email: initialData?.email || '',
    position: initialData?.position || '',
    employmentType: initialData?.employmentType || 'Проект',
    employmentPlace: initialData?.employmentPlace || '',
    department: initialData?.department || '',
    startDate: initialData?.startDate || new Date().toISOString().split('T')[0],
    resumeUrl: initialData?.resumeUrl || '',
    comments: initialData?.comments || ''
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      await onSubmit(formData);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Произошла ошибка при сохранении сотрудника');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-bold">
          {initialData ? 'Редактирование сотрудника' : 'Добавление сотрудника'}
        </h2>
        <button
          onClick={onCancel}
          className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300"
        >
          Вернуться к списку
        </button>
      </div>

      <div className="max-h-[calc(100vh-200px)] overflow-y-auto mb-4 pr-2">
        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <div className="bg-red-50 border-l-4 border-red-500 p-4">
              <p className="text-red-700">{error}</p>
            </div>
          )}

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            <div>
              <label htmlFor="nameRu" className="block text-sm font-medium text-gray-700">
                Имя (RU)
              </label>
              <input
                type="text"
                id="nameRu"
                name="nameRu"
                value={formData.nameRu}
                onChange={handleChange}
                required
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-black focus:ring-black sm:text-sm"
              />
            </div>

            <div>
              <label htmlFor="nameEn" className="block text-sm font-medium text-gray-700">
                Имя (EN)
              </label>
              <input
                type="text"
                id="nameEn"
                name="nameEn"
                value={formData.nameEn}
                onChange={handleChange}
                required
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-black focus:ring-black sm:text-sm"
              />
            </div>
          </div>

          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-black focus:ring-black sm:text-sm"
            />
          </div>

          <div>
            <label htmlFor="position" className="block text-sm font-medium text-gray-700">
              Должность
            </label>
            <input
              type="text"
              id="position"
              name="position"
              value={formData.position}
              onChange={handleChange}
              required
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-black focus:ring-black sm:text-sm"
            />
          </div>

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            <div>
              <label htmlFor="employmentType" className="block text-sm font-medium text-gray-700">
                Тип занятости
              </label>
              <select
                id="employmentType"
                name="employmentType"
                value={formData.employmentType}
                onChange={handleChange}
                required
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-black focus:ring-black sm:text-sm"
              >
                {EMPLOYMENT_TYPES.map(type => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="employmentPlace" className="block text-sm font-medium text-gray-700">
                Место работы
              </label>
              <input
                type="text"
                id="employmentPlace"
                name="employmentPlace"
                value={formData.employmentPlace}
                onChange={handleChange}
                required
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-black focus:ring-black sm:text-sm"
              />
            </div>
          </div>

          <div>
            <label htmlFor="department" className="block text-sm font-medium text-gray-700">
              Отдел
            </label>
            <input
              type="text"
              id="department"
              name="department"
              value={formData.department}
              onChange={handleChange}
              required
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-black focus:ring-black sm:text-sm"
            />
          </div>

          <div>
            <label htmlFor="startDate" className="block text-sm font-medium text-gray-700">
              Дата начала работы
            </label>
            <input
              type="date"
              id="startDate"
              name="startDate"
              value={formData.startDate}
              onChange={handleChange}
              required
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-black focus:ring-black sm:text-sm"
            />
          </div>

          <div>
            <label htmlFor="resumeUrl" className="block text-sm font-medium text-gray-700">
              Ссылка на резюме
            </label>
            <input
              type="url"
              id="resumeUrl"
              name="resumeUrl"
              value={formData.resumeUrl}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-black focus:ring-black sm:text-sm"
            />
          </div>

          <div>
            <label htmlFor="comments" className="block text-sm font-medium text-gray-700">
              Комментарии
            </label>
            <textarea
              id="comments"
              name="comments"
              value={formData.comments}
              onChange={handleChange}
              rows={4}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-black focus:ring-black sm:text-sm"
            />
          </div>

          <div className="flex justify-end space-x-3">
            <button
              type="button"
              onClick={onCancel}
              className="inline-flex justify-center py-2 px-4 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black"
            >
              Отмена
            </button>
            <button
              type="submit"
              disabled={loading}
              className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-black hover:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black disabled:opacity-50"
            >
              {loading ? 'Сохранение...' : 'Сохранить'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
} 