import { Request, Response, NextFunction } from 'express';
import multer from 'multer';

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ALLOWED_FILE_TYPES = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];

export const validateFileUpload = (req: Request, res: Response, next: NextFunction) => {
    if (!req.file) {
        return res.status(400).json({
            error: 'Файл не был загружен'
        });
    }

    if (req.file.size > MAX_FILE_SIZE) {
        return res.status(400).json({
            error: 'Размер файла превышает 5MB'
        });
    }

    if (!ALLOWED_FILE_TYPES.includes(req.file.mimetype)) {
        return res.status(400).json({
            error: 'Неподдерживаемый тип файла. Разрешены только PDF и DOC/DOCX'
        });
    }

    next();
}; 