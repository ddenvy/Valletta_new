import { Department, DepartmentFormData, DepartmentType, DepartmentWithEmployeeCount } from '@/types/department';
import { Employee } from '@/types/employee';
import { employeeService } from './employeeService';
import { v4 as uuidv4 } from 'uuid';

// Мок-данные для отделов и проектов
const mockDepartments: Department[] = [
  {
    id: '1',
    name: 'Разработка',
    type: 'Отдел',
    description: 'Отдел разработки программного обеспечения',
    employeeIds: ['1', '3', '5'], // ID сотрудников из employeeService
    createdAt: '2020-01-10T10:00:00Z',
    updatedAt: '2023-03-15T14:30:00Z'
  },
  {
    id: '2',
    name: 'HR Portal',
    type: 'Проект',
    description: 'Разработка HR-портала для внутреннего использования',
    client: 'ООО "Технологии будущего"',
    employeeIds: ['1'], // ID сотрудников из employeeService
    createdAt: '2022-05-01T09:15:00Z',
    updatedAt: '2023-01-20T11:45:00Z'
  },
  {
    id: '3',
    name: 'HR',
    type: 'Отдел',
    description: 'Отдел управления персоналом',
    employeeIds: ['2'], // ID сотрудников из employeeService
    createdAt: '2020-02-15T13:20:00Z',
    updatedAt: '2022-11-05T10:10:00Z'
  },
  {
    id: '4',
    name: 'Banking API',
    type: 'Проект',
    description: 'Разработка API для банковской системы',
    client: 'АО "ФинансТех"',
    employeeIds: ['3'], // ID сотрудников из employeeService
    createdAt: '2022-01-15T08:30:00Z',
    updatedAt: '2023-02-10T16:45:00Z'
  },
  {
    id: '5',
    name: 'Финансы',
    type: 'Отдел',
    description: 'Отдел финансов и бухгалтерии',
    employeeIds: ['4'], // ID сотрудников из employeeService
    createdAt: '2020-03-20T11:00:00Z',
    updatedAt: '2022-10-15T09:30:00Z'
  },
  {
    id: '6',
    name: 'Cloud Infrastructure',
    type: 'Проект',
    description: 'Разработка и поддержка облачной инфраструктуры',
    client: 'ООО "Цифровые решения"',
    employeeIds: ['5'], // ID сотрудников из employeeService
    createdAt: '2021-06-10T14:00:00Z',
    updatedAt: '2023-01-25T15:20:00Z'
  }
];

/**
 * Сервис для работы с отделами и проектами
 */
class DepartmentService {
  private departments: Department[] = [...mockDepartments];

  /**
   * Имитация задержки сети
   * @param ms Время задержки в миллисекундах
   */
  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  /**
   * Получение всех отделов и проектов
   */
  async getDepartments(): Promise<Department[]> {
    await this.delay(500); // Имитация задержки сети
    return [...this.departments];
  }

  /**
   * Получение отделов и проектов с количеством сотрудников
   */
  async getDepartmentsWithEmployeeCount(): Promise<DepartmentWithEmployeeCount[]> {
    await this.delay(500); // Имитация задержки сети
    
    return this.departments.map(department => ({
      ...department,
      employeeCount: department.employeeIds.length
    }));
  }

  /**
   * Получение отдела или проекта по ID
   * @param id ID отдела или проекта
   */
  async getDepartmentById(id: string): Promise<Department | null> {
    await this.delay(300);
    const department = this.departments.find(d => d.id === id);
    return department ? { ...department } : null;
  }

  /**
   * Получение сотрудников отдела или проекта
   * @param id ID отдела или проекта
   */
  async getDepartmentEmployees(id: string): Promise<Employee[]> {
    await this.delay(600);
    
    const department = await this.getDepartmentById(id);
    if (!department) {
      throw new Error(`Отдел или проект с ID ${id} не найден`);
    }
    
    // Получаем всех сотрудников
    const allEmployees = await employeeService.getEmployees();
    
    // Фильтруем только тех, кто работает в данном отделе/проекте
    return allEmployees.filter(employee => department.employeeIds.includes(employee.id));
  }

