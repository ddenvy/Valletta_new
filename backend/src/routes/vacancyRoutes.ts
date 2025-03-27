import express from 'express';
import { vacancyController } from '../controllers/vacancyController';

const router = express.Router();

// Получить все вакансии
router.get('/', vacancyController.getAllVacancies);

// Получить вакансию по ID
router.get('/:id', vacancyController.getVacancyById);

// Создать новую вакансию
router.post('/', vacancyController.createVacancy);

// Обновить вакансию
router.patch('/:id', vacancyController.updateVacancy);

// Удалить вакансию
router.delete('/:id', vacancyController.deleteVacancy);

export default router; 