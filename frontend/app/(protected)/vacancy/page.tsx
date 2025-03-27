'use client';

import React, { useState, useEffect } from 'react';
import { Vacancy, VacancyUpdateData } from '@/types/vacancy';
import { vacancyService } from '@/services/vacancyService';
import VacancyList from '@/components/vacancy/VacancyList';
import VacancyForm from '@/components/vacancy/VacancyForm';
import { XMarkIcon, ChartBarIcon } from '@heroicons/react/24/outline';

export default function VacancyContent() {
  const [vacancies, setVacancies] = useState<Vacancy[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [selectedVacancy, setSelectedVacancy] = useState<Vacancy | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetchVacancies();
  }, []);

  const fetchVacancies = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await vacancyService.getVacancies();
      setVacancies(data);
    } catch (err) {
      console.error('Error fetching vacancies:', err);
      setError('Не удалось загрузить вакансии');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateVacancy = () => {
    setSelectedVacancy(null);
    setShowForm(true);
  };

  const handleEditVacancy = (vacancy: Vacancy) => {
    setSelectedVacancy(vacancy);
    setShowForm(true);
  };

  const handleCloseForm = () => {
    setShowForm(false);
    setSelectedVacancy(null);
  };

  const handleSubmitForm = async (data: Omit<Vacancy, 'id' | 'createdAt' | 'updatedAt'>) => {
    try {
      if (selectedVacancy) {
        await vacancyService.updateVacancy(selectedVacancy.id, data);
      } else {
        await vacancyService.createVacancy(data);
      }
      await fetchVacancies();
      handleCloseForm();
    } catch (err) {
      console.error('Error saving vacancy:', err);
      throw new Error('Не удалось сохранить вакансию');
    }
  };

  const handleUpdateVacancy = async (id: string, status: 'active' | 'closed' | 'draft') => {
    try {
      // Находим вакансию в текущем списке
      const vacancy = vacancies.find(v => v.id === id);
      if (!vacancy) {
        throw new Error('Вакансия не найдена');
      }

      // Обновляем только статус, сохраняя остальные поля
      const updateData: VacancyUpdateData = {
        title: vacancy.title,
        description: vacancy.description,
        requirements: vacancy.requirements,
        responsibilities: vacancy.responsibilities,
        salaryRangeMin: vacancy.salaryRangeMin,
        salaryRangeMax: vacancy.salaryRangeMax,
        currency: vacancy.currency,
        location: vacancy.location,
        employmentType: vacancy.employmentType,
        status,
        department: vacancy.department,
        level: vacancy.level,
        tags: vacancy.tags,
        benefits: vacancy.benefits,
        contactPerson: vacancy.contactPerson
      };
      
      await vacancyService.updateVacancy(id, updateData);
      await fetchVacancies();
    } catch (err) {
      console.error('Error updating vacancy:', err);
      setError('Не удалось обновить вакансию');
    }
  };

  const handleDeleteVacancy = async (id: string) => {
    try {
      await vacancyService.deleteVacancy(id);
      await fetchVacancies();
    } catch (err) {
      console.error('Error deleting vacancy:', err);
      setError('Не удалось удалить вакансию');
    }
  };

  const filteredVacancies = vacancies.filter(vacancy => {
    if (!searchQuery) return true;
    const query = searchQuery.toLowerCase();
    return (
      vacancy.title.toLowerCase().includes(query) ||
      vacancy.description.toLowerCase().includes(query) ||
      vacancy.location.toLowerCase().includes(query) ||
      vacancy.department?.toLowerCase().includes(query) ||
      vacancy.level?.toLowerCase().includes(query) ||
      vacancy.tags.some(tag => tag.toLowerCase().includes(query)) ||
      vacancy.benefits.some(benefit => benefit.toLowerCase().includes(query))
    );
  });

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-black mx-auto"></div>
          <p className="mt-4 text-lg text-gray-600">Загрузка вакансий...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-red-50 border-l-4 border-red-500 p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <XMarkIcon className="h-5 w-5 text-red-500" />
            </div>
            <div className="ml-3">
              <p className="text-sm text-red-700">{error}</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!vacancies.length && !searchQuery) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-yellow-50 border-l-4 border-yellow-500 p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <ChartBarIcon className="h-5 w-5 text-yellow-500" />
            </div>
            <div className="ml-3">
              <p className="text-sm text-yellow-700">Нет активных вакансий</p>
            </div>
          </div>
        </div>
        <div className="mt-4">
          <button
            onClick={handleCreateVacancy}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
          >
            Создать вакансию
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="page-container">
      <div className="container">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h1>Вакансии</h1>
          <div className="d-flex gap-3">
            <input
              type="text"
              placeholder="Поиск вакансий..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="form-control"
            />
            <button
              onClick={handleCreateVacancy}
              className="btn btn-primary"
            >
              Создать вакансию
            </button>
          </div>
        </div>

        {showForm && (
          <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center p-4">
            <div className="bg-white rounded-lg max-w-4xl w-full p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-medium text-gray-900">
                  {selectedVacancy ? 'Редактировать вакансию' : 'Создать вакансию'}
                </h2>
                <button
                  onClick={handleCloseForm}
                  className="text-gray-400 hover:text-gray-500"
                >
                  <XMarkIcon className="h-6 w-6" />
                </button>
              </div>
              <VacancyForm
                vacancy={selectedVacancy || undefined}
                onSubmit={handleSubmitForm}
                onCancel={handleCloseForm}
              />
            </div>
          </div>
        )}

        {filteredVacancies.length > 0 ? (
          <VacancyList
            vacancies={filteredVacancies}
            onUpdate={handleUpdateVacancy}
            onDelete={handleDeleteVacancy}
            onEdit={handleEditVacancy}
          />
        ) : (
          <div className="bg-yellow-50 border-l-4 border-yellow-500 p-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <ChartBarIcon className="h-5 w-5 text-yellow-500" />
              </div>
              <div className="ml-3">
                <p className="text-sm text-yellow-700">Нет вакансий, соответствующих поисковому запросу</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
} 