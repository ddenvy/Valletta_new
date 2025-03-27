import axios from 'axios';

const API_URL = 'http://localhost:3001/api';

export interface Candidate {
    id: number;
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    status: 'new' | 'interviewing' | 'offered' | 'hired' | 'rejected';
    position: string;
    createdAt: Date;
    updatedAt: Date;
}

export const candidateService = {
    // Получить всех кандидатов
    async getAllCandidates(): Promise<Candidate[]> {
        const response = await axios.get(`${API_URL}/candidates`);
        return response.data.data;
    },

    // Создать нового кандидата
    async createCandidate(candidate: Omit<Candidate, 'id' | 'createdAt' | 'updatedAt'>): Promise<Candidate> {
        const response = await axios.post(`${API_URL}/candidates`, candidate);
        return response.data.data;
    },

    // Обновить кандидата
    async updateCandidate(id: number, candidate: Omit<Candidate, 'id' | 'createdAt' | 'updatedAt'>): Promise<Candidate> {
        const response = await axios.put(`${API_URL}/candidates/${id}`, candidate);
        return response.data.data;
    },

    // Удалить кандидата
    async deleteCandidate(id: number): Promise<void> {
        await axios.delete(`${API_URL}/candidates/${id}`);
    }
}; 