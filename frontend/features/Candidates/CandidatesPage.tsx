// CandidatesPage.tsx
import React, { useState } from 'react';
import { 
  MagnifyingGlassIcon, 
  FunnelIcon, 
  PlusIcon,
  ChevronDownIcon
} from '@heroicons/react/24/outline';
import DynamicClientOnlyDateTime from '@/components/shared/DynamicClientOnlyDateTime';

// Mock data
const candidates = [
  { 
    id: '1', 
    name: 'Алексей Иванов', 
    position: 'Senior React Developer', 
    status: 'Техническое интервью', 
    lastContact: '2023-06-10T14:30:00Z',
    email: 'alexey@example.com',
    phone: '+7 (999) 123-45-67',
    source: 'LinkedIn'
  },
  { 
    id: '2', 
    name: 'Мария Петрова', 
    position: 'UX/UI Designer', 
    status: 'Оффер', 
    lastContact: '2023-06-12T11:15:00Z',
    email: 'maria@example.com',
    phone: '+7 (999) 987-65-43',
    source: 'Рекомендация'
  },
  { 
    id: '3', 
    name: 'Дмитрий Сидоров', 
    position: 'DevOps Engineer', 
    status: 'Первичный скрининг', 
    lastContact: '2023-06-14T09:45:00Z',
    email: 'dmitry@example.com',
    phone: '+7 (999) 456-78-90',
    source: 'HeadHunter'
  },
  { 
    id: '4', 
    name: 'Елена Козлова', 
    position: 'QA Engineer', 
    status: 'HR интервью', 
    lastContact: '2023-06-13T16:20:00Z',
    email: 'elena@example.com',
    phone: '+7 (999) 234-56-78',
    source: 'Habr Career'
  },
  { 
    id: '5', 
    name: 'Сергей Новиков', 
    position: 'Backend Developer', 
    status: 'Тестовое задание', 
    lastContact: '2023-06-11T13:10:00Z',
    email: 'sergey@example.com',
    phone: '+7 (999) 345-67-89',
    source: 'LinkedIn'
  },
];

const statusColors: Record<string, string> = {
  'Первичный скрининг': 'bg-gray-100 text-gray-800',
  'HR интервью': 'bg-blue-100 text-blue-800',
  'Техническое интервью': 'bg-purple-100 text-purple-800',
  'Тестовое задание': 'bg-yellow-100 text-yellow-800',
  'Оффер': 'bg-green-100 text-green-800',
  'Отказ': 'bg-red-100 text-red-800',
};

export default function CandidatesPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  
  const filteredCandidates = candidates.filter(candidate => 
    candidate.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    candidate.position.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="notion-page">
      <div className="flex justify-between items-center mb-8">
        <h1>Кандидаты</h1>
        <button className="notion-button-primary flex items-center">
          <PlusIcon className="h-4 w-4 mr-2" />
          Добавить кандидата
        </button>
      </div>
      
      <div className="mb-6 flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input
            type="text"
            placeholder="Поиск кандидатов..."
            className="notion-input pl-10"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        
        <button 
          className="notion-button flex items-center"
          onClick={() => setShowFilters(!showFilters)}
        >
          <FunnelIcon className="h-4 w-4 mr-2" />
          Фильтры
          <ChevronDownIcon className="h-4 w-4 ml-2" />
        </button>
      </div>
      
      {showFilters && (
        <div className="mb-6 p-4 border rounded-lg bg-white">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Статус</label>
              <select className="notion-select">
                <option value="">Все статусы</option>
                <option>Первичный скрининг</option>
                <option>HR интервью</option>
                <option>Техническое интервью</option>
                <option>Тестовое задание</option>
                <option>Оффер</option>
                <option>Отказ</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1">Позиция</label>
              <select className="notion-select">
                <option value="">Все позиции</option>
                <option>Frontend Developer</option>
                <option>Backend Developer</option>
                <option>UX/UI Designer</option>
                <option>QA Engineer</option>
                <option>DevOps Engineer</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1">Источник</label>
              <select className="notion-select">
                <option value="">Все источники</option>
                <option>LinkedIn</option>
                <option>HeadHunter</option>
                <option>Habr Career</option>
                <option>Рекомендация</option>
              </select>
            </div>
          </div>
          
          <div className="flex justify-end mt-4">
            <button className="notion-button mr-2">Сбросить</button>
            <button className="notion-button-primary">Применить</button>
          </div>
        </div>
      )}
      
      <div className="notion-table-wrapper">
        <table className="notion-table">
          <thead>
            <tr>
              <th>Имя</th>
              <th>Позиция</th>
              <th>Статус</th>
              <th>Email</th>
              <th>Телефон</th>
              <th>Источник</th>
              <th>Последний контакт</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {filteredCandidates.map((candidate) => (
              <tr key={candidate.id}>
                <td className="font-medium">{candidate.name}</td>
                <td>{candidate.position}</td>
                <td>
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusColors[candidate.status]}`}>
                    {candidate.status}
                  </span>
                </td>
                <td>{candidate.email}</td>
                <td>{candidate.phone}</td>
                <td>{candidate.source}</td>
                <td className="px-4 py-3 text-sm">
                  <DynamicClientOnlyDateTime date={candidate.lastContact} format="short" />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      {filteredCandidates.length === 0 && (
        <div className="text-center py-8">
          <p className="text-gray-500">Кандидаты не найдены</p>
        </div>
      )}
    </div>
  );
}
