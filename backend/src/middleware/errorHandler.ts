import { Request, Response, NextFunction } from 'express';

export const errorHandler = (fn: Function) => {
    return async (req: Request, res: Response, next: NextFunction) => {
        try {
            await fn(req, res, next);
        } catch (error) {
            console.error('Ошибка:', error);
            
            if (error instanceof Error) {
                res.status(500).json({
                    error: 'Внутренняя ошибка сервера',
                    message: process.env.NODE_ENV === 'development' ? error.message : undefined
                });
            } else {
                res.status(500).json({
                    error: 'Внутренняя ошибка сервера'
                });
            }
        }
    };
}; 