'use client';

import { useState } from 'react';
import { Employee, EmploymentType, EMPLOYMENT_TYPES } from '@/types/employee';
import DynamicClientOnlyDateTime from '@/components/shared/DynamicClientOnlyDateTime';
import {
  ChevronDownIcon,
  ChevronUpIcon,
  DocumentArrowDownIcon,
  CheckIcon,
  XMarkIcon,
  PencilSquareIcon,
  TrashIcon,
  BriefcaseIcon,
  BuildingOfficeIcon
} from '@heroicons/react/24/outline';

interface EmployeeListProps {
  employees: Employee[];
  onUpdateEmployee: (employee: Employee) => void;
  onAddEmployee: () => void;
  onDeleteEmployee: (id: number) => void;
  onEditEmployee?: (employee: Employee) => void;
}

// Тип для редактируемой ячейки
type EditableCell = {
  employeeId: number;
  field: keyof Employee;
};

const employeeTableStyles = `
.table-container {
  overflow-x: auto;
  max-width: 100%;
  border: 1px solid var(--bs-border-color);
  border-radius: 0.5rem;
}

.employee-table {
  width: 100%;
  font-size: 0.9rem;
  border-collapse: collapse;
  margin-bottom: 0;
}

.employee-table th {
  padding: 0.5rem;
  font-weight: 600;
  white-space: nowrap;
  background-color: var(--bs-body-bg);
  position: sticky;
  top: 0;
  z-index: 1;
}

.employee-table td {
  padding: 0.5rem;
  vertical-align: middle;
  border-bottom: 1px solid var(--bs-border-color);
}

.employee-table tr:last-child td {
  border-bottom: none;
}

.action-button {
  padding: 0.25rem;
  background: none;
  border: none;
  color: var(--bs-secondary);
  transition: all 0.2s;
  border-radius: 0.25rem;
  line-height: 1;
}

.action-button:hover {
  color: var(--bs-primary);
  background-color: var(--bs-gray-200);
}

.action-button svg {
  width: 1rem;
  height: 1rem;
}

.text-cell {
  max-width: 150px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.employment-type-badge {
  display: inline-flex;
  align-items: center;
  padding: 0.25rem 0.5rem;
  border-radius: 0.25rem;
  font-size: 0.85rem;
  font-weight: 500;
}

.employment-type-Проект {
  background-color: #dbeafe;
  color: #1e40af;
}

.employment-type-Отдел {
  background-color: #dcfce7;
  color: #166534;
}
`;

