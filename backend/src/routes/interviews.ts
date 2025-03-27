import { Router, RequestHandler } from 'express';
import { getInterview, saveInterview, deleteInterview } from '../controllers/interviewController';

const router = Router();

// GET: Получить интервью кандидата
router.get('/:candidateId', getInterview as RequestHandler);

// POST: Создать или обновить интервью
router.post('/', saveInterview as RequestHandler);

// DELETE: Удалить интервью
router.delete('/:candidateId', deleteInterview as RequestHandler);

export default router;