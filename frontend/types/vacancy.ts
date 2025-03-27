export enum VacancyPriority {
  HIGH = 'Высокий',
  MEDIUM = 'Средний',
  LOW = 'Низкий'
}

export const VACANCY_STATUSES = ['active', 'closed', 'draft'] as const;
export type VacancyStatus = typeof VACANCY_STATUSES[number];

export enum EnglishLevel {
  BEGINNER = 'A1',
  ELEMENTARY = 'A2',
  INTERMEDIATE = 'B1',
  UPPER_INTERMEDIATE = 'B2',
  ADVANCED = 'C1',
  PROFICIENT = 'C2'
}

export enum SeniorityLevel {
  JUNIOR = 'Junior',
  MIDDLE = 'Middle',
  SENIOR = 'Senior',
  LEAD = 'Lead'
}

export const VACANCY_PRIORITIES = Object.values(VacancyPriority);
export const ENGLISH_LEVELS = Object.values(EnglishLevel);
export const SENIORITY_LEVELS = Object.values(SeniorityLevel);

export type Client = 'GlobalBit' | 'Acterys' | 'SQLDBM' | 'Andersen';

export interface ContactPerson {
  name: string;
  email: string;
  phone?: string;
}

export interface Vacancy {
  id: string;
  title: string;
  description: string;
  requirements: string[];
  responsibilities: string[];
  salaryRangeMin: number;
  salaryRangeMax: number;
  currency: string;
  location: string;
  employmentType: string;
  status: VacancyStatus;
  department: string;
  level: string;
  tags: string[];
  benefits: string[];
  contactPerson: {
    name: string;
    email: string;
    phone: string;
  };
  client: Client;
  createdAt: string;
  updatedAt: string;
}

export type VacancyFormData = Omit<Vacancy, 'id' | 'createdAt' | 'updatedAt'>;

export type VacancyUpdateData = Partial<VacancyFormData>;

export interface VacancyFilters {
  status?: VacancyStatus;
  priority?: VacancyPriority;
  recruiter?: string;
  client?: string;
} 