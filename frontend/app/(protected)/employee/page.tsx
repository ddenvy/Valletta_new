'use client';

import { useState, useEffect } from 'react';
import { Employee, EmployeeFormData, EmploymentType, EMPLOYMENT_TYPES } from '@/types/employee';
import {
  MagnifyingGlassIcon,
  FunnelIcon,
  PlusIcon,
  XMarkIcon
} from '@heroicons/react/24/outline';
import EmployeeList from '@/components/employee/EmployeeList';
import EmployeeForm from '@/components/employee/EmployeeForm';
import { employeeService } from '@/services/employeeService';
import PageLayout from '@/components/shared/PageLayout';

interface EmployeeFilters {
  position?: string;
  employmentType?: EmploymentType;
  employmentPlace?: string;
}

export default function EmployeeContent() {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilters, setActiveFilters] = useState<EmployeeFilters>({});
  const [showForm, setShowForm] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState<Employee | null>(null);

  useEffect(() => {
    fetchEmployees();
  }, []);

  const fetchEmployees = async () => {
    setLoading(true);
    try {
      const data = await employeeService.getAllEmployees();
      setEmployees(data);
      setError(null);
    } catch (err) {
      setError('Ошибка при загрузке сотрудников');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddEmployee = () => {
    setEditingEmployee(null);
    setShowForm(true);
  };

  const handleEditEmployee = (employee: Employee) => {
    setEditingEmployee(employee);
    setShowForm(true);
  };

  const handleDeleteEmployee = async (id: number) => {
    try {
      await employeeService.deleteEmployee(id);
      setEmployees(employees.filter(employee => employee.id !== id));
    } catch (error) {
      console.error('Ошибка при удалении сотрудника:', error);
      setError('Не удалось удалить сотрудника');
    }
  };

  const handleFormSubmit = async (formData: EmployeeFormData) => {
    try {
      if (editingEmployee) {
        // Обновление существующего сотрудника
        const updatedEmployee = await employeeService.updateEmployee(editingEmployee.id, formData);
        setEmployees(employees.map(e => e.id === updatedEmployee.id ? updatedEmployee : e));
      } else {
        // Добавление нового сотрудника
        const newEmployee = await employeeService.createEmployee(formData);
        setEmployees([newEmployee, ...employees]);
      }
      
      setShowForm(false);
      setEditingEmployee(null);
    } catch (error) {
      console.error('Ошибка при сохранении сотрудника:', error);
      setError('Не удалось сохранить сотрудника');
    }
  };

  const handleCancelForm = () => {
    setShowForm(false);
    setEditingEmployee(null);
  };

  const handleUpdateEmployee = async (updatedEmployee: Employee) => {
    try {
      const { id, ...employeeData } = updatedEmployee;
      const result = await employeeService.updateEmployee(id, employeeData);
      setEmployees(employees.map(e => e.id === result.id ? result : e));
    } catch (error) {
      console.error('Ошибка при обновлении сотрудника:', error);
      setError('Не удалось обновить сотрудника');
    }
  };

  const handleSearch = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setSearchQuery(query);
    
    // Если query пустой, просто загрузим всех сотрудников
    if (!query.trim()) {
      fetchEmployees();
      return;
    }
    
    try {
      setLoading(true);
      const results = await employeeService.searchEmployees(query);
      setEmployees(results);
      setLoading(false);
    } catch (error) {
      console.error('Ошибка при поиске сотрудников:', error);
      setError('Не удалось выполнить поиск');
      setLoading(false);
    }
  };

  const handleFilterChange = (field: keyof EmployeeFilters, value: string | null) => {
    const newFilters = { ...activeFilters };
    
    if (value) {
      if (field === 'employmentType') {
        // Проверяем, является ли значение допустимым типом занятости
        if (EMPLOYMENT_TYPES.includes(value as EmploymentType)) {
          newFilters[field] = value as EmploymentType;
        }
      } else {
        newFilters[field] = value;
      }
    } else {
      delete newFilters[field];
    }
    
    setActiveFilters(newFilters);
    applyFilters(newFilters);
  };

  const applyFilters = async (filters: EmployeeFilters) => {
    try {
      setLoading(true);
      
      // Если нет фильтров и нет поискового запроса, загружаем всех сотрудников
      if (Object.keys(filters).length === 0 && !searchQuery) {
        await fetchEmployees();
      } else {
        // Иначе применяем фильтры
        const filteredResults = await employeeService.filterEmployees(filters);
        
        // Если есть поисковый запрос, отфильтруем еще и по нему
        const finalResults = searchQuery 
          ? filteredResults.filter(employee => 
              employee.nameRu.toLowerCase().includes(searchQuery.toLowerCase()) ||
              employee.nameEn.toLowerCase().includes(searchQuery.toLowerCase()) ||
              employee.position.toLowerCase().includes(searchQuery.toLowerCase()) ||
              employee.employmentPlace.toLowerCase().includes(searchQuery.toLowerCase())
            )
          : filteredResults;
        
        setEmployees(finalResults);
      }
      
      setLoading(false);
    } catch (error) {
      console.error('Ошибка при фильтрации сотрудников:', error);
      setError('Не удалось применить фильтр');
      setLoading(false);
    }
  };

  const clearFilters = () => {
    setActiveFilters({});
    setSearchQuery('');
    fetchEmployees();
  };

  // Применяем фильтры на уже загруженных данных (в случае если сервис не дает такой возможности)
  const filteredEmployees = employees.filter(employee => {
    // Фильтр по поисковому запросу (избыточно, т.к. мы уже делаем поиск на сервере, но оставим для подстраховки)
    const matchesSearch = searchQuery === '' || 
      employee.nameRu.toLowerCase().includes(searchQuery.toLowerCase()) ||
      employee.nameEn.toLowerCase().includes(searchQuery.toLowerCase()) ||
      employee.position.toLowerCase().includes(searchQuery.toLowerCase()) ||
      employee.employmentPlace.toLowerCase().includes(searchQuery.toLowerCase());
    
    // Фильтр по типу занятости
    const matchesType = !activeFilters.employmentType || 
      employee.employmentType === activeFilters.employmentType;
    
    // Фильтр по должности
    const matchesPosition = !activeFilters.position || 
      employee.position.toLowerCase().includes(activeFilters.position.toLowerCase());
    
    // Фильтр по месту работы
    const matchesPlace = !activeFilters.employmentPlace || 
      employee.employmentPlace.toLowerCase().includes(activeFilters.employmentPlace.toLowerCase());
    
    return matchesSearch && matchesType && matchesPosition && matchesPlace;
  });

  if (showForm) {
    return (
      <div className="container-fluid">
        <EmployeeForm 
          initialData={editingEmployee || undefined}
          onSubmit={handleFormSubmit}
          onCancel={handleCancelForm}
        />
      </div>
    );
  }

  const renderHeader = () => (
    <div className="row g-3">
      <div className="col-md-9">
        <div className="position-relative">
          <div className="position-absolute top-50 start-0 translate-middle-y ms-3">
            <MagnifyingGlassIcon className="icon-base w-4 h-4 text-muted" />
          </div>
          <input
            type="text"
            value={searchQuery}
            onChange={handleSearch}
            placeholder="Поиск сотрудников..."
            className="form-control form-control-sm ps-5"
          />
          {searchQuery && (
            <button
              className="position-absolute top-50 end-0 translate-middle-y me-3 border-0 bg-transparent p-1"
              onClick={() => setSearchQuery('')}
            >
              <XMarkIcon className="icon-base w-4 h-4 text-muted" />
            </button>
          )}
        </div>
      </div>
    </div>
  );

  const addButton = (
    <button
      onClick={handleAddEmployee}
      className="btn btn-primary d-inline-flex align-items-center gap-2"
    >
      <PlusIcon className="icon-sm" />
      <span>Добавить</span>
    </button>
  );

  return (
    <PageLayout
      title="Сотрудники"
      actions={addButton}
      header={renderHeader()}
    >
      {error && (
        <div className="alert alert-danger" role="alert">
          {error}
        </div>
      )}

      <EmployeeList
        employees={filteredEmployees}
        onUpdateEmployee={handleUpdateEmployee}
        onAddEmployee={handleAddEmployee}
        onDeleteEmployee={handleDeleteEmployee}
        onEditEmployee={handleEditEmployee}
      />
    </PageLayout>
  );
} 