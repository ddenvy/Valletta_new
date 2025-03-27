import express from 'express';
import cors from 'cors';
import path from 'path';
import candidatesRouter from './routes/candidateRoutes';
import filesRouter from './routes/fileRoutes';
import interviewsRouter from './routes/interviews';
import vacancyRouter from './routes/vacancyRoutes';

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// Улучшенное логирование middleware
app.use((req, res, next) => {
    const start = Date.now();
    res.on('finish', () => {
        const duration = Date.now() - start;
        console.log(`${req.method} ${req.url} - ${res.statusCode} - ${duration}ms`);
    });
    next();
});

// API routes
app.use('/api/candidates', candidatesRouter);
app.use('/api/files', filesRouter);
app.use('/api/interviews', interviewsRouter);
app.use('/api/vacancies', vacancyRouter);

// Обработчик ошибок
app.use((err: Error, req: express.Request, res: express.Response, next: express.NextFunction) => {
    console.error(err.stack);
    res.status(500).json({
        error: 'Внутренняя ошибка сервера',
        message: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
});

// Обработчик 404
app.use((req: express.Request, res: express.Response) => {
    res.status(404).json({ error: 'Маршрут не найден' });
});

export default app;