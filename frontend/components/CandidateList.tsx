import React, { useState } from 'react';
import { type Candidate, type CandidateFormData } from '@/services/candidateService';
import CandidateForm from './CandidateForm';
import InterviewForm from './interviews/InterviewForm';

interface CandidateListProps {
    candidates: Candidate[];
    onUpdate: (id: string, data: CandidateFormData) => Promise<boolean>;
    onDelete: (id: string) => Promise<boolean>;
}

const STATUS_MAP = {
    'new': 'Новый',
    'screening': 'Скрининг',
    'interviewing': 'Интервью',
    'test_task': 'Тестовое задание',
    'offered': 'Оффер',
    'rejected': 'Отказ',
    'hired': 'Принят',
    'archived': 'Архив'
} as const;

const STATUS_COLORS = {
    'new': 'primary',
    'screening': 'info',
    'interviewing': 'warning',
    'test_task': 'secondary',
    'offered': 'success',
    'rejected': 'danger',
    'hired': 'success',
    'archived': 'dark'
} as const;

export default function CandidateList({ candidates, onUpdate, onDelete }: CandidateListProps) {
    const [editingCandidate, setEditingCandidate] = useState<Candidate | null>(null);
    const [viewingInterview, setViewingInterview] = useState<Candidate | null>(null);

    if (candidates.length === 0) {
        return (
            <div className="alert alert-info">
                Список кандидатов пуст
            </div>
        );
    }

    const handleEdit = (candidate: Candidate) => {
        setEditingCandidate(candidate);
    };

    const handleUpdate = async (data: CandidateFormData) => {
        if (!editingCandidate) return false;
        const success = await onUpdate(editingCandidate.id, data);
        if (success) {
            setEditingCandidate(null);
        }
        return success;
    };

    const formatSalary = (min?: number, max?: number, currency = 'USD') => {
        if (!min && !max) return '-';
        if (min && !max) return `от ${min} ${currency}`;
        if (!min && max) return `до ${max} ${currency}`;
        return `${min} - ${max} ${currency}`;
    };

    const formatDate = (date?: string) => {
        if (!date) return '-';
        return new Date(date).toLocaleDateString('ru-RU', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    if (editingCandidate) {
        return (
            <div>
                <div className="d-flex justify-content-between align-items-center mb-3">
                    <h3>Редактирование кандидата</h3>
                    <button 
                        className="btn btn-secondary"
                        onClick={() => setEditingCandidate(null)}
                    >
                        Вернуться к списку
                    </button>
                </div>
                <CandidateForm 
                    onSave={handleUpdate}
                    initialData={editingCandidate}
                />
            </div>
        );
    }

    if (viewingInterview) {
        return (
            <InterviewForm
                onSubmit={async (data) => {
                    // TODO: Implement interview submission
                    setViewingInterview(null);
                    return Promise.resolve();
                }}
                onCancel={() => setViewingInterview(null)}
            />
        );
    }

    return (
        <div className="table-responsive" style={{ maxWidth: '100%', overflowX: 'auto' }}>
            <table className="table table-striped" style={{ minWidth: '1500px' }}>
                <thead>
                    <tr>
                        <th>ФИО (рус)</th>
                        <th>ФИО (англ)</th>
                        <th>Вакансия</th>
                        <th>Стек</th>
                        <th>Статус</th>
                        <th>Дата скрининга</th>
                        <th>Рекрутер</th>
                        <th>Город/Страна</th>
                        <th>Англ.</th>
                        <th>Зарплата</th>
                        <th>Контакты</th>
                        <th>Резюме</th>
                        <th>Интервью</th>
                        <th>Действия</th>
                    </tr>
                </thead>
                <tbody>
                    {candidates.map((candidate) => (
                        <tr key={candidate.id}>
                            <td>{candidate.nameRu}</td>
                            <td>{candidate.nameEn}</td>
                            <td>{candidate.vacancy}</td>
                            <td>{candidate.techStack || '-'}</td>
                            <td>
                                <span className={`badge bg-${STATUS_COLORS[candidate.status as keyof typeof STATUS_COLORS] || 'secondary'}`}>
                                    {STATUS_MAP[candidate.status as keyof typeof STATUS_MAP] || candidate.status}
                                </span>
                                {candidate.statusComment && (
                                    <div className="small text-muted mt-1">
                                        {candidate.statusComment}
                                    </div>
                                )}
                            </td>
                            <td>{formatDate(candidate.screeningDate)}</td>
                            <td>{candidate.recruiter || '-'}</td>
                            <td>{candidate.locationCityCountry || '-'}</td>
                            <td>{candidate.englishLevel || '-'}</td>
                            <td>{formatSalary(candidate.minSalary, candidate.maxSalary, candidate.salaryCurrency)}</td>
                            <td>
                                <div className="small">
                                    <div>{candidate.email}</div>
                                    {candidate.phone && <div>{candidate.phone}</div>}
                                    {candidate.telegram && <div>TG: {candidate.telegram}</div>}
                                    {candidate.skype && <div>Skype: {candidate.skype}</div>}
                                </div>
                            </td>
                            <td>
                                {candidate.resumeFileUrl ? (
                                    <a 
                                        href={candidate.resumeFileUrl}
                                        download={candidate.resumeFileName || true}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="btn btn-sm btn-outline-secondary"
                                    >
                                        {candidate.resumeFileName || 'Скачать резюме'}
                                    </a>
                                ) : '-'}
                            </td>
                            <td>
                                <button 
                                    className="btn btn-sm btn-outline-primary"
                                    onClick={() => setViewingInterview(candidate)}
                                >
                                    {candidate.interviewFile ? 'Открыть интервью' : 'Создать интервью'}
                                </button>
                            </td>
                            <td>
                                <div className="btn-group">
                                    <button
                                        className="btn btn-sm btn-outline-primary"
                                        onClick={() => handleEdit(candidate)}
                                    >
                                        Изменить
                                    </button>
                                    <button
                                        className="btn btn-sm btn-outline-danger"
                                        onClick={() => onDelete(candidate.id)}
                                    >
                                        Удалить
                                    </button>
                                </div>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
} 