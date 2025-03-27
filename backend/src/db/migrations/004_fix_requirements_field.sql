-- Изменяем тип поля requirements на массив
ALTER TABLE vacancies 
ALTER COLUMN requirements TYPE TEXT[] 
USING string_to_array(requirements, E'\n');

-- Обновляем существующие записи, если requirements пустые
UPDATE vacancies 
SET requirements = '{}' 
WHERE requirements IS NULL; 