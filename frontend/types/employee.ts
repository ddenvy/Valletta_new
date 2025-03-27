export type EmploymentType = 'Проект' | 'Отдел';

export const EMPLOYMENT_TYPES: EmploymentType[] = ['Проект', 'Отдел'];

export interface Employee {
  id: number;
  nameRu: string; // Имя на русском
  nameEn: string; // Имя на английском
  position: string; // Должность
  employmentType: string;
  employmentPlace: string;
  department: string;
  email: string;
  startDate: string; // Дата начала работы
  resumeUrl?: string; // Ссылка на резюме
  comments?: string; // Комментарий
  createdAt: string; // Дата создания записи
  updatedAt: string; // Дата обновления записи
}

export type EmployeeFormData = Omit<Employee, 'id' | 'createdAt' | 'updatedAt'>;

export interface EmployeeFilters {
  position?: string;
  employmentType?: EmploymentType;
  employmentPlace?: string;
} 