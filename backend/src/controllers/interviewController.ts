import { Request, Response, RequestHandler } from 'express';
import pool from '../config/database';

export interface InterviewData {
    id?: number;
    candidateId: number;
    screening: {
        motivation: string;
        expectedSalary: string;
        noticeTime: string;
        workFormat: string;
        englishLevel: string;
        additionalComments: string;
    };
    technical: {
        experience: string;
        mainTechnologies: string;
        codingTask: string;
        algorithmTask: string;
        systemDesign: string;
        additionalComments: string;
    };
    final: {
        teamWork: string;
        problemSolving: string;
        communication: string;
        careerGoals: string;
        additionalComments: string;
    };
    createdAt?: Date;
    updatedAt?: Date;
}

// GET: Получить интервью кандидата
export const getInterview: RequestHandler = async (req, res) => {
    try {
        const candidateId = parseInt(req.params.candidateId, 10);
        if (isNaN(candidateId)) {
            res.status(400).json({
                success: false,
                error: 'Некорректный ID кандидата'
            });
            return;
        }

        const result = await pool.query(
            'SELECT * FROM interviews WHERE candidate_id = $1',
            [candidateId]
        );

        if (result.rows.length === 0) {
            res.status(404).json({ 
                success: false, 
                error: 'Интервью не найдено' 
            });
            return;
        }

        const interview = result.rows[0];
        res.json({
            success: true,
            data: {
                id: interview.id,
                candidateId: interview.candidate_id,
                screening: {
                    motivation: interview.screening_motivation || '',
                    expectedSalary: interview.screening_expected_salary || '',
                    noticeTime: interview.screening_notice_time || '',
                    workFormat: interview.screening_work_format || '',
                    englishLevel: interview.screening_english_level || '',
                    additionalComments: interview.screening_comments || ''
                },
                technical: {
                    experience: interview.technical_experience || '',
                    mainTechnologies: interview.technical_main_technologies || '',
                    codingTask: interview.technical_coding_task || '',
                    algorithmTask: interview.technical_algorithm_task || '',
                    systemDesign: interview.technical_system_design || '',
                    additionalComments: interview.technical_comments || ''
                },
                final: {
                    teamWork: interview.final_team_work || '',
                    problemSolving: interview.final_problem_solving || '',
                    communication: interview.final_communication || '',
                    careerGoals: interview.final_career_goals || '',
                    additionalComments: interview.final_comments || ''
                },
                createdAt: interview.created_at,
                updatedAt: interview.updated_at
            }
        });
    } catch (error) {
        console.error('Error getting interview:', error);
        res.status(500).json({ 
            success: false, 
            error: 'Ошибка при получении данных интервью' 
        });
    }
};

// POST: Создать или обновить интервью
export const saveInterview: RequestHandler = async (req, res) => {
    try {
        const interviewData: InterviewData = req.body;
        const { candidateId, screening, technical, final } = interviewData;

        // Проверяем существование кандидата
        const candidateExists = await pool.query(
            'SELECT id FROM candidates WHERE id = $1',
            [candidateId]
        );

        if (candidateExists.rows.length === 0) {
            res.status(404).json({
                success: false,
                error: 'Кандидат не найден'
            });
            return;
        }

        // Проверяем существование интервью
        const existingInterview = await pool.query(
            'SELECT id FROM interviews WHERE candidate_id = $1',
            [candidateId]
        );

        if (existingInterview.rows.length > 0) {
            // Обновляем существующее интервью
            const result = await pool.query(
                `UPDATE interviews SET
                    screening_motivation = $1,
                    screening_expected_salary = $2,
                    screening_notice_time = $3,
                    screening_work_format = $4,
                    screening_english_level = $5,
                    screening_comments = $6,
                    technical_experience = $7,
                    technical_main_technologies = $8,
                    technical_coding_task = $9,
                    technical_algorithm_task = $10,
                    technical_system_design = $11,
                    technical_comments = $12,
                    final_team_work = $13,
                    final_problem_solving = $14,
                    final_communication = $15,
                    final_career_goals = $16,
                    final_comments = $17,
                    updated_at = CURRENT_TIMESTAMP
                WHERE candidate_id = $18
                RETURNING *`,
                [
                    screening.motivation,
                    screening.expectedSalary,
                    screening.noticeTime,
                    screening.workFormat,
                    screening.englishLevel,
                    screening.additionalComments,
                    technical.experience,
                    technical.mainTechnologies,
                    technical.codingTask,
                    technical.algorithmTask,
                    technical.systemDesign,
                    technical.additionalComments,
                    final.teamWork,
                    final.problemSolving,
                    final.communication,
                    final.careerGoals,
                    final.additionalComments,
                    candidateId
                ]
            );

            res.json({
                success: true,
                data: result.rows[0]
            });
            return;
        } else {
            // Создаем новое интервью
            const result = await pool.query(
                `INSERT INTO interviews (
                    candidate_id,
                    screening_motivation,
                    screening_expected_salary,
                    screening_notice_time,
                    screening_work_format,
                    screening_english_level,
                    screening_comments,
                    technical_experience,
                    technical_main_technologies,
                    technical_coding_task,
                    technical_algorithm_task,
                    technical_system_design,
                    technical_comments,
                    final_team_work,
                    final_problem_solving,
                    final_communication,
                    final_career_goals,
                    final_comments
                ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18)
                RETURNING *`,
                [
                    candidateId,
                    screening.motivation,
                    screening.expectedSalary,
                    screening.noticeTime,
                    screening.workFormat,
                    screening.englishLevel,
                    screening.additionalComments,
                    technical.experience,
                    technical.mainTechnologies,
                    technical.codingTask,
                    technical.algorithmTask,
                    technical.systemDesign,
                    technical.additionalComments,
                    final.teamWork,
                    final.problemSolving,
                    final.communication,
                    final.careerGoals,
                    final.additionalComments
                ]
            );

            res.json({
                success: true,
                data: result.rows[0]
            });
            return;
        }
    } catch (error) {
        console.error('Error saving interview:', error);
        res.status(500).json({
            success: false,
            error: 'Ошибка при сохранении данных интервью'
        });
    }
};

// DELETE: Удалить интервью
export const deleteInterview: RequestHandler = async (req, res) => {
    try {
        const candidateId = parseInt(req.params.candidateId, 10);
        if (isNaN(candidateId)) {
            return res.status(400).json({
                success: false,
                error: 'Некорректный ID кандидата'
            });
        }

        const result = await pool.query(
            'DELETE FROM interviews WHERE candidate_id = $1 RETURNING *',
            [candidateId]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({
                success: false,
                error: 'Интервью не найдено'
            });
        }

        res.json({
            success: true,
            message: 'Интервью успешно удалено'
        });
    } catch (error) {
        console.error('Error deleting interview:', error);
        res.status(500).json({
            success: false,
            error: 'Ошибка при удалении интервью'
        });
    }
}; 