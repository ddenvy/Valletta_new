import axios from 'axios';
import { Candidate } from '@/types/candidate';
import { DashboardData, DashboardStats, Activity, Event } from '@/types/dashboard';
import { User, ProfileUpdateData, PasswordChangeData } from '@/types/user';

const API_URL = 'http://localhost:3001/api';

const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json'
    }
});

// API client class
class ApiClient {
    getCurrentBaseUrl() {
        return api.defaults.baseURL;
    }

    async getCurrentUser(): Promise<{ user: User; token: string; refreshToken: string } | null> {
        // Возвращаем моковые данные
        return {
            user: {
                id: '1',
                userName: 'Иван Петров',
                email: 'ivan@example.com',
                position: 'HR Manager',
                role: 'hr',
                photoUrl: '/uploads/user1.jpg',
            },
            token: 'mock-token',
            refreshToken: 'mock-refresh-token'
        };
    }

    async getCandidates(): Promise<{ data: Candidate[] }> {
        try {
            console.log('API: Fetching candidates');
            
            const response = await api.get('/candidates');
            console.log('API: Raw candidates response:', response);
            
            // Добавляем более подробное логирование
            console.log('API: Response structure:', {
                status: response.status,
                statusText: response.statusText,
                hasData: !!response.data,
                dataType: typeof response.data,
                isArray: Array.isArray(response.data)
            });
            
            let candidatesData = response.data;
            
            // Проверяем структуру ответа
            if (!candidatesData) {
                console.error('API: Empty response data');
                return { data: [] };
            }
            
            // Если ответ - объект с полем data, которое является массивом
            if (typeof candidatesData === 'object' && !Array.isArray(candidatesData) && candidatesData.data && Array.isArray(candidatesData.data)) {
                console.log('API: Response is an object with data array property, extracting data array');
                candidatesData = candidatesData.data;
            }
            
            // Если ответ все еще не массив, создаем пустой массив
            if (!Array.isArray(candidatesData)) {
                console.error('API: Expected array but got:', typeof candidatesData, candidatesData);
                return { data: [] };
            }
            
            // Process the response to ensure all required fields are present
            const processedCandidates = candidatesData.map((candidate: any) => {
                // Ensure candidate has an id
                if (!candidate || !candidate.id) {
                    console.error('API: Candidate missing id:', candidate);
                    return null;
                }
                
                return {
                    ...candidate,
                    // Ensure required properties exist
                    id: candidate.id,
                    timestamp: candidate.timestamp || candidate.createdAt || new Date().toISOString(),
                    statusUpdateDate: candidate.statusUpdateDate || new Date().toISOString(),
                    // Map firstName/lastName to nameEn if needed
                    nameEn: candidate.nameEn || (candidate.firstName && candidate.lastName ? `${candidate.firstName} ${candidate.lastName}` : ''),
                    nameRu: candidate.nameRu || '',
                    // Ensure all fields have default values
                    status: candidate.status || 'New',
                    englishLevel: candidate.englishLevel || '',
                    stack: candidate.stack || '',
                    locationCityCountry: candidate.locationCityCountry || '',
                    minSalary: candidate.minSalary || 0,
                    maxSalary: candidate.maxSalary || 0,
                    currency: candidate.currency || 'USD',
                    screeningDate: candidate.screeningDate || null,
                    recruiter: candidate.recruiter || '',
                    comments: candidate.comments || '',
                    phone: candidate.phone || '',
                    telegram: candidate.telegram || '',
                    skype: candidate.skype || '',
                    vacancy: candidate.vacancy || '',
                    statusComment: candidate.statusComment || '',
                    source: candidate.source || 'Manual Entry',
                    resume: candidate.resume || {
                        fileName: '',
                        fileUrl: '',
                        uploadDate: new Date().toISOString()
                    },
                    interviewFile: candidate.interviewFile || '',
                    interviews: candidate.interviews || []
                };
            }).filter(Boolean); // Remove any null entries
            
            console.log('API: Processed candidates data:', processedCandidates);
            return { data: processedCandidates };
        } catch (error: any) {
            console.error('Error fetching candidates:', error);
            if (error.response) {
                console.error('API: Error response:', error.response.status, error.response.data);
                // Return empty array instead of throwing for 401/404 errors
                if (error.response.status === 401 || error.response.status === 404) {
                    console.log('API: Unauthorized or not found, returning empty candidates list');
                    return { data: [] };
                }
                throw new Error(error.response.data.error || 'Failed to fetch candidates');
            }
            throw new Error('Failed to fetch candidates');
        }
    }

