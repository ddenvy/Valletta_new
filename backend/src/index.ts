import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import candidateRoutes from './routes/candidateRoutes';
import fileRoutes from './routes/fileRoutes';
import vacancyRoutes from './routes/vacancyRoutes';

dotenv.config();

const app = express();
const port = process.env.PORT || 3001;

// Безопасность
app.use(helmet());
app.use(cors({
    origin: process.env.FRONTEND_URL || 'http://localhost:3000',
    credentials: true
}));

// Rate limiting
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 минут
    max: 100 // максимум 100 запросов с одного IP
});
app.use(limiter);

// Middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Статическая раздача файлов из папки uploads
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// Routes
app.use('/api/v1/candidates', candidateRoutes);
app.use('/api/v1/files', fileRoutes);
app.use('/api/v1/vacancies', vacancyRoutes);

// Health check endpoint
app.get('/health', (_req, res) => {
    res.json({ 
        status: 'ok',
        timestamp: new Date().toISOString(),
        uptime: process.uptime()
    });
});

// Graceful shutdown
const server = app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});

process.on('SIGTERM', () => {
    console.log('SIGTERM получен. Закрытие сервера...');
    server.close(() => {
        console.log('Сервер закрыт');
        process.exit(0);
    });
}); 