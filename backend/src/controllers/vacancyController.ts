import { Request, Response } from 'express';
import { Pool } from 'pg';
import { pool } from '../db';

interface VacancyRow {
  id: number;
  title: string;
  description: string;
  requirements: string[];
  responsibilities: string[];
  salaryRangeMin: number;
  salaryRangeMax: number;
  currency: string;
  location: string;
  employmentType: string;
  status: string;
  createdAt: Date;
  updatedAt: Date;
  department: string;
  level: string;
  tags: string[];
  benefits: string[];
  contactPersonName: string;
  contactPersonEmail: string;
  contactPersonPhone: string;
  client: string;
}

export const vacancyController = {
  // Получить все вакансии
  async getAllVacancies(req: Request, res: Response) {
    try {
      const result = await pool.query(`
        SELECT 
          id,
          title,
          description,
          requirements,
          responsibilities,
          salary_range_min as "salaryRangeMin",
          salary_range_max as "salaryRangeMax",
          currency,
          location,
          employment_type as "employmentType",
          status,
          created_at as "createdAt",
          updated_at as "updatedAt",
          department,
          level,
          tags,
          benefits,
          contact_person_name as "contactPersonName",
          contact_person_email as "contactPersonEmail",
          contact_person_phone as "contactPersonPhone",
          client
        FROM vacancies 
        ORDER BY created_at DESC
      `);

      // Преобразуем данные в нужный формат
      const vacancies = result.rows.map((row: VacancyRow) => ({
        id: row.id.toString(),
        title: row.title,
        description: row.description,
        requirements: row.requirements || [],
        responsibilities: row.responsibilities || [],
        salaryRangeMin: row.salaryRangeMin,
        salaryRangeMax: row.salaryRangeMax,
        currency: row.currency || 'RUB',
        location: row.location || 'Москва',
        employmentType: row.employmentType || 'Полная занятость',
        status: row.status,
        createdAt: row.createdAt.toISOString(),
        updatedAt: row.updatedAt.toISOString(),
        department: row.department || '',
        level: row.level || '',
        tags: row.tags || [],
        benefits: row.benefits || [],
        contactPerson: {
          name: row.contactPersonName || '',
          email: row.contactPersonEmail || '',
          phone: row.contactPersonPhone || ''
        },
        client: row.client || 'GlobalBit'
      }));

      res.json({ data: vacancies });
    } catch (error) {
      console.error('Ошибка при получении вакансий:', error);
      res.status(500).json({ error: 'Ошибка при получении списка вакансий' });
    }
  },

  // Получить вакансию по ID
  async getVacancyById(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const result = await pool.query(`
        SELECT 
          id,
          title,
          description,
          requirements,
          responsibilities,
          salary_range_min as "salaryRangeMin",
          salary_range_max as "salaryRangeMax",
          currency,
          location,
          employment_type as "employmentType",
          status,
          created_at as "createdAt",
          updated_at as "updatedAt",
          department,
          level,
          tags,
          benefits,
          contact_person_name as "contactPersonName",
          contact_person_email as "contactPersonEmail",
          contact_person_phone as "contactPersonPhone",
          client
        FROM vacancies 
        WHERE id = $1
      `, [id]);
      
      if (result.rows.length === 0) {
        return res.status(404).json({ error: 'Вакансия не найдена' });
      }

      const row = result.rows[0];
      const vacancy = {
        id: row.id.toString(),
        title: row.title,
        description: row.description,
        requirements: row.requirements || [],
        responsibilities: row.responsibilities || [],
        salaryRangeMin: row.salaryRangeMin,
        salaryRangeMax: row.salaryRangeMax,
        currency: row.currency || 'RUB',
        location: row.location || 'Москва',
        employmentType: row.employmentType || 'Полная занятость',
        status: row.status,
        createdAt: row.createdAt.toISOString(),
        updatedAt: row.updatedAt.toISOString(),
        department: row.department || '',
        level: row.level || '',
        tags: row.tags || [],
        benefits: row.benefits || [],
        contactPerson: {
          name: row.contactPersonName || '',
          email: row.contactPersonEmail || '',
          phone: row.contactPersonPhone || ''
        },
        client: row.client || 'GlobalBit'
      };
      
      res.json({ data: vacancy });
    } catch (error) {
      console.error('Ошибка при получении вакансии:', error);
      res.status(500).json({ error: 'Ошибка при получении вакансии' });
    }
  },

  // Создать новую вакансию
  async createVacancy(req: Request, res: Response) {
    try {
      const {
        title,
        description,
        requirements,
        responsibilities,
        salaryRangeMin,
        salaryRangeMax,
        currency,
        location,
        employmentType,
        status,
        department,
        level,
        tags,
        benefits,
        contactPerson,
        client
      } = req.body;

      const result = await pool.query(
        `INSERT INTO vacancies (
          title,
          description,
          requirements,
          responsibilities,
          salary_range_min,
          salary_range_max,
          currency,
          location,
          employment_type,
          status,
          department,
          level,
          tags,
          benefits,
          contact_person_name,
          contact_person_email,
          contact_person_phone,
          client
        ) VALUES (
          $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18
        )
        RETURNING 
          id,
          title,
          description,
          requirements,
          responsibilities,
          salary_range_min as "salaryRangeMin",
          salary_range_max as "salaryRangeMax",
          currency,
          location,
          employment_type as "employmentType",
          status,
          created_at as "createdAt",
          updated_at as "updatedAt",
          department,
          level,
          tags,
          benefits,
          contact_person_name as "contactPersonName",
          contact_person_email as "contactPersonEmail",
          contact_person_phone as "contactPersonPhone",
          client`,
        [
          title,
          description,
          requirements,
          responsibilities,
          salaryRangeMin,
          salaryRangeMax,
          currency,
          location,
          employmentType,
          status,
          department,
          level,
          tags,
          benefits,
          contactPerson?.name,
          contactPerson?.email,
          contactPerson?.phone,
          client
        ]
      );

      const row = result.rows[0];
      const vacancy = {
        id: row.id.toString(),
        title: row.title,
        description: row.description,
        requirements: row.requirements || [],
        responsibilities: row.responsibilities || [],
        salaryRangeMin: row.salaryRangeMin,
        salaryRangeMax: row.salaryRangeMax,
        currency: row.currency || 'RUB',
        location: row.location || 'Москва',
        employmentType: row.employmentType || 'Полная занятость',
        status: row.status,
        createdAt: row.createdAt.toISOString(),
        updatedAt: row.updatedAt.toISOString(),
        department: row.department || '',
        level: row.level || '',
        tags: row.tags || [],
        benefits: row.benefits || [],
        contactPerson: {
          name: row.contactPersonName || '',
          email: row.contactPersonEmail || '',
          phone: row.contactPersonPhone || ''
        },
        client: row.client || 'GlobalBit'
      };

      res.status(201).json({ data: vacancy });
    } catch (error) {
      console.error('Ошибка при создании вакансии:', error);
      res.status(500).json({ error: 'Ошибка при создании вакансии' });
    }
  },

  // Обновить вакансию
  async updateVacancy(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const {
        title,
        description,
        requirements,
        responsibilities,
        salaryRangeMin,
        salaryRangeMax,
        currency,
        location,
        employmentType,
        status,
        department,
        level,
        tags,
        benefits,
        contactPerson,
        client
      } = req.body;

      console.log('Updating vacancy with ID:', id);
      console.log('Request body:', JSON.stringify(req.body, null, 2));

      // Проверяем и преобразуем id в число
      const vacancyId = parseInt(id, 10);
      if (isNaN(vacancyId)) {
        return res.status(400).json({ error: 'Некорректный ID вакансии' });
      }

      // Проверяем и преобразуем числовые значения
      const parsedSalaryMin = salaryRangeMin ? parseInt(salaryRangeMin, 10) : null;
      const parsedSalaryMax = salaryRangeMax ? parseInt(salaryRangeMax, 10) : null;

      // Проверяем массивы
      const parsedRequirements = Array.isArray(requirements) ? requirements : [];
      const parsedResponsibilities = Array.isArray(responsibilities) ? responsibilities : [];
      const parsedTags = Array.isArray(tags) ? tags : [];
      const parsedBenefits = Array.isArray(benefits) ? benefits : [];

      const result = await pool.query(
        `UPDATE vacancies 
        SET 
          title = $1,
          description = $2,
          requirements = $3,
          responsibilities = $4,
          salary_range_min = $5,
          salary_range_max = $6,
          currency = $7,
          location = $8,
          employment_type = $9,
          status = $10,
          department = $11,
          level = $12,
          tags = $13,
          benefits = $14,
          contact_person_name = $15,
          contact_person_email = $16,
          contact_person_phone = $17,
          client = $18,
          updated_at = CURRENT_TIMESTAMP
        WHERE id = $19 
        RETURNING 
          id,
          title,
          description,
          requirements,
          responsibilities,
          salary_range_min as "salaryRangeMin",
          salary_range_max as "salaryRangeMax",
          currency,
          location,
          employment_type as "employmentType",
          status,
          created_at as "createdAt",
          updated_at as "updatedAt",
          department,
          level,
          tags,
          benefits,
          contact_person_name as "contactPersonName",
          contact_person_email as "contactPersonEmail",
          contact_person_phone as "contactPersonPhone",
          client`,
        [
          title || '',
          description || '',
          parsedRequirements,
          parsedResponsibilities,
          parsedSalaryMin,
          parsedSalaryMax,
          currency || 'RUB',
          location || '',
          employmentType || '',
          status || 'active',
          department || '',
          level || '',
          parsedTags,
          parsedBenefits,
          contactPerson?.name || '',
          contactPerson?.email || '',
          contactPerson?.phone || '',
          client || 'GlobalBit',
          vacancyId
        ]
      );
      
      if (result.rows.length === 0) {
        console.log('Vacancy not found with ID:', id);
        return res.status(404).json({ error: 'Вакансия не найдена' });
      }

      console.log('Successfully updated vacancy. Result:', JSON.stringify(result.rows[0], null, 2));

      const row = result.rows[0];
      const vacancy = {
        id: row.id.toString(),
        title: row.title,
        description: row.description,
        requirements: row.requirements || [],
        responsibilities: row.responsibilities || [],
        salaryRangeMin: row.salaryRangeMin,
        salaryRangeMax: row.salaryRangeMax,
        currency: row.currency || 'RUB',
        location: row.location || 'Москва',
        employmentType: row.employmentType || 'Полная занятость',
        status: row.status,
        createdAt: row.createdAt.toISOString(),
        updatedAt: row.updatedAt.toISOString(),
        department: row.department || '',
        level: row.level || '',
        tags: row.tags || [],
        benefits: row.benefits || [],
        contactPerson: {
          name: row.contactPersonName || '',
          email: row.contactPersonEmail || '',
          phone: row.contactPersonPhone || ''
        },
        client: row.client || 'GlobalBit'
      };

      res.json({ data: vacancy });
    } catch (error) {
      console.error('Ошибка при обновлении вакансии:', error);
      res.status(500).json({ error: 'Ошибка при обновлении вакансии' });
    }
  },

  // Удалить вакансию
  async deleteVacancy(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const result = await pool.query('DELETE FROM vacancies WHERE id = $1 RETURNING *', [id]);
      
      if (result.rows.length === 0) {
        return res.status(404).json({ error: 'Вакансия не найдена' });
      }
      
      res.status(204).send();
    } catch (error) {
      console.error('Ошибка при удалении вакансии:', error);
      res.status(500).json({ error: 'Ошибка при удалении вакансии' });
    }
  }
}; 