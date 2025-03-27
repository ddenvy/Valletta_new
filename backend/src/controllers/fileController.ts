import { Request, RequestHandler } from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';

// Конфигурация multer для сохранения файлов
const storage = multer.diskStorage({
    destination: (_req, _file, cb) => {
        const uploadDir = path.join(__dirname, '../../uploads');
        // Создаем директорию, если она не существует
        if (!fs.existsSync(uploadDir)) {
            fs.mkdirSync(uploadDir, { recursive: true });
        }
        cb(null, uploadDir);
    },
    filename: (_req, file, cb) => {
        // Генерируем уникальное имя файла
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, uniqueSuffix + '-' + file.originalname);
    }
});

// Фильтр файлов
const fileFilter = (_req: Request, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
    // Разрешаем только определенные типы файлов
    const allowedMimes = [
        'application/pdf',
        'application/msword',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        'text/plain'
    ];

    if (allowedMimes.includes(file.mimetype)) {
        cb(null, true);
    } else {
        cb(new Error('Invalid file type. Only PDF, DOC, DOCX and TXT files are allowed.'));
    }
};

// Создаем middleware для загрузки файлов
export const upload = multer({
    storage: storage,
    fileFilter: fileFilter,
    limits: {
        fileSize: 5 * 1024 * 1024 // 5MB
    }
});

// Контроллер для загрузки файлов
export const uploadFile: RequestHandler = async (req, res) => {
    try {
        if (!req.file) {
            res.status(400).json({
                success: false,
                error: 'No file uploaded'
            });
            return;
        }

        // Формируем URL для доступа к файлу
        const fileUrl = `/uploads/${req.file.filename}`;

        res.json({
            success: true,
            data: {
                fileName: req.file.originalname,
                fileUrl: fileUrl
            }
        });
    } catch (error) {
        console.error('Error uploading file:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to upload file'
        });
    }
};

// Контроллер для удаления файлов
export const deleteFile: RequestHandler = async (req, res) => {
    try {
        const { filename } = req.params;
        const filePath = path.join(__dirname, '../../uploads', filename);

        // Проверяем существование файла
        if (!fs.existsSync(filePath)) {
            res.status(404).json({
                success: false,
                error: 'File not found'
            });
            return;
        }

        // Удаляем файл
        fs.unlinkSync(filePath);

        res.json({
            success: true,
            data: {
                fileName: filename,
                fileUrl: '',
                message: 'File deleted successfully'
            }
        });
    } catch (error) {
        console.error('Error deleting file:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to delete file'
        });
    }
}; 