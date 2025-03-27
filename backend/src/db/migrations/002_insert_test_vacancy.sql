-- Добавляем тестовую вакансию
INSERT INTO vacancies (title, description, requirements, salary, status)
VALUES (
    'Senior Frontend Developer',
    'Мы ищем опытного Frontend разработчика для создания современных веб-приложений с использованием React, TypeScript и Next.js.',
    '- Опыт работы с React и TypeScript от 3 лет\n- Знание Next.js и его экосистемы\n- Опыт работы с современными инструментами разработки (Git, Docker)\n- Умение работать в команде и коммуникабельность\n- Опыт работы с REST API',
    'от 150 000 ₽',
    'active'
); 