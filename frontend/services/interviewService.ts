import axios from 'axios';

const API_URL = 'http://localhost:3001/api';

export interface InterviewData {
    id?: number;
    candidateId: number;
    screening: {
        motivation: string;
        expectedSalary: string;
        noticeTime: string;
        workFormat: string;
        englishLevel: string;
        additionalComments: string;
    };
    technical: {
        experience: string;
        mainTechnologies: string;
        codingTask: string;
        algorithmTask: string;
        systemDesign: string;
        additionalComments: string;
    };
    final: {
        teamWork: string;
        problemSolving: string;
        communication: string;
        careerGoals: string;
        additionalComments: string;
    };
    createdAt?: string;
    updatedAt?: string;
}

export const interviewService = {
    // Получить интервью кандидата
    async getInterview(candidateId: number): Promise<InterviewData | null> {
        try {
            const response = await axios.get(`${API_URL}/interviews/${candidateId}`);
            return response.data.data;
        } catch (error) {
            console.error('Error fetching interview:', error);
            return null;
        }
    },

    // Создать или обновить интервью
    async saveInterview(data: InterviewData): Promise<InterviewData> {
        try {
            const response = await axios.post(`${API_URL}/interviews`, data);
            return response.data.data;
        } catch (error) {
            console.error('Error saving interview:', error);
            throw error;
        }
    },

    // Удалить интервью
    async deleteInterview(candidateId: number): Promise<void> {
        try {
            await axios.delete(`${API_URL}/interviews/${candidateId}`);
        } catch (error) {
            console.error('Error deleting interview:', error);
            throw error;
        }
    }
}; 