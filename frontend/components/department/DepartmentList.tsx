'use client';

import { useState } from 'react';
import { Department, DepartmentType, DEPARTMENT_TYPES, DepartmentWithEmployeeCount } from '@/types/department';
import DynamicClientOnlyDateTime from '@/components/shared/DynamicClientOnlyDateTime';
import {
  ChevronDownIcon,
  ChevronUpIcon,
  PencilSquareIcon,
  TrashIcon,
  UserGroupIcon,
  BuildingOfficeIcon,
  BriefcaseIcon,
  CheckIcon,
  XMarkIcon
} from '@heroicons/react/24/outline';

interface DepartmentListProps {
  departments: DepartmentWithEmployeeCount[];
  onUpdateDepartment: (department: Department) => Promise<void>;
  onDeleteDepartment: (id: string) => Promise<void>;
  onEditDepartment: (department: Department) => void;
  onViewEmployees: (departmentId: string) => Promise<void>;
}

type EditableCell = {
  departmentId: string;
  field: keyof Department;
};

const departmentTableStyles = `
.departments-table-container {
  width: 100%;
  overflow-x: auto;
  background-color: var(--bs-body-bg);
  border-radius: 0.5rem;
  border: 1px solid var(--bs-border-color);
}

.departments-table {
  width: 100%;
  margin-bottom: 0;
  border-collapse: collapse;
  font-size: 0.875rem;
}

.departments-table th {
  padding: 0.75rem 1rem;
  font-weight: 600;
  text-align: left;
  border-bottom: 2px solid var(--bs-border-color);
  background-color: var(--bs-body-bg);
  position: sticky;
  top: 0;
  z-index: 1;
}

.departments-table td {
  padding: 0.75rem 1rem;
  vertical-align: middle;
  border-bottom: 1px solid var(--bs-border-color);
}

.departments-table tr:last-child td {
  border-bottom: none;
}

.departments-table .text-cell {
  max-width: 200px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.type-badge {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.375rem 0.75rem;
  border-radius: 0.375rem;
  font-size: 0.875rem;
  font-weight: 500;
  line-height: 1;
  white-space: nowrap;
}

.type-badge svg {
  width: 1rem;
  height: 1rem;
}

.type-Отдел {
  background-color: var(--bs-primary-rgb, 13, 110, 253, 0.1);
  color: var(--bs-primary);
}

.type-Проект {
  background-color: var(--bs-success-rgb, 25, 135, 84, 0.1);
  color: var(--bs-success);
}

.department-icon {
  width: 1rem;
  height: 1rem;
  color: inherit;
}

.action-button {
  padding: 0.25rem;
  background: none;
  border: none;
  color: var(--bs-secondary);
  transition: all 0.2s;
  border-radius: 0.25rem;
  line-height: 1;
  cursor: pointer;
}

.action-button:hover {
  color: var(--bs-primary);
  background-color: rgba(var(--bs-primary-rgb), 0.1);
}

.action-button svg {
  width: 1rem;
  height: 1rem;
}

.editable-cell {
  cursor: pointer;
  padding: 0.25rem;
  border-radius: 0.25rem;
  transition: background-color 0.2s;
}

.editable-cell:hover {
  background-color: rgba(var(--bs-primary-rgb), 0.05);
}

.sort-button {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0;
  background: none;
  border: none;
  font-weight: 600;
  color: var(--bs-body-color);
  cursor: pointer;
}

.sort-button:hover {
  color: var(--bs-primary);
}

.sort-icon {
  width: 0.875rem;
  height: 0.875rem;
  transition: transform 0.2s;
}
`;

