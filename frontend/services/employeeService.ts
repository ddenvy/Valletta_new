import { Employee, EmployeeFormData } from '../types/employee';
import axiosInstance from './axios';

export const employeeService = {
    // Получить всех сотрудников
    getAllEmployees: async (): Promise<Employee[]> => {
        const response = await axiosInstance.get('/employees');
        return response.data;
    },

    // Создать сотрудника
    createEmployee: async (data: EmployeeFormData): Promise<Employee> => {
        const response = await axiosInstance.post('/employees', data);
        return response.data;
    },

    // Обновить сотрудника
    updateEmployee: async (id: number, data: EmployeeFormData): Promise<Employee> => {
        const response = await axiosInstance.put(`/employees/${id}`, data);
        return response.data;
    },

    // Удалить сотрудника
    deleteEmployee: async (id: number): Promise<void> => {
        await axiosInstance.delete(`/employees/${id}`);
    },

    // Поиск сотрудников
    searchEmployees: async (query: string): Promise<Employee[]> => {
        const response = await axiosInstance.get(`/employees/search?q=${encodeURIComponent(query)}`);
        return response.data;
    },

    // Фильтрация сотрудников
    filterEmployees: async (filters: any): Promise<Employee[]> => {
        const response = await axiosInstance.get('/employees/filter', { params: filters });
        return response.data;
    }
}; 