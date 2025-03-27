import { Request, Response, NextFunction } from 'express';
import { z } from 'zod';

const candidateSchema = z.object({
    nameRu: z.string().min(2, 'Имя должно содержать минимум 2 символа'),
    nameEn: z.string().min(2, 'Имя должно содержать минимум 2 символа'),
    email: z.string().email('Некорректный email'),
    vacancy: z.string().min(2, 'Должность должна содержать минимум 2 символа'),
    resumeFileName: z.string().optional(),
    resumeFileUrl: z.string().optional(),
    interviewFile: z.string().optional(),
    techStack: z.string().optional(),
    status: z.enum(['new', 'screening', 'interviewing', 'test_task', 'offered', 'rejected', 'hired', 'archived']).default('new'),
    statusComment: z.string().optional(),
    screeningDate: z.string().optional(),
    recruiter: z.string().optional(),
    telegram: z.string().optional(),
    locationCityCountry: z.string().optional(),
    englishLevel: z.string().optional(),
    minSalary: z.number().optional(),
    maxSalary: z.number().optional(),
    salaryCurrency: z.string().default('USD'),
    skype: z.string().optional(),
    phone: z.string().optional(),
    comments: z.string().optional()
});

export const validateCandidate = (req: Request, res: Response, next: NextFunction) => {
    try {
        candidateSchema.parse(req.body);
        next();
    } catch (error) {
        if (error instanceof z.ZodError) {
            res.status(400).json({
                error: 'Ошибка валидации',
                details: error.errors
            });
        } else {
            next(error);
        }
    }
}; 