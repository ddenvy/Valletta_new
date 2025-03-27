import axiosInstance from './axios';
import { Vacancy, VacancyFormData, VacancyUpdateData } from '@/types/vacancy';

class VacancyService {
  async getVacancies(): Promise<Vacancy[]> {
    const response = await axiosInstance.get<{ data: Vacancy[] }>('/vacancies');
    return response.data.data;
  }

  async getVacancy(id: string): Promise<Vacancy> {
    const response = await axiosInstance.get<{ data: Vacancy }>(`/vacancies/${id}`);
    return response.data.data;
  }

  async createVacancy(data: VacancyFormData): Promise<Vacancy> {
    const response = await axiosInstance.post<{ data: Vacancy }>('/vacancies', data);
    return response.data.data;
  }

  async updateVacancy(id: string, data: VacancyUpdateData): Promise<Vacancy> {
    const response = await axiosInstance.patch<{ data: Vacancy }>(`/vacancies/${id}`, data);
    return response.data.data;
  }

  async deleteVacancy(id: string): Promise<void> {
    await axiosInstance.delete(`/vacancies/${id}`);
  }
}

export const vacancyService = new VacancyService(); 