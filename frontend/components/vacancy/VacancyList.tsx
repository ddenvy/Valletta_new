'use client';

import React, { useState, useMemo } from 'react';
import { Vacancy, VacancyStatus, Client } from '@/types/vacancy';
import { PencilIcon, TrashIcon, XCircleIcon, CheckCircleIcon, PlusIcon } from '@heroicons/react/24/outline';

interface VacancyListProps {
  vacancies: Vacancy[];
  onUpdate: (id: string, status: 'active' | 'closed') => void;
  onDelete: (id: string) => void;
  onEdit: (vacancy: Vacancy) => void;
}

const DEFAULT_CLIENTS: Client[] = ['GlobalBit', 'Acterys', 'SQLDBM', 'Andersen'];

export default function VacancyList({
  vacancies,
  onUpdate,
  onDelete,
  onEdit
}: VacancyListProps) {
  const [clients, setClients] = useState<Client[]>(DEFAULT_CLIENTS);
  const [newClient, setNewClient] = useState('');
  const [showAddClient, setShowAddClient] = useState(false);

  // Группируем вакансии по клиентам
  const vacanciesByClient = useMemo(() => {
    return vacancies.reduce((acc, vacancy) => {
      const clientId = vacancy.client || 'Без клиента';
      if (!acc[clientId]) {
        acc[clientId] = [];
      }
      acc[clientId].push(vacancy);
      return acc;
    }, {} as Record<string, Vacancy[]>);
  }, [vacancies]);

  const handleAddClient = (e: React.FormEvent) => {
    e.preventDefault();
    if (newClient.trim() && !clients.includes(newClient.trim() as Client)) {
      setClients([...clients, newClient.trim() as Client]);
      setNewClient('');
      setShowAddClient(false);
    }
  };

  return (
    <div className="kanban-board">
      {Object.entries(vacanciesByClient).map(([clientId, clientVacancies]) => (
        <div key={clientId} className="kanban-column">
          <div className="kanban-column-title">
            {clientId}
          </div>
          <div className="kanban-column-content">
            {clientVacancies.map((vacancy) => (
              <div key={vacancy.id} className="vacancy-card">
                <div className="vacancy-header">
                  <h4>{vacancy.title}</h4>
                  <span className={`status-badge ${vacancy.status === 'active' ? 'active' : 'closed'}`}>
                    {vacancy.status === 'active' ? 'Активная' : 'Закрыта'}
                  </span>
                </div>
                <div className="vacancy-details">
                  <p><strong>Отдел:</strong> {vacancy.department}</p>
                  <p><strong>Уровень:</strong> {vacancy.level}</p>
                  <p><strong>Локация:</strong> {vacancy.location}</p>
                  <p><strong>Тип:</strong> {vacancy.employmentType}</p>
                  <p><strong>Зарплата:</strong> {vacancy.salaryRangeMin} - {vacancy.salaryRangeMax} {vacancy.currency}</p>
                </div>
                <div className="vacancy-actions">
                  <button
                    className="btn btn-sm btn-primary"
                    onClick={() => onEdit(vacancy)}
                    title="Редактировать"
                  >
                    <PencilIcon className="h-5 w-5" />
                  </button>
                  <button
                    className={`btn btn-sm ${vacancy.status === 'active' ? 'btn-warning' : 'btn-success'}`}
                    onClick={() => onUpdate(vacancy.id, vacancy.status === 'active' ? 'closed' : 'active')}
                    title={vacancy.status === 'active' ? 'Закрыть' : 'Активировать'}
                  >
                    {vacancy.status === 'active' ? (
                      <XCircleIcon className="h-5 w-5" />
                    ) : (
                      <CheckCircleIcon className="h-5 w-5" />
                    )}
                  </button>
                  <button
                    className="btn btn-sm btn-danger"
                    onClick={() => onDelete(vacancy.id)}
                    title="Удалить"
                  >
                    <TrashIcon className="h-5 w-5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
      
      <div className="kanban-column">
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h3 className="kanban-column-title mb-0">Добавить клиента</h3>
          <button
            className="btn btn-sm btn-outline-primary"
            onClick={() => setShowAddClient(!showAddClient)}
          >
            <PlusIcon className="h-5 w-5" />
          </button>
        </div>
        {showAddClient && (
          <form onSubmit={handleAddClient} className="mt-3">
            <div className="input-group">
              <input
                type="text"
                className="form-control"
                placeholder="Название клиента"
                value={newClient}
                onChange={(e) => setNewClient(e.target.value)}
              />
              <button type="submit" className="btn btn-primary">
                Добавить
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
} 