export default function EmployeeList({ 
  employees, 
  onUpdateEmployee, 
  onAddEmployee,
  onDeleteEmployee, 
  onEditEmployee 
}: EmployeeListProps) {
  const [sortField, setSortField] = useState<keyof Employee>('startDate');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
  const [editableCell, setEditableCell] = useState<EditableCell | null>(null);
  const [editValue, setEditValue] = useState<string>('');
  
  // Состояние для модального окна подтверждения удаления
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [employeeToDelete, setEmployeeToDelete] = useState<number | null>(null);
  
  // Сортировка сотрудников
  const sortedEmployees = [...employees].sort((a, b) => {
    const aValue = a[sortField];
    const bValue = b[sortField];
    
    if (aValue === undefined && bValue === undefined) return 0;
    if (aValue === undefined) return sortDirection === 'asc' ? -1 : 1;
    if (bValue === undefined) return sortDirection === 'asc' ? 1 : -1;
    
    if (typeof aValue === 'string' && typeof bValue === 'string') {
      if (sortField === 'startDate' || sortField === 'createdAt' || sortField === 'updatedAt') {
        // Сортировка дат
        return sortDirection === 'asc' 
          ? new Date(aValue).getTime() - new Date(bValue).getTime()
          : new Date(bValue).getTime() - new Date(aValue).getTime();
      }
      
      return sortDirection === 'asc' 
        ? aValue.localeCompare(bValue)
        : bValue.localeCompare(aValue);
    }
    
    return 0;
  });
  
  const handleSort = (field: keyof Employee) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };
  
  const startEditing = (employee: Employee, field: keyof Employee) => {
    setEditableCell({ employeeId: employee.id, field });
    setEditValue(employee[field] as string || '');
  };
  
  const handleUpdate = (updatedEmployee: Employee) => {
    onUpdateEmployee(updatedEmployee);
    setEditableCell(null);
  };
  
  const cancelEdit = () => {
    setEditableCell(null);
    setEditValue('');
  };
  
  const SortIcon = ({ field }: { field: keyof Employee }) => {
    if (sortField !== field) return null;
    
    return sortDirection === 'asc' 
      ? <ChevronUpIcon className="icon-sm ms-1" />
      : <ChevronDownIcon className="icon-sm ms-1" />;
  };
  
  const getEmploymentTypeIcon = (type: EmploymentType) => {
    return type === 'Проект' 
      ? <BriefcaseIcon className="icon-sm me-1 text-primary" />
      : <BuildingOfficeIcon className="icon-sm me-1 text-success" />;
  };
  
  const renderEditableCell = (employee: Employee, field: keyof Employee, currentValue: any) => {
    const isEditing = editableCell?.employeeId === employee.id && editableCell?.field === field;
    
    if (isEditing) {
      if (field === 'employmentType') {
        return (
          <div className="d-flex align-items-center">
            <select
              className="form-select form-select-sm"
              value={editValue}
              onChange={(e) => setEditValue(e.target.value)}
              autoFocus
            >
              {EMPLOYMENT_TYPES.map(type => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>
            <div className="d-flex ms-2">
              <button 
                className="btn btn-sm btn-link text-success p-1"
                onClick={() => handleUpdate({ ...employee, [field]: editValue as EmploymentType })}
              >
                <CheckIcon className="icon-sm" />
              </button>
              <button 
                className="btn btn-sm btn-link text-danger p-1"
                onClick={cancelEdit}
              >
                <XMarkIcon className="icon-sm" />
              </button>
            </div>
          </div>
        );
      } else if (field === 'startDate') {
        return (
          <div className="d-flex align-items-center">
            <input
              type="date"
              className="form-control form-control-sm"
              value={editValue ? new Date(editValue).toISOString().split('T')[0] : ''}
              onChange={(e) => setEditValue(e.target.value)}
              autoFocus
            />
            <div className="d-flex ms-2">
              <button 
                className="btn btn-sm btn-link text-success p-1"
                onClick={() => handleUpdate({ ...employee, [field]: editValue })}
              >
                <CheckIcon className="icon-sm" />
              </button>
              <button 
                className="btn btn-sm btn-link text-danger p-1"
                onClick={cancelEdit}
              >
                <XMarkIcon className="icon-sm" />
              </button>
            </div>
          </div>
        );
      } else {
        return (
          <div className="d-flex align-items-center">
            <input
              type="text"
              className="form-control form-control-sm"
              value={editValue}
              onChange={(e) => setEditValue(e.target.value)}
              autoFocus
            />
            <div className="d-flex ms-2">
              <button 
                className="btn btn-sm btn-link text-success p-1"
                onClick={() => handleUpdate({ ...employee, [field]: editValue })}
              >
                <CheckIcon className="icon-sm" />
              </button>
              <button 
                className="btn btn-sm btn-link text-danger p-1"
                onClick={cancelEdit}
              >
                <XMarkIcon className="icon-sm" />
              </button>
            </div>
          </div>
        );
      }
    }
    
    const handleDoubleClick = () => {
      if (field !== 'id' && field !== 'createdAt' && field !== 'updatedAt') {
        startEditing(employee, field);
      }
    };
    
    // Отображение значения ячейки
    if (field === 'startDate' || field === 'createdAt' || field === 'updatedAt') {
      return (
        <div 
          className="cursor-pointer"
          onClick={() => field !== 'createdAt' && field !== 'updatedAt' && startEditing(employee, field)}
        >
          <DynamicClientOnlyDateTime date={currentValue} />
        </div>
      );
    } else if (field === 'employmentType') {
      return (
        <div 
          className="d-flex align-items-center cursor-pointer"
          onClick={() => startEditing(employee, field)}
        >
          <span className={`badge ${currentValue === 'Проект' ? 'bg-primary-subtle text-primary' : 'bg-success-subtle text-success'}`}>
            {getEmploymentTypeIcon(currentValue as EmploymentType)}
            {currentValue}
          </span>
        </div>
      );
    } else if (field === 'resumeUrl') {
      return currentValue ? (
        <a 
          href={currentValue} 
          target="_blank" 
          rel="noopener noreferrer"
          className="text-blue-600 hover:text-blue-800"
        >
          <DocumentArrowDownIcon className="action-btn-icon inline-block" />
        </a>
      ) : '-';
    } else {
      return (
        <div 
          className="text-truncate cursor-pointer"
          style={{ maxWidth: '200px' }}
          onClick={() => startEditing(employee, field)}
        >
          {currentValue || '—'}
        </div>
      );
    }
  };
  
  // Функция для показа модального окна подтверждения удаления
  const confirmDelete = (id: number) => {
    setEmployeeToDelete(id);
    setShowDeleteConfirm(true);
  };
  
  // Функция для подтверждения удаления
  const handleConfirmDelete = () => {
    if (employeeToDelete) {
      onDeleteEmployee(employeeToDelete);
      setShowDeleteConfirm(false);
      setEmployeeToDelete(null);
    }
  };
  
  // Функция для отмены удаления
  const handleCancelDelete = () => {
    setShowDeleteConfirm(false);
    setEmployeeToDelete(null);
  };
  
  return (
    <div className="table-container">
      <style jsx>{employeeTableStyles}</style>
      <table className="employee-table">
        <thead>
          <tr>
            <th onClick={() => handleSort('nameRu')} style={{ cursor: 'pointer' }}>
              Имя (RU) <SortIcon field="nameRu" />
            </th>
            <th onClick={() => handleSort('nameEn')} style={{ cursor: 'pointer' }}>
              Имя (EN) <SortIcon field="nameEn" />
            </th>
            <th onClick={() => handleSort('position')} style={{ cursor: 'pointer' }}>
              Должность <SortIcon field="position" />
            </th>
            <th onClick={() => handleSort('employmentType')} style={{ cursor: 'pointer' }}>
              Тип <SortIcon field="employmentType" />
            </th>
            <th onClick={() => handleSort('employmentPlace')} style={{ cursor: 'pointer' }}>
              Место <SortIcon field="employmentPlace" />
            </th>
            <th onClick={() => handleSort('startDate')} style={{ cursor: 'pointer' }}>
              Дата начала <SortIcon field="startDate" />
            </th>
            <th>Действия</th>
          </tr>
        </thead>
        <tbody>
          {sortedEmployees.map((employee) => (
            <tr key={employee.id}>
              <td>{renderEditableCell(employee, 'nameRu', employee.nameRu)}</td>
              <td>{renderEditableCell(employee, 'nameEn', employee.nameEn)}</td>
              <td>{renderEditableCell(employee, 'position', employee.position)}</td>
              <td>{renderEditableCell(employee, 'employmentType', employee.employmentType)}</td>
              <td>{renderEditableCell(employee, 'employmentPlace', employee.employmentPlace)}</td>
              <td>{renderEditableCell(employee, 'startDate', employee.startDate)}</td>
              <td>
                <div className="d-flex gap-1">
                  {onEditEmployee && (
                    <button
                      onClick={() => onEditEmployee(employee)}
                      className="btn btn-sm btn-link text-primary p-1"
                      title="Редактировать"
                    >
                      <PencilSquareIcon className="icon-sm" />
                    </button>
                  )}
                  <button
                    onClick={() => confirmDelete(employee.id)}
                    className="btn btn-sm btn-link text-danger p-1"
                    title="Удалить"
                  >
                    <TrashIcon className="icon-sm" />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Delete confirmation modal */}
      {showDeleteConfirm && (
        <div className="modal show d-block" tabIndex={-1}>
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Подтверждение удаления</h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={handleCancelDelete}
                ></button>
              </div>
              <div className="modal-body">
                <p>Вы уверены, что хотите удалить этого сотрудника?</p>
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={handleCancelDelete}
                >
                  Отмена
                </button>
                <button
                  type="button"
                  className="btn btn-danger"
                  onClick={handleConfirmDelete}
                >
                  Удалить
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 