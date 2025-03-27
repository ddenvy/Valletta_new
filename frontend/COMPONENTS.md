# Документация по компонентам фронтенда

## Структура компонентов

### Общие компоненты

#### ClientBootstrap
```typescript
// components/ClientBootstrap.tsx
```
Компонент для инициализации клиентских библиотек и глобальных стилей.

#### Layout
```typescript
// components/Layout.tsx
```
Основной макет приложения, включающий навигацию и общую структуру страниц.

### Компоненты вакансий

#### VacancyList
```typescript
// components/vacancy/VacancyList.tsx
```
Список вакансий с возможностью фильтрации и сортировки.

Пропсы:
```typescript
interface VacancyListProps {
    vacancies: Vacancy[];
    onUpdate: (id: string, status: VacancyStatus) => void;
    onDelete: (id: string) => void;
}
```

#### VacancyForm
```typescript
// components/vacancy/VacancyForm.tsx
```
Форма для создания и редактирования вакансий.

Пропсы:
```typescript
interface VacancyFormProps {
    initialData?: Vacancy;
    onSubmit: (data: VacancyFormData) => void;
    onCancel: () => void;
}
```

### Компоненты кандидатов

#### CandidateList
```typescript
// components/candidate/CandidateList.tsx
```
Список кандидатов с возможностью фильтрации и поиска.

Пропсы:
```typescript
interface CandidateListProps {
    candidates: Candidate[];
    onUpdate: (id: string, data: CandidateFormData) => void;
    onDelete: (id: string) => void;
}
```

#### CandidateForm
```typescript
// components/candidate/CandidateForm.tsx
```
Форма для создания и редактирования кандидатов.

Пропсы:
```typescript
interface CandidateFormProps {
    initialData?: Candidate;
    onSubmit: (data: CandidateFormData) => void;
    onCancel: () => void;
}
```

## Типы данных

### Vacancy
```typescript
interface Vacancy {
    id: string;
    title: string;
    description: string;
    requirements: string;
    status: 'active' | 'closed';
    createdAt: string;
    updatedAt: string;
}
```

### Candidate
```typescript
interface Candidate {
    id: string;
    nameRu: string;
    nameEn: string;
    resumeFileName?: string;
    resumeFileUrl?: string;
    interviewFile?: string;
    vacancy: string;
    techStack?: string;
    status: string;
    statusComment?: string;
    screeningDate?: string;
    recruiter?: string;
    telegram?: string;
    statusUpdatedAt?: string;
    locationCityCountry?: string;
    englishLevel?: string;
    minSalary?: number;
    maxSalary?: number;
    salaryCurrency?: string;
    skype?: string;
    email: string;
    phone?: string;
    comments?: string;
    createdAt?: string;
    updatedAt?: string;
}
```

## Сервисы

### VacancyService
```typescript
// services/vacancyService.ts
```
Сервис для работы с API вакансий.

Методы:
- `getAllVacancies(): Promise<Vacancy[]>`
- `getVacancyById(id: string): Promise<Vacancy>`
- `createVacancy(data: VacancyFormData): Promise<Vacancy>`
- `updateVacancy(id: string, data: VacancyFormData): Promise<Vacancy>`
- `deleteVacancy(id: string): Promise<void>`

### CandidateService
```typescript
// services/candidateService.ts
```
Сервис для работы с API кандидатов.

Методы:
- `getAllCandidates(): Promise<Candidate[]>`
- `getCandidateById(id: string): Promise<Candidate>`
- `createCandidate(data: CandidateFormData): Promise<Candidate>`
- `updateCandidate(id: string, data: CandidateFormData): Promise<Candidate>`
- `deleteCandidate(id: string): Promise<void>`

## Стилизация

### Bootstrap
- Используются компоненты и утилиты Bootstrap 5
- Адаптивный дизайн с использованием брейкпоинтов Bootstrap
- Кастомные стили через CSS модули

### Темизация
- Светлая и темная темы
- Переключение через CSS переменные
- Кастомные цвета в `bootstrap.scss`

## Состояние приложения

### React Query
- Кэширование данных
- Автоматическое обновление
- Обработка ошибок
- Оптимистичные обновления

### Локальное состояние
- `useState` для простого состояния
- `useReducer` для сложной логики
- `useContext` для глобального состояния

## Обработка ошибок

### Toast уведомления
- Успешные операции
- Ошибки валидации
- Ошибки сети
- Ошибки сервера

### Формы
- Валидация через Zod
- Отображение ошибок
- Предотвращение повторной отправки

## Производительность

### Оптимизация
- React Server Components
- Динамический импорт
- Кэширование страниц
- Оптимизация изображений

### Мониторинг
- Web Vitals
- Error tracking
- Performance monitoring 