    async createCandidate(candidate: Omit<Candidate, 'id' | 'timestamp' | 'statusUpdateDate'>): Promise<Candidate> {
        try {
            // Map nameRu and nameEn to firstName and lastName for backend compatibility
            const nameParts = candidate.nameEn.split(' ');
            const firstName = nameParts[0] || '';
            // If no space in the name, use an empty string for lastName
            const lastName = nameParts.length > 1 ? nameParts.slice(1).join(' ') : '';
            
            // Проверяем и обрабатываем screeningDate
            let screeningDate = null;
            if (candidate.screeningDate) {
                // Если это строка и она не пустая, используем её
                if (typeof candidate.screeningDate === 'string' && candidate.screeningDate.trim() !== '') {
                    screeningDate = candidate.screeningDate;
                } else if (typeof candidate.screeningDate === 'object' && candidate.screeningDate !== null) {
                    try {
                        // Безопасное приведение к Date и использование toISOString
                        const dateObj = candidate.screeningDate as unknown as Date;
                        if (typeof dateObj.toISOString === 'function') {
                            screeningDate = dateObj.toISOString();
                        }
                    } catch (e) {
                        console.error('Error converting screeningDate to ISO string:', e);
                    }
                }
            }
            
            const candidateData = {
                ...candidate,
                firstName,
                lastName,
                // Add required source field
                source: candidate.source || 'Manual Entry',
                // Ensure all required fields are present
                status: candidate.status || 'New',
                statusUpdateDate: new Date().toISOString(),
                // Установка screeningDate в null если оно пустое
                screeningDate: screeningDate
            };
            
            console.log('API: Creating candidate with data:', candidateData);
            
            const response = await api.post('/candidates', candidateData);
            
            // Combine the original input data with the response data to ensure we have all fields
            const mergedData = {
                ...candidate,
                ...response.data,
                // Ensure nameEn is preserved if not returned by the backend
                nameEn: response.data.nameEn || candidate.nameEn || (response.data.firstName && response.data.lastName ? `${response.data.firstName} ${response.data.lastName}` : ''),
                nameRu: response.data.nameRu || candidate.nameRu,
                // Store firstName/lastName for backend compatibility
                firstName: response.data.firstName,
                lastName: response.data.lastName
            };
            
            console.log('API: Candidate created, merged data:', mergedData);
            return mergedData;
        } catch (error: any) {
            console.error('Error creating candidate:', error);
            if (error.response) {
                throw new Error(`${error.response.status}: ${error.response.data.error || 'Failed to create candidate'}`);
            }
            throw new Error('Failed to create candidate');
        }
    }

    async updateCandidate(candidate: Partial<Candidate> & { id: string }): Promise<Candidate> {
        try {
            // Проверяем и обрабатываем screeningDate
            let screeningDate = null;
            if (candidate.screeningDate) {
                // Если это строка и она не пустая, используем её
                if (typeof candidate.screeningDate === 'string' && candidate.screeningDate.trim() !== '') {
                    screeningDate = candidate.screeningDate;
                } else if (typeof candidate.screeningDate === 'object' && candidate.screeningDate !== null) {
                    try {
                        // Безопасное приведение к Date и использование toISOString
                        const dateObj = candidate.screeningDate as unknown as Date;
                        if (typeof dateObj.toISOString === 'function') {
                            screeningDate = dateObj.toISOString();
                        }
                    } catch (e) {
                        console.error('Error converting screeningDate to ISO string:', e);
                    }
                }
            }
            
            const updatedCandidate = {
                ...candidate,
                screeningDate: screeningDate
            };
            
            console.log('API: Updating candidate with data:', updatedCandidate);
            const response = await api.put(`/candidates/${candidate.id}`, updatedCandidate);
            return response.data;
        } catch (error: any) {
            console.error('Error updating candidate:', error);
            if (error.response) {
                throw new Error(error.response.data.error || 'Failed to update candidate');
            }
            throw new Error('Failed to update candidate');
        }
    }

    async deleteCandidate(id: string): Promise<void> {
        try {
            await api.delete(`/candidates/${id}`);
        } catch (error: any) {
            console.error('Error deleting candidate:', error);
            if (error.response) {
                throw new Error(error.response.data.error || 'Failed to delete candidate');
            }
            throw new Error('Failed to delete candidate');
        }
    }

