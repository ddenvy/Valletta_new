'use client';

import { useState, useEffect } from 'react';
import { Department, DepartmentType, DepartmentWithEmployeeCount, DEPARTMENT_TYPES, DepartmentFormData } from '@/types/department';
import { departmentService } from '@/services/departmentService';
import DepartmentList from '@/components/department/DepartmentList';
import DepartmentForm from '@/components/department/DepartmentForm';
import PageLayout from '@/components/shared/PageLayout';
import SearchInput from '@/components/shared/SearchInput';
import { PlusIcon } from '@heroicons/react/24/outline';

export default function DepartmentsPage() {
  const [departments, setDepartments] = useState<DepartmentWithEmployeeCount[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [selectedDepartment, setSelectedDepartment] = useState<Department | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState<DepartmentType | 'all'>('all');
  const [showEmployeesModal, setShowEmployeesModal] = useState(false);
  const [selectedDepartmentId, setSelectedDepartmentId] = useState<string | null>(null);

  // Загрузка отделов
  const fetchDepartments = async () => {
    try {
      setLoading(true);
      const data = await departmentService.getDepartmentsWithEmployeeCount();
      setDepartments(data);
      setError(null);
    } catch (err) {
      setError('Не удалось загрузить данные');
      console.error('Error fetching departments:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDepartments();
  }, []);

  // Фильтрация отделов
  const filteredDepartments = departments.filter(department => {
    const matchesSearch = department.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      department.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (department.client && department.client.toLowerCase().includes(searchQuery.toLowerCase()));
    
    const matchesType = selectedType === 'all' || department.type === selectedType;
    
    return matchesSearch && matchesType;
  });

  // Обработчики событий
  const handleCreateDepartment = () => {
    setSelectedDepartment(null);
    setShowForm(true);
  };

  const handleEditDepartment = (department: Department) => {
    setSelectedDepartment(department);
    setShowForm(true);
  };

  const handleCancelForm = () => {
    setShowForm(false);
    setSelectedDepartment(null);
  };

  const handleSubmitForm = async (data: DepartmentFormData) => {
    try {
      if (selectedDepartment) {
        await departmentService.updateDepartment(selectedDepartment.id, data);
      } else {
        await departmentService.createDepartment(data);
      }
      await fetchDepartments();
      setShowForm(false);
      setSelectedDepartment(null);
    } catch (err) {
      console.error('Error saving department:', err);
      setError('Не удалось сохранить отдел/проект');
    }
  };

  const handleUpdateDepartment = async (updatedDepartment: Department) => {
    try {
      await departmentService.updateDepartment(updatedDepartment.id, updatedDepartment);
      await fetchDepartments();
    } catch (err) {
      console.error('Error updating department:', err);
      setError('Не удалось обновить отдел/проект');
    }
  };

  const handleDeleteDepartment = async (id: string) => {
    try {
      await departmentService.deleteDepartment(id);
      await fetchDepartments();
    } catch (err) {
      console.error('Error deleting department:', err);
      setError('Не удалось удалить отдел/проект');
    }
  };

  const handleViewEmployees = async (departmentId: string) => {
    setSelectedDepartmentId(departmentId);
    setShowEmployeesModal(true);
  };

  // Компоненты для фильтрации
  const renderFilters = () => (
    <div className="row g-3">
      <div className="col-md-6">
        <SearchInput
          value={searchQuery}
          onChange={setSearchQuery}
          placeholder="Поиск по названию, описанию или заказчику..."
        />
      </div>
      <div className="col-md-6">
        <div className="btn-group">
          <button
            className={`btn btn-sm ${selectedType === 'all' ? 'btn-primary' : 'btn-outline-primary'}`}
            onClick={() => setSelectedType('all')}
          >
            Все
          </button>
          {DEPARTMENT_TYPES.map(type => (
            <button
              key={type}
              className={`btn btn-sm ${selectedType === type ? 'btn-primary' : 'btn-outline-primary'}`}
              onClick={() => setSelectedType(type)}
            >
              {type}
            </button>
          ))}
        </div>
      </div>
    </div>
  );

  if (loading) {
    return (
      <PageLayout title="Отделы и проекты">
        <div className="d-flex justify-content-center align-items-center h-100">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Загрузка...</span>
          </div>
        </div>
      </PageLayout>
    );
  }

  if (error) {
    return (
      <PageLayout title="Отделы и проекты">
        <div className="alert alert-danger" role="alert">
          {error}
        </div>
      </PageLayout>
    );
  }

  if (showForm) {
    return (
      <PageLayout 
        title={selectedDepartment ? 'Редактирование отдела/проекта' : 'Создание отдела/проекта'}
      >
        <DepartmentForm
          initialData={selectedDepartment || undefined}
          onSubmit={handleSubmitForm}
          onCancel={handleCancelForm}
        />
      </PageLayout>
    );
  }

  return (
    <PageLayout
      title="Отделы и проекты"
      actions={
        <button
          className="btn btn-primary d-flex align-items-center gap-2"
          onClick={handleCreateDepartment}
        >
          <PlusIcon className="h-5 w-5" />
          <span>Добавить</span>
        </button>
      }
      header={renderFilters()}
    >
      {departments.length === 0 ? (
        <div className="text-center py-5">
          <p className="text-muted mb-0">Нет отделов и проектов</p>
        </div>
      ) : (
        <DepartmentList
          departments={filteredDepartments}
          onUpdateDepartment={handleUpdateDepartment}
          onDeleteDepartment={handleDeleteDepartment}
          onEditDepartment={handleEditDepartment}
          onViewEmployees={handleViewEmployees}
        />
      )}

      {/* TODO: Добавить модальное окно для просмотра сотрудников */}
      {showEmployeesModal && selectedDepartmentId && (
        <div className="modal show" style={{ display: 'block' }}>
          <div className="modal-dialog modal-lg">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">
                  Сотрудники {departments.find(d => d.id === selectedDepartmentId)?.name}
                </h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setShowEmployeesModal(false)}
                ></button>
              </div>
              <div className="modal-body">
                {/* TODO: Добавить компонент списка сотрудников */}
                <p>Здесь будет список сотрудников</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </PageLayout>
  );
} 