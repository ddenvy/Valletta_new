import { Router } from 'express';
import { upload, uploadFile, deleteFile } from '../controllers/fileController';
import { errorHandler } from '../middleware/errorHandler';
import { validateFileUpload } from '../middleware/fileValidation';

const router = Router();

// POST /api/files/upload
router.post('/upload', 
    upload.single('file'),
    validateFileUpload,
    errorHandler(uploadFile)
);

// DELETE /api/files/:filename
router.delete('/:filename', errorHandler(deleteFile));

export default router; 