'use client';

import { useState, useEffect } from 'react';
import {
  Candidate,
  CandidateFormData,
  CANDIDATE_STATUSES, 
  ENGLISH_LEVELS,
  CURRENCIES
} from '@/types/candidate';
import { XMarkIcon } from '@heroicons/react/24/outline';

interface CandidateFormProps {
  initialData?: Candidate;
  onSubmit: (data: CandidateFormData) => void;
  onCancel: () => void;
}

export default function CandidateForm({ initialData, onSubmit, onCancel }: CandidateFormProps) {
  const [formData, setFormData] = useState<CandidateFormData>({
    nameRu: '',
    nameEn: '',
    email: '',
    vacancy: '',
    stack: '',
    status: 'Новый',
    location: '',
    englishLevel: 'Не требуется',
    resumeUrl: '',
    interviewFileUrl: '',
    phone: '',
    skype: '',
    telegram: '',
    statusComment: '',
    screeningDate: '',
    screeningRecruiter: '',
    salaryMin: undefined,
    salaryMax: undefined,
    salaryCurrency: undefined,
    comments: '',
    tags: []
  });

  useEffect(() => {
    if (initialData) {
      setFormData({
        nameRu: initialData.nameRu || '',
        nameEn: initialData.nameEn || '',
        email: initialData.email || '',
        vacancy: initialData.vacancy || '',
        stack: initialData.stack || '',
        status: initialData.status || 'Новый',
        location: initialData.location || '',
        englishLevel: initialData.englishLevel || 'Не требуется',
        resumeUrl: initialData.resumeUrl || '',
        interviewFileUrl: initialData.interviewFileUrl || '',
        phone: initialData.phone || '',
        skype: initialData.skype || '',
        telegram: initialData.telegram || '',
        statusComment: initialData.statusComment || '',
        screeningDate: initialData.screeningDate || '',
        screeningRecruiter: initialData.screeningRecruiter || '',
        salaryMin: initialData.salaryMin,
        salaryMax: initialData.salaryMax,
        salaryCurrency: initialData.salaryCurrency,
        comments: initialData.comments || '',
        tags: initialData.tags || []
      });
    }
  }, [initialData]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    
    if (type === 'number') {
      setFormData({
        ...formData,
        [name]: value === '' ? undefined : Number(value)
      });
    } else {
      setFormData({
        ...formData,
        [name]: value
      });
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <div className="card shadow-sm">
      <div className="card-header d-flex justify-content-between align-items-center">
        <h3 className="fs-5 mb-0">{initialData ? 'Редактирование кандидата' : 'Добавление кандидата'}</h3>
        <button 
          type="button" 
          className="btn-close" 
          onClick={onCancel}
          aria-label="Закрыть"
        />
      </div>
      
      <div className="card-body">
        <form onSubmit={handleSubmit}>
          <div className="row g-3 mb-4">
            <div className="col-md-6">
              <div className="form-floating mb-3">
                <input
                  type="text"
                  id="nameRu"
                  name="nameRu"
                  value={formData.nameRu}
                  onChange={handleChange}
                  className="form-control"
                  placeholder="Иван Иванов"
                  required
                />
                <label htmlFor="nameRu">ФИО (на русском)</label>
              </div>
            </div>
            
            <div className="col-md-6">
              <div className="form-floating mb-3">
                <input
                  type="text"
                  id="nameEn"
                  name="nameEn"
                  value={formData.nameEn}
                  onChange={handleChange}
                  className="form-control"
                  placeholder="Ivan Ivanov"
                />
                <label htmlFor="nameEn">ФИО (на английском)</label>
              </div>
            </div>
            
            <div className="col-md-6">
              <div className="form-floating mb-3">
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="form-control"
                  placeholder="email@example.com"
                  required
                />
                <label htmlFor="email">Email</label>
              </div>
            </div>
            
            <div className="col-md-6">
              <div className="form-floating mb-3">
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={formData.phone || ''}
                  onChange={handleChange}
                  className="form-control"
                  placeholder="+7 (999) 123-45-67"
                />
                <label htmlFor="phone">Телефон</label>
              </div>
            </div>
            
            <div className="col-md-6">
              <div className="form-floating mb-3">
                <select
                  id="status"
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                  className="form-select"
                  required
                >
                  {CANDIDATE_STATUSES.map(status => (
                    <option key={status} value={status}>{status}</option>
                  ))}
                </select>
                <label htmlFor="status">Статус</label>
              </div>
            </div>
            
            <div className="col-md-6">
              <div className="form-floating mb-3">
                <input
                  type="text"
                  id="vacancy"
                  name="vacancy"
                  value={formData.vacancy}
                  onChange={handleChange}
                  className="form-control"
                  placeholder="Frontend Developer"
                  required
                />
                <label htmlFor="vacancy">Вакансия</label>
              </div>
            </div>
            
            <div className="col-md-6">
              <div className="form-floating mb-3">
                <input
                  type="text"
                  id="stack"
                  name="stack"
                  value={formData.stack}
                  onChange={handleChange}
                  className="form-control"
                  placeholder="React, TypeScript"
                  required
                />
                <label htmlFor="stack">Технологический стек</label>
              </div>
            </div>
            
            <div className="col-md-6">
              <div className="form-floating mb-3">
                <input
                  type="text"
                  id="location"
                  name="location"
                  value={formData.location}
                  onChange={handleChange}
                  className="form-control"
                  placeholder="Москва, Россия"
                />
                <label htmlFor="location">Местоположение</label>
              </div>
            </div>
            
            <div className="col-md-6">
              <div className="form-floating mb-3">
                <select
                  id="englishLevel"
                  name="englishLevel"
                  value={formData.englishLevel}
                  onChange={handleChange}
                  className="form-select"
                >
                  {ENGLISH_LEVELS.map(level => (
                    <option key={level} value={level}>{level}</option>
                  ))}
                </select>
                <label htmlFor="englishLevel">Уровень английского</label>
              </div>
            </div>
            
            <div className="col-md-6">
              <div className="form-floating mb-3">
                <input
                  type="text"
                  id="resumeUrl"
                  name="resumeUrl"
                  value={formData.resumeUrl}
                  onChange={handleChange}
                  className="form-control"
                  placeholder="https://example.com/resume.pdf"
                />
                <label htmlFor="resumeUrl">Ссылка на резюме</label>
              </div>
            </div>
            
            <div className="col-md-6">
              <div className="input-group mb-3">
                <span className="input-group-text">Зарплата от</span>
                <input
                  type="number"
                  id="salaryMin"
                  name="salaryMin"
                  value={formData.salaryMin || ''}
                  onChange={handleChange}
                  className="form-control"
                  placeholder="80000"
                />
                <span className="input-group-text">до</span>
                <input
                  type="number"
                  id="salaryMax"
                  name="salaryMax"
                  value={formData.salaryMax || ''}
                  onChange={handleChange}
                  className="form-control"
                  placeholder="120000"
                />
                <select
                  id="salaryCurrency"
                  name="salaryCurrency"
                  value={formData.salaryCurrency || ''}
                  onChange={handleChange}
                  className="form-select"
                  style={{ maxWidth: '100px' }}
                >
                  <option value="">Валюта</option>
                  {CURRENCIES.map(currency => (
                    <option key={currency} value={currency}>{currency}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>
          
          <div className="row g-3 mb-4">
            <div className="col-md-12">
              <label htmlFor="comments" className="form-label">Комментарии</label>
              <textarea
                id="comments"
                name="comments"
                value={formData.comments || ''}
                onChange={handleChange}
                className="form-control"
                rows={3}
              />
            </div>
          </div>
          
          <div className="d-flex justify-content-end gap-2">
            <button 
              type="button" 
              className="btn btn-outline-secondary" 
              onClick={onCancel}
            >
              Отмена
            </button>
            <button 
              type="submit" 
              className="btn btn-primary"
            >
              {initialData ? 'Сохранить' : 'Добавить'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
} 