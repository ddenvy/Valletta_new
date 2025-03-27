-- Добавляем новые колонки в таблицу vacancies
ALTER TABLE vacancies
ADD COLUMN IF NOT EXISTS salary_range_min INTEGER,
ADD COLUMN IF NOT EXISTS salary_range_max INTEGER,
ADD COLUMN IF NOT EXISTS currency VARCHAR(10) DEFAULT 'RUB',
ADD COLUMN IF NOT EXISTS location VARCHAR(255),
ADD COLUMN IF NOT EXISTS employment_type VARCHAR(50),
ADD COLUMN IF NOT EXISTS department VARCHAR(100),
ADD COLUMN IF NOT EXISTS level VARCHAR(50),
ADD COLUMN IF NOT EXISTS tags TEXT[] DEFAULT '{}',
ADD COLUMN IF NOT EXISTS benefits TEXT[] DEFAULT '{}',
ADD COLUMN IF NOT EXISTS responsibilities TEXT[] DEFAULT '{}',
ADD COLUMN IF NOT EXISTS contact_person_name VARCHAR(255),
ADD COLUMN IF NOT EXISTS contact_person_email VARCHAR(255),
ADD COLUMN IF NOT EXISTS contact_person_phone VARCHAR(50);

-- Обновляем существующие записи
UPDATE vacancies
SET 
  salary_range_min = 150000,
  salary_range_max = 250000,
  currency = 'RUB',
  location = 'Москва',
  employment_type = 'Полная занятость',
  level = 'Senior',
  tags = ARRAY['React', 'TypeScript', 'Next.js'],
  benefits = ARRAY['ДМС', 'Гибкий график', 'Удаленная работа'],
  responsibilities = ARRAY['Разработка фронтенд-приложений', 'Код-ревью', 'Участие в планировании'],
  contact_person_name = 'HR Manager',
  contact_person_email = 'hr@company.com'; 