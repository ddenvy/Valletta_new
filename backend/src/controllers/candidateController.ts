import { Request, Response, RequestHandler } from 'express';
import pool from '../config/database';
import { Candidate, ApiResponse } from '../types';

// GET: Получить список всех кандидатов
export const getCandidates: RequestHandler = async (_req: Request, res: Response) => {
    try {
        console.log('Attempting to fetch candidates from database...');
        const result = await pool.query<Candidate>(
            `SELECT 
                id, 
                name_ru as "nameRu", 
                name_en as "nameEn",
                resume_file_name as "resumeFileName",
                resume_file_url as "resumeFileUrl",
                interview_file as "interviewFile",
                vacancy,
                tech_stack as "techStack",
                status,
                status_comment as "statusComment",
                screening_date as "screeningDate",
                recruiter,
                telegram,
                status_updated_at as "statusUpdatedAt",
                location_city_country as "locationCityCountry",
                english_level as "englishLevel",
                min_salary as "minSalary",
                max_salary as "maxSalary",
                salary_currency as "salaryCurrency",
                skype,
                email,
                phone,
                comments,
                created_at as "createdAt",
                updated_at as "updatedAt"
            FROM candidates 
            ORDER BY created_at DESC`
        );
        console.log(`Successfully fetched ${result.rows.length} candidates`);
        res.json({ data: result.rows });
    } catch (error) {
        console.error('Error fetching candidates:', error);
        if (error instanceof Error) {
            console.error('Error details:', {
                message: error.message,
                stack: error.stack
            });
        }
        res.status(500).json({
            error: 'Failed to fetch candidates',
            details: error instanceof Error ? error.message : 'Unknown error'
        });
    }
};

// POST: Создать нового кандидата
export const createCandidate: RequestHandler = async (req: Request, res: Response) => {
    try {
        console.log('Creating candidate with data:', req.body);
        
        const {
            nameRu,
            nameEn,
            resumeFileName,
            resumeFileUrl,
            interviewFile,
            vacancy,
            techStack,
            status = 'new',
            statusComment,
            screeningDate,
            recruiter,
            telegram,
            locationCityCountry,
            englishLevel,
            minSalary,
            maxSalary,
            salaryCurrency = 'USD',
            skype,
            email,
            phone,
            comments
        } = req.body;

        if (!nameRu || !nameEn || !email || !vacancy) {
            res.status(400).json({
                success: false,
                data: null,
                error: 'Missing required fields: nameRu, nameEn, email, vacancy'
            });
            return;
        }

        const result = await pool.query<Candidate>(
            `INSERT INTO candidates (
                name_ru, name_en, resume_file_name, resume_file_url, interview_file,
                vacancy, tech_stack, status, status_comment, screening_date,
                recruiter, telegram, location_city_country, english_level,
                min_salary, max_salary, salary_currency, skype, email, phone, comments
            )
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20, $21)
            RETURNING *`,
            [
                nameRu, nameEn, resumeFileName, resumeFileUrl, interviewFile,
                vacancy, techStack, status, statusComment, screeningDate,
                recruiter, telegram, locationCityCountry, englishLevel,
                minSalary, maxSalary, salaryCurrency, skype, email, phone, comments
            ]
        );

        const response: ApiResponse<Candidate> = {
            success: true,
            data: result.rows[0]
        };

        res.status(201).json(response);
    } catch (error: any) {
        console.error('Error creating candidate:', error);
        
        if (error.code === '23505') {
            res.status(400).json({
                success: false,
                data: null,
                error: 'Email already exists'
            });
            return;
        }

        res.status(500).json({
            success: false,
            data: null,
            error: 'Failed to create candidate'
        });
    }
};

// PUT: Обновить данные кандидата
export const updateCandidate: RequestHandler = async (req: Request, res: Response) => {
    try {
        const id = req.params.id;
        if (!id) {
            res.status(400).json({
                success: false,
                error: 'ID is required'
            });
            return;
        }

        const {
            nameRu,
            nameEn,
            resumeFileName,
            resumeFileUrl,
            interviewFile,
            vacancy,
            techStack,
            status,
            statusComment,
            screeningDate,
            recruiter,
            telegram,
            locationCityCountry,
            englishLevel,
            minSalary,
            maxSalary,
            salaryCurrency,
            skype,
            email,
            phone,
            comments
        } = req.body;

        const checkResult = await pool.query('SELECT id FROM candidates WHERE id = $1', [id]);
        if (checkResult.rows.length === 0) {
            res.status(404).json({
                success: false,
                data: null,
                error: 'Candidate not found'
            });
            return;
        }

        const result = await pool.query<Candidate>(
            `UPDATE candidates 
            SET name_ru = $1,
                name_en = $2,
                resume_file_name = $3,
                resume_file_url = $4,
                interview_file = $5,
                vacancy = $6,
                tech_stack = $7,
                status = $8,
                status_comment = $9,
                screening_date = $10,
                recruiter = $11,
                telegram = $12,
                status_updated_at = CURRENT_TIMESTAMP,
                location_city_country = $13,
                english_level = $14,
                min_salary = $15,
                max_salary = $16,
                salary_currency = $17,
                skype = $18,
                email = $19,
                phone = $20,
                comments = $21,
                updated_at = CURRENT_TIMESTAMP
            WHERE id = $22
            RETURNING *`,
            [
                nameRu, nameEn, resumeFileName, resumeFileUrl, interviewFile,
                vacancy, techStack, status, statusComment, screeningDate,
                recruiter, telegram, locationCityCountry, englishLevel,
                minSalary, maxSalary, salaryCurrency, skype, email, phone,
                comments, id
            ]
        );

        res.json({
            success: true,
            data: result.rows[0]
        });
    } catch (error: any) {
        console.error('Error updating candidate:', error);

        if (error.code === '23505') {
            res.status(400).json({
                success: false,
                data: null,
                error: 'Email already exists'
            });
            return;
        }

        res.status(500).json({
            success: false,
            data: null,
            error: 'Failed to update candidate'
        });
    }
};

// DELETE: Удалить кандидата
export const deleteCandidate: RequestHandler = async (req: Request, res: Response) => {
    try {
        const id = req.params.id;
        if (!id) {
            res.status(400).json({
                success: false,
                error: 'ID is required'
            });
            return;
        }

        const result = await pool.query(
            'DELETE FROM candidates WHERE id = $1 RETURNING *',
            [id]
        );

        if (result.rows.length === 0) {
            res.status(404).json({
                success: false,
                data: null,
                error: 'Candidate not found'
            });
            return;
        }

        res.json({
            success: true,
            data: result.rows[0]
        });
    } catch (error) {
        console.error('Error deleting candidate:', error);
        res.status(500).json({
            success: false,
            data: null,
            error: 'Failed to delete candidate'
        });
    }
}; 