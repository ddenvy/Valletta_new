'use client';

import React, { useState } from 'react';
import { Vacancy, VacancyFormData, VACANCY_STATUSES, Client } from '@/types/vacancy';

const CLIENTS: Client[] = ['GlobalBit', 'Acterys', 'SQLDBM', 'Andersen'];

interface VacancyFormProps {
  vacancy?: Vacancy;
  onSubmit: (data: VacancyFormData) => Promise<void>;
  onCancel: () => void;
}

const defaultContactPerson = {
  name: '',
  email: '',
  phone: ''
};

export default function VacancyForm({ vacancy, onSubmit, onCancel }: VacancyFormProps) {
  const [formData, setFormData] = useState<VacancyFormData>({
    title: vacancy?.title || '',
    description: vacancy?.description || '',
    requirements: vacancy?.requirements || [],
    responsibilities: vacancy?.responsibilities || [],
    salaryRangeMin: vacancy?.salaryRangeMin || 0,
    salaryRangeMax: vacancy?.salaryRangeMax || 0,
    currency: vacancy?.currency || 'RUB',
    location: vacancy?.location || '',
    employmentType: vacancy?.employmentType || 'full-time',
    status: vacancy?.status || 'draft',
    department: vacancy?.department || '',
    level: vacancy?.level || '',
    tags: vacancy?.tags || [],
    benefits: vacancy?.benefits || [],
    contactPerson: vacancy?.contactPerson || defaultContactPerson,
    client: vacancy?.client || 'GlobalBit'
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

  const handleArrayChange = (e: React.ChangeEvent<HTMLInputElement>, field: keyof VacancyFormData) => {
    const value = e.target.value;
    if (Array.isArray(formData[field])) {
      setFormData(prev => ({
        ...prev,
        [field]: value.split(',').map(item => item.trim())
      }));
    }
  };

  const handleContactPersonChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      contactPerson: {
        ...prev.contactPerson,
        [name.replace('contactPerson.', '')]: value
      }
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      await onSubmit(formData);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Произошла ошибка при сохранении вакансии');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="needs-validation">
      {error && (
        <div className="alert alert-danger">
          <p>{error}</p>
        </div>
      )}

      <div className="row g-3">
        <div className="col-md-6">
          <label htmlFor="title" className="form-label">
            Название
          </label>
          <input
            type="text"
            id="title"
            name="title"
            value={formData.title}
            onChange={handleChange}
            required
            className="form-control"
          />
        </div>

        <div className="col-md-6">
          <label htmlFor="client" className="form-label">
            Клиент
          </label>
          <select
            id="client"
            name="client"
            value={formData.client}
            onChange={handleChange}
            required
            className="form-control"
          >
            {CLIENTS.map((client) => (
              <option key={client} value={client}>
                {client}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div>
        <label htmlFor="description" className="form-label">
          Описание
        </label>
        <textarea
          id="description"
          name="description"
          value={formData.description}
          onChange={handleChange}
          required
          rows={4}
          className="form-control"
        />
      </div>

      <div className="row g-3">
        <div>
          <label htmlFor="requirements" className="form-label">
            Требования (через запятую)
          </label>
          <input
            type="text"
            id="requirements"
            name="requirements"
            value={formData.requirements.join(', ')}
            onChange={(e) => handleArrayChange(e, 'requirements')}
            className="form-control"
          />
        </div>

        <div>
          <label htmlFor="responsibilities" className="form-label">
            Обязанности (через запятую)
          </label>
          <input
            type="text"
            id="responsibilities"
            name="responsibilities"
            value={formData.responsibilities.join(', ')}
            onChange={(e) => handleArrayChange(e, 'responsibilities')}
            className="form-control"
          />
        </div>
      </div>

      <div className="row g-3">
        <div>
          <label htmlFor="salaryRangeMin" className="form-label">
            Минимальная зарплата
          </label>
          <input
            type="number"
            id="salaryRangeMin"
            name="salaryRangeMin"
            value={formData.salaryRangeMin}
            onChange={handleChange}
            required
            min="0"
            className="form-control"
          />
        </div>

        <div>
          <label htmlFor="salaryRangeMax" className="form-label">
            Максимальная зарплата
          </label>
          <input
            type="number"
            id="salaryRangeMax"
            name="salaryRangeMax"
            value={formData.salaryRangeMax}
            onChange={handleChange}
            required
            min="0"
            className="form-control"
          />
        </div>

        <div>
          <label htmlFor="currency" className="form-label">
            Валюта
          </label>
          <select
            id="currency"
            name="currency"
            value={formData.currency}
            onChange={handleChange}
            required
            className="form-control"
          >
            <option value="RUB">RUB</option>
            <option value="USD">USD</option>
            <option value="EUR">EUR</option>
          </select>
        </div>
      </div>

      <div className="row g-3">
        <div>
          <label htmlFor="location" className="form-label">
            Местоположение
          </label>
          <input
            type="text"
            id="location"
            name="location"
            value={formData.location}
            onChange={handleChange}
            required
            className="form-control"
          />
        </div>

        <div>
          <label htmlFor="employmentType" className="form-label">
            Тип занятости
          </label>
          <select
            id="employmentType"
            name="employmentType"
            value={formData.employmentType}
            onChange={handleChange}
            required
            className="form-control"
          >
            <option value="full-time">Полный день</option>
            <option value="part-time">Частичная занятость</option>
            <option value="contract">Контракт</option>
            <option value="remote">Удаленная работа</option>
          </select>
        </div>
      </div>

      <div className="row g-3">
        <div>
          <label htmlFor="department" className="form-label">
            Отдел
          </label>
          <input
            type="text"
            id="department"
            name="department"
            value={formData.department}
            onChange={handleChange}
            className="form-control"
          />
        </div>

        <div>
          <label htmlFor="level" className="form-label">
            Уровень
          </label>
          <input
            type="text"
            id="level"
            name="level"
            value={formData.level}
            onChange={handleChange}
            className="form-control"
          />
        </div>
      </div>

      <div>
        <label htmlFor="tags" className="form-label">
          Теги (через запятую)
        </label>
        <input
          type="text"
          id="tags"
          name="tags"
          value={formData.tags.join(', ')}
          onChange={(e) => handleArrayChange(e, 'tags')}
          className="form-control"
        />
      </div>

      <div>
        <label htmlFor="benefits" className="form-label">
          Бенефиты (через запятую)
        </label>
        <input
          type="text"
          id="benefits"
          name="benefits"
          value={formData.benefits.join(', ')}
          onChange={(e) => handleArrayChange(e, 'benefits')}
          className="form-control"
        />
      </div>

      <div>
        <label htmlFor="status" className="form-label">
          Статус
        </label>
        <select
          id="status"
          name="status"
          value={formData.status}
          onChange={handleChange}
          required
          className="form-control"
        >
          {VACANCY_STATUSES.map(status => (
            <option key={status} value={status}>
              {status === 'active' ? 'Активна' : status === 'closed' ? 'Закрыта' : 'Черновик'}
            </option>
          ))}
        </select>
      </div>

      <div className="mb-4">
        <h3 className="h5 mb-3">Контактное лицо</h3>
        <div className="row g-3">
          <div>
            <label htmlFor="contactPerson.name" className="form-label">
              Имя
            </label>
            <input
              type="text"
              id="contactPerson.name"
              name="contactPerson.name"
              value={formData.contactPerson.name}
              onChange={handleContactPersonChange}
              className="form-control"
            />
          </div>

          <div>
            <label htmlFor="contactPerson.email" className="form-label">
              Email
            </label>
            <input
              type="email"
              id="contactPerson.email"
              name="contactPerson.email"
              value={formData.contactPerson.email}
              onChange={handleContactPersonChange}
              className="form-control"
            />
          </div>

          <div>
            <label htmlFor="contactPerson.phone" className="form-label">
              Телефон
            </label>
            <input
              type="tel"
              id="contactPerson.phone"
              name="contactPerson.phone"
              value={formData.contactPerson.phone || ''}
              onChange={handleContactPersonChange}
              className="form-control"
            />
          </div>
        </div>
      </div>

      <div className="d-flex justify-content-end gap-3">
        <button
          type="button"
          onClick={onCancel}
          className="btn btn-secondary"
        >
          Отмена
        </button>
        <button
          type="submit"
          disabled={loading}
          className="btn btn-primary"
        >
          {loading ? 'Сохранение...' : 'Сохранить'}
        </button>
      </div>
    </form>
  );
} 