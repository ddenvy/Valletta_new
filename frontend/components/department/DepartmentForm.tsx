'use client';

import { useState, useEffect, FormEvent } from 'react';
import { Department, DepartmentFormData, DEPARTMENT_TYPES } from '@/types/department';
import { BuildingOfficeIcon, BriefcaseIcon, XMarkIcon } from '@heroicons/react/24/outline';

interface DepartmentFormProps {
  onSubmit: (data: DepartmentFormData) => Promise<void>;
  onCancel: () => void;
  initialData?: Department;
  isSubmitting?: boolean;
}

export default function DepartmentForm({
  onSubmit,
  onCancel,
  initialData,
  isSubmitting = false
}: DepartmentFormProps) {
  const [formData, setFormData] = useState<DepartmentFormData>({
    name: '',
    type: 'Отдел',
    description: '',
    client: '',
    employeeIds: []
  });
  
  const [errors, setErrors] = useState<Record<string, string>>({});
  
  useEffect(() => {
    if (initialData) {
      const { id, createdAt, updatedAt, ...rest } = initialData;
      setFormData(rest);
    }
  }, [initialData]);
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Очищаем ошибку при изменении поля
    if (errors[name]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };
  
  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.name.trim()) {
      newErrors.name = 'Название обязательно';
    }
    
    if (formData.type === 'Проект' && !formData.client?.trim()) {
      newErrors.client = 'Заказчик обязателен для проекта';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    
    if (!validate()) {
      return;
    }
    
    await onSubmit(formData);
  };
  
  return (
    <div className="card shadow">
      <div className="card-header d-flex justify-content-between align-items-center">
        <h5 className="card-title mb-0">
          {initialData ? 'Редактировать отдел/проект' : 'Создать новый отдел/проект'}
        </h5>
        <button
          type="button"
          className="btn-close"
          onClick={onCancel}
          disabled={isSubmitting}
          aria-label="Закрыть"
        />
      </div>
      
      <div className="card-body">
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="form-label">
              Тип <span className="text-danger">*</span>
            </label>
            <div className="d-flex gap-4">
              {DEPARTMENT_TYPES.map((type) => (
                <div key={type} className="form-check">
                  <input
                    type="radio"
                    id={`type-${type}`}
                    name="type"
                    value={type}
                    checked={formData.type === type}
                    onChange={handleChange}
                    className="form-check-input"
                  />
                  <label className="form-check-label d-flex align-items-center gap-2" htmlFor={`type-${type}`}>
                    {type === 'Отдел' ? (
                      <BuildingOfficeIcon className="department-icon text-primary" />
                    ) : (
                      <BriefcaseIcon className="department-icon text-success" />
                    )}
                    {type}
                  </label>
                </div>
              ))}
            </div>
          </div>
          
          <div className="mb-3">
            <label htmlFor="name" className="form-label">
              Название <span className="text-danger">*</span>
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className={`form-control ${errors.name ? 'is-invalid' : ''}`}
              placeholder="Введите название отдела/проекта"
            />
            {errors.name && <div className="invalid-feedback">{errors.name}</div>}
          </div>
          
          {formData.type === 'Проект' && (
            <div className="mb-3">
              <label htmlFor="client" className="form-label">
                Заказчик <span className="text-danger">*</span>
              </label>
              <input
                type="text"
                id="client"
                name="client"
                value={formData.client}
                onChange={handleChange}
                className={`form-control ${errors.client ? 'is-invalid' : ''}`}
                placeholder="Введите название компании-заказчика"
              />
              {errors.client && <div className="invalid-feedback">{errors.client}</div>}
            </div>
          )}
          
          <div className="mb-3">
            <label htmlFor="description" className="form-label">
              Описание
            </label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              className="form-control"
              rows={3}
              placeholder="Введите описание отдела/проекта"
            />
          </div>
          
          <div className="d-flex justify-content-end gap-2">
            <button
              type="button"
              className="btn btn-outline-secondary"
              onClick={onCancel}
              disabled={isSubmitting}
            >
              Отмена
            </button>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Сохранение...' : (initialData ? 'Сохранить' : 'Создать')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
} 