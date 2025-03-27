-- Создаем тип для клиентов
CREATE TYPE client_type AS ENUM ('GlobalBit', 'Acterys', 'SQLDBM', 'Andersen');

-- Добавляем поле client в таблицу vacancies
ALTER TABLE vacancies ADD COLUMN IF NOT EXISTS client client_type NOT NULL DEFAULT 'GlobalBit';

-- Изменяем тип поля client на enum
ALTER TABLE vacancies ALTER COLUMN client TYPE client_type USING client::client_type; 