DROP TABLE IF EXISTS interviews;
DROP TABLE IF EXISTS candidates;

CREATE TABLE IF NOT EXISTS candidates (
    id SERIAL PRIMARY KEY,
    name_ru VARCHAR(200) NOT NULL,
    name_en VARCHAR(200) NOT NULL,
    resume_file_name VARCHAR(255),
    resume_file_url TEXT,
    interview_file TEXT,
    vacancy VARCHAR(200),
    tech_stack TEXT,
    status VARCHAR(20) CHECK (status IN ('new', 'screening', 'interviewing', 'test_task', 'offered', 'rejected', 'hired', 'archived')) DEFAULT 'new',
    status_comment TEXT,
    screening_date TIMESTAMP WITH TIME ZONE,
    recruiter VARCHAR(200),
    telegram VARCHAR(100),
    status_updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    location_city_country VARCHAR(200),
    english_level VARCHAR(50),
    min_salary INTEGER,
    max_salary INTEGER,
    salary_currency VARCHAR(3) DEFAULT 'USD',
    skype VARCHAR(100),
    email VARCHAR(255) UNIQUE NOT NULL,
    phone VARCHAR(20),
    comments TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS interviews (
    id SERIAL PRIMARY KEY,
    candidate_id INTEGER REFERENCES candidates(id) ON DELETE CASCADE,
    -- Скрининг
    screening_motivation TEXT,
    screening_expected_salary TEXT,
    screening_notice_time TEXT,
    screening_work_format TEXT,
    screening_english_level TEXT,
    screening_comments TEXT,
    -- Техническое интервью
    technical_experience TEXT,
    technical_main_technologies TEXT,
    technical_coding_task TEXT,
    technical_algorithm_task TEXT,
    technical_system_design TEXT,
    technical_comments TEXT,
    -- Интервью с тех. лидом
    final_team_work TEXT,
    final_problem_solving TEXT,
    final_communication TEXT,
    final_career_goals TEXT,
    final_comments TEXT,
    -- Метаданные
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
); 