    async getDashboardData(): Promise<DashboardData> {
        try {
            console.log('API: Fetching dashboard data');
            
            const response = await api.get('/dashboard');
            console.log('API: Dashboard data response:', response.data);
            
            return response.data;
        } catch (error) {
            console.error('Error getting dashboard data:', error);
            
            // Возвращаем пустые данные в случае ошибки
            return {
                stats: {
                    activeCandidatesCount: 0,
                    openVacanciesCount: 0,
                    weeklyInterviewsCount: 0
                },
                recentActivities: [],
                upcomingEvents: []
            };
        }
    }
    
    async getDashboardStats(): Promise<DashboardStats> {
        try {
            console.log('API: Fetching dashboard stats');
            
            // Временно возвращаем моковые данные
            const mockStats: DashboardStats = {
                activeCandidates: 24,
                openVacancies: 8,
                weeklyInterviews: 12,
                monthlyHires: 5,
                averageTimeToHire: 14,
                topSkillsInDemand: [
                    { skill: 'React', count: 15 },
                    { skill: 'TypeScript', count: 12 },
                    { skill: 'Node.js', count: 10 },
                    { skill: 'C#', count: 8 },
                    { skill: '.NET', count: 7 },
                    { skill: 'SQL', count: 6 }
                ]
            };

            // Имитируем задержку сети
            await new Promise(resolve => setTimeout(resolve, 500));
            
            return mockStats;
        } catch (error: any) {
            console.error('Error getting dashboard stats:', error);

            // Более детальная обработка ошибок
            if (error.response) {
                console.error('Server responded with error:', error.response.status, error.response.data);
                throw new Error(error.response.data?.message || 'Ошибка получения данных от сервера');
            } else if (error.request) {
                console.error('No response received:', error.request);
                throw new Error('Не удалось получить ответ от сервера');
            } else {
                console.error('Error setting up request:', error.message);
                throw new Error('Ошибка при выполнении запроса');
            }
        }
    }
    
    async getRecentActivities(): Promise<Activity[]> {
        try {
            console.log('API: Fetching recent activities');
            
            const response = await api.get('/dashboard/activities');
            console.log('API: Recent activities response:', response.data);
            
            return response.data;
        } catch (error) {
            console.error('Error getting recent activities:', error);
            
            // Возвращаем пустой массив в случае ошибки
            return [];
        }
    }
    
    async getUpcomingEvents(): Promise<Event[]> {
        try {
            console.log('API: Fetching upcoming events');
            
            const response = await api.get('/dashboard/events');
            console.log('API: Upcoming events response:', response.data);
            
            return response.data;
        } catch (error) {
            console.error('Error getting upcoming events:', error);
            
            // Возвращаем пустой массив в случае ошибки
            return [];
        }
    }

    async logout(): Promise<void> {
        try {
            console.log('API: Logging out user');
            
            await api.post('/api/v1/auth/logout');
            
            console.log('API: User logged out successfully');
        } catch (error) {
            console.error('API: Logout error:', error);
            throw error;
        }
    }
    
    async refreshToken(): Promise<void> {
        try {
            console.log('API: Refreshing token');
            
            await api.post('/api/v1/auth/refresh');
            
            console.log('API: Token refreshed successfully');
        } catch (error) {
            console.error('API: Token refresh error:', error);
            throw error;
        }
    }

    // Add response interceptor to handle token refresh
    constructor() {
        api.interceptors.response.use(
            (response) => response,
            async (error) => {
                const originalRequest = error.config;
                
                // If the error is 401 and we haven't tried to refresh the token yet
                if (error.response.status === 401 && !originalRequest._retry) {
                    originalRequest._retry = true;
                    
                    try {
                        // Try to refresh the token
                        await this.refreshToken();
                        
                        // Retry the original request
                        return api(originalRequest);
                    } catch (refreshError) {
                        // If refresh token fails, redirect to login
                        console.error('API: Token refresh failed:', refreshError);
                        window.location.href = '/login';
                        return Promise.reject(refreshError);
                    }
                }
                
                return Promise.reject(error);
            }
        );
    }

    async updateProfile(data: ProfileUpdateData): Promise<User> {
        const response = await api.put('/users/profile', data);
        return response.data;
    }

