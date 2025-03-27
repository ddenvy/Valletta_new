export type CandidateStatus = 'Новый' | 'Скрининг' | 'Интервью' | 'Тестовое задание' | 'Оффер' | 'Отказ' | 'Принят' | 'Архив';

export const CANDIDATE_STATUSES: CandidateStatus[] = [
  'Новый',
  'Скрининг',
  'Интервью',
  'Тестовое задание',
  'Оффер',
  'Отказ',
  'Принят',
  'Архив'
];

export type EnglishLevel = 'A1' | 'A2' | 'B1' | 'B2' | 'C1' | 'C2' | 'Не требуется';

export const ENGLISH_LEVELS: EnglishLevel[] = ['A1', 'A2', 'B1', 'B2', 'C1', 'C2', 'Не требуется'];

export type Currency = 'RUB' | 'USD' | 'EUR';

export const CURRENCIES: Currency[] = ['RUB', 'USD', 'EUR'];

export interface Candidate {
  id: string;
  timestamp: string; // Дата создания записи
  email: string; // Адрес электронной почты
  nameRu: string; // Имя кандидата на русском языке
  nameEn: string; // Имя на английском языке
  resumeUrl: string; // Ссылка на резюме
  interviewFileUrl?: string; // Файл интервью
  vacancy: string; // Вакансия
  stack: string; // Стек технологий
  status: CandidateStatus; // Статус
  statusComment?: string; // Комментарий статуса
  screeningDate?: string; // Дата скрининга
  screeningRecruiter?: string; // Рекрутер скрининга
  telegram?: string; // Телеграм
  statusUpdateDate: string; // Дата обновления статуса
  location: string; // Город/страна
  englishLevel: EnglishLevel; // Уровень английского
  salaryMin?: number; // Минимальная зарплата
  salaryMax?: number; // Максимальная зарплата
  salaryCurrency?: Currency; // Валюта зарплаты
  skype?: string; // Skype
  phone?: string; // Телефон
  comments?: string; // Дополнительные комментарии
  tags?: string[]; // Теги для фильтрации
}

export type CandidateFormData = Omit<Candidate, 'id' | 'timestamp' | 'statusUpdateDate'>;