  /**
   * Создание нового отдела или проекта
   * @param data Данные отдела или проекта
   */
  async createDepartment(data: DepartmentFormData): Promise<Department> {
    await this.delay(800);
    
    const newDepartment: Department = {
      id: uuidv4(),
      ...data,
      employeeIds: data.employeeIds || [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    this.departments.push(newDepartment);
    return { ...newDepartment };
  }

  /**
   * Обновление существующего отдела или проекта
   * @param id ID отдела или проекта
   * @param data Данные для обновления
   */
  async updateDepartment(id: string, data: Partial<DepartmentFormData>): Promise<Department> {
    await this.delay(600);
    
    const index = this.departments.findIndex(d => d.id === id);
    if (index === -1) {
      throw new Error(`Отдел или проект с ID ${id} не найден`);
    }
    
    const updatedDepartment: Department = {
      ...this.departments[index],
      ...data,
      updatedAt: new Date().toISOString(),
      // Если employeeIds не указаны в data, используем текущие значения
      employeeIds: data.employeeIds || this.departments[index].employeeIds
    };
    
    this.departments[index] = updatedDepartment;
    return { ...updatedDepartment };
  }

  /**
   * Добавление сотрудника в отдел или проект
   * @param departmentId ID отдела или проекта
   * @param employeeId ID сотрудника
   */
  async addEmployeeToDepartment(departmentId: string, employeeId: string): Promise<Department> {
    await this.delay(400);
    
    const department = await this.getDepartmentById(departmentId);
    if (!department) {
      throw new Error(`Отдел или проект с ID ${departmentId} не найден`);
    }
    
    // Проверяем, есть ли уже сотрудник в отделе
    if (department.employeeIds.includes(employeeId)) {
      return department;
    }
    
    // Добавляем сотрудника
    const updatedEmployeeIds = [...department.employeeIds, employeeId];
    return this.updateDepartment(departmentId, { employeeIds: updatedEmployeeIds });
  }

  /**
   * Удаление сотрудника из отдела или проекта
   * @param departmentId ID отдела или проекта
   * @param employeeId ID сотрудника
   */
  async removeEmployeeFromDepartment(departmentId: string, employeeId: string): Promise<Department> {
    await this.delay(400);
    
    const department = await this.getDepartmentById(departmentId);
    if (!department) {
      throw new Error(`Отдел или проект с ID ${departmentId} не найден`);
    }
    
    // Удаляем сотрудника
    const updatedEmployeeIds = department.employeeIds.filter(id => id !== employeeId);
    return this.updateDepartment(departmentId, { employeeIds: updatedEmployeeIds });
  }

  /**
   * Удаление отдела или проекта
   * @param id ID отдела или проекта
   */
  async deleteDepartment(id: string): Promise<void> {
    await this.delay(500);
    
    const index = this.departments.findIndex(d => d.id === id);
    if (index === -1) {
      throw new Error(`Отдел или проект с ID ${id} не найден`);
    }
    
    this.departments.splice(index, 1);
  }

  /**
   * Поиск отделов и проектов
   * @param query Строка поиска
   */
  async searchDepartments(query: string): Promise<Department[]> {
    await this.delay(600);
    
    const searchTerms = query.toLowerCase().split(' ').filter(term => term.length > 0);
    
    if (searchTerms.length === 0) {
      return [...this.departments];
    }
    
    return this.departments.filter(department => {
      return searchTerms.some(term => {
        return (
          department.name.toLowerCase().includes(term) ||
          department.description.toLowerCase().includes(term) ||
          (department.client && department.client.toLowerCase().includes(term))
        );
      });
    });
  }

  /**
   * Фильтрация отделов и проектов
   * @param filters Объект с фильтрами
   */
  async filterDepartments(filters: {
    type?: DepartmentType,
    client?: string
  }): Promise<Department[]> {
    await this.delay(400);
    
    return this.departments.filter(department => {
      const matchesType = !filters.type || department.type === filters.type;
      
      const matchesClient = !filters.client || 
        (department.client && department.client.toLowerCase().includes(filters.client.toLowerCase()));
      
      return matchesType && matchesClient;
    });
  }
}

export const departmentService = new DepartmentService(); 