    async changePassword(data: PasswordChangeData): Promise<void> {
        // В реальном приложении здесь был бы запрос к API
        console.log('Change password:', data);
        
        // Имитация задержки
        await new Promise(resolve => setTimeout(resolve, 500));
        
        // Проверяем, что пользователь авторизован
        const authResponse = await this.getCurrentUser();
        if (!authResponse) {
            throw new Error('Пользователь не авторизован');
        }
        
        // В реальном приложении здесь была бы проверка текущего пароля
        // и установка нового пароля
        
        // Имитируем успешное изменение пароля
        return;
    }

    async getUsers(): Promise<User[]> {
        // В реальном приложении здесь был бы запрос к API
        console.log('Get users');
        
        // Имитация задержки
        await new Promise(resolve => setTimeout(resolve, 500));
        
        // Проверяем, что пользователь авторизован и является администратором
        const authResponse = await this.getCurrentUser();
        if (!authResponse) {
            throw new Error('Пользователь не авторизован');
        }
        
        if (authResponse.user.role !== 'admin') {
            throw new Error('Недостаточно прав для выполнения операции');
        }
        
        // Возвращаем моковые данные
        return [
            {
                id: '1',
                name: 'Иван Петров',
                email: 'ivan@example.com',
                position: 'HR Manager',
                role: 'hr',
                photoUrl: '/uploads/user1.jpg',
            },
            {
                id: '2',
                name: 'Анна Смирнова',
                email: 'anna@example.com',
                position: 'Frontend Developer',
                role: 'employee',
                photoUrl: '/uploads/user2.jpg',
            },
            {
                id: '3',
                name: 'Алексей Иванов',
                email: 'alexey@example.com',
                position: 'CTO',
                role: 'admin',
                photoUrl: '/uploads/user3.jpg',
            },
            {
                id: '4',
                name: 'Мария Козлова',
                email: 'maria@example.com',
                position: 'Backend Developer',
                role: 'employee',
                photoUrl: '/uploads/user4.jpg',
            },
        ];
    }

    async createUser(data: RegisterData): Promise<User> {
        // В реальном приложении здесь был бы запрос к API
        console.log('Create user:', data);
        
        // Имитация задержки
        await new Promise(resolve => setTimeout(resolve, 500));
        
        // Проверяем, что пользователь авторизован и является администратором
        const authResponse = await this.getCurrentUser();
        if (!authResponse) {
            throw new Error('Пользователь не авторизован');
        }
        
        if (authResponse.user.role !== 'admin') {
            throw new Error('Недостаточно прав для выполнения операции');
        }
        
        // Имитируем создание пользователя
        const newUser: User = {
            id: Date.now().toString(),
            name: data.name,
            email: data.email,
            position: data.position,
            role: data.role || 'employee',
            photoUrl: '',
        };
        
        return newUser;
    }

    async updateUser(id: string, data: Partial<User>): Promise<User> {
        // В реальном приложении здесь был бы запрос к API
        console.log('Update user:', id, data);
        
        // Имитация задержки
        await new Promise(resolve => setTimeout(resolve, 500));
        
        // Проверяем, что пользователь авторизован и является администратором
        const authResponse = await this.getCurrentUser();
        if (!authResponse) {
            throw new Error('Пользователь не авторизован');
        }
        
        if (authResponse.user.role !== 'admin') {
            throw new Error('Недостаточно прав для выполнения операции');
        }
        
        // Получаем список пользователей
        const users = await this.getUsers();
        
        // Находим пользователя по ID
        const user = users.find(u => u.id === id);
        if (!user) {
            throw new Error('Пользователь не найден');
        }
        
        // Обновляем данные пользователя
        const updatedUser: User = {
            ...user,
            ...data,
        };
        
        return updatedUser;
    }

    async deleteUser(id: string): Promise<void> {
        // В реальном приложении здесь был бы запрос к API
        console.log('Delete user:', id);
        
        // Имитация задержки
        await new Promise(resolve => setTimeout(resolve, 500));
        
        // Проверяем, что пользователь авторизован и является администратором
        const authResponse = await this.getCurrentUser();
        if (!authResponse) {
            throw new Error('Пользователь не авторизован');
        }
        
        if (authResponse.user.role !== 'admin') {
            throw new Error('Недостаточно прав для выполнения операции');
        }
        
        // В реальном приложении здесь было бы удаление пользователя
        
        return;
    }
}

// Create and export API instance
export const apiClient = new ApiClient();

// Экспортируем экземпляр API для использования в приложении
export { api };
