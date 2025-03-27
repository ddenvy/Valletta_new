export type DepartmentType = 'Отдел' | 'Проект';

export const DEPARTMENT_TYPES: DepartmentType[] = ['Отдел', 'Проект'];

export interface Department {
  id: string;
  name: string; // Название отдела или проекта
  type: DepartmentType; // Тип: отдел или проект
  description: string; // Описание отдела или проекта
  client?: string; // Заказчик (только для проектов)
  employeeIds: string[]; // Идентификаторы сотрудников, работающих в отделе/проекте
  createdAt: string; // Дата создания записи
  updatedAt: string; // Дата обновления записи
}

export type DepartmentWithEmployeeCount = Department & {
  employeeCount: number;
};

export type DepartmentFormData = Omit<Department, 'id' | 'createdAt' | 'updatedAt'> & {
  employeeIds?: string[];
};

export interface DepartmentFilters {
  type?: DepartmentType;
  client?: string;
} 