export default function DepartmentList({
  departments,
  onUpdateDepartment,
  onDeleteDepartment,
  onEditDepartment,
  onViewEmployees
}: DepartmentListProps) {
  const [sortField, setSortField] = useState<keyof DepartmentWithEmployeeCount>('name');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const [editableCell, setEditableCell] = useState<EditableCell | null>(null);
  const [editValue, setEditValue] = useState<string>('');
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [departmentToDelete, setDepartmentToDelete] = useState<string | null>(null);

  const sortedDepartments = [...departments].sort((a, b) => {
    const aValue = a[sortField];
    const bValue = b[sortField];
    
    if (aValue === undefined && bValue === undefined) return 0;
    if (aValue === undefined) return sortDirection === 'asc' ? -1 : 1;
    if (bValue === undefined) return sortDirection === 'asc' ? 1 : -1;
    
    if (typeof aValue === 'string' && typeof bValue === 'string') {
      if (sortField === 'createdAt' || sortField === 'updatedAt') {
        return sortDirection === 'asc' 
          ? new Date(aValue).getTime() - new Date(bValue).getTime()
          : new Date(bValue).getTime() - new Date(aValue).getTime();
      }
      
      return sortDirection === 'asc' 
        ? aValue.localeCompare(bValue)
        : bValue.localeCompare(aValue);
    }
    
    if (typeof aValue === 'number' && typeof bValue === 'number') {
      return sortDirection === 'asc' ? aValue - bValue : bValue - aValue;
    }
    
    return 0;
  });

  const handleSort = (field: keyof DepartmentWithEmployeeCount) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const SortIcon = ({ field }: { field: keyof DepartmentWithEmployeeCount }) => {
    if (sortField !== field) return null;
    return sortDirection === 'asc' 
      ? <ChevronUpIcon className="sort-icon" />
      : <ChevronDownIcon className="sort-icon" />;
  };

  const getTypeIcon = (type: DepartmentType) => {
    return type === 'Отдел' 
      ? <BuildingOfficeIcon className="department-icon" />
      : <BriefcaseIcon className="department-icon" />;
  };

  const startEditing = (department: Department, field: keyof Department) => {
    if (field !== 'id' && field !== 'employeeIds' && field !== 'createdAt' && field !== 'updatedAt') {
      if (field !== 'client' || department.type === 'Проект') {
        setEditableCell({ departmentId: department.id, field });
        setEditValue(department[field] as string || '');
      }
    }
  };

  const handleUpdate = async (updatedDepartment: Department) => {
    await onUpdateDepartment(updatedDepartment);
    setEditableCell(null);
    setEditValue('');
  };

  const cancelEdit = () => {
    setEditableCell(null);
    setEditValue('');
  };

  const confirmDelete = (id: string) => {
    setDepartmentToDelete(id);
    setShowDeleteConfirm(true);
  };

  const handleConfirmDelete = async () => {
    if (departmentToDelete) {
      await onDeleteDepartment(departmentToDelete);
      setShowDeleteConfirm(false);
      setDepartmentToDelete(null);
    }
  };

  const handleCancelDelete = () => {
    setShowDeleteConfirm(false);
    setDepartmentToDelete(null);
  };

  const renderEditableCell = (department: Department, field: keyof Department, currentValue: any) => {
    const isEditing = editableCell?.departmentId === department.id && editableCell?.field === field;

    if (isEditing) {
      return (
        <div className="d-flex align-items-center gap-2">
          {field === 'type' ? (
            <select
              className="form-select form-select-sm"
              value={editValue}
              onChange={(e) => setEditValue(e.target.value)}
              autoFocus
            >
              {DEPARTMENT_TYPES.map(type => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>
          ) : field === 'description' ? (
            <textarea
              className="form-control form-control-sm"
              value={editValue}
              onChange={(e) => setEditValue(e.target.value)}
              rows={3}
              autoFocus
            />
          ) : (
            <input
              type="text"
              className="form-control form-control-sm"
              value={editValue}
              onChange={(e) => setEditValue(e.target.value)}
              autoFocus
            />
          )}
          <div className="d-flex gap-1">
            <button 
              className="action-button text-success"
              onClick={() => handleUpdate({ ...department, [field]: editValue })}
            >
              <CheckIcon className="department-icon" />
            </button>
            <button 
              className="action-button text-danger"
              onClick={cancelEdit}
            >
              <XMarkIcon className="department-icon" />
            </button>
          </div>
        </div>
      );
    }

    if (field === 'type') {
      return (
        <span className={`type-badge type-${currentValue}`}>
          {getTypeIcon(currentValue as DepartmentType)}
          <span>{currentValue}</span>
        </span>
      );
    }

    if (field === 'client') {
      if (department.type === 'Проект') {
        return (
          <div 
            className="editable-cell"
            onDoubleClick={() => startEditing(department, field)}
          >
            {currentValue || 'Не указан'}
          </div>
        );
      }
      return <div>-</div>;
    }

    if (field === 'description') {
      return (
        <div 
          className="editable-cell text-cell"
          onDoubleClick={() => startEditing(department, field)}
          title={currentValue}
        >
          {currentValue || '-'}
        </div>
      );
    }

    return (
      <div 
        className="editable-cell"
        onDoubleClick={() => startEditing(department, field)}
      >
        {currentValue || '-'}
      </div>
    );
  };

  return (
    <>
      <style>{departmentTableStyles}</style>
      <div className="departments-table-container">
        <table className="departments-table">
          <thead>
            <tr>
              <th>
                <button 
                  className="sort-button"
                  onClick={() => handleSort('type')}
                >
                  Тип
                  <SortIcon field="type" />
                </button>
              </th>
              <th>
                <button 
                  className="sort-button"
                  onClick={() => handleSort('name')}
                >
                  Название
                  <SortIcon field="name" />
                </button>
              </th>
              <th>
                <button 
                  className="sort-button"
                  onClick={() => handleSort('description')}
                >
                  Описание
                  <SortIcon field="description" />
                </button>
              </th>
              <th>
                <button 
                  className="sort-button"
                  onClick={() => handleSort('client')}
                >
                  Заказчик
                  <SortIcon field="client" />
                </button>
              </th>
              <th>
                <button 
                  className="sort-button"
                  onClick={() => handleSort('employeeCount')}
                >
                  Сотрудники
                  <SortIcon field="employeeCount" />
                </button>
              </th>
              <th style={{ width: '100px' }}></th>
            </tr>
          </thead>
          <tbody>
            {sortedDepartments.map((department) => (
              <tr key={department.id}>
                <td>{renderEditableCell(department, 'type', department.type)}</td>
                <td className="text-cell">
                  {renderEditableCell(department, 'name', department.name)}
                </td>
                <td className="text-cell">
                  {renderEditableCell(department, 'description', department.description)}
                </td>
                <td className="text-cell">
                  {renderEditableCell(department, 'client', department.client)}
                </td>
                <td>
                  <div className="d-flex align-items-center gap-2">
                    <UserGroupIcon className="department-icon text-secondary" />
                    <span>{department.employeeCount}</span>
                    <button
                      className="btn btn-link btn-sm p-0 ms-2"
                      onClick={() => onViewEmployees(department.id)}
                    >
                      Просмотр
                    </button>
                  </div>
                </td>
                <td>
                  <div className="d-flex gap-2 justify-content-end">
                    <button
                      className="action-button"
                      onClick={() => onEditDepartment(department)}
                      title="Редактировать"
                    >
                      <PencilSquareIcon className="department-icon" />
                    </button>
                    <button
                      className="action-button"
                      onClick={() => confirmDelete(department.id)}
                      title="Удалить"
                    >
                      <TrashIcon className="department-icon" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showDeleteConfirm && (
        <div className="modal show" style={{ display: 'block' }}>
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Подтверждение удаления</h5>
                <button type="button" className="btn-close" onClick={handleCancelDelete}></button>
              </div>
              <div className="modal-body">
                Вы уверены, что хотите удалить этот отдел/проект? Это действие нельзя отменить.
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={handleCancelDelete}>
                  Отмена
                </button>
                <button type="button" className="btn btn-danger" onClick={handleConfirmDelete}>
                  Удалить
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
} 