import axios from 'axios';

// Используем переменную окружения, установленную в docker-compose
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'; // Fallback для локального запуска без Docker

const api = axios.create({
    baseURL: `${API_URL}/api/v1`,
    headers: {
        'Content-Type': 'application/json'
    }
});

export interface Candidate {
    id: string;
    nameRu: string;
    nameEn: string;
    resumeFileName?: string;
    resumeFileUrl?: string;
    interviewFile?: string;
    vacancy: string;
    techStack?: string;
    status: string;
    statusComment?: string;
    screeningDate?: string;
    recruiter?: string;
    telegram?: string;
    statusUpdatedAt?: string;
    locationCityCountry?: string;
    englishLevel?: string;
    minSalary?: number;
    maxSalary?: number;
    salaryCurrency?: string;
    skype?: string;
    email: string;
    phone?: string;
    comments?: string;
    createdAt?: string;
    updatedAt?: string;
}

export type CandidateFormData = Omit<Candidate, 'id' | 'createdAt' | 'updatedAt' | 'statusUpdatedAt'>;

export const candidateService = {
    getAllCandidates: async (): Promise<Candidate[]> => {
        const response = await api.get('/candidates');
        return response.data.data;
    },

    createCandidate: async (candidate: CandidateFormData): Promise<Candidate> => {
        const response = await api.post('/candidates', {
            ...candidate,
            screeningDate: candidate.screeningDate || null
        });
        return response.data.data;
    },

    updateCandidate: async (id: string, candidate: CandidateFormData): Promise<Candidate> => {
        const response = await api.put(`/candidates/${id}`, {
            ...candidate,
            screeningDate: candidate.screeningDate || null
        });
        return response.data.data;
    },

    deleteCandidate: async (id: string): Promise<void> => {
        await api.delete(`/candidates/${id}`);
    }
};

export { api }; // Экспортируем инстанс axios, если он используется